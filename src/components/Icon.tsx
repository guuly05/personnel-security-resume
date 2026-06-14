import { 
  Activity, Braces, Calculator, Code2, Coffee, Cpu, FileCode, Layout, 
  LucideIcon, Mail, MapPin, Network, Phone, ShieldAlert, ShieldCheck, 
  Target, Github, Linkedin, ExternalLink, Menu, X, ChevronRight, 
  Trophy, BookOpen, User, Briefcase, GraduationCap, Laptop, Terminal,
  Globe, Clock, Layers, Star, Info, MessageSquare, Search, Sun, Moon
} from 'lucide-react';
import React from 'react';

// SVG Logo Components with theme support
const JsLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <text x="4" y="20" fontSize="18" fontWeight="bold" fill="currentColor">JS</text>
  </svg>
);

const ReactLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <ellipse cx="12" cy="12" rx="8" ry="4" />
    <ellipse cx="12" cy="12" rx="8" ry="4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="8" ry="4" transform="rotate(120 12 12)" />
  </svg>
);

const PythonLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z" />
  </svg>
);

const JavaLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M9 4c-1 0-2 1-2 2v12c0 1 1 2 2 2h6c1 0 2-1 2-2V6c0-1-1-2-2-2H9z" fill="currentColor" />
    <rect x="10" y="8" width="4" height="1" fill="white" opacity="0.3" />
    <rect x="10" y="11" width="4" height="1" fill="white" opacity="0.3" />
    <rect x="10" y="14" width="4" height="1" fill="white" opacity="0.3" />
  </svg>
);

const BurpSuiteLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.1" stroke="currentColor" />
    <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const CiscoLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
    <line x1="8" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1" />
    <line x1="6" y1="8" x2="6" y2="16" stroke="currentColor" strokeWidth="1" />
    <line x1="18" y1="8" x2="18" y2="16" stroke="currentColor" strokeWidth="1" />
    <line x1="8" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const CybraryLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2L2 7v10c0 6 10 12 10 12s10-6 10-12V7l-10-5z" fill="currentColor" opacity="0.2" stroke="currentColor" />
    <text x="8" y="14" fontSize="8" fill="currentColor" fontWeight="bold">C</text>
  </svg>
);

const NessusLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.2" stroke="currentColor" />
    <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const NmapLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <polyline points="4 6 12 2 20 6 20 18 12 22 4 18 4 6" fill="currentColor" opacity="0.2" stroke="currentColor" />
  </svg>
);

const LinuxLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <ellipse cx="12" cy="5" rx="2" ry="2" />
    <path d="M12 9c-2 0-3 1-3 2v7c0 1 1 2 3 2s3-1 3-2v-7c0-1-1-2-3-2zm-3 2l-1 3m6 0l1 3" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
);

interface SVGIconProps {
  size?: number;
  className?: string;
}

const SvgIconMap: Record<string, React.FC<SVGIconProps>> = {
  'javascript': JsLogo,
  'react': ReactLogo,
  'python': PythonLogo,
  'java': JavaLogo,
  'burp-suite': BurpSuiteLogo,
  'cisco': CiscoLogo,
  'cybrary': CybraryLogo,
  'nessus': NessusLogo,
  'nmap': NmapLogo,
  'linux': LinuxLogo,
};

const lucideIconMap: Record<string, LucideIcon> = {
  'activity': Activity,
  'braces': Braces,
  'calculator': Calculator,
  'code-2': Code2,
  'coffee': Coffee,
  'cpu': Cpu,
  'file-code': FileCode,
  'layout': Layout,
  'mail': Mail,
  'map-pin': MapPin,
  'network': Network,
  'phone': Phone,
  'shield-alert': ShieldAlert,
  'shield-check': ShieldCheck,
  'target': Target,
  'github': Github,
  'linkedin': Linkedin,
  'external-link': ExternalLink,
  'menu': Menu,
  'x': X,
  'chevron-right': ChevronRight,
  'trophy': Trophy,
  'book-open': BookOpen,
  'user': User,
  'briefcase': Briefcase,
  'graduation-cap': GraduationCap,
  'laptop': Laptop,
  'terminal': Terminal,
  'globe': Globe,
  'clock': Clock,
  'layers': Layers,
  'star': Star,
  'info': Info,
  'message-square': MessageSquare,
  'search': Search,
  'sun': Sun,
  'moon': Moon,
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className, size = 20 }) => {
  const lowerName = name.toLowerCase();
  
  // Check SVG icon map first
  const SvgIcon = SvgIconMap[lowerName];
  if (SvgIcon) {
    return <SvgIcon size={size} className={className} />;
  }

  // Fallback to lucide icons
  const LucideIcon = lucideIconMap[lowerName] || Info;
  return <LucideIcon className={className} size={size} />;
};
