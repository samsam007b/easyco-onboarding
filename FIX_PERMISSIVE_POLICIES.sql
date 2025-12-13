-- ============================================================================
-- POLICIES RLS TRÈS PERMISSIVES (POUR DÉBLOCAGE IMMÉDIAT)
-- À exécuter sur la base de données de PRODUCTION
-- ============================================================================
--
-- Ce script crée des policies très permissives pour débloquer l'application
-- Une fois que tout fonctionne, vous pourrez les restreindre si nécessaire
--
-- ============================================================================

-- ============================================================================
-- 1. user_profiles - PERMETTRE TOUTES LES OPÉRATIONS
-- ============================================================================

-- D'abord, supprimer TOUTES les policies existantes
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON user_profiles';
    END LOOP;
END $$;

-- Créer UNE SEULE policy permissive pour toutes les opérations
CREATE POLICY "Allow all for authenticated users" ON user_profiles
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- 2. property_members - PERMETTRE TOUTES LES OPÉRATIONS
-- ============================================================================

-- Supprimer toutes les policies existantes
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'property_members') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON property_members';
    END LOOP;
END $$;

-- Créer UNE SEULE policy permissive
CREATE POLICY "Allow all for authenticated users" ON property_members
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- 3. profiles - PERMETTRE TOUTES LES OPÉRATIONS
-- ============================================================================

-- Supprimer toutes les policies existantes
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON profiles';
    END LOOP;
END $$;

-- Créer UNE SEULE policy permissive
CREATE POLICY "Allow all for authenticated users" ON profiles
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- 4. conversation_participants - PERMETTRE TOUTES LES OPÉRATIONS
-- ============================================================================

-- Supprimer toutes les policies existantes
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'conversation_participants') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON conversation_participants';
    END LOOP;
END $$;

-- Créer UNE SEULE policy permissive
CREATE POLICY "Allow all for authenticated users" ON conversation_participants
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- 5. messages - PERMETTRE TOUTES LES OPÉRATIONS (si la table existe)
-- ============================================================================

DO $$
DECLARE
    r RECORD;
BEGIN
    -- Vérifier si la table existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'messages' AND table_schema = 'public') THEN
        -- Activer RLS
        EXECUTE 'ALTER TABLE messages ENABLE ROW LEVEL SECURITY';

        -- Supprimer toutes les policies existantes
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'messages') LOOP
            EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON messages';
        END LOOP;

        -- Créer policy permissive
        EXECUTE 'CREATE POLICY "Allow all for authenticated users" ON messages
          FOR ALL
          USING (auth.role() = ''authenticated'')
          WITH CHECK (auth.role() = ''authenticated'')';

        RAISE NOTICE '✅ messages table policies updated';
    ELSE
        RAISE NOTICE '⚠️ messages table does not exist, skipping';
    END IF;
END $$;

-- ============================================================================
-- 6. VÉRIFICATION
-- ============================================================================

-- Compter les policies sur chaque table
SELECT
  tablename,
  COUNT(*) as policy_count,
  string_agg(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies
WHERE tablename IN ('user_profiles', 'property_members', 'profiles', 'conversation_participants', 'messages')
GROUP BY tablename
ORDER BY tablename;

-- Résultat attendu: 1 policy par table (sauf si messages n'existe pas)

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ✅ ✅ POLICIES TRÈS PERMISSIVES ACTIVÉES ✅ ✅ ✅';
  RAISE NOTICE '';
  RAISE NOTICE '✅ user_profiles: 1 policy permissive (ALL operations)';
  RAISE NOTICE '✅ property_members: 1 policy permissive (ALL operations)';
  RAISE NOTICE '✅ profiles: 1 policy permissive (ALL operations)';
  RAISE NOTICE '✅ conversation_participants: 1 policy permissive (ALL operations)';
  RAISE NOTICE '✅ messages: 1 policy permissive (if table exists)';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANT: Ces policies permettent TOUT aux utilisateurs authentifiés';
  RAISE NOTICE '⚠️  Une fois que l''app fonctionne, vous pourrez les restreindre';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 Rafraîchissez www.izzico.be maintenant!';
  RAISE NOTICE '🔄 Les erreurs 400 devraient DISPARAÎTRE';
END $$;
