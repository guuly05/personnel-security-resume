export interface SystemsEvidence {
  projectId: string;
  constraint: string;
  decision: string;
  tradeoff: string;
}

export interface SystemsPractice {
  id: string;
  title: string;
  summary: string;
  pattern: string;
  evidence: SystemsEvidence[];
}

/**
 * Cross-project editorial connections. Each entry summarizes documented
 * architecture or decisions from the linked project's full case study.
 */
export const SYSTEMS_PRACTICES: SystemsPractice[] = [
  {
    id: 'trust-boundaries',
    title: 'Make trust boundaries explicit',
    summary: 'Sensitive actions pass through the layer that can verify authority, credentials, and request intent.',
    pattern: 'The boundary changes with the risk: server functions protect external workflows, provider routes protect credentials, and data rules enforce ownership.',
    evidence: [
      {
        projectId: 'samaale-general-trading',
        constraint: 'Public buyer inquiries need bot protection without exposing email provider credentials.',
        decision: 'A Cloudflare Worker validates fields, verifies Turnstile, applies a KV rate limit, and then sends through Resend.',
        tradeoff: 'The contact boundary is explicit and protected; delivery depends on the Worker, KV, Turnstile, and email provider.',
      },
      {
        projectId: 'portfolio-platform',
        constraint: 'Calendar booking and contact workflows call external services and handle visitor data.',
        decision: 'Separate server functions validate requests and keep provider credentials and booking tokens server-side.',
        tradeoff: 'The workflows have clear permissions and validation, while calendar and email operations depend on external services.',
      },
      {
        projectId: 'gabay-keeper',
        constraint: 'Private archive entries must remain scoped to the signed-in owner.',
        decision: 'Firestore Security Rules check ownership at the data layer before allowing each document read or write.',
        tradeoff: 'Authorization does not rely on hidden UI controls; rules must stay aligned with the document model and sign-in state.',
      },
      {
        projectId: 'cyber-dashboard',
        constraint: 'Analyst lookups need third-party threat data without shipping API keys to the browser.',
        decision: 'Server routes validate lookup requests and proxy only the needed provider response to the dashboard.',
        tradeoff: 'Credentials stay behind the server boundary, with an additional server hop and provider quota dependency.',
      },
    ],
  },
  {
    id: 'local-data',
    title: 'Keep data close to its work',
    summary: 'Processing location is chosen around the sensitivity of the input and the user’s need for connectivity.',
    pattern: 'Local processing reduces unnecessary data movement. Any later cloud storage is a separate, visible user action with its own access controls.',
    evidence: [
      {
        projectId: 'purpleprint',
        constraint: 'Markdown documents should remain private and usable without an internet connection.',
        decision: 'The parser, preview, PDF layout, and export run on the Android device; the app does not request network access.',
        tradeoff: 'Documents stay local and the workflow works offline, while parser and pagination edge cases belong to the app.',
      },
      {
        projectId: 'gabay-keeper',
        constraint: 'Printed poem images should not need to leave the browser for text recognition.',
        decision: 'Tesseract.js runs OCR locally, lets the reader review the result, and saves only after an authenticated action.',
        tradeoff: 'The source image stays local during OCR; saved archive entries still rely on Firebase identity and storage.',
      },
    ],
  },
  {
    id: 'accessible-systems',
    title: 'Adapt the interface to the person',
    summary: 'Interaction and layout respond to device, input method, and motion preferences while preserving the task itself.',
    pattern: 'Keep the underlying content and workflow consistent; adapt how people reach and move through it.',
    evidence: [
      {
        projectId: 'samaale-general-trading',
        constraint: 'Catalogue and news dialogs must remain usable across keyboard, touch, and nested modal interactions.',
        decision: 'The interface uses semantic controls, keyboard handling, focus restoration, and a custom focus trap for nested dialogs.',
        tradeoff: 'The interaction remains within the current page; modal focus and dismissal behavior require deliberate management.',
      },
      {
        projectId: 'purpleprint',
        constraint: 'Markdown editing needs to work on both compact phones and larger tablets.',
        decision: 'Phones use editor/preview tabs, while tablets show the source and preview side by side.',
        tradeoff: 'The document model stays the same, with navigation affordances tailored to available screen space.',
      },
      {
        projectId: 'portfolio-platform',
        constraint: 'Animated page changes and interactive controls need to accommodate different motion and input needs.',
        decision: 'The site combines reduced-motion-aware transitions with semantic landmarks and managed keyboard focus.',
        tradeoff: 'Motion remains part of the visual language, with reduced or removed movement when a visitor requests it.',
      },
    ],
  },
  {
    id: 'delivery-models',
    title: 'Match delivery to the workload',
    summary: 'Build-time, browser-time, and server-time responsibilities are separated according to what each task needs.',
    pattern: 'Public content can be prepared ahead of time; interactive or sensitive operations run where their state and permissions can be managed.',
    evidence: [
      {
        projectId: 'samaale-general-trading',
        constraint: 'A broad bilingual company site needs fast public pages and a protected inquiry workflow.',
        decision: 'The site prerenders route content and lazy-loads sections, while contact delivery runs through a separate Cloudflare Worker.',
        tradeoff: 'Public content benefits from static delivery; contact handling has its own runtime and provider dependencies.',
      },
      {
        projectId: 'portfolio-platform',
        constraint: 'Direct links and search metadata must work alongside live booking and contact actions.',
        decision: 'The build prerenders public routes, feeds, and metadata; server functions own booking and contact workflows.',
        tradeoff: 'Public pages are available immediately, while interactive actions still need browser code and external services.',
      },
    ],
  },
];
