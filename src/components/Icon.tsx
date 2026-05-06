import { 
  Activity, Braces, Calculator, Code2, Coffee, Cpu, FileCode, Layout, 
  LucideIcon, Mail, MapPin, Network, Phone, ShieldAlert, ShieldCheck, 
  Target, Github, Linkedin, ExternalLink, Menu, X, ChevronRight, 
  Trophy, BookOpen, User, Briefcase, GraduationCap, Laptop, Terminal,
  Globe, Clock, Layers, Star, Info, MessageSquare, Search
} from 'lucide-react';
import React from 'react';

const iconMap: Record<string, LucideIcon> = {
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
  // Security Tools
  'nessus': ShieldCheck,
  'burp suite': Globe,
  'wireshark': Network,
  'metasploit': Target,
  'nmap': Search,
  'git/github': Github,
  'bash': Terminal,
  'python': FileCode,
  'java': Coffee,
  'linux': Terminal,
  'vmware': Layers,
  'virtualbox': Layers,
  // Courses
  'software engineering (iit)': Code2,
  'linear algebra (iit)': Calculator,
  'python (iit)': FileCode,
  'c programming (iit)': Cpu,
  'information security (iit)': ShieldCheck,
  'typescript (iit)': Braces,
  'react (iit)': Layout,
  'java (iit)': Coffee,
  'javascript (iit)': Braces,
  // Misc
  'microsoft': ShieldCheck, 
  'javascript': Braces,
  'search': Search
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className, size = 20 }) => {
  const LucideIcon = iconMap[name.toLowerCase()] || Info;
  return <LucideIcon className={className} size={size} />;
};
