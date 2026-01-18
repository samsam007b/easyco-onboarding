-- Migration: 123_security_fix_clear_plaintext_iban.sql
-- Security Fix: VULN-003 - Clear plaintext IBAN after encryption migration
--
-- VULNERABILITY: IBANs stored in plaintext alongside encrypted versions
-- SOLUTION: Remove plaintext, enforce encryption-only storage
--
-- Prerequisites:
-- - Migration 115_supabase_vault_iban.sql must have run successfully
-- - All IBANs should already have encrypted versions

-- ============================================================================
-- STEP 1: Verify encryption is in place before clearing plaintext
-- ============================================================================
DO $$
DECLARE
  v_unencrypted_count INT;
  v_total_count INT;
BEGIN
  -- Count records with plaintext but no encrypted version
  SELECT COUNT(*) INTO v_unencrypted_count
  FROM user_bank_info
  WHERE iban IS NOT NULL
    AND iban != ''
    AND iban != '***ENCRYPTED***'
    AND (iban_encrypted IS NULL OR iban_encrypted = '');

  SELECT COUNT(*) INTO v_total_count
  FROM user_bank_info
  WHERE iban IS NOT NULL AND iban != '' AND iban != '***ENCRYPTED***';

  IF v_unencrypted_count > 0 THEN
    -- Migrate any remaining unencrypted IBANs
    UPDATE user_bank_info
    SET iban_encrypted = encrypt_iban(iban)
    WHERE iban IS NOT NULL
      AND iban != ''
      AND iban != '***ENCRYPTED***'
      AND (iban_encrypted IS NULL OR iban_encrypted = '');

    RAISE NOTICE 'Encrypted % IBANs that were still in plaintext', v_unencrypted_count;
  ELSE
    RAISE NOTICE 'All % IBANs are already encrypted', v_total_count;
  END IF;
END
$$;

-- ============================================================================
-- STEP 2: Clear plaintext IBAN values (replace with marker)
-- ============================================================================
UPDATE user_bank_info
SET iban = '***ENCRYPTED***'
WHERE iban IS NOT NULL
  AND iban != ''
  AND iban != '***ENCRYPTED***'
  AND iban_encrypted IS NOT NULL;

-- ============================================================================
-- STEP 3: Add constraint to prevent future plaintext storage
-- ============================================================================
DO $$
BEGIN
  -- Drop existing constraint if any
  ALTER TABLE user_bank_info
    DROP CONSTRAINT IF EXISTS chk_iban_must_be_encrypted;

  -- Add check constraint: iban must be NULL, empty, or the encrypted marker
  ALTER TABLE user_bank_info
    ADD CONSTRAINT chk_iban_must_be_encrypted
    CHECK (
      iban IS NULL
      OR iban = ''
      OR iban = '***ENCRYPTED***'
    );

  RAISE NOTICE 'Added constraint to prevent plaintext IBAN storage';
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Could not add constraint: %', SQLERRM;
END
$$;

-- ============================================================================
-- STEP 4: Create secure IBAN getter that ONLY uses encrypted version
-- ============================================================================
CREATE OR REPLACE FUNCTION get_decrypted_iban(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_calling_user UUID := auth.uid();
  v_encrypted_iban TEXT;
  v_decrypted_iban TEXT;
BEGIN
  -- Security check: Only the owner can get their own IBAN
  -- Or a verified roommate through the secure function
  IF v_calling_user IS NULL THEN
    RETURN NULL;
  END IF;

  -- Only allow self-access through this function
  IF v_calling_user != p_user_id THEN
    -- Log unauthorized access attempt
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, metadata, created_at)
      VALUES (
        v_calling_user,
        'UNAUTHORIZED_IBAN_ACCESS_ATTEMPT',
        'user_bank_info',
        p_user_id,
        jsonb_build_object('target_user', p_user_id),
        NOW()
      );
    END IF;
    RETURN NULL;
  END IF;

  -- Get encrypted IBAN
  SELECT iban_encrypted INTO v_encrypted_iban
  FROM user_bank_info
  WHERE user_id = p_user_id;

  IF v_encrypted_iban IS NULL OR v_encrypted_iban = '' THEN
    RETURN NULL;
  END IF;

  -- Decrypt
  v_decrypted_iban := decrypt_iban(v_encrypted_iban);

  RETURN v_decrypted_iban;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_decrypted_iban(UUID) TO authenticated;

-- ============================================================================
-- STEP 5: Update the update_bank_info_secure to only store encrypted
-- ============================================================================
CREATE OR REPLACE FUNCTION store_iban_encrypted(
  p_user_id UUID,
  p_iban TEXT
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

  -- Log the update
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    INSERT INTO audit_logs (user_id, action, resource_type, resource_id, metadata, created_at)
    VALUES (
      v_calling_user,
      'IBAN_UPDATED',
      'user_bank_info',
      p_user_id,
      jsonb_build_object('encrypted', true, 'masked', mask_iban(p_iban)),
      NOW()
    );
  END IF;

  RETURN TRUE;
END;
$$;

-- Grant execute
GRANT EXECUTE ON FUNCTION store_iban_encrypted(UUID, TEXT) TO authenticated;

-- ============================================================================
-- STEP 6: Create audit view for IBAN access
-- ============================================================================
CREATE OR REPLACE VIEW iban_access_audit AS
SELECT
  al.id,
  al.user_id as accessing_user,
  al.resource_id as target_user,
  al.action,
  al.metadata,
  al.created_at
FROM audit_logs al
WHERE al.resource_type = 'user_bank_info'
  OR al.action LIKE '%IBAN%';

-- Only service role can view audit
REVOKE ALL ON iban_access_audit FROM PUBLIC;

-- ============================================================================
-- STEP 7: Add index for encrypted IBAN lookups
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_user_bank_info_encrypted
  ON user_bank_info(user_id)
  WHERE iban_encrypted IS NOT NULL;

-- ============================================================================
-- COMMENTS & DOCUMENTATION
-- ============================================================================
COMMENT ON CONSTRAINT chk_iban_must_be_encrypted ON user_bank_info IS
'SECURITY: Prevents storing plaintext IBAN. All IBANs must go through encrypt_iban() function.';

COMMENT ON FUNCTION get_decrypted_iban IS
'Securely retrieves decrypted IBAN. Only the owner can access their own IBAN.';

COMMENT ON FUNCTION store_iban_encrypted IS
'Securely stores IBAN in encrypted format. Requires password verification.';

-- ============================================================================
-- STEP 8: Security verification query (for manual check)
-- ============================================================================
-- Run this query to verify no plaintext IBANs remain:
-- SELECT COUNT(*) as plaintext_ibans
-- FROM user_bank_info
-- WHERE iban IS NOT NULL
--   AND iban != ''
--   AND iban != '***ENCRYPTED***';
-- Result should be 0
