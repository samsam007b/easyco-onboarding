/**
 * GET /api/referral/validate/[code]
 * Validate a referral code before signup
 * Public endpoint - no auth required
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';
import { checkRateLimit, getClientIdentifier } from '@/lib/security/rate-limiter';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// i18n for "Izzico User" fallback name
const izzicoUserTranslations = {
  fr: 'Utilisateur Izzico',
  en: 'Izzico User',
  nl: 'Izzico Gebruiker',
  de: 'Izzico Benutzer',
};

interface RouteParams {
  params: Promise<{ code: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const lang = getApiLanguage(request);

  try {
    const { code } = await params;

    // SECURITY: Validate code format (alphanumeric, 4-20 chars)
    const codeSchema = z.string().min(4).max(20).regex(/^[A-Z0-9]+$/i);
    const codeValidation = codeSchema.safeParse(code);

    if (!codeValidation.success) {
      return NextResponse.json({
        valid: false,
        error: apiT('referral.invalidCode', lang),
      });
    }

    // SECURITY: Rate limiting (prevent code enumeration)
    const clientIP = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(
      clientIP,
      'referral-validate',
      20, // 20 attempts
      900 // 15 minutes
    );

    if (!rateLimitResult.success) {
      return NextResponse.json({
        valid: false,
        error: 'rate_limit',
        message: 'Trop de tentatives. Réessayez dans 15 minutes.',
      }, { status: 429 });
    }

    const supabase = await createClient();
    const normalizedCode = code.toUpperCase().trim();

    // Call database function to validate
    const { data: referrerId, error } = await supabase.rpc('validate_referral_code', {
      p_code: normalizedCode,
    });

    if (error) {
      console.error('Error validating referral code:', error);
      return NextResponse.json({
        valid: false,
        error: apiT('common.serverError', lang),
      });
    }

    if (!referrerId) {
      return NextResponse.json({
        valid: false,
        error: apiT('referral.invalidCode', lang),
      });
    }

    // Get referrer name
    const { data: referrer } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', referrerId)
      .single();

    return NextResponse.json({
      valid: true,
      referrer_id: referrerId,
      referrer_name: referrer?.full_name || izzicoUserTranslations[lang],
    });
  } catch (error) {
    console.error('Error in /api/referral/validate:', error);
    return NextResponse.json({
      valid: false,
      error: apiT('common.serverError', lang),
    });
  }
}
