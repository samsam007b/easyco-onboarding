-- ============================================================================
-- FIX SOCIABILITY_LEVEL TYPE MISMATCH
-- ============================================================================
-- Problem: Column was created as INTEGER but code expects TEXT values
-- Values: 'low', 'medium', 'high' (strings)
-- Error: "invalid input syntax for type integer: 'high'"
-- ============================================================================

BEGIN;

-- 1. Change column type from INTEGER to TEXT
ALTER TABLE user_profiles
ALTER COLUMN sociability_level TYPE TEXT
USING CASE
  WHEN sociability_level IS NULL THEN NULL
  WHEN sociability_level::INTEGER = 1 THEN 'low'
  WHEN sociability_level::INTEGER = 2 THEN 'medium'
  WHEN sociability_level::INTEGER = 3 THEN 'high'
  ELSE sociability_level::TEXT
END;

-- 2. Add constraint to ensure only valid values
ALTER TABLE user_profiles
ADD CONSTRAINT sociability_level_check
CHECK (sociability_level IN ('low', 'medium', 'high') OR sociability_level IS NULL);

-- 3. Comment for documentation
COMMENT ON COLUMN user_profiles.sociability_level IS
'Social activity level: low (quiet/introverted), medium (balanced), high (very social/extroverted)';

COMMIT;

-- Verification query
DO $$
BEGIN
  RAISE NOTICE '✅ sociability_level type changed to TEXT with constraint';
  RAISE NOTICE '   Allowed values: low, medium, high';
END $$;
