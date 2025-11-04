-- ============================================================================
-- VÉRIFIER LES DONNÉES DU PROPRIÉTAIRE
-- ============================================================================

-- 1. Voir les propriétés et leurs propriétaires
SELECT
  p.id as property_id,
  p.title as property_title,
  p.owner_id,
  up.first_name,
  up.last_name,
  up.profile_photo_url,
  up.phone_number,
  au.email
FROM properties p
LEFT JOIN user_profiles up ON p.owner_id = up.user_id
LEFT JOIN auth.users au ON p.owner_id = au.id
WHERE p.title ILIKE '%Ixelles%' OR p.title ILIKE '%Flagey%'
LIMIT 1;

-- 2. Si le user_profile n'existe pas, le créer
DO $$
DECLARE
  v_property_id UUID;
  v_owner_id UUID;
  v_profile_exists BOOLEAN;
BEGIN
  -- Trouver la propriété
  SELECT id, owner_id INTO v_property_id, v_owner_id
  FROM properties
  WHERE title ILIKE '%Ixelles%' OR title ILIKE '%Flagey%'
  LIMIT 1;

  IF v_owner_id IS NULL THEN
    RAISE NOTICE 'Aucune propriété trouvée';
    RETURN;
  END IF;

  -- Vérifier si le profil existe
  SELECT EXISTS(
    SELECT 1 FROM user_profiles WHERE user_id = v_owner_id
  ) INTO v_profile_exists;

  IF NOT v_profile_exists THEN
    RAISE NOTICE 'Création du profil pour le propriétaire: %', v_owner_id;

    -- Créer un profil pour le propriétaire
    INSERT INTO user_profiles (
      user_id,
      first_name,
      last_name,
      phone_number,
      user_type,
      onboarding_completed
    ) VALUES (
      v_owner_id,
      'Jean',
      'Dupont',
      '+32 470 12 34 56',
      'owner',
      true
    )
    ON CONFLICT (user_id) DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      phone_number = EXCLUDED.phone_number,
      user_type = EXCLUDED.user_type;

    RAISE NOTICE '✅ Profil propriétaire créé!';
  ELSE
    RAISE NOTICE '✅ Le profil propriétaire existe déjà';
  END IF;

END $$;

-- 3. Vérifier le résultat
SELECT
  'Vérification finale' as info,
  p.title,
  up.first_name || ' ' || up.last_name as owner_name,
  up.phone_number,
  au.email
FROM properties p
LEFT JOIN user_profiles up ON p.owner_id = up.user_id
LEFT JOIN auth.users au ON p.owner_id = au.id
WHERE p.title ILIKE '%Ixelles%' OR p.title ILIKE '%Flagey%'
LIMIT 1;
