/**
 * ADMIN ROUTE PROTECTION
 *
 * Security middleware for admin routes:
 * - IP allowlisting (optional, configurable via env)
 * - Rate limiting integration
 * - Audit logging
 *
 * All features are FREE and enhance security significantly.
 */

import { NextRequest } from 'next/server';
import { logger } from './logger';

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * IP Allowlist Configuration
 *
 * Set ADMIN_IP_ALLOWLIST in .env.local to enable IP restriction
 * Format: comma-separated list of IPs or CIDR ranges
 *
 * Examples:
 * ADMIN_IP_ALLOWLIST=192.168.1.100,10.0.0.0/8
 * ADMIN_IP_ALLOWLIST=your.office.ip.address
 *
 * Leave empty or unset to disable IP restriction (allows all IPs)
 */
const IP_ALLOWLIST = process.env.ADMIN_IP_ALLOWLIST?.split(',').map(ip => ip.trim()).filter(Boolean) || [];

/**
 * Whether IP allowlisting is enabled
 */
const IP_ALLOWLIST_ENABLED = IP_ALLOWLIST.length > 0;

// =============================================================================
// IP UTILITIES
// =============================================================================

/**
 * Extract client IP from request headers
 * Handles various proxy configurations (Vercel, Cloudflare, etc.)
 */
export function getClientIP(request: NextRequest): string {
  // Priority order for IP headers
  const headers = [
    'cf-connecting-ip',    // Cloudflare
    'x-real-ip',           // Nginx
    'x-forwarded-for',     // Standard proxy header
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first (original client)
      const ip = value.split(',')[0].trim();
      if (ip && ip !== 'unknown') {
        return ip;
      }
    }
  }

  // Fallback to connection IP (not available in Edge Runtime)
  return 'unknown';
}

/**
 * Check if an IP is in a CIDR range
 * Supports both IPv4 and simple IP matching
 */
function ipInCIDR(ip: string, cidr: string): boolean {
  // Simple exact match first
  if (ip === cidr) {
    return true;
  }

  // Check if CIDR notation
  if (!cidr.includes('/')) {
    return false;
  }

  const [range, bits] = cidr.split('/');
  const rangeParts = range.split('.').map(Number);
  const ipParts = ip.split('.').map(Number);
  const mask = parseInt(bits, 10);

  // Convert to 32-bit integers
  const rangeInt = rangeParts.reduce((acc, octet) => (acc << 8) + octet, 0) >>> 0;
  const ipInt = ipParts.reduce((acc, octet) => (acc << 8) + octet, 0) >>> 0;

  // Create mask
  const maskInt = mask === 0 ? 0 : (~0 << (32 - mask)) >>> 0;

  // Check if IP is in range
  return (ipInt & maskInt) === (rangeInt & maskInt);
}

/**
 * Check if an IP is in the allowlist
 */
export function isIPAllowed(ip: string): boolean {
  // If no allowlist configured, allow all
  if (!IP_ALLOWLIST_ENABLED) {
    return true;
  }

  // Check against each entry in the allowlist
  return IP_ALLOWLIST.some(allowed => {
    // Handle CIDR ranges
    if (allowed.includes('/')) {
      return ipInCIDR(ip, allowed);
    }
    // Exact match
    return ip === allowed;
  });
}

// =============================================================================
// SESSION ACTIVITY TRACKING
// =============================================================================

/**
 * Session timeout configuration (in milliseconds)
 * Default: 30 minutes of inactivity
 */
const SESSION_TIMEOUT_MS = parseInt(process.env.SESSION_TIMEOUT_MINUTES || '30', 10) * 60 * 1000;

/**
 * Admin session timeout (stricter)
 * Default: 15 minutes of inactivity
 */
const ADMIN_SESSION_TIMEOUT_MS = parseInt(process.env.ADMIN_SESSION_TIMEOUT_MINUTES || '15', 10) * 60 * 1000;

/**
 * Check if a session has timed out based on last activity
 */
export function isSessionTimedOut(
  lastActivityTimestamp: number,
  isAdmin: boolean = false
): boolean {
  const timeout = isAdmin ? ADMIN_SESSION_TIMEOUT_MS : SESSION_TIMEOUT_MS;
  const now = Date.now();
  return now - lastActivityTimestamp > timeout;
}

/**
 * Get session timeout in minutes for display
 */
export function getSessionTimeoutMinutes(isAdmin: boolean = false): number {
  const timeout = isAdmin ? ADMIN_SESSION_TIMEOUT_MS : SESSION_TIMEOUT_MS;
  return Math.floor(timeout / 60000);
}

// =============================================================================
// ADMIN ACCESS VALIDATION
// =============================================================================

export interface AdminAccessResult {
  allowed: boolean;
  reason?: string;
  clientIP: string;
}

/**
 * Validate admin access from a request
 * Checks IP allowlist and logs the attempt
 */
export function validateAdminAccess(request: NextRequest): AdminAccessResult {
  const clientIP = getClientIP(request);
  const pathname = request.nextUrl.pathname;

  // Check IP allowlist
  if (!isIPAllowed(clientIP)) {
    // Log blocked attempt
    logger.security('Admin access blocked by IP allowlist', {
      ip: clientIP,
      path: pathname,
      allowlistEnabled: IP_ALLOWLIST_ENABLED,
    });

    return {
      allowed: false,
      reason: 'IP non autorisée pour l\'accès admin',
      clientIP,
    };
  }

  // Log successful access
  logger.audit('admin_access', {
    ip: clientIP,
    path: pathname,
  });

  return {
    allowed: true,
    clientIP,
  };
}

// =============================================================================
// SUSPICIOUS ACTIVITY DETECTION
// =============================================================================

/**
 * Patterns that indicate potentially malicious requests
 */
const SUSPICIOUS_PATTERNS = [
  /\.\.\//,                    // Path traversal
  /<script/i,                  // XSS attempt
  /javascript:/i,              // XSS attempt
  /on\w+\s*=/i,               // Event handlers
  /union\s+select/i,          // SQL injection
  /;\s*drop\s+/i,             // SQL injection
  /exec\s*\(/i,               // Command injection
  /\$\{/,                     // Template injection
  /__proto__/,                // Prototype pollution
  /constructor\s*\[/,         // Prototype pollution
];

/**
 * Check request for suspicious patterns
 */
export function hasSuspiciousPatterns(
  request: NextRequest
): { suspicious: boolean; patterns: string[] } {
  const url = request.url;
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams.toString();
  const fullUrl = `${pathname}?${searchParams}`;

  const detectedPatterns: string[] = [];

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(fullUrl) || pattern.test(url)) {
      detectedPatterns.push(pattern.source);
    }
  }

  if (detectedPatterns.length > 0) {
    const clientIP = getClientIP(request);
    logger.security('Suspicious request pattern detected', {
      ip: clientIP,
      path: pathname,
      patterns: detectedPatterns,
    });
  }

  return {
    suspicious: detectedPatterns.length > 0,
    patterns: detectedPatterns,
  };
}

// =============================================================================
// EXPORT STATUS
// =============================================================================

/**
 * Get current protection status for monitoring
 */
export function getProtectionStatus(): {
  ipAllowlistEnabled: boolean;
  ipAllowlistCount: number;
  sessionTimeoutMinutes: number;
  adminSessionTimeoutMinutes: number;
} {
  return {
    ipAllowlistEnabled: IP_ALLOWLIST_ENABLED,
    ipAllowlistCount: IP_ALLOWLIST.length,
    sessionTimeoutMinutes: getSessionTimeoutMinutes(false),
    adminSessionTimeoutMinutes: getSessionTimeoutMinutes(true),
  };
}
