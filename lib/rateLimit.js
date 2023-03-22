/**
 * Simple in-memory rate limiter for API routes.
 * Limits requests per IP within a sliding window.
 * Not suitable for distributed deployments — use Upstash or Vercel Edge Rate Limit for production at scale.
 */

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 30;  // 30 requests per minute per IP

const ipMap = new Map();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipMap) {
    if (now - entry.windowStart > WINDOW_MS * 2) {
      ipMap.delete(ip);
    }
  }
}, 300_000);

/**
 * Returns true if the request should be allowed, false if rate-limited.
 * @param {Request} request
 * @returns {{ allowed: boolean, remaining: number }}
 */
export function checkRateLimit(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';

  const now = Date.now();
  let entry = ipMap.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    entry = { windowStart: now, count: 0 };
    ipMap.set(ip, entry);
  }

  entry.count += 1;

  return {
    allowed: entry.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
  };
}
