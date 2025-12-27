/**
 * EASYCO SECURITY COMMAND CENTER API
 *
 * API endpoint centralisé pour toutes les données de sécurité et monitoring
 * Fournit les données au dashboard de contrôle administrateur
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { errorTracker, getErrorStats } from '@/lib/monitoring/error-tracker';
import { securityMonitor } from '@/lib/monitoring/security-monitor';
import { routeMonitor } from '@/lib/monitoring/route-monitor';
import { vulnerabilityScanner } from '@/lib/monitoring/vulnerability-scanner';
import { alertSystem } from '@/lib/monitoring/alert-system';

/**
 * GET /api/admin/security-command-center
 *
 * Retourne un snapshot complet de la sécurité et de l'état du système
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Vérifier que l'utilisateur est admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: isAdmin } = await supabase.rpc('is_admin', { user_email: user.email });

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Récupérer le paramètre de fenêtre temporelle
    const searchParams = request.nextUrl.searchParams;
    const timeWindow = searchParams.get('timeWindow') || '24 hours';
    const section = searchParams.get('section'); // 'overview', 'errors', 'security', 'routes', 'vulnerabilities', 'alerts'

    // Si une section spécifique est demandée, retourner uniquement celle-ci
    if (section) {
      const sectionData = await getSectionData(section, timeWindow, supabase);
      return NextResponse.json(sectionData);
    }

    // Sinon, retourner toutes les données (overview complet)
    const [
      securityScore,
      errorStats,
      securityStats,
      systemHealth,
      unacknowledgedAlerts,
      predictions,
      recentErrors,
      recentSecurityEvents,
      criticalVulnerabilities,
    ] = await Promise.all([
      vulnerabilityScanner.calculateSecurityScore(),
      getErrorStats(timeWindow),
      securityMonitor.getSecurityStats(timeWindow),
      routeMonitor.getSystemHealthReport(),
      alertSystem.getUnacknowledgedAlerts(),
      alertSystem.predictIssues(),
      getRecentErrors(supabase, 10),
      getRecentSecurityEvents(supabase, 10),
      getCriticalVulnerabilities(supabase),
    ]);

    const response = {
      timestamp: new Date().toISOString(),
      timeWindow,
      overview: {
        securityScore: securityScore.overallScore,
        securityTrend: securityScore.trend,
        systemHealth: systemHealth.overallHealth,
        criticalIssues: securityScore.criticalIssues,
        unacknowledgedAlerts: unacknowledgedAlerts.length,
        activeVulnerabilities: criticalVulnerabilities.length,
      },
      securityScore: {
        overall: securityScore.overallScore,
        breakdown: {
          authentication: securityScore.authenticationScore,
          authorization: securityScore.authorizationScore,
          dataProtection: securityScore.dataProtectionScore,
          vulnerabilities: securityScore.vulnerabilityScore,
          monitoring: securityScore.monitoringScore,
          compliance: securityScore.complianceScore,
        },
        issues: {
          critical: securityScore.criticalIssues,
          high: securityScore.highIssues,
          medium: securityScore.mediumIssues,
          low: securityScore.lowIssues,
        },
        trend: securityScore.trend,
        recommendations: securityScore.topRecommendations,
      },
      errors: {
        total: errorStats.total,
        bySeverity: errorStats.bySeverity,
        byType: errorStats.byType,
        recent: recentErrors,
      },
      security: {
        totalEvents: securityStats.totalEvents,
        criticalEvents: securityStats.criticalEvents,
        blockedRequests: securityStats.blockedRequests,
        suspiciousIPs: securityStats.suspiciousIPs,
        bySeverity: securityStats.eventsBySeverity,
        byType: securityStats.eventsByType,
        topThreats: securityStats.topThreats,
        recent: recentSecurityEvents,
      },
      systemHealth: {
        overall: systemHealth.overallHealth,
        totalRoutes: systemHealth.totalRoutes,
        healthy: systemHealth.healthyRoutes,
        degraded: systemHealth.degradedRoutes,
        critical: systemHealth.criticalRoutes,
        topIssues: systemHealth.topIssues,
        problematicRoutes: systemHealth.routesHealth,
      },
      alerts: {
        unacknowledged: unacknowledgedAlerts.length,
        recent: unacknowledgedAlerts.slice(0, 10),
      },
      predictions: predictions,
      vulnerabilities: {
        critical: criticalVulnerabilities.filter((v: any) => v.severity === 'critical').length,
        high: criticalVulnerabilities.filter((v: any) => v.severity === 'high').length,
        recent: criticalVulnerabilities.slice(0, 10),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[SECURITY COMMAND CENTER API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/security-command-center
 *
 * Actions: acknowledge_alert, resolve_error, update_vulnerability
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Vérifier que l'utilisateur est admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: isAdmin } = await supabase.rpc('is_admin', { user_email: user.email });

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'acknowledge_alert':
        await alertSystem.acknowledgeAlert(params.alertId, user.id);
        return NextResponse.json({ success: true });

      case 'resolve_error':
        const { error: resolveError } = await supabase
          .from('security_errors')
          .update({
            resolved: true,
            resolved_at: new Date().toISOString(),
            resolved_by: user.id,
            notes: params.notes,
          })
          .eq('id', params.errorId);

        if (resolveError) throw resolveError;
        return NextResponse.json({ success: true });

      case 'update_vulnerability':
        const { error: vulnError } = await supabase
          .from('security_vulnerabilities')
          .update({
            status: params.status,
            resolved_at: params.status === 'resolved' ? new Date().toISOString() : null,
            resolved_by: params.status === 'resolved' ? user.id : null,
          })
          .eq('id', params.vulnerabilityId);

        if (vulnError) throw vulnError;

        // Recalculer le score de sécurité
        await vulnerabilityScanner.calculateAndSaveSecurityScore();

        return NextResponse.json({ success: true });

      case 'generate_audit_report':
        const report = await vulnerabilityScanner.generateSecurityAuditReport();
        return NextResponse.json({ report });

      case 'run_vulnerability_scan':
        const depVulns = await vulnerabilityScanner.scanDependencies();
        const codeVulns = await vulnerabilityScanner.scanCodePatterns();

        // Enregistrer les nouvelles vulnérabilités
        for (const vuln of [...depVulns, ...codeVulns]) {
          await vulnerabilityScanner.reportVulnerability(vuln);
        }

        return NextResponse.json({
          success: true,
          found: depVulns.length + codeVulns.length,
        });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[SECURITY COMMAND CENTER API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper functions

async function getSectionData(section: string, timeWindow: string, supabase: any) {
  switch (section) {
    case 'errors':
      const errorStats = await getErrorStats(timeWindow);
      const recentErrors = await getRecentErrors(supabase, 50);
      return { errorStats, recentErrors };

    case 'security':
      const securityStats = await securityMonitor.getSecurityStats(timeWindow);
      const recentEvents = await getRecentSecurityEvents(supabase, 50);
      return { securityStats, recentEvents };

    case 'routes':
      const allRoutes = await routeMonitor.getAllRoutesMetrics(timeWindow);
      const systemHealth = await routeMonitor.getSystemHealthReport();
      return { routes: allRoutes, systemHealth };

    case 'vulnerabilities':
      const { data: vulnerabilities } = await supabase
        .from('security_vulnerabilities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      return { vulnerabilities };

    case 'alerts':
      const unacknowledged = await alertSystem.getUnacknowledgedAlerts();
      const { data: allAlerts } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      return { unacknowledged, allAlerts };

    case 'score-history':
      const { data: scoreHistory } = await supabase
        .from('security_score_history')
        .select('*')
        .order('calculated_at', { ascending: false })
        .limit(30);
      return { scoreHistory };

    default:
      return { error: 'Unknown section' };
  }
}

async function getRecentErrors(supabase: any, limit: number = 10) {
  const { data } = await supabase
    .from('security_errors')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  return data || [];
}

async function getRecentSecurityEvents(supabase: any, limit: number = 10) {
  const { data } = await supabase
    .from('security_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  return data || [];
}

async function getCriticalVulnerabilities(supabase: any) {
  const { data } = await supabase
    .from('security_vulnerabilities')
    .select('*')
    .in('status', ['open', 'in_progress'])
    .in('severity', ['critical', 'high'])
    .order('severity', { ascending: false })
    .order('created_at', { ascending: false });

  return data || [];
}
