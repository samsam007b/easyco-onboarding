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
 * Maximum image dimension for AI processing
 * Larger images are resized to fit within this limit
 */
const MAX_IMAGE_DIMENSION = 1600; // Reduces file size while maintaining quality

/**
 * Target image quality for compression (0-1)
 * Lower = smaller file size, 0.75-0.85 is good for receipts
 */
const IMAGE_QUALITY = 0.80;

/**
 * Maximum base64 size after compression (in bytes)
 * ~2.5MB to stay well under the 4MB API body limit
 */
const MAX_BASE64_SIZE = 2.5 * 1024 * 1024;

/**
 * Sanitize and compress an image
 * - Strips all metadata (EXIF data: GPS location, device info, etc.)
 * - Resizes large images to reduce file size
 * - Compresses to fit within API body limits
 */
export async function sanitizeImage(imageBase64: string, mimeType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions if image is too large
      let width = img.width;
      let height = img.height;

      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
        console.log(`[AI Sandbox] 📐 Resizing image from ${img.width}x${img.height} to ${width}x${height}`);
      }

      // Create canvas with new dimensions
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to create canvas context'));
        return;
      }

      // Draw image (this strips all metadata)
      ctx.drawImage(img, 0, 0, width, height);

      // Try compression at different quality levels
      let quality = IMAGE_QUALITY;
      let cleanBase64 = '';

      do {
        const cleanDataUrl = canvas.toDataURL('image/jpeg', quality);
        cleanBase64 = cleanDataUrl.split(',')[1];

        if (cleanBase64.length > MAX_BASE64_SIZE && quality > 0.5) {
          quality -= 0.1;
          console.log(`[AI Sandbox] 🔄 Recompressing at quality ${quality.toFixed(2)} (size: ${Math.round(cleanBase64.length / 1024)}KB)`);
        } else {
          break;
        }
      } while (quality > 0.5);

      const finalSizeKB = Math.round(cleanBase64.length / 1024);
      console.log(`[AI Sandbox] 🔒 Image sanitized - ${finalSizeKB}KB, quality: ${quality.toFixed(2)}`);
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
