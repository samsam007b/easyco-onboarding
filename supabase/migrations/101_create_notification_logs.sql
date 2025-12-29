-- ============================================
-- NOTIFICATION LOGS TABLE
-- Tracks all security notifications sent
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

-- Indexes
CREATE INDEX idx_notification_logs_created_at ON notification_logs(created_at DESC);
CREATE INDEX idx_notification_logs_event_type ON notification_logs(event_type);
CREATE INDEX idx_notification_logs_severity ON notification_logs(severity);
CREATE INDEX idx_notification_logs_channel ON notification_logs(channel);
CREATE INDEX idx_notification_logs_success ON notification_logs(success);

-- Enable RLS
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can access
CREATE POLICY "Admin access only" ON notification_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Comment
COMMENT ON TABLE notification_logs IS 'Logs of all security notifications sent via email, Slack, or in-app';
