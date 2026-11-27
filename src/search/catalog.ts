import { BLOG_POSTS } from '../blog/posts.ts';
import { CASE_STUDIES } from '../data/caseStudies.ts';
import { CORE_SKILLS, EXPERIENCES, TOOLSET } from '../constants.ts';
import { PROJECT_TIMELINE } from '../data/projectTimeline.ts';

export type SearchDocument = { id: string; title: string; kind: string; url: string; summary: string; tags: string[]; body: string };

/** Public, local-only corpus shared by the search UI and Wasm index builder. */
export const SEARCH_DOCUMENTS: SearchDocument[] = [
  ...CASE_STUDIES.map((project) => ({ id: `project:${project.id}`, title: project.title, kind: 'Project', url: `/portfolio/${project.id}`, summary: project.subtitle, tags: project.techStack.map((item) => item.name), body: [project.challenge, project.approach, project.outcome, ...project.highlights].join(' ') })),
  ...BLOG_POSTS.map((post) => ({ id: `article:${post.slug}`, title: post.title, kind: 'Article', url: `/blog/${post.slug}`, summary: post.subtitle, tags: [...post.tags, ...post.relatedTopics], body: post.content })),
  ...CORE_SKILLS.map((skill, index) => ({ id: `skill:${index}`, title: skill, kind: 'Skill', url: '/skills', summary: 'Core technical skill', tags: ['skills'], body: skill })),
  ...TOOLSET.map((tool, index) => ({ id: `tool:${index}`, title: tool, kind: 'Tool', url: '/skills', summary: 'Technology and security tool', tags: ['tools', 'technology'], body: tool })),
  ...EXPERIENCES.map((experience, index) => ({ id: `experience:${index}`, title: `${experience.title} — ${experience.company}`, kind: 'Experience', url: '/experience', summary: experience.dateRange, tags: ['experience', experience.company], body: experience.bullets.join(' ') })),
  ...PROJECT_TIMELINE.filter((project) => !project.projectId).map((project, index) => ({ id: `timeline:${index}`, title: project.title, kind: 'Milestone', url: '/about', summary: project.period, tags: ['career', 'timeline', ...project.tags], body: project.description })),
  { id: 'page:home', title: 'Home', kind: 'Page', url: '/', summary: 'Cybersecurity and software engineering portfolio', tags: ['home', 'portfolio'], body: 'About featured work recent projects contact profile' },
  { id: 'page:about', title: 'About', kind: 'Page', url: '/about', summary: 'Background, approach, and interests', tags: ['about', 'profile'], body: 'Biography career journey personal interests languages' },
  { id: 'page:portfolio', title: 'Portfolio', kind: 'Page', url: '/portfolio', summary: 'Selected projects and case studies', tags: ['projects', 'work'], body: 'Software engineering cybersecurity project case studies' },
  { id: 'page:experience', title: 'Experience', kind: 'Page', url: '/experience', summary: 'Professional experience and career history', tags: ['career', 'work'], body: 'Roles employment responsibilities and achievements' },
  { id: 'page:skills', title: 'Skills', kind: 'Page', url: '/skills', summary: 'Technical skills and tools', tags: ['technology', 'tools'], body: [...CORE_SKILLS, ...TOOLSET].join(' ') },
  { id: 'page:certificates', title: 'Certificates', kind: 'Page', url: '/certificates', summary: 'Certifications and learning', tags: ['certifications', 'education'], body: 'Cybersecurity certificates training credentials' },
  { id: 'page:contact', title: 'Contact', kind: 'Page', url: '/contact', summary: 'Get in touch', tags: ['email', 'contact'], body: 'Contact message reach out' },
  { id: 'page:systems', title: 'Systems Atlas', kind: 'Page', url: '/systems', summary: 'Explore systems and architecture', tags: ['systems', 'architecture'], body: 'Systems map infrastructure software architecture' },
  { id: 'page:legal', title: 'Legal and privacy', kind: 'Page', url: '/legal', summary: 'Privacy and legal information', tags: ['privacy', 'legal'], body: 'Privacy policy terms and disclosures' },
];
