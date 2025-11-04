-- ============================================================================
-- SEED DATA FOR PROPERTY ROOMS SYSTEM (Coliving Forest Example)
-- ============================================================================
-- Ce script ajoute des données de test pour la propriété "Coliving Forest"
-- Remplace 'YOUR_PROPERTY_ID' par l'ID réel de la propriété

-- NOTE: Pour trouver ton property_id, exécute d'abord:
-- SELECT id, title FROM properties WHERE title LIKE '%Forest%';

-- ============================================================================
-- 1. Ajouter les chambres individuelles
-- ============================================================================
-- Chambre 1: Grande chambre avec salle de bain privée
INSERT INTO property_rooms (
  property_id,
  room_number,
  room_name,
  description,
  price,
  size_sqm,
  floor_number,
  has_private_bathroom,
  has_balcony,
  has_desk,
  has_wardrobe,
  is_furnished,
  window_view,
  is_available,
  available_from,
  features
) VALUES (
  'YOUR_PROPERTY_ID', -- ⚠️ REMPLACE PAR L'ID RÉEL
  1,
  'Chambre Zen',
  'Grande chambre lumineuse avec salle de bain privée et vue sur le jardin',
  650.00,
  18.5,
  1,
  true,  -- Salle de bain privée
  true,  -- Balcon
  true,  -- Bureau
  true,  -- Armoire
  true,  -- Meublé
  'garden',
  true,
  '2025-02-01',
  ARRAY['Double vitrage', 'Placard intégré', 'Lumineux']
);

-- Chambre 2: Chambre standard
INSERT INTO property_rooms (
  property_id,
  room_number,
  room_name,
  description,
  price,
  size_sqm,
  floor_number,
  has_private_bathroom,
  has_balcony,
  has_desk,
  has_wardrobe,
  is_furnished,
  window_view,
  is_available,
  available_from,
  features
) VALUES (
  'YOUR_PROPERTY_ID',
  2,
  'Chambre Cosy',
  'Chambre confortable avec vue sur la cour intérieure',
  550.00,
  14.0,
  1,
  false,
  false,
  true,
  true,
  true,
  'courtyard',
  true,
  '2025-01-15',
  ARRAY['Calme', 'Fonctionnel']
);

-- Chambre 3: Petite chambre économique
INSERT INTO property_rooms (
  property_id,
  room_number,
  room_name,
  description,
  price,
  size_sqm,
  floor_number,
  has_private_bathroom,
  has_balcony,
  has_desk,
  has_wardrobe,
  is_furnished,
  window_view,
  is_available,
  available_from,
  features
) VALUES (
  'YOUR_PROPERTY_ID',
  3,
  'Chambre Studio',
  'Chambre compacte idéale pour étudiant',
  480.00,
  12.0,
  2,
  false,
  false,
  true,
  true,
  true,
  'street',
  true,
  NOW(),
  ARRAY['Disponible immédiatement', 'Économique']
);

-- Chambres 4-6: Autres chambres
INSERT INTO property_rooms (
  property_id, room_number, room_name, price, size_sqm, floor_number,
  has_private_bathroom, has_balcony, is_furnished, is_available, available_from
) VALUES
  ('YOUR_PROPERTY_ID', 4, 'Chambre Lumière', 590.00, 15.5, 2, false, true, true, false, NULL),
  ('YOUR_PROPERTY_ID', 5, 'Chambre Nature', 620.00, 16.0, 1, true, false, true, true, '2025-03-01'),
  ('YOUR_PROPERTY_ID', 6, 'Chambre Harmonie', 570.00, 14.5, 2, false, false, true, true, '2025-02-15');

-- ============================================================================
-- 2. Ajouter les coûts détaillés
-- ============================================================================
INSERT INTO property_costs (
  property_id,

  -- Charges (utilities)
  utilities_total,
  utilities_electricity,
  utilities_water,
  utilities_heating,
  utilities_internet,
  utilities_trash,

  -- Vie commune (shared living)
  shared_living_total,
  shared_living_cleaning_service,
  shared_living_wifi,
  shared_living_cleaning_supplies,
  shared_living_groceries,
  shared_living_maintenance,

  -- Autres frais
  deposit,
  agency_fee
) VALUES (
  'YOUR_PROPERTY_ID',

  -- Charges: 80€ total
  80.00,
  25.00,  -- Électricité
  15.00,  -- Eau
  30.00,  -- Chauffage
  0.00,   -- Internet (inclus dans vie commune)
  10.00,  -- Ordures

  -- Vie commune: 50€ total
  50.00,
  20.00,  -- Femme de ménage
  15.00,  -- WiFi fibre
  5.00,   -- Produits ménagers
  10.00,  -- Courses communes (café, thé, etc.)
  0.00,   -- Maintenance

  -- Autres frais
  650.00,  -- Caution (1 mois de loyer moyen)
  300.00   -- Frais d'agence
);

-- ============================================================================
-- 3. Ajouter les métriques lifestyle
-- ============================================================================
INSERT INTO property_lifestyle_metrics (
  property_id,

  -- Scores d'ambiance (1-10)
  party_vibe,           -- 4/10 = Plutôt calme
  cleanliness,          -- 8/10 = Très propre
  noise_level,          -- 3/10 = Calme
  social_interaction,   -- 6/10 = Modérément social

  -- Règles
  smoking_allowed,
  pets_allowed,
  guests_allowed,

  -- Activités partagées
  shared_meals_frequency,
  common_space_usage
) VALUES (
  'YOUR_PROPERTY_ID',

  4,   -- Ambiance calme/festive
  8,   -- Propreté élevée
  3,   -- Niveau sonore bas
  6,   -- Interaction sociale modérée

  false,  -- Pas de fumeurs
  true,   -- Animaux acceptés
  true,   -- Invités bienvenus

  'sometimes',  -- Repas partagés parfois
  'medium'      -- Utilisation modérée des espaces communs
);

-- ============================================================================
-- 4. Vérification des données
-- ============================================================================
-- Exécute ces requêtes pour vérifier que tout est bien créé:

-- Voir toutes les chambres avec coûts totaux
SELECT
  room_name,
  price as loyer,
  utilities_total as charges,
  shared_living_total as vie_commune,
  total_monthly_cost as total_mensuel,
  is_available,
  available_from
FROM rooms_with_total_costs
WHERE property_id = 'YOUR_PROPERTY_ID'
ORDER BY room_number;

-- Voir la chambre la moins chère
SELECT * FROM get_cheapest_room('YOUR_PROPERTY_ID');

-- Voir les métriques lifestyle
SELECT
  party_vibe as ambiance,
  cleanliness as proprete,
  noise_level as bruit,
  social_interaction as social,
  smoking_allowed as fumeurs,
  pets_allowed as animaux
FROM property_lifestyle_metrics
WHERE property_id = 'YOUR_PROPERTY_ID';
