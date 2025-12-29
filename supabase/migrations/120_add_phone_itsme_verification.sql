-- =====================================================
-- PHONE & ITSME VERIFICATION ENHANCEMENT
-- =====================================================
-- Adds fields for:
-- 1. Phone verification timestamps
-- 2. ITSME (Belgian Digital Identity) KYC integration
-- =====================================================

-- =====================================================
-- 1. ADD PHONE VERIFICATION TIMESTAMP
-- =====================================================

ALTER TABLE public.user_verifications
  ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ;

-- =====================================================
-- 2. ADD ITSME KYC FIELDS
-- =====================================================

-- ITSME verification status
ALTER TABLE public.user_verifications
  ADD COLUMN IF NOT EXISTS itsme_verified BOOLEAN DEFAULT FALSE;

-- When ITSME verification was completed
ALTER TABLE public.user_verifications
  ADD COLUMN IF NOT EXISTS itsme_verified_at TIMESTAMPTZ;

-- ITSME unique subject identifier (stable across sessions)
ALTER TABLE public.user_verifications
  ADD COLUMN IF NOT EXISTS itsme_sub TEXT;

-- Verified identity claims from ITSME (JSON)
-- Contains: given_name, family_name, birthdate, nationality, etc.
ALTER TABLE public.user_verifications
  ADD COLUMN IF NOT EXISTS itsme_data JSONB DEFAULT '{}'::jsonb;

-- Belgian National Register Number (hashed for security)
-- Only store hash, never the raw NRN
ALTER TABLE public.user_verifications
  ADD COLUMN IF NOT EXISTS national_register_number_hash TEXT;

-- ITSME verification level achieved
-- 'none' = not verified
-- 'identification' = identity verified (name, DOB, nationality)
-- 'authentication' = login only (no identity data)
-- 'signature' = qualified electronic signature capable
ALTER TABLE public.user_verifications
  ADD COLUMN IF NOT EXISTS itsme_verification_level TEXT DEFAULT 'none';

-- Add CHECK constraint for itsme_verification_level
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_verifications_itsme_level_check'
  ) THEN
    ALTER TABLE public.user_verifications
      ADD CONSTRAINT user_verifications_itsme_level_check
      CHECK (itsme_verification_level IN ('none', 'identification', 'authentication', 'signature'));
  END IF;
END $$;

-- =====================================================
-- 3. UPDATE KYC STATUS CONSTRAINT
-- =====================================================

-- Drop existing constraint and recreate with new values
ALTER TABLE public.user_verifications
  DROP CONSTRAINT IF EXISTS user_verifications_kyc_status_check;

ALTER TABLE public.user_verifications
  ADD CONSTRAINT user_verifications_kyc_status_check
  CHECK (kyc_status IN ('pending', 'verified', 'rejected', 'expired', 'itsme_verified', 'itsme_pending'));

-- =====================================================
-- 4. CREATE INDEXES
-- =====================================================

-- Index for ITSME verified users (partial index for efficiency)
CREATE INDEX IF NOT EXISTS idx_user_verifications_itsme_verified
  ON public.user_verifications(itsme_verified)
  WHERE itsme_verified = TRUE;

-- Index for ITSME subject lookups (for linking returning users)
CREATE INDEX IF NOT EXISTS idx_user_verifications_itsme_sub
  ON public.user_verifications(itsme_sub)
  WHERE itsme_sub IS NOT NULL;

-- Composite index for verification dashboard queries
CREATE INDEX IF NOT EXISTS idx_user_verifications_phone_itsme
  ON public.user_verifications(phone_verified, itsme_verified);

-- =====================================================
-- 5. AUDIT TABLE FOR VERIFICATION CHANGES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.verification_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- What changed
  verification_type TEXT NOT NULL CHECK (verification_type IN ('phone', 'email', 'itsme', 'document')),
  action TEXT NOT NULL CHECK (action IN ('initiated', 'completed', 'failed', 'expired', 'revoked')),

  -- Old and new status
  previous_status BOOLEAN,
  new_status BOOLEAN,

  -- Additional context
  metadata JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,

  -- Request info
  ip_address INET,
  user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user audit history
CREATE INDEX IF NOT EXISTS idx_verification_audit_user
  ON public.verification_audit_log(user_id, created_at DESC);

-- Index for verification type queries
CREATE INDEX IF NOT EXISTS idx_verification_audit_type
  ON public.verification_audit_log(verification_type, action);

-- Enable RLS
ALTER TABLE public.verification_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can only see their own audit logs
DROP POLICY IF EXISTS verification_audit_select_own ON public.verification_audit_log;
CREATE POLICY verification_audit_select_own ON public.verification_audit_log
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can insert audit logs
DROP POLICY IF EXISTS verification_audit_insert_service ON public.verification_audit_log;
CREATE POLICY verification_audit_insert_service ON public.verification_audit_log
  FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Admins can view all audit logs
DROP POLICY IF EXISTS verification_audit_admin_all ON public.verification_audit_log;
CREATE POLICY verification_audit_admin_all ON public.verification_audit_log
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

-- =====================================================
-- 6. FUNCTION TO LOG VERIFICATION CHANGES
-- =====================================================

CREATE OR REPLACE FUNCTION log_verification_change(
  p_user_id UUID,
  p_verification_type TEXT,
  p_action TEXT,
  p_previous_status BOOLEAN DEFAULT NULL,
  p_new_status BOOLEAN DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_error_message TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  INSERT INTO public.verification_audit_log (
    user_id,
    verification_type,
    action,
    previous_status,
    new_status,
    metadata,
    error_message,
    ip_address,
    user_agent
  ) VALUES (
    p_user_id,
    p_verification_type,
    p_action,
    p_previous_status,
    p_new_status,
    p_metadata,
    p_error_message,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$;

-- =====================================================
-- 7. COMMENTS
-- =====================================================

COMMENT ON COLUMN public.user_verifications.itsme_verified IS 'Whether user completed ITSME identity verification';
COMMENT ON COLUMN public.user_verifications.itsme_sub IS 'ITSME unique subject identifier (stable across sessions)';
COMMENT ON COLUMN public.user_verifications.itsme_data IS 'Verified identity claims from ITSME (JSON)';
COMMENT ON COLUMN public.user_verifications.national_register_number_hash IS 'SHA-256 hash of Belgian NRN (never store raw)';
COMMENT ON COLUMN public.user_verifications.itsme_verification_level IS 'Level of ITSME verification: none, identification, authentication, signature';
COMMENT ON TABLE public.verification_audit_log IS 'Audit trail for all verification status changes';
