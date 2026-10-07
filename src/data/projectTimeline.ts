export interface ProjectMilestone {
  id: string;
  period: string;
  title: string;
  description: string;
  tags: string[];
  href?: string;
  projectId?: string;
  icon: string;
}

/** Shared timeline used by About and project case studies. */
export const PROJECT_TIMELINE: ProjectMilestone[] = [
  {
    id: 'computer-science',
    period: '2023',
    title: 'Started Computer Science',
    description: 'Built the foundation through programming, systems thinking, and project-based learning.',
    tags: ['B.Sc. Computer Science', 'University of Hargeisa'],
    icon: 'graduation-cap',
  },
  {
    id: 'gabay-keeper',
    projectId: 'gabay-keeper',
    period: '2025',
    title: 'Gabay Keeper',
    description: 'Created a private digital archive for Somali oral poetry with OCR and visual export tools.',
    tags: ['React', 'Firebase', 'OCR'],
    href: '/portfolio/gabay-keeper',
    icon: 'book-marked',
  },
  {
    id: 'cyber-dashboard',
    projectId: 'cyber-dashboard',
    period: '2025',
    title: 'Cyber Attack Monitoring Dashboard',
    description: 'Designed a threat-intelligence and investigation workspace for security analysts.',
    tags: ['Next.js', 'Threat intelligence', 'Security'],
    href: '/portfolio/cyber-dashboard',
    icon: 'shield-check',
  },
  {
    id: 'purpleprint',
    projectId: 'purpleprint',
    period: '2025',
    title: 'PurplePrint',
    description: 'Built an offline Android Markdown editor with an on-device parser and PDF workflow.',
    tags: ['Kotlin', 'Jetpack Compose', 'Offline PDF'],
    href: '/portfolio/purpleprint',
    icon: 'file-code',
  },
  {
    id: 'infosec-course',
    projectId: 'infosec-course',
    period: '2026',
    title: 'Information Systems Security Curriculum',
    description: 'Structured security concepts into chapters, labs, case studies, and practical reference material.',
    tags: ['Curriculum design', 'Security labs', 'Open source'],
    href: '/portfolio/infosec-course',
    icon: 'shield-check',
  },
  {
    id: 'samaale-general-trading',
    projectId: 'samaale-general-trading',
    period: 'June–August 2026',
    title: 'Samaale General Trading',
    description: 'Built a bilingual commerce and logistics platform for a regional distributor.',
    tags: ['React', 'Somali / English', 'Edge delivery'],
    href: '/portfolio/samaale-general-trading',
    icon: 'briefcase',
  },
  {
    id: 'portfolio-platform',
    projectId: 'portfolio-platform',
    period: '2026',
    title: 'Portfolio Platform',
    description: 'Turned this portfolio into a working product with case studies, publishing, contact, and booking workflows.',
    tags: ['React', 'TypeScript', 'Production systems'],
    href: '/portfolio/portfolio-platform',
    icon: 'layout',
  },
  {
    id: 'expected-graduation',
    period: '2027',
    title: 'Expected graduation',
    description: 'Completing the B.Sc. Computer Science degree while continuing to build useful, secure products.',
    tags: ['Next chapter'],
    icon: 'trophy',
  },
];

export function timelineEntryForProject(projectId: string): ProjectMilestone | undefined {
  return PROJECT_TIMELINE.find((entry) => entry.projectId === projectId);
}
