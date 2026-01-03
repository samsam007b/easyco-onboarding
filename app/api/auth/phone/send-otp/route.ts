/**
 * Phone OTP Send API Route
 *
 * Sends a 6-digit OTP via SMS to the provided phone number.
 * Uses Supabase Phone Auth (Twilio backend).
 *
 * POST /api/auth/phone/send-otp
 * Body: { phoneNumber: string }
 *
 * Rate limited: 3 requests per hour per phone number
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
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';

// Rate limit config for phone OTP
const PHONE_OTP_RATE_LIMIT = {
  limit: 3,        // 3 OTPs
  window: 3600,    // per hour (in seconds)
};

export async function POST(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    const body = await request.json();
    const { phoneNumber } = body;

    // Validate phone number presence
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { error: apiT('phone.phoneRequired', lang) },
        { status: 400 }
      );
    }

    // Normalize and validate phone number
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    if (!isValidPhoneNumber(normalizedPhone)) {
      return NextResponse.json(
        { error: apiT('phone.invalidFormat', lang) },
        { status: 400 }
      );
    }

    // Get client IP for logging
    const clientIp = getClientIdentifier(request);

    // Rate limit per phone number (prevent SMS bombing)
    const phoneLimitResult = await checkRateLimit(
      `phone-otp:${normalizedPhone}`,
      'phone_otp',
      PHONE_OTP_RATE_LIMIT.limit,
      PHONE_OTP_RATE_LIMIT.window
    );

    if (!phoneLimitResult.success) {
      logger.security('Phone OTP rate limit exceeded', {
        phone: maskPhoneNumber(normalizedPhone),
        ip: clientIp,
      });

      return NextResponse.json(
        { error: apiT('phone.tooManyCodesToNumber', lang) },
        {
          status: 429,
          headers: createRateLimitHeaders(phoneLimitResult),
        }
      );
    }

    // Also rate limit per IP (prevent abuse from single source)
    const ipLimitResult = await checkRateLimit(
      `phone-otp-ip:${clientIp}`,
      'phone_otp_ip',
      10,    // 10 OTPs per IP
      3600   // per hour
    );

    if (!ipLimitResult.success) {
      logger.security('Phone OTP IP rate limit exceeded', {
        ip: clientIp,
      });

      return NextResponse.json(
        { error: apiT('phone.tooManyAttemptsFromIP', lang) },
        {
          status: 429,
          headers: createRateLimitHeaders(ipLimitResult),
        }
      );
    }

    // Get current user (must be authenticated)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: apiT('phone.mustBeLoggedIn', lang) },
        { status: 401 }
      );
    }

    // Send OTP via Supabase Phone Auth
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
      options: {
        shouldCreateUser: false,
      },
    });

    if (otpError) {
      logger.error('Failed to send phone OTP', otpError, {
        userId: user.id,
        phone: maskPhoneNumber(normalizedPhone),
      });

      // Handle specific errors
      if (otpError.message.includes('Phone provider is not enabled')) {
        return NextResponse.json(
          { error: apiT('phone.providerNotConfigured', lang) },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: apiT('phone.sendError', lang) },
        { status: 500 }
      );
    }

    // Log successful OTP send
    logger.info('Phone OTP sent successfully', {
      userId: user.id,
      phone: maskPhoneNumber(normalizedPhone),
    });

    // Log verification attempt in audit (fire-and-forget)
    supabase.rpc('log_verification_change', {
      p_user_id: user.id,
      p_verification_type: 'phone',
      p_action: 'initiated',
      p_metadata: { phone_masked: maskPhoneNumber(normalizedPhone) },
      p_ip_address: clientIp,
      p_user_agent: request.headers.get('user-agent') || null,
    }).then(() => {}, (err) => {
      // Don't fail if audit logging fails
      console.warn('Failed to log verification audit:', err);
    });

    return NextResponse.json({
      success: true,
      message: apiT('phone.codeSent', lang),
      maskedPhone: maskPhoneNumber(normalizedPhone),
    });
  } catch (error) {
    logger.error('Unexpected error in phone OTP send', error as Error);

    return NextResponse.json(
      { error: apiT('common.unexpectedError', lang) },
      { status: 500 }
    );
  }
}
