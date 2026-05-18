import { Redis } from "@upstash/redis"

let redis: Redis | null = null

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }
  return redis
}

export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining: number }> {
  try {
    const r = getRedis()
    const key = `rate_limit:${identifier}`
    const current = await r.incr(key)

    if (current === 1) {
      await r.expire(key, windowSeconds)
    }

    const remaining = Math.max(0, limit - current)
    return { success: current <= limit, remaining }
  } catch {
    return { success: true, remaining: limit }
  }
}
