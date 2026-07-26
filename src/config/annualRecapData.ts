export interface MilestoneItem {
  category: 'Security & Systems' | 'Credentials & Growth' | 'Projects & Engineering' | 'Personal Mastery';
  title: string;
  description: string;
  icon: string;
}

export interface VideoClip {
  id: string;
  title: string;
  videoUrl: string;
  source: string;
}

export interface YearlyRecapConfig {
  year: number;
  age: number;
  title: string;
  subtitle: string;
  summary: string;
  gains: MilestoneItem[];
  videos: VideoClip[];
}

export const BIRTH_YEAR = 2005;

/**
 * Videos placed in /images/videos/ (which maps to dist/images/videos/)
 */
export const RECAP_VIDEOS: VideoClip[] = [
  {
    id: 'amv-mix',
    title: 'Happy Birthday AMV Anime Mix',
    videoUrl: '/images/videos/Happy Birthday to You! [ AMV ] - Anime Mix.mp4',
    source: 'Anime Mix Compilation',
  },
  {
    id: 'snaptik-clip',
    title: 'Special Character Wishes Clip',
    videoUrl: '/images/videos/snaptik_7665271403859414289_v3.mp4',
    source: 'Special Reel',
  },
];

export const ANNUAL_RECAP_DATA: Record<number, YearlyRecapConfig> = {
  2026: {
    year: 2026,
    age: 21,
    title: '2026 Annual Reflection & Milestones',
    subtitle: 'July 27, 2026 — 21 Years Completed',
    summary:
      'Reflecting on 21 years: deep technical focus in cybersecurity, vulnerability research, enterprise infrastructure, and continuous personal growth.',
    gains: [
      {
        category: 'Security & Systems',
        title: 'Vulnerability Research & Exploitation Analysis',
        description: 'Deepened research into Windows kernel internals, TOCTOU race conditions, and defensive patch verification.',
        icon: 'shield-check',
      },
      {
        category: 'Credentials & Growth',
        title: 'Advanced Industry Preparation',
        description: 'Accelerated preparation for high-tier security certifications alongside university degree coursework.',
        icon: 'graduation-cap',
      },
      {
        category: 'Projects & Engineering',
        title: 'Full-Stack & Security Tooling Portfolio',
        description: 'Designed and deployed high-performance web applications, security dashboards, and interactive projects.',
        icon: 'cpu',
      },
      {
        category: 'Personal Mastery',
        title: 'Disciplined Daily Execution',
        description: 'Maintained strong routines combining technical studies, physical health, classic literature, and strategic gaming.',
        icon: 'sparkles',
      },
    ],
    videos: RECAP_VIDEOS,
  },
  2027: {
    year: 2027,
    age: 22,
    title: '2027 Annual Reflection & Graduation',
    subtitle: 'July 27, 2027 — University of Hargeisa Graduation Year',
    summary:
      'Milestone year: Graduating with B.Sc. in Computer Science and expanding full-scale enterprise security consulting.',
    gains: [
      {
        category: 'Credentials & Growth',
        title: 'Computer Science Degree Graduation',
        description: 'Completed 4-year degree at UoH with focus on defensive systems architecture.',
        icon: 'graduation-cap',
      },
      {
        category: 'Security & Systems',
        title: 'Cloud & Incident Response Mastery',
        description: 'Expanded threat hunting, SIEM automation, and enterprise defense capabilities.',
        icon: 'shield-alert',
      },
    ],
    videos: RECAP_VIDEOS,
  },
};

export function getRecapConfigForYear(year: number): YearlyRecapConfig {
  if (ANNUAL_RECAP_DATA[year]) {
    return ANNUAL_RECAP_DATA[year];
  }

  const age = year - BIRTH_YEAR;
  return {
    year,
    age,
    title: `${year} Annual Reflection & Milestones`,
    subtitle: `July 27, ${year} — Age ${age}`,
    summary: `Reflecting on age ${age}: key technical gains, project milestones, and continuous evolution.`,
    gains: [
      {
        category: 'Security & Systems',
        title: `Technical Progression (${year})`,
        description: `Expanded domain knowledge and hands-on execution during age ${age - 1} to ${age}.`,
        icon: 'shield-check',
      },
      {
        category: 'Projects & Engineering',
        title: 'Key Milestones Reached',
        description: `Delivered high-quality software projects and system architecture enhancements.`,
        icon: 'sparkles',
      },
    ],
    videos: RECAP_VIDEOS,
  };
}
