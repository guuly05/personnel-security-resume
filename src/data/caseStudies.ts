/* ─────────────────────────────────────────────
   Data types
   ───────────────────────────────────────────── */

export interface TechItem {
  name: string;
  group: 'frontend' | 'backend' | 'tooling' | 'platform' | 'native';
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  year: string;
  status: 'Live' | 'Open Source' | 'In Development';
  role: string;
  collaboration: string;
  imageUrl: string;
  imageAlt: string;
  challenge: string;
  approach: string;
  outcome: string;
  highlights: string[];
  techStack: TechItem[];
  githubUrl?: string;
  liveUrl?: string;
}

/* ─────────────────────────────────────────────
   Project data — restructured for case-study format
   ───────────────────────────────────────────── */

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'daryeelpass',
    title: 'DaryeelPass — Clinic Discovery & Request Prototype',
    subtitle: 'A Somali and English clinic directory and role-based appointment-request prototype for Hargeisa, designed to make clinic information easier to explore while keeping the limits of a demo clear.',
    type: 'Healthcare Access · Full-Stack PWA',
    year: '2026',
    status: 'Open Source',
    role: 'Sole Product Engineer',
    collaboration: 'Independent product design and implementation, informed by a documented product requirements brief.',
    imageUrl: '/assets/daryeelpass-clinic-directory.png',
    imageAlt: 'DaryeelPass clinic directory with bilingual controls, clinic search, service lists, and a clear notice that requests are not real appointments.',
    challenge:
      'Finding clinic contact details, services, and provider information can mean checking several sources and switching between disconnected pages. DaryeelPass explores a clearer starting point for people in Hargeisa: one bilingual directory where they can search clinic-published information, understand the source and freshness of that information, and follow a guided request workflow. The product also needs to support clinic staff and administrators without implying that a prototype can reserve real care.',
    approach:
      'Built an installable React 19 and Vite progressive web app in JavaScript, paired with an Express 5 JSON API and PostgreSQL 17 through Prisma. Designed four explicit account roles, server-side session authentication, clinic-scoped authorization, transaction-aware row-level security, validated workflows, and responsive Somali/English interfaces. Added a seeded public clinic directory, request lifecycle, availability suggestions, invitation-based staff onboarding, and system administration views.',
    outcome:
      'A runnable, documented end-to-end prototype that demonstrates how public clinic discovery, patient requests, staff queues, and system administration can fit together in one product. The repository includes the frontend, API, database schema and migrations, seed data, role and access controls, PWA setup, operational instructions, and tests. It is deliberately a portfolio demo: it does not connect to clinic scheduling systems, transmit requests to clinics, or confirm real appointments.',
    highlights: [
      'Somali and English clinic directory with search across clinic, service, and provider names, plus source and last-checked context',
      'Four role boundaries: PATIENT, STAFF, CLINIC_ADMIN, and SYSTEM_ADMIN, with role assignment controlled by signup or invitation flows',
      'Patient request lifecycle with generated suggestions clearly labeled as unconfirmed, patient-owned request history, and pending cancellation',
      'Clinic workspaces for request queues, staff-entered availability, and clinic-scoped staff invitations',
      'PostgreSQL row-level security plus API authorization, one-time first-admin setup, hashed passwords, and digest-only invitation tokens',
      'Responsive installable PWA with static asset precaching and no runtime caching for API responses',
    ],
    techStack: [
      { name: 'React 19', group: 'frontend' },
      { name: 'JavaScript ES modules', group: 'frontend' },
      { name: 'Vite 8', group: 'tooling' },
      { name: 'CSS design tokens', group: 'frontend' },
      { name: 'Express 5', group: 'backend' },
      { name: 'PostgreSQL 17', group: 'backend' },
      { name: 'Prisma 6', group: 'backend' },
      { name: 'Zod 4', group: 'backend' },
      { name: 'Workbox · PWA', group: 'platform' },
    ],
    githubUrl: 'https://github.com/guuly05/daryeelpass',
  },
  {
    id: 'samaale-general-trading',
    title: 'Samaale General Trading Co. Digital Headquarters',
    subtitle: 'A production-grade bilingual commerce and logistics website that turns a regional distributor\'s catalogue, branch network, and procurement services into a fast, discoverable, and conversion-focused digital experience.',
    type: 'Enterprise Web Platform',
    year: '2026',
    status: 'Live',
    role: 'Sole Developer & Technical Architect',
    collaboration: 'Solo implementation, with requirements shaped around Samaale’s business needs.',
    imageUrl: '/assets/samaale-case-study.svg',
    imageAlt: 'Custom illustration of Samaale General Trading Co.’s commerce and logistics website, not a browser screenshot.',
    challenge:
      'Samaale needed more than a brochure site. The business spans essential commodities, electronics and appliances, tyres, spare parts, lubricants, procurement, warehousing, freight, and customs clearing across the Horn of Africa. The website therefore had to explain a complex business clearly, help buyers find the right product or service quickly, support English and Somali audiences, and provide a trustworthy path from discovery to inquiry without sacrificing performance or accessibility.',
    approach:
      'Designed and built a typed React 19 single-page application with React Router, Tailwind CSS, Motion, a structured data layer, reusable section components, portal-based catalog and article modals, Leaflet logistics visualization, bilingual React Context state persisted with localStorage, dynamic SEO metadata, lazy rendering, vendor chunk splitting, and a Cloudflare Workers contact boundary protected by validation, Turnstile, SHA-256 rate limiting, and Resend.',
    outcome:
      'A live, production-ready company platform that presents 27+ products, seven branch locations, four logistics offerings, a regional route map, partner and testimonial proof, three news articles, WhatsApp inquiry paths, and a secure contact workflow. The system is deployed through Vercel and Cloudflare with edge delivery, serverless email handling, cache-friendly bundles, route-aware metadata, and an accessibility-focused interaction model.',
    highlights: [
      'Bilingual English/Somali experience with 11 client-side routes and persistent language preference',
      '27+ product catalogue with category navigation, search, filtering, detail modals, skeleton states, and WhatsApp inquiry handoff',
      'Interactive Leaflet logistics map connecting seven operational locations across Somaliland, Djibouti, Ethiopia, and Somalia',
      'Cloudflare Worker contact API with six-field validation, Turnstile verification, SHA-256/KV rate limiting, and Resend delivery',
      'Performance and discoverability system combining React.lazy, IntersectionObserver rendering, manual vendor chunks, prerendering, canonical metadata, sitemap, and social previews',
    ],
    techStack: [
      { name: 'React 19', group: 'frontend' },
      { name: 'TypeScript 5.8', group: 'frontend' },
      { name: 'Vite 6', group: 'tooling' },
      { name: 'Tailwind CSS 4', group: 'frontend' },
      { name: 'Motion', group: 'tooling' },
      { name: 'React Router 7', group: 'frontend' },
      { name: 'Leaflet / React-Leaflet', group: 'tooling' },
      { name: 'Cloudflare Workers', group: 'platform' },
      { name: 'Resend + Turnstile', group: 'backend' },
    ],
    liveUrl: 'https://samaale-general-trading.com',
  },
  {
    id: 'portfolio-platform',
    title: 'Full-Stack Portfolio Platform',
    subtitle: 'A production-oriented portfolio, technical blog, contact service, and calendar booking system in one typed React application.',
    type: 'Full-Stack Web Platform',
    year: '2026',
    status: 'Live',
    role: 'Sole Developer & Designer',
    collaboration: 'Solo design and implementation.',
    imageUrl: '/assets/og-preview.png',
    imageAlt: 'Custom social-preview illustration for Guuleed Maxmuud Aw Abdi’s portfolio platform, not a browser screenshot.',
    challenge:
      'A resume alone could not show the engineering behind the work. The site needed to communicate product thinking while also supporting searchable writing, protected contact, real calendar booking, and strong direct-route SEO.',
    approach:
      'Built a typed React 19 and Vite application with lightweight history routing, lazy-loaded pages, Markdown publishing, shared server validation, Google Calendar integration, Turnstile protection, durable booking storage, and a prerendered static output for every public route.',
    outcome:
      'A live portfolio platform that turns proof of engineering into a working product: 4 server workflows, 9+ public experiences, generated SEO assets, Google Meet booking, and a security-minded deployment model with no secrets in the browser.',
    highlights: [
      '9+ public experiences including portfolio, blog, booking, contact, and legal routes',
      '4 server workflows for availability, booking, management, and protected contact',
      '5+ security controls across validation, Turnstile, rate limits, headers, and idempotency',
      'Prerendered HTML, sitemap, RSS, Atom, and route-specific metadata for discoverability',
    ],
    techStack: [
      { name: 'React 19', group: 'frontend' },
      { name: 'TypeScript', group: 'frontend' },
      { name: 'Vite', group: 'tooling' },
      { name: 'Vercel Functions', group: 'platform' },
      { name: 'Google Calendar API', group: 'backend' },
      { name: 'Redis-compatible store', group: 'backend' },
      { name: 'Turnstile', group: 'tooling' },
    ],
    githubUrl: 'https://github.com/guuly05/personnel-security-resume',
    liveUrl: 'https://www.guuleedmaxamuud.dev',
  },
  {
    id: 'cyber-dashboard',
    title: 'Cyber Attack Monitoring Dashboard',
    subtitle: 'Real-time threat intelligence and investigation toolkit for security analysts.',
    type: 'Security Engineering',
    year: '2025',
    status: 'Live',
    role: 'Full-Stack Developer & Security Researcher',
    collaboration: 'Owned product direction, threat model, and end-to-end implementation.',
    imageUrl: 'https://github.com/user-attachments/assets/a8f31de3-ee5b-4b89-8224-951b399291a7',
    imageAlt: 'Cyber Attack Monitoring Dashboard showing threat feed and risk scores',
    challenge:
      'Security analysts often need a unified view of live threat indicators with quick investigation tools for IPs, domains, and CVEs — but building that usually means juggling multiple APIs and manual data correlation, with the risk of exposing API keys on the client.',
    approach:
      'Built a Next.js App Router dashboard with server-side API routes to proxy AbuseIPDB and CIRCL CVE lookups, keeping all secrets off the client. Used TanStack Query for data caching, Recharts for threat visualizations, and Radix UI primitives for an accessible, polished interface.',
    outcome:
      'A deployed, production-grade dashboard on Vercel with security headers, analytics, and a live threat feed. Users can search IPs, domains, and CVEs, view risk scores, read mitigation guidance, and follow outbound links to VirusTotal, Shodan, and AlienVault OTX.',
    highlights: [
      'Zero client-side API key exposure via server-side route proxying',
      'Live IP reputation lookups through AbuseIPDB integration',
      'Responsive dark-mode interface with production security headers',
      'Deployed on Vercel with automated CI/CD and Speed Insights',
    ],
    techStack: [
      { name: 'Next.js', group: 'frontend' },
      { name: 'React', group: 'frontend' },
      { name: 'TypeScript', group: 'frontend' },
      { name: 'Tailwind CSS', group: 'frontend' },
      { name: 'TanStack Query', group: 'tooling' },
      { name: 'Recharts', group: 'tooling' },
      { name: 'Radix UI', group: 'tooling' },
    ],
    githubUrl: 'https://github.com/guuly05/cyber-attack-monitoring-dashboard',
  },
  {
    id: 'gabay-keeper',
    title: 'Gabay Keeper',
    subtitle: 'A private digital archive for Somali oral poetry with OCR and visual export.',
    type: 'Full-Stack Web App',
    year: '2025',
    status: 'Open Source',
    role: 'Sole Developer & Designer',
    collaboration: 'Solo design and implementation.',
    imageUrl: '/assets/gabay-keeper-workflow.svg',
    imageAlt: 'Original architecture illustration showing a Somali poem moving from OCR review into a private archive and export.',
    challenge:
      'Somali oral poetry lives in scattered notes, recordings, and community memory — vulnerable to loss and misattribution. No dedicated digital archive existed that captures poems with proper metadata while keeping data private and user-owned.',
    approach:
      'Built a full-stack web archive with React, TypeScript, and Tailwind CSS on the frontend, backed by Firebase Authentication and Firestore with strict security rules enforcing per-user document ownership. Integrated Tesseract.js for OCR scanning and html-to-image for shareable visual poem cards.',
    outcome:
      'A working private archive where users preserve poems with structured metadata, filter by genre and Somali alphabet letter, add footnotes, scan printed texts via OCR, and export shareable visual cards — all running client-side with no backend server.',
    highlights: [
      'Strict Firebase Security Rules enforce per-user data ownership',
      'Client-side OCR via Tesseract.js — no data leaves the browser',
      'Visual poem card export for social sharing',
      'Dark mode optimized for long-form reading',
    ],
    techStack: [
      { name: 'React', group: 'frontend' },
      { name: 'TypeScript', group: 'frontend' },
      { name: 'Tailwind CSS', group: 'frontend' },
      { name: 'Firebase', group: 'backend' },
      { name: 'Tesseract.js', group: 'tooling' },
      { name: 'html-to-image', group: 'tooling' },
    ],
    githubUrl: 'https://github.com/guuly05/gabay-keeper',
  },
  {
    id: 'purpleprint',
    title: 'PurplePrint',
    subtitle: 'A fully offline Android Markdown editor with on-device PDF export.',
    type: 'Native Android App',
    year: '2025',
    status: 'Open Source',
    role: 'Sole Developer',
    collaboration: 'Solo product and Android implementation.',
    imageUrl: 'https://github.com/user-attachments/assets/9e8811f5-5e10-497f-82c1-2a144533e6d8',
    imageAlt: 'PurplePrint Markdown editor showing split preview',
    challenge:
      'Most Markdown editors and PDF converters send content to a remote server for processing. I wanted a fully offline, privacy-first editor for Android that never needs internet access and never uploads documents anywhere.',
    approach:
      'Built a native Android app with Kotlin and Jetpack Compose following Material 3 guidelines. Wrote a custom Markdown parser (block-level and inline) that produces an AST, then built a PDF layout engine using Android\'s native PdfDocument and PrintManager — all processing on-device. Adaptive layout uses split editor/preview on tablets and tabs on phones.',
    outcome:
      'An offline-first Markdown editor with live preview and print-ready PDF export through the Android print dialog. No internet permission is declared, Android backup is disabled by default, and all processing stays on the device.',
    highlights: [
      'Zero internet permissions — fully offline-first architecture',
      '100% on-device processing with custom AST-based parser',
      'Adaptive layout: split view on tablets, tabs on phones',
      'Material 3 dark/light theme support',
    ],
    techStack: [
      { name: 'Kotlin', group: 'native' },
      { name: 'Jetpack Compose', group: 'native' },
      { name: 'Material 3', group: 'native' },
      { name: 'PdfDocument', group: 'native' },
      { name: 'PrintManager', group: 'native' },
    ],
    githubUrl: 'https://github.com/guuly05/purpleprint',
  },
  {
    id: 'infosec-course',
    title: 'Fundamentals of Information Systems Security',
    subtitle: 'A structured open-source curriculum covering the full security lifecycle — from the CIA triad to penetration testing and incident response.',
    type: 'Security Education',
    year: '2026',
    status: 'Open Source',
    role: 'Curriculum Author & Maintainer',
    collaboration: 'Authored and maintained the curriculum repository.',
    imageUrl: '/assets/infosec-curriculum-map.svg',
    imageAlt: 'Original curriculum map illustration connecting security foundations, guided labs, case studies, and frameworks.',
    challenge:
      'Most cybersecurity learning resources are either too scattered across platforms or too shallow to be used as a standalone university-level course. Students and self-directed learners needed a single, structured repository that covers theory, labs, case studies, and real certification alignment — all in one place.',
    approach:
      'Designed a 9-chapter curriculum mapped to CompTIA Security+, CISSP, and GIAC GSEC domains. Each chapter pairs written content with hands-on Kali Linux lab exercises and real-world case studies (SolarWinds, WannaCry, EternalBlue). Supplemented with policy templates, industry framework guides (NIST CSF, MITRE ATT&CK, OWASP Top 10), and a curated reading list of nine security books.',
    outcome:
      'A comprehensive, version-controlled course repository delivering 45–65 hours of structured learning. Students walk away with practical Kali Linux skills, completed risk assessments, a full security policy framework, and the foundational knowledge needed for entry-level cybersecurity certifications.',
    highlights: [
      '9 structured chapters with matching lab exercises and chapter quizzes',
      '7 real-world case studies including SolarWinds, WannaCry & Log4j',
      'Aligned with CompTIA Security+, CISSP, SSCP, and GIAC GSEC',
      '5 industry security frameworks: NIST CSF, MITRE ATT&CK, ISO 27001, OWASP, PCI DSS',
      'Includes 9 policy templates for professional security documentation',
    ],
    techStack: [
      { name: 'Kali Linux', group: 'platform' },
      { name: 'Wireshark', group: 'tooling' },
      { name: 'Metasploit', group: 'tooling' },
      { name: 'Nmap', group: 'tooling' },
      { name: 'OpenSSL', group: 'tooling' },
      { name: 'Python', group: 'backend' },
    ],
    githubUrl: 'https://github.com/guuly05/information-security-lessons',
  },
];

/* ─────────────────────────────────────────────
   Subcomponents
   ───────────────────────────────────────────── */

