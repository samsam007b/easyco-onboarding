-- Diagnostic rapide: Voir le problème exact
SELECT
  p.title as propriete,
  p.owner_id,
  up.first_name,
  up.last_name,
  au.email,
  CASE
    WHEN p.owner_id IS NULL THEN '❌ Pas d''owner_id'
    WHEN up.user_id IS NULL THEN '❌ PAS DE USER_PROFILE POUR CET OWNER'
    WHEN up.first_name IS NULL THEN '❌ Prénom manquant'
    WHEN up.last_name IS NULL THEN '❌ Nom manquant'
    WHEN au.email IS NULL THEN '❌ Email manquant'
    ELSE '✅ OK'
  END as diagnostic
FROM properties p
LEFT JOIN user_profiles up ON p.owner_id = up.user_id
LEFT JOIN auth.users au ON p.owner_id = au.id
ORDER BY p.created_at DESC
LIMIT 5;
