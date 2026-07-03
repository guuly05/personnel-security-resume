import React from 'react';
import { ACHIEVEMENTS, CORE_SKILLS, PERSONAL_INFO } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';

const exploreCards = [
  {
    id: 'about',
    title: 'About Me',
    description: 'More personal background, live stats card, and hobby/media sections.',
    icon: 'user',
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Technical capabilities, tools, and cybersecurity strengths.',
    icon: 'terminal',
  },
  {
    id: 'experience',
    title: 'Experience',
    description: 'Practical work across penetration testing and IT support.',
    icon: 'briefcase',
  },
  {
    id: 'certificates',
    title: 'Certificates',
    description: 'Credential timeline and learning outcomes in security.',
    icon: 'graduation-cap',
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: 'Project work and technical case-study highlights.',
    icon: 'layout',
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'Direct channels for collaboration and opportunities.',
    icon: 'mail',
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="space-y-5">
      <section className="surface-card p-6 md:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-cyan">Landing</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-[var(--color-text)] md:text-6xl">
              {PERSONAL_INFO.name}
            </h1>
            <p className="mt-3 text-lg font-semibold text-[var(--accent)]">{PERSONAL_INFO.title}</p>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
              I focus on vulnerability assessment, penetration testing, and secure engineering practice. I am currently pursuing a B.Sc. in Computer Science while continuing to build practical cybersecurity skills through projects and structured learning.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#about"
                className="rounded-3xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--color-bg)] shadow-[0_0_18px_rgba(16,185,129,0.25)] transition hover:scale-[1.02]"
              >
                Explore About Me
              </a>
              <a
                href="#contact"
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--accent)]"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
              <p className="font-display text-3xl font-bold accent-text">{ACHIEVEMENTS.length}</p>
              <p className="mt-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                Key Achievements
              </p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
              <p className="font-display text-3xl font-bold text-[var(--brand-purple)]">{CORE_SKILLS.length}</p>
              <p className="mt-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                Core Skills
              </p>
            </div>
            <div className="col-span-2 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-cyan">Current Study</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                B.Sc. Computer Science, University of Hargeisa
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="surface-card p-6 md:p-8">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-cyan">Achievements</p>
          <div className="mt-5 space-y-3">
            {ACHIEVEMENTS.map((achievement) => (
              <div
                key={achievement.text}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
              >
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--accent)]">{achievement.metric}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{achievement.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-6 md:p-8">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-[var(--brand-purple)]">Skill Snapshot</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {CORE_SKILLS.slice(0, 10).map((skill) => (
              <span
                key={skill}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-card p-6 md:p-8">
        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-[var(--accent)]">Explore Website</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {exploreCards.map((card) => (
            <a key={card.id} href={`#${card.id}`} className="explore-card">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] accent-text">
                <Icon name={card.icon} size={18} />
              </div>
              <h3 className="mt-3 text-base font-bold text-[var(--color-text)]">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{card.description}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
