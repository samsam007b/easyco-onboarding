/**
 * ITSME Authorization API Route
 *
 * Initiates the ITSME OpenID Connect flow.
 * Generates authorization URL and redirects user to ITSME.
 *
 * GET /api/auth/itsme/authorize?returnUrl=/settings/verification
 *
 * Security:
 * - PKCE (Proof Key for Code Exchange)
 * - State parameter for CSRF protection
 * - Nonce for replay attack prevention
 * - Session-bound verification data
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/auth/supabase-server';
import { logger } from '@/lib/security/logger';
import {
  generateItsmeAuthUrl,
  isItsmeConfigured,
  getItsmeEnvironment,
} from '@/lib/auth/itsme';

// Cookie names for ITSME flow data
const ITSME_STATE_COOKIE = 'itsme_state';
const ITSME_NONCE_COOKIE = 'itsme_nonce';
const ITSME_VERIFIER_COOKIE = 'itsme_verifier';
const ITSME_USER_COOKIE = 'itsme_user_id';

// Cookie options (secure, httpOnly, short-lived)
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 600, // 10 minutes - enough for the ITSME flow
  path: '/',
};

export async function GET(request: NextRequest) {
  try {
    // Check if ITSME is configured
    if (!isItsmeConfigured()) {
      logger.warn('ITSME authorization attempted but not configured');

      return NextResponse.redirect(
        new URL('/settings/verification?error=itsme_not_configured', request.url)
      );
    }

    // Get current user (must be authenticated)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(
        new URL('/auth?redirect=/settings/verification', request.url)
      );
    }

    // Get return URL from query params
    const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/settings/verification';

    // Validate return URL (prevent open redirect)
    const allowedReturnPaths = [
      '/settings/verification',
      '/settings',
      '/onboarding',
      '/dashboard',
    ];

    const isValidReturn = allowedReturnPaths.some(
      path => returnUrl === path || returnUrl.startsWith(path + '/')
    );

    const safeReturnUrl = isValidReturn ? returnUrl : '/settings/verification';

    // Generate ITSME authorization URL with PKCE
    const { url, state, nonce, codeVerifier } = generateItsmeAuthUrl(
      user.id,
      safeReturnUrl
    );

    // Store PKCE and security tokens in secure cookies
    const cookieStore = await cookies();

    cookieStore.set(ITSME_STATE_COOKIE, state, COOKIE_OPTIONS);
    cookieStore.set(ITSME_NONCE_COOKIE, nonce, COOKIE_OPTIONS);
    cookieStore.set(ITSME_VERIFIER_COOKIE, codeVerifier, COOKIE_OPTIONS);
    cookieStore.set(ITSME_USER_COOKIE, user.id, COOKIE_OPTIONS);

    // Log ITSME flow initiation
    logger.info('ITSME verification initiated', {
      userId: user.id,
      environment: getItsmeEnvironment(),
    });

    // Log in audit (fire-and-forget)
    supabase.rpc('log_verification_change', {
      p_user_id: user.id,
      p_verification_type: 'itsme',
      p_action: 'initiated',
      p_metadata: { environment: getItsmeEnvironment() },
    }).then(() => {}, () => {});

    // Redirect to ITSME
    return NextResponse.redirect(url);
  } catch (error) {
    logger.error('ITSME authorization error', error as Error);

    return NextResponse.redirect(
      new URL('/settings/verification?error=itsme_init_failed', request.url)
    );
  }
}
