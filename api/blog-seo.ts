import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { BLOG_POSTS } from '../src/blog/posts.js';
import { SITE_URL, FULL_NAME, PUBLISHER_LOGO } from '../src/seo/metadata.js';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function replaceMeta(html: string, post: any, slug: string): string {
  const postTitle = `${post.title} | ${FULL_NAME}`;
  const postDesc = post.subtitle;
  const postUrl = `${SITE_URL}/blog/${slug}`;
  const postOgImage = `${SITE_URL}/blog/${slug}/og.png`;
  const postDateIso = new Date(post.date).toISOString();
  const postModifiedIso = new Date(post.lastUpdated).toISOString();

  // Replace Title
  html = html.replace(/<title>[^<]*<\/title>/g, `<title>${escapeHtml(postTitle)}</title>`);

  // Replace Description
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/g, `<meta name="description" content="${escapeHtml(postDesc)}" />`);

  // Replace Open Graph Tags
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/g, `<meta property="og:title" content="${escapeHtml(postTitle)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/g, `<meta property="og:description" content="${escapeHtml(postDesc)}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/g, `<meta property="og:url" content="${escapeHtml(postUrl)}" />`);
  html = html.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/g, `<meta property="og:image" content="${escapeHtml(postOgImage)}" />`);
  html = html.replace(/<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/g, `<meta property="og:type" content="article" />`);

  // Replace Twitter Tags
  html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/g, `<meta name="twitter:title" content="${escapeHtml(postTitle)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/g, `<meta name="twitter:description" content="${escapeHtml(postDesc)}" />`);
  html = html.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/g, `<meta name="twitter:image" content="${escapeHtml(postOgImage)}" />`);

  // Replace Canonical Link
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/g, `<link rel="canonical" href="${escapeHtml(postUrl)}" />`);

  // Inject additional tags (article author, date) right after <head>
  const extraTags = `
    <meta property="article:author" content="${escapeHtml(FULL_NAME)}" />
    <meta property="article:published_time" content="${postDateIso}" />
    <meta property="article:modified_time" content="${postModifiedIso}" />
  `;
  html = html.replace('<head>', `<head>${extraTags}`);

  // Replace structured data schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: FULL_NAME,
    alternateName: 'Guuleed Maxamuud',
    url: SITE_URL,
    email: 'guuleedmaxamuud40@gmail.com',
    jobTitle: 'Vulnerability Assessment & Penetration Tester',
    description:
      'Cybersecurity professional specialising in penetration testing, vulnerability assessment, ethical hacking, and network security.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hargeisa',
      addressRegion: 'Somaliland',
    },
    sameAs: [
      'https://linkedin.com/in/guuleed-aw-abdi-517928277',
      'https://github.com/guuly05',
    ],
    knowsAbout: [
      'Penetration Testing',
      'Vulnerability Assessment',
      'Ethical Hacking',
      'Network Security',
      'Burp Suite',
      'Nessus',
      'Nmap',
      'Linux Hardening',
      'Python Automation',
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.subtitle,
    image: postOgImage,
    author: {
      '@type': 'Person',
      name: FULL_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: FULL_NAME,
      logo: {
        '@type': 'ImageObject',
        url: PUBLISHER_LOGO,
      },
    },
    datePublished: postDateIso,
    dateModified: postModifiedIso,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    url: postUrl,
  };

  // Find the JSON-LD script and replace it
  const jsonLdRegex = /<script\s+type="application\/ld\+json"\s*>([\s\S]*?)<\/script>/i;
  const combinedSchema = articleSchema;
  html = html.replace(jsonLdRegex, `<script type="application/ld+json">${JSON.stringify(combinedSchema)}</script>`);

  return html;
}

export default async function handler(req: any, res: any) {
  const slug = req.query.slug || '';
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return res.status(404).send('Blog post not found');
  }

  const prerenderedPath = join(process.cwd(), 'dist', 'blog', slug, 'index.html');
  if (existsSync(prerenderedPath)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(readFileSync(prerenderedPath, 'utf8'));
  }

  let htmlPath = join(process.cwd(), 'dist', 'index.html');
  if (!existsSync(htmlPath)) {
    htmlPath = join(process.cwd(), 'index.html');
  }

  try {
    let html = readFileSync(htmlPath, 'utf8');
    html = replaceMeta(html, post, slug);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Error injecting blog SEO:', error);
    return res.status(500).send('Internal Server Error');
  }
}
