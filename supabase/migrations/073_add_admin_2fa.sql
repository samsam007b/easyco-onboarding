-- Add 2FA fields to admins table
ALTER TABLE public.admins
ADD COLUMN IF NOT EXISTS pin_hash text,
ADD COLUMN IF NOT EXISTS pin_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_2fa_at timestamptz,
ADD COLUMN IF NOT EXISTS failed_attempts integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until timestamptz;

-- Function to verify admin PIN
CREATE OR REPLACE FUNCTION public.verify_admin_pin(admin_email text, pin_code text)
RETURNS boolean AS $$
DECLARE
  stored_hash text;
  is_locked boolean;
  lock_time timestamptz;
BEGIN
  -- Get admin info
  SELECT pin_hash, locked_until INTO stored_hash, lock_time
  FROM public.admins
  WHERE email = admin_email;

  -- Check if account is locked
  IF lock_time IS NOT NULL AND lock_time > now() THEN
    RETURN false;
  END IF;

  -- Simple hash comparison (in production, use bcrypt via extension)
  IF stored_hash = encode(sha256(pin_code::bytea), 'hex') THEN
    -- Reset failed attempts and update last 2FA time
    UPDATE public.admins
    SET failed_attempts = 0,
        locked_until = NULL,
        last_2fa_at = now()
    WHERE email = admin_email;
    RETURN true;
  ELSE
    -- Increment failed attempts
    UPDATE public.admins
    SET failed_attempts = failed_attempts + 1,
        locked_until = CASE
          WHEN failed_attempts >= 4 THEN now() + interval '15 minutes'
          ELSE NULL
        END
    WHERE email = admin_email;
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set admin PIN
CREATE OR REPLACE FUNCTION public.set_admin_pin(admin_email text, new_pin text)
RETURNS boolean AS $$
BEGIN
  UPDATE public.admins
  SET pin_hash = encode(sha256(new_pin::bytea), 'hex'),
      pin_enabled = true,
      failed_attempts = 0,
      locked_until = NULL
  WHERE email = admin_email;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if admin has 2FA enabled
CREATE OR REPLACE FUNCTION public.admin_has_2fa(admin_email text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE email = admin_email
    AND pin_enabled = true
    AND pin_hash IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if admin is locked
CREATE OR REPLACE FUNCTION public.is_admin_locked(admin_email text)
RETURNS boolean AS $$
DECLARE
  lock_time timestamptz;
BEGIN
  SELECT locked_until INTO lock_time
  FROM public.admins
  WHERE email = admin_email;

  RETURN lock_time IS NOT NULL AND lock_time > now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comment
COMMENT ON COLUMN public.admins.pin_hash IS 'SHA256 hash of the 6-digit security PIN';
COMMENT ON COLUMN public.admins.pin_enabled IS 'Whether 2FA is enabled for this admin';
COMMENT ON COLUMN public.admins.last_2fa_at IS 'Last successful 2FA verification timestamp';
COMMENT ON COLUMN public.admins.failed_attempts IS 'Number of failed PIN attempts';
COMMENT ON COLUMN public.admins.locked_until IS 'Account is locked until this timestamp after too many failed attempts';
