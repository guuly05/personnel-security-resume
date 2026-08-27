export interface ProjectScreenshot {
  title: string;
  description: string;
}

export interface ArchitectureLayer {
  label: string;
  items: string[];
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

export interface ProjectDetail {
  screenshots: ProjectScreenshot[];
  architectureSummary: string;
  architecture: ArchitectureLayer[];
  reportIntro: string;
  reportRows: ReportRow[];
  reportExcerpt: string;
  methodology: TestStep[];
  results: { value: string; label: string; detail: string }[];
  contribution: string[];
}

/**
 * Portfolio evidence is intentionally sanitized: no private hosts, tokens,
 * client data, or exploitable findings are included in the public case studies.
 */
export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  'cyber-dashboard': {
    screenshots: [
      { title: 'Threat feed workspace', description: 'Live indicators, risk scores, and investigation shortcuts in one analyst view.' },
      { title: 'Investigation surface', description: 'The same workflow keeps IP, domain, and CVE context close to the analyst.' },
    ],
    architectureSummary: 'A server-mediated lookup flow keeps third-party credentials away from the browser while the client focuses on investigation and visualization.',
    architecture: [
      { label: 'Analyst', items: ['Next.js UI', 'TanStack Query cache', 'Recharts visualizations'] },
      { label: 'Application', items: ['Server-side API routes', 'Input validation', 'Security headers'] },
      { label: 'Intelligence', items: ['AbuseIPDB', 'CIRCL CVE', 'VirusTotal / OTX / Shodan links'] },
    ],
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
    screenshots: [
      { title: 'Archive workspace', description: 'Structured poetry records with genre, alphabet, notes, and ownership context.' },
      { title: 'Preservation workflow', description: 'OCR and visual export support a private path from printed page to shareable artifact.' },
    ],
    architectureSummary: 'A client-led archive uses Firebase as the identity and document layer while OCR and card generation stay inside the user’s browser.',
    architecture: [
      { label: 'Reader', items: ['React interface', 'Search and filters', 'Dark-mode reading'] },
      { label: 'User-owned data', items: ['Firebase Auth', 'Firestore rules', 'Per-user documents'] },
      { label: 'On-device tools', items: ['Tesseract.js OCR', 'html-to-image', 'Visual poem cards'] },
    ],
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
    screenshots: [
      { title: 'Split editor and preview', description: 'Markdown source and rendered document stay visible together on larger screens.' },
      { title: 'Print-ready workflow', description: 'The document moves from local parsing to Android’s native PDF and print surfaces.' },
    ],
    architectureSummary: 'PurplePrint has no network dependency: Markdown is parsed into an AST and laid out into a PDF entirely on the Android device.',
    architecture: [
      { label: 'Editor', items: ['Jetpack Compose', 'Material 3', 'Adaptive phone/tablet UI'] },
      { label: 'Document engine', items: ['Block parser', 'Inline parser', 'AST renderer'] },
      { label: 'Device output', items: ['PdfDocument', 'PrintManager', 'Android print dialog'] },
    ],
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
    screenshots: [
      { title: 'Curriculum map', description: 'A chapter-based learning path connects fundamentals, labs, frameworks, and case studies.' },
      { title: 'Lab evidence format', description: 'Exercises and quizzes turn each security concept into a repeatable practice loop.' },
    ],
    architectureSummary: 'The course repository is structured as a learning system: concepts establish context, labs create evidence, and frameworks connect practice to industry language.',
    architecture: [
      { label: 'Foundations', items: ['CIA triad', 'Risk and governance', 'Identity and access'] },
      { label: 'Practice', items: ['Kali Linux labs', 'Nmap / Wireshark', 'Metasploit exercises'] },
      { label: 'Evidence', items: ['Case studies', 'Policy templates', 'Chapter quizzes'] },
    ],
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

