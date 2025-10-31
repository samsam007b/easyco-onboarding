import { createClient } from '@/lib/auth/supabase-server';
import { NextResponse } from 'next/server';
import { markMatchViewed } from '@/lib/services/enhanced-matching-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/matching/matches/[matchId]/view
 * Mark a match as viewed
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

    // Mark match as viewed
    await markMatchViewed(matchId, user.id);

    return NextResponse.json({
      success: true,
      message: 'Match marked as viewed',
    });
  } catch (error) {
    console.error('Error marking match as viewed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
