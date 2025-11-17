/**
 * Event Properties Validator
 *
 * Validates and sanitizes event properties before sending to analytics providers.
 * Prevents PII (Personally Identifiable Information) leakage.
 *
 * Blocks:
 * - Email addresses
 * - Phone numbers
 * - Credit card numbers
 * - Social security numbers
 * - IP addresses
 * - Full addresses
 * - Passwords/tokens
 */

import type { EventProperties } from './event-tracker';

// Regex patterns for PII detection
const PII_PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}/g,
  creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
};

// Keys that commonly contain PII
const BLOCKED_KEYS = [
  'email',
  'password',
  'password_confirmation',
  'token',
  'access_token',
  'refresh_token',
  'api_key',
  'secret',
  'credit_card',
  'card_number',
  'cvv',
  'ssn',
  'social_security',
  'phone',
  'phone_number',
  'address',
  'street_address',
  'postal_code',
  'zip_code',
  'passport',
  'driver_license',
  'national_id',
];

// Keys that are allowed to contain potentially sensitive data (with sanitization)
const ALLOWED_SENSITIVE_KEYS = [
  'user_id',
  'user_type',
  'property_id',
  'application_id',
  'message_id',
  'conversation_id',
];

/**
 * Check if a string contains PII
 */
function containsPII(value: string): boolean {
  // Check against all PII patterns
  for (const pattern of Object.values(PII_PATTERNS)) {
    if (pattern.test(value)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a key is blocked
 */
function isBlockedKey(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return BLOCKED_KEYS.some((blocked) => lowerKey.includes(blocked));
}

/**
 * Sanitize a value by replacing with a hash
 */
function sanitizeValue(value: any): string {
  if (typeof value === 'string') {
    // Replace PII with [REDACTED]
    let sanitized = value;
    for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
      sanitized = sanitized.replace(pattern, `[${type.toUpperCase()}_REDACTED]`);
    }
    return sanitized;
  }
  return '[REDACTED]';
}

/**
 * Validate and sanitize event properties
 * Returns sanitized properties safe to send to analytics
 */
export function validateEventProperties(
  properties: EventProperties
): EventProperties {
  const sanitized: EventProperties = {};

  for (const [key, value] of Object.entries(properties)) {
    // Skip null/undefined
    if (value === null || value === undefined) {
      continue;
    }

    // Block known PII keys entirely
    if (isBlockedKey(key)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Analytics] Blocked PII key: ${key}`);
      }
      continue;
    }

    // Check string values for PII patterns
    if (typeof value === 'string') {
      if (containsPII(value)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Analytics] Blocked PII value for key: ${key}`);
        }
        // For allowed keys, sanitize instead of blocking
        if (ALLOWED_SENSITIVE_KEYS.includes(key)) {
          sanitized[key] = sanitizeValue(value);
        }
        continue;
      }
    }

    // Recursively validate objects
    if (typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = validateEventProperties(value as EventProperties) as any;
      continue;
    }

    // Validate arrays
    if (Array.isArray(value)) {
      sanitized[key] = value
        .map((item) => {
          if (typeof item === 'object') {
            return validateEventProperties(item);
          }
          if (typeof item === 'string' && containsPII(item)) {
            return null; // Remove PII items from arrays
          }
          return item;
        })
        .filter((item) => item !== null) as any;
      continue;
    }

    // Allow safe primitive values
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Validate user properties before identification
 * More strict than event properties
 */
export function validateUserProperties(properties: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(properties)) {
    // Skip null/undefined
    if (value === null || value === undefined) {
      continue;
    }

    // Block all PII keys
    if (isBlockedKey(key)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Analytics] Blocked PII key in user properties: ${key}`);
      }
      continue;
    }

    // Only allow specific safe keys for user identification
    const allowedUserKeys = [
      'user_id',
      'user_type',
      'is_verified',
      'signup_date',
      'language',
      'country',
      'city',
      'age_range',
      'gender',
      'account_status',
      'subscription_plan',
      'premium',
    ];

    if (allowedUserKeys.includes(key)) {
      // Still check string values for PII
      if (typeof value === 'string' && containsPII(value)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Analytics] Blocked PII value in user properties: ${key}`);
        }
        continue;
      }

      sanitized[key] = value;
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Analytics] Blocked non-whitelisted user property: ${key}`);
      }
    }
  }

  return sanitized;
}

/**
 * Test if value is safe to track (exported for testing)
 */
export function isSafeValue(value: any): boolean {
  if (typeof value === 'string') {
    return !containsPII(value);
  }
  return true;
}
