/**
 * SeoHead.tsx
 * Centralised SEO / meta-tag component for Guuleed Maxamuud's portfolio.
 * Uses react-helmet-async so tags are injected server-side-safely and updated
 * whenever the active section changes (good for social-share previews).
 */

import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  /** The route/section that is currently visible. Drives per-section title & description. */
  section?: string;
}

const SITE_URL = 'https://guuleedmaxamuud.dev';
const FULL_NAME = 'Guuleed Maxamuud';
const TITLE_SUFFIX = `${FULL_NAME} — Cybersecurity Portfolio`;
const OG_IMAGE = `${SITE_URL}/assets/og-preview.png`; // 1200×630 social card (place in /public/assets/)

const SECTION_META: Record<string, { title: string; description: string }> = {
  home: {
    title: `${FULL_NAME} | Cybersecurity & Penetration Testing Portfolio`,
    description:
      `${FULL_NAME} is a Vulnerability Assessment & Penetration Tester based in Hargeisa, Somaliland. ` +
      `Explore his cybersecurity projects, certifications, and professional experience in ethical hacking, ` +
      `network security, and secure engineering.`,
  },
  about: {
    title: `About ${FULL_NAME} | Cybersecurity Specialist`,
    description:
      `Learn more about ${FULL_NAME} — a cybersecurity professional and Computer Science student at the ` +
      `University of Hargeisa, passionate about penetration testing, secure design, and continuous learning.`,
  },
  skills: {
    title: `Technical Skills | ${TITLE_SUFFIX}`,
    description:
      `${FULL_NAME}'s technical skill set spans penetration testing (Burp Suite, Nessus), Python automation, ` +
      `Linux hardening, network security, TypeScript, React, and more.`,
  },
  experience: {
    title: `Work Experience | ${TITLE_SUFFIX}`,
    description:
      `${FULL_NAME}'s hands-on cybersecurity experience includes penetration testing for a business client and ` +
      `IT support roles, delivering measurable security improvements and IT efficiency gains.`,
  },
  certificates: {
    title: `Certifications & Credentials | ${TITLE_SUFFIX}`,
    description:
      `Verified certifications earned by ${FULL_NAME}: Cisco Cyber Threat Management, Cybrary Penetration Testing ` +
      `Professional, Microsoft Security Essentials, Career Essentials in Cybersecurity, and more.`,
  },
  portfolio: {
    title: `Projects & Portfolio | ${TITLE_SUFFIX}`,
    description:
      `Explore ${FULL_NAME}'s cybersecurity projects including the EternalBlue exploitation case study, ` +
      `automated vulnerability scanner, and BookWanag — a modern React storefront.`,
  },
  blog: {
    title: `Blog | ${TITLE_SUFFIX}`,
    description:
      `Read editorial long-form technical writing, custom markdown experiments, and premium reading layouts from ${FULL_NAME}.`,
  },
  contact: {
    title: `Contact ${FULL_NAME} | ${TITLE_SUFFIX}`,
    description:
      `Get in touch with ${FULL_NAME} for cybersecurity consulting, collaboration, or job opportunities. ` +
      `Reach out via email or LinkedIn.`,
  },
};

export function SeoHead({ section = 'home' }: SeoHeadProps) {
  const meta = SECTION_META[section] ?? SECTION_META.home;

  return (
    <Helmet>
      {/* ── Primary ──────────────────────────────────────────────── */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta
        name="keywords"
        content={[
          'Guuleed Maxamuud',
          'Guuleed Maxmuud Aw Abdi',
          'cybersecurity portfolio',
          'penetration tester Somaliland',
          'vulnerability assessment',
          'ethical hacker',
          'network security',
          'Burp Suite Nessus Nmap',
          'cybersecurity resume',
          'Hargeisa cybersecurity',
        ].join(', ')}
      />
      <meta name="author" content={FULL_NAME} />
      <link rel="canonical" href={`${SITE_URL}/${section === 'home' ? '' : '#' + section}`} />

      {/* ── Open Graph (Facebook, LinkedIn, Discord…) ─────────────── */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${FULL_NAME} — Cybersecurity Portfolio preview card`} />
      <meta property="og:site_name" content={`${FULL_NAME} Portfolio`} />
      <meta property="og:locale" content="en_US" />

      {/* ── Twitter / X Card ─────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="twitter:image:alt" content={`${FULL_NAME} — Cybersecurity Portfolio`} />

      {/* ── Robots / Indexing ─────────────────────────────────────── */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* ── Structured Data (JSON-LD) — Person schema ─────────────── */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: FULL_NAME,
          alternateName: 'Guuleed Maxmuud Aw Abdi',
          url: SITE_URL,
          email: 'guuleedmaxamuud40@gmail.com',
          jobTitle: 'Vulnerability Assessment & Penetration Tester',
          description:
            'Cybersecurity professional specialising in penetration testing, vulnerability assessment, and secure engineering.',
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
            'Network Security',
            'Cybersecurity',
            'Ethical Hacking',
            'Python',
            'Linux',
            'Burp Suite',
            'Nessus',
          ],
        })}
      </script>
    </Helmet>
  );
}
