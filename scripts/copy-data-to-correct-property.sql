-- ============================================================================
-- COPIER LES DONNÉES VERS LA BONNE PROPRIÉTÉ IXELLES FLAGEY
-- ============================================================================

-- La propriété actuelle (celle que tu regardes): d454c7af-d15f-413e-8c81-5915300507b1
-- La propriété avec les données: 085f477f-6d5a-4e55-a2b8-683fddee7b89

-- 1. Supprimer les anciennes données de la propriété actuelle (au cas où)
DELETE FROM property_rooms WHERE property_id = 'd454c7af-d15f-413e-8c81-5915300507b1';
DELETE FROM property_costs WHERE property_id = 'd454c7af-d15f-413e-8c81-5915300507b1';
DELETE FROM property_lifestyle_metrics WHERE property_id = 'd454c7af-d15f-413e-8c81-5915300507b1';

-- 2. Copier les chambres vers la bonne propriété
INSERT INTO property_rooms (
  property_id, room_number, price, is_available,
  available_from, has_private_bathroom, has_balcony, size_sqm
)
SELECT
  'd454c7af-d15f-413e-8c81-5915300507b1' as property_id,
  room_number, price, is_available,
  available_from, has_private_bathroom, has_balcony, size_sqm
FROM property_rooms
WHERE property_id = '085f477f-6d5a-4e55-a2b8-683fddee7b89';

-- 3. Copier les coûts vers la bonne propriété
INSERT INTO property_costs (
  property_id,
  utilities_total, utilities_electricity, utilities_water, utilities_heating,
  utilities_gas, utilities_internet, utilities_trash, utilities_other,
  shared_living_total, shared_living_cleaning_service, shared_living_wifi,
  shared_living_cleaning_supplies, shared_living_groceries,
  shared_living_maintenance, shared_living_insurance, shared_living_other,
  deposit, agency_fee, admin_fee
)
SELECT
  'd454c7af-d15f-413e-8c81-5915300507b1' as property_id,
  utilities_total, utilities_electricity, utilities_water, utilities_heating,
  utilities_gas, utilities_internet, utilities_trash, utilities_other,
  shared_living_total, shared_living_cleaning_service, shared_living_wifi,
  shared_living_cleaning_supplies, shared_living_groceries,
  shared_living_maintenance, shared_living_insurance, shared_living_other,
  deposit, agency_fee, admin_fee
FROM property_costs
WHERE property_id = '085f477f-6d5a-4e55-a2b8-683fddee7b89';

-- 4. Copier les lifestyle metrics vers la bonne propriété
INSERT INTO property_lifestyle_metrics (
  property_id, party_vibe, cleanliness, noise_level,
  social_interaction, smoking_allowed, pets_allowed, guests_allowed,
  shared_meals_frequency, common_space_usage
)
SELECT
  'd454c7af-d15f-413e-8c81-5915300507b1' as property_id,
  party_vibe, cleanliness, noise_level,
  social_interaction, smoking_allowed, pets_allowed, guests_allowed,
  shared_meals_frequency, common_space_usage
FROM property_lifestyle_metrics
WHERE property_id = '085f477f-6d5a-4e55-a2b8-683fddee7b89';

-- 5. Supprimer les données de l'ancienne propriété (optionnel)
DELETE FROM property_rooms WHERE property_id = '085f477f-6d5a-4e55-a2b8-683fddee7b89';
DELETE FROM property_costs WHERE property_id = '085f477f-6d5a-4e55-a2b8-683fddee7b89';
DELETE FROM property_lifestyle_metrics WHERE property_id = '085f477f-6d5a-4e55-a2b8-683fddee7b89';

-- 6. Vérification finale
SELECT
  '✅ VÉRIFICATION FINALE' as status,
  p.title,
  (SELECT COUNT(*) FROM property_rooms WHERE property_id = p.id) as chambres,
  (SELECT COUNT(*) FROM property_costs WHERE property_id = p.id) as couts,
  (SELECT COUNT(*) FROM property_lifestyle_metrics WHERE property_id = p.id) as metrics
FROM properties p
WHERE p.id = 'd454c7af-d15f-413e-8c81-5915300507b1';
