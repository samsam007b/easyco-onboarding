-- ============================================
-- SEED VISIT AVAILABILITY - DONNÉES DE DÉMO
-- ============================================
-- Ce script ajoute des disponibilités de visite pour toutes les propriétés
-- existantes afin de pouvoir tester le système de booking
-- ============================================

-- ============================================
-- 1. AJOUTER DES DISPONIBILITÉS POUR TOUTES LES PROPRIÉTÉS
-- ============================================
-- Crée des disponibilités par défaut pour chaque propriétaire
-- Du lundi au vendredi: 9h-12h et 14h-18h
-- Samedi: 10h-16h

-- Disponibilités Lundi (day_of_week = 1)
INSERT INTO visit_availability (property_id, owner_id, day_of_week, start_time, end_time, is_available, notes, max_visits_per_day, buffer_minutes)
SELECT
  p.id as property_id,
  p.owner_id,
  1 as day_of_week, -- Lundi
  '09:00'::TIME as start_time,
  '12:00'::TIME as end_time,
  true as is_available,
  'Disponible le matin' as notes,
  5 as max_visits_per_day,
  15 as buffer_minutes
FROM properties p
WHERE NOT EXISTS (
  SELECT 1 FROM visit_availability va
  WHERE va.property_id = p.id AND va.day_of_week = 1
);

INSERT INTO visit_availability (property_id, owner_id, day_of_week, start_time, end_time, is_available, notes, max_visits_per_day, buffer_minutes)
SELECT
  p.id as property_id,
  p.owner_id,
  1 as day_of_week, -- Lundi
  '14:00'::TIME as start_time,
  '18:00'::TIME as end_time,
  true as is_available,
  'Disponible l''après-midi' as notes,
  5 as max_visits_per_day,
  15 as buffer_minutes
FROM properties p
WHERE NOT EXISTS (
  SELECT 1 FROM visit_availability va
  WHERE va.property_id = p.id AND va.day_of_week = 1 AND va.start_time = '14:00'::TIME
);

-- Disponibilités Mardi (day_of_week = 2)
INSERT INTO visit_availability (property_id, owner_id, day_of_week, start_time, end_time, is_available, notes, max_visits_per_day, buffer_minutes)
SELECT
  p.id as property_id,
  p.owner_id,
  2 as day_of_week,
  '09:00'::TIME as start_time,
  '12:00'::TIME as end_time,
  true as is_available,
  'Disponible le matin' as notes,
  5 as max_visits_per_day,
  15 as buffer_minutes
FROM properties p
WHERE NOT EXISTS (
  SELECT 1 FROM visit_availability va
  WHERE va.property_id = p.id AND va.day_of_week = 2
);

INSERT INTO visit_availability (property_id, owner_id, day_of_week, start_time, end_time, is_available, notes, max_visits_per_day, buffer_minutes)
SELECT
  p.id as property_id,
  p.owner_id,
  2 as day_of_week,
  '14:00'::TIME as start_time,
  '18:00'::TIME as end_time,
  true as is_available,
  'Disponible l''après-midi' as notes,
  5 as max_visits_per_day,
  15 as buffer_minutes
FROM properties p
WHERE NOT EXISTS (
  SELECT 1 FROM visit_availability va
  WHERE va.property_id = p.id AND va.day_of_week = 2 AND va.start_time = '14:00'::TIME
);

-- Disponibilités Mercredi (day_of_week = 3)
INSERT INTO visit_availability (property_id, owner_id, day_of_week, start_time, end_time, is_available, notes, max_visits_per_day, buffer_minutes)
SELECT
  p.id as property_id,
  p.owner_id,
  3 as day_of_week,
  '09:00'::TIME as start_time,
  '12:00'::TIME as end_time,
  true as is_available,
  'Disponible le matin' as notes,
  5 as max_visits_per_day,
  15 as buffer_minutes
FROM properties p
WHERE NOT EXISTS (
  SELECT 1 FROM visit_availability va
  WHERE va.property_id = p.id AND va.day_of_week = 3
);

INSERT INTO visit_availability (property_id, owner_id, day_of_week, start_time, end_time, is_available, notes, max_visits_per_day, buffer_minutes)
SELECT
  p.id as property_id,
  p.owner_id,
  3 as day_of_week,
  '14:00'::TIME as start_time,
  '18:00'::TIME as end_time,
  true as is_available,
  'Disponible l''après-midi' as notes,
  5 as max_visits_per_day,
  15 as buffer_minutes
FROM properties p
WHERE NOT EXISTS (
  SELECT 1 FROM visit_availability va
  WHERE va.property_id = p.id AND va.day_of_week = 3 AND va.start_time = '14:00'::TIME
);

-- Disponibilités Jeudi (day_of_week = 4)
INSERT INTO visit_availability (property_id, owner_id, day_of_week, start_time, end_time, is_available, notes, max_visits_per_day, buffer_minutes)
SELECT
  p.id as property_id,
  p.owner_id,
  4 as day_of_week,
  '09:00'::TIME as start_time,
  '12:00'::TIME as end_time,
  true as is_available,
  'Disponible le matin' as notes,
  5 as max_visits_per_day,
  15 as buffer_minutes
FROM properties p
WHERE NOT EXISTS (
  SELECT 1 FROM visit_availability va
  WHERE va.property_id = p.id AND va.day_of_week = 4
);

INSERT INTO visit_availability (property_id, owner_id, day_of_week, start_time, end_time, is_available, notes, max_visits_per_day, buffer_minutes)
SELECT
  p.id as property_id,
  p.owner_id,
  4 as day_of_week,
  '14:00'::TIME as start_time,
  '18:00'::TIME as end_time,
  true as is_available,
  'Disponible l''après-midi' as notes,
  5 as max_visits_per_day,
  15 as buffer_minutes
FROM properties p
WHERE NOT EXISTS (
  SELECT 1 FROM visit_availability va
  WHERE va.property_id = p.id AND va.day_of_week = 4 AND va.start_time = '14:00'::TIME
);

-- Disponibilités Vendredi (day_of_week = 5)
INSERT INTO visit_availability (property_id, owner_id, day_of_week, start_time, end_time, is_available, notes, max_visits_per_day, buffer_minutes)
SELECT
  p.id as property_id,
  p.owner_id,
  5 as day_of_week,
  '09:00'::TIME as start_time,
  '12:00'::TIME as end_time,
  true as is_available,
  'Disponible le matin' as notes,
  5 as max_visits_per_day,
  15 as buffer_minutes
FROM properties p
WHERE NOT EXISTS (
  SELECT 1 FROM visit_availability va
  WHERE va.property_id = p.id AND va.day_of_week = 5
);

INSERT INTO visit_availability (property_id, owner_id, day_of_week, start_time, end_time, is_available, notes, max_visits_per_day, buffer_minutes)
SELECT
  p.id as property_id,
  p.owner_id,
  5 as day_of_week,
  '14:00'::TIME as start_time,
  '18:00'::TIME as end_time,
  true as is_available,
  'Disponible l''après-midi' as notes,
  5 as max_visits_per_day,
  15 as buffer_minutes
FROM properties p
WHERE NOT EXISTS (
  SELECT 1 FROM visit_availability va
  WHERE va.property_id = p.id AND va.day_of_week = 5 AND va.start_time = '14:00'::TIME
);

-- Disponibilités Samedi (day_of_week = 6) - Journée continue
INSERT INTO visit_availability (property_id, owner_id, day_of_week, start_time, end_time, is_available, notes, max_visits_per_day, buffer_minutes)
SELECT
  p.id as property_id,
  p.owner_id,
  6 as day_of_week,
  '10:00'::TIME as start_time,
  '16:00'::TIME as end_time,
  true as is_available,
  'Disponible toute la journée' as notes,
  8 as max_visits_per_day,
  15 as buffer_minutes
FROM properties p
WHERE NOT EXISTS (
  SELECT 1 FROM visit_availability va
  WHERE va.property_id = p.id AND va.day_of_week = 6
);

-- ============================================
-- 2. VÉRIFICATION DES DISPONIBILITÉS CRÉÉES
-- ============================================

-- Compter les disponibilités par propriété
SELECT
  p.id,
  p.title,
  p.city,
  COUNT(va.id) as availability_count,
  u.full_name as owner_name
FROM properties p
LEFT JOIN visit_availability va ON va.property_id = p.id
LEFT JOIN users u ON u.id = p.owner_id
GROUP BY p.id, p.title, p.city, u.full_name
ORDER BY availability_count DESC, p.title;

-- Détail des disponibilités par jour de la semaine
SELECT
  p.title as property,
  p.city,
  CASE va.day_of_week
    WHEN 0 THEN 'Dimanche'
    WHEN 1 THEN 'Lundi'
    WHEN 2 THEN 'Mardi'
    WHEN 3 THEN 'Mercredi'
    WHEN 4 THEN 'Jeudi'
    WHEN 5 THEN 'Vendredi'
    WHEN 6 THEN 'Samedi'
  END as day_name,
  va.start_time,
  va.end_time,
  va.notes
FROM properties p
JOIN visit_availability va ON va.property_id = p.id
ORDER BY p.title, va.day_of_week, va.start_time;

-- ============================================
-- 3. CRÉER QUELQUES VISITES DE DÉMO (OPTIONNEL)
-- ============================================
-- Décommentez cette section si vous voulez créer des visites de test
-- ATTENTION: Remplacez les UUIDs par de vraies valeurs de votre DB

/*
-- Exemple: Créer une visite de démo
INSERT INTO property_visits (
  property_id,
  visitor_id,
  owner_id,
  scheduled_at,
  duration_minutes,
  visit_type,
  status,
  visitor_notes,
  visitor_phone,
  visitor_email
)
SELECT
  p.id as property_id,
  (SELECT id FROM users WHERE user_type = 'searcher' LIMIT 1) as visitor_id,
  p.owner_id,
  (NOW() + INTERVAL '3 days')::DATE + TIME '10:00' as scheduled_at,
  30 as duration_minutes,
  'in_person' as visit_type,
  'pending' as status,
  'Très intéressé par cette propriété!' as visitor_notes,
  '+32 123 456 789' as visitor_phone,
  'demo@example.com' as visitor_email
FROM properties p
LIMIT 1;
*/

-- ============================================
-- 4. STATISTIQUES FINALES
-- ============================================

SELECT
  '📊 STATISTIQUES APRÈS SEED' as summary,
  (SELECT COUNT(DISTINCT property_id) FROM visit_availability) as properties_with_availability,
  (SELECT COUNT(*) FROM visit_availability) as total_availability_slots,
  (SELECT COUNT(*) FROM property_visits) as total_visits_booked;

-- ============================================
-- FIN DU SCRIPT
-- ============================================
-- ✅ Les propriétés ont maintenant des disponibilités de visite!
--
-- Disponibilités créées:
-- - Lundi à Vendredi: 9h-12h et 14h-18h
-- - Samedi: 10h-16h
-- - Dimanche: Pas de disponibilités
--
-- Vous pouvez maintenant tester le booking de visite dans l'app!
-- ============================================
