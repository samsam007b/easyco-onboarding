/**
 * EASYCO SECURITY COMMAND CENTER
 *
 * Dashboard ultra-moderne de sécurité et observabilité
 * Visualisation en temps réel avec graphiques interactifs
 */

'use client';

import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Activity, Lock, Eye, TrendingUp, TrendingDown, Minus, Zap, FileWarning, Database, Route, Bug, Bell } from 'lucide-react';

interface SecurityData {
  timestamp: string;
  timeWindow: string;
  overview: {
    securityScore: number;
    securityTrend: 'improving' | 'stable' | 'declining';
    systemHealth: 'healthy' | 'degraded' | 'critical';
    criticalIssues: number;
    unacknowledgedAlerts: number;
    activeVulnerabilities: number;
  };
  securityScore: {
    overall: number;
    breakdown: {
      authentication: number;
      authorization: number;
      dataProtection: number;
      vulnerabilities: number;
      monitoring: number;
      compliance: number;
    };
    issues: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    trend: string;
    recommendations: string[];
  };
  errors: any;
  security: any;
  systemHealth: any;
  alerts: any;
  predictions: any[];
  vulnerabilities: any;
}

export default function SecurityCommandCenter() {
  const [data, setData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState('24 hours');
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 secondes
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await fetch(`/api/admin/security-command-center?timeWindow=${timeWindow}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch security data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [timeWindow, refreshInterval]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Loading Security Command Center...</p>
        </div>
      </div>
    );
  }

  const { overview, securityScore, errors, security, systemHealth, alerts, predictions, vulnerabilities } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="w-10 h-10 text-emerald-400" />
              Security Command Center
            </h1>
            <p className="text-slate-400">
              Surveillance en temps réel • Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="1 hour">Dernière heure</option>
              <option value="24 hours">Dernières 24h</option>
              <option value="7 days">7 derniers jours</option>
              <option value="30 days">30 derniers jours</option>
            </select>

            <button
              onClick={fetchData}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Score Global - Carte Hero */}
      <div className="mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Score principal */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/50 mb-4">
                      <span className="text-5xl font-bold text-white">{securityScore.overall}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Score de Sécurité</h2>
                  <div className="flex items-center justify-center gap-2">
                    {overview.securityTrend === 'improving' && <TrendingUp className="w-5 h-5 text-emerald-400" />}
                    {overview.securityTrend === 'declining' && <TrendingDown className="w-5 h-5 text-red-400" />}
                    {overview.securityTrend === 'stable' && <Minus className="w-5 h-5 text-blue-400" />}
                    <span className={`font-medium ${
                      overview.securityTrend === 'improving' ? 'text-emerald-400' :
                      overview.securityTrend === 'declining' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {overview.securityTrend === 'improving' ? 'En amélioration' :
                       overview.securityTrend === 'declining' ? 'En déclin' : 'Stable'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scores par catégorie */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  <ScoreBar label="Authentication" score={securityScore.breakdown.authentication} color="emerald" />
                  <ScoreBar label="Authorization" score={securityScore.breakdown.authorization} color="blue" />
                  <ScoreBar label="Data Protection" score={securityScore.breakdown.dataProtection} color="purple" />
                  <ScoreBar label="Vulnerabilities" score={securityScore.breakdown.vulnerabilities} color="amber" />
                  <ScoreBar label="Monitoring" score={securityScore.breakdown.monitoring} color="cyan" />
                  <ScoreBar label="Compliance" score={securityScore.breakdown.compliance} color="pink" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          icon={AlertTriangle}
          label="Problèmes Critiques"
          value={overview.criticalIssues}
          color="red"
          trend={overview.criticalIssues === 0 ? 'good' : 'bad'}
        />
        <KPICard
          icon={Bell}
          label="Alertes Non Acquittées"
          value={overview.unacknowledgedAlerts}
          color="amber"
          trend={overview.unacknowledgedAlerts > 5 ? 'bad' : 'neutral'}
        />
        <KPICard
          icon={FileWarning}
          label="Vulnérabilités Actives"
          value={overview.activeVulnerabilities}
          color="orange"
          trend={overview.activeVulnerabilities === 0 ? 'good' : 'bad'}
        />
        <KPICard
          icon={Activity}
          label="État du Système"
          value={systemHealth.overall}
          color={systemHealth.overall === 'healthy' ? 'emerald' : systemHealth.overall === 'degraded' ? 'amber' : 'red'}
          trend={systemHealth.overall === 'healthy' ? 'good' : systemHealth.overall === 'degraded' ? 'neutral' : 'bad'}
          isStatus
        />
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Erreurs récentes */}
        <DataCard
          title="Erreurs"
          icon={Bug}
          color="red"
          stats={[
            { label: 'Total', value: errors.total },
            { label: 'Critical', value: errors.bySeverity.critical },
            { label: 'High', value: errors.bySeverity.high },
          ]}
        >
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {errors.recent.map((error: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white truncate">{error.message}</p>
                  <p className="text-xs text-slate-400">{error.route || 'N/A'} • {new Date(error.created_at).toLocaleString('fr-FR')}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  error.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  error.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  error.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {error.severity}
                </span>
              </div>
            ))}
          </div>
        </DataCard>

        {/* Événements de sécurité */}
        <DataCard
          title="Événements de Sécurité"
          icon={Shield}
          color="emerald"
          stats={[
            { label: 'Total', value: security.totalEvents },
            { label: 'Critical', value: security.criticalEvents },
            { label: 'Blocked', value: security.blockedRequests },
          ]}
        >
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {security.recent.map((event: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white truncate">{event.description}</p>
                  <p className="text-xs text-slate-400">{event.event_type} • {new Date(event.created_at).toLocaleString('fr-FR')}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  event.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  event.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {event.severity}
                </span>
              </div>
            ))}
          </div>
        </DataCard>
      </div>

      {/* Santé du système et vulnérabilités */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Santé des routes */}
        <DataCard
          title="Santé des Routes"
          icon={Route}
          color="blue"
          stats={[
            { label: 'Total', value: systemHealth.totalRoutes },
            { label: 'Healthy', value: systemHealth.healthy },
            { label: 'Issues', value: systemHealth.degraded + systemHealth.critical },
          ]}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Routes saines</span>
              <div className="flex-1 mx-4 bg-slate-700 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(systemHealth.healthy / systemHealth.totalRoutes) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-emerald-400">{systemHealth.healthy}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Dégradées</span>
              <div className="flex-1 mx-4 bg-slate-700 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(systemHealth.degraded / systemHealth.totalRoutes) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-amber-400">{systemHealth.degraded}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Critiques</span>
              <div className="flex-1 mx-4 bg-slate-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(systemHealth.critical / systemHealth.totalRoutes) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-red-400">{systemHealth.critical}</span>
            </div>
          </div>
        </DataCard>

        {/* Vulnérabilités */}
        <DataCard
          title="Vulnérabilités"
          icon={FileWarning}
          color="amber"
          stats={[
            { label: 'Critical', value: vulnerabilities.critical },
            { label: 'High', value: vulnerabilities.high },
            { label: 'Total', value: vulnerabilities.recent.length },
          ]}
        >
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {vulnerabilities.recent.map((vuln: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-white">{vuln.title}</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    vuln.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    vuln.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    vuln.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {vuln.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{vuln.description}</p>
                {vuln.remediation && (
                  <p className="text-xs text-emerald-400 mt-1">→ {vuln.remediation}</p>
                )}
              </div>
            ))}
          </div>
        </DataCard>
      </div>

      {/* Prédictions et recommandations */}
      {predictions && predictions.length > 0 && (
        <div className="mb-8">
          <DataCard
            title="Prédictions & Intelligence"
            icon={Zap}
            color="purple"
            stats={[
              { label: 'Prédictions', value: predictions.length },
            ]}
          >
            <div className="space-y-3">
              {predictions.map((pred: any, idx: number) => (
                <div key={idx} className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      {pred.prediction}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-purple-400">{Math.round(pred.probability * 100)}% probabilité</span>
                      <span className="text-xs text-slate-400">• {pred.timeframe}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-slate-300 mb-1">Actions préventives recommandées:</p>
                    <ul className="space-y-1">
                      {pred.preventiveActions.map((action: string, actionIdx: number) => (
                        <li key={actionIdx} className="text-xs text-slate-400 flex items-start gap-2">
                          <span className="text-emerald-400">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </DataCard>
        </div>
      )}

      {/* Recommandations principales */}
      {securityScore.recommendations && securityScore.recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            Recommandations Prioritaires
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {securityScore.recommendations.map((rec: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-slate-300">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Components

function KPICard({ icon: Icon, label, value, color, trend, isStatus }: any) {
  const colorClasses = {
    red: 'from-red-500 to-red-600 shadow-red-500/30',
    amber: 'from-amber-500 to-amber-600 shadow-amber-500/30',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/30',
    orange: 'from-orange-500 to-orange-600 shadow-orange-500/30',
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/30',
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} shadow-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && !isStatus && (
          <div className={`text-xs font-medium px-2 py-1 rounded ${
            trend === 'good' ? 'bg-emerald-500/20 text-emerald-400' :
            trend === 'bad' ? 'bg-red-500/20 text-red-400' :
            'bg-slate-500/20 text-slate-400'
          }`}>
            {trend === 'good' ? '↓' : trend === 'bad' ? '↑' : '→'}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{isStatus ? value.toUpperCase() : value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    cyan: 'bg-cyan-500',
    pink: 'bg-pink-500',
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-sm font-bold text-white">{score}/100</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className={`${colorClasses[color]} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function DataCard({ title, icon: Icon, color, stats, children }: any) {
  const colorClasses: Record<string, string> = {
    red: 'text-red-400 bg-red-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${colorClasses[color].split(' ')[0]}`} />
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <div className="flex gap-4">
          {stats.map((stat: any, idx: number) => (
            <div key={idx} className="text-right">
              <p className="text-xs text-slate-400">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
