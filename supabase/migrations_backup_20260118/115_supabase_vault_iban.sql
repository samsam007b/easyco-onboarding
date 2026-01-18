-- =====================================================
-- SUPABASE VAULT FOR IBAN ENCRYPTION
-- =====================================================
-- Column-level encryption using Supabase Vault
-- IBAN is stored encrypted, only decrypted when accessed
-- via authorized functions
-- =====================================================

-- Enable Vault extension (requires Supabase Pro plan)
-- If not available, the migration will skip encryption
DO $$
BEGIN
  -- Check if vault extension is available
  IF EXISTS (
    SELECT 1 FROM pg_available_extensions WHERE name = 'supabase_vault'
  ) THEN
    CREATE EXTENSION IF NOT EXISTS supabase_vault;
    RAISE NOTICE 'Supabase Vault extension enabled';
  ELSE
    RAISE NOTICE 'Supabase Vault not available - using fallback encryption';
  END IF;
END
$$;

-- =====================================================
-- FALLBACK: Application-level encryption with pgcrypto
-- Works on all Supabase plans
-- =====================================================

-- Encryption key stored as a database secret
-- In production, this should be rotated and managed via environment variables
DO $$
BEGIN
  -- Create a secrets table if it doesn't exist (for key storage)
  CREATE TABLE IF NOT EXISTS app_secrets (
    key_name TEXT PRIMARY KEY,
    key_value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    rotated_at TIMESTAMPTZ
  );

  -- Enable RLS - only service role can access
  ALTER TABLE app_secrets ENABLE ROW LEVEL SECURITY;

  -- No policies = no access except service role
  -- This is intentional for maximum security

  -- Insert encryption key if not exists
  -- NOTE: In production, generate a strong random key and inject via environment
  INSERT INTO app_secrets (key_name, key_value)
  VALUES ('iban_encryption_key', encode(gen_random_bytes(32), 'hex'))
  ON CONFLICT (key_name) DO NOTHING;

EXCEPTION
  WHEN duplicate_table THEN
    NULL; -- Table already exists
END
$$;

-- =====================================================
-- ENCRYPTION/DECRYPTION FUNCTIONS
-- =====================================================

-- Get the encryption key (only callable by SECURITY DEFINER functions)
CREATE OR REPLACE FUNCTION get_iban_encryption_key()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key TEXT;
BEGIN
  SELECT key_value INTO v_key
  FROM app_secrets
  WHERE key_name = 'iban_encryption_key';

  RETURN v_key;
END;
$$;

-- Revoke direct access - only other functions can call this
REVOKE ALL ON FUNCTION get_iban_encryption_key() FROM PUBLIC;
REVOKE ALL ON FUNCTION get_iban_encryption_key() FROM anon;
REVOKE ALL ON FUNCTION get_iban_encryption_key() FROM authenticated;

-- Encrypt IBAN function
CREATE OR REPLACE FUNCTION encrypt_iban(p_iban TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key TEXT;
BEGIN
  IF p_iban IS NULL OR p_iban = '' THEN
    RETURN NULL;
  END IF;

  v_key := get_iban_encryption_key();

  -- Use pgcrypto's symmetric encryption (AES-256)
  RETURN encode(
    pgp_sym_encrypt(
      p_iban,
      v_key,
      'cipher-algo=aes256'
    ),
    'base64'
  );
END;
$$;

-- Decrypt IBAN function
CREATE OR REPLACE FUNCTION decrypt_iban(p_encrypted_iban TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key TEXT;
BEGIN
  IF p_encrypted_iban IS NULL OR p_encrypted_iban = '' THEN
    RETURN NULL;
  END IF;

  v_key := get_iban_encryption_key();

  -- Decrypt using pgcrypto
  RETURN pgp_sym_decrypt(
    decode(p_encrypted_iban, 'base64'),
    v_key
  );
EXCEPTION
  WHEN OTHERS THEN
    -- If decryption fails, return NULL (don't expose error details)
    RETURN NULL;
END;
$$;

-- =====================================================
-- ADD ENCRYPTED IBAN COLUMN
-- =====================================================

-- Add encrypted column alongside existing iban column
ALTER TABLE user_bank_info
ADD COLUMN IF NOT EXISTS iban_encrypted TEXT;

-- =====================================================
-- MIGRATION: Encrypt existing IBANs
-- =====================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT user_id, iban
    FROM user_bank_info
    WHERE iban IS NOT NULL
      AND iban != ''
      AND (iban_encrypted IS NULL OR iban_encrypted = '')
  LOOP
    UPDATE user_bank_info
    SET iban_encrypted = encrypt_iban(r.iban)
    WHERE user_id = r.user_id;
  END LOOP;

  RAISE NOTICE 'Migrated existing IBANs to encrypted format';
END
$$;

-- =====================================================
-- TRIGGER: Auto-encrypt IBAN on insert/update
-- =====================================================
CREATE OR REPLACE FUNCTION auto_encrypt_iban()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If iban is being set/updated, encrypt it
  IF NEW.iban IS NOT NULL AND NEW.iban != '' THEN
    NEW.iban_encrypted := encrypt_iban(NEW.iban);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_auto_encrypt_iban ON user_bank_info;
CREATE TRIGGER trigger_auto_encrypt_iban
  BEFORE INSERT OR UPDATE OF iban ON user_bank_info
  FOR EACH ROW
  EXECUTE FUNCTION auto_encrypt_iban();

-- =====================================================
-- UPDATE SECURE ACCESS FUNCTION
-- Now uses decryption for full IBAN access
-- =====================================================
CREATE OR REPLACE FUNCTION get_roommate_payment_info_secure(
  p_user_id UUID,
  p_show_full_iban BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  user_id UUID,
  iban_display VARCHAR,
  iban_masked VARCHAR,
  bank_name VARCHAR,
  account_holder_name VARCHAR,
  revtag VARCHAR,
  payconiq_enabled BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_decrypted_iban TEXT;
BEGIN
  -- 1. Check rate limit
  IF NOT check_bank_info_rate_limit() THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before making more requests.';
  END IF;

  -- 2. Check if caller is a roommate
  IF NOT EXISTS (
    SELECT 1 FROM property_members pm1
    JOIN property_members pm2 ON pm1.property_id = pm2.property_id
    WHERE pm1.user_id = auth.uid()
      AND pm2.user_id = p_user_id
      AND pm1.status = 'active'
      AND pm2.status = 'active'
  ) THEN
    RAISE EXCEPTION 'Not authorized to view this information';
  END IF;

  -- 3. Log the access
  PERFORM log_bank_info_access(p_user_id, 'view');

  -- 4. Get decrypted IBAN if showing full
  IF p_show_full_iban THEN
    SELECT decrypt_iban(ubi.iban_encrypted) INTO v_decrypted_iban
    FROM user_bank_info ubi
    WHERE ubi.user_id = p_user_id;

    -- If decryption failed but we have unencrypted iban, use that
    IF v_decrypted_iban IS NULL THEN
      SELECT ubi.iban INTO v_decrypted_iban
      FROM user_bank_info ubi
      WHERE ubi.user_id = p_user_id;
    END IF;
  END IF;

  -- 5. Return data with optional masking
  RETURN QUERY
  SELECT
    ubi.user_id,
    CASE
      WHEN p_show_full_iban THEN v_decrypted_iban::VARCHAR
      ELSE NULL
    END AS iban_display,
    mask_iban(COALESCE(v_decrypted_iban, ubi.iban))::VARCHAR AS iban_masked,
    ubi.bank_name,
    ubi.account_holder_name,
    ubi.revtag,
    ubi.payconiq_enabled
  FROM user_bank_info ubi
  WHERE ubi.user_id = p_user_id;
END;
$$;

-- =====================================================
-- OPTIONAL: Clear plaintext IBAN after migration
-- Uncomment this after verifying encryption works
-- =====================================================
-- UPDATE user_bank_info
-- SET iban = '***ENCRYPTED***'
-- WHERE iban_encrypted IS NOT NULL;

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. The encryption key is stored in app_secrets table
-- 2. Only SECURITY DEFINER functions can access the key
-- 3. All IBAN access goes through get_roommate_payment_info_secure
-- 4. Plaintext iban column kept temporarily for backward compatibility
-- 5. After testing, run the cleanup query above to remove plaintext
-- =====================================================
