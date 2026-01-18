/**
 * ADMIN API: Agent Analytics Dashboard
 *
 * Comprehensive statistics for the AI agent including:
 * - Real-time usage metrics
 * - Intent/topic distribution
 * - Provider routing stats
 * - Cost analysis
 * - Self-improvement candidates
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getUsageStats } from '@/lib/services/assistant';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';
import { validateAdminRequest } from '@/lib/security/admin-auth';

export const dynamic = 'force-dynamic';

// =====================================================
// TYPES
// =====================================================

interface DailyStat {
  stat_date: string;
  total_requests: number;
  faq_requests: number;
  groq_requests: number;
  openai_requests: number;
  total_tokens: number;
  total_cost: number;
  owner_requests: number;
  resident_requests: number;
  searcher_requests: number;
}

interface IntentStat {
  intent: string;
  total_count: number;
  faq_handled_count: number;
  ai_handled_count: number;
  avg_confidence: number | null;
}

interface ImprovementCandidate {
  id: string;
  user_message: string;
  detected_intent: string;
  improvement_type: string;
  current_confidence: number | null;
  status: string;
  created_at: string;
}

interface RecentRequest {
  id: string;
  user_message: string;
  detected_intent: string;
  provider: string;
  response_time_ms: number | null;
  intent_confidence: number | null;
  user_type: string | null;
  page_path: string | null;
  created_at: string;
}

// =====================================================
// MAIN HANDLER
// =====================================================

export async function GET(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    // SECURITY: Validate admin access (Auth + Admin check + IP allowlist)
    const adminCheck = await validateAdminRequest(request);

    if (!adminCheck.allowed) {
      return adminCheck.response!; // Returns 401 or 403 with appropriate error
    }

    const { supabase, user } = adminCheck;

    // Parse URL for query params
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'all';

    // Build response based on requested section
    const response: Record<string, unknown> = {};

    // ─────────────────────────────────────────────────────
    // SECTION: Real-time stats (from memory)
    // ─────────────────────────────────────────────────────
    if (section === 'all' || section === 'realtime') {
      const realtimeStats = getUsageStats();
      response.realtime = {
        ...realtimeStats,
        totalRequests: realtimeStats.faq.count + realtimeStats.groq.count + realtimeStats.openai.count,
        faqPercentage: calculatePercentage(
          realtimeStats.faq.count,
          realtimeStats.faq.count + realtimeStats.groq.count + realtimeStats.openai.count
        ),
      };
    }

    // ─────────────────────────────────────────────────────
    // SECTION: Daily statistics (last 30 days)
    // ─────────────────────────────────────────────────────
    if (section === 'all' || section === 'daily') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: dailyStats } = await supabase
        .from('agent_daily_stats')
        .select('stat_date, total_requests, faq_requests, groq_requests, openai_requests, total_tokens, total_cost, owner_requests, resident_requests, searcher_requests')
        .gte('stat_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('stat_date', { ascending: false });

      const stats = (dailyStats || []) as DailyStat[];

      // Calculate aggregates
      const totals = stats.reduce((acc, day) => ({
        requests: acc.requests + (day.total_requests || 0),
        faq: acc.faq + (day.faq_requests || 0),
        groq: acc.groq + (day.groq_requests || 0),
        openai: acc.openai + (day.openai_requests || 0),
        tokens: acc.tokens + (day.total_tokens || 0),
        cost: acc.cost + Number(day.total_cost || 0),
        owners: acc.owners + (day.owner_requests || 0),
        residents: acc.residents + (day.resident_requests || 0),
        searchers: acc.searchers + (day.searcher_requests || 0),
      }), {
        requests: 0, faq: 0, groq: 0, openai: 0,
        tokens: 0, cost: 0, owners: 0, residents: 0, searchers: 0
      });

      response.daily = {
        period: '30_days',
        totals,
        providerDistribution: {
          faq: { count: totals.faq, percentage: calculatePercentage(totals.faq, totals.requests) },
          groq: { count: totals.groq, percentage: calculatePercentage(totals.groq, totals.requests) },
          openai: { count: totals.openai, percentage: calculatePercentage(totals.openai, totals.requests) },
        },
        userTypeDistribution: {
          owner: { count: totals.owners, percentage: calculatePercentage(totals.owners, totals.requests) },
          resident: { count: totals.residents, percentage: calculatePercentage(totals.residents, totals.requests) },
          searcher: { count: totals.searchers, percentage: calculatePercentage(totals.searchers, totals.requests) },
        },
        trend: stats.slice(0, 14).reverse(), // Last 14 days for chart
      };
    }

    // ─────────────────────────────────────────────────────
    // SECTION: Intent statistics
    // ─────────────────────────────────────────────────────
    if (section === 'all' || section === 'intents') {
      const { data: intentStats } = await supabase
        .from('agent_intent_stats')
        .select('intent, total_count, faq_handled_count, ai_handled_count, avg_confidence')
        .order('total_count', { ascending: false })
        .limit(20);

      const intents = (intentStats || []) as IntentStat[];

      // Calculate FAQ efficiency per intent
      const intentAnalysis = intents.map(intent => ({
        ...intent,
        faqEfficiency: calculatePercentage(intent.faq_handled_count, intent.total_count),
        avgConfidence: intent.avg_confidence ? (Number(intent.avg_confidence) * 100).toFixed(1) + '%' : 'N/A',
      }));

      // Group by category
      const categories = categorizeIntents(intents);

      response.intents = {
        topIntents: intentAnalysis,
        categories,
        totalUniqueIntents: intents.length,
        avgFaqEfficiency: calculateAvgFaqEfficiency(intents),
      };
    }

    // ─────────────────────────────────────────────────────
    // SECTION: Cost analysis
    // ─────────────────────────────────────────────────────
    if (section === 'all' || section === 'costs') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: costStats } = await supabase
        .from('agent_daily_stats')
        .select('total_cost, groq_cost, openai_cost, total_tokens, faq_requests, groq_requests, openai_requests')
        .gte('stat_date', thirtyDaysAgo.toISOString().split('T')[0]);

      const stats = costStats || [];
      const totalCost = stats.reduce((sum, day) => sum + Number(day.total_cost || 0), 0);
      const groqCost = stats.reduce((sum, day) => sum + Number(day.groq_cost || 0), 0);
      const openaiCost = stats.reduce((sum, day) => sum + Number(day.openai_cost || 0), 0);
      const totalTokens = stats.reduce((sum, day) => sum + (day.total_tokens || 0), 0);
      const faqRequests = stats.reduce((sum, day) => sum + (day.faq_requests || 0), 0);

      // Calculate savings (if everything went to OpenAI)
      const tokensPerRequest = 500;
      const openaiRate = 0.375 / 1_000_000; // per token
      const potentialOpenAICost = faqRequests * tokensPerRequest * openaiRate;

      response.costs = {
        period: '30_days',
        actual: {
          total: formatCurrency(totalCost),
          groq: formatCurrency(groqCost),
          openai: formatCurrency(openaiCost),
        },
        tokens: {
          total: totalTokens,
          formatted: formatNumber(totalTokens),
        },
        savings: {
          amount: formatCurrency(potentialOpenAICost),
          percentage: potentialOpenAICost > 0
            ? ((potentialOpenAICost / (totalCost + potentialOpenAICost)) * 100).toFixed(1) + '%'
            : '100%',
        },
        projection: {
          monthly: formatCurrency(totalCost),
          yearly: formatCurrency(totalCost * 12),
        },
      };
    }

    // ─────────────────────────────────────────────────────
    // SECTION: Improvement candidates
    // ─────────────────────────────────────────────────────
    if (section === 'all' || section === 'improvements') {
      const { data: improvements } = await supabase
        .from('agent_improvement_candidates')
        .select('id, user_message, detected_intent, improvement_type, current_confidence, status, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20);

      const candidates = (improvements || []) as ImprovementCandidate[];

      // Group by type
      const byType: Record<string, number> = {};
      candidates.forEach(c => {
        byType[c.improvement_type] = (byType[c.improvement_type] || 0) + 1;
      });

      response.improvements = {
        pending: candidates,
        pendingCount: candidates.length,
        byType,
        actionRequired: candidates.filter(c =>
          c.improvement_type === 'escalation' || c.improvement_type === 'low_confidence'
        ).length,
      };
    }

    // ─────────────────────────────────────────────────────
    // SECTION: Recent requests (for debugging)
    // ─────────────────────────────────────────────────────
    if (section === 'all' || section === 'recent') {
      const { data: recentLogs } = await supabase
        .from('agent_request_logs')
        .select('id, user_message, detected_intent, provider, response_time_ms, intent_confidence, user_type, page_path, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      const logs = (recentLogs || []) as RecentRequest[];

      response.recent = {
        requests: logs.map(log => ({
          ...log,
          user_message: truncate(log.user_message, 100),
          confidence: log.intent_confidence ? (Number(log.intent_confidence) * 100).toFixed(0) + '%' : 'N/A',
        })),
      };
    }

    // ─────────────────────────────────────────────────────
    // SECTION: Topic clusters
    // ─────────────────────────────────────────────────────
    if (section === 'all' || section === 'topics') {
      const { data: topics } = await supabase
        .from('agent_topic_clusters')
        .select('id, cluster_name, keywords, message_count, sample_messages, created_at, updated_at')
        .order('message_count', { ascending: false })
        .limit(10);

      response.topics = {
        clusters: topics || [],
      };
    }

    return NextResponse.json({
      ...response,
      updatedAt: new Date().toISOString(),
    });

  } catch (error: unknown) {
    console.error('[Agent Stats] Error:', error);
    return NextResponse.json(
      { error: apiT('common.internalServerError', lang) },
      { status: 500 }
    );
  }
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function calculatePercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return ((value / total) * 100).toFixed(1) + '%';
}

function formatCurrency(amount: number): string {
  return '$' + amount.toFixed(4);
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

function calculateAvgFaqEfficiency(intents: IntentStat[]): string {
  const total = intents.reduce((sum, i) => sum + i.total_count, 0);
  const faqHandled = intents.reduce((sum, i) => sum + i.faq_handled_count, 0);
  return calculatePercentage(faqHandled, total);
}

function categorizeIntents(intents: IntentStat[]): Record<string, { count: number; intents: string[] }> {
  const categories: Record<string, string[]> = {
    'Pricing & Subscription': ['pricing', 'subscription', 'trial', 'payment'],
    'Account & Profile': ['my_account', 'profile_completion', 'settings', 'security', 'privacy'],
    'Navigation & Help': ['navigation', 'help', 'greeting', 'goodbye', 'how_it_works'],
    'Properties & Search': ['property', 'search', 'matching', 'applications'],
    'Community & Social': ['roommates', 'messaging', 'community', 'events'],
    'Features': ['finances', 'calendar', 'documents', 'notifications'],
    'Support': ['support', 'feedback', 'bug_report', 'feature_request'],
    'Other': [],
  };

  const result: Record<string, { count: number; intents: string[] }> = {};

  for (const [category, categoryIntents] of Object.entries(categories)) {
    const matched = intents.filter(i => categoryIntents.includes(i.intent));
    const count = matched.reduce((sum, i) => sum + i.total_count, 0);
    result[category] = {
      count,
      intents: matched.map(i => i.intent),
    };
  }

  // Add uncategorized to Other
  const allCategorized = Object.values(categories).flat();
  const uncategorized = intents.filter(i => !allCategorized.includes(i.intent));
  result['Other'] = {
    count: result['Other']?.count || 0 + uncategorized.reduce((sum, i) => sum + i.total_count, 0),
    intents: [...(result['Other']?.intents || []), ...uncategorized.map(i => i.intent)],
  };

  return result;
}
