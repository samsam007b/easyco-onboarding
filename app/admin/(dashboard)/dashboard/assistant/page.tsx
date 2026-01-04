'use client';

/**
 * ADMIN: AI Assistant Dashboard
 *
 * Displays usage statistics, costs, and efficiency metrics
 * for the hybrid AI assistant system
 */

import { useState, useEffect } from 'react';
import {
  Bot,
  Zap,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AssistantStats {
  realtime: {
    date: string;
    faq: { count: number; saved: number };
    groq: { count: number; tokens: number };
    openai: { count: number; tokens: number };
    estimatedCost: number;
    savedCost: number;
  };
  historical: {
    period: string;
    totalConversations: number;
    totalMessages: number;
    avgMessagesPerConversation: string;
    feedbackCount: number;
    feedbackRate: string;
    avgRating: string;
  };
  costs: {
    estimatedMonthly: string;
    breakdown: {
      faq: { percentage: string; cost: string };
      groq: { percentage: string; cost: string };
      openai: { percentage: string; cost: string };
    };
    savedByFAQ: string;
  };
  topPages: Array<{
    page_path: string;
    total_conversations: number;
    total_messages: number;
    avg_rating: number;
  }>;
  updatedAt: string;
}

export default function AssistantDashboardPage() {
  const [stats, setStats] = useState<AssistantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArchitecture, setShowArchitecture] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/assistant-stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

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
            <Bot className="w-7 h-7 text-indigo-600" />
            Assistant IA - Tableau de bord
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Architecture hybride : FAQ → Groq → OpenAI
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* FAQ Usage */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 superellipse-xl p-5">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Gratuit
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm text-green-600 font-medium">FAQ (Local)</p>
            <p className="text-3xl font-bold text-green-700">
              {stats?.realtime.faq.count || 0}
            </p>
            <p className="text-xs text-green-600 mt-1">
              requêtes aujourd'hui
            </p>
          </div>
        </div>

        {/* Groq Usage */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 superellipse-xl p-5">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              ~Gratuit
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm text-blue-600 font-medium">Groq Llama 8B</p>
            <p className="text-3xl font-bold text-blue-700">
              {stats?.realtime.groq.count || 0}
              <span className="text-sm font-normal text-blue-500">/6000</span>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {stats?.realtime.groq.tokens.toLocaleString() || 0} tokens
            </p>
          </div>
        </div>

        {/* OpenAI Usage */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 superellipse-xl p-5">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              Payant
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm text-orange-600 font-medium">OpenAI GPT-4o-mini</p>
            <p className="text-3xl font-bold text-orange-700">
              {stats?.realtime.openai.count || 0}
            </p>
            <p className="text-xs text-orange-600 mt-1">
              fallback uniquement
            </p>
          </div>
        </div>

        {/* Cost Savings */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 superellipse-xl p-5">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              Économies
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm text-purple-600 font-medium">Économisé (FAQ)</p>
            <p className="text-3xl font-bold text-purple-700">
              ${stats?.realtime.savedCost.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              vs 100% OpenAI
            </p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Costs */}
        <div className="bg-white border border-gray-200 superellipse-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-600" />
            Coûts estimés (30 jours)
          </h2>

          <div className="space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Coût mensuel estimé</span>
              <span className="text-2xl font-bold text-gray-900">
                {stats?.costs.estimatedMonthly || '$0.00'}
              </span>
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">FAQ (Local)</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{stats?.costs.breakdown.faq.cost}</span>
                  <span className="text-xs text-gray-500 ml-2">{stats?.costs.breakdown.faq.percentage}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Groq Llama 8B</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{stats?.costs.breakdown.groq.cost}</span>
                  <span className="text-xs text-gray-500 ml-2">{stats?.costs.breakdown.groq.percentage}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">OpenAI GPT-4o-mini</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{stats?.costs.breakdown.openai.cost}</span>
                  <span className="text-xs text-gray-500 ml-2">{stats?.costs.breakdown.openai.percentage}</span>
                </div>
              </div>
            </div>

            {/* Savings highlight */}
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">Économisé grâce au FAQ</span>
                <span className="text-lg font-bold text-green-700">{stats?.costs.savedByFAQ}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Stats */}
        <div className="bg-white border border-gray-200 superellipse-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            Statistiques (30 jours)
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Conversations</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.historical.totalConversations || 0}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.historical.totalMessages || 0}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Msg/Conversation</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.historical.avgMessagesPerConversation || '0'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.historical.avgRating || '—'}/5
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">Taux de feedback</span>
              <span className="text-lg font-bold text-blue-700">
                {stats?.historical.feedbackRate || '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Explanation */}
      <div className="bg-white border border-gray-200 superellipse-xl overflow-hidden">
        <button
          onClick={() => setShowArchitecture(!showArchitecture)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            Architecture Hybride
          </h2>
          {showArchitecture ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {showArchitecture && (
          <div className="p-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Layer 1 */}
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">Layer 1: FAQ</h3>
                <p className="text-sm text-green-700 mb-3">
                  Détection d'intent locale + réponses prédéfinies
                </p>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>• 70% des requêtes</li>
                  <li>• Coût: $0</li>
                  <li>• Latence: &lt;5ms</li>
                  <li>• Intents: prix, parrainage, navigation...</li>
                </ul>
              </div>

              {/* Layer 2 */}
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2">Layer 2: Groq</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Llama 3.1 8B - Free tier ultra-rapide
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• 28% des requêtes</li>
                  <li>• 6000 req/jour gratuites</li>
                  <li>• Latence: 200-500ms</li>
                  <li>• Questions générales</li>
                </ul>
              </div>

              {/* Layer 3 */}
              <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                <h3 className="font-bold text-orange-800 mb-2">Layer 3: OpenAI</h3>
                <p className="text-sm text-orange-700 mb-3">
                  GPT-4o-mini - Fallback payant
                </p>
                <ul className="text-xs text-orange-600 space-y-1">
                  <li>• 2% des requêtes</li>
                  <li>• Questions complexes</li>
                  <li>• Latence: 500ms-2s</li>
                  <li>• Tool calling avancé</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Comment ça fonctionne ?</h4>
              <ol className="text-sm text-gray-600 space-y-2">
                <li>1. <strong>Réception</strong> : L'utilisateur envoie un message</li>
                <li>2. <strong>Analyse</strong> : Détection d'intent et calcul de complexité</li>
                <li>3. <strong>Routing</strong> : FAQ si confiance &gt; 70%, sinon Groq</li>
                <li>4. <strong>Fallback</strong> : OpenAI si Groq atteint sa limite ou question trop complexe</li>
                <li>5. <strong>Tracking</strong> : Enregistrement des coûts et métriques</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Top Pages */}
      {stats?.topPages && stats.topPages.length > 0 && (
        <div className="bg-white border border-gray-200 superellipse-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pages les plus actives
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Page</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Conversations</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Messages</th>
                </tr>
              </thead>
              <tbody>
                {stats.topPages.map((page, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 font-mono text-xs text-gray-700">
                      {page.page_path}
                    </td>
                    <td className="text-right py-2 px-3 text-gray-900">
                      {page.total_conversations}
                    </td>
                    <td className="text-right py-2 px-3 text-gray-900">
                      {page.total_messages}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Last updated */}
      <p className="text-xs text-gray-400 text-center">
        Dernière mise à jour : {stats?.updatedAt ? new Date(stats.updatedAt).toLocaleString('fr-FR') : '—'}
      </p>
    </div>
  );
}
