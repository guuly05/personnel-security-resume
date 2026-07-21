import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, BookOpen, Maximize2, Minimize2, Shield, Sparkles, TimerReset, X } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../blog/posts.ts';

type BlogPageProps = {
  isFocusMode: boolean;
  onFocusModeChange: (value: boolean) => void;
};

type LightboxState = {
  src: string;
  alt: string;
};

type MoodPalette = {
  ambientA: string;
  ambientB: string;
  accent: string;
  soft: string;
  border: string;
};

const STORAGE_KEY = 'blog-unlocked';

const MOOD_PALETTES: Record<string, MoodPalette> = {
  Suspenseful: {
    ambientA: 'rgba(45, 212, 191, 0.1)',
    ambientB: 'rgba(56, 189, 248, 0.08)',
    accent: 'var(--accent)',
    soft: 'var(--surface-soft)',
    border: 'var(--border)',
  },
  Contemplative: {
    ambientA: 'rgba(45, 212, 191, 0.08)',
    ambientB: 'rgba(56, 189, 248, 0.06)',
    accent: 'var(--accent)',
    soft: 'var(--surface-soft)',
    border: 'var(--border)',
  },
  Analytical: {
    ambientA: 'rgba(56, 189, 248, 0.08)',
    ambientB: 'rgba(8, 145, 178, 0.07)',
    accent: 'var(--brand-purple)',
    soft: 'var(--surface-soft)',
    border: 'var(--border)',
  },
  'Deep-Dive': {
    ambientA: 'rgba(45, 212, 191, 0.08)',
    ambientB: 'rgba(56, 189, 248, 0.08)',
    accent: 'var(--brand-purple)',
    soft: 'var(--surface-soft)',
    border: 'var(--border)',
  },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInlineMarkdown(value: string) {
  let html = escapeHtml(value);
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  return html;
}

function moodPalette(mood: string): MoodPalette {
  return MOOD_PALETTES[mood] ?? MOOD_PALETTES.Contemplative;
}

function parseBodyTitle(rawMarkdown: string, title: string) {
  const bodyMatch = rawMarkdown.replace(/\r\n/g, '\n').match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/);
  const body = (bodyMatch?.[1] ?? rawMarkdown).replace(/^\n+/, '');
  const lines = body.split('\n');
  if (lines[0]?.trim() === `# ${title}`) {
    return lines.slice(1).join('\n');
  }
  return body;
}

function extractCaptionFromNote(note: string, altText: string) {
  const match = note.match(/caption:\s*"([^"]+)"/i);
  if (match?.[1]) return match[1];
  return altText || 'Editorial image';
}

function EditorialImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <figure className="blog-figure">
      <button type="button" className="blog-image-button" onClick={() => setIsOpen(true)}>
        <div className="blog-image-frame">
          {!hasError ? (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={`blog-image ${isLoaded ? 'is-loaded' : 'is-loading'}`}
            />
          ) : (
            <div className="blog-image-fallback">
              <span className="text-[10px] font-mono uppercase tracking-[0.34em] text-[var(--color-text-muted)]">
                Image not found
              </span>
              <strong className="mt-3 block font-display text-lg text-[var(--color-text)]">{alt || 'Editorial visual'}</strong>
            </div>
          )}
        </div>
      </button>
      <figcaption className="blog-caption">{caption}</figcaption>

      <AnimatePresence>
        {isOpen && !hasError && (
          <motion.button
            type="button"
            className="blog-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.img
              src={src}
              alt={alt}
              className="blog-lightbox-image"
              initial={{ scale: 0.96, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 18 }}
              transition={{ duration: 0.25 }}
            />
            <span className="blog-lightbox-close">
              <X size={16} />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </figure>
  );
}

function parseMarkdown(markdown: string, title?: string): ReactNode[] {
  const body = title ? parseBodyTitle(markdown, title) : markdown;
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const nodes: ReactNode[] = [];
  let index = 0;
  let keyIndex = 0;

  const nextKey = (prefix: string) => `${prefix}-${keyIndex++}`;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }

      index += 1;
      nodes.push(
        <pre key={nextKey('code')} className="blog-code-block">
          <div className="blog-code-label">{language || 'text'}</div>
          <code>{codeLines.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      const headingLevel = trimmed.match(/^#{1,6}/)?.[0].length ?? 1;
      const headingText = trimmed.replace(/^#{1,6}\s+/, '');
      const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements;

      nodes.push(
        <HeadingTag
          key={nextKey('heading')}
          className={headingLevel <= 2 ? 'blog-heading blog-heading-large' : 'blog-heading'}
          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(headingText) }}
        />,
      );
      index += 1;
      continue;
    }

    if (trimmed === '---') {
      nodes.push(<hr key={nextKey('divider')} className="blog-divider" />);
      index += 1;
      continue;
    }

    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quoteLines.push(lines[index].replace(/^>\s?/, '').trim());
        index += 1;
      }

      nodes.push(
        <blockquote
          key={nextKey('quote')}
          className="blog-quote"
          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(quoteLines.join(' ')) }}
        />,
      );
      continue;
    }

    if (/^!\[[^\]]*\]\([^\)]+\)$/.test(trimmed)) {
      const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^\)]+)\)$/);
      const altText = imageMatch?.[1] ?? '';
      const src = imageMatch?.[2] ?? '';
      let caption = altText || 'Editorial image';
      let consumedLines = 1;

      const noteStart = index + 1;
      if (noteStart < lines.length) {
        const noteLine = lines[noteStart].trim();
        if (noteLine.startsWith('*When processing the image above')) {
          let noteText = '';
          let noteIndex = noteStart;
          while (noteIndex < lines.length && lines[noteIndex].trim()) {
            noteText += `${lines[noteIndex].trim()} `;
            noteIndex += 1;
          }
          caption = extractCaptionFromNote(noteText, altText);
          consumedLines = noteIndex - index;
        }
      }

      nodes.push(<EditorialImage key={nextKey('image')} src={src} alt={altText} caption={caption} />);
      index += consumedLines;
      continue;
    }

    if (/^[*-]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^[*-]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[*-]\s+/, ''));
        index += 1;
      }

      nodes.push(
        <ul key={nextKey('list')} className="blog-list">
          {items.map((item) => (
            <li key={`${item.slice(0, 24)}-${item.length}`} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }} />
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ''));
        index += 1;
      }

      nodes.push(
        <ol key={nextKey('ordered-list')} className="blog-list blog-list-ordered">
          {items.map((item) => (
            <li key={`${item.slice(0, 24)}-${item.length}`} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }} />
          ))}
        </ol>,
      );
      continue;
    }

    if (/^\|.+\|$/.test(trimmed)) {
      const tableLines: string[] = [];
      while (index < lines.length && /^\|.+\|$/.test(lines[index].trim())) {
        tableLines.push(lines[index].trim());
        index += 1;
      }

      const rows = tableLines
        .filter((row) => !/^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|$/.test(row))
        .map((row) => row.split('|').slice(1, -1).map((cell) => cell.trim()));
      const [headers, ...bodyRows] = rows;

      nodes.push(
        <div key={nextKey('table')} className="blog-table-wrap">
          <table className="blog-table">
            {headers && (
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th key={header} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(header) }} />
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(cell) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^#{1,6}\s+/.test(lines[index].trim()) &&
      lines[index].trim() !== '---' &&
      !lines[index].trim().startsWith('>') &&
      !lines[index].trim().startsWith('```') &&
      !/^!\[[^\]]*\]\([^\)]+\)$/.test(lines[index].trim()) &&
      !/^[*-]\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim()) &&
      !/^\|.+\|$/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    nodes.push(
      <p key={nextKey('paragraph')} className="blog-paragraph" dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(paragraphLines.join(' ')) }} />,
    );
  }

  return nodes;
}

function IntroGate({ onEnter, palette }: { onEnter: () => void; palette: MoodPalette }) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  return (
    <motion.section
      className="blog-gate"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        setPointer({ x, y });
      }}
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        ['--ambient-a' as string]: palette.ambientA,
        ['--ambient-b' as string]: palette.ambientB,
        ['--gate-accent' as string]: palette.accent,
      }}
    >
      <div className="blog-gate-veil" />
      <div className="blog-gate-copy" style={{ transform: `translate(${pointer.x * 18}px, ${pointer.y * 18}px)` }}>
        <p className="blog-eyebrow">Editorial gate</p>
        <h1 className="blog-gate-title">A quiet blog for technical stories, mood, and reflection.</h1>
        <p className="blog-gate-text">
          Enter the archive to read one piece at a time, with the page atmosphere shifting to match the tone of the story.
        </p>
        <button type="button" onClick={onEnter} className="blog-enter-button">
          Enter Blog
          <Sparkles size={16} />
        </button>
      </div>
    </motion.section>
  );
}

function BlogCatalog({
  posts,
  onOpen,
}: {
  posts: BlogPost[];
  onOpen: (slug: string) => void;
}) {
  const post = posts[0];
  const otherPosts = posts.slice(1);
  const palette = moodPalette(post.mood);

  return (
    <section className="space-y-6">
      <div className="blog-catalog-hero surface-card p-6 md:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div className="space-y-4">
            <p className="blog-eyebrow">Blog / Issue 01</p>
            <h2 className="blog-hero-title">Editorial writing shaped like a premium magazine spread.</h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
              This blog uses custom markdown rendering, mood-based ambience, and a clean reading mode to make long-form technical writing feel more tactile.
            </p>
          </div>

          <div className="blog-meta-stack">
            <span className="blog-meta-chip">Session unlocked</span>
            <span className="blog-meta-chip">Mood: {post.mood}</span>
            <span className="blog-meta-chip">Read time: {post.readTime}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="blog-card-large surface-card overflow-hidden">
          <button type="button" onClick={() => onOpen(post.slug)} className="block w-full text-left">
            <div className="blog-hero-frame">
              <div
                className="blog-hero-art"
                style={{ ['--mood-accent' as string]: palette.accent, ['--mood-soft' as string]: palette.soft }}
              >
                <span className="blog-kicker">Featured story</span>
                <strong className="blog-hero-art-title">{post.title}</strong>
                <span className="blog-hero-art-subtitle">{post.subtitle}</span>
              </div>
            </div>

            <div className="space-y-4 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.34em] text-[var(--color-text-muted)]">
                <span>{post.date}</span>
                <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
                <span>{post.readTime}</span>
                <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
                <span>{post.mood}</span>
              </div>

              <h3 className="text-3xl font-display font-semibold leading-tight text-[var(--color-text)] md:text-4xl">
                {post.title}
              </h3>
              <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-muted)] md:text-[15px]">
                {post.subtitle}
              </p>
            </div>
          </button>
        </article>

        <aside className="space-y-4">
          <div className="surface-card p-6">
            <p className="blog-eyebrow">Catalog notes</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
              <p>This section scales from one seed post to a full editorial archive without changing the layout language.</p>
              <p>Stories use custom image frames, blockquotes, lists, tables, and ambient mood treatment to keep the reading experience visually varied.</p>
            </div>
          </div>

          <div className="surface-card p-6">
            <p className="blog-eyebrow">Current issue</p>
            <div className="mt-5 grid gap-3">
              <div className="blog-side-stat">
                <BookOpen size={16} />
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">Subtitle</span>
                  <strong className="block text-sm text-[var(--color-text)]">{post.subtitle}</strong>
                </div>
              </div>
              <div className="blog-side-stat">
                <TimerReset size={16} />
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">Published</span>
                  <strong className="block text-sm text-[var(--color-text)]">{post.date}</strong>
                </div>
              </div>
              <div className="blog-side-stat">
                <Shield size={16} />
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">Mood</span>
                  <strong className="block text-sm text-[var(--color-text)]">{post.mood}</strong>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {otherPosts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {otherPosts.map((entry) => (
            <article key={entry.slug} className="surface-card p-6 md:p-7">
              <button type="button" onClick={() => onOpen(entry.slug)} className="block w-full text-left">
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.34em] text-[var(--color-text-muted)]">
                  <span>{entry.date}</span>
                  <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
                  <span>{entry.readTime}</span>
                  <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
                  <span>{entry.mood}</span>
                </div>
                <h3 className="mt-5 text-2xl font-display font-semibold leading-tight text-[var(--color-text)]">
                  {entry.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">{entry.subtitle}</p>
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function BlogReader({
  post,
  onBack,
  isFocusMode,
  onFocusModeChange,
  progress,
}: {
  post: BlogPost;
  onBack: () => void;
  isFocusMode: boolean;
  onFocusModeChange: (value: boolean) => void;
  progress: number;
}) {
  const palette = moodPalette(post.mood);
  const renderedBody = useMemo(() => parseMarkdown(post.rawMarkdown, post.title), [post.rawMarkdown, post.title]);

  return (
    <section
      className={`blog-reader-shell ${isFocusMode ? 'is-focus-mode' : ''}`}
      style={{
        ['--ambient-a' as string]: palette.ambientA,
        ['--ambient-b' as string]: palette.ambientB,
        ['--accent-color' as string]: palette.accent,
        ['--soft-color' as string]: palette.soft,
        ['--border-color' as string]: palette.border,
      }}
    >
      <Helmet>
        <title>{`${post.title} | Blog`}</title>
        <meta name="description" content={post.subtitle} />
      </Helmet>

      <div className="blog-reader-topbar">
        <button type="button" onClick={onBack} className="blog-back-button">
          <ArrowLeft size={16} />
          Back to catalog
        </button>

        <button type="button" onClick={() => onFocusModeChange(!isFocusMode)} className="blog-focus-button">
          {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          {isFocusMode ? 'Exit focus' : 'Focus mode'}
        </button>
      </div>

      <header className="blog-reader-hero surface-card p-6 md:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.34em] text-[var(--color-text-muted)]">
              <span>{post.date}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
              <span>{post.readTime}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
              <span>{post.mood}</span>
            </div>
            <h1 className="blog-article-title">{post.title}</h1>
            <p className="max-w-3xl text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
              {post.subtitle}
            </p>
          </div>

          <div className="blog-reader-meta-panel">
            <div className="blog-progress-chip">
              <span className="text-[10px] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">Reading progress</span>
              <strong className="mt-2 block text-lg text-[var(--color-text)]">{Math.round(progress * 100)}%</strong>
            </div>
            <div className="blog-progress-chip">
              <span className="text-[10px] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">Mood</span>
              <strong className="mt-2 block text-lg text-[var(--color-text)]">{post.mood}</strong>
            </div>
          </div>
        </div>
      </header>

      <div className={`blog-reader-layout ${isFocusMode ? 'is-focus-mode' : ''}`}>
        <article className="blog-article surface-card p-6 md:p-8 lg:p-10">
          <div className="blog-article-prose">{renderedBody}</div>
        </article>

        <aside className="blog-article-rail">
          <div className="surface-card p-6 sticky top-6">
            <p className="blog-eyebrow">Issue details</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--color-text-muted)]">
              <p>The page palette subtly shifts to match the post mood, keeping the atmosphere consistent without overpowering readability.</p>
              <p>Images expand into a lightbox, quotes become editorial callouts, and code blocks stay calm, crisp, and easy to scan.</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="blog-progress-line" aria-hidden="true">
        <span style={{ width: `${Math.round(progress * 1000) / 10}%` }} />
      </div>
      <div className="blog-progress-orb" aria-hidden="true" style={{ transform: `translateX(${Math.max(0, Math.min(100, progress * 100))}vw)` }} />
    </section>
  );
}

export default function BlogPage({ isFocusMode, onFocusModeChange }: BlogPageProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem(STORAGE_KEY) === 'true';
  });
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const activePost = BLOG_POSTS.find((entry) => entry.slug === activeSlug) ?? BLOG_POSTS[0];
  const palette = moodPalette(activePost.mood);

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, isUnlocked ? 'true' : 'false');
  }, [isUnlocked]);

  useEffect(() => {
    if (!activeSlug) {
      setProgress(0);
      return;
    }

    const updateProgress = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY || document.documentElement.scrollTop || 0;
      const nextProgress = documentHeight <= 0 ? 0 : current / documentHeight;
      setProgress(Math.max(0, Math.min(1, nextProgress)));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    return () => window.removeEventListener('scroll', updateProgress);
  }, [activeSlug]);

  useEffect(() => {
    if (activeSlug) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      onFocusModeChange(false);
    }
  }, [activeSlug, onFocusModeChange]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--blog-ambient-a', palette.ambientA);
    root.style.setProperty('--blog-ambient-b', palette.ambientB);
    root.style.setProperty('--blog-accent', palette.accent);
    root.style.setProperty('--blog-soft', palette.soft);
    root.style.setProperty('--blog-border', palette.border);
  }, [palette]);

  return (
    <div className="blog-page relative overflow-hidden">
      <div className="blog-page-ambient" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <IntroGate key="gate" onEnter={() => setIsUnlocked(true)} palette={palette} />
        ) : activeSlug ? (
          <BlogReader
            key={activeSlug}
            post={activePost}
            onBack={() => setActiveSlug(null)}
            isFocusMode={isFocusMode}
            onFocusModeChange={onFocusModeChange}
            progress={progress}
          />
        ) : (
          <BlogCatalog key="catalog" posts={BLOG_POSTS} onOpen={setActiveSlug} />
        )}
      </AnimatePresence>
    </div>
  );
}
