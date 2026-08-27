import { BLOG_POSTS } from './blog/posts.ts';

export type Section =
  | 'home'
  | 'about'
  | 'skills'
  | 'experience'
  | 'certificates'
  | 'portfolio'
  | 'portfolio-project'
  | 'book'
  | 'blog'
  | 'contact'
  | 'recap'
  | 'not-found';

type NavigableSection = Exclude<Section, 'not-found'>;

const SECTIONS: NavigableSection[] = [
  'home',
  'about',
  'skills',
  'experience',
  'certificates',
  'portfolio',
  'book',
  'blog',
  'contact',
  'recap',
];

const RECAP_ALIASES = ['reflection', 'surprise', 'vault'];

export function sectionToPath(section: Section): string {
  if (section === 'not-found') return '/404';
  return section === 'home' ? '/' : `/${section}`;
}

export function pathToSection(pathname: string): Section {
  const segments = pathname.replace(/^\/+/, '').split('/');
  const segment = segments[0];
  if (!segment) return 'home';
  if (segment === 'portfolio' && segments[1]) return 'portfolio-project';
  if (segment === 'blog' && segments[1] && !BLOG_POSTS.some((post) => post.slug === segments[1])) return 'not-found';
  if (RECAP_ALIASES.includes(segment)) return 'recap';
  return SECTIONS.includes(segment as NavigableSection) ? (segment as Section) : 'not-found';
}

export function hashToSection(hash: string): Section | null {
  const segment = hash.replace(/^#/, '').split('/')[0];
  if (!segment) return null;
  if (RECAP_ALIASES.includes(segment)) return 'recap';
  return SECTIONS.includes(segment as NavigableSection) ? (segment as Section) : null;
}
