import test from 'node:test';
import assert from 'node:assert/strict';
import { BOOKING_CONFIG } from '../src/booking/config.ts';
import { validateAvailabilityQuery, validateBookingInput } from '../api/validation.ts';

test('accepts and normalizes a valid booking payload', () => {
  const result = validateBookingInput({
    date: '2026-08-27',
    time: '09:00',
    email: '  person@example.com ',
    notes: 'Discuss a security review.',
  });

  assert.deepEqual(result, {
    ok: true,
    value: {
      date: '2026-08-27',
      time: '09:00',
      email: 'person@example.com',
      notes: 'Discuss a security review.',
    },
  });
});

test('rejects malformed booking fields with API-facing errors', () => {
  assert.deepEqual(validateBookingInput({}), { ok: false, error: 'Invalid date.' });
  assert.deepEqual(validateBookingInput({ date: '2026-08-27', time: '9:00' }), { ok: false, error: 'Invalid time.' });
  assert.deepEqual(validateBookingInput({ date: '2026-08-27', time: '09:00', email: 'invalid', notes: 'Note' }), {
    ok: false,
    error: 'Please enter a valid email address.',
  });
  assert.deepEqual(validateBookingInput({ date: '2026-08-27', time: '09:00', email: 'a@b.com', notes: '   ' }), {
    ok: false,
    error: 'Please add a short note.',
  });
  assert.deepEqual(validateBookingInput({ date: '2026-08-27', time: '09:00', email: 'a@b.com', notes: 'x'.repeat(BOOKING_CONFIG.maxNotesLength + 1) }), {
    ok: false,
    error: 'Your note is too long.',
  });
});

test('validates availability queries and prefers month when both are present', () => {
  assert.deepEqual(validateAvailabilityQuery({ month: '2026-08', date: '2026-08-27' }), {
    ok: true,
    value: { month: '2026-08' },
  });
  assert.deepEqual(validateAvailabilityQuery({ date: '2026-08-27' }), {
    ok: true,
    value: { date: '2026-08-27' },
  });
  assert.deepEqual(validateAvailabilityQuery({ month: 'August 2026' }), { ok: false, error: 'Invalid month format.' });
  assert.deepEqual(validateAvailabilityQuery({ date: '08/27/2026' }), { ok: false, error: 'Invalid date format.' });
  assert.deepEqual(validateAvailabilityQuery({}), { ok: false, error: 'Provide either month or date.' });
});
