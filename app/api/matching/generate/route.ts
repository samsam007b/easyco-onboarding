import { createClient } from '@/lib/auth/supabase-server';
import { NextResponse } from 'next/server';
import { generateMatchesForSearcher } from '@/lib/services/enhanced-matching-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/matching/generate
 * Generate matches for the current user
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile to check type
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_type')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Only searchers can generate matches
    if (profile.user_type !== 'searcher') {
      return NextResponse.json(
        { error: 'Only searchers can generate matches' },
        { status: 403 }
      );
    }

    // Generate matches
    const result = await generateMatchesForSearcher(user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate matches' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      matchesGenerated: result.matchesGenerated,
      message:
        result.matchesGenerated === 0
          ? 'No new matches found at this time'
          : `Found ${result.matchesGenerated} new potential ${result.matchesGenerated === 1 ? 'match' : 'matches'}!`,
    });
  } catch (error) {
    console.error('Error generating matches:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
