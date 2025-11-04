-- ============================================================================
-- SCRIPT RAPIDE: Ajouter les données multi-room à la première propriété
-- ============================================================================
-- Ce script trouve automatiquement une propriété et ajoute toutes les données

-- Étape 1: Trouver l'ID de la propriété "Coliving Forest" (ou la première dispo)
DO $$
DECLARE
  v_property_id UUID;
BEGIN
  -- Essayer de trouver "Coliving Forest", sinon prendre la première propriété
  SELECT id INTO v_property_id
  FROM properties
  WHERE title ILIKE '%Forest%' OR title ILIKE '%Coliving%'
  ORDER BY created_at DESC
  LIMIT 1;

  -- Si aucune trouvée, prendre la première propriété
  IF v_property_id IS NULL THEN
    SELECT id INTO v_property_id
    FROM properties
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;

  -- Vérifier qu'on a bien une propriété
  IF v_property_id IS NULL THEN
    RAISE EXCEPTION 'Aucune propriété trouvée dans la base de données';
  END IF;

  RAISE NOTICE 'Propriété sélectionnée: %', v_property_id;

  -- ============================================================================
  -- Supprimer les données existantes pour cette propriété (pour réessayer)
  -- ============================================================================
  DELETE FROM property_rooms WHERE property_id = v_property_id;
  DELETE FROM property_costs WHERE property_id = v_property_id;
  DELETE FROM property_lifestyle_metrics WHERE property_id = v_property_id;

  -- ============================================================================
  -- Insérer les 6 chambres
  -- ============================================================================
  INSERT INTO property_rooms (property_id, room_number, room_name, description, price, size_sqm, floor_number, has_private_bathroom, has_balcony, has_desk, has_wardrobe, is_furnished, window_view, is_available, available_from, features)
  VALUES
    (v_property_id, 1, 'Chambre Zen', 'Grande chambre lumineuse avec salle de bain privée et vue sur le jardin', 650.00, 18.5, 1, true, true, true, true, true, 'garden', true, '2025-02-01', ARRAY['Double vitrage', 'Placard intégré', 'Lumineux']),
    (v_property_id, 2, 'Chambre Cosy', 'Chambre confortable avec vue sur la cour intérieure', 550.00, 14.0, 1, false, false, true, true, true, 'courtyard', true, '2025-01-15', ARRAY['Calme', 'Fonctionnel']),
    (v_property_id, 3, 'Chambre Studio', 'Chambre compacte idéale pour étudiant', 480.00, 12.0, 2, false, false, true, true, true, 'street', true, NOW(), ARRAY['Disponible immédiatement', 'Économique']),
    (v_property_id, 4, 'Chambre Lumière', 'Chambre spacieuse avec grand balcon', 590.00, 15.5, 2, false, true, true, true, true, 'street', false, NULL, ARRAY['Balcon', 'Lumineux']),
    (v_property_id, 5, 'Chambre Nature', 'Chambre calme avec salle de bain privée', 620.00, 16.0, 1, true, false, true, true, true, 'garden', true, '2025-03-01', ARRAY['Salle de bain privée', 'Vue jardin']),
    (v_property_id, 6, 'Chambre Harmonie', 'Chambre fonctionnelle au dernier étage', 570.00, 14.5, 2, false, false, true, true, true, 'courtyard', true, '2025-02-15', ARRAY['Calme', 'Rangements']);

  RAISE NOTICE 'Chambres insérées: 6';

  -- ============================================================================
  -- Insérer les coûts détaillés
  -- ============================================================================
  INSERT INTO property_costs (
    property_id,
    utilities_total, utilities_electricity, utilities_water, utilities_heating, utilities_internet, utilities_trash,
    shared_living_total, shared_living_cleaning_service, shared_living_wifi, shared_living_cleaning_supplies, shared_living_groceries, shared_living_maintenance,
    deposit, agency_fee
  ) VALUES (
    v_property_id,
    80.00, 25.00, 15.00, 30.00, 0.00, 10.00,  -- Utilities: 80€
    50.00, 20.00, 15.00, 5.00, 10.00, 0.00,   -- Shared living: 50€
    650.00, 300.00                             -- Deposit & fees
  );

  RAISE NOTICE 'Coûts insérés';

  -- ============================================================================
  -- Insérer les métriques lifestyle
  -- ============================================================================
  INSERT INTO property_lifestyle_metrics (
    property_id,
    party_vibe, cleanliness, noise_level, social_interaction,
    smoking_allowed, pets_allowed, guests_allowed,
    shared_meals_frequency, common_space_usage
  ) VALUES (
    v_property_id,
    4, 8, 3, 6,              -- Scores: calme, très propre, peu bruyant, modérément social
    false, true, true,        -- Pas de fumeurs, animaux OK, invités OK
    'sometimes', 'medium'     -- Repas partagés parfois, usage modéré des espaces
  );

  RAISE NOTICE 'Métriques lifestyle insérées';

  -- ============================================================================
  -- Afficher un résumé
  -- ============================================================================
  RAISE NOTICE '✅ Données ajoutées avec succès!';
  RAISE NOTICE 'Propriété ID: %', v_property_id;
  RAISE NOTICE 'Chambres: 6 (3 disponibles immédiatement)';
  RAISE NOTICE 'Prix: de 480€ à 650€/mois';
  RAISE NOTICE 'Charges: 80€ + Vie commune: 50€';
  RAISE NOTICE 'Total: de 610€ à 780€/mois';

END $$;

-- ============================================================================
-- Vérification: Afficher les chambres avec coûts totaux
-- ============================================================================
SELECT
  p.title as propriete,
  r.room_name as chambre,
  r.price as loyer,
  c.utilities_total as charges,
  c.shared_living_total as vie_commune,
  (r.price + c.utilities_total + c.shared_living_total) as total_mensuel,
  CASE
    WHEN r.is_available THEN '✅ Disponible'
    ELSE '❌ Occupée'
  END as statut,
  TO_CHAR(r.available_from, 'DD/MM/YYYY') as dispo_depuis
FROM property_rooms r
JOIN properties p ON r.property_id = p.id
JOIN property_costs c ON r.property_id = c.property_id
WHERE p.title ILIKE '%Forest%' OR p.title ILIKE '%Coliving%'
ORDER BY r.room_number;
