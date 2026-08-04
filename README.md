[![Made with React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Personal%20Use-7E57C2)](LICENSE)

# Personnel Security Resume | Online Portfolio & Interactive CV

**A modern, high-performance, single-page portfolio and interactive resume website** – built for cybersecurity professionals who value precision, clarity, and a strong digital presence. This is a living CV, code-crafted to reflect my identity as a Vulnerability Assessment & Penetration Tester.

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Motivation – Why I Built This](#-motivation--why-i-built-this)
- [Design Philosophy & Methodologies](#-design-philosophy--methodologies)
- [Technology Stack](#-technology-stack)
- [Directory & File Structure](#-directory--file-structure)
- [Core Feature Breakdown](#-core-feature-breakdown)
- [Getting Started (Local Setup)](#-getting-started-local-setup)
- [Deployment & Hosting](#-deployment--hosting)
- [What Makes This Different](#-what-makes-this-different)
- [Future Roadmap](#-future-roadmap)
- [License & Contact](#-license--contact)

---

## 📌 Project Overview

This repository contains the complete source code for **my personal online resume and portfolio**.  
It presents:

- Professional experience in vulnerability assessment, penetration testing, and IT support.
- Technical competencies across security tools (Burp Suite, Nessus, Nmap, Wireshark, Linux hardening, Python).
- Verified cybersecurity credentials and professional certifications.
- Featured security projects and technical writeups.
- A direct way to connect via email, LinkedIn, or GitHub.

The site is fully responsive, supports dark and light themes, and loads instantly thanks to modern frontend tooling. It serves as a permanent, version-controlled alternative to static PDFs — always up-to-date and accessible worldwide.

---

## 🎯 Motivation – Why I Built This

Traditional resumes have fundamental limitations:

- **Static & outdated** – once sent, you cannot update the recipient’s copy.
- **One-dimensional** – no interactivity, visual hierarchy, or dynamic link previews.
- **Detached from your work** – a PDF cannot showcase actual security research, frontend design, or code quality.

I created this project to:

- **Demonstrate technical competence** – the resume _is_ the product. Hiring managers see exactly how I structure code, manage state, and design UI/UX.
- **Maintain a single source of truth** – one URL, one set of content, automatically versioned with Git.
- **Control my personal brand** – every pixel, animation, and description reflects my professional security identity.
- **Experiment with modern tooling** – React 19, TypeScript 5.8, Vite 6, and Tailwind CSS 4 integrated into a production-grade application.

---

## 🧠 Design Philosophy & Methodologies

### 1. **Content-First Architecture**
Information hierarchy is carefully structured:  
Header → Summary → Experience → Certifications → Technical Skills → Portfolio → Blog → Contact.  
Each section serves a distinct purpose, guiding visitors naturally from high-level overview to detailed technical evidence.

### 2. **Mobile-First Responsive Design**
Styled for mobile breakpoints first using Tailwind CSS, then progressively enhanced for tablet and desktop displays.

### 3. **Component-Based Reusability**
React components (`SeoHead`, `Icon`, `BirthdayConfetti`, etc.) are modular, isolated, and code-split using React `lazy` and `Suspense` for minimal initial bundle sizes.

### 4. **Strict Type Safety**
Every property, state variable, and dataset in `src/constants.ts` and `src/types.ts` is strictly typed with TypeScript.

### 5. **Performance & SEO by Default**
- **Vite 6** for fast build compilation and Hot Module Replacement (HMR).
- **Code Splitting** for each section page to optimize loading speed.
- **Dynamic Meta Tags (`react-helmet-async`)** for per-section titles, descriptions, Open Graph preview cards, and JSON-LD structured data.

---

## 🛠️ Technology Stack

| Category | Tools & Technologies |
|----------|----------------------|
| **Core Framework** | React 19 (functional components, hooks, lazy loading) |
| **Language** | TypeScript 5.8 (strict mode) |
| **Build Tool** | Vite 6.4 + `@vitejs/plugin-react` |
| **Styling & UI** | Tailwind CSS v4 + Autoprefixer |
| **Animations** | Motion (`motion/react`) for smooth entrance animations |
| **Icons** | Lucide React (`lucide-react`) |
| **SEO & Head** | `react-helmet-async` for Open Graph, Twitter Cards, & JSON-LD |
| **Package Manager** | npm |
| **Version Control** | Git + GitHub |

---

## 📁 Directory & File Structure

```
personnel-security-resume/
├── public/                      # Static public assets
│   ├── assets/                  # CV PDF downloads & Open Graph preview image
│   │   ├── Guuleed-Maxamuud-Awabdi-CV-1.pdf
│   │   └── og-preview.png       # 1200x630 social share preview card
│   ├── favicon.svg              # Custom vector SVG favicon (cyan/emerald shield)
│   ├── favicon-16x16.png        # Raster PNG favicon 16x16
│   ├── favicon-32x32.png        # Raster PNG favicon 32x32
│   ├── apple-touch-icon.png     # Apple touch icon 180x180 for iOS
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── favicon.ico              # Multi-resolution ICO fallback
│   ├── site.webmanifest         # Web App Manifest for mobile PWA support
│   ├── robots.txt               # Search engine crawler instructions
│   └── sitemap.xml              # XML Sitemap for search indexers
├── scripts/
│   └── copy_icons.js            # Node script for favicon build synchronization
├── src/
│   ├── blog/                    # Technical markdown blog posts
│   ├── components/              # Modular React components
│   │   ├── BirthdayConfetti.tsx # July 27th annual reflection confetti
│   │   ├── Icon.tsx             # Icon component wrapper
│   │   └── SeoHead.tsx          # Dynamic SEO, Open Graph & JSON-LD component
│   ├── pages/                   # Lazy-loaded section pages
│   │   ├── About.tsx            # Personal letter, background & soft skills
│   │   ├── AnnualRecap.tsx      # Annual reflection & milestone recap
│   │   ├── Blog.tsx             # Cybersecurity blog reader & markdown parser
│   │   ├── Certificates.tsx     # Verified credentials & certifications
│   │   ├── Contact.tsx          # Contact information & direct channels
│   │   ├── Experience.tsx       # Penetration testing & IT support timeline
│   │   ├── Home.tsx             # Hero section, quick metrics & CTA
│   │   ├── Portfolio.tsx        # Featured security projects & case studies
│   │   └── Skills.tsx           # Technical skills matrix & security tools
│   ├── App.tsx                  # Main layout container & navigation state
│   ├── constants.ts             # Centralized profile data & section details
│   ├── index.css                # CSS custom properties & Tailwind setup
│   ├── main.tsx                 # React app entry point with HelmetProvider
│   └── types.ts                 # TypeScript interface definitions
├── index.html                   # HTML entry point with primary meta & JSON-LD
├── metadata.json                # Repository metadata
├── package.json                 # Node dependencies & project scripts
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # TypeScript compiler configuration
└── vite.config.ts               # Vite build configuration
```

---

## ✨ Core Feature Breakdown

| Feature | Description |
|---------|-------------|
| **Single-Page Dynamic Navigation** | Smooth section switching with URL hash syncing (`#home`, `#about`, `#skills`, etc.). |
| **Dark / Light Mode Theme Engine** | Persists theme selection in `localStorage` with automatic system preference detection. |
| **Custom Vector Favicons & PWA** | Custom-designed glowing shield SVG favicon, crisp PNG fallbacks, and `site.webmanifest` for mobile home screen shortcuts. |
| **High-Impact SEO & Rich Snippets** | Comprehensive meta titles, descriptions, and Google Search JSON-LD structured data (`WebSite` and `Person` schemas). |
| **Social Link Sharing Previews** | Open Graph (`og:*`) and Twitter Card (`summary_large_image`) cards optimized for WhatsApp, LinkedIn, Telegram, X/Twitter, Discord, and iMessage. |
| **Interactive Portfolio Modals** | Rich project breakdown cards detailing security vulnerabilities, methodologies, and live links. |
| **Built-In Technical Blog Reader** | Renders long-form cybersecurity articles, code blocks, and markdown content directly within the site. |
| **Annual Reflection & Birthday Mode** | Automatic celebratory confetti trigger on July 27th featuring a dedicated reflection page. |
| **Print & PDF Export Styling** | Print-optimized stylesheet for producing clean paper/PDF copies. |

---

## 🚀 Getting Started (Local Setup)

To run this portfolio on your local machine:

```bash
# 1. Clone the repository
git clone https://github.com/guuly05/personnel-security-resume.git
cd personnel-security-resume

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will launch at `http://localhost:3000`.

**Build for Production & Test Bundle:**
```bash
npm run build
npm run preview
```

---

## 🌍 Deployment & Hosting

The site is automatically deployed via **Vercel**.  

- The GitHub `main` branch is the source of truth.
- Pushing to `main` triggers automated build checks and instant global edge distribution.

**Live URL:** https://guuleedmaxamuud.dev/

---

## 🔍 What Makes This Different

| Aspect | Traditional PDF Resume | This Web Application |
|--------|------------------------|-----------------------|
| **Updatability** | Requires resending static files | Single `git push` updates all live links instantly |
| **Interactivity** | None | Dark/light theme, interactive modals, blog reader, hash routing |
| **Link Previews** | Plain URL text | Rich preview card with image, title, and site description |
| **Searchability** | Invisible to search engines | Indexed on Google Search with JSON-LD structured data |
| **Code Verification** | Unverified | Fully open-source, typed, and code-split |
| **Performance** | Static document | 95+ score on Google Lighthouse |

---

## 🧭 Future Roadmap

- [ ] **i18n Multi-Language Support** – Add Somali and Arabic language toggles alongside English.
- [ ] **Interactive Terminal Mode** – Command-line interface view for navigating sections via terminal commands (`help`, `cat skills`, `ping contact`).
- [ ] **Privacy-First Analytics** – Integration with lightweight, privacy-focused analytics (Plausible or Umami).

---

## 📄 License & Contact

**License:** Personal portfolio code repository. You may view the source code for reference or inspiration.

**Contact Information:**  
- **Name:** Guuleed Maxmuud Aw Abdi  
- **Role:** Vulnerability Assessment & Penetration Tester  
- **Location:** Hargeisa, Somaliland  
- **Email:** [guuleedmaxamuud40@gmail.com](mailto:guuleedmaxamuud40@gmail.com)  
- **LinkedIn:** [linkedin.com/in/guuleed-aw-abdi-517928277](https://linkedin.com/in/guuleed-aw-abdi-517928277)  
- **GitHub:** [github.com/guuly05](https://github.com/guuly05)

---

*Built with precision, deployed with confidence.*  
**Last updated:** August 2026
