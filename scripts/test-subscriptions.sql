-- =====================================================
-- SCRIPTS DE TEST POUR LE SYSTÈME D'ABONNEMENTS
-- =====================================================
-- À exécuter dans le SQL Editor Supabase pour vérifier
-- que tout fonctionne correctement
-- =====================================================

-- =====================================================
-- 1. VÉRIFIER LES SUPER ADMINS
-- =====================================================
SELECT
  email,
  role,
  created_at,
  updated_at
FROM public.admins
WHERE role = 'super_admin'
ORDER BY created_at DESC;

-- Tester la fonction is_super_admin
SELECT
  'baudonsamuel@gmail.com' as email,
  public.is_super_admin('baudonsamuel@gmail.com') as is_super_admin;

SELECT
  'sam7777jones@gmail.com' as email,
  public.is_super_admin('sam7777jones@gmail.com') as is_super_admin;

-- =====================================================
-- 2. VÉRIFIER LES ABONNEMENTS ACTIFS
-- =====================================================
-- Compter tous les abonnements par statut
SELECT
  status,
  COUNT(*) as count,
  ARRAY_AGG(user_type) as user_types
FROM public.subscriptions
GROUP BY status
ORDER BY count DESC;

-- Voir les abonnements en trial
SELECT
  s.id,
  u.email,
  s.user_type,
  s.plan,
  s.status,
  s.trial_start_date,
  s.trial_end_date,
  s.trial_days_remaining,
  s.created_at
FROM public.subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE s.status = 'trial'
ORDER BY s.created_at DESC
LIMIT 10;

-- =====================================================
-- 3. TESTER LA FONCTION get_subscription_status
-- =====================================================
-- Remplacer USER_ID_HERE par un vrai ID utilisateur
SELECT * FROM public.get_subscription_status('USER_ID_HERE');

-- Exemple de résultat attendu:
-- {
--   "status": "trial",
--   "plan": "owner_monthly",
--   "trial_days_remaining": 85,
--   "trial_end_date": "2024-03-15T10:00:00Z",
--   "is_trial_active": true,
--   "requires_payment": false,
--   "can_access_features": true
-- }

-- =====================================================
-- 4. VÉRIFIER LES ÉVÉNEMENTS D'ABONNEMENT
-- =====================================================
-- Voir les derniers événements
SELECT
  se.event_type,
  se.from_status,
  se.to_status,
  u.email,
  se.metadata,
  se.created_at
FROM public.subscription_events se
JOIN public.subscriptions s ON s.id = se.subscription_id
JOIN auth.users u ON u.id = s.user_id
ORDER BY se.created_at DESC
LIMIT 20;

-- Compter les événements par type
SELECT
  event_type,
  COUNT(*) as count
FROM public.subscription_events
GROUP BY event_type
ORDER BY count DESC;

-- =====================================================
-- 5. TESTER LE TRIGGER auto_create_subscription_on_onboarding
-- =====================================================
-- Vérifier que tous les utilisateurs avec onboarding_completed = true
-- ont bien un abonnement créé
SELECT
  u.id,
  u.email,
  u.user_type,
  u.onboarding_completed,
  CASE
    WHEN s.id IS NOT NULL THEN '✅ Abonnement créé'
    ELSE '❌ Manquant'
  END as subscription_status
FROM public.users u
LEFT JOIN public.subscriptions s ON s.user_id = u.id
WHERE u.onboarding_completed = true
ORDER BY u.created_at DESC;

-- =====================================================
-- 6. VÉRIFIER LES DATES D'EXPIRATION DES TRIALS
-- =====================================================
-- Abonnements qui expirent bientôt (dans les 7 prochains jours)
SELECT
  u.email,
  s.user_type,
  s.trial_end_date,
  s.trial_days_remaining,
  s.status,
  CASE
    WHEN s.trial_days_remaining <= 7 THEN '⚠️ Expiration imminente'
    WHEN s.trial_days_remaining <= 30 THEN '📅 Moins d\'un mois'
    ELSE '✅ OK'
  END as urgency
FROM public.subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE s.status = 'trial'
  AND s.trial_end_date IS NOT NULL
ORDER BY s.trial_days_remaining ASC
LIMIT 20;

-- Abonnements expirés mais pas encore mis à jour
SELECT
  u.email,
  s.user_type,
  s.trial_end_date,
  s.status,
  NOW() - s.trial_end_date as expired_since
FROM public.subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE s.status = 'trial'
  AND s.trial_end_date < NOW()
ORDER BY s.trial_end_date DESC;

-- =====================================================
-- 7. STATISTIQUES GLOBALES
-- =====================================================
SELECT
  'Total subscriptions' as metric,
  COUNT(*)::TEXT as value
FROM public.subscriptions
UNION ALL
SELECT
  'Active trials' as metric,
  COUNT(*)::TEXT as value
FROM public.subscriptions
WHERE status = 'trial' AND trial_end_date > NOW()
UNION ALL
SELECT
  'Expired trials' as metric,
  COUNT(*)::TEXT as value
FROM public.subscriptions
WHERE status = 'trial' AND trial_end_date < NOW()
UNION ALL
SELECT
  'Owner subscriptions' as metric,
  COUNT(*)::TEXT as value
FROM public.subscriptions
WHERE user_type = 'owner'
UNION ALL
SELECT
  'Resident subscriptions' as metric,
  COUNT(*)::TEXT as value
FROM public.subscriptions
WHERE user_type = 'resident'
UNION ALL
SELECT
  'Average trial days remaining (owners)' as metric,
  ROUND(AVG(trial_days_remaining))::TEXT as value
FROM public.subscriptions
WHERE user_type = 'owner' AND status = 'trial'
UNION ALL
SELECT
  'Average trial days remaining (residents)' as metric,
  ROUND(AVG(trial_days_remaining))::TEXT as value
FROM public.subscriptions
WHERE user_type = 'resident' AND status = 'trial';

-- =====================================================
-- 8. VÉRIFIER LES POLITIQUES RLS
-- =====================================================
-- Cette requête doit échouer si RLS fonctionne correctement
-- (elle ne retournera que les subscriptions de l'utilisateur connecté)
SELECT
  id,
  user_id,
  plan,
  status,
  trial_days_remaining
FROM public.subscriptions
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- 9. TEST DE CRÉATION MANUELLE D'ABONNEMENT
-- =====================================================
-- ⚠️ NE PAS EXÉCUTER EN PRODUCTION SANS RAISON
-- Exemple pour tester la création d'un abonnement manuellement

/*
-- Remplacer USER_ID_HERE par un vrai ID utilisateur
INSERT INTO public.subscriptions (
  user_id,
  user_type,
  plan,
  status,
  trial_start_date,
  trial_end_date,
  trial_days_total,
  trial_days_remaining
) VALUES (
  'USER_ID_HERE',
  'owner',
  'owner_monthly',
  'trial',
  NOW(),
  NOW() + INTERVAL '90 days',
  90,
  90
);
*/

-- =====================================================
-- 10. MONITORING - ERREURS POTENTIELLES
-- =====================================================
-- Utilisateurs sans abonnement alors qu'ils ont terminé l'onboarding
SELECT
  u.id,
  u.email,
  u.user_type,
  u.onboarding_completed,
  u.created_at as user_created_at
FROM public.users u
LEFT JOIN public.subscriptions s ON s.user_id = u.id
WHERE u.onboarding_completed = true
  AND s.id IS NULL
ORDER BY u.created_at DESC;

-- Abonnements dupliqués (un user ne devrait avoir qu'un seul abonnement)
SELECT
  user_id,
  COUNT(*) as subscription_count,
  ARRAY_AGG(status) as statuses
FROM public.subscriptions
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Abonnements avec des dates incohérentes
SELECT
  s.id,
  u.email,
  s.trial_start_date,
  s.trial_end_date,
  s.trial_days_total,
  s.trial_days_remaining,
  CASE
    WHEN s.trial_end_date < s.trial_start_date THEN '❌ End date before start date'
    WHEN s.trial_days_remaining < 0 THEN '❌ Negative days remaining'
    WHEN s.trial_days_remaining > s.trial_days_total THEN '❌ Days remaining > total days'
    ELSE '✅ OK'
  END as validation
FROM public.subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE
  s.trial_end_date < s.trial_start_date
  OR s.trial_days_remaining < 0
  OR s.trial_days_remaining > s.trial_days_total;

-- =====================================================
-- RÉSUMÉ DES TESTS À EXÉCUTER
-- =====================================================
-- 1. ✅ Vérifier que les super admins sont bien créés
-- 2. ✅ Vérifier que les abonnements sont créés automatiquement
-- 3. ✅ Tester la fonction get_subscription_status
-- 4. ✅ Vérifier les événements d'abonnement
-- 5. ✅ Vérifier que tous les users avec onboarding_completed ont un abonnement
-- 6. ✅ Vérifier les dates d'expiration
-- 7. ✅ Voir les statistiques globales
-- 8. ✅ Vérifier que RLS fonctionne
-- 9. ⚠️ Test de création manuelle (optionnel)
-- 10. ✅ Détecter les erreurs potentielles
