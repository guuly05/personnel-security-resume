/**
 * SeoHead.tsx
 * Centralised SEO / meta-tag component for Guuleed Maxmuud Aw Abdi's portfolio.
 * Uses react-helmet-async so tags are injected dynamically for link sharing & search engines.
 */

import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS } from '../blog/posts.ts';

interface SeoHeadProps {
  /** The route/section that is currently visible. Drives per-section title & description. */
  section?: string;
}

const SITE_URL = 'https://guuleedmaxamuud.dev';
const FULL_NAME = 'Guuleed Maxmuud Aw Abdi';
const TITLE_SUFFIX = `${FULL_NAME} — Cybersecurity Portfolio`;
const OG_IMAGE = `${SITE_URL}/assets/og-preview.png`; // 1200×630 social card in /public/assets/

const SECTION_META: Record<string, { title: string; description: string }> = {
  home: {
    title: `${FULL_NAME} | Cybersecurity & Penetration Testing Portfolio`,
    description:
      `${FULL_NAME} — Vulnerability Assessment & Penetration Tester based in Hargeisa, Somaliland. ` +
      `Explore ethical hacking projects, verified cybersecurity certifications, security audits, and network protection research.`,
  },
  about: {
    title: `About ${FULL_NAME} | Cybersecurity Specialist`,
    description:
      `Learn about ${FULL_NAME} — a cybersecurity specialist and Computer Science student at the ` +
      `University of Hargeisa, passionate about ethical hacking, vulnerability research, and systems protection.`,
  },
  skills: {
    title: `Technical Security Skills | ${TITLE_SUFFIX}`,
    description:
      `${FULL_NAME}'s technical competencies: Burp Suite, Nessus, Nmap, Python automation, ` +
      `Linux security hardening, network analysis, Wireshark, React, and secure application design.`,
  },
  experience: {
    title: `Cybersecurity & IT Experience | ${TITLE_SUFFIX}`,
    description:
      `${FULL_NAME}'s hands-on experience includes web app penetration testing, vulnerability remediation, ` +
      `and enterprise IT support operations with measurable security enhancements.`,
  },
  certificates: {
    title: `Verified Credentials & Certifications | ${TITLE_SUFFIX}`,
    description:
      `Verified security credentials earned by ${FULL_NAME}: Cisco Cyber Threat Management, ` +
      `Cybrary Penetration Testing Professional, Microsoft Security Essentials, and LinkedIn Career Essentials in Cybersecurity.`,
  },
  portfolio: {
    title: `Security Projects & Case Studies | ${TITLE_SUFFIX}`,
    description:
      `Explore ${FULL_NAME}'s cybersecurity projects including EternalBlue exploitation research, ` +
      `automated vulnerability assessment tools, and modern web application security architecture.`,
  },
  blog: {
    title: `Cybersecurity Blog & Research Insights | ${TITLE_SUFFIX}`,
    description:
      `Read long-form technical writeups, penetration testing walkthroughs, and cybersecurity insights authored by ${FULL_NAME}.`,
  },
  contact: {
    title: `Contact ${FULL_NAME} | Cybersecurity Consulting`,
    description:
      `Connect with ${FULL_NAME} for vulnerability assessments, penetration testing engagements, security consultations, or career opportunities.`,
  },
};

export function SeoHead({ section = 'home' }: SeoHeadProps) {
  let meta = SECTION_META[section] ?? SECTION_META.home;
  let canonicalUrl = `${SITE_URL}${section === 'home' ? '/' : '/' + section}`;
  let ogImage = OG_IMAGE;
  let isArticle = false;
  let articleData: any = null;

  if (typeof window !== 'undefined') {
    const parts = window.location.pathname.split('/');
    if (parts[1] === 'blog' && parts[2]) {
      const slug = parts[2];
      const post = BLOG_POSTS.find((p) => p.slug === slug);
      if (post) {
        isArticle = true;
        articleData = post;
        meta = {
          title: `${post.title} | ${FULL_NAME}`,
          description: post.subtitle,
        };
        canonicalUrl = `${SITE_URL}/blog/${slug}`;
        ogImage = `${SITE_URL}/blog/${slug}/og.png`;
      }
    }
  }

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

  const articleSchema = isArticle && articleData ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: articleData.title,
    description: articleData.subtitle,
    image: ogImage,
    author: {
      '@type': 'Person',
      name: FULL_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: FULL_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.png`,
      },
    },
    datePublished: new Date(articleData.date).toISOString(),
    url: canonicalUrl,
  } : null;

  return (
    <Helmet>
      {/* ── Primary Search Engine Tags ────────────────────────────── */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta
        name="keywords"
        content={[
          'Guuleed Maxmuud Aw Abdi',
          'Guuleed Maxamuud',
          'cybersecurity portfolio',
          'penetration tester Somaliland',
          'vulnerability assessment',
          'ethical hacker Hargeisa',
          'network security specialist',
          'Burp Suite Nessus Nmap',
          'cybersecurity resume',
          'Somaliland cybersecurity',
        ].join(', ')}
      />
      <meta name="author" content={FULL_NAME} />
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Favicons & App Icons ─────────────────────────────────── */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* ── Open Graph (WhatsApp, LinkedIn, Telegram, Facebook, Discord) ── */}
      <meta property="og:type" content={isArticle ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={isArticle ? `Blog post: ${meta.title}` : `${FULL_NAME} — Cybersecurity Portfolio preview card`} />
      <meta property="og:site_name" content="Guuleed Maxamuud" />
      <meta property="og:locale" content="en_US" />
      {isArticle && <meta property="article:author" content={FULL_NAME} />}
      {isArticle && articleData && <meta property="article:published_time" content={new Date(articleData.date).toISOString()} />}

      {/* ── Twitter / X Link Preview ─────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={meta.title} />

      {/* ── Search Indexing Instructions ─────────────────────────── */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* ── Google Search Structured Data (JSON-LD) ──────────────── */}
      <script type="application/ld+json">
        {JSON.stringify(articleSchema ? [personSchema, articleSchema] : personSchema)}
      </script>
    </Helmet>
  );
}
