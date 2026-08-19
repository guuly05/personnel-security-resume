import { BOOKING_CONFIG, BOOKING_EMAIL_PATTERN } from '../src/booking/config.js';
import { getCalendarId, getGoogleCalendarClient } from './calendar.js';
import { enforceBookRateLimit } from './rate-limit.js';
import { buildSlotWindows, getDayWindow, isBookingWeekday, isSlotTooSoon, parseSlotString } from '../src/booking/time.js';

function getAllowedOrigins(req: any): string[] {
  const origins = new Set<string>();
  const addOrigin = (value: string | undefined | null) => {
    if (!value) return;
    try { origins.add(new URL(value.trim()).origin); } catch { /* ignore invalid */ }
  };
  addOrigin(process.env.APP_URL);
  addOrigin(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  const host = req.headers.host;
  if (typeof host === 'string' && host.trim()) {
    addOrigin(`https://${host}`);
    if (host.includes('localhost') || host.includes('127.0.0.1')) addOrigin(`http://${host}`);
  }
  return [...origins];
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Origin check — block direct script/curl callers that aren't from the site
  const requestOrigin = req.headers.origin ?? req.headers.referer;
  const allowedOrigins = getAllowedOrigins(req);
  if (requestOrigin && allowedOrigins.length > 0) {
    let originHost: string | null = null;
    try { originHost = new URL(requestOrigin).origin; } catch { /* ignore */ }
    if (originHost && !allowedOrigins.includes(originHost)) {
      return res.status(403).json({ error: 'Forbidden.' });
    }
  }

  const rateLimit = enforceBookRateLimit(req);
  if (rateLimit.limited) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return res.status(429).json({ error: 'Too many booking attempts. Please wait and try again.' });
  }

  const { date, time, email, notes, honeypot, 'cf-turnstile-response': turnstileResponse } = req.body ?? {};
  if (typeof honeypot === 'string' && honeypot.trim()) return res.status(200).json({ ok: true });

  if (!turnstileResponse) {
    return res.status(400).json({ error: 'Please complete the Turnstile check before booking.' });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET;
  if (!turnstileSecret) {
    return res.status(500).json({ error: 'Turnstile is not configured on the server yet.' });
  }

  // Get IP helper for verification
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' && forwarded.trim()
    ? forwarded.split(',')[0].trim()
    : req.headers['x-real-ip'] || 'unknown';

  try {
    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: turnstileResponse,
        remoteip: ip,
      }),
    });

    if (!verifyResponse.ok) {
      return res.status(403).json({ error: 'Turnstile verification failed.' });
    }

    const turnstileResult = (await verifyResponse.json()) as { success?: boolean };
    if (!turnstileResult?.success) {
      return res.status(403).json({ error: 'Turnstile verification failed.' });
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return res.status(403).json({ error: 'Turnstile verification failed.' });
  }

  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date.' });
  }
  if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) {
    return res.status(400).json({ error: 'Invalid time.' });
  }
  if (typeof email !== 'string' || !BOOKING_EMAIL_PATTERN.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (typeof notes !== 'string' || notes.trim().length === 0) {
    return res.status(400).json({ error: 'Please add a short note.' });
  }
  if (notes.length > BOOKING_CONFIG.maxNotesLength) {
    return res.status(400).json({ error: 'Your note is too long.' });
  }

  try {
    const calendar = await getGoogleCalendarClient();
    const calendarId = getCalendarId();
    const slotStart = parseSlotString(date, time);
    const slotEnd = new Date(slotStart.getTime() + BOOKING_CONFIG.slotMinutes * 60 * 1000);
    const allowedSlot = buildSlotWindows(slotStart).find((slot) => slot.start.getTime() === slotStart.getTime());

    if (!allowedSlot || !isBookingWeekday(slotStart) || isSlotTooSoon(slotStart)) {
      return res.status(400).json({ error: 'That slot is no longer available.' });
    }

    const { start, end } = getDayWindow(slotStart);
    const busy = await calendar.freebusy.query({
      requestBody: {
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        items: [{ id: calendarId }],
      },
    });

    const busyBlocks = busy.data.calendars?.[calendarId]?.busy ?? [];
    const stillFree = !busyBlocks.some((block) => {
      if (!block.start || !block.end) return false;
      const busyStart = new Date(block.start);
      const busyEnd = new Date(block.end);
      return !Number.isNaN(busyStart.getTime()) && !Number.isNaN(busyEnd.getTime()) && slotStart < busyEnd && slotEnd > busyStart;
    });
    if (!stillFree) {
      return res.status(409).json({ error: 'That time slot was just booked by someone else. Please choose another.' });
    }

    const event = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      requestBody: {
        summary: `Portfolio call with ${email.trim()}`,
        description: notes.trim(),
        start: {
          dateTime: slotStart.toISOString(),
          timeZone: BOOKING_CONFIG.timezone,
        },
        end: {
          dateTime: slotEnd.toISOString(),
          timeZone: BOOKING_CONFIG.timezone,
        },
        attendees: [{ email: email.trim() }],
        conferenceData: {
          createRequest: {
            requestId: `${date}-${time}-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    return res.status(200).json({
      ok: true,
      eventId: event.data.id,
      meetLink: event.data.hangoutLink ?? event.data.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === 'video')?.uri ?? null,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ error: 'Unable to create the booking right now.' });
  }
}
