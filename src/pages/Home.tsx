import React from 'react';
import { ACHIEVEMENTS, CORE_SKILLS, PERSONAL_INFO } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';

const exploreCards = [
  { id: 'about', title: 'About Me', description: 'The story, mindset, and interests behind the work.', icon: 'user' },
  { id: 'skills', title: 'Capabilities', description: 'Frontend, backend, DevOps, automation, and security in one toolkit.', icon: 'terminal' },
  { id: 'experience', title: 'Experience', description: 'Practical work across software, systems, support, and testing.', icon: 'briefcase' },
  { id: 'certificates', title: 'Learning', description: 'Courses and credentials that keep the fundamentals sharp.', icon: 'graduation-cap' },
  { id: 'portfolio', title: 'Selected Work', description: 'Products and technical case studies built end to end.', icon: 'layout' },
  { id: 'blog', title: 'Writing', description: 'Notes on engineering, systems, security, and learning in public.', icon: 'book-open' },
];

const lanes = [
  { label: 'Frontend', detail: 'Interfaces that feel clear', icon: 'layout', tone: 'text-brand-cyan' },
  { label: 'Backend', detail: 'APIs that do the work', icon: 'server', tone: 'text-[var(--accent)]' },
  { label: 'Delivery', detail: 'Pipelines that keep shipping', icon: 'git-branch', tone: 'text-[var(--accent)]' },
];

const HomePage: React.FC = () => (
  <div className="space-y-5">
    <section className="surface-card home-hero p-6 md:p-10 lg:p-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Available for thoughtful builds
          </div>
          <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-[-0.05em] text-[var(--color-text)] md:text-7xl">
            Build the product.
            <span className="block text-accent">Ship the system.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-text-muted)] md:text-lg">
            I’m {PERSONAL_INFO.name.split(' ')[0]}, a full-stack developer who moves comfortably between polished interfaces, dependable backends, developer tooling, and the security details that make software last.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/portfolio" className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--color-bg)] transition hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] active:translate-y-px">
              See selected work <Icon name="arrow-up-right" size={16} />
            </a>
            <a href="/about" className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
              More about me <Icon name="arrow-right" size={16} />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-2"><Icon name="map-pin" size={14} className="text-[var(--accent)]" /> {PERSONAL_INFO.location}</span>
            <span className="inline-flex items-center gap-2"><Icon name="code-2" size={14} className="text-brand-cyan" /> CS student · builder · learner</span>
          </div>
        </div>

        <div className="relative">
          <div className="home-stack-card rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-5">
            <div className="mb-5 flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">How I work</p><p className="mt-1 font-display text-xl font-bold">Connect the layers</p></div>
              <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-300/80" /><span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]/80" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" /></div>
            </div>
            <div className="space-y-3">
              {lanes.map((lane, index) => (
                <React.Fragment key={lane.label}>
                  <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3.5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-soft)] ${lane.tone}`}><Icon name={lane.icon} size={19} /></div>
                    <div className="min-w-0"><p className="text-sm font-bold">{lane.label}</p><p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{lane.detail}</p></div>
                    <span className="ml-auto font-mono text-[10px] text-[var(--color-text-muted)]">0{index + 1}</span>
                  </div>
                  {index < lanes.length - 1 && <div className="ml-8 h-3 border-l border-dashed border-[var(--accent)]/40" />}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-2.5 text-xs text-[var(--color-text-muted)]"><Icon name="sparkles" size={14} className="text-[var(--accent)]" /> Security is part of the craft, not the whole headline.</div>
          </div>
        </div>
      </div>
    </section>

    <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="surface-card p-6 md:p-8">
        <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Proof points</p><h2 className="mt-2 font-display text-2xl font-bold">Small details, real leverage.</h2></div><span className="font-mono text-4xl font-bold text-[var(--accent)]">{ACHIEVEMENTS.length}</span></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">{ACHIEVEMENTS.map((achievement) => <div key={achievement.text} className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4"><p className="font-mono text-xs font-bold text-[var(--accent)]">{achievement.metric}</p><p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{achievement.text}</p></div>)}</div>
      </div>
      <div className="surface-card p-6 md:p-8">
        <p className="eyebrow">Current toolkit</p>
        <div className="mt-3 flex items-end justify-between gap-4"><h2 className="font-display text-2xl font-bold">A broad base, always getting deeper.</h2><span className="font-mono text-4xl font-bold text-[var(--accent)]">{CORE_SKILLS.length}</span></div>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-text-muted)]">The useful part is not knowing every tool. It is knowing how to choose one, learn it quickly, and make it work with the rest of the system.</p>
        <div className="mt-5 flex flex-wrap gap-2">{CORE_SKILLS.slice(0, 10).map((skill) => <span key={skill} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{skill}</span>)}</div>
      </div>
    </section>

    <section className="surface-card p-6 md:p-8">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="eyebrow">Explore</p><h2 className="mt-2 font-display text-3xl font-bold">A little more than a resume.</h2></div><p className="max-w-md text-sm leading-6 text-[var(--color-text-muted)]">Browse the work, the learning, and the ideas behind how I build.</p></div>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{exploreCards.map((card) => <a key={card.id} href={`/${card.id}`} className="explore-card group"><div className="flex items-center justify-between"><div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon name={card.icon} size={18} /></div><Icon name="arrow-up-right" size={16} className="text-[var(--color-text-muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" /></div><h3 className="mt-4 text-base font-bold text-[var(--color-text)]">{card.title}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{card.description}</p></a>)}</div>
    </section>
  </div>
);

export default HomePage;
