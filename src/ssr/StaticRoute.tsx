import React from 'react';
import HomePage from '../pages/Home.tsx';
import AboutPage from '../pages/About.tsx';
import SkillsPage from '../pages/Skills.tsx';
import ExperiencePage from '../pages/Experience.tsx';
import CertificatesPage from '../pages/Certificates.tsx';
import PortfolioPage from '../pages/Portfolio.tsx';
import ProjectDetailPage from '../pages/ProjectDetail.tsx';
import BlogPage from '../pages/Blog.tsx';
import ContactPage from '../pages/Contact.tsx';
import BookCallPage from '../pages/BookCall.tsx';
import AnnualRecapPage from '../pages/AnnualRecap.tsx';
import NotFoundPage from '../pages/NotFound.tsx';
import { BLOG_POSTS } from '../blog/posts.ts';
import { PERSONAL_INFO } from '../constants.ts';

const navItems = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/skills', 'Skills'],
  ['/experience', 'Experience'],
  ['/certificates', 'Credentials'],
  ['/portfolio', 'Portfolio'],
  ['/book', 'Book a Call'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
] as const;

function pageForPath(pathname: string) {
  if (pathname === '/') return <HomePage />;
  if (pathname === '/about') return <AboutPage />;
  if (pathname === '/skills') return <SkillsPage />;
  if (pathname === '/experience') return <ExperiencePage />;
  if (pathname === '/certificates') return <CertificatesPage />;
  if (pathname === '/portfolio') return <PortfolioPage />;
  if (pathname.startsWith('/portfolio/')) return <ProjectDetailPage slug={pathname.split('/')[2] ?? ''} />;
  if (pathname === '/book') return <BookCallPage />;
  if (pathname === '/contact') return <ContactPage />;
  if (pathname === '/recap') return <AnnualRecapPage />;
  if (pathname === '/blog') return <BlogPage isFocusMode={false} onFocusModeChange={() => undefined} />;
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.split('/')[2];
    if (BLOG_POSTS.some((post) => post.slug === slug)) {
      return <BlogPage initialSlug={slug} isFocusMode={false} onFocusModeChange={() => undefined} />;
    }
  }
  return <NotFoundPage />;
}

export function StaticRoute({ pathname }: { pathname: string }) {
  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="max-w-7xl mx-auto mb-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <nav aria-label="Primary navigation" className="flex flex-wrap items-center justify-between gap-4">
          <a href="/" className="inline-flex items-center gap-3" aria-label={`${PERSONAL_INFO.name} home`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--accent)] bg-[var(--surface-soft)] font-bold text-[var(--accent)]">GM</span>
            <span className="hidden sm:block"><strong className="block text-sm">{PERSONAL_INFO.name}</strong><small className="text-[10px] text-brand-cyan">{PERSONAL_INFO.title}</small></span>
          </a>
          <div className="flex flex-wrap gap-1">
            {navItems.map(([href, label]) => <a key={href} href={href} className="rounded-xl px-3 py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)]">{label}</a>)}
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto relative">{pageForPath(pathname)}</main>
      <footer className="max-w-7xl mx-auto mt-20 border-t border-brand-border pt-8 pb-12 text-center text-[10px] text-slate-500 font-mono uppercase tracking-widest">
        © 2026 {PERSONAL_INFO.name} — <a href="/contact">Contact</a> · <a href="/blog">Blog</a>
      </footer>
    </div>
  );
}

