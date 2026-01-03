import { createClient } from '@/lib/auth/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { markMatchViewed } from '@/lib/services/enhanced-matching-service';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/matching/matches/[matchId]/view
 * Mark a match as viewed
 */
export async function POST(request: NextRequest, { params }: { params: { matchId: string } }) {
  const lang = getApiLanguage(request);

  try {
    const supabase = await createClient();
    const { matchId } = params;

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: apiT('common.unauthorized', lang) }, { status: 401 });
    }

    // Mark match as viewed
    await markMatchViewed(matchId, user.id);

    return NextResponse.json({
      success: true,
      message: apiT('matching.matchViewed', lang),
    });
  } catch (error) {
    console.error('Error marking match as viewed:', error);
    return NextResponse.json({ error: apiT('common.internalServerError', lang) }, { status: 500 });
  }
}
