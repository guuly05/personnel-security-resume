/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
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
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const shouldReduceMotion = useReducedMotion();

  const terminal = useTerminal();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

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
    // Let the app own scroll restoration so client-side route changes behave
    // like document navigations while browser back/forward restores prior pages.
    window.history.scrollRestoration = 'manual';

    const saveScrollPosition = () => {
      const state = window.history.state && typeof window.history.state === 'object'
        ? window.history.state
        : {};
      window.history.replaceState({ ...state, scrollY: window.scrollY }, '', window.location.href);
    };

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
      saveScrollPosition();
      window.history.pushState({ scrollY: 0 }, '', url.pathname);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
      const segments = url.pathname.replace(/^\/+/, '').split('/');
      setActiveProjectSlug(segments[0] === 'portfolio' && segments[1] ? segments[1] : null);
      setIsMenuOpen(false);
    };

    window.addEventListener('popstate', applyCurrentRoute);
    let pendingScrollSave: number | null = null;
    const handleScroll = () => {
      if (pendingScrollSave !== null) return;
      pendingScrollSave = window.requestAnimationFrame(() => {
        pendingScrollSave = null;
        saveScrollPosition();
      });
    };
    const handlePopScroll = (event: PopStateEvent) => {
      if (pendingScrollSave !== null) {
        window.cancelAnimationFrame(pendingScrollSave);
        pendingScrollSave = null;
      }
      const scrollY = typeof event.state?.scrollY === 'number' ? event.state.scrollY : 0;
      window.requestAnimationFrame(() => window.scrollTo(0, scrollY));
    };
    window.addEventListener('popstate', handlePopScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });
    saveScrollPosition();
    document.addEventListener('click', handleDocumentClick);
    applyCurrentRoute();

    return () => {
      window.removeEventListener('popstate', applyCurrentRoute);
      window.removeEventListener('popstate', handlePopScroll);
      window.removeEventListener('scroll', handleScroll);
      if (pendingScrollSave !== null) window.cancelAnimationFrame(pendingScrollSave);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    if (activeSection !== 'blog') {
      setIsBlogFocusMode(false);
    }
  }, [activeSection]);

  const navItems = [
    { id: 'portfolio', label: 'Work', icon: 'layout' },
    { id: 'experience', label: 'Experience', icon: 'briefcase' },
    { id: 'skills', label: 'Skills', icon: 'sparkles' },
    { id: 'about', label: 'About', icon: 'user' },
    { id: 'blog', label: 'Notes', icon: 'book-open' },
    { id: 'book', label: 'Book a Call', icon: 'calendar-days' },
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
        aria-label="Primary navigation"
        className={`max-w-7xl mx-auto mb-10 border-b border-[var(--border)] px-1 py-4 transition-colors duration-300 flex flex-wrap items-center justify-between gap-4 ${chromeClassName}`}
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
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={sectionToPath(item.id as Section)}
              onClick={() => setActiveSection(item.id as Section)}
              aria-current={activeSection === item.id || (item.id === 'portfolio' && activeSection === 'portfolio-project') ? 'page' : undefined}
              className={`border-b-2 py-2 text-sm transition-colors duration-200 ${
                (activeSection === item.id || (item.id === 'portfolio' && activeSection === 'portfolio-project'))
                  ? 'border-[var(--accent)] font-semibold text-[var(--color-text)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={terminal.toggleTerminal}
aria-label={terminal.isOpen ? 'Close terminal' : 'Open terminal'}
            aria-expanded={terminal.isOpen}
            title={terminal.isOpen ? 'Close terminal (Ctrl+Alt+G)' : 'Open terminal (Ctrl+Alt+G)'}
            className="rounded-md border border-[var(--border)] p-2 text-[var(--color-text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <Icon name="terminal" size={18} />
          </button>
          <a
            href="/assets/Guuleed-Maxamuud-Awabdi-CV.pdf"
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-85 active:translate-y-px"
          >
            View my CV
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
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
            className="lg:hidden fixed inset-x-4 top-24 z-40 surface-card p-6 overflow-hidden"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-md border border-[var(--accent)] bg-[var(--surface-soft)] flex items-center justify-center font-bold text-[var(--accent)]">
                GM
              </div>
              <div className="text-sm font-bold">{PERSONAL_INFO.name}</div>
            </div>
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={sectionToPath(item.id as Section)}
                  onClick={() => {
                    setActiveSection(item.id as Section);
                    setIsMenuOpen(false);
                  }}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-md transition-colors
                    ${
                      (activeSection === item.id || (item.id === 'portfolio' && activeSection === 'portfolio-project'))
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--color-text)]'
                    }
                  `}
                >
                  <Icon name={item.icon} size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              ))}
            </div>

            <a
              href="/assets/Guuleed-Maxamuud-Awabdi-CV.pdf"
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-85"
            >
              <Icon name="file-text" size={16} /> View my CV
            </a>
            <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
              <button
                type="button"
                onClick={() => { terminal.openTerminal(); setIsMenuOpen(false); }}
                aria-label="Open terminal"
                className="inline-flex items-center gap-2 rounded-md py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <Icon name="terminal" size={17} />
                <span>Open terminal</span>
              </button>
              <span className="text-xs text-[var(--color-text-muted)]">Ctrl + Alt + G</span>
            </div>
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
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.24, ease: 'easeOut' }}
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

      <footer className={`max-w-7xl mx-auto mt-20 px-1 pb-8 ${chromeClassName}`}>
        <div className="flex flex-col gap-6 border-t border-[var(--border)] py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-base font-semibold text-[var(--color-text)]">{PERSONAL_INFO.name}</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{PERSONAL_INFO.title}</p>
          </div>
          <div role="group" aria-label="Social and contact links" className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--accent)]">
              LinkedIn
            </a>
            <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--accent)]">
              GitHub
            </a>
            <a href="/contact" onClick={() => setActiveSection('contact')} className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--accent)]">
              Contact
            </a>
            {(isJuly27 || activeSection === 'recap') && (
              <a
                href="/recap"
                onClick={() => setActiveSection('recap')}
                className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--accent)]"
              >
                Annual Reflection
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-[var(--border)] py-5 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} · All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="/privacy-policy" onClick={() => setActiveSection('privacy-policy')} className="transition-colors hover:text-[var(--accent)]">
              Privacy Policy
            </a>
            <a href="/terms-of-service" onClick={() => setActiveSection('terms-of-service')} className="transition-colors hover:text-[var(--accent)]">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>

      {/* Terminal overlay — rendered at root so it floats above everything */}
      <Terminal
        terminal={terminal}
        onNavigate={(destination) => {
          const path = destination.startsWith('/') ? destination : sectionToPath(destination as Section);
          const state = window.history.state && typeof window.history.state === 'object' ? window.history.state : {};
          window.history.replaceState({ ...state, scrollY: window.scrollY }, '', window.location.href);
          window.history.pushState({ scrollY: 0 }, '', path);
          window.dispatchEvent(new PopStateEvent('popstate'));
          window.scrollTo(0, 0);
        }}
        onTheme={(t) => setTheme(t)}
      />
    </div>
  );
}

