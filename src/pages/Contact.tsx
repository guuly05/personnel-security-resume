import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PERSONAL_INFO } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

type TurnstileWindow = Window & {
  turnstile?: {
    reset: () => void;
  };
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

  const resetTurnstile = () => {
    const globalWindow = window as TurnstileWindow;
    globalWindow.turnstile?.reset();
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
    <div className="bento-grid">
      <Helmet>
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        />
      </Helmet>

      <div className="lg:col-span-2 lg:row-span-3 glass-card p-10">
        <h3 className="mb-8 flex items-center gap-3 text-2xl font-bold">
          <Icon name="message-square" className="text-brand-cyan" />
          Get In Touch
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="hidden">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="space-y-2">
            <label className="pl-1 font-mono text-[10px] uppercase tracking-widest text-brand-cyan">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm transition-all focus:border-brand-cyan focus:outline-none"
              placeholder="John Doe"
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <label className="pl-1 font-mono text-[10px] uppercase tracking-widest text-brand-cyan">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm transition-all focus:border-brand-cyan focus:outline-none"
              placeholder="john@example.com"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label className="pl-1 font-mono text-[10px] uppercase tracking-widest text-brand-cyan">
              Your Message
            </label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(event) => setFormData({ ...formData, message: event.target.value })}
              className="h-40 w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-sm transition-all focus:border-brand-cyan focus:outline-none"
              placeholder="How can I help you today?"
              autoComplete="off"
            />
          </div>

          <div
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-action="turnstile-spin-v2"
            data-theme="auto"
          />

          {status === 'success' && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              Your message was sent successfully. I’ll reply as soon as I can.
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
              {errorMessage || 'Something went wrong while sending your message.'}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-cyan py-4 font-bold text-brand-bg shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all hover:bg-cyan-400 active:scale-95 disabled:opacity-50"
          >
            {status === 'sending' ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-bg/30 border-t-brand-bg" />
            ) : (
              <>
                <Icon name="message-square" size={18} />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>

      <div className="glass-card relative flex flex-col justify-between overflow-hidden p-10 lg:col-span-2">
        <div className="space-y-8">
          <div className="group flex items-center gap-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-brand-cyan glass-card transition-transform group-hover:scale-110">
              <Icon name="mail" size={24} />
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">Email</p>
              <p className="text-sm font-bold">{PERSONAL_INFO.email}</p>
            </div>
          </div>

          <div className="group flex items-center gap-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-brand-cyan glass-card transition-transform group-hover:scale-110">
              <Icon name="phone" size={24} />
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">Phone</p>
              <p className="text-sm font-bold">{PERSONAL_INFO.phone}</p>
            </div>
          </div>

          <div className="group flex items-center gap-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-brand-cyan glass-card transition-transform group-hover:scale-110">
              <Icon name="linkedin" size={24} />
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">LinkedIn</p>
              <p className="truncate text-sm font-bold">/in/guuleed-aw-abdi</p>
            </div>
          </div>
        </div>

        <div className="group relative mt-8 h-48 w-full overflow-hidden rounded-3xl border-2 border-dashed border-white/5 glass-card opacity-60 transition-opacity hover:opacity-100">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center grayscale transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-brand-bg/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-bg/80 px-4 py-2">
              <Icon name="map-pin" className="text-brand-cyan" size={14} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white">
                Hargeisa, Somaliland
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card flex items-center justify-center gap-8 bg-gradient-to-br from-brand-cyan/5 to-brand-purple/5 p-8 lg:col-span-2">
        <a
          href={PERSONAL_INFO.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2"
        >
          <Icon name="github" className="text-slate-400 transition-colors group-hover:text-brand-cyan" size={32} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">GitHub</span>
        </a>
        <div className="h-12 w-px bg-white/10" />
        <a
          href={PERSONAL_INFO.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2"
        >
          <Icon name="linkedin" className="text-slate-400 transition-colors group-hover:text-brand-cyan" size={32} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">LinkedIn</span>
        </a>
      </div>

      <div className="surface-card p-6 md:p-8 lg:col-span-4">
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
            className="inline-flex items-center gap-2 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
