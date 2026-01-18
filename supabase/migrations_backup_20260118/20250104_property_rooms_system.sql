-- ============================================================================
-- PROPERTY ROOMS & DETAILED PRICING SYSTEM
-- ============================================================================
-- Migration pour supporter le système multi-chambres avec pricing détaillé

-- 1. Table des chambres individuelles
-- ============================================================================
CREATE TABLE IF NOT EXISTS property_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  -- Room identification
  room_number INTEGER NOT NULL,
  room_name VARCHAR(100),
  description TEXT,

  -- Pricing
  price DECIMAL(10, 2) NOT NULL,

  -- Characteristics
  size_sqm DECIMAL(6, 2),
  floor_number INTEGER,
  has_private_bathroom BOOLEAN DEFAULT false,
  has_balcony BOOLEAN DEFAULT false,
  has_desk BOOLEAN DEFAULT true,
  has_wardrobe BOOLEAN DEFAULT true,
  is_furnished BOOLEAN DEFAULT true,
  window_view VARCHAR(50), -- 'street', 'courtyard', 'garden', 'none'

  -- Availability
  is_available BOOLEAN DEFAULT true,
  available_from DATE,

  -- Media
  photos TEXT[], -- Array of photo URLs
  features TEXT[], -- Additional features

  -- Current occupant
  current_occupant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_room_per_property UNIQUE(property_id, room_number),
  CONSTRAINT positive_price CHECK (price > 0),
  CONSTRAINT positive_size CHECK (size_sqm IS NULL OR size_sqm > 0)
);

-- 2. Table des coûts détaillés des propriétés
-- ============================================================================
CREATE TABLE IF NOT EXISTS property_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE UNIQUE,

  -- Utilities (charges)
  utilities_total DECIMAL(10, 2) DEFAULT 0,
  utilities_electricity DECIMAL(10, 2),
  utilities_water DECIMAL(10, 2),
  utilities_heating DECIMAL(10, 2),
  utilities_gas DECIMAL(10, 2),
  utilities_internet DECIMAL(10, 2),
  utilities_trash DECIMAL(10, 2),
  utilities_other DECIMAL(10, 2),

  -- Shared living costs (vie commune)
  shared_living_total DECIMAL(10, 2) DEFAULT 0,
  shared_living_cleaning_service DECIMAL(10, 2), -- Femme de ménage
  shared_living_wifi DECIMAL(10, 2),
  shared_living_cleaning_supplies DECIMAL(10, 2), -- Produits ménagers
  shared_living_groceries DECIMAL(10, 2),
  shared_living_maintenance DECIMAL(10, 2),
  shared_living_insurance DECIMAL(10, 2),
  shared_living_other DECIMAL(10, 2),

  -- Additional fees
  deposit DECIMAL(10, 2),
  agency_fee DECIMAL(10, 2),
  admin_fee DECIMAL(10, 2),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT positive_costs CHECK (
    utilities_total >= 0 AND
    shared_living_total >= 0
  )
);

-- 3. Table des métriques lifestyle de la propriété
-- ============================================================================
CREATE TABLE IF NOT EXISTS property_lifestyle_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE UNIQUE,

  -- Ambiance scores (1-10)
  party_vibe INTEGER DEFAULT 5 CHECK (party_vibe BETWEEN 1 AND 10),
  cleanliness INTEGER DEFAULT 5 CHECK (cleanliness BETWEEN 1 AND 10),
  noise_level INTEGER DEFAULT 5 CHECK (noise_level BETWEEN 1 AND 10),
  social_interaction INTEGER DEFAULT 5 CHECK (social_interaction BETWEEN 1 AND 10),

  -- Binary attributes
  smoking_allowed BOOLEAN DEFAULT false,
  pets_allowed BOOLEAN DEFAULT false,
  guests_allowed BOOLEAN DEFAULT true,

  -- Shared activities
  shared_meals_frequency VARCHAR(20) CHECK (
    shared_meals_frequency IN ('never', 'rarely', 'sometimes', 'often', 'daily')
  ),
  common_space_usage VARCHAR(20) CHECK (
    common_space_usage IN ('low', 'medium', 'high')
  ),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indexes pour performance
-- ============================================================================
CREATE INDEX idx_property_rooms_property ON property_rooms(property_id);
CREATE INDEX idx_property_rooms_available ON property_rooms(is_available, available_from);
CREATE INDEX idx_property_rooms_price ON property_rooms(price);
CREATE INDEX idx_property_costs_property ON property_costs(property_id);
CREATE INDEX idx_property_lifestyle_property ON property_lifestyle_metrics(property_id);

-- 5. RLS (Row Level Security)
-- ============================================================================
ALTER TABLE property_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_lifestyle_metrics ENABLE ROW LEVEL SECURITY;

-- Public can view all rooms and costs for available properties
CREATE POLICY "Public can view rooms"
  ON property_rooms FOR SELECT
  USING (true);

CREATE POLICY "Public can view costs"
  ON property_costs FOR SELECT
  USING (true);

CREATE POLICY "Public can view lifestyle metrics"
  ON property_lifestyle_metrics FOR SELECT
  USING (true);

-- Owners can manage their property rooms
CREATE POLICY "Owners can manage their rooms"
  ON property_rooms FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_rooms.property_id
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage their costs"
  ON property_costs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_costs.property_id
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage their lifestyle metrics"
  ON property_lifestyle_metrics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_lifestyle_metrics.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- 6. Trigger pour updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_property_rooms_updated_at
  BEFORE UPDATE ON property_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_costs_updated_at
  BEFORE UPDATE ON property_costs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_lifestyle_metrics_updated_at
  BEFORE UPDATE ON property_lifestyle_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Helper function: Get cheapest available room
-- ============================================================================
CREATE OR REPLACE FUNCTION get_cheapest_room(p_property_id UUID)
RETURNS property_rooms AS $$
  SELECT * FROM property_rooms
  WHERE property_id = p_property_id
    AND is_available = true
  ORDER BY price ASC, available_from ASC NULLS LAST
  LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- 8. Helper function: Get soonest available room
-- ============================================================================
CREATE OR REPLACE FUNCTION get_soonest_room(p_property_id UUID)
RETURNS property_rooms AS $$
  SELECT * FROM property_rooms
  WHERE property_id = p_property_id
    AND is_available = true
  ORDER BY available_from ASC NULLS FIRST, price ASC
  LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- 9. Helper view: Rooms with total costs
-- ============================================================================
CREATE OR REPLACE VIEW rooms_with_total_costs AS
SELECT
  r.*,
  COALESCE(c.utilities_total, 0) as utilities_total,
  COALESCE(c.shared_living_total, 0) as shared_living_total,
  r.price + COALESCE(c.utilities_total, 0) + COALESCE(c.shared_living_total, 0) as total_monthly_cost
FROM property_rooms r
LEFT JOIN property_costs c ON r.property_id = c.property_id;

-- 10. Comments for documentation
-- ============================================================================
COMMENT ON TABLE property_rooms IS 'Individual rooms within a property with detailed characteristics and pricing';
COMMENT ON TABLE property_costs IS 'Detailed cost breakdown for properties including utilities and shared living expenses';
COMMENT ON TABLE property_lifestyle_metrics IS 'Lifestyle and ambiance metrics for matching compatibility';
COMMENT ON COLUMN property_rooms.price IS 'Monthly rent for this specific room';
COMMENT ON COLUMN property_costs.utilities_total IS 'Total monthly utilities (charges) per person';
COMMENT ON COLUMN property_costs.shared_living_total IS 'Total monthly shared living costs per person';
