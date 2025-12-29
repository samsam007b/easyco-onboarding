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
 * Trusted domains for embed codes (virtual tours, videos, etc.)
 */
const TRUSTED_EMBED_DOMAINS = [
  'matterport.com',
  'my.matterport.com',
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
  'vimeo.com',
  'kuula.co',
  'www.kuula.co',
  'cloudpano.com',
  'www.cloudpano.com',
  '3dvista.com',
  'www.3dvista.com',
  'roundme.com',
  'www.roundme.com',
];

/**
 * Extract and validate iframe src URL from embed code
 * Returns the URL if valid and from a trusted domain, null otherwise
 */
export function extractTrustedIframeSrc(embedCode: string): string | null {
  if (!embedCode) return null;

  // Parse the embed code to extract src attribute
  const srcMatch = embedCode.match(/src\s*=\s*["']([^"']+)["']/i);
  if (!srcMatch || !srcMatch[1]) return null;

  const src = srcMatch[1];

  try {
    const url = new URL(src);

    // Check if the domain is trusted
    const hostname = url.hostname.toLowerCase();
    const isTrusted = TRUSTED_EMBED_DOMAINS.some(
      domain => hostname === domain || hostname.endsWith('.' + domain)
    );

    if (!isTrusted) {
      console.warn(`[Security] Blocked untrusted embed domain: ${hostname}`);
      return null;
    }

    // Only allow https
    if (url.protocol !== 'https:') {
      console.warn(`[Security] Blocked non-HTTPS embed URL: ${src}`);
      return null;
    }

    return src;
  } catch {
    console.warn(`[Security] Invalid embed URL: ${src}`);
    return null;
  }
}

/**
 * Sanitize embed code for virtual tours and videos
 * Only allows iframe tags with specific safe attributes from trusted domains
 *
 * @param embedCode - The raw embed code (typically HTML with iframe)
 * @returns Sanitized embed code or null if invalid/unsafe
 */
export function sanitizeEmbedCode(embedCode: string): string | null {
  if (!embedCode) return null;

  // Extract the iframe src from trusted domain
  const trustedSrc = extractTrustedIframeSrc(embedCode);
  if (!trustedSrc) return null;

  // Instead of using dangerous raw HTML, return only the validated URL
  // The component should construct a safe iframe with this URL
  return trustedSrc;
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
