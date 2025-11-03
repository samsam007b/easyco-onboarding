-- ============================================
-- SCRIPT DE VÉRIFICATION - Migration 035
-- Visit Booking System
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor pour vérifier
-- que la migration s'est correctement appliquée
-- ============================================

-- ============================================
-- 1. VÉRIFICATION DES TABLES
-- ============================================

SELECT
  '✅ Tables créées' as verification,
  COUNT(*) as count,
  STRING_AGG(table_name, ', ') as tables
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('visit_time_slots', 'visit_availability', 'property_visits');
-- Attendu: count = 3

-- ============================================
-- 2. VÉRIFICATION DES COLONNES
-- ============================================

-- visit_time_slots
SELECT
  '✅ Colonnes visit_time_slots' as verification,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'visit_time_slots';
-- Attendu: 6 colonnes (id, slot_name, start_time, end_time, duration_minutes, is_active, created_at)

-- visit_availability
SELECT
  '✅ Colonnes visit_availability' as verification,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'visit_availability';
-- Attendu: 12 colonnes

-- property_visits
SELECT
  '✅ Colonnes property_visits' as verification,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'property_visits';
-- Attendu: 21 colonnes

-- ============================================
-- 3. VÉRIFICATION DES CRÉNEAUX HORAIRES
-- ============================================

SELECT
  '✅ Créneaux horaires insérés' as verification,
  COUNT(*) as total_slots,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_slots,
  MIN(start_time) as first_slot,
  MAX(end_time) as last_slot
FROM visit_time_slots;
-- Attendu: 20 slots actifs, 09:00 → 19:00

-- Détail des créneaux
SELECT
  slot_name,
  start_time,
  end_time,
  duration_minutes,
  is_active
FROM visit_time_slots
ORDER BY start_time;

-- ============================================
-- 4. VÉRIFICATION DES INDEXES
-- ============================================

SELECT
  '✅ Indexes créés' as verification,
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('visit_time_slots', 'visit_availability', 'property_visits')
ORDER BY tablename, indexname;
-- Attendu: Plusieurs indexes par table

-- ============================================
-- 5. VÉRIFICATION RLS (Row Level Security)
-- ============================================

SELECT
  '✅ RLS activé sur les tables' as verification,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('visit_time_slots', 'visit_availability', 'property_visits');
-- Attendu: rls_enabled = true pour les 3 tables

-- Voir les policies créées
SELECT
  '✅ Policies RLS' as verification,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('visit_time_slots', 'visit_availability', 'property_visits')
ORDER BY tablename, policyname;
-- Attendu: Plusieurs policies par table

-- ============================================
-- 6. VÉRIFICATION DES FONCTIONS
-- ============================================

SELECT
  '✅ Fonctions SQL créées' as verification,
  proname as function_name,
  prosrc as function_body_preview
FROM pg_proc
WHERE proname IN ('get_available_slots', 'is_slot_available', 'update_visit_timestamp',
                   'notify_new_visit_booking', 'notify_visit_confirmed')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
-- Attendu: 5 fonctions

-- Détail des fonctions avec leurs paramètres
SELECT
  routine_name,
  data_type as return_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('get_available_slots', 'is_slot_available');

-- ============================================
-- 7. VÉRIFICATION DES TRIGGERS
-- ============================================

SELECT
  '✅ Triggers créés' as verification,
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table IN ('property_visits', 'visit_availability')
ORDER BY event_object_table, trigger_name;
-- Attendu: 3 triggers (update_property_visits_timestamp, update_visit_availability_timestamp, on_visit_booking, on_visit_status_change)

-- ============================================
-- 8. VÉRIFICATION DE LA VUE
-- ============================================

SELECT
  '✅ Vue upcoming_visits' as verification,
  table_name,
  view_definition
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name = 'upcoming_visits';

-- ============================================
-- 9. TEST DES FONCTIONS
-- ============================================

-- Test 1: Vérifier que la fonction get_available_slots existe et fonctionne
-- (Remplacez 'test-property-id' par un vrai property_id de votre DB si vous en avez)
SELECT
  '🧪 Test get_available_slots()' as test,
  'Si cette requête retourne un résultat, la fonction existe' as note;

-- Exemple d'utilisation (à adapter avec un vrai property_id):
-- SELECT * FROM get_available_slots('uuid-property-id-ici', '2025-01-15');

-- Test 2: Vérifier que la fonction is_slot_available existe
SELECT
  '🧪 Test is_slot_available()' as test,
  'Si cette requête retourne un résultat, la fonction existe' as note;

-- Exemple d'utilisation (à adapter):
-- SELECT is_slot_available('uuid-property-id', '2025-01-15 10:00:00+00', 30);

-- ============================================
-- 10. VÉRIFICATION DES CONTRAINTES
-- ============================================

SELECT
  '✅ Contraintes (CHECK, FK)' as verification,
  conname as constraint_name,
  contype as constraint_type,
  conrelid::regclass as table_name
FROM pg_constraint
WHERE conrelid IN (
  'visit_time_slots'::regclass,
  'visit_availability'::regclass,
  'property_visits'::regclass
)
ORDER BY table_name, constraint_name;
-- Attendu: Contraintes CHECK sur statuts, types, et Foreign Keys

-- ============================================
-- 11. RÉSUMÉ FINAL
-- ============================================

SELECT
  '📊 RÉSUMÉ DE LA MIGRATION' as summary,
  (SELECT COUNT(*) FROM visit_time_slots) as time_slots_count,
  (SELECT COUNT(*) FROM visit_availability) as availability_count,
  (SELECT COUNT(*) FROM property_visits) as visits_count,
  CASE
    WHEN (SELECT COUNT(*) FROM visit_time_slots) = 20 THEN '✅ OK'
    ELSE '❌ ERREUR'
  END as migration_status;

-- ============================================
-- 12. PERMISSIONS (GRANTS)
-- ============================================

SELECT
  '✅ Permissions accordées' as verification,
  grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
AND table_name IN ('visit_time_slots', 'visit_availability', 'property_visits')
AND grantee = 'authenticated'
ORDER BY table_name, privilege_type;

-- ============================================
-- FIN DE LA VÉRIFICATION
-- ============================================
-- Si tous les résultats sont corrects:
-- ✅ Migration appliquée avec succès!
--
-- Prochaines étapes:
-- 1. Tester la création d'une visite via l'interface
-- 2. Vérifier les notifications
-- 3. Tester les disponibilités
-- ============================================
