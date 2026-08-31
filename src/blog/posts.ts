/// <reference types="vite/client" />

export interface BlogCitation {
  title: string;
  url: string;
  publisher?: string;
}

export interface BlogFrontmatter {
  title: string;
  subtitle: string;
  date: string;
  lastUpdated: string;
  readTime: string;
  mood: string;
  image: string;
  tags: string[];
  relatedTopics: string[];
  citations: BlogCitation[];
}

export interface BlogPost extends BlogFrontmatter {
  slug: string;
  content: string;
}

type RawSources = Record<string, string>;

function browserSources(): RawSources {
  // Vite expands this at build time. The guarded access keeps the same module
  // usable by the Node-based sitemap, feed, and prerender scripts.
  if (typeof import.meta.glob === 'function') {
    return import.meta.glob('./posts/*.md', {
      eager: true,
      import: 'default',
      query: '?raw',
    }) as RawSources;
  }
  return {};
}

async function nodeSources(): Promise<RawSources> {
  if (typeof process === 'undefined' || !process.versions?.node) return {};

  // Keep Node-only filesystem access out of the browser bundle. The browser
  // path above is handled by Vite's import.meta.glob implementation.
  const [{ readdirSync, readFileSync }, { dirname, join }, { fileURLToPath }] = await Promise.all([
    import('node:fs'),
    import('node:path'),
    import('node:url'),
  ]);
  const directory = join(dirname(fileURLToPath(import.meta.url)), 'posts');
  return Object.fromEntries(
    readdirSync(directory)
      .filter((filename) => filename.endsWith('.md'))
      .map((filename) => [`./posts/${filename}`, readFileSync(join(directory, filename), 'utf8')]),
  );
}

function parseScalar(value: string): unknown {
  const trimmed = value.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed.replace(/^['"]|['"]$/g, '');
  }
}

function parseFrontmatter(source: string): { data: Record<string, unknown>; body: string } {
  const normalized = source.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error('Blog post is missing a frontmatter block.');

  const data: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator < 1) continue;
    data[line.slice(0, separator).trim()] = parseScalar(line.slice(separator + 1));
  }
  return { data, body: match[2].trimStart() };
}

function stringValue(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Blog frontmatter field "${key}" is required.`);
  return value;
}

function stringArray(data: Record<string, unknown>, key: string): string[] {
  const value = data[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`Blog frontmatter field "${key}" must be an array of strings.`);
  }
  return value;
}

function citations(data: Record<string, unknown>): BlogCitation[] {
  const value = data.citations;
  const list = Array.isArray(value) ? value : value && typeof value === 'object' ? [value] : [];
  return list.filter((item): item is BlogCitation => {
    if (!item || typeof item !== 'object') return false;
    const citation = item as Record<string, unknown>;
    return typeof citation.title === 'string' && typeof citation.url === 'string';
  });
}

function withoutDuplicateTitle(body: string, title: string) {
  const firstLine = body.split('\n')[0]?.trim();
  return firstLine === `# ${title}` ? body.split('\n').slice(1).join('\n').trimStart() : body;
}

function postFromSource(path: string, source: string): BlogPost {
  const { data, body } = parseFrontmatter(source);
  const filename = path.split('/').pop() ?? '';
  const slug = filename.replace(/\.md$/, '');
  const title = stringValue(data, 'title');

  return {
    slug,
    title,
    subtitle: stringValue(data, 'subtitle'),
    date: stringValue(data, 'date'),
    lastUpdated: stringValue(data, 'lastUpdated'),
    readTime: stringValue(data, 'readTime'),
    mood: stringValue(data, 'mood'),
    image: stringValue(data, 'image'),
    tags: stringArray(data, 'tags'),
    relatedTopics: stringArray(data, 'relatedTopics'),
    citations: citations(data),
    content: withoutDuplicateTitle(body, title),
  };
}

const sources = Object.keys(browserSources()).length > 0 ? browserSources() : await nodeSources();

export const BLOG_POSTS: BlogPost[] = Object.entries(sources)
  .map(([path, source]) => postFromSource(path, source))
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

export function formatBlogDate(value: string): string {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(date);
}
