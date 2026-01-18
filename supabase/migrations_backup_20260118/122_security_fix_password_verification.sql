-- Migration: 122_security_fix_password_verification.sql
-- Security Fix: VULN-002 - Implement real password re-verification for bank info
--
-- VULNERABILITY: verify_user_password() always returns TRUE without checking password
-- SOLUTION: Track verified sessions with timestamps, require recent verification
--
-- Flow:
-- 1. Client calls supabase.auth.reauthenticateWithPassword()
-- 2. On success, client calls record_password_verification()
-- 3. Sensitive operations check if verification is recent (< 5 min)

-- ============================================================================
-- STEP 1: Create table to track password verifications
-- ============================================================================
CREATE TABLE IF NOT EXISTS password_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  verification_type TEXT DEFAULT 'password', -- 'password', 'itsme', 'mfa'
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes'),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_password_verifications_user_valid
  ON password_verifications(user_id, expires_at DESC)
  WHERE used_at IS NULL;

-- RLS: Users can only see their own verifications
ALTER TABLE password_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own verifications" ON password_verifications;
CREATE POLICY "Users can view own verifications"
  ON password_verifications FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own verifications" ON password_verifications;
CREATE POLICY "Users can insert own verifications"
  ON password_verifications FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- STEP 2: Function to record a successful password verification
-- Called by client AFTER successful reauthenticateWithPassword()
-- ============================================================================
CREATE OR REPLACE FUNCTION record_password_verification(
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_verification_type TEXT DEFAULT 'password'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_verification_id UUID;
  v_expires_at TIMESTAMPTZ;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Not authenticated'
    );
  END IF;

  -- Calculate expiry (5 minutes for sensitive operations)
  v_expires_at := NOW() + INTERVAL '5 minutes';

  -- Insert verification record
  INSERT INTO password_verifications (
    user_id,
    verified_at,
    ip_address,
    user_agent,
    verification_type,
    expires_at
  ) VALUES (
    v_user_id,
    NOW(),
    p_ip_address::INET,
    p_user_agent,
    p_verification_type,
    v_expires_at
  )
  RETURNING id INTO v_verification_id;

  -- Log in audit
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    INSERT INTO audit_logs (user_id, action, resource_type, resource_id, metadata, created_at)
    VALUES (
      v_user_id,
      'PASSWORD_VERIFICATION_RECORDED',
      'password_verification',
      v_verification_id,
      jsonb_build_object(
        'type', p_verification_type,
        'expires_at', v_expires_at,
        'ip', p_ip_address
      ),
      NOW()
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'verification_id', v_verification_id,
    'expires_at', v_expires_at
  );
END;
$$;

-- ============================================================================
-- STEP 3: Function to check if user has valid recent verification
-- ============================================================================
CREATE OR REPLACE FUNCTION has_valid_password_verification(
  p_max_age_seconds INT DEFAULT 300 -- 5 minutes default
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_has_valid BOOLEAN;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check for unexpired, unused verification
  SELECT EXISTS(
    SELECT 1
    FROM password_verifications
    WHERE user_id = v_user_id
      AND expires_at > NOW()
      AND used_at IS NULL
      AND verified_at > (NOW() - (p_max_age_seconds || ' seconds')::INTERVAL)
  ) INTO v_has_valid;

  RETURN v_has_valid;
END;
$$;

-- ============================================================================
-- STEP 4: Function to consume (use) a verification token
-- Called when performing the sensitive operation
-- ============================================================================
CREATE OR REPLACE FUNCTION consume_password_verification()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_verification_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Find and mark as used the most recent valid verification
  UPDATE password_verifications
  SET used_at = NOW()
  WHERE id = (
    SELECT id
    FROM password_verifications
    WHERE user_id = v_user_id
      AND expires_at > NOW()
      AND used_at IS NULL
    ORDER BY verified_at DESC
    LIMIT 1
  )
  RETURNING id INTO v_verification_id;

  RETURN v_verification_id IS NOT NULL;
END;
$$;

-- ============================================================================
-- STEP 5: Replace the broken verify_user_password function
-- Now it actually checks for recent verification
-- ============================================================================
CREATE OR REPLACE FUNCTION verify_user_password(p_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_has_valid BOOLEAN;
BEGIN
  -- SECURITY FIX: No longer returns TRUE blindly
  -- Now checks if there's a valid recent password verification

  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check for valid verification within last 5 minutes
  v_has_valid := has_valid_password_verification(300);

  -- Log the verification check
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bank_info_access_log') THEN
    INSERT INTO bank_info_access_log (accessed_by, accessed_user_id, access_type)
    VALUES (v_user_id, v_user_id, CASE WHEN v_has_valid THEN 'verify_password_success' ELSE 'verify_password_failed' END);
  END IF;

  RETURN v_has_valid;
END;
$$;

-- ============================================================================
-- STEP 6: Update update_bank_info_secure to require verification
-- ============================================================================
CREATE OR REPLACE FUNCTION update_bank_info_secure(
  p_iban TEXT DEFAULT NULL,
  p_bank_name TEXT DEFAULT NULL,
  p_account_holder_name TEXT DEFAULT NULL,
  p_revtag TEXT DEFAULT NULL,
  p_payconiq_enabled BOOLEAN DEFAULT NULL,
  p_bic TEXT DEFAULT NULL,
  p_verified_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_has_verification BOOLEAN;
  v_cooldown_end TIMESTAMPTZ;
  v_existing RECORD;
  v_result JSONB;
BEGIN
  -- Check authentication
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'NOT_AUTHENTICATED',
      'message', 'User must be authenticated'
    );
  END IF;

  -- SECURITY FIX: Check for valid password verification
  v_has_verification := has_valid_password_verification(300);
  IF NOT v_has_verification THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'VERIFICATION_REQUIRED',
      'message', 'Password re-verification required before modifying bank info'
    );
  END IF;

  -- Check 24-hour cooldown from last modification
  SELECT
    CASE
      WHEN last_modified_at IS NOT NULL
      THEN last_modified_at + INTERVAL '24 hours'
      ELSE NULL
    END AS cooldown_end
  INTO v_cooldown_end
  FROM user_bank_info
  WHERE user_id = v_user_id;

  IF v_cooldown_end IS NOT NULL AND v_cooldown_end > NOW() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'COOLDOWN_ACTIVE',
      'message', 'Please wait 24 hours between bank info modifications',
      'cooldown_ends_at', v_cooldown_end
    );
  END IF;

  -- Get existing record for comparison
  SELECT * INTO v_existing
  FROM user_bank_info
  WHERE user_id = v_user_id;

  -- Perform the update or insert
  INSERT INTO user_bank_info (
    user_id,
    iban,
    bank_name,
    account_holder_name,
    revolut_tag,
    payconiq_enabled,
    bic,
    verified_at,
    last_modified_at
  ) VALUES (
    v_user_id,
    COALESCE(p_iban, v_existing.iban),
    COALESCE(p_bank_name, v_existing.bank_name),
    COALESCE(p_account_holder_name, v_existing.account_holder_name),
    COALESCE(p_revtag, v_existing.revolut_tag),
    COALESCE(p_payconiq_enabled, v_existing.payconiq_enabled, false),
    COALESCE(p_bic, v_existing.bic),
    COALESCE(p_verified_at, v_existing.verified_at),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    iban = COALESCE(EXCLUDED.iban, user_bank_info.iban),
    bank_name = COALESCE(EXCLUDED.bank_name, user_bank_info.bank_name),
    account_holder_name = COALESCE(EXCLUDED.account_holder_name, user_bank_info.account_holder_name),
    revolut_tag = COALESCE(EXCLUDED.revolut_tag, user_bank_info.revolut_tag),
    payconiq_enabled = COALESCE(EXCLUDED.payconiq_enabled, user_bank_info.payconiq_enabled),
    bic = COALESCE(EXCLUDED.bic, user_bank_info.bic),
    verified_at = COALESCE(EXCLUDED.verified_at, user_bank_info.verified_at),
    last_modified_at = NOW(),
    updated_at = NOW();

  -- Consume the verification token (one-time use)
  PERFORM consume_password_verification();

  -- Send security notification
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bank_info_change_notifications') THEN
    INSERT INTO bank_info_change_notifications (
      user_id,
      change_type,
      old_values,
      new_values,
      notification_sent
    ) VALUES (
      v_user_id,
      'BANK_INFO_UPDATED',
      to_jsonb(v_existing),
      jsonb_build_object(
        'iban', p_iban,
        'bank_name', p_bank_name,
        'account_holder_name', p_account_holder_name,
        'bic', p_bic
      ),
      false
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Bank info updated successfully',
    'next_modification_allowed_at', NOW() + INTERVAL '24 hours'
  );
END;
$$;

-- ============================================================================
-- STEP 7: Cleanup function for expired verifications (run via cron)
-- ============================================================================
CREATE OR REPLACE FUNCTION cleanup_expired_password_verifications()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted INT;
BEGIN
  DELETE FROM password_verifications
  WHERE expires_at < NOW() - INTERVAL '1 hour'
  RETURNING 1 INTO v_deleted;

  RETURN COALESCE(v_deleted, 0);
END;
$$;

-- ============================================================================
-- STEP 8: Grant permissions
-- ============================================================================
GRANT EXECUTE ON FUNCTION record_password_verification(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION has_valid_password_verification(INT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_user_password(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_bank_info_secure(TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT, TIMESTAMPTZ) TO authenticated;

-- Cleanup should only be called by service role (via cron)
REVOKE ALL ON FUNCTION cleanup_expired_password_verifications() FROM PUBLIC;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE password_verifications IS
'Tracks password re-verification events for sensitive operations. Verifications expire after 5 minutes.';

COMMENT ON FUNCTION record_password_verification IS
'Records a successful password verification. Call after client-side reauthenticateWithPassword() succeeds.';

COMMENT ON FUNCTION has_valid_password_verification IS
'Checks if user has a valid (unexpired, unused) password verification within the specified time.';

COMMENT ON FUNCTION verify_user_password IS
'SECURITY FIX: Now actually checks for recent password verification instead of always returning TRUE.';
