// lib/security/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client - will use env vars if available, otherwise use in-memory fallback
let redis: Redis | undefined;
let ratelimiters: Map<string, Ratelimit> = new Map();

// Check if Upstash credentials are configured
const hasUpstashConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

if (hasUpstashConfig) {
  redis = Redis.fromEnv();
}

/**
 * Get or create a rate limiter for a specific operation
 * @param operation - The operation type (login, signup, delete, etc.)
 * @param limit - Number of requests allowed
 * @param window - Time window in seconds
 */
function getRateLimiter(operation: string, limit: number, window: number): Ratelimit | null {
  if (!redis) {
    // In development or if Redis is not configured, skip rate limiting
    // FIXME: Use logger.warn(`⚠️ Rate limiting disabled for ${operation} - Redis not configured`);
    return null;
  }

  const key = `${operation}-${limit}-${window}`;

  if (!ratelimiters.has(key)) {
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${window} s`),
      analytics: true,
      prefix: `@easyco/ratelimit/${operation}`,
    });
    ratelimiters.set(key, limiter);
  }

  return ratelimiters.get(key)!;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP, email, user ID)
 * @param operation - The operation type
 * @param limit - Number of requests allowed
 * @param window - Time window in seconds
 */
export async function checkRateLimit(
  identifier: string,
  operation: string,
  limit: number = 5,
  window: number = 60
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const limiter = getRateLimiter(operation, limit, window);

  // If rate limiter is not available (dev or no Redis), allow the request
  if (!limiter) {
    return {
      success: true,
      limit,
      remaining: limit,
      reset: Date.now() + window * 1000,
    };
  }

  try {
    const result = await limiter.limit(identifier);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    // FIXME: Use logger.error - 'Rate limit check failed:', error);
    // On error, allow the request (fail open)
    return {
      success: true,
      limit,
      remaining: limit,
      reset: Date.now() + window * 1000,
    };
  }
}

/**
 * Rate limit configurations for different operations
 */
export const RateLimitConfig = {
  LOGIN: { limit: 5, window: 60 }, // 5 attempts per minute
  SIGNUP: { limit: 3, window: 3600 }, // 3 signups per hour
  DELETE: { limit: 2, window: 3600 }, // 2 deletes per hour
  PASSWORD_RESET: { limit: 3, window: 3600 }, // 3 resets per hour
  API_GENERAL: { limit: 30, window: 60 }, // 30 requests per minute
  ADMIN_ACCESS: { limit: 10, window: 60 }, // 10 admin actions per minute
} as const;

/**
 * Helper to extract client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP address from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  return forwardedFor?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
}

/**
 * Create rate limit response headers
 */
export function createRateLimitHeaders(result: {
  limit: number;
  remaining: number;
  reset: number;
}): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  };
}
