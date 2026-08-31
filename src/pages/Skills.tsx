import React, { useCallback, useState, useRef, useEffect } from 'react';
import { CORE_SKILLS, TOOLSET, COURSES } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { useFocusTrap } from '../hooks/useFocusTrap.ts';

// Extended type definitions for enriched skill metrics & tool context
export interface SkillCategory {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  badge: string;
  skills: {
    name: string;
    level: number; // Percentage 0 - 100
    experience: string;
    tags: string[];
  }[];
}

export interface DetailedTool {
  name: string;
  category: string;
  svgPath?: string;
  fallbackIcon: string;
  mastery: string;
  description: string;
  scenarios: string[];
  associatedProjects: string[];
}

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

const DETAILED_TOOLS: DetailedTool[] = [
  {
    name: 'Burp Suite',
    category: 'Offensive Security',
    svgPath: '/images/SVG/burpsuite.svg',
    fallbackIcon: 'shield-alert',
    mastery: 'Advanced',
    description: 'Premier web application security testing toolkit used for interception proxy, vulnerability scanning, and manual payload construction.',
    scenarios: [
      'Intercepting & tampering with HTTP requests and responses to test authentication mechanisms.',
      'Constructing custom Burp Intruder brute-force payloads & fuzzing parameters for SQLi/XSS.',
      'Automating active & passive vulnerability scanning on target web endpoints.'
    ],
    associatedProjects: ['Vulnerability Assessment - Family Business App', 'Web Security Audit']
  },
  {
    name: 'Nessus',
    category: 'Vulnerability Assessment',
    svgPath: '/images/SVG/Nessus-Professional-FullColor-RGB.svg',
    fallbackIcon: 'shield-check',
    mastery: 'Advanced',
    description: 'Industry-standard vulnerability scanner for automated discovery of network host flaws, unpatched software, and configuration compliance.',
    scenarios: [
      'Configuring credentialed & non-credentialed network vulnerability scans across subnet IP ranges.',
      'Filtering false positives and prioritizing critical/high CVE findings for executive reporting.',
      'Conducting system compliance audits against CIS benchmarks.'
    ],
    associatedProjects: ['Internal Infrastructure Security Scan', 'Family Business Network Audit']
  },
  {
    name: 'Wireshark',
    category: 'Network Forensics',
    svgPath: '/images/SVG/wireshark.svg',
    fallbackIcon: 'network',
    mastery: 'Proficient',
    description: 'Deep-packet network protocol analyzer used to inspect packet captures (PCAP), analyze traffic anomalies, and trace packet flows.',
    scenarios: [
      'Filtering PCAP streams using display filters (tcp.flags, ip.src, http.request) during incident investigations.',
      'Analyzing unencrypted protocol leaks (HTTP, FTP, Telnet) and inspecting TLS handshake exchanges.',
      'Troubleshooting latency, packet drops, and ARP spoofing attempts.'
    ],
    associatedProjects: ['Network Traffic Analysis Lab', 'Protocol Security Benchmark']
  },
  {
    name: 'Metasploit',
    category: 'Offensive Security',
    svgPath: '/images/SVG/metasploit.svg',
    fallbackIcon: 'terminal',
    mastery: 'Proficient',
    description: 'Penetration testing framework used for exploit verification, payload creation, and post-exploitation validation.',
    scenarios: [
      'Generating custom Meterpreter payloads and stagers for authorized proof-of-concept exploits.',
      'Running msfconsole auxiliary scanners to verify unpatched service vulnerabilities.',
      'Demonstrating privilege escalation vectors in lab environments.'
    ],
    associatedProjects: ['Family Business Pen Test', 'Lab Exploit Verification']
  },
  {
    name: 'Nmap',
    category: 'Reconnaissance',
    svgPath: '/images/SVG/nmap.svg',
    fallbackIcon: 'search',
    mastery: 'Expert',
    description: 'Network discovery and vulnerability probing utility for host discovery, port scanning, OS detection, and NSE scripting.',
    scenarios: [
      'Executing stealth SYN scans (-sS), service versioning (-sV), and default script scans (-sC).',
      'Writing and executing custom Nmap Scripting Engine (NSE) scripts to detect vulnerable services.',
      'Mapping network topographies and active IP subnets.'
    ],
    associatedProjects: ['Subnet Reconnaissance', 'Family Business Pen Test']
  },
  {
    name: 'React',
    category: 'Full-Stack Development',
    fallbackIcon: 'layout',
    mastery: 'Advanced',
    description: 'Modern component-driven UI library for building reactive, fast, and interactive user interfaces.',
    scenarios: [
      'Building dynamic Single Page Applications (SPAs) with state management, hooks, and clean component hierarchy.',
      'Implementing glassmorphic dark-mode dashboards with fluid Motion animation effects.',
      'Integrating REST & GraphQL backend services into secure frontend views.'
    ],
    associatedProjects: ['Cybersecurity Portfolio & Resume Hub', 'Family Business Internal Portal']
  },
  {
    name: 'TailwindCSS',
    category: 'Full-Stack Development',
    fallbackIcon: 'code-2',
    mastery: 'Advanced',
    description: 'Utility-first CSS framework for rapidly assembling modern, responsive, and aesthetically stunning user interfaces.',
    scenarios: [
      'Crafting fluid responsive layouts (mobile to ultra-wide) with custom color tokens and HSL palettes.',
      'Creating dark/light mode themes with smooth CSS variable transitions.',
      'Styling micro-animations, glassmorphism containers, and interactive card states.'
    ],
    associatedProjects: ['Cybersecurity Portfolio Website']
  },
  {
    name: 'Express.js',
    category: 'Backend Development',
    fallbackIcon: 'cpu',
    mastery: 'Proficient',
    description: 'Fast, unopinionated backend web application framework for Node.js powering API endpoints and serverless routes.',
    scenarios: [
      'Designing RESTful API routes with JWT authentication middleware and CORS policies.',
      'Implementing rate-limiting, Helmet security headers, and input sanitization to block OWASP Top 10 flaws.',
      'Handling serverless proxy functions for Vercel/Netlify integrations.'
    ],
    associatedProjects: ['Secure Contact API Endpoint', 'AI Security Bot Serverless Backend']
  },
  {
    name: 'Firebase',
    category: 'Full-Stack & Cloud',
    fallbackIcon: 'globe',
    mastery: 'Proficient',
    description: 'Google Cloud backend platform offering real-time databases, authentication, serverless functions, and hosting.',
    scenarios: [
      'Configuring Firebase Authentication (OAuth, Email/Password) with secure Security Rules.',
      'Storing dynamic application state in Firestore real-time collections.',
      'Deploying web applications via Firebase Hosting CLI.'
    ],
    associatedProjects: ['Interactive Real-Time App Sandbox']
  },
  {
    name: 'Vercel / Netlify',
    category: 'Cloud Deployment & DevOps',
    fallbackIcon: 'external-link',
    mastery: 'Advanced',
    description: 'Modern edge hosting platforms for continuous deployment, automated git previews, serverless functions, and analytics.',
    scenarios: [
      'Configuring automated CI/CD deployment pipelines directly from GitHub repository commits.',
      'Deploying edge functions and serverless backend handlers with environment variable protection.',
      'Monitoring performance metrics with Vercel Speed Insights.'
    ],
    associatedProjects: ['Cybersecurity Resume & Portfolio Live Hosting']
  },
  {
    name: 'Resend',
    category: 'Full-Stack Services',
    fallbackIcon: 'mail',
    mastery: 'Proficient',
    description: 'Modern developer-first transactional email API for secure notification delivery and automated contact messaging.',
    scenarios: [
      'Integrating secure serverless contact forms with HTML email templates and DKIM/SPF domain verification.',
      'Automating instant email notifications upon user submissions.'
    ],
    associatedProjects: ['Portfolio Contact Form Integration']
  },
  {
    name: 'Python',
    category: 'Automation & Security',
    svgPath: '/images/SVG/python.svg',
    fallbackIcon: 'file-code',
    mastery: 'Advanced',
    description: 'Versatile programming language for building custom security exploits, network parsers, and backend scripts.',
    scenarios: [
      'Writing custom socket & Scapy scripts for automated port probing and packet manipulation.',
      'Parsing JSON/XML vulnerability reports into formatted executive summaries.',
      'Integrating AI LLM APIs (@google/genai) for automated intelligence triage.'
    ],
    associatedProjects: ['Automated Security Log Parser', 'Portfolio AI Integration']
  },
  {
    name: 'Git / GitHub',
    category: 'DevOps & Version Control',
    svgPath: '/images/SVG/github-wordmark.svg',
    fallbackIcon: 'github',
    mastery: 'Advanced',
    description: 'Distributed version control system and repository hosting platform for collaborative software development.',
    scenarios: [
      'Managing feature branches, pull requests, and code reviews.',
      'Configuring GitHub Actions for automated linting, security scanning, and deployments.',
      'Securing repository secrets and maintaining clean commit histories.'
    ],
    associatedProjects: ['All Open-Source & Private Repositories']
  },
  {
    name: 'Bash / Shell Scripting',
    category: 'System Hardening & DevOps',
    svgPath: '/images/SVG/bash.svg',
    fallbackIcon: 'terminal',
    mastery: 'Advanced',
    description: 'Unix shell command language for task automation, system hardening, and server administration.',
    scenarios: [
      'Writing Linux system hardening scripts to audit SSH configs, firewall rules, and active services.',
      'Automating backup, log rotation, and batch security scans.'
    ],
    associatedProjects: ['Linux Hardening Scripts', 'IT Support Automation']
  }
];

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Security Practice',
    subtitle: 'Vulnerability assessment, application testing, network visibility, and safer systems',
    icon: 'shield-check',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Specialization',
    skills: [
      { name: 'Vulnerability Assessment (Nessus, Nmap)', level: 92, experience: 'Hands-on audits & enterprise reports', tags: ['Offensive', 'CVEs', 'Compliance'] },
      { name: 'Penetration Testing (Burp Suite, Metasploit)', level: 88, experience: 'Web app interception, parameter fuzzing & exploit verification', tags: ['OWASP', 'Burp', 'Exploits'] },
      { name: 'Network Security & Protocol Analysis (Wireshark)', level: 85, experience: 'PCAP packet inspection & protocol hardening', tags: ['PCAP', 'Protocols', 'Forensics'] },
      { name: 'Linux System Hardening & Security Audit', level: 90, experience: 'SSH configuration, permission auditing & bash automation', tags: ['Linux', 'Hardening', 'Bash'] },
      { name: 'Risk Management & Security Documentation', level: 86, experience: 'Actionable executive reports & developer remediation guidance', tags: ['GRC', 'Reporting', 'Risk'] }
    ]
  },
  {
    title: 'Frontend & Full-Stack Development',
    subtitle: 'Modern interfaces, API architecture, serverless backends, and cloud deployments',
    icon: 'code-2',
    color: 'from-blue-500 to-indigo-600',
    badge: 'Core Craft',
    skills: [
      { name: 'React (v19) & TypeScript', level: 90, experience: 'SPAs, custom hooks, dynamic UI components & state', tags: ['Frontend', 'React', 'TS'] },
      { name: 'Tailwind CSS & Modern UI Styling', level: 94, experience: 'Glassmorphism, dark/light themes, dynamic animation & design tokens', tags: ['UI/UX', 'Tailwind', 'CSS'] },
      { name: 'Express.js & Node Backend APIs', level: 84, experience: 'REST APIs, Helmet security middleware, CORS & JWT auth', tags: ['Backend', 'Express', 'API'] },
      { name: 'Firebase (Auth, Firestore, Cloud Functions)', level: 82, experience: 'Real-time database, security rules & OAuth integration', tags: ['Cloud', 'NoSQL', 'Auth'] },
      { name: 'Vercel / Netlify Cloud Edge Deployments', level: 88, experience: 'CI/CD GitHub pipelines, environment config & speed optimization', tags: ['DevOps', 'Vercel', 'Edge'] },
      { name: 'Resend Email API & Serverless Services', level: 85, experience: 'Automated contact messaging & DKIM/SPF verification', tags: ['APIs', 'Resend', 'Email'] }
    ]
  },
  {
    title: 'DevOps, Automation & Systems',
    subtitle: 'Delivery workflows, scripting, systems code, and developer tooling',
    icon: 'cpu',
    color: 'from-purple-500 to-pink-600',
    badge: 'Delivery',
    skills: [
      { name: 'Python (Automation & Security Scripting)', level: 88, experience: 'Socket programming, report generation & AI integrations', tags: ['Python', 'Automation', 'AI'] },
      { name: 'JavaScript (ES6+) & Web Standards', level: 90, experience: 'Asynchronous workflows, DOM manipulation & client performance', tags: ['Web', 'JS', 'Async'] },
      { name: 'Bash & Shell Automation', level: 86, experience: 'Cron jobs, system scripts & server setup automation', tags: ['CLI', 'Shell', 'DevOps'] },
      { name: 'Java Programming', level: 80, experience: 'Object-oriented architecture & JVM memory management', tags: ['OOP', 'Java', 'Enterprise'] },
      { name: 'C Programming & Systems Memory', level: 78, experience: 'Low-level pointer management & buffer memory analysis', tags: ['C', 'Low-Level', 'Memory'] }
    ]
  }
];

const SkillsPage: React.FC = () => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<DetailedTool | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const courseListRef = useRef<HTMLDivElement | null>(null);
  const toolDialogRef = useRef<HTMLDivElement | null>(null);
  const closeToolDialog = useCallback(() => setSelectedTool(null), []);
  useFocusTrap(Boolean(selectedTool), toolDialogRef, closeToolDialog);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (courseListRef.current && !courseListRef.current.contains(event.target as Node)) {
        setActiveCourseId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = ['All', 'Frontend & Full-Stack', 'Backend & Cloud', 'DevOps & Tooling', 'Security Practice'];
  
  const filteredTools = activeCategory === 'All' 
    ? DETAILED_TOOLS 
    : DETAILED_TOOLS.filter((tool) => {
      const category = tool.category.toLowerCase();
      if (activeCategory === 'Frontend & Full-Stack') return category.includes('frontend') || category.includes('full-stack');
      if (activeCategory === 'Backend & Cloud') return category.includes('backend') || category.includes('cloud') || category.includes('service');
      if (activeCategory === 'DevOps & Tooling') return category.includes('devops') || category.includes('tooling') || category.includes('deployment') || category.includes('automation') || category.includes('system');
      if (activeCategory === 'Security Practice') return category.includes('security') || category.includes('vulnerability') || category.includes('reconnaissance') || category.includes('forensics') || category.includes('offensive');
      return true;
    });

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <section className="surface-card p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3.5 py-1 text-xs font-semibold text-[var(--accent)]">
            <Icon name="layers" size={14} />
            <span>Full-Stack · DevOps · Secure Engineering</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Skills & Technical Proficiency</h1>
          <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
            A practical breakdown of how I build and ship: frontend systems, backend APIs, cloud services, CI/CD workflows, automation, and the cybersecurity practices that strengthen the whole stack.
          </p>
        </div>
      </section>

      {/* 1. REACTIVE & MOVING MASTERY BARS SECTION */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold">Interactive Breakdown</span>
            <h2 className="text-2xl font-bold mt-1">The stack, broken down.</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span>Interactive animated indicators</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-1">
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat.title} className="surface-card p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-md`}>
                    <Icon name={cat.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{cat.title}</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">{cat.subtitle}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[var(--surface-soft)] border border-[var(--border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                  {cat.badge}
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {cat.skills.map((skill) => (
                  <div key={skill.name} className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]/50 p-4 transition hover:border-[var(--accent)]/50">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs font-bold text-[var(--accent)] font-mono">{skill.level}%</span>
                    </div>
                    
                    {/* Animated Reactive Progress Bar */}
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-[var(--surface-soft)] border border-[var(--border)]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-teal-400 relative overflow-hidden"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      >
                        {/* Moving shine glow effect inside bar */}
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                      </motion.div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-[var(--color-text-muted)] italic">{skill.experience}</span>
                      <div className="flex gap-1">
                        {skill.tags.map(t => (
                          <span key={t} className="rounded bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 text-[9px] font-mono text-[var(--color-text-muted)]">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. INTERACTIVE TOOLSET GRID & USAGE CONTEXT (MODAL / HOVER CARDS) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold">Interactive Toolset</span>
            <h2 className="text-2xl font-bold mt-1">Tools I reach for in real work.</h2>
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  activeCategory === c
                    ? 'bg-[var(--accent)] text-white shadow-md'
                    : 'bg-[var(--surface-soft)] text-[var(--color-text-muted)] hover:text-white border border-[var(--border)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {filteredTools.map((tool) => {
            const svgPath = tool.name in toolSvgMap ? toolSvgMap[tool.name] : tool.svgPath;
            const isSelected = selectedTool?.name === tool.name;

            return (
              <motion.button
                key={tool.name}
                type="button"
                whileHover={{ scale: 1.04, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTool(tool)}
                aria-expanded={isSelected}
                aria-controls={isSelected ? 'tool-detail-dialog' : undefined}
                aria-haspopup="dialog"
                aria-label={`${tool.name}: view usage details`}
                className={`group relative flex flex-col items-center justify-between rounded-2xl border p-4 text-center transition-all duration-300 ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                    : 'border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--accent)]/60 hover:shadow-lg'
                }`}
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white p-2.5 shadow-sm border border-slate-200 dark:border-slate-700 transition-transform group-hover:scale-110">
                  {svgPath ? (
                    <img src={svgPath} alt={tool.name} className="h-8 w-8 object-contain max-h-full max-w-full" loading="lazy" />
                  ) : (
                    <Icon name={tool.fallbackIcon} size={26} className="text-slate-800" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text)]">{tool.name}</p>
                  <span className="mt-1 inline-block rounded-full bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 text-[9px] font-medium text-[var(--accent)]">
                    {tool.mastery}
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  <span>View Details</span>
                  <Icon name="chevron-right" size={10} />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* TOOL USAGE DETAIL MODAL / EXPANDED CARD */}
        <AnimatePresence>
          {selectedTool && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
              onMouseDown={(event) => { if (event.target === event.currentTarget) closeToolDialog(); }}
            >
              <div ref={toolDialogRef} id="tool-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="tool-detail-title" tabIndex={-1} className="surface-card relative max-h-[90vh] w-full max-w-3xl overflow-y-auto border-2 border-[var(--accent)] p-6 shadow-2xl sm:p-8">
                <button
                  type="button"
                  onClick={closeToolDialog}
                  aria-label={`Close ${selectedTool.name} details`}
                  className="absolute right-4 top-4 rounded-full p-2 text-[var(--color-text-muted)] hover:bg-[var(--surface-soft)] hover:text-white transition"
                >
                  <Icon name="x" size={18} />
                </button>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-3 shadow-md border border-slate-200">
                  {selectedTool.name in toolSvgMap ? (
                    <img src={toolSvgMap[selectedTool.name]} alt={selectedTool.name} className="h-10 w-10 object-contain" />
                  ) : (
                    <Icon name={selectedTool.fallbackIcon} size={32} className="text-slate-800" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 id="tool-detail-title" className="text-2xl font-bold">{selectedTool.name}</h3>
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)] border border-[var(--accent)]/30">
                      {selectedTool.mastery} Level
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{selectedTool.category}</p>
                </div>
              </div>

                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{selectedTool.description}</p>

                <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  <Icon name="target" size={16} />
                  <span>Real-world scenarios & how I use it</span>
                </div>
                <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                  {selectedTool.scenarios.map((sc, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                      <span>{sc}</span>
                    </li>
                  ))}
                </ul>
                </div>

                {selectedTool.associatedProjects.length > 0 && (
                  <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                  <span className="font-semibold text-white">Associated Projects & Audits:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedTool.associatedProjects.map(proj => (
                      <span key={proj} className="rounded-md bg-[var(--surface-soft)] border border-[var(--border)] px-2.5 py-1 font-mono text-[11px]">
                        {proj}
                      </span>
                    ))}
                  </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 3. ACADEMIC COURSEWORK & BACKGROUND (EXPANDABLE) */}
      <section className="surface-card p-8 space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] font-semibold">Academic Foundation</span>
          <h2 className="text-2xl font-bold">Core Coursework & Specialized Training</h2>
          <p className="text-sm text-[var(--color-text-muted)] max-w-3xl">
            Key university courses that established my foundations in systems architecture, low-level memory, math, and software engineering.
          </p>
        </div>

        <div ref={courseListRef} className="grid gap-4 md:grid-cols-2">
          {COURSES.map((course) => {
            const expanded = activeCourseId === course.id;
            return (
              <motion.button
                key={course.id}
                type="button"
                layout
                onClick={() => setActiveCourseId(expanded ? null : course.id)}
                className={`w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5 text-left transition-all duration-300 ${
                  expanded ? 'shadow-[0_10px_30px_rgba(16,185,129,0.12)] border-[var(--accent)]' : 'hover:border-[var(--accent)]/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon name={course.icon} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-semibold">{course.title}</h3>
                      <span className={`text-[10px] uppercase tracking-wider font-semibold ${expanded ? 'text-[var(--accent)]' : 'text-[var(--color-text-muted)]'}`}>
                        {expanded ? 'Close' : 'Details'}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">{course.description}</p>
                  </div>
                </div>

                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-5 space-y-3 border-t border-[var(--border)] pt-4 text-xs"
                  >
                    <div className="rounded-xl bg-[var(--surface)] p-3 border border-[var(--border)]">
                      <p className="font-semibold text-[var(--accent)] mb-1">Key Challenge</p>
                      <p className="text-[var(--color-text-muted)]">{course.challenge}</p>
                    </div>
                    <div className="rounded-xl bg-[var(--surface)] p-3 border border-[var(--border)]">
                      <p className="font-semibold text-[var(--accent)] mb-1">Key Takeaways</p>
                      <ul className="list-disc list-inside space-y-1 text-[var(--color-text-muted)]">
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
      </section>
    </div>
  );
};

export default SkillsPage;
