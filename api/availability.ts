import { eachDayOfInterval, isSameMonth } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { getCalendarId, getGoogleCalendarClient } from './calendar.js';
import { enforceAvailabilityRateLimit } from './rate-limit.js';
import { validateAvailabilityQuery } from './validation.js';
import { BOOKING_CONFIG } from '../src/booking/config.js';
import {
  buildSlotWindows,
  formatDateKey,
  getDayWindow,
  getMonthWindow,
  isBookingWeekday,
  monthDaysWithAvailability,
  parseDayString,
  slotToResponse,
  subtractBusyBlocks,
} from '../src/booking/time.js';

const monthlyCache = new Map<string, { expiresAt: number; payload: unknown }>();

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rateLimit = await enforceAvailabilityRateLimit(req);
  if (rateLimit.storageUnavailable) {
    return res.status(503).json({ error: 'Booking protection is temporarily unavailable. Please try again shortly.' });
  }
  if (rateLimit.limited) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return res.status(429).json({ error: 'Too many requests. Please wait and try again.' });
  }

  const validation = validateAvailabilityQuery(req.query);
  if (validation.ok === false) return res.status(400).json({ error: validation.error });
  const { month = '', date = '' } = validation.value;

  try {
    const calendar = await getGoogleCalendarClient();
    const calendarId = getCalendarId();

    if (month) {
      const cached = monthlyCache.get(month);
      if (cached && cached.expiresAt > Date.now()) {
        return res.status(200).json(cached.payload);
      }

      const { start, end } = getMonthWindow(month);
      const busy = await calendar.freebusy.query({
        requestBody: {
          timeMin: start.toISOString(),
          timeMax: end.toISOString(),
          items: [{ id: calendarId }],
        },
      });

      const busyBlocks = busy.data.calendars?.[calendarId]?.busy ?? [];
      const monthDays = eachDayOfInterval({
        start: toZonedTime(start, BOOKING_CONFIG.timezone),
        end: toZonedTime(end, BOOKING_CONFIG.timezone),
      }).filter((day) => isSameMonth(day, toZonedTime(start, BOOKING_CONFIG.timezone)));

      const availabilityMap = new Map<string, ReturnType<typeof slotToResponse>[]>();
      for (const day of monthDays) {
        if (!isBookingWeekday(day)) continue;
        const daySlots = subtractBusyBlocks(buildSlotWindows(day), busyBlocks);
        if (daySlots.length) {
          availabilityMap.set(formatDateKey(day), daySlots.map(slotToResponse));
        }
      }

      const payload = {
        month,
        days: monthDaysWithAvailability(availabilityMap),
      };
      monthlyCache.set(month, { expiresAt: Date.now() + BOOKING_CONFIG.monthlyAvailabilityTtlSeconds * 1000, payload });
      return res.status(200).json(payload);
    }

    if (date) {
      const selectedDay = parseDayString(date);
      if (!isBookingWeekday(selectedDay)) {
        return res.status(200).json({ date, slots: [] });
      }

      const { start, end } = getDayWindow(selectedDay);
      const busy = await calendar.freebusy.query({
        requestBody: {
          timeMin: start.toISOString(),
          timeMax: end.toISOString(),
          items: [{ id: calendarId }],
        },
      });

      const busyBlocks = busy.data.calendars?.[calendarId]?.busy ?? [];
      const slots = subtractBusyBlocks(buildSlotWindows(selectedDay), busyBlocks).map(slotToResponse);
      return res.status(200).json({ date, slots });
    }

    return res.status(400).json({ error: 'Provide either month or date.' });
  } catch (error) {
    console.error('Availability error:', error);
    return res.status(500).json({ error: 'Unable to load availability right now.' });
  }
}
