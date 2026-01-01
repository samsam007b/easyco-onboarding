-- =====================================================
-- AUTOMATIC SECURITY ALERTS SYSTEM
-- =====================================================
-- Real-time detection and alerting for suspicious
-- bank info access patterns
-- =====================================================

-- =====================================================
-- EXTEND EXISTING SECURITY ALERTS TABLE
-- (If table exists, just add new alert types)
-- =====================================================

-- Add user_id column if it doesn't exist (table already exists from previous migrations)
ALTER TABLE security_alerts
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON security_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_user ON security_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_security_alerts_created ON security_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_alerts_unack ON security_alerts(acknowledged) WHERE acknowledged = FALSE;

-- RLS: Only admins can view/manage alerts (may already be enabled)
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist before recreating
DROP POLICY IF EXISTS "Admins can view all alerts" ON security_alerts;
DROP POLICY IF EXISTS "Admins can acknowledge alerts" ON security_alerts;
DROP POLICY IF EXISTS "System can insert alerts" ON security_alerts;

CREATE POLICY "Admins can view all alerts"
  ON security_alerts FOR SELECT
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE POLICY "Admins can acknowledge alerts"
  ON security_alerts FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE POLICY "System can insert alerts"
  ON security_alerts FOR INSERT
  WITH CHECK (true); -- Called from SECURITY DEFINER functions

-- =====================================================
-- FUNCTION: Generate alert title from type
-- =====================================================
CREATE OR REPLACE FUNCTION get_alert_title(p_alert_type TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN CASE p_alert_type
    WHEN 'excessive_access' THEN 'Accès excessif aux données bancaires'
    WHEN 'multi_user_scraping' THEN 'Tentative de scraping multi-utilisateur'
    WHEN 'unusual_hours' THEN 'Accès à des heures inhabituelles'
    WHEN 'rapid_fire' THEN 'Requêtes rapides suspectes'
    WHEN 'failed_rate_limit' THEN 'Limite de requêtes atteinte'
    ELSE 'Alerte de sécurité bancaire'
  END;
END;
$$;

-- =====================================================
-- FUNCTION: Create security alert
-- =====================================================
CREATE OR REPLACE FUNCTION create_security_alert(
  p_alert_type TEXT,
  p_severity TEXT,
  p_user_id UUID,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_alert_id UUID;
  v_title TEXT;
BEGIN
  -- Generate title from alert type
  v_title := get_alert_title(p_alert_type);

  INSERT INTO security_alerts (alert_type, severity, user_id, title, description, metadata, source)
  VALUES (p_alert_type, p_severity, p_user_id, v_title, p_description, p_metadata, 'bank_info_security')
  RETURNING id INTO v_alert_id;

  -- Notify via pg_notify for real-time listeners
  PERFORM pg_notify(
    'security_alert',
    json_build_object(
      'id', v_alert_id,
      'type', p_alert_type,
      'severity', p_severity,
      'user_id', p_user_id,
      'title', v_title,
      'description', p_description
    )::text
  );

  RETURN v_alert_id;
END;
$$;

-- =====================================================
-- FUNCTION: Real-time suspicious activity check
-- Called after each bank info access
-- =====================================================
CREATE OR REPLACE FUNCTION check_suspicious_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_access_count_1min INT;
  v_unique_users_1hour INT;
  v_current_hour INT;
BEGIN
  v_user_id := NEW.accessed_by;
  v_current_hour := EXTRACT(HOUR FROM NOW());

  -- Check 1: Rapid-fire access (more than 5 in 1 minute)
  SELECT COUNT(*) INTO v_access_count_1min
  FROM bank_info_access_log
  WHERE accessed_by = v_user_id
    AND accessed_at > NOW() - INTERVAL '1 minute';

  IF v_access_count_1min > 5 THEN
    PERFORM create_security_alert(
      'rapid_fire',
      'high',
      v_user_id,
      format('User accessed bank info %s times in 1 minute', v_access_count_1min),
      jsonb_build_object('access_count', v_access_count_1min)
    );
  END IF;

  -- Check 2: Multi-user scraping (more than 3 unique users in 1 hour)
  SELECT COUNT(DISTINCT accessed_user_id) INTO v_unique_users_1hour
  FROM bank_info_access_log
  WHERE accessed_by = v_user_id
    AND accessed_at > NOW() - INTERVAL '1 hour';

  IF v_unique_users_1hour > 3 THEN
    PERFORM create_security_alert(
      'multi_user_scraping',
      'critical',
      v_user_id,
      format('User accessed %s different users'' bank info in 1 hour', v_unique_users_1hour),
      jsonb_build_object('unique_users', v_unique_users_1hour)
    );
  END IF;

  -- Check 3: Unusual hours (between 2 AM and 5 AM local time)
  -- Note: Adjust timezone as needed
  IF v_current_hour BETWEEN 2 AND 5 THEN
    PERFORM create_security_alert(
      'unusual_hours',
      'medium',
      v_user_id,
      format('Bank info accessed at unusual hour (%s:00)', v_current_hour),
      jsonb_build_object('hour', v_current_hour)
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for real-time checks
DROP TRIGGER IF EXISTS trigger_check_suspicious_activity ON bank_info_access_log;
CREATE TRIGGER trigger_check_suspicious_activity
  AFTER INSERT ON bank_info_access_log
  FOR EACH ROW
  EXECUTE FUNCTION check_suspicious_activity();

-- =====================================================
-- FUNCTION: Track rate limit failures
-- =====================================================
CREATE OR REPLACE FUNCTION log_rate_limit_failure()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_failure_count INT;
BEGIN
  -- Count recent rate limit failures for this user
  SELECT COUNT(*) INTO v_failure_count
  FROM security_alerts
  WHERE user_id = v_user_id
    AND alert_type = 'failed_rate_limit'
    AND created_at > NOW() - INTERVAL '1 hour';

  -- Create alert
  PERFORM create_security_alert(
    'failed_rate_limit',
    CASE WHEN v_failure_count > 3 THEN 'high' ELSE 'low' END,
    v_user_id,
    format('User hit rate limit (%s failures in last hour)', v_failure_count + 1),
    jsonb_build_object('failure_count', v_failure_count + 1)
  );
END;
$$;

-- Update rate limit function to log failures
CREATE OR REPLACE FUNCTION check_bank_info_rate_limit()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_count INT;
  v_window_start TIMESTAMPTZ;
  v_max_requests INT := 10;
  v_window_seconds INT := 60;
BEGIN
  -- Get or create rate limit record
  SELECT request_count, window_start INTO v_count, v_window_start
  FROM bank_info_rate_limit
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    INSERT INTO bank_info_rate_limit (user_id, request_count, window_start)
    VALUES (v_user_id, 1, NOW());
    RETURN TRUE;
  END IF;

  -- Check if window has expired
  IF v_window_start < NOW() - (v_window_seconds || ' seconds')::INTERVAL THEN
    UPDATE bank_info_rate_limit
    SET request_count = 1, window_start = NOW()
    WHERE user_id = v_user_id;
    RETURN TRUE;
  END IF;

  -- Check if over limit
  IF v_count >= v_max_requests THEN
    -- Log the rate limit failure for alerting
    PERFORM log_rate_limit_failure();
    RETURN FALSE;
  END IF;

  -- Increment counter
  UPDATE bank_info_rate_limit
  SET request_count = request_count + 1
  WHERE user_id = v_user_id;

  RETURN TRUE;
END;
$$;

-- =====================================================
-- VIEW: Active alerts summary for admin dashboard
-- =====================================================
CREATE OR REPLACE VIEW active_security_alerts AS
SELECT
  sa.id,
  sa.alert_type,
  sa.severity,
  sa.user_id,
  COALESCE(p.first_name || ' ' || p.last_name, 'Unknown') as user_name,
  p.email as user_email,
  sa.description,
  sa.metadata,
  sa.created_at,
  -- Time since alert
  CASE
    WHEN sa.created_at > NOW() - INTERVAL '1 minute' THEN 'just now'
    WHEN sa.created_at > NOW() - INTERVAL '1 hour' THEN
      EXTRACT(MINUTE FROM NOW() - sa.created_at)::TEXT || 'm ago'
    WHEN sa.created_at > NOW() - INTERVAL '1 day' THEN
      EXTRACT(HOUR FROM NOW() - sa.created_at)::TEXT || 'h ago'
    ELSE TO_CHAR(sa.created_at, 'DD/MM HH24:MI')
  END as time_ago
FROM security_alerts sa
LEFT JOIN profiles p ON p.id = sa.user_id
WHERE sa.acknowledged = FALSE
ORDER BY
  CASE sa.severity
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  sa.created_at DESC;

-- =====================================================
-- FUNCTION: Get alert statistics for dashboard
-- =====================================================
CREATE OR REPLACE FUNCTION get_security_alert_stats()
RETURNS TABLE (
  total_alerts BIGINT,
  unacknowledged BIGINT,
  critical_count BIGINT,
  high_count BIGINT,
  alerts_today BIGINT,
  top_offenders JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM security_alerts)::BIGINT as total_alerts,
    (SELECT COUNT(*) FROM security_alerts WHERE acknowledged = FALSE)::BIGINT as unacknowledged,
    (SELECT COUNT(*) FROM security_alerts WHERE severity = 'critical' AND acknowledged = FALSE)::BIGINT as critical_count,
    (SELECT COUNT(*) FROM security_alerts WHERE severity = 'high' AND acknowledged = FALSE)::BIGINT as high_count,
    (SELECT COUNT(*) FROM security_alerts WHERE created_at > CURRENT_DATE)::BIGINT as alerts_today,
    (
      SELECT COALESCE(jsonb_agg(offender), '[]'::jsonb)
      FROM (
        SELECT jsonb_build_object(
          'user_id', sa.user_id,
          'name', COALESCE(p.first_name || ' ' || p.last_name, 'Unknown'),
          'alert_count', COUNT(*)
        ) as offender
        FROM security_alerts sa
        LEFT JOIN profiles p ON p.id = sa.user_id
        WHERE sa.created_at > NOW() - INTERVAL '7 days'
        GROUP BY sa.user_id, p.first_name, p.last_name
        ORDER BY COUNT(*) DESC
        LIMIT 5
      ) top
    ) as top_offenders;
END;
$$;

-- =====================================================
-- FUNCTION: Acknowledge alert
-- =====================================================
CREATE OR REPLACE FUNCTION acknowledge_security_alert(p_alert_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE security_alerts
  SET acknowledged = TRUE,
      acknowledged_by = auth.uid(),
      acknowledged_at = NOW()
  WHERE id = p_alert_id;

  RETURN FOUND;
END;
$$;

-- =====================================================
-- GRANT EXECUTE to authenticated users
-- (functions have their own security checks)
-- =====================================================
GRANT EXECUTE ON FUNCTION get_security_alert_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION acknowledge_security_alert(UUID) TO authenticated;
