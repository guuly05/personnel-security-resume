/**
 * commandEngine.ts
 * Pure command-parsing engine. Maps typed strings → TerminalLine[].
 * No React, no UI — just data transforms.
 */

import {
  PERSONAL_INFO,
  CORE_SKILLS,
  TOOLSET,
  EXPERIENCES,
  CERTIFICATES,
  PROJECTS,
  ABOUT_LETTER,
} from '../constants.ts';
import { BLOG_POSTS, formatBlogDate } from '../blog/posts.ts';
import { NAVIGABLE_SECTIONS, sectionToPath, type NavigableSection } from '../routing.ts';

export type LineType = 'output' | 'error' | 'success' | 'info' | 'warn' | 'prompt' | 'dim' | 'accent';

export interface TerminalLine {
  id: string;
  type: LineType;
  text: string;
}

let _lineCounter = 0;
function line(type: LineType, text: string): TerminalLine {
  return { id: `command-${++_lineCounter}`, type, text };
}

// ── Individual command handlers ────────────────────────────────────────────

function cmdHelp(): TerminalLine[] {
  return [
    line('accent',  'GUULEED / PORTFOLIO SHELL'),
    line('dim',     'A read-only interface to the work behind this site.'),
    line('dim',     ''),
    line('accent',  'Navigation'),
    line('output',  '  ls                  List all sections'),
    line('output',  '  goto <section>      Navigate to a section'),
    line('output',  '  cd <section>        Alias for goto'),
    line('output',  '  open <section>      Alias for goto'),
    line('dim',     ''),
    line('accent',  'Information'),
    line('output',  '  whoami              Display name & title'),
    line('output',  '  cat about           Read the about section'),
    line('output',  '  cat skills          List all skills & tools'),
    line('output',  '  cat experience      Show work experience'),
    line('output',  '  cat certificates    Show certificates & badges'),
    line('output',  '  cat portfolio       Show project portfolio'),
    line('output',  '  cat projects        Alias for cat portfolio'),
    line('output',  '  tree                Show the site map'),
    line('output',  '  ping contact        Display contact information'),
    line('output',  '  social              Show profile links'),
    line('output',  '  status              Show portfolio runtime status'),
    line('dim',     ''),
    line('accent',  'Discovery'),
    line('output',  '  latest              Open the newest blog note'),
    line('output',  '  posts               List recent blog notes'),
    line('output',  '  read <slug>         Open a specific blog note'),
    line('output',  '  find <term>         Search projects and notes'),
    line('output',  '  stack [filter]      Explore the toolkit'),
    line('dim',     ''),
    line('accent',  'System'),
    line('output',  '  theme dark|light    Toggle site theme'),
    line('output',  '  date                Print current timestamp'),
    line('output',  '  uname               Display system banner'),
    line('output',  '  pwd                 Print the current directory'),
    line('output',  '  echo <text>         Print text safely'),
    line('output',  '  clear               Clear the terminal'),
    line('output',  '  exit                Close the terminal'),
    line('dim',     ''),
    line('dim',     'Tip: Use ↑/↓ arrows to navigate command history.'),
  ];
}

function cmdWhoami(): TerminalLine[] {
  return [
    line('success', PERSONAL_INFO.name),
    line('output',  PERSONAL_INFO.title),
    line('output',  `📍 ${PERSONAL_INFO.location}`),
  ];
}

function cmdLs(): TerminalLine[] {
  const sections = NAVIGABLE_SECTIONS.map(section => sectionToPath(section));
  return [
    line('accent', 'Available sections:'),
    line('output', sections.map(s => `  /${s}`).join('\n')),
    line('dim',    ''),
    line('dim',    'Use: goto <section>   to navigate'),
  ];
}

function cmdStatus(): TerminalLine[] {
  return [
    line('success', '● ONLINE  portfolio shell is ready'),
    line('output', `  Routes   : ${NAVIGABLE_SECTIONS.length} available`),
    line('output', `  Notes    : ${BLOG_POSTS.length} published`),
    line('output', `  Projects : ${PROJECTS.length} indexed`),
    line('output', '  Runtime  : React + TypeScript + Vite'),
    line('output', '  Access   : read-only portfolio interface'),
  ];
}

function cmdPwd(): TerminalLine[] {
  return [line('output', '/portfolio')];
}

function cmdEcho(text: string): TerminalLine[] {
  return [line('output', text)];
}

function cmdCatAbout(): TerminalLine[] {
  return [
    line('accent',  '── about.txt ──────────────────────────────────────'),
    line('dim',     ''),
    ...ABOUT_LETTER.map(para => line('output', para)),
    line('dim',     ''),
    line('success', `Name     : ${PERSONAL_INFO.name}`),
    line('success', `Role     : ${PERSONAL_INFO.title}`),
    line('success', `Location : ${PERSONAL_INFO.location}`),
    line('dim',     ''),
    line('accent',  'Languages:'),
    ...PERSONAL_INFO.languages.map(l => line('output', `  ${l.name.padEnd(12)} ${l.level}`)),
  ];
}

function cmdCatSkills(): TerminalLine[] {
  return [
    line('accent',  '── skills.txt ─────────────────────────────────────'),
    line('dim',     ''),
    line('info',    'CORE SKILLS'),
    line('dim',     '───────────────────────────'),
    ...CORE_SKILLS.map(s => line('output', `  ● ${s}`)),
    line('dim',     ''),
    line('info',    'TOOLSET'),
    line('dim',     '───────────────────────────'),
    ...TOOLSET.map(t => line('output', `  ▶ ${t}`)),
  ];
}

function cmdCatExperience(): TerminalLine[] {
  const lines: TerminalLine[] = [
    line('accent', '── experience.txt ─────────────────────────────────'),
    line('dim',    ''),
  ];
  EXPERIENCES.forEach((exp, i) => {
    lines.push(line('info',    `[${i + 1}] ${exp.title}`));
    lines.push(line('success', `    Company  : ${exp.company}`));
    lines.push(line('success', `    Period   : ${exp.dateRange}`));
    lines.push(line('dim',     '    Highlights:'));
    exp.bullets.forEach(b => lines.push(line('output', `      • ${b}`)));
    if (i < EXPERIENCES.length - 1) lines.push(line('dim', ''));
  });
  return lines;
}

function cmdCatCertificates(): TerminalLine[] {
  const lines: TerminalLine[] = [
    line('accent', '── certificates.txt ───────────────────────────────'),
    line('dim',    ''),
  ];
  CERTIFICATES.forEach((cert, i) => {
    lines.push(line('info',    `[${String(i + 1).padStart(2, '0')}] ${cert.title}`));
    lines.push(line('success', `       Issuer : ${cert.issuer}  (${cert.date})`));
    lines.push(line('output',  `       ${cert.description.slice(0, 100)}${cert.description.length > 100 ? '…' : ''}`));
    if (i < CERTIFICATES.length - 1) lines.push(line('dim', ''));
  });
  return lines;
}

function cmdCatPortfolio(): TerminalLine[] {
  const lines: TerminalLine[] = [
    line('accent', '── portfolio.txt ───────────────────────────────────'),
    line('dim',    ''),
  ];
  PROJECTS.forEach((proj, i) => {
    lines.push(line('info',    `[${i + 1}] ${proj.title}`));
    lines.push(line('output',  `    ${proj.description}`));
    lines.push(line('success', `    Stack   : ${proj.tech.join(' · ')}`));
    lines.push(line('success', `    Result  : ${proj.achievement}`));
    if (i < PROJECTS.length - 1) lines.push(line('dim', ''));
  });
  return lines;
}

function cmdPosts(): TerminalLine[] {
  const lines: TerminalLine[] = [
    line('accent', '── latest-notes.txt ───────────────────────────────'),
    line('dim', ''),
  ];
  BLOG_POSTS.slice(0, 6).forEach((post, index) => {
    lines.push(line('info', `[${String(index + 1).padStart(2, '0')}] ${post.title}`));
    lines.push(line('output', `    ${formatBlogDate(post.date)} · ${post.readTime} · ${post.mood}`));
    lines.push(line('dim', `    read ${post.slug}`));
    if (index < Math.min(BLOG_POSTS.length, 6) - 1) lines.push(line('dim', ''));
  });
  return lines;
}

function cmdLatest(): TerminalLine[] {
  const post = BLOG_POSTS[0];
  if (!post) return [line('error', 'latest: no blog notes found')];
  return [
    line('accent', '── latest note ────────────────────────────────────'),
    line('info', post.title),
    line('output', post.subtitle),
    line('dim', `${formatBlogDate(post.date)} · ${post.readTime} · ${post.mood}`),
    line('success', `→ read ${post.slug}`),
  ];
}

function cmdStack(filter = ''): TerminalLine[] {
  const allTools = [...CORE_SKILLS, ...TOOLSET];
  const uniqueTools = [...new Set(allTools)];
  const matches = filter ? uniqueTools.filter((item) => item.toLowerCase().includes(filter.toLowerCase())) : uniqueTools;
  if (!matches.length) return [line('error', `stack: no tools match '${filter}'`), line('dim', 'Try: stack, stack react, or stack security')];
  return [
    line('accent', filter ? `── stack / ${filter} ───────────────────────────────` : '── stack.txt ───────────────────────────────────────'),
    ...matches.map((item) => line('output', `  · ${item}`)),
    line('dim', ''),
    line('dim', `${matches.length} tools indexed`),
  ];
}

function cmdFind(query: string): TerminalLine[] {
  const term = query.trim().toLowerCase();
  if (!term) return [line('error', 'find: missing search term. Try: find security')];
  const projects = PROJECTS.filter((project) => [project.title, project.description, ...project.tech].join(' ').toLowerCase().includes(term));
  const posts = BLOG_POSTS.filter((post) => [post.title, post.subtitle, ...post.tags].join(' ').toLowerCase().includes(term));
  if (!projects.length && !posts.length) return [line('warn', `find: no matches for '${query}'`)];
  const lines: TerminalLine[] = [line('accent', `── search / ${query} ────────────────────────────────`), line('dim', '')];
  if (projects.length) {
    lines.push(line('info', `PROJECTS (${projects.length})`));
    projects.forEach((project) => lines.push(line('output', `  · ${project.title}`)));
  }
  if (posts.length) {
    if (projects.length) lines.push(line('dim', ''));
    lines.push(line('info', `NOTES (${posts.length})`));
    posts.slice(0, 6).forEach((post) => lines.push(line('output', `  · ${post.title}`)));
  }
  return lines;
}

function cmdSocial(): TerminalLine[] {
  return [
    line('accent', '── profiles ───────────────────────────────────────'),
    line('output', `  GitHub   ${PERSONAL_INFO.github}`),
    line('output', `  LinkedIn ${PERSONAL_INFO.linkedin}`),
    line('output', `  Email    ${PERSONAL_INFO.email}`),
    line('dim', ''),
    line('dim', 'Use ping contact for the full contact card.'),
  ];
}

function cmdTree(): TerminalLine[] {
  return [
    line('accent', '── portfolio.map ─────────────────────────────────'),
    line('output', '  /'),
    line('output', '  ├── about        how I think and work'),
    line('output', '  ├── portfolio    selected projects'),
    line('output', '  ├── blog         technical and personal notes'),
    line('output', '  ├── skills       tools and capabilities'),
    line('output', '  ├── experience   work history'),
    line('output', '  └── contact      start a conversation'),
    line('dim', ''),
    line('dim', 'Try: goto blog, latest, or find react'),
  ];
}

function cmdPingContact(): TerminalLine[] {
  return [
    line('info',    'PING guuleed.portfolio — transmitting contact data…'),
    line('dim',     ''),
    line('success', `  ✉  Email    : ${PERSONAL_INFO.email}`),
    line('success', `  ☎  Phone    : ${PERSONAL_INFO.phone}`),
    line('success', `  in LinkedIn : ${PERSONAL_INFO.linkedin}`),
    line('success', `  ⌥  GitHub   : ${PERSONAL_INFO.github}`),
    line('dim',     ''),
    line('info',    '64 bytes from guuleed.portfolio — seq=1 ttl=64 time=1.2ms'),
    line('info',    '64 bytes from guuleed.portfolio — seq=2 ttl=64 time=0.9ms'),
    line('dim',     ''),
    line('output',  'Response received. Feel free to reach out!'),
  ];
}

function cmdDate(): TerminalLine[] {
  const now = new Date();
  return [
    line('output', now.toUTCString()),
    line('dim',    `Unix timestamp: ${Math.floor(now.getTime() / 1000)}`),
  ];
}

function cmdUname(): TerminalLine[] {
  return [
    line('accent',  '  ██████╗ ███╗   ███╗     ██████╗  ██████╗ ██████╗ ████████╗'),
    line('accent',  ' ██╔════╝ ████╗ ████║    ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝'),
    line('accent',  ' ██║  ███╗██╔████╔██║    ██████╔╝██║   ██║██████╔╝   ██║   '),
    line('accent',  ' ██║   ██║██║╚██╔╝██║    ██╔═══╝ ██║   ██║██╔══██╗   ██║   '),
    line('accent',  ' ╚██████╔╝██║ ╚═╝ ██║    ██║     ╚██████╔╝██║  ██║   ██║   '),
    line('accent',  '  ╚═════╝ ╚═╝     ╚═╝    ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝  '),
    line('dim',     ''),
    line('info',    `Portfolio OS  : Guuleed/PortfolioShell v2.0.26`),
    line('info',    `Architecture  : x86_64 (React + TypeScript + Vite)`),
    line('info',    `Kernel        : CyberSec-${PERSONAL_INFO.name.split(' ')[0].toLowerCase()}-2.6.26-hardened`),
    line('info',    `Hostname      : ${PERSONAL_INFO.name.toLowerCase().replace(/\s+/g, '-')}.portfolio`),
    line('output',  `Uptime        : ${Math.floor(Date.now() / 1000)} seconds since epoch`),
    line('dim',     ''),
    line('success', `Operator      : ${PERSONAL_INFO.name}`),
    line('success', `Role          : ${PERSONAL_INFO.title}`),
    line('success', `Location      : ${PERSONAL_INFO.location}`),
  ];
}

// ── Main dispatcher ────────────────────────────────────────────────────────

export interface CommandResult {
  lines: TerminalLine[];
  /** If set, navigate to this section */
  navigate?: string;
  /** If set, change theme */
  theme?: 'dark' | 'light';
  /** If true, clear terminal history */
  clear?: boolean;
  /** If true, close the terminal */
  exit?: boolean;
}

export function executeCommand(raw: string): CommandResult {
  const trimmed = raw.trim();
  const [rawCommand = '', ...args] = trimmed.split(/\s+/);
  const cmd = rawCommand.toLowerCase();
  const arg = args.join(' ');
  const normalizedArg = arg.toLowerCase();

  switch (cmd) {
    case 'help':
    case '?':
      return { lines: cmdHelp() };

    case 'whoami':
      return { lines: cmdWhoami() };

    case 'ls':
    case 'dir':
      return { lines: cmdLs() };

    case 'cat': {
      const target = normalizedArg.trim();
      if (target === 'about')                      return { lines: cmdCatAbout() };
      if (target === 'skills')                     return { lines: cmdCatSkills() };
      if (target === 'experience')                 return { lines: cmdCatExperience() };
      if (target === 'certificates' || target === 'certs') return { lines: cmdCatCertificates() };
      if (target === 'portfolio' || target === 'projects')  return { lines: cmdCatPortfolio() };
      if (target === 'blog' || target === 'notes') return { lines: cmdPosts() };
      if (target === 'contact') return { lines: cmdPingContact() };
      if (!target) return { lines: [line('error', 'cat: missing operand. Try: cat skills, cat about, cat experience')] };
      return { lines: [line('error', `cat: ${target}: No such file or directory`)] };
    }

    case 'ping': {
      if (normalizedArg === 'contact' || normalizedArg === '') return { lines: cmdPingContact() };
      return { lines: [line('error', `ping: ${arg}: unknown host. Try: ping contact`)] };
    }

    case 'status':
      return { lines: cmdStatus() };

    case 'latest':
      return BLOG_POSTS[0]
        ? { lines: cmdLatest(), navigate: `/blog/${BLOG_POSTS[0].slug}` }
        : { lines: [line('error', 'latest: no blog notes found')] };

    case 'posts':
    case 'notes':
    case 'blog':
      return { lines: cmdPosts() };

    case 'read':
    case 'article': {
      const target = normalizedArg.trim();
      const post = target === 'latest' || target === '1'
        ? BLOG_POSTS[0]
        : BLOG_POSTS.find((entry) => entry.slug === target);
      if (!post) return { lines: [line('error', `read: '${arg || 'latest'}' not found. Try: posts`)] };
      return {
        lines: [line('success', `→ Opening ${post.title}…`)],
        navigate: `/blog/${post.slug}`,
      };
    }

    case 'find':
      return { lines: cmdFind(arg) };

    case 'stack':
      return { lines: cmdStack(arg.trim()) };

    case 'social':
      return { lines: cmdSocial() };

    case 'tree':
      return { lines: cmdTree() };

    case 'pwd':
      return { lines: cmdPwd() };

    case 'echo':
      return { lines: cmdEcho(arg) };

    case 'goto':
    case 'cd':
    case 'open': {
      const target = normalizedArg.replace(/^\//, '').trim();
      if (!target) return { lines: [line('warn', `Usage: ${cmd} <section>   (try: ls)`)], navigate: undefined };
      if (target === 'latest' || target === 'note') {
        return BLOG_POSTS[0]
          ? { lines: [line('success', `→ Opening latest note…`)], navigate: `/blog/${BLOG_POSTS[0].slug}` }
          : { lines: [line('error', 'No blog notes are available.') ] };
      }
      if (!NAVIGABLE_SECTIONS.includes(target as NavigableSection)) {
        return { lines: [line('error', `${cmd}: '${target}': unknown section. Run 'ls' to see options.`)] };
      }
      return {
        lines: [line('success', `→ Navigating to ${sectionToPath(target as NavigableSection)}…`)],
        navigate: target,
      };
    }

    case 'theme': {
      if (normalizedArg === 'dark')  return { lines: [line('success', '✓ Theme switched to dark mode.')],  theme: 'dark' };
      if (normalizedArg === 'light') return { lines: [line('success', '✓ Theme switched to light mode.')], theme: 'light' };
      return { lines: [line('error', `theme: unknown argument '${arg}'. Use: theme dark   or   theme light`)] };
    }

    case 'date':
      return { lines: cmdDate() };

    case 'uname':
      return { lines: cmdUname() };

    case 'clear':
    case 'cls':
      return { lines: [], clear: true };

    case 'exit':
    case 'quit':
    case 'q':
      return { lines: [line('dim', 'Session terminated. Goodbye.')], exit: true };

    case '':
      return { lines: [] };

    default:
      return {
        lines: [
          line('error', `bash: ${cmd}: command not found`),
          line('dim',   "Type 'help' for a list of available commands."),
        ],
      };
  }
}
