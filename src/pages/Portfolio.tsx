import React, { useState } from 'react';
import { Github } from 'lucide-react';
import { Icon } from '../components/Icon.tsx';
import { MotionConfig, motion, AnimatePresence } from 'motion/react';
import { CASE_STUDIES, type CaseStudy, type TechItem } from '../data/caseStudies.ts';

/* Metadata pill — compact inline badge */
const MetaPill: React.FC<{ children: React.ReactNode; accent?: boolean }> = ({ children, accent }) => (
  <span
    className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] leading-none ${
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
    frontend: 'border-[var(--accent)]/35 text-[var(--accent)]',
    backend: 'border-[var(--border)] text-[var(--color-text-muted)]',
    tooling: 'border-[var(--border)] text-[var(--color-text-muted)]',
    platform: 'border-[var(--accent)]/35 text-[var(--accent)]',
    native: 'border-[var(--border)] text-[var(--color-text-muted)]',
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
          decoding="async"
        />
        {/* Gradient overlay */}

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
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-5">
            <SectionLabel>Challenge</SectionLabel>
            <p className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">{study.challenge}</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-5">
            <SectionLabel>Approach</SectionLabel>
            <p className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">{study.approach}</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-5">
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
            href={`/portfolio/${study.id}`}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--accent)]/35 bg-[var(--accent-soft)] px-5 py-2.5 text-[13px] font-semibold text-[var(--accent)] transition-colors hover:border-[var(--accent)] active:translate-y-px"
          >
            <Icon name="file-text" size={15} />
            Full Case Study
          </a>
          {study.githubUrl && <a
            href={study.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-bg)] transition-colors hover:opacity-90 active:translate-y-px"
          >
            <Github size={15} aria-hidden="true" className="shrink-0" />
            View Source
          </a>}
          {study.liveUrl && (
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--accent)]/50"
            >
              <Icon name="external-link" size={14} />
              {study.githubUrl ? 'Live Demo' : 'See live deployment'}
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
            decoding="async"
          />
          {/* Subtle gradient at edge facing content */}
          <div
            className={`absolute inset-0 hidden lg:block ${
              isReversed
                ? 'border-l-4 border-l-[var(--accent)]/30'
                : 'border-r-4 border-r-[var(--accent)]/30'
            }`}
          />
          {/* Mobile bottom gradient */}

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
              href={`/portfolio/${study.id}`}
              className="inline-flex items-center gap-2 rounded-md border border-[var(--accent)]/35 bg-[var(--accent-soft)] px-5 py-2.5 text-[13px] font-semibold text-[var(--accent)] transition-colors hover:border-[var(--accent)] active:translate-y-px"
            >
              <Icon name="file-text" size={15} />
              Full Case Study
            </a>
            {study.githubUrl && <a
              href={study.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-bg)] transition-colors hover:opacity-90 active:translate-y-px"
            >
              <Github size={15} aria-hidden="true" className="shrink-0" />
              View Source
            </a>}
            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--accent)]/50"
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
  const projectsWithSource = CASE_STUDIES.filter((study) => Boolean(study.githubUrl)).length;
  const openSourceProjects = CASE_STUDIES.filter((study) => study.status === 'Open Source').length;

  return (
    <MotionConfig reducedMotion="user">
    <div className="editorial-page portfolio-page w-full space-y-10 lg:space-y-14">
      {/* ── Intro section ─────────────────────── */}
      <section className="surface-card p-6 sm:p-8 lg:p-10 relative overflow-hidden">
        {/* Decorative glow */}

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-md border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
            <Icon name="briefcase" size={12} />
            <span>Case Studies</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.15]">
            Products with a point of view,{' '}
            <span className="text-accent">built end to end.</span>
          </h1>

          <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--color-text-muted)] max-w-2xl">
            Each project below documents the problem, my role, the architecture, and the evidence
            behind the work. The collection includes live products, open-source software, and learning
            resources built with useful UX, dependable delivery, and secure engineering in mind.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3.5 py-2 text-center">
              <p className="text-lg font-bold text-[var(--accent)]">{CASE_STUDIES.length}</p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] font-semibold">Projects</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3.5 py-2 text-center">
              <p className="text-lg font-bold text-[var(--accent)]">{projectsWithSource}</p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] font-semibold">Public repositories</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3.5 py-2 text-center">
              <p className="text-lg font-bold text-[var(--accent)]">{openSourceProjects}</p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[var(--color-text-muted)] font-semibold">Open-source projects</p>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-4">
            <a href="/systems" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
              Trace engineering decisions across projects <Icon name="arrow-up-right" size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Featured project (first) ──────────── */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px flex-1 bg-[var(--accent)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--accent)]">
            Featured Project
          </span>
          <span className="h-px flex-1 bg-[var(--accent)]" />
        </div>
        <FeaturedCard study={featured} />
      </section>

      {/* ── Remaining projects ────────────────── */}
      {rest.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--color-text-muted)]">
              More Work
            </span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <div className="space-y-8">
            {rest.map((study, i) => (
              <ProjectCard key={study.id} study={study} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
    </MotionConfig>
  );
};

export default PortfolioPage;
