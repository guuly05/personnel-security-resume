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
  'Cloud Tech Associate Advanced Security + EDR': {
    summary:
      'Focused on practical cloud-era protection with endpoint detection and response concepts, emphasizing stronger defensive visibility and faster incident reaction.',
    skills: ['Endpoint detection and response', 'Cloud security basics', 'Threat monitoring', 'Incident triage'],
  },
  'Access Governance & Risk Management': {
    summary:
      'Covered identity governance and risk-centered access decisions, with emphasis on least privilege, access lifecycle control, and governance-aligned security planning.',
    skills: ['Access governance', 'Risk management', 'Least privilege strategy', 'Identity control'],
  },
  'Claude Code 101': {
    summary:
      'Introduced practical AI-assisted engineering workflows, including prompt design, iterative refinement, and faster implementation with clear technical direction.',
    skills: ['Prompt engineering', 'AI-assisted development', 'Iterative coding workflows', 'Developer productivity'],
  },
  'Web Application Security for the Everyday Software Engineer': {
    summary:
      'Strengthened day-to-day secure development practices by focusing on common web vulnerabilities, defensive coding choices, and risk-aware implementation habits.',
    skills: ['Secure coding', 'Web vulnerability mitigation', 'Application threat modeling', 'Defensive engineering'],
  },
  'Securing MongoDB Self-Managed Networking': {
    summary:
      'Focused on hardening self-managed MongoDB network exposure through secure connectivity patterns, segmentation, and safer infrastructure-level database access.',
    skills: ['MongoDB network hardening', 'Secure connectivity', 'Attack surface reduction', 'Infrastructure security'],
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

const certificateTracks = {
  'Cyber Threat Management': 'Offensive Security',
  'Penetration Testing Professional': 'Offensive Security',
  'Microsoft Security Essentials': 'Identity & Governance',
  'Career Essentials in GitHub': 'Engineering',
  'Career Essentials in Cybersecurity': 'Offensive Security',
  'Cloud Tech Associate Advanced Security + EDR': 'Cloud & Infrastructure',
  'Access Governance & Risk Management': 'Identity & Governance',
  'Claude Code 101': 'Engineering',
  'Web Application Security for the Everyday Software Engineer': 'Offensive Security',
  'Securing MongoDB Self-Managed Networking': 'Cloud & Infrastructure',
} as const;

const certificateTrackOptions = [
  'All',
  'Offensive Security',
  'Identity & Governance',
  'Cloud & Infrastructure',
  'Engineering',
] as const;

type CertificateTrack = (typeof certificateTrackOptions)[number];

const mappedSkillsCount = new Set(Object.values(certificateInsights).flatMap((entry) => entry.skills)).size;

const CertificatesPage: React.FC = () => {
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<CertificateTrack>('All');
  const [expandedCertificates, setExpandedCertificates] = useState<Record<string, boolean>>({});

  const visibleCertificates = CERTIFICATES.filter((cert) => {
    if (activeTrack === 'All') {
      return true;
    }

    return certificateTracks[cert.title as keyof typeof certificateTracks] === activeTrack;
  });

  const toggleCertificateExpanded = (title: string) => {
    setExpandedCertificates((current) => ({
      ...current,
      [title]: !current[title],
    }));
  };

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
                <p className="font-display text-4xl font-bold text-[var(--brand-purple)]">{mappedSkillsCount}</p>
                <p className="mt-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                  Skills Mapped
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 md:p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
                  Browse by track
                </p>
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest accent-text">
                  Showing {visibleCertificates.length} of {CERTIFICATES.length}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {certificateTrackOptions.map((track) => (
                  <button
                    key={track}
                    type="button"
                    onClick={() => setActiveTrack(track)}
                    className={`rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      activeTrack === track
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] accent-text'
                        : 'border-[var(--border)] bg-[var(--surface-soft)] text-[var(--color-text-muted)] hover:border-[var(--accent)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {track}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              layout
              className="grid gap-4 md:grid-cols-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {visibleCertificates.map((cert, index) => {
              const insight = certificateInsights[cert.title];
              const track = certificateTracks[cert.title as keyof typeof certificateTracks] ?? 'General';
              const isExpanded = Boolean(expandedCertificates[cert.title]);

              return (
                <motion.article
                  layout
                  key={cert.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: index * 0.03 }}
                  className="group rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5 transition-colors hover:border-[var(--accent)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] accent-text transition-transform group-hover:scale-110">
                        <Icon name={cert.icon} size={24} />
                      </div>

                      <div className="min-w-0">
                        {cert.verifyLink ? (
                          <a
                            href={cert.verifyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/title"
                          >
                            <h3 className="text-lg font-bold leading-tight text-[var(--color-text)] transition-colors group-hover/title:accent-text">
                              {cert.title}
                            </h3>
                          </a>
                        ) : (
                          <h3 className="text-lg font-bold leading-tight text-[var(--color-text)]">{cert.title}</h3>
                        )}
                        <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-[var(--brand-purple)]">
                          {cert.issuer}
                        </p>
                        <p className="mt-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                          {track}
                        </p>
                      </div>
                    </div>

                    <span className="rounded bg-[var(--accent-soft)] px-2 py-1 font-mono text-[10px] font-bold uppercase accent-text">
                      {cert.date}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(insight?.skills ?? []).slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                    <button
                      type="button"
                      onClick={() => toggleCertificateExpanded(cert.title)}
                      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] transition-colors hover:accent-text"
                    >
                      {isExpanded ? 'Hide details' : 'View details'}
                      <Icon
                        name="chevron-right"
                        size={12}
                        className={`transition-transform ${isExpanded ? 'rotate-90 text-[var(--brand-purple)]' : ''}`}
                      />
                    </button>

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

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-4 border-t border-[var(--border)] pt-4">
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
            </motion.div>
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
