import React from 'react';
import { Icon } from '../components/Icon.tsx';

interface ProjectDetails {
  id: string;
  title: string;
  problem: string;
  solution: string;
  finished: string;
  techStack: Array<{ name: string }>;
  githubUrl: string;
  imageUrl: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
}

const PORTFOLIO_PROJECTS: ProjectDetails[] = [
  {
    id: 'gabay-keeper',
    title: 'Gabay Keeper',
    problem:
      'Somali oral poetry is traditionally shared orally and kept in scattered notes, recordings, or community memory. This makes it vulnerable to loss, misattribution, and separation from its cultural context. There was no dedicated digital archive that captures poems with their proper metadata (genre, xaraf, source, etc.) while keeping the data private and user‑owned.',
    solution:
      'I built a full‑stack web archive using React, TypeScript, and Tailwind CSS for the frontend, with Firebase Authentication and Firestore for user accounts and secure data storage. I implemented structured metadata fields, footnotes, tagging, and filtering by Somali alphabet letter and genre. I also integrated Tesseract.js for OCR (extracting poem text from images) and html‑to‑image for generating shareable visual poem cards. Security rules enforce strict document ownership – each poem belongs only to the authenticated user who created it.',
    finished:
      'Gabay Keeper is a private digital archive where users can preserve Somali poems with full metadata, search and filter their collection, add research footnotes, scan printed texts via OCR, and export poems as shareable visual cards. It includes a dark mode for comfortable long‑form reading and works entirely in the browser without a backend server.',
    techStack: [
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'Tailwind CSS' },
      { name: 'Firebase' },
      { name: 'Tesseract.js' },
      { name: 'html‑to‑image' },
    ],
    githubUrl: 'https://github.com/guuly05/gabay-keeper',
    imageUrl: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800&h=450&fit=crop',
    imageAlt: 'Gabay Keeper archive interface',
    imagePosition: 'left',
  },
  {
    id: 'cyber-dashboard',
    title: 'Cyber Attack Monitoring Dashboard',
    problem:
      'Security analysts often need a single‑pane view of live‑style threat indicators and quick investigation tools for IPs, domains, and CVEs. Building such a dashboard usually requires juggling multiple APIs and manual data correlation. I wanted a clean, modern dashboard that shows real‑time and simulated threats while keeping API keys secure on the server.',
    solution:
      'I created a Next.js App Router dashboard with React, TypeScript, and Tailwind CSS, using TanStack Query for data fetching and Recharts for visualisations. I built server‑side API routes to integrate AbuseIPDB (IP reputation) and the CIRCL CVE API (vulnerability details), so no API keys are exposed to the client. The UI uses Radix UI primitives and lucide‑react icons for a polished look. The app includes a live‑style threat feed, threat search, risk scoring, and detailed dialogs with safe outbound links to VirusTotal, Shodan, and AlienVault OTX.',
    finished:
      'The dashboard displays a stream of simulated malware, phishing, C2, botnet, and ransomware indicators. Users can search IPs, domains, and CVEs, see risk scores and charts, and read mitigation recommendations. When the AbuseIPDB key is configured, live IP reputation lookups are performed. The app is deployed on Vercel with production security headers and analytics.',
    techStack: [
      { name: 'Next.js' },
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'Tailwind CSS' },
      { name: 'TanStack Query' },
      { name: 'Recharts' },
      { name: 'Radix UI' },
    ],
    githubUrl: 'https://github.com/guuly05/cyber-attack-monitoring-dashboard',
    imageUrl:
      'https://github.com/user-attachments/assets/a8f31de3-ee5b-4b89-8224-951b399291a7',
    imageAlt: 'Cyber Attack Monitoring Dashboard main view',
    imagePosition: 'right',
  },
  {
    id: 'purpleprint',
    title: 'PurplePrint',
    problem:
      'Many Markdown editors and PDF converters send your content to a remote server for processing. I wanted a fully offline, private Markdown editor and PDF exporter for Android that never needs internet access and never uploads documents anywhere.',
    solution:
      'I built a native Android app using Kotlin and Jetpack Compose, following Material 3 guidelines. I wrote a custom Markdown parser (block‑level and inline) that converts raw text into an AST, then built a PDF layout engine that uses Android\'s native PdfDocument and PrintManager to render pages – all on‑device. The app adapts its layout: split editor/preview on tablets and a tabbed workflow on phones. No internet permission is declared, and Android backup is disabled by default.',
    finished:
      'PurplePrint is an offline‑first Markdown editor with live preview. You write in a focused editor, see the rendered version instantly, and export a print‑ready PDF through the Android print dialog. The UI respects dark/light themes, and all processing stays on the device – zero data leaves your phone.',
    techStack: [
      { name: 'Kotlin' },
      { name: 'Jetpack Compose' },
      { name: 'Material 3' },
      { name: 'PdfDocument' },
      { name: 'PrintManager' },
    ],
    githubUrl: 'https://github.com/guuly05/purpleprint',
    imageUrl:
      'https://github.com/user-attachments/assets/9e8811f5-5e10-497f-82c1-2a144533e6d8',
    imageAlt: 'PurplePrint editor interface',
    imagePosition: 'left',
  },
];

const PortfolioPage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Header Section */}
      <section className="surface-card p-6 md:p-10 lg:p-12 mb-12">
        <div className="max-w-4xl space-y-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold">
            Selected work
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Security and privacy projects with clear goals.
          </h1>
          <p className="text-base leading-8 text-[var(--color-text-muted)] max-w-3xl">
            These examples show the kinds of system hardening, investigation, and secure tooling work I do. Every project is built so it can be explained, reproduced, and used without extra complexity.
          </p>
        </div>
      </section>

      {/* Projects */}
      <div className="space-y-20 lg:space-y-24 px-6 md:px-10 lg:px-12 pb-12">
        {PORTFOLIO_PROJECTS.map((project, index) => (
          <section key={project.id} className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image Column */}
              <div
                className={`order-first ${
                  project.imagePosition === 'right' ? 'lg:order-last' : ''
                }`}
              >
                <div className="relative w-full bg-[var(--surface-soft)] rounded-[1.75rem] overflow-hidden aspect-video border border-[var(--border)]">
                  <img
                    src={project.imageUrl}
                    alt={project.imageAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text Column */}
              <div className="space-y-6 order-last lg:order-first">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold mb-3 block">
                    Project {index + 1}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                    {project.title}
                  </h2>
                </div>

                {/* Content Sections */}
                <div className="space-y-5">
                  {/* The Problem */}
                  <div>
                    <h3 className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold mb-2">
                      The Problem
                    </h3>
                    <p className="text-[15px] leading-7 text-[var(--color-text-muted)]">
                      {project.problem}
                    </p>
                  </div>

                  {/* How I Solved It */}
                  <div>
                    <h3 className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold mb-2">
                      How I Solved It
                    </h3>
                    <p className="text-[15px] leading-7 text-[var(--color-text-muted)]">
                      {project.solution}
                    </p>
                  </div>

                  {/* The Finished Solution */}
                  <div>
                    <h3 className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold mb-2">
                      The Finished Solution
                    </h3>
                    <p className="text-[15px] leading-7 text-[var(--color-text-muted)]">
                      {project.finished}
                    </p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="pt-2">
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech.name}
                        className="inline-block rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* GitHub Button */}
                <div className="pt-4">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-90 active:scale-95"
                  >
                    <Icon name="github" size={16} />
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Divider (not after last project) */}
            {index < PORTFOLIO_PROJECTS.length - 1 && (
              <div className="mt-20 lg:mt-24 h-px bg-gradient-to-r from-[var(--border)] via-[var(--accent)]/30 to-[var(--border)]" />
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;
