-- ============================================================================
-- MIGRATION 021: Create Login Attempts Table
-- Date: 2025-10-27
-- Description: Track failed login attempts and implement account lockout
-- Security: Prevents brute force attacks
-- ============================================================================

-- Create login_attempts table
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address INET,
  attempt_count INTEGER DEFAULT 1,
  locked_until TIMESTAMPTZ,
  last_attempt_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON public.login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON public.login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_locked_until ON public.login_attempts(locked_until);

-- Enable RLS
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only service role and authenticated users can manage login attempts
DROP POLICY IF EXISTS "Service role can manage login attempts" ON public.login_attempts;
CREATE POLICY "Service role can manage login attempts"
  ON public.login_attempts
  FOR ALL
  TO service_role
  USING (true);

-- Users can only view their own login attempts
DROP POLICY IF EXISTS "Users can view own login attempts" ON public.login_attempts;
CREATE POLICY "Users can view own login attempts"
  ON public.login_attempts
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');

-- Add comments
COMMENT ON TABLE public.login_attempts IS 'Track failed login attempts for account lockout and security monitoring';
COMMENT ON COLUMN public.login_attempts.email IS 'Email address of the login attempt';
COMMENT ON COLUMN public.login_attempts.ip_address IS 'IP address of the login attempt';
COMMENT ON COLUMN public.login_attempts.attempt_count IS 'Number of failed attempts';
COMMENT ON COLUMN public.login_attempts.locked_until IS 'Timestamp until account is locked (NULL if not locked)';
COMMENT ON COLUMN public.login_attempts.last_attempt_at IS 'Timestamp of the last failed attempt';

-- Create function to check if account is locked
CREATE OR REPLACE FUNCTION is_account_locked(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  locked_until TIMESTAMPTZ;
BEGIN
  SELECT la.locked_until INTO locked_until
  FROM public.login_attempts la
  WHERE la.email = user_email
  ORDER BY la.last_attempt_at DESC
  LIMIT 1;

  -- If no record or not locked, return false
  IF locked_until IS NULL THEN
    RETURN FALSE;
  END IF;

  -- If locked_until is in the future, account is locked
  IF locked_until > now() THEN
    RETURN TRUE;
  END IF;

  -- Lock has expired
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_account_locked(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION is_account_locked(TEXT) TO anon;

-- Create function to record failed login attempt
CREATE OR REPLACE FUNCTION record_failed_login(
  user_email TEXT,
  user_ip INET DEFAULT NULL
)
RETURNS TABLE(
  is_locked BOOLEAN,
  attempts INTEGER,
  locked_until TIMESTAMPTZ
) AS $$
DECLARE
  current_attempts INTEGER;
  current_locked_until TIMESTAMPTZ;
  new_locked_until TIMESTAMPTZ;
  max_attempts CONSTANT INTEGER := 5;
  lockout_duration CONSTANT INTERVAL := '15 minutes';
BEGIN
  -- Get current attempt record
  SELECT attempt_count, login_attempts.locked_until
  INTO current_attempts, current_locked_until
  FROM public.login_attempts
  WHERE email = user_email
  ORDER BY last_attempt_at DESC
  LIMIT 1;

  -- If no record exists, create one
  IF current_attempts IS NULL THEN
    INSERT INTO public.login_attempts (email, ip_address, attempt_count, last_attempt_at)
    VALUES (user_email, user_ip, 1, now());

    RETURN QUERY SELECT FALSE, 1, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  -- Check if currently locked and lock hasn't expired
  IF current_locked_until IS NOT NULL AND current_locked_until > now() THEN
    RETURN QUERY SELECT TRUE, current_attempts, current_locked_until;
    RETURN;
  END IF;

  -- Increment attempt count
  current_attempts := current_attempts + 1;

  -- Lock account if max attempts reached
  IF current_attempts >= max_attempts THEN
    new_locked_until := now() + lockout_duration;

    UPDATE public.login_attempts
    SET
      attempt_count = current_attempts,
      locked_until = new_locked_until,
      last_attempt_at = now(),
      ip_address = COALESCE(user_ip, ip_address)
    WHERE email = user_email;

    RETURN QUERY SELECT TRUE, current_attempts, new_locked_until;
  ELSE
    -- Update attempt count
    UPDATE public.login_attempts
    SET
      attempt_count = current_attempts,
      last_attempt_at = now(),
      ip_address = COALESCE(user_ip, ip_address)
    WHERE email = user_email;

    RETURN QUERY SELECT FALSE, current_attempts, NULL::TIMESTAMPTZ;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION record_failed_login(TEXT, INET) TO authenticated;
GRANT EXECUTE ON FUNCTION record_failed_login(TEXT, INET) TO anon;

-- Create function to reset login attempts (on successful login)
CREATE OR REPLACE FUNCTION reset_login_attempts(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.login_attempts WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION reset_login_attempts(TEXT) TO authenticated;

-- Create function to clean up old login attempts (run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete login attempts older than 30 days
  DELETE FROM public.login_attempts
  WHERE created_at < now() - INTERVAL '30 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Login attempts table created successfully';
  RAISE NOTICE 'Account lockout: 5 attempts, 15 minute lockout';
END $$;
