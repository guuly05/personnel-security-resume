import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '../components/Icon.tsx';
import { CASE_STUDIES } from './Portfolio.tsx';
import { PROJECT_DETAILS, type ProjectDetail } from '../data/projectDetails.ts';
import { timelineEntryForProject } from '../data/projectTimeline.ts';

const MetaPill: React.FC<{ children: React.ReactNode; accent?: boolean }> = ({ children, accent }) => (
  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] leading-none ${accent
    ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/25'
    : 'bg-[var(--surface-soft)] text-[var(--color-text-muted)] border border-[var(--border)]'}`}>
    {children}
  </span>
);

const SectionHeading: React.FC<{ eyebrow: string; title: string; children?: React.ReactNode }> = ({ eyebrow, title, children }) => (
  <div className="case-study-section-heading mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
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
  <div className="space-y-5">
    <p className="max-w-4xl text-sm leading-relaxed text-[var(--color-text-muted)]">{detail.architectureSummary}</p>
    <div className="space-y-5">
      {detail.architecture.map((flow, flowIndex) => (
        <article key={flow.title} className="architecture-flow-card">
          <header className="architecture-flow-heading">
            <span className="architecture-flow-index">0{flowIndex + 1}</span>
            <div>
              <h3>{flow.title}</h3>
              <p>{flow.description}</p>
            </div>
          </header>
          <div className="architecture-flow-steps" role="list" aria-label={`${flow.title} flow`}>
            {flow.steps.map((step, stepIndex) => (
              <React.Fragment key={`${flow.title}-${step.name}`}>
                <article className="architecture-flow-node" role="listitem">
                  <span className="architecture-flow-node-index">STEP {String(stepIndex + 1).padStart(2, '0')}</span>
                  <p className="architecture-flow-technology">{step.technology}</p>
                  <h4>{step.name}</h4>
                  <p className="architecture-flow-detail">{step.detail}</p>
                  {step.boundary && <span className="architecture-boundary">{step.boundary}</span>}
                </article>
                {stepIndex < flow.steps.length - 1 && (
                  <div className="architecture-flow-connector" aria-hidden="true">
                    <span>{flow.connections[stepIndex] ?? 'data flow'}</span>
                    <Icon name="arrow-right" size={17} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </article>
      ))}
    </div>
    <p className="architecture-flow-legend">Arrows show the main request or data handoff. Boundary labels mark local-only processing, browser-to-server transitions, or external services.</p>
  </div>
);

const ProjectEvidence: React.FC<{ detail: ProjectDetail }> = ({ detail }) => (
  <div className="surface-card p-6 sm:p-8">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">Evidence</p>
        <h2 className="text-2xl font-bold tracking-tight">Evidence snapshot</h2>
      </div>
      <div className="rounded-xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] p-2.5 text-[var(--accent)]" title="Evidence and scope">
        <Icon name="info" size={18} />
      </div>
    </div>
    <p className="mb-5 text-sm leading-relaxed text-[var(--color-text-muted)]">{detail.reportIntro}</p>
    <div className="overflow-hidden rounded-lg border border-[var(--border)]">
      {detail.reportRows.map((row) => (
        <div key={row.label} className="grid grid-cols-1 items-center gap-1 border-b border-[var(--border)] px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:gap-3">
          <span className="text-xs text-[var(--color-text-muted)]">{row.label}</span>
          <span className="text-xs font-semibold text-[var(--color-text)] sm:text-right">{row.value}</span>
          <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold tracking-[0.18em] ${row.status === 'PASS'
            ? 'bg-emerald-500/10 text-emerald-400'
            : row.status === 'REVIEW' ? 'bg-amber-500/10 text-amber-400' : 'bg-sky-500/10 text-sky-400'}`}>
            {row.status === 'PASS' ? 'IMPLEMENTED' : row.status === 'INFO' ? 'DOCUMENTED' : row.status}
          </span>
        </div>
      ))}
    </div>
    <pre className="mt-5 overflow-x-auto rounded-lg border border-[var(--border)] bg-[#071016] p-4 font-mono text-[11px] leading-relaxed text-emerald-300/90"><code>{detail.reportExcerpt}</code></pre>
    <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]">{detail.evidenceNote}</p>
  </div>
);

const ProjectDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const study = CASE_STUDIES.find((entry) => entry.id === slug);
  const detail = study ? PROJECT_DETAILS[study.id] : undefined;
  const timelineEntry = study ? timelineEntryForProject(study.id) : undefined;

  if (!study || !detail) {
    return (
      <div className="surface-card p-8 text-center sm:p-12">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">Project not found</p>
        <h1 className="mb-5 text-3xl font-bold">That case study is unavailable.</h1>
        <a href="/portfolio" className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)]">
          <Icon name="arrow-left" size={15} /> Back to portfolio
        </a>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="editorial-page project-detail-page w-full space-y-10 lg:space-y-14">
      <a href="/portfolio" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--accent)] transition hover:gap-3">
        <Icon name="arrow-left" size={14} /> Back to all case studies
      </a>

      <header className="surface-card relative overflow-hidden p-6 sm:p-8 lg:p-12">
        <div className="relative z-10 max-w-4xl">
          <div className="mb-5 flex flex-wrap gap-2">
            <MetaPill accent>{study.type}</MetaPill>
            <MetaPill>{study.status}</MetaPill>
            <MetaPill>{timelineEntry?.period ?? study.year}</MetaPill>
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">{study.title}</h1>
          <p className="mb-6 max-w-3xl text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">{study.subtitle}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-2"><Icon name="briefcase" size={14} className="text-[var(--accent)]" /> {study.role}</span>
            <span className="inline-flex items-center gap-2"><Icon name="calendar-days" size={14} className="text-[var(--accent)]" /> Timeline: {timelineEntry?.period ?? study.year}</span>
          </div>
          {timelineEntry && <p className="mt-4 max-w-3xl border-l-2 border-[var(--accent)]/50 pl-4 text-sm leading-relaxed text-[var(--color-text-muted)]">{timelineEntry.description}</p>}
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
        <SectionHeading eyebrow="01 / Project evidence" title="Project visual and links" />
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <figure className="surface-card overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden bg-[var(--surface-soft)]">
              <img src={study.imageUrl} alt={study.imageAlt} className="h-full w-full object-cover" loading="eager" />
            </div>
            <figcaption className="p-5">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{detail.projectVisuals[0].kind ?? 'Project visual'}</p>
              <p className="mb-1 text-sm font-bold">{detail.projectVisuals[0].title}</p>
              <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">{detail.projectVisuals[0].description}</p>
            </figcaption>
          </figure>
          <aside className="surface-card flex flex-col p-6 sm:p-8" aria-label="Project context and evidence links">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">Project context</p>
            <h3 className="text-xl font-bold">{detail.projectVisuals[1].title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">{detail.projectVisuals[1].description}</p>
            <dl className="mt-6 space-y-3 border-t border-[var(--border)] pt-5 text-sm">
              <div className="flex flex-col gap-1"><dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">My role</dt><dd className="font-semibold">{study.role}</dd></div>
              <div className="flex flex-col gap-1"><dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Collaboration</dt><dd className="font-semibold">{study.collaboration}</dd></div>
              <div className="flex flex-col gap-1"><dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Project period</dt><dd className="font-semibold">{timelineEntry?.period ?? study.year}</dd></div>
              <div className="flex flex-col gap-1"><dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Project status</dt><dd className="font-semibold">{study.status}</dd></div>
            </dl>
            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              {study.liveUrl && <a href={study.liveUrl} target="_blank" rel="noopener noreferrer" className="landing-button landing-button-primary">Open live project <Icon name="arrow-up-right" size={14} /></a>}
              {study.githubUrl && <a href={study.githubUrl} target="_blank" rel="noopener noreferrer" className="landing-button landing-button-secondary"><Icon name="github" size={14} /> View source</a>}
            </div>
          </aside>
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="02 / System design" title="Architecture diagram" />
        <ArchitectureDiagram detail={detail} />
      </section>

      {detail.decisions.length > 0 ? <section>
        <SectionHeading eyebrow="03 / Engineering decisions" title="Choices and trade-offs" />
        <div className="grid gap-4 lg:grid-cols-2">
          {detail.decisions.map((decision, index) => (
            <article key={decision.title} className="surface-card p-6 sm:p-8">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">Decision 0{index + 1}</p>
              <h3 className="text-lg font-bold">{decision.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]"><strong className="text-[var(--color-text)]">Choice:</strong> {decision.decision}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]"><strong className="text-[var(--color-text)]">Trade-off:</strong> {decision.tradeoff}</p>
            </article>
          ))}
        </div>
      </section> : null}

      {detail.caseStudySections && detail.caseStudySections.length > 0 && (
        <section className="space-y-5">
          <SectionHeading eyebrow="04 / Implementation notes" title="Architecture, code, and techniques" />
          <div className="grid gap-5 lg:grid-cols-2">
            {detail.caseStudySections.map((section) => (
              <article key={section.title} className="surface-card p-6 sm:p-8">
                <h3 className="mb-3 text-xl font-bold tracking-tight">{section.title}</h3>
                <p className="text-sm leading-7 text-[var(--color-text-muted)]">{section.body}</p>
                {section.bullets && (
                  <ul className="mt-5 space-y-3 border-t border-[var(--border)] pt-5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-sm leading-6 text-[var(--color-text-muted)]">
                        <Icon name="check" size={15} className="mt-1 flex-shrink-0 text-[var(--accent)]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className={`grid gap-8 ${detail.methodology.length ? 'lg:grid-cols-[0.9fr_1.1fr]' : ''}`}>
        <ProjectEvidence detail={detail} />
        {detail.methodology.length > 0 && <div>
          <SectionHeading eyebrow="05 / Verification" title="Verification methodology" />
          <div className="space-y-3">
            {detail.methodology.map((step, index) => (
              <div key={step.title} className="surface-card flex gap-4 p-5">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] font-mono text-xs font-bold text-[var(--accent)]">0{index + 1}</span>
                <div><h3 className="mb-1 text-sm font-bold">{step.title}</h3><p className="text-xs leading-relaxed text-[var(--color-text-muted)]">{step.detail}</p></div>
              </div>
            ))}
          </div>
        </div>}
      </section>

      <section className="surface-card overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">06 / Ownership</p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What I personally contributed</h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">This section separates my direct contribution from broader project outcomes.</p>
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
        {study.liveUrl && <a href={study.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)] transition-colors hover:opacity-90"><Icon name="arrow-up-right" size={15} /> See live deployment</a>}
        {study.githubUrl && <a href={study.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-2.5 text-sm font-semibold transition-colors hover:border-[var(--accent)]/50"><Icon name="github" size={15} /> View source</a>}
        <a href="/portfolio" className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-2.5 text-sm font-semibold transition-colors hover:border-[var(--accent)]/50"><Icon name="layout" size={15} /> More projects</a>
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;
