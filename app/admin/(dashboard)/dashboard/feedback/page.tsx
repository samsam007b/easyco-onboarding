import { createClient } from '@/lib/auth/supabase-server';
import {
  MessageSquare,
  Lightbulb,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Filter,
  BarChart3,
  Users,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Conversation {
  id: string;
  user_id: string | null;
  session_id: string;
  started_on_page: string;
  page_title: string | null;
  message_count: number;
  has_feedback: boolean;
  feedback_rating: number | null;
  feedback_text: string | null;
  feedback_type: string | null;
  has_suggestion: boolean;
  suggestion_text: string | null;
  suggestion_category: string | null;
  status: string;
  created_at: string;
  users?: { full_name: string | null; email: string | null } | null;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string | null;
  source_page: string | null;
  status: string;
  priority: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  users?: { full_name: string | null; email: string | null } | null;
}

interface PageAnalytics {
  page_path: string;
  total_conversations: number;
  feedback_count: number;
  suggestion_count: number;
  avg_rating: number | null;
}

async function getStats() {
  const supabase = await createClient();

  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    { count: totalConversations },
    { count: conversationsThisWeek },
    { count: totalSuggestions },
    { count: pendingSuggestions },
    { data: recentConversations },
    { data: topSuggestions },
    { data: pageAnalytics },
    { data: feedbackStats },
  ] = await Promise.all([
    supabase.from('assistant_conversations').select('*', { count: 'exact', head: true }),
    supabase.from('assistant_conversations').select('*', { count: 'exact', head: true }).gte('created_at', lastWeek.toISOString()),
    supabase.from('assistant_suggestions_backlog').select('*', { count: 'exact', head: true }),
    supabase.from('assistant_suggestions_backlog').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('assistant_conversations')
      .select(`
        id,
        user_id,
        session_id,
        started_on_page,
        page_title,
        message_count,
        has_feedback,
        feedback_rating,
        feedback_text,
        feedback_type,
        has_suggestion,
        suggestion_text,
        suggestion_category,
        status,
        created_at,
        users:user_id (full_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('assistant_suggestions_backlog')
      .select(`
        id,
        title,
        description,
        category,
        source_page,
        status,
        priority,
        upvotes,
        downvotes,
        created_at,
        users:user_id (full_name, email)
      `)
      .order('upvotes', { ascending: false })
      .limit(10),
    supabase
      .from('assistant_page_analytics')
      .select('page_path, total_conversations, feedback_count, suggestion_count, avg_rating')
      .order('total_conversations', { ascending: false })
      .limit(10),
    supabase
      .from('assistant_conversations')
      .select('feedback_rating')
      .not('feedback_rating', 'is', null),
  ]);

  // Calculate average rating
  const ratings = feedbackStats?.map(f => f.feedback_rating).filter(Boolean) || [];
  const avgRating = ratings.length > 0
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;

  return {
    totalConversations: totalConversations || 0,
    conversationsThisWeek: conversationsThisWeek || 0,
    totalSuggestions: totalSuggestions || 0,
    pendingSuggestions: pendingSuggestions || 0,
    avgRating: avgRating.toFixed(1),
    totalRatings: ratings.length,
    recentConversations: (recentConversations || []) as Conversation[],
    topSuggestions: (topSuggestions || []) as Suggestion[],
    pageAnalytics: (pageAnalytics || []) as PageAnalytics[],
  };
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    reviewed: 'bg-purple-100 text-purple-700',
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-orange-100 text-orange-700',
    planned: 'bg-indigo-100 text-indigo-700',
    implemented: 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    duplicate: 'bg-gray-100 text-gray-700',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return null;

  const styles: Record<string, string> = {
    ui_ux: 'bg-pink-100 text-pink-700',
    new_feature: 'bg-purple-100 text-purple-700',
    improvement: 'bg-blue-100 text-blue-700',
    integration: 'bg-cyan-100 text-cyan-700',
    performance: 'bg-orange-100 text-orange-700',
    bug_fix: 'bg-red-100 text-red-700',
    other: 'bg-gray-100 text-gray-700',
  };

  const labels: Record<string, string> = {
    ui_ux: 'UI/UX',
    new_feature: 'Nouvelle feature',
    improvement: 'Amelioration',
    integration: 'Integration',
    performance: 'Performance',
    bug_fix: 'Bug fix',
    other: 'Autre',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[category] || 'bg-gray-100 text-gray-700'}`}>
      {labels[category] || category}
    </span>
  );
}

export default async function FeedbackDashboardPage() {
  const stats = await getStats();

  const statCards = [
    {
      title: 'Conversations',
      value: stats.totalConversations,
      change: stats.conversationsThisWeek,
      changeLabel: 'cette semaine',
      icon: MessageSquare,
      color: 'purple',
    },
    {
      title: 'Suggestions',
      value: stats.totalSuggestions,
      change: stats.pendingSuggestions,
      changeLabel: 'en attente',
      icon: Lightbulb,
      color: 'amber',
    },
    {
      title: 'Note moyenne',
      value: stats.avgRating,
      change: stats.totalRatings,
      changeLabel: 'avis',
      icon: Star,
      color: 'yellow',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback & Suggestions</h1>
        <p className="text-gray-600 mt-1">
          Gerez les retours utilisateurs et les suggestions d'amelioration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  {stat.change !== null && (
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="text-green-600 font-medium">+{stat.change}</span> {stat.changeLabel}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conversations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Conversations recentes
            </CardTitle>
            <CardDescription>Dernieres interactions avec l'assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentConversations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune conversation pour le moment</p>
              ) : (
                stats.recentConversations.map((conv) => (
                  <div key={conv.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {conv.users?.full_name || conv.users?.email || 'Anonyme'}
                        </span>
                        <StatusBadge status={conv.status} />
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(conv.created_at), { addSuffix: true, locale: fr })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">{conv.started_on_page}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">{conv.message_count} messages</span>
                      {conv.has_feedback && conv.feedback_rating && (
                        <RatingStars rating={conv.feedback_rating} />
                      )}
                      {conv.has_suggestion && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Lightbulb className="w-3 h-3" />
                          Suggestion
                        </span>
                      )}
                    </div>

                    {conv.feedback_text && (
                      <p className="mt-2 text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                        "{conv.feedback_text}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Top Suggestions
            </CardTitle>
            <CardDescription>Les idees les plus votees par les utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topSuggestions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune suggestion pour le moment</p>
              ) : (
                stats.topSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CategoryBadge category={suggestion.category} />
                          <StatusBadge status={suggestion.status} />
                        </div>
                        <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-green-600">
                          <ThumbsUp className="w-4 h-4" />
                          {suggestion.upvotes}
                        </span>
                        <span className="flex items-center gap-1 text-red-500">
                          <ThumbsDown className="w-4 h-4" />
                          {suggestion.downvotes}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{suggestion.description}</p>

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span>
                        Par {suggestion.users?.full_name || suggestion.users?.email || 'Anonyme'}
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(suggestion.created_at), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Analytics par page
          </CardTitle>
          <CardDescription>Pages avec le plus d'interactions assistant</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.pageAnalytics.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune donnee disponible</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Page</th>
                    <th className="pb-3 font-medium text-center">Conversations</th>
                    <th className="pb-3 font-medium text-center">Feedbacks</th>
                    <th className="pb-3 font-medium text-center">Suggestions</th>
                    <th className="pb-3 font-medium text-center">Note moy.</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stats.pageAnalytics.map((page) => (
                    <tr key={page.page_path} className="text-sm hover:bg-gray-50">
                      <td className="py-3">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{page.page_path}</code>
                      </td>
                      <td className="py-3 text-center font-medium">{page.total_conversations}</td>
                      <td className="py-3 text-center">{page.feedback_count}</td>
                      <td className="py-3 text-center">{page.suggestion_count}</td>
                      <td className="py-3 text-center">
                        {page.avg_rating ? (
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span>{Number(page.avg_rating).toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
