/**
 * POST /api/referral/apply-code
 * Apply a referral code to the current user's account
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: apiT('common.notAuthenticated', lang) }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'invalid_code', message: apiT('common.invalidRequest', lang) },
        { status: 400 }
      );
    }

    // Call database function
    const { data, error } = await supabase.rpc('apply_referral_code', {
      p_referred_user_id: user.id,
      p_referral_code: code.toUpperCase().trim(),
    });

    if (error) {
      console.error('Error applying referral code:', error);
      return NextResponse.json(
        { success: false, error: 'server_error', message: apiT('common.serverError', lang) },
        { status: 500 }
      );
    }

    // The database function returns a JSONB object
    const result = data as {
      success: boolean;
      error?: string;
      message?: string;
      referrer_id?: string;
    };

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/referral/apply-code:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: apiT('common.serverError', lang) },
      { status: 500 }
    );
  }
}
