import { hasRedis, safeRedis } from "./redis";

type RateLimitOptions = {
  key: string;
  limit: number;
  window: number; // seconds
};

const memoryCounters = new Map<string, { count: number; expiresAt: number }>();

export async function rateLimit({ key, limit, window }: RateLimitOptions) {
  if (hasRedis) {
    const redisKey = `ratelimit:${key}`;
    const result = await safeRedis(async (client) => {
      const tx = client.multi();
      tx.incr(redisKey);
      tx.expire(redisKey, window, "NX");
      const [count] = (await tx.exec()) ?? [];
      return typeof count === "number" ? count : Number(count);
    });

    const count = result ?? 0;
    return {
      success: count <= limit,
      remaining: Math.max(limit - count, 0),
    };
  }

  const now = Date.now();
  const bucket = memoryCounters.get(key);
  if (!bucket || bucket.expiresAt < now) {
    memoryCounters.set(key, { count: 1, expiresAt: now + window * 1000 });
    return { success: true, remaining: limit - 1 };
  }

  bucket.count += 1;
  memoryCounters.set(key, bucket);

  return {
    success: bucket.count <= limit,
    remaining: Math.max(limit - bucket.count, 0),
  };
}
