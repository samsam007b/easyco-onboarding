import { createClient } from '@/lib/auth/supabase-server';
import { NextResponse } from 'next/server';
import { hideMatch } from '@/lib/services/enhanced-matching-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/matching/matches/[matchId]/hide
 * Hide a match from the user's list
 */
export async function POST(request: Request, { params }: { params: { matchId: string } }) {
  try {
    const supabase = await createClient();
    const { matchId } = params;

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hide the match
    await hideMatch(matchId);

    return NextResponse.json({
      success: true,
      message: 'Match hidden',
    });
  } catch (error) {
    console.error('Error hiding match:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
