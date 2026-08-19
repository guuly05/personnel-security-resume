import { BOOKING_CONFIG } from '../src/booking/config.js';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

// Separate stores so /api/availability traffic never touches /api/book quota
const bookStore = new Map<string, RateLimitEntry>();
const availabilityStore = new Map<string, RateLimitEntry>();

function getRequestIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].trim();
  }

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }

  return 'unknown';
}

function checkLimit(
  store: Map<string, RateLimitEntry>,
  ip: string,
  max: number,
  windowMs: number,
): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  // Sweep expired entries
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key);
  }

  const entry = store.get(ip);

  if (!entry || entry.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfterSeconds: 0 };
  }

  if (entry.count >= max) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { limited: true, retryAfterSeconds };
  }

  entry.count += 1;
  store.set(ip, entry);
  return { limited: false, retryAfterSeconds: 0 };
}

/** Use for POST /api/book — 2 attempts per 30 minutes per IP */
export function enforceBookRateLimit(req: any): { limited: boolean; retryAfterSeconds: number } {
  const ip = getRequestIp(req);
  return checkLimit(bookStore, ip, BOOKING_CONFIG.bookRateLimitMax, BOOKING_CONFIG.bookRateLimitWindowMs);
}

/** Use for GET /api/availability — 20 requests per 60 seconds per IP */
export function enforceAvailabilityRateLimit(req: any): { limited: boolean; retryAfterSeconds: number } {
  const ip = getRequestIp(req);
  return checkLimit(availabilityStore, ip, BOOKING_CONFIG.availabilityRateLimitMax, BOOKING_CONFIG.availabilityRateLimitWindowMs);
}
