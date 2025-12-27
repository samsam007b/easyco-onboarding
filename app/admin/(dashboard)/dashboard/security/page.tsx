import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/auth/supabase-server';
import { SecurityDashboardClient } from './components';

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// CACHED DATA FETCHING (30s cache for initial render)
// ============================================================================

const getSecurityStats = unstable_cache(
  async (): Promise<SecurityStats> => {
    const supabase = await createClient();
    const last24h = new Date(Date.now() - 86400000).toISOString();

    const [
      { count: totalErrors },
      { count: errors24h },
      { count: unresolvedErrors },
      { count: activeAlerts },
      { data: scoreData },
    ] = await Promise.all([
      supabase.from('security_errors').select('*', { count: 'exact', head: true }),
      supabase.from('security_errors').select('*', { count: 'exact', head: true }).gte('created_at', last24h),
      supabase.from('security_errors').select('*', { count: 'exact', head: true }).eq('resolved', false),
      supabase.from('security_alerts').select('*', { count: 'exact', head: true }).eq('acknowledged', false),
      supabase.from('security_score_history').select('overall_score').order('recorded_at', { ascending: false }).limit(1),
    ]);

    return {
      totalErrors: totalErrors || 0,
      errors24h: errors24h || 0,
      unresolvedErrors: unresolvedErrors || 0,
      activeAlerts: activeAlerts || 0,
      securityScore: scoreData?.[0]?.overall_score || 85,
    };
  },
  ['security-stats'],
  { revalidate: 30, tags: ['security'] }
);

const getVulnerabilityCounts = unstable_cache(
  async (): Promise<VulnCounts> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from('security_vulnerabilities')
      .select('severity')
      .neq('status', 'resolved');

    const vulns = data || [];
    return {
      critical: vulns.filter(v => v.severity === 'critical').length,
      high: vulns.filter(v => v.severity === 'high').length,
      medium: vulns.filter(v => v.severity === 'medium').length,
      low: vulns.filter(v => v.severity === 'low').length,
    };
  },
  ['vulnerability-counts'],
  { revalidate: 300, tags: ['security'] }
);

const getRoutePerformance = unstable_cache(
  async (): Promise<RouteAnalytics[]> => {
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('route_analytics')
      .select('id, route, method, avg_response_time_ms, total_requests, error_count')
      .eq('date', today)
      .order('total_requests', { ascending: false })
      .limit(5);
    return data || [];
  },
  ['route-performance'],
  { revalidate: 60, tags: ['security'] }
);

// ============================================================================
// PAGE CONFIG
// ============================================================================

export const dynamic = 'force-dynamic';
export const revalidate = 30;

// ============================================================================
// PAGE
// ============================================================================

export default async function SecurityDashboardPage() {
  // Parallel data fetching with caching for initial render
  const [stats, vulnCounts, routes] = await Promise.all([
    getSecurityStats(),
    getVulnerabilityCounts(),
    getRoutePerformance(),
  ]);

  return (
    <SecurityDashboardClient
      initialStats={stats}
      initialVulnCounts={vulnCounts}
      initialRoutes={routes}
    />
  );
}
