/**
 * MFA (Multi-Factor Authentication) Helpers
 *
 * Provides TOTP-based MFA using Supabase Auth.
 * FREE with Supabase - no additional cost.
 *
 * @see https://supabase.com/docs/guides/auth/auth-mfa
 */

import { createClient } from './supabase-client';
import { SupabaseClient } from '@supabase/supabase-js';

// =============================================================================
// TYPES
// =============================================================================

export interface MFAFactor {
  id: string;
  type: 'totp';
  friendly_name?: string;
  created_at: string;
  updated_at: string;
  status: 'verified' | 'unverified';
}

export interface MFAEnrollResponse {
  success: boolean;
  factorId?: string;
  qrCode?: string;
  secret?: string;
  error?: string;
}

export interface MFAVerifyResponse {
  success: boolean;
  error?: string;
}

export interface MFAChallengeResponse {
  success: boolean;
  challengeId?: string;
  error?: string;
}

export interface MFAStatus {
  enabled: boolean;
  factors: MFAFactor[];
  currentLevel: 'aal1' | 'aal2';
  nextLevel: 'aal1' | 'aal2' | null;
}

// =============================================================================
// MFA ENROLLMENT
// =============================================================================

/**
 * Start MFA enrollment - generates QR code and secret
 * User must scan QR code with authenticator app (Google Authenticator, Authy, etc.)
 */
export async function enrollMFA(
  friendlyName: string = 'Authenticator App'
): Promise<MFAEnrollResponse> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur lors de l\'inscription MFA',
    };
  }
}

/**
 * Verify MFA enrollment with TOTP code from authenticator app
 * This completes the enrollment process
 */
export async function verifyMFAEnrollment(
  factorId: string,
  code: string
): Promise<MFAVerifyResponse> {
  const supabase = createClient();

  try {
    // First, create a challenge for the factor
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    });

    if (challengeError) {
      return {
        success: false,
        error: challengeError.message,
      };
    }

    // Then verify with the code
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    });

    if (verifyError) {
      return {
        success: false,
        error: verifyError.message,
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur de vérification',
    };
  }
}

// =============================================================================
// MFA AUTHENTICATION
// =============================================================================

/**
 * Create a challenge for MFA verification during login
 */
export async function createMFAChallenge(
  factorId: string
): Promise<MFAChallengeResponse> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      challengeId: data.id,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur de challenge MFA',
    };
  }
}

/**
 * Verify MFA code during login (after challenge is created)
 */
export async function verifyMFACode(
  factorId: string,
  challengeId: string,
  code: string
): Promise<MFAVerifyResponse> {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Code invalide',
    };
  }
}

// =============================================================================
// MFA STATUS & MANAGEMENT
// =============================================================================

/**
 * Get current MFA status for the user
 */
export async function getMFAStatus(): Promise<MFAStatus> {
  const supabase = createClient();

  try {
    // Get assurance level
    const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (aalError) {
      return {
        enabled: false,
        factors: [],
        currentLevel: 'aal1',
        nextLevel: null,
      };
    }

    // Get enrolled factors
    const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();

    if (factorsError) {
      return {
        enabled: false,
        factors: [],
        currentLevel: aalData.currentLevel || 'aal1',
        nextLevel: aalData.nextLevel || null,
      };
    }

    // Filter to only verified TOTP factors and map to our interface
    const verifiedFactors: MFAFactor[] = (factorsData.totp || [])
      .filter((f) => f.status === 'verified')
      .map((f) => ({
        id: f.id,
        type: 'totp' as const,
        friendly_name: f.friendly_name,
        created_at: f.created_at,
        updated_at: f.updated_at,
        status: f.status as 'verified' | 'unverified',
      }));

    return {
      enabled: verifiedFactors.length > 0,
      factors: verifiedFactors,
      currentLevel: aalData.currentLevel || 'aal1',
      nextLevel: aalData.nextLevel || null,
    };
  } catch {
    return {
      enabled: false,
      factors: [],
      currentLevel: 'aal1',
      nextLevel: null,
    };
  }
}

/**
 * Unenroll (remove) an MFA factor
 */
export async function unenrollMFA(factorId: string): Promise<MFAVerifyResponse> {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.mfa.unenroll({
      factorId,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur lors de la suppression',
    };
  }
}

/**
 * Check if user needs to complete MFA verification
 * Returns true if user has MFA enabled but hasn't verified yet in this session
 */
export async function needsMFAVerification(): Promise<boolean> {
  const status = await getMFAStatus();

  // User has MFA enabled but current level is aal1 (not verified)
  // and next level should be aal2
  return status.enabled && status.currentLevel === 'aal1' && status.nextLevel === 'aal2';
}

/**
 * Get the first verified factor for MFA verification
 */
export async function getFirstVerifiedFactor(): Promise<MFAFactor | null> {
  const status = await getMFAStatus();
  return status.factors[0] || null;
}

// =============================================================================
// SERVER-SIDE HELPERS (for API routes)
// =============================================================================

/**
 * Check MFA status from server-side with provided Supabase client
 */
export async function checkMFAStatusServer(
  supabase: SupabaseClient
): Promise<{ currentLevel: 'aal1' | 'aal2'; requiresMFA: boolean }> {
  try {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (error) {
      return { currentLevel: 'aal1', requiresMFA: false };
    }

    return {
      currentLevel: data.currentLevel || 'aal1',
      requiresMFA: data.nextLevel === 'aal2' && data.currentLevel === 'aal1',
    };
  } catch {
    return { currentLevel: 'aal1', requiresMFA: false };
  }
}
