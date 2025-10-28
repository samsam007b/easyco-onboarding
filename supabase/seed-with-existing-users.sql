-- ============================================================================
-- SEED DATA FOR EASYCO - For Existing Auth Users
-- ============================================================================
-- This script assumes Auth users already exist with @demo.easyco.com emails
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================================

-- Step 1: Get user IDs (for reference - you'll need to replace these)
-- Run this first to see the user IDs:
-- SELECT id, email FROM auth.users WHERE email LIKE '%@demo.easyco.com' ORDER BY email;

-- Step 2: Replace these variables with actual user IDs from Step 1
-- OR use the dynamic approach below

-- ============================================================================
-- DYNAMIC APPROACH: Create profiles using email lookup
-- ============================================================================

-- First, let's create a temporary function to get user_id by email
CREATE OR REPLACE FUNCTION get_user_id_by_email(user_email TEXT)
RETURNS UUID AS $$
DECLARE
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = user_email;
  RETURN user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INSERT SEARCHER PROFILES (5)
-- ============================================================================

INSERT INTO user_profiles (
  user_id, first_name, last_name, user_type, profile_status, has_property,
  bio, phone, nationality, occupation,
  budget_min, budget_max, preferred_cities, move_in_date,
  smoking, pets, cleanliness_level, social_level, searcher_status
) VALUES
-- Sophie Laurent
(
  get_user_id_by_email('sophie.laurent@demo.easyco.com'),
  'Sophie', 'Laurent', 'searcher', 'complete', false,
  'Marketing Manager de 29 ans, sociable et organisée, cherche colocation sympa proche du centre.',
  '+32 485 12 34 56', 'French', 'Marketing Manager',
  600, 900, ARRAY['Ixelles', 'Saint-Gilles', 'Etterbeek'], '2024-12-01',
  false, false, 8, 7, 'searching'
),

-- Ahmed El Mansouri
(
  get_user_id_by_email('ahmed.elmansouri@demo.easyco.com'),
  'Ahmed', 'El Mansouri', 'searcher', 'complete', false,
  'Étudiant ULB en économie, 23 ans, calme et studieux, cherche logement proche université.',
  '+32 485 23 45 67', 'Moroccan', 'Student',
  400, 600, ARRAY['Ixelles', 'Schaerbeek', 'Etterbeek'], '2025-01-15',
  false, false, 7, 5, 'searching'
),

-- Emma Van Der Berg
(
  get_user_id_by_email('emma.vanderberg@demo.easyco.com'),
  'Emma', 'Van Der Berg', 'searcher', 'complete', false,
  'Designer freelance, 36 ans, créative et indépendante, cherche espace lumineux avec bureau.',
  '+32 485 34 56 78', 'Belgian', 'Designer',
  700, 1000, ARRAY['Forest', 'Uccle', 'Saint-Gilles'], '2024-11-15',
  false, true, 8, 6, 'searching'
),

-- Lucas Dubois
(
  get_user_id_by_email('lucas.dubois@demo.easyco.com'),
  'Lucas', 'Dubois', 'searcher', 'complete', false,
  'Comptable en couple, 32 ans, calme et organisé, cherche appartement spacieux quartier résidentiel.',
  '+32 485 45 67 89', 'Belgian', 'Accountant',
  900, 1300, ARRAY['Woluwe-Saint-Pierre', 'Etterbeek', 'Auderghem'], '2025-02-01',
  false, false, 9, 4, 'searching'
),

-- Maria Santos
(
  get_user_id_by_email('maria.santos@demo.easyco.com'),
  'Maria', 'Santos', 'searcher', 'complete', false,
  'EU Policy Advisor, 34 ans, internationale et sociable, cherche colocation multiculturelle.',
  '+32 485 56 78 90', 'Portuguese', 'Policy Advisor',
  750, 1100, ARRAY['Centre', 'Ixelles', 'Etterbeek'], '2024-12-15',
  false, false, 8, 8, 'searching'
)
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  bio = EXCLUDED.bio,
  budget_min = EXCLUDED.budget_min,
  budget_max = EXCLUDED.budget_max,
  preferred_cities = EXCLUDED.preferred_cities;

-- ============================================================================
-- INSERT OWNER PROFILES (4)
-- ============================================================================

INSERT INTO user_profiles (
  user_id, first_name, last_name, user_type, profile_status, has_property,
  bio, phone, hosting_experience, owner_type
) VALUES
-- Jean-Marc Petit
(
  get_user_id_by_email('jeanmarc.petit@demo.easyco.com'),
  'Jean-Marc', 'Petit', 'owner', 'complete', true,
  'Propriétaire depuis 5 ans, bienveillant et réactif. Propose appartement rénové à Ixelles.',
  '+32 486 12 34 56', 'experienced', 'individual'
),

-- Isabelle Moreau
(
  get_user_id_by_email('isabelle.moreau@demo.easyco.com'),
  'Isabelle', 'Moreau', 'owner', 'complete', true,
  'Investisseuse immobilière depuis 15 ans, gère plusieurs propriétés à Bruxelles avec professionnalisme.',
  '+32 486 23 45 67', 'expert', 'professional'
),

-- Thomas Janssens
(
  get_user_id_by_email('thomas.janssens@demo.easyco.com'),
  'Thomas', 'Janssens', 'owner', 'complete', true,
  'Premier investissement locatif, studio étudiant à Schaerbeek. Jeune propriétaire motivé.',
  '+32 486 34 56 78', 'beginner', 'individual'
),

-- Sophie Vermeulen
(
  get_user_id_by_email('sophie.vermeulen@demo.easyco.com'),
  'Sophie', 'Vermeulen', 'owner', 'complete', true,
  'Spécialiste coliving depuis 8 ans, propose maison communautaire avec jardin à Forest.',
  '+32 486 45 67 89', 'experienced', 'coliving'
)
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  bio = EXCLUDED.bio,
  hosting_experience = EXCLUDED.hosting_experience;

-- ============================================================================
-- INSERT RESIDENT PROFILES (3)
-- ============================================================================

INSERT INTO user_profiles (
  user_id, first_name, last_name, user_type, profile_status, has_property,
  bio, phone, nationality, occupation,
  smoking, pets, cleanliness_level, social_level
) VALUES
-- Pierre Lecomte
(
  get_user_id_by_email('pierre.lecomte@demo.easyco.com'),
  'Pierre', 'Lecomte', 'resident', 'complete', false,
  'Ingénieur civil de 27 ans, calme et rangé, apprécie vie en colocation équilibrée.',
  '+32 487 12 34 56', 'Belgian', 'Civil Engineer',
  false, false, 8, 6
),

-- Laura Gonzalez
(
  get_user_id_by_email('laura.gonzalez@demo.easyco.com'),
  'Laura', 'Gonzalez', 'resident', 'complete', false,
  'Doctorante en biologie, 26 ans, studieuse et respectueuse, cherche environnement calme.',
  '+32 487 23 45 67', 'Spanish', 'PhD Student',
  false, false, 9, 4
),

-- Maxime Dubois
(
  get_user_id_by_email('maxime.dubois@demo.easyco.com'),
  'Maxime', 'Dubois', 'resident', 'complete', false,
  'Développeur en startup, 25 ans, sociable et tech-savvy, aime les colocations dynamiques.',
  '+32 487 34 56 78', 'Belgian', 'Software Developer',
  false, false, 7, 9
)
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  bio = EXCLUDED.bio,
  cleanliness_level = EXCLUDED.cleanliness_level,
  social_level = EXCLUDED.social_level;

-- ============================================================================
-- INSERT PROPERTIES (5)
-- ============================================================================

INSERT INTO properties (
  owner_id, title, description, property_type,
  address, city, neighborhood, postal_code, country, latitude, longitude,
  bedrooms, bathrooms, surface_area, floor_number, furnished,
  monthly_rent, charges, deposit, available_from, minimum_stay_months,
  amenities, smoking_allowed, pets_allowed, couples_allowed,
  images, main_image, status, is_available
) VALUES
-- 1. Appartement Ixelles (Jean-Marc Petit)
(
  get_user_id_by_email('jeanmarc.petit@demo.easyco.com'),
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
  'published', true
),

-- 2. Studio Schaerbeek (Thomas Janssens)
(
  get_user_id_by_email('thomas.janssens@demo.easyco.com'),
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
  'published', true
),

-- 3. Coliving Forest (Sophie Vermeulen)
(
  get_user_id_by_email('sophie.vermeulen@demo.easyco.com'),
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
  'published', true
),

-- 4. Appartement Woluwe (Isabelle Moreau)
(
  get_user_id_by_email('isabelle.moreau@demo.easyco.com'),
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
  'published', true
),

-- 5. Maison Saint-Gilles (Isabelle Moreau)
(
  get_user_id_by_email('isabelle.moreau@demo.easyco.com'),
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
  'published', true
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Clean up temporary function
-- ============================================================================

DROP FUNCTION IF EXISTS get_user_id_by_email(TEXT);

-- ============================================================================
-- Verification queries
-- ============================================================================

-- Check profiles created
SELECT
  user_type,
  COUNT(*) as count,
  string_agg(first_name || ' ' || last_name, ', ') as names
FROM user_profiles
WHERE email LIKE '%@demo.easyco.com'
GROUP BY user_type;

-- Check properties created
SELECT
  p.title,
  p.city,
  p.monthly_rent,
  up.first_name || ' ' || up.last_name as owner_name
FROM properties p
JOIN user_profiles up ON p.owner_id = up.user_id
WHERE up.email LIKE '%@demo.easyco.com'
ORDER BY p.monthly_rent;

-- Summary
SELECT
  'Demo Users' as type, COUNT(*) as count
FROM user_profiles
WHERE email LIKE '%@demo.easyco.com'
UNION ALL
SELECT
  'Demo Properties' as type, COUNT(*) as count
FROM properties
WHERE owner_id IN (
  SELECT user_id FROM user_profiles WHERE email LIKE '%@demo.easyco.com'
);
