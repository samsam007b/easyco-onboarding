-- ============================================================================
-- COMPLETE SEED: Create Auth Users + Profiles + Properties
-- ============================================================================
-- This script creates everything in one go, bypassing cache issues
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================================

-- ============================================================================
-- STEP 1: Create Auth Users (if they don't exist)
-- ============================================================================
-- Note: We use raw SQL to insert into auth.users with proper password hashing

-- First, let's create a helper function to create auth users if they don't exist
CREATE OR REPLACE FUNCTION create_demo_user(
  user_email TEXT,
  user_password TEXT DEFAULT 'Demo123!'
) RETURNS UUID AS $$
DECLARE
  existing_user_id UUID;
  new_user_id UUID;
  encrypted_pw TEXT;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_user_id FROM auth.users WHERE email = user_email;

  IF existing_user_id IS NOT NULL THEN
    RETURN existing_user_id;
  END IF;

  -- Generate a new UUID for the user
  new_user_id := gen_random_uuid();

  -- Hash the password using crypt (Supabase uses bcrypt)
  encrypted_pw := crypt(user_password, gen_salt('bf'));

  -- Insert into auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    user_email,
    encrypted_pw,
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    false,
    'authenticated',
    'authenticated'
  );

  -- Also insert into auth.identities
  INSERT INTO auth.identities (
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    new_user_id::text,
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', user_email),
    'email',
    NOW(),
    NOW(),
    NOW()
  );

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 2: Create all demo users
-- ============================================================================

DO $$
DECLARE
  sophie_id UUID;
  ahmed_id UUID;
  emma_id UUID;
  lucas_id UUID;
  maria_id UUID;
  jeanmarc_id UUID;
  isabelle_id UUID;
  thomas_id UUID;
  sophie_v_id UUID;
  pierre_id UUID;
  laura_id UUID;
  maxime_id UUID;
BEGIN
  RAISE NOTICE '👥 Creating Auth users...';

  -- Searchers
  sophie_id := create_demo_user('sophie.laurent@demo.izzico.com');
  ahmed_id := create_demo_user('ahmed.elmansouri@demo.izzico.com');
  emma_id := create_demo_user('emma.vanderberg@demo.izzico.com');
  lucas_id := create_demo_user('lucas.dubois@demo.izzico.com');
  maria_id := create_demo_user('maria.santos@demo.izzico.com');

  -- Owners
  jeanmarc_id := create_demo_user('jeanmarc.petit@demo.izzico.com');
  isabelle_id := create_demo_user('isabelle.moreau@demo.izzico.com');
  thomas_id := create_demo_user('thomas.janssens@demo.izzico.com');
  sophie_v_id := create_demo_user('sophie.vermeulen@demo.izzico.com');

  -- Residents
  pierre_id := create_demo_user('pierre.lecomte@demo.izzico.com');
  laura_id := create_demo_user('laura.gonzalez@demo.izzico.com');
  maxime_id := create_demo_user('maxime.dubois@demo.izzico.com');

  RAISE NOTICE '✅ Auth users created';

  -- ============================================================================
  -- STEP 3: Create Searcher Profiles
  -- ============================================================================

  RAISE NOTICE '📝 Creating searcher profiles...';

  INSERT INTO user_profiles (
    user_id, user_type, first_name, last_name, bio, phone_number,
    nationality, occupation_status, field_of_study_or_work,
    budget_min, budget_max, preferred_districts, preferred_move_in_date,
    is_smoker, has_pets, cleanliness_preference, sociability_level
  ) VALUES
  (sophie_id, 'searcher', 'Sophie', 'Laurent',
   'Marketing Manager de 29 ans, sociable et organisée, cherche colocation sympa proche du centre.',
   '+32 485 12 34 56', 'French', 'employed', 'Marketing Manager',
   600, 900, ARRAY['Ixelles', 'Saint-Gilles', 'Etterbeek'], '2024-12-01',
   false, false, 'tidy', 'high'),

  (ahmed_id, 'searcher', 'Ahmed', 'El Mansouri',
   'Étudiant ULB en économie, 23 ans, calme et studieux, cherche logement proche université.',
   '+32 485 23 45 67', 'Moroccan', 'student', 'Student',
   400, 600, ARRAY['Ixelles', 'Schaerbeek', 'Etterbeek'], '2025-01-15',
   false, false, 'moderate', 'medium'),

  (emma_id, 'searcher', 'Emma', 'Van Der Berg',
   'Designer freelance, 36 ans, créative et indépendante, cherche espace lumineux avec bureau.',
   '+32 485 34 56 78', 'Belgian', 'self-employed', 'Designer',
   700, 1000, ARRAY['Forest', 'Uccle', 'Saint-Gilles'], '2024-11-15',
   false, true, 'tidy', 'medium'),

  (lucas_id, 'searcher', 'Lucas', 'Dubois',
   'Comptable en couple, 32 ans, calme et organisé, cherche appartement spacieux quartier résidentiel.',
   '+32 485 45 67 89', 'Belgian', 'employed', 'Accountant',
   900, 1300, ARRAY['Woluwe-Saint-Pierre', 'Etterbeek', 'Auderghem'], '2025-02-01',
   false, false, 'spotless', 'low'),

  (maria_id, 'searcher', 'Maria', 'Santos',
   'EU Policy Advisor, 34 ans, internationale et sociable, cherche colocation multiculturelle.',
   '+32 485 56 78 90', 'Portuguese', 'employed', 'Policy Advisor',
   750, 1100, ARRAY['Centre', 'Ixelles', 'Etterbeek'], '2024-12-15',
   false, false, 'tidy', 'high')
  ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    bio = EXCLUDED.bio;

  -- ============================================================================
  -- STEP 4: Create Owner Profiles
  -- ============================================================================

  RAISE NOTICE '🏠 Creating owner profiles...';

  INSERT INTO user_profiles (
    user_id, user_type, first_name, last_name, bio, phone_number, has_property
  ) VALUES
  (jeanmarc_id, 'owner', 'Jean-Marc', 'Petit',
   'Propriétaire depuis 5 ans, bienveillant et réactif. Propose appartement rénové à Ixelles.',
   '+32 486 12 34 56', true),

  (isabelle_id, 'owner', 'Isabelle', 'Moreau',
   'Investisseuse immobilière depuis 15 ans, gère plusieurs propriétés à Bruxelles avec professionnalisme.',
   '+32 486 23 45 67', true),

  (thomas_id, 'owner', 'Thomas', 'Janssens',
   'Premier investissement locatif, studio étudiant à Schaerbeek. Jeune propriétaire motivé.',
   '+32 486 34 56 78', true),

  (sophie_v_id, 'owner', 'Sophie', 'Vermeulen',
   'Spécialiste coliving depuis 8 ans, propose maison communautaire avec jardin à Forest.',
   '+32 486 45 67 89', true)
  ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    bio = EXCLUDED.bio;

  -- ============================================================================
  -- STEP 5: Create Resident Profiles
  -- ============================================================================

  RAISE NOTICE '👥 Creating resident profiles...';

  INSERT INTO user_profiles (
    user_id, user_type, first_name, last_name, bio, phone_number,
    nationality, occupation_status, field_of_study_or_work,
    is_smoker, has_pets, cleanliness_preference, sociability_level
  ) VALUES
  (pierre_id, 'resident', 'Pierre', 'Lecomte',
   'Ingénieur civil de 27 ans, calme et rangé, apprécie vie en colocation équilibrée.',
   '+32 487 12 34 56', 'Belgian', 'employed', 'Civil Engineer',
   false, false, 'tidy', 'medium'),

  (laura_id, 'resident', 'Laura', 'Gonzalez',
   'Doctorante en biologie, 26 ans, studieuse et respectueuse, cherche environnement calme.',
   '+32 487 23 45 67', 'Spanish', 'student', 'PhD Student',
   false, false, 'spotless', 'low'),

  (maxime_id, 'resident', 'Maxime', 'Dubois',
   'Développeur en startup, 25 ans, sociable et tech-savvy, aime les colocations dynamiques.',
   '+32 487 34 56 78', 'Belgian', 'employed', 'Software Developer',
   false, false, 'moderate', 'high')
  ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    bio = EXCLUDED.bio;

  -- ============================================================================
  -- STEP 6: Create Properties
  -- ============================================================================

  RAISE NOTICE '🏘️  Creating properties...';

  INSERT INTO properties (
    owner_id, title, description, property_type,
    address, city, neighborhood, postal_code, country, latitude, longitude,
    bedrooms, bathrooms, surface_area, floor_number, furnished,
    monthly_rent, charges, deposit, available_from, minimum_stay_months,
    amenities, smoking_allowed, pets_allowed, couples_allowed,
    images, main_image, status, is_available
  ) VALUES
  (jeanmarc_id,
   'Appartement 2 Chambres - Ixelles Flagey',
   'Magnifique appartement de 85m² au cœur du quartier Flagey. Rénové avec goût, parquet massif, cuisine équipée, grande luminosité. Proche trams 81, bus, commerces et vie culturelle animée.',
   'apartment',
   'Avenue de la Couronne 234', 'Ixelles', 'Flagey', '1050', 'Belgium', 50.8272, 4.3719,
   2, 1, 85, 2, true,
   1250, 150, 2500, '2024-12-01', 6,
   '["wifi", "elevator", "balcony", "washing_machine", "dishwasher", "heating", "furnished"]'::jsonb,
   false, false, true,
   ARRAY['https://images.unsplash.com/photo-1502672260066-6bc36a8baf37?w=800', 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800'],
   'https://images.unsplash.com/photo-1502672260066-6bc36a8baf37?w=800',
   'published', true),

  (thomas_id,
   'Studio Schaerbeek - Quartier Diamant',
   'Studio fonctionnel de 35m² idéal étudiant. Meublé et équipé, kitchenette, salle de bain, Wi-Fi inclus. Proche métro Diamant, ULB, commerces. Quartier multiculturel et vivant.',
   'studio',
   'Rue Josaphat 145', 'Schaerbeek', 'Diamant', '1030', 'Belgium', 50.8571, 4.3836,
   0, 1, 35, 3, true,
   650, 80, 1300, '2025-01-01', 3,
   '["wifi", "heating", "furnished"]'::jsonb,
   false, false, false,
   ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
   'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
   'published', true),

  (sophie_v_id,
   'Coliving Forest - Maison Communautaire',
   'Magnifique maison de maître de 280m² transformée en coliving. 6 chambres privées avec espaces communs partagés : salon, cuisine, jardin 200m². Ambiance internationale et conviviale.',
   'coliving',
   'Avenue Besme 89', 'Forest', 'Altitude 100', '1190', 'Belgium', 50.8143, 4.3142,
   6, 3, 280, 0, true,
   695, 200, 1390, '2024-11-15', 3,
   '["wifi", "garden", "laundry", "common_areas", "heating", "furnished"]'::jsonb,
   false, true, false,
   ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'],
   'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
   'published', true),

  (isabelle_id,
   'Appartement 3 Chambres - Woluwe Standing',
   'Spacieux 3 chambres de 120m² dans résidence sécurisée. Haut standing, terrasse 15m², parking, salle de gym. Quartier résidentiel calme proche Parc de Woluwe et transports.',
   'apartment',
   'Avenue de Tervueren 412', 'Woluwe-Saint-Pierre', 'Montgomery', '1150', 'Belgium', 50.8429, 4.4089,
   3, 2, 120, 4, true,
   1800, 250, 3600, '2025-02-01', 12,
   '["wifi", "elevator", "parking", "gym", "balcony", "heating", "dishwasher", "washing_machine", "furnished"]'::jsonb,
   false, false, true,
   ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
   'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
   'published', true),

  (isabelle_id,
   'Maison 4 Chambres - Saint-Gilles Parvis',
   'Belle maison bruxelloise typique de 150m² avec jardin 80m². 4 chambres, 2 SDB, parquet d''origine, cheminée. Quartier Parvis de Saint-Gilles, artistique et vivant.',
   'house',
   'Rue de la Victoire 78', 'Saint-Gilles', 'Parvis', '1060', 'Belgium', 50.8283, 4.3456,
   4, 2, 150, 0, false,
   2100, 200, 4200, '2024-12-15', 12,
   '["wifi", "garden", "laundry", "dishwasher", "washing_machine", "heating", "balcony"]'::jsonb,
   false, false, true,
   ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'],
   'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
   'published', true)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '✅ Properties created';

END $$;

-- Cleanup
DROP FUNCTION IF EXISTS create_demo_user(TEXT, TEXT);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check Auth users
SELECT
  '🔐 Auth Users' as type,
  COUNT(*) as count
FROM auth.users
WHERE email LIKE '%@demo.izzico.com';

-- Check profiles by type
SELECT
  user_type,
  COUNT(*) as count,
  string_agg(first_name || ' ' || last_name, ', ') as names
FROM user_profiles
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@demo.izzico.com'
)
GROUP BY user_type
ORDER BY user_type;

-- Check properties
SELECT
  '🏠 ' || p.title as property,
  '€' || p.monthly_rent as rent,
  p.city,
  up.first_name || ' ' || up.last_name as owner
FROM properties p
JOIN user_profiles up ON p.owner_id = up.user_id
WHERE up.user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@demo.izzico.com'
)
ORDER BY p.monthly_rent;

-- Final summary
SELECT '✅ SEED COMPLETE!' as status,
  (SELECT COUNT(*) FROM auth.users WHERE email LIKE '%@demo.izzico.com') as auth_users,
  (SELECT COUNT(*) FROM user_profiles WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@demo.izzico.com')) as profiles,
  (SELECT COUNT(*) FROM properties WHERE owner_id IN (SELECT user_id FROM user_profiles WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@demo.izzico.com'))) as properties;
