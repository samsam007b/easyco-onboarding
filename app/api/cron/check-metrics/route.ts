/**
 * Vercel Cron Job - Check Métriques Supabase
 *
 * Vérifie quotidiennement les métriques et envoie une alerte si nécessaire
 *
 * Configuration vercel.json :
 * {
 *   "crons": [{
 *     "path": "/api/cron/check-metrics",
 *     "schedule": "0 9 * * *"
 *   }]
 * }
 *
 * Schedule : 9h00 UTC tous les jours (10h00 Paris)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  checkMigrationThresholds,
  shouldMigrateToPro,
  getSupabaseMetrics,
} from '@/lib/monitoring/supabase-metrics';

export async function GET(request: NextRequest) {
  try {
    // Vérifier que la requête vient bien de Vercel Cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid cron secret' },
        { status: 401 }
      );
    }

    console.log('[CRON] Starting metrics check...');

    // 1. Récupérer métriques
    const metrics = await getSupabaseMetrics();
    const alerts = await checkMigrationThresholds();
    const migrationCheck = await shouldMigrateToPro();

    console.log('[CRON] Metrics:', {
      connections: `${metrics.activeConnections}/${metrics.maxConnections}`,
      storage: `${(metrics.storageUsedBytes / 1_000_000_000).toFixed(2)} GB`,
      bandwidth: `${(metrics.bandwidthUsedBytes / 1_000_000_000).toFixed(2)} GB`,
      alerts: alerts.length,
      shouldMigrate: migrationCheck.shouldMigrate,
    });

    // 2. Envoyer alerte si nécessaire
    if (migrationCheck.shouldMigrate) {
      await sendCriticalAlert(migrationCheck, alerts);
    } else if (alerts.some(a => a.severity === 'WARNING')) {
      await sendWarningAlert(alerts.filter(a => a.severity === 'WARNING'));
    }

    // 3. Logger dans database (pour historique)
    await logMetricsHistory(metrics, alerts);

    return NextResponse.json({
      success: true,
      metrics,
      alerts,
      migration: migrationCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[CRON] Error checking metrics:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Envoie une alerte CRITIQUE (migration requise)
 */
async function sendCriticalAlert(migrationCheck: any, alerts: any[]) {
  console.log('[ALERT] 🚨 CRITICAL - Migration Supabase Pro requise');

  // TODO: Implémenter notification (Email, Slack, etc.)
  // Pour l'instant, juste logger

  const alertMessage = `
🚨 ALERTE CRITIQUE - IZZICO PRODUCTION

Migration Supabase Pro REQUISE

Raison : ${migrationCheck.reason}

Alertes critiques :
${migrationCheck.criticalAlerts.map((a: any) => `- ${a.metric}: ${a.message}`).join('\n')}

Autres alertes :
${alerts.map((a: any) => `- [${a.severity}] ${a.metric}: ${a.message}`).join('\n')}

Actions recommandées :
1. Vérifier dashboard : https://izzico.vercel.app/admin/performance
2. Consulter audit : /AUDIT_PERFORMANCE_SCALABILITE.md
3. Migrer vers Supabase Pro (€25/mois) : https://supabase.com/dashboard

Timestamp : ${new Date().toLocaleString('fr-FR')}
  `.trim();

  console.log(alertMessage);

  // TODO: Envoyer email
  // await sendEmail({
  //   to: 'samuel@izzico.com',
  //   subject: '🚨 [IZZICO] Migration Supabase Pro REQUISE',
  //   body: alertMessage,
  // });

  // TODO: Envoyer notification Slack
  // await sendSlackNotification({
  //   channel: '#alerts',
  //   message: alertMessage,
  // });
}

/**
 * Envoie une alerte WARNING (optimisations recommandées)
 */
async function sendWarningAlert(warnings: any[]) {
  console.log('[ALERT] ⚠️ WARNING - Optimisations recommandées');

  const alertMessage = `
⚠️ ALERTE - IZZICO PRODUCTION

Optimisations recommandées

Alertes :
${warnings.map((a: any) => `- ${a.metric}: ${a.message}\n  → ${a.recommendation}`).join('\n\n')}

Dashboard : https://izzico.vercel.app/admin/performance

Timestamp : ${new Date().toLocaleString('fr-FR')}
  `.trim();

  console.log(alertMessage);

  // TODO: Envoyer notification légère (email digest quotidien)
}

/**
 * Sauvegarde l'historique des métriques dans la database
 */
async function logMetricsHistory(metrics: any, alerts: any[]) {
  // TODO: Créer table metrics_history dans Supabase
  // Pour l'instant, juste logger
  console.log('[HISTORY] Metrics logged:', {
    timestamp: new Date().toISOString(),
    connections: metrics.activeConnections,
    storage: metrics.storageUsedBytes,
    bandwidth: metrics.bandwidthUsedBytes,
    alerts: alerts.length,
  });

  /*
  -- Migration future : Table historique métriques
  CREATE TABLE IF NOT EXISTS public.metrics_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    active_connections INT,
    storage_used_bytes BIGINT,
    bandwidth_used_bytes BIGINT,
    api_latency_p95 INT,
    alerts JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX idx_metrics_history_timestamp ON metrics_history(timestamp DESC);
  */
}
