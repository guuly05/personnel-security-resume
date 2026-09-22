const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outputPdf = path.join(root, 'output', 'pdf', 'Guuleed-Maxamuud-Awabdi-CV.pdf');
const publicPdf = path.join(root, 'public', 'assets', 'Guuleed-Maxamuud-Awabdi-CV.pdf');

const PAGE_WIDTH = 595.276;
const PAGE_HEIGHT = 841.89;
const LEFT = 42;
const RIGHT = 553;
const TEXT = [17, 23, 19];
const MUTED = [83, 97, 88];
const ACCENT = [22, 128, 68];
const BORDER = [214, 222, 215];

const operations = [];
const annotations = [];
let y = 0;

const escapePdf = (value) => String(value).replace(/([\\()])/g, '\\$1');
const setColor = (rgb) => `${(rgb[0] / 255).toFixed(4)} ${(rgb[1] / 255).toFixed(4)} ${(rgb[2] / 255).toFixed(4)}`;
const estimateWidth = (value, size) => value.length * size * 0.49;

function add(command) {
  operations.push(command);
}

function drawText(value, x, baseline, size, font = 'F1', color = TEXT) {
  add(`BT /${font} ${size} Tf ${setColor(color)} rg 1 0 0 1 ${x.toFixed(2)} ${baseline.toFixed(2)} Tm (${escapePdf(value)}) Tj ET`);
}

function drawCentered(value, baseline, size, font = 'F1', color = TEXT) {
  drawText(value, (PAGE_WIDTH - estimateWidth(value, size)) / 2, baseline, size, font, color);
}

function drawLine(x1, y1, x2, y2, width, color) {
  add(`${setColor(color)} RG ${width} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
}

function wrap(value, size, maxWidth) {
  const words = value.split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && estimateWidth(next, size) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawParagraph(value, x, baseline, size, leading, maxWidth, font = 'F1', color = TEXT) {
  const lines = wrap(value, size, maxWidth);
  lines.forEach((line, index) => drawText(line, x, baseline - index * leading, size, font, color));
  return baseline - lines.length * leading;
}

function addLink(label, url, x, baseline, size, color = ACCENT) {
  drawText(label, x, baseline, size, 'F1', color);
  annotations.push({
    url,
    x1: x - 1,
    y1: baseline - 2,
    x2: x + estimateWidth(label, size) + 1,
    y2: baseline + size + 1,
  });
  return x + estimateWidth(label, size);
}

function section(title) {
  y -= 5;
  drawText(title.toUpperCase(), LEFT, y, 8.3, 'F2', ACCENT);
  y -= 4;
  drawLine(LEFT, y, RIGHT, y, 0.6, BORDER);
  y -= 11;
}

function bullet(value) {
  const size = 8.05;
  const leading = 10.25;
  const lines = wrap(value, size, RIGHT - LEFT - 12);
  lines.forEach((line, index) => {
    drawText(index === 0 ? `- ${line}` : `  ${line}`, LEFT + 8, y, size, 'F1', TEXT);
    y -= leading;
  });
  y -= 1.2;
}

function role(title, company, location, dates, bullets) {
  drawText(`${title} | ${company}`, LEFT, y, 9.1, 'F2', TEXT);
  drawText(dates, RIGHT - estimateWidth(dates, 7.8), y, 7.8, 'F2', ACCENT);
  y -= 11;
  drawText(location, LEFT, y, 7.8, 'F3', MUTED);
  y -= 12;
  bullets.forEach(bullet);
  y -= 1;
}

function project(name, stack, description) {
  drawText(`${name} | ${stack}`, LEFT, y, 8.05, 'F2', TEXT);
  y -= 10.1;
  y = drawParagraph(description, LEFT, y, 8.05, 10.1, RIGHT - LEFT);
  y -= 1.5;
}

function buildContent() {
  y = 806;
  drawCentered('Guuleed Maxamuud Aw Abdi', y, 20, 'F2', TEXT);
  y -= 22;
  drawCentered('FULL-STACK DEVELOPER | DEVOPS-MINDED ENGINEER', y, 9.2, 'F2', ACCENT);
  y -= 15;

  let contactX = LEFT;
  const contactSize = 7.6;
  const contact1 = 'Hargeisa, Somaliland | +252 634406157 | ';
  drawText(contact1, contactX, y, contactSize, 'F1', MUTED);
  contactX += estimateWidth(contact1, contactSize);
  contactX = addLink('guuleedmaxamuud40@gmail.com', 'mailto:guuleedmaxamuud40@gmail.com', contactX, y, contactSize);
  y -= 10;

  contactX = LEFT + 126;
  contactX = addLink('guuleedmaxamuud.dev', 'https://guuleedmaxamuud.dev', contactX, y, contactSize);
  drawText(' | ', contactX, y, contactSize, 'F1', MUTED);
  contactX += estimateWidth(' | ', contactSize);
  contactX = addLink('linkedin.com/in/guuleed-aw-abdi-517928277', 'https://linkedin.com/in/guuleed-aw-abdi-517928277', contactX, y, contactSize);
  drawText(' | ', contactX, y, contactSize, 'F1', MUTED);
  contactX += estimateWidth(' | ', contactSize);
  addLink('github.com/guuly05', 'https://github.com/guuly05', contactX, y, contactSize);

  y -= 12;
  drawLine(LEFT, y, RIGHT, y, 1.1, ACCENT);
  y -= 10;

  section('Summary');
  y = drawParagraph(
    'Full-stack developer and DevOps-minded engineer building production web products, secure APIs, and reliable Linux systems. Experienced with React and TypeScript, Node and Express APIs, Python automation, cloud deployment, security testing, and technical documentation. Currently pursuing a B.Sc. in Computer Science at the University of Hargeisa.',
    LEFT,
    y,
    8.4,
    11.1,
    RIGHT - LEFT,
  );

  section('Experience');
  role('Freelance Web Developer', 'Samaale General Trading Co.', 'Hargeisa, Somaliland | Hybrid', 'Jun 2026 - Aug 2026', [
    'Architected and shipped a production B2B trading platform using React 19, TypeScript, and Vite, structuring 30+ source files and approximately 9,000 lines of code around strict type-safe models.',
    'Improved load performance with React.lazy code splitting, IntersectionObserver-based lazy rendering, and vendor chunk splitting for faster time to interactive.',
    'Built a bilingual English/Somali interface with React Context and secured a Cloudflare Workers API with Turnstile, field validation, and SHA-256 rate limiting.',
    'Delivered accessible workflows with a custom focus-trap hook, a Leaflet logistics map, and a decoupled browser event architecture.',
  ]);
  role('Linux System Administrator', 'Freelance', 'Small business clients | Hargeisa, Somaliland', 'Mar 2024 - Feb 2025', [
    'Reduced repetitive security work by 30% and saved approximately 8 hours per week by automating log analysis and patch checks with Python.',
    'Improved system uptime by 20% through Nagios monitoring, kernel tuning, and incident response averaging under two hours.',
    'Hardened 15+ Ubuntu and RHEL servers with SSH controls, firewalls, sudo policies, and repeatable security checks.',
  ]);
  role('Security & Software Engineering Intern', 'Confidential Family-Owned Business', 'Hargeisa, Somaliland', 'Jun 2024 - Aug 2024', [
    'Mapped internal web applications and network services, identifying 12 high-priority issues and translating them into actionable engineering fixes.',
    'Tested authentication, access control, Linux services, and network tooling with Nmap and Burp Suite, then documented remediation guidance for the team.',
  ]);

  section('Education');
  drawText('B.Sc. Computer Science | University of Hargeisa', LEFT, y, 8.3, 'F2', TEXT);
  drawText('2023 - Expected 2027', RIGHT - estimateWidth('2023 - Expected 2027', 7.8), y, 7.8, 'F2', ACCENT);
  y -= 11;
  drawText('GPA: 3.6/4.0 | Network Security, Cryptography, Web Application Security, Secure SDLC, Operating Systems', LEFT, y, 7.8, 'F3', MUTED);
  y -= 13;

  section('Selected Projects');
  project('Cyber Attack Monitoring Dashboard', 'Next.js, TypeScript, Tailwind CSS, Vercel', 'Built a threat-intelligence workspace with server-side API proxying, live IP reputation and CVE lookups, risk scoring, mitigation guidance, and production security headers.');
  project('Gabay Keeper', 'React, TypeScript, Firebase, Tesseract.js', 'Created a private digital archive for Somali oral poetry with structured metadata, per-user Firestore security rules, client-side OCR, search, and visual poem-card exports.');
  project('Full-Stack Portfolio Platform', 'React 19, TypeScript, Vite, Vercel Functions', 'Built this portfolio as a production product with Markdown publishing, protected contact, Google Calendar booking, prerendered SEO assets, and security-minded deployment controls.');

  section('Technical Skills');
  y = drawParagraph('Web & Software: React 19, Next.js, TypeScript, JavaScript, Vite, Tailwind CSS, Node.js, Express, REST APIs, Firebase, Git, GitHub, HTML, CSS, Framer Motion', LEFT, y, 8.05, 10.1, RIGHT - LEFT);
  y = drawParagraph('Systems & DevOps: Linux (Ubuntu, RHEL, CentOS), Bash, Python, Java, C, Nagios, VMware, VirtualBox, CI/CD, Vercel, Netlify, Cloudflare Workers', LEFT, y, 8.05, 10.1, RIGHT - LEFT);
  y = drawParagraph('Security: Nmap, Nessus, OpenVAS, Burp Suite, Metasploit, Wireshark, SSH hardening, firewalls, OWASP Top 10, CVSS, access control, vulnerability assessment', LEFT, y, 8.05, 10.1, RIGHT - LEFT);
  y = drawParagraph('Languages: Somali (Native), English (Professional working proficiency), Arabic (Conversational)', LEFT, y, 8.05, 10.1, RIGHT - LEFT);

  section('Certifications');
  drawParagraph('Cyber Threat Management - Cisco (2026) | Penetration Testing Professional - Cybrary (2026) | Microsoft Security Essentials - Microsoft & LinkedIn (2026) | Career Essentials in GitHub - GitHub (2026) | Career Essentials in Cybersecurity - Microsoft & LinkedIn (2026)', LEFT, y, 8.05, 10.1, RIGHT - LEFT);

  return operations.join('\n') + '\n';
}

function makePdf(content) {
  const objects = [];
  const addObject = (body) => {
    objects.push(body);
    return objects.length;
  };

  addObject('<< /Type /Catalog /Pages 2 0 R >>');
  addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  const annotationRefs = annotations.map((annotation, index) => `${8 + index} 0 R`).join(' ');
  addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R /Annots [${annotationRefs}] >>`);
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>');
  const contentLength = Buffer.byteLength(content, 'latin1');
  addObject(`<< /Length ${contentLength} >>\nstream\n${content}endstream`);

  annotations.forEach((annotation) => {
    addObject(`<< /Type /Annot /Subtype /Link /Rect [${annotation.x1.toFixed(2)} ${annotation.y1.toFixed(2)} ${annotation.x2.toFixed(2)} ${annotation.y2.toFixed(2)}] /Border [0 0 0] /A << /S /URI /URI (${escapePdf(annotation.url)}) >> >>`);
  });

  const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  let pdf = header;
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info << /Title (Guuleed Maxamuud Aw Abdi - CV) /Author (Guuleed Maxamuud Aw Abdi) >> >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, 'latin1');
}

fs.mkdirSync(path.dirname(outputPdf), { recursive: true });
fs.mkdirSync(path.dirname(publicPdf), { recursive: true });
const content = buildContent();
const pdf = makePdf(content);
fs.writeFileSync(outputPdf, pdf);
fs.copyFileSync(outputPdf, publicPdf);
console.log(`Created ${outputPdf}`);
console.log(`Published ${publicPdf}`);
