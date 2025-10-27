-- ============================================================================
-- MIGRATION 018: Create Audit Logs Table
-- Date: 2025-10-27
-- Description: Add security audit logging for tracking sensitive operations
-- ============================================================================

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only admins can view audit logs
-- For now, we'll allow service role only
CREATE POLICY "Service role can view all audit logs"
  ON public.audit_logs
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow authenticated users to insert their own audit logs
CREATE POLICY "Users can insert own audit logs"
  ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE public.audit_logs IS 'Security audit trail for tracking sensitive operations';
COMMENT ON COLUMN public.audit_logs.user_id IS 'User who performed the action';
COMMENT ON COLUMN public.audit_logs.action IS 'Type of action performed (e.g., admin_access, data_export, user_delete)';
COMMENT ON COLUMN public.audit_logs.resource_type IS 'Type of resource affected (e.g., user, property, application)';
COMMENT ON COLUMN public.audit_logs.resource_id IS 'ID of the resource affected';
COMMENT ON COLUMN public.audit_logs.ip_address IS 'IP address of the request';
COMMENT ON COLUMN public.audit_logs.user_agent IS 'User agent string';
COMMENT ON COLUMN public.audit_logs.metadata IS 'Additional context data in JSON format';

-- Create a function to automatically log sensitive operations
CREATE OR REPLACE FUNCTION log_sensitive_operation()
RETURNS TRIGGER AS $$
BEGIN
  -- Log DELETE operations on users
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, metadata)
    VALUES (
      auth.uid(),
      'user_deleted',
      TG_TABLE_NAME,
      OLD.id,
      jsonb_build_object('deleted_user_email', OLD.email)
    );
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to log user deletions
DROP TRIGGER IF EXISTS trigger_log_user_deletion ON public.users;
CREATE TRIGGER trigger_log_user_deletion
  BEFORE DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION log_sensitive_operation();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Audit logs table created successfully';
END $$;
