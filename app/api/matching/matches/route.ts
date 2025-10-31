import { createClient } from '@/lib/auth/supabase-server';
import { NextResponse } from 'next/server';
import { findMatchesForSearcher, getMatchStatistics } from '@/lib/services/enhanced-matching-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/matching/matches
 * Get matches for the current user with optional filters
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
