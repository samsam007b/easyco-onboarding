-- Create app_settings table for storing platform configuration
CREATE TABLE IF NOT EXISTS public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}',
  category text NOT NULL DEFAULT 'general',
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON public.app_settings(key);
CREATE INDEX IF NOT EXISTS idx_app_settings_category ON public.app_settings(category);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read settings
CREATE POLICY "Admins can read settings"
  ON public.app_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Only super_admins can modify settings
CREATE POLICY "Super admins can modify settings"
  ON public.app_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_app_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_app_settings_updated_at();

-- Insert default settings
INSERT INTO public.app_settings (key, value, category, description) VALUES
  ('app_name', '"EasyCo"', 'general', 'Application name'),
  ('site_url', '"https://easyco.be"', 'general', 'Site URL'),
  ('support_email', '"support@easyco.be"', 'general', 'Support email address'),
  ('default_language', '"fr"', 'general', 'Default language'),
  ('email_notifications', 'true', 'notifications', 'Enable email notifications'),
  ('push_notifications', 'true', 'notifications', 'Enable push notifications'),
  ('weekly_summary', 'false', 'notifications', 'Send weekly summary to owners'),
  ('admin_alerts', 'true', 'notifications', 'Send alerts to admins'),
  ('email_from', '"EasyCo <noreply@easyco.be>"', 'email', 'Email sender'),
  ('email_reply_to', '"support@easyco.be"', 'email', 'Email reply-to address'),
  ('require_2fa', 'true', 'security', 'Require 2FA for admins'),
  ('audit_logs', 'true', 'security', 'Enable audit logging'),
  ('session_timeout', '60', 'security', 'Session timeout in minutes'),
  ('rate_limiting', 'true', 'security', 'Enable rate limiting'),
  ('maintenance_mode', 'false', 'appearance', 'Enable maintenance mode'),
  ('announcement_banner', 'false', 'appearance', 'Show announcement banner')
ON CONFLICT (key) DO NOTHING;

-- Comment
COMMENT ON TABLE public.app_settings IS 'Stores application configuration settings';
