import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight, Copy } from 'lucide-react';
import { CASE_STUDIES } from './Portfolio.tsx';
import { PROJECT_DETAILS, type ArchitectureFlow } from '../data/projectDetails.ts';

export type ProjectPair = [string, string];

interface SystemComparisonProps {
  projectIds: ProjectPair;
  onProjectChange: (side: 0 | 1, projectId: string) => void;
}

function preferredFlowIndex(flows: ArchitectureFlow[]): number {
  const localDataFlow = flows.findIndex((flow) => /ocr|markdown source|pdf document/i.test(flow.title));
  return localDataFlow >= 0 ? localDataFlow : 0;
}

function FlowStep({ step, index }: { step: ArchitectureFlow['steps'][number]; index: number }) {
  return (
    <li className="relative rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--accent)]/25 bg-[var(--accent-soft)] font-mono text-[10px] font-bold text-[var(--accent)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{step.technology}</p>
          <h4 className="text-sm font-bold leading-snug">{step.name}</h4>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">{step.detail}</p>
          {step.boundary && (
            <span className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-md border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-2 py-1 text-[9px] font-semibold leading-relaxed text-[var(--accent)]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
              {step.boundary}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

function ProjectColumn({
  projectId,
  otherProjectId,
  side,
  onProjectChange,
}: {
  projectId: string;
  otherProjectId: string;
  side: 0 | 1;
  onProjectChange: SystemComparisonProps['onProjectChange'];
}) {
  const study = CASE_STUDIES.find((entry) => entry.id === projectId);
  const detail = study ? PROJECT_DETAILS[study.id] : undefined;
  const [selectedFlowIndex, setSelectedFlowIndex] = useState(() =>
    detail ? preferredFlowIndex(detail.architecture) : 0,
  );

  if (!study || !detail) return null;

  const activeFlow = detail.architecture[selectedFlowIndex] ?? detail.architecture[0];
  const selectId = `systems-compare-project-${side + 1}`;
  const flowSelectId = `systems-compare-flow-${side + 1}`;

  return (
    <article className="surface-card min-w-0 overflow-hidden">
      <header className="border-b border-[var(--border)] p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
            System / {side === 0 ? 'A' : 'B'}
          </p>
          <span className="rounded-md border border-[var(--border)] px-2 py-1 font-mono text-[9px] text-[var(--color-text-muted)]">{study.year}</span>
        </div>
        <label htmlFor={selectId} className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Select project
        </label>
        <select
          id={selectId}
          value={study.id}
          onChange={(event) => onProjectChange(side, event.target.value)}
          className="min-h-12 w-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
        >
          {CASE_STUDIES.map((option) => (
            <option key={option.id} value={option.id} disabled={option.id === otherProjectId}>
              {option.title}
            </option>
          ))}
        </select>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{study.type}</p>
        <p className="mt-4 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Runtime, storage & delivery</p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">{detail.architectureSummary}</p>
        <a
          href={`/portfolio/${study.id}`}
          className="mt-4 inline-flex min-h-9 items-center gap-2 text-xs font-bold text-[var(--accent)] transition-colors hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
        >
          Open full case study <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </header>

      <div className="p-5 sm:p-6">
        <div className="mb-4">
          <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--color-text-muted)]">Architecture path</p>
          <label htmlFor={flowSelectId} className="sr-only">Choose an architecture flow for {study.title}</label>
          <select
            id={flowSelectId}
            value={selectedFlowIndex}
            onChange={(event) => setSelectedFlowIndex(Number(event.target.value))}
            className="min-h-11 w-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-semibold text-[var(--color-text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
          >
            {detail.architecture.map((flow, index) => (
              <option key={`${flow.title}-${index}`} value={index}>{flow.title}</option>
            ))}
          </select>
        </div>

        {activeFlow && (
          <section aria-label={`${study.title} architecture flow: ${activeFlow.title}`}>
            <h3 className="text-base font-bold leading-snug">{activeFlow.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">{activeFlow.description}</p>
            <ol className="mt-5 space-y-2">
              {activeFlow.steps.map((step, index) => (
                <React.Fragment key={`${activeFlow.title}-${step.name}`}>
                  <FlowStep step={step} index={index} />
                  {index < activeFlow.steps.length - 1 && (
                    <li aria-hidden="true" className="flex items-center gap-2 py-0.5 pl-5 text-[9px] font-semibold text-[var(--color-text-muted)]">
                      <ArrowDown size={12} className="text-[var(--accent)]" />
                      <span>{activeFlow.connections[index] ?? 'data handoff'}</span>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ol>
          </section>
        )}

        {detail.decisions.length > 0 && (
          <section className="mt-7 border-t border-[var(--border)] pt-5" aria-label={`${study.title} engineering trade-offs`}>
            <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--color-text-muted)]">Documented decisions & trade-offs</p>
            <div className="space-y-3">
              {detail.decisions.map((decision, index) => (
                <article key={decision.title} className="border-l-2 border-[var(--accent)]/50 pl-3">
                  <h4 className="text-xs font-bold leading-relaxed">{decision.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">{decision.decision}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]"><span className="font-semibold text-[var(--color-text)]">Trade-off {String(index + 1).padStart(2, '0')}:</span> {decision.tradeoff}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

export default function SystemComparison({ projectIds, onProjectChange }: SystemComparisonProps) {
  const [copyMessage, setCopyMessage] = useState('');

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyMessage('Comparison link copied.');
    } catch {
      setCopyMessage('Copy unavailable here. Copy the comparison URL from the address bar.');
    }
  };

  const firstStudy = CASE_STUDIES.find((study) => study.id === projectIds[0]);
  const secondStudy = CASE_STUDIES.find((study) => study.id === projectIds[1]);

  return (
    <section aria-labelledby="systems-comparison-heading" className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="landing-section-index mb-1 font-mono text-[10px] uppercase tracking-[0.28em]">02 / Comparative systems</p>
          <h2 id="systems-comparison-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">Compare the architecture in context.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)]">
            Follow a project flow from input to output, inspect where trust changes, then compare the documented decisions and trade-offs.
          </p>
        </div>
        <div className="shrink-0">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex min-h-11 items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <Copy size={14} aria-hidden="true" /> Copy comparison link
          </button>
          <p role="status" className="mt-2 min-h-4 text-[10px] text-[var(--color-text-muted)]">{copyMessage}</p>
        </div>
      </div>

      <p className="sr-only" role="status">
        Comparing {firstStudy?.title ?? projectIds[0]} with {secondStudy?.title ?? projectIds[1]}.
      </p>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        {projectIds.map((projectId, index) => (
          <ProjectColumn
            key={projectId}
            projectId={projectId}
            otherProjectId={projectIds[index === 0 ? 1 : 0]}
            side={index as 0 | 1}
            onProjectChange={onProjectChange}
          />
        ))}
      </div>
    </section>
  );
}
