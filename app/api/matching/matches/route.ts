import { createClient } from '@/lib/auth/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { findMatchesForSearcher, getMatchStatistics } from '@/lib/services/enhanced-matching-service';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/matching/matches
 * Get matches for the current user with optional filters
 */
export async function GET(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: apiT('common.unauthorized', lang) }, { status: 401 });
    }

    // Parse query params
    const limit = parseInt(searchParams.get('limit') || '20');
    const minScore = parseInt(searchParams.get('minScore') || '60');
    const status = searchParams.get('status')?.split(',') || ['active', 'viewed'];
    const includeStats = searchParams.get('includeStats') === 'true';

    // Get matches
    const matches = await findMatchesForSearcher(user.id, {
      limit,
      minScore,
      status: status as any,
    });

    // Get statistics if requested
    let stats = null;
    if (includeStats) {
      stats = await getMatchStatistics(user.id);
    }

    return NextResponse.json({
      success: true,
      matches,
      stats,
      count: matches.length,
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: apiT('common.internalServerError', lang) }, { status: 500 });
  }
}
