-- ============================================================================
-- CORRIGER L'ERREUR: column properties.has_virtual_tour does not exist
-- ============================================================================

-- Vérifier si la colonne existe déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties'
    AND column_name = 'has_virtual_tour'
  ) THEN
    -- Ajouter la colonne si elle n'existe pas
    ALTER TABLE properties
    ADD COLUMN has_virtual_tour BOOLEAN DEFAULT false;

    RAISE NOTICE '✅ Colonne has_virtual_tour ajoutée à la table properties';
  ELSE
    RAISE NOTICE '✅ La colonne has_virtual_tour existe déjà';
  END IF;
END $$;

-- Vérifier que la colonne a bien été créée
SELECT
  table_name,
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'properties'
AND column_name = 'has_virtual_tour';

-- Mettre à jour quelques propriétés pour les tests (optionnel)
UPDATE properties
SET has_virtual_tour = false
WHERE has_virtual_tour IS NULL;

SELECT '✅ Migration terminée' as status;
