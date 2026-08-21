import { kv } from "@vercel/kv";

export interface RateLimitResult {
  allowed: boolean;
  /** Requests remaining in the current window (never negative). */
  remaining: number;
}

/**
 * Simple fixed-window rate limiter backed by Vercel KV.
 *
 * Increments a counter for `key` and sets an expiry on the first hit of each
 * window. Returns `allowed: false` once the counter exceeds `limit`.
 *
 * Fails open: if KV is unavailable the request is allowed, so a storage outage
 * never blocks legitimate traffic (bot protection still relies on the honeypot).
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  try {
    const count = await kv.incr(key);
    if (count === 1) {
      await kv.expire(key, windowSeconds);
    }
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  } catch (error) {
    console.error("Rate limit check failed; allowing request:", error);
    return { allowed: true, remaining: limit };
  }
}

/**
 * Best-effort client IP from proxy headers. Vercel sets `x-forwarded-for`;
 * the left-most entry is the original client.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
