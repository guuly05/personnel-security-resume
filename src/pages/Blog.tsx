import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Maximize2, Minimize2, Search, X } from 'lucide-react';
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
  Analytical: { ambientA: 'var(--accent-soft)', ambientB: 'var(--surface-soft)', accent: 'var(--accent)', soft: 'var(--surface-soft)', border: 'var(--border)' },
  'Deep-Dive': { ambientA: 'var(--accent-soft)', ambientB: 'var(--surface-soft)', accent: 'var(--accent)', soft: 'var(--surface-soft)', border: 'var(--border)' },
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

function PostVisual({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const palette = moodPalette(post.mood);
  return (
    <div className={`blog-post-visual ${featured ? 'is-featured' : ''}`} style={{ '--visual-accent': palette.accent, '--visual-soft': palette.soft } as React.CSSProperties} aria-hidden="true">
      <span className="blog-visual-grid" />
      <span className="blog-visual-index">{post.tags[0] ?? 'Notes'}</span>
      <span className="blog-visual-mark">{featured ? '01' : '↗'}</span>
      <span className="blog-visual-mood">{post.mood}</span>
    </div>
  );
}

function PostMeta({ post }: { post: BlogPost }) {
  return <div className="blog-post-meta"><span>{formatBlogDate(post.date)}</span><span className="blog-meta-dot" /><span>{post.readTime}</span></div>;
}

function BlogCatalog({ posts, allPosts, onOpen, searchQuery, onSearchChange, activeTag, onTagChange }: { posts: BlogPost[]; allPosts: BlogPost[]; onOpen: (slug: string) => void; searchQuery: string; onSearchChange: (value: string) => void; activeTag: string; onTagChange: (value: string) => void }) {
  const post = posts[0];
  const allTags = [...new Set(allPosts.flatMap((entry) => entry.tags))].sort((a, b) => a.localeCompare(b));

  return (
    <section className="blog-catalog">
      <header className="blog-catalog-intro">
        <div>
          <p className="blog-eyebrow">Blog / Research journal</p>
          <h1 className="blog-hero-title">Ideas on security, systems, and the future of technology.</h1>
          <p className="blog-catalog-lede">Technical research, practical commentary, and long-form notes from the desk of Guuleed Maxmuud Aw Abdi.</p>
        </div>
        <div className="blog-catalog-count"><strong>{allPosts.length}</strong><span>published notes</span></div>
      </header>

      <div className="blog-catalog-toolbar">
        <label className="blog-search"><Search size={17} /><span className="sr-only">Search posts</span><input value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search the journal" type="search" /></label>
        <div className="blog-filter-row" aria-label="Filter by topic"><Tag active={!activeTag} onClick={() => onTagChange('')}>All topics</Tag>{allTags.map((tag) => <Tag key={tag} active={activeTag === tag} onClick={() => onTagChange(tag)}>{tag}</Tag>)}</div>
      </div>

      {!post ? <div className="blog-empty-state surface-card"><p className="blog-eyebrow">No matches</p><p>Try another search term or clear the topic filter.</p></div> : <>
        <article className="blog-featured-post surface-card">
          <a href={`/blog/${post.slug}`} onClick={() => onOpen(post.slug)} className="blog-featured-link">
            <PostVisual post={post} featured />
            <div className="blog-featured-copy"><p className="blog-section-label">Featured note</p><PostMeta post={post} /><h2>{post.title}</h2><p>{post.subtitle}</p><div className="blog-card-footer"><div className="blog-card-tags">{post.tags.slice(0, 2).map((tag) => <Tag key={tag}>{tag}</Tag>)}</div><span className="blog-read-link">Read note <ArrowRight size={15} /></span></div></div>
          </a>
        </article>

        <div className="blog-section-heading"><div><p className="blog-section-label">The archive</p><h2>Latest notes</h2></div><span>{posts.length} {posts.length === 1 ? 'result' : 'results'}</span></div>
        <div className="blog-post-grid">{posts.slice(1).map((entry) => <article key={entry.slug} className="blog-post-card surface-card"><a href={`/blog/${entry.slug}`} onClick={() => onOpen(entry.slug)}><PostVisual post={entry} /><div className="blog-post-card-copy"><PostMeta post={entry} /><h3>{entry.title}</h3><p>{entry.subtitle}</p><div className="blog-card-footer"><div className="blog-card-tags">{entry.tags.slice(0, 2).map((tag) => <Tag key={tag}>{tag}</Tag>)}</div><span className="blog-read-link" aria-hidden="true"><ArrowRight size={15} /></span></div></div></a></article>)}</div>
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
      <header className="blog-reader-hero surface-card">
        <div className="blog-reader-heading">
          <div className="blog-reader-copy"><p className="blog-eyebrow"><a href="/blog">Blog</a> / Technical research</p><PostMeta post={post} /><h1 className="blog-article-title">{post.title}</h1><p className="blog-article-subtitle">{post.subtitle}</p><p className="blog-article-byline">By <a href="/about">Guuleed Maxmuud Aw Abdi</a> · Updated {formatBlogDate(post.lastUpdated)}</p><div className="blog-card-tags">{post.tags.slice(0, 3).map((tag) => <Tag key={tag}>{tag}</Tag>)}</div></div>
          <div className="blog-reader-visual"><PostVisual post={post} featured /><div className="blog-reader-progress"><span>Reading progress</span><strong>{Math.round(progress * 100)}%</strong></div></div>
        </div>
      </header>
      <div className={`blog-reader-layout ${isFocusMode ? 'is-focus-mode' : ''}`}><article className="blog-article surface-card p-6 md:p-8 lg:p-10"><div className="blog-article-prose"><MarkdownRenderer content={post.content} /></div><section className="blog-citation-panel" aria-labelledby="citations-heading"><p className="blog-eyebrow" id="citations-heading">Sources</p>{post.citations.length ? <ol>{post.citations.map((citation) => { const safeCitationUrl = safeUrlTransform(citation.url); return <li key={citation.url}>{safeCitationUrl ? <a href={safeCitationUrl} target="_blank" rel="noreferrer noopener">{citation.title}</a> : <span>{citation.title}</span>}{citation.publisher ? <span> · {citation.publisher}</span> : null}</li>; })}</ol> : <p>No sources listed for this post.</p>}</section></article><aside className="blog-article-rail"><div className="surface-card p-6 sticky top-6"><p className="blog-section-label">Keep exploring</p><h2 className="blog-rail-title">Related topics</h2><div className="blog-related-topics">{post.relatedTopics.map((topic) => <Tag key={topic}>{topic}</Tag>)}</div><div className="blog-rail-details"><span>Published</span><strong>{formatBlogDate(post.date)}</strong><span>Read time</span><strong>{post.readTime}</strong></div></div></aside></div>
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
