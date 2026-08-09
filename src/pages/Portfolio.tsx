import React, { useState } from 'react';
import { Icon } from '../components/Icon.tsx';
import { motion, AnimatePresence } from 'motion/react';

/* ─────────────────────────────────────────────
   Data types
   ───────────────────────────────────────────── */

interface TechItem {
  name: string;
  group: 'frontend' | 'backend' | 'tooling' | 'platform' | 'native';
}

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  year: string;
  status: 'Live' | 'Open Source' | 'In Development';
  role: string;
  imageUrl: string;
  imageAlt: string;
  challenge: string;
  approach: string;
  outcome: string;
  highlights: string[];
  techStack: TechItem[];
  githubUrl: string;
  liveUrl?: string;
}

/* ─────────────────────────────────────────────
   Project data — restructured for case-study format
   ───────────────────────────────────────────── */

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cyber-dashboard',
    title: 'Cyber Attack Monitoring Dashboard',
    subtitle: 'Real-time threat intelligence and investigation toolkit for security analysts.',
    type: 'Security Engineering',
    year: '2025',
    status: 'Live',
    role: 'Full-Stack Developer & Security Researcher',
    imageUrl: 'https://github.com/user-attachments/assets/a8f31de3-ee5b-4b89-8224-951b399291a7',
    imageAlt: 'Cyber Attack Monitoring Dashboard showing threat feed and risk scores',
    challenge:
      'Security analysts often need a unified view of live threat indicators with quick investigation tools for IPs, domains, and CVEs — but building that usually means juggling multiple APIs and manual data correlation, with the risk of exposing API keys on the client.',
    approach:
      'Built a Next.js App Router dashboard with server-side API routes to proxy AbuseIPDB and CIRCL CVE lookups, keeping all secrets off the client. Used TanStack Query for data caching, Recharts for threat visualizations, and Radix UI primitives for an accessible, polished interface.',
    outcome:
      'A deployed, production-grade dashboard on Vercel with security headers, analytics, and a live threat feed. Users can search IPs, domains, and CVEs, view risk scores, read mitigation guidance, and follow outbound links to VirusTotal, Shodan, and AlienVault OTX.',
    highlights: [
      'Zero client-side API key exposure via server-side route proxying',
      'Live IP reputation lookups through AbuseIPDB integration',
      'Responsive dark-mode interface with production security headers',
      'Deployed on Vercel with automated CI/CD and Speed Insights',
    ],
    techStack: [
      { name: 'Next.js', group: 'frontend' },
      { name: 'React', group: 'frontend' },
      { name: 'TypeScript', group: 'frontend' },
      { name: 'Tailwind CSS', group: 'frontend' },
      { name: 'TanStack Query', group: 'tooling' },
      { name: 'Recharts', group: 'tooling' },
      { name: 'Radix UI', group: 'tooling' },
    ],
    githubUrl: 'https://github.com/guuly05/cyber-attack-monitoring-dashboard',
  },
  {
    id: 'gabay-keeper',
    title: 'Gabay Keeper',
    subtitle: 'A private digital archive for Somali oral poetry with OCR and visual export.',
    type: 'Full-Stack Web App',
    year: '2025',
    status: 'Open Source',
    role: 'Sole Developer & Designer',
    imageUrl: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800&h=450&fit=crop',
    imageAlt: 'Gabay Keeper digital poetry archive interface',
    challenge:
      'Somali oral poetry lives in scattered notes, recordings, and community memory — vulnerable to loss and misattribution. No dedicated digital archive existed that captures poems with proper metadata while keeping data private and user-owned.',
    approach:
      'Built a full-stack web archive with React, TypeScript, and Tailwind CSS on the frontend, backed by Firebase Authentication and Firestore with strict security rules enforcing per-user document ownership. Integrated Tesseract.js for OCR scanning and html-to-image for shareable visual poem cards.',
    outcome:
      'A working private archive where users preserve poems with structured metadata, filter by genre and Somali alphabet letter, add footnotes, scan printed texts via OCR, and export shareable visual cards — all running client-side with no backend server.',
    highlights: [
      'Strict Firebase Security Rules enforce per-user data ownership',
      'Client-side OCR via Tesseract.js — no data leaves the browser',
      'Visual poem card export for social sharing',
      'Dark mode optimized for long-form reading',
    ],
    techStack: [
      { name: 'React', group: 'frontend' },
      { name: 'TypeScript', group: 'frontend' },
      { name: 'Tailwind CSS', group: 'frontend' },
      { name: 'Firebase', group: 'backend' },
      { name: 'Tesseract.js', group: 'tooling' },
      { name: 'html-to-image', group: 'tooling' },
    ],
    githubUrl: 'https://github.com/guuly05/gabay-keeper',
  },
  {
    id: 'purpleprint',
    title: 'PurplePrint',
    subtitle: 'A fully offline Android Markdown editor with on-device PDF export.',
    type: 'Native Android App',
    year: '2025',
    status: 'Open Source',
    role: 'Sole Developer',
    imageUrl: 'https://github.com/user-attachments/assets/9e8811f5-5e10-497f-82c1-2a144533e6d8',
    imageAlt: 'PurplePrint Markdown editor showing split preview',
    challenge:
      'Most Markdown editors and PDF converters send content to a remote server for processing. I wanted a fully offline, privacy-first editor for Android that never needs internet access and never uploads documents anywhere.',
    approach:
      'Built a native Android app with Kotlin and Jetpack Compose following Material 3 guidelines. Wrote a custom Markdown parser (block-level and inline) that produces an AST, then built a PDF layout engine using Android\'s native PdfDocument and PrintManager — all processing on-device. Adaptive layout uses split editor/preview on tablets and tabs on phones.',
    outcome:
      'An offline-first Markdown editor with live preview and print-ready PDF export through the Android print dialog. No internet permission is declared, Android backup is disabled by default, and all processing stays on the device.',
    highlights: [
      'Zero internet permissions — fully offline-first architecture',
      '100% on-device processing with custom AST-based parser',
      'Adaptive layout: split view on tablets, tabs on phones',
      'Material 3 dark/light theme support',
    ],
    techStack: [
      { name: 'Kotlin', group: 'native' },
      { name: 'Jetpack Compose', group: 'native' },
      { name: 'Material 3', group: 'native' },
      { name: 'PdfDocument', group: 'native' },
      { name: 'PrintManager', group: 'native' },
    ],
    githubUrl: 'https://github.com/guuly05/purpleprint',
  },
];

/* ─────────────────────────────────────────────
   Subcomponents
   ───────────────────────────────────────────── */

/* Metadata pill — compact inline badge */
const MetaPill: React.FC<{ children: React.ReactNode; accent?: boolean }> = ({ children, accent }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] leading-none ${
      accent
        ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/25'
        : 'bg-[var(--surface-soft)] text-[var(--color-text-muted)] border border-[var(--border)]'
    }`}
  >
    {children}
  </span>
);

/* Tech stack chip */
const TechChip: React.FC<{ item: TechItem }> = ({ item }) => {
  const groupColors: Record<TechItem['group'], string> = {
    frontend: 'border-sky-500/25 text-sky-400/90',
    backend: 'border-amber-500/25 text-amber-400/90',
    tooling: 'border-violet-500/25 text-violet-400/90',
    platform: 'border-emerald-500/25 text-emerald-400/90',
    native: 'border-rose-500/25 text-rose-400/90',
  };

  return (
    <span
      className={`inline-block rounded-lg border bg-[var(--surface-soft)] px-2 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase leading-none ${groupColors[item.group]}`}
    >
      {item.name}
    </span>
  );
};

/* Highlight list item — compact bullet with accent dot */
const HighlightItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
    <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
    <span>{text}</span>
  </li>
);

/* Section label for Challenge / Approach / Outcome blocks */
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
    {children}
  </h4>
);

/* ─────────────────────────────────────────────
   Featured project card (first project — full-width hero)
   ───────────────────────────────────────────── */

const FeaturedCard: React.FC<{ study: CaseStudy }> = ({ study }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      layout
      className="surface-card overflow-hidden"
    >
      {/* Hero image — full bleed */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[21/8] overflow-hidden bg-[var(--surface-soft)]">
        <img
          src={study.imageUrl}
          alt={study.imageAlt}
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/90 via-[var(--color-bg)]/30 to-transparent" />

        {/* Floating badge */}
        <div className="absolute top-5 left-5 flex gap-2">
          <MetaPill accent>{study.type}</MetaPill>
          <MetaPill>{study.status}</MetaPill>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 lg:p-10 -mt-16 relative z-10">
        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <MetaPill>{study.year}</MetaPill>
          <MetaPill>{study.role}</MetaPill>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          {study.title}
        </h2>
        <p className="text-sm sm:text-base text-[var(--color-text-muted)] max-w-3xl leading-relaxed mb-6">
          {study.subtitle}
        </p>

        {/* Challenge / Approach / Outcome — tight grid */}
        <div className="grid gap-5 md:grid-cols-3 mb-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-5">
            <SectionLabel>Challenge</SectionLabel>
            <p className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">{study.challenge}</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-5">
            <SectionLabel>Approach</SectionLabel>
            <p className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">{study.approach}</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-5">
            <SectionLabel>Outcome</SectionLabel>
            <p className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">{study.outcome}</p>
          </div>
        </div>

        {/* Key results — expandable on mobile */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--accent)] mb-4 md:hidden transition hover:opacity-80"
        >
          <Icon name="chevron-right" size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
          {expanded ? 'Hide' : 'Show'} Key Results & Stack
        </button>

        <div className={`${expanded ? 'block' : 'hidden'} md:block`}>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            {/* Highlights */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-3">
                Key Results
              </h4>
              <ul className="space-y-2">
                {study.highlights.map((h) => (
                  <HighlightItem key={h} text={h} />
                ))}
              </ul>
            </div>

            {/* Tech stack */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-3">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {study.techStack.map((t) => (
                  <TechChip key={t.name} item={t} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--border)]">
          <a
            href={study.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-bg)] transition hover:opacity-90 active:scale-[0.97]"
          >
            <Icon name="github" size={15} />
            View Source
          </a>
          {study.liveUrl && (
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-text)] transition hover:border-[var(--accent)]/50"
            >
              <Icon name="external-link" size={14} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────
   Standard project card (alternating layout)
   ───────────────────────────────────────────── */

const ProjectCard: React.FC<{ study: CaseStudy; index: number }> = ({ study, index }) => {
  const [expanded, setExpanded] = useState(false);
  const isReversed = index % 2 !== 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="surface-card overflow-hidden"
    >
      <div className={`grid grid-cols-1 lg:grid-cols-12 min-h-0`}>
        {/* Image column — 5 of 12 */}
        <div
          className={`relative lg:col-span-5 aspect-video lg:aspect-auto lg:min-h-[480px] overflow-hidden bg-[var(--surface-soft)] ${
            isReversed ? 'lg:order-last' : ''
          }`}
        >
          <img
            src={study.imageUrl}
            alt={study.imageAlt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Subtle gradient at edge facing content */}
          <div
            className={`absolute inset-0 hidden lg:block ${
              isReversed
                ? 'bg-gradient-to-l from-transparent via-transparent to-[var(--color-bg)]/20'
                : 'bg-gradient-to-r from-transparent via-transparent to-[var(--color-bg)]/20'
            }`}
          />
          {/* Mobile bottom gradient */}
          <div className="absolute inset-0 lg:hidden bg-gradient-to-t from-[var(--color-bg)]/50 to-transparent" />

          {/* Floating badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <MetaPill accent>{study.type}</MetaPill>
            <MetaPill>{study.status}</MetaPill>
          </div>
        </div>

        {/* Content column — 7 of 12 */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <MetaPill>{study.year}</MetaPill>
            <MetaPill>{study.role}</MetaPill>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-1.5">
            {study.title}
          </h3>
          <p className="text-[13px] sm:text-sm text-[var(--color-text-muted)] leading-relaxed mb-5 max-w-xl">
            {study.subtitle}
          </p>

          {/* Challenge / Approach / Outcome — stacked */}
          <div className="space-y-3 mb-5">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <SectionLabel>Challenge</SectionLabel>
              <p className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">{study.challenge}</p>
            </div>

            {/* Expandable details */}
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--accent)] transition hover:opacity-80"
            >
              <Icon name="chevron-right" size={12} className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
              {expanded ? 'Show less' : 'Read full case study'}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                    <SectionLabel>Approach</SectionLabel>
                    <p className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">{study.approach}</p>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                    <SectionLabel>Outcome</SectionLabel>
                    <p className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">{study.outcome}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Highlights */}
          <div className="mb-5">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-2.5">
              Key Results
            </h4>
            <ul className="space-y-1.5">
              {study.highlights.map((h) => (
                <HighlightItem key={h} text={h} />
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div className="mb-5">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-2.5">
              Built With
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {study.techStack.map((t) => (
                <TechChip key={t.name} item={t} />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border)]">
            <a
              href={study.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-bg)] transition hover:opacity-90 active:scale-[0.97]"
            >
              <Icon name="github" size={15} />
              View Source
            </a>
            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-text)] transition hover:border-[var(--accent)]/50"
              >
                <Icon name="external-link" size={14} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────
   Portfolio page
   ───────────────────────────────────────────── */

const PortfolioPage: React.FC = () => {
  const [featured, ...rest] = CASE_STUDIES;

  return (
    <div className="w-full space-y-10 lg:space-y-14">
      {/* ── Intro section ─────────────────────── */}
      <section className="surface-card p-6 sm:p-8 lg:p-10 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--accent)]/8 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[var(--brand-purple)]/6 blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
            <Icon name="briefcase" size={12} />
            <span>Case Studies</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.15]">
            Security-first engineering,{' '}
            <span className="text-gradient">documented end to end.</span>
          </h1>

          <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--color-text-muted)] max-w-2xl">
            Each project below is a complete case study — from identifying a real problem, through
            architecture and security decisions, to a working product. I build tools that respect
            user privacy, keep secrets off the client, and solve problems clearly enough to explain
            to any team.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3.5 py-2 text-center">
              <p className="text-lg font-bold text-[var(--accent)]">{CASE_STUDIES.length}</p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] font-semibold">Projects</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3.5 py-2 text-center">
              <p className="text-lg font-bold text-[var(--accent)]">3</p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] font-semibold">Platforms</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3.5 py-2 text-center">
              <p className="text-lg font-bold text-[var(--accent)]">100%</p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] font-semibold">Open Source</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured project (first) ──────────── */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px flex-1 bg-gradient-to-r from-[var(--accent)]/40 to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--accent)]">
            Featured Project
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-[var(--accent)]/40 to-transparent" />
        </div>
        <FeaturedCard study={featured} />
      </section>

      {/* ── Remaining projects ────────────────── */}
      {rest.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--color-text-muted)]">
              More Work
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-[var(--border)] to-transparent" />
          </div>

          <div className="space-y-8">
            {rest.map((study, i) => (
              <ProjectCard key={study.id} study={study} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PortfolioPage;
