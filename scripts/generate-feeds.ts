import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BLOG_POSTS, formatBlogDate } from '../src/blog/posts.ts';
import { FULL_NAME, SITE_URL } from '../src/seo/metadata.ts';

const projectRoot = process.cwd();
const publicRoot = join(projectRoot, 'public');

function xml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function cdata(value: string) {
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

function isoDate(value: string) {
  return new Date(`${value}T12:00:00Z`).toISOString();
}

function feedSummary(post: (typeof BLOG_POSTS)[number]) {
  const tags = post.tags.join(' · ');
  return `${post.subtitle}\n\nTags: ${tags}\nLast updated: ${formatBlogDate(post.lastUpdated)}`;
}

const latestUpdated = BLOG_POSTS.reduce((latest, post) => Math.max(latest, Date.parse(post.lastUpdated)), 0);

const rssItems = BLOG_POSTS.map((post) => {
  const link = `${SITE_URL}/blog/${post.slug}`;
  return `    <item>\n      <title>${xml(post.title)}</title>\n      <link>${xml(link)}</link>\n      <guid isPermaLink="true">${xml(link)}</guid>\n      <pubDate>${isoDate(post.date)}</pubDate>\n      <description>${cdata(feedSummary(post))}</description>\n      ${post.tags.map((tag) => `<category>${xml(tag)}</category>`).join('\n      ')}\n    </item>`;
}).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${xml(FULL_NAME)} — Cybersecurity Blog</title>\n    <link>${SITE_URL}/blog</link>\n    <description>Security research, vulnerability analysis, and technical writing by ${xml(FULL_NAME)}.</description>\n    <language>en-us</language>\n    <lastBuildDate>${isoDate(new Date(latestUpdated).toISOString().slice(0, 10))}</lastBuildDate>\n    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />\n${rssItems}\n  </channel>\n</rss>\n`;

const atomEntries = BLOG_POSTS.map((post) => {
  const link = `${SITE_URL}/blog/${post.slug}`;
  return `  <entry>\n    <title>${xml(post.title)}</title>\n    <link href="${xml(link)}" />\n    <id>${xml(link)}</id>\n    <published>${isoDate(post.date)}</published>\n    <updated>${isoDate(post.lastUpdated)}</updated>\n    <summary type="html">${cdata(feedSummary(post))}</summary>\n    <category term="${xml(post.tags[0] ?? 'Cybersecurity')}" />\n  </entry>`;
}).join('\n');

const atom = `<?xml version="1.0" encoding="UTF-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">\n  <title>${xml(FULL_NAME)} — Cybersecurity Blog</title>\n  <subtitle>Security research, vulnerability analysis, and technical writing.</subtitle>\n  <link href="${SITE_URL}/blog" />\n  <link rel="self" href="${SITE_URL}/atom.xml" type="application/atom+xml" />\n  <id>${SITE_URL}/blog</id>\n  <updated>${isoDate(new Date(latestUpdated).toISOString().slice(0, 10))}</updated>\n  <author><name>${xml(FULL_NAME)}</name></author>\n${atomEntries}\n</feed>\n`;

mkdirSync(publicRoot, { recursive: true });
writeFileSync(join(publicRoot, 'rss.xml'), rss, 'utf8');
writeFileSync(join(publicRoot, 'atom.xml'), atom, 'utf8');
console.log(`Generated RSS and Atom feeds with ${BLOG_POSTS.length} entries.`);
