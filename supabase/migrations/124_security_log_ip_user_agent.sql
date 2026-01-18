-- Migration: 124_security_log_ip_user_agent.sql
-- Security Fix: VULN-006 - Capture IP and User-Agent on bank info changes
--
-- VULNERABILITY: ip_address and user_agent columns exist but never populated
-- SOLUTION: Add parameters to update_bank_info_secure() and log from application
--
-- Flow:
-- 1. API route captures IP from headers (x-forwarded-for, cf-connecting-ip)
-- 2. API route passes IP + UA to update_bank_info_secure()
-- 3. Function logs these values in bank_info_change_notifications
-- 4. Audit trail is complete (who, what, when, from where)

-- ============================================================================
-- STEP 1: Update update_bank_info_secure to accept IP + UA parameters
-- ============================================================================

-- Drop old function signature to avoid conflicts
DROP FUNCTION IF EXISTS update_bank_info_secure(TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT, TIMESTAMPTZ);

CREATE OR REPLACE FUNCTION update_bank_info_secure(
  p_iban TEXT DEFAULT NULL,
  p_bank_name TEXT DEFAULT NULL,
  p_account_holder_name TEXT DEFAULT NULL,
  p_revtag TEXT DEFAULT NULL,
  p_payconiq_enabled BOOLEAN DEFAULT NULL,
  p_bic TEXT DEFAULT NULL,
  p_verified_at TIMESTAMPTZ DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,  -- NEW: Client IP
  p_user_agent TEXT DEFAULT NULL   -- NEW: User-Agent header
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

  -- Send security notification WITH IP + USER-AGENT
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bank_info_change_notifications') THEN
    INSERT INTO bank_info_change_notifications (
      user_id,
      change_type,
      old_iban_masked,
      new_iban_masked,
      ip_address,           -- NEW: Log IP address
      user_agent,           -- NEW: Log User-Agent
      notification_sent
    ) VALUES (
      v_user_id,
      CASE
        WHEN v_existing.iban IS NULL THEN 'create'
        ELSE 'update'
      END,
      CASE
        WHEN v_existing.iban IS NOT NULL THEN mask_iban(v_existing.iban)
        ELSE NULL
      END,
      CASE
        WHEN p_iban IS NOT NULL THEN mask_iban(p_iban)
        ELSE NULL
      END,
      p_ip_address::INET,   -- Cast TEXT to INET
      p_user_agent,
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
-- STEP 2: Update grant permissions (new signature)
-- ============================================================================

GRANT EXECUTE ON FUNCTION update_bank_info_secure(
  TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT, TIMESTAMPTZ, TEXT, TEXT
) TO authenticated;

-- ============================================================================
-- STEP 3: Update store_iban_encrypted to also accept IP + UA
-- ============================================================================

-- Drop old function signature
DROP FUNCTION IF EXISTS store_iban_encrypted(UUID, TEXT);

CREATE OR REPLACE FUNCTION store_iban_encrypted(
  p_user_id UUID,
  p_iban TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_calling_user UUID := auth.uid();
  v_encrypted TEXT;
BEGIN
  -- Security: Only the user can update their own IBAN
  IF v_calling_user IS NULL OR v_calling_user != p_user_id THEN
    RETURN FALSE;
  END IF;

  -- Check for valid password verification
  IF NOT has_valid_password_verification(300) THEN
    RAISE EXCEPTION 'Password verification required';
  END IF;

  -- Encrypt the IBAN
  v_encrypted := encrypt_iban(p_iban);

  -- Store only encrypted version
  UPDATE user_bank_info
  SET
    iban_encrypted = v_encrypted,
    iban = '***ENCRYPTED***',  -- Clear any plaintext
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- If no row existed, insert
  IF NOT FOUND THEN
    INSERT INTO user_bank_info (user_id, iban_encrypted, iban, created_at)
    VALUES (p_user_id, v_encrypted, '***ENCRYPTED***', NOW());
  END IF;

  -- Log the update WITH IP + UA
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    INSERT INTO audit_logs (user_id, action, resource_type, resource_id, metadata, created_at, ip_address, user_agent)
    VALUES (
      v_calling_user,
      'IBAN_UPDATED',
      'user_bank_info',
      p_user_id,
      jsonb_build_object('encrypted', true, 'masked', mask_iban(p_iban)),
      NOW(),
      p_ip_address::INET,
      p_user_agent
    );
  END IF;

  RETURN TRUE;
END;
$$;

-- Grant execute with new signature
GRANT EXECUTE ON FUNCTION store_iban_encrypted(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION update_bank_info_secure IS
'SECURITY: Updates bank info with password verification, 24h cooldown, and IP/UA logging for audit trail';

COMMENT ON FUNCTION store_iban_encrypted IS
'SECURITY: Stores IBAN in encrypted format with IP/UA logging. Requires password verification.';
