import { Resend } from 'resend';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 3);
const RATE_LIMIT_WINDOW_MS = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000);
const MIN_SUBMIT_TIME_MS = Number(process.env.CONTACT_MIN_SUBMIT_TIME_MS ?? 4500);
const MAX_REQUEST_BYTES = Number(process.env.CONTACT_MAX_REQUEST_BYTES ?? 12 * 1024);
const MAX_NAME_LENGTH = Number(process.env.CONTACT_MAX_NAME_LENGTH ?? 100);
const MAX_EMAIL_LENGTH = Number(process.env.CONTACT_MAX_EMAIL_LENGTH ?? 254);
const MAX_MESSAGE_LENGTH = Number(process.env.CONTACT_MAX_MESSAGE_LENGTH ?? 4000);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getRequestIp(req: any): string {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }

  if (Array.isArray(forwardedFor) && forwardedFor[0]) {
    return forwardedFor[0].trim();
  }

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }

  return 'unknown';
}

function getRequestOrigin(req: any): string | null {
  const origin = req.headers.origin;
  if (typeof origin === 'string' && origin.trim()) {
    return origin.trim();
  }

  const referer = req.headers.referer;
  if (typeof referer === 'string' && referer.trim()) {
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }

  return null;
}

function normalizeOrigin(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed).origin;
  } catch {
    try {
      return new URL(`https://${trimmed}`).origin;
    } catch {
      return null;
    }
  }
}

function getAllowedOrigins(req: any): string[] {
  const origins = new Set<string>();

  const addOrigin = (value: string | undefined | null) => {
    if (!value) return;
    const normalized = normalizeOrigin(value);
    if (normalized) origins.add(normalized);
  };

  const configured = process.env.CONTACT_ALLOWED_ORIGIN;
  if (configured) {
    configured.split(',').forEach((value) => addOrigin(value));
  }

  addOrigin(process.env.APP_URL);
  addOrigin(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  const host = req.headers.host;
  if (typeof host === 'string' && host.trim()) {
    addOrigin(`https://${host}`);
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      addOrigin(`http://${host}`);
    }
  }

  return [...origins];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function getRequestBodyBytes(req: any): number | null {
  const contentLength = req.headers['content-length'];
  if (typeof contentLength !== 'string' || !contentLength.trim()) {
    return null;
  }

  const parsed = Number(contentLength);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function isValidEmail(value: string): boolean {
  if (value.length > MAX_EMAIL_LENGTH) return false;
  return EMAIL_PATTERN.test(value);
}

function cleanupRateLimitStore(now: number): void {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

function isRateLimited(ip: string, now: number): boolean {
  cleanupRateLimitStore(now);

  const entry = rateLimitStore.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  rateLimitStore.set(ip, entry);
  return false;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const now = Date.now();
  const ip = getRequestIp(req);

  const bodyBytes = getRequestBodyBytes(req);
  if (bodyBytes !== null && bodyBytes > MAX_REQUEST_BYTES) {
    return res.status(413).json({ error: 'Request body is too large.' });
  }

  if (isRateLimited(ip, now)) {
    return res.status(429).json({ error: 'Too many submissions. Please wait a bit and try again.' });
  }

  const requestOrigin = getRequestOrigin(req);

  const allowedOrigins = getAllowedOrigins(req);
  if (requestOrigin && allowedOrigins.length > 0 && !allowedOrigins.includes(requestOrigin)) {
    return res.status(403).json({ error: 'Invalid origin.' });
  }

  const body = req.body ?? {};
  const name = normalizeString(body.name);
  const email = normalizeString(body.email);
  const message = normalizeString(body.message);
  const website = normalizeString(body.website);
  const turnstileResponse = normalizeString(body['cf-turnstile-response']);
  const submittedAt = Number(body.submittedAt);

  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  if (name.length > MAX_NAME_LENGTH) {
    return res.status(400).json({ error: 'Name is too long.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: 'Message is too long.' });
  }

  if (!turnstileResponse) {
    return res.status(400).json({ error: 'Please complete the Turnstile check before sending.' });
  }

  if (!Number.isFinite(submittedAt) || now - submittedAt < MIN_SUBMIT_TIME_MS) {
    return res.status(400).json({ error: 'Please take a moment before submitting again.' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactToEmail = process.env.CONTACT_TO_EMAIL ?? 'guuleedmaxamuud40@gmail.com';
  const contactFromEmail = process.env.CONTACT_FROM_EMAIL ?? 'Guuleed Portfolio <onboarding@resend.dev>';
  const turnstileSecret = process.env.TURNSTILE_SECRET;

  if (!resendApiKey) {
    return res.status(500).json({ error: 'Server email is not configured yet.' });
  }

  if (!turnstileSecret) {
    return res.status(500).json({ error: 'Turnstile is not configured yet.' });
  }

  const verifyBody = new URLSearchParams({
    secret: turnstileSecret,
    response: turnstileResponse,
    remoteip: ip,
  });

  let turnstileResult: { success?: boolean } | null = null;

  try {
    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: verifyBody,
    });

    if (!verifyResponse.ok) {
      return res.status(403).json({ error: 'Turnstile verification failed.' });
    }

    turnstileResult = (await verifyResponse.json()) as { success?: boolean };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return res.status(403).json({ error: 'Turnstile verification failed.' });
  }

  if (!turnstileResult?.success) {
    return res.status(403).json({ error: 'Turnstile verification failed.' });
  }

  const resend = new Resend(resendApiKey);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  try {
    const result = await resend.emails.send({
      from: contactFromEmail,
      to: [contactToEmail],
      subject: `New portfolio contact message from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New message from your portfolio contact form</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true, id: result.data?.id ?? null });
  } catch (error) {
    console.error('Resend contact form error:', error);
    return res.status(500).json({
      error:
        'Unable to send the message. Resend still requires a verified sender domain for external delivery, so this will work once you add and verify one.',
    });
  }
}
