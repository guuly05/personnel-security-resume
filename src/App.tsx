/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from './constants.ts';
import { Icon } from './components/Icon.tsx';
import { SeoHead } from './components/SeoHead.tsx';

// Pages - to be moved to separate files later for better structure
import HomePage from './pages/Home.tsx';
import AboutPage from './pages/About.tsx';
import SkillsPage from './pages/Skills.tsx';
import ExperiencePage from './pages/Experience.tsx';
import CertificatesPage from './pages/Certificates.tsx';
import PortfolioPage from './pages/Portfolio.tsx';
import BlogPage from './pages/Blog.tsx';
import ContactPage from './pages/Contact.tsx';

type Section = 'home' | 'about' | 'skills' | 'experience' | 'certificates' | 'portfolio' | 'blog' | 'contact';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlogFocusMode, setIsBlogFocusMode] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem('portfolio-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as Section;
      if (['home', 'about', 'skills', 'experience', 'certificates', 'portfolio', 'blog', 'contact'].includes(hash)) {
        setActiveSection(hash);
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (activeSection !== 'blog') {
      setIsBlogFocusMode(false);
    }
  }, [activeSection]);

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  const navItems = [
    { id: 'home', label: 'Home', icon: 'layout' },
    { id: 'about', label: 'About', icon: 'user' },
    { id: 'skills', label: 'Skills', icon: 'terminal' },
    // Experience navigation item inserted for the new section.
    { id: 'experience', label: 'Experience', icon: 'briefcase' },
    { id: 'certificates', label: 'Credentials', icon: 'graduation-cap' },
    { id: 'portfolio', label: 'Portfolio', icon: 'layout' },
    { id: 'blog', label: 'Blog', icon: 'book-open' },
    { id: 'contact', label: 'Contact', icon: 'mail' },
  ];

  const isBlogSection = activeSection === 'blog';
  const chromeClassName = isBlogSection && isBlogFocusMode ? 'opacity-0 pointer-events-none max-h-0 overflow-hidden' : '';

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 selection:bg-[var(--accent)]/20 bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      {/* Dynamic SEO head tags — updates per active section */}
      <SeoHead section={activeSection} />
      {/* Top Navbar */}
      <nav className={`max-w-7xl mx-auto mb-10 rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow)] backdrop-blur-xl transition-all duration-300 flex flex-wrap items-center justify-between gap-4 ${chromeClassName}`}>
        <div className="flex items-center gap-3 pl-2">
          <a
            href="#home"
            onClick={() => {
              setActiveSection('home');
              setIsMenuOpen(false);
            }}
            className="inline-flex items-center gap-3"
            aria-label="Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-purple flex items-center justify-center font-bold text-[var(--color-text)] shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              GM
            </div>
          </a>
          <div className="hidden sm:block">
            {/* nav brand: styled as bold text but NOT an h1 — the real h1 is on the Home page */}
            <span className="block text-sm font-bold leading-tight">{PERSONAL_INFO.name}</span>
            <p className="text-[10px] text-brand-cyan font-mono tracking-tighter uppercase">{PERSONAL_INFO.title}</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`
                px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                ${activeSection === item.id 
                  ? 'bg-brand-cyan/10 text-brand-cyan' 
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--surface-soft)]'}
              `}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="inline-flex items-center gap-2 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>

          <a
            href="#contact"
            className="rounded-3xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)] shadow-[0_0_18px_rgba(16,185,129,0.25)] transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Contact
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-2 text-[var(--color-text)] transition hover:border-[var(--accent)]"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-2 text-[var(--color-text)] transition hover:border-[var(--accent)]"
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
            className="md:hidden fixed inset-x-4 top-24 z-40 glass-card p-6 overflow-hidden shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-purple flex items-center justify-center font-bold text-[var(--color-text)]">GM</div>
                <div className="text-sm font-bold">{PERSONAL_INFO.name}</div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => toggleTheme()}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  className="inline-flex items-center gap-2 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
                  <span className="text-sm">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                    ${activeSection === item.id ? 'bg-brand-cyan/10 text-brand-cyan' : 'text-[var(--color-text-muted)]'}
                  `}
                >
                  <Icon name={item.icon} size={20} />
                  <span className="font-bold uppercase tracking-widest text-xs">{item.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
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
            {activeSection === 'blog' && (
              <BlogPage
                isFocusMode={isBlogFocusMode}
                onFocusModeChange={setIsBlogFocusMode}
              />
            )}
            {activeSection === 'contact' && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className={`max-w-7xl mx-auto mt-20 pt-8 border-t border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest px-4 pb-12 ${chromeClassName}`}>
        <p>© 2026 {PERSONAL_INFO.name} — Secure by Design</p>
        <div className="flex gap-6">
          <a href={PERSONAL_INFO.linkedin} target="_blank" className="hover:text-brand-cyan transition-colors">LinkedIn</a>
          <a href={PERSONAL_INFO.github} target="_blank" className="hover:text-brand-cyan transition-colors">GitHub</a>
          <a href="#home" className="hover:text-brand-cyan transition-colors">Home</a>
          <a href="#blog" className="hover:text-brand-cyan transition-colors">Blog</a>
        </div>
      </footer>
    </div>
  );
}
