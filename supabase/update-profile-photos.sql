-- ============================================================================
-- UPDATE PROFILE PHOTOS - Real diverse portraits from Unsplash
-- ============================================================================
-- This script updates all demo user profiles with realistic profile photos
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================================

-- Helper function to get user_id by email
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
-- SEARCHER PROFILES (5)
-- ============================================================================

-- 1. Sophie Laurent - French Marketing Manager, 29 ans, sociable
UPDATE user_profiles
SET profile_photo_url = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80'
WHERE user_id = get_demo_user_id('sophie.laurent@demo.izzico.com');

-- 2. Ahmed El Mansouri - Moroccan Student, 23 ans, studieux
UPDATE user_profiles
SET profile_photo_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80'
WHERE user_id = get_demo_user_id('ahmed.elmansouri@demo.izzico.com');

-- 3. Emma Van Der Berg - Belgian Designer, 36 ans, créative
UPDATE user_profiles
SET profile_photo_url = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80'
WHERE user_id = get_demo_user_id('emma.vanderberg@demo.izzico.com');

-- 4. Lucas Dubois - Belgian Accountant, 32 ans, professionnel
UPDATE user_profiles
SET profile_photo_url = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80'
WHERE user_id = get_demo_user_id('lucas.dubois@demo.izzico.com');

-- 5. Maria Santos - Portuguese Policy Advisor, 34 ans, internationale
UPDATE user_profiles
SET profile_photo_url = 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&q=80'
WHERE user_id = get_demo_user_id('maria.santos@demo.izzico.com');

-- ============================================================================
-- OWNER PROFILES (4)
-- ============================================================================

-- 6. Jean-Marc Petit - Experienced landlord, 50s, bienveillant
UPDATE user_profiles
SET profile_photo_url = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80'
WHERE user_id = get_demo_user_id('jeanmarc.petit@demo.izzico.com');

-- 7. Isabelle Moreau - Professional investor, 40s, expérimentée
UPDATE user_profiles
SET profile_photo_url = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80'
WHERE user_id = get_demo_user_id('isabelle.moreau@demo.izzico.com');

-- 8. Thomas Janssens - Young landlord, 30s, premier investissement
UPDATE user_profiles
SET profile_photo_url = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&q=80'
WHERE user_id = get_demo_user_id('thomas.janssens@demo.izzico.com');

-- 9. Sophie Vermeulen - Coliving specialist, 35-40 ans
UPDATE user_profiles
SET profile_photo_url = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&q=80'
WHERE user_id = get_demo_user_id('sophie.vermeulen@demo.izzico.com');

-- ============================================================================
-- RESIDENT PROFILES (3)
-- ============================================================================

-- 10. Pierre Lecomte - Civil Engineer, 27 ans, calme
UPDATE user_profiles
SET profile_photo_url = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80'
WHERE user_id = get_demo_user_id('pierre.lecomte@demo.izzico.com');

-- 11. Laura Gonzalez - PhD Student, 26 ans, studieuse
UPDATE user_profiles
SET profile_photo_url = 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&q=80'
WHERE user_id = get_demo_user_id('laura.gonzalez@demo.izzico.com');

-- 12. Maxime Dubois - Software Developer, 25 ans, tech-savvy
UPDATE user_profiles
SET profile_photo_url = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&q=80'
WHERE user_id = get_demo_user_id('maxime.dubois@demo.izzico.com');

-- Cleanup
DROP FUNCTION IF EXISTS get_demo_user_id(TEXT);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT
  first_name || ' ' || last_name as name,
  user_type,
  nationality,
  CASE
    WHEN profile_photo_url IS NOT NULL THEN '✅ Set'
    ELSE '❌ Missing'
  END as photo_status,
  profile_photo_url
FROM user_profiles
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@demo.izzico.com'
)
ORDER BY
  CASE user_type
    WHEN 'searcher' THEN 1
    WHEN 'owner' THEN 2
    WHEN 'resident' THEN 3
  END,
  first_name;

-- Count by type
SELECT
  user_type,
  COUNT(*) as total,
  COUNT(profile_photo_url) as with_photo,
  COUNT(*) - COUNT(profile_photo_url) as missing_photo
FROM user_profiles
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@demo.izzico.com'
)
GROUP BY user_type
ORDER BY user_type;

-- Final summary
SELECT
  '✅ Profile Photos Updated!' as status,
  COUNT(*) as total_users,
  COUNT(profile_photo_url) as users_with_photos,
  ROUND(COUNT(profile_photo_url)::numeric / COUNT(*)::numeric * 100, 1) || '%' as completion_rate
FROM user_profiles
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@demo.izzico.com'
);
