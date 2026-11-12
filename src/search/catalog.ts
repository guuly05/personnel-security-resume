import { BLOG_POSTS } from '../blog/posts.ts';
import { CASE_STUDIES } from '../data/caseStudies.ts';
import { CORE_SKILLS, EXPERIENCES, TOOLSET } from '../constants.ts';

export type SearchDocument = { id: string; title: string; kind: string; url: string; summary: string; tags: string[]; body: string };

/** Public, local-only corpus shared by the search UI and Wasm index builder. */
export const SEARCH_DOCUMENTS: SearchDocument[] = [
  ...CASE_STUDIES.map((project) => ({ id: `project:${project.id}`, title: project.title, kind: 'Project', url: `/portfolio/${project.id}`, summary: project.subtitle, tags: project.techStack.map((item) => item.name), body: [project.challenge, project.approach, project.outcome, ...project.highlights].join(' ') })),
  ...BLOG_POSTS.map((post) => ({ id: `article:${post.slug}`, title: post.title, kind: 'Article', url: `/blog/${post.slug}`, summary: post.subtitle, tags: [...post.tags, ...post.relatedTopics], body: post.content })),
  ...CORE_SKILLS.map((skill, index) => ({ id: `skill:${index}`, title: skill, kind: 'Skill', url: '/skills', summary: 'Core technical skill', tags: ['skills'], body: skill })),
  ...TOOLSET.map((tool, index) => ({ id: `tool:${index}`, title: tool, kind: 'Tool', url: '/skills', summary: 'Technology and security tool', tags: ['tools', 'technology'], body: tool })),
  ...EXPERIENCES.map((experience, index) => ({ id: `experience:${index}`, title: `${experience.title} — ${experience.company}`, kind: 'Experience', url: '/experience', summary: experience.dateRange, tags: ['experience', experience.company], body: experience.bullets.join(' ') })),
];
