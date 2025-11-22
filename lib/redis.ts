import Redis from "ioredis";

declare global {
  var redis: Redis | undefined;
}

const redisUrl = process.env.REDIS_URL;

export const redis =
  globalThis.redis ??
  (redisUrl
    ? new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      })
    : undefined);

if (redis && process.env.NODE_ENV !== "production") {
  globalThis.redis = redis;
}

export const hasRedis = Boolean(redis);

export async function safeRedis<T>(fn: (client: Redis) => Promise<T>): Promise<T | null> {
  if (!redis) {
    return null;
  }

  try {
    return await fn(redis);
  } catch (error) {
    console.error("Redis error", error);
    return null;
  }
}
