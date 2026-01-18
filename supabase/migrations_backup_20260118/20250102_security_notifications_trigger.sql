-- ============================================================================
-- SECURITY NOTIFICATIONS TRIGGER
-- ============================================================================
-- This migration creates database triggers that will notify admins
-- when critical security events occur.
--
-- Note: For full webhook functionality, you need to set up Supabase Edge Functions
-- or use the HTTP extension. This trigger creates the foundation.
-- ============================================================================

-- Create a table to queue notifications for processing
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

-- Enable RLS
ALTER TABLE security_notification_queue ENABLE ROW LEVEL SECURITY;

-- Only admins can view the queue
CREATE POLICY "Admins can view notification queue" ON security_notification_queue
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- Only system can insert (via triggers)
CREATE POLICY "System can insert notifications" ON security_notification_queue
  FOR INSERT WITH CHECK (true);

-- Create index for efficient processing
CREATE INDEX IF NOT EXISTS idx_notification_queue_unprocessed
  ON security_notification_queue(processed, created_at)
  WHERE processed = false;

-- ============================================================================
-- TRIGGER FUNCTION: Queue notification for critical alerts
-- ============================================================================
CREATE OR REPLACE FUNCTION queue_alert_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only queue for critical or high severity alerts
  IF NEW.severity IN ('critical', 'high') THEN
    INSERT INTO security_notification_queue (
      event_type,
      event_id,
      severity,
      title,
      description,
      metadata
    ) VALUES (
      'alert',
      NEW.id,
      NEW.severity,
      NEW.title,
      NEW.description,
      jsonb_build_object(
        'alert_type', NEW.alert_type,
        'source', NEW.source
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER FUNCTION: Queue notification for critical errors
-- ============================================================================
CREATE OR REPLACE FUNCTION queue_error_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only queue for critical severity errors
  IF NEW.severity = 'critical' THEN
    INSERT INTO security_notification_queue (
      event_type,
      event_id,
      severity,
      title,
      description,
      metadata
    ) VALUES (
      'error',
      NEW.id,
      NEW.severity,
      'Critical Error: ' || NEW.error_type,
      LEFT(NEW.message, 500),
      jsonb_build_object(
        'error_type', NEW.error_type,
        'route', NEW.route,
        'user_agent', NEW.user_agent
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER FUNCTION: Queue notification for vulnerabilities
-- ============================================================================
CREATE OR REPLACE FUNCTION queue_vulnerability_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Queue for critical or high severity vulnerabilities
  IF NEW.severity IN ('critical', 'high') THEN
    INSERT INTO security_notification_queue (
      event_type,
      event_id,
      severity,
      title,
      description,
      metadata
    ) VALUES (
      'vulnerability',
      NEW.id,
      NEW.severity,
      COALESCE(NEW.title, 'New ' || NEW.severity || ' vulnerability'),
      NEW.description,
      jsonb_build_object(
        'cve_id', NEW.cve_id,
        'affected_component', NEW.affected_component,
        'status', NEW.status
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CREATE TRIGGERS
-- ============================================================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_queue_alert_notification ON security_alerts;
DROP TRIGGER IF EXISTS trigger_queue_error_notification ON security_errors;
DROP TRIGGER IF EXISTS trigger_queue_vulnerability_notification ON security_vulnerabilities;

-- Create new triggers
CREATE TRIGGER trigger_queue_alert_notification
  AFTER INSERT ON security_alerts
  FOR EACH ROW
  EXECUTE FUNCTION queue_alert_notification();

CREATE TRIGGER trigger_queue_error_notification
  AFTER INSERT ON security_errors
  FOR EACH ROW
  EXECUTE FUNCTION queue_error_notification();

CREATE TRIGGER trigger_queue_vulnerability_notification
  AFTER INSERT ON security_vulnerabilities
  FOR EACH ROW
  EXECUTE FUNCTION queue_vulnerability_notification();

-- ============================================================================
-- FUNCTION TO MARK NOTIFICATIONS AS PROCESSED
-- ============================================================================
CREATE OR REPLACE FUNCTION mark_notifications_processed(notification_ids UUID[])
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE security_notification_queue
  SET
    processed = TRUE,
    processed_at = NOW()
  WHERE id = ANY(notification_ids)
    AND processed = FALSE;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- VIEW: Pending notifications for easier querying
-- ============================================================================
CREATE OR REPLACE VIEW pending_security_notifications AS
SELECT
  id,
  event_type,
  event_id,
  severity,
  title,
  description,
  metadata,
  created_at
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

-- Grant access to the view
GRANT SELECT ON pending_security_notifications TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE security_notification_queue IS 'Queue for security notifications pending delivery';
COMMENT ON FUNCTION queue_alert_notification() IS 'Queues notifications for critical/high security alerts';
COMMENT ON FUNCTION queue_error_notification() IS 'Queues notifications for critical security errors';
COMMENT ON FUNCTION queue_vulnerability_notification() IS 'Queues notifications for critical/high vulnerabilities';
