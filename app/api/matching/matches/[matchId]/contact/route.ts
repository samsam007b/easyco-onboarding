import { createClient } from '@/lib/auth/supabase-server';
import { NextResponse } from 'next/server';
import { updateMatchStatus } from '@/lib/services/enhanced-matching-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/matching/matches/[matchId]/contact
 * Mark a match as contacted and create a conversation
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

    // Get match details to find the owner
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('searcher_id, owner_id, property_id')
      .eq('id', matchId)
      .single();

    if (matchError || !match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Verify user is the searcher
    if (match.searcher_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .or(
        `and(user1_id.eq.${user.id},user2_id.eq.${match.owner_id}),and(user1_id.eq.${match.owner_id},user2_id.eq.${user.id})`
      )
      .single();

    let conversationId = existingConversation?.id;

    // Create conversation if it doesn't exist
    if (!conversationId) {
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          user1_id: user.id,
          user2_id: match.owner_id,
          last_message_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        );
      }

      conversationId = newConversation.id;
    }

    // Update match status to contacted
    await updateMatchStatus(matchId, 'contacted');

    // Create a notification for the owner
    await supabase.rpc('create_notification', {
      p_user_id: match.owner_id,
      p_type: 'match',
      p_title: 'Nouveau contact !',
      p_message: 'Un chercheur est intéressé par votre bien',
      p_related_user_id: user.id,
      p_related_property_id: match.property_id,
      p_action_url: '/messages',
      p_action_label: 'Voir le message',
    });

    return NextResponse.json({
      success: true,
      conversationId,
      message: 'Match marked as contacted',
    });
  } catch (error) {
    console.error('Error contacting match:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
