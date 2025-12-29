-- Fix RLS policies for security tables
-- The existing policies cause recursion issues when checking admins table

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Admin access only" ON security_errors;
DROP POLICY IF EXISTS "Admin read access" ON security_errors;
DROP POLICY IF EXISTS "Admin insert access" ON security_errors;
DROP POLICY IF EXISTS "Admin update access" ON security_errors;

DROP POLICY IF EXISTS "Admin access only" ON security_alerts;
DROP POLICY IF EXISTS "Admin read access" ON security_alerts;
DROP POLICY IF EXISTS "Admin insert access" ON security_alerts;
DROP POLICY IF EXISTS "Admin update access" ON security_alerts;

DROP POLICY IF EXISTS "Admin access only" ON security_score_history;
DROP POLICY IF EXISTS "Admin read access" ON security_score_history;
DROP POLICY IF EXISTS "Admin insert access" ON security_score_history;

DROP POLICY IF EXISTS "Admin access only" ON security_events;
DROP POLICY IF EXISTS "Admin access only" ON route_analytics;
DROP POLICY IF EXISTS "Admin access only" ON security_vulnerabilities;
DROP POLICY IF EXISTS "Admin access only" ON performance_metrics;
DROP POLICY IF EXISTS "Admin access only" ON security_config;

-- Create a simpler helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate policies using the helper function
CREATE POLICY "Admin read access" ON security_errors
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin insert access" ON security_errors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update access" ON security_errors
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin read access" ON security_alerts
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin insert access" ON security_alerts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update access" ON security_alerts
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin read access" ON security_score_history
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin insert access" ON security_score_history
  FOR INSERT WITH CHECK (true);

-- Only create if tables exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'security_events') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admin read access" ON security_events';
    EXECUTE 'DROP POLICY IF EXISTS "Admin insert access" ON security_events';
    EXECUTE 'CREATE POLICY "Admin read access" ON security_events FOR SELECT USING (public.is_admin())';
    EXECUTE 'CREATE POLICY "Admin insert access" ON security_events FOR INSERT WITH CHECK (true)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'route_analytics') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admin read access" ON route_analytics';
    EXECUTE 'DROP POLICY IF EXISTS "Admin insert access" ON route_analytics';
    EXECUTE 'CREATE POLICY "Admin read access" ON route_analytics FOR SELECT USING (public.is_admin())';
    EXECUTE 'CREATE POLICY "Admin insert access" ON route_analytics FOR INSERT WITH CHECK (true)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'security_vulnerabilities') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admin read access" ON security_vulnerabilities';
    EXECUTE 'DROP POLICY IF EXISTS "Admin insert access" ON security_vulnerabilities';
    EXECUTE 'CREATE POLICY "Admin read access" ON security_vulnerabilities FOR SELECT USING (public.is_admin())';
    EXECUTE 'CREATE POLICY "Admin insert access" ON security_vulnerabilities FOR INSERT WITH CHECK (true)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'performance_metrics') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admin read access" ON performance_metrics';
    EXECUTE 'DROP POLICY IF EXISTS "Admin insert access" ON performance_metrics';
    EXECUTE 'CREATE POLICY "Admin read access" ON performance_metrics FOR SELECT USING (public.is_admin())';
    EXECUTE 'CREATE POLICY "Admin insert access" ON performance_metrics FOR INSERT WITH CHECK (true)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'security_config') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admin read access" ON security_config';
    EXECUTE 'DROP POLICY IF EXISTS "Admin write access" ON security_config';
    EXECUTE 'CREATE POLICY "Admin read access" ON security_config FOR SELECT USING (public.is_admin())';
    EXECUTE 'CREATE POLICY "Admin write access" ON security_config FOR ALL USING (public.is_admin())';
  END IF;
END $$;

-- Also add policy for notification_logs table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notification_logs') THEN
    EXECUTE 'ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Admin read access" ON notification_logs';
    EXECUTE 'DROP POLICY IF EXISTS "Admin insert access" ON notification_logs';
    EXECUTE 'CREATE POLICY "Admin read access" ON notification_logs FOR SELECT USING (public.is_admin())';
    EXECUTE 'CREATE POLICY "Admin insert access" ON notification_logs FOR INSERT WITH CHECK (true)';
  END IF;
END $$;
