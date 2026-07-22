
[![Made with React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Personal%20Use-7E57C2)](LICENSE)

# Personnel Security Resume | Online Portfolio & Interactive CV


**A modern, responsive, single‑page portfolio and resume website** – built for cybersecurity professionals who value precision, clarity, and a strong digital presence. This is not a template or a resume generator; it is **my** living CV, code‑crafted to reflect my identity as a personnel security specialist.

---

## 📖 Table of Contents

- [Project Overview](#project-overview)
- [Motivation – Why I Built This](#motivation--why-i-built-this)
- [Design Philosophy & Methodologies](#design-philosophy--methodologies)
- [Technology Stack – Tools & Libraries](#technology-stack--tools--libraries)
- [Development Workflow & Implementation](#development-workflow--implementation)
- [Core Features](#core-features)
- [Getting Started (Local Setup)](#getting-started-local-setup)
- [Deployment & Hosting](#deployment--hosting)
- [What Makes This Different](#what-makes-this-different)
- [Future Roadmap](#future-roadmap)
- [License & Contact](#license--contact)

---

## 📌 Project Overview

This repository contains the complete source code for **my personal online resume and portfolio**.  
It presents:

- My professional experience in personnel security, risk assessment, and compliance.
- Technical competencies (security frameworks, tools, incident response, etc.).
- Key projects and contributions to the security community.
- A direct way to contact me or connect on professional networks.

The site is fully responsive, supports dark/light themes, and loads instantly thanks to modern frontend tooling. It serves as a permanent, version‑controlled alternative to static PDFs – always up‑to‑date, always accessible.

---

## 🎯 Motivation – Why I Built This

Traditional resumes have fundamental limitations:

- **Static & outdated** – once sent, you cannot update the recipient’s copy.
- **One‑dimensional** – no interactivity, no visual hierarchy beyond formatting.
- **Detached from your work** – a PDF cannot showcase your actual coding ability or design thinking.

I created this project to:

- **Demonstrate technical competence** – the resume _is_ the product. Hiring managers see exactly how I structure code, manage state, and design UX.
- **Maintain a single source of truth** – one URL, one set of content, automatically versioned with Git.
- **Control my personal brand** – every pixel, every animation, every word is intentional and reflects my professional identity.
- **Experiment with modern tooling** – React 19, TypeScript, Vite, and Tailwind CSS are not buzzwords; I integrate them deeply to build a production‑grade, high‑performance application.

---

## 🧠 Design Philosophy & Methodologies

### 1. **Content‑First Architecture**
Before writing a single component, I mapped out the information hierarchy:  
Header → Summary → Experience → Certifications → Technical Skills → Projects → Contact.  
Each section serves a distinct purpose, and the layout guides the reader naturally from overview to details.

### 2. **Mobile‑First Responsive Design**
Using Tailwind’s utility classes, I styled for mobile breakpoints first, then progressively enhanced for tablet and desktop. The result: a seamless experience on any device.

### 3. **Component‑Based Reusability**
React components (`Header`, `ExperienceCard`, `SkillBadge`, etc.) are isolated, tested in isolation, and reused across the page. This keeps the codebase DRY and maintainable.

### 4. **Type Safety with TypeScript**
Every prop, state variable, and API response is strictly typed. This eliminates entire classes of runtime errors and serves as living documentation for future changes.

### 5. **Performance by Default**
- **Vite** for lightning‑fast HMR during development.
- **Lazy loading** of non‑critical sections.
- **Tree‑shaking** to remove unused CSS and JS.
- **Optimised asset delivery** (SVGs, compressed images).

### 6. **Accessibility (a11y)**
Semantic HTML, ARIA labels, keyboard navigation, and sufficient colour contrast are baked in. The dark/light theme respects system preferences (`prefers-color-scheme`).

---

## 🛠️ Technology Stack – Tools & Libraries

| Category | Specific Tools |
|----------|----------------|
| **Core Framework** | React 19 (functional components, hooks) |
| **Language** | TypeScript 5.8 (strict mode) |
| **Build Tool** | Vite 6.4 + plugins (React, Tailwind) |
| **Styling** | Tailwind CSS 4 + Autoprefixer |
| **Animations** | Framer Motion (`motion`) for entrance animations & subtle transitions |
| **Icons** | Lucide React (lightweight, consistent icon set) |
| **AI Integration (optional)** | Google Gemini API (`@google/genai`) for interactive Q&A or content enhancement |
| **Package Manager** | npm |
| **Version Control** | Git + GitHub |
| **Code Quality** | TypeScript compiler (`tsc --noEmit`), ESLint (implicit via React/Vite) |

No third‑party UI libraries – everything is custom‑built to maintain full control over design and bundle size.

---

## ⚙️ Development Workflow & Implementation

### Phase 1 – Planning & Content Strategy
- Wrote draft content (experience, skills, projects) in Markdown.
- Defined the information architecture and user journey.
- Created wireframes on paper, then translated them to Figma for high‑fidelity mockups.

### Phase 2 – Environment Setup
- Initialised Vite project with React‑TypeScript template:  
  `npm create vite@latest . -- --template react-ts`
- Added Tailwind CSS, Lucide React, and Framer Motion.
- Configured path aliases (`@/*`) for cleaner imports.

### Phase 3 – Component Development
- Built static components with placeholder data.
- Implemented responsive grid/flex layouts using Tailwind utilities.
- Added theme toggle (dark/light) using React context and CSS variables.
- Integrated optional Gemini API service module (separate from core resume display).

### Phase 4 – Content Integration & Refinement
- Replaced placeholders with real resume content.
- Fine‑tuned spacing, typography (using Tailwind’s `font-*` utilities), and animations.
- Tested across Chrome, Firefox, Safari, and Edge.

### Phase 5 – Build Optimisation & Deployment
- Run `npm run build` to generate a production bundle in `/dist`.
- Previewed locally with `npm run preview`.
- Connected GitHub repository to Vercel for automatic deployments on `main` branch pushes.
- Configured environment variables (Gemini API key) on Vercel dashboard.

### Phase 6 – Continuous Maintenance
- Content updates are simply `git commit` + `git push`.
- Performance monitoring via Lighthouse (score ≥95 across all categories).

---

## ✨ Core Features

| Feature | Description |
|---------|-------------|
| **Interactive Resume Display** | Clean, scannable layout with sections for experience, certifications, technical skills, and education. |
| **Dark / Light Theme** | Persists user preference across sessions using `localStorage`. |
| **Responsive Grid** | Reflows gracefully from mobile to 4K displays. |
| **Print‑Friendly Styles** | Uses a separate print media query to produce a clean PDF‑like output. |
| **Optional Gemini Chat (demo)** | Asks the user for a question about my background and returns a formatted answer – showcases API integration. |
| **Contact Links** | Direct buttons for email, LinkedIn, GitHub, and (optionally) a contact form. |
| **Portfolio Project Cards** | Each project includes a description, technologies used, and a live/demo link. |
| **SEO Ready** | Proper meta tags, semantic HTML, and Open Graph images for social sharing. |

---

## 🚀 Getting Started (Local Setup)

To run this portfolio on your own machine (e.g., for review or customization):

```bash
# 1. Clone the repo
git clone https://github.com/guuly05/personnel-security-resume.git
cd personnel-security-resume

# 2. Install dependencies
npm install

# 3. (optional) Set up Gemini API key
cp .env.example .env.local
# then edit .env.local with your actual key

# 4. Start dev server
npm run dev
```

The site will be available at `http://localhost:3000`.

**Build for production:**
```bash
npm run build
npm run preview   # serves the built site locally
```

---

## 🌍 Deployment & Hosting

The live site is automatically deployed via **Vercel**.  

- The GitHub `main` branch is the source of truth.
- Every push triggers a new deployment with instant cache invalidation.
- A custom domain can be configured through the hosting provider.

**Current live URL:** https://guuleedmaxamuud.dev/

---

## 🔍 What Makes This Different

| Aspect | Traditional PDF Resume | This Project |
|--------|------------------------|---------------|
| **Updatability** | You must resend a new file | One push – everyone sees the latest version |
| **Interactivity** | None | Theme toggle, optional Gemini Q&A, smooth scroll |
| **Code Quality** | Hidden | Open source, typed, modular, documented |
| **Performance** | N/A | Scores 95+ on Lighthouse |
| **Platform** | Requires download & PDF viewer | Any modern browser |
| **Version Control** | Manual naming (final_v2_actual) | Git history, revertable |

---

## 🧭 Future Roadmap

The following enhancements are planned (but not yet implemented):

- [ ] **i18n** – Support for multiple languages (English + another).
- [ ] **Blog / Insights** – A section for short security articles or case studies.
- [ ] **Advanced Gemini features** – Resume quiz, skill gap analysis, or automated cover letter generation.
- [ ] **Analytics dashboard** – Privacy‑friendly page view tracking (Plausible / Umami).
- [ ] **Offline support** – Service worker for basic offline access to the resume.

---

## 📄 License & Contact

**License:** This project is personal and not licensed for general redistribution. You may view the source for reference, but please do not clone and deploy as your own without substantial changes.  
© 2025 – guuleed maxamuud aw abdi

**Contact:**  
- Email: guuleedmaxamuud40@gmail.com  
- LinkedIn: [linkedin.com/in/guuleed maxamuud](https://www.linkedin.com/in/guuleed-aw-abdi-517928277/)  
- GitHub: [github.com/guuly05](https://github.com/guuly05)

---

*Built with precision, deployed with confidence.*  
**Last updated:** July 2026
