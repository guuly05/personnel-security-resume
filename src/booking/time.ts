import { addMinutes, differenceInMinutes, format, isBefore } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { BOOKING_CONFIG } from './config.js';

export type AvailabilityBlock = { start?: string | null; end?: string | null };

export type DaySlot = {
  start: string;
  end: string;
  label: string;
};

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

export function isBookingWeekday(date: Date): boolean {
  const day = Number(format(toZonedTime(date, BOOKING_CONFIG.timezone), 'i'));
  return BOOKING_CONFIG.openDays.includes(day as 4 | 5);
}

export function parseDayString(date: string): Date {
  return fromZonedTime(`${date}T00:00:00`, BOOKING_CONFIG.timezone);
}

export function parseSlotString(date: string, time: string): Date {
  return fromZonedTime(`${date}T${time}:00`, BOOKING_CONFIG.timezone);
}

export function formatDateKey(date: Date): string {
  return format(toZonedTime(date, BOOKING_CONFIG.timezone), 'yyyy-MM-dd');
}

export function formatTimeKey(date: Date): string {
  return format(toZonedTime(date, BOOKING_CONFIG.timezone), 'HH:mm');
}

export function getDayWindow(date: Date): { start: Date; end: Date } {
  const zoned = toZonedTime(date, BOOKING_CONFIG.timezone);
  const start = fromZonedTime(
    `${format(zoned, 'yyyy-MM-dd')}T${pad(BOOKING_CONFIG.businessStartHour)}:00:00`,
    BOOKING_CONFIG.timezone,
  );
  const end = fromZonedTime(
    `${format(zoned, 'yyyy-MM-dd')}T${pad(BOOKING_CONFIG.businessEndHour)}:00:00`,
    BOOKING_CONFIG.timezone,
  );
  return { start, end };
}

export function getMonthWindow(month: string): { start: Date; end: Date } {
  const [year, monthPart] = month.split('-').map(Number);
  const nextMonth = monthPart === 12 ? `${year + 1}-01` : `${year}-${pad(monthPart + 1)}`;
  return {
    start: fromZonedTime(`${year}-${pad(monthPart)}-01T00:00:00`, BOOKING_CONFIG.timezone),
    end: fromZonedTime(`${nextMonth}-01T00:00:00`, BOOKING_CONFIG.timezone),
  };
}

export function buildSlotWindows(day: Date): Array<{ start: Date; end: Date }> {
  const { start, end } = getDayWindow(day);
  const slots: Array<{ start: Date; end: Date }> = [];
  let cursor = start;
  const stepMinutes = BOOKING_CONFIG.slotMinutes + BOOKING_CONFIG.bufferMinutes;

  while (differenceInMinutes(end, cursor) >= BOOKING_CONFIG.slotMinutes) {
    const slotEnd = addMinutes(cursor, BOOKING_CONFIG.slotMinutes);
    if (slotEnd > end) break;
    slots.push({ start: cursor, end: slotEnd });
    cursor = addMinutes(cursor, stepMinutes);
  }

  return slots;
}

export function overlaps(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
  return startA < endB && endA > startB;
}

export function subtractBusyBlocks(
  slots: Array<{ start: Date; end: Date }>,
  busyBlocks: AvailabilityBlock[],
): Array<{ start: Date; end: Date }> {
  return slots.filter((slot) =>
    !busyBlocks.some((busy) => {
      if (!busy.start || !busy.end) return false;
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      return !Number.isNaN(busyStart.getTime()) && !Number.isNaN(busyEnd.getTime()) && overlaps(slot.start, slot.end, busyStart, busyEnd);
    }),
  );
}

export function slotToResponse(slot: { start: Date; end: Date }): DaySlot {
  return {
    start: formatTimeKey(slot.start),
    end: formatTimeKey(slot.end),
    label: `${formatTimeKey(slot.start)} - ${formatTimeKey(slot.end)}`,
  };
}

export function monthDaysWithAvailability(daySlots: Map<string, DaySlot[]>): string[] {
  return [...daySlots.entries()]
    .filter(([, slots]) => slots.length > 0)
    .map(([date]) => date)
    .sort();
}

export function isSlotTooSoon(slotStart: Date, now = new Date()): boolean {
  return isBefore(slotStart, addMinutes(now, BOOKING_CONFIG.noticeHours * 60));
}
