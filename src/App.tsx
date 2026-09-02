/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from './constants.ts';
import { Icon } from './components/Icon.tsx';
import { SeoHead } from './components/SeoHead.tsx';
import { BirthdayConfetti } from './components/BirthdayConfetti.tsx';
import { Terminal } from './components/Terminal.tsx';
import { useTerminal } from './hooks/useTerminal.ts';
import { pathToSection, hashToSection, sectionToPath, type Section } from './routing.ts';

import { lazy, Suspense } from 'react';

// Code-split pages for faster initial bundle loading
const HomePage = lazy(() => import('./pages/Home.tsx'));
const AboutPage = lazy(() => import('./pages/About.tsx'));
const SkillsPage = lazy(() => import('./pages/Skills.tsx'));
const ExperiencePage = lazy(() => import('./pages/Experience.tsx'));
const CertificatesPage = lazy(() => import('./pages/Certificates.tsx'));
const PortfolioPage = lazy(() => import('./pages/Portfolio.tsx'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetail.tsx'));
const BlogPage = lazy(() => import('./pages/Blog.tsx'));
const ContactPage = lazy(() => import('./pages/Contact.tsx'));
const BookCallPage = lazy(() => import('./pages/BookCall.tsx'));
const LegalPage = lazy(() => import('./pages/Legal.tsx'));
const AnnualRecapPage = lazy(() => import('./pages/AnnualRecap.tsx'));
const NotFoundPage = lazy(() => import('./pages/NotFound.tsx'));

function checkIsJuly27Today(): boolean {
  const today = new Date();
  // July is month index 6 (0-indexed)
  return today.getMonth() === 6 && today.getDate() === 27;
}

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>(() =>
    typeof window === 'undefined' ? 'home' : pathToSection(window.location.pathname),
  );
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const segments = window.location.pathname.replace(/^\/+/, '').split('/');
    return segments[0] === 'portfolio' && segments[1] ? segments[1] : null;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlogFocusMode, setIsBlogFocusMode] = useState(false);

  const terminal = useTerminal();

  const isJuly27 = checkIsJuly27Today();

  // Global keyboard shortcut: Ctrl+Alt+G toggles the terminal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        terminal.toggleTerminal();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [terminal]);

  useEffect(() => {
    const applyCurrentRoute = () => {
      const legacyHashSection = hashToSection(window.location.hash);
      if (legacyHashSection) {
        window.history.replaceState(null, '', sectionToPath(legacyHashSection));
        setActiveSection(legacyHashSection);
        return;
      }

      setActiveSection(pathToSection(window.location.pathname));
      const segments = window.location.pathname.replace(/^\/+/, '').split('/');
      setActiveProjectSlug(segments[0] === 'portfolio' && segments[1] ? segments[1] : null);
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target || anchor.hasAttribute('download')) {
        return;
      }

      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin) return;

      const nextSection = pathToSection(url.pathname);
      const isKnownRoute = nextSection !== 'not-found' || url.pathname === '/404';
      if (!isKnownRoute) return;

      event.preventDefault();
      window.history.pushState(null, '', url.pathname);
      window.dispatchEvent(new PopStateEvent('popstate'));
      const segments = url.pathname.replace(/^\/+/, '').split('/');
      setActiveProjectSlug(segments[0] === 'portfolio' && segments[1] ? segments[1] : null);
      setIsMenuOpen(false);
    };

    window.addEventListener('popstate', applyCurrentRoute);
    document.addEventListener('click', handleDocumentClick);
    applyCurrentRoute();

    return () => {
      window.removeEventListener('popstate', applyCurrentRoute);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    if (activeSection !== 'blog') {
      setIsBlogFocusMode(false);
    }
  }, [activeSection]);

  const navItems = [
    { id: 'home', label: 'Home', icon: 'layout' },
    { id: 'about', label: 'About', icon: 'user' },
    { id: 'skills', label: 'Capabilities', icon: 'terminal' },
    { id: 'experience', label: 'Experience', icon: 'briefcase' },
    { id: 'certificates', label: 'Learning', icon: 'graduation-cap' },
    { id: 'portfolio', label: 'Selected Work', icon: 'layout' },
    { id: 'book', label: 'Book a Call', icon: 'calendar' },
    { id: 'blog', label: 'Blog', icon: 'book-open' },
    { id: 'contact', label: 'Contact', icon: 'mail' },
  ];

  if (isJuly27 || activeSection === 'recap') {
    navItems.push({ id: 'recap', label: 'Annual Reflection', icon: 'film' });
  }

  const isBlogSection = activeSection === 'blog';
  const chromeClassName =
    isBlogSection && isBlogFocusMode ? 'opacity-0 pointer-events-none max-h-0 overflow-hidden' : '';

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 selection:bg-[var(--accent)]/20 bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      {/* Particle confetti only activates on July 27th */}
      <BirthdayConfetti isActive={isJuly27 || activeSection === 'recap'} />

      {/* Dynamic SEO head tags */}
      <SeoHead section={activeSection} />

      {/* Top Navbar */}
      <nav
        className={`max-w-7xl mx-auto mb-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition-colors duration-300 flex flex-wrap items-center justify-between gap-4 ${chromeClassName}`}
      >
        <div className="flex items-center gap-3 pl-2">
          <a
            href="/"
            onClick={() => {
              setActiveSection('home');
              setIsMenuOpen(false);
            }}
            className="inline-flex items-center gap-3"
            aria-label="Home"
          >
            <div className="w-10 h-10 rounded-lg border border-[var(--accent)] bg-[var(--surface-soft)] flex items-center justify-center font-bold text-[var(--accent)]">
              GM
            </div>
          </a>
          <div className="hidden sm:block">
            <span className="block text-sm font-bold leading-tight">{PERSONAL_INFO.name}</span>
            <p className="text-[10px] text-brand-cyan font-mono tracking-tighter uppercase">
              {PERSONAL_INFO.title}
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-1 items-center">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={sectionToPath(item.id as Section)}
              onClick={() => setActiveSection(item.id as Section)}
              className={`
                px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                  (activeSection === item.id || (item.id === 'portfolio' && activeSection === 'portfolio-project'))
                    ? 'bg-brand-cyan/10 text-brand-cyan'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--surface-soft)]'
                }
              `}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Terminal toggle button */}
          <button
            type="button"
            id="terminal-open-btn"
            onClick={terminal.toggleTerminal}
            aria-label="Open terminal"
            className="terminal-nav-btn"
          >
            <span style={{ fontSize: 14 }}>⌨</span>
            <span>&gt;_</span>
          </button>

          <a
            href="/contact"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)] transition hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] active:translate-y-px"
          >
            Contact
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile terminal toggle */}
          <button
            type="button"
            onClick={terminal.toggleTerminal}
            aria-label="Open terminal"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-2 text-[var(--color-text)] transition hover:border-[var(--accent)] font-mono text-xs font-semibold"
          >
            &gt;_
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-2 text-[var(--color-text)] transition hover:border-[var(--accent)]"
          >
            <Icon name={isMenuOpen ? 'x' : 'menu'} size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-4 top-24 z-40 surface-card p-6 overflow-hidden"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-md border border-[var(--accent)] bg-[var(--surface-soft)] flex items-center justify-center font-bold text-[var(--accent)]">
                GM
              </div>
              <div className="text-sm font-bold">{PERSONAL_INFO.name}</div>
            </div>
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={sectionToPath(item.id as Section)}
                  onClick={() => {
                    setActiveSection(item.id as Section);
                    setIsMenuOpen(false);
                  }}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                    ${
                      (activeSection === item.id || (item.id === 'portfolio' && activeSection === 'portfolio-project'))
                        ? 'bg-brand-cyan/10 text-brand-cyan'
                        : 'text-[var(--color-text-muted)]'
                    }
                  `}
                >
                  <Icon name={item.icon} size={20} />
                  <span className="font-bold uppercase tracking-widest text-xs">{item.label}</span>
                </a>
              ))}
            </div>

            {/* Terminal shortcut hint inside mobile menu */}
            <button
              type="button"
              onClick={() => { terminal.openTerminal(); setIsMenuOpen(false); }}
              className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-[var(--color-text-muted)] hover:text-[var(--accent)]"
            >
              <span className="font-mono text-base font-bold">&gt;_</span>
              <span className="font-bold uppercase tracking-widest text-xs">Terminal</span>
              <span className="ml-auto font-mono text-[10px] opacity-50">Ctrl+Alt+G</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto relative">
        <Suspense
          fallback={
            <div className="flex h-64 w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-8">
              <div className="flex items-center gap-3 text-sm font-semibold text-[var(--color-text-muted)]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
                <span>Loading section...</span>
              </div>
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSection}:${activeProjectSlug ?? ''}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === 'home' && <HomePage />}
              {activeSection === 'about' && <AboutPage />}
              {activeSection === 'skills' && <SkillsPage />}
              {activeSection === 'experience' && <ExperiencePage />}
              {activeSection === 'certificates' && <CertificatesPage />}
              {activeSection === 'portfolio' && <PortfolioPage />}
              {activeSection === 'portfolio-project' && <ProjectDetailPage slug={activeProjectSlug ?? ''} />}
              {activeSection === 'book' && <BookCallPage />}
              {activeSection === 'blog' && (
                <BlogPage
                  isFocusMode={isBlogFocusMode}
                  onFocusModeChange={setIsBlogFocusMode}
                />
              )}
              {activeSection === 'contact' && <ContactPage />}
              {activeSection === 'privacy-policy' && <LegalPage kind="privacy" />}
              {activeSection === 'terms-of-service' && <LegalPage kind="terms" />}
              {activeSection === 'recap' && <AnnualRecapPage />}
              {activeSection === 'not-found' && <NotFoundPage />}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      <footer
        className={`max-w-7xl mx-auto mt-20 pt-8 border-t border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest px-4 pb-12 ${chromeClassName}`}
      >
        <p>© 2026 {PERSONAL_INFO.name} — Built with care</p>
        <div className="flex flex-wrap items-center gap-6">
          {(isJuly27 || activeSection === 'recap') && (
            <a
              href="/recap"
              onClick={() => setActiveSection('recap')}
              className="hover:text-brand-cyan transition-colors"
            >
              Annual Reflection
            </a>
          )}
          <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="hover:text-brand-cyan transition-colors">
            LinkedIn
          </a>
          <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="hover:text-brand-cyan transition-colors">
            GitHub
          </a>
          <a href="/" className="hover:text-brand-cyan transition-colors">
            Home
          </a>
          <a href="/blog" className="hover:text-brand-cyan transition-colors">
            Blog
          </a>
          <a href="/privacy-policy" onClick={() => setActiveSection('privacy-policy')} className="hover:text-brand-cyan transition-colors">
            Privacy Policy
          </a>
          <a href="/terms-of-service" onClick={() => setActiveSection('terms-of-service')} className="hover:text-brand-cyan transition-colors">
            Terms of Service
          </a>
        </div>
      </footer>

      {/* Terminal overlay — rendered at root so it floats above everything */}
      <Terminal
        terminal={terminal}
        onNavigate={(section) => {
          window.history.pushState(null, '', sectionToPath(section as Section));
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
        onTheme={(t) => setTheme(t)}
      />
    </div>
  );
}
