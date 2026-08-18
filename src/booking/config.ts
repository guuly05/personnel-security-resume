export const BOOKING_CONFIG = {
  timezone: (import.meta as { env?: { VITE_BOOKING_TIMEZONE?: string } }).env?.VITE_BOOKING_TIMEZONE ?? 'Africa/Nairobi',
  slotMinutes: 30,
  bufferMinutes: 10,
  noticeHours: 2,
  openDays: [4, 5] as const,
  businessStartHour: 9,
  businessEndHour: 17,
  monthlyAvailabilityTtlSeconds: 60,
  rateLimitMax: 5,
  rateLimitWindowMs: 15 * 60 * 1000,
  maxNotesLength: 1000,
} as const;

export const BOOKING_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
