/**
 * ITSME Callback API Route
 *
 * Handles the OAuth callback from ITSME after user authentication.
 * Exchanges authorization code for tokens, validates ID token,
 * extracts identity claims, and updates user verification status.
 *
 * GET /api/auth/itsme/callback?code=xxx&state=xxx
 *
 * Security:
 * - Validates state parameter against stored value (CSRF protection)
 * - Validates nonce in ID token (replay protection)
 * - Verifies ID token signature via ITSME JWKS
 * - Uses PKCE code verifier for code exchange
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/auth/supabase-server';
import { logger } from '@/lib/security/logger';
import { getClientIdentifier } from '@/lib/security/rate-limiter';
import {
  completeItsmeVerification,
  hashNationalRegisterNumber,
  ItsmeUserClaims,
} from '@/lib/auth/itsme';

// Cookie names (must match authorize route)
const ITSME_STATE_COOKIE = 'itsme_state';
const ITSME_NONCE_COOKIE = 'itsme_nonce';
const ITSME_VERIFIER_COOKIE = 'itsme_verifier';
const ITSME_USER_COOKIE = 'itsme_user_id';

/**
 * Clear ITSME-related cookies
 */
async function clearItsmeCookies() {
  const cookieStore = await cookies();
  const cookieOptions = { path: '/' };

  cookieStore.delete({ name: ITSME_STATE_COOKIE, ...cookieOptions });
  cookieStore.delete({ name: ITSME_NONCE_COOKIE, ...cookieOptions });
  cookieStore.delete({ name: ITSME_VERIFIER_COOKIE, ...cookieOptions });
  cookieStore.delete({ name: ITSME_USER_COOKIE, ...cookieOptions });
}

/**
 * Build redirect URL with optional error
 */
function buildRedirectUrl(
  baseUrl: string,
  returnPath: string,
  error?: string
): URL {
  const url = new URL(returnPath, baseUrl);
  if (error) {
    url.searchParams.set('error', error);
  } else {
    url.searchParams.set('itsme_verified', 'true');
  }
  return url;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const baseUrl = requestUrl.origin;

  // Default return path
  let returnPath = '/settings/verification';

  try {
    // Get authorization code and state from query params
    const code = requestUrl.searchParams.get('code');
    const stateParam = requestUrl.searchParams.get('state');
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');

    // Handle ITSME errors
    if (error) {
      logger.warn('ITSME callback error', {
        error,
        description: errorDescription,
      });

      await clearItsmeCookies();

      return NextResponse.redirect(
        buildRedirectUrl(baseUrl, returnPath, `itsme_${error}`)
      );
    }

    // Validate required params
    if (!code || !stateParam) {
      await clearItsmeCookies();

      return NextResponse.redirect(
        buildRedirectUrl(baseUrl, returnPath, 'missing_params')
      );
    }

    // Get stored values from cookies
    const cookieStore = await cookies();
    const storedState = cookieStore.get(ITSME_STATE_COOKIE)?.value;
    const storedNonce = cookieStore.get(ITSME_NONCE_COOKIE)?.value;
    const storedVerifier = cookieStore.get(ITSME_VERIFIER_COOKIE)?.value;
    const storedUserId = cookieStore.get(ITSME_USER_COOKIE)?.value;

    // Parse state to get original state and return URL
    let parsedState: { state: string; userId: string; returnUrl: string };
    try {
      parsedState = JSON.parse(stateParam);
      if (parsedState.returnUrl) {
        returnPath = parsedState.returnUrl;
      }
    } catch {
      await clearItsmeCookies();

      return NextResponse.redirect(
        buildRedirectUrl(baseUrl, returnPath, 'invalid_state')
      );
    }

    // Validate state (CSRF protection)
    if (!storedState || parsedState.state !== storedState) {
      logger.security('ITSME state mismatch - possible CSRF attack', {
        expected: storedState,
        received: parsedState.state,
      });

      await clearItsmeCookies();

      return NextResponse.redirect(
        buildRedirectUrl(baseUrl, returnPath, 'state_mismatch')
      );
    }

    // Validate we have all required stored values
    if (!storedNonce || !storedVerifier || !storedUserId) {
      await clearItsmeCookies();

      return NextResponse.redirect(
        buildRedirectUrl(baseUrl, returnPath, 'session_expired')
      );
    }

    // Verify user ID matches
    if (parsedState.userId !== storedUserId) {
      logger.security('ITSME user ID mismatch', {
        expected: storedUserId,
        received: parsedState.userId,
      });

      await clearItsmeCookies();

      return NextResponse.redirect(
        buildRedirectUrl(baseUrl, returnPath, 'user_mismatch')
      );
    }

    // Complete ITSME verification (exchange code, validate token, get claims)
    const result = await completeItsmeVerification(code, storedVerifier, storedNonce);

    if (!result.success || !result.claims) {
      logger.error('ITSME verification failed', new Error(result.error || 'Unknown error'), {
        userId: storedUserId,
      });

      await clearItsmeCookies();

      return NextResponse.redirect(
        buildRedirectUrl(baseUrl, returnPath, 'verification_failed')
      );
    }

    const claims = result.claims;

    // Update database with verification status
    await updateUserVerification(storedUserId, claims, request);

    // Clear cookies
    await clearItsmeCookies();

    // Log success
    logger.info('ITSME verification completed', {
      userId: storedUserId,
      itsmeSub: claims.sub,
    });

    // Redirect to success
    return NextResponse.redirect(
      buildRedirectUrl(baseUrl, returnPath)
    );
  } catch (error) {
    logger.error('ITSME callback unexpected error', error as Error);

    await clearItsmeCookies();

    return NextResponse.redirect(
      buildRedirectUrl(baseUrl, returnPath, 'unexpected_error')
    );
  }
}

/**
 * Update user verification status in database
 */
async function updateUserVerification(
  userId: string,
  claims: ItsmeUserClaims,
  request: NextRequest
): Promise<void> {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const clientIp = getClientIdentifier(request);

  // Prepare ITSME data (exclude sensitive fields from raw storage)
  const itsmeData = {
    given_name: claims.given_name,
    family_name: claims.family_name,
    name: claims.name,
    birthdate: claims.birthdate,
    nationality: claims.nationality,
    gender: claims.gender,
    // Don't store email/phone from ITSME - user already has these
    verified_at: now,
  };

  // Hash NRN if present
  const nrnHash = claims.eid ? hashNationalRegisterNumber(claims.eid) : null;

  // Upsert into user_verifications
  const { error: upsertError } = await supabase
    .from('user_verifications')
    .upsert(
      {
        user_id: userId,
        itsme_verified: true,
        itsme_verified_at: now,
        itsme_sub: claims.sub,
        itsme_data: itsmeData,
        itsme_verification_level: 'identification',
        national_register_number_hash: nrnHash,
        id_verified: true, // ITSME provides ID verification
        kyc_status: 'itsme_verified',
        updated_at: now,
      },
      {
        onConflict: 'user_id',
      }
    );

  if (upsertError) {
    throw new Error(`Failed to update user_verifications: ${upsertError.message}`);
  }

  // Optionally update user_profiles with verified name/birthdate
  if (claims.given_name || claims.family_name || claims.birthdate) {
    const profileUpdates: Record<string, string | undefined> = {};

    if (claims.given_name) {
      profileUpdates.first_name = claims.given_name;
    }
    if (claims.family_name) {
      profileUpdates.last_name = claims.family_name;
    }
    if (claims.birthdate) {
      profileUpdates.date_of_birth = claims.birthdate;
    }
    if (claims.nationality) {
      profileUpdates.nationality = claims.nationality;
    }

    await supabase
      .from('user_profiles')
      .update(profileUpdates)
      .eq('user_id', userId);
  }

  // Log in audit
  supabase.rpc('log_verification_change', {
    p_user_id: userId,
    p_verification_type: 'itsme',
    p_action: 'completed',
    p_previous_status: false,
    p_new_status: true,
    p_metadata: {
      itsme_sub: claims.sub,
      has_nrn: !!claims.eid,
      has_birthdate: !!claims.birthdate,
    },
    p_ip_address: clientIp,
    p_user_agent: request.headers.get('user-agent') || null,
  }).then(() => {}, () => {});
}
