/**
 * Phone Verification Helpers
 *
 * Provides phone number verification via SMS OTP using Supabase Phone Auth.
 * Supabase uses Twilio under the hood for SMS delivery.
 *
 * Prerequisites:
 * 1. Enable Phone Auth in Supabase Dashboard > Authentication > Providers > Phone
 * 2. Configure Twilio credentials (Account SID, Auth Token, Messaging Service SID)
 *
 * @see https://supabase.com/docs/guides/auth/phone-login
 */

import { createClient } from './supabase-client';

// =============================================================================
// TYPES
// =============================================================================

export interface PhoneVerificationSendResponse {
  success: boolean;
  error?: string;
  /** Masked phone number for display (e.g., +33 6 ** ** ** 78) */
  maskedPhone?: string;
}

export interface PhoneVerificationVerifyResponse {
  success: boolean;
  error?: string;
  /** User ID if verification successful */
  userId?: string;
}

export interface PhoneVerificationStatus {
  isVerified: boolean;
  phoneNumber?: string;
  verifiedAt?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Normalize phone number to E.164 format
 * Converts French formats to international format
 *
 * Examples:
 * - "06 12 34 56 78" -> "+33612345678"
 * - "0612345678" -> "+33612345678"
 * - "+33 6 12 34 56 78" -> "+33612345678"
 * - "+32 475 12 34 56" -> "+32475123456" (Belgian)
 */
export function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters except leading +
  let normalized = phone.replace(/[^\d+]/g, '');

  // Handle French numbers starting with 0
  if (normalized.startsWith('0') && normalized.length === 10) {
    normalized = '+33' + normalized.slice(1);
  }

  // Handle numbers without + prefix that look international
  if (!normalized.startsWith('+') && normalized.length > 10) {
    normalized = '+' + normalized;
  }

  return normalized;
}

/**
 * Mask phone number for display
 * Shows only first 4 and last 2 digits
 *
 * Example: "+33612345678" -> "+33 6 ** ** ** 78"
 */
export function maskPhoneNumber(phone: string): string {
  const normalized = normalizePhoneNumber(phone);

  if (normalized.length < 8) {
    return normalized;
  }

  // Get country code and rest
  const countryCode = normalized.startsWith('+33') ? '+33' :
    normalized.startsWith('+32') ? '+32' :
      normalized.slice(0, 3);

  const number = normalized.slice(countryCode.length);

  if (number.length < 4) {
    return normalized;
  }

  const firstDigit = number[0];
  const lastTwo = number.slice(-2);
  const maskedMiddle = '** ** **';

  return `${countryCode} ${firstDigit} ${maskedMiddle} ${lastTwo}`;
}

/**
 * Validate phone number format
 * Supports French (+33) and Belgian (+32) numbers
 */
export function isValidPhoneNumber(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);

  // French mobile: +33 6/7 XX XX XX XX (10 digits after country code minus leading 0)
  const frenchMobileRegex = /^\+33[67]\d{8}$/;

  // French landline: +33 [1-5] XX XX XX XX
  const frenchLandlineRegex = /^\+33[1-5]\d{8}$/;

  // Belgian mobile: +32 4XX XX XX XX
  const belgianMobileRegex = /^\+324\d{8}$/;

  // Belgian landline: +32 [2-9] XXX XX XX
  const belgianLandlineRegex = /^\+32[2-9]\d{7,8}$/;

  return (
    frenchMobileRegex.test(normalized) ||
    frenchLandlineRegex.test(normalized) ||
    belgianMobileRegex.test(normalized) ||
    belgianLandlineRegex.test(normalized)
  );
}

// =============================================================================
// SEND OTP
// =============================================================================

/**
 * Send OTP to phone number
 *
 * Uses Supabase's signInWithOtp for phone which:
 * - Creates user if doesn't exist (or links to existing)
 * - Sends 6-digit OTP via Twilio SMS
 * - OTP expires after 60 seconds by default
 *
 * @param phoneNumber - Phone number in any format (will be normalized)
 */
export async function sendPhoneOTP(
  phoneNumber: string
): Promise<PhoneVerificationSendResponse> {
  const supabase = createClient();

  try {
    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    // Validate format
    if (!isValidPhoneNumber(normalizedPhone)) {
      return {
        success: false,
        error: 'Format de numéro de téléphone invalide. Utilisez un numéro français (+33) ou belge (+32).',
      };
    }

    // Send OTP via Supabase
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
      options: {
        // Don't create a new user, just send OTP for verification
        // This requires the user to already be logged in
        shouldCreateUser: false,
      },
    });

    if (error) {
      // Handle specific error cases
      if (error.message.includes('rate limit')) {
        return {
          success: false,
          error: 'Trop de tentatives. Veuillez réessayer dans quelques minutes.',
        };
      }

      if (error.message.includes('Phone provider is not enabled')) {
        return {
          success: false,
          error: 'La vérification par téléphone n\'est pas configurée. Contactez le support.',
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      maskedPhone: maskPhoneNumber(normalizedPhone),
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur lors de l\'envoi du SMS',
    };
  }
}

// =============================================================================
// VERIFY OTP
// =============================================================================

/**
 * Verify OTP code sent to phone
 *
 * @param phoneNumber - Phone number that received the OTP
 * @param otpCode - 6-digit OTP code from SMS
 */
export async function verifyPhoneOTP(
  phoneNumber: string,
  otpCode: string
): Promise<PhoneVerificationVerifyResponse> {
  const supabase = createClient();

  try {
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otpCode)) {
      return {
        success: false,
        error: 'Le code doit contenir exactement 6 chiffres.',
      };
    }

    // Verify OTP with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token: otpCode,
      type: 'sms',
    });

    if (error) {
      if (error.message.includes('expired')) {
        return {
          success: false,
          error: 'Le code a expiré. Veuillez demander un nouveau code.',
        };
      }

      if (error.message.includes('invalid')) {
        return {
          success: false,
          error: 'Code incorrect. Veuillez vérifier et réessayer.',
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      userId: data.user?.id,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur de vérification',
    };
  }
}

// =============================================================================
// STATUS & DATABASE UPDATES
// =============================================================================

/**
 * Update phone verification status in user_verifications table
 * Called after successful OTP verification
 *
 * @param userId - User ID to update
 * @param phoneNumber - Verified phone number
 */
export async function updatePhoneVerificationStatus(
  userId: string,
  phoneNumber: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const now = new Date().toISOString();

    // Upsert into user_verifications
    const { error } = await supabase
      .from('user_verifications')
      .upsert(
        {
          user_id: userId,
          phone_verified: true,
          phone_verified_at: now,
          updated_at: now,
        },
        {
          onConflict: 'user_id',
        }
      );

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Also update users table for quick access
    const { error: userError } = await supabase
      .from('users')
      .update({
        phone_number: normalizedPhone,
        phone_verified: true,
      })
      .eq('id', userId);

    if (userError) {
      console.warn('Failed to update users table:', userError.message);
      // Don't fail the whole operation, user_verifications is the source of truth
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur de mise à jour',
    };
  }
}

/**
 * Get phone verification status for current user
 */
export async function getPhoneVerificationStatus(): Promise<PhoneVerificationStatus> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { isVerified: false };
    }

    const { data, error } = await supabase
      .from('user_verifications')
      .select('phone_verified, phone_verified_at')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return { isVerified: false };
    }

    // Get phone number from users table
    const { data: userData } = await supabase
      .from('users')
      .select('phone_number')
      .eq('id', user.id)
      .single();

    return {
      isVerified: data.phone_verified || false,
      phoneNumber: userData?.phone_number || undefined,
      verifiedAt: data.phone_verified_at || undefined,
    };
  } catch {
    return { isVerified: false };
  }
}

// =============================================================================
// RESEND LOGIC
// =============================================================================

/**
 * Check if user can request a new OTP
 * Enforces cooldown period between requests
 *
 * @param lastSentAt - Timestamp of last OTP sent
 * @param cooldownSeconds - Cooldown period in seconds (default: 60)
 */
export function canResendOTP(
  lastSentAt: Date | null,
  cooldownSeconds: number = 60
): { canResend: boolean; remainingSeconds: number } {
  if (!lastSentAt) {
    return { canResend: true, remainingSeconds: 0 };
  }

  const now = new Date();
  const elapsed = Math.floor((now.getTime() - lastSentAt.getTime()) / 1000);
  const remaining = Math.max(0, cooldownSeconds - elapsed);

  return {
    canResend: remaining === 0,
    remainingSeconds: remaining,
  };
}
