import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS } from '../blog/posts.ts';
import { metadataForSection, metadataForRoute, SITE_URL } from '../seo/metadata.ts';

interface SeoHeadProps {
  section?: string;
}

export function SeoHead({ section = 'home' }: SeoHeadProps) {
  const pathname = typeof window === 'undefined' ? undefined : window.location.pathname;
  const post = pathname?.startsWith('/blog/') ? BLOG_POSTS.find((entry) => pathname === `/blog/${entry.slug}`) : undefined;
  const meta = pathname ? metadataForRoute(pathname, post) : metadataForSection(section);
  const canonicalUrl = `${SITE_URL}${meta.canonicalPath}`;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="author" content="Guuleed Maxmuud Aw Abdi" />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={meta.robots} />
      <meta property="og:type" content={meta.ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={meta.title} />
      <meta property="og:site_name" content="Guuleed Maxmuud Aw Abdi Portfolio" />
      <meta property="og:locale" content="en_US" />
      {meta.article && <meta property="article:author" content="Guuleed Maxmuud Aw Abdi" />}
      {meta.article && <meta property="article:published_time" content={meta.article.publishedTime} />}
      {meta.article?.modifiedTime && <meta property="article:modified_time" content={meta.article.modifiedTime} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.ogImage} />
      <meta name="twitter:image:alt" content={meta.title} />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="alternate" type="application/rss+xml" title="Guuleed Maxmuud Aw Abdi — RSS" href={`${SITE_URL}/rss.xml`} />
      <link rel="alternate" type="application/atom+xml" title="Guuleed Maxmuud Aw Abdi — Atom" href={`${SITE_URL}/atom.xml`} />
      <script type="application/ld+json">{JSON.stringify(meta.jsonLd)}</script>
    </Helmet>
  );
}
