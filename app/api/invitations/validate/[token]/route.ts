import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';
import type { ValidateInvitationResponse } from '@/types/invitation.types';
import { createRateLimiter } from '@/lib/security/rate-limiter';
import { z } from 'zod';

// SECURITY: Rate limiting to prevent token brute-force
const rateLimiter = createRateLimiter({
  requests: 10, // 10 attempts
  window: '15 m', // per 15 minutes
  prefix: 'invitation-validate',
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const lang = getApiLanguage(request);

  try {
    const { token } = await params;

    // SECURITY: Validate token format (UUID)
    const tokenSchema = z.string().uuid();
    const tokenValidation = tokenSchema.safeParse(token);

    if (!tokenValidation.success) {
      return NextResponse.json(
        { valid: false, error: 'invalid_format', message: 'Token invalide' },
        { status: 400 }
      );
    }

    // SECURITY: Rate limiting (prevent brute-force)
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimiter.check(`${clientIP}:${token}`);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { valid: false, error: 'rate_limit', message: 'Trop de tentatives' },
        { status: 429 }
      );
    }

    const supabase = await createClient();

    // Call the database function (accessible to anon)
    const { data, error } = await supabase.rpc('validate_invitation_token', {
      p_token: token
    });

    if (error) {
      console.error('Error validating invitation token:', error);
      return NextResponse.json(
        { valid: false, error: 'database_error', message: error.message },
        { status: 500 }
      );
    }

    const result = data as ValidateInvitationResponse;

    if (!result.valid) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in validate invitation API:', error);
    return NextResponse.json(
      { valid: false, error: 'server_error', message: apiT('common.serverError', lang) },
      { status: 500 }
    );
  }
}
