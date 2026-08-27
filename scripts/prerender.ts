import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { BLOG_POSTS } from '../src/blog/posts.ts';
import { metadataForRoute, SITE_URL, FULL_NAME } from '../src/seo/metadata.ts';
import { StaticRoute } from '../src/ssr/StaticRoute.tsx';
import { CASE_STUDIES } from '../src/pages/Portfolio.tsx';

const projectRoot = process.cwd();
const distRoot = join(projectRoot, 'dist');
const template = readFileSync(join(distRoot, 'index.html'), 'utf8');

const routes = [
  '/', '/about', '/skills', '/experience', '/certificates', '/portfolio', '/book', '/blog', '/contact', '/recap',
  ...CASE_STUDIES.map((study) => `/portfolio/${study.id}`),
  ...BLOG_POSTS.map((post) => `/blog/${post.slug}`),
];

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function headForRoute(pathname: string) {
  const post = BLOG_POSTS.find((entry) => pathname === `/blog/${entry.slug}`);
  const meta = metadataForRoute(pathname, post);
  const jsonLd = JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c');
  return `
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <meta name="author" content="${FULL_NAME}" />
    <link rel="canonical" href="${SITE_URL}${meta.canonicalPath}" />
    <meta name="robots" content="${meta.robots}" />
    <meta property="og:type" content="${meta.ogType}" />
    <meta property="og:url" content="${SITE_URL}${meta.canonicalPath}" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:image" content="${meta.ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="${escapeHtml(meta.title)}" />
    <meta property="og:site_name" content="${FULL_NAME} Portfolio" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    <meta name="twitter:image" content="${meta.ogImage}" />
    <meta name="twitter:image:alt" content="${escapeHtml(meta.title)}" />
    ${meta.article ? `<meta property="article:author" content="${FULL_NAME}" /><meta property="article:published_time" content="${meta.article.publishedTime}" />${meta.article.modifiedTime ? `<meta property="article:modified_time" content="${meta.article.modifiedTime}" />` : ''}` : ''}
    <link rel="alternate" type="application/rss+xml" title="${FULL_NAME} — RSS" href="${SITE_URL}/rss.xml" />
    <link rel="alternate" type="application/atom+xml" title="${FULL_NAME} — Atom" href="${SITE_URL}/atom.xml" />
    <script type="application/ld+json">${jsonLd}</script>`;
}

function renderRoute(pathname: string) {
  const currentHead = template.match(/<head>[\s\S]*?<\/head>/i)?.[0] ?? '<head></head>';
  const preservedHead = currentHead
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<meta\s+name="keywords"[^>]*>/gi, '')
    .replace(/<meta\s+name="author"[^>]*>/gi, '')
    .replace(/<meta\s+name="robots"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^"]+"[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]+"[^>]*>/gi, '')
    .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
  const head = preservedHead.replace(/<head>/i, `<head>${headForRoute(pathname)}`);
  const body = renderToStaticMarkup(React.createElement(StaticRoute, { pathname }));
  return template.replace(currentHead, head).replace(/<div id="root"><\/div>/, `<div id="root">${body}</div>`);
}

for (const route of routes) {
  const html = renderRoute(route);
  const outputPaths = route === '/'
    ? [join(distRoot, 'index.html')]
    : [join(distRoot, route.slice(1), 'index.html'), join(distRoot, `${route.slice(1)}.html`)];
  for (const outputPath of outputPaths) {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, html, 'utf8');
  }
}

const notFoundPath = join(distRoot, '404.html');
writeFileSync(notFoundPath, renderRoute('/404'), 'utf8');
console.log(`Prerendered ${routes.length} routes plus 404.html.`);
