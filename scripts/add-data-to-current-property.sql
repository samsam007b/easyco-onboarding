-- ============================================================================
-- AJOUTER LES DONNÉES À LA PROPRIÉTÉ ACTUELLE (Ixelles Flagey)
-- ============================================================================

DO $$
DECLARE
  v_property_id UUID;
BEGIN
  -- Trouver la propriété "Ixelles Flagey"
  SELECT id INTO v_property_id
  FROM properties
  WHERE title ILIKE '%Ixelles%' OR title ILIKE '%Flagey%'
  ORDER BY created_at DESC
  LIMIT 1;

  -- Si pas trouvée, prendre la première propriété disponible
  IF v_property_id IS NULL THEN
    SELECT id INTO v_property_id
    FROM properties
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;

  IF v_property_id IS NULL THEN
    RAISE EXCEPTION 'Aucune propriété trouvée';
  END IF;

  RAISE NOTICE 'Ajout des données à la propriété: %', v_property_id;

  -- Nettoyer les données existantes
  DELETE FROM property_rooms WHERE property_id = v_property_id;
  DELETE FROM property_costs WHERE property_id = v_property_id;
  DELETE FROM property_lifestyle_metrics WHERE property_id = v_property_id;

  -- Ajouter les 6 chambres
  INSERT INTO property_rooms (property_id, room_number, room_name, description, price, size_sqm, floor_number, has_private_bathroom, has_balcony, has_desk, has_wardrobe, is_furnished, window_view, is_available, available_from, features)
  VALUES
    (v_property_id, 1, 'Chambre Zen', 'Grande chambre lumineuse avec salle de bain privée', 650.00, 18.5, 1, true, true, true, true, true, 'garden', true, '2025-02-01', ARRAY['Double vitrage', 'Placard intégré']),
    (v_property_id, 2, 'Chambre Cosy', 'Chambre confortable avec vue sur cour', 550.00, 14.0, 1, false, false, true, true, true, 'courtyard', true, '2025-01-15', ARRAY['Calme', 'Fonctionnel']),
    (v_property_id, 3, 'Chambre Studio', 'Chambre compacte idéale pour étudiant', 480.00, 12.0, 2, false, false, true, true, true, 'street', true, NOW(), ARRAY['Disponible immédiatement']),
    (v_property_id, 4, 'Chambre Lumière', 'Chambre spacieuse avec balcon', 590.00, 15.5, 2, false, true, true, true, true, 'street', false, NULL, ARRAY['Balcon']),
    (v_property_id, 5, 'Chambre Nature', 'Chambre avec salle de bain privée', 620.00, 16.0, 1, true, false, true, true, true, 'garden', true, '2025-03-01', ARRAY['Salle de bain privée']),
    (v_property_id, 6, 'Chambre Harmonie', 'Chambre fonctionnelle', 570.00, 14.5, 2, false, false, true, true, true, 'courtyard', true, '2025-02-15', ARRAY['Calme']);

  -- Ajouter les coûts
  INSERT INTO property_costs (
    property_id,
    utilities_total, utilities_electricity, utilities_water, utilities_heating, utilities_internet, utilities_trash,
    shared_living_total, shared_living_cleaning_service, shared_living_wifi, shared_living_cleaning_supplies, shared_living_groceries,
    deposit, agency_fee
  ) VALUES (
    v_property_id,
    80.00, 25.00, 15.00, 30.00, 0.00, 10.00,
    50.00, 20.00, 15.00, 5.00, 10.00,
    650.00, 300.00
  );

  -- Ajouter les métriques lifestyle
  INSERT INTO property_lifestyle_metrics (
    property_id,
    party_vibe, cleanliness, noise_level, social_interaction,
    smoking_allowed, pets_allowed, guests_allowed,
    shared_meals_frequency, common_space_usage
  ) VALUES (
    v_property_id,
    4, 8, 3, 6,
    false, true, true,
    'sometimes', 'medium'
  );

  RAISE NOTICE '✅ Données ajoutées avec succès!';

END $$;

-- Vérifier
SELECT
  'Vérification' as info,
  (SELECT COUNT(*) FROM property_rooms WHERE property_id IN (SELECT id FROM properties WHERE title ILIKE '%Ixelles%' LIMIT 1)) as chambres,
  (SELECT COUNT(*) FROM property_costs WHERE property_id IN (SELECT id FROM properties WHERE title ILIKE '%Ixelles%' LIMIT 1)) as couts,
  (SELECT COUNT(*) FROM property_lifestyle_metrics WHERE property_id IN (SELECT id FROM properties WHERE title ILIKE '%Ixelles%' LIMIT 1)) as lifestyle;
