-- Migration 126: Add monitoring RPC functions
-- Date: 2026-01-19
-- Purpose: Enable performance monitoring and scalability metrics

-- ============================================================================
-- GET ACTIVE CONNECTIONS
-- ============================================================================

/**
 * Returns count of active database connections
 * Used by: lib/monitoring/supabase-metrics.ts
 */
CREATE OR REPLACE FUNCTION public.get_active_connections()
RETURNS TABLE(count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT COUNT(*)::BIGINT
  FROM pg_stat_activity
  WHERE datname = current_database()
    AND state = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_active_connections() IS
  'Returns count of active database connections for monitoring';

-- Grant execute to authenticated users (admin only in app layer)
GRANT EXECUTE ON FUNCTION public.get_active_connections() TO authenticated;

-- ============================================================================
-- GET STORAGE USAGE
-- ============================================================================

/**
 * Returns total storage used across all buckets
 * Used by: lib/monitoring/supabase-metrics.ts
 */
CREATE OR REPLACE FUNCTION public.get_storage_usage()
RETURNS TABLE(total_bytes BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT COALESCE(SUM(
    (metadata->>'size')::BIGINT
  ), 0)::BIGINT AS total_bytes
  FROM storage.objects;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_storage_usage() IS
  'Returns total storage used in bytes (all buckets combined)';

GRANT EXECUTE ON FUNCTION public.get_storage_usage() TO authenticated;

-- ============================================================================
-- GET BANDWIDTH USAGE (Estimation)
-- ============================================================================

/**
 * Estimates bandwidth usage based on object access patterns
 * Note: Supabase ne track pas nativement le bandwidth, on estime via:
 * - Nombre de requêtes × taille moyenne des objets
 * - Approximation conservatrice
 *
 * Used by: lib/monitoring/supabase-metrics.ts
 */
CREATE OR REPLACE FUNCTION public.get_bandwidth_usage()
RETURNS TABLE(total_bytes BIGINT) AS $$
BEGIN
  -- Pour l'instant, retourner 0
  -- TODO: Implémenter vrai tracking via logs
  -- Option 1: Créer table access_logs avec triggers sur storage.objects
  -- Option 2: Parser Supabase API logs (via Dashboard Analytics)
  RETURN QUERY
  SELECT 0::BIGINT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_bandwidth_usage() IS
  'Estimates monthly bandwidth usage (currently returns 0, TODO: implement tracking)';

GRANT EXECUTE ON FUNCTION public.get_bandwidth_usage() TO authenticated;

-- ============================================================================
-- METRICS HISTORY TABLE (for trend analysis)
-- ============================================================================

/**
 * Stores historical metrics for trend analysis and alerting
 */
CREATE TABLE IF NOT EXISTS public.metrics_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Database metrics
  active_connections INT,
  max_connections INT DEFAULT 50,

  -- Storage metrics
  storage_used_bytes BIGINT,
  storage_max_bytes BIGINT DEFAULT 1000000000, -- 1 GB

  -- Bandwidth metrics (estimated)
  bandwidth_used_bytes BIGINT,
  bandwidth_max_bytes BIGINT DEFAULT 2000000000, -- 2 GB

  -- Performance metrics
  api_latency_p50 INT,
  api_latency_p95 INT,
  api_latency_p99 INT,

  -- Real-time metrics
  realtime_disconnect_rate FLOAT,

  -- Alerts snapshot
  alerts JSONB,

  -- Migration recommendation
  should_migrate BOOLEAN DEFAULT FALSE,
  migration_reason TEXT,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for time-series queries
CREATE INDEX IF NOT EXISTS idx_metrics_history_timestamp
  ON public.metrics_history(timestamp DESC);

-- Index for migration checks
CREATE INDEX IF NOT EXISTS idx_metrics_history_should_migrate
  ON public.metrics_history(should_migrate, timestamp DESC)
  WHERE should_migrate = TRUE;

COMMENT ON TABLE public.metrics_history IS
  'Historical metrics for trend analysis and capacity planning';

-- RLS: Only admins can read metrics history
ALTER TABLE public.metrics_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read metrics history"
  ON public.metrics_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid()
        AND user_type = 'owner' -- TODO: remplacer par is_admin
    )
  );

-- ============================================================================
-- HELPER: LOG METRICS
-- ============================================================================

/**
 * Logs current metrics to history table
 * Called by: app/api/cron/check-metrics
 */
CREATE OR REPLACE FUNCTION public.log_metrics_snapshot(
  p_active_connections INT,
  p_storage_used_bytes BIGINT,
  p_bandwidth_used_bytes BIGINT,
  p_api_latency_p50 INT,
  p_api_latency_p95 INT,
  p_api_latency_p99 INT,
  p_realtime_disconnect_rate FLOAT,
  p_alerts JSONB,
  p_should_migrate BOOLEAN,
  p_migration_reason TEXT
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.metrics_history (
    active_connections,
    storage_used_bytes,
    bandwidth_used_bytes,
    api_latency_p50,
    api_latency_p95,
    api_latency_p99,
    realtime_disconnect_rate,
    alerts,
    should_migrate,
    migration_reason
  ) VALUES (
    p_active_connections,
    p_storage_used_bytes,
    p_bandwidth_used_bytes,
    p_api_latency_p50,
    p_api_latency_p95,
    p_api_latency_p99,
    p_realtime_disconnect_rate,
    p_alerts,
    p_should_migrate,
    p_migration_reason
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.log_metrics_snapshot(
  INT, BIGINT, BIGINT, INT, INT, INT, FLOAT, JSONB, BOOLEAN, TEXT
) TO authenticated;

-- ============================================================================
-- HELPER: GET METRICS TREND
-- ============================================================================

/**
 * Returns metrics trend over last N days
 * Useful for capacity planning
 */
CREATE OR REPLACE FUNCTION public.get_metrics_trend(
  p_days INT DEFAULT 7
)
RETURNS TABLE(
  timestamp TIMESTAMPTZ,
  active_connections INT,
  storage_used_bytes BIGINT,
  api_latency_p95 INT,
  should_migrate BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    mh.timestamp,
    mh.active_connections,
    mh.storage_used_bytes,
    mh.api_latency_p95,
    mh.should_migrate
  FROM public.metrics_history mh
  WHERE mh.timestamp >= NOW() - (p_days || ' days')::INTERVAL
  ORDER BY mh.timestamp DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_metrics_trend(INT) TO authenticated;

-- ============================================================================
-- CLEANUP: Old metrics (keep last 90 days)
-- ============================================================================

/**
 * Cleans up old metrics history (keep last 90 days)
 * Should be called monthly via cron
 */
CREATE OR REPLACE FUNCTION public.cleanup_old_metrics()
RETURNS INT AS $$
DECLARE
  v_deleted INT;
BEGIN
  DELETE FROM public.metrics_history
  WHERE timestamp < NOW() - INTERVAL '90 days';

  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  RAISE NOTICE 'Deleted % old metrics records', v_deleted;

  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.cleanup_old_metrics() TO authenticated;

-- ============================================================================
-- VALIDATION
-- ============================================================================

DO $$
BEGIN
  -- Vérifier que toutes les fonctions existent
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_active_connections') THEN
    RAISE EXCEPTION 'Function get_active_connections not created';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_storage_usage') THEN
    RAISE EXCEPTION 'Function get_storage_usage not created';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_bandwidth_usage') THEN
    RAISE EXCEPTION 'Function get_bandwidth_usage not created';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'log_metrics_snapshot') THEN
    RAISE EXCEPTION 'Function log_metrics_snapshot not created';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_metrics_trend') THEN
    RAISE EXCEPTION 'Function get_metrics_trend not created';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'cleanup_old_metrics') THEN
    RAISE EXCEPTION 'Function cleanup_old_metrics not created';
  END IF;

  -- Vérifier que la table existe
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'metrics_history') THEN
    RAISE EXCEPTION 'Table metrics_history not created';
  END IF;

  RAISE NOTICE 'All monitoring functions and tables created successfully ✓';
END $$;
