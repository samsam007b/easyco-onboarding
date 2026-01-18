/**
 * Dashboard Performance & Scalabilité
 * Affiche métriques Supabase et alertes de migration
 *
 * Route : /admin/performance
 * Auth : Admin seulement
 */

'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Database, HardDrive, Activity, Wifi } from 'lucide-react';

interface Metrics {
  activeConnections: number;
  maxConnections: number;
  connectionUsagePercent: number;
  storageUsedBytes: number;
  storageMaxBytes: number;
  storageUsagePercent: number;
  bandwidthUsedBytes: number;
  bandwidthMaxBytes: number;
  bandwidthUsagePercent: number;
  apiLatencyP50: number;
  apiLatencyP95: number;
  apiLatencyP99: number;
  realtimeDisconnectRate: number;
  timestamp: string;
  planType: string;
}

interface Alert {
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  recommendation?: string;
}

interface MigrationCheck {
  shouldMigrate: boolean;
  reason: string;
  criticalAlerts: Alert[];
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [migration, setMigration] = useState<MigrationCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 60000); // Refresh toutes les 60 sec
    return () => clearInterval(interval);
  }, []);

  async function loadMetrics() {
    try {
      const response = await fetch('/api/monitoring/metrics');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setMetrics(data.metrics);
      setAlerts(data.alerts);
      setMigration(data.migration);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-heading">Chargement des métriques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-heading text-red-700">Erreur de Chargement</h2>
            </div>
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadMetrics}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">
            Performance & Scalabilité
          </h1>
          <p className="text-gray-600">
            Monitoring Supabase Free Tier · Dernière mise à jour :{' '}
            {metrics ? new Date(metrics.timestamp).toLocaleString('fr-FR') : '—'}
          </p>
        </div>

        {/* Alert Migration Supabase Pro */}
        {migration?.shouldMigrate && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-500 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-2xl font-heading font-bold text-red-700 mb-2">
                  🚨 Migration Supabase Pro Requise
                </h2>
                <p className="text-red-600 mb-4 text-lg">{migration.reason}</p>

                {migration.criticalAlerts.length > 0 && (
                  <div className="bg-white/50 rounded-xl p-4 mb-4">
                    <h3 className="font-heading font-semibold text-red-700 mb-2">
                      Alertes Critiques :
                    </h3>
                    <ul className="space-y-2">
                      {migration.criticalAlerts.map((alert, i) => (
                        <li key={i} className="text-red-600">
                          <strong>{alert.metric}</strong> : {alert.message}
                          {alert.recommendation && (
                            <div className="text-sm text-red-500 mt-1 ml-4">
                              → {alert.recommendation}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <a
                  href="https://supabase.com/dashboard/project/_/settings/billing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-red-600 text-white font-heading font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg"
                >
                  Migrer vers Supabase Pro (€25/mois) →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Métriques Grid */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Connexions Database"
              icon={<Database className="w-6 h-6" />}
              value={metrics.activeConnections}
              max={metrics.maxConnections}
              unit="connexions"
              percentage={metrics.connectionUsagePercent}
              thresholds={{ warning: 60, critical: 80 }}
            />

            <MetricCard
              title="Storage Utilisé"
              icon={<HardDrive className="w-6 h-6" />}
              value={metrics.storageUsedBytes}
              max={metrics.storageMaxBytes}
              unit="bytes"
              percentage={metrics.storageUsagePercent}
              thresholds={{ warning: 60, critical: 80 }}
              formatter={(v) => `${(v / 1_000_000_000).toFixed(2)} GB`}
            />

            <MetricCard
              title="Bandwidth Mensuel"
              icon={<TrendingUp className="w-6 h-6" />}
              value={metrics.bandwidthUsedBytes}
              max={metrics.bandwidthMaxBytes}
              unit="bytes"
              percentage={metrics.bandwidthUsagePercent}
              thresholds={{ warning: 60, critical: 80 }}
              formatter={(v) => `${(v / 1_000_000_000).toFixed(2)} GB`}
            />

            <MetricCard
              title="Latence API (p95)"
              icon={<Activity className="w-6 h-6" />}
              value={metrics.apiLatencyP95}
              max={5000}
              unit="ms"
              percentage={(metrics.apiLatencyP95 / 5000) * 100}
              thresholds={{ warning: 30, critical: 40 }}
              formatter={(v) => `${v.toFixed(0)} ms`}
            />

            <MetricCard
              title="Latence API (p50)"
              icon={<Activity className="w-6 h-6" />}
              value={metrics.apiLatencyP50}
              max={2000}
              unit="ms"
              percentage={(metrics.apiLatencyP50 / 2000) * 100}
              thresholds={{ warning: 25, critical: 50 }}
              formatter={(v) => `${v.toFixed(0)} ms`}
            />

            <MetricCard
              title="Real-time Disconnects"
              icon={<Wifi className="w-6 h-6" />}
              value={metrics.realtimeDisconnectRate}
              max={0.2}
              unit="%"
              percentage={(metrics.realtimeDisconnectRate / 0.2) * 100}
              thresholds={{ warning: 25, critical: 50 }}
              formatter={(v) => `${(v * 100).toFixed(1)}%`}
            />
          </div>
        )}

        {/* Alertes */}
        {alerts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
              Alertes Actives
            </h2>
            <div className="space-y-4">
              {alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`border-l-4 p-4 rounded-r-xl ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-50 border-red-500'
                      : alert.severity === 'WARNING'
                      ? 'bg-orange-50 border-orange-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {alert.severity === 'CRITICAL' ? (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                    ) : alert.severity === 'WARNING' ? (
                      <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            alert.severity === 'CRITICAL'
                              ? 'bg-red-600 text-white'
                              : alert.severity === 'WARNING'
                              ? 'bg-orange-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="font-heading font-semibold text-gray-900">
                          {alert.metric}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{alert.message}</p>
                      {alert.recommendation && (
                        <p className="text-sm text-gray-600 bg-white/50 rounded-lg p-3 border border-gray-200">
                          <strong>Recommandation :</strong> {alert.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Rapides */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            Actions Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/AUDIT_PERFORMANCE_SCALABILITE.md"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                📊
              </div>
              <div>
                <div className="font-heading font-semibold text-gray-900">
                  Audit Complet
                </div>
                <div className="text-sm text-gray-600">
                  Voir rapport détaillé de scalabilité
                </div>
              </div>
            </a>

            <a
              href="/PLAN_AMELIORATION_SCALABILITE.md"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                🚀
              </div>
              <div>
                <div className="font-heading font-semibold text-gray-900">
                  Plan d'Amélioration
                </div>
                <div className="text-sm text-gray-600">
                  Roadmap d'optimisation progressive
                </div>
              </div>
            </a>

            <button
              onClick={loadMetrics}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                🔄
              </div>
              <div className="text-left">
                <div className="font-heading font-semibold text-gray-900">
                  Actualiser Métriques
                </div>
                <div className="text-sm text-gray-600">
                  Recharger les données en temps réel
                </div>
              </div>
            </button>

            <a
              href="https://supabase.com/dashboard/project/_/settings/database"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                🔧
              </div>
              <div>
                <div className="font-heading font-semibold text-gray-900">
                  Supabase Dashboard
                </div>
                <div className="text-sm text-gray-600">
                  Gérer configuration database
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Composant Carte Métrique
 */
function MetricCard({
  title,
  icon,
  value,
  max,
  unit,
  percentage,
  thresholds,
  formatter,
}: {
  title: string;
  icon: React.ReactNode;
  value: number;
  max: number;
  unit: string;
  percentage: number;
  thresholds: { warning: number; critical: number };
  formatter?: (v: number) => string;
}) {
  const isCritical = percentage >= thresholds.critical;
  const isWarning = percentage >= thresholds.warning && !isCritical;
  const isOk = !isCritical && !isWarning;

  const color = isCritical ? 'red' : isWarning ? 'orange' : 'green';
  const bgColor = isCritical
    ? 'bg-red-50'
    : isWarning
    ? 'bg-orange-50'
    : 'bg-green-50';
  const borderColor = isCritical
    ? 'border-red-500'
    : isWarning
    ? 'border-orange-500'
    : 'border-green-500';
  const textColor = isCritical
    ? 'text-red-700'
    : isWarning
    ? 'text-orange-700'
    : 'text-green-700';
  const barColor = isCritical
    ? 'bg-red-500'
    : isWarning
    ? 'bg-orange-500'
    : 'bg-green-500';

  return (
    <div className={`${bgColor} border-2 ${borderColor} rounded-2xl p-6 shadow-md`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`${textColor}`}>{icon}</div>
        <h3 className="text-lg font-heading font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            {formatter ? formatter(value) : `${value} ${unit}`}
          </span>
          <span className="text-gray-600">
            / {formatter ? formatter(max) : `${max} ${unit}`}
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div
          className={`${barColor} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className={`font-semibold ${textColor}`}>
          {percentage.toFixed(1)}% utilisé
        </span>
        {isCritical && <span className="text-red-600 font-semibold">⚠️ CRITIQUE</span>}
        {isWarning && <span className="text-orange-600 font-semibold">⚠️ ATTENTION</span>}
        {isOk && <span className="text-green-600 font-semibold">✓ OK</span>}
      </div>
    </div>
  );
}
