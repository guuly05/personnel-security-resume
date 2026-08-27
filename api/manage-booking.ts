import { BOOKING_CONFIG } from '../src/booking/config.js';
import { buildSlotWindows, getDayWindow, isBookingWeekday, isSlotTooSoon, parseSlotString } from '../src/booking/time.js';
import { getCalendarId, getGoogleCalendarClient } from './calendar.js';
import { sendBookingConfirmation } from './booking-email.js';
import { BookingRecord, findBookingByToken, updateBooking } from './booking-store.js';

function publicBooking(record: BookingRecord) {
  return {
    status: record.status,
    date: record.date,
    time: record.time,
    endTime: record.endIso,
    timezone: BOOKING_CONFIG.timezone,
    meetLink: record.meetLink,
    calendarLink: record.calendarLink,
  };
}

function validDateTime(date: unknown, time: unknown): boolean {
  return typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
    && typeof time === 'string' && /^\d{2}:\d{2}$/.test(time);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  const token = req.method === 'GET' ? req.query?.token : req.body?.token;
  if (typeof token !== 'string' || token.length < 40) {
    return res.status(400).json({ error: 'A valid booking management token is required.' });
  }

  let record: BookingRecord | null;
  try {
    record = await findBookingByToken(token);
  } catch (error) {
    console.error('Booking lookup error:', error);
    return res.status(503).json({ error: 'Booking management is temporarily unavailable.' });
  }
  if (!record) return res.status(404).json({ error: 'Booking not found or management link has expired.' });

  if (req.method === 'GET') return res.status(200).json({ ok: true, booking: publicBooking(record) });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const action = req.body?.action;
  if (action === 'cancel') {
    if (record.status === 'canceled') return res.status(200).json({ ok: true, booking: publicBooking(record) });
    try {
      const calendar = await getGoogleCalendarClient();
      await calendar.events.delete({ calendarId: getCalendarId(), eventId: record.eventId, sendUpdates: 'all' });
      await updateBooking({ ...record, status: 'canceled' });
      return res.status(200).json({ ok: true, booking: publicBooking({ ...record, status: 'canceled' }) });
    } catch (error) {
      console.error('Booking cancellation error:', error);
      return res.status(500).json({ error: 'Unable to cancel the booking right now.' });
    }
  }

  if (action !== 'reschedule') return res.status(400).json({ error: 'Choose cancel or reschedule.' });
  if (record.status === 'canceled') return res.status(409).json({ error: 'This booking has already been canceled.' });

  const { date: requestedDate, time: requestedTime } = req.body ?? {};
  if (!validDateTime(requestedDate, requestedTime)) return res.status(400).json({ error: 'Choose a valid date and time.' });
  const date = requestedDate as string;
  const time = requestedTime as string;

  const slotStart = parseSlotString(date, time);
  const slotEnd = new Date(slotStart.getTime() + BOOKING_CONFIG.slotMinutes * 60 * 1000);
  const allowedSlot = buildSlotWindows(slotStart).find((slot) => slot.start.getTime() === slotStart.getTime());
  if (!allowedSlot || !isBookingWeekday(slotStart) || isSlotTooSoon(slotStart)) {
    return res.status(400).json({ error: 'That slot is no longer available.' });
  }

  try {
    const calendar = await getGoogleCalendarClient();
    const calendarId = getCalendarId();
    const { start, end } = getDayWindow(slotStart);
    const busy = await calendar.freebusy.query({
      requestBody: { timeMin: start.toISOString(), timeMax: end.toISOString(), items: [{ id: calendarId }] },
    });
    const busyBlocks = busy.data.calendars?.[calendarId]?.busy ?? [];
    const stillFree = !busyBlocks.some((block: { start?: string; end?: string }) => {
      if (!block.start || !block.end) return false;
      const busyStart = new Date(block.start);
      const busyEnd = new Date(block.end);
      const isCurrentBooking = busyStart.toISOString() === record!.startIso && busyEnd.toISOString() === record!.endIso;
      return !isCurrentBooking && slotStart < busyEnd && slotEnd > busyStart;
    });
    if (!stillFree) return res.status(409).json({ error: 'That time slot is already booked. Please choose another.' });

    await calendar.events.update({
      calendarId,
      eventId: record.eventId,
      sendUpdates: 'all',
      requestBody: {
        start: { dateTime: slotStart.toISOString(), timeZone: BOOKING_CONFIG.timezone },
        end: { dateTime: slotEnd.toISOString(), timeZone: BOOKING_CONFIG.timezone },
      },
    });

    const updated = { ...record, date, time, startIso: slotStart.toISOString(), endIso: slotEnd.toISOString() };
    await updateBooking(updated);
    await sendBookingConfirmation(updated, token);
    return res.status(200).json({ ok: true, booking: publicBooking(updated) });
  } catch (error) {
    console.error('Booking reschedule error:', error);
    return res.status(500).json({ error: 'Unable to reschedule the booking right now.' });
  }
}
