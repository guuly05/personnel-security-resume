import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '../components/Icon.tsx';
import { CASE_STUDIES } from './Portfolio.tsx';
import { PROJECT_DETAILS, type ProjectDetail } from '../data/projectDetails.ts';

const MetaPill: React.FC<{ children: React.ReactNode; accent?: boolean }> = ({ children, accent }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] leading-none ${accent
    ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/25'
    : 'bg-[var(--surface-soft)] text-[var(--color-text-muted)] border border-[var(--border)]'}`}>
    {children}
  </span>
);

const SectionHeading: React.FC<{ eyebrow: string; title: string; children?: React.ReactNode }> = ({ eyebrow, title, children }) => (
  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">{eyebrow}</p>
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
    </div>
    {children}
  </div>
);

const DetailLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">{children}</h3>
);

const ArchitectureDiagram: React.FC<{ detail: ProjectDetail }> = ({ detail }) => (
  <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-6">
    <div className="mb-5 flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
        System flow
      </div>
      <span className="font-mono text-[10px] text-[var(--color-text-muted)]">PUBLIC VIEW</span>
    </div>
    <div className="grid gap-3 md:grid-cols-3 md:items-stretch">
      {detail.architecture.map((layer, index) => (
        <React.Fragment key={layer.label}>
          <div className="relative rounded-lg border border-[var(--accent)]/25 bg-[var(--surface)] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--accent)]">0{index + 1}</span>
              <Icon name="layers" size={15} className="text-[var(--color-text-muted)]" />
            </div>
            <h3 className="mb-3 font-bold">{layer.label}</h3>
            <ul className="space-y-2">
              {layer.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {index < detail.architecture.length - 1 && (
            <div className="hidden items-center justify-center md:flex" aria-hidden="true">
              <span className="h-px w-full bg-[var(--accent)]" />
              <Icon name="chevron-right" size={16} className="-ml-2 flex-shrink-0 text-[var(--accent)]" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
    <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)]">{detail.architectureSummary}</p>
  </div>
);

const SanitizedReport: React.FC<{ detail: ProjectDetail }> = ({ detail }) => (
  <div className="surface-card p-6 sm:p-8">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">Evidence</p>
        <h2 className="text-2xl font-bold tracking-tight">Sanitized report</h2>
      </div>
      <div className="rounded-xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] p-2.5 text-[var(--accent)]" title="Sensitive values removed">
        <Icon name="shield-check" size={18} />
      </div>
    </div>
    <p className="mb-5 text-sm leading-relaxed text-[var(--color-text-muted)]">{detail.reportIntro}</p>
    <div className="overflow-hidden rounded-lg border border-[var(--border)]">
      {detail.reportRows.map((row) => (
        <div key={row.label} className="grid grid-cols-1 items-center gap-1 border-b border-[var(--border)] px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:gap-3">
          <span className="text-xs text-[var(--color-text-muted)]">{row.label}</span>
          <span className="text-xs font-semibold text-[var(--color-text)] sm:text-right">{row.value}</span>
          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-[0.18em] ${row.status === 'PASS'
            ? 'bg-emerald-500/10 text-emerald-400'
            : row.status === 'REVIEW' ? 'bg-amber-500/10 text-amber-400' : 'bg-sky-500/10 text-sky-400'}`}>
            {row.status}
          </span>
        </div>
      ))}
    </div>
    <pre className="mt-5 overflow-x-auto rounded-lg border border-[var(--border)] bg-[#071016] p-4 font-mono text-[11px] leading-relaxed text-emerald-300/90"><code>{detail.reportExcerpt}</code></pre>
  </div>
);

const ProjectDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const study = CASE_STUDIES.find((entry) => entry.id === slug);
  const detail = study ? PROJECT_DETAILS[study.id] : undefined;

  if (!study || !detail) {
    return (
      <div className="surface-card p-8 text-center sm:p-12">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">Project not found</p>
        <h1 className="mb-5 text-3xl font-bold">That case study is unavailable.</h1>
        <a href="/portfolio" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)]">
          <Icon name="arrow-left" size={15} /> Back to portfolio
        </a>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-10 lg:space-y-14">
      <a href="/portfolio" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--accent)] transition hover:gap-3">
        <Icon name="arrow-left" size={14} /> Back to all case studies
      </a>

      <header className="surface-card relative overflow-hidden p-6 sm:p-8 lg:p-12">
        <div className="relative z-10 max-w-4xl">
          <div className="mb-5 flex flex-wrap gap-2">
            <MetaPill accent>{study.type}</MetaPill>
            <MetaPill>{study.status}</MetaPill>
            <MetaPill>{study.year}</MetaPill>
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">{study.title}</h1>
          <p className="mb-6 max-w-3xl text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">{study.subtitle}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-2"><Icon name="briefcase" size={14} className="text-[var(--accent)]" /> {study.role}</span>
            <span className="inline-flex items-center gap-2"><Icon name="shield-check" size={14} className="text-[var(--accent)]" /> Evidence-led build notes</span>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {detail.results.map((result) => (
          <div key={result.label} className="surface-card p-5 sm:p-6">
            <p className="text-3xl font-bold text-[var(--accent)]">{result.value}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em]">{result.label}</p>
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-muted)]">{result.detail}</p>
          </div>
        ))}
      </section>

      <section>
        <SectionHeading eyebrow="01 / Visual evidence" title="Screenshots and workflow" />
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <figure className="surface-card overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden bg-[var(--surface-soft)]">
              <img src={study.imageUrl} alt={study.imageAlt} className="h-full w-full object-cover" loading="eager" />
            </div>
            <figcaption className="p-5">
              <p className="mb-1 text-sm font-bold">{detail.screenshots[0].title}</p>
              <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">{detail.screenshots[0].description}</p>
            </figcaption>
          </figure>
          <figure className="surface-card overflow-hidden">
            <div className="relative aspect-[16/9] overflow-hidden bg-[#09151b] p-4 sm:p-6">
              <div className="mb-5 flex gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400/70" /><span className="h-2 w-2 rounded-full bg-amber-300/70" /><span className="h-2 w-2 rounded-full bg-emerald-300/70" /></div>
              <div className="space-y-3 font-mono text-[10px] text-emerald-300/80">
                <div className="h-2 w-2/3 rounded bg-emerald-300/30" />
                <div className="h-2 w-full rounded bg-slate-400/15" />
                <div className="h-2 w-5/6 rounded bg-slate-400/15" />
                <div className="grid grid-cols-3 gap-2 pt-2"><span className="h-12 rounded border border-emerald-300/20 bg-emerald-300/5" /><span className="h-12 rounded border border-white/10 bg-white/5" /><span className="h-12 rounded border border-emerald-300/20 bg-emerald-300/5" /></div>
              </div>
              <span className="absolute bottom-4 right-4 rounded-full border border-emerald-300/20 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-emerald-300/70">sanitized view</span>
            </div>
            <figcaption className="p-5">
              <p className="mb-1 text-sm font-bold">{detail.screenshots[1].title}</p>
              <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">{detail.screenshots[1].description}</p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="02 / System design" title="Architecture diagram" />
        <ArchitectureDiagram detail={detail} />
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <SanitizedReport detail={detail} />
        <div>
          <SectionHeading eyebrow="03 / Verification" title="Testing methodology" />
          <div className="space-y-3">
            {detail.methodology.map((step, index) => (
              <div key={step.title} className="surface-card flex gap-4 p-5">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] font-mono text-xs font-bold text-[var(--accent)]">0{index + 1}</span>
                <div><h3 className="mb-1 text-sm font-bold">{step.title}</h3><p className="text-xs leading-relaxed text-[var(--color-text-muted)]">{step.detail}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-card overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">04 / Ownership</p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What I personally contributed</h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">Clear ownership matters in security work. These are the decisions and deliverables I directly handled for this project.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {detail.contribution.map((item) => (
              <li key={item} className="flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
                <Icon name="check" size={16} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" />{item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-[var(--border)] pt-6">
        <a href={study.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-90"><Icon name="github" size={15} /> View source</a>
        <a href="/portfolio" className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--accent)]/50"><Icon name="layout" size={15} /> More projects</a>
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;
