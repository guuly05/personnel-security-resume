import React, { useState } from 'react';
import { CERTIFICATES } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';
import { MotionConfig, motion } from 'motion/react';

const certificateSkills: Record<string, string[]> = {
  'Cyber Threat Management': ['Threat analysis', 'Incident response', 'Network monitoring', 'Risk prioritization'],
  'Penetration Testing Professional': ['Reconnaissance', 'Vulnerability validation', 'Exploitation workflow', 'Technical reporting'],
  'Microsoft Security Essentials': ['Identity security', 'Zero trust basics', 'Cloud posture', 'Compliance awareness'],
  'Career Essentials in GitHub': ['Git workflows', 'Code collaboration', 'Repository security', 'CI/CD fundamentals'],
  'Career Essentials in Cybersecurity': ['Security fundamentals', 'Threat intelligence', 'Digital forensics', 'Defense strategy'],
  'Cloud Tech Associate Advanced Security + EDR': ['Endpoint detection and response', 'Cloud security basics', 'Threat monitoring', 'Incident triage'],
  'Access Governance & Risk Management': ['Access governance', 'Risk management', 'Least privilege strategy', 'Identity control'],
  'Claude Code 101': ['Prompt engineering', 'AI-assisted development', 'Iterative coding workflows', 'Developer productivity'],
  'Web Application Security for the Everyday Software Engineer': ['Secure coding', 'Web vulnerability mitigation', 'Application threat modeling', 'Defensive engineering'],
  'Securing MongoDB Self-Managed Networking': ['MongoDB network hardening', 'Secure connectivity', 'Attack surface reduction', 'Infrastructure security'],
};

const educationHighlights = [
  'Building a foundation across software engineering, cybersecurity, programming, and systems thinking.',
  'Founded a peer self-study group focused on accountability and JavaScript mastery.',
  'Developing leadership, mentoring, documentation, and technical communication through collaboration.',
];

const educationFocus = [
  'Network security',
  'Cryptography',
  'Operating systems',
  'Web security',
  'Secure SDLC',
  'Identity',
  'Threat response',
];

const certificateTrackOptions = [
  'All',
  'Offensive Security',
  'Identity & Governance',
  'Cloud & Infrastructure',
  'Engineering',
] as const;

type CertificateTrack = (typeof certificateTrackOptions)[number];
type CertificateCategory = Exclude<CertificateTrack, 'All'>;

const certificateTracks: Record<string, CertificateCategory> = {
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
};

const CertificatesPage: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<CertificateTrack>('All');

  const visibleCertificates = CERTIFICATES.filter(
    (certificate) =>
      activeTrack === 'All' || certificateTracks[certificate.title] === activeTrack,
  );
  const verificationCount = CERTIFICATES.filter((certificate) => certificate.verifyLink).length;

  return (
    <MotionConfig reducedMotion="user">
    <div className="editorial-page credentials-page">
      <section className="credentials-hero" aria-labelledby="credentials-title">
        <div className="credentials-hero-main">
          <span className="landing-section-index">/ learning record</span>
          <h1 id="credentials-title" className="editorial-hero-title">
            Learning that strengthens <span className="text-accent">real security work.</span>
          </h1>
          <p className="editorial-hero-copy credentials-hero-copy">
            A collection of verifiable certificates across security, cloud infrastructure,
            identity, and secure engineering—backed by focused computer science study.
          </p>
          <nav className="credentials-jump-links" aria-label="On this page">
            <a href="#certificates">
              Browse certificates <span aria-hidden="true">↓</span>
            </a>
            <a href="#education">
              Education <span aria-hidden="true">↓</span>
            </a>
          </nav>
        </div>

        <aside className="credentials-overview" aria-label="Collection overview">
          <p className="credentials-overview-label">Collection overview</p>
          <div className="credentials-stat">
            <strong>{CERTIFICATES.length}</strong>
            <span>certificates and learning paths</span>
          </div>
          <div className="credentials-stat">
            <strong>{verificationCount}</strong>
            <span>direct verification links</span>
          </div>
          <div className="credentials-stat">
            <strong>{certificateTrackOptions.length - 1}</strong>
            <span>learning tracks</span>
          </div>
        </aside>
      </section>

      <section
        id="certificates"
        className="credentials-section"
        aria-labelledby="certificates-heading"
      >
        <div className="credentials-section-heading">
          <div>
            <span className="editorial-overline">01 / Credentials</span>
            <h2 id="certificates-heading">Certificates</h2>
          </div>
          <p>Browse by focus area, then follow a verification link to the issuing platform.</p>
        </div>

        <div className="credentials-filter-block">
          <div className="credentials-filter-heading">
            <span>Filter by track</span>
            <span aria-live="polite">
              {visibleCertificates.length} of {CERTIFICATES.length} credentials
            </span>
          </div>
          <div className="credentials-filters" role="group" aria-label="Filter certificates by track">
            {certificateTrackOptions.map((track) => {
              const count =
                track === 'All'
                  ? CERTIFICATES.length
                  : CERTIFICATES.filter(
                      (certificate) => certificateTracks[certificate.title] === track,
                    ).length;

              return (
                <button
                  key={track}
                  type="button"
                  onClick={() => setActiveTrack(track)}
                  aria-pressed={activeTrack === track}
                  className="credentials-filter"
                >
                  <span>{track}</span>
                  <span className="credentials-filter-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div layout className="credentials-grid" initial={false}>
          {visibleCertificates.map((certificate, index) => {
            const track = certificateTracks[certificate.title] ?? 'Professional Development';
            const skills = certificateSkills[certificate.title] ?? [];

            return (
              <motion.article
                layout
                key={certificate.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.025 }}
                className="credential-card"
              >
                <div className="credential-card-top">
                  <div className="credential-logo" aria-hidden="true">
                    <Icon name={certificate.icon} size={25} />
                  </div>
                  <div className="credential-meta">
                    <span className="credential-issuer">{certificate.issuer}</span>
                    <span className="credential-date">{certificate.date}</span>
                  </div>
                </div>

                <span className="credential-track">{track}</span>
                <h3 className="credential-title">{certificate.title}</h3>
                <p className="credential-description">{certificate.description}</p>

                {skills.length > 0 && (
                  <ul className="credential-skills" aria-label="Skills and topics">
                    {skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                )}

                <div className="credential-card-footer">
                  <span className="credential-evidence-label">Credential evidence</span>
                  {certificate.verifyLink ? (
                    <a
                      href={certificate.verifyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Verify ${certificate.title} on the issuing platform (opens in a new tab)`}
                      className="credential-verify-link"
                    >
                      Verify certificate
                      <Icon name="external-link" size={13} />
                    </a>
                  ) : (
                    <span className="credential-unavailable">Verification link unavailable</span>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      <section
        id="education"
        className="credentials-education-section"
        aria-labelledby="education-heading"
      >
        <div className="credentials-section-heading">
          <div>
            <span className="editorial-overline">02 / Education</span>
            <h2 id="education-heading">Academic foundation</h2>
          </div>
          <p>Computer science study that connects systems fundamentals with applied security.</p>
        </div>

        <article className="credentials-campus-card">
          <figure className="credentials-campus-figure">
            <img
              src="/images/uoh.webp"
              alt="Aerial view of the University of Hargeisa campus and its landscaped walkways."
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>University of Hargeisa</span>
              <span>Hargeisa, Somaliland</span>
            </figcaption>
          </figure>

          <div className="credentials-education-copy">
            <div className="credentials-degree-meta">
              <span>Bachelor of Science</span>
              <span>2023 — 2027</span>
            </div>
            <h3>B.Sc. Computer Science</h3>
            <a
              href="https://uoh.edu.so/"
              target="_blank"
              rel="noopener noreferrer"
              className="credentials-university-link"
            >
              University of Hargeisa
              <Icon name="external-link" size={13} />
            </a>
            <p className="credentials-education-intro">
              Pursuing a computer science degree alongside practical learning in security,
              software engineering, and the systems that support both.
            </p>

            <div className="credentials-education-highlights">
              <p className="credentials-detail-label">Learning and community</p>
              <ul>
                {educationHighlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>

            <div className="credentials-education-focus">
              <p className="credentials-detail-label">Areas of focus</p>
              <ul>
                {educationFocus.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>

          </div>
        </article>
      </section>
    </div>
    </MotionConfig>
  );
};

export default CertificatesPage;
