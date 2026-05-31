import React from 'react';
import { Icon } from '../components/Icon.tsx';

type Project = {
  title: string;
  githubUrl: string;
  media:
    | {
        type: 'image';
        src: string;
        alt: string;
        frame: 'wide' | 'phone';
      }
    | {
        type: 'placeholder';
        alt: string;
      };
  problem: string;
  solutionParts: Array<string | { tech: string }>;
  finished: string;
};

const projects: Project[] = [
  {
    title: 'Gabay Keeper',
    githubUrl: 'https://github.com/guuly05/gabay-keeper',
    media: {
      type: 'placeholder',
      alt: 'Archive interface placeholder for Gabay Keeper',
    },
    problem:
      'Somali oral poetry is often preserved through memory, recordings, and scattered notes. I built this because that kind of cultural material can be lost, misattributed, or separated from the context that gives it meaning.',
    solutionParts: [
      'I built a full-stack web archive with ',
      { tech: 'React' },
      ', ',
      { tech: 'TypeScript' },
      ', and ',
      { tech: 'Tailwind CSS' },
      ' on the frontend, with ',
      { tech: 'Firebase' },
      ' handling authentication and secure Firestore storage. The archive supports structured metadata, footnotes, tags, filtering by Somali alphabet letter and genre, OCR through ',
      { tech: 'Tesseract.js' },
      ', and shareable poem cards generated with ',
      { tech: 'html-to-image' },
      '. Security rules keep each poem owned by the authenticated user who created it.',
    ],
    finished:
      'Gabay Keeper is a private browser-based archive for preserving Somali poems with full metadata. Users can search and filter their collection, add research notes, scan printed text from images, export visual poem cards, and read comfortably in dark mode without needing a separate backend server.',
  },
  {
    title: 'Cyber Attack Monitoring Dashboard',
    githubUrl: 'https://github.com/guuly05/cyber-attack-monitoring-dashboard',
    media: {
      type: 'image',
      src: 'https://github.com/user-attachments/assets/a8f31de3-ee5b-4b89-8224-951b399291a7',
      alt: 'Cyber Attack Monitoring Dashboard main interface preview',
      frame: 'wide',
    },
    problem:
      'Security analysts need a single place to watch threat indicators and quickly investigate IPs, domains, and CVEs. I wanted to avoid the usual back-and-forth between separate tools while keeping sensitive API keys on the server.',
    solutionParts: [
      'I created a ',
      { tech: 'Next.js' },
      ' App Router dashboard with ',
      { tech: 'React' },
      ', ',
      { tech: 'TypeScript' },
      ', and ',
      { tech: 'Tailwind CSS' },
      ', using ',
      { tech: 'TanStack Query' },
      ' for data fetching and ',
      { tech: 'Recharts' },
      ' for visualizations. Server-side API routes integrate AbuseIPDB and the CIRCL CVE API, while ',
      { tech: 'Radix UI' },
      ' primitives support the dialogs and interface states.',
    ],
    finished:
      'The dashboard shows a live-style stream of malware, phishing, C2, botnet, and ransomware indicators. Users can search threat data, review risk scores and charts, open detailed investigation dialogs, and use mitigation guidance with safe outbound links to tools such as VirusTotal, Shodan, and AlienVault OTX.',
  },
  {
    title: 'PurplePrint',
    githubUrl: 'https://github.com/guuly05/purpleprint',
    media: {
      type: 'image',
      src: 'https://github.com/user-attachments/assets/9e8811f5-5e10-497f-82c1-2a144533e6d8',
      alt: 'PurplePrint Android Markdown editor screenshot',
      frame: 'phone',
    },
    problem:
      'Many Markdown editors and PDF converters process documents on remote servers. I wanted an Android editor that works fully offline, respects private writing, and never needs to upload a document anywhere.',
    solutionParts: [
      'I built a native Android app with ',
      { tech: 'Kotlin' },
      ' and ',
      { tech: 'Jetpack Compose' },
      ' following ',
      { tech: 'Material 3' },
      ' patterns. I wrote a custom Markdown parser that turns text into an AST, then built a local PDF engine with Android ',
      { tech: 'PdfDocument' },
      ' and ',
      { tech: 'PrintManager' },
      '. The layout adapts between split editor/preview on tablets and a tabbed workflow on phones.',
    ],
    finished:
      'PurplePrint is an offline-first Markdown editor with live preview and PDF export through the Android print dialog. It supports light and dark themes, keeps all processing on the device, and avoids internet permission entirely so writing stays local.',
  },
];

const TechBadge: React.FC<{ children: string }> = ({ children }) => (
  <code className="mx-1 inline-flex rounded-lg border border-brand-cyan/20 bg-brand-cyan/10 px-2 py-0.5 font-mono text-[0.72rem] font-bold text-brand-cyan">
    {children}
  </code>
);

const ProjectMedia: React.FC<{ project: Project }> = ({ project }) => {
  if (project.media.type === 'placeholder') {
    return (
      <div
        aria-label={project.media.alt}
        className="aspect-video w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-4 shadow-[inset_0_0_40px_rgba(34,211,238,0.08)]"
      >
        <div className="flex h-full flex-col justify-between rounded-[1.25rem] border border-brand-cyan/20 bg-gradient-to-br from-brand-cyan/10 via-white/[0.03] to-brand-purple/10 p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-cyan">
              Gabay Archive
            </span>
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-cyan/80" />
              <span className="h-2 w-2 rounded-full bg-brand-purple/80" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_0.8fr]">
            <div className="space-y-3">
              <div className="h-3 w-2/3 rounded-full bg-white/20" />
              <div className="h-3 w-full rounded-full bg-white/10" />
              <div className="h-3 w-5/6 rounded-full bg-white/10" />
              <div className="h-3 w-3/4 rounded-full bg-white/10" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-brand-bg/60 p-4">
              <p className="mb-3 text-[10px] font-mono uppercase tracking-widest text-brand-purple">
                Metadata
              </p>
              <div className="space-y-2">
                {['Genre', 'Xaraf', 'Source'].map((item) => (
                  <div key={item} className="flex items-center justify-between gap-3">
                    <span className="text-[10px] text-slate-500">{item}</span>
                    <span className="h-2 w-16 rounded-full bg-white/15" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <span className="self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-300">
            16:9 placeholder
          </span>
        </div>
      </div>
    );
  }

  if (project.media.frame === 'phone') {
    return (
      <div className="flex w-full justify-center rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
        <div className="aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-[2rem] border border-white/15 bg-slate-950 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
          <img
            src={project.media.src}
            alt={project.media.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03]">
      <img
        src={project.media.src}
        alt={project.media.alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

const PortfolioPage: React.FC = () => {
  return (
    <div className="glass-card overflow-hidden bg-gradient-to-br from-brand-cyan/5 via-transparent to-brand-purple/5">
      <header className="px-6 py-10 md:px-10 md:py-12 lg:px-12">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-cyan">
          Selected Work
        </span>
        <div className="mt-4 max-w-3xl">
          <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
            Projects built around <span className="text-gradient">culture, security, and privacy.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400">
            A focused look at three projects I built to solve problems I cared about: preserving Somali poetry, making threat investigation easier, and keeping Markdown-to-PDF work private on Android.
          </p>
        </div>
      </header>

      <div className="border-t border-white/10">
        {projects.map((project, index) => {
          const reversed = index % 2 === 1;

          return (
            <section
              key={project.title}
              aria-labelledby={`${project.title.toLowerCase().replace(/\s+/g, '-')}-title`}
              className="border-b border-white/10 px-6 py-10 last:border-b-0 md:px-10 md:py-14 lg:px-12"
            >
              <div className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <ProjectMedia project={project} />

                <div className="max-w-xl">
                  <span className="mb-4 inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500">
                    <span className="h-px w-8 bg-brand-cyan/40" />
                    Project {index + 1}
                  </span>
                  <h3
                    id={`${project.title.toLowerCase().replace(/\s+/g, '-')}-title`}
                    className="font-display text-3xl font-bold leading-tight text-white md:text-4xl"
                  >
                    {project.title}
                  </h3>
                  <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-300 md:text-base">
                    <p>{project.problem}</p>
                    <p>
                      {project.solutionParts.map((part, partIndex) =>
                        typeof part === 'string' ? (
                          <React.Fragment key={partIndex}>{part}</React.Fragment>
                        ) : (
                          <TechBadge key={`${part.tech}-${partIndex}`}>{part.tech}</TechBadge>
                        ),
                      )}
                    </p>
                    <p>{project.finished}</p>
                  </div>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-3 rounded-xl bg-brand-cyan px-5 py-3 text-sm font-bold text-brand-bg shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-transform hover:scale-105 active:scale-95"
                  >
                    <Icon name="github" size={18} />
                    View on GitHub
                  </a>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioPage;
