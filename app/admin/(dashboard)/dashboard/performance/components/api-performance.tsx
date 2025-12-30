'use client';

import {
  Timer,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Activity,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// ============================================================================
// TYPES
// ============================================================================

interface APIEndpointStats {
  route: string;
  method: string;
  avgResponseTime: number;
  p95ResponseTime: number;
  requestCount: number;
  errorRate: number;
}

interface APIPerformanceProps {
  endpoints: APIEndpointStats[];
  compact?: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================

function getMethodColor(method: string) {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'POST':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'PUT':
    case 'PATCH':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'DELETE':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

function getResponseTimeColor(ms: number) {
  if (ms < 200) return 'text-emerald-400';
  if (ms < 500) return 'text-yellow-400';
  if (ms < 1000) return 'text-orange-400';
  return 'text-red-400';
}

function getResponseTimeBadge(ms: number) {
  if (ms < 200) return { label: 'Rapide', color: 'bg-emerald-500/20 text-emerald-400' };
  if (ms < 500) return { label: 'Normal', color: 'bg-yellow-500/20 text-yellow-400' };
  if (ms < 1000) return { label: 'Lent', color: 'bg-orange-500/20 text-orange-400' };
  return { label: 'Très lent', color: 'bg-red-500/20 text-red-400' };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function APIPerformance({ endpoints, compact = false }: APIPerformanceProps) {
  const totalRequests = endpoints.reduce((sum, e) => sum + e.requestCount, 0);
  const avgResponseTime = endpoints.length > 0
    ? Math.round(endpoints.reduce((sum, e) => sum + e.avgResponseTime * e.requestCount, 0) / totalRequests)
    : 0;
  const slowEndpoints = endpoints.filter(e => e.avgResponseTime > 500);
  const errorEndpoints = endpoints.filter(e => e.errorRate > 1);

  if (compact) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">API Performance</CardTitle>
            <Badge className={avgResponseTime < 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}>
              {avgResponseTime}ms avg
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {endpoints.slice(0, 5).map((endpoint, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Badge variant="secondary" className={`${getMethodColor(endpoint.method)} text-xs px-1.5`}>
                    {endpoint.method}
                  </Badge>
                  <span className="text-sm text-slate-300 truncate">{endpoint.route}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-mono ${getResponseTimeColor(endpoint.avgResponseTime)}`}>
                    {endpoint.avgResponseTime}ms
                  </span>
                  {endpoint.errorRate > 1 && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
            ))}

            {endpoints.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">
                Aucune donnée disponible
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Endpoints actifs</p>
                <p className="text-2xl font-bold text-white">{endpoints.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Timer className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Temps moyen</p>
                <p className={`text-2xl font-bold ${getResponseTimeColor(avgResponseTime)}`}>
                  {avgResponseTime}ms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${slowEndpoints.length > 0 ? 'bg-orange-500/20' : 'bg-emerald-500/20'}`}>
                {slowEndpoints.length > 0 ? (
                  <TrendingDown className="w-5 h-5 text-orange-400" />
                ) : (
                  <Zap className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div>
                <p className="text-xs text-slate-400">Endpoints lents</p>
                <p className={`text-2xl font-bold ${slowEndpoints.length > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                  {slowEndpoints.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${errorEndpoints.length > 0 ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                {errorEndpoints.length > 0 ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div>
                <p className="text-xs text-slate-400">Avec erreurs</p>
                <p className={`text-2xl font-bold ${errorEndpoints.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {errorEndpoints.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Endpoints Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Endpoints les plus actifs</CardTitle>
          <CardDescription>
            Performance des 10 endpoints les plus utilisés aujourd'hui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-3 py-2 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-700">
              <div className="col-span-5">Endpoint</div>
              <div className="col-span-2 text-right">Requêtes</div>
              <div className="col-span-2 text-right">Temps moyen</div>
              <div className="col-span-2 text-right">P95</div>
              <div className="col-span-1 text-right">Erreurs</div>
            </div>

            {/* Rows */}
            {endpoints.map((endpoint, idx) => {
              const badge = getResponseTimeBadge(endpoint.avgResponseTime);
              return (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-4 px-3 py-3 rounded-lg hover:bg-slate-700/30 transition-colors items-center"
                >
                  <div className="col-span-5 flex items-center gap-2 min-w-0">
                    <Badge variant="secondary" className={`${getMethodColor(endpoint.method)} text-xs shrink-0`}>
                      {endpoint.method}
                    </Badge>
                    <span className="text-sm text-white truncate font-mono">{endpoint.route}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm text-slate-300">{endpoint.requestCount.toLocaleString()}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`text-sm font-mono ${getResponseTimeColor(endpoint.avgResponseTime)}`}>
                      {endpoint.avgResponseTime}ms
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`text-sm font-mono ${getResponseTimeColor(endpoint.p95ResponseTime)}`}>
                      {endpoint.p95ResponseTime}ms
                    </span>
                  </div>
                  <div className="col-span-1 text-right">
                    {endpoint.errorRate > 0 ? (
                      <span className={`text-sm ${endpoint.errorRate > 1 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {endpoint.errorRate}%
                      </span>
                    ) : (
                      <span className="text-sm text-emerald-400">0%</span>
                    )}
                  </div>
                </div>
              );
            })}

            {endpoints.length === 0 && (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Aucune donnée disponible pour aujourd'hui</p>
                <p className="text-sm text-slate-500 mt-1">
                  Les données seront disponibles après quelques requêtes API
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Slow Endpoints Warning */}
      {slowEndpoints.length > 0 && (
        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              <CardTitle className="text-orange-400 text-lg">Endpoints à optimiser</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {slowEndpoints.map((endpoint, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getMethodColor(endpoint.method)}>
                      {endpoint.method}
                    </Badge>
                    <span className="text-sm text-white font-mono">{endpoint.route}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-orange-400 font-mono">{endpoint.avgResponseTime}ms</p>
                    <p className="text-xs text-slate-400">{endpoint.requestCount} requêtes</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
