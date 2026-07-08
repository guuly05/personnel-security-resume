import React, { useEffect, useMemo, useState } from 'react';
import { ABOUT_LETTER, PERSONAL_INFO, SOFT_SKILLS } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';

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

const birthDate = new Date('2005-07-27T00:00:00');
const graduationStart = new Date('2023-08-01T00:00:00');
const graduationDate = new Date('2027-08-01T00:00:00');

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

const getAge = (now: Date) => {
  const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.2425;
  const preciseYears = (now.getTime() - birthDate.getTime()) / millisecondsPerYear;
  const years = Math.floor(preciseYears);

  const birthdayThisYear = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  const baseDate =
    now >= birthdayThisYear
      ? birthdayThisYear
      : new Date(now.getFullYear() - 1, birthDate.getMonth(), birthDate.getDate());
  const nextDate = new Date(baseDate.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  const progressInYear = (now.getTime() - baseDate.getTime()) / (nextDate.getTime() - baseDate.getTime());
  const months = Math.floor(progressInYear * 12);

  return {
    preciseYears,
    years,
    months,
  };
};

const getGraduationStats = (now: Date) => {
  const totalDuration = graduationDate.getTime() - graduationStart.getTime();
  const elapsed = Math.min(Math.max(now.getTime() - graduationStart.getTime(), 0), totalDuration);
  const remaining = Math.max(graduationDate.getTime() - now.getTime(), 0);

  const progressPercent = totalDuration === 0 ? 100 : (elapsed / totalDuration) * 100;
  const hpPercent = Math.max(0, 100 - progressPercent);

  const remainingMonths = Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24 * 30.4375)));
  const yearsLeft = Math.floor(remainingMonths / 12);
  const monthsLeft = remainingMonths % 12;

  return {
    hpPercent,
    yearsLeft,
    monthsLeft,
  };
};

const AboutPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<HobbyCard['id'] | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const age = useMemo(() => getAge(now), [now]);
  const graduation = useMemo(() => getGraduationStats(now), [now]);

  return (
    <div className="space-y-5">
      <section className="surface-card p-6 md:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-cyan">About Me</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-[var(--color-text)] md:text-5xl">
              Security learner, builder, and long-term systems thinker.
            </h1>
            <div className="mt-5 space-y-4">
              {ABOUT_LETTER.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <aside className="rpg-card p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-[var(--accent)]">Character Card</p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)]">Profile Stats</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] accent-text">
                <Icon name="shield-check" size={22} />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="stat-badge items-start">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Name</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{PERSONAL_INFO.name}</p>
              </div>
              <div className="stat-badge items-start">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Occupation</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{PERSONAL_INFO.title}</p>
              </div>
              <div className="stat-badge items-start sm:col-span-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Age</p>
                <p className="mt-1 text-xl font-bold text-[var(--accent)] age-counter">{age.preciseYears.toFixed(8)} years</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {age.years} years and {age.months} months
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--brand-purple)]">Graduation Health Bar</p>
                <span className="text-xs font-bold text-[var(--brand-purple)]">{graduation.hpPercent.toFixed(1)}% HP</span>
              </div>
              <div className="mt-3 hp-bar-track">
                <div className="hp-bar-fill" style={{ width: `${graduation.hpPercent}%` }} />
              </div>
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                Time left until August 2027: {graduation.yearsLeft} year(s), {graduation.monthsLeft} month(s)
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface-card p-6 md:p-8">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-cyan">Current Focus</p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
            I am currently focused on security practice, technical depth, and consistency in execution. My goal is to keep improving the quality of testing, reporting, and collaboration in every project.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {SOFT_SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="surface-card p-6 md:p-8">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-[var(--brand-purple)]">Education Path</p>
          <h3 className="mt-3 text-2xl font-bold text-[var(--color-text)]">B.Sc. Computer Science</h3>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">University of Hargeisa</p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
            Degree timeline: 2023 to 2027. I align classwork with practical cybersecurity implementation and project-based learning.
          </p>
        </div>
      </section>

      <section className="surface-card p-6 md:p-8">
        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-[var(--accent)]">Hobbies and Interests</p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
          I have compiled here my top hobbies and my fav media in each of them, browsing them should help you to understand how i am outside my work.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {hobbyCards.map((category) => {
            const isOpen = activeCategory === category.id;

            return (
              <button
                type="button"
                key={category.id}
                className={`hobby-card ${isOpen ? 'border-accent' : ''}`}
                onClick={() => setActiveCategory(isOpen ? null : category.id)}
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] accent-text">
                  <Icon name={category.icon} size={18} />
                </div>
                <h3 className="mt-3 text-lg font-bold text-[var(--color-text)]">{category.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">{category.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--brand-purple)]">
                  {isOpen ? 'Close' : 'Open'}
                  <Icon
                    name="chevron-right"
                    size={12}
                    className={isOpen ? 'rotate-90 transition-transform' : 'transition-transform'}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {activeCategory && (
          <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 md:p-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {hobbyCards
                .find((category) => category.id === activeCategory)
                ?.items.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
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
                      What i like about this: {item.highlight}
                    </p>
                  </article>
                ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AboutPage;
