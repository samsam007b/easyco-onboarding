// lib/security/sanitizer.ts
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML content
 * @param allowedTags - Array of allowed HTML tags (default: basic formatting only)
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(
  dirty: string,
  allowedTags: string[] = ['b', 'i', 'em', 'strong', 'br', 'p', 'ul', 'ol', 'li']
): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: [], // No attributes allowed by default
    KEEP_CONTENT: true, // Keep text content even if tags are stripped
  });
}

/**
 * Sanitize plain text by removing all HTML and special characters
 * @param text - The text to sanitize
 * @returns Sanitized plain text
 */
export function sanitizePlainText(text: string): string {
  // Remove all HTML tags
  let sanitized = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });

  // Remove any remaining special characters that could be used for injection
  sanitized = sanitized.replace(/[<>'"]/g, '');

  return sanitized.trim();
}

/**
 * Sanitize user input for database storage
 * Removes potentially dangerous content while preserving readability
 */
export function sanitizeUserInput(input: string, maxLength: number = 5000): string {
  if (!input) return '';

  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength);

  // Remove NULL bytes and control characters
  sanitized = sanitized.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Sanitize HTML
  sanitized = sanitizeHtml(sanitized);

  return sanitized;
}

/**
 * Sanitize URL to prevent javascript: and data: protocol attacks
 * @param url - The URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  if (dangerousProtocols.some(protocol => trimmed.startsWith(protocol))) {
    return '';
  }

  // Only allow http, https, mailto
  if (!trimmed.startsWith('http://') &&
      !trimmed.startsWith('https://') &&
      !trimmed.startsWith('mailto:') &&
      !trimmed.startsWith('/')) {
    return '';
  }

  return DOMPurify.sanitize(url, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitize file name to prevent path traversal attacks
 * @param fileName - The file name to sanitize
 * @returns Sanitized file name
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) return '';

  // Remove path separators and dangerous characters
  let sanitized = fileName.replace(/[\/\\]/g, '');

  // Remove NULL bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove leading dots (hidden files)
  sanitized = sanitized.replace(/^\.+/, '');

  // Limit to alphanumeric, dash, underscore, dot
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Limit length
  sanitized = sanitized.slice(0, 255);

  return sanitized;
}

/**
 * Escape SQL LIKE pattern special characters
 * Use when user input is used in SQL LIKE queries
 */
export function escapeLikePattern(pattern: string): string {
  return pattern.replace(/[%_\\]/g, '\\$&');
}

/**
 * Sanitize search query
 * Removes special characters that could be used for injection
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';

  // Trim and limit length
  let sanitized = query.trim().slice(0, 200);

  // Remove special SQL and NoSQL characters
  sanitized = sanitized.replace(/['"`;\\]/g, '');

  // Remove NULL bytes
  sanitized = sanitized.replace(/\0/g, '');

  return sanitized;
}

/**
 * Validate and sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  const trimmed = email.trim().toLowerCase();

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return '';
  }

  // Remove any HTML
  return sanitizePlainText(trimmed);
}

/**
 * Sanitize object recursively
 * Useful for sanitizing form data or API payloads
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  fieldsToSanitize: (keyof T)[]
): T {
  const sanitized = { ...obj };

  for (const field of fieldsToSanitize) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeUserInput(sanitized[field] as string) as T[keyof T];
    }
  }

  return sanitized;
}
