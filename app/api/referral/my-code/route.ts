/**
 * GET /api/referral/my-code
 * Get or create the current user's referral code
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://izzico.be';

export async function GET(request: NextRequest) {
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

    // Call database function to get or create code
    const { data: code, error } = await supabase.rpc('create_user_referral_code', {
      p_user_id: user.id,
    });

    if (error) {
      console.error('Error creating referral code:', error);
      return NextResponse.json(
        { error: apiT('referral.codeGenerateError', lang) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      code,
      shareUrl: `${APP_URL}/signup?ref=${code}`,
    });
  } catch (error) {
    console.error('Error in /api/referral/my-code:', error);
    return NextResponse.json({ error: apiT('common.serverError', lang) }, { status: 500 });
  }
}
