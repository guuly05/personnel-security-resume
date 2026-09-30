import React, { useCallback, useState, useRef } from 'react';
import { COURSES } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';
import { AnimatePresence, motion } from 'motion/react';
import { useFocusTrap } from '../hooks/useFocusTrap.ts';

interface DetailedTool {
  name: string;
  category: string;
  svgPath?: string;
  fallbackIcon: string;
  description: string;
  scenarios: string[];
  associatedProjects: { name: string; href: string }[];
}

interface Capability {
  number: string;
  title: string;
  summary: string;
  examples: string[];
  tools: string[];
}

const toolSvgMap: Record<string, string> = {
  'Nessus': '/images/SVG/Nessus-Professional-FullColor-RGB.svg',
  'Burp Suite': '/images/SVG/burpsuite.svg',
  'Wireshark': '/images/SVG/wireshark.svg',
  'Metasploit': '/images/SVG/metasploit.svg',
  'Nmap': '/images/SVG/nmap.svg',
  'React': '/images/SVG/reactjs.svg',
  'Git / GitHub': '/images/SVG/github-wordmark.svg',
  'Bash': '/images/SVG/bash.svg',
  'Python': '/images/SVG/python.svg',
  'Java': '/images/SVG/java.svg',
  'Linux': '/images/SVG/linux.svg',
  'VMware': '/images/SVG/vmware-workstation.svg',
  'VirtualBox': '/images/SVG/virtualbox.svg',
  'Tailwind CSS': '/images/SVG/tailwindcss.svg',
  'Express.js': '/images/SVG/express-js.svg',
  'Firebase': '/images/SVG/firebase.svg',
  'Vercel / Netlify': '/images/SVG/netlify.svg',
  'Resend': 'https://cdn.resend.com/brand/resend-wordmark-black.svg',
};

const TOOLS: DetailedTool[] = [
  { name: 'React', category: 'Product engineering', fallbackIcon: 'layout', description: 'Component-driven interface development, application state, reusable UI, and responsive product flows.', scenarios: ['Built React 19 interfaces with TypeScript and reusable components.', 'Delivered a bilingual commerce platform with catalogue, news, and logistics experiences.'], associatedProjects: [{ name: 'Samaale General Trading', href: '/portfolio/samaale-general-trading' }, { name: 'Portfolio platform', href: '/portfolio/portfolio-platform' }] },
  { name: 'Tailwind CSS', category: 'Product engineering', fallbackIcon: 'code-2', description: 'Responsive styling with shared design tokens, clear layout rules, and accessible interaction states.', scenarios: ['Built responsive page layouts and reusable interface patterns.', 'Applied consistent visual tokens across a multi-route portfolio.'], associatedProjects: [{ name: 'Samaale General Trading', href: '/portfolio/samaale-general-trading' }] },
  { name: 'Express.js', category: 'Product engineering', fallbackIcon: 'cpu', description: 'Node.js API development and server-side request handling.', scenarios: ['Structured API routes and validation boundaries.', 'Applied rate limiting, security headers, and controlled cross-origin access where appropriate.'], associatedProjects: [{ name: 'Portfolio platform', href: '/portfolio/portfolio-platform' }] },
  { name: 'Firebase', category: 'Product engineering', fallbackIcon: 'globe', description: 'Application authentication and data services, including Firebase Auth and Firestore.', scenarios: ['Connected application flows to authentication and hosted data services.', 'Worked with security rules to control access to stored records.'], associatedProjects: [{ name: 'Selected work', href: '/portfolio' }] },
  { name: 'Resend', category: 'Product engineering', fallbackIcon: 'mail', description: 'Transactional email delivery integrated through protected server-side workflows.', scenarios: ['Connected validated form submissions to email notifications.', 'Kept provider credentials on the server side.'], associatedProjects: [{ name: 'Samaale General Trading', href: '/portfolio/samaale-general-trading' }, { name: 'Portfolio platform', href: '/portfolio/portfolio-platform' }] },
  { name: 'Nessus', category: 'Security practice', svgPath: '/images/SVG/Nessus-Professional-FullColor-RGB.svg', fallbackIcon: 'shield-check', description: 'Vulnerability scanning to identify exposed services, outdated software, and configuration issues for review.', scenarios: ['Ran vulnerability assessment workflows and reviewed findings.', 'Prioritized issues for clear remediation notes and reporting.'], associatedProjects: [{ name: 'Security case studies', href: '/portfolio' }] },
  { name: 'Burp Suite', category: 'Security practice', fallbackIcon: 'shield-alert', description: 'Web application testing through request inspection, manual validation, and focused input testing.', scenarios: ['Inspected application requests and authentication flows.', 'Validated web findings in authorized projects and lab environments.'], associatedProjects: [{ name: 'Security case studies', href: '/portfolio' }] },
  { name: 'Wireshark', category: 'Security practice', fallbackIcon: 'network', description: 'Packet capture inspection for understanding protocols, traffic patterns, and network behavior.', scenarios: ['Used display filters to isolate relevant traffic.', 'Reviewed protocol behavior during security analysis and troubleshooting.'], associatedProjects: [{ name: 'Information security project', href: '/portfolio/infosec-course' }] },
  { name: 'Metasploit', category: 'Security practice', fallbackIcon: 'terminal', description: 'A penetration-testing framework used in controlled lab work to validate known vulnerabilities.', scenarios: ['Verified exploit behavior in authorized lab environments.', 'Documented findings and post-exploitation impact for security study.'], associatedProjects: [{ name: 'Information security project', href: '/portfolio/infosec-course' }] },
  { name: 'Nmap', category: 'Security practice', fallbackIcon: 'search', description: 'Network discovery and service enumeration to establish what is exposed and needs further investigation.', scenarios: ['Mapped hosts and listening services in approved environments.', 'Used scan output as an input to vulnerability review and reporting.'], associatedProjects: [{ name: 'Information security project', href: '/portfolio/infosec-course' }] },
  { name: 'Python', category: 'Systems & delivery', fallbackIcon: 'file-code', description: 'Scripting for automation, data handling, and security-oriented utilities.', scenarios: ['Built a vulnerability scanning workflow that parses results into prioritized reports.', 'Used scripts to reduce repetitive technical work.'], associatedProjects: [{ name: 'Selected work', href: '/portfolio' }] },
  { name: 'Bash', category: 'Systems & delivery', fallbackIcon: 'terminal', description: 'Shell scripting for Linux operations, repeatable tasks, and system administration.', scenarios: ['Automated routine system and security checks.', 'Worked with Linux services, permissions, and operational troubleshooting.'], associatedProjects: [{ name: 'Experience', href: '/experience' }] },
  { name: 'Linux', category: 'Systems & delivery', fallbackIcon: 'terminal', description: 'Linux environments for system administration, service review, and security labs.', scenarios: ['Reviewed services, permissions, and SSH configuration.', 'Used Kali Linux and Linux-based tooling in authorized security labs.'], associatedProjects: [{ name: 'Information security project', href: '/portfolio/infosec-course' }] },
  { name: 'Git / GitHub', category: 'Systems & delivery', fallbackIcon: 'github', description: 'Version control and repository workflows for collaborative, reviewable software delivery.', scenarios: ['Managed code changes with Git and GitHub.', 'Used repository workflows to support builds and deployment.'], associatedProjects: [{ name: 'Portfolio platform', href: '/portfolio/portfolio-platform' }] },
  { name: 'Java', category: 'Systems & delivery', fallbackIcon: 'coffee', description: 'Object-oriented programming and foundational software development.', scenarios: ['Applied core object-oriented programming concepts.', 'Built programming foundations through coursework and practice.'], associatedProjects: [{ name: 'Academic foundation', href: '#coursework' }] },
  { name: 'VMware', category: 'Systems & delivery', fallbackIcon: 'server', description: 'Virtualized environments for isolated operating system and security lab work.', scenarios: ['Set up and used virtual machines for hands-on technical practice.', 'Kept lab exercises separated from everyday systems.'], associatedProjects: [{ name: 'Security case studies', href: '/portfolio' }] },
  { name: 'VirtualBox', category: 'Systems & delivery', fallbackIcon: 'server', description: 'Desktop virtualization for building and managing isolated lab environments.', scenarios: ['Used virtual machines to support Linux and security exercises.', 'Configured isolated environments for technical learning.'], associatedProjects: [{ name: 'Security case studies', href: '/portfolio' }] },
  { name: 'Vercel / Netlify', category: 'Systems & delivery', fallbackIcon: 'external-link', description: 'Web deployment platforms used to publish frontend applications and serverless workflows.', scenarios: ['Connected deployments to repository workflows.', 'Configured production hosting and environment settings.'], associatedProjects: [{ name: 'Portfolio platform', href: '/portfolio/portfolio-platform' }] },
];

const CAPABILITIES: Capability[] = [
  {
    number: '01', title: 'Product engineering',
    summary: 'I build interfaces and application flows that make a product easy to understand and use, then connect them to the services behind them.',
    examples: ['React 19 and TypeScript application development', 'Responsive interfaces and reusable component systems', 'API integrations, authentication, and data flows'],
    tools: ['React', 'Tailwind CSS', 'Express.js', 'Firebase', 'Resend'],
  },
  {
    number: '02', title: 'Systems & delivery',
    summary: 'I work across the code and the path it takes to production: automation, Linux operations, source control, and deployment.',
    examples: ['Python utilities and repeatable automation', 'Linux administration, shell scripting, and C programming foundations', 'Repository workflows and cloud deployment'],
    tools: ['Python', 'Bash', 'Linux', 'Git / GitHub', 'Java', 'VMware', 'VirtualBox', 'Vercel / Netlify'],
  },
  {
    number: '03', title: 'Secure engineering',
    summary: 'Security is part of how I approach software: understand the attack surface, validate risk in authorized settings, and make the next fix clear.',
    examples: ['Application and network vulnerability assessment', 'Web request inspection and controlled exploit validation', 'Risk prioritization and developer-focused documentation'],
    tools: ['Nessus', 'Burp Suite', 'Wireshark', 'Metasploit', 'Nmap'],
  },
];

const FILTERS = ['All tools', 'Product engineering', 'Systems & delivery', 'Security practice'];

const SkillsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [selectedTool, setSelectedTool] = useState<DetailedTool | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeDialog = useCallback(() => setSelectedTool(null), []);
  useFocusTrap(Boolean(selectedTool), dialogRef, closeDialog);

  const visibleTools = activeFilter === FILTERS[0]
    ? TOOLS
    : TOOLS.filter((tool) => tool.category === activeFilter);

  return (
    <div className="skills-page">
      <header className="skills-hero">
        <div className="skills-hero-copy">
          <span className="landing-section-index">/ capabilities</span>
          <h1 className="skills-title">Good software needs <span>the whole picture.</span></h1>
          <p className="skills-lede">I work across product engineering, delivery, and security—building useful interfaces, connecting the systems behind them, and thinking about what happens after launch.</p>
          <div className="skills-hero-index" aria-label="Core capabilities">
            <span>Product engineering</span><i>·</i><span>Systems & delivery</span><i>·</i><span>Secure engineering</span>
          </div>
        </div>
        <aside className="skills-hero-aside" aria-label="How I approach engineering">
          <span className="skills-aside-label">/ working approach</span>
          <div className="skills-approach-mark" aria-hidden="true"><span>build</span><b>→</b><span>ship</span><b>→</b><span>learn</span></div>
          <p>Make the interface clear. Make the system dependable. Keep improving it with evidence.</p>
        </aside>
      </header>

      <section className="skills-proof" aria-label="Selected experience">
        <div className="skills-proof-item"><strong>12</strong><span>high-priority issues identified during an internship assessment</span></div>
        <div className="skills-proof-item"><strong>30+</strong><span>source files in a production B2B platform built from scratch</span></div>
        <div className="skills-proof-item"><strong>2</strong><span>languages supported in the Samaale platform</span></div>
        <div className="skills-proof-item"><strong>4</strong><span>protected server workflows in this portfolio platform</span></div>
      </section>

      <section className="skills-capabilities" aria-labelledby="skills-capabilities-title">
        <div className="landing-section-heading skills-section-heading">
          <div><span className="landing-section-index">01 / how I work</span><h2 id="skills-capabilities-title">Three connected disciplines.</h2></div>
          <p>My strongest work happens where product quality, reliable delivery, and security meet.</p>
        </div>
        <div className="skills-capability-list">
          {CAPABILITIES.map((capability) => (
            <article className="skills-capability" key={capability.number}>
              <span className="skills-capability-number">{capability.number}</span>
              <div className="skills-capability-main">
                <h3>{capability.title}</h3>
                <p className="skills-capability-summary">{capability.summary}</p>
                <ul className="skills-example-list">
                  {capability.examples.map((example) => <li key={example}>{example}</li>)}
                </ul>
              </div>
              <div className="skills-capability-tools">
                <span className="skills-mini-label">Tools I use</span>
                <div className="skills-inline-tools">
                  {capability.tools.map((name, index) => (
                    <React.Fragment key={name}>
                      {index > 0 && <span className="skills-tool-separator" aria-hidden="true">·</span>}
                      <button type="button" onClick={() => setSelectedTool(TOOLS.find((tool) => tool.name === name) ?? null)}>{name}</button>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="skills-tool-section" aria-labelledby="skills-tools-title">
        <div className="landing-section-heading skills-section-heading">
          <div><span className="landing-section-index">02 / toolkit</span><h2 id="skills-tools-title">Tools behind the work.</h2></div>
          <p>Select a tool to see how it fits into my work and the projects where it appears.</p>
        </div>
        <div className="skills-tool-filters" role="group" aria-label="Filter tools by category">
          {FILTERS.map((filter) => <button key={filter} type="button" aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
        </div>
        <div className="skills-tool-list" aria-live="polite">
          {visibleTools.map((tool, index) => (
            <button type="button" className="skills-tool-row" key={tool.name} onClick={() => setSelectedTool(tool)} aria-label={`View how I use ${tool.name}`}>
              <span className="skills-tool-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="skills-tool-logo" aria-hidden="true">
                {tool.svgPath || tool.name in toolSvgMap
                  ? <img src={tool.svgPath ?? toolSvgMap[tool.name]} alt="" loading="lazy" />
                  : <Icon name={tool.fallbackIcon} size={23} />}
              </span>
              <span className="skills-tool-name">{tool.name}</span>
              <span className="skills-tool-category">{tool.category}</span>
              <Icon name="arrow-up-right" size={17} className="skills-tool-arrow" />
            </button>
          ))}
        </div>
      </section>

      <section className="skills-coursework" id="coursework" aria-labelledby="skills-coursework-title">
        <div className="landing-section-heading skills-section-heading">
          <div><span className="landing-section-index">03 / foundations</span><h2 id="skills-coursework-title">Built on fundamentals.</h2></div>
          <p>Coursework that supports the way I reason about software, systems, and security.</p>
        </div>
        <div className="skills-course-list">
          {COURSES.map((course, index) => (
            <details className="skills-course-row" key={course.id}>
              <summary><span className="skills-course-number">{String(index + 1).padStart(2, '0')}</span><span className="skills-course-title">{course.title}</span><span className="skills-course-description">{course.description}</span><Icon name="arrow-right" size={16} className="skills-course-plus" /></summary>
              <div className="skills-course-detail"><p><strong>Challenge</strong>{course.challenge}</p><div><strong>Key takeaways</strong><ul>{course.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div></div>
            </details>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedTool && (
          <motion.div className="skills-dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
            <motion.div ref={dialogRef} className="skills-dialog" role="dialog" aria-modal="true" aria-labelledby="skills-dialog-title" tabIndex={-1} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }}>
              <button type="button" className="skills-dialog-close" aria-label="Close tool details" onClick={closeDialog}><Icon name="x" size={19} /></button>
              <div className="skills-dialog-heading">
                <span className="skills-dialog-logo" aria-hidden="true">{selectedTool.svgPath || selectedTool.name in toolSvgMap ? <img src={selectedTool.svgPath ?? toolSvgMap[selectedTool.name]} alt="" /> : <Icon name={selectedTool.fallbackIcon} size={27} />}</span>
                <div><span className="skills-mini-label">{selectedTool.category}</span><h3 id="skills-dialog-title">{selectedTool.name}</h3></div>
              </div>
              <p className="skills-dialog-description">{selectedTool.description}</p>
              <div className="skills-dialog-section"><span className="skills-mini-label">How it shows up in my work</span><ul>{selectedTool.scenarios.map((scenario) => <li key={scenario}>{scenario}</li>)}</ul></div>
              <div className="skills-dialog-projects"><span className="skills-mini-label">Related work</span><div>{selectedTool.associatedProjects.map((project) => <a href={project.href} key={project.name}>{project.name}<Icon name="arrow-up-right" size={14} /></a>)}</div></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsPage;
