-- Fix RLS policy for anonymous users to view published properties
-- This ensures the browse page works for non-authenticated users
-- Date: 2025-11-21

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can view published properties" ON public.properties;

-- Recreate policy with explicit check
CREATE POLICY "Anyone can view published properties"
  ON public.properties
  FOR SELECT
  USING (
    status = 'published' AND is_available = true
  );

-- Verify RLS is enabled
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Add comment
COMMENT ON POLICY "Anyone can view published properties" ON public.properties IS
  'Allows anonymous and authenticated users to view properties that are published and available';
