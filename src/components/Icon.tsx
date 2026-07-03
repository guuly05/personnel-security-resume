import { 
  Activity, Braces, Calculator, Code2, Coffee, Cpu, FileCode, Layout, 
  LucideIcon, Mail, MapPin, Network, Phone, ShieldAlert, ShieldCheck, 
  Target, Github, Linkedin, ExternalLink, Menu, X, ChevronRight, 
  Trophy, BookOpen, User, Briefcase, GraduationCap, Laptop, Terminal,
  Globe, Clock, Layers, Star, Info, MessageSquare, Search, Sun, Moon, Home
} from 'lucide-react';
import React from 'react';

// SVG Logo Components with theme support
type LogoProps = {
  size?: number;
  className?: string;
};

const JsLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 7.5L6.5 12L9 16.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 7.5L17.5 12L15 16.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.8 7.4L10.9 16.6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const ReactLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="2.1" fill="currentColor" opacity="0.95" />
    <ellipse cx="12" cy="12" rx="8.1" ry="3.6" stroke="currentColor" strokeWidth="1.35" opacity="0.9" />
    <ellipse cx="12" cy="12" rx="8.1" ry="3.6" transform="rotate(60 12 12)" stroke="currentColor" strokeWidth="1.35" opacity="0.9" />
    <ellipse cx="12" cy="12" rx="8.1" ry="3.6" transform="rotate(120 12 12)" stroke="currentColor" strokeWidth="1.35" opacity="0.9" />
  </svg>
);

const PythonLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="5" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M14.9 4.8H9.7C7.8 4.8 6.3 6.3 6.3 8.2v4.1c0 1.2.9 2.1 2.1 2.1h4.1c.7 0 1.3.6 1.3 1.3v3.5c0 1.1.9 2 2 2h1.6c1.9 0 3.4-1.5 3.4-3.4V8.4c0-1.9-1.5-3.6-3.5-3.6z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M9.1 19.2h5.2c1.9 0 3.4-1.5 3.4-3.4v-4.1c0-1.2-.9-2.1-2.1-2.1h-4.1c-.7 0-1.3-.6-1.3-1.3V4.8"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.65"
    />
    <circle cx="10" cy="8.3" r="0.7" fill="white" opacity="0.8" />
    <circle cx="14" cy="15.7" r="0.7" fill="white" opacity="0.8" />
  </svg>
);

const JavaLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M8 7.2h8c1.3 0 2.3 1 2.3 2.3v5.1c0 2.1-1.7 3.8-3.8 3.8H9.5c-2.1 0-3.8-1.7-3.8-3.8V9.5C5.7 8.2 6.7 7.2 8 7.2Z"
      fill="currentColor"
      opacity="0.1"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path d="M9.8 5.1c0-.8.7-1.5 1.5-1.5M12.4 4.8c0-.9.7-1.6 1.6-1.6M14.9 5.2c0-.8.7-1.5 1.5-1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M17.6 9.4h1.1c1 0 1.8.8 1.8 1.8s-.8 1.8-1.8 1.8h-1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M8.4 18h7.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
  </svg>
);

const BurpSuiteLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 3.6 18.5 6.4v4.7c0 4.1-2.6 7.4-6.5 9.3-3.9-1.9-6.5-5.2-6.5-9.3V6.4L12 3.6Z"
      fill="currentColor"
      opacity="0.08"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3.25" fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="1.1" />
    <path d="M12 7.2v9.6M7.2 12h9.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const CiscoLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4.2 15.8c2.7-5.8 5.3-8.8 7.8-8.8s5.1 3 7.8 8.8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" opacity="0.7" />
    <rect x="4.4" y="11.8" width="2" height="6.8" rx="1" fill="currentColor" opacity="0.95" />
    <rect x="8.1" y="9.2" width="2" height="9.4" rx="1" fill="currentColor" opacity="0.8" />
    <rect x="11.9" y="6.6" width="2" height="12" rx="1" fill="currentColor" opacity="0.95" />
    <rect x="15.7" y="9.2" width="2" height="9.4" rx="1" fill="currentColor" opacity="0.8" />
    <rect x="19.4" y="11.8" width="2" height="6.8" rx="1" fill="currentColor" opacity="0.95" />
  </svg>
);

const CybraryLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 3.7 18.8 7v4.7c0 4.4-3 7.6-6.8 9.2-3.8-1.6-6.8-4.8-6.8-9.2V7L12 3.7Z"
      fill="currentColor"
      opacity="0.08"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M15.2 8.3A4.3 4.3 0 0 0 12 6.8c-2.7 0-4.8 2.2-4.8 5s2.1 5 4.8 5c1.3 0 2.4-.5 3.3-1.3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="16.3" cy="8" r="0.7" fill="currentColor" />
  </svg>
);

const NessusLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="8.3" fill="currentColor" opacity="0.07" stroke="currentColor" strokeWidth="1.35" />
    <circle cx="12" cy="12" r="5.1" stroke="currentColor" strokeWidth="1.15" opacity="0.75" />
    <circle cx="12" cy="12" r="2.1" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="1" />
    <path d="M12 4.9v4.5l3.8 3.8" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NmapLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 3.8 18.8 7.8v8.4L12 20.2 5.2 16.2V7.8L12 3.8Z" fill="currentColor" opacity="0.07" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    <path d="M8.2 9.3 12 7.2l3.8 2.1v4.8L12 16.1l-3.8-2.1V9.3Z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" opacity="0.9" />
    <circle cx="12" cy="7.2" r="0.95" fill="currentColor" />
    <circle cx="8.2" cy="9.3" r="0.8" fill="currentColor" opacity="0.9" />
    <circle cx="15.8" cy="9.3" r="0.8" fill="currentColor" opacity="0.9" />
    <circle cx="8.2" cy="14.1" r="0.8" fill="currentColor" opacity="0.9" />
    <circle cx="15.8" cy="14.1" r="0.8" fill="currentColor" opacity="0.9" />
  </svg>
);

const LinuxLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 3.8c-3.8 0-6.8 3-6.8 6.8 0 3 1.4 5.8 3.7 7.7.9.8 1.4 1.9 1.4 3h3.4c0-1.1.5-2.2 1.4-3 2.3-1.9 3.7-4.7 3.7-7.7 0-3.8-3-6.8-6.8-6.8Z"
      fill="currentColor"
      opacity="0.09"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <ellipse cx="12" cy="12.4" rx="3.2" ry="4.8" fill="currentColor" opacity="0.92" />
    <circle cx="10.8" cy="10" r="0.48" fill="white" opacity="0.85" />
    <circle cx="13.2" cy="10" r="0.48" fill="white" opacity="0.85" />
    <path d="M9.3 18.5c.8-.7 1.7-1.5 2.7-1.5s1.9.8 2.7 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
  </svg>
);

const WiresharkLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M3.8 12c2.4-4.2 4.8-6.3 8.2-6.3S17.6 7.8 20.2 12c-2.6 4.2-5 6.3-8.2 6.3S6.2 16.2 3.8 12Z" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1.25" />
    <path d="M6.3 12c1.4-2.5 2.9-3.8 5.7-3.8s4.3 1.3 5.7 3.8c-1.4 2.5-2.9 3.8-5.7 3.8S7.7 14.5 6.3 12Z" stroke="currentColor" strokeWidth="1.15" opacity="0.8" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    <path d="M12 6.7v2.2M12 15.1v2.2M17.3 12h2.2M4.5 12h2.2" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" opacity="0.75" />
  </svg>
);

const MetasploitLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 4.2 18.8 8v8L12 19.8 5.2 16V8L12 4.2Z" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.15" opacity="0.82" />
    <circle cx="12" cy="12" r="1.1" fill="currentColor" />
    <path d="M12 6.2v2.1M12 15.7v2.1M17.8 12h-2.1M8.3 12H6.2" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" opacity="0.8" />
  </svg>
);

const GithubLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 3.4c-4.7 0-8.6 3.8-8.6 8.6 0 3.8 2.4 7 5.8 8.1.4.1.6-.2.6-.4v-1.6c-2.4.5-2.9-1-2.9-1-.4-1-.9-1.3-.9-1.3-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-1.9-.2-3.9-.9-3.9-3.9 0-.9.3-1.6.8-2.2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.7-.2 1.4-.3 2.2-.3s1.5.1 2.2.3c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3-2 3.7-3.9 3.9.3.3.7.9.7 1.8v2.7c0 .2.2.5.6.4 3.4-1.1 5.8-4.3 5.8-8.1 0-4.8-3.9-8.6-8.6-8.6Z"
      fill="currentColor"
      opacity="0.92"
    />
  </svg>
);

const BashLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="3.6" y="4" width="16.8" height="16" rx="4" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1.25" />
    <path d="M7 10.3 9.7 12 7 13.7" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 13.8h5.5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    <path d="M12.1 6.8H8.4" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" opacity="0.55" />
  </svg>
);

const VmwareLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="4.1" y="4.1" width="15.8" height="15.8" rx="4.2" fill="currentColor" opacity="0.07" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7.1 8.5 10 15.5l2-4.8 2 4.8 2.9-7" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.2 8.5h1.8l1 2.5 1-2.5h1.8" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const VirtualBoxLogo: React.FC<LogoProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4.4 7.5 12 4l7.6 3.5V16L12 20l-7.6-4V7.5Z" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M12 4v16M4.4 7.5 12 11l7.6-3.5" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" opacity="0.78" />
    <path d="M8.2 6.7 12 8.5l3.8-1.8" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" opacity="0.56" />
  </svg>
);

interface SVGIconProps {
  size?: number;
  className?: string;
}

const SvgIconMap: Record<string, React.FC<SVGIconProps>> = {
  'javascript': JsLogo,
  'js': JsLogo,
  'react': ReactLogo,
  'python': PythonLogo,
  'java': JavaLogo,
  'burp-suite': BurpSuiteLogo,
  'burpsuite': BurpSuiteLogo,
  'cisco': CiscoLogo,
  'cybrary': CybraryLogo,
  'nessus': NessusLogo,
  'nmap': NmapLogo,
  'linux': LinuxLogo,
  'wireshark': WiresharkLogo,
  'metasploit': MetasploitLogo,
  'github': GithubLogo,
  'git': GithubLogo,
  'gitgithub': GithubLogo,
  'bash': BashLogo,
  'vmware': VmwareLogo,
  'virtualbox': VirtualBoxLogo,
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
  'home': Home,
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

const normalizeIconName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

export const Icon: React.FC<IconProps> = ({ name, className, size = 20 }) => {
  const lowerName = name.toLowerCase();
  const normalizedName = normalizeIconName(name);
  
  // Check SVG icon map first
  const SvgIcon = SvgIconMap[lowerName] || SvgIconMap[normalizedName];
  if (SvgIcon) {
    return <SvgIcon size={size} className={className} />;
  }

  // Fallback to lucide icons
  const LucideIcon = lucideIconMap[lowerName] || lucideIconMap[normalizedName] || Info;
  return <LucideIcon className={className} size={size} />;
};
