import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, BookOpen, Maximize2, Minimize2, Search, Shield, Sparkles, TimerReset, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { BLOG_POSTS, BlogPost, formatBlogDate } from '../blog/posts.ts';
import { SITE_URL } from '../seo/metadata.ts';

type BlogPageProps = {
  isFocusMode: boolean;
  onFocusModeChange: (value: boolean) => void;
  initialSlug?: string | null;
};

type MoodPalette = {
  ambientA: string;
  ambientB: string;
  accent: string;
  soft: string;
  border: string;
};

const MOOD_PALETTES: Record<string, MoodPalette> = {
  Suspenseful: { ambientA: 'rgba(45, 212, 191, 0.1)', ambientB: 'rgba(56, 189, 248, 0.08)', accent: 'var(--accent)', soft: 'var(--surface-soft)', border: 'var(--border)' },
  Contemplative: { ambientA: 'rgba(45, 212, 191, 0.08)', ambientB: 'rgba(56, 189, 248, 0.06)', accent: 'var(--accent)', soft: 'var(--surface-soft)', border: 'var(--border)' },
  Analytical: { ambientA: 'rgba(56, 189, 248, 0.08)', ambientB: 'rgba(8, 145, 178, 0.07)', accent: 'var(--brand-purple)', soft: 'var(--surface-soft)', border: 'var(--border)' },
  'Deep-Dive': { ambientA: 'rgba(45, 212, 191, 0.08)', ambientB: 'rgba(56, 189, 248, 0.08)', accent: 'var(--brand-purple)', soft: 'var(--surface-soft)', border: 'var(--border)' },
};

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

function moodPalette(mood: string): MoodPalette {
  return MOOD_PALETTES[mood] ?? MOOD_PALETTES.Contemplative;
}

/** Allow local links/assets and network URLs, while rejecting javascript:, data:, and protocol-relative URLs. */
function safeUrlTransform(value: string) {
  const candidate = value.trim();
  if (!candidate || candidate.startsWith('//')) return '';
  if (candidate.startsWith('/') || candidate.startsWith('./') || candidate.startsWith('../') || candidate.startsWith('#')) return candidate;
  try {
    const url = new URL(candidate, SITE_URL);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? candidate : '';
  } catch {
    return '';
  }
}

function EditorialImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const [hasError, setHasError] = useState(!src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <figure className="blog-figure">
      <button type="button" className="blog-image-button" onClick={() => !hasError && setIsOpen(true)} aria-label={`Expand image: ${alt || 'Editorial image'}`}>
        <div className="blog-image-frame">
          {!hasError ? (
            <img src={src} alt={alt} loading="lazy" onLoad={() => setIsLoaded(true)} onError={() => setHasError(true)} className={`blog-image ${isLoaded ? 'is-loaded' : 'is-loading'}`} />
          ) : (
            <div className="blog-image-fallback">
              <span className="text-[10px] font-mono uppercase tracking-[0.34em] text-[var(--color-text-muted)]">Image unavailable</span>
              <strong className="mt-3 block font-display text-lg text-[var(--color-text)]">{alt || 'Editorial visual'}</strong>
            </div>
          )}
        </div>
      </button>
      <figcaption className="blog-caption">{caption || alt || 'Editorial image'}</figcaption>

      <AnimatePresence>
        {isOpen && !hasError && (
          <motion.button type="button" className="blog-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} aria-label="Close expanded image">
            <motion.img src={src} alt={alt} className="blog-lightbox-image" initial={{ scale: 0.96, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 18 }} transition={{ duration: 0.25 }} />
            <span className="blog-lightbox-close"><X size={16} /></span>
          </motion.button>
        )}
      </AnimatePresence>
    </figure>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      skipHtml
      urlTransform={safeUrlTransform}
      components={{
        h1: ({ children }) => <h2 className="blog-heading blog-heading-large">{children}</h2>,
        h2: ({ children }) => <h2 className="blog-heading blog-heading-large">{children}</h2>,
        h3: ({ children }) => <h3 className="blog-heading">{children}</h3>,
        h4: ({ children }) => <h4 className="blog-heading">{children}</h4>,
        p: ({ children }) => <p className="blog-paragraph">{children}</p>,
        blockquote: ({ children }) => <blockquote className="blog-quote">{children}</blockquote>,
        hr: () => <hr className="blog-divider" />,
        ul: ({ children }) => <ul className="blog-list">{children}</ul>,
        ol: ({ children }) => <ol className="blog-list blog-list-ordered">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        table: ({ children }) => <div className="blog-table-wrap"><table className="blog-table">{children}</table></div>,
        th: ({ children }) => <th>{children}</th>,
        td: ({ children }) => <td>{children}</td>,
        pre: ({ children }) => <pre className="blog-code-block">{children}</pre>,
        code: ({ className, children }) => <code className={className}>{children}</code>,
        a: ({ href, children }) => {
          const safeHref = safeUrlTransform(href ?? '');
          if (!safeHref) return <span>{children}</span>;
          const external = /^https?:\/\//i.test(safeHref);
          return <a href={safeHref} {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}>{children}</a>;
        },
        img: ({ src, alt }) => {
          const safeSrc = safeUrlTransform(src ?? '');
          return <EditorialImage src={safeSrc} alt={alt ?? ''} caption={alt ?? ''} />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function Tag({ children, onClick, active = false }: { children: string; onClick?: () => void; active?: boolean }) {
  const className = `blog-tag ${active ? 'is-active' : ''}`;
  return onClick ? <button type="button" className={className} onClick={onClick}>{children}</button> : <span className={className}>{children}</span>;
}

function IntroGate({ onEnter, palette }: { onEnter: () => void; palette: MoodPalette }) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  return (
    <motion.section className="blog-gate" onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); setPointer({ x: (event.clientX - bounds.left) / bounds.width - 0.5, y: (event.clientY - bounds.top) / bounds.height - 0.5 }); }} initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} style={{ '--ambient-a': palette.ambientA, '--ambient-b': palette.ambientB, '--gate-accent': palette.accent } as React.CSSProperties}>
      <div className="blog-gate-veil" />
      <div className="blog-gate-copy" style={{ transform: `translate(${pointer.x * 18}px, ${pointer.y * 18}px)` }}>
        <p className="blog-eyebrow">Editorial gate</p>
        <h1 className="blog-gate-title">A quiet blog for technical stories, mood, and reflection.</h1>
        <p className="blog-gate-text">Enter the archive to read one piece at a time, with the page atmosphere shifting to match the tone of the story.</p>
        <button type="button" onClick={onEnter} className="blog-enter-button">Enter Blog <Sparkles size={16} /></button>
      </div>
    </motion.section>
  );
}

function BlogCatalog({ posts, allPosts, onOpen, searchQuery, onSearchChange, activeTag, onTagChange }: { posts: BlogPost[]; allPosts: BlogPost[]; onOpen: (slug: string) => void; searchQuery: string; onSearchChange: (value: string) => void; activeTag: string; onTagChange: (value: string) => void }) {
  const post = posts[0];
  const allTags = [...new Set(allPosts.flatMap((entry) => entry.tags))].sort((a, b) => a.localeCompare(b));
  const palette = moodPalette(post?.mood ?? 'Contemplative');

  return (
    <section className="space-y-6">
      <div className="blog-catalog-hero surface-card p-6 md:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <p className="blog-eyebrow">Blog / Research archive</p>
            <h1 className="blog-hero-title">Engineering notes shaped like a premium magazine spread.</h1>
            <p className="max-w-3xl text-sm leading-7 text-[var(--color-text-muted)] md:text-base">Technical research, product thinking, systems notes, security history, and practical commentary—stored as portable Markdown and published with a searchable editorial index.</p>
          </div>
          <div className="blog-meta-stack"><span className="blog-meta-chip">{allPosts.length} stories</span><span className="blog-meta-chip">RSS + Atom ready</span><span className="blog-meta-chip">Frontmatter indexed</span></div>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="blog-search"><Search size={17} /><span className="sr-only">Search posts</span><input value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search titles, topics, and tags" type="search" /></label>
          <div className="flex flex-wrap gap-2" aria-label="Filter by tag"><Tag active={!activeTag} onClick={() => onTagChange('')}>All topics</Tag>{allTags.map((tag) => <Tag key={tag} active={activeTag === tag} onClick={() => onTagChange(tag)}>{tag}</Tag>)}</div>
        </div>
      </div>

      {!post ? <div className="surface-card p-10 text-center"><p className="blog-eyebrow">No matches</p><p className="mt-3 text-sm text-[var(--color-text-muted)]">Try another search term or clear the topic filter.</p></div> : <>
        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="blog-card-large surface-card overflow-hidden"><a href={`/blog/${post.slug}`} onClick={() => onOpen(post.slug)} className="block w-full text-left">
            <div className="blog-hero-frame"><div className="blog-hero-art" style={{ '--mood-accent': palette.accent, '--mood-soft': palette.soft } as React.CSSProperties}><span className="blog-kicker">Featured story</span><strong className="blog-hero-art-title">{post.title}</strong><span className="blog-hero-art-subtitle">{post.subtitle}</span></div></div>
            <div className="space-y-4 p-6 md:p-8"><div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.34em] text-[var(--color-text-muted)]"><span>{formatBlogDate(post.date)}</span><span className="h-1 w-1 rounded-full bg-[var(--border)]" /><span>{post.readTime}</span><span className="h-1 w-1 rounded-full bg-[var(--border)]" /><span>{post.mood}</span></div><h2 className="text-3xl font-display font-semibold leading-tight text-[var(--color-text)] md:text-4xl">{post.title}</h2><p className="max-w-2xl text-sm leading-7 text-[var(--color-text-muted)] md:text-[15px]">{post.subtitle}</p><div className="flex flex-wrap gap-2">{post.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div></div>
          </a></article>
          <aside className="space-y-4"><div className="surface-card p-6"><p className="blog-eyebrow">Catalog notes</p><div className="mt-5 space-y-3 text-sm leading-7 text-[var(--color-text-muted)]"><p>Every story is a standalone Markdown file with validated frontmatter, making publishing and review auditable.</p><p>Search covers titles, summaries, tags, and related topics. Use the feed links in the page footer to subscribe.</p></div></div><div className="surface-card p-6"><p className="blog-eyebrow">Current issue</p><div className="mt-5 grid gap-3"><div className="blog-side-stat"><BookOpen size={16} /><div><span className="block text-[10px] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">Subtitle</span><strong className="block text-sm text-[var(--color-text)]">{post.subtitle}</strong></div></div><div className="blog-side-stat"><TimerReset size={16} /><div><span className="block text-[10px] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">Published</span><strong className="block text-sm text-[var(--color-text)]">{formatBlogDate(post.date)}</strong></div></div><div className="blog-side-stat"><Shield size={16} /><div><span className="block text-[10px] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">Last updated</span><strong className="block text-sm text-[var(--color-text)]">{formatBlogDate(post.lastUpdated)}</strong></div></div></div></div></aside>
        </div>
        <div className="grid gap-4 md:grid-cols-2">{posts.slice(1).map((entry) => <article key={entry.slug} className="surface-card p-6 md:p-7"><a href={`/blog/${entry.slug}`} onClick={() => onOpen(entry.slug)} className="block w-full text-left"><div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.34em] text-[var(--color-text-muted)]"><span>{formatBlogDate(entry.date)}</span><span className="h-1 w-1 rounded-full bg-[var(--border)]" /><span>{entry.readTime}</span><span className="h-1 w-1 rounded-full bg-[var(--border)]" /></div><h2 className="mt-5 text-2xl font-display font-semibold leading-tight text-[var(--color-text)]">{entry.title}</h2><p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">{entry.subtitle}</p><div className="mt-4 flex flex-wrap gap-2">{entry.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div></a></article>)}</div>
      </>}
    </section>
  );
}

function BlogReader({ post, onBack, isFocusMode, onFocusModeChange, progress }: { post: BlogPost; onBack: () => void; isFocusMode: boolean; onFocusModeChange: (value: boolean) => void; progress: number }) {
  const palette = moodPalette(post.mood);
  const relatedPosts = BLOG_POSTS.filter((entry) => entry.slug !== post.slug && (entry.tags.some((tag) => post.relatedTopics.includes(tag)) || entry.relatedTopics.some((topic) => post.tags.includes(topic)))).slice(0, 2);
  const fallbackRelated = relatedPosts.length ? relatedPosts : BLOG_POSTS.filter((entry) => entry.slug !== post.slug).slice(0, 2);
  return (
    <section className={`blog-reader-shell ${isFocusMode ? 'is-focus-mode' : ''}`} style={{ '--ambient-a': palette.ambientA, '--ambient-b': palette.ambientB, '--accent-color': palette.accent, '--soft-color': palette.soft, '--border-color': palette.border } as React.CSSProperties}>
      <div className="blog-reader-topbar"><a href="/blog" onClick={onBack} className="blog-back-button"><ArrowLeft size={16} />Back to catalog</a><button type="button" onClick={() => onFocusModeChange(!isFocusMode)} className="blog-focus-button">{isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}{isFocusMode ? 'Exit focus' : 'Focus mode'}</button></div>
      <header className="blog-reader-hero surface-card p-6 md:p-8 lg:p-10"><div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end"><div className="space-y-5"><p className="blog-eyebrow"><a href="/blog">Blog</a> / Technical research</p><div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.34em] text-[var(--color-text-muted)]"><span>{formatBlogDate(post.date)}</span><span className="h-1 w-1 rounded-full bg-[var(--border)]" /><span>{post.readTime}</span><span className="h-1 w-1 rounded-full bg-[var(--border)]" /><span>{post.mood}</span></div><h1 className="blog-article-title">{post.title}</h1><p className="max-w-3xl text-sm leading-7 text-[var(--color-text-muted)] md:text-base">{post.subtitle}</p><p className="text-xs leading-6 text-[var(--color-text-muted)]">By <a href="/about" className="text-[var(--accent)]">Guuleed Maxmuud Aw Abdi</a> · Published {formatBlogDate(post.date)} · Updated {formatBlogDate(post.lastUpdated)}</p><div className="flex flex-wrap gap-2">{post.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div></div><div className="blog-reader-meta-panel"><div className="blog-progress-chip"><span className="text-[10px] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">Reading progress</span><strong className="mt-2 block text-lg text-[var(--color-text)]">{Math.round(progress * 100)}%</strong></div><div className="blog-progress-chip"><span className="text-[10px] uppercase tracking-[0.34em] text-[var(--color-text-muted)]">Last updated</span><strong className="mt-2 block text-lg text-[var(--color-text)]">{formatBlogDate(post.lastUpdated)}</strong></div></div></div></header>
      <div className={`blog-reader-layout ${isFocusMode ? 'is-focus-mode' : ''}`}><article className="blog-article surface-card p-6 md:p-8 lg:p-10"><div className="blog-article-prose"><MarkdownRenderer content={post.content} /></div><section className="blog-citation-panel" aria-labelledby="citations-heading"><p className="blog-eyebrow" id="citations-heading">Citations</p>{post.citations.length ? <ol>{post.citations.map((citation) => { const safeCitationUrl = safeUrlTransform(citation.url); return <li key={citation.url}>{safeCitationUrl ? <a href={safeCitationUrl} target="_blank" rel="noreferrer noopener">{citation.title}</a> : <span>{citation.title}</span>}{citation.publisher ? <span> · {citation.publisher}</span> : null}</li>; })}</ol> : <p>No citations listed for this post.</p>}</section></article><aside className="blog-article-rail"><div className="surface-card p-6 sticky top-6"><p className="blog-eyebrow">Issue details</p><div className="mt-5 space-y-4 text-sm leading-7 text-[var(--color-text-muted)]"><p><strong className="text-[var(--color-text)]">Published:</strong> {formatBlogDate(post.date)}</p><p><strong className="text-[var(--color-text)]">Last updated:</strong> {formatBlogDate(post.lastUpdated)}</p><div><strong className="text-[var(--color-text)]">Related topics</strong><div className="mt-3 flex flex-wrap gap-2">{post.relatedTopics.map((topic) => <Tag key={topic}>{topic}</Tag>)}</div></div><p>Images expand into a lightbox, citations stay visible at the end of the article, and code blocks remain easy to scan.</p></div></div></aside></div>
      <div className="blog-progress-line" aria-hidden="true"><span style={{ width: `${Math.round(progress * 1000) / 10}%` }} /></div><div className="blog-progress-orb" aria-hidden="true" style={{ transform: `translateX(${Math.max(0, Math.min(100, progress * 100))}vw)` }} /><nav aria-label="Related articles" className="mt-6 grid gap-4 md:grid-cols-2">{fallbackRelated.map((entry) => <a key={entry.slug} href={`/blog/${entry.slug}`} className="surface-card p-5 text-sm font-semibold text-[var(--color-text)] hover:border-[var(--accent)]">Read related article: {entry.title}</a>)}</nav>
    </section>
  );
}

const getSlugFromPath = (): string | null => {
  if (typeof window === 'undefined') return null;
  const parts = window.location.pathname.split('/');
  return parts[1] === 'blog' && parts[2] ? parts[2] : null;
};

export default function BlogPage({ isFocusMode, onFocusModeChange, initialSlug }: BlogPageProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(() => initialSlug ?? getSlugFromPath());
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const activePost = BLOG_POSTS.find((entry) => entry.slug === activeSlug) ?? BLOG_POSTS[0];
  const palette = moodPalette(activePost?.mood ?? 'Contemplative');
  const filteredPosts = useMemo(() => { const query = searchQuery.trim().toLowerCase(); return BLOG_POSTS.filter((post) => (!activeTag || post.tags.includes(activeTag)) && (!query || [post.title, post.subtitle, ...post.tags, ...post.relatedTopics].join(' ').toLowerCase().includes(query))); }, [activeTag, searchQuery]);

  useEffect(() => { const handlePopState = () => setActiveSlug(getSlugFromPath()); window.addEventListener('popstate', handlePopState); return () => window.removeEventListener('popstate', handlePopState); }, []);
  const handleOpen = (slug: string) => { setActiveSlug(slug); window.history.pushState(null, '', `/blog/${slug}`); };
  const handleBack = () => { setActiveSlug(null); window.history.pushState(null, '', '/blog'); };
  useEffect(() => { if (!activeSlug) { setProgress(0); return; } const updateProgress = () => { const documentHeight = document.documentElement.scrollHeight - window.innerHeight; const current = window.scrollY || document.documentElement.scrollTop || 0; setProgress(documentHeight <= 0 ? 0 : Math.max(0, Math.min(1, current / documentHeight))); }; updateProgress(); window.addEventListener('scroll', updateProgress, { passive: true }); return () => window.removeEventListener('scroll', updateProgress); }, [activeSlug]);
  useEffect(() => { if (activeSlug) { window.scrollTo({ top: 0, behavior: 'auto' }); onFocusModeChange(false); } }, [activeSlug, onFocusModeChange]);
  useEffect(() => { const root = document.documentElement; root.style.setProperty('--blog-ambient-a', palette.ambientA); root.style.setProperty('--blog-ambient-b', palette.ambientB); root.style.setProperty('--blog-accent', palette.accent); root.style.setProperty('--blog-soft', palette.soft); root.style.setProperty('--blog-border', palette.border); }, [palette]);

  return <div className="blog-page relative overflow-hidden"><div className="blog-page-ambient" aria-hidden="true" /><AnimatePresence mode="wait">{activeSlug && activePost ? <BlogReader key={activeSlug} post={activePost} onBack={handleBack} isFocusMode={isFocusMode} onFocusModeChange={onFocusModeChange} progress={progress} /> : <BlogCatalog key="catalog" posts={filteredPosts} allPosts={BLOG_POSTS} onOpen={handleOpen} searchQuery={searchQuery} onSearchChange={setSearchQuery} activeTag={activeTag} onTagChange={setActiveTag} />}</AnimatePresence></div>;
}
