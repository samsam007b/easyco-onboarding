import { createClient } from '@/lib/auth/supabase-server';
import {
  Shield,
  AlertTriangle,
  Bug,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Lock,
  Zap,
  Server,
  Globe,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Types
interface SecurityError {
  id: string;
  error_type: string;
  severity: string;
  message: string;
  stack_trace: string | null;
  route: string | null;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, any> | null;
  resolved: boolean;
  created_at: string;
}

interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string;
  source: string | null;
  metadata: Record<string, any> | null;
  acknowledged: boolean;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  created_at: string;
}

interface RouteAnalytics {
  id: string;
  route: string;
  method: string;
  avg_response_time_ms: number;
  total_requests: number;
  error_count: number;
  success_count: number;
  p95_response_time_ms: number | null;
  p99_response_time_ms: number | null;
  date: string;
}

interface SecurityVulnerability {
  id: string;
  vulnerability_type: string;
  severity: string;
  title: string;
  description: string;
  affected_component: string | null;
  recommendation: string | null;
  status: string;
  detected_at: string;
  resolved_at: string | null;
}

// Data fetching functions
async function getSecurityStats() {
  const supabase = await createClient();
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    { count: totalErrors },
    { count: errors24h },
    { count: criticalErrors },
    { count: unresolvedErrors },
    { count: totalAlerts },
    { count: activeAlerts },
    { data: latestScore },
  ] = await Promise.all([
    supabase.from('security_errors').select('*', { count: 'exact', head: true }),
    supabase.from('security_errors').select('*', { count: 'exact', head: true }).gte('created_at', last24h.toISOString()),
    supabase.from('security_errors').select('*', { count: 'exact', head: true }).eq('severity', 'critical'),
    supabase.from('security_errors').select('*', { count: 'exact', head: true }).eq('resolved', false),
    supabase.from('security_alerts').select('*', { count: 'exact', head: true }),
    supabase.from('security_alerts').select('*', { count: 'exact', head: true }).eq('acknowledged', false),
    supabase.from('security_score_history').select('*').order('recorded_at', { ascending: false }).limit(1),
  ]);

  return {
    totalErrors: totalErrors || 0,
    errors24h: errors24h || 0,
    criticalErrors: criticalErrors || 0,
    unresolvedErrors: unresolvedErrors || 0,
    totalAlerts: totalAlerts || 0,
    activeAlerts: activeAlerts || 0,
    securityScore: latestScore?.[0]?.overall_score || 85,
  };
}

async function getRecentErrors(limit = 10) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('security_errors')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching security errors:', error);
    return [];
  }
  return data || [];
}

async function getActiveAlerts(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('security_alerts')
    .select('*')
    .eq('acknowledged', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
  return data || [];
}

async function getRoutePerformance(limit = 10) {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('route_analytics')
    .select('*')
    .eq('date', today)
    .order('total_requests', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching route analytics:', error);
    return [];
  }
  return data || [];
}

async function getVulnerabilities() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('security_vulnerabilities')
    .select('*')
    .neq('status', 'resolved')
    .order('detected_at', { ascending: false });

  if (error) {
    console.error('Error fetching vulnerabilities:', error);
    return [];
  }
  return data || [];
}

// Helper functions
function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'low':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'info':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

function getScoreGradient(score: number) {
  if (score >= 80) return 'from-green-500 to-emerald-500';
  if (score >= 60) return 'from-yellow-500 to-amber-500';
  if (score >= 40) return 'from-orange-500 to-red-500';
  return 'from-red-500 to-rose-500';
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getHealthStatus(errorRate: number) {
  if (errorRate < 1) return { status: 'healthy', color: 'text-green-400', bg: 'bg-green-500/20' };
  if (errorRate < 5) return { status: 'degraded', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
  return { status: 'critical', color: 'text-red-400', bg: 'bg-red-500/20' };
}

export default async function SecurityDashboardPage() {
  const [stats, errors, alerts, routes, vulnerabilities] = await Promise.all([
    getSecurityStats(),
    getRecentErrors(),
    getActiveAlerts(),
    getRoutePerformance(),
    getVulnerabilities(),
  ]);

  const statCards = [
    {
      title: 'Score de Securite',
      value: stats.securityScore,
      suffix: '/100',
      icon: Shield,
      color: getScoreColor(stats.securityScore),
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Erreurs (24h)',
      value: stats.errors24h,
      icon: Bug,
      color: stats.errors24h > 10 ? 'text-red-400' : 'text-blue-400',
      bgColor: stats.errors24h > 10 ? 'bg-red-500/10' : 'bg-blue-500/10',
    },
    {
      title: 'Alertes actives',
      value: stats.activeAlerts,
      icon: AlertTriangle,
      color: stats.activeAlerts > 0 ? 'text-orange-400' : 'text-green-400',
      bgColor: stats.activeAlerts > 0 ? 'bg-orange-500/10' : 'bg-green-500/10',
    },
    {
      title: 'Non resolues',
      value: stats.unresolvedErrors,
      icon: Clock,
      color: stats.unresolvedErrors > 5 ? 'text-yellow-400' : 'text-slate-400',
      bgColor: 'bg-slate-500/10',
    },
  ];

  const vulnCounts = {
    critical: vulnerabilities.filter(v => v.severity === 'critical').length,
    high: vulnerabilities.filter(v => v.severity === 'high').length,
    medium: vulnerabilities.filter(v => v.severity === 'medium').length,
    low: vulnerabilities.filter(v => v.severity === 'low').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-emerald-400" />
            Security Center
          </h1>
          <p className="text-slate-400 mt-1">
            Monitoring temps reel et analyse de securite
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                    {stat.value}{stat.suffix || ''}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Score Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              Score de Securite
            </CardTitle>
            <CardDescription>Evaluation globale de la securite</CardDescription>
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
                    stroke="url(#scoreGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(stats.securityScore / 100) * 352} 352`}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" className={`${stats.securityScore >= 80 ? 'text-green-500' : stats.securityScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`} stopColor="currentColor" />
                      <stop offset="100%" className={`${stats.securityScore >= 80 ? 'text-emerald-500' : stats.securityScore >= 60 ? 'text-amber-500' : 'text-rose-500'}`} stopColor="currentColor" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(stats.securityScore)}`}>
                    {stats.securityScore}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                {stats.securityScore >= 80 ? 'Excellent niveau de securite' :
                 stats.securityScore >= 60 ? 'Securite acceptable' :
                 'Ameliorations necessaires'}
              </p>
            </div>

            {/* Vulnerability Summary */}
            <div className="space-y-2 pt-4 border-t border-slate-700">
              <p className="text-sm font-medium text-slate-300 mb-3">Vulnerabilites detectees</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between p-2 rounded bg-red-500/10">
                  <span className="text-xs text-red-400">Critiques</span>
                  <span className="text-sm font-bold text-red-400">{vulnCounts.critical}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-orange-500/10">
                  <span className="text-xs text-orange-400">Hautes</span>
                  <span className="text-sm font-bold text-orange-400">{vulnCounts.high}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-yellow-500/10">
                  <span className="text-xs text-yellow-400">Moyennes</span>
                  <span className="text-sm font-bold text-yellow-400">{vulnCounts.medium}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-blue-500/10">
                  <span className="text-xs text-blue-400">Basses</span>
                  <span className="text-sm font-bold text-blue-400">{vulnCounts.low}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Alertes Actives
                </CardTitle>
                <CardDescription>{stats.activeAlerts} alertes en attente</CardDescription>
              </div>
              {stats.activeAlerts > 0 && (
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  {stats.activeAlerts} non acquittees
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500/50 mx-auto mb-3" />
                <p className="text-slate-400">Aucune alerte active</p>
                <p className="text-xs text-slate-500 mt-1">Tout fonctionne normalement</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert: SecurityAlert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">
                          {alert.title}
                        </span>
                        <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {alert.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(alert.created_at)}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Errors and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Errors */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bug className="w-5 h-5 text-red-400" />
                  Erreurs Recentes
                </CardTitle>
                <CardDescription>Dernieres erreurs capturees</CardDescription>
              </div>
              <Badge className="bg-slate-600/50 text-slate-300">
                {stats.totalErrors} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {errors.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500/50 mx-auto mb-3" />
                <p className="text-slate-400">Aucune erreur recente</p>
              </div>
            ) : (
              <div className="space-y-2">
                {errors.slice(0, 5).map((error: SecurityError) => (
                  <div
                    key={error.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors"
                  >
                    <div className={`p-1.5 rounded ${getSeverityColor(error.severity)}`}>
                      {error.resolved ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white truncate">
                          {error.message.slice(0, 50)}...
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>{error.error_type}</span>
                        {error.route && (
                          <>
                            <span>-</span>
                            <span className="font-mono">{error.route}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge className={`text-xs ${getSeverityColor(error.severity)}`}>
                      {error.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Route Performance */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Performance des Routes
                </CardTitle>
                <CardDescription>Temps de reponse et taux d erreur</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {routes.length === 0 ? (
              <div className="text-center py-8">
                <Server className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Pas de donnees aujourd hui</p>
                <p className="text-xs text-slate-500 mt-1">Les metriques apparaitront avec le trafic</p>
              </div>
            ) : (
              <div className="space-y-3">
                {routes.slice(0, 5).map((route: RouteAnalytics) => {
                  const errorRate = route.total_requests > 0
                    ? (route.error_count / route.total_requests) * 100
                    : 0;
                  const health = getHealthStatus(errorRate);

                  return (
                    <div
                      key={route.id}
                      className="p-3 rounded-lg bg-slate-700/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-mono">
                            {route.method}
                          </Badge>
                          <span className="text-sm text-white font-mono truncate max-w-[200px]">
                            {route.route}
                          </span>
                        </div>
                        <Badge className={`text-xs ${health.bg} ${health.color}`}>
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
                          <p className={`font-medium ${errorRate > 5 ? 'text-red-400' : 'text-slate-300'}`}>
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

      {/* System Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Etat du Systeme
          </CardTitle>
          <CardDescription>Status des composants de monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Error Tracker', status: 'operational', icon: Bug },
              { name: 'Route Monitor', status: 'operational', icon: Activity },
              { name: 'Alert System', status: 'operational', icon: AlertTriangle },
              { name: 'Vuln Scanner', status: 'operational', icon: Shield },
            ].map((system) => (
              <div
                key={system.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30"
              >
                <div className="p-2 rounded-lg bg-green-500/10">
                  <system.icon className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-white">{system.name}</p>
                  <p className="text-xs text-green-400 capitalize">{system.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
