/**
 * Honeypot Protection Utility
 *
 * Simple but effective bot detection using hidden form fields.
 * Bots typically fill all fields, while humans don't see/fill hidden fields.
 *
 * Usage:
 * 1. Add <HoneypotField /> to your form
 * 2. Check with validateHoneypot(formData) on submit
 */

// =====================================================
// CONSTANTS
// =====================================================

// Field names that look attractive to bots but are actually traps
export const HONEYPOT_FIELD_NAMES = [
  'website',
  'url',
  'homepage',
  'company_website',
  'fax',
  'phone2',
  'address2',
] as const;

// Default field name
export const DEFAULT_HONEYPOT_FIELD = 'website';

// Time-based protection: forms filled too quickly are likely bots
export const MIN_FORM_FILL_TIME_MS = 2000; // 2 seconds minimum

// =====================================================
// VALIDATION FUNCTIONS
// =====================================================

interface HoneypotValidationResult {
  isBot: boolean;
  reason?: string;
}

/**
 * Validate honeypot field - should be empty for legitimate users
 */
export function validateHoneypot(
  fieldValue: string | undefined | null,
  fieldName: string = DEFAULT_HONEYPOT_FIELD
): HoneypotValidationResult {
  if (fieldValue && fieldValue.trim() !== '') {
    console.warn(`[Honeypot] Bot detected - ${fieldName} field filled: "${fieldValue.substring(0, 50)}..."`);
    return {
      isBot: true,
      reason: `honeypot_filled:${fieldName}`,
    };
  }

  return { isBot: false };
}

/**
 * Validate form submission timing
 * Forms filled too quickly are likely automated
 */
export function validateFormTiming(
  formLoadTimestamp: number,
  minFillTimeMs: number = MIN_FORM_FILL_TIME_MS
): HoneypotValidationResult {
  const now = Date.now();
  const fillTimeMs = now - formLoadTimestamp;

  if (fillTimeMs < minFillTimeMs) {
    console.warn(`[Honeypot] Bot detected - form filled too quickly: ${fillTimeMs}ms`);
    return {
      isBot: true,
      reason: `too_fast:${fillTimeMs}ms`,
    };
  }

  return { isBot: false };
}

/**
 * Combined honeypot validation
 */
export function validateHoneypotAndTiming(
  honeypotValue: string | undefined | null,
  formLoadTimestamp?: number,
  options?: {
    honeypotFieldName?: string;
    minFillTimeMs?: number;
  }
): HoneypotValidationResult {
  // Check honeypot field
  const honeypotCheck = validateHoneypot(
    honeypotValue,
    options?.honeypotFieldName || DEFAULT_HONEYPOT_FIELD
  );

  if (honeypotCheck.isBot) {
    return honeypotCheck;
  }

  // Check timing if timestamp provided
  if (formLoadTimestamp) {
    const timingCheck = validateFormTiming(
      formLoadTimestamp,
      options?.minFillTimeMs || MIN_FORM_FILL_TIME_MS
    );

    if (timingCheck.isBot) {
      return timingCheck;
    }
  }

  return { isBot: false };
}

// =====================================================
// REACT COMPONENT HELPERS
// =====================================================

/**
 * CSS styles to hide honeypot field
 * Using multiple techniques to ensure invisibility
 */
export const HONEYPOT_STYLES = {
  position: 'absolute' as const,
  left: '-9999px',
  top: '-9999px',
  width: '1px',
  height: '1px',
  opacity: 0,
  overflow: 'hidden',
  pointerEvents: 'none' as const,
  tabIndex: -1,
};

/**
 * Generate hidden field props for React
 */
export function getHoneypotFieldProps(fieldName: string = DEFAULT_HONEYPOT_FIELD) {
  return {
    name: fieldName,
    id: `hp_${fieldName}`,
    type: 'text' as const,
    autoComplete: 'off',
    tabIndex: -1,
    'aria-hidden': true,
    style: HONEYPOT_STYLES,
  };
}

// =====================================================
// SERVER-SIDE HELPERS
// =====================================================

/**
 * Extract and validate honeypot from FormData
 */
export function checkFormDataHoneypot(
  formData: FormData,
  fieldName: string = DEFAULT_HONEYPOT_FIELD
): HoneypotValidationResult {
  const value = formData.get(fieldName);
  return validateHoneypot(value as string | null);
}

/**
 * Extract and validate honeypot from request body
 */
export function checkRequestBodyHoneypot(
  body: Record<string, unknown>,
  fieldName: string = DEFAULT_HONEYPOT_FIELD
): HoneypotValidationResult {
  const value = body[fieldName];
  return validateHoneypot(value as string | undefined);
}
