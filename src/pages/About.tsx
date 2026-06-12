import React from 'react';
import { ABOUT_LETTER, PERSONAL_INFO, SOFT_SKILLS, HOBBIES } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';

const AboutPage: React.FC = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-7 surface-card p-10 overflow-hidden">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
            Cybersecurity-focused Technologist — Hargeisa
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              I help teams find security gaps before attackers do.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--color-text-muted)]">
              I work with network security, vulnerability assessment, penetration testing, and Linux administration. My goal is simple: make systems more reliable, easier to secure, and easier for the next person to maintain.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)]">Location</p>
                <p className="mt-3 text-lg font-semibold">{PERSONAL_INFO.location}</p>
              </div>
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)]">GPA</p>
                <p className="mt-3 text-lg font-semibold">3.6 / 4.0</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="lg:col-span-5 surface-card p-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[var(--accent)]">
            <div className="h-px flex-1 bg-[var(--accent)]/30"></div>
            About Me
            <div className="h-px flex-1 bg-[var(--accent)]/30"></div>
          </div>

          <div className="space-y-4">
            {ABOUT_LETTER.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-[var(--color-text-muted)]">
                {paragraph}
              </p>
            ))}
          </div>

          <a
            href="/assets/Guuleed-Maxamuud-Awabdi-CV-1.pdf"
            download
            className="inline-flex items-center gap-3 rounded-3xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--color-bg)] shadow-[0_0_18px_rgba(16,185,129,0.25)] transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <Icon name="file-code" size={18} />
            Download PDF CV
          </a>
        </div>
      </aside>

      <section className="lg:col-span-5 surface-card p-10">
        <h2 className="text-2xl font-semibold tracking-tight">How I work</h2>
        <p className="mt-4 text-[15px] leading-7 text-[var(--color-text-muted)]">
          I keep my work direct and practical: test systems carefully, document risks clearly, and help the people who rely on the environment understand what needs to change.
        </p>
        <div className="mt-8 space-y-4">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
            <p className="text-sm font-semibold">Clear findings</p>
            <p className="mt-2 text-[14px] text-[var(--color-text-muted)]">
              I write reports that focus on the issue, the impact, and the next step — not just a list of tool output.
            </p>
          </div>
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
            <p className="text-sm font-semibold">Hands-on tools</p>
            <p className="mt-2 text-[14px] text-[var(--color-text-muted)]">
              From Nmap and Burp Suite to Linux hardening and Python scripts, I use the tools that solve the problem, not the ones that look best on a resume.
            </p>
          </div>
        </div>
      </section>

      <section className="lg:col-span-7 surface-card p-10">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold tracking-tight">Core strengths</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {SOFT_SKILLS.map((skill) => (
              <div key={skill} className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm font-semibold text-[var(--color-text)]">
                {skill}
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--accent-soft)] p-5">
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]">Personal note</p>
            <p className="mt-3 text-[14px] leading-7 text-[var(--color-text-muted)]">
              I treat each engagement like a real system I would use myself. That means practical findings, no unnecessary jargon, and a strong focus on the people who are responsible for the environment.
            </p>
          </div>
        </div>
      </section>

      <section className="lg:col-span-12 surface-card p-10">
        <div className="grid gap-4 md:grid-cols-2">
          {HOBBIES.map((hobby) => (
            <div key={hobby} className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-4 text-sm text-[var(--color-text-muted)]">
              {hobby}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
