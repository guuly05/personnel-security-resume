import { createHash } from 'node:crypto';

type RedisResponse<T> = { result?: T; error?: string };

function getStoreConfig(): { url: string; token: string } | null {
  const clean = (val: string | undefined) => {
    if (!val) return undefined;
    const trimmed = val.trim();
    if (!trimmed || trimmed.startsWith('your_') || trimmed.includes('your-redis-endpoint') || trimmed.startsWith('MY_')) {
      return undefined;
    }
    return trimmed;
  };

  const url = clean(process.env.BOOKING_STORE_REST_URL) ?? clean(process.env.KV_REST_API_URL);
  const token = clean(process.env.BOOKING_STORE_REST_TOKEN) ?? clean(process.env.KV_REST_API_TOKEN);
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

export function isDurableStoreConfigured(): boolean {
  return Boolean(getStoreConfig());
}

async function redisCommand<T>(command: string[]): Promise<T> {
  const config = getStoreConfig();
  if (!config) throw new Error('Durable booking store is not configured.');

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) throw new Error(`Durable store request failed (${response.status}).`);
  const payload = (await response.json()) as RedisResponse<T>;
  if (payload.error) throw new Error(payload.error);
  return payload.result as T;
}

export function stableKey(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export async function getDurableJson<T>(key: string): Promise<T | null> {
  const value = await redisCommand<string | null>(['GET', key]);
  if (!value) return null;
  return JSON.parse(value) as T;
}

export async function setDurableJson(
  key: string,
  value: unknown,
  ttlSeconds: number,
  onlyIfMissing = false,
): Promise<boolean> {
  const args = ['SET', key, JSON.stringify(value), 'EX', String(ttlSeconds)];
  if (onlyIfMissing) args.push('NX');
  const result = await redisCommand<string | null>(args);
  return result === 'OK';
}

export async function deleteDurableKey(key: string): Promise<void> {
  await redisCommand<number>(['DEL', key]);
}

export async function incrementDurableCounter(key: string, windowSeconds: number): Promise<{ count: number; ttlSeconds: number }> {
  const count = await redisCommand<number>(['INCR', key]);
  if (count === 1) await redisCommand<number>(['EXPIRE', key, String(windowSeconds)]);
  const ttlSeconds = await redisCommand<number>(['TTL', key]);
  return { count, ttlSeconds: Math.max(ttlSeconds, windowSeconds) };
}
