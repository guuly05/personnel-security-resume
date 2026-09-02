import type { BlogPost } from '../blog/posts.ts';

export const SITE_URL = 'https://www.guuleedmaxamuud.dev';
export const FULL_NAME = 'Guuleed Maxmuud Aw Abdi';
export const OG_IMAGE = `${SITE_URL}/assets/og-preview.png`;
export const PUBLISHER_LOGO = `${SITE_URL}/favicon.svg`;
export const DEFAULT_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
export const NOINDEX_ROBOTS = 'noindex, follow';

export type RouteKey =
  | 'home'
  | 'about'
  | 'skills'
  | 'experience'
  | 'certificates'
  | 'portfolio'
  | 'book'
  | 'blog'
  | 'contact'
  | 'privacy-policy'
  | 'terms-of-service'
  | 'recap'
  | 'reflection'
  | 'surprise'
  | 'vault'
  | 'not-found';

export type PageMetadata = {
  title: string;
  description: string;
  canonicalPath: string;
  robots: string;
  ogType: 'website' | 'article';
  ogImage: string;
  jsonLd: Record<string, unknown> | Record<string, unknown>[];
  article?: {
    publishedTime: string;
    modifiedTime?: string;
  };
};

const TITLE_SUFFIX = `${FULL_NAME} — Full-Stack Developer Portfolio`;

const PROJECT_SEO: Record<string, { title: string; description: string }> = {
  'cyber-dashboard': {
    title: 'Cyber Attack Monitoring Dashboard Case Study',
    description: 'Architecture, security controls, testing methodology, and measurable results from Guuleed Maxmuud Aw Abdi’s threat intelligence dashboard.',
  },
  'gabay-keeper': {
    title: 'Gabay Keeper Case Study',
    description: 'A privacy-first Somali poetry archive case study covering ownership rules, local OCR, architecture, testing, and results.',
  },
  purpleprint: {
    title: 'PurplePrint Case Study',
    description: 'An offline Android Markdown editor case study covering the AST parser, native PDF engine, privacy posture, and testing approach.',
  },
  'infosec-course': {
    title: 'Information Systems Security Course Case Study',
    description: 'An open cybersecurity curriculum case study covering learning architecture, practical labs, framework alignment, and outcomes.',
  },
};

const PERSON_SCHEMA = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: FULL_NAME,
  alternateName: 'Guuleed Maxamuud',
  url: `${SITE_URL}/about`,
  email: 'guuleedmaxamuud40@gmail.com',
  jobTitle: 'Full-Stack Developer & DevOps-minded Engineer',
  description:
    'Full-stack developer building interfaces, APIs, delivery workflows, automation, and secure software systems.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Hargeisa',
    addressRegion: 'Somaliland',
  },
  sameAs: ['https://linkedin.com/in/guuleed-aw-abdi-517928277', 'https://github.com/guuly05'],
  knowsAbout: [
    'Frontend Development',
    'Backend Development',
    'DevOps and CI/CD',
    'Secure Software Engineering',
    'Penetration Testing',
    'Vulnerability Assessment',
    'Burp Suite',
    'Nessus',
    'Nmap',
    'Linux Hardening',
    'Python Automation',
  ],
};

const WEBSITE_SCHEMA = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: `${FULL_NAME} Portfolio`,
  description: 'Full-stack developer portfolio covering product builds, backend systems, DevOps workflows, automation, and secure engineering.',
  inLanguage: 'en-US',
  publisher: { '@id': `${SITE_URL}/#person` },
};

const pageMeta: Record<Exclude<RouteKey, 'reflection' | 'surprise' | 'vault' | 'not-found'>, { title: string; description: string; path: string }> = {
  home: {
    title: `${FULL_NAME} | Full-Stack Developer & DevOps Portfolio`,
    description:
      `${FULL_NAME} — Full-stack developer based in Hargeisa, Somaliland. Explore frontend and backend builds, DevOps workflows, automation, secure engineering, and technical case studies.`,
    path: '/',
  },
  about: {
    title: `About ${FULL_NAME} | Full-Stack Developer`,
    description: `Learn about ${FULL_NAME}, a full-stack developer and Computer Science student focused on useful products, dependable systems, and secure engineering.`,
    path: '/about',
  },
  skills: {
    title: `Technical Capabilities | ${TITLE_SUFFIX}`,
    description: `${FULL_NAME}'s capabilities span React, TypeScript, Node APIs, cloud deployment, CI/CD, Python automation, Linux systems, and secure application design.`,
    path: '/skills',
  },
  experience: {
    title: `Engineering Experience | ${TITLE_SUFFIX}`,
    description: `${FULL_NAME}'s hands-on experience spans B2B web development, frontend architecture, delivery workflows, systems thinking, and security-minded engineering.`,
    path: '/experience',
  },
  certificates: {
    title: `Learning & Credentials | ${TITLE_SUFFIX}`,
    description: `Explore ${FULL_NAME}'s verified credentials, engineering and security training, and Computer Science education.`,
    path: '/certificates',
  },
  portfolio: {
    title: `Selected Work & Case Studies | ${TITLE_SUFFIX}`,
    description: `Explore ${FULL_NAME}'s product builds, full-stack projects, privacy-first tools, security engineering work, and documented case studies.`,
    path: '/portfolio',
  },
  book: {
    title: `Book a Project Call | ${FULL_NAME}`,
    description: `Schedule a focused conversation with ${FULL_NAME} about a product build, engineering project, delivery workflow, security work, or collaboration.`,
    path: '/book',
  },
  blog: {
    title: `Engineering Blog & Research | ${TITLE_SUFFIX}`,
    description: `Read technical write-ups and research commentary about software engineering, systems, product thinking, cybersecurity, and technology.`,
    path: '/blog',
  },
  contact: {
    title: `Contact ${FULL_NAME} | Software Engineering`,
    description: `Contact ${FULL_NAME} about a software build, full-stack collaboration, delivery workflow, secure engineering, or career opportunities.`,
    path: '/contact',
  },
  'privacy-policy': {
    title: 'Privacy Policy | Website Legal',
    description: 'Simple privacy policy covering personal data, cookies, analytics, and contact information on this website.',
    path: '/privacy-policy',
  },
  'terms-of-service': {
    title: 'Terms of Service | Website Legal',
    description: 'Simple terms of service covering website use, content, contact, and limitations of liability.',
    path: '/terms-of-service',
  },
  recap: {
    title: `${FULL_NAME} | Annual Reflection`,
    description: `A seasonal annual reflection and milestone archive from ${FULL_NAME}.`,
    path: '/recap',
  },
};

function websiteAndPersonSchema() {
  return { '@context': 'https://schema.org', '@graph': [WEBSITE_SCHEMA, PERSON_SCHEMA] };
}

function webPageSchema(meta: { title: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: meta.title,
    description: meta.description,
    url: `${SITE_URL}${meta.path}`,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
  };
}

function basePageMetadata(key: Exclude<RouteKey, 'reflection' | 'surprise' | 'vault' | 'not-found'>): PageMetadata {
  const meta = pageMeta[key];
  return {
    title: meta.title,
    description: meta.description,
    canonicalPath: meta.path,
    robots: key === 'recap' ? NOINDEX_ROBOTS : DEFAULT_ROBOTS,
    ogType: 'website',
    ogImage: OG_IMAGE,
    jsonLd: key === 'home' ? websiteAndPersonSchema() : webPageSchema(meta),
  };
}

export function metadataForArticle(post: BlogPost): PageMetadata {
  const canonicalPath = `/blog/${post.slug}`;
  const publishedTime = new Date(`${post.date} 12:00:00 UTC`).toISOString();
  const modifiedTime = new Date(`${post.lastUpdated} 12:00:00 UTC`).toISOString();
  return {
    title: `${post.title} | ${FULL_NAME}`,
    description: post.subtitle,
    canonicalPath,
    robots: DEFAULT_ROBOTS,
    ogType: 'article',
    ogImage: `${SITE_URL}${canonicalPath}/og.png`,
    article: { publishedTime, modifiedTime },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.subtitle,
      image: `${SITE_URL}${canonicalPath}/og.png`,
      author: { '@type': 'Person', name: FULL_NAME, url: `${SITE_URL}/about` },
      publisher: { '@type': 'Organization', name: FULL_NAME, logo: { '@type': 'ImageObject', url: PUBLISHER_LOGO } },
      datePublished: publishedTime,
      dateModified: modifiedTime,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${canonicalPath}` },
      url: `${SITE_URL}${canonicalPath}`,
    },
  };
}

export function metadataForRoute(pathname: string, post?: BlogPost): PageMetadata {
  if (pathname.startsWith('/blog/') && post) return metadataForArticle(post);
  if (pathname.startsWith('/portfolio/')) {
    const slug = pathname.split('/')[2];
    const project = PROJECT_SEO[slug];
    if (project) {
      const meta = { ...project, path: `/portfolio/${slug}` };
      return {
        title: `${meta.title} | ${FULL_NAME}`,
        description: meta.description,
        canonicalPath: meta.path,
        robots: DEFAULT_ROBOTS,
        ogType: 'website',
        ogImage: OG_IMAGE,
        jsonLd: webPageSchema(meta),
      };
    }
    return {
      title: `Project Not Found | ${TITLE_SUFFIX}`,
      description: 'The requested project case study could not be found.',
      canonicalPath: '/404',
      robots: NOINDEX_ROBOTS,
      ogType: 'website',
      ogImage: OG_IMAGE,
      jsonLd: webPageSchema({ title: 'Project Not Found', description: 'The requested project case study could not be found.', path: '/404' }),
    };
  }
  if (pathname === '/404' || pathname === '/does-not-exist') {
    return {
      title: `Page Not Found | ${TITLE_SUFFIX}`,
      description: 'The requested portfolio page could not be found.',
      canonicalPath: '/404',
      robots: NOINDEX_ROBOTS,
      ogType: 'website',
      ogImage: OG_IMAGE,
      jsonLd: webPageSchema({ title: 'Page Not Found', description: 'The requested portfolio page could not be found.', path: '/404' }),
    };
  }
  const key = pathname.replace(/^\//, '') as RouteKey;
  if (key === 'reflection' || key === 'surprise' || key === 'vault') {
    return { ...basePageMetadata('recap'), canonicalPath: '/recap' };
  }
  const routeKey = (key in pageMeta ? key : 'home') as Exclude<RouteKey, 'reflection' | 'surprise' | 'vault' | 'not-found'>;
  return basePageMetadata(routeKey);
}

export function metadataForSection(section: string, pathname?: string, post?: BlogPost): PageMetadata {
  if (pathname) return metadataForRoute(pathname, post);
  return metadataForRoute(section === 'home' ? '/' : `/${section}`, post);
}
