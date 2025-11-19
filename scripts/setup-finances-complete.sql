-- ============================================================================
-- SETUP COMPLET POUR LA PAGE FINANCES
-- ============================================================================
-- Ce script fait tout d'un coup :
-- 1. Ajoute les colonnes manquantes
-- 2. Crée les données de démo
-- ============================================================================

BEGIN;

-- ============================================================================
-- ÉTAPE 1 : Ajouter paid_by_id à expenses
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'paid_by_id'
  ) THEN
    ALTER TABLE expenses
    ADD COLUMN paid_by_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

    -- Mettre à jour les enregistrements existants
    UPDATE expenses SET paid_by_id = created_by WHERE paid_by_id IS NULL AND created_by IS NOT NULL;

    -- Créer l'index
    CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by_id);

    RAISE NOTICE '✅ Colonne paid_by_id ajoutée à expenses';
  ELSE
    RAISE NOTICE '⚠️  Colonne paid_by_id existe déjà';
  END IF;
END $$;

-- ============================================================================
-- ÉTAPE 2 : Ajouter amount_owed à expense_splits
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expense_splits' AND column_name = 'amount_owed'
  ) THEN
    ALTER TABLE expense_splits
    ADD COLUMN amount_owed DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (amount_owed >= 0);

    RAISE NOTICE '✅ Colonne amount_owed ajoutée à expense_splits';
  ELSE
    RAISE NOTICE '⚠️  Colonne amount_owed existe déjà';
  END IF;

  -- Si l'ancienne colonne 'amount' existe, migrer les données
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expense_splits' AND column_name = 'amount'
  ) THEN
    UPDATE expense_splits SET amount_owed = amount WHERE amount_owed = 0;
    ALTER TABLE expense_splits DROP COLUMN amount;
    RAISE NOTICE '✅ Migration de amount vers amount_owed effectuée';
  END IF;
END $$;

-- ============================================================================
-- ÉTAPE 3 : Créer les données de démo
-- ============================================================================
DO $$
DECLARE
  current_user_id UUID;
  test_property_id UUID;
  expense1_id UUID;
BEGIN
  -- Récupérer le premier utilisateur
  SELECT id INTO current_user_id FROM auth.users LIMIT 1;

  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Aucun utilisateur trouvé. Créez un compte utilisateur d''abord.';
  END IF;

  RAISE NOTICE '📍 Utilisateur: %', current_user_id;

  -- Récupérer ou créer une propriété
  SELECT id INTO test_property_id FROM properties LIMIT 1;

  IF test_property_id IS NULL THEN
    INSERT INTO properties (name, address, city, postal_code, country, bedrooms, bathrooms, surface_area, rent_amount)
    VALUES ('Appartement Test', '123 Rue de Test', 'Paris', '75001', 'France', 3, 1, 75, 1200)
    RETURNING id INTO test_property_id;

    RAISE NOTICE '🏠 Propriété créée: %', test_property_id;
  ELSE
    RAISE NOTICE '🏠 Propriété existante: %', test_property_id;
  END IF;

  -- S'assurer que l'utilisateur a un profil
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = current_user_id) THEN
    INSERT INTO user_profiles (user_id, user_type, first_name, last_name)
    VALUES (current_user_id, 'resident', 'Test', 'User');

    RAISE NOTICE '👤 Profil utilisateur créé';
  END IF;

  -- Créer le lien property_members
  INSERT INTO property_members (property_id, user_id, role, status, move_in_date)
  VALUES (test_property_id, current_user_id, 'resident', 'active', CURRENT_DATE)
  ON CONFLICT (property_id, user_id, status) DO NOTHING;

  RAISE NOTICE '🔗 Membership créé/vérifié';

  -- Supprimer les anciennes dépenses de test pour éviter les doublons
  DELETE FROM expense_splits
  WHERE expense_id IN (
    SELECT id FROM expenses
    WHERE property_id = test_property_id
    AND description IN ('Supermarché', 'Fibre Orange', 'EDF', 'Soirée coloc')
  );

  DELETE FROM expenses
  WHERE property_id = test_property_id
  AND description IN ('Supermarché', 'Fibre Orange', 'EDF', 'Soirée coloc');

  -- Créer les dépenses de démo
  INSERT INTO expenses (id, property_id, created_by, paid_by_id, title, description, amount, category, date, status)
  VALUES
    (gen_random_uuid(), test_property_id, current_user_id, current_user_id, 'Courses de la semaine', 'Supermarché', 85.50, 'groceries', CURRENT_DATE - 2, 'paid'),
    (gen_random_uuid(), test_property_id, current_user_id, current_user_id, 'Facture Internet', 'Fibre Orange', 29.99, 'internet', CURRENT_DATE - 5, 'paid'),
    (gen_random_uuid(), test_property_id, current_user_id, current_user_id, 'Électricité', 'EDF', 68.75, 'utilities', CURRENT_DATE - 10, 'paid'),
    (gen_random_uuid(), test_property_id, current_user_id, current_user_id, 'Pizza party', 'Soirée coloc', 45.00, 'groceries', CURRENT_DATE, 'pending');

  RAISE NOTICE '💰 4 dépenses créées';

  -- Créer les splits pour chaque dépense
  FOR expense1_id IN
    SELECT id FROM expenses
    WHERE property_id = test_property_id
    AND description IN ('Supermarché', 'Fibre Orange', 'EDF', 'Soirée coloc')
  LOOP
    INSERT INTO expense_splits (expense_id, user_id, amount_owed, paid, paid_at)
    VALUES (
      expense1_id,
      current_user_id,
      (SELECT amount FROM expenses WHERE id = expense1_id),
      true,
      NOW()
    );
  END LOOP;

  RAISE NOTICE '📊 Splits créés pour les 4 dépenses';
  RAISE NOTICE '';
  RAISE NOTICE '✅ CONFIGURATION TERMINÉE !';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '🎉 La page finances est prête !';
  RAISE NOTICE '📍 Propriété: %', test_property_id;
  RAISE NOTICE '👤 Utilisateur: %', current_user_id;
  RAISE NOTICE '💰 Dépenses: 4 dépenses de démo créées';
  RAISE NOTICE '';
  RAISE NOTICE '➡️  Rechargez la page /hub/finances';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

COMMIT;
