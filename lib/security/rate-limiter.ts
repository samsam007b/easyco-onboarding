// lib/security/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { logger } from './logger';

// Initialize Redis client - will use env vars if available, otherwise use in-memory fallback
let redis: Redis | undefined;
let ratelimiters: Map<string, Ratelimit> = new Map();

// Check if Upstash credentials are configured
const hasUpstashConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

if (hasUpstashConfig) {
  redis = Redis.fromEnv();
}

// =====================================================
// CIRCUIT BREAKER STATE
// =====================================================
interface CircuitBreakerState {
  failures: number;
  lastFailure: number;
  isOpen: boolean;
}

const circuitBreaker: CircuitBreakerState = {
  failures: 0,
  lastFailure: 0,
  isOpen: false,
};

// Circuit breaker configuration
const CIRCUIT_BREAKER_CONFIG = {
  maxFailures: 5,           // Open circuit after 5 consecutive failures
  resetTimeout: 30000,      // Try to close circuit after 30 seconds
  halfOpenRequests: 3,      // Allow 3 test requests when half-open
};

// =====================================================
// IN-MEMORY RATE LIMITER FALLBACK
// =====================================================
interface InMemoryEntry {
  count: number;
  windowStart: number;
}

// In-memory rate limit store (per operation)
const inMemoryStore: Map<string, InMemoryEntry> = new Map();

// Cleanup old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupInMemoryStore(maxAge: number = 3600000): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  const cutoff = now - maxAge;

  for (const [key, entry] of inMemoryStore.entries()) {
    if (entry.windowStart < cutoff) {
      inMemoryStore.delete(key);
    }
  }
}

/**
 * In-memory sliding window rate limiter
 * Used as fallback when Redis is unavailable
 */
function checkInMemoryRateLimit(
  identifier: string,
  operation: string,
  limit: number,
  window: number
): { success: boolean; remaining: number } {
  cleanupInMemoryStore();

  const key = `${operation}:${identifier}`;
  const now = Date.now();
  const windowMs = window * 1000;

  const entry = inMemoryStore.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    // New window or expired window
    inMemoryStore.set(key, { count: 1, windowStart: now });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count };
}

// =====================================================
// CIRCUIT BREAKER LOGIC
// =====================================================

function recordRedisFailure(): void {
  circuitBreaker.failures += 1;
  circuitBreaker.lastFailure = Date.now();

  if (circuitBreaker.failures >= CIRCUIT_BREAKER_CONFIG.maxFailures) {
    circuitBreaker.isOpen = true;
    logger.security('Rate limiter circuit breaker opened', {
      failures: circuitBreaker.failures,
    });
  }
}

function recordRedisSuccess(): void {
  circuitBreaker.failures = 0;
  if (circuitBreaker.isOpen) {
    circuitBreaker.isOpen = false;
    logger.info('Rate limiter circuit breaker closed - Redis recovered');
  }
}

function shouldTryRedis(): boolean {
  if (!circuitBreaker.isOpen) {
    return true;
  }

  // Check if we should try to close the circuit (half-open state)
  const timeSinceFailure = Date.now() - circuitBreaker.lastFailure;
  if (timeSinceFailure >= CIRCUIT_BREAKER_CONFIG.resetTimeout) {
    // Allow a test request to see if Redis is back
    return true;
  }

  return false;
}

// =====================================================
// RATE LIMITER FUNCTIONS
// =====================================================

/**
 * Get or create a rate limiter for a specific operation
 * @param operation - The operation type (login, signup, delete, etc.)
 * @param limit - Number of requests allowed
 * @param window - Time window in seconds
 */
function getRateLimiter(operation: string, limit: number, window: number): Ratelimit | null {
  if (!redis) {
    logger.info(`Rate limiting using in-memory fallback for ${operation} - Redis not configured`);
    return null;
  }

  const key = `${operation}-${limit}-${window}`;

  if (!ratelimiters.has(key)) {
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${window} s`),
      analytics: true,
      prefix: `@izzico/ratelimit/${operation}`,
    });
    ratelimiters.set(key, limiter);
  }

  return ratelimiters.get(key)!;
}

/**
 * Check if a request should be rate limited
 * Uses Redis when available, falls back to in-memory with circuit breaker protection
 *
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

  // If rate limiter is not configured (no Redis), use in-memory fallback
  if (!limiter) {
    const memResult = checkInMemoryRateLimit(identifier, operation, limit, window);
    return {
      success: memResult.success,
      limit,
      remaining: memResult.remaining,
      reset: Date.now() + window * 1000,
    };
  }

  // Check circuit breaker before trying Redis
  if (!shouldTryRedis()) {
    // Circuit is open, use in-memory fallback
    const memResult = checkInMemoryRateLimit(identifier, operation, limit, window);
    return {
      success: memResult.success,
      limit,
      remaining: memResult.remaining,
      reset: Date.now() + window * 1000,
    };
  }

  try {
    const result = await limiter.limit(identifier);

    // Redis succeeded, record success and reset circuit breaker
    recordRedisSuccess();

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    // Redis failed, record failure and use in-memory fallback
    recordRedisFailure();
    logger.error('Rate limit Redis check failed, using in-memory fallback', error instanceof Error ? error : new Error(String(error)), { operation });

    // SECURITY: Fall back to in-memory rate limiting instead of allowing all requests
    const memResult = checkInMemoryRateLimit(identifier, operation, limit, window);
    return {
      success: memResult.success,
      limit,
      remaining: memResult.remaining,
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

/**
 * Get circuit breaker status (for monitoring/debugging)
 */
export function getCircuitBreakerStatus(): { isOpen: boolean; failures: number; lastFailure: Date | null } {
  return {
    isOpen: circuitBreaker.isOpen,
    failures: circuitBreaker.failures,
    lastFailure: circuitBreaker.lastFailure ? new Date(circuitBreaker.lastFailure) : null,
  };
}
