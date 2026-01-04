'use client';

import { useState } from 'react';
import {
  Activity,
  Zap,
  Timer,
  TrendingUp,
  Database,
  Package,
  Globe,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CoreWebVitals } from './core-web-vitals';
import { APIPerformance } from './api-performance';
import { PerformanceMaturityDashboard } from './performance-maturity-dashboard';

// ============================================================================
// TYPES
// ============================================================================

interface PerformanceStats {
  overallScore: number;
  webVitalsScore: number;
  apiScore: number;
  databaseScore: number;
  bundleScore: number;
  totalRequests24h: number;
  avgResponseTime: number;
  errorRate: number;
}

interface WebVitalsData {
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  inp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
}

interface APIEndpointStats {
  route: string;
  method: string;
  avgResponseTime: number;
  p95ResponseTime: number;
  requestCount: number;
  errorRate: number;
}

interface PerformanceDashboardClientProps {
  initialStats: PerformanceStats;
  initialWebVitals: WebVitalsData;
  initialAPIEndpoints: APIEndpointStats[];
}

// ============================================================================
// COMPONENT
// ============================================================================

export function PerformanceDashboardClient({
  initialStats,
  initialWebVitals,
  initialAPIEndpoints,
}: PerformanceDashboardClientProps) {
  const [stats, setStats] = useState(initialStats);
  const [webVitals, setWebVitals] = useState(initialWebVitals);
  const [apiEndpoints, setApiEndpoints] = useState(initialAPIEndpoints);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh data by reloading the page (server-side refresh)
      window.location.reload();
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/20 border-emerald-500/30';
    if (score >= 70) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 50) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    if (score >= 70) return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    return <AlertCircle className="w-5 h-5 text-red-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 superellipse-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            Performance Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Monitoring des performances et optimisations
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="border-slate-600 hover:bg-slate-700"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Overall Score */}
        <Card className={`bg-slate-800/50 border ${getScoreBgColor(stats.overallScore)}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Score Global</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats.overallScore)}`}>
                  {stats.overallScore}
                </p>
              </div>
              <div className="p-3 bg-slate-700/50 superellipse-xl">
                {getScoreIcon(stats.overallScore)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Web Vitals Score */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Web Vitals</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats.webVitalsScore)}`}>
                  {stats.webVitalsScore}
                </p>
              </div>
              <div className="p-3 bg-cyan-500/20 superellipse-xl">
                <Globe className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Score */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">API</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats.apiScore)}`}>
                  {stats.apiScore}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 superellipse-xl">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Score */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Database</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats.databaseScore)}`}>
                  {stats.databaseScore}
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 superellipse-xl">
                <Database className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bundle Score */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Bundle</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats.bundleScore)}`}>
                  {stats.bundleScore}
                </p>
              </div>
              <div className="p-3 bg-orange-500/20 superellipse-xl">
                <Package className="w-5 h-5 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 superellipse-xl">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Requêtes (24h)</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalRequests24h.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 superellipse-xl">
                <Timer className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Temps de réponse moyen</p>
                <p className="text-2xl font-bold text-white">
                  {stats.avgResponseTime}ms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 superellipse-xl ${stats.errorRate > 1 ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                <AlertCircle className={`w-5 h-5 ${stats.errorRate > 1 ? 'text-red-400' : 'text-emerald-400'}`} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Taux d'erreur</p>
                <p className={`text-2xl font-bold ${stats.errorRate > 1 ? 'text-red-400' : 'text-white'}`}>
                  {stats.errorRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="webvitals" className="data-[state=active]:bg-slate-700">
            Web Vitals
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-slate-700">
            API Performance
          </TabsTrigger>
          <TabsTrigger value="maturity" className="data-[state=active]:bg-slate-700">
            Maturité 360°
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CoreWebVitals webVitals={webVitals} compact />
            <APIPerformance endpoints={apiEndpoints} compact />
          </div>
        </TabsContent>

        <TabsContent value="webvitals">
          <CoreWebVitals webVitals={webVitals} />
        </TabsContent>

        <TabsContent value="api">
          <APIPerformance endpoints={apiEndpoints} />
        </TabsContent>

        <TabsContent value="maturity">
          <PerformanceMaturityDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
