/**
 * Password Re-verification Utility
 * SECURITY FIX: VULN-002 - Client-side password verification for sensitive operations
 *
 * Flow:
 * 1. Call `verifyPassword()` with user's password
 * 2. If successful, calls `record_password_verification` in database
 * 3. Sensitive operations can then proceed (within 5 minute window)
 */

import { createClient } from '@/lib/auth/supabase-client';

export interface VerificationResult {
  success: boolean;
  error?: string;
  expiresAt?: Date;
  verificationId?: string;
}

/**
 * Verify user's password and record verification in database
 * Must be called before any sensitive operation (bank info, admin actions)
 *
 * @param password - User's current password
 * @returns VerificationResult with success status and expiry time
 */
export async function verifyPassword(password: string): Promise<VerificationResult> {
  const supabase = createClient();

  try {
    // Step 1: Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      return {
        success: false,
        error: 'NOT_AUTHENTICATED',
      };
    }

    // Step 2: Re-authenticate with Supabase Auth
    // This verifies the password is correct
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (reauthError) {
      console.warn('[Security] Password verification failed:', reauthError.message);
      return {
        success: false,
        error: reauthError.message === 'Invalid login credentials'
          ? 'INVALID_PASSWORD'
          : 'VERIFICATION_FAILED',
      };
    }

    // Step 3: Record verification in database
    // This creates a time-limited token for sensitive operations
    const { data, error: recordError } = await supabase.rpc('record_password_verification', {
      p_ip_address: null, // Can be passed from request headers in API routes
      p_user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
      p_verification_type: 'password',
    });

    if (recordError) {
      console.error('[Security] Failed to record verification:', recordError);
      return {
        success: false,
        error: 'RECORD_FAILED',
      };
    }

    return {
      success: true,
      verificationId: data?.verification_id,
      expiresAt: data?.expires_at ? new Date(data.expires_at) : undefined,
    };
  } catch (err) {
    console.error('[Security] Password verification error:', err);
    return {
      success: false,
      error: 'UNEXPECTED_ERROR',
    };
  }
}

/**
 * Check if user has a valid (recent) password verification
 * Use this to show/hide UI elements for sensitive operations
 *
 * @param maxAgeSeconds - Maximum age of verification in seconds (default: 300 = 5 min)
 * @returns true if user has valid verification
 */
export async function hasValidVerification(maxAgeSeconds: number = 300): Promise<boolean> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc('has_valid_password_verification', {
      p_max_age_seconds: maxAgeSeconds,
    });

    if (error) {
      console.error('[Security] Error checking verification:', error);
      return false;
    }

    return data === true;
  } catch (err) {
    console.error('[Security] Verification check error:', err);
    return false;
  }
}

/**
 * Higher-order function to wrap sensitive operations with password verification
 *
 * @example
 * const updateBankInfo = withPasswordVerification(async () => {
 *   // Your sensitive operation
 * });
 *
 * // Later:
 * const result = await updateBankInfo(password);
 */
export function withPasswordVerification<T>(
  operation: () => Promise<T>
): (password: string) => Promise<{ success: boolean; data?: T; error?: string }> {
  return async (password: string) => {
    // First verify password
    const verification = await verifyPassword(password);

    if (!verification.success) {
      return {
        success: false,
        error: verification.error,
      };
    }

    // Then perform the operation
    try {
      const data = await operation();
      return {
        success: true,
        data,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Operation failed',
      };
    }
  };
}

/**
 * Error messages for verification failures
 */
export const VERIFICATION_ERRORS: Record<string, string> = {
  NOT_AUTHENTICATED: 'Tu dois être connecté pour effectuer cette action',
  INVALID_PASSWORD: 'Mot de passe incorrect',
  VERIFICATION_FAILED: 'La vérification a échoué',
  RECORD_FAILED: 'Erreur lors de l\'enregistrement de la vérification',
  UNEXPECTED_ERROR: 'Une erreur inattendue est survenue',
  VERIFICATION_REQUIRED: 'Vérification du mot de passe requise',
  COOLDOWN_ACTIVE: 'Veuillez attendre 24h entre les modifications',
};
