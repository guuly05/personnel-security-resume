import { createHash } from 'node:crypto';
import { connect as connectTcp, type Socket } from 'node:net';
import { connect as connectTls, type TLSSocket } from 'node:tls';

type RedisResponse<T> = { result?: T; error?: string };
type RedisSocket = Socket | TLSSocket;
type StoreConfig =
  | { kind: 'rest'; url: string; token: string }
  | { kind: 'redis'; url: string };

function getStoreConfig(): StoreConfig | null {
  const clean = (val: string | undefined) => {
    if (!val) return undefined;
    const trimmed = val.trim();
    if (!trimmed || trimmed.startsWith('your_') || trimmed.includes('your-redis-endpoint') || trimmed.startsWith('MY_')) {
      return undefined;
    }
    return trimmed;
  };

  const restUrl = clean(process.env.BOOKING_STORE_REST_URL) ?? clean(process.env.KV_REST_API_URL);
  const restToken = clean(process.env.BOOKING_STORE_REST_TOKEN) ?? clean(process.env.KV_REST_API_TOKEN);
  if (restUrl && restToken) return { kind: 'rest', url: restUrl.replace(/\/$/, ''), token: restToken };

  const redisUrl = clean(process.env.REDIS_URL);
  return redisUrl ? { kind: 'redis', url: redisUrl } : null;
}

export function isDurableStoreConfigured(): boolean {
  return Boolean(getStoreConfig());
}

function encodeRedisCommand(command: string[]): Buffer {
  return Buffer.from(`*${command.length}\r\n${command.map((part) => `$${Buffer.byteLength(part)}\r\n${part}\r\n`).join('')}`);
}

type ParsedRedisReply = { value: string | number | null; offset: number } | null;

function parseRedisReply(buffer: Buffer, start = 0): ParsedRedisReply {
  if (start >= buffer.length) return null;
  const type = String.fromCharCode(buffer[start]);
  const lineEnd = buffer.indexOf('\r\n', start + 1);
  if (lineEnd < 0) return null;

  if (type === '+' || type === '-') {
    const value = buffer.subarray(start + 1, lineEnd).toString();
    if (type === '-') throw new Error(`Redis command failed: ${value}`);
    return { value, offset: lineEnd + 2 };
  }

  if (type === ':') {
    return { value: Number(buffer.subarray(start + 1, lineEnd).toString()), offset: lineEnd + 2 };
  }

  if (type === '$') {
    const length = Number(buffer.subarray(start + 1, lineEnd).toString());
    if (length === -1) return { value: null, offset: lineEnd + 2 };
    const valueStart = lineEnd + 2;
    const valueEnd = valueStart + length;
    if (valueEnd + 2 > buffer.length) return null;
    return { value: buffer.subarray(valueStart, valueEnd).toString(), offset: valueEnd + 2 };
  }

  throw new Error(`Unsupported Redis response type: ${type}`);
}

class RedisConnection {
  private buffer = Buffer.alloc(0);
  private readonly pending: Array<{ resolve: (value: string | number | null) => void; reject: (error: Error) => void }> = [];
  private closed = false;

  private constructor(private readonly socket: RedisSocket) {
    socket.setTimeout(8000, () => this.fail(new Error('Redis connection timed out.')));
    socket.on('data', (chunk: Buffer) => {
      this.buffer = Buffer.concat([this.buffer, chunk]);
      try {
        this.drain();
      } catch (error) {
        this.fail(error instanceof Error ? error : new Error(String(error)));
      }
    });
    socket.on('error', (error) => this.fail(error instanceof Error ? error : new Error(String(error))));
    socket.on('close', () => {
      if (!this.closed) this.fail(new Error('Redis connection closed unexpectedly.'));
    });
  }

  static async open(redisUrl: string): Promise<RedisConnection> {
    const parsed = new URL(redisUrl);
    if (parsed.protocol !== 'redis:' && parsed.protocol !== 'rediss:') {
      throw new Error('REDIS_URL must use redis:// or rediss://.');
    }

    const port = parsed.port ? Number(parsed.port) : 6379;
    const host = parsed.hostname;
    const socket = await new Promise<RedisSocket>((resolve, reject) => {
      const onError = (error: Error) => reject(error);
      const connected = parsed.protocol === 'rediss:'
        ? connectTls({ host, port, servername: host }, () => resolve(connected))
        : connectTcp({ host, port }, () => resolve(connected));
      connected.once('error', onError);
    });

    const connection = new RedisConnection(socket);
    const username = decodeURIComponent(parsed.username);
    const password = decodeURIComponent(parsed.password);
    if (password) {
      await connection.command(username ? ['AUTH', username, password] : ['AUTH', password]);
    }
    if (parsed.pathname && parsed.pathname !== '/') {
      await connection.command(['SELECT', parsed.pathname.slice(1)]);
    }
    return connection;
  }

  command(command: string[]): Promise<string | number | null> {
    if (this.closed) return Promise.reject(new Error('Redis connection is closed.'));
    return new Promise((resolve, reject) => {
      this.pending.push({ resolve, reject });
      this.socket.write(encodeRedisCommand(command));
    });
  }

  close(): void {
    this.closed = true;
    this.socket.destroy();
  }

  private drain(): void {
    while (this.pending.length) {
      const parsed = parseRedisReply(this.buffer);
      if (!parsed) return;
      this.buffer = this.buffer.subarray(parsed.offset);
      this.pending.shift()!.resolve(parsed.value);
    }
  }

  private fail(error: Error): void {
    if (this.closed) return;
    this.closed = true;
    this.socket.destroy();
    while (this.pending.length) this.pending.shift()!.reject(error);
  }
}

async function redisProtocolCommand<T>(redisUrl: string, command: string[]): Promise<T> {
  const connection = await RedisConnection.open(redisUrl);
  try {
    return await connection.command(command) as T;
  } finally {
    connection.close();
  }
}

async function redisCommand<T>(command: string[]): Promise<T> {
  const config = getStoreConfig();
  if (!config) throw new Error('Durable booking store is not configured.');

  if (config.kind === 'redis') return redisProtocolCommand<T>(config.url, command);

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
