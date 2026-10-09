import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { CASE_STUDIES } from './Portfolio.tsx';
import { SYSTEMS_PRACTICES, type SystemsEvidence, type SystemsPractice } from '../data/systemsAtlas.ts';

const firstPractice = SYSTEMS_PRACTICES[0];

function practiceFromLocation(): string {
  if (typeof window === 'undefined') return firstPractice.id;
  const requestedId = window.location.hash.replace(/^#/, '');
  return SYSTEMS_PRACTICES.some((practice) => practice.id === requestedId)
    ? requestedId
    : firstPractice.id;
}

function EvidenceCard({
  evidence,
  index,
}: {
  evidence: SystemsEvidence;
  index: number;
}) {
  const study = CASE_STUDIES.find((entry) => entry.id === evidence.projectId);
  if (!study) return null;

  return (
    <article className="surface-card group relative overflow-hidden p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div>
          <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Project / {String(index + 1).padStart(2, '0')} · {study.type}
          </p>
          <h3 className="max-w-xl text-lg font-bold leading-snug tracking-tight sm:text-xl">
            {study.title}
          </h3>
        </div>
        <span className="hidden rounded-md border border-[var(--border)] px-2 py-1 font-mono text-[10px] text-[var(--color-text-muted)] sm:inline-flex">
          {study.year}
        </span>
      </div>

      <div className="space-y-4">
        <EvidenceField label="Constraint" value={evidence.constraint} />
        <EvidenceField label="Design choice" value={evidence.decision} accent />
        <EvidenceField label="Trade-off" value={evidence.tradeoff} />
      </div>

      <a
        href={`/portfolio/${study.id}`}
        className="mt-6 inline-flex min-h-10 items-center gap-2 border-t border-[var(--border)] pt-4 text-xs font-bold text-[var(--color-text)] transition-colors hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
      >
        Read the case study
        <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </article>
  );
}

function EvidenceField({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={accent ? 'border-l-2 border-[var(--accent)] pl-3' : 'pl-3'}>
      <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="text-sm leading-relaxed text-[var(--color-text)]">{value}</p>
    </div>
  );
}

export default function SystemsAtlasPage() {
  const [activePracticeId, setActivePracticeId] = useState(firstPractice.id);
  const shouldReduceMotion = useReducedMotion();
  const activePractice = useMemo(
    () => SYSTEMS_PRACTICES.find((practice) => practice.id === activePracticeId) ?? firstPractice,
    [activePracticeId],
  );
  const linkedProjects = activePractice.evidence
    .map((item) => CASE_STUDIES.find((study) => study.id === item.projectId))
    .filter((study) => study !== undefined);

  useEffect(() => {
    const syncPracticeFromLocation = () => setActivePracticeId(practiceFromLocation());
    syncPracticeFromLocation();
    window.addEventListener('hashchange', syncPracticeFromLocation);
    window.addEventListener('popstate', syncPracticeFromLocation);
    return () => {
      window.removeEventListener('hashchange', syncPracticeFromLocation);
      window.removeEventListener('popstate', syncPracticeFromLocation);
    };
  }, []);

  const selectPractice = (id: string) => {
    const url = new URL(window.location.href);
    url.hash = id;
    window.history.pushState({ ...window.history.state, systemsPractice: id }, '', `${url.pathname}${url.search}${url.hash}`);
    setActivePracticeId(id);
  };

  return (
    <div className="editorial-page systems-atlas-page w-full">
      <header className="systems-atlas-hero surface-card relative overflow-hidden p-6 sm:p-8 lg:p-12">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              Engineering systems / field notes
            </p>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              The decisions behind <span className="text-accent">the systems.</span>
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
              Follow a single engineering practice across different products. Each connection is grounded in a documented project decision, its context, and the trade-off it introduced.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div>
              <p className="font-mono text-3xl font-bold text-[var(--accent)]">{String(SYSTEMS_PRACTICES.length).padStart(2, '0')}</p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Engineering lenses</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-bold text-[var(--accent)]">{String(CASE_STUDIES.length).padStart(2, '0')}</p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Documented projects</p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-24 right-[-4rem] h-64 w-64 rounded-full border border-[var(--accent)]/10 sm:h-80 sm:w-80" aria-hidden="true" />
      </header>

      <section aria-labelledby="systems-lens-heading" className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="landing-section-index mb-1 font-mono text-[10px] uppercase tracking-[0.28em]">01 / Select a practice</p>
            <h2 id="systems-lens-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">One constraint, several systems.</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--color-text-muted)]">
            Choose a lens to trace the decisions and trade-offs across the projects where it appears.
          </p>
        </div>

        <div role="group" aria-label="Choose an engineering practice" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {SYSTEMS_PRACTICES.map((practice, index) => {
            const isSelected = activePractice.id === practice.id;
            return (
              <button
                key={practice.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => selectPractice(practice.id)}
                className={`group min-h-36 border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:p-5 ${isSelected
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-soft)]'}`}
              >
                <span className={`mb-5 block font-mono text-[10px] font-bold tracking-[0.22em] ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--color-text-muted)]'}`}>
                  LENS / {String(index + 1).padStart(2, '0')}
                </span>
                <span className="block text-base font-bold leading-snug tracking-tight">{practice.title}</span>
                <span className="mt-2 block text-xs leading-relaxed text-[var(--color-text-muted)]">{practice.summary}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="systems-practice-title" className="space-y-5">
        <p role="status" className="sr-only">
          {activePractice.title}: connected to {linkedProjects.length} documented projects.
        </p>
        <motion.div
          key={activePractice.id}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.22, ease: 'easeOut' }}
          className="grid gap-5 lg:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.28fr)]"
        >
          <aside className="systems-atlas-practice surface-card flex flex-col p-6 sm:p-8">
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
              02 / Current lens · {String(SYSTEMS_PRACTICES.indexOf(activePractice) + 1).padStart(2, '0')}
            </p>
            <h2 id="systems-practice-title" className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {activePractice.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">{activePractice.summary}</p>

            <div className="mt-7 border-t border-[var(--border)] pt-5">
              <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">Pattern across projects</p>
              <p className="text-sm leading-relaxed text-[var(--color-text)]">{activePractice.pattern}</p>
            </div>

            <div className="mt-auto flex items-center gap-3 border-t border-[var(--border)] pt-5 text-xs text-[var(--color-text-muted)]">
              <span className="font-mono text-lg font-bold text-[var(--accent)]">{String(linkedProjects.length).padStart(2, '0')}</span>
              <span>documented project connections</span>
              <ArrowRight size={14} className="ml-auto text-[var(--accent)]" aria-hidden="true" />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-3 px-1">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">Practice</span>
              <span className="h-px flex-1 bg-[var(--border)]" aria-hidden="true" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--accent)]">Project evidence</span>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {activePractice.evidence.map((item, index) => (
                <EvidenceCard key={`${activePractice.id}-${item.projectId}`} evidence={item} index={index} />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="flex flex-col gap-5 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-xs leading-relaxed text-[var(--color-text-muted)]">
          These connections summarize documented implementation choices. Each project page contains its own architecture, evidence, and contribution details.
        </p>
        <a href="/portfolio" className="landing-button landing-button-secondary shrink-0">
          Explore all case studies <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </footer>
    </div>
  );
}
