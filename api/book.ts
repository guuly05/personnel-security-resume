import { BOOKING_CONFIG, BOOKING_EMAIL_PATTERN } from '../src/booking/config';
import { getCalendarId, getGoogleCalendarClient } from './calendar';
import { enforceRateLimit } from './rate-limit';
import { buildSlotWindows, getDayWindow, isBookingWeekday, isSlotTooSoon, parseSlotString } from '../src/booking/time';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (enforceRateLimit(req)) {
    return res.status(429).json({ error: 'Too many booking attempts. Please wait and try again.' });
  }

  const { date, time, email, notes, honeypot } = req.body ?? {};
  if (typeof honeypot === 'string' && honeypot.trim()) return res.status(200).json({ ok: true });

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
    const calendar = getGoogleCalendarClient();
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
