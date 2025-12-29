/**
 * ASSISTANT CONVERSATION API
 *
 * Manages conversation lifecycle:
 * - POST: Create new conversation or add message
 * - PATCH: Update conversation with feedback/suggestion
 */

import { createClient } from '@/lib/auth/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// Create or update conversation
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    const {
      action,
      conversationId,
      sessionId,
      page,
      pageTitle,
      userAgent,
      message,
      role,
      currentPage,
      toolCalls,
      toolResults,
      responseTimeMs,
    } = body;

    // Create new conversation
    if (action === 'create') {
      const { data: conversation, error } = await supabase
        .from('assistant_conversations')
        .insert({
          user_id: user?.id || null,
          session_id: sessionId,
          started_on_page: page,
          page_title: pageTitle,
          user_agent: userAgent,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ conversation });
    }

    // Add message to conversation
    if (action === 'message' && conversationId) {
      const { data: msg, error } = await supabase
        .from('assistant_messages')
        .insert({
          conversation_id: conversationId,
          role,
          content: message,
          current_page: currentPage,
          tool_calls: toolCalls || null,
          tool_results: toolResults || null,
          response_time_ms: responseTimeMs || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding message:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ message: msg });
    }

    // End conversation
    if (action === 'end' && conversationId) {
      const { error } = await supabase
        .from('assistant_conversations')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', conversationId);

      if (error) {
        console.error('Error ending conversation:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Conversation API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update conversation with feedback or suggestion
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    const {
      conversationId,
      feedbackRating,
      feedbackText,
      feedbackType,
      suggestionText,
      suggestionCategory,
      suggestionPriority,
    } = body;

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId required' }, { status: 400 });
    }

    const updates: Record<string, any> = {};

    // Add feedback
    if (feedbackRating || feedbackText) {
      updates.has_feedback = true;
      if (feedbackRating) updates.feedback_rating = feedbackRating;
      if (feedbackText) updates.feedback_text = feedbackText;
      if (feedbackType) updates.feedback_type = feedbackType;
    }

    // Add suggestion
    if (suggestionText) {
      updates.has_suggestion = true;
      updates.suggestion_text = suggestionText;
      if (suggestionCategory) updates.suggestion_category = suggestionCategory;
      if (suggestionPriority) updates.suggestion_priority = suggestionPriority;

      // Also create a backlog item for the suggestion
      await supabase
        .from('assistant_suggestions_backlog')
        .insert({
          conversation_id: conversationId,
          user_id: user?.id || null,
          title: suggestionText.substring(0, 100),
          description: suggestionText,
          category: suggestionCategory || 'other',
          source_page: body.currentPage,
          original_message: suggestionText,
        });
    }

    const { error } = await supabase
      .from('assistant_conversations')
      .update(updates)
      .eq('id', conversationId);

    if (error) {
      console.error('Error updating conversation:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Conversation PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
