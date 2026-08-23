import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BLOG_POSTS } from '../src/blog/posts.ts';
import { SITE_URL } from '../src/seo/metadata.ts';

const root = join(process.cwd(), 'dist');
const routes = ['/', '/about', '/skills', '/experience', '/certificates', '/portfolio', '/book', '/blog', '/contact', ...BLOG_POSTS.map((post) => `/blog/${post.slug}`)];
const failures: string[] = [];

function fileForRoute(route: string) {
  return route === '/' ? join(root, 'index.html') : join(root, route.slice(1), 'index.html');
}

function value(html: string, pattern: RegExp) {
  return html.match(pattern)?.[1] ?? '';
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
}

const notFound = readFileSync(join(root, '404.html'), 'utf8');
if (!existsSync(join(root, '404.html')) || !/noindex, follow/.test(notFound) || !/<h1\b/i.test(notFound)) failures.push('404: missing noindex page or H1');
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
if (!sitemap.includes(`<loc>${SITE_URL}/</loc>`) || !sitemap.includes(`${SITE_URL}/blog/${BLOG_POSTS[0].slug}`) || sitemap.includes('/404') || sitemap.includes('/recap')) failures.push('sitemap: invalid coverage');
if (!existsSync(join(root, 'assets', 'og-preview.png'))) failures.push('OG image: missing homepage preview asset');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`SEO route audit passed for ${routes.length} indexable routes, 404.html, and sitemap.xml.`);

