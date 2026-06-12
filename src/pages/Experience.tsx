import React from 'react';
import { EXPERIENCES } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';

const ExperiencePage: React.FC = () => {
  return (
    <div className="surface-card p-8 md:p-10 overflow-hidden">
      <div className="space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold">Real engagements</span>
          <h2 className="text-4xl font-semibold md:text-5xl">Security work that moves beyond theory.</h2>
          <p className="max-w-3xl text-[15px] leading-8 text-[var(--color-text-muted)]">
            These engagements show how I turn discovery into clear action: find the issue, explain it clearly, and give the team a strong next step.
          </p>
        </div>

        <div className="space-y-6">
          {EXPERIENCES.map((experience) => (
            <div key={experience.title} className="grid gap-6 lg:grid-cols-[280px_1fr] rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-soft)] p-6 md:p-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/15 bg-[var(--accent-soft)] px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[var(--accent)]">
                  <Icon name="clock" size={14} />
                  {experience.dateRange}
                </div>
                <h3 className="text-2xl font-semibold">{experience.title}</h3>
                <p className="text-[12px] uppercase tracking-[0.4em] text-[var(--color-text-muted)]">{experience.company}</p>
              </div>

              <ul className="space-y-4">
                {experience.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-sm leading-7 text-[var(--color-text-muted)]">
                    <Icon name="chevron-right" size={18} className="text-[var(--accent)] flex-shrink-0 mt-1" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;
