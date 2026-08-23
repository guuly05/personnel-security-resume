import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BLOG_POSTS } from '../src/blog/posts.ts';
import { SITE_URL } from '../src/seo/metadata.ts';

const projectRoot = process.cwd();
const today = new Date().toISOString().slice(0, 10);
const staticRoutes = ['/', '/about', '/skills', '/experience', '/certificates', '/portfolio', '/book', '/blog', '/contact'];

function xml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

const urls = [
  ...staticRoutes.map((path, index) => ({ path, lastmod: today, priority: index === 0 ? '1.0' : '0.7' })),
  ...BLOG_POSTS.map((post) => ({ path: `/blog/${post.slug}`, lastmod: new Date(`${post.date} 12:00:00 UTC`).toISOString().slice(0, 10), priority: '0.8' })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map(({ path, lastmod, priority }) => `  <url>\n    <loc>${xml(`${SITE_URL}${path}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`)
  .join('\n')}\n</urlset>\n`;

mkdirSync(join(projectRoot, 'public'), { recursive: true });
writeFileSync(join(projectRoot, 'public', 'sitemap.xml'), sitemap, 'utf8');
console.log(`Generated sitemap with ${urls.length} canonical URLs.`);
