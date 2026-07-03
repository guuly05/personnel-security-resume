import { Achievement, Certificate, Course, Experience, Project, Skill } from './types.ts';

export const PERSONAL_INFO = {
  name: "Guuleed Maxmuud Aw Abdi",
  title: "Vulnerability Assessment & Penetration Tester",
  location: "Hargeisa, Somaliland",
  phone: "+252 634406157",
  email: "guuleedmaxamuud40@gmail.com",
  linkedin: "https://linkedin.com/in/guuleed-aw-abdi-517928277",
  github: "https://github.com/guuly05",
  languages: [
    { name: "Somali", level: "Native" },
    { name: "English", level: "Professional working proficiency" },
    { name: "Arabic", level: "Conversational" }
  ]
};

export const SOFT_SKILLS = [
  "Problem-solving", "Communication", "Teamwork", 
  "Attention to Detail", "Time Management", 
  "Adaptability", "Critical Thinking"
];

export const HOBBIES = [
  "Reading books and articles", "Watching anime",
  "Online courses", "Reading documentation", "Tinkering with tech"
];

// New About Me intro content inserted for the enhanced About page.
export const ABOUT_LETTER = [
  "Hello, I am Guuleed, a cybersecurity-focused technologist who approaches every project with curiosity, discipline, and respect for the people who depend on the systems I help protect.",
  "I enjoy turning complex technical problems into clear, practical solutions. Whether I am testing an application, documenting risks, or supporting users, I try to communicate calmly, work carefully, and leave things stronger than I found them.",
  "Technology moves quickly, and that is exactly what keeps me motivated. I am committed to continuous learning through books, articles, online courses, documentation, and hands-on tinkering with new tools."
];

// New Experience content inserted for the Experience section.
export const EXPERIENCES: Experience[] = [
  {
    title: "Penetration Tester",
    company: "Confidential Family-Owned Business",
    dateRange: "June 2024 - August 2024",
    bullets: [
      "Conducted vulnerability assessments on internal web applications and network services, identifying 12 high-priority security issues that were remediated within the engagement period.",
      "Validated authentication, access control, and input-handling weaknesses using tools such as Nmap, Burp Suite, and manual testing techniques.",
      "Delivered a clear penetration test report with prioritized remediation steps, earning positive feedback from the business owner for its practical and actionable guidance."
    ]
  },
  {
    title: "General IT Support",
    company: "Confidential Family-Owned Business",
    dateRange: "August 2025 - October 2025",
    bullets: [
      "Resolved over 95% of end-user IT support requests on first contact, covering laptop setup, software configuration, connectivity issues, and account access.",
      "Streamlined onboarding for 5 remote workers by configuring laptops, VPN access, and required applications, completing setup work about 40% faster than the previous manual process.",
      "Created quick-start guides and troubleshooting documentation that reduced repetitive support questions by an estimated 30% during the support period."
    ]
  }
];

export const CORE_SKILLS = [
  "Penetration testing (Nessus, Burp Suite)", "Vulnerability assessment", 
  "Python / Java automation", "Linux system hardening", 
  "Network security protocols", "Risk management", 
  "Technical documentation", "TypeScript", "React", 
  "JavaScript", "C", "Information Security"
];

export const TOOLSET = [
  "Nessus", "Burp Suite", "Wireshark", "Metasploit", 
  "Nmap", "Git/GitHub", "Bash", "Python", 
  "Java", "Linux", "VMware", "VirtualBox"
];

export const COURSES: Course[] = [
  {
    id: "se-iit",
    title: "Software Engineering",
    description: "In-depth study of software life cycles, focusing on agile methodologies and robust architectural patterns.",
    challenge: "Coordinating complex design work with shifting requirements and team deadlines made this course feel like a real-world engineering sprint.",
    learned: "I learned how to turn abstract requirements into maintainable architecture, improve communication across stakeholders, and keep quality high under time pressure.",
    outcomes: [
      "Mastered SDLC phases from requirements gathering to maintenance.",
      "Implemented agile workflows in collaborative development environments.",
      "Applied advanced design patterns to solve complex software engineering problems."
    ],
    icon: "code-2"
  },
  {
    id: "la-iit",
    title: "Linear Algebra",
    description: "Foundational mathematics for advanced computing, covering vector spaces and matrix operations.",
    challenge: "Visualizing high-dimensional spaces and applying abstract algebraic concepts to real code problems was the hardest part.",
    learned: "I learned how matrix math underpins modern security algorithms and data transformations, and how to interpret eigenvalues and vectors in system design.",
    outcomes: [
      "Understood vector spaces and linear transformations for data modeling.",
      "Applied matrix operations in machine learning and cryptographic algorithms.",
      "Developed mathematical intuition for high-dimensional data analysis."
    ],
    icon: "calculator"
  },
  {
    id: "py-iit",
    title: "Python",
    description: "Advanced Python programming with a focus on automation and security-oriented scripting.",
    challenge: "Balancing rapid scripting with secure dependency management and safe system access was the most challenging part.",
    learned: "I learned to build automation that is both powerful and safe, with secure file handling, network scripting, and reusable Python modules.",
    outcomes: [
      "Analyzed complex data structures for efficient information processing.",
      "Developed automated security scripts using libraries like Scapy and Sockets.",
      "Built robust backend systems with security-first coding practices."
    ],
    icon: "file-code"
  },
  {
    id: "c-iit",
    title: "C Programming",
    description: "Low-level systems programming emphasizing memory management and secure software development.",
    challenge: "Managing raw pointers, manual memory allocation, and debugging subtle buffer issues made this course particularly intense.",
    learned: "I learned to write safer C code, identify common overflow and pointer vulnerabilities, and reason precisely about performance and resource usage.",
    outcomes: [
      "Mastered pointer manipulation and manual memory management techniques.",
      "Identified and mitigated common overflow vulnerabilities at the system level.",
      "Built performance-critical applications with minimal overhead."
    ],
    icon: "cpu"
  },
  {
    id: "is-iit",
    title: "Information Security",
    description: "Comprehensive coverage of the CIA triad, network security, and modern risk assessment frameworks.",
    challenge: "Translating theoretical threat models into practical defensive strategies and breach simulations was the toughest step.",
    learned: "I learned to prioritize risks, build layered security controls, and use threat intelligence to make informed decisions in real environments.",
    outcomes: [
      "Implemented security protocols based on Confidentiality, Integrity, and Availability.",
      "Performed detailed risk assessments using industry-standard frameworks.",
      "Explored cryptographic systems and their applications in data protection."
    ],
    icon: "shield-check"
  },
  {
    id: "ts-iit",
    title: "TypeScript",
    description: "Advanced type-level programming for building scalable and maintainable web applications.",
    challenge: "Designing types for a dynamic codebase while avoiding overcomplication was the trickiest part.",
    learned: "I learned to use strict typing to catch errors early, build reusable interfaces, and create safer APIs for large front-end applications.",
    outcomes: [
      "Utilized type safety and generics to eliminate runtime errors.",
      "Implemented complex interfaces for seamless API data modeling.",
      "Integrated TypeScript with modern frameworks like React for enterprise-scale UI."
    ],
    icon: "braces"
  },
  {
    id: "re-iit",
    title: "React",
    description: "Modern component-based UI development with a focus on performance and state management.",
    challenge: "Keeping complex state predictable while preserving responsiveness across the interface was the hardest part.",
    learned: "I learned to architect reusable components, manage hooks effectively, and optimize rendering for real-world apps.",
    outcomes: [
      "Built scalable SPAs using advanced React Hooks and custom state logic.",
      "Optimized rendering performance using memoization and code-splitting.",
      "Developed complex routing systems for seamless user navigation."
    ],
    icon: "layout"
  },
  {
    id: "ja-iit",
    title: "Java",
    description: "Object-oriented programming and enterprise application development using the Java Ecosystem.",
    challenge: "Mastering concurrency and JVM internals while keeping code secure in multi-threaded contexts was the greatest challenge.",
    learned: "I learned to apply solid OOP patterns, manage thread safety, and build services that scale with secure design choices.",
    outcomes: [
      "Designed reusable software architectures using OOP principles and JVM internals.",
      "Implemented multithreaded systems for concurrent data processing.",
      "Applied secure coding standards to prevent injection and session vulnerabilities."
    ],
    icon: "coffee"
  },
  {
    id: "js-iit",
    title: "JavaScript",
    description: "Pro-level JavaScript covering ES6+, asynchronous programming, and DOM architecture.",
    challenge: "Managing async flow and browser compatibility while keeping interactions smooth was the most difficult part.",
    learned: "I learned to write reliable event-driven code, handle promises and async operations cleanly, and avoid common client-side security pitfalls.",
    outcomes: [
      "Mastered async/await and promises for handling complex asynchronous operations.",
      "Utilized closures and lexical scoping for modular code design.",
      "Built interactive web experiences through efficient DOM and Fetch API usage."
    ],
    icon: "javascript"
  }
];

export const CERTIFICATES: Certificate[] = [
  {
    title: "Cyber Threat Management",
    issuer: "Cisco",
    date: "2026",
    description: "Gained deep insights into identifying and mitigating sophisticated cyber threats. Developed practical skills in monitoring network traffic for anomalies and responding to modern security incidents using advanced toolsets.",
    icon: "cisco",
    verifyLink: "https://www.credly.com/badges/b4fce403-72e2-45c1-9c23-d8be733b06a4/public_url"
  },
  {
    title: "Penetration Testing Professional",
    issuer: "Cybrary",
    date: "2026",
    description: "Acquired hands-on experience in the entire offensive security lifecycle, from reconnaissance and vulnerability scanning to exploitation and post-exploitation. Learned specialized techniques for red teaming and reporting.",
    icon: "cybrary",
    verifyLink: "https://www.linkedin.com/learning/certificates/212ba3619b3f7861364d3abbceb053dfeaffe5694695a4a767601f756404dd6e/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BgUaqTvJTTMqBt8%2FfS89IiA%3D%3D"
  },
  {
    title: "Microsoft Security Essentials",
    issuer: "Microsoft & LinkedIn",
    date: "2026",
    description: "Mastered the core concepts of security, compliance, and identity across Microsoft ecosystems. Gained practical knowledge of implementing zero-trust architectures and managing cloud security postures.",
    icon: "shield-check",
    verifyLink: "https://www.linkedin.com/learning/certificates/540585c949c8154fc65ad5caaa5a905e73cde74e32bdb0543210cce49ecceedc/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BgUaqTvJTTMqBt8%2FfS89IiA%3D%3D"
  },
  {
    title: "Career Essentials in GitHub",
    issuer: "GitHub",
    date: "2026",
    description: "Developed mastery over version control, collaborative workflows, and GitHub Actions for CI/CD. Focused on implementing secure code repositories and managing vulnerability alerts within the dev lifecycle.",
    icon: "github",
    verifyLink: "https://www.linkedin.com/learning/certificates/8c4374660038b5e6e9b7092ee0f30619ec019d47d6cc267cee2a0cf1394c2d48"
  },
  {
    title: "Career Essentials in Cybersecurity",
    issuer: "Microsoft & LinkedIn",
    date: "2026",
    description: "Followed a focused path on modern security threats, defense mechanisms, and investigative techniques. Strengthened foundational knowledge in network security, threat intelligence, and digital forensics.",
    icon: "shield-alert",
    verifyLink: "https://www.linkedin.com/learning/certificates/d736a666b751844e8009136d3831f7dad97edfc9a044f15c347fc941bf8eb49a"
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  { text: "Increased system uptime through proactive Linux monitoring and tuning.", metric: "20%" },
  { text: "Reduced manual security tasks using Python automation (log parsing, user audits).", metric: "30%" },
  { text: "Strengthened access controls for freelance clients, passing all reviews.", metric: "5 Clients" },
  { text: "System audits conducted bi-monthly, patching critical CVEs.", metric: "15+ CVEs" }
];

export const PROJECTS: Project[] = [
  {
    title: "BookWanag",
    description: "A modern, simple online book store featuring a clean UI, intuitive navigation, and a secure checkout simulation. Built to demonstrate high-performance frontend architecture.",
    tech: ["React", "Tailwind CSS", "TypeScript", "Motion"],
    achievement: "Streamlined UX core for rapid browsing.",
    link: "https://github.com/guuly05"
  },
  {
    title: "EternalBlue Case Study",
    description: "In-depth vulnerability scanning and exploitation project conducted from Kali Linux targeting a Windows 7 machine utilizing the MS17-010 (EternalBlue) SMB vulnerability.",
    tech: ["Kali Linux", "Metasploit", "Nmap", "Wireshark"],
    achievement: "Generated 20-page full post-exploitation report.",
    link: "/reports/eternal-blue-case-study.pdf"
  },
  {
    title: "Automated Vulnerability Scanner",
    description: "Built a Python-based script that integrates with Nmap and OpenVAS API to scan network ranges, parse vulnerabilities, and generate prioritized email reports.",
    tech: ["Python", "Nmap", "OpenVAS", "SMTP"],
    achievement: "Reduced scan-to-report time by 70%.",
    link: "#"
  }
];

// ── Hobbies / Media Favourites ──────────────────────────────────────────

export interface MediaItem {
  title: string;
  image: string;
  description: string;
}

export interface HobbyCategory {
  id: string;
  label: string;
  emoji: string;
  items: MediaItem[];
}

export const HOBBY_CATEGORIES: HobbyCategory[] = [
  {
    id: 'anime',
    label: 'Anime',
    emoji: '📺',
    items: [
      {
        title: 'Code Geass',
        image: '/images/anime/code-geass.jpg',
        description: 'A masterpiece of strategic warfare and moral ambiguity. Lelouch\'s genius-level tactics and the constant chess match between rebellion and empire make every episode gripping. The ending is one of the most talked-about in anime history.',
      },
      {
        title: 'Bleach',
        image: '/images/anime/bleach.jpg',
        description: 'Ichigo\'s journey from substitute Soul Reaper to one of the strongest warriors in the Soul Society is packed with incredible sword fights, memorable villain arcs like Aizen\'s deception, and one of the best soundtracks in anime.',
      },
      {
        title: 'Naruto Shippuden',
        image: '/images/anime/naruto-shippuden.jpg',
        description: 'The continuation of Naruto\'s story takes everything to another level. The Pain arc, Itachi\'s truth, and the theme of breaking cycles of hatred hit hard. The bond between Naruto and Sasuke drives the whole series.',
      },
      {
        title: 'Overlord',
        image: '/images/anime/overlord.jpg',
        description: 'Ainz Ooal Gown trapped in a game world as an overpowered undead overlord, but played from the villain\'s perspective. The world-building is exceptional, and watching Ainz navigate politics while his subordinates worship him is both funny and terrifying.',
      },
      {
        title: 'Mushoku Tensei',
        image: '/images/anime/mushoku-tensei.jpg',
        description: 'One of the best isekai ever made. The animation quality is movie-grade, the character development is slow and realistic, and the world feels genuinely alive. It takes the "reborn in another world" idea and treats it seriously.',
      },
    ],
  },
  {
    id: 'games',
    label: 'Games',
    emoji: '🎮',
    items: [
      {
        title: 'Genshin Impact',
        image: '/images/games/genshin-impact.jpg',
        description: 'An open-world action RPG with breathtaking visuals, deep elemental combat, and a massive world to explore. The gacha system keeps things exciting, and each region feels like stepping into a different culture.',
      },
      {
        title: 'Persona 5',
        image: '/images/games/persona-5.jpg',
        description: 'A stylish JRPG that blends dungeon crawling with daily life simulation. The Phantom Thieves\' story of rebellion against corrupt adults is told through one of the most visually striking games ever made.',
      },
      {
        title: 'Resident Evil',
        image: '/images/games/resident-evil.jpg',
        description: 'The franchise that defined survival horror. From the haunted Spencer Mansion to the streets of Raccoon City, these games deliver tension, resource management, and unforgettable boss fights.',
      },
      {
        title: 'Final Fantasy',
        image: '/images/games/final-fantasy.jpg',
        description: 'A legendary RPG series known for epic storytelling, complex characters, and worlds that feel grand in every sense. Each entry reinvents itself while keeping the magic alive.',
      },
      {
        title: 'Call of Duty',
        image: '/images/games/call-of-duty.jpg',
        description: 'The go-to FPS franchise for fast-paced multiplayer action and cinematic campaign experiences. Whether it\'s Modern Warfare\'s intensity or Warzone\'s battle royale chaos, it delivers adrenaline every time.',
      },
    ],
  },
  {
    id: 'books',
    label: 'Books',
    emoji: '📚',
    items: [
      {
        title: 'Pride and Prejudice',
        image: '/images/books/pride-and-prejudice.jpg',
        description: 'Jane Austen\'s timeless classic about love, class, and misjudgment. Elizabeth Bennet\'s sharp wit and Darcy\'s slow transformation make this one of the most satisfying character studies in English literature.',
      },
      {
        title: 'Shōgun',
        image: '/images/books/shogun.jpg',
        description: 'James Clavell\'s epic historical novel set in feudal Japan. A sweeping tale of political intrigue, cultural clash, and survival as an English navigator becomes entangled in the power struggles of Japanese warlords.',
      },
      {
        title: 'The Nightingale',
        image: '/images/books/the-nightingale.jpg',
        description: 'Kristin Hannah\'s powerful WWII novel following two sisters in occupied France. A deeply emotional story about courage, sacrifice, and the quiet heroism of ordinary people during extraordinary times.',
      },
      {
        title: 'The Art of War',
        image: '/images/books/the-art-of-war.jpg',
        description: 'Sun Tzu\'s ancient treatise on strategy and conflict. Its lessons on positioning, deception, and knowing your opponent apply far beyond the battlefield — from business to cybersecurity.',
      },
      {
        title: 'Omniscient Reader\'s Viewpoint',
        image: '/images/books/omniscient-readers-viewpoint.jpg',
        description: 'A genre-bending story where the sole reader of an apocalyptic web novel finds himself living inside the story. Blends action, philosophy, and meta-narrative in a way that redefines what a "reader" means.',
      },
    ],
  },
  {
    id: 'manhwa',
    label: 'Manhwa',
    emoji: '📖',
    items: [
      {
        title: 'Barbarian Quest',
        image: '/images/manhwa/barbarian-quest.jpg',
        description: 'A gripping tale of a barbarian warrior navigating a world of civilisation and conflict. Raw combat, cultural clashes, and a protagonist who fights with both strength and growing wisdom.',
      },
      {
        title: 'Beginning After the End',
        image: '/images/manhwa/beginning-after-the-end.jpg',
        description: 'A powerful king reborn into a world of magic and monsters. The story balances intense action with genuine character growth as Arthur Leywin builds a new life while preparing for threats only he knows are coming.',
      },
      {
        title: 'Legend of the Northern Blade',
        image: '/images/manhwa/legend-of-the-northern-blade.jpg',
        description: 'A martial arts manhwa with exceptional fight choreography and a compelling revenge story. Jin Mu-Won\'s quiet determination and explosive combat skills make every chapter satisfying.',
      },
      {
        title: 'FFF-Class Trash Hero',
        image: '/images/manhwa/fff-class-trash-hero.jpg',
        description: 'A hilarious twist on the isekai formula where the hero is forced to redo his adventure because he completed it with terrible personality scores. Dark humour meets overpowered action.',
      },
      {
        title: 'Greatest Estate Developer',
        image: '/images/manhwa/greatest-estate-developer.jpg',
        description: 'A civil engineering student reborn inside a fantasy novel as a doomed noble. Instead of fighting, he uses modern engineering knowledge to develop estates and infrastructure. Refreshingly unique and funny.',
      },
    ],
  },
];
