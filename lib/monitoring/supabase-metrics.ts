/**
 * Monitoring des métriques Supabase
 * Détecte automatiquement quand migrer vers Supabase Pro
 *
 * Seuils critiques (Free tier) :
 * - Connexions DB : 40/50 (80%)
 * - Storage : 800 MB/1 GB (80%)
 * - Bandwidth : 1.6 GB/2 GB par mois (80%)
 * - Latence API p95 : >2 sec
 * - Déconnexions real-time : >10%
 */

import { createClient } from '@/lib/supabase/server';

export interface SupabaseMetrics {
  // Database
  activeConnections: number;
  maxConnections: number;
  connectionUsagePercent: number;

  // Storage
  storageUsedBytes: number;
  storageMaxBytes: number;
  storageUsagePercent: number;

  // Bandwidth (estimation mensuelle)
  bandwidthUsedBytes: number;
  bandwidthMaxBytes: number;
  bandwidthUsagePercent: number;

  // Performance
  apiLatencyP50: number;
  apiLatencyP95: number;
  apiLatencyP99: number;

  // Real-time
  realtimeDisconnectRate: number;

  // Metadata
  timestamp: Date;
  planType: 'free' | 'pro' | 'team' | 'enterprise';
}

export interface Alert {
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  recommendation?: string;
}

/**
 * Récupère les métriques actuelles de Supabase
 */
export async function getSupabaseMetrics(): Promise<SupabaseMetrics> {
  const supabase = createClient();

  // 1. Connexions DB actives
  const { data: connections } = await supabase.rpc('get_active_connections');
  const activeConnections = connections?.count || 0;
  const maxConnections = 50; // Free tier limit

  // 2. Storage utilisé
  const { data: storage } = await supabase.rpc('get_storage_usage');
  const storageUsedBytes = storage?.total_bytes || 0;
  const storageMaxBytes = 1_000_000_000; // 1 GB Free tier

  // 3. Bandwidth (estimation via logs API - last 30 days)
  const { data: bandwidth } = await supabase.rpc('get_bandwidth_usage');
  const bandwidthUsedBytes = bandwidth?.total_bytes || 0;
  const bandwidthMaxBytes = 2_000_000_000; // 2 GB/month Free tier

  // 4. Latence API (mesure en temps réel)
  const { apiLatencyP50, apiLatencyP95, apiLatencyP99 } = await measureApiLatency();

  // 5. Real-time disconnect rate (via error logs)
  const realtimeDisconnectRate = await getRealtimeDisconnectRate();

  return {
    activeConnections,
    maxConnections,
    connectionUsagePercent: (activeConnections / maxConnections) * 100,

    storageUsedBytes,
    storageMaxBytes,
    storageUsagePercent: (storageUsedBytes / storageMaxBytes) * 100,

    bandwidthUsedBytes,
    bandwidthMaxBytes,
    bandwidthUsagePercent: (bandwidthUsedBytes / bandwidthMaxBytes) * 100,

    apiLatencyP50,
    apiLatencyP95,
    apiLatencyP99,

    realtimeDisconnectRate,

    timestamp: new Date(),
    planType: 'free', // TODO: détecter automatiquement
  };
}

/**
 * Vérifie les seuils critiques et génère des alertes
 */
export async function checkMigrationThresholds(): Promise<Alert[]> {
  const metrics = await getSupabaseMetrics();
  const alerts: Alert[] = [];

  // Seuils par métrique
  const thresholds = {
    connections: {
      warning: 30, // 60%
      critical: 40, // 80%
    },
    storage: {
      warning: 600_000_000, // 600 MB (60%)
      critical: 800_000_000, // 800 MB (80%)
    },
    bandwidth: {
      warning: 1_200_000_000, // 1.2 GB (60%)
      critical: 1_600_000_000, // 1.6 GB (80%)
    },
    apiLatency: {
      warning: 1500, // 1.5 sec p95
      critical: 2000, // 2 sec p95
    },
    realtimeDisconnects: {
      warning: 0.05, // 5%
      critical: 0.1, // 10%
    },
  };

  // Check connexions DB
  if (metrics.activeConnections >= thresholds.connections.critical) {
    alerts.push({
      severity: 'CRITICAL',
      metric: 'Connexions DB',
      value: metrics.activeConnections,
      threshold: thresholds.connections.critical,
      message: `${metrics.activeConnections}/${metrics.maxConnections} connexions actives (${metrics.connectionUsagePercent.toFixed(0)}%). LIMITE ATTEINTE.`,
      recommendation: 'Migration vers Supabase Pro IMMÉDIATE (200 connexions) + implémenter PgBouncer pooling.',
    });
  } else if (metrics.activeConnections >= thresholds.connections.warning) {
    alerts.push({
      severity: 'WARNING',
      metric: 'Connexions DB',
      value: metrics.activeConnections,
      threshold: thresholds.connections.warning,
      message: `${metrics.activeConnections}/${metrics.maxConnections} connexions actives (${metrics.connectionUsagePercent.toFixed(0)}%). Approche de la limite.`,
      recommendation: 'Implémenter connection pooling (PgBouncer) et optimiser queries longues.',
    });
  }

  // Check storage
  if (metrics.storageUsedBytes >= thresholds.storage.critical) {
    alerts.push({
      severity: 'CRITICAL',
      metric: 'Storage',
      value: metrics.storageUsedBytes,
      threshold: thresholds.storage.critical,
      message: `${(metrics.storageUsedBytes / 1_000_000_000).toFixed(2)} GB utilisés (${metrics.storageUsagePercent.toFixed(0)}%). LIMITE ATTEINTE.`,
      recommendation: 'Migration vers Supabase Pro IMMÉDIATE (100 GB inclus). En attendant, supprimer fichiers anciens et implémenter compression images.',
    });
  } else if (metrics.storageUsedBytes >= thresholds.storage.warning) {
    alerts.push({
      severity: 'WARNING',
      metric: 'Storage',
      value: metrics.storageUsedBytes,
      threshold: thresholds.storage.warning,
      message: `${(metrics.storageUsedBytes / 1_000_000_000).toFixed(2)} GB utilisés (${metrics.storageUsagePercent.toFixed(0)}%).`,
      recommendation: 'Activer compression images automatique (sharp). Archiver documents anciens >6 mois.',
    });
  }

  // Check bandwidth
  if (metrics.bandwidthUsedBytes >= thresholds.bandwidth.critical) {
    alerts.push({
      severity: 'CRITICAL',
      metric: 'Bandwidth',
      value: metrics.bandwidthUsedBytes,
      threshold: thresholds.bandwidth.critical,
      message: `${(metrics.bandwidthUsedBytes / 1_000_000_000).toFixed(2)} GB ce mois (${metrics.bandwidthUsagePercent.toFixed(0)}%). LIMITE ATTEINTE.`,
      recommendation: 'Migration Supabase Pro + activer CDN Vercel pour assets statiques.',
    });
  } else if (metrics.bandwidthUsedBytes >= thresholds.bandwidth.warning) {
    alerts.push({
      severity: 'WARNING',
      metric: 'Bandwidth',
      value: metrics.bandwidthUsedBytes,
      threshold: thresholds.bandwidth.warning,
      message: `${(metrics.bandwidthUsedBytes / 1_000_000_000).toFixed(2)} GB ce mois (${metrics.bandwidthUsagePercent.toFixed(0)}%).`,
      recommendation: 'Optimiser taille des images (WebP + compression). Activer cache navigateur (Cache-Control headers).',
    });
  }

  // Check latence API
  if (metrics.apiLatencyP95 >= thresholds.apiLatency.critical) {
    alerts.push({
      severity: 'CRITICAL',
      metric: 'Latence API (p95)',
      value: metrics.apiLatencyP95,
      threshold: thresholds.apiLatency.critical,
      message: `Latence p95 : ${metrics.apiLatencyP95.toFixed(0)} ms. UX DÉGRADÉE.`,
      recommendation: 'Vérifier queries lentes (EXPLAIN ANALYZE). Ajouter indexes manquants. Implémenter cache Redis.',
    });
  } else if (metrics.apiLatencyP95 >= thresholds.apiLatency.warning) {
    alerts.push({
      severity: 'WARNING',
      metric: 'Latence API (p95)',
      value: metrics.apiLatencyP95,
      threshold: thresholds.apiLatency.warning,
      message: `Latence p95 : ${metrics.apiLatencyP95.toFixed(0)} ms. Performance sous-optimale.`,
      recommendation: 'Auditer queries DB les plus lentes. Vérifier N+1 patterns.',
    });
  }

  // Check real-time disconnects
  if (metrics.realtimeDisconnectRate >= thresholds.realtimeDisconnects.critical) {
    alerts.push({
      severity: 'CRITICAL',
      metric: 'Real-time Disconnects',
      value: metrics.realtimeDisconnectRate,
      threshold: thresholds.realtimeDisconnects.critical,
      message: `${(metrics.realtimeDisconnectRate * 100).toFixed(1)}% de déconnexions real-time. FONCTIONNALITÉ CASSÉE.`,
      recommendation: 'Redesign architecture real-time : passer au polling intelligent ou SSE. Migration Supabase Pro pour +500 connexions WS.',
    });
  } else if (metrics.realtimeDisconnectRate >= thresholds.realtimeDisconnects.warning) {
    alerts.push({
      severity: 'WARNING',
      metric: 'Real-time Disconnects',
      value: metrics.realtimeDisconnectRate,
      threshold: thresholds.realtimeDisconnects.warning,
      message: `${(metrics.realtimeDisconnectRate * 100).toFixed(1)}% de déconnexions real-time.`,
      recommendation: 'Réduire nombre de subscriptions par user (debouncing, unsubscribe quand inactif).',
    });
  }

  return alerts;
}

/**
 * Détermine si migration Supabase Pro est nécessaire
 */
export async function shouldMigrateToPro(): Promise<{
  shouldMigrate: boolean;
  reason: string;
  criticalAlerts: Alert[];
}> {
  const alerts = await checkMigrationThresholds();
  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');

  if (criticalAlerts.length > 0) {
    return {
      shouldMigrate: true,
      reason: `${criticalAlerts.length} indicateur(s) critique(s) détecté(s) : ${criticalAlerts.map(a => a.metric).join(', ')}`,
      criticalAlerts,
    };
  }

  // Vérifier si plusieurs warnings (stratégie proactive)
  const warnings = alerts.filter(a => a.severity === 'WARNING');
  if (warnings.length >= 3) {
    return {
      shouldMigrate: true,
      reason: `${warnings.length} indicateurs en zone warning. Migration proactive recommandée.`,
      criticalAlerts: [],
    };
  }

  return {
    shouldMigrate: false,
    reason: 'Aucun indicateur critique. Free tier suffisant.',
    criticalAlerts: [],
  };
}

/**
 * Helpers pour mesures spécifiques
 */

async function measureApiLatency(): Promise<{
  apiLatencyP50: number;
  apiLatencyP95: number;
  apiLatencyP99: number;
}> {
  // Mesurer latence en faisant 100 requêtes test
  const samples: number[] = [];
  const supabase = createClient();

  for (let i = 0; i < 100; i++) {
    const start = Date.now();
    await supabase.from('user_profiles').select('id').limit(1).single();
    const latency = Date.now() - start;
    samples.push(latency);
  }

  samples.sort((a, b) => a - b);

  return {
    apiLatencyP50: samples[Math.floor(samples.length * 0.5)],
    apiLatencyP95: samples[Math.floor(samples.length * 0.95)],
    apiLatencyP99: samples[Math.floor(samples.length * 0.99)],
  };
}

async function getRealtimeDisconnectRate(): Promise<number> {
  // TODO: Implémenter tracking des disconnects
  // Pour l'instant, retourner 0
  // Dans une vraie implémentation, tracker les reconnexions WebSocket
  return 0;
}

/**
 * RPC Functions à créer dans Supabase
 */

/*
-- Migration 126: Add monitoring RPC functions
-- File: supabase/migrations/126_add_monitoring_functions.sql

-- Get active connections count
CREATE OR REPLACE FUNCTION get_active_connections()
RETURNS TABLE(count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT COUNT(*)::BIGINT
  FROM pg_stat_activity
  WHERE datname = current_database()
    AND state = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get storage usage across all buckets
CREATE OR REPLACE FUNCTION get_storage_usage()
RETURNS TABLE(total_bytes BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT COALESCE(SUM(
    (metadata->>'size')::BIGINT
  ), 0)::BIGINT AS total_bytes
  FROM storage.objects;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get bandwidth usage (approximation via object access logs)
-- Note: Supabase ne track pas nativement le bandwidth, on estime via nombre de requêtes
CREATE OR REPLACE FUNCTION get_bandwidth_usage()
RETURNS TABLE(total_bytes BIGINT) AS $$
BEGIN
  -- Estimation : moyenne 500 KB par requête × nombre de requêtes
  -- TODO: Implémenter vrai tracking avec logs
  RETURN QUERY
  SELECT 0::BIGINT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/
