-- Migration: 121_security_fix_bcrypt_admin_pins.sql
-- Security Fix: VULN-001 - Replace SHA256 with bcrypt for admin PINs
--
-- VULNERABILITY: SHA256 is a fast hash, vulnerable to brute-force attacks
-- SOLUTION: Use bcrypt (pgcrypto crypt function) with cost factor 10
--
-- References:
-- - OWASP Password Storage Cheat Sheet
-- - NIST SP 800-63B Digital Identity Guidelines
-- - CWE-916: Use of Password Hash With Insufficient Computational Effort

-- Ensure pgcrypto extension is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- STEP 1: Add new bcrypt column to admins table
-- ============================================================================
ALTER TABLE admins
ADD COLUMN IF NOT EXISTS pin_hash_bcrypt TEXT;

-- ============================================================================
-- STEP 2: Create secure PIN verification function using bcrypt
-- ============================================================================
CREATE OR REPLACE FUNCTION verify_admin_pin_secure(
  p_user_id UUID,
  p_pin_code TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stored_hash TEXT;
  v_legacy_hash TEXT;
  v_is_valid BOOLEAN := FALSE;
BEGIN
  -- Get both hash types
  SELECT pin_hash_bcrypt, pin_hash
  INTO v_stored_hash, v_legacy_hash
  FROM admins
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    -- User not found in admins
    RETURN FALSE;
  END IF;

  -- Priority 1: Check bcrypt hash (secure)
  IF v_stored_hash IS NOT NULL THEN
    -- bcrypt verification using crypt()
    v_is_valid := (v_stored_hash = crypt(p_pin_code, v_stored_hash));

    IF v_is_valid THEN
      RETURN TRUE;
    END IF;
  END IF;

  -- Priority 2: Check legacy SHA256 hash (for migration period)
  -- This allows existing admins to still login while we migrate
  IF v_legacy_hash IS NOT NULL THEN
    IF v_legacy_hash = encode(sha256(p_pin_code::bytea), 'hex') THEN
      -- Valid legacy hash - automatically upgrade to bcrypt
      UPDATE admins
      SET pin_hash_bcrypt = crypt(p_pin_code, gen_salt('bf', 10)),
          pin_hash = NULL  -- Clear legacy hash after upgrade
      WHERE user_id = p_user_id;

      RETURN TRUE;
    END IF;
  END IF;

  RETURN FALSE;
END;
$$;

-- ============================================================================
-- STEP 3: Create secure PIN setting function using bcrypt
-- ============================================================================
CREATE OR REPLACE FUNCTION set_admin_pin_secure(
  p_user_id UUID,
  p_new_pin TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_exists BOOLEAN;
BEGIN
  -- Validate PIN format (4-6 digits)
  IF p_new_pin !~ '^[0-9]{4,6}$' THEN
    RAISE EXCEPTION 'PIN must be 4-6 digits';
  END IF;

  -- Check if admin exists
  SELECT EXISTS(SELECT 1 FROM admins WHERE user_id = p_user_id)
  INTO v_admin_exists;

  IF NOT v_admin_exists THEN
    RAISE EXCEPTION 'Admin not found';
  END IF;

  -- Update with bcrypt hash (cost factor 10)
  UPDATE admins
  SET
    pin_hash_bcrypt = crypt(p_new_pin, gen_salt('bf', 10)),
    pin_hash = NULL,  -- Clear legacy SHA256 hash
    updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN TRUE;
END;
$$;

-- ============================================================================
-- STEP 4: Update the original verify_admin_pin to use secure version
-- ============================================================================
CREATE OR REPLACE FUNCTION verify_admin_pin(
  p_user_id UUID,
  p_pin_code TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delegate to secure version
  RETURN verify_admin_pin_secure(p_user_id, p_pin_code);
END;
$$;

-- ============================================================================
-- STEP 5: Update set_admin_pin to use secure version
-- ============================================================================
CREATE OR REPLACE FUNCTION set_admin_pin(
  p_user_id UUID,
  p_current_pin TEXT,
  p_new_pin TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- First verify current PIN using secure function
  IF NOT verify_admin_pin_secure(p_user_id, p_current_pin) THEN
    RAISE EXCEPTION 'Current PIN is incorrect';
  END IF;

  -- Set new PIN using secure function
  RETURN set_admin_pin_secure(p_user_id, p_new_pin);
END;
$$;

-- ============================================================================
-- STEP 6: Create migration helper to upgrade existing SHA256 hashes
-- This should be run ONCE after migration, then removed
-- ============================================================================
CREATE OR REPLACE FUNCTION migrate_admin_pins_to_bcrypt()
RETURNS TABLE(
  user_id UUID,
  status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin RECORD;
BEGIN
  -- Note: We cannot directly migrate SHA256 hashes to bcrypt
  -- because we don't have the original PINs.
  -- Instead, this function marks which admins need to re-enter their PIN
  -- on next login (handled by verify_admin_pin_secure auto-upgrade)

  FOR v_admin IN
    SELECT a.user_id
    FROM admins a
    WHERE a.pin_hash IS NOT NULL
      AND a.pin_hash_bcrypt IS NULL
  LOOP
    user_id := v_admin.user_id;
    status := 'PENDING_UPGRADE - Will auto-upgrade on next login';
    RETURN NEXT;
  END LOOP;

  -- Return admins already upgraded
  FOR v_admin IN
    SELECT a.user_id
    FROM admins a
    WHERE a.pin_hash_bcrypt IS NOT NULL
  LOOP
    user_id := v_admin.user_id;
    status := 'ALREADY_SECURE - Using bcrypt';
    RETURN NEXT;
  END LOOP;

  RETURN;
END;
$$;

-- ============================================================================
-- STEP 7: Add audit logging for PIN changes
-- ============================================================================
CREATE OR REPLACE FUNCTION log_admin_pin_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log PIN changes to audit_logs if table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    INSERT INTO audit_logs (
      user_id,
      action,
      resource_type,
      resource_id,
      metadata,
      created_at
    ) VALUES (
      NEW.user_id,
      'ADMIN_PIN_CHANGED',
      'admin',
      NEW.user_id,
      jsonb_build_object(
        'hash_type', CASE
          WHEN NEW.pin_hash_bcrypt IS NOT NULL THEN 'bcrypt'
          WHEN NEW.pin_hash IS NOT NULL THEN 'sha256_legacy'
          ELSE 'none'
        END,
        'upgraded_from_legacy', (OLD.pin_hash IS NOT NULL AND NEW.pin_hash IS NULL)
      ),
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for PIN change logging
DROP TRIGGER IF EXISTS tr_log_admin_pin_change ON admins;
CREATE TRIGGER tr_log_admin_pin_change
  AFTER UPDATE OF pin_hash, pin_hash_bcrypt ON admins
  FOR EACH ROW
  WHEN (OLD.pin_hash IS DISTINCT FROM NEW.pin_hash
     OR OLD.pin_hash_bcrypt IS DISTINCT FROM NEW.pin_hash_bcrypt)
  EXECUTE FUNCTION log_admin_pin_change();

-- ============================================================================
-- STEP 8: Grant necessary permissions
-- ============================================================================
GRANT EXECUTE ON FUNCTION verify_admin_pin_secure(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION set_admin_pin_secure(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_admin_pin(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION set_admin_pin(UUID, TEXT, TEXT) TO authenticated;

-- Migration helper should only be accessible to service role
REVOKE ALL ON FUNCTION migrate_admin_pins_to_bcrypt() FROM PUBLIC;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON FUNCTION verify_admin_pin_secure IS
'Securely verifies admin PIN using bcrypt. Auto-upgrades legacy SHA256 hashes on successful verification.';

COMMENT ON FUNCTION set_admin_pin_secure IS
'Sets admin PIN using bcrypt with cost factor 10. Clears any legacy SHA256 hash.';

COMMENT ON COLUMN admins.pin_hash_bcrypt IS
'Bcrypt hash of admin PIN (cost factor 10). Replaces legacy SHA256 pin_hash column.';
