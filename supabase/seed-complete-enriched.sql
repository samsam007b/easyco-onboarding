-- ============================================================================
-- COMPLETE ENRICHED SEED: Maximum Details for Testing Personalization
-- ============================================================================
-- This script creates highly detailed demo users with ALL fields populated
-- Perfect for testing matching algorithms and personalization features
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================================

-- ============================================================================
-- STEP 1: Create Auth Users Function (same as before)
-- ============================================================================

CREATE OR REPLACE FUNCTION create_demo_user(
  user_email TEXT,
  user_password TEXT DEFAULT 'Demo123!'
) RETURNS UUID AS $$
DECLARE
  existing_user_id UUID;
  new_user_id UUID;
  encrypted_pw TEXT;
BEGIN
  SELECT id INTO existing_user_id FROM auth.users WHERE email = user_email;
  IF existing_user_id IS NOT NULL THEN
    RETURN existing_user_id;
  END IF;

  new_user_id := gen_random_uuid();
  encrypted_pw := crypt(user_password, gen_salt('bf'));

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', user_email,
    encrypted_pw, NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    false, 'authenticated', 'authenticated'
  );

  INSERT INTO auth.identities (
    provider_id, user_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    new_user_id::text, new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', user_email),
    'email', NOW(), NOW(), NOW()
  );

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 2: Create ALL Demo Users
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
  sophie_id := create_demo_user('sophie.laurent@demo.easyco.com');
  ahmed_id := create_demo_user('ahmed.elmansouri@demo.easyco.com');
  emma_id := create_demo_user('emma.vanderberg@demo.easyco.com');
  lucas_id := create_demo_user('lucas.dubois@demo.easyco.com');
  maria_id := create_demo_user('maria.santos@demo.easyco.com');

  -- Owners
  jeanmarc_id := create_demo_user('jeanmarc.petit@demo.easyco.com');
  isabelle_id := create_demo_user('isabelle.moreau@demo.easyco.com');
  thomas_id := create_demo_user('thomas.janssens@demo.easyco.com');
  sophie_v_id := create_demo_user('sophie.vermeulen@demo.easyco.com');

  -- Residents
  pierre_id := create_demo_user('pierre.lecomte@demo.easyco.com');
  laura_id := create_demo_user('laura.gonzalez@demo.easyco.com');
  maxime_id := create_demo_user('maxime.dubois@demo.easyco.com');

  RAISE NOTICE '✅ Auth users created';

  -- ============================================================================
  -- STEP 3: SEARCHER #1 - SOPHIE LAURENT
  -- ============================================================================
  -- Young professional, social, organized, yoga enthusiast

  RAISE NOTICE '📝 Creating Sophie Laurent (Searcher)...';

  INSERT INTO user_profiles (
    user_id, user_type,

    -- Basic Information
    first_name, last_name, date_of_birth, gender_identity,
    nationality, languages_spoken, current_city, current_country,
    bio, profile_photo_url,

    -- Professional
    occupation_status, field_of_study_or_work, institution_or_company,
    monthly_income_bracket, employment_type, guarantor_available,

    -- Daily Habits
    wake_up_time, sleep_time, work_schedule, sports_frequency,
    is_smoker, drinks_alcohol, diet_type,

    -- Home Lifestyle
    cleanliness_preference, guest_frequency, music_habits,
    has_pets, cooking_frequency,

    -- Personality
    introvert_extrovert_scale, sociability_level, openness_to_sharing,
    communication_style, cultural_openness, conflict_tolerance,
    interests, hobbies, values_priority,

    -- Housing Preferences
    preferred_room_type, budget_min, budget_max,
    preferred_location_city, preferred_districts, preferred_move_in_date,
    minimum_stay_months, preferred_coliving_size, preferred_gender_mix,
    roommate_age_min, roommate_age_max, shared_space_importance,
    pet_tolerance, smoking_tolerance, cleanliness_expectation,
    quiet_hours_preference, shared_meals_interest,
    coworking_space_needed, gym_access_needed,

    -- Enhanced Profile
    about_me, looking_for, core_values, important_qualities, deal_breakers,

    -- Community
    event_interest, open_to_meetups,

    -- Phone
    phone_number
  ) VALUES (
    sophie_id, 'searcher',

    -- Basic
    'Sophie', 'Laurent', '1995-06-15', 'female',
    'French', ARRAY['Français', 'English', 'Nederlands'], 'Brussels', 'Belgium',
    'Marketing Manager passionnée par le digital et la créativité. Amoureuse de yoga, de cuisine healthy et de photographie. Je cherche une colocation conviviale avec des personnes ouvertes, respectueuses et dynamiques. Fan de brunch du dimanche et de soirées jeux de société !',
    'https://i.pravatar.cc/400?img=5',

    -- Professional
    'employed', 'Marketing Manager', 'Acme Digital Agency Brussels',
    '2000-3000', 'full-time', true,

    -- Daily Habits
    'moderate', 'moderate', 'flexible',
    'few-times-week', false, 'socially', 'vegetarian',

    -- Home Lifestyle
    'tidy', 'sometimes', 'low-volume',
    false, 'few-times',

    -- Personality
    7, 8, 'moderate',
    'casual', 'love-diversity', 'medium',
    ARRAY['yoga', 'cooking', 'photography', 'hiking', 'brunch', 'board-games', 'digital-marketing', 'sustainability'],
    ARRAY['yoga', 'cooking', 'photography', 'hiking'],
    ARRAY['respect', 'communication', 'cleanliness', 'open-mindedness'],

    -- Housing
    'private', 600, 900,
    'Brussels', ARRAY['Ixelles', 'Saint-Gilles', 'Etterbeek', 'Flagey'],
    '2024-12-01', 6, 'small', 'no-preference',
    25, 35, 8,
    true, false, 'tidy',
    false, true,
    false, true,

    -- Enhanced
    'Je suis Sophie, 29 ans, Marketing Manager dans le digital. Passionnée de yoga (je pratique 3x/semaine), de cuisine végétarienne et de photographie urbaine. Le weekend, j''aime explorer de nouveaux cafés, faire du vélo et organiser des brunchs avec mes amis. Je cherche une colocation où je peux être moi-même, partager de bons moments tout en respectant l''espace de chacun.',
    'Je recherche une colocation avec 2-3 personnes maximum, dans un appartement lumineux et bien situé. L''idéal serait avec des personnes sociables mais qui savent aussi profiter de leur temps personnel. J''aimerais pouvoir cuisiner ensemble de temps en temps, organiser des soirées jeux ou ciné, mais aussi avoir mon espace quand j''en ai besoin.',
    ARRAY['respect', 'communication', 'open-mindedness', 'sustainability', 'wellness'],
    ARRAY['communication-skills', 'cleanliness', 'respect-for-space', 'sociability', 'shared-values'],
    ARRAY['smoking', 'disrespect', 'extreme-messiness', 'constant-parties'],

    -- Community
    'high', true,

    -- Contact
    '+32 485 12 34 56'
  ) ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;

  -- ============================================================================
  -- STEP 4: SEARCHER #2 - AHMED EL MANSOURI
  -- ============================================================================
  -- Student, calm, studious, gamer, football fan

  RAISE NOTICE '📝 Creating Ahmed El Mansouri (Searcher)...';

  INSERT INTO user_profiles (
    user_id, user_type,
    first_name, last_name, date_of_birth, gender_identity,
    nationality, languages_spoken, current_city, current_country,
    bio, profile_photo_url,
    occupation_status, field_of_study_or_work, institution_or_company,
    monthly_income_bracket, employment_type, guarantor_available,
    guarantor_name, guarantor_phone,
    wake_up_time, sleep_time, work_schedule, sports_frequency,
    is_smoker, drinks_alcohol, diet_type,
    cleanliness_preference, guest_frequency, music_habits,
    has_pets, cooking_frequency,
    introvert_extrovert_scale, sociability_level, openness_to_sharing,
    communication_style, cultural_openness, conflict_tolerance,
    interests, hobbies, values_priority,
    preferred_room_type, budget_min, budget_max,
    preferred_location_city, preferred_districts, preferred_move_in_date,
    minimum_stay_months, preferred_coliving_size, preferred_gender_mix,
    roommate_age_min, roommate_age_max, shared_space_importance,
    pet_tolerance, smoking_tolerance, cleanliness_expectation,
    quiet_hours_preference, shared_meals_interest,
    coworking_space_needed, gym_access_needed,
    about_me, looking_for, core_values, important_qualities, deal_breakers,
    event_interest, open_to_meetups,
    phone_number
  ) VALUES (
    ahmed_id, 'searcher',
    'Ahmed', 'El Mansouri', '2001-03-22', 'male',
    'Moroccan', ARRAY['العربية', 'Français', 'English'], 'Brussels', 'Belgium',
    'Étudiant en 3ème année d''ingénieur informatique à l''ULB. Passionné de tech, gaming et football. Calme et studieux en semaine, je me détends le weekend avec mes jeux vidéo préférés ou en regardant le foot. Je recherche une colocation proche de l''université avec des personnes respectueuses et cool.',
    'https://i.pravatar.cc/400?img=12',
    'student', 'Computer Engineering Student', 'Université Libre de Bruxelles (ULB)',
    '500-1000', 'part-time', true,
    'Mohamed El Mansouri', '+212 666 123 456',
    'moderate', 'late', 'student',
    'once-week', false, 'occasionally', 'halal',
    'moderate', 'rarely', 'moderate',
    false, 'few-times',
    4, 5, 'private',
    'casual', 'love-diversity', 'low',
    ARRAY['gaming', 'football', 'cinema', 'tech', 'programming', 'AI', 'e-sports'],
    ARRAY['gaming', 'football', 'programming', 'cinema'],
    ARRAY['respect', 'quiet-environment', 'diversity', 'honesty'],
    'private', 400, 600,
    'Brussels', ARRAY['Ixelles', 'Schaerbeek', 'Auderghem', 'Etterbeek'], '2025-01-15',
    9, 'small', 'no-preference',
    20, 30, 6,
    true, false, 'moderate',
    true, false,
    false, false,
    'Je m''appelle Ahmed, j''ai 23 ans et je fais des études d''ingénieur informatique à l''ULB. Je suis passionné par la programmation, l''IA et les nouvelles technologies. Le soir, j''aime me détendre en jouant à des jeux vidéo (League of Legends, FIFA) ou en regardant des matchs de foot. Je suis assez calme et je respecte le besoin de tranquillité de mes colocataires, surtout pendant les périodes d''examens. Je cherche une colocation où je peux étudier dans le calme mais aussi discuter de tech avec mes colocs !',
    'Je cherche une colocation proche de l''ULB (Ixelles ou Schaerbeek idéalement), dans mon budget étudiant (max 600€). L''important pour moi c''est d''avoir un espace calme pour étudier, une bonne connexion internet pour le gaming, et des colocataires cool et respectueux. Pas besoin de faire la fête tous les weekends, mais je suis ouvert aux soirées ciné ou foot de temps en temps.',
    ARRAY['respect', 'quiet-time', 'diversity', 'honesty', 'tolerance'],
    ARRAY['respect-for-study-time', 'cleanliness', 'good-internet', 'quiet-environment'],
    ARRAY['smoking-indoors', 'loud-music-late-night', 'disrespect', 'constant-parties'],
    'medium', false,
    '+32 486 23 45 67'
  ) ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name;

  -- ============================================================================
  -- STEP 5: SEARCHER #3 - EMMA VAN DER BERG
  -- ============================================================================
  -- Freelance designer, creative, plant lover, work-from-home

  RAISE NOTICE '📝 Creating Emma Van Der Berg (Searcher)...';

  INSERT INTO user_profiles (
    user_id, user_type,
    first_name, last_name, date_of_birth, gender_identity,
    nationality, languages_spoken, current_city, current_country,
    bio, profile_photo_url,
    occupation_status, field_of_study_or_work, institution_or_company,
    monthly_income_bracket, employment_type, guarantor_available,
    wake_up_time, sleep_time, work_schedule, sports_frequency,
    is_smoker, drinks_alcohol, diet_type,
    cleanliness_preference, guest_frequency, music_habits,
    has_pets, pet_type, cooking_frequency,
    introvert_extrovert_scale, sociability_level, openness_to_sharing,
    communication_style, cultural_openness, conflict_tolerance,
    interests, hobbies, values_priority,
    preferred_room_type, budget_min, budget_max,
    preferred_location_city, preferred_districts, preferred_move_in_date,
    minimum_stay_months, preferred_coliving_size, preferred_gender_mix,
    roommate_age_min, roommate_age_max, shared_space_importance,
    pet_tolerance, smoking_tolerance, cleanliness_expectation,
    quiet_hours_preference, shared_meals_interest,
    coworking_space_needed, gym_access_needed,
    about_me, looking_for, core_values, important_qualities, deal_breakers,
    event_interest, open_to_meetups,
    phone_number
  ) VALUES (
    emma_id, 'searcher',
    'Emma', 'Van Der Berg', '1988-11-08', 'female',
    'Belgian', ARRAY['Nederlands', 'English', 'Français'], 'Brussels', 'Belgium',
    'Designer freelance UX/UI, passionnée de déco et de plantes. Je travaille de chez moi, donc j''ai besoin d''un espace lumineux et calme. Amoureuse des jeux de société, de lecture et de bonnes conversations autour d''un thé. Je cherche une colocation avec des personnes créatives et ouvertes d''esprit.',
    'https://i.pravatar.cc/400?img=10',
    'self-employed', 'UX/UI Designer', 'Freelance / Multiple Clients',
    '2000-3000', 'freelance', false,
    'early', 'moderate', 'remote',
    'once-week', false, 'occasionally', 'vegetarian',
    'tidy', 'sometimes', 'low-volume',
    true, 'cat', 'daily',
    5, 6, 'moderate',
    'diplomatic', 'love-diversity', 'medium',
    ARRAY['design', 'plants', 'board-games', 'reading', 'interior-design', 'DIY', 'crafts', 'tea'],
    ARRAY['design', 'plants', 'board-games', 'reading'],
    ARRAY['creativity', 'respect', 'authenticity', 'calmness', 'nature'],
    'private', 700, 1000,
    'Brussels', ARRAY['Forest', 'Uccle', 'Saint-Gilles', 'Ixelles'], '2024-11-15',
    12, 'small', 'no-preference',
    28, 40, 7,
    true, false, 'tidy',
    true, true,
    true, false,
    'Je suis Emma, designer freelance de 36 ans spécialisée en UX/UI. Je travaille depuis chez moi, donc mon espace de vie est très important pour moi. J''adore décorer avec des plantes (j''en ai une vingtaine !), créer une ambiance cosy et chaleureuse. Mes passions incluent le design d''intérieur, les jeux de société (Wingspan, Azul, Catan...), la lecture et la poterie. Je suis plutôt introvertie mais j''apprécie vraiment les moments de qualité avec mes colocs autour d''un bon repas ou d''un jeu. Mon chat s''appelle Pixel et il est adorable !',
    'Je recherche une colocation dans un appartement lumineux avec de grandes fenêtres (mes plantes en ont besoin !). L''idéal serait d''avoir un petit espace pour mon bureau à domicile. Je cherche 1-2 colocataires maximum, des personnes calmes qui travaillent aussi de chez eux ou qui ont des horaires flexibles. Important : la colocation doit accepter mon chat Pixel. J''aimerais partager des repas végétariens, des soirées jeux, et avoir des conversations intéressantes.',
    ARRAY['creativity', 'respect', 'authenticity', 'calm-environment', 'nature-love'],
    ARRAY['respect-for-work-time', 'pet-friendly', 'cleanliness', 'creativity', 'good-communication'],
    ARRAY['smoking', 'loud-noise-during-day', 'disrespect-for-pets', 'no-plants-allowed'],
    'medium', true,
    '+32 487 34 56 78'
  ) ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name;

  -- ============================================================================
  -- STEP 6: SEARCHER #4 - LUCAS DUBOIS
  -- ============================================================================
  -- Accountant, in couple, organized, quiet, loves hiking

  RAISE NOTICE '📝 Creating Lucas Dubois (Searcher)...';

  INSERT INTO user_profiles (
    user_id, user_type,
    first_name, last_name, date_of_birth, gender_identity,
    nationality, languages_spoken, current_city, current_country,
    bio, profile_photo_url,
    occupation_status, field_of_study_or_work, institution_or_company,
    monthly_income_bracket, employment_type, guarantor_available,
    wake_up_time, sleep_time, work_schedule, sports_frequency,
    is_smoker, drinks_alcohol, diet_type,
    cleanliness_preference, guest_frequency, music_habits,
    has_pets, cooking_frequency,
    introvert_extrovert_scale, sociability_level, openness_to_sharing,
    communication_style, cultural_openness, conflict_tolerance,
    interests, hobbies, values_priority,
    preferred_room_type, budget_min, budget_max,
    preferred_location_city, preferred_districts, preferred_move_in_date,
    minimum_stay_months, preferred_coliving_size, preferred_gender_mix,
    roommate_age_min, roommate_age_max, shared_space_importance,
    pet_tolerance, smoking_tolerance, cleanliness_expectation,
    quiet_hours_preference, shared_meals_interest,
    coworking_space_needed, gym_access_needed,
    about_me, looking_for, core_values, important_qualities, deal_breakers,
    event_interest, open_to_meetups,
    phone_number
  ) VALUES (
    lucas_id, 'searcher',
    'Lucas', 'Dubois', '1992-04-18', 'male',
    'French', ARRAY['Français', 'English'], 'Brussels', 'Belgium',
    'Comptable chez EY, en couple avec Léa. Nous sommes calmes, organisés et respectueux. Passionnés de randonnée, cuisine et musique. Nous cherchons un appartement spacieux dans un quartier résidentiel calme. Non-fumeurs, pas d''animaux.',
    'https://i.pravatar.cc/400?img=15',
    'employed', 'Senior Accountant', 'EY Belgium',
    '3000-5000', 'full-time', false,
    'early', 'early', 'traditional',
    'once-week', false, 'occasionally', 'omnivore',
    'spotless', 'rarely', 'low-volume',
    false, 'daily',
    3, 4, 'private',
    'direct', 'moderate', 'low',
    ARRAY['hiking', 'cooking', 'music', 'travel', 'finance', 'wine-tasting'],
    ARRAY['hiking', 'cooking', 'music', 'travel'],
    ARRAY['organization', 'cleanliness', 'respect', 'tranquility', 'stability'],
    'entire-apartment', 900, 1300,
    'Brussels', ARRAY['Woluwe-Saint-Pierre', 'Etterbeek', 'Auderghem', 'Montgomery'], '2025-02-01',
    12, 'no-preference', 'no-preference',
    28, 40, 9,
    false, false, 'spotless',
    true, false,
    false, false,
    'Je m''appelle Lucas, 32 ans, comptable senior chez EY. Je suis en couple avec Léa (infirmière) et nous cherchons ensemble un appartement. Nous sommes tous les deux très organisés, rangés et respectueux. Nos weekends sont souvent consacrés à la randonnée dans les Ardennes, à tester de nouvelles recettes de cuisine ou à découvrir de bons restaurants. Nous aimons aussi la musique (jazz et classique) et nous jouons tous les deux d''un instrument (piano pour moi, violon pour Léa). Nous sommes plutôt calmes et apprécions notre tranquillité après nos journées de travail. Non-fumeurs, sans animaux.',
    'Nous recherchons un appartement spacieux (minimum 2 chambres, idéalement 3) dans un quartier résidentiel calme et bien desservi par les transports. L''idéal serait Woluwe ou Auderghem. Nous avons besoin d''espace pour nos bureaux respectifs (télétravail 2 jours/semaine chacun) et pour nos hobbies (piano, livres, équipement de randonnée). La propreté et l''organisation sont très importantes pour nous. Budget max 1300€ pour nous deux. Bail minimum 12 mois car nous voulons de la stabilité.',
    ARRAY['organization', 'cleanliness', 'respect', 'tranquility', 'stability', 'responsibility'],
    ARRAY['cleanliness', 'respect-for-quiet', 'reliability', 'organization', 'maturity'],
    ARRAY['smoking', 'noise', 'messiness', 'unreliability', 'parties'],
    'low', false,
    '+32 488 45 67 89'
  ) ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name;

  -- ============================================================================
  -- STEP 7: SEARCHER #5 - MARIA SANTOS
  -- ============================================================================
  -- EU Policy Advisor, international, social, loves nightlife

  RAISE NOTICE '📝 Creating Maria Santos (Searcher)...';

  INSERT INTO user_profiles (
    user_id, user_type,
    first_name, last_name, date_of_birth, gender_identity,
    nationality, languages_spoken, current_city, current_country,
    bio, profile_photo_url,
    occupation_status, field_of_study_or_work, institution_or_company,
    monthly_income_bracket, employment_type, guarantor_available,
    wake_up_time, sleep_time, work_schedule, sports_frequency,
    is_smoker, drinks_alcohol, diet_type,
    cleanliness_preference, guest_frequency, music_habits,
    has_pets, cooking_frequency,
    introvert_extrovert_scale, sociability_level, openness_to_sharing,
    communication_style, cultural_openness, conflict_tolerance,
    interests, hobbies, values_priority,
    preferred_room_type, budget_min, budget_max,
    preferred_location_city, preferred_districts, preferred_move_in_date,
    minimum_stay_months, preferred_coliving_size, preferred_gender_mix,
    roommate_age_min, roommate_age_max, shared_space_importance,
    pet_tolerance, smoking_tolerance, cleanliness_expectation,
    quiet_hours_preference, shared_meals_interest,
    coworking_space_needed, gym_access_needed,
    about_me, looking_for, core_values, important_qualities, deal_breakers,
    event_interest, open_to_meetups,
    phone_number
  ) VALUES (
    maria_id, 'searcher',
    'Maria', 'Santos', '1990-09-25', 'female',
    'Portuguese', ARRAY['Português', 'English', 'Español', 'Français'], 'Brussels', 'Belgium',
    'Policy Advisor à la Commission Européenne, passionnée de voyages et de rencontres interculturelles. Sociable, aventurière et ouverte d''esprit. J''adore découvrir de nouveaux restaurants, sortir danser et organiser des soirées avec mes amis. Je cherche une colocation internationale et dynamique au cœur de Bruxelles.',
    'https://i.pravatar.cc/400?img=9',
    'employed', 'EU Policy Advisor', 'European Commission',
    '3000-5000', 'full-time', false,
    'moderate', 'late', 'flexible',
    'few-times-week', false, 'socially', 'omnivore',
    'moderate', 'often', 'moderate',
    false, 'few-times',
    8, 9, 'very-open',
    'casual', 'love-diversity', 'high',
    ARRAY['travel', 'food', 'nightlife', 'languages', 'dancing', 'wine', 'networking', 'culture'],
    ARRAY['travel', 'food', 'dancing', 'languages'],
    ARRAY['openness', 'adventure', 'diversity', 'fun', 'authenticity'],
    'private', 750, 1100,
    'Brussels', ARRAY['Centre', 'Ixelles', 'Saint-Josse', 'Etterbeek', 'Louise'], '2024-12-15',
    6, 'medium', 'mixed',
    26, 40, 9,
    true, true, 'moderate',
    false, true,
    false, false,
    'Olá ! Je m''appelle Maria, j''ai 34 ans et je viens de Lisbonne. Je travaille à la Commission Européenne en tant que Policy Advisor. J''adore Bruxelles pour sa diversité culturelle ! Je suis une personne très sociale et extravertie, j''aime organiser des soirées tapas, découvrir de nouveaux bars et restaurants, danser (salsa, bachata) et voyager dès que j''ai un long weekend. Je parle 4 langues et j''adore rencontrer des gens de tous horizons. Je cherche une colocation internationale où on peut partager nos cultures, cuisiner ensemble et faire la fête de temps en temps ! J''ai beaucoup d''énergie et j''aime profiter de la vie.',
    'Je cherche une colocation au cœur de Bruxelles (Centre, Ixelles, Louise) avec 2-3 colocataires internationaux et sociables. L''idéal serait d''avoir des personnes qui aiment aussi sortir, découvrir la ville et organiser des soirées à la maison. J''aimerais pouvoir cuisiner ensemble (je fais d''excellentes pastéis de nata !), pratiquer différentes langues et créer une vraie communauté. Je suis ouverte à fumer sur le balcon/terrasse et je ne suis pas dérangée par un peu de bruit. Ce qui compte pour moi c''est l''ambiance, la bonne énergie et le respect mutuel.',
    ARRAY['openness', 'adventure', 'diversity', 'fun', 'authenticity', 'community'],
    ARRAY['sociability', 'cultural-openness', 'fun-loving', 'respect', 'good-energy'],
    ARRAY['judgmental-attitude', 'racism', 'too-serious', 'no-social-life'],
    'high', true,
    '+32 489 56 78 90'
  ) ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name;

  RAISE NOTICE '✅ All 5 SEARCHERS created with maximum details!';

  -- ============================================================================
  -- TO BE CONTINUED: OWNERS AND RESIDENTS
  -- ============================================================================
  -- Due to character limits, I'll create the owners and residents sections next

  RAISE NOTICE '⏳ Owners and Residents creation coming in next part...';

END $$;

-- Verification
SELECT '✅ SEARCHERS ENRICHED!' as status,
  COUNT(*) as searcher_count
FROM user_profiles
WHERE user_type = 'searcher'
  AND user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@demo.easyco.com');
