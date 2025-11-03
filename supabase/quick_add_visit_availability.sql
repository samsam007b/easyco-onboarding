-- ============================================
-- SCRIPT RAPIDE - Ajouter disponibilités aux propriétés
-- ============================================
-- Ce script ajoute des disponibilités pour TOUTES les propriétés
-- en une seule requête par jour de la semaine
-- ============================================

-- VERSION SIMPLE: Disponibilités identiques pour toutes les propriétés
-- Lundi à Samedi: 9h-18h (journée complète)

DO $$
DECLARE
  day_num INTEGER;
BEGIN
  -- Boucle pour chaque jour de la semaine (1=Lundi à 6=Samedi)
  FOR day_num IN 1..6 LOOP
    INSERT INTO visit_availability (property_id, owner_id, day_of_week, start_time, end_time, is_available, notes, max_visits_per_day, buffer_minutes)
    SELECT
      p.id as property_id,
      p.owner_id,
      day_num as day_of_week,
      '09:00'::TIME as start_time,
      '18:00'::TIME as end_time,
      true as is_available,
      'Disponible pour visites' as notes,
      10 as max_visits_per_day,
      15 as buffer_minutes
    FROM properties p
    WHERE NOT EXISTS (
      SELECT 1 FROM visit_availability va
      WHERE va.property_id = p.id AND va.day_of_week = day_num
    );
  END LOOP;

  RAISE NOTICE 'Disponibilités ajoutées pour toutes les propriétés (Lundi-Samedi, 9h-18h)';
END $$;

-- Vérification
SELECT
  '✅ Disponibilités créées' as status,
  COUNT(DISTINCT property_id) as properties_count,
  COUNT(*) as total_slots
FROM visit_availability;

-- Voir le détail
SELECT
  p.title,
  p.city,
  COUNT(va.id) as availability_slots
FROM properties p
LEFT JOIN visit_availability va ON va.property_id = p.id
GROUP BY p.id, p.title, p.city
ORDER BY availability_slots DESC;
