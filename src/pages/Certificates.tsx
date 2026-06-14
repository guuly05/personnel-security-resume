import React, { useState } from 'react';
import { CERTIFICATES } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';
import { AnimatePresence, motion } from 'motion/react';

type CertificateInsight = {
  summary: string;
  skills: string[];
};

const certificateInsights: Record<string, CertificateInsight> = {
  'Cyber Threat Management': {
    summary:
      'Covered the practical flow of threat detection, incident handling, risk prioritization, and defensive monitoring. The certificate helped connect network activity, attacker behavior, and response decisions into one investigation mindset.',
    skills: ['Threat analysis', 'Incident response', 'Network monitoring', 'Risk prioritization'],
  },
  'Penetration Testing Professional': {
    summary:
      'Focused on the offensive security lifecycle, from scoping and reconnaissance through exploitation, post-exploitation, documentation, and responsible reporting. It strengthened the way I approach tests as structured engagements instead of isolated tool usage.',
    skills: ['Reconnaissance', 'Vulnerability validation', 'Exploitation workflow', 'Technical reporting'],
  },
  'Microsoft Security Essentials': {
    summary:
      'Introduced core security, compliance, identity, and cloud protection concepts inside the Microsoft ecosystem. The content reinforced zero-trust thinking, access control, and the importance of protecting users, devices, and data together.',
    skills: ['Identity security', 'Zero trust basics', 'Cloud posture', 'Compliance awareness'],
  },
  'Career Essentials in GitHub': {
    summary:
      'Built a stronger foundation in GitHub workflows, repository collaboration, code review, automation, and secure development practices. It gave me a clearer sense of how version control fits into real software delivery.',
    skills: ['Git workflows', 'Code collaboration', 'Repository security', 'CI/CD fundamentals'],
  },
  'Career Essentials in Cybersecurity': {
    summary:
      'Provided a broad cybersecurity foundation across common threats, defensive controls, investigations, and professional security roles. It helped sharpen the baseline knowledge I use when moving between networking, systems, and application security.',
    skills: ['Security fundamentals', 'Threat intelligence', 'Digital forensics', 'Defense strategy'],
  },
};

const educationHighlights = [
  'Pursuing a B.Sc. in Computer Science with a strong focus on software engineering, security, programming, and practical systems thinking.',
  'Founded a successful student group focused on self-study, peer accountability, and JavaScript mastery, helping classmates learn consistently outside formal lectures.',
  'Built a wider academic and technical network by collaborating with motivated students, exchanging resources, and learning how to communicate technical ideas clearly.',
  'Strengthened leadership, mentoring, documentation, and problem-solving skills through group learning, coursework, and independent technical projects.',
];

const universityImageUrl =
  'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=600&h=400&fit=crop';

const CertificatesPage: React.FC = () => {
  const [isEducationOpen, setIsEducationOpen] = useState(false);

  return (
    <div className="space-y-4">
      <section className="surface-card p-6 md:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-cyan">
                Credentials
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-[var(--color-text)] md:text-5xl">
                Security learning with <span className="text-gradient">practical outcomes.</span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
                These certifications support the way I work: understand the risk, validate it carefully, document it clearly, and keep improving through structured learning.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <p className="font-display text-4xl font-bold accent-text">{CERTIFICATES.length}</p>
                <p className="mt-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                  Certificates
                </p>
              </div>
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <p className="font-display text-4xl font-bold text-[var(--brand-purple)]">20+</p>
                <p className="mt-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                  Skills Mapped
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {CERTIFICATES.map((cert) => {
              const insight = certificateInsights[cert.title];

              return (
                <article
                  key={cert.title}
                  className="group border-l-2 border-[var(--accent)] bg-[var(--surface-soft)] p-5 md:p-6 rounded-r-[1.5rem]"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] accent-text transition-transform group-hover:scale-110">
                      <Icon name={cert.icon} size={24} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          {cert.verifyLink ? (
                            <a
                              href={cert.verifyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/title"
                            >
                              <h3 className="text-xl font-bold leading-tight text-[var(--color-text)] transition-colors group-hover/title:accent-text">
                                {cert.title}
                              </h3>
                            </a>
                          ) : (
                            <h3 className="text-xl font-bold leading-tight text-[var(--color-text)]">{cert.title}</h3>
                          )}
                          <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-[var(--brand-purple)]">
                            {cert.issuer}
                          </p>
                        </div>

                        <div className="flex flex-row items-center gap-3 md:flex-col md:items-end md:gap-2">
                          <span className="rounded bg-[var(--accent-soft)] px-2 py-1 font-mono text-[10px] font-bold uppercase accent-text">
                            {cert.date}
                          </span>
                          {cert.verifyLink && (
                            <a
                              href={cert.verifyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[var(--brand-purple)] transition-colors hover:accent-text"
                            >
                              <Icon name="external-link" size={10} />
                              Verify Authenticity
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 grid gap-5 border-t border-[var(--border)] pt-5 lg:grid-cols-[1fr_0.8fr]">
                        <div className="space-y-4">
                          <div>
                            <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-brand-cyan">
                              Certificate Content
                            </p>
                            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                              {insight?.summary ?? cert.description}
                            </p>
                          </div>
                          <div>
                            <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                              Personal Takeaway
                            </p>
                            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                              {cert.description}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                          <p className="mb-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--brand-purple)]">
                            Skills Gained
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(insight?.skills ?? []).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="surface-card overflow-hidden">
          <button
            type="button"
            onClick={() => setIsEducationOpen((current) => !current)}
            className="flex w-full flex-col gap-6 p-6 text-left md:flex-row md:items-center md:justify-between md:p-8"
            aria-expanded={isEducationOpen}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--brand-purple)]/10 text-[var(--brand-purple)]">
                <Icon name="graduation-cap" size={28} />
              </div>
              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--brand-purple)]">
                  Education
                </p>
                <h3 className="mt-2 text-2xl font-bold leading-tight text-[var(--color-text)]">B.Sc. Computer Science</h3>
                <p className="mt-1 text-sm italic text-[var(--color-text-muted)]">University of Hargeisa</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-[var(--brand-purple)]">2023 - 2027</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">4 Years</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                {isEducationOpen ? 'Hide' : 'Expand'}
                <Icon
                  name="chevron-right"
                  size={14}
                  className={`transition-transform ${isEducationOpen ? 'rotate-90 text-[var(--brand-purple)]' : ''}`}
                />
              </span>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isEducationOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="grid gap-6 border-t border-[var(--border)] p-6 md:p-8 lg:grid-cols-[1fr_1.2fr]">
                  <div className="rounded-lg overflow-hidden border border-[var(--border)]">
                    <img
                      src={universityImageUrl}
                      alt="University of Hargeisa"
                      className="w-full h-full object-cover aspect-video"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--accent)] mb-3">University Experience</p>
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted)] mb-4">
                      My time at the University of Hargeisa has shaped my technical foundation and professional mindset. I've built strong peer relationships, led learning initiatives, and consistently applied coursework to real security challenges.
                    </p>
                    <div className="space-y-2">
                      {educationHighlights.map((highlight) => (
                        <div key={highlight} className="flex gap-2 text-xs text-[var(--color-text-muted)]">
                          <span className="text-[var(--accent)] flex-shrink-0 mt-0.5">•</span>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="surface-card p-6 md:p-8">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[var(--accent)]">
            Learning Focus
          </p>
          <div className="mt-5 space-y-4">
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
              The university program is designed around real-world security and engineering challenges, giving me a solid foundation across systems thinking, secure development, and technology leadership.
            </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {['Network Security', 'Cryptography', 'Operating Systems', 'Web Security', 'Secure SDLC', 'Identity', 'Threat Response'].map((course) => (
              <span
                key={course}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]"
              >
                {course}
              </span>
            ))}
          </div>
          </div>
          <div className="mt-6 border-t border-[var(--border)] pt-6">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-[var(--brand-purple)] mb-2">Next Steps</p>
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
              The certificates and degree work support the same direction: stronger fundamentals, better documentation, more confident collaboration, and practical security judgment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CertificatesPage;
