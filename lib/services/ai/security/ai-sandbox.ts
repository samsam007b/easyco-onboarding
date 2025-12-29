/**
 * AI Sandbox - Security Layer for AI Calls
 *
 * PRINCIPLE: Zero Trust AI
 * - Never send client data to AI providers
 * - Anonymize everything before sending
 * - Only send raw image bytes + minimal prompt
 * - No user IDs, property IDs, names, or context
 * - Switch providers BEFORE hitting paid limits
 */

import { AIProvider } from '../types';

/**
 * Security configuration for AI sandbox
 */
export const AI_SECURITY_CONFIG = {
  // Maximum percentage of free tier to use before switching (80%)
  SWITCH_THRESHOLD: 0.8,

  // Never send these in prompts
  FORBIDDEN_PATTERNS: [
    /user[_-]?id/i,
    /property[_-]?id/i,
    /email/i,
    /phone/i,
    /address/i,
    /name\s*:/i,
    /iban/i,
    /account/i,
  ],

  // Strip these from images (EXIF data)
  STRIP_METADATA: true,

  // Log AI calls for security audit (without data)
  AUDIT_LOGGING: true,
};

/**
 * Sanitize an image by stripping all metadata
 * This removes EXIF data (GPS location, device info, etc.)
 */
export async function sanitizeImage(imageBase64: string, mimeType: string): Promise<string> {
  // Create a canvas to strip metadata
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      // Create canvas with same dimensions
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to create canvas context'));
        return;
      }

      // Draw image (this strips all metadata)
      ctx.drawImage(img, 0, 0);

      // Convert back to base64 (clean, no metadata)
      const cleanDataUrl = canvas.toDataURL(mimeType, 0.92);
      const cleanBase64 = cleanDataUrl.split(',')[1];

      console.log('[AI Sandbox] 🔒 Image sanitized - metadata stripped');
      resolve(cleanBase64);
    };

    img.onerror = () => reject(new Error('Failed to load image for sanitization'));
    img.src = `data:${mimeType};base64,${imageBase64}`;
  });
}

/**
 * Create a minimal, anonymous prompt for OCR
 * NEVER include any context about the user or property
 */
export function createAnonymousOCRPrompt(): string {
  // Ultra-minimal prompt - just extraction, no context
  return `Extract from this receipt image. Return JSON only:
{"merchant":"name","total":0.00,"date":"YYYY-MM-DD","items":[{"name":"item","quantity":1,"total_price":0.00}],"category":"groceries|cleaning|utilities|internet|rent|entertainment|transport|health|other","confidence":0.9}`;
}

/**
 * Create a minimal prompt for categorization
 * Only includes the expense description, nothing else
 */
export function createAnonymousCategoryPrompt(description: string): string {
  // Sanitize the description first
  const safeDescription = sanitizeText(description);

  return `Categorize: "${safeDescription}"
Return: {"category":"groceries|cleaning|utilities|internet|rent|entertainment|transport|health|other","confidence":0.9}`;
}

/**
 * Sanitize text to remove any potential PII
 */
export function sanitizeText(text: string): string {
  let sanitized = text;

  // Remove email addresses
  sanitized = sanitized.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL]');

  // Remove phone numbers (various formats)
  sanitized = sanitized.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}/g, '[PHONE]');

  // Remove IBAN
  sanitized = sanitized.replace(/[A-Z]{2}\d{2}[A-Z0-9]{4,}/gi, '[IBAN]');

  // Remove potential addresses (street numbers)
  sanitized = sanitized.replace(/\d{1,5}\s+[A-Za-z]+\s+(street|rue|avenue|blvd|straat|laan)/gi, '[ADDRESS]');

  // Limit length to prevent data leakage
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200) + '...';
  }

  return sanitized;
}

/**
 * Validate that a prompt doesn't contain forbidden patterns
 */
export function validatePrompt(prompt: string): boolean {
  for (const pattern of AI_SECURITY_CONFIG.FORBIDDEN_PATTERNS) {
    if (pattern.test(prompt)) {
      console.error(`[AI Sandbox] ⚠️ BLOCKED: Prompt contains forbidden pattern: ${pattern}`);
      return false;
    }
  }
  return true;
}

/**
 * Log AI call for security audit (without sensitive data)
 */
export function auditLog(action: string, provider: AIProvider, metadata: Record<string, any> = {}): void {
  if (!AI_SECURITY_CONFIG.AUDIT_LOGGING) return;

  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    provider,
    // Never log actual data, just metadata
    imageSize: metadata.imageSize,
    promptLength: metadata.promptLength,
    success: metadata.success,
    latencyMs: metadata.latencyMs,
    // NO user IDs, NO property IDs, NO actual content
  };

  console.log('[AI Audit]', JSON.stringify(logEntry));

  // In production, send to secure logging service
  // await secureLogger.log(logEntry);
}

/**
 * Check if provider should be switched (approaching paid limit)
 */
export function shouldSwitchProvider(used: number, limit: number): boolean {
  const usageRatio = used / limit;
  return usageRatio >= AI_SECURITY_CONFIG.SWITCH_THRESHOLD;
}

/**
 * Get the safest available provider (most quota remaining)
 */
export function getSafestProvider(
  usage: Record<AIProvider, { used: number; limit: number }>
): AIProvider | null {
  // Providers in order of preference for vision
  const visionProviders: AIProvider[] = ['gemini', 'together', 'tesseract'];

  for (const provider of visionProviders) {
    const stats = usage[provider];
    if (stats && !shouldSwitchProvider(stats.used, stats.limit)) {
      return provider;
    }
  }

  // Tesseract is always safe (local, unlimited)
  return 'tesseract';
}

/**
 * Security headers for AI API calls
 * Minimizes information sent to providers
 */
export function getSecureHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    // Don't send any identifying headers
    // No User-Agent customization
    // No Referer
  };
}
