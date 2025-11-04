-- ============================================================================
-- CRÉER LA TABLE PROPERTY_RESIDENTS ET PEUPLER AVEC DES DONNÉES
-- ============================================================================

-- 1. Créer la table property_residents
CREATE TABLE IF NOT EXISTS property_residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  -- Informations du résident
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  age INTEGER,
  gender VARCHAR(20),
  occupation VARCHAR(200),
  bio TEXT,

  -- Photo
  photo_url TEXT,

  -- Intérêts et préférences
  interests TEXT[], -- Array of interests
  languages TEXT[], -- Array of languages spoken

  -- Lifestyle
  is_smoker BOOLEAN DEFAULT false,
  has_pets BOOLEAN DEFAULT false,
  cleanliness_level INTEGER CHECK (cleanliness_level BETWEEN 1 AND 10),
  noise_tolerance INTEGER CHECK (noise_tolerance BETWEEN 1 AND 10),
  social_preference INTEGER CHECK (social_preference BETWEEN 1 AND 10), -- 1=introvert, 10=extrovert

  -- Disponibilité
  move_in_date DATE,
  lease_duration_months INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index pour performance
CREATE INDEX IF NOT EXISTS idx_property_residents_property ON property_residents(property_id);

-- 3. Activer RLS
ALTER TABLE property_residents ENABLE ROW LEVEL SECURITY;

-- 4. Politique RLS pour lecture publique
CREATE POLICY "Public can view residents"
  ON property_residents FOR SELECT
  USING (true);

-- 5. Vérifier que la table est créée
SELECT
  '✅ TABLE CRÉÉE' as status,
  COUNT(*) as colonnes
FROM information_schema.columns
WHERE table_name = 'property_residents';
