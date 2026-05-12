/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from './constants.ts';
import { Icon } from './components/Icon.tsx';

// Pages - to be moved to separate files later for better structure
import AboutPage from './pages/About.tsx';
import SkillsPage from './pages/Skills.tsx';
import ExperiencePage from './pages/Experience.tsx';
import CertificatesPage from './pages/Certificates.tsx';
import PortfolioPage from './pages/Portfolio.tsx';
import ContactPage from './pages/Contact.tsx';

type Section = 'about' | 'skills' | 'experience' | 'certificates' | 'portfolio' | 'contact';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as Section;
      if (['about', 'skills', 'experience', 'certificates', 'portfolio', 'contact'].includes(hash)) {
        setActiveSection(hash);
      } else {
        setActiveSection('about');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navItems = [
    { id: 'about', label: 'About', icon: 'user' },
    { id: 'skills', label: 'Skills', icon: 'terminal' },
    // Experience navigation item inserted for the new section.
    { id: 'experience', label: 'Experience', icon: 'briefcase' },
    { id: 'certificates', label: 'Credentials', icon: 'graduation-cap' },
    { id: 'contact', label: 'Contact', icon: 'mail' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 selection:bg-brand-cyan/20">
      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto mb-10 p-2 glass-card rounded-2xl flex items-center justify-between sticky top-4 z-50 transition-all duration-300">
        <div className="flex items-center gap-3 pl-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-purple flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            GM
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold leading-tight">{PERSONAL_INFO.name}</h1>
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
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
              `}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-brand-cyan transition-colors"
        >
          <Icon name={isMenuOpen ? "x" : "menu"} size={24} />
        </button>

        {/* Divider for CTA if needed */}
        <div className="hidden md:flex items-center gap-4 pr-2">
          <a href="#contact" className="px-4 py-2 bg-brand-cyan text-brand-bg rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-transform active:scale-95">
            Hire Me
          </a>
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
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                    ${activeSection === item.id ? 'bg-brand-cyan/10 text-brand-cyan' : 'text-slate-400'}
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
            {activeSection === 'about' && <AboutPage />}
            {activeSection === 'skills' && <SkillsPage />}
            {activeSection === 'experience' && <ExperiencePage />}
            {activeSection === 'certificates' && <CertificatesPage />}
            {activeSection === 'portfolio' && <PortfolioPage />}
            {activeSection === 'contact' && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest px-4 pb-12">
        <p>© 2026 {PERSONAL_INFO.name} — Secure by Design</p>
        <div className="flex gap-6">
          <a href={PERSONAL_INFO.linkedin} target="_blank" className="hover:text-brand-cyan transition-colors">LinkedIn</a>
          <a href={PERSONAL_INFO.github} target="_blank" className="hover:text-brand-cyan transition-colors">GitHub</a>
          <a href="#portfolio" className="hover:text-brand-cyan transition-colors">Portfolio</a>
        </div>
      </footer>
    </div>
  );
}
