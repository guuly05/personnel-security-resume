import React, { useState, useRef, useEffect } from 'react';
import { CORE_SKILLS, TOOLSET, COURSES } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';
import { motion } from 'motion/react';

const toolSvgMap: Record<string, string> = {
  'Nessus': '/images/SVG/Nessus-Professional-FullColor-RGB.svg',
  'Burp Suite': '/images/SVG/burpsuite.svg',
  'Wireshark': '/images/SVG/wireshark.svg',
  'Metasploit': '/images/SVG/metasploit.svg',
  'Nmap': '/images/SVG/nmap.svg',
  'Git/GitHub': '/images/SVG/github-wordmark.svg',
  'Bash': '/images/SVG/bash.svg',
  'Python': '/images/SVG/python.svg',
  'Java': '/images/SVG/java.svg',
  'Linux': '/images/SVG/linux.svg',
  'VMware': '/images/SVG/vmware-workstation.svg',
  'VirtualBox': '/images/SVG/virtualbox.svg',
};

const SkillsPage: React.FC = () => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const courseListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (courseListRef.current && !courseListRef.current.contains(event.target as Node)) {
        setActiveCourseId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-7 surface-card p-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold">Core coursework</span>
            <h2 className="text-3xl font-semibold">College courses that shaped my security focus.</h2>
            <p className="max-w-2xl text-[15px] leading-8 text-[var(--color-text-muted)]">
              I keep building on the basics. These classes taught me how to think clearly about systems, code safely, and speak about risk without vague language.
            </p>
          </div>

          <div ref={courseListRef} className="space-y-4">
            {COURSES.map((course) => {
              const expanded = activeCourseId === course.id;
              return (
                <motion.button
                  key={course.id}
                  type="button"
                  layout
                  onClick={() => setActiveCourseId(expanded ? null : course.id)}
                  className={`w-full rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition-shadow duration-300 ${
                    expanded ? 'shadow-[0_20px_60px_rgba(16,185,129,0.14)]' : 'hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_8px_24px_rgba(16,185,129,0.12)]">
                      <Icon name={course.icon} size={22} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                        <span className={`text-[10px] uppercase tracking-[0.35em] ${expanded ? 'text-[var(--accent)]' : 'text-[var(--color-text-muted)]'}`}>
                          {expanded ? 'Open' : 'Expand'}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{course.description}</p>
                    </div>
                  </div>

                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-6 space-y-4"
                    >
                      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold mb-2">Challenge</p>
                        <p className="text-sm leading-7 text-[var(--color-text-muted)]">{course.challenge}</p>
                      </div>
                      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold mb-2">What I learned</p>
                        <p className="text-sm leading-7 text-[var(--color-text-muted)]">{course.learned}</p>
                      </div>
                      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--color-text-muted)] font-semibold mb-2">Takeaways</p>
                        <ul className="list-disc list-inside space-y-2 text-sm leading-7 text-[var(--color-text-muted)]">
                          {course.outcomes.map((outcome) => (
                            <li key={outcome}>{outcome}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <aside className="lg:col-span-5 space-y-6">
        <div className="surface-card p-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold">
              <span className="h-px flex-1 bg-[var(--accent)]/30" />
              Technical toolset
              <span className="h-px flex-1 bg-[var(--accent)]/30" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TOOLSET.map((tool) => {
                const svgPath = toolSvgMap[tool];

                return (
                  <div key={tool} className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-center transition hover:border-[var(--accent)]">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[var(--surface)] text-[var(--accent)] shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
                      {svgPath ? (
                        <img src={svgPath} alt={tool} className="h-7 w-7 object-contain" loading="lazy" />
                      ) : (
                        <Icon name={tool === 'Linux' ? 'terminal' : tool.toLowerCase()} size={24} />
                      )}
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">{tool}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="surface-card p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold">Capabilities</p>
                <h3 className="mt-3 text-2xl font-semibold">Practical security skills</h3>
              </div>
              <div className="rounded-3xl bg-[var(--surface-soft)] px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[var(--color-text-muted)]">
                Mostly hands-on
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {CORE_SKILLS.map((skill) => (
                <span key={skill} className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <section className="lg:col-span-12 surface-card p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-soft)] p-6 text-[var(--color-text-muted)]">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold">Stable execution</p>
            <p className="mt-4 text-sm leading-7">I keep deliverables easy to read and easy to act on — especially when security reports need follow-up work.</p>
          </div>
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-soft)] p-6 text-[var(--color-text-muted)]">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold">Team-ready output</p>
            <p className="mt-4 text-sm leading-7">My findings are written for defenders, operators, and developers, not just for one security tool.</p>
          </div>
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-soft)] p-6 text-[var(--color-text-muted)]">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold">Ongoing growth</p>
            <p className="mt-4 text-sm leading-7">I stay current through reading, practice, and by building small scripts that automate repetitive security work.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkillsPage;
