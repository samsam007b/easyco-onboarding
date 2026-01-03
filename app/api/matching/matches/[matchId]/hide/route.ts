import { createClient } from '@/lib/auth/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { hideMatch } from '@/lib/services/enhanced-matching-service';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/matching/matches/[matchId]/hide
 * Hide a match from the user's list
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

    // Hide the match
    await hideMatch(matchId);

    return NextResponse.json({
      success: true,
      message: apiT('matching.matchHidden', lang),
    });
  } catch (error) {
    console.error('Error hiding match:', error);
    return NextResponse.json({ error: apiT('common.internalServerError', lang) }, { status: 500 });
  }
}
