/**
 * Phone OTP Verify API Route
 *
 * Verifies the 6-digit OTP code sent via SMS.
 * Updates user_verifications and users tables on success.
 *
 * POST /api/auth/phone/verify-otp
 * Body: { phoneNumber: string, code: string }
 *
 * Rate limited: 5 attempts per 10 minutes per phone number
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import {
  checkRateLimit,
  getClientIdentifier,
  createRateLimitHeaders,
} from '@/lib/security/rate-limiter';
import { logger } from '@/lib/security/logger';
import {
  normalizePhoneNumber,
  isValidPhoneNumber,
  maskPhoneNumber,
} from '@/lib/auth/phone-verification';

// Rate limit config for OTP verification attempts
const VERIFY_OTP_RATE_LIMIT = {
  limit: 5,       // 5 attempts
  window: 600,    // per 10 minutes (in seconds)
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, code } = body;

    // Validate inputs
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { error: 'Le numéro de téléphone est requis.' },
        { status: 400 }
      );
    }

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Le code de vérification est requis.' },
        { status: 400 }
      );
    }

    // Validate code format (6 digits)
    const cleanCode = code.replace(/\s/g, '');
    if (!/^\d{6}$/.test(cleanCode)) {
      return NextResponse.json(
        { error: 'Le code doit contenir exactement 6 chiffres.' },
        { status: 400 }
      );
    }

    // Normalize and validate phone number
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    if (!isValidPhoneNumber(normalizedPhone)) {
      return NextResponse.json(
        { error: 'Format de numéro invalide.' },
        { status: 400 }
      );
    }

    // Get client IP
    const clientIp = getClientIdentifier(request);

    // Rate limit verification attempts per phone
    const rateLimitResult = await checkRateLimit(
      `phone-verify:${normalizedPhone}`,
      'phone_verify',
      VERIFY_OTP_RATE_LIMIT.limit,
      VERIFY_OTP_RATE_LIMIT.window
    );

    if (!rateLimitResult.success) {
      logger.security('Phone verification rate limit exceeded', {
        phone: maskPhoneNumber(normalizedPhone),
        ip: clientIp,
      });

      return NextResponse.json(
        {
          error: 'Trop de tentatives. Veuillez demander un nouveau code.',
        },
        {
          status: 429,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // Get current user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour vérifier votre téléphone.' },
        { status: 401 }
      );
    }

    // Verify OTP with Supabase
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token: cleanCode,
      type: 'sms',
    });

    if (verifyError) {
      logger.warn('Phone OTP verification failed', {
        userId: user.id,
        phone: maskPhoneNumber(normalizedPhone),
        error: verifyError.message,
      });

      // Log failed attempt (fire-and-forget)
      supabase.rpc('log_verification_change', {
        p_user_id: user.id,
        p_verification_type: 'phone',
        p_action: 'failed',
        p_previous_status: false,
        p_new_status: false,
        p_error_message: verifyError.message,
        p_ip_address: clientIp,
        p_user_agent: request.headers.get('user-agent') || null,
      }).then(() => {}, () => {});

      // Handle specific errors
      if (verifyError.message.includes('expired') || verifyError.message.includes('Token has expired')) {
        return NextResponse.json(
          { error: 'Le code a expiré. Veuillez demander un nouveau code.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Code incorrect. Veuillez vérifier et réessayer.' },
        { status: 400 }
      );
    }

    // OTP verified successfully - update database
    const now = new Date().toISOString();

    // Upsert into user_verifications
    const { error: upsertError } = await supabase
      .from('user_verifications')
      .upsert(
        {
          user_id: user.id,
          phone_verified: true,
          phone_verified_at: now,
          updated_at: now,
        },
        {
          onConflict: 'user_id',
        }
      );

    if (upsertError) {
      logger.error('Failed to update user_verifications', upsertError, {
        userId: user.id,
      });

      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour. Veuillez réessayer.' },
        { status: 500 }
      );
    }

    // Update users table
    await supabase
      .from('users')
      .update({
        phone_number: normalizedPhone,
        phone_verified: true,
      })
      .eq('id', user.id);

    // Log successful verification
    logger.info('Phone verification completed', {
      userId: user.id,
      phone: maskPhoneNumber(normalizedPhone),
    });

    // Log in audit (fire-and-forget)
    supabase.rpc('log_verification_change', {
      p_user_id: user.id,
      p_verification_type: 'phone',
      p_action: 'completed',
      p_previous_status: false,
      p_new_status: true,
      p_metadata: { phone_masked: maskPhoneNumber(normalizedPhone) },
      p_ip_address: clientIp,
      p_user_agent: request.headers.get('user-agent') || null,
    }).then(() => {}, () => {});

    return NextResponse.json({
      success: true,
      message: 'Numéro de téléphone vérifié avec succès!',
      phoneVerified: true,
      verifiedAt: now,
    });
  } catch (error) {
    logger.error('Unexpected error in phone OTP verify', error as Error);

    return NextResponse.json(
      { error: 'Une erreur inattendue s\'est produite.' },
      { status: 500 }
    );
  }
}
