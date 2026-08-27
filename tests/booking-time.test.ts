import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSlotWindows,
  formatDateKey,
  formatTimeKey,
  getDayWindow,
  isBookingWeekday,
  isSlotTooSoon,
  parseDayString,
  parseSlotString,
  subtractBusyBlocks,
} from '../src/booking/time.ts';

test('parses and formats booking dates in the configured timezone', () => {
  const slot = parseSlotString('2026-08-27', '09:00');

  assert.equal(formatDateKey(slot), '2026-08-27');
  assert.equal(formatTimeKey(slot), '09:00');
  assert.equal(isBookingWeekday(slot), true);
  assert.equal(isBookingWeekday(parseDayString('2026-08-30')), false);
});

test('builds 30-minute slots with a 10-minute buffer during business hours', () => {
  const slots = buildSlotWindows(parseDayString('2026-08-27'));
  const { start, end } = getDayWindow(parseDayString('2026-08-27'));

  assert.equal(slots.length, 12);
  assert.equal(formatTimeKey(start), '09:00');
  assert.equal(formatTimeKey(end), '17:00');
  assert.equal(formatTimeKey(slots[0].start), '09:00');
  assert.equal(formatTimeKey(slots[0].end), '09:30');
  assert.equal(formatTimeKey(slots.at(-1)!.start), '16:20');
  assert.equal(formatTimeKey(slots.at(-1)!.end), '16:50');
});

test('filters overlapping busy blocks and respects the notice window', () => {
  const slots = buildSlotWindows(parseDayString('2026-08-27'));
  const first = slots[0];
  const available = subtractBusyBlocks(slots, [
    { start: first.end.toISOString(), end: new Date(first.end.getTime() + 10 * 60 * 1000).toISOString() },
  ]);
  const blocked = subtractBusyBlocks(slots, [
    { start: first.start.toISOString(), end: first.end.toISOString() },
  ]);

  assert.equal(available.length, slots.length);
  assert.equal(blocked.length, slots.length - 1);
  assert.equal(isSlotTooSoon(parseSlotString('2026-08-27', '09:00'), parseSlotString('2026-08-27', '07:01')), true);
  assert.equal(isSlotTooSoon(parseSlotString('2026-08-27', '09:00'), parseSlotString('2026-08-27', '06:59')), false);
});
