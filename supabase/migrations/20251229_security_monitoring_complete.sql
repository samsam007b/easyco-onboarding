-- ============================================
-- IZZICO SECURITY MONITORING SYSTEM - COMPLETE
-- Consolidated migration for all security tables
-- ============================================

-- ============================================
-- 1. SECURITY ERRORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS security_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Error information
  error_type TEXT NOT NULL, -- 'exception', 'validation', 'auth', 'database', 'api', '404'
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  stack_trace TEXT,
  error_code TEXT,

  -- Context
  route TEXT,
  method TEXT,
  status_code INTEGER,
  user_id UUID,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referer TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  notes TEXT
);

-- ============================================
-- 2. SECURITY EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Event type
  event_type TEXT NOT NULL, -- 'auth_failure', 'brute_force', 'sql_injection', 'xss', 'csrf', 'rate_limit', 'suspicious_activity'
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),

  -- Details
  description TEXT NOT NULL,
  user_id UUID,
  ip_address INET,
  route TEXT,
  method TEXT,
  payload JSONB,

  -- Geolocation
  country TEXT,
  city TEXT,

  -- Actions taken
  action_taken TEXT, -- 'blocked', 'flagged', 'rate_limited', 'none'
  blocked BOOLEAN DEFAULT FALSE,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 3. ROUTE ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS route_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Route info
  route TEXT NOT NULL,
  method TEXT NOT NULL,

  -- Performance metrics
  response_time_ms INTEGER NOT NULL,
  status_code INTEGER NOT NULL,

  -- User
  user_id UUID,
  user_type TEXT,

  -- Request details
  ip_address INET,
  user_agent TEXT,
  referer TEXT,

  -- Response details
  response_size_bytes INTEGER,
  error_occurred BOOLEAN DEFAULT FALSE,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 4. SECURITY VULNERABILITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS security_vulnerabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Vulnerability type
  vulnerability_type TEXT NOT NULL, -- 'dependency', 'code', 'configuration', 'authentication', 'data_exposure'
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),

  -- Details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_component TEXT,
  cve_id TEXT,
  cvss_score NUMERIC(3, 1),

  -- Recommendations
  remediation TEXT,
  fix_complexity TEXT CHECK (fix_complexity IN ('low', 'medium', 'high')),

  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'accepted_risk', 'false_positive')),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 5. SECURITY ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Alert type
  alert_type TEXT NOT NULL, -- 'anomaly', 'threshold', 'pattern', 'prediction'
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical', 'low', 'medium', 'high')),

  -- Details
  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Source
  source_table TEXT,
  source_id UUID,
  source TEXT,

  -- Actions
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMPTZ,

  -- Notification
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_channels TEXT[],

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 6. SECURITY SCORE HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS security_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Global score (0-100)
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),

  -- Category scores
  authentication_score INTEGER,
  authorization_score INTEGER,
  data_protection_score INTEGER,
  vulnerability_score INTEGER,
  monitoring_score INTEGER,
  compliance_score INTEGER,

  -- Details
  critical_issues INTEGER DEFAULT 0,
  high_issues INTEGER DEFAULT 0,
  medium_issues INTEGER DEFAULT 0,
  low_issues INTEGER DEFAULT 0,

  -- Recommendations
  top_recommendations JSONB DEFAULT '[]',

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 7. SECURITY CONFIG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS security_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Configuration
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,

  -- Audit
  updated_by UUID,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 8. NOTIFICATION LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Event information
  event_type TEXT NOT NULL, -- 'alert', 'error', 'vulnerability'
  event_title TEXT NOT NULL,
  event_description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),

  -- Channel information
  channel TEXT NOT NULL CHECK (channel IN ('email', 'slack', 'in_app')),
  recipients TEXT[], -- Email addresses or user IDs

  -- Result
  success BOOLEAN NOT NULL,
  error_message TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 9. SECURITY NOTIFICATION QUEUE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS security_notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'alert', 'error', 'vulnerability'
  event_id UUID NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. PERFORMANCE METRICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Metric type
  metric_type TEXT NOT NULL, -- 'web_vitals', 'api_latency', 'database_query', 'memory', 'cpu'
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  unit TEXT,

  -- Context
  route TEXT,
  user_id UUID,
  session_id TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- INDEXES
-- ============================================

-- Security Errors
CREATE INDEX IF NOT EXISTS idx_security_errors_created_at ON security_errors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_errors_severity ON security_errors(severity);
CREATE INDEX IF NOT EXISTS idx_security_errors_type ON security_errors(error_type);
CREATE INDEX IF NOT EXISTS idx_security_errors_route ON security_errors(route);
CREATE INDEX IF NOT EXISTS idx_security_errors_status_code ON security_errors(status_code);
CREATE INDEX IF NOT EXISTS idx_security_errors_resolved ON security_errors(resolved);

-- Security Events
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_ip ON security_events(ip_address);

-- Route Analytics
CREATE INDEX IF NOT EXISTS idx_route_analytics_created_at ON route_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_route_analytics_route ON route_analytics(route);
CREATE INDEX IF NOT EXISTS idx_route_analytics_error ON route_analytics(error_occurred);

-- Security Alerts
CREATE INDEX IF NOT EXISTS idx_security_alerts_created_at ON security_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_acknowledged ON security_alerts(acknowledged);

-- Vulnerabilities
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON security_vulnerabilities(severity);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_status ON security_vulnerabilities(status);

-- Notification Logs
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON notification_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_logs_event_type ON notification_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_notification_logs_severity ON notification_logs(severity);
CREATE INDEX IF NOT EXISTS idx_notification_logs_channel ON notification_logs(channel);
CREATE INDEX IF NOT EXISTS idx_notification_logs_success ON notification_logs(success);

-- Notification Queue
CREATE INDEX IF NOT EXISTS idx_notification_queue_unprocessed ON security_notification_queue(processed, created_at) WHERE processed = false;

-- Performance Metrics
CREATE INDEX IF NOT EXISTS idx_performance_metrics_recorded_at ON performance_metrics(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type);

-- Security Score
CREATE INDEX IF NOT EXISTS idx_security_score_calculated_at ON security_score_history(calculated_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE security_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_notification_queue ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admin access only" ON security_errors;
DROP POLICY IF EXISTS "Admin access only" ON security_events;
DROP POLICY IF EXISTS "Admin access only" ON route_analytics;
DROP POLICY IF EXISTS "Admin access only" ON security_vulnerabilities;
DROP POLICY IF EXISTS "Admin access only" ON performance_metrics;
DROP POLICY IF EXISTS "Admin access only" ON security_score_history;
DROP POLICY IF EXISTS "Admin access only" ON security_alerts;
DROP POLICY IF EXISTS "Admin access only" ON security_config;
DROP POLICY IF EXISTS "Admin access only" ON notification_logs;
DROP POLICY IF EXISTS "Admins can view notification queue" ON security_notification_queue;
DROP POLICY IF EXISTS "System can insert notifications" ON security_notification_queue;
DROP POLICY IF EXISTS "Service role full access" ON security_errors;
DROP POLICY IF EXISTS "Service role full access" ON notification_logs;

-- Admin read policies (using user_id from admins table for efficiency)
CREATE POLICY "Admin read access" ON security_errors
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin read access" ON security_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin read access" ON route_analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin read access" ON security_vulnerabilities
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin read access" ON performance_metrics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin read access" ON security_score_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin read access" ON security_alerts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin read access" ON security_config
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin read access" ON notification_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin read access" ON security_notification_queue
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- Allow anonymous/public INSERT for error logging (API endpoint needs this)
CREATE POLICY "Public can log errors" ON security_errors
  FOR INSERT WITH CHECK (true);

-- Allow service role full access (for admin client operations)
CREATE POLICY "Service role all access errors" ON security_errors
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role all access events" ON security_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role all access route_analytics" ON route_analytics
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role all access vulnerabilities" ON security_vulnerabilities
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role all access metrics" ON performance_metrics
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role all access score" ON security_score_history
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role all access alerts" ON security_alerts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role all access config" ON security_config
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role all access notification_logs" ON notification_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role all access notification_queue" ON security_notification_queue
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to calculate security score
CREATE OR REPLACE FUNCTION calculate_security_score()
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 100;
  v_critical_count INTEGER;
  v_high_count INTEGER;
  v_unresolved_vulns INTEGER;
BEGIN
  -- Count critical errors in last 24h
  SELECT COUNT(*) INTO v_critical_count
  FROM security_errors
  WHERE severity = 'critical'
    AND created_at > NOW() - INTERVAL '24 hours'
    AND NOT resolved;

  -- Count high errors in last 24h
  SELECT COUNT(*) INTO v_high_count
  FROM security_errors
  WHERE severity = 'high'
    AND created_at > NOW() - INTERVAL '24 hours'
    AND NOT resolved;

  -- Count unresolved vulnerabilities
  SELECT COUNT(*) INTO v_unresolved_vulns
  FROM security_vulnerabilities
  WHERE status IN ('open', 'in_progress');

  -- Calculate score
  v_score := v_score - (v_critical_count * 20);
  v_score := v_score - (v_high_count * 10);
  v_score := v_score - (v_unresolved_vulns * 5);

  IF v_score < 0 THEN
    v_score := 0;
  END IF;

  RETURN v_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_security_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_security_vulnerabilities_updated_at ON security_vulnerabilities;
CREATE TRIGGER update_security_vulnerabilities_updated_at
  BEFORE UPDATE ON security_vulnerabilities
  FOR EACH ROW EXECUTE FUNCTION update_security_updated_at();

DROP TRIGGER IF EXISTS update_security_config_updated_at ON security_config;
CREATE TRIGGER update_security_config_updated_at
  BEFORE UPDATE ON security_config
  FOR EACH ROW EXECUTE FUNCTION update_security_updated_at();

-- ============================================
-- NOTIFICATION TRIGGERS
-- ============================================

-- Trigger function for alerts
CREATE OR REPLACE FUNCTION queue_alert_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.severity IN ('critical', 'high') THEN
    INSERT INTO security_notification_queue (
      event_type, event_id, severity, title, description, metadata
    ) VALUES (
      'alert', NEW.id, NEW.severity, NEW.title, NEW.description,
      jsonb_build_object('alert_type', NEW.alert_type, 'source', NEW.source)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for errors
CREATE OR REPLACE FUNCTION queue_error_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.severity = 'critical' THEN
    INSERT INTO security_notification_queue (
      event_type, event_id, severity, title, description, metadata
    ) VALUES (
      'error', NEW.id, NEW.severity, 'Critical Error: ' || NEW.error_type,
      LEFT(NEW.message, 500),
      jsonb_build_object('error_type', NEW.error_type, 'route', NEW.route)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for vulnerabilities
CREATE OR REPLACE FUNCTION queue_vulnerability_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.severity IN ('critical', 'high') THEN
    INSERT INTO security_notification_queue (
      event_type, event_id, severity, title, description, metadata
    ) VALUES (
      'vulnerability', NEW.id, NEW.severity,
      COALESCE(NEW.title, 'New ' || NEW.severity || ' vulnerability'),
      NEW.description,
      jsonb_build_object('cve_id', NEW.cve_id, 'affected_component', NEW.affected_component)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_queue_alert_notification ON security_alerts;
DROP TRIGGER IF EXISTS trigger_queue_error_notification ON security_errors;
DROP TRIGGER IF EXISTS trigger_queue_vulnerability_notification ON security_vulnerabilities;

CREATE TRIGGER trigger_queue_alert_notification
  AFTER INSERT ON security_alerts
  FOR EACH ROW EXECUTE FUNCTION queue_alert_notification();

CREATE TRIGGER trigger_queue_error_notification
  AFTER INSERT ON security_errors
  FOR EACH ROW EXECUTE FUNCTION queue_error_notification();

CREATE TRIGGER trigger_queue_vulnerability_notification
  AFTER INSERT ON security_vulnerabilities
  FOR EACH ROW EXECUTE FUNCTION queue_vulnerability_notification();

-- Function to mark notifications as processed
CREATE OR REPLACE FUNCTION mark_notifications_processed(notification_ids UUID[])
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE security_notification_queue
  SET processed = TRUE, processed_at = NOW()
  WHERE id = ANY(notification_ids) AND processed = FALSE;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VIEW FOR PENDING NOTIFICATIONS
-- ============================================
DROP VIEW IF EXISTS pending_security_notifications;
CREATE VIEW pending_security_notifications AS
SELECT id, event_type, event_id, severity, title, description, metadata, created_at
FROM security_notification_queue
WHERE processed = FALSE
ORDER BY
  CASE severity
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    ELSE 4
  END,
  created_at ASC;

GRANT SELECT ON pending_security_notifications TO authenticated;

-- ============================================
-- INITIAL DATA
-- ============================================
INSERT INTO security_config (config_key, config_value, description) VALUES
  ('rate_limits', '{"api": 100, "auth": 5, "search": 20}'::jsonb, 'Rate limiting configuration'),
  ('alert_thresholds', '{"critical_errors": 5, "high_errors": 10, "failed_auths": 5}'::jsonb, 'Alert thresholds'),
  ('monitoring_enabled', '{"errors": true, "performance": true, "security": true}'::jsonb, 'Monitoring features'),
  ('notification_settings', '{"email": true, "slack": false, "sms": false}'::jsonb, 'Notification channels')
ON CONFLICT (config_key) DO NOTHING;

-- Initial security score
INSERT INTO security_score_history (overall_score, authentication_score, authorization_score, data_protection_score, vulnerability_score, monitoring_score, compliance_score)
VALUES (100, 95, 90, 85, 100, 80, 90);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE security_errors IS 'All errors and exceptions captured by the application';
COMMENT ON TABLE security_events IS 'Security events and intrusion attempts';
COMMENT ON TABLE route_analytics IS 'Detailed analytics for each API request';
COMMENT ON TABLE security_vulnerabilities IS 'Detected vulnerabilities and their status';
COMMENT ON TABLE notification_logs IS 'Logs of all security notifications sent';
COMMENT ON TABLE security_notification_queue IS 'Queue for pending security notifications';
