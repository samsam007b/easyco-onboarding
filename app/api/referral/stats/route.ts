/**
 * GET /api/referral/stats
 * Get referral statistics for the current user
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

    // Call database function
    const { data, error } = await supabase.rpc('get_referral_stats', {
      p_user_id: user.id,
    });

    if (error) {
      console.error('Error getting referral stats:', error);
      return NextResponse.json(
        { error: apiT('referral.statsLoadError', lang) },
        { status: 500 }
      );
    }

    // The database function returns a JSONB object with all stats
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error('Error in /api/referral/stats:', error);
    return NextResponse.json({ error: apiT('common.serverError', lang) }, { status: 500 });
  }
}
