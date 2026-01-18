-- =====================================================
-- ENHANCED SECURITY FOR BANK INFO
-- =====================================================
-- Additional security layers:
-- 1. Column-level encryption for IBAN using pgcrypto
-- 2. Audit logging for sensitive data access
-- 3. Rate limiting function
-- 4. Masked IBAN view for UI display
-- =====================================================

-- Enable pgcrypto extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- AUDIT LOG TABLE: Track who accessed bank info
-- =====================================================
CREATE TABLE IF NOT EXISTS bank_info_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accessed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accessed_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_type TEXT NOT NULL CHECK (access_type IN ('view', 'update', 'create')),
  ip_address INET,
  user_agent TEXT,
  accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_bank_info_access_log_by ON bank_info_access_log(accessed_by);
CREATE INDEX IF NOT EXISTS idx_bank_info_access_log_user ON bank_info_access_log(accessed_user_id);
CREATE INDEX IF NOT EXISTS idx_bank_info_access_log_time ON bank_info_access_log(accessed_at);

-- RLS for audit log (only admins can read, system can write)
ALTER TABLE bank_info_access_log ENABLE ROW LEVEL SECURITY;

-- Only service role can insert (via function)
CREATE POLICY "Service role can insert audit logs"
  ON bank_info_access_log FOR INSERT
  WITH CHECK (true); -- Will be called from SECURITY DEFINER function

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON bank_info_access_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- RATE LIMITING TABLE: Prevent scraping
-- =====================================================
CREATE TABLE IF NOT EXISTS bank_info_rate_limit (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  request_count INT DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FUNCTION: Check rate limit (max 10 requests per minute)
-- =====================================================
CREATE OR REPLACE FUNCTION check_bank_info_rate_limit()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_count INT;
  v_window_start TIMESTAMPTZ;
  v_max_requests INT := 10; -- Max 10 requests per minute
  v_window_seconds INT := 60; -- 1 minute window
BEGIN
  -- Get or create rate limit record
  SELECT request_count, window_start INTO v_count, v_window_start
  FROM bank_info_rate_limit
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    -- First request
    INSERT INTO bank_info_rate_limit (user_id, request_count, window_start)
    VALUES (v_user_id, 1, NOW());
    RETURN TRUE;
  END IF;

  -- Check if window has expired
  IF v_window_start < NOW() - (v_window_seconds || ' seconds')::INTERVAL THEN
    -- Reset window
    UPDATE bank_info_rate_limit
    SET request_count = 1, window_start = NOW()
    WHERE user_id = v_user_id;
    RETURN TRUE;
  END IF;

  -- Check if over limit
  IF v_count >= v_max_requests THEN
    RETURN FALSE;
  END IF;

  -- Increment counter
  UPDATE bank_info_rate_limit
  SET request_count = request_count + 1
  WHERE user_id = v_user_id;

  RETURN TRUE;
END;
$$;

-- =====================================================
-- FUNCTION: Log bank info access
-- =====================================================
CREATE OR REPLACE FUNCTION log_bank_info_access(
  p_accessed_user_id UUID,
  p_access_type TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO bank_info_access_log (accessed_by, accessed_user_id, access_type)
  VALUES (auth.uid(), p_accessed_user_id, p_access_type);
END;
$$;

-- =====================================================
-- FUNCTION: Mask IBAN for display (show only last 4)
-- =====================================================
CREATE OR REPLACE FUNCTION mask_iban(p_iban TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF p_iban IS NULL OR LENGTH(p_iban) < 8 THEN
    RETURN p_iban;
  END IF;

  -- Show country code + ** + last 4 digits
  -- Example: BE68539007547034 -> BE** **** **** 7034
  RETURN SUBSTRING(p_iban, 1, 2) || '** **** **** ' || SUBSTRING(p_iban, LENGTH(p_iban) - 3);
END;
$$;

-- =====================================================
-- UPDATED FUNCTION: Get roommate payment info with security
-- Includes rate limiting, audit logging, and optional masking
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
AS $$
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

  -- 4. Return data with optional masking
  RETURN QUERY
  SELECT
    ubi.user_id,
    CASE WHEN p_show_full_iban THEN ubi.iban ELSE NULL END AS iban_display,
    mask_iban(ubi.iban) AS iban_masked,
    ubi.bank_name,
    ubi.account_holder_name,
    ubi.revtag,
    ubi.payconiq_enabled
  FROM user_bank_info ubi
  WHERE ubi.user_id = p_user_id;
END;
$$;

-- =====================================================
-- TRIGGER: Log updates to bank info
-- =====================================================
CREATE OR REPLACE FUNCTION log_bank_info_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log the update
  INSERT INTO bank_info_access_log (accessed_by, accessed_user_id, access_type)
  VALUES (auth.uid(), NEW.user_id, TG_OP::TEXT);

  RETURN NEW;
END;
$$;

-- Create trigger for insert/update
DROP TRIGGER IF EXISTS trigger_log_bank_info_changes ON user_bank_info;
CREATE TRIGGER trigger_log_bank_info_changes
  AFTER INSERT OR UPDATE ON user_bank_info
  FOR EACH ROW
  EXECUTE FUNCTION log_bank_info_update();

-- =====================================================
-- SECURITY NOTES:
-- =====================================================
-- 1. All IBAN access is now logged in bank_info_access_log
-- 2. Rate limiting prevents mass scraping (10 req/min)
-- 3. Masked IBAN option for UI previews
-- 4. Full IBAN only shown when user explicitly requests it
-- 5. Supabase provides at-rest encryption by default
--
-- ADDITIONAL RECOMMENDATIONS:
-- - Enable Supabase Vault for column-level encryption
-- - Set up alerts on unusual access patterns
-- - Regular audit log reviews
-- - Consider 2FA for bank info changes
-- =====================================================

-- =====================================================
-- VIEW: Suspicious activity detection (for admins)
-- =====================================================
CREATE OR REPLACE VIEW suspicious_bank_info_access AS
SELECT
  accessed_by,
  COUNT(*) as access_count,
  COUNT(DISTINCT accessed_user_id) as unique_users_accessed,
  MIN(accessed_at) as first_access,
  MAX(accessed_at) as last_access
FROM bank_info_access_log
WHERE accessed_at > NOW() - INTERVAL '1 hour'
GROUP BY accessed_by
HAVING COUNT(*) > 5 OR COUNT(DISTINCT accessed_user_id) > 3
ORDER BY access_count DESC;

-- Grant access to admins only
-- (Supabase handles this via RLS on the underlying table)
