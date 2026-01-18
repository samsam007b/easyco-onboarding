/**
 * IBAN VALIDATION (Client-Side)
 *
 * Implements ISO 13616 IBAN validation algorithm
 * SECURITY: VULN-008 fix - Validate IBAN before submission
 *
 * Features:
 * - Format validation (country code, length, check digits)
 * - Mod97 checksum validation (prevents typos)
 * - Auto-formatting with spaces
 * - Country-specific length validation
 *
 * Usage:
 *   import { validateIBAN, formatIBAN } from '@/lib/validation/iban';
 *
 *   const result = validateIBAN('BE68539007547034');
 *   if (!result.valid) {
 *     console.error(result.error);
 *   }
 */

import { z } from 'zod';

// ============================================================================
// COUNTRY LENGTHS (ISO 13616)
// ============================================================================

const IBAN_LENGTHS: Record<string, number> = {
  BE: 16, // Belgium
  FR: 27, // France
  DE: 22, // Germany
  NL: 18, // Netherlands
  LU: 20, // Luxembourg
  GB: 22, // United Kingdom
  IE: 22, // Ireland
  IT: 27, // Italy
  ES: 24, // Spain
  PT: 25, // Portugal
  AT: 20, // Austria
  CH: 21, // Switzerland
  // Add more as needed
};

// ============================================================================
// TYPES
// ============================================================================

export interface IBANValidationResult {
  valid: boolean;
  iban?: string; // Cleaned (no spaces)
  formatted?: string; // With spaces every 4 chars
  country?: string;
  checkDigits?: string;
  error?: string;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate IBAN format and checksum
 * Returns detailed validation result
 */
export function validateIBAN(iban: string): IBANValidationResult {
  // Remove spaces and convert to uppercase
  const cleaned = iban.replace(/\s/g, '').toUpperCase();

  // Basic length check
  if (cleaned.length < 15 || cleaned.length > 34) {
    return {
      valid: false,
      error: 'IBAN doit contenir entre 15 et 34 caractères',
    };
  }

  // Country code (first 2 chars must be letters)
  const countryCode = cleaned.substring(0, 2);
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    return {
      valid: false,
      error: 'Code pays invalide (2 lettres requises)',
    };
  }

  // Check digits (chars 3-4 must be numbers)
  const checkDigits = cleaned.substring(2, 4);
  if (!/^[0-9]{2}$/.test(checkDigits)) {
    return {
      valid: false,
      error: 'Chiffres de contrôle invalides',
    };
  }

  // Country-specific length validation
  const expectedLength = IBAN_LENGTHS[countryCode];
  if (expectedLength && cleaned.length !== expectedLength) {
    return {
      valid: false,
      error: `IBAN ${countryCode} doit contenir ${expectedLength} caractères (trouvé ${cleaned.length})`,
    };
  }

  // Mod97 checksum validation (ISO 13616 algorithm)
  const isValidChecksum = validateMod97(cleaned);
  if (!isValidChecksum) {
    return {
      valid: false,
      error: 'Checksum IBAN invalide (erreur de frappe possible)',
    };
  }

  // All checks passed
  return {
    valid: true,
    iban: cleaned,
    formatted: formatIBAN(cleaned),
    country: countryCode,
    checkDigits: checkDigits,
  };
}

/**
 * Validate IBAN checksum using mod97 algorithm
 * Returns true if checksum is valid
 */
function validateMod97(iban: string): boolean {
  // Move first 4 characters to end
  const rearranged = iban.substring(4) + iban.substring(0, 4);

  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  let numericString = '';
  for (let i = 0; i < rearranged.length; i++) {
    const char = rearranged[i];
    if (/[A-Z]/.test(char)) {
      // A=65 in ASCII, we want A=10, so: charCode - 55
      const code = char.charCodeAt(0) - 55;
      numericString += code.toString();
    } else {
      numericString += char;
    }
  }

  // Calculate mod 97 (BigInt for large numbers)
  const remainder = mod97(numericString);

  // Valid IBAN has remainder = 1
  return remainder === 1;
}

/**
 * Calculate mod 97 for very large numbers (string representation)
 * Uses incremental mod97 to avoid BigInt size limits
 */
function mod97(numericString: string): number {
  let remainder = 0;

  // Process string in chunks to avoid overflow
  for (let i = 0; i < numericString.length; i++) {
    const digit = parseInt(numericString[i], 10);
    remainder = (remainder * 10 + digit) % 97;
  }

  return remainder;
}

/**
 * Format IBAN with spaces every 4 characters
 * Example: BE68539007547034 → BE68 5390 0754 7034
 */
export function formatIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  const formatted: string[] = [];

  for (let i = 0; i < cleaned.length; i += 4) {
    formatted.push(cleaned.substring(i, i + 4));
  }

  return formatted.join(' ');
}

/**
 * Mask IBAN for display
 * Example: BE68539007547034 → BE68 **** **** 7034
 */
export function maskIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();

  if (cleaned.length < 8) {
    return '****';
  }

  const first4 = cleaned.substring(0, 4);
  const last4 = cleaned.substring(cleaned.length - 4);
  const middleLength = cleaned.length - 8;
  const middle = '*'.repeat(Math.min(middleLength, 12)); // Max 12 asterisks

  return formatIBAN(first4 + middle + last4);
}

// ============================================================================
// ZOD SCHEMA (for form validation)
// ============================================================================

/**
 * Zod schema for IBAN validation (use in forms)
 *
 * Usage with React Hook Form:
 *   const formSchema = z.object({
 *     iban: ibanSchema,
 *   });
 */
export const ibanSchema = z.string()
  .min(15, 'IBAN trop court')
  .max(34, 'IBAN trop long')
  .transform(val => val.replace(/\s/g, '').toUpperCase())
  .refine(val => /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(val), {
    message: 'Format IBAN invalide',
  })
  .refine(val => {
    const result = validateIBAN(val);
    return result.valid;
  }, {
    message: 'Checksum IBAN invalide (vérifiez les chiffres)',
  });

// ============================================================================
// COUNTRY INFO (for UI display)
// ============================================================================

export const IBAN_COUNTRIES = {
  BE: { name: 'Belgique', length: 16, flag: '🇧🇪' },
  FR: { name: 'France', length: 27, flag: '🇫🇷' },
  DE: { name: 'Allemagne', length: 22, flag: '🇩🇪' },
  NL: { name: 'Pays-Bas', length: 18, flag: '🇳🇱' },
  LU: { name: 'Luxembourg', length: 20, flag: '🇱🇺' },
  GB: { name: 'Royaume-Uni', length: 22, flag: '🇬🇧' },
} as const;

export function getCountryInfo(iban: string): typeof IBAN_COUNTRIES[keyof typeof IBAN_COUNTRIES] | null {
  const country = iban.substring(0, 2).toUpperCase();
  return IBAN_COUNTRIES[country as keyof typeof IBAN_COUNTRIES] || null;
}

// ============================================================================
// EXAMPLES
// ============================================================================

/**
 * Example usage in a form component:
 *
 * import { validateIBAN, formatIBAN, ibanSchema } from '@/lib/validation/iban';
 * import { useForm } from 'react-hook-form';
 * import { zodResolver } from '@hookform/resolvers/zod';
 *
 * const formSchema = z.object({ iban: ibanSchema });
 *
 * const form = useForm({
 *   resolver: zodResolver(formSchema),
 * });
 *
 * // On blur, format IBAN
 * const handleBlur = (e) => {
 *   const formatted = formatIBAN(e.target.value);
 *   form.setValue('iban', formatted);
 * };
 *
 * // On submit, validate again
 * const onSubmit = async (data) => {
 *   const result = validateIBAN(data.iban);
 *   if (!result.valid) {
 *     toast.error(result.error);
 *     return;
 *   }
 *
 *   // Call API with validated IBAN
 *   await supabase.rpc('store_iban_encrypted_validated', {
 *     p_user_id: user.id,
 *     p_iban: result.iban,
 *   });
 * };
 */
