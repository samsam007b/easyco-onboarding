-- ============================================================================
-- ÉTAPE 2: PEUPLER 5 PROPRIÉTÉS AVEC DES PROFILS TRÈS DIFFÉRENTS
-- ============================================================================
-- Pour tester l'algorithme de matching, chaque propriété a un profil unique

-- D'abord, on va récupérer les IDs des 5 premières propriétés
DO $$
DECLARE
  property_ids UUID[];
  prop1_id UUID;
  prop2_id UUID;
  prop3_id UUID;
  prop4_id UUID;
  prop5_id UUID;
BEGIN
  -- Récupérer les IDs des 5 premières propriétés
  SELECT ARRAY_AGG(id ORDER BY created_at DESC)
  INTO property_ids
  FROM properties
  LIMIT 5;

  -- Si on n'a pas 5 propriétés, on s'arrête
  IF ARRAY_LENGTH(property_ids, 1) < 5 THEN
    RAISE EXCEPTION 'Pas assez de propriétés! Il faut au moins 5 propriétés dans la base.';
  END IF;

  prop1_id := property_ids[1];
  prop2_id := property_ids[2];
  prop3_id := property_ids[3];
  prop4_id := property_ids[4];
  prop5_id := property_ids[5];

  -- ========================================================================
  -- PROPRIÉTÉ 1: "Party House" - Ambiance festive, jeunes, social
  -- ========================================================================

  -- Chambres (5 chambres, prix variés)
  INSERT INTO property_rooms (property_id, room_number, price, is_available, available_from, has_private_bathroom, has_balcony, size_sqm) VALUES
  (prop1_id, 1, 550.00, true, '2025-12-01', false, true, 14.5),
  (prop1_id, 2, 620.00, true, '2025-12-15', true, true, 18.0),
  (prop1_id, 3, 480.00, false, '2026-02-01', false, false, 12.0),
  (prop1_id, 4, 590.00, true, '2025-11-20', false, true, 15.5),
  (prop1_id, 5, 700.00, true, '2025-12-01', true, true, 22.0);

  -- Coûts (charges élevées, vie commune active)
  INSERT INTO property_costs (
    property_id,
    utilities_total, utilities_electricity, utilities_water, utilities_heating, utilities_internet,
    shared_living_total, shared_living_cleaning_service, shared_living_groceries, shared_living_maintenance,
    deposit
  ) VALUES (
    prop1_id,
    95.00, 35.00, 15.00, 30.00, 15.00,
    85.00, 40.00, 30.00, 15.00,
    1100.00
  );

  -- Lifestyle (TRÈS social, festif, bruyant)
  INSERT INTO property_lifestyle_metrics (
    property_id, party_vibe, cleanliness, noise_level, social_interaction,
    smoking_allowed, pets_allowed, guests_allowed,
    shared_meals_frequency, common_space_usage
  ) VALUES (
    prop1_id, 9, 5, 8, 9,
    true, false, true,
    'often', 'high'
  );

  -- ========================================================================
  -- PROPRIÉTÉ 2: "Zen House" - Calme, propre, studieux
  -- ========================================================================

  INSERT INTO property_rooms (property_id, room_number, price, is_available, available_from, has_private_bathroom, has_balcony, size_sqm) VALUES
  (prop2_id, 1, 680.00, true, '2025-11-15', true, false, 16.0),
  (prop2_id, 2, 720.00, true, '2025-12-01', true, true, 19.0),
  (prop2_id, 3, 650.00, false, '2026-01-01', false, false, 14.0),
  (prop2_id, 4, 700.00, true, '2025-11-25', true, false, 17.5);

  INSERT INTO property_costs (
    property_id,
    utilities_total, utilities_electricity, utilities_water, utilities_heating, utilities_internet,
    shared_living_total, shared_living_cleaning_service, shared_living_cleaning_supplies, shared_living_maintenance,
    deposit
  ) VALUES (
    prop2_id,
    75.00, 25.00, 12.00, 25.00, 13.00,
    60.00, 50.00, 5.00, 5.00,
    1400.00
  );

  INSERT INTO property_lifestyle_metrics (
    property_id, party_vibe, cleanliness, noise_level, social_interaction,
    smoking_allowed, pets_allowed, guests_allowed,
    shared_meals_frequency, common_space_usage
  ) VALUES (
    prop2_id, 2, 10, 2, 4,
    false, false, false,
    'rarely', 'low'
  );

  -- ========================================================================
  -- PROPRIÉTÉ 3: "Family House" - Équilibré, familial, animaux ok
  -- ========================================================================

  INSERT INTO property_rooms (property_id, room_number, price, is_available, available_from, has_private_bathroom, has_balcony, size_sqm) VALUES
  (prop3_id, 1, 600.00, true, '2025-12-10', false, true, 15.0),
  (prop3_id, 2, 650.00, true, '2025-11-30', true, true, 18.5),
  (prop3_id, 3, 580.00, true, '2025-12-15', false, false, 13.5),
  (prop3_id, 4, 670.00, false, '2026-01-15', true, true, 20.0),
  (prop3_id, 5, 620.00, true, '2025-12-05', false, true, 16.0),
  (prop3_id, 6, 690.00, true, '2025-12-01', true, false, 19.5);

  INSERT INTO property_costs (
    property_id,
    utilities_total, utilities_electricity, utilities_water, utilities_heating, utilities_internet,
    shared_living_total, shared_living_cleaning_service, shared_living_groceries, shared_living_maintenance,
    deposit
  ) VALUES (
    prop3_id,
    80.00, 30.00, 13.00, 25.00, 12.00,
    70.00, 30.00, 25.00, 15.00,
    1200.00
  );

  INSERT INTO property_lifestyle_metrics (
    property_id, party_vibe, cleanliness, noise_level, social_interaction,
    smoking_allowed, pets_allowed, guests_allowed,
    shared_meals_frequency, common_space_usage
  ) VALUES (
    prop3_id, 5, 7, 5, 6,
    false, true, true,
    'sometimes', 'medium'
  );

  -- ========================================================================
  -- PROPRIÉTÉ 4: "Professional House" - Professionnel, moderne, luxueux
  -- ========================================================================

  INSERT INTO property_rooms (property_id, room_number, price, is_available, available_from, has_private_bathroom, has_balcony, size_sqm) VALUES
  (prop4_id, 1, 850.00, true, '2025-11-20', true, true, 22.0),
  (prop4_id, 2, 920.00, true, '2025-12-01', true, true, 25.0),
  (prop4_id, 3, 800.00, false, '2026-01-01', true, false, 20.0);

  INSERT INTO property_costs (
    property_id,
    utilities_total, utilities_electricity, utilities_water, utilities_heating, utilities_internet,
    shared_living_total, shared_living_cleaning_service, shared_living_wifi, shared_living_maintenance,
    deposit
  ) VALUES (
    prop4_id,
    100.00, 40.00, 15.00, 30.00, 15.00,
    90.00, 60.00, 20.00, 10.00,
    1800.00
  );

  INSERT INTO property_lifestyle_metrics (
    property_id, party_vibe, cleanliness, noise_level, social_interaction,
    smoking_allowed, pets_allowed, guests_allowed,
    shared_meals_frequency, common_space_usage
  ) VALUES (
    prop4_id, 3, 9, 3, 5,
    false, false, true,
    'rarely', 'medium'
  );

  -- ========================================================================
  -- PROPRIÉTÉ 5: "Student House" - Étudiant, budget, décontracté
  -- ========================================================================

  INSERT INTO property_rooms (property_id, room_number, price, is_available, available_from, has_private_bathroom, has_balcony, size_sqm) VALUES
  (prop5_id, 1, 420.00, true, '2025-12-01', false, false, 11.0),
  (prop5_id, 2, 450.00, true, '2025-11-25', false, true, 12.5),
  (prop5_id, 3, 480.00, false, '2026-01-15', false, false, 13.0),
  (prop5_id, 4, 440.00, true, '2025-12-10', false, true, 11.5),
  (prop5_id, 5, 500.00, true, '2025-12-01', true, true, 15.0);

  INSERT INTO property_costs (
    property_id,
    utilities_total, utilities_electricity, utilities_water, utilities_heating, utilities_internet,
    shared_living_total, shared_living_groceries, shared_living_maintenance,
    deposit
  ) VALUES (
    prop5_id,
    65.00, 25.00, 10.00, 20.00, 10.00,
    45.00, 30.00, 15.00,
    800.00
  );

  INSERT INTO property_lifestyle_metrics (
    property_id, party_vibe, cleanliness, noise_level, social_interaction,
    smoking_allowed, pets_allowed, guests_allowed,
    shared_meals_frequency, common_space_usage
  ) VALUES (
    prop5_id, 7, 4, 7, 8,
    true, true, true,
    'daily', 'high'
  );

  RAISE NOTICE '✅ 5 propriétés peuplées avec succès!';
END $$;

-- Vérification finale
SELECT
  '✅ VÉRIFICATION FINALE' as check,
  p.id,
  p.title,
  (SELECT COUNT(*) FROM property_rooms WHERE property_id = p.id) as nb_chambres,
  (SELECT COUNT(*) FROM property_costs WHERE property_id = p.id) as nb_couts,
  (SELECT COUNT(*) FROM property_lifestyle_metrics WHERE property_id = p.id) as nb_metrics,
  (SELECT party_vibe FROM property_lifestyle_metrics WHERE property_id = p.id) as ambiance,
  (SELECT cleanliness FROM property_lifestyle_metrics WHERE property_id = p.id) as proprete,
  (SELECT MIN(price) FROM property_rooms WHERE property_id = p.id) as prix_min,
  (SELECT MAX(price) FROM property_rooms WHERE property_id = p.id) as prix_max
FROM properties p
ORDER BY created_at DESC
LIMIT 5;
