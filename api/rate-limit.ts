import { BOOKING_CONFIG } from '../src/booking/config.js';
import { incrementDurableCounter, isDurableStoreConfigured, stableKey } from './durable-store.js';

export type RateLimitResult = {
  limited: boolean;
  retryAfterSeconds: number;
  storageUnavailable?: boolean;
};

function getRequestIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded) && forwarded[0]) return forwarded[0].trim();

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }

  return 'unknown';
}

async function checkLimit(scope: string, req: any, max: number, windowMs: number): Promise<RateLimitResult> {
  if (!isDurableStoreConfigured()) {
    return { limited: true, retryAfterSeconds: 0, storageUnavailable: true };
  }

  try {
    const windowSeconds = Math.ceil(windowMs / 1000);
    const key = `portfolio:rate-limit:${scope}:${stableKey(getRequestIp(req))}`;
    const { count, ttlSeconds } = await incrementDurableCounter(key, windowSeconds);
    return { limited: count > max, retryAfterSeconds: count > max ? ttlSeconds : 0 };
  } catch (error) {
    console.error(`Durable ${scope} rate-limit error:`, error);
    return { limited: true, retryAfterSeconds: 0, storageUnavailable: true };
  }
}

/** Use for POST /api/book — 2 attempts per 30 minutes per IP */
export function enforceBookRateLimit(req: any): Promise<RateLimitResult> {
  return checkLimit('book', req, BOOKING_CONFIG.bookRateLimitMax, BOOKING_CONFIG.bookRateLimitWindowMs);
}

/** Use for GET /api/availability — 20 requests per 60 seconds per IP */
export function enforceAvailabilityRateLimit(req: any): Promise<RateLimitResult> {
  return checkLimit('availability', req, BOOKING_CONFIG.availabilityRateLimitMax, BOOKING_CONFIG.availabilityRateLimitWindowMs);
}
