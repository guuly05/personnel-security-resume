import { createHash, randomBytes } from 'node:crypto';
import { deleteDurableKey, getDurableJson, setDurableJson, stableKey } from './durable-store.js';

export type BookingStatus = 'confirmed' | 'canceled';

export type BookingRecord = {
  eventId: string;
  email: string;
  date: string;
  time: string;
  startIso: string;
  endIso: string;
  notes: string;
  meetLink: string | null;
  calendarLink: string | null;
  manageTokenHash: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};

export type IdempotencyRecord = {
  state: 'processing' | 'complete';
  fingerprint: string;
  response?: Record<string, unknown>;
};

const BOOKING_TTL_SECONDS = 60 * 60 * 24 * 180;
const IDEMPOTENCY_TTL_SECONDS = 60 * 60 * 24;

function bookingKey(eventId: string): string {
  return `portfolio:booking:${stableKey(eventId)}`;
}

function tokenKey(tokenHash: string): string {
  return `portfolio:booking-token:${tokenHash}`;
}

function idempotencyKey(key: string): string {
  return `portfolio:booking-idempotency:${stableKey(key)}`;
}

export function createManageToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString('base64url');
  return { token, hash: createHash('sha256').update(token).digest('hex') };
}

export async function claimIdempotencyKey(key: string, fingerprint: string): Promise<IdempotencyRecord | null> {
  const record: IdempotencyRecord = { state: 'processing', fingerprint };
  const claimed = await setDurableJson(idempotencyKey(key), record, IDEMPOTENCY_TTL_SECONDS, true);
  if (claimed) return null;
  return getDurableJson<IdempotencyRecord>(idempotencyKey(key));
}

export async function completeIdempotencyKey(key: string, fingerprint: string, response: Record<string, unknown>): Promise<void> {
  await setDurableJson(idempotencyKey(key), { state: 'complete', fingerprint, response }, IDEMPOTENCY_TTL_SECONDS);
}

export async function releaseIdempotencyKey(key: string): Promise<void> {
  await deleteDurableKey(idempotencyKey(key));
}

export async function saveBooking(record: BookingRecord): Promise<void> {
  await setDurableJson(bookingKey(record.eventId), record, BOOKING_TTL_SECONDS);
  await setDurableJson(tokenKey(record.manageTokenHash), record.eventId, BOOKING_TTL_SECONDS);
}

export async function findBookingByToken(token: string): Promise<BookingRecord | null> {
  if (!token || token.length > 160) return null;
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const eventId = await getDurableJson<string>(tokenKey(tokenHash));
  if (!eventId) return null;
  const record = await getDurableJson<BookingRecord>(bookingKey(eventId));
  if (!record || record.manageTokenHash !== tokenHash) return null;
  return record;
}

export async function updateBooking(record: BookingRecord): Promise<void> {
  await saveBooking({ ...record, updatedAt: new Date().toISOString() });
}
