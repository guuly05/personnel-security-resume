import { BOOKING_CONFIG, BOOKING_EMAIL_PATTERN } from '../src/booking/config.js';

export type BookingInput = {
  date: string;
  time: string;
  email: string;
  notes: string;
};

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function validateBookingInput(body: unknown): ValidationResult<BookingInput> {
  const input = body && typeof body === 'object' ? body as Record<string, unknown> : {};
  const { date, time, email, notes } = input;

  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: 'Invalid date.' };
  }
  if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) {
    return { ok: false, error: 'Invalid time.' };
  }
  if (typeof email !== 'string' || !BOOKING_EMAIL_PATTERN.test(email.trim())) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  if (typeof notes !== 'string' || notes.trim().length === 0) {
    return { ok: false, error: 'Please add a short note.' };
  }
  if (notes.length > BOOKING_CONFIG.maxNotesLength) {
    return { ok: false, error: 'Your note is too long.' };
  }

  return { ok: true, value: { date, time, email: email.trim(), notes } };
}

export type AvailabilityQuery = { month?: string; date?: string };

export function validateAvailabilityQuery(query: unknown): ValidationResult<AvailabilityQuery> {
  const input = query && typeof query === 'object' ? query as Record<string, unknown> : {};
  const month = typeof input.month === 'string' ? input.month : '';
  const date = typeof input.date === 'string' ? input.date : '';

  if (month && !/^\d{4}-\d{2}$/.test(month)) {
    return { ok: false, error: 'Invalid month format.' };
  }
  if (!month && date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: 'Invalid date format.' };
  }
  if (!month && !date) {
    return { ok: false, error: 'Provide either month or date.' };
  }

  return { ok: true, value: month ? { month } : { date } };
}
