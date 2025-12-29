/**
 * IZZICO ROUTE & ENDPOINT MONITORING
 *
 * Système d'audit et monitoring des routes/endpoints
 * Tracking de performance, erreurs, et patterns d'utilisation
 */

import { createClient } from '@/lib/auth/supabase-client';

export interface RouteMetrics {
  route: string;
  method: string;
  responseTimeMs: number;
  statusCode: number;
  userId?: string;
  userType?: string;
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
  responseSizeBytes?: number;
  errorOccurred: boolean;
  metadata?: Record<string, any>;
}

export interface RouteAnalytics {
  route: string;
  totalRequests: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  successRate: number;
  statusCodeDistribution: Record<number, number>;
  slowestRequests: Array<{
    timestamp: string;
    responseTime: number;
    userId?: string;
    statusCode: number;
  }>;
}

export interface EndpointHealth {
  route: string;
  status: 'healthy' | 'degraded' | 'critical';
  avgResponseTime: number;
  errorRate: number;
  requestsPerMinute: number;
  issues: string[];
  recommendations: string[];
}

class RouteMonitor {
  private static instance: RouteMonitor;
  private supabase = createClient();
  private metricsQueue: RouteMetrics[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 50;
  private readonly FLUSH_INTERVAL = 3000; // 3 secondes

  private constructor() {
    this.startAutoFlush();
  }

  public static getInstance(): RouteMonitor {
    if (!RouteMonitor.instance) {
      RouteMonitor.instance = new RouteMonitor();
    }
    return RouteMonitor.instance;
  }

  /**
   * Tracker une requête
   */
  public async trackRequest(metrics: RouteMetrics): Promise<void> {
    try {
      // Ajouter à la queue
      this.metricsQueue.push(metrics);

      // Flush si la queue est pleine ou si c'est une erreur
      if (this.metricsQueue.length >= this.BATCH_SIZE || metrics.errorOccurred) {
        await this.flush();
      }

      // Logger les requêtes lentes en développement
      if (process.env.NODE_ENV === 'development' && metrics.responseTimeMs > 1000) {
        console.warn(
          `[ROUTE MONITOR] Slow request: ${metrics.method} ${metrics.route} - ${metrics.responseTimeMs}ms`
        );
      }
    } catch (error) {
      console.error('[ROUTE MONITOR] Failed to track request:', error);
    }
  }

  /**
   * Flush la queue vers la base de données
   */
  private async flush(): Promise<void> {
    if (this.metricsQueue.length === 0) return;

    const metrics = [...this.metricsQueue];
    this.metricsQueue = [];

    try {
      const formattedMetrics = metrics.map(m => ({
        route: m.route,
        method: m.method,
        response_time_ms: m.responseTimeMs,
        status_code: m.statusCode,
        user_id: m.userId,
        user_type: m.userType,
        ip_address: m.ipAddress,
        user_agent: m.userAgent,
        referer: m.referer,
        response_size_bytes: m.responseSizeBytes,
        error_occurred: m.errorOccurred,
        metadata: m.metadata || {},
      }));

      const { error } = await this.supabase.from('route_analytics').insert(formattedMetrics);

      if (error) {
        console.error('[ROUTE MONITOR] Failed to insert metrics:', error);
        // Remettre dans la queue
        this.metricsQueue.unshift(...metrics);
      }
    } catch (error) {
      console.error('[ROUTE MONITOR] Flush failed:', error);
      this.metricsQueue.unshift(...metrics);
    }
  }

  /**
   * Démarrer le flush automatique
   */
  private startAutoFlush(): void {
    this.flushInterval = setInterval(() => {
      this.flush();
    }, this.FLUSH_INTERVAL);
  }

  /**
   * Arrêter le flush automatique
   */
  public stopAutoFlush(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  /**
   * Obtenir les analytics d'une route
   */
  public async getRouteAnalytics(
    route: string,
    timeWindow: string = '24 hours'
  ): Promise<RouteAnalytics | null> {
    try {
      const timeAgo = this.parseTimeWindow(timeWindow);
      const { data, error } = await this.supabase
        .from('route_analytics')
        .select('*')
        .eq('route', route)
        .gte('created_at', new Date(Date.now() - timeAgo).toISOString())
        .order('response_time_ms', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return null;

      const totalRequests = data.length;
      const responseTimes = data.map(d => d.response_time_ms).sort((a, b) => a - b);
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / totalRequests;
      const minResponseTime = responseTimes[0];
      const maxResponseTime = responseTimes[responseTimes.length - 1];
      const p95Index = Math.floor(totalRequests * 0.95);
      const p99Index = Math.floor(totalRequests * 0.99);
      const p95ResponseTime = responseTimes[p95Index];
      const p99ResponseTime = responseTimes[p99Index];

      const errorCount = data.filter(d => d.error_occurred).length;
      const errorRate = (errorCount / totalRequests) * 100;
      const successRate = 100 - errorRate;

      const statusCodeDistribution: Record<number, number> = {};
      data.forEach(d => {
        statusCodeDistribution[d.status_code] = (statusCodeDistribution[d.status_code] || 0) + 1;
      });

      const slowestRequests = data
        .slice(0, 10)
        .map(d => ({
          timestamp: d.created_at,
          responseTime: d.response_time_ms,
          userId: d.user_id,
          statusCode: d.status_code,
        }));

      return {
        route,
        totalRequests,
        avgResponseTime: Math.round(avgResponseTime),
        minResponseTime,
        maxResponseTime,
        p95ResponseTime,
        p99ResponseTime,
        errorRate: parseFloat(errorRate.toFixed(2)),
        successRate: parseFloat(successRate.toFixed(2)),
        statusCodeDistribution,
        slowestRequests,
      };
    } catch (error) {
      console.error('[ROUTE MONITOR] Failed to get route analytics:', error);
      return null;
    }
  }

  /**
   * Obtenir toutes les routes avec leurs métriques
   */
  public async getAllRoutesMetrics(
    timeWindow: string = '24 hours'
  ): Promise<
    Array<{
      route: string;
      method: string;
      requests: number;
      avgResponseTime: number;
      errorRate: number;
    }>
  > {
    try {
      const timeAgo = this.parseTimeWindow(timeWindow);
      const { data, error } = await this.supabase
        .from('route_analytics')
        .select('route, method, response_time_ms, error_occurred')
        .gte('created_at', new Date(Date.now() - timeAgo).toISOString());

      if (error) throw error;
      if (!data) return [];

      // Grouper par route + method
      const grouped = new Map<
        string,
        { responseTimes: number[]; errorCount: number; totalCount: number }
      >();

      data.forEach((d: any) => {
        const key = `${d.method} ${d.route}`;
        const existing = grouped.get(key) || { responseTimes: [], errorCount: 0, totalCount: 0 };
        existing.responseTimes.push(d.response_time_ms);
        existing.totalCount++;
        if (d.error_occurred) existing.errorCount++;
        grouped.set(key, existing);
      });

      // Calculer les métriques
      const metrics = Array.from(grouped.entries()).map(([key, stats]) => {
        const [method, ...routeParts] = key.split(' ');
        const route = routeParts.join(' ');
        const avgResponseTime =
          stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length;
        const errorRate = (stats.errorCount / stats.totalCount) * 100;

        return {
          route,
          method,
          requests: stats.totalCount,
          avgResponseTime: Math.round(avgResponseTime),
          errorRate: parseFloat(errorRate.toFixed(2)),
        };
      });

      return metrics.sort((a, b) => b.requests - a.requests);
    } catch (error) {
      console.error('[ROUTE MONITOR] Failed to get all routes metrics:', error);
      return [];
    }
  }

  /**
   * Évaluer la santé d'un endpoint
   */
  public async evaluateEndpointHealth(route: string): Promise<EndpointHealth> {
    try {
      const analytics = await this.getRouteAnalytics(route, '1 hour');

      if (!analytics) {
        return {
          route,
          status: 'healthy',
          avgResponseTime: 0,
          errorRate: 0,
          requestsPerMinute: 0,
          issues: ['No data available'],
          recommendations: [],
        };
      }

      const issues: string[] = [];
      const recommendations: string[] = [];
      let status: 'healthy' | 'degraded' | 'critical' = 'healthy';

      // Analyser le taux d'erreur
      if (analytics.errorRate > 10) {
        issues.push(`High error rate: ${analytics.errorRate}%`);
        recommendations.push('Investigate error logs and add error handling');
        status = 'critical';
      } else if (analytics.errorRate > 5) {
        issues.push(`Elevated error rate: ${analytics.errorRate}%`);
        recommendations.push('Monitor error patterns closely');
        if (status === 'healthy') status = 'degraded';
      }

      // Analyser les temps de réponse
      if (analytics.avgResponseTime > 2000) {
        issues.push(`Very slow average response time: ${analytics.avgResponseTime}ms`);
        recommendations.push('Optimize database queries and add caching');
        status = 'critical';
      } else if (analytics.avgResponseTime > 1000) {
        issues.push(`Slow average response time: ${analytics.avgResponseTime}ms`);
        recommendations.push('Consider performance optimization');
        if (status === 'healthy') status = 'degraded';
      }

      // Analyser les percentiles
      if (analytics.p95ResponseTime > 5000) {
        issues.push(`P95 response time very high: ${analytics.p95ResponseTime}ms`);
        recommendations.push('Investigate slowest requests and optimize bottlenecks');
        if (status === 'healthy') status = 'degraded';
      }

      // Calculer les requêtes par minute
      const requestsPerMinute = analytics.totalRequests / 60;

      // Vérifier les pics de charge
      if (requestsPerMinute > 100) {
        recommendations.push('High traffic - consider implementing rate limiting');
      }

      return {
        route,
        status,
        avgResponseTime: analytics.avgResponseTime,
        errorRate: analytics.errorRate,
        requestsPerMinute: parseFloat(requestsPerMinute.toFixed(2)),
        issues,
        recommendations,
      };
    } catch (error) {
      console.error('[ROUTE MONITOR] Failed to evaluate endpoint health:', error);
      return {
        route,
        status: 'healthy',
        avgResponseTime: 0,
        errorRate: 0,
        requestsPerMinute: 0,
        issues: ['Failed to evaluate health'],
        recommendations: [],
      };
    }
  }

  /**
   * Obtenir un rapport de santé global
   */
  public async getSystemHealthReport(): Promise<{
    overallHealth: 'healthy' | 'degraded' | 'critical';
    totalRoutes: number;
    healthyRoutes: number;
    degradedRoutes: number;
    criticalRoutes: number;
    topIssues: string[];
    routesHealth: EndpointHealth[];
  }> {
    try {
      const routes = await this.getAllRoutesMetrics('1 hour');
      const uniqueRoutes = [...new Set(routes.map(r => r.route))];

      const healthChecks = await Promise.all(
        uniqueRoutes.slice(0, 50).map(route => this.evaluateEndpointHealth(route))
      );

      const healthyRoutes = healthChecks.filter(h => h.status === 'healthy').length;
      const degradedRoutes = healthChecks.filter(h => h.status === 'degraded').length;
      const criticalRoutes = healthChecks.filter(h => h.status === 'critical').length;

      let overallHealth: 'healthy' | 'degraded' | 'critical' = 'healthy';
      if (criticalRoutes > 0) {
        overallHealth = 'critical';
      } else if (degradedRoutes > 0) {
        overallHealth = 'degraded';
      }

      // Collecter tous les problèmes
      const allIssues = healthChecks.flatMap(h => h.issues);
      const issueCounts = new Map<string, number>();
      allIssues.forEach(issue => {
        issueCounts.set(issue, (issueCounts.get(issue) || 0) + 1);
      });

      const topIssues = Array.from(issueCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([issue]) => issue);

      return {
        overallHealth,
        totalRoutes: uniqueRoutes.length,
        healthyRoutes,
        degradedRoutes,
        criticalRoutes,
        topIssues,
        routesHealth: healthChecks.filter(h => h.status !== 'healthy'),
      };
    } catch (error) {
      console.error('[ROUTE MONITOR] Failed to get system health report:', error);
      return {
        overallHealth: 'healthy',
        totalRoutes: 0,
        healthyRoutes: 0,
        degradedRoutes: 0,
        criticalRoutes: 0,
        topIssues: [],
        routesHealth: [],
      };
    }
  }

  /**
   * Parser une fenêtre de temps
   */
  private parseTimeWindow(timeWindow: string): number {
    const units: Record<string, number> = {
      minute: 60 * 1000,
      minutes: 60 * 1000,
      hour: 60 * 60 * 1000,
      hours: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
    };

    const match = timeWindow.match(/^(\d+)\s*(\w+)$/);
    if (!match) return 24 * 60 * 60 * 1000;

    const [, amount, unit] = match;
    return parseInt(amount) * (units[unit] || units.hours);
  }
}

// Export singleton
export const routeMonitor = RouteMonitor.getInstance();

// Helper pour mesurer le temps de réponse
export function measureResponseTime(startTime: number): number {
  return Date.now() - startTime;
}

// Helper pour créer un wrapper de route monitoring
export function withRouteMonitoring<T extends (...args: any[]) => Promise<Response>>(
  handler: T,
  route: string,
  method: string
): T {
  return (async (...args: any[]) => {
    const startTime = Date.now();
    let statusCode = 200;
    let errorOccurred = false;

    try {
      const response = await handler(...args);
      statusCode = response.status;
      errorOccurred = statusCode >= 400;

      return response;
    } catch (error) {
      errorOccurred = true;
      statusCode = 500;
      throw error;
    } finally {
      const responseTime = measureResponseTime(startTime);

      // Track la requête
      routeMonitor.trackRequest({
        route,
        method,
        responseTimeMs: responseTime,
        statusCode,
        errorOccurred,
      });
    }
  }) as T;
}
