-- ============================================================================
-- ADD DEMO RESIDENTS TO PROPERTIES
-- ============================================================================
-- This script adds demo residents to coliving and shared properties
-- Run this in Supabase Dashboard > SQL Editor after creating property_members table
-- ============================================================================

-- Helper functions
CREATE OR REPLACE FUNCTION get_property_id_by_title(property_title TEXT)
RETURNS UUID AS $$
DECLARE
  prop_id UUID;
BEGIN
  SELECT id INTO prop_id FROM properties WHERE title = property_title;
  RETURN prop_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_demo_user_id(user_email TEXT)
RETURNS UUID AS $$
DECLARE
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
  RETURN user_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Property 3: Coliving Forest - Maison Communautaire (6 bedrooms)
-- Add 3 current residents
-- ============================================================================

-- Resident 1: Pierre Lecomte (Civil Engineer, 27 ans)
INSERT INTO property_members (property_id, user_id, role, status, move_in_date)
VALUES (
  get_property_id_by_title('Coliving Forest - Maison Communautaire'),
  get_demo_user_id('pierre.lecomte@demo.izzico.com'),
  'resident',
  'active',
  '2024-09-01'
) ON CONFLICT (property_id, user_id, status) DO NOTHING;

-- Resident 2: Laura Gonzalez (PhD Student, 26 ans)
INSERT INTO property_members (property_id, user_id, role, status, move_in_date)
VALUES (
  get_property_id_by_title('Coliving Forest - Maison Communautaire'),
  get_demo_user_id('laura.gonzalez@demo.izzico.com'),
  'resident',
  'active',
  '2024-10-01'
) ON CONFLICT (property_id, user_id, status) DO NOTHING;

-- Resident 3: Maxime Dubois (Software Developer, 25 ans)
INSERT INTO property_members (property_id, user_id, role, status, move_in_date)
VALUES (
  get_property_id_by_title('Coliving Forest - Maison Communautaire'),
  get_demo_user_id('maxime.dubois@demo.izzico.com'),
  'resident',
  'active',
  '2024-11-01'
) ON CONFLICT (property_id, user_id, status) DO NOTHING;

-- Cleanup helper functions
DROP FUNCTION IF EXISTS get_property_id_by_title(TEXT);
DROP FUNCTION IF EXISTS get_demo_user_id(TEXT);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Show all property members with basic details
SELECT
  p.title as property,
  up.first_name || ' ' || up.last_name as resident_name,
  pm.role,
  pm.status,
  pm.move_in_date
FROM property_members pm
JOIN properties p ON p.id = pm.property_id
JOIN user_profiles up ON up.user_id = pm.user_id
ORDER BY p.title, pm.move_in_date;

-- Summary by property
SELECT
  p.title as property,
  COUNT(pm.id) as total_residents,
  COUNT(CASE WHEN pm.status = 'active' THEN 1 END) as active_residents
FROM properties p
LEFT JOIN property_members pm ON pm.property_id = p.id
GROUP BY p.id, p.title
ORDER BY p.title;

-- Final summary
SELECT
  '✅ Demo Residents Added!' as status,
  COUNT(*) as total_memberships,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_memberships
FROM property_members;
