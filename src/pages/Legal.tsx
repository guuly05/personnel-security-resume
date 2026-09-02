import type { ReactNode } from 'react';

type LegalKind = 'privacy' | 'terms';

const legalContent = {
  privacy: {
    title: 'Privacy Policy',
    eyebrow: 'Privacy',
    intro:
      'This Privacy Policy explains how this website collects, uses, stores, and protects information when you visit or contact us.',
    sections: [
      {
        heading: 'Information we collect',
        body:
          'We may collect information you provide directly, such as your name, email address, and message content when you use our contact form. We may also collect standard technical information such as browser type, device information, IP address, referral pages, and usage data for security, analytics, and site functionality.',
      },
      {
        heading: 'How we use information',
        body:
          'We use the information we collect to respond to inquiries, improve the website, understand how visitors use the site, prevent abuse, maintain security, and provide a better user experience.',
      },
      {
        heading: 'Cookies and analytics',
        body:
          'This site may use cookies or similar tracking technologies to remember preferences and measure traffic. If analytics or third-party services are enabled, they may collect limited usage data in accordance with their own policies.',
      },
      {
        heading: 'Third-party services',
        body:
          'Some features may rely on third-party platforms for hosting, email delivery, analytics, or other services. Those providers may process information under their own privacy practices, and we encourage you to review their policies when relevant.',
      },
      {
        heading: 'Data retention',
        body:
          'We keep personal information only as long as needed to fulfill the purpose for which it was collected, comply with legal obligations, or resolve disputes. We take reasonable steps to store data securely and limit access to authorized personnel.',
      },
      {
        heading: 'Your choices',
        body:
          'You can choose not to provide some information, though that may limit certain features. You may also opt out of cookies in your browser settings where supported.',
      },
      {
        heading: 'Contact',
        body:
          'If you have questions about this Privacy Policy or how your information is handled, please contact the site owner using the contact form or the contact details listed on the website.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    eyebrow: 'Terms',
    intro:
      'These Terms of Service govern your use of this website and any related services offered through it.',
    sections: [
      {
        heading: 'Acceptance of terms',
        body:
          'By visiting or using this website, you agree to these Terms of Service and to any applicable local laws and regulations. If you do not agree, you should not use the site.',
      },
      {
        heading: 'Website use',
        body:
          'You agree to use this website for lawful purposes only. You may not attempt to interfere with the integrity, security, or performance of the site, including by uploading harmful content, exploiting vulnerabilities, or disrupting services.',
      },
      {
        heading: 'Content and information',
        body:
          'The content provided on this site is for general informational and professional purposes only. While we aim to keep information accurate and up to date, we do not guarantee that all content is complete, current, or error-free.',
      },
      {
        heading: 'Intellectual property',
        body:
          'Unless otherwise stated, the website content, layout, branding, text, and design are the property of the site owner and may not be copied, reproduced, or distributed without permission.',
      },
      {
        heading: 'Third-party links',
        body:
          'This site may include links to external websites or services. We are not responsible for the content, privacy practices, or availability of those third-party sites.',
      },
      {
        heading: 'Limitation of liability',
        body:
          'To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the website or reliance on its content.',
      },
      {
        heading: 'Changes to terms',
        body:
          'We may update these Terms of Service from time to time. Continued use of the website after changes are posted means you accept the updated terms.',
      },
      {
        heading: 'Contact',
        body:
          'If you have questions about these Terms of Service, please use the contact form or the contact details provided on the website.',
      },
    ],
  },
} as const;

function SectionBlock({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="mb-3 text-lg font-bold text-[var(--color-text)]">{heading}</h2>
      <p className="text-sm leading-7 text-[var(--color-text-muted)]">{body}</p>
    </div>
  );
}

function LegalPage({ kind }: { kind: LegalKind }) {
  const content = legalContent[kind];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <div className="surface-card p-6 sm:p-8 lg:p-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="eyebrow">{content.eyebrow}</span>
        </div>

        <h1 className="mb-4 text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">
          {content.title}
        </h1>
        <p className="mb-8 max-w-3xl text-base leading-7 text-[var(--color-text-muted)]">{content.intro}</p>

        <div className="space-y-4">
          {content.sections.map((section) => (
            <SectionBlock key={section.heading} heading={section.heading} body={section.body} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LegalPage;
