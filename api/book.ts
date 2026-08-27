import { BOOKING_CONFIG } from '../src/booking/config.js';
import { getCalendarId, getGoogleCalendarClient } from './calendar.js';
import { enforceBookRateLimit } from './rate-limit.js';
import { stableKey } from './durable-store.js';
import { claimIdempotencyKey, completeIdempotencyKey, createManageToken, releaseIdempotencyKey, saveBooking } from './booking-store.js';
import { sendBookingConfirmation } from './booking-email.js';
import { validateBookingInput } from './validation.js';
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

  const idempotencyKey = req.headers['idempotency-key'];
  if (typeof idempotencyKey !== 'string' || idempotencyKey.trim().length < 8 || idempotencyKey.length > 128) {
    return res.status(400).json({ error: 'A valid Idempotency-Key header is required.' });
  }

  const rateLimit = await enforceBookRateLimit(req);
  if (rateLimit.storageUnavailable) {
    return res.status(503).json({ error: 'Booking protection is temporarily unavailable. Please try again shortly.' });
  }
  if (rateLimit.limited) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return res.status(429).json({ error: 'Too many booking attempts. Please wait and try again.' });
  }

  const body = req.body ?? {};
  const { honeypot, 'cf-turnstile-response': turnstileResponse } = body;
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

  const validation = validateBookingInput(body);
  if (validation.ok === false) return res.status(400).json({ error: validation.error });
  const { date, time, email, notes } = validation.value;

  const slotStart = parseSlotString(date, time);
  const slotEnd = new Date(slotStart.getTime() + BOOKING_CONFIG.slotMinutes * 60 * 1000);
  const allowedSlot = buildSlotWindows(slotStart).find((slot) => slot.start.getTime() === slotStart.getTime());
  if (!allowedSlot || !isBookingWeekday(slotStart) || isSlotTooSoon(slotStart)) {
    return res.status(400).json({ error: 'That slot is no longer available.' });
  }

  const fingerprint = stableKey(JSON.stringify({ date, time, email: email.trim().toLowerCase(), notes: notes.trim() }));
  try {
    const existing = await claimIdempotencyKey(idempotencyKey.trim(), fingerprint);
    if (existing) {
      if (existing.fingerprint !== fingerprint) {
        return res.status(409).json({ error: 'This Idempotency-Key was already used for different booking details.' });
      }
      if (existing.state === 'complete' && existing.response) return res.status(200).json(existing.response);
      return res.status(409).json({ error: 'This booking request is already being processed. Please wait.' });
    }

    const { token: manageToken, hash: manageTokenHash } = createManageToken();
    const calendar = await getGoogleCalendarClient();
    const calendarId = getCalendarId();

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
      await releaseIdempotencyKey(idempotencyKey.trim());
      return res.status(409).json({ error: 'That time slot was just booked by someone else. Please choose another.' });
    }

    const event = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      requestBody: {
        summary: `Portfolio call with ${email}`,
        description: notes.trim(),
        start: {
          dateTime: slotStart.toISOString(),
          timeZone: BOOKING_CONFIG.timezone,
        },
        end: {
          dateTime: slotEnd.toISOString(),
          timeZone: BOOKING_CONFIG.timezone,
        },
        attendees: [{ email }],
        conferenceData: {
          createRequest: {
            requestId: `portfolio-${stableKey(idempotencyKey.trim())}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    if (!event.data.id) throw new Error('Google Calendar did not return an event id.');
    const meetLink = event.data.hangoutLink ?? event.data.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === 'video')?.uri ?? null;
    const calendarLink = event.data.htmlLink ?? null;
    const record = {
      eventId: event.data.id,
      email: email.trim(),
      date,
      time,
      startIso: slotStart.toISOString(),
      endIso: slotEnd.toISOString(),
      notes: notes.trim(),
      meetLink,
      calendarLink,
      manageTokenHash,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveBooking(record);
    const manageUrl = `${(process.env.APP_URL ?? '').replace(/\/$/, '')}/book?manage=${encodeURIComponent(manageToken)}`;
    const response = {
      ok: true,
      eventId: event.data.id,
      meetLink,
      calendarLink,
      manageUrl,
      confirmationEmailSent: await sendBookingConfirmation(record, manageToken),
    };
    await completeIdempotencyKey(idempotencyKey.trim(), fingerprint, response);
    return res.status(200).json(response);
  } catch (error) {
    await releaseIdempotencyKey(idempotencyKey.trim()).catch(() => undefined);
    console.error('Booking error:', error);
    return res.status(500).json({ error: 'Unable to create the booking right now.' });
  }
}
