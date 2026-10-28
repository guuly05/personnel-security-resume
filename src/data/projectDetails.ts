export interface ProjectVisual {
  kind?: 'Product screenshot' | 'Original illustration' | 'Conceptual architecture diagram';
  title: string;
  description: string;
}

export interface ArchitectureStep {
  name: string;
  technology: string;
  detail: string;
  boundary?: string;
}

export interface ArchitectureFlow {
  title: string;
  description: string;
  connections: string[];
  steps: ArchitectureStep[];
}

export interface ArchitectureDecision {
  title: string;
  decision: string;
  tradeoff: string;
}

export interface ReportRow {
  label: string;
  value: string;
  status: 'PASS' | 'REVIEW' | 'INFO';
}

export interface TestStep {
  title: string;
  detail: string;
}

export interface CaseStudySection {
  title: string;
  body: string;
  bullets?: string[];
}

export interface ProjectDetail {
  projectVisuals: ProjectVisual[];
  screenshotGallery?: { src: string; alt: string; title: string; description: string }[];
  architectureSummary: string;
  architecture: ArchitectureFlow[];
  decisions: ArchitectureDecision[];
  evidenceNote: string;
  reportIntro: string;
  reportRows: ReportRow[];
  reportExcerpt: string;
  methodology: TestStep[];
  results: { value: string; label: string; detail: string }[];
  contribution: string[];
  caseStudySections?: CaseStudySection[];
}

/**
 * Portfolio evidence is intentionally sanitized: no private hosts, tokens,
 * client data, or exploitable findings are included in the public case studies.
 */
export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  daryeelpass: {
    projectVisuals: [
      { kind: 'Product screenshot', title: 'Clinic directory', description: 'The public discovery surface combines service information, listed providers, source context, and a prominent explanation of what a request means.' },
      { kind: 'Product screenshot', title: 'System administration workspace', description: 'A separate system-level view summarizes demo records and exposes clinic administration controls to the system administrator.' },
    ],
    screenshotGallery: [
      { src: '/assets/daryeelpass-system-admin-desktop.png', alt: 'Desktop crop of the DaryeelPass system overview with clinic totals and clinic administrator controls.', title: 'System overview · desktop', description: 'A focused desktop view of clinic status, account and request counts, and the clinic-admin invitation form.' },
      { src: '/assets/daryeelpass-system-admin-mobile.png', alt: 'Mobile DaryeelPass system overview demonstrating the responsive summary and clinic list.', title: 'System overview · mobile', description: 'The same administrative information reflows into a narrow screen with readable totals and stacked clinic rows.' },
      { src: '/assets/daryeelpass-system-admin.png', alt: 'Full-page screenshot showing the DaryeelPass system admin workspace and public clinic directory.', title: 'Role-based workflow · full page', description: 'A full-page view connects system administration, request status, availability entry, and the public directory in one prototype.' },
    ],
    architectureSummary: 'DaryeelPass separates the browser experience from the API and database. The React PWA sends credentialed JSON requests to an Express API; the API authenticates the session, enforces the role and clinic scope, validates input, and accesses PostgreSQL through Prisma. Database transactions set request context for row-level security, adding a second scope boundary beneath application checks.',
    architecture: [
      {
        title: 'Clinic discovery and appointment request',
        description: 'The public directory leads to an in-app request record. The final state remains a demo record and does not leave DaryeelPass.',
        connections: ['Search and filter', 'Clinic and service', 'Availability options', 'Authenticated request', 'Patient request history'],
        steps: [
          { name: 'Visitor', technology: 'Browser · PWA', detail: 'Uses the bilingual, responsive interface to find a clinic, service, and clinic-published details.' },
          { name: 'Directory', technology: 'React 19 · Vite', detail: 'Searches clinic, service, and provider names and displays source and last-checked context.' },
          { name: 'Availability', technology: 'Express JSON API', detail: 'Returns generated suggestions and staff-entered times as distinct options; suggestions are not clinic schedules.', boundary: 'Browser → API' },
          { name: 'Request record', technology: 'Patient session + validation', detail: 'Accepts an offset-aware future time within the allowed window and a phone number, then records a pending request.' },
          { name: 'Request history', technology: 'Patient-scoped query', detail: 'Shows the signed-in patient their own requests and permits cancellation while a request is pending.' },
        ],
      },
      {
        title: 'Role-aware clinic operations',
        description: 'Clinic staff and administrators work through explicit role checks and clinic assignments rather than selecting their own access level.',
        connections: ['Session cookie', 'Role gate', 'Clinic scope', 'RLS transaction'],
        steps: [
          { name: 'Staff member', technology: 'Invitation acceptance', detail: 'Accepts a single-use invitation; role and clinic are taken from the invitation record.' },
          { name: 'Authentication', technology: 'Express middleware', detail: 'Looks up the server-side session and checks the user role for the requested operation.' },
          { name: 'Clinic workspace', technology: 'Authorized API route', detail: 'Provides the assigned clinic queue, pending status actions, and staff-entered availability.' },
          { name: 'Database access', technology: 'Prisma transaction + RLS', detail: 'Sets transaction-local user context so PostgreSQL row-level policies can enforce data scope.', boundary: 'API → database trust boundary' },
        ],
      },
      {
        title: 'First-run system administration',
        description: 'Initial privilege creation is guarded separately from public signup and becomes permanently unavailable after successful setup.',
        connections: ['Setup key', 'Advisory lock', 'Singleton marker', 'System admin session'],
        steps: [
          { name: 'First-run check', technology: 'Setup status endpoint', detail: 'Reports setup availability only while a setup key is configured and the persistent marker is absent.' },
          { name: 'Setup request', technology: 'Dedicated validation + rate limit', detail: 'Checks the setup key and administrator fields before attempting creation.' },
          { name: 'Concurrency guard', technology: 'PostgreSQL advisory transaction lock', detail: 'Serializes competing first-run requests and creates the system administrator only once.' },
          { name: 'Persistent closure', technology: 'Database setup marker', detail: 'Records completion so the first-run flow stays closed even if the initial account later changes state.' },
        ],
      },
    ],
    decisions: [
      { title: 'Make the appointment boundary visible in the interface', decision: 'Label generated times unconfirmed, distinguish them from clinic-entered availability, and state that requests stay inside the app.', tradeoff: 'The flow is less like one-click booking, but users are less likely to mistake prototype state for a confirmed clinic appointment.' },
      { title: 'Use invitations to establish privileged roles', decision: 'Public signup always creates a patient. Clinic and staff roles come from one-time invitations, and clinic assignments are read from the invite.', tradeoff: 'Onboarding requires an administrator to create and manually share an invite, while users cannot self-select a privileged role or clinic.' },
      { title: 'Enforce clinic scope at both API and database layers', decision: 'Combine route authorization and clinic scoping with PostgreSQL RLS policies supplied with transaction-local identity context.', tradeoff: 'The data boundary is stronger and can be checked independently, while every query path must preserve the transaction context and role setup.' },
      { title: 'Use PWA precaching only for static assets', decision: 'Cache the application shell and static resources with Workbox, without configuring runtime caching for API responses.', tradeoff: 'The interface can install and load its static shell more reliably, while account and request data remain dependent on the live API.' },
    ],
    evidenceNote: 'Counts shown in the supplied admin screenshots are seeded or synthetic demo records and illustrate interface states only. Facility and provider details are transcribed from public sources, may become outdated, are not independently credential-verified, and do not indicate partnership. No real appointment outcomes, patient volume, or clinical impact are claimed.',
    reportIntro: 'Portfolio case-study snapshot based on the public repository guide, product requirements, source structure, and supplied interface screenshots. The app is explicitly documented as a local and portfolio prototype.',
    reportRows: [
      { label: 'Language coverage', value: 'Somali + English', status: 'PASS' },
      { label: 'Account roles', value: '4 explicit roles', status: 'PASS' },
      { label: 'Persistence layer', value: 'PostgreSQL 17 + Prisma 6', status: 'INFO' },
      { label: 'Clinic-level boundary', value: 'API checks + PostgreSQL RLS', status: 'PASS' },
      { label: 'Appointment integration', value: 'No external clinic system', status: 'INFO' },
      { label: 'User data in screenshots', value: 'Synthetic demo data only', status: 'INFO' },
    ],
    reportExcerpt: 'CLIENT: React 19 + Vite PWA · Somali / English\nAPI: Express 5 · session auth · Zod validation\nDATA: PostgreSQL 17 · Prisma 6 · row-level security\nSCOPE: clinic discovery + demo request lifecycle\nBOUNDARY: no clinic scheduling integration or real booking',
    methodology: [
      { title: 'Model the actors and their authority', detail: 'Define patient, staff, clinic-admin, and system-admin capabilities, then map account creation and invitations to those boundaries.' },
      { title: 'Follow the request lifecycle end to end', detail: 'Trace clinic discovery, availability retrieval, patient request validation, patient-owned history, staff queue visibility, and permitted state transitions.' },
      { title: 'Inspect data isolation and privileged setup', detail: 'Review session middleware, route role checks, invitation token storage, one-time setup marker, database transaction context, and PostgreSQL policies.' },
      { title: 'Check product claims against visible boundaries', detail: 'Compare interface notices and repository documentation to ensure suggested times, staff-entered availability, request statuses, directory sourcing, and demo records are not presented as real care workflows.' },
    ],
    results: [
      { value: '2', label: 'interface languages', detail: 'The patient-facing directory and navigation support Somali and English presentation.' },
      { value: '4', label: 'access roles', detail: 'Patient, staff, clinic admin, and system admin capabilities are modeled separately.' },
      { value: '3', label: 'application layers', detail: 'The implementation separates the React PWA, Express API, and PostgreSQL persistence.' },
    ],
    contribution: [
      'Defined the product boundary and workflows for clinic discovery, demo appointment requests, clinic operations, invitations, and system administration.',
      'Implemented the React and Vite client with bilingual copy, responsive directory and dashboard views, account flows, and PWA behavior.',
      'Built the Express API workflows for authentication, clinic discovery, availability, request management, invitations, and administration.',
      'Designed the PostgreSQL and Prisma model, migration path, clinic seed data, restricted runtime access model, and row-level security policies.',
      'Added input validation, session handling, scrypt password hashing, digest-only invitation tokens, rate-limited first-admin setup, and clinic-scoped access checks.',
      'Documented local setup, roles, API routes, database behavior, product caveats, test status, and prerequisites before any real-world deployment.',
    ],
    caseStudySections: [
      {
        title: 'Product framing and user journeys',
        body: 'The product is organized around four connected jobs: help a person find clinic information; let a patient keep track of a request; give clinic staff a queue and availability controls; and let a system administrator oversee clinic access. The directory is public, while requests and operational tools sit behind account and role boundaries. The interface keeps explanation close to the action: clinic details show their source and check date, and the request flow describes suggestions as unconfirmed and requests as internal demo records.',
        bullets: [
          'The directory searches clinic, service, and provider names and links to clinic websites, directions, phone numbers, or appointment pages when those details exist.',
          'The request flow excludes emergency services and asks for a phone number alongside the selected time.',
          'Patients can inspect their own requests and cancel only while a request is pending.',
          'Staff can update pending request state and enter availability for their assigned clinic; clinic admins can invite staff for that clinic.',
        ],
      },
      {
        title: 'Identity, authorization, and database isolation',
        body: 'The API owns authorization. Public registration creates only PATIENT accounts; privileged roles are established through guarded setup or invitations whose stored digest is single-use and expires. Auth middleware loads the session, route-level checks decide which operation is available, and clinic assignment constrains staff access. Prisma-backed database transactions establish the user context consumed by PostgreSQL row-level security, so database policies provide an additional boundary if an application query is accidentally too broad.',
        bullets: [
          'Passwords are hashed and verified with Node’s scrypt; sessions are stored server-side and represented by an HTTP-only cookie.',
          'Invitation tokens are random, single-use, time-limited values; only their SHA-256 digest is persisted.',
          'The first system administrator is created behind a separate setup key, rate limit, PostgreSQL advisory lock, and persistent singleton setup marker.',
          'The API runtime is documented to use a restricted PostgreSQL role, separate from the owner connection used for migrations.',
        ],
      },
      {
        title: 'Request lifecycle and concurrency expectations',
        body: 'A suggested time is generated by the application, while a staff-entered time is supplied by a clinic workspace. Both remain choices for a request, not a synchronized scheduling slot. The API validates that the requested time is offset-aware, in the future, within the supported fourteen-day window, and either generated or staff-entered. A saved request records its source and begins as PENDING. Staff can change that app state to CONFIRMED or DECLINED, but the product documentation explicitly says those labels do not notify a clinic or represent a real-world confirmation.',
        bullets: [
          'The flow separates generated suggestions from staff-entered availability in both data and presentation.',
          'A request does not reserve slot capacity or send notifications to a clinic.',
          'The UI and documentation caution users to contact the facility directly and not enter real patient, identity, or medical information.',
        ],
      },
      {
        title: 'Bilingual responsive PWA',
        body: 'The client is a React 19 application built with Vite and CSS design tokens. Language controls expose Somali and English throughout the experience. The supplied screenshots show the public clinic directory as well as a wide administrative dashboard and a mobile admin layout. Workbox precaches static application resources so the shell can be installed, while API responses are intentionally excluded from runtime caching to avoid treating account or request data as offline content.',
        bullets: [
          'Responsive directory cards carry clinic services, listed providers, contact links, source references, and check dates.',
          'Admin summaries, clinic rows, and controls adapt to a narrow mobile viewport rather than requiring a desktop-only workspace.',
          'The PWA setup is documented as static asset precaching; authenticated API behavior still requires a reachable API and database.',
        ],
      },
      {
        title: 'Verification, evidence, and deployment limits',
        body: 'The repository includes client and API tests, schema migrations, setup instructions, and explicit deployment prerequisites. The README describes local startup with Docker PostgreSQL and separate frontend and backend package installs, and it calls for a restricted runtime database role. The current public repository is a source artifact rather than evidence of a live clinical service. The screenshots are used here to show the interface and sample administrative states; their counts are demo data.',
        bullets: [
          'The documented test and build workflows cover frontend and backend behavior, with PostgreSQL required for database-backed integration paths.',
          'Facility details are transcribed from public clinic sources and can become outdated; the directory is not a partnership or independent provider-credential directory.',
          'Email verification, account recovery, automated invitation delivery, clinic-system integration, and real appointment reservation are outside the current prototype.',
          'A real deployment would require operational, privacy, security, data-governance, accessibility, and clinic coordination work beyond this portfolio build.',
        ],
      },
    ],
  },
  'samaale-general-trading': {
    projectVisuals: [
      { kind: 'Original illustration', title: 'Samaale website concept illustration', description: 'A custom visual representation of the site’s commerce and logistics experience; this is not a browser screenshot.' },
      { title: 'Catalogue and logistics workflow', description: 'Structured product discovery and an interactive route map turn a broad wholesale operation into navigable, evidence-backed information.' },
    ],
    architectureSummary: 'The platform separates the customer-facing React application from the contact trust boundary: static assets and prerendered routes are delivered at the edge, while the only server-side workflow validates and protects inquiry submissions before sending them through Resend.',
    architecture: [
      {
        title: 'Product discovery → buyer inquiry',
        description: 'The public catalogue stays in the customer-facing app; the final inquiry can hand off to WhatsApp.',
        connections: ['HTTPS route', 'Search / filter state', 'Product detail', 'User handoff'],
        steps: [
          { name: 'Buyer', technology: 'Browser', detail: 'Arrives at a prerendered company or product route.' },
          { name: 'Company site', technology: 'React 19 · React Router 7', detail: 'Renders the English/Somali experience and route-level content.' },
          { name: 'Catalogue', technology: 'Typed product data', detail: 'Search and category filters narrow the 27+ product entries.' },
          { name: 'Product view', technology: 'Portal modal', detail: 'Shows the selected product details without leaving the catalogue.' },
          { name: 'Inquiry handoff', technology: 'WhatsApp link', detail: 'Carries the buyer to the company’s inquiry channel.' },
        ],
      },
      {
        title: 'Protected contact submission',
        description: 'The browser collects the request, but email delivery and abuse controls stay behind the Cloudflare Worker boundary.',
        connections: ['HTTPS + token', 'Validated payload', 'Rate-limit check', 'Email API'],
        steps: [
          { name: 'Contact form', technology: 'React client', detail: 'Collects the message and obtains a Turnstile response.' },
          { name: 'Bot verification', technology: 'Cloudflare Turnstile', detail: 'The Worker verifies the challenge token server-side.', boundary: 'Browser → server trust boundary' },
          { name: 'Request checks', technology: 'Cloudflare Worker', detail: 'Checks body size, JSON shape, required fields, types, and limits.' },
          { name: 'Abuse limit', technology: 'SHA-256 identity + KV', detail: 'Applies a short-lived request limit before an email is sent.' },
          { name: 'Delivery', technology: 'Resend', detail: 'Sends the validated inquiry using server-side credentials.', boundary: 'External email provider' },
        ],
      },
      {
        title: 'Build and deployment path',
        description: 'Static routes and the contact API have separate deployment responsibilities.',
        connections: ['TypeScript build', 'Prerendered output', 'Edge delivery'],
        steps: [
          { name: 'Source app', technology: 'React + TypeScript + Vite', detail: 'Builds route chunks and shared vendor bundles.' },
          { name: 'Public pages', technology: 'Prerender + Vercel', detail: 'Serves static route output and browser assets through the edge.' },
          { name: 'Contact API', technology: 'Cloudflare Worker', detail: 'Handles the protected inquiry path independently of the static app.', boundary: 'Separate server-side boundary' },
          { name: 'Supporting services', technology: 'KV + Turnstile + Resend', detail: 'Provide rate limiting, challenge verification, and email delivery.' },
        ],
      },
    ],
    decisions: [
      { title: 'Keep catalogue data in the public app', decision: 'Use typed product content and client-side filtering for a mostly read-oriented catalogue.', tradeoff: 'Fast, simple browsing avoids a product API, while catalogue updates still require a content/build release.' },
      { title: 'Isolate the contact trust boundary', decision: 'Send inquiries through a Cloudflare Worker instead of exposing email provider credentials in the browser.', tradeoff: 'The request path gains bot checks and rate limiting, but delivery depends on Worker, KV, Turnstile, and email provider availability.' },
    ],
    evidenceNote: 'Counts describe the published catalogue and implementation structure. No conversion-rate or performance improvement is claimed without analytics or a measured before/after baseline.',
    reportIntro: 'Public technical case-study snapshot based on the implementation documentation. Credentials, private customer data, and provider secrets are intentionally excluded.',
    reportRows: [
      { label: 'Source footprint', value: '30+ TS / TSX files', status: 'INFO' },
      { label: 'UI surface', value: '22 React components', status: 'INFO' },
      { label: 'Catalogue', value: '27+ products', status: 'PASS' },
      { label: 'Languages', value: 'English + Somali', status: 'PASS' },
      { label: 'Contact protection', value: 'Turnstile + KV limit', status: 'PASS' },
    ],
    reportExcerpt: 'SYSTEM: bilingual commerce and logistics SPA\nDELIVERY: Vercel edge + Cloudflare Worker API\nCONTROL: typed validation, bot verification, rate limiting\nOUTPUT: catalogue, map, news, SEO, and inquiry workflows',
    methodology: [
      { title: 'Translate the business model into information architecture', detail: 'Grouped the company around the decisions a buyer actually needs to make: what Samaale supplies, where it operates, which logistics services it provides, and how to start an inquiry.' },
      { title: 'Build reusable interaction primitives', detail: 'Used typed data arrays, shared components, portals, Motion transitions, and event-based coordination so catalogue, news, navigation, and location experiences could evolve without duplicating stateful UI logic.' },
      { title: 'Protect the only server-side boundary', detail: 'Kept email credentials and abuse controls out of the browser. The Worker checks configuration, body size, JSON shape, field types and limits, Turnstile, then a SHA-256-derived KV rate limit before calling Resend.' },
      { title: 'Verify delivery, accessibility, and discoverability', detail: 'Combined strict TypeScript checks, production bundling, prerendering, route metadata, sitemap and feed generation, Playwright/axe accessibility auditing, reduced-motion handling, semantic HTML, and keyboard focus management.' },
    ],
    results: [
      { value: '11', label: 'client-side routes', detail: 'The SPA supports direct navigation across company, catalogue, news, contact, and legal surfaces.' },
      { value: '7', label: 'mapped locations', detail: 'The logistics map visualizes the operational network and regional movement of goods.' },
      { value: '2', label: 'supported languages', detail: 'English and Somali content share one React Context translation system with local persistence.' },
    ],
    contribution: [
      'Owned the information architecture, visual system, frontend implementation, deployment model, and technical documentation.',
      'Designed the catalogue and news systems with typed content models, category filtering, search, portals, detail views, and shareable URL states.',
      'Built the logistics story as both service content and an interactive Leaflet map with custom location nodes and animated route polylines.',
      'Implemented bilingual content, responsive navigation, scroll-aware header behavior, keyboard focus traps, skip links, semantic landmarks, and reduced-motion support.',
      'Created the Cloudflare Worker contact pipeline, including validation, Turnstile verification, SHA-256 rate limiting, Resend email templates, and safe environment-variable handling.',
    ],
    caseStudySections: [
      {
        title: 'Architecture and code organization',
        body: 'The codebase is organized around a single React application entry point and a component dependency tree that keeps business sections independent while sharing infrastructure utilities. App.tsx owns global concerns such as routing, page loading, error recovery, floating actions, and route-change analytics. Feature components then own their local data and interaction state: Hero manages the timed media and typing state machine, ProductCatalog manages search and filtering, NewsArticleModal manages article galleries and sharing, and LogisticsMap owns the Leaflet view. This boundary keeps the main composition readable and lets individual sections be lazy-loaded or audited in isolation.',
        bullets: [
          'Typed data models make products, news, branches, partners, testimonials, and translations predictable to render and safer to refactor.',
          'ReactDOM.createPortal keeps catalogue and article dialogs above layout constraints while preserving a clean parent component tree.',
          'A CustomEvent channel connects the header brand menu to the catalogue without prop drilling across unrelated sections.',
          'ErrorBoundary, LazyRender, ScrollReveal, RouteChangeTracker, and the focus-trap hook provide reusable cross-cutting behavior instead of one-off page logic.',
        ],
      },
      {
        title: 'Customer-facing techniques',
        body: 'The experience was designed around progressive disclosure. The homepage establishes trust with company history, product categories, service cards, partner logos, testimonials, and regional reach; deeper content is available through modals and direct routes when a visitor is ready to explore. The product catalogue uses useMemo-backed search and filtering, loading skeletons, aspect-ratio media, and a product detail modal. Product inquiries can then move directly into WhatsApp, reducing the distance between discovery and a real commercial conversation.',
        bullets: [
          'The header changes height, contrast, and shadow after scrolling, while the mobile drawer uses a spring animation and trapped keyboard focus.',
          'The hero combines a nine-item media slideshow, AnimatePresence crossfades, a Ken Burns effect, and a locale-aware typing animation.',
          'News articles are deep-linkable, support image galleries and Web Share API handoff, and migrate legacy hash URLs to path-based URLs.',
          'The logistics section pairs service descriptions with a Leaflet map, seven custom location nodes, and animated route polylines to make regional capability concrete.',
        ],
      },
      {
        title: 'Performance, SEO, and accessibility',
        body: 'Performance was treated as an architectural concern, not a final polish step. React.lazy and Suspense split page-level code, LazyRender defers below-the-fold work with IntersectionObserver, and Vite manualChunks separates React, Motion, Leaflet, and icons for cache-friendly delivery. The post-build pipeline prerenders route HTML, optimizes media with Sharp, and generates sitemap and feed assets. Dynamic head management supplies route-specific titles, descriptions, canonical URLs, Open Graph data, and a large social preview.',
        bullets: [
          'The reduced-motion system combines MotionConfig reducedMotion="user" with component-level useReducedMotion checks.',
          'Semantic landmarks, skip-to-content navigation, descriptive image alt text, ARIA menu/dialog states, Escape-key handling, and focus restoration support keyboard and assistive-technology users.',
          'Playwright and axe-core are part of the documented verification workflow, so accessibility can be checked against the shipped interface rather than assumed from the source.',
        ],
      },
      {
        title: 'Secure contact and deployment design',
        body: 'The contact form is the deliberate trust boundary in the system. The browser performs immediate UX validation, but the Cloudflare Worker treats every request as untrusted: it verifies environment configuration, rejects oversized bodies, parses JSON, validates six fields with type, length, and pattern constraints, verifies the Turnstile token with Cloudflare, hashes the request identity with SHA-256 for a short-lived KV limit, and only then sends an HTML notification through Resend. This keeps provider credentials and abuse controls server-side while preserving a simple form experience for visitors.',
        bullets: [
          'The frontend is delivered as a static SPA through Vercel and its edge CDN, while the API runs in the Cloudflare Workers isolate runtime.',
          'Vercel build and deployment, Cloudflare Pages Functions, Resend, Turnstile, KV, Leaflet tiles, and GA4 are connected through explicit environment boundaries.',
          'The deployment model supports HTTPS, edge caching, Brotli compression, route rewrites, prerendered HTML, and server-only secrets without adding a traditional application server.',
        ],
      },
    ],
  },
  'portfolio-platform': {
    projectVisuals: [
      { kind: 'Original illustration', title: 'Portfolio platform identity visual', description: 'A custom social-preview graphic for the site, not a browser screenshot.' },
      { title: 'Booking workflow', description: 'Availability, protected booking, Google Meet creation, and self-service management form a complete public workflow.' },
    ],
    architectureSummary: 'A prerendered React frontend shares route and content models with the build pipeline, while Vercel functions connect validated browser actions to external services and durable storage.',
    architecture: [
      {
        title: 'Route content and page delivery',
        description: 'The same route and content models feed prerendering and the browser application.',
        connections: ['Build-time render', 'Static route files', 'Browser hydration'],
        steps: [
          { name: 'Site source', technology: 'React 19 + TypeScript', detail: 'Page modules, project data, Markdown posts, and route metadata.' },
          { name: 'Build pipeline', technology: 'Vite + prerender scripts', detail: 'Generates route HTML, feeds, sitemap, and metadata.' },
          { name: 'Static hosting', technology: 'Vercel', detail: 'Delivers prerendered pages and client assets with security headers.' },
          { name: 'Visitor browser', technology: 'History routing + lazy pages', detail: 'Hydrates the selected route and loads page modules as needed.' },
        ],
      },
      {
        title: 'Calendar booking workflow',
        description: 'Availability and booking actions pass through server functions before changing calendar or stored booking state.',
        connections: ['Month / date query', 'Validated request + idempotency key', 'Calendar operation', 'Confirmation links'],
        steps: [
          { name: 'Booking UI', technology: 'React calendar', detail: 'Shows available dates, time slots, and the visitor’s timezone.' },
          { name: 'API boundary', technology: 'Vercel functions', detail: 'Validates payloads, Turnstile tokens, rate limits, and duplicate requests.', boundary: 'Browser → server trust boundary' },
          { name: 'Calendar', technology: 'Google Calendar API', detail: 'Checks availability and creates or updates the event.', boundary: 'External calendar provider' },
          { name: 'Booking record', technology: 'Durable store', detail: 'Persists status and a protected self-service management token.' },
          { name: 'Visitor confirmation', technology: 'Email + Meet / calendar links', detail: 'Returns the meeting and calendar details to the visitor.' },
        ],
      },
      {
        title: 'Contact form workflow',
        description: 'The contact endpoint validates and protects submissions before triggering email delivery.',
        connections: ['HTTPS + Turnstile', 'Shared validation', 'Rate-limit check', 'Email delivery'],
        steps: [
          { name: 'Contact form', technology: 'React client', detail: 'Collects name, email, and message.' },
          { name: 'API validation', technology: 'Vercel function', detail: 'Checks origin, input shape, and field limits.', boundary: 'Browser → server trust boundary' },
          { name: 'Abuse controls', technology: 'Turnstile + rate limit', detail: 'Rejects automated or excessive submissions.' },
          { name: 'Notification', technology: 'Resend', detail: 'Sends the validated message using server-only credentials.', boundary: 'External email provider' },
        ],
      },
    ],
    decisions: [
      { title: 'Prerender public content', decision: 'Generate HTML for public routes while keeping interactive booking and contact workflows in server functions.', tradeoff: 'Direct links and page metadata are available immediately, while interactive state still requires the browser bundle.' },
      { title: 'Use separate workflow APIs', decision: 'Keep availability, booking, management, and contact as distinct server-side operations.', tradeoff: 'The boundaries make validation and permissions clearer, but external calendar and email services remain dependencies.' },
    ],
    evidenceNote: 'Route, workflow, and control counts describe the current application and source. No booking-conversion or visitor-growth metric is claimed.',
    reportIntro: 'Public platform review snapshot. Credentials, booking tokens, provider responses, and personal submissions are excluded.',
    reportRows: [
      { label: 'Public experiences', value: '9+ routes and workflows', status: 'INFO' },
      { label: 'Server workflows', value: '4 protected APIs', status: 'PASS' },
      { label: 'Browser secrets', value: 'Server-only credentials', status: 'PASS' },
      { label: 'SEO output', value: 'Prerendered route documents', status: 'INFO' },
    ],
    reportExcerpt: 'SYSTEM: production portfolio platform\nCONTROL: secrets and booking tokens remain server-side\nOUTPUT: route HTML, feeds, metadata, and protected workflows generated',
    methodology: [
      { title: 'Model the public product', detail: 'Designed the site as a working product surface rather than a collection of resume sections, with direct routes for every meaningful experience.' },
      { title: 'Protect external boundaries', detail: 'Validated form input server-side and added origin checks, Turnstile, rate limits, idempotency, and hashed booking management tokens.' },
      { title: 'Verify the shipped experience', detail: 'Used typed tests, production builds, prerendered output, sitemap generation, and SEO assertions to check both behavior and discoverability.' },
    ],
    results: [
      { value: '9+', label: 'public experiences', detail: 'Portfolio, blog, booking, contact, legal, and content routes ship as direct URLs.' },
      { value: '4', label: 'server workflows', detail: 'Availability, booking, management, and contact APIs support real user actions.' },
      { value: '5+', label: 'security controls', detail: 'Validation, Turnstile, rate limits, headers, and idempotency protect the public surface.' },
    ],
    contribution: [
      'Owned product direction, information architecture, visual system, and end-to-end implementation.',
      'Built the typed React frontend, lightweight router, lazy page loading, theme system, and interactive terminal.',
      'Implemented protected contact and Google Calendar booking workflows with durable storage and self-service management.',
      'Created Markdown publishing, social image generation, feeds, prerendering, metadata, and deployment security headers.',
    ],
  },
  'cyber-dashboard': {
    projectVisuals: [
      { kind: 'Product screenshot', title: 'Threat feed workspace', description: 'Product screenshot showing live indicators, risk scores, and investigation shortcuts in one analyst view.' },
      { title: 'Investigation surface', description: 'The same workflow keeps IP, domain, and CVE context close to the analyst.' },
    ],
    architectureSummary: 'A server-mediated lookup flow keeps third-party credentials away from the browser while the client focuses on investigation and visualization.',
    architecture: [
      {
        title: 'Threat lookup request path',
        description: 'The dashboard sends lookups through server routes so provider credentials are not shipped to the analyst’s browser.',
        connections: ['Analyst query', 'Validated API request', 'Provider lookup', 'Cached response'],
        steps: [
          { name: 'Analyst', technology: 'Dashboard UI', detail: 'Enters an IP address, domain, or CVE identifier.' },
          { name: 'Client data layer', technology: 'TanStack Query', detail: 'Tracks loading/error state and reuses cached results.' },
          { name: 'Server route', technology: 'Next.js API route', detail: 'Validates the lookup and selects the relevant provider.', boundary: 'Browser → server trust boundary' },
          { name: 'Threat data', technology: 'AbuseIPDB / CIRCL CVE', detail: 'Returns the supported reputation or vulnerability information.', boundary: 'External intelligence providers' },
          { name: 'Investigation view', technology: 'Risk panels + Recharts', detail: 'Presents lookup results and context to the analyst.' },
        ],
      },
      {
        title: 'Analyst follow-up links',
        description: 'External investigation tools are opened as user-initiated links rather than silently queried from the app.',
        connections: ['Selected indicator', 'Safe outbound link'],
        steps: [
          { name: 'Result context', technology: 'IP / domain / CVE', detail: 'The analyst chooses a result to investigate further.' },
          { name: 'External reference', technology: 'VirusTotal / OTX / Shodan', detail: 'Opens the selected provider’s public investigation page.', boundary: 'Navigation leaves this application' },
        ],
      },
    ],
    decisions: [
      { title: 'Proxy provider requests on the server', decision: 'Keep API credentials in server-side routes and return only the response needed by the UI.', tradeoff: 'This reduces browser exposure of credentials, while adding a server hop and dependence on provider quotas and availability.' },
      { title: 'Separate lookup state from presentation', decision: 'Use TanStack Query for request/cache state and Recharts for visual summaries.', tradeoff: 'The interface can reuse results and show data clearly, but provider response quality still limits the investigation.' },
    ],
    evidenceNote: 'The listed lookup types, providers, and client/server boundaries describe the implemented dashboard. No claim of analyst time saved or detection accuracy is made.',
    reportIntro: 'Public verification snapshot from the production review. Values describe controls and scope, not private targets.',
    reportRows: [
      { label: 'Client-side secrets', value: 'No API keys shipped', status: 'PASS' },
      { label: 'Lookup surfaces', value: 'IP · domain · CVE', status: 'INFO' },
      { label: 'Security headers', value: 'Enabled at deployment edge', status: 'PASS' },
      { label: 'Deployment', value: 'Vercel · live', status: 'INFO' },
    ],
    reportExcerpt: 'SCOPE: public dashboard controls\nRESULT: secrets remain server-side\nNOTE: target identifiers and provider response bodies removed',
    methodology: [
      { title: 'Threat-model the browser boundary', detail: 'Mapped every external lookup and marked credentials, user input, and provider responses as separate trust boundaries.' },
      { title: 'Exercise the lookup routes', detail: 'Tested valid, malformed, empty, and provider-error inputs before wiring results into the UI.' },
      { title: 'Review deployment controls', detail: 'Checked headers, client bundles, outbound links, responsive states, and loading/error behavior on the deployed build.' },
    ],
    results: [
      { value: '0', label: 'client API keys', detail: 'Credentials stay behind server-side route proxies.' },
      { value: '3', label: 'core lookup types', detail: 'IP, domain, and CVE workflows share one investigation surface.' },
      { value: '5+', label: 'security controls', detail: 'Headers, validation, caching, safe links, and protected configuration.' },
    ],
    contribution: [
      'Owned the product direction, threat model, and end-to-end implementation.',
      'Designed the route-proxy boundary and integrated the threat-intelligence providers.',
      'Built the analyst UI, charts, loading states, error states, and responsive behavior.',
      'Configured deployment, security headers, analytics, and the public documentation.',
    ],
  },
  'gabay-keeper': {
    projectVisuals: [
      { kind: 'Original illustration', title: 'Gabay Keeper workflow illustration', description: 'An original architecture illustration of local OCR, reader review, private archive storage, and export; it is not a product screenshot.' },
      { title: 'Preservation workflow', description: 'OCR and visual export support a private path from printed page to shareable artifact.' },
    ],
    architectureSummary: 'A client-led archive uses Firebase as the identity and document layer while OCR and card generation stay inside the user’s browser.',
    architecture: [
      {
        title: 'Sign-in and private archive',
        description: 'Firebase Authentication establishes identity, and Firestore rules scope archive records to that identity.',
        connections: ['Sign-in request', 'Authenticated session', 'Owner-scoped read/write'],
        steps: [
          { name: 'Reader', technology: 'React archive UI', detail: 'Uses search, genre filters, footnotes, and reading views.' },
          { name: 'Identity', technology: 'Firebase Authentication', detail: 'Provides the signed-in user identity.' },
          { name: 'Authorization', technology: 'Firestore Security Rules', detail: 'Checks ownership before a document read or write.', boundary: 'User identity → data authorization' },
          { name: 'Archive records', technology: 'Cloud Firestore', detail: 'Stores structured poem metadata and user-owned documents.' },
        ],
      },
      {
        title: 'Printed page → local OCR → archive entry',
        description: 'OCR runs in the browser; the visitor can review the extracted text before choosing what to save.',
        connections: ['Local file selection', 'In-browser OCR', 'Reader review', 'Optional authenticated save'],
        steps: [
          { name: 'Printed page', technology: 'User-selected image', detail: 'The visitor chooses a page image in the browser.' },
          { name: 'Text recognition', technology: 'Tesseract.js', detail: 'Processes the image locally in the browser.' , boundary: 'Local processing; no OCR upload' },
          { name: 'Review', technology: 'Archive form', detail: 'The reader checks and edits the recognized text and metadata.' },
          { name: 'Save', technology: 'Firestore + ownership rules', detail: 'Stores the entry only after an authenticated user action.' },
        ],
      },
      {
        title: 'Archive record → shareable card',
        description: 'Card rendering is performed in the client and exported as a local image.',
        connections: ['Selected poem', 'DOM-to-image render', 'Local export'],
        steps: [
          { name: 'Selected record', technology: 'Archive UI', detail: 'The reader chooses a poem card to prepare.' },
          { name: 'Card rendering', technology: 'html-to-image', detail: 'Converts the card markup into an image in the browser.' },
          { name: 'Export', technology: 'PNG download/share', detail: 'Creates a shareable image without a separate image server.' },
        ],
      },
    ],
    decisions: [
      { title: 'Run OCR on the device', decision: 'Use Tesseract.js in the browser so source page images are not sent to an OCR service.', tradeoff: 'The privacy boundary is smaller, while OCR speed and accuracy depend on the visitor’s device and source image.' },
      { title: 'Enforce ownership in Firestore rules', decision: 'Apply per-user document checks at the data layer rather than relying only on hidden UI controls.', tradeoff: 'Each data path must keep the rules aligned with the document model and sign-in state.' },
    ],
    evidenceNote: 'The diagram separates local OCR from authenticated Firestore storage. “Local processing” applies to OCR and card rendering; saved archive records are stored in Firestore.',
    reportIntro: 'Sanitized privacy review for the archive workflow. Personal poems, account identifiers, and OCR output are excluded.',
    reportRows: [
      { label: 'Document ownership', value: 'Per-user rule enforced', status: 'PASS' },
      { label: 'OCR processing', value: 'Browser-side', status: 'PASS' },
      { label: 'Export path', value: 'Generated locally', status: 'INFO' },
      { label: 'Backend server', value: 'Not required', status: 'INFO' },
    ],
    reportExcerpt: 'DATA CLASS: user-owned cultural archive\nCONTROL: Firestore ownership rules\nREDACTION: poem text, account IDs, and image payloads removed',
    methodology: [
      { title: 'Define the ownership model', detail: 'Started with the rule that a signed-in user can read and write only their own archive documents.' },
      { title: 'Test privacy-sensitive flows', detail: 'Exercised sign-in, record creation, filtering, OCR import, footnotes, and export with empty and malformed inputs.' },
      { title: 'Validate the client boundary', detail: 'Reviewed network assumptions, Firestore rules, offline UI states, and long-form reading behavior across screen sizes.' },
    ],
    results: [
      { value: '100%', label: 'OCR in-browser', detail: 'Printed text is processed locally by Tesseract.js.' },
      { value: '1:1', label: 'document ownership', detail: 'Each archive document is scoped to its authenticated owner.' },
      { value: '3', label: 'preservation paths', detail: 'Metadata entry, OCR capture, and visual card export.' },
    ],
    contribution: [
      'Sole developer and designer from information architecture through implementation.',
      'Designed the privacy model and wrote the Firebase Security Rules.',
      'Built the archive, filters, footnotes, OCR flow, and visual export pipeline.',
      'Made the reading experience responsive, accessible, and optimized for dark mode.',
    ],
  },
  purpleprint: {
    projectVisuals: [
      { kind: 'Product screenshot', title: 'Split editor and preview', description: 'Product screenshot showing Markdown source and its rendered document side by side.' },
      { title: 'Print-ready workflow', description: 'The document moves from local parsing to Android’s native PDF and print surfaces.' },
    ],
    architectureSummary: 'PurplePrint has no network dependency: Markdown is parsed into an AST and laid out into a PDF entirely on the Android device.',
    architecture: [
      {
        title: 'Markdown source → PDF document',
        description: 'The full document pipeline is local to the Android device and does not require a network service.',
        connections: ['Editor state', 'Parsed structure', 'Page layout', 'Native document'],
        steps: [
          { name: 'Editor', technology: 'Jetpack Compose + Material 3', detail: 'Captures Markdown and shows adaptive phone/tablet editing UI.' },
          { name: 'Parser', technology: 'Custom block + inline parser', detail: 'Converts Markdown syntax into a structured document model.' },
          { name: 'Document tree', technology: 'AST', detail: 'Represents headings, paragraphs, lists, code, and inline spans.' },
          { name: 'Layout engine', technology: 'Android canvas / page layout', detail: 'Measures content and places blocks across PDF pages.' },
          { name: 'PDF output', technology: 'Android PdfDocument', detail: 'Writes the pages to a device-local PDF.', boundary: 'On-device; no network permission' },
        ],
      },
      {
        title: 'Preview and print handoff',
        description: 'The editor preview and the native Android print flow consume the same parsed document model.',
        connections: ['AST render', 'Preview layout', 'Print request'],
        steps: [
          { name: 'Parsed Markdown', technology: 'Shared AST', detail: 'Supplies content to both preview and export paths.' },
          { name: 'Live preview', technology: 'Compose UI', detail: 'Shows the rendered document while the source is edited.' },
          { name: 'Print / share', technology: 'PrintManager', detail: 'Hands the generated document to Android’s native print surface.' },
        ],
      },
    ],
    decisions: [
      { title: 'Keep the document engine on-device', decision: 'Use a custom parser and Android PDF APIs instead of uploading Markdown to a conversion service.', tradeoff: 'Documents stay local and the app works offline, while parser and pagination edge cases remain the app’s responsibility.' },
      { title: 'Adapt editing to screen size', decision: 'Use a split editor/preview on larger layouts and a focused tab workflow on phones.', tradeoff: 'The same content model supports both layouts, with different navigation affordances by device size.' },
    ],
    evidenceNote: 'Offline behavior is supported by the declared permission posture and the local parser/PDF workflow. It does not imply a measured user-adoption or performance result.',
    reportIntro: 'Offline and privacy controls from the Android build review. Document content and device identifiers are intentionally absent.',
    reportRows: [
      { label: 'Internet permission', value: 'Not declared', status: 'PASS' },
      { label: 'Document processing', value: 'On-device', status: 'PASS' },
      { label: 'PDF output', value: 'Native PdfDocument', status: 'INFO' },
      { label: 'Backup default', value: 'Disabled', status: 'PASS' },
    ],
    reportExcerpt: 'MODE: offline-first\nPERMISSIONS: network access absent\nREDACTION: source document and device metadata removed',
    methodology: [
      { title: 'Test parser coverage', detail: 'Checked block and inline Markdown combinations, empty documents, long lines, and malformed syntax against the AST renderer.' },
      { title: 'Validate layout output', detail: 'Compared preview and generated PDF across headings, lists, code, page breaks, and print dialog handoff.' },
      { title: 'Exercise device states', detail: 'Verified phone tabs, tablet split view, theme changes, rotation, and offline launch behavior.' },
    ],
    results: [
      { value: '0', label: 'network permissions', detail: 'The application is designed to work without internet access.' },
      { value: '2', label: 'adaptive layouts', detail: 'Tabs on phones and split editor/preview on tablets.' },
      { value: '1', label: 'local document engine', detail: 'The parser and PDF renderer run on the device.' },
    ],
    contribution: [
      'Sole developer responsible for the native Android architecture and product decisions.',
      'Wrote the custom block-level and inline Markdown parser and AST model.',
      'Implemented the PDF layout engine with Android PdfDocument and PrintManager.',
      'Designed the adaptive Compose UI, themes, permission posture, and offline behavior.',
    ],
  },
  'infosec-course': {
    projectVisuals: [
      { kind: 'Original illustration', title: 'Curriculum structure illustration', description: 'An original map of the repository’s learning structure, from foundations through labs and reference material; it is not a screenshot.' },
      { title: 'Lab evidence format', description: 'Exercises and quizzes turn each security concept into a repeatable practice loop.' },
    ],
    architectureSummary: 'The course repository is structured as a learning system: concepts establish context, labs create evidence, and frameworks connect practice to industry language.',
    architecture: [
      {
        title: 'Learner path through the curriculum',
        description: 'The repository moves from concepts to guided practice and then to evidence of understanding.',
        connections: ['Read concepts', 'Apply in a lab', 'Check understanding'],
        steps: [
          { name: 'Learner', technology: 'GitHub repository', detail: 'Opens the versioned course material and follows the chapter order.' },
          { name: 'Foundations', technology: 'Markdown chapters', detail: 'Introduces security concepts, terminology, and frameworks.' },
          { name: 'Practice', technology: 'Guided Kali Linux labs', detail: 'Uses scoped exercises with tools such as Nmap, Wireshark, and Metasploit.' },
          { name: 'Learning evidence', technology: 'Quizzes + case studies', detail: 'Connects lab activity to analysis and review.' },
        ],
      },
      {
        title: 'Practice → professional reference material',
        description: 'Framework guides and templates give learners a bridge from exercises to common security work products.',
        connections: ['Lab / incident context', 'Framework mapping', 'Reusable reference'],
        steps: [
          { name: 'Scenario', technology: 'Lab or case study', detail: 'Starts with a defined learning task or public incident.' },
          { name: 'Reference mapping', technology: 'NIST / MITRE / OWASP / ISO / PCI DSS', detail: 'Connects the topic to recognized control or threat language.' },
          { name: 'Work product', technology: 'Policy templates', detail: 'Provides a starting point for structured documentation.' },
        ],
      },
    ],
    decisions: [
      { title: 'Publish as a versioned repository', decision: 'Keep chapters, labs, quizzes, and templates together in an open repository rather than making the material depend on a hosted course platform.', tradeoff: 'The content is easy to inspect and fork, while learners need to manage their own sequence and lab environment.' },
      { title: 'Pair each concept with practice', decision: 'Connect written foundations to guided labs, cases, and policy examples.', tradeoff: 'The wider curriculum is more useful as a learning path, but its 45–65 hour estimate is a scope estimate, not a measured completion time.' },
    ],
    evidenceNote: 'Chapter, case-study, framework, and template totals are counts of repository content. The estimated study duration is not a measured learner outcome.',
    reportIntro: 'Public curriculum audit snapshot. No student submissions, private notes, or machine-specific details are included.',
    reportRows: [
      { label: 'Chapters', value: '9 structured chapters', status: 'INFO' },
      { label: 'Practice estimate', value: '45–65 hours', status: 'INFO' },
      { label: 'Framework guides', value: '5 included', status: 'PASS' },
      { label: 'Policy templates', value: '9 included', status: 'PASS' },
    ],
    reportExcerpt: 'REPOSITORY: open educational curriculum\nEVIDENCE: labs, quizzes, frameworks, templates\nREDACTION: learner identity and lab host details removed',
    methodology: [
      { title: 'Map learning outcomes', detail: 'Organized the material from security fundamentals to applied testing and response so each chapter has a clear purpose.' },
      { title: 'Pair theory with practice', detail: 'Added Kali Linux labs, command-line exercises, quizzes, and case studies to make concepts observable.' },
      { title: 'Audit for professional relevance', detail: 'Cross-checked terminology and coverage against Security+, CISSP, SSCP, GSEC, NIST, MITRE, ISO, OWASP, and PCI DSS domains.' },
    ],
    results: [
      { value: '9', label: 'chapters', detail: 'A complete progression from fundamentals to operational security.' },
      { value: '7', label: 'case studies', detail: 'Real incidents make attack paths and defensive lessons concrete.' },
      { value: '5', label: 'framework guides', detail: 'Industry references connect the curriculum to workplace practice.' },
    ],
    contribution: [
      'Authored and maintained the curriculum repository and its learning progression.',
      'Designed the chapter, lab, quiz, case-study, and policy-template formats.',
      'Researched and translated security frameworks into practical learner guidance.',
      'Kept the material version-controlled, openly accessible, and aligned to certification domains.',
    ],
  },
};
