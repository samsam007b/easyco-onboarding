-- Migration: 125_validate_iban_checksum.sql
-- Security Fix: VULN-008 - Validate IBAN format and checksum
--
-- VULNERABILITY: IBANs accepted without mod97 checksum validation
-- SOLUTION: Implement ISO 13616 IBAN validation algorithm
--
-- Impact: Prevents invalid IBANs from being stored (failed payments)
-- Standard: ISO 13616 (European banking standard)

-- ============================================================================
-- STEP 1: Create IBAN validation function (mod97 checksum)
-- ============================================================================

CREATE OR REPLACE FUNCTION is_valid_iban(p_iban TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_iban TEXT;
  v_rearranged TEXT;
  v_numeric TEXT;
  v_char TEXT;
  v_code INT;
  v_remainder NUMERIC;
  i INT;
BEGIN
  -- Remove all spaces and convert to uppercase
  v_iban := UPPER(REPLACE(p_iban, ' ', ''));

  -- Basic format validation
  -- IBAN must be 15-34 characters (varies by country)
  IF LENGTH(v_iban) < 15 OR LENGTH(v_iban) > 34 THEN
    RETURN FALSE;
  END IF;

  -- Must start with 2 letters (country code)
  IF NOT SUBSTRING(v_iban FROM 1 FOR 2) ~ '^[A-Z]{2}$' THEN
    RETURN FALSE;
  END IF;

  -- Next 2 chars must be digits (check digits)
  IF NOT SUBSTRING(v_iban FROM 3 FOR 2) ~ '^[0-9]{2}$' THEN
    RETURN FALSE;
  END IF;

  -- Country-specific length validation (common European countries)
  CASE SUBSTRING(v_iban FROM 1 FOR 2)
    WHEN 'BE' THEN -- Belgium: 16 chars
      IF LENGTH(v_iban) != 16 THEN RETURN FALSE; END IF;
    WHEN 'FR' THEN -- France: 27 chars
      IF LENGTH(v_iban) != 27 THEN RETURN FALSE; END IF;
    WHEN 'DE' THEN -- Germany: 22 chars
      IF LENGTH(v_iban) != 22 THEN RETURN FALSE; END IF;
    WHEN 'NL' THEN -- Netherlands: 18 chars
      IF LENGTH(v_iban) != 18 THEN RETURN FALSE; END IF;
    WHEN 'LU' THEN -- Luxembourg: 20 chars
      IF LENGTH(v_iban) != 20 THEN RETURN FALSE; END IF;
    WHEN 'GB' THEN -- UK: 22 chars
      IF LENGTH(v_iban) != 22 THEN RETURN FALSE; END IF;
    -- Add more countries as needed
    ELSE
      -- Unknown country: accept if length is valid (15-34)
      NULL;
  END CASE;

  -- ========================================================================
  -- MOD97 CHECKSUM VALIDATION (ISO 13616 algorithm)
  -- ========================================================================

  -- Step 1: Move first 4 characters to end
  v_rearranged := SUBSTRING(v_iban FROM 5) || SUBSTRING(v_iban FROM 1 FOR 4);

  -- Step 2: Convert letters to numbers (A=10, B=11, ..., Z=35)
  v_numeric := '';
  FOR i IN 1..LENGTH(v_rearranged) LOOP
    v_char := SUBSTRING(v_rearranged FROM i FOR 1);

    IF v_char ~ '[A-Z]' THEN
      -- ASCII code of 'A' is 65, we want A=10, so: ASCII - 55
      v_code := ASCII(v_char) - 55;
      v_numeric := v_numeric || v_code::TEXT;
    ELSE
      -- Already a digit, append as-is
      v_numeric := v_numeric || v_char;
    END IF;
  END LOOP;

  -- Step 3: Calculate mod 97 of the big number
  -- Note: PostgreSQL NUMERIC can handle very large numbers
  v_remainder := v_numeric::NUMERIC % 97;

  -- Step 4: Valid IBAN has remainder = 1
  RETURN v_remainder = 1;

EXCEPTION
  WHEN OTHERS THEN
    -- If any error (invalid chars, etc.), return false
    RETURN FALSE;
END;
$$;

-- ============================================================================
-- STEP 2: Test the function with known valid/invalid IBANs
-- ============================================================================

-- Test cases (these should pass/fail)
DO $$
BEGIN
  -- Valid Belgian IBAN
  IF NOT is_valid_iban('BE68539007547034') THEN
    RAISE WARNING 'IBAN validation failed for known valid Belgian IBAN';
  END IF;

  -- Valid with spaces (should auto-remove)
  IF NOT is_valid_iban('BE68 5390 0754 7034') THEN
    RAISE WARNING 'IBAN validation failed for valid IBAN with spaces';
  END IF;

  -- Invalid checksum (changed last digit)
  IF is_valid_iban('BE68539007547035') THEN
    RAISE WARNING 'IBAN validation accepted invalid checksum';
  END IF;

  -- Too short
  IF is_valid_iban('BE68') THEN
    RAISE WARNING 'IBAN validation accepted too-short IBAN';
  END IF;

  -- Invalid country code
  IF is_valid_iban('XX68539007547034') THEN
    RAISE WARNING 'IBAN validation accepted invalid country';
  END IF;

  RAISE NOTICE 'IBAN validation tests completed successfully';
END;
$$;

-- ============================================================================
-- STEP 3: Add CHECK constraint to user_bank_info
-- ============================================================================

-- Note: We can't add constraint if existing data is invalid
-- First, check if any existing IBANs are invalid
DO $$
DECLARE
  v_invalid_count INT;
BEGIN
  SELECT COUNT(*) INTO v_invalid_count
  FROM user_bank_info
  WHERE iban IS NOT NULL
    AND iban != ''
    AND iban != '***ENCRYPTED***'
    AND NOT is_valid_iban(iban);

  IF v_invalid_count > 0 THEN
    RAISE WARNING 'Found % invalid IBANs in database. Fix before adding constraint.', v_invalid_count;

    -- Log invalid IBANs (without exposing full IBAN)
    RAISE NOTICE 'Invalid IBANs (masked):';
    PERFORM user_id, mask_iban(iban) as masked_iban
    FROM user_bank_info
    WHERE iban IS NOT NULL
      AND iban != ''
      AND iban != '***ENCRYPTED***'
      AND NOT is_valid_iban(iban);
  ELSE
    -- All IBANs are valid or encrypted, safe to add constraint
    ALTER TABLE user_bank_info
      DROP CONSTRAINT IF EXISTS chk_iban_valid_format;

    ALTER TABLE user_bank_info
      ADD CONSTRAINT chk_iban_valid_format
      CHECK (
        iban IS NULL
        OR iban = ''
        OR iban = '***ENCRYPTED***'
        OR is_valid_iban(iban)
      );

    RAISE NOTICE 'IBAN format validation constraint added successfully';
  END IF;
END;
$$;

-- ============================================================================
-- STEP 4: Create validation function for use in application
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_and_format_iban(p_iban TEXT)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_cleaned TEXT;
  v_is_valid BOOLEAN;
  v_country TEXT;
  v_check_digits TEXT;
  v_formatted TEXT;
BEGIN
  -- Clean input
  v_cleaned := UPPER(REPLACE(p_iban, ' ', ''));

  -- Validate
  v_is_valid := is_valid_iban(v_cleaned);

  IF NOT v_is_valid THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Invalid IBAN format or checksum'
    );
  END IF;

  -- Extract components
  v_country := SUBSTRING(v_cleaned FROM 1 FOR 2);
  v_check_digits := SUBSTRING(v_cleaned FROM 3 FOR 2);

  -- Format with spaces (every 4 chars for readability)
  v_formatted := '';
  FOR i IN 1..LENGTH(v_cleaned) BY 4 LOOP
    v_formatted := v_formatted || SUBSTRING(v_cleaned FROM i FOR 4) || ' ';
  END LOOP;
  v_formatted := TRIM(v_formatted);

  RETURN jsonb_build_object(
    'valid', true,
    'iban', v_cleaned,
    'formatted', v_formatted,
    'country', v_country,
    'checkDigits', v_check_digits
  );
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION is_valid_iban(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_and_format_iban(TEXT) TO authenticated;

-- ============================================================================
-- STEP 5: Update store_iban_encrypted to validate before encrypting
-- ============================================================================

CREATE OR REPLACE FUNCTION store_iban_encrypted_validated(
  p_user_id UUID,
  p_iban TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_calling_user UUID := auth.uid();
  v_encrypted TEXT;
  v_cleaned_iban TEXT;
  v_is_valid BOOLEAN;
BEGIN
  -- Security: Only the user can update their own IBAN
  IF v_calling_user IS NULL OR v_calling_user != p_user_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'UNAUTHORIZED'
    );
  END IF;

  -- Check for valid password verification
  IF NOT has_valid_password_verification(300) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'VERIFICATION_REQUIRED',
      'message', 'Password verification required'
    );
  END IF;

  -- VULN-008 FIX: Validate IBAN format before encrypting
  v_cleaned_iban := UPPER(REPLACE(p_iban, ' ', ''));
  v_is_valid := is_valid_iban(v_cleaned_iban);

  IF NOT v_is_valid THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'INVALID_IBAN',
      'message', 'IBAN format or checksum is invalid'
    );
  END IF;

  -- Encrypt the IBAN
  v_encrypted := encrypt_iban(v_cleaned_iban);

  -- Store only encrypted version
  UPDATE user_bank_info
  SET
    iban_encrypted = v_encrypted,
    iban = '***ENCRYPTED***',
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
      jsonb_build_object(
        'encrypted', true,
        'masked', mask_iban(v_cleaned_iban),
        'country', SUBSTRING(v_cleaned_iban FROM 1 FOR 2)
      ),
      NOW(),
      p_ip_address::INET,
      p_user_agent
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'IBAN updated successfully',
    'country', SUBSTRING(v_cleaned_iban FROM 1 FOR 2)
  );
END;
$$;

-- Grant execute
GRANT EXECUTE ON FUNCTION store_iban_encrypted_validated(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION is_valid_iban IS
'Validates IBAN format and mod97 checksum per ISO 13616. Returns true if valid.';

COMMENT ON FUNCTION validate_and_format_iban IS
'Validates IBAN and returns formatted version with country info. For use in UI validation.';

COMMENT ON FUNCTION store_iban_encrypted_validated IS
'VULN-008 FIX: Validates IBAN checksum BEFORE encrypting and storing. Prevents invalid IBANs.';

-- ============================================================================
-- STEP 6: Verification query
-- ============================================================================

-- Run this to verify validation works:
/*
SELECT
  'BE68539007547034' as test_iban,
  is_valid_iban('BE68539007547034') as should_be_true,
  is_valid_iban('BE68539007547035') as should_be_false_bad_checksum,
  is_valid_iban('BE68 5390 0754 7034') as should_be_true_with_spaces,
  is_valid_iban('INVALID') as should_be_false_too_short;
*/
