-- ============================================================================
-- Performance Monitoring Tables
-- Created: 2024-12-30
-- Purpose: Store Web Vitals and API performance metrics for the admin dashboard
-- ============================================================================

-- ============================================================================
-- TABLE: web_vitals_metrics
-- Stores raw Web Vitals metrics from client browsers
-- ============================================================================

CREATE TABLE IF NOT EXISTS web_vitals_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(10) NOT NULL CHECK (metric_name IN ('CLS', 'INP', 'FCP', 'LCP', 'TTFB')),
  metric_value DECIMAL(12, 4) NOT NULL,
  rating VARCHAR(20) NOT NULL CHECK (rating IN ('good', 'needs-improvement', 'poor')),
  metric_id VARCHAR(100), -- Unique ID from web-vitals library
  page_path VARCHAR(255) NOT NULL,
  user_agent VARCHAR(512),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_web_vitals_metric_name ON web_vitals_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_web_vitals_recorded_at ON web_vitals_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_web_vitals_page_path ON web_vitals_metrics(page_path);
CREATE INDEX IF NOT EXISTS idx_web_vitals_rating ON web_vitals_metrics(rating);

-- Composite index for dashboard queries
CREATE INDEX IF NOT EXISTS idx_web_vitals_dashboard
  ON web_vitals_metrics(metric_name, recorded_at DESC);

-- ============================================================================
-- TABLE: web_vitals_daily
-- Aggregated daily statistics for fast dashboard loading
-- ============================================================================

CREATE TABLE IF NOT EXISTS web_vitals_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date DATE NOT NULL,
  metric_name VARCHAR(10) NOT NULL CHECK (metric_name IN ('CLS', 'INP', 'FCP', 'LCP', 'TTFB')),
  sample_count INTEGER NOT NULL DEFAULT 0,
  p50_value DECIMAL(12, 4),
  p75_value DECIMAL(12, 4),
  p95_value DECIMAL(12, 4),
  good_count INTEGER NOT NULL DEFAULT 0,
  needs_improvement_count INTEGER NOT NULL DEFAULT 0,
  poor_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(stat_date, metric_name)
);

CREATE INDEX IF NOT EXISTS idx_web_vitals_daily_date ON web_vitals_daily(stat_date DESC);

-- ============================================================================
-- TABLE: api_performance_metrics
-- Stores API endpoint performance metrics
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')),
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_perf_endpoint ON api_performance_metrics(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_perf_recorded_at ON api_performance_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_api_perf_dashboard
  ON api_performance_metrics(endpoint, recorded_at DESC);

-- ============================================================================
-- TABLE: api_performance_daily
-- Aggregated daily API performance statistics
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_performance_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date DATE NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  avg_response_time_ms DECIMAL(10, 2),
  p95_response_time_ms DECIMAL(10, 2),
  error_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(stat_date, endpoint, method)
);

CREATE INDEX IF NOT EXISTS idx_api_perf_daily_date ON api_performance_daily(stat_date DESC);

-- ============================================================================
-- TABLE: performance_score_history
-- Historical record of overall performance scores
-- ============================================================================

CREATE TABLE IF NOT EXISTS performance_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  score_date DATE NOT NULL UNIQUE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  web_vitals_score INTEGER CHECK (web_vitals_score >= 0 AND web_vitals_score <= 100),
  api_score INTEGER CHECK (api_score >= 0 AND api_score <= 100),
  database_score INTEGER CHECK (database_score >= 0 AND database_score <= 100),
  bundle_score INTEGER CHECK (bundle_score >= 0 AND bundle_score <= 100),
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_perf_score_date ON performance_score_history(score_date DESC);

-- ============================================================================
-- FUNCTION: aggregate_web_vitals_daily
-- Aggregates raw metrics into daily statistics
-- Should be called by a cron job or trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION aggregate_web_vitals_daily(target_date DATE DEFAULT CURRENT_DATE - INTERVAL '1 day')
RETURNS void AS $$
BEGIN
  -- Delete existing aggregation for the target date
  DELETE FROM web_vitals_daily WHERE stat_date = target_date;

  -- Insert new aggregation
  INSERT INTO web_vitals_daily (
    stat_date,
    metric_name,
    sample_count,
    p50_value,
    p75_value,
    p95_value,
    good_count,
    needs_improvement_count,
    poor_count
  )
  SELECT
    target_date,
    metric_name,
    COUNT(*) as sample_count,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY metric_value) as p50_value,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY metric_value) as p75_value,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY metric_value) as p95_value,
    COUNT(*) FILTER (WHERE rating = 'good') as good_count,
    COUNT(*) FILTER (WHERE rating = 'needs-improvement') as needs_improvement_count,
    COUNT(*) FILTER (WHERE rating = 'poor') as poor_count
  FROM web_vitals_metrics
  WHERE recorded_at::date = target_date
  GROUP BY metric_name;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: get_web_vitals_summary
-- Returns the latest Web Vitals summary for the dashboard
-- ============================================================================

CREATE OR REPLACE FUNCTION get_web_vitals_summary(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
  metric_name VARCHAR,
  current_p75 DECIMAL,
  previous_p75 DECIMAL,
  sample_count BIGINT,
  good_percentage DECIMAL,
  rating VARCHAR
) AS $$
DECLARE
  current_start DATE := CURRENT_DATE - days_back;
  previous_start DATE := CURRENT_DATE - (days_back * 2);
  previous_end DATE := CURRENT_DATE - days_back - 1;
BEGIN
  RETURN QUERY
  WITH current_stats AS (
    SELECT
      wv.metric_name,
      PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY wv.metric_value) as p75,
      COUNT(*) as count,
      (COUNT(*) FILTER (WHERE wv.rating = 'good')::DECIMAL / NULLIF(COUNT(*), 0) * 100) as good_pct
    FROM web_vitals_metrics wv
    WHERE wv.recorded_at::date >= current_start
    GROUP BY wv.metric_name
  ),
  previous_stats AS (
    SELECT
      wv.metric_name,
      PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY wv.metric_value) as p75
    FROM web_vitals_metrics wv
    WHERE wv.recorded_at::date BETWEEN previous_start AND previous_end
    GROUP BY wv.metric_name
  )
  SELECT
    cs.metric_name,
    ROUND(cs.p75::DECIMAL, 2) as current_p75,
    ROUND(ps.p75::DECIMAL, 2) as previous_p75,
    cs.count as sample_count,
    ROUND(cs.good_pct, 1) as good_percentage,
    CASE
      WHEN cs.metric_name = 'CLS' THEN
        CASE WHEN cs.p75 <= 0.1 THEN 'good' WHEN cs.p75 <= 0.25 THEN 'needs-improvement' ELSE 'poor' END
      WHEN cs.metric_name = 'INP' THEN
        CASE WHEN cs.p75 <= 200 THEN 'good' WHEN cs.p75 <= 500 THEN 'needs-improvement' ELSE 'poor' END
      WHEN cs.metric_name = 'FCP' THEN
        CASE WHEN cs.p75 <= 1800 THEN 'good' WHEN cs.p75 <= 3000 THEN 'needs-improvement' ELSE 'poor' END
      WHEN cs.metric_name = 'LCP' THEN
        CASE WHEN cs.p75 <= 2500 THEN 'good' WHEN cs.p75 <= 4000 THEN 'needs-improvement' ELSE 'poor' END
      WHEN cs.metric_name = 'TTFB' THEN
        CASE WHEN cs.p75 <= 800 THEN 'good' WHEN cs.p75 <= 1800 THEN 'needs-improvement' ELSE 'poor' END
      ELSE 'unknown'
    END as rating
  FROM current_stats cs
  LEFT JOIN previous_stats ps ON cs.metric_name = ps.metric_name;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RLS POLICIES
-- Performance tables are admin-only (read) and system-only (write)
-- ============================================================================

ALTER TABLE web_vitals_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_vitals_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_performance_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_score_history ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for API endpoint inserts)
CREATE POLICY "Service role full access on web_vitals_metrics"
  ON web_vitals_metrics FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on web_vitals_daily"
  ON web_vitals_daily FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on api_performance_metrics"
  ON api_performance_metrics FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on api_performance_daily"
  ON api_performance_daily FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on performance_score_history"
  ON performance_score_history FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can read all performance data
CREATE POLICY "Admins can read web_vitals_metrics"
  ON web_vitals_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Admins can read web_vitals_daily"
  ON web_vitals_daily FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Admins can read api_performance_metrics"
  ON api_performance_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Admins can read api_performance_daily"
  ON api_performance_daily FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Admins can read performance_score_history"
  ON performance_score_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE email = auth.jwt()->>'email'
    )
  );

-- ============================================================================
-- Grant public insert for anonymous web vitals collection
-- ============================================================================

-- Allow anonymous inserts to web_vitals_metrics (for unauthenticated visitors)
CREATE POLICY "Anyone can insert web_vitals_metrics"
  ON web_vitals_metrics FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE web_vitals_metrics IS 'Raw Core Web Vitals metrics collected from client browsers';
COMMENT ON TABLE web_vitals_daily IS 'Aggregated daily Web Vitals statistics for dashboard';
COMMENT ON TABLE api_performance_metrics IS 'Raw API endpoint performance metrics';
COMMENT ON TABLE api_performance_daily IS 'Aggregated daily API performance statistics';
COMMENT ON TABLE performance_score_history IS 'Historical performance scores for trend tracking';
COMMENT ON FUNCTION aggregate_web_vitals_daily IS 'Aggregates raw metrics into daily statistics - run via cron';
COMMENT ON FUNCTION get_web_vitals_summary IS 'Returns Web Vitals summary for dashboard display';
