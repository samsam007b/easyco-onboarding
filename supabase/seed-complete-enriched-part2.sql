-- ============================================================================
-- COMPLETE ENRICHED SEED - PART 2: OWNERS & RESIDENTS
-- ============================================================================
-- Run this AFTER part 1 (seed-complete-enriched.sql)
-- This creates detailed owner and resident profiles
-- ============================================================================

DO $$
DECLARE
  jeanmarc_id UUID;
  isabelle_id UUID;
  thomas_id UUID;
  sophie_v_id UUID;
  pierre_id UUID;
  laura_id UUID;
  maxime_id UUID;
BEGIN

  -- Get existing user IDs
  SELECT id INTO jeanmarc_id FROM auth.users WHERE email = 'jeanmarc.petit@demo.easyco.com';
  SELECT id INTO isabelle_id FROM auth.users WHERE email = 'isabelle.moreau@demo.easyco.com';
  SELECT id INTO thomas_id FROM auth.users WHERE email = 'thomas.janssens@demo.easyco.com';
  SELECT id INTO sophie_v_id FROM auth.users WHERE email = 'sophie.vermeulen@demo.easyco.com';
  SELECT id INTO pierre_id FROM auth.users WHERE email = 'pierre.lecomte@demo.easyco.com';
  SELECT id INTO laura_id FROM auth.users WHERE email = 'laura.gonzalez@demo.easyco.com';
  SELECT id INTO maxime_id FROM auth.users WHERE email = 'maxime.dubois@demo.easyco.com';

  -- ============================================================================
  -- OWNER #1 - JEAN-MARC PETIT
  -- ============================================================================
  -- Individual owner, 5 years experience, apartment in Ixelles

  RAISE NOTICE '🏠 Creating Jean-Marc Petit (Owner)...';

  INSERT INTO user_profiles (
    user_id, user_type,
    first_name, last_name, date_of_birth, gender_identity,
    nationality, languages_spoken, current_city, current_country,
    bio, profile_photo_url, phone_number,

    -- Owner-specific
    landlord_type, company_name, business_registration_number,
    experience_years, portfolio_size, management_type,
    primary_motivation, availability_for_visits,

    -- Banking
    iban, bic_swift, account_holder_name, billing_address,
    payment_frequency, currency,

    -- Tenant Policies
    accepts_short_term_leases, minimum_lease_duration_months,
    required_tenant_documents, guarantor_required,
    minimum_income_ratio, credit_score_check_required,
    deposit_amount_months, pets_allowed_policy,
    maintenance_responsibility,

    -- Owner Preferences
    tenant_selection_style, preferred_tenant_types,
    communication_preference, response_time_hours,
    review_visibility_consent,

    -- Enhanced
    about_me, core_values, important_qualities,

    -- Personality (for matching)
    communication_style, cultural_openness,
    interests, hobbies,

    has_property
  ) VALUES (
    jeanmarc_id, 'owner',
    'Jean-Marc', 'Petit', '1975-05-12', 'male',
    'Belgian', ARRAY['Français', 'Nederlands', 'English'], 'Brussels', 'Belgium',
    'Propriétaire d''un appartement rénové à Ixelles que je loue depuis 5 ans. Bienveillant, réactif et à l''écoute de mes locataires. J''ai à cœur de créer un environnement agréable et de maintenir une bonne relation avec les résidents.',
    'https://i.pravatar.cc/400?img=33', '+32 475 11 22 33',

    -- Owner details
    'individual', NULL, NULL,
    5, 1, 'self-managed',
    'income', 'flexible',

    -- Banking
    'BE68 5390 0754 7034', 'GKCCBEBB', 'Jean-Marc Petit', 'Avenue Louise 234, 1050 Ixelles, Belgium',
    'monthly', 'EUR',

    -- Policies
    false, 6,
    ARRAY['ID card', 'Proof of income', 'Employment contract', 'Previous landlord reference'],
    true, 3.0, false, 2.0, false, 'landlord',

    -- Preferences
    'best-match', ARRAY['young-professionals', 'couples'],
    'email', 12, true,

    -- Enhanced
    'Propriétaire depuis 5 ans d''un bel appartement rénové dans le quartier Flagey à Ixelles. J''ai investi dans ce bien pour générer un revenu complémentaire tout en créant un lieu de vie agréable. Je suis très attentif à l''entretien de mon bien et je réponds rapidement aux demandes de mes locataires. J''apprécie les locataires sérieux, respectueux et qui prennent soin du logement comme s''il était le leur.',
    ARRAY['respect', 'reliability', 'communication', 'trust', 'responsibility'],
    ARRAY['reliability', 'cleanliness', 'respect-for-property', 'good-communication', 'stable-income'],

    -- Personality
    'direct', 'moderate',
    ARRAY['real-estate', 'renovation', 'finance', 'tennis'],
    ARRAY['tennis', 'renovation'],

    true
  ) ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    landlord_type = EXCLUDED.landlord_type;

  -- ============================================================================
  -- OWNER #2 - ISABELLE MOREAU
  -- ============================================================================
  -- Expert investor, 15 years, multiple properties

  RAISE NOTICE '🏠 Creating Isabelle Moreau (Owner)...';

  INSERT INTO user_profiles (
    user_id, user_type,
    first_name, last_name, date_of_birth, gender_identity,
    nationality, languages_spoken, current_city, current_country,
    bio, profile_photo_url, phone_number,
    landlord_type, company_name, business_registration_number, vat_number,
    experience_years, portfolio_size, management_type,
    primary_motivation, availability_for_visits,
    iban, bic_swift, account_holder_name, billing_address,
    payment_frequency, currency,
    accepts_short_term_leases, minimum_lease_duration_months,
    required_tenant_documents, guarantor_required,
    minimum_income_ratio, credit_score_check_required,
    deposit_amount_months, pets_allowed_policy,
    maintenance_responsibility,
    tenant_selection_style, preferred_tenant_types,
    communication_preference, response_time_hours,
    review_visibility_consent,
    about_me, core_values, important_qualities,
    communication_style, cultural_openness,
    interests, hobbies,
    has_property
  ) VALUES (
    isabelle_id, 'owner',
    'Isabelle', 'Moreau', '1968-08-30', 'female',
    'Belgian', ARRAY['Français', 'English', 'Nederlands'], 'Brussels', 'Belgium',
    'Investisseuse immobilière depuis 15 ans, je gère un portfolio de 8 propriétés à Bruxelles. Professionnelle, expérimentée et exigeante sur la qualité. Je privilégie les relations à long terme avec mes locataires.',
    'https://i.pravatar.cc/400?img=47', '+32 476 22 33 44',
    'company', 'Moreau Invest SPRL', 'BE0123456789', 'BE0123456789',
    15, 8, 'hybrid',
    'investment', 'by-appointment',
    'BE71 0961 2345 6769', 'GKCCBEBB', 'Moreau Invest SPRL', 'Rue du Commerce 89, 1040 Etterbeek, Belgium',
    'monthly', 'EUR',
    false, 12,
    ARRAY['ID card', 'Proof of income (3 months)', 'Employment contract', 'Bank statements', 'Previous landlord references'],
    true, 3.5, true, 2.0, true, 'landlord',
    'best-match', ARRAY['young-professionals', 'families', 'expats'],
    'email', 24, true,
    'Investisseuse immobilière passionnée depuis 15 ans. J''ai constitué un portfolio de 8 propriétés de qualité à Bruxelles, du studio étudiant à la maison familiale. Mon approche est professionnelle : je sélectionne soigneusement mes locataires, j''entretiens parfaitement mes biens et je construis des relations de confiance sur le long terme. J''ai une agence qui gère une partie de mes biens, mais je reste personnellement impliquée dans la sélection des locataires. Je recherche des profils sérieux, stables professionnellement et qui ont une vision à long terme.',
    ARRAY['professionalism', 'quality', 'stability', 'trust', 'long-term-vision'],
    ARRAY['financial-stability', 'professionalism', 'cleanliness', 'long-term-commitment', 'respect'],
    'formal', 'moderate',
    ARRAY['real-estate', 'investment', 'architecture', 'art', 'opera'],
    ARRAY['real-estate', 'art-collecting', 'opera'],
    true
  ) ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    landlord_type = EXCLUDED.landlord_type;

  -- ============================================================================
  -- OWNER #3 - THOMAS JANSSENS
  -- ============================================================================
  -- Beginner, first investment, studio for students

  RAISE NOTICE '🏠 Creating Thomas Janssens (Owner)...';

  INSERT INTO user_profiles (
    user_id, user_type,
    first_name, last_name, date_of_birth, gender_identity,
    nationality, languages_spoken, current_city, current_country,
    bio, profile_photo_url, phone_number,
    landlord_type, experience_years, portfolio_size, management_type,
    primary_motivation, availability_for_visits,
    iban, bic_swift, account_holder_name, billing_address,
    payment_frequency, currency,
    accepts_short_term_leases, minimum_lease_duration_months,
    required_tenant_documents, guarantor_required,
    minimum_income_ratio, credit_score_check_required,
    deposit_amount_months, pets_allowed_policy,
    maintenance_responsibility,
    tenant_selection_style, preferred_tenant_types,
    communication_preference, response_time_hours,
    review_visibility_consent,
    about_me, core_values, important_qualities,
    communication_style, cultural_openness,
    interests, hobbies,
    has_property
  ) VALUES (
    thomas_id, 'owner',
    'Thomas', 'Janssens', '1985-02-14', 'male',
    'Belgian', ARRAY['Nederlands', 'Français', 'English'], 'Brussels', 'Belgium',
    'Premier investissement locatif ! Studio moderne à Schaerbeek parfait pour étudiant. Jeune propriétaire motivé et à l''écoute. Disponible et réactif pour toute question.',
    'https://i.pravatar.cc/400?img=51', '+32 477 33 44 55',
    'individual', 0, 1, 'self-managed',
    'income', 'flexible',
    'BE15 0012 3456 7890', 'GEBABEBB', 'Thomas Janssens', 'Rue Verbist 67, 1030 Schaerbeek, Belgium',
    'monthly', 'EUR',
    true, 3,
    ARRAY['ID card', 'Student card or Employment proof', 'Guarantor information'],
    true, 2.5, false, 1.5, false, 'landlord',
    'first-come', ARRAY['students', 'young-professionals'],
    'whatsapp', 6, true,
    'C''est mon premier investissement locatif et j''en suis très fier ! J''ai acheté et rénové ce studio à Schaerbeek spécifiquement pour des étudiants. Étant moi-même jeune (39 ans), je comprends les besoins des étudiants : bon wifi, proximité des transports, loyer abordable. Je suis très disponible et je réponds rapidement aux messages. Mon objectif est de créer une bonne relation avec mon locataire et de l''accompagner pendant ses études. Je suis flexible et compréhensif, tant que le studio est bien entretenu et le loyer payé à temps.',
    ARRAY['trust', 'flexibility', 'communication', 'fairness', 'support'],
    ARRAY['respect', 'reliability', 'communication', 'care-for-property'],
    'casual', 'love-diversity',
    ARRAY['real-estate', 'technology', 'cycling', 'craft-beer'],
    ARRAY['cycling', 'technology', 'renovation'],
    true
  ) ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    landlord_type = EXCLUDED.landlord_type;

  -- ============================================================================
  -- OWNER #4 - SOPHIE VERMEULEN
  -- ============================================================================
  -- Coliving expert, 8 years, community-focused

  RAISE NOTICE '🏠 Creating Sophie Vermeulen (Owner)...';

  INSERT INTO user_profiles (
    user_id, user_type,
    first_name, last_name, date_of_birth, gender_identity,
    nationality, languages_spoken, current_city, current_country,
    bio, profile_photo_url, phone_number,
    landlord_type, experience_years, portfolio_size, management_type,
    primary_motivation, availability_for_visits,
    iban, bic_swift, account_holder_name, billing_address,
    payment_frequency, currency,
    accepts_short_term_leases, minimum_lease_duration_months,
    required_tenant_documents, guarantor_required,
    minimum_income_ratio, credit_score_check_required,
    deposit_amount_months, pets_allowed_policy,
    maintenance_responsibility,
    tenant_selection_style, preferred_tenant_types,
    communication_preference, response_time_hours,
    review_visibility_consent,
    about_me, core_values, important_qualities,
    communication_style, cultural_openness,
    interests, hobbies,
    has_property
  ) VALUES (
    sophie_v_id, 'owner',
    'Sophie', 'Vermeulen', '1980-12-03', 'female',
    'Belgian', ARRAY['Nederlands', 'Français', 'English', 'Deutsch'], 'Brussels', 'Belgium',
    'Spécialiste coliving depuis 8 ans. Grande maison communautaire à Forest avec jardin. Je crée des espaces de vie où les gens se sentent chez eux et font partie d''une vraie communauté. Ambiance internationale et conviviale.',
    'https://i.pravatar.cc/400?img=38', '+32 478 44 55 66',
    'individual', 8, 2, 'self-managed',
    'community', 'flexible',
    'BE43 0689 1234 5678', 'GKCCBEBB', 'Sophie Vermeulen', 'Avenue Besme 89, 1190 Forest, Belgium',
    'monthly', 'EUR',
    false, 3,
    ARRAY['ID card', 'Proof of income', 'Motivation letter', 'References'],
    false, 3.0, false, 1.0, true, 'shared',
    'best-match', ARRAY['international-students', 'expats', 'digital-nomads', 'young-professionals'],
    'whatsapp', 8, true,
    'Je suis Sophie, passionnée de coliving depuis 8 ans. J''ai transformé une magnifique maison de maître à Forest en un espace de coliving moderne et chaleureux pour 6 personnes. Ma philosophie : créer une vraie communauté où chacun se sent chez soi tout en partageant des moments avec les autres. J''organise des dîners communautaires mensuels, je facilite les échanges entre colocataires et je suis très présente pour accompagner la vie de la maison. J''adore la diversité culturelle et j''accueille des personnes du monde entier. Le jardin de 200m² est parfait pour les BBQ d''été ! Je cherche des personnes ouvertes, sociables et qui ont envie de faire partie d''une communauté.',
    ARRAY['community', 'diversity', 'openness', 'sharing', 'sustainability'],
    ARRAY['sociability', 'cultural-openness', 'respect', 'community-spirit', 'cleanliness'],
    'casual', 'love-diversity',
    ARRAY['community-building', 'sustainability', 'gardening', 'cooking', 'languages', 'travel'],
    ARRAY['gardening', 'cooking', 'travel', 'community-events'],
    true
  ) ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    landlord_type = EXCLUDED.landlord_type;

  RAISE NOTICE '✅ All 4 OWNERS created with maximum details!';

  -- ============================================================================
  -- RESIDENTS (Current roommates looking to match with searchers)
  -- ============================================================================

  -- ============================================================================
  -- RESIDENT #1 - PIERRE LECOMTE
  -- ============================================================================
  -- Civil Engineer, balanced lifestyle, cinema & cycling fan

  RAISE NOTICE '👥 Creating Pierre Lecomte (Resident)...';

  INSERT INTO user_profiles (
    user_id, user_type,
    first_name, last_name, date_of_birth, gender_identity,
    nationality, languages_spoken, current_city, current_country,
    bio, profile_photo_url, phone_number,
    occupation_status, field_of_study_or_work, institution_or_company,
    monthly_income_bracket, employment_type,
    wake_up_time, sleep_time, work_schedule, sports_frequency,
    is_smoker, drinks_alcohol, diet_type,
    cleanliness_preference, guest_frequency, music_habits,
    has_pets, cooking_frequency,
    introvert_extrovert_scale, sociability_level, openness_to_sharing,
    communication_style, cultural_openness, conflict_tolerance,
    interests, hobbies, values_priority,
    about_me, core_values, important_qualities, deal_breakers,
    event_interest, open_to_meetups,
    current_address, current_roommates_count
  ) VALUES (
    pierre_id, 'resident',
    'Pierre', 'Lecomte', '1993-07-20', 'male',
    'Belgian', ARRAY['Français', 'Nederlands', 'English'], 'Brussels', 'Belgium',
    'Ingénieur civil de 27 ans, calme et rangé. J''apprécie une vie en colocation équilibrée : convivial le weekend, tranquille en semaine. Passionné de cinéma, vélo et bonne bière belge.',
    'https://i.pravatar.cc/400?img=52', '+32 491 11 22 33',
    'employed', 'Civil Engineer', 'Tractebel Engineering',
    '2000-3000', 'full-time',
    'moderate', 'moderate', 'traditional',
    'once-week', false, 'socially', 'omnivore',
    'tidy', 'sometimes', 'low-volume',
    false, 'few-times',
    5, 6, 'moderate',
    'direct', 'moderate', 'medium',
    ARRAY['cinema', 'cycling', 'beer', 'cooking', 'technology', 'travel'],
    ARRAY['cinema', 'cycling', 'beer-tasting', 'cooking'],
    ARRAY['respect', 'balance', 'reliability', 'communication'],
    'Ingénieur civil travaillant dans l''énergie renouvelable. J''ai un bon équilibre vie pro/perso : sérieux en semaine pour le boulot, mais j''aime profiter du weekend. Fan de cinéma (je vais 2x/mois au cinéma), de vélo (je fais 100km le dimanche) et de bière belge (amateur de brasseries artisanales). En coloc, je suis assez discret en semaine mais j''apprécie les soirées ciné ou les apéros le weekend. Je cuisine régulièrement et j''aime partager mes plats. Plutôt rangé et organisé.',
    ARRAY['respect', 'balance', 'reliability', 'communication', 'authenticity'],
    ARRAY['respect', 'cleanliness', 'balance', 'reliability'],
    ARRAY['disrespect', 'extreme-messiness', 'constant-noise'],
    'medium', true,
    'Avenue de la Couronne 234, 1050 Ixelles', 1
  ) ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name;

  -- ============================================================================
  -- RESIDENT #2 - LAURA GONZALEZ
  -- ============================================================================
  -- PhD Student, studious, yoga lover, quiet lifestyle

  RAISE NOTICE '👥 Creating Laura Gonzalez (Resident)...';

  INSERT INTO user_profiles (
    user_id, user_type,
    first_name, last_name, date_of_birth, gender_identity,
    nationality, languages_spoken, current_city, current_country,
    bio, profile_photo_url, phone_number,
    occupation_status, field_of_study_or_work, institution_or_company,
    monthly_income_bracket, employment_type,
    wake_up_time, sleep_time, work_schedule, sports_frequency,
    is_smoker, drinks_alcohol, diet_type,
    cleanliness_preference, guest_frequency, music_habits,
    has_pets, cooking_frequency,
    introvert_extrovert_scale, sociability_level, openness_to_sharing,
    communication_style, cultural_openness, conflict_tolerance,
    interests, hobbies, values_priority,
    about_me, core_values, important_qualities, deal_breakers,
    event_interest, open_to_meetups,
    current_address, current_roommates_count
  ) VALUES (
    laura_id, 'resident',
    'Laura', 'Gonzalez', '1998-03-15', 'female',
    'Spanish', ARRAY['Español', 'English', 'Français'], 'Brussels', 'Belgium',
    'Doctorante en biologie à l''ULB, 26 ans. Studieuse et respectueuse, j''ai besoin d''un environnement calme pour ma recherche. Passionnée de yoga, lecture et art contemporain.',
    'https://i.pravatar.cc/400?img=45', '+32 492 22 33 44',
    'student', 'PhD Student in Biology', 'Université Libre de Bruxelles (ULB)',
    '1000-1500', 'part-time',
    'early', 'early', 'flexible',
    'few-times-week', false, 'never', 'vegan',
    'spotless', 'rarely', 'quiet',
    false, 'daily',
    2, 3, 'private',
    'diplomatic', 'love-diversity', 'low',
    ARRAY['science', 'yoga', 'books', 'art', 'sustainability', 'meditation'],
    ARRAY['yoga', 'reading', 'art', 'meditation'],
    ARRAY['respect', 'calm', 'sustainability', 'growth'],
    'Doctorante en biologie moléculaire, je consacre beaucoup de temps à ma recherche. J''ai besoin de calme pour me concentrer, surtout le soir et le weekend quand j''analyse mes résultats. Je suis végane et je cuisine tous mes repas avec des produits bio et locaux. Je pratique le yoga tous les matins (6h30-7h30) et la méditation le soir. J''aime lire (surtout des romans et essais scientifiques), visiter des expositions d''art et me promener dans la nature. Je suis introspective et calme, mais j''apprécie les conversations profondes autour d''un thé. Je cherche des colocataires qui respectent le besoin de tranquillité et qui partagent des valeurs de respect et durabilité.',
    ARRAY['respect', 'calm', 'sustainability', 'personal-growth', 'mindfulness'],
    ARRAY['respect-for-quiet', 'cleanliness', 'mindfulness', 'sustainability'],
    ARRAY['smoking', 'loud-noise', 'messiness', 'lack-of-respect'],
    'low', false,
    'Avenue Besme 89, 1190 Forest', 5
  ) ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name;

  -- ============================================================================
  -- RESIDENT #3 - MAXIME DUBOIS
  -- ============================================================================
  -- Software Developer in startup, dynamic, social, tech-savvy

  RAISE NOTICE '👥 Creating Maxime Dubois (Resident)...';

  INSERT INTO user_profiles (
    user_id, user_type,
    first_name, last_name, date_of_birth, gender_identity,
    nationality, languages_spoken, current_city, current_country,
    bio, profile_photo_url, phone_number,
    occupation_status, field_of_study_or_work, institution_or_company,
    monthly_income_bracket, employment_type,
    wake_up_time, sleep_time, work_schedule, sports_frequency,
    is_smoker, drinks_alcohol, diet_type,
    cleanliness_preference, guest_frequency, music_habits,
    has_pets, cooking_frequency,
    introvert_extrovert_scale, sociability_level, openness_to_sharing,
    communication_style, cultural_openness, conflict_tolerance,
    interests, hobbies, values_priority,
    about_me, core_values, important_qualities, deal_breakers,
    event_interest, open_to_meetups,
    current_address, current_roommates_count
  ) VALUES (
    maxime_id, 'resident',
    'Maxime', 'Dubois', '1996-11-28', 'male',
    'French', ARRAY['Français', 'English'], 'Brussels', 'Belgium',
    'Développeur dans une startup tech à Bruxelles, 25 ans. Dynamique, sociable et passionné de technologie. J''aime les colocations animées, les soirées jeux et découvrir de nouveaux bars.',
    'https://i.pravatar.cc/400?img=68', '+32 493 33 44 55',
    'employed', 'Software Developer', 'TechStart Brussels',
    '2000-3000', 'full-time',
    'late', 'late', 'flexible',
    'few-times-week', false, 'socially', 'omnivore',
    'moderate', 'often', 'moderate',
    false, 'once-week',
    7, 8, 'very-open',
    'casual', 'love-diversity', 'high',
    ARRAY['tech', 'nightlife', 'sports', 'travel', 'gaming', 'startups', 'networking'],
    ARRAY['tech', 'gaming', 'nightlife', 'sports'],
    ARRAY['fun', 'innovation', 'openness', 'adventure'],
    'Dev fullstack dans une startup en pleine croissance. Je bosse dur en semaine (beaucoup de remote) mais j''aime profiter de la vie le soir et le weekend ! Fan de tech, gaming (PC master race), padel et afterworks. J''organise souvent des soirées à la maison : apéros, FIFA, karaoké... J''aime que ça bouge ! Je suis très social et j''adore rencontrer de nouvelles personnes. En coloc, je suis du genre à proposer des sorties, inviter mes potes, cuisiner des gros plats pour tout le monde. Je cherche des colocataires qui ont la même énergie et qui aiment profiter de Bruxelles. Startup life = jamais routinier !',
    ARRAY['fun', 'innovation', 'openness', 'adventure', 'authenticity'],
    ARRAY['sociability', 'openness', 'fun-loving', 'energy'],
    ARRAY['boring', 'judgmental', 'too-serious', 'no-social-life'],
    'high', true,
    'Avenue Besme 89, 1190 Forest', 5
  ) ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name;

  RAISE NOTICE '✅ All 3 RESIDENTS created with maximum details!';

  -- ============================================================================
  -- FINAL SUMMARY
  -- ============================================================================

  RAISE NOTICE '==================================================================';
  RAISE NOTICE '✅ ALL PROFILES ENRICHED WITH MAXIMUM DETAILS!';
  RAISE NOTICE '==================================================================';
  RAISE NOTICE '5 SEARCHERS: Sophie, Ahmed, Emma, Lucas, Maria';
  RAISE NOTICE '4 OWNERS: Jean-Marc, Isabelle, Thomas, Sophie V.';
  RAISE NOTICE '3 RESIDENTS: Pierre, Laura, Maxime';
  RAISE NOTICE '==================================================================';

END $$;

-- Cleanup
DROP FUNCTION IF EXISTS create_demo_user(TEXT, TEXT);

-- Final Verification
SELECT
  user_type,
  COUNT(*) as count,
  string_agg(first_name || ' ' || last_name, ', ') as names
FROM user_profiles
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@demo.easyco.com'
)
GROUP BY user_type
ORDER BY user_type;

SELECT '✅ ENRICHED SEED COMPLETE!' as status;
