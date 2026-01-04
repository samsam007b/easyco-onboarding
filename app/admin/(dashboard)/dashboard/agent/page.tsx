'use client';

/**
 * ADMIN: Agent Analytics Dashboard
 *
 * Comprehensive tracking and analytics for the AI agent:
 * - Real-time usage & provider distribution
 * - Intent/topic analysis
 * - Cost tracking & projections
 * - Self-improvement candidates
 * - Auto-learning insights
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Bot,
  Zap,
  DollarSign,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Brain,
  Target,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

// =====================================================
// TYPES
// =====================================================

interface AgentStats {
  realtime?: {
    date: string;
    faq: { count: number; saved: number };
    groq: { count: number; tokens: number };
    openai: { count: number; tokens: number };
    estimatedCost: number;
    savedCost: number;
    totalRequests: number;
    faqPercentage: string;
  };
  daily?: {
    period: string;
    totals: {
      requests: number;
      faq: number;
      groq: number;
      openai: number;
      tokens: number;
      cost: number;
      owners: number;
      residents: number;
      searchers: number;
    };
    providerDistribution: {
      faq: { count: number; percentage: string };
      groq: { count: number; percentage: string };
      openai: { count: number; percentage: string };
    };
    userTypeDistribution: {
      owner: { count: number; percentage: string };
      resident: { count: number; percentage: string };
      searcher: { count: number; percentage: string };
    };
    trend: Array<{
      stat_date: string;
      total_requests: number;
      faq_requests: number;
      groq_requests: number;
      openai_requests: number;
    }>;
  };
  intents?: {
    topIntents: Array<{
      intent: string;
      total_count: number;
      faq_handled_count: number;
      ai_handled_count: number;
      faqEfficiency: string;
      avgConfidence: string;
    }>;
    categories: Record<string, { count: number; intents: string[] }>;
    totalUniqueIntents: number;
    avgFaqEfficiency: string;
  };
  costs?: {
    period: string;
    actual: { total: string; groq: string; openai: string };
    tokens: { total: number; formatted: string };
    savings: { amount: string; percentage: string };
    projection: { monthly: string; yearly: string };
  };
  improvements?: {
    pending: Array<{
      id: string;
      user_message: string;
      detected_intent: string;
      improvement_type: string;
      current_confidence: number | null;
      status: string;
      created_at: string;
    }>;
    pendingCount: number;
    byType: Record<string, number>;
    actionRequired: number;
  };
  recent?: {
    requests: Array<{
      id: string;
      user_message: string;
      detected_intent: string;
      provider: string;
      response_time_ms: number | null;
      confidence: string;
      user_type: string | null;
      page_path: string | null;
      created_at: string;
    }>;
  };
  updatedAt: string;
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function AgentDashboardPage() {
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'intents' | 'costs' | 'improvements' | 'logs'>('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    architecture: false,
    recentLogs: true,
  });

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/agent-stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading && !stats) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Erreur: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-7 h-7 text-violet-600" />
            Agent IA - Centre de contrôle
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tracking, analyse et auto-amélioration de l&apos;agent
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'intents', label: 'Thématiques', icon: Target },
            { id: 'costs', label: 'Coûts', icon: DollarSign },
            { id: 'improvements', label: 'Auto-apprentissage', icon: Sparkles },
            { id: 'logs', label: 'Logs récents', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-1 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-violet-600 text-violet-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'improvements' && stats?.improvements?.actionRequired ? (
                <span className="ml-1 px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                  {stats.improvements.actionRequired}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab stats={stats} />}
      {activeTab === 'intents' && <IntentsTab stats={stats} />}
      {activeTab === 'costs' && <CostsTab stats={stats} />}
      {activeTab === 'improvements' && <ImprovementsTab stats={stats} />}
      {activeTab === 'logs' && <LogsTab stats={stats} />}

      {/* Architecture Section (collapsible) */}
      <div className="bg-white border border-gray-200 superellipse-xl overflow-hidden">
        <button
          onClick={() => toggleSection('architecture')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-violet-600" />
            Architecture de l&apos;Agent
          </h2>
          {expandedSections.architecture ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {expandedSections.architecture && (
          <div className="p-6 border-t border-gray-200">
            <ArchitectureSection />
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 text-center">
        Dernière mise à jour : {stats?.updatedAt ? new Date(stats.updatedAt).toLocaleString('fr-FR') : '—'}
      </p>
    </div>
  );
}

// =====================================================
// OVERVIEW TAB
// =====================================================

function OverviewTab({ stats }: { stats: AgentStats | null }) {
  const realtime = stats?.realtime;
  const daily = stats?.daily;

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Requests Today */}
        <StatCard
          icon={MessageSquare}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
          gradient="from-blue-50 to-indigo-50"
          border="border-blue-200"
          label="Requêtes aujourd'hui"
          value={realtime?.totalRequests || 0}
          badge={{ text: 'Live', color: 'blue' }}
        />

        {/* FAQ Efficiency */}
        <StatCard
          icon={Zap}
          iconColor="text-green-600"
          iconBg="bg-green-100"
          gradient="from-green-50 to-emerald-50"
          border="border-green-200"
          label="Efficacité FAQ"
          value={realtime?.faqPercentage || '0%'}
          subtext={`${realtime?.faq.count || 0} requêtes gérées localement`}
          badge={{ text: 'Gratuit', color: 'green' }}
        />

        {/* Tokens Used */}
        <StatCard
          icon={BarChart3}
          iconColor="text-violet-600"
          iconBg="bg-violet-100"
          gradient="from-violet-50 to-purple-50"
          border="border-violet-200"
          label="Tokens (30j)"
          value={daily?.totals.tokens.toLocaleString() || '0'}
          subtext={`Groq: ${realtime?.groq.tokens || 0} aujourd'hui`}
        />

        {/* Cost Savings */}
        <StatCard
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-100"
          gradient="from-emerald-50 to-teal-50"
          border="border-emerald-200"
          label="Économies (FAQ)"
          value={`$${realtime?.savedCost.toFixed(2) || '0.00'}`}
          subtext="vs 100% OpenAI"
          badge={{ text: 'Économies', color: 'emerald' }}
        />
      </div>

      {/* Provider Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Provider Breakdown */}
        <div className="bg-white border border-gray-200 superellipse-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-gray-600" />
            Distribution des providers (30j)
          </h3>

          <div className="space-y-4">
            {/* FAQ */}
            <ProviderBar
              name="FAQ (Local)"
              count={daily?.totals.faq || 0}
              percentage={daily?.providerDistribution.faq.percentage || '0%'}
              color="bg-green-500"
              icon={<Zap className="w-4 h-4" />}
            />

            {/* Groq */}
            <ProviderBar
              name="Groq Llama 8B"
              count={daily?.totals.groq || 0}
              percentage={daily?.providerDistribution.groq.percentage || '0%'}
              color="bg-blue-500"
              icon={<Bot className="w-4 h-4" />}
            />

            {/* OpenAI */}
            <ProviderBar
              name="OpenAI GPT-4o-mini"
              count={daily?.totals.openai || 0}
              percentage={daily?.providerDistribution.openai.percentage || '0%'}
              color="bg-orange-500"
              icon={<Sparkles className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* User Type Distribution */}
        <div className="bg-white border border-gray-200 superellipse-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            Répartition par type d&apos;utilisateur (30j)
          </h3>

          <div className="space-y-4">
            <ProviderBar
              name="Propriétaires"
              count={daily?.totals.owners || 0}
              percentage={daily?.userTypeDistribution.owner.percentage || '0%'}
              color="bg-violet-500"
              icon={<Users className="w-4 h-4" />}
            />

            <ProviderBar
              name="Résidents"
              count={daily?.totals.residents || 0}
              percentage={daily?.userTypeDistribution.resident.percentage || '0%'}
              color="bg-cyan-500"
              icon={<Users className="w-4 h-4" />}
            />

            <ProviderBar
              name="Chercheurs"
              count={daily?.totals.searchers || 0}
              percentage={daily?.userTypeDistribution.searcher.percentage || '0%'}
              color="bg-amber-500"
              icon={<Users className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>

      {/* Trend Chart (simplified) */}
      {daily?.trend && daily.trend.length > 0 && (
        <div className="bg-white border border-gray-200 superellipse-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            Tendance des requêtes (14 derniers jours)
          </h3>

          <div className="flex items-end justify-between h-32 gap-1">
            {daily.trend.map((day, i) => {
              const maxRequests = Math.max(...daily.trend.map(d => d.total_requests));
              const height = maxRequests > 0 ? (day.total_requests / maxRequests) * 100 : 0;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-violet-500 to-violet-300 rounded-t transition-all"
                    style={{ height: `${height}%`, minHeight: day.total_requests > 0 ? '4px' : '0' }}
                    title={`${day.total_requests} requêtes`}
                  />
                  <span className="text-[10px] text-gray-400">
                    {new Date(day.stat_date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// INTENTS TAB
// =====================================================

function IntentsTab({ stats }: { stats: AgentStats | null }) {
  const intents = stats?.intents;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 superellipse-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Target className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-violet-600 font-medium">Intents uniques</p>
              <p className="text-2xl font-bold text-violet-700">
                {intents?.totalUniqueIntents || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 superellipse-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Efficacité FAQ moyenne</p>
              <p className="text-2xl font-bold text-green-700">
                {intents?.avgFaqEfficiency || '0%'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 superellipse-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Catégories actives</p>
              <p className="text-2xl font-bold text-blue-700">
                {intents?.categories ? Object.keys(intents.categories).filter(k => intents.categories[k].count > 0).length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Intents Table */}
      <div className="bg-white border border-gray-200 superellipse-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-gray-600" />
          Top Intents
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Intent</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Total</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">FAQ</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">IA</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Efficacité FAQ</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Confiance</th>
              </tr>
            </thead>
            <tbody>
              {intents?.topIntents.map((intent, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3">
                    <span className="font-mono text-xs px-2 py-1 bg-gray-100 rounded">
                      {intent.intent}
                    </span>
                  </td>
                  <td className="text-right py-2 px-3 font-medium">{intent.total_count}</td>
                  <td className="text-right py-2 px-3 text-green-600">{intent.faq_handled_count}</td>
                  <td className="text-right py-2 px-3 text-blue-600">{intent.ai_handled_count}</td>
                  <td className="text-right py-2 px-3">
                    <span className={`font-medium ${
                      parseFloat(intent.faqEfficiency) > 70 ? 'text-green-600' :
                      parseFloat(intent.faqEfficiency) > 40 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {intent.faqEfficiency}
                    </span>
                  </td>
                  <td className="text-right py-2 px-3 text-gray-500">{intent.avgConfidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categories Grid */}
      {intents?.categories && (
        <div className="bg-white border border-gray-200 superellipse-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            Catégories thématiques
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(intents.categories)
              .filter(([, data]) => data.count > 0)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([category, data]) => (
                <div
                  key={category}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-violet-200 transition-colors"
                >
                  <p className="font-medium text-gray-900 text-sm">{category}</p>
                  <p className="text-2xl font-bold text-violet-600">{data.count}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {data.intents.slice(0, 3).join(', ')}
                    {data.intents.length > 3 && ` +${data.intents.length - 3}`}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// COSTS TAB
// =====================================================

function CostsTab({ stats }: { stats: AgentStats | null }) {
  const costs = stats?.costs;

  return (
    <div className="space-y-6">
      {/* Cost Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          iconColor="text-gray-600"
          iconBg="bg-gray-100"
          gradient="from-gray-50 to-slate-50"
          border="border-gray-200"
          label="Coût total (30j)"
          value={costs?.actual.total || '$0.0000'}
        />

        <StatCard
          icon={Bot}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
          gradient="from-blue-50 to-indigo-50"
          border="border-blue-200"
          label="Groq"
          value={costs?.actual.groq || '$0.0000'}
        />

        <StatCard
          icon={Sparkles}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
          gradient="from-orange-50 to-amber-50"
          border="border-orange-200"
          label="OpenAI"
          value={costs?.actual.openai || '$0.0000'}
        />

        <StatCard
          icon={TrendingDown}
          iconColor="text-green-600"
          iconBg="bg-green-100"
          gradient="from-green-50 to-emerald-50"
          border="border-green-200"
          label="Économies"
          value={costs?.savings.amount || '$0.0000'}
          subtext={`${costs?.savings.percentage || '0%'} économisé`}
          badge={{ text: 'FAQ', color: 'green' }}
        />
      </div>

      {/* Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Usage */}
        <div className="bg-white border border-gray-200 superellipse-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            Consommation de tokens
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total (30 jours)</p>
              <p className="text-3xl font-bold text-gray-900">
                {costs?.tokens.formatted || '0'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {costs?.tokens.total.toLocaleString() || 0} tokens
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-green-500" />
                <span>FAQ ne consomme aucun token</span>
              </p>
              <p className="flex items-center gap-2 mt-2">
                <ArrowRight className="w-4 h-4 text-blue-500" />
                <span>Groq : ~$0.065 / 1M tokens</span>
              </p>
              <p className="flex items-center gap-2 mt-2">
                <ArrowRight className="w-4 h-4 text-orange-500" />
                <span>OpenAI : ~$0.375 / 1M tokens</span>
              </p>
            </div>
          </div>
        </div>

        {/* Projections */}
        <div className="bg-white border border-gray-200 superellipse-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            Projections
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-violet-50 rounded-lg">
              <span className="font-medium text-violet-700">Coût mensuel estimé</span>
              <span className="text-2xl font-bold text-violet-700">
                {costs?.projection.monthly || '$0.0000'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Projection annuelle</span>
              <span className="text-xl font-bold text-gray-700">
                {costs?.projection.yearly || '$0.00'}
              </span>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Objectif : &lt;$5/mois</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                L&apos;architecture hybride permet de rester dans les limites gratuites
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// IMPROVEMENTS TAB
// =====================================================

function ImprovementsTab({ stats }: { stats: AgentStats | null }) {
  const improvements = stats?.improvements;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 superellipse-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Action requise</p>
              <p className="text-2xl font-bold text-orange-700">
                {improvements?.actionRequired || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 superellipse-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-violet-600 font-medium">En attente</p>
              <p className="text-2xl font-bold text-violet-700">
                {improvements?.pendingCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 superellipse-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Brain className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-cyan-600 font-medium">Auto-apprentissage</p>
              <p className="text-lg font-bold text-cyan-700">Actif</p>
            </div>
          </div>
        </div>
      </div>

      {/* By Type */}
      {improvements?.byType && Object.keys(improvements.byType).length > 0 && (
        <div className="bg-white border border-gray-200 superellipse-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition par type d&apos;amélioration
          </h3>

          <div className="flex flex-wrap gap-2">
            {Object.entries(improvements.byType).map(([type, count]) => (
              <span
                key={type}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  type === 'escalation' ? 'bg-red-100 text-red-700' :
                  type === 'low_confidence' ? 'bg-orange-100 text-orange-700' :
                  type === 'new_intent' ? 'bg-violet-100 text-violet-700' :
                  type === 'missing_keywords' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}
              >
                {type.replace('_', ' ')}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pending Improvements */}
      <div className="bg-white border border-gray-200 superellipse-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gray-600" />
          Candidats à l&apos;amélioration
        </h3>

        {improvements?.pending && improvements.pending.length > 0 ? (
          <div className="space-y-3">
            {improvements.pending.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-violet-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">&quot;{item.user_message}&quot;</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-mono px-2 py-0.5 bg-gray-200 rounded">
                        {item.detected_intent || 'unknown'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        item.improvement_type === 'escalation' ? 'bg-red-100 text-red-700' :
                        item.improvement_type === 'low_confidence' ? 'bg-orange-100 text-orange-700' :
                        'bg-violet-100 text-violet-700'
                      }`}>
                        {item.improvement_type.replace('_', ' ')}
                      </span>
                      {item.current_confidence !== null && (
                        <span className="text-xs text-gray-500">
                          Confiance: {(item.current_confidence * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto text-green-300 mb-3" />
            <p>Aucune amélioration en attente</p>
            <p className="text-sm text-gray-400">Le système FAQ couvre bien les requêtes actuelles</p>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 superellipse-xl p-6">
        <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Comment fonctionne l&apos;auto-apprentissage ?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-violet-700">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">1</div>
            <p><strong>Détection</strong> : Les requêtes à faible confiance ou escaladées sont automatiquement flaggées</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">2</div>
            <p><strong>Analyse</strong> : Le système suggère de nouveaux keywords ou intents à ajouter</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">3</div>
            <p><strong>Validation</strong> : Un admin valide les suggestions avant intégration au FAQ</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// LOGS TAB
// =====================================================

function LogsTab({ stats }: { stats: AgentStats | null }) {
  const recent = stats?.recent;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 superellipse-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          Requêtes récentes
        </h3>

        {recent?.requests && recent.requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Message</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Intent</th>
                  <th className="text-center py-2 px-3 text-gray-500 font-medium">Provider</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Confiance</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Temps</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.requests.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 max-w-xs truncate text-gray-700" title={log.user_message}>
                      {log.user_message}
                    </td>
                    <td className="py-2 px-3">
                      <span className="font-mono text-xs px-2 py-0.5 bg-gray-100 rounded">
                        {log.detected_intent || '—'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        log.provider === 'faq' ? 'bg-green-100 text-green-700' :
                        log.provider === 'groq' ? 'bg-blue-100 text-blue-700' :
                        log.provider === 'openai' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {log.provider}
                      </span>
                    </td>
                    <td className="text-right py-2 px-3 text-gray-500">{log.confidence}</td>
                    <td className="text-right py-2 px-3 text-gray-500">
                      {log.response_time_ms ? `${log.response_time_ms}ms` : '—'}
                    </td>
                    <td className="text-right py-2 px-3 text-gray-400 text-xs">
                      {new Date(log.created_at).toLocaleString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>Aucune requête enregistrée</p>
            <p className="text-sm text-gray-400">Les logs apparaîtront ici une fois le tracking activé</p>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// ARCHITECTURE SECTION
// =====================================================

function ArchitectureSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Layer 1 */}
      <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
        <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Layer 1: FAQ
        </h3>
        <p className="text-sm text-green-700 mb-3">
          Détection d&apos;intent locale + réponses prédéfinies personnalisées
        </p>
        <ul className="text-xs text-green-600 space-y-1">
          <li>• ~70% des requêtes</li>
          <li>• Coût: $0</li>
          <li>• Latence: &lt;5ms</li>
          <li>• 38+ intents couverts</li>
          <li>• Personnalisation via UserContext</li>
        </ul>
      </div>

      {/* Layer 2 */}
      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Layer 2: Groq
        </h3>
        <p className="text-sm text-blue-700 mb-3">
          Llama 3.1 8B - Free tier ultra-rapide
        </p>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• ~28% des requêtes</li>
          <li>• 6000 req/jour gratuites</li>
          <li>• Latence: 200-500ms</li>
          <li>• Questions générales</li>
          <li>• Switch automatique à 80%</li>
        </ul>
      </div>

      {/* Layer 3 */}
      <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
        <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Layer 3: OpenAI
        </h3>
        <p className="text-sm text-orange-700 mb-3">
          GPT-4o-mini - Fallback payant
        </p>
        <ul className="text-xs text-orange-600 space-y-1">
          <li>• ~2% des requêtes</li>
          <li>• Questions complexes</li>
          <li>• Latence: 500ms-2s</li>
          <li>• Tool calling avancé</li>
          <li>• Streaming supporté</li>
        </ul>
      </div>
    </div>
  );
}

// =====================================================
// REUSABLE COMPONENTS
// =====================================================

interface StatCardProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  gradient: string;
  border: string;
  label: string;
  value: string | number;
  subtext?: string;
  badge?: { text: string; color: string };
}

function StatCard({ icon: Icon, iconColor, iconBg, gradient, border, label, value, subtext, badge }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} border ${border} superellipse-xl p-5`}>
      <div className="flex items-center justify-between">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {badge && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${badge.color}-100 text-${badge.color}-600`}>
            {badge.text}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className={`text-sm ${iconColor} font-medium`}>{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
      </div>
    </div>
  );
}

interface ProviderBarProps {
  name: string;
  count: number;
  percentage: string;
  color: string;
  icon: React.ReactNode;
}

function ProviderBar({ name, count, percentage, color, icon }: ProviderBarProps) {
  const numericPercentage = parseFloat(percentage) || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`${color.replace('bg-', 'text-')}`}>{icon}</span>
          <span className="text-sm font-medium text-gray-700">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-900 font-medium">{count.toLocaleString()}</span>
          <span className="text-xs text-gray-500">{percentage}</span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(numericPercentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
