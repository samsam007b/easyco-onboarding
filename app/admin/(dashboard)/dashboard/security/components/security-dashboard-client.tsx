'use client';

import { useSecurityRealtime } from '@/lib/hooks/use-security-realtime';
import { RealtimeStats } from './realtime-stats';
import { RealtimeAlerts } from './realtime-alerts';
import { RealtimeErrors } from './realtime-errors';
import { SecurityAuditLogs } from './security-audit-logs';
import { NotificationHistory } from './notification-history';
import { Error404List } from './error-404-list';
import { SentryIssues } from './sentry-issues';
import { RefreshCw, Shield, Lock, Zap, Server, Globe, Bug, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface SecurityStats {
  totalErrors: number;
  errors24h: number;
  unresolvedErrors: number;
  activeAlerts: number;
  securityScore: number;
}

interface VulnCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface RouteAnalytics {
  id: string;
  route: string;
  method: string;
  avg_response_time_ms: number;
  total_requests: number;
  error_count: number;
}

interface SecurityDashboardClientProps {
  initialStats: SecurityStats;
  initialVulnCounts: VulnCounts;
  initialRoutes: RouteAnalytics[];
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

function getHealthStatus(errorRate: number) {
  if (errorRate < 1) return { status: 'healthy', color: 'text-green-400', bg: 'bg-green-500/20' };
  if (errorRate < 5) return { status: 'degraded', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
  return { status: 'critical', color: 'text-red-400', bg: 'bg-red-500/20' };
}

export function SecurityDashboardClient({
  initialStats,
  initialVulnCounts,
  initialRoutes,
}: SecurityDashboardClientProps) {
  const { stats, recentErrors, activeAlerts, isConnected, refresh } = useSecurityRealtime(initialStats);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-emerald-400" />
            Security Center
          </h1>
          <p className="text-slate-400 mt-1">Monitoring temps reel</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => refresh()}
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </Button>
      </div>

      {/* Real-time Stats */}
      <RealtimeStats stats={stats} isConnected={isConnected} />

      {/* Score + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Score */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              Score de Securite
            </CardTitle>
            <CardDescription>Evaluation globale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-slate-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(stats.securityScore / 100) * 352} 352`}
                    className={cn('transition-all duration-1000', getScoreColor(stats.securityScore))}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn('text-3xl font-bold transition-all', getScoreColor(stats.securityScore))}>
                    {stats.securityScore}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                {stats.securityScore >= 80
                  ? 'Excellent'
                  : stats.securityScore >= 60
                    ? 'Acceptable'
                    : 'A ameliorer'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between p-2 rounded bg-red-500/10">
                <span className="text-xs text-red-400">Critiques</span>
                <span className="text-sm font-bold text-red-400">{initialVulnCounts.critical}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-orange-500/10">
                <span className="text-xs text-orange-400">Hautes</span>
                <span className="text-sm font-bold text-orange-400">{initialVulnCounts.high}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-yellow-500/10">
                <span className="text-xs text-yellow-400">Moyennes</span>
                <span className="text-sm font-bold text-yellow-400">{initialVulnCounts.medium}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-blue-500/10">
                <span className="text-xs text-blue-400">Basses</span>
                <span className="text-sm font-bold text-blue-400">{initialVulnCounts.low}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Alerts */}
        <RealtimeAlerts alerts={activeAlerts} totalActive={stats.activeAlerts} />
      </div>

      {/* Errors + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Errors */}
        <RealtimeErrors errors={recentErrors} totalErrors={stats.totalErrors} />

        {/* Performance */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Performance Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {initialRoutes.length === 0 ? (
              <div className="text-center py-8">
                <Server className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Pas de donnees aujourd'hui</p>
              </div>
            ) : (
              <div className="space-y-3">
                {initialRoutes.map((route) => {
                  const errorRate =
                    route.total_requests > 0
                      ? (route.error_count / route.total_requests) * 100
                      : 0;
                  const health = getHealthStatus(errorRate);
                  return (
                    <div key={route.id} className="p-3 rounded-lg bg-slate-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs font-mono bg-slate-600/50 text-slate-300 border-slate-500">
                            {route.method}
                          </Badge>
                          <span className="text-sm text-white font-mono truncate max-w-[180px]">
                            {route.route}
                          </span>
                        </div>
                        <Badge className={cn('text-xs', health.bg, health.color)}>
                          {health.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500">Requetes</span>
                          <p className="text-slate-300 font-medium">{route.total_requests}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Temps moy.</span>
                          <p className="text-slate-300 font-medium">{route.avg_response_time_ms}ms</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Erreurs</span>
                          <p className={cn('font-medium', errorRate > 5 ? 'text-red-400' : 'text-slate-300')}>
                            {errorRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sentry Issues - Full width */}
      <SentryIssues />

      {/* Notification History + 404 Errors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification History */}
        <NotificationHistory />

        {/* 404 Errors */}
        <Error404List />
      </div>

      {/* System Status + Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Etat du Systeme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Error Tracker', icon: Bug, active: true },
                { name: 'Route Monitor', icon: Activity, active: true },
                { name: 'Alert System', icon: AlertTriangle, active: true },
                { name: 'Vuln Scanner', icon: Shield, active: true },
              ].map((system) => (
                <div key={system.name} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30">
                  <div className={cn('p-2 rounded-lg', system.active ? 'bg-green-500/10' : 'bg-red-500/10')}>
                    <system.icon className={cn('w-4 h-4', system.active ? 'text-green-400' : 'text-red-400')} />
                  </div>
                  <div>
                    <p className="text-sm text-white">{system.name}</p>
                    <p className={cn('text-xs', system.active ? 'text-green-400' : 'text-red-400')}>
                      {system.active ? 'operational' : 'down'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Audit Logs */}
        <SecurityAuditLogs maxLogs={8} />
      </div>
    </div>
  );
}
