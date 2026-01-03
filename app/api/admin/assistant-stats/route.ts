/**
 * ADMIN API: Assistant Statistics
 *
 * Provides detailed usage statistics for the AI assistant
 * Including cost tracking, provider distribution, and FAQ efficiency
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getUsageStats } from '@/lib/services/assistant';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';

interface ConversationStat {
  id: string;
  message_count: number | null;
  has_feedback: boolean;
  feedback_rating: number | null;
  created_at: string;
}

export async function GET(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    // Verify admin access using RPC (same as layout)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: apiT('common.unauthorized', lang) }, { status: 401 });
    }

    // Use is_admin RPC function (bypasses RLS)
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_email: user.email });

    if (adminError || !isAdmin) {
      return NextResponse.json({ error: apiT('admin.forbidden', lang) }, { status: 403 });
    }

    // Get real-time usage stats from memory
    const realtimeStats = getUsageStats();

    // Get historical stats from database
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get conversation stats
    const { data: conversationStats } = await supabase
      .from('assistant_conversations')
      .select('id, message_count, has_feedback, feedback_rating, created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    // Get page analytics
    const { data: pageStats } = await supabase
      .from('assistant_page_analytics')
      .select('*')
      .order('total_conversations', { ascending: false })
      .limit(10);

    // Type-safe stats
    const stats = (conversationStats || []) as ConversationStat[];

    // Calculate summary stats
    const totalConversations = stats.length;
    const totalMessages = stats.reduce((sum: number, c: ConversationStat) => sum + (c.message_count || 0), 0);
    const feedbackCount = stats.filter((c: ConversationStat) => c.has_feedback).length;
    const ratingsOnly = stats.filter((c: ConversationStat) => c.feedback_rating !== null);
    const avgRating = ratingsOnly.length > 0
      ? ratingsOnly.reduce((sum: number, c: ConversationStat) => sum + (c.feedback_rating || 0), 0) / ratingsOnly.length
      : 0;

    // Estimate costs based on provider distribution
    // Assume: 70% FAQ, 28% Groq, 2% OpenAI
    const estimatedMonthlyCost = calculateMonthlyCost(totalMessages);

    return NextResponse.json({
      realtime: realtimeStats,
      historical: {
        period: '30_days',
        totalConversations,
        totalMessages,
        avgMessagesPerConversation: totalConversations > 0
          ? (totalMessages / totalConversations).toFixed(1)
          : 0,
        feedbackCount,
        feedbackRate: totalConversations > 0
          ? ((feedbackCount / totalConversations) * 100).toFixed(1) + '%'
          : '0%',
        avgRating: avgRating.toFixed(2),
      },
      costs: {
        estimatedMonthly: `$${estimatedMonthlyCost.toFixed(2)}`,
        breakdown: {
          faq: { percentage: '70%', cost: '$0.00' },
          groq: { percentage: '28%', cost: `$${(estimatedMonthlyCost * 0.1).toFixed(2)}` },
          openai: { percentage: '2%', cost: `$${(estimatedMonthlyCost * 0.9).toFixed(2)}` },
        },
        savedByFAQ: `$${calculateFAQSavings(totalMessages).toFixed(2)}`,
      },
      topPages: pageStats || [],
      updatedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('[Admin Stats] Error:', error);
    return NextResponse.json(
      { error: apiT('common.internalServerError', lang) },
      { status: 500 }
    );
  }
}

/**
 * Calculate estimated monthly cost based on message volume
 */
function calculateMonthlyCost(messages: number): number {
  const tokensPerMessage = 500;
  const totalTokens = messages * tokensPerMessage;

  // Distribution: 70% FAQ (free), 28% Groq (~free), 2% OpenAI
  const faqTokens = totalTokens * 0.70; // Free
  const groqTokens = totalTokens * 0.28;
  const openaiTokens = totalTokens * 0.02;

  // Groq: $0.05 input + $0.08 output per 1M tokens
  const groqCost = (groqTokens / 1_000_000) * 0.065;

  // OpenAI: $0.15 input + $0.60 output per 1M tokens
  const openaiCost = (openaiTokens / 1_000_000) * 0.375;

  return groqCost + openaiCost;
}

/**
 * Calculate how much money FAQ system saved
 */
function calculateFAQSavings(messages: number): number {
  const tokensPerMessage = 500;
  const faqMessages = messages * 0.70;
  const faqTokens = faqMessages * tokensPerMessage;

  // If these had gone to OpenAI instead
  const openaiRate = 0.375; // Avg of input/output
  return (faqTokens / 1_000_000) * openaiRate;
}
