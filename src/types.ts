export interface Skill {
  name: string;
  level?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  outcomes: string[];
  icon: string;
  challenge: string;
  learned: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  description: string;
  icon: string;
  verifyLink?: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  achievement?: string;
  link?: string;
}

export interface Achievement {
  text: string;
  metric: string;
}

export interface Experience {
  title: string;
  company: string;
  dateRange: string;
  bullets: string[];
}
