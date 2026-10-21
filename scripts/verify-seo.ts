import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BLOG_POSTS } from '../src/blog/posts.ts';
import { LATEST_POST } from '../src/blog/latestPost.ts';
import { SITE_URL } from '../src/seo/metadata.ts';

const root = join(process.cwd(), 'dist');
const routes = ['/', '/about', '/skills', '/experience', '/certificates', '/portfolio', '/systems', '/book', '/blog', '/contact', ...BLOG_POSTS.map((post) => `/blog/${post.slug}`)];
const failures: string[] = [];

function fileForRoute(route: string) {
  return route === '/' ? join(root, 'index.html') : join(root, route.slice(1), 'index.html');
}

function value(html: string, pattern: RegExp) {
  return html.match(pattern)?.[1] ?? '';
}

function visibleText(value: string) {
  const decode = (text: string) => text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#0*39;|&#x0*27;/gi, "'");

  let text = value;
  let previous: string;
  do {
    previous = text;
    text = decode(text).replace(/<[^>]+>/g, '');
  } while (text !== previous);

  return text;
}

for (const route of routes) {
  const file = fileForRoute(route);
  if (!existsSync(file)) { failures.push(`${route}: missing prerendered HTML`); continue; }
  const html = readFileSync(file, 'utf8');
  const title = value(html, /<title>([^<]+)<\/title>/i);
  const description = value(html, /<meta name="description" content="([^"]+)"/i);
  const canonical = value(html, /<link rel="canonical" href="([^"]+)"/i);
  const robots = value(html, /<meta name="robots" content="([^"]+)"/i);
  const ogUrl = value(html, /<meta property="og:url" content="([^"]+)"/i);
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const jsonLdCount = (html.match(/application\/ld\+json/gi) ?? []).length;
  if (!title || !description || !canonical || !robots || !ogUrl || h1Count !== 1 || jsonLdCount !== 1) {
    failures.push(`${route}: incomplete metadata/content (title=${Boolean(title)}, description=${Boolean(description)}, canonical=${Boolean(canonical)}, robots=${Boolean(robots)}, og=${Boolean(ogUrl)}, h1=${h1Count}, jsonld=${jsonLdCount})`);
  }
  if (canonical !== `${SITE_URL}${route}` || ogUrl !== canonical) failures.push(`${route}: canonical/og URL mismatch`);
  if ((html.match(/rel="canonical"/gi) ?? []).length !== 1) failures.push(`${route}: duplicate canonical`);
  if (html.replace(/<[^>]+>/g, ' ').trim().length < 250) failures.push(`${route}: insufficient initial body content`);

  const post = BLOG_POSTS.find((entry) => route === `/blog/${entry.slug}`);
  if (post) {
    const h1 = visibleText(value(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i));
    if (h1 !== post.title) failures.push(`${route}: prerendered heading does not match the post title`);
  }
}

const notFound = readFileSync(join(root, '404.html'), 'utf8');
if (!existsSync(join(root, '404.html')) || !/noindex, follow/.test(notFound) || !/<h1\b/i.test(notFound)) failures.push('404: missing noindex page or H1');
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
if (!sitemap.includes(`<loc>${SITE_URL}/</loc>`) || sitemap.includes('/404') || sitemap.includes('/recap')) failures.push('sitemap: invalid coverage');

const rssPath = join(root, 'rss.xml');
const atomPath = join(root, 'atom.xml');
const rss = existsSync(rssPath) ? readFileSync(rssPath, 'utf8') : '';
const atom = existsSync(atomPath) ? readFileSync(atomPath, 'utf8') : '';
if (!rss) failures.push('RSS: generated feed is missing');
if (!atom) failures.push('Atom: generated feed is missing');
for (const post of BLOG_POSTS) {
  const articleUrl = `${SITE_URL}/blog/${post.slug}`;
  if (!sitemap.includes(`<loc>${articleUrl}</loc>`)) failures.push(`${post.slug}: missing from sitemap`);
  if (!rss.includes(`<guid isPermaLink="true">${articleUrl}</guid>`)) failures.push(`${post.slug}: missing from RSS feed`);
  if (!atom.includes(`<id>${articleUrl}</id>`)) failures.push(`${post.slug}: missing from Atom feed`);
}

const newestPost = BLOG_POSTS[0];
if (!newestPost || LATEST_POST.slug !== newestPost.slug || LATEST_POST.title !== newestPost.title || LATEST_POST.date !== newestPost.date) {
  failures.push('featured note: homepage summary does not match the newest blog post');
}
if (!existsSync(join(root, 'assets', 'og-preview.png'))) failures.push('OG image: missing homepage preview asset');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`SEO and blog publishing audit passed for ${routes.length} indexable routes, all feeds, and 404.html.`);
