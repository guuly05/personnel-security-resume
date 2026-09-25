const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'output', 'pdf');
const publicDir = path.join(root, 'public', 'assets');
const PAGE_WIDTH = 595.276;
const PAGE_HEIGHT = 841.89;
const LEFT = 42;
const RIGHT = 553;
const TOP = 800;
const BOTTOM = 48;
const COLORS = { text: [17, 23, 19], muted: [83, 97, 88], accent: [22, 128, 68], border: [214, 222, 215] };

const escapePdf = (value) => String(value).replace(/([\\()])/g, '\\$1');
const color = (rgb) => `${(rgb[0] / 255).toFixed(4)} ${(rgb[1] / 255).toFixed(4)} ${(rgb[2] / 255).toFixed(4)}`;
const width = (value, size, font = 'F1') => String(value).length * size * (font === 'F2' ? 0.52 : 0.49);

class PdfDocument {
  constructor(meta) { this.meta = meta; this.pages = []; this.page = null; this.newPage(); }
  newPage() { this.page = { operations: [], annotations: [], y: TOP }; this.pages.push(this.page); this.header(); }
  header() {
    const first = this.pages.length === 1;
    if (first) {
      this.text('Guuleed Maxamuud Aw Abdi', LEFT, this.page.y, 20, 'F2');
      this.page.y -= 22;
      this.text(this.meta.heading.toUpperCase(), LEFT, this.page.y, 9.2, 'F2', COLORS.accent);
      this.page.y -= 14;
      this.text('Hargeisa, Somaliland | +252 634406157 | guuleedmaxamuud40@gmail.com', LEFT, this.page.y, 7.3, 'F1', COLORS.muted);
      this.page.y -= 10;
      const firstLink = 'guuleedmaxamuud.dev';
      this.link(firstLink, 'https://www.guuleedmaxamuud.dev', LEFT, this.page.y, 7.3);
      const secondLink = 'linkedin.com/in/guuleed-aw-abdi-517928277';
      this.text(' | ', LEFT + width(firstLink, 7.3), this.page.y, 7.3, 'F1', COLORS.muted);
      this.link(secondLink, 'https://linkedin.com/in/guuleed-aw-abdi-517928277', LEFT + width(`${firstLink} | `, 7.3), this.page.y, 7.3);
      this.text(' | ', LEFT + width(`${firstLink} | ${secondLink}`, 7.3), this.page.y, 7.3, 'F1', COLORS.muted);
      this.link('github.com/guuly05', 'https://github.com/guuly05', LEFT + width(`${firstLink} | ${secondLink} | `, 7.3), this.page.y, 7.3);
      this.page.y -= 12;
      this.line(LEFT, this.page.y, RIGHT, this.page.y, 1.1, COLORS.accent);
      this.page.y -= 13;
    } else {
      this.text('Guuleed Maxamuud Aw Abdi', LEFT, this.page.y, 10, 'F2');
      this.text(this.meta.heading, RIGHT - width(this.meta.heading, 8, 'F2'), this.page.y, 8, 'F2', COLORS.accent);
      this.page.y -= 9;
      this.line(LEFT, this.page.y, RIGHT, this.page.y, 0.6, COLORS.border);
      this.page.y -= 16;
    }
  }
  footer() {
    const pageNumber = this.pages.indexOf(this.page) + 1;
    this.line(LEFT, 32, RIGHT, 32, 0.5, COLORS.border);
    this.text('Guuleed Maxamuud Aw Abdi | guuleedmaxamuud.dev', LEFT, 21, 7, 'F1', COLORS.muted);
    this.text(`Page ${pageNumber}`, RIGHT - width(`Page ${pageNumber}`, 7), 21, 7, 'F1', COLORS.muted);
  }
  ensure(space = 30) { if (this.page.y - space < BOTTOM) { this.footer(); this.newPage(); } }
  text(value, x, baseline, size, font = 'F1', rgb = COLORS.text) { this.page.operations.push(`BT /${font} ${size} Tf ${color(rgb)} rg 1 0 0 1 ${x.toFixed(2)} ${baseline.toFixed(2)} Tm (${escapePdf(value)}) Tj ET`); }
  link(label, url, x, baseline, size, rgb = COLORS.accent) { this.text(label, x, baseline, size, 'F1', rgb); this.page.annotations.push({ url, x1: x - 1, y1: baseline - 2, x2: x + width(label, size) + 1, y2: baseline + size + 1 }); }
  line(x1, y1, x2, y2, strokeWidth, rgb) { this.page.operations.push(`${color(rgb)} RG ${strokeWidth} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`); }
  wrap(value, size, maxWidth, font = 'F1') {
    const lines = []; let current = '';
    for (const word of String(value).split(/\s+/)) { const next = current ? `${current} ${word}` : word; if (current && width(next, size, font) > maxWidth) { lines.push(current); current = word; } else current = next; }
    if (current) lines.push(current); return lines;
  }
  paragraph(value, size = 8.3, leading = 10.8, maxWidth = RIGHT - LEFT, font = 'F1', rgb = COLORS.text) {
    const lines = this.wrap(value, size, maxWidth, font); this.ensure(lines.length * leading + 8);
    for (const line of lines) { this.text(line, LEFT, this.page.y, size, font, rgb); this.page.y -= leading; }
  }
  section(title) { this.ensure(36); this.page.y -= 3; this.text(title.toUpperCase(), LEFT, this.page.y, 8.2, 'F2', COLORS.accent); this.page.y -= 5; this.line(LEFT, this.page.y, RIGHT, this.page.y, 0.6, COLORS.border); this.page.y -= 12; }
  bullet(value, compact = false) {
    const size = compact ? 7.7 : 8.05; const leading = compact ? 9.2 : 10.1; const lines = this.wrap(value, size, RIGHT - LEFT - 14); this.ensure(lines.length * leading + 4);
    lines.forEach((line, index) => { this.text(index === 0 ? `- ${line}` : `  ${line}`, LEFT + 7, this.page.y, size, 'F1', COLORS.text); this.page.y -= leading; }); this.page.y -= compact ? 0.5 : 1.2;
  }
  role(item, compact = false) {
    this.ensure(42); const title = `${item.title} | ${item.company}`; const size = compact ? 8.2 : 9;
    this.text(title, LEFT, this.page.y, size, 'F2'); this.text(item.dates, RIGHT - width(item.dates, compact ? 7.2 : 7.7, 'F2'), this.page.y, compact ? 7.2 : 7.7, 'F2', COLORS.accent);
    this.page.y -= compact ? 10 : 11; this.text(item.location, LEFT, this.page.y, 7.5, 'F3', COLORS.muted); this.page.y -= compact ? 10 : 12; item.bullets.forEach((bullet) => this.bullet(bullet, compact)); this.page.y -= 1;
  }
  project(item, compact = false) { this.ensure(32); this.text(`${item.name} | ${item.stack}`, LEFT, this.page.y, compact ? 7.7 : 8.2, 'F2'); this.page.y -= compact ? 9 : 10; this.paragraph(item.description, compact ? 7.7 : 8, compact ? 9.2 : 10, RIGHT - LEFT, 'F1', COLORS.muted); this.page.y -= 1; }
  build() {
    this.section('Professional Summary'); this.paragraph(this.meta.summary, this.meta.compact ? 7.7 : 8.3, this.meta.compact ? 9.4 : 10.8);
    this.section('Experience'); this.meta.experience.forEach((item) => this.role(item, this.meta.compact));
    this.section('Education'); this.ensure(30); this.text('B.Sc. Computer Science | University of Hargeisa', LEFT, this.page.y, 8.3, 'F2'); this.text('2023 - Expected 2027', RIGHT - width('2023 - Expected 2027', 7.6, 'F2'), this.page.y, 7.6, 'F2', COLORS.accent); this.page.y -= 11; this.paragraph('GPA: 3.6/4.0 | Network Security, Cryptography, Web Application Security, Secure SDLC, Operating Systems', 7.7, 9.8, RIGHT - LEFT, 'F3', COLORS.muted);
    this.section('Selected Projects'); this.meta.projects.forEach((item) => this.project(item, this.meta.compact));
    this.section('Technical Skills'); this.meta.skills.forEach((skill) => this.paragraph(`${skill.label}: ${skill.value}`, this.meta.compact ? 7.7 : 8, this.meta.compact ? 9.4 : 10));
    this.section('Certifications and Languages'); this.paragraph(this.meta.certifications, this.meta.compact ? 7.7 : 8, this.meta.compact ? 9.4 : 10); this.footer(); return this.toPdf();
  }
  toPdf() {
    const objects = []; const add = (body) => { objects.push(body); return objects.length; }; const pageRefs = [];
    this.pages.forEach((page) => { const content = page.operations.join('\n') + '\n'; const contentRef = add(`<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}endstream`); const annotationRefs = page.annotations.map((annotation) => add(`<< /Type /Annot /Subtype /Link /Rect [${annotation.x1.toFixed(2)} ${annotation.y1.toFixed(2)} ${annotation.x2.toFixed(2)} ${annotation.y2.toFixed(2)}] /Border [0 0 0] /A << /S /URI /URI (${escapePdf(annotation.url)}) >> >>`)); const annots = annotationRefs.length ? ` /Annots [${annotationRefs.map((ref) => `${ref} 0 R`).join(' ')}]` : ''; pageRefs.push(add(`<< /Type /Page /Parent PAGES /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 FONT /F2 BOLD /F3 ITALIC >> >> /Contents ${contentRef} 0 R${annots} >>`)); });
    const pagesRef = add(`<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(' ')}] /Count ${pageRefs.length} >>`); const fontRef = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'); const boldRef = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'); const italicRef = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>'); const catalogRef = add(`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`); const replaceRefs = (value) => value.replace(/PAGES/g, `${pagesRef} 0 R`).replace(/FONT/g, `${fontRef} 0 R`).replace(/BOLD/g, `${boldRef} 0 R`).replace(/ITALIC/g, `${italicRef} 0 R`);
    const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'; let pdf = header; const offsets = [0]; objects.forEach((object, index) => { offsets.push(Buffer.byteLength(pdf, 'latin1')); pdf += `${index + 1} 0 obj\n${replaceRefs(object)}\nendobj\n`; }); const xrefOffset = Buffer.byteLength(pdf, 'latin1'); pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`; for (let index = 1; index <= objects.length; index += 1) pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`; pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogRef} 0 R /Info << /Title (${escapePdf(this.meta.heading)} - Guuleed Maxamuud Aw Abdi) /Author (Guuleed Maxamuud Aw Abdi) >> >>\nstartxref\n${xrefOffset}\n%%EOF\n`; return Buffer.from(pdf, 'latin1');
  }
}

const commonProjects = {
  portfolio: { name: 'Full-Stack Portfolio Platform', stack: 'React 19, TypeScript, Vite, Vercel Functions', description: 'Built a production portfolio product with Markdown publishing, protected contact, Google Calendar booking, prerendered SEO assets, and security-minded deployment controls.' },
  dashboard: { name: 'Cyber Attack Monitoring Dashboard', stack: 'Next.js, TypeScript, Tailwind CSS, Vercel', description: 'Built a threat-intelligence workspace with server-side API proxying, IP reputation and CVE lookups, risk scoring, mitigation guidance, and production security headers.' },
  gabay: { name: 'Gabay Keeper', stack: 'React, TypeScript, Firebase, Tesseract.js', description: 'Created a private digital archive for Somali oral poetry with structured metadata, per-user Firestore rules, client-side OCR, search, and visual poem-card exports.' },
  samaale: { name: 'Samaale General Trading Co. Digital Headquarters', stack: 'React 19, TypeScript, Cloudflare Workers, Leaflet', description: 'Shipped a bilingual B2B commerce and logistics platform with catalogue navigation, branch mapping, secure contact workflows, route-aware SEO, and responsive UX.' },
};
const experience = {
  samaale: { title: 'Freelance Web Developer', company: 'Samaale General Trading Co.', location: 'Hargeisa, Somaliland | Hybrid', dates: 'Jun 2026 - Aug 2026', bullets: ['Architected and shipped a production B2B trading platform using React 19, TypeScript, and Vite with strict type-safe data models.', 'Improved load performance with React.lazy code splitting, IntersectionObserver-based lazy rendering, and vendor chunk splitting.', 'Built a bilingual English/Somali interface and secured a Cloudflare Workers API with Turnstile, field validation, and SHA-256 rate limiting.', 'Delivered accessible workflows with a custom focus-trap hook, a Leaflet logistics map, and decoupled browser event architecture.'] },
  linux: { title: 'Linux System Administrator', company: 'Freelance', location: 'Small business clients | Hargeisa, Somaliland', dates: 'Mar 2024 - Feb 2025', bullets: ['Reduced repetitive security work by 30% and saved approximately 8 hours per week by automating log analysis and patch checks with Python.', 'Improved system uptime by 20% through Nagios monitoring, kernel tuning, and incident response averaging under two hours.', 'Hardened 15+ Ubuntu and RHEL servers with SSH controls, firewalls, sudo policies, and repeatable security checks.'] },
  internship: { title: 'Security & Software Engineering Intern', company: 'Confidential Family-Owned Business', location: 'Hargeisa, Somaliland', dates: 'Jun 2024 - Aug 2024', bullets: ['Mapped internal web applications and network services, identifying 12 high-priority issues and translating them into actionable engineering fixes.', 'Tested authentication, access control, Linux services, and network tooling with Nmap and Burp Suite, then documented remediation guidance.'] },
};

const variants = [
  { file: 'Guuleed-Maxamuud-Awabdi-CV.pdf', heading: 'Full-Stack Developer | DevOps-Minded Engineer', summary: 'Full-stack developer and DevOps-minded engineer building production web products, secure APIs, and reliable Linux systems. Experienced with React and TypeScript, Node and Express APIs, Python automation, cloud deployment, security testing, and technical documentation.', experience: [experience.samaale, experience.linux, experience.internship], projects: [commonProjects.samaale, commonProjects.dashboard, commonProjects.gabay, commonProjects.portfolio], skills: [{ label: 'Web and Software', value: 'React, Next.js, TypeScript, JavaScript, Vite, Tailwind CSS, Node.js, Express, REST APIs, Firebase, Git, GitHub, HTML, CSS' }, { label: 'Systems and DevOps', value: 'Linux, Bash, Python, Java, C, Nagios, VMware, VirtualBox, CI/CD, Vercel, Netlify, Cloudflare Workers' }, { label: 'Security', value: 'Nmap, Nessus, OpenVAS, Burp Suite, Metasploit, Wireshark, SSH hardening, firewalls, OWASP Top 10, CVSS, access control' }], certifications: 'Certifications: Cyber Threat Management - Cisco; Penetration Testing Professional - Cybrary; Microsoft Security Essentials; Career Essentials in GitHub; Career Essentials in Cybersecurity. Languages: Somali (Native), English (Professional working proficiency), Arabic (Conversational).' },
  { file: 'Guuleed-Maxamuud-Awabdi-General-Software-Engineering-CV.pdf', heading: 'Software Engineer | Full-Stack Developer', summary: 'Software engineer focused on building clear, maintainable products from interface to deployment. Strong experience with React, TypeScript, APIs, data modeling, automated delivery, performance optimization, and reliable user workflows.', experience: [experience.samaale, experience.linux, experience.internship], projects: [commonProjects.samaale, commonProjects.portfolio, commonProjects.gabay], skills: [{ label: 'Frontend', value: 'React 19, Next.js, TypeScript, JavaScript, Vite, Tailwind CSS, Motion, responsive UI, accessibility, state management' }, { label: 'Backend and Data', value: 'Node.js, Express, REST APIs, Firebase, Redis-compatible stores, validation, idempotency, email workflows, Google Calendar API' }, { label: 'Delivery', value: 'Git, GitHub Actions, CI/CD, Vercel, Netlify, Cloudflare Workers, prerendering, SEO, performance optimization, technical documentation' }], certifications: 'Training: Software Engineering, Python, TypeScript, React, JavaScript, Information Security, C Programming, and Linear Algebra. Languages: Somali (Native), English (Professional working proficiency), Arabic (Conversational).' },
  { file: 'Guuleed-Maxamuud-Awabdi-Cybersecurity-CV.pdf', heading: 'Cybersecurity Engineer | Security-Minded Developer', summary: 'Cybersecurity-focused developer combining vulnerability assessment, Linux administration, secure application design, automation, and practical remediation. Comfortable translating technical findings into clear fixes, documentation, and repeatable controls.', experience: [experience.internship, experience.linux, experience.samaale], projects: [commonProjects.dashboard, commonProjects.gabay, { name: 'Automated Vulnerability Scanner', stack: 'Python, Nmap, OpenVAS, SMTP', description: 'Built an automation workflow that parses scan results, prioritizes findings, and generates email reports, reducing scan-to-report time by 70%.' }, { name: 'Information Systems Security Course', stack: 'Kali Linux, Wireshark, Metasploit, Nmap, Python', description: 'Authored an open security curriculum with nine chapters, hands-on labs, case studies, policy templates, and framework-aligned learning material.' }], skills: [{ label: 'Security Testing', value: 'Nmap, Nessus, OpenVAS, Burp Suite, Metasploit, Wireshark, vulnerability assessment, CVSS, OWASP Top 10, access control testing' }, { label: 'Systems and Defense', value: 'Linux, Ubuntu, RHEL, CentOS, Bash, Python, SSH hardening, firewalls, sudo policy, Nagios monitoring, patch checks, incident response' }, { label: 'Secure Engineering', value: 'React, TypeScript, Node.js, REST APIs, validation, Turnstile, rate limiting, security headers, idempotency, secure SDLC' }], certifications: 'Certifications: Cyber Threat Management - Cisco; Penetration Testing Professional - Cybrary; Microsoft Security Essentials; Career Essentials in Cybersecurity. Frameworks: NIST CSF, MITRE ATT&CK, ISO 27001, OWASP, PCI DSS. Languages: Somali (Native), English (Professional working proficiency), Arabic (Conversational).' },
  { file: 'Guuleed-Maxamuud-Awabdi-ATS-CV.pdf', heading: 'Software Engineer | Cybersecurity Developer', compact: true, summary: 'Software engineer and cybersecurity developer with experience in React, TypeScript, Node.js, Python, Linux, secure APIs, vulnerability assessment, automation, and cloud deployment.', experience: [experience.samaale, experience.internship, experience.linux], projects: [commonProjects.dashboard, commonProjects.samaale, commonProjects.portfolio], skills: [{ label: 'Languages', value: 'TypeScript, JavaScript, Python, Java, C, Bash, HTML, CSS' }, { label: 'Engineering', value: 'React, Next.js, Node.js, Express, REST APIs, Vite, Tailwind CSS, Firebase, Git, GitHub Actions, CI/CD, Vercel' }, { label: 'Cybersecurity', value: 'Nmap, Nessus, OpenVAS, Burp Suite, Metasploit, Wireshark, OWASP Top 10, CVSS, Linux hardening, vulnerability assessment' }], certifications: 'B.Sc. Computer Science, University of Hargeisa, 2023 - Expected 2027. Cyber Threat Management; Penetration Testing Professional; Microsoft Security Essentials; Career Essentials in Cybersecurity. Somali, English, Arabic.' },
];

fs.mkdirSync(outputDir, { recursive: true }); fs.mkdirSync(publicDir, { recursive: true });
for (const variant of variants) { const pdf = new PdfDocument(variant).build(); fs.writeFileSync(path.join(outputDir, variant.file), pdf); fs.writeFileSync(path.join(publicDir, variant.file), pdf); console.log(`Created ${variant.file}`); }
fs.copyFileSync(path.join(publicDir, 'Guuleed-Maxamuud-Awabdi-CV.pdf'), path.join(publicDir, 'Guuleed-Maxamuud-Awabdi-CV-1.pdf'));
