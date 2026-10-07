import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ABOUT_LETTER, PERSONAL_INFO, SOFT_SKILLS } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';
import { useFocusTrap } from '../hooks/useFocusTrap.ts';
import { PROJECT_TIMELINE } from '../data/projectTimeline.ts';

type MediaItem = {
  title: string;
  image: string;
  description: string;
  highlight: string;
};

type HobbyCard = {
  id: 'anime' | 'games' | 'books' | 'manhwa';
  title: string;
  blurb: string;
  icon: string;
  items: MediaItem[];
};

const personalPrinciples = [
  { title: 'Build useful systems', description: 'I care about products that solve a real problem and feel dependable to use.', icon: 'layers' },
  { title: 'Keep learning', description: 'Every project is a chance to strengthen fundamentals and discover a better approach.', icon: 'sparkles' },
  { title: 'Think securely', description: 'Good experiences should also respect privacy, boundaries, and the people using them.', icon: 'shield-check' },
  { title: 'Finish with care', description: 'Documentation, accessibility, polish, and consistency are part of the work.', icon: 'check' },
];

const hobbyCards: HobbyCard[] = [
  {
    id: 'anime',
    title: 'Anime',
    blurb: 'Top 5 anime I enjoy the most.',
    icon: 'layers',
    items: [
      {
        title: 'Code Geass',
        image: '/images/anime/code-geass.jpg',
        description:
          'A strategic rebellion story centered on power, consequence, and high-stakes decisions. The pacing and mind games make each arc feel intense and meaningful.',
        highlight: 'The strategy battles and big turning points.',
      },
      {
        title: 'Bleach',
        image: '/images/anime/bleach.jpg',
        description:
          'A long-form action series built around sword combat, identity, and escalation across major arcs. It balances stylish fights with strong rivalry dynamics.',
        highlight: 'The sword fights and iconic arc progression.',
      },
      {
        title: 'Naruto Shippuden',
        image: '/images/anime/naruto-shippuden.jpg',
        description:
          'A character-driven continuation focused on growth, sacrifice, and conflict between ideals. It combines emotional storytelling with memorable battles.',
        highlight: 'The emotional arcs and character growth.',
      },
      {
        title: 'Overlord',
        image: '/images/anime/overlord.jpg',
        description:
          'A dark fantasy perspective where leadership, world politics, and overwhelming power shape the narrative. The setting expands through layered factions.',
        highlight: 'The world-building and dominant main character setup.',
      },
      {
        title: 'Mushoku Tensei',
        image: '/images/anime/mushoku-tensei.jpg',
        description:
          'A fantasy journey with detailed environments and long-term character development. It focuses on rebuilding life through effort, mistakes, and progress.',
        highlight: 'The visual quality and steady character development.',
      },
    ],
  },
  {
    id: 'books',
    title: 'Books',
    blurb: 'Top 5 books I keep coming back to.',
    icon: 'book-open',
    items: [
      {
        title: 'Pride and Prejudice',
        image: '/images/books/pride-and-prejudice.jpg',
        description:
          'A classic novel by Jane Austen about character, social expectations, and changing first impressions.',
        highlight: 'The sharp dialogue and character chemistry.',
      },
      {
        title: 'Shogun',
        image: '/images/books/shogun.jpg',
        description:
          'A historical epic by James Clavell exploring power, culture, and political strategy in feudal Japan.',
        highlight: 'The political depth and cultural tension.',
      },
      {
        title: 'The Nightingale',
        image: '/images/books/the-nightingale.jpg',
        description:
          'A World War II story by Kristin Hannah focused on survival, resilience, and family under pressure.',
        highlight: 'The emotional storytelling and resilience theme.',
      },
      {
        title: 'The Art of War',
        image: '/images/books/the-art-of-war.jpg',
        description:
          'A strategic text by Sun Tzu about preparation, adaptability, and decision-making in conflict.',
        highlight: 'The clear strategy principles and tactical mindset.',
      },
      {
        title: 'Omniscient Reader\'s Viewpoint',
        image: '/images/books/omniscient-readers-viewpoint.jpg',
        description:
          'A story built around perspective, survival systems, and narrative layers that keep evolving with each stage.',
        highlight: 'The meta narrative structure and tension.',
      },
    ],
  },
  {
    id: 'games',
    title: 'Games',
    blurb: 'Top 5 games in my rotation.',
    icon: 'cpu',
    items: [
      {
        title: 'Genshin Impact',
        image: '/images/games/genshin-impact.jpg',
        description:
          'An open-world action RPG with large map exploration, elemental combat, and ongoing content updates.',
        highlight: 'The exploration freedom and world design.',
      },
      {
        title: 'Persona 5',
        image: '/images/games/persona-5.jpg',
        description:
          'A stylish JRPG that combines turn-based combat, social systems, and a strong identity-driven narrative.',
        highlight: 'The style, soundtrack, and story pacing.',
      },
      {
        title: 'Resident Evil',
        image: '/images/games/resident-evil.jpg',
        description:
          'A survival-horror franchise focused on tension, careful resource use, and high-pressure encounters.',
        highlight: 'The suspense and survival atmosphere.',
      },
      {
        title: 'Final Fantasy',
        image: '/images/games/final-fantasy.jpg',
        description:
          'A long-running RPG series known for big narratives, memorable worlds, and evolving combat systems.',
        highlight: 'The large-scale stories and world variety.',
      },
      {
        title: 'Call of Duty',
        image: '/images/games/call-of-duty.jpg',
        description:
          'A fast-paced shooter franchise centered on competitive multiplayer, tight controls, and rapid match flow.',
        highlight: 'The fast action and competitive gameplay.',
      },
    ],
  },
  {
    id: 'manhwa',
    title: 'Manhwa',
    blurb: 'Top 5 manhwa series I follow.',
    icon: 'file-code',
    items: [
      {
        title: 'Barbarian Quest',
        image: '/images/manhwa/barbarian-quest.jpg',
        description: 'A dark fantasy adventure with harsh conflict, character grit, and strong action pacing.',
        highlight: 'The intensity and action direction.',
      },
      {
        title: 'Beginning After the End',
        image: '/images/manhwa/beginning-after-the-end.jpg',
        description: 'A reincarnation fantasy built around growth, magic, and long-term world conflict.',
        highlight: 'The progression arc and fantasy setup.',
      },
      {
        title: 'Legend of the Northern Blade',
        image: '/images/manhwa/legend-of-the-northern-blade.jpg',
        description: 'A martial-arts revenge narrative with disciplined character buildup and striking combat scenes.',
        highlight: 'The combat choreography and atmosphere.',
      },
      {
        title: 'FFF-Class Trash Hero',
        image: '/images/manhwa/fff-class-trash-hero.jpg',
        description: 'A satirical action story that flips heroic tropes with dark humor and chaotic momentum.',
        highlight: 'The humor and unconventional lead.',
      },
      {
        title: 'Greatest Estate Developer',
        image: '/images/manhwa/greatest-estate-developer.jpg',
        description: 'A fantasy series mixing engineering ideas, comedy, and practical problem-solving in a medieval world.',
        highlight: 'The engineering angle and comedy timing.',
      },
    ],
  },
];

const AboutPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<HobbyCard['id'] | null>(null);
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [isModalCvOpen, setIsModalCvOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const cvModalRef = useRef<HTMLDivElement | null>(null);
  const closeCvModal = useCallback(() => setIsModalCvOpen(false), []);
  useFocusTrap(isModalCvOpen, cvModalRef, closeCvModal);

  const pdfUrl = "/assets/Guuleed-Maxamuud-Awabdi-CV.pdf";
  const cvOptions = [
    { label: 'General software engineering', file: 'Guuleed-Maxamuud-Awabdi-General-Software-Engineering-CV.pdf' },
    { label: 'Cybersecurity-focused', file: 'Guuleed-Maxamuud-Awabdi-Cybersecurity-CV.pdf' },
    { label: 'One-page ATS-friendly', file: 'Guuleed-Maxamuud-Awabdi-ATS-CV.pdf' },
  ];

  return (
    <div className="editorial-page about-page">
      <motion.section
        className="about-hero"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, ease: 'easeOut' }}
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="landing-section-index">/ about</p>
            <h1 className="about-title">
              Product-minded builder, <span>systems thinker, and lifelong learner.</span>
            </h1>
            <div className="mt-5 space-y-4">
              {ABOUT_LETTER.map((paragraph) => (
                <p key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCvOpen(!isCvOpen)}
                aria-expanded={isCvOpen}
                aria-controls="cv-preview"
                className="landing-button landing-button-primary"
              >
                <Icon name={isCvOpen ? "x" : "eye"} size={16} />
                <span>{isCvOpen ? "Hide CV Preview" : "See My CV"}</span>
              </button>

              <a
                href={pdfUrl}
                download="Guuleed-Maxamuud-Awabdi-CV.pdf"
                className="landing-button landing-button-secondary"
              >
                <Icon name="download" size={16} />
                <span>Download CV</span>
              </a>
            </div>

            <div className="about-cv-options">
              <p className="editorial-overline">Other CV versions</p>
              <div>
                {cvOptions.map((option) => (
                  <a
                    key={option.file}
                    href={`/assets/${option.file}`}
                    download={option.file}
                    className="landing-text-link"
                  >
                    <Icon name="download" size={13} />
                    {option.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <aside className="about-profile">
            <span className="editorial-overline">A little context</span>
            <h2>{PERSONAL_INFO.name}</h2>
            <div className="about-profile-facts">
              <div><span>Focus</span><strong>{PERSONAL_INFO.title}</strong></div>
              <div><span>Based in</span><strong>{PERSONAL_INFO.location}</strong></div>
              <div><span>Education</span><strong>B.Sc. Computer Science · 2023–2027</strong></div>
            </div>
          </aside>
        </div>

        {/* Embedded Interactive PDF Viewer */}
        {isCvOpen && (
          <div id="cv-preview" className="mt-8 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 md:p-6 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] accent-text">
                  <Icon name="file-text" size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-text)]">Curriculum Vitae</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">Guuleed Maxamuud Aw Abdi - Full-Stack Developer Resume</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalCvOpen(true)}
                  aria-haspopup="dialog"
                  aria-label="Open CV in fullscreen dialog"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--color-text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                  title="Expand to Fullscreen"
                >
                  <Icon name="maximize-2" size={14} />
                  <span className="hidden sm:inline">Fullscreen</span>
                </button>
                <a
                  href={pdfUrl}
                  download="Guuleed-Maxamuud-Awabdi-CV.pdf"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-3.5 py-2 text-xs font-semibold text-[var(--color-bg)] transition hover:scale-[1.02]"
                >
                  <Icon name="download" size={14} />
                  <span>Download PDF</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsCvOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
                  title="Close PDF viewer"
                >
                  <Icon name="x" size={16} />
                </button>
              </div>
            </div>
            
            <div className="mt-4 aspect-[1/1.3] w-full rounded-lg overflow-hidden border border-[var(--border)] bg-black/20">
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0`}
                title="Guuleed Maxamuud Aw Abdi CV PDF"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        )}
      </motion.section>

      {/* Fullscreen CV Viewer Modal */}
      {isModalCvOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCvModal(); }}>
          <div ref={cvModalRef} role="dialog" aria-modal="true" aria-labelledby="cv-dialog-title" tabIndex={-1} className="flex h-[92vh] w-full max-w-5xl flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] accent-text">
                  <Icon name="file-text" size={20} />
                </div>
                <div>
                  <h3 id="cv-dialog-title" className="text-lg font-bold text-[var(--color-text)]">Guuleed Maxamuud Aw Abdi — CV</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">Official Full-Stack Developer Resume PDF</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={pdfUrl}
                  download="Guuleed-Maxamuud-Awabdi-CV.pdf"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[var(--color-bg)] transition hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] active:translate-y-px"
                >
                  <Icon name="download" size={14} />
                  <span>Download CV</span>
                </a>
                <button
                  type="button"
                  onClick={closeCvModal}
                  aria-label="Close CV dialog"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--color-text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  <Icon name="x" size={18} />
                </button>
              </div>
            </div>
            <div className="mt-4 flex-1 rounded-lg overflow-hidden border border-[var(--border)] bg-black/40">
              <iframe
                src={pdfUrl}
                title="Full Screen CV Viewer"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      <motion.section
        className="editorial-section about-journey"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, ease: 'easeOut' }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
          <p className="landing-section-index">01 / build journey</p>
          <h2 className="editorial-section-title">Learning by building.</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--color-text-muted)]">
            A timeline of the ideas, projects, and technical foundations that have shaped the way I work.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
              I am currently focused on building stronger products, deeper technical fundamentals, and consistent execution. My goal is to keep improving the quality of the code, systems, documentation, and collaboration behind every project.
            </p>
            <div className="about-principle-list">
              {SOFT_SKILLS.map((skill) => (
                <span key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="about-timeline">
            {PROJECT_TIMELINE.map((milestone, index) => (
              <motion.article
                key={milestone.title}
                className="about-timeline-item"
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.06, ease: 'easeOut' }}
              >
                <div className="about-timeline-marker"><Icon name={milestone.icon} size={15} /></div>
                <div className="about-timeline-content">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{milestone.period}</p>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-[var(--color-text)]">{milestone.title}</h3>
                    {milestone.href && (
                      <a href={milestone.href} className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline">
                        View case study <Icon name="arrow-up-right" size={13} />
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{milestone.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {milestone.tags.map((tag) => <span key={tag} className="timeline-tag">{tag}</span>)}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="editorial-section about-interests"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, ease: 'easeOut' }}
      >
        <p className="landing-section-index">02 / outside the build</p>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="editorial-section-title">Stories, worlds, and ideas.</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
            My favourite media is a small window into how I think, what inspires me, and what I enjoy when I am away from the keyboard.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {hobbyCards.map((category) => {
            const isOpen = activeCategory === category.id;

            return (
              <motion.button
                type="button"
                key={category.id}
                className={`hobby-card ${isOpen ? 'border-accent' : ''}`}
                onClick={() => setActiveCategory(isOpen ? null : category.id)}
                aria-pressed={isOpen}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] accent-text">
                  <Icon name={category.icon} size={18} />
                </div>
                <h3 className="mt-3 text-lg font-bold text-[var(--color-text)]">{category.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">{category.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                  {isOpen ? 'Close' : 'Open'}
                  <Icon
                    name="chevron-right"
                    size={12}
                    className={isOpen ? 'rotate-90 transition-transform' : 'transition-transform'}
                  />
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeCategory}
              className="about-interest-detail"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.35, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[var(--accent)]">Favourite media</p>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">Five picks from my {activeCategory} list.</p>
                </div>
                <span className="editorial-overline">5 favourites</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {hobbyCards.find((category) => category.id === activeCategory)?.items.map((item, index) => (
                  <motion.article
                    key={item.title}
                    className={`about-media-item ${index === 0 ? 'is-featured' : ''}`}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.01 : 0.3, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                  >
                    <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-soft)]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="media-item-image"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                          const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="img-placeholder" style={{ display: 'none' }}>
                        {item.title.charAt(0)}
                      </div>
                    </div>
                    <h4 className="mt-3 text-base font-bold text-[var(--color-text)]">{item.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{item.description}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                      Why it stands out: {item.highlight}
                    </p>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
};

export default AboutPage;
