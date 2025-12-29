-- ============================================================================
-- SEED TEST DATA FOR IZZICO
-- ============================================================================
-- This script creates diverse test profiles and properties in Brussels
-- All data is fictional but realistic for testing purposes
-- ============================================================================

-- First, we'll create test users (you'll need to create these via Supabase Auth UI or API)
-- For now, we'll use placeholder UUIDs that you'll need to replace with actual user IDs

-- ============================================================================
-- 1. SEARCHER PROFILES (Chercheurs de logement)
-- ============================================================================

-- Searcher 1: Sophie Laurent - Young Professional
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  occupation,
  monthly_income,
  preferred_cities,
  budget_min,
  budget_max,
  move_in_date,
  lifestyle_preferences
) VALUES (
  'REPLACE_WITH_USER_ID_1', -- You'll replace this
  'sophie.laurent@example.com',
  'Sophie',
  'Laurent',
  '+32 485 12 34 56',
  '1995-06-15',
  'Belgian',
  'searcher',
  'complete',
  'Jeune professionnelle dans le marketing digital, passionnée de yoga et de cuisine. Je recherche une colocation conviviale avec des personnes ouvertes et respectueuses.',
  'Marketing Manager',
  2800,
  ARRAY['Ixelles', 'Saint-Gilles', 'Etterbeek'],
  600,
  900,
  '2024-12-01',
  '{
    "smoking": "no",
    "pets": "no_preference",
    "noise_level": "moderate",
    "cleanliness": "very_clean",
    "interests": ["yoga", "cooking", "hiking", "photography"],
    "work_schedule": "hybrid",
    "social_preference": "balanced"
  }'::jsonb
);

-- Searcher 2: Ahmed El Mansouri - Student
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  occupation,
  monthly_income,
  preferred_cities,
  budget_min,
  budget_max,
  move_in_date,
  lifestyle_preferences
) VALUES (
  'REPLACE_WITH_USER_ID_2',
  'ahmed.elmansouri@example.com',
  'Ahmed',
  'El Mansouri',
  '+32 486 23 45 67',
  '2001-03-22',
  'Moroccan',
  'searcher',
  'complete',
  'Étudiant en ingénieur informatique à l''ULB. Calme et studieux, j''aime jouer aux jeux vidéo et faire du sport. Cherche une chambre dans une colocation sympa avec d''autres étudiants.',
  'Student',
  850,
  ARRAY['Ixelles', 'Schaerbeek', 'Auderghem'],
  400,
  600,
  '2024-11-15',
  '{
    "smoking": "no",
    "pets": "yes",
    "noise_level": "quiet",
    "cleanliness": "clean",
    "interests": ["gaming", "football", "cinema", "tech"],
    "work_schedule": "student",
    "social_preference": "social"
  }'::jsonb
);

-- Searcher 3: Emma Van Der Berg - Remote Worker
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  occupation,
  monthly_income,
  preferred_cities,
  budget_min,
  budget_max,
  move_in_date,
  lifestyle_preferences
) VALUES (
  'REPLACE_WITH_USER_ID_3',
  'emma.vanderberg@example.com',
  'Emma',
  'Van Der Berg',
  '+32 487 34 56 78',
  '1988-11-08',
  'Belgian',
  'searcher',
  'complete',
  'Designer freelance travaillant de chez moi. J''adore les plantes, la décoration et les soirées jeux de société. Recherche un lieu calme et lumineux avec espace de travail.',
  'Freelance Designer',
  2200,
  ARRAY['Forest', 'Uccle', 'Saint-Gilles'],
  700,
  1000,
  '2024-12-15',
  '{
    "smoking": "no",
    "pets": "yes",
    "noise_level": "quiet",
    "cleanliness": "very_clean",
    "interests": ["design", "plants", "board_games", "reading"],
    "work_schedule": "remote",
    "social_preference": "balanced"
  }'::jsonb
);

-- Searcher 4: Lucas Dubois - Young Professional Couple
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  occupation,
  monthly_income,
  preferred_cities,
  budget_min,
  budget_max,
  move_in_date,
  lifestyle_preferences
) VALUES (
  'REPLACE_WITH_USER_ID_4',
  'lucas.dubois@example.com',
  'Lucas',
  'Dubois',
  '+32 488 45 67 89',
  '1992-04-18',
  'French',
  'searcher',
  'complete',
  'Comptable chez EY, en couple. Nous sommes calmes, organisés et respectueux. Cherchons un appartement pour nous deux avec notre chat. Passionnés de cuisine et de randonnée.',
  'Accountant',
  3500,
  ARRAY['Woluwe-Saint-Pierre', 'Etterbeek', 'Auderghem'],
  900,
  1300,
  '2025-01-01',
  '{
    "smoking": "no",
    "pets": "yes",
    "noise_level": "quiet",
    "cleanliness": "very_clean",
    "interests": ["cooking", "hiking", "travel", "music"],
    "work_schedule": "office",
    "social_preference": "private",
    "living_situation": "couple"
  }'::jsonb
);

-- Searcher 5: Maria Santos - International Professional
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  occupation,
  monthly_income,
  preferred_cities,
  budget_min,
  budget_max,
  move_in_date,
  lifestyle_preferences
) VALUES (
  'REPLACE_WITH_USER_ID_5',
  'maria.santos@example.com',
  'Maria',
  'Santos',
  '+32 489 56 78 90',
  '1990-09-25',
  'Portuguese',
  'searcher',
  'complete',
  'Venue du Portugal pour travailler à la Commission Européenne. Sociable et aventurière, j''adore découvrir de nouveaux restaurants et sortir. Cherche colocation internationale et dynamique.',
  'EU Policy Advisor',
  3200,
  ARRAY['Bruxelles-Centre', 'Ixelles', 'Saint-Josse'],
  750,
  1100,
  '2024-11-20',
  '{
    "smoking": "occasionally",
    "pets": "no",
    "noise_level": "lively",
    "cleanliness": "clean",
    "interests": ["travel", "food", "nightlife", "languages", "culture"],
    "work_schedule": "office",
    "social_preference": "very_social"
  }'::jsonb
);

-- ============================================================================
-- 2. OWNER PROFILES (Propriétaires)
-- ============================================================================

-- Owner 1: Jean-Marc Petit - Private Landlord
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  hosting_experience,
  owner_type,
  has_property,
  property_city,
  property_type
) VALUES (
  'REPLACE_WITH_OWNER_ID_1',
  'jeanmarc.petit@example.com',
  'Jean-Marc',
  'Petit',
  '+32 475 11 22 33',
  '1975-05-12',
  'Belgian',
  'owner',
  'complete',
  'Propriétaire d''un appartement rénové à Ixelles que je loue depuis 5 ans. J''apprécie les locataires responsables et communicatifs. Disponible et réactif pour tout problème.',
  'experienced',
  'individual',
  true,
  'Ixelles',
  'apartment'
);

-- Owner 2: Isabelle Moreau - Multiple Properties Owner
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  hosting_experience,
  owner_type,
  has_property,
  property_city,
  property_type
) VALUES (
  'REPLACE_WITH_OWNER_ID_2',
  'isabelle.moreau@example.com',
  'Isabelle',
  'Moreau',
  '+32 476 22 33 44',
  '1968-08-30',
  'Belgian',
  'owner',
  'complete',
  'Propriétaire de plusieurs biens immobiliers à Bruxelles. Professionnelle et à l''écoute, je m''assure que mes locataires se sentent chez eux. 15 ans d''expérience dans la location.',
  'expert',
  'individual',
  true,
  'Saint-Gilles',
  'house'
);

-- Owner 3: Thomas Janssens - First-time Landlord
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  hosting_experience,
  owner_type,
  has_property,
  property_city,
  property_type
) VALUES (
  'REPLACE_WITH_OWNER_ID_3',
  'thomas.janssens@example.com',
  'Thomas',
  'Janssens',
  '+32 477 33 44 55',
  '1985-02-14',
  'Belgian',
  'owner',
  'complete',
  'Premier investissement locatif ! Studio moderne à Schaerbeek, parfait pour étudiant ou jeune professionnel. Enthousiaste et motivé pour créer une bonne relation avec mes locataires.',
  'beginner',
  'individual',
  true,
  'Schaerbeek',
  'studio'
);

-- Owner 4: Brussels Living Agency
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  hosting_experience,
  owner_type,
  has_property,
  property_city,
  property_type
) VALUES (
  'REPLACE_WITH_OWNER_ID_4',
  'contact@brusselsliving.com',
  'Brussels Living',
  'Agency',
  '+32 2 555 66 77',
  '2010-01-01',
  'Belgian',
  'owner',
  'complete',
  'Agence immobilière spécialisée dans les colocations et logements pour jeunes professionnels. Portfolio de +50 propriétés à Bruxelles. Service professionnel et réactif 7j/7.',
  'expert',
  'agency',
  true,
  'Multiple cities',
  'apartment'
);

-- Owner 5: Sophie Vermeulen - Coliving Host
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  hosting_experience,
  owner_type,
  has_property,
  property_city,
  property_type
) VALUES (
  'REPLACE_WITH_OWNER_ID_5',
  'sophie.vermeulen@example.com',
  'Sophie',
  'Vermeulen',
  '+32 478 44 55 66',
  '1980-12-03',
  'Belgian',
  'owner',
  'complete',
  'Grande maison de coliving à Forest avec jardin et espaces communs. J''adore créer une communauté conviviale et organiser des événements pour les colocataires. 8 ans d''expérience.',
  'experienced',
  'individual',
  true,
  'Forest',
  'coliving'
);

-- ============================================================================
-- 3. RESIDENT PROFILES (Colocataires actuels)
-- ============================================================================

-- Resident 1: Pierre Lecomte - Working Professional
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  occupation,
  monthly_income,
  lifestyle_preferences
) VALUES (
  'REPLACE_WITH_RESIDENT_ID_1',
  'pierre.lecomte@example.com',
  'Pierre',
  'Lecomte',
  '+32 491 11 22 33',
  '1993-07-20',
  'Belgian',
  'resident',
  'complete',
  'Ingénieur civil habitant à Ixelles. Calme en semaine, sociable le weekend. J''aime cuisiner pour mes colocataires et organiser des soirées films.',
  'Civil Engineer',
  3100,
  '{
    "smoking": "no",
    "pets": "yes",
    "noise_level": "moderate",
    "cleanliness": "clean",
    "interests": ["cinema", "cooking", "cycling", "beer"],
    "work_schedule": "office",
    "social_preference": "balanced"
  }'::jsonb
);

-- Resident 2: Laura Gonzalez - Graduate Student
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  occupation,
  monthly_income,
  lifestyle_preferences
) VALUES (
  'REPLACE_WITH_RESIDENT_ID_2',
  'laura.gonzalez@example.com',
  'Laura',
  'Gonzalez',
  '+32 492 22 33 44',
  '1998-03-15',
  'Spanish',
  'resident',
  'complete',
  'Doctorante en biologie à l''ULB. Organisée et respectueuse, je cherche un environnement calme pour mes études. J''adore le yoga et les cafés cosy.',
  'PhD Student',
  1100,
  '{
    "smoking": "no",
    "pets": "no",
    "noise_level": "quiet",
    "cleanliness": "very_clean",
    "interests": ["science", "yoga", "books", "art"],
    "work_schedule": "flexible",
    "social_preference": "balanced"
  }'::jsonb
);

-- Resident 3: Maxime Dubois - Startup Employee
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  occupation,
  monthly_income,
  lifestyle_preferences
) VALUES (
  'REPLACE_WITH_RESIDENT_ID_3',
  'maxime.dubois@example.com',
  'Maxime',
  'Dubois',
  '+32 493 33 44 55',
  '1996-11-28',
  'French',
  'resident',
  'complete',
  'Je travaille dans une startup tech à Bruxelles. Dynamique et ouvert, j''aime les sorties et rencontrer de nouvelles personnes. Cherche colocation sympa et vivante.',
  'Software Developer',
  2400,
  '{
    "smoking": "occasionally",
    "pets": "no_preference",
    "noise_level": "lively",
    "cleanliness": "moderate",
    "interests": ["tech", "nightlife", "sports", "travel"],
    "work_schedule": "hybrid",
    "social_preference": "very_social"
  }'::jsonb
);

-- Resident 4: Aisha Osman - Healthcare Worker
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  occupation,
  monthly_income,
  lifestyle_preferences
) VALUES (
  'REPLACE_WITH_RESIDENT_ID_4',
  'aisha.osman@example.com',
  'Aisha',
  'Osman',
  '+32 494 44 55 66',
  '1991-06-10',
  'Belgian',
  'resident',
  'complete',
  'Infirmière à l''hôpital Saint-Luc. Horaires variables mais toujours respectueuse. Calme et propre, j''apprécie les colocataires responsables.',
  'Nurse',
  2600,
  '{
    "smoking": "no",
    "pets": "yes",
    "noise_level": "quiet",
    "cleanliness": "very_clean",
    "interests": ["reading", "wellness", "nature", "meditation"],
    "work_schedule": "shifts",
    "social_preference": "private"
  }'::jsonb
);

-- Resident 5: Marco Rossi - Artist
INSERT INTO public.user_profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  nationality,
  user_type,
  profile_status,
  bio,
  occupation,
  monthly_income,
  lifestyle_preferences
) VALUES (
  'REPLACE_WITH_RESIDENT_ID_5',
  'marco.rossi@example.com',
  'Marco',
  'Rossi',
  '+32 495 55 66 77',
  '1994-01-05',
  'Italian',
  'resident',
  'complete',
  'Artiste peintre et illustrateur freelance. Créatif et bohème, je cherche un espace inspirant avec d''autres personnes artistiques. J''aime les longues discussions et la musique live.',
  'Artist',
  1800,
  '{
    "smoking": "occasionally",
    "pets": "yes",
    "noise_level": "moderate",
    "cleanliness": "moderate",
    "interests": ["art", "music", "philosophy", "exhibitions"],
    "work_schedule": "flexible",
    "social_preference": "social"
  }'::jsonb
);

-- ============================================================================
-- 4. PROPERTIES (5 diverse properties in Brussels)
-- ============================================================================

-- Property 1: Modern Apartment in Ixelles
INSERT INTO public.properties (
  owner_id,
  title,
  description,
  property_type,
  address,
  city,
  neighborhood,
  postal_code,
  country,
  latitude,
  longitude,
  bedrooms,
  bathrooms,
  surface_area,
  floor_number,
  furnished,
  monthly_rent,
  charges,
  deposit,
  available_from,
  minimum_stay_months,
  amenities,
  smoking_allowed,
  pets_allowed,
  couples_allowed,
  images,
  main_image,
  status,
  is_available
) VALUES (
  'REPLACE_WITH_OWNER_ID_1',
  'Superbe appartement 2 chambres rénové - Ixelles',
  'Magnifique appartement de 85m² entièrement rénové au cœur d''Ixelles, à 5 minutes à pied de la place Flagey. L''appartement dispose de 2 grandes chambres lumineuses, d''un salon spacieux avec parquet en chêne, d''une cuisine équipée moderne (lave-vaisselle, four, plaque à induction), et d''une salle de bain contemporaine avec douche à l''italienne.

Situé au 3ème étage avec ascenseur, l''appartement bénéficie d''une excellente luminosité grâce à ses grandes fenêtres. Le quartier est très vivant avec de nombreux cafés, restaurants, et commerces à proximité. Excellente connexion avec les transports en commun (tram 81, bus 71).

Idéal pour jeunes professionnels ou couple. Visite virtuelle disponible sur demande.',
  'apartment',
  'Avenue de la Couronne 234',
  'Ixelles',
  'Flagey',
  '1050',
  'Belgium',
  50.8272,
  4.3719,
  2,
  1,
  85,
  3,
  true,
  1250.00,
  150.00,
  2500.00,
  '2024-12-01',
  6,
  ARRAY['wifi', 'elevator', 'balcony', 'dishwasher', 'washing_machine', 'heating', 'furnished']::text[],
  false,
  false,
  true,
  ARRAY[
    'https://images.unsplash.com/photo-1502672260066-6bc36a8baf37?w=800',
    'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800',
    'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800'
  ],
  'https://images.unsplash.com/photo-1502672260066-6bc36a8baf37?w=800',
  'published',
  true
);

-- Property 2: Cozy Studio in Schaerbeek
INSERT INTO public.properties (
  owner_id,
  title,
  description,
  property_type,
  address,
  city,
  neighborhood,
  postal_code,
  country,
  latitude,
  longitude,
  bedrooms,
  bathrooms,
  surface_area,
  floor_number,
  furnished,
  monthly_rent,
  charges,
  deposit,
  available_from,
  minimum_stay_months,
  amenities,
  smoking_allowed,
  pets_allowed,
  couples_allowed,
  images,
  main_image,
  status,
  is_available
) VALUES (
  'REPLACE_WITH_OWNER_ID_3',
  'Studio moderne tout équipé - Schaerbeek',
  'Charmant studio de 35m² entièrement meublé et équipé, parfait pour étudiant ou jeune professionnel. Rénové récemment avec goût, il comprend un coin nuit avec lit double, un espace salon avec canapé et TV, une cuisine américaine équipée (frigo, micro-ondes, plaques électriques), et une salle de douche moderne.

Situé au 2ème étage d''un immeuble calme dans un quartier en plein développement de Schaerbeek. À 10 minutes à pied de la station de métro Diamant et proche de nombreux commerces. Internet haut débit inclus.

Le studio est lumineux et très bien agencé pour optimiser l''espace. Quartier multiculturel et dynamique avec excellent rapport qualité-prix.',
  'studio',
  'Rue Josaphat 145',
  'Schaerbeek',
  'Diamant',
  '1030',
  'Belgium',
  50.8639,
  4.3897,
  0,
  1,
  35,
  2,
  true,
  650.00,
  80.00,
  1300.00,
  '2024-11-15',
  3,
  ARRAY['wifi', 'washing_machine', 'heating', 'furnished']::text[],
  false,
  false,
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
  ],
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'published',
  true
);

-- Property 3: Spacious House Share in Forest
INSERT INTO public.properties (
  owner_id,
  title,
  description,
  property_type,
  address,
  city,
  neighborhood,
  postal_code,
  country,
  latitude,
  longitude,
  bedrooms,
  bathrooms,
  surface_area,
  floor_number,
  furnished,
  monthly_rent,
  charges,
  deposit,
  available_from,
  minimum_stay_months,
  amenities,
  smoking_allowed,
  pets_allowed,
  couples_allowed,
  images,
  main_image,
  status,
  is_available
) VALUES (
  'REPLACE_WITH_OWNER_ID_5',
  'Coliving dans maison de maître avec jardin - Forest',
  'Magnifique maison de maître de 280m² transformée en espace de coliving moderne et convivial. Nous proposons des chambres privées meublées dans un cadre exceptionnel avec de nombreux espaces communs.

La maison comprend:
- 6 chambres privées meublées (lits doubles, bureaux, armoires)
- 3 salles de bains complètes
- Grand salon/salle à manger de 50m²
- Cuisine équipée professionnelle avec îlot central
- Salle de télévision/cinéma
- Buanderie équipée
- Jardin de 200m² avec terrasse et BBQ
- Cave à vélo

Ambiance internationale et conviviale. Organisation d''événements mensuels (brunch, soirées jeux, BBQ). Internet fibre optique. Proche du parc Duden et à 15 min du centre-ville en tram.

Charges incluent: eau, électricité, gaz, internet, ménage des espaces communs 2x/semaine.',
  'coliving',
  'Avenue Besme 89',
  'Forest',
  'Altitude 100',
  '1190',
  'Belgium',
  50.8109,
  4.3143,
  6,
  3,
  280,
  0,
  true,
  695.00,
  200.00,
  1390.00,
  '2024-12-15',
  3,
  ARRAY['wifi', 'garden', 'laundry', 'dishwasher', 'washing_machine', 'dryer', 'heating', 'furnished', 'parking']::text[],
  false,
  true,
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
  ],
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'published',
  true
);

-- Property 4: Luxury Apartment in Woluwe
INSERT INTO public.properties (
  owner_id,
  title,
  description,
  property_type,
  address,
  city,
  neighborhood,
  postal_code,
  country,
  latitude,
  longitude,
  bedrooms,
  bathrooms,
  surface_area,
  floor_number,
  furnished,
  monthly_rent,
  charges,
  deposit,
  available_from,
  minimum_stay_months,
  amenities,
  smoking_allowed,
  pets_allowed,
  couples_allowed,
  images,
  main_image,
  status,
  is_available
) VALUES (
  'REPLACE_WITH_OWNER_ID_2',
  'Appartement de standing 3 chambres - Woluwe-Saint-Pierre',
  'Superbe appartement haut de gamme de 120m² dans une résidence moderne et sécurisée de Woluwe-Saint-Pierre. Vue dégagée sur le parc, calme absolu tout en étant proche de toutes commodités.

L''appartement se compose de:
- Hall d''entrée avec vestiaire
- Spacieux séjour de 40m² avec accès à une terrasse de 15m²
- Cuisine équipée haut de gamme (électroménagers Bosch)
- 3 chambres avec placards intégrés (dont une suite parentale)
- 2 salles de bains (baignoire + douche)
- WC séparé
- Cave privative
- 2 emplacements de parking

Immeuble récent (2018) avec ascenseur, gardien, et système de sécurité. Proximité immédiate: métro Montgomery, écoles internationales, Shopping center. Quartier résidentiel prisé, idéal pour familles ou professionnels.

Charges comprennent: chauffage, eau, entretien communs.',
  'apartment',
  'Avenue de Tervueren 412',
  'Woluwe-Saint-Pierre',
  'Montgomery',
  '1150',
  'Belgium',
  50.8382,
  4.4115,
  3,
  2,
  120,
  5,
  false,
  1800.00,
  250.00,
  3600.00,
  '2025-01-01',
  12,
  ARRAY['wifi', 'elevator', 'balcony', 'parking', 'gym', 'dishwasher', 'washing_machine', 'dryer', 'air_conditioning', 'heating']::text[],
  false,
  true,
  true,
  ARRAY[
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
  ],
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
  'published',
  true
);

-- Property 5: Charming House in Saint-Gilles
INSERT INTO public.properties (
  owner_id,
  title,
  description,
  property_type,
  address,
  city,
  neighborhood,
  postal_code,
  country,
  latitude,
  longitude,
  bedrooms,
  bathrooms,
  surface_area,
  floor_number,
  furnished,
  monthly_rent,
  charges,
  deposit,
  available_from,
  minimum_stay_months,
  amenities,
  smoking_allowed,
  pets_allowed,
  couples_allowed,
  images,
  main_image,
  status,
  is_available
) VALUES (
  'REPLACE_WITH_OWNER_ID_2',
  'Maison de caractère 4 chambres avec jardin - Saint-Gilles',
  'Charmante maison bruxelloise typique de 150m² répartis sur 3 niveaux, située dans le quartier prisé de Parvis de Saint-Gilles. Cachet authentique préservé (parquets d''origine, moulures, cheminées) combiné avec confort moderne.

Composition:
- Rez-de-chaussée: salon lumineux, salle à manger, cuisine équipée ouverte sur jardin
- 1er étage: 2 grandes chambres, salle de bain complète
- 2ème étage: 2 chambres supplémentaires, salle de douche
- Sous-sol: buanderie, cave, chaufferie
- Jardin de 80m² plein sud avec terrasse

La maison a été partiellement rénovée en conservant le charme d''origine. Cuisine équipée moderne. Double vitrage. Chauffage au gaz individuel. Quartier très animé avec nombreux restaurants, bars, et commerces. À 2 pas de la Gare du Midi et du centre-ville.

Idéal pour colocation ou famille. Possibilité de louer meublée ou non-meublée.',
  'house',
  'Rue de la Victoire 78',
  'Saint-Gilles',
  'Parvis',
  '1060',
  'Belgium',
  50.8331,
  4.3446,
  4,
  2,
  150,
  0,
  false,
  2100.00,
  200.00,
  4200.00,
  '2024-12-01',
  12,
  ARRAY['wifi', 'garden', 'laundry', 'dishwasher', 'washing_machine', 'heating', 'balcony']::text[],
  false,
  true,
  true,
  ARRAY[
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'
  ],
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
  'published',
  true
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check created profiles
-- SELECT user_type, COUNT(*) as count FROM user_profiles GROUP BY user_type;

-- Check created properties
-- SELECT city, property_type, monthly_rent, status FROM properties ORDER BY city;

-- List all searchers with their preferences
-- SELECT first_name, last_name, preferred_cities, budget_min, budget_max
-- FROM user_profiles WHERE user_type = 'searcher';

-- List all properties with rent range
-- SELECT title, city, bedrooms, monthly_rent + charges as total_monthly_cost, status
-- FROM properties ORDER BY total_monthly_cost;

-- ============================================================================
-- NOTES FOR IMPLEMENTATION
-- ============================================================================
--
-- 1. REPLACE ALL 'REPLACE_WITH_*_ID_*' with actual user IDs after creating auth users
-- 2. Images are from Unsplash (free to use): https://unsplash.com/license
-- 3. All data is fictional but realistic for Brussels
-- 4. Prices are in EUR and realistic for Brussels market (2024)
-- 5. All addresses are fictional but neighborhoods are real
-- 6. Coordinates are approximate for each neighborhood
--
-- TO USE THIS SCRIPT:
-- 1. Create test users via Supabase Auth (email/password or OAuth)
-- 2. Get their user IDs from auth.users table
-- 3. Replace all REPLACE_WITH_*_ID_* placeholders
-- 4. Run this script in Supabase SQL Editor
-- 5. Verify data with the verification queries at the bottom
--
-- ============================================================================
