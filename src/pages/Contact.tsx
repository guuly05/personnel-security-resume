import React, { useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

type TurnstileWindow = Window & {
  turnstile?: {
    render: (container: HTMLElement, options: Record<string, string>) => string;
    reset: (widgetId?: string) => void;
    remove: (widgetId: string) => void;
  };
  onloadTurnstileCallback?: () => void;
};

const MIN_FILL_TIME_MS = 4500;
const CONTACT_ERROR_MESSAGE = 'The message could not be sent right now. Please try again shortly.';
const TURNSTILE_SITE_KEY =
  ((import.meta as { env?: { VITE_TURNSTILE_SITE_KEY?: string } }).env?.VITE_TURNSTILE_SITE_KEY) ??
  '0x4AAAAAAEJeTjoANqG1MG63';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [pageLoadedAt] = useState(() => Date.now());
  const turnstileWidgetIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    const globalWindow = window as TurnstileWindow;
    const renderWidget = () => {
      const container = document.getElementById('contact-turnstile');
      if (globalWindow.turnstile && container && !turnstileWidgetIdRef.current) {
        try {
          turnstileWidgetIdRef.current = globalWindow.turnstile.render(container, {
            sitekey: TURNSTILE_SITE_KEY,
            theme: 'auto',
            action: 'turnstile-spin-v2',
          });
        } catch (e) {
          // Already rendered
        }
      }
    };

    globalWindow.onloadTurnstileCallback = renderWidget;
    if (!document.querySelector('script[data-turnstile]')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback';
      script.async = true;
      script.defer = true;
      script.dataset.turnstile = 'true';
      document.head.appendChild(script);
    } else {
      renderWidget();
    }

    return () => {
      if (globalWindow.turnstile && turnstileWidgetIdRef.current) {
        try {
          globalWindow.turnstile.remove(turnstileWidgetIdRef.current);
        } catch (e) {
          // Ignore
        }
      }
      turnstileWidgetIdRef.current = null;
    };
  }, []);

  const resetTurnstile = () => {
    const globalWindow = window as TurnstileWindow;
    if (globalWindow.turnstile && turnstileWidgetIdRef.current) {
      globalWindow.turnstile.reset(turnstileWidgetIdRef.current);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formDataEntries = new FormData(form);
    const honeypot = formDataEntries.get('website');
    const turnstileToken = formDataEntries.get('cf-turnstile-response');
    const elapsed = Date.now() - pageLoadedAt;

    if (typeof honeypot === 'string' && honeypot.trim()) {
      setStatus('success');
      resetTurnstile();
      return;
    }

    if (elapsed < MIN_FILL_TIME_MS) {
      setStatus('error');
      setErrorMessage('Please take a moment to fill out the form before submitting again.');
      resetTurnstile();
      return;
    }

    if (typeof turnstileToken !== 'string' || !turnstileToken.trim()) {
      setStatus('error');
      setErrorMessage('Please complete the Turnstile check before sending your message.');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          website: '',
          submittedAt: pageLoadedAt,
          'cf-turnstile-response': turnstileToken,
        }),
      });

      await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(CONTACT_ERROR_MESSAGE);
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : CONTACT_ERROR_MESSAGE);
    } finally {
      resetTurnstile();
    }
  };

  return (
    <div className="editorial-page contact-page bento-grid">
      <header className="contact-intro">
        <span className="landing-section-index">/ contact</span>
        <h1>Have a project or question?</h1>
        <p>Get in touch about a product idea, a frontend or backend build, delivery workflows, secure engineering, collaboration, or career opportunities.</p>
      </header>
      <div className="contact-form-panel lg:col-span-2 lg:row-span-3">
        <h2 className="contact-panel-heading">Send a message</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="hidden">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-name" className="pl-1 font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
              Full Name
            </label>
            <input
              type="text"
              id="contact-name"
              name="name"
              required
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none"
              placeholder="John Doe"
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-email" className="pl-1 font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
              Email Address
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              required
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none"
              placeholder="john@example.com"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-message" className="pl-1 font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
              Your Message
            </label>
            <textarea
              required
              id="contact-message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={(event) => setFormData({ ...formData, message: event.target.value })}
              className="h-40 w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none"
              placeholder="How can I help you today?"
              autoComplete="off"
            />
          </div>

          <div
            id="contact-turnstile"
          />

          {status === 'success' && (
            <div role="status" aria-live="polite" className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-4 text-sm text-[var(--accent)]">
              Your message was sent successfully. I’ll reply as soon as I can.
            </div>
          )}

          {status === 'error' && (
            <div role="alert" aria-live="assertive" className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
              {errorMessage || 'Something went wrong while sending your message.'}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-[var(--accent)] py-4 font-bold text-[var(--color-bg)] transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] active:translate-y-px disabled:opacity-50"
          >
            {status === 'sending' ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-bg)]/30 border-t-[var(--color-bg)]" />
            ) : (
              <>
                <Icon name="message-square" size={18} />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>

      <div className="contact-details lg:col-span-2">
        <span className="editorial-overline">Direct contact</span>
        <a href={`mailto:${PERSONAL_INFO.email}`}><span>Email</span><strong>{PERSONAL_INFO.email}</strong><Icon name="arrow-up-right" size={15} /></a>
        <a href={`tel:${PERSONAL_INFO.phone.replace(/\s/g, '')}`}><span>Phone</span><strong>{PERSONAL_INFO.phone}</strong><Icon name="arrow-up-right" size={15} /></a>
        <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><strong>/in/guuleed-aw-abdi</strong><Icon name="arrow-up-right" size={15} /></a>
        <div className="contact-location"><span>Based in</span><strong>Hargeisa, Somaliland</strong><small>Available for remote collaboration</small></div>
      </div>

      <div className="contact-socials lg:col-span-2">
        <a
          href={PERSONAL_INFO.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2"
        >
          <Icon name="github" className="text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--accent)]" size={32} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">GitHub</span>
        </a>
        <div className="h-12 w-px bg-white/10" />
        <a
          href={PERSONAL_INFO.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2"
        >
          <Icon name="linkedin" className="text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--accent)]" size={32} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">LinkedIn</span>
        </a>
      </div>

      <div className="contact-fallback lg:col-span-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-[var(--accent)]">
              Direct fallback
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
              If the form ever has trouble, you can still email me directly.
            </p>
          </div>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Icon name="mail" size={16} />
            Email me
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
