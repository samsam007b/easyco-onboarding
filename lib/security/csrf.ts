/**
 * CSRF (Cross-Site Request Forgery) PROTECTION
 *
 * Implements double-submit cookie pattern for CSRF protection
 * SECURITY: Prevents attackers from forcing users to perform actions
 *
 * Usage in API routes:
 *   import { validateCSRFToken } from '@/lib/security/csrf';
 *
 *   export async function POST(request: NextRequest) {
 *     const isValid = await validateCSRFToken(request);
 *     if (!isValid) {
 *       return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
 *     }
 *     // Proceed...
 *   }
 *
 * Usage in frontend:
 *   import { getCSRFToken } from '@/lib/security/csrf';
 *
 *   const token = await getCSRFToken();
 *   await fetch('/api/endpoint', {
 *     method: 'POST',
 *     headers: {
 *       'X-CSRF-Token': token,
 *     },
 *   });
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

const CSRF_TOKEN_COOKIE = 'izzico_csrf_token';
const CSRF_HEADER = 'x-csrf-token';

/**
 * Generate a new CSRF token
 * Returns a cryptographically random 32-byte token
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('base64url');
}

/**
 * Set CSRF token in response cookie
 * Call this when creating a new session or serving pages
 */
export function setCSRFTokenCookie(response: NextResponse, token?: string): void {
  const csrfToken = token || generateCSRFToken();

  response.cookies.set({
    name: CSRF_TOKEN_COOKIE,
    value: csrfToken,
    httpOnly: false, // Must be readable by JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Strict for CSRF protection
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

/**
 * Get CSRF token from request (either cookie or header)
 */
function getCSRFToken(request: NextRequest): {
  cookieToken: string | undefined;
  headerToken: string | undefined;
} {
  const cookieToken = request.cookies.get(CSRF_TOKEN_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER) || request.headers.get('X-XSRF-Token') || undefined;

  return { cookieToken, headerToken };
}

/**
 * Validate CSRF token (double-submit cookie pattern)
 * Returns true if token in cookie matches token in header
 */
export function validateCSRFToken(request: NextRequest): boolean {
  const { cookieToken, headerToken } = getCSRFToken(request);

  // Both must be present
  if (!cookieToken || !headerToken) {
    return false;
  }

  // They must match (timing-safe comparison)
  return timingSafeEqual(cookieToken, headerToken);
}

/**
 * Timing-safe string comparison
 * Prevents timing attacks to guess token
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * CSRF protection middleware for use in API routes
 * Call this at the start of POST/PUT/DELETE handlers
 */
export function requireCSRF(request: NextRequest): NextResponse | null {
  const method = request.method;

  // Only enforce on state-changing methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return null; // GET/HEAD/OPTIONS don't need CSRF protection
  }

  // Validate token
  if (!validateCSRFToken(request)) {
    return NextResponse.json(
      {
        error: 'CSRF validation failed',
        message: 'Invalid or missing CSRF token',
      },
      { status: 403 }
    );
  }

  return null; // Validation passed
}

/**
 * Client-side: Get CSRF token from cookie (for use in fetch calls)
 * This function should be used in client components
 */
export function getClientCSRFToken(): string | null {
  if (typeof document === 'undefined') {
    return null; // Server-side
  }

  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(c => c.trim().startsWith(`${CSRF_TOKEN_COOKIE}=`));

  if (!csrfCookie) {
    return null;
  }

  return csrfCookie.split('=')[1];
}

/**
 * Exempted routes that don't need CSRF protection
 * (webhooks, OAuth callbacks, etc.)
 */
const CSRF_EXEMPT_PATHS = [
  '/api/stripe/webhook',
  '/api/auth/itsme/callback',
  '/api/log/error', // Client-side error logging
  '/api/performance/web-vitals', // Metrics
];

/**
 * Check if a route is exempt from CSRF protection
 */
export function isCSRFExempt(pathname: string): boolean {
  return CSRF_EXEMPT_PATHS.some(exempt => pathname.startsWith(exempt));
}
