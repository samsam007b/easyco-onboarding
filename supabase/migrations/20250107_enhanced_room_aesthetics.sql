-- Enhanced Room Aesthetics and Environmental Features
-- This migration adds Booking.com-style detailed attributes plus innovative aesthetic features

-- ============================================
-- 1. ROOM AESTHETIC & ENVIRONMENTAL ATTRIBUTES
-- ============================================

CREATE TABLE IF NOT EXISTS property_room_aesthetics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES property_rooms(id) ON DELETE CASCADE,

  -- Natural Light & Sun Exposure (1-10 scale)
  natural_light_rating INTEGER CHECK (natural_light_rating >= 1 AND natural_light_rating <= 10),
  sun_exposure TEXT CHECK (sun_exposure IN ('none', 'morning', 'afternoon', 'evening', 'all_day', 'variable')),
  sun_hours_per_day NUMERIC(3,1) CHECK (sun_hours_per_day >= 0 AND sun_hours_per_day <= 24), -- Average hours of direct sunlight

  -- Window Details
  number_of_windows INTEGER DEFAULT 0,
  window_orientation TEXT[], -- ['north', 'south', 'east', 'west']
  window_size TEXT CHECK (window_size IN ('small', 'medium', 'large', 'floor_to_ceiling', 'skylight')),
  has_curtains BOOLEAN DEFAULT false,
  has_blinds BOOLEAN DEFAULT false,
  has_shutters BOOLEAN DEFAULT false,

  -- Heating & Temperature Control
  heating_type TEXT CHECK (heating_type IN (
    'central_heating', 'radiator', 'floor_heating', 'electric_heater',
    'gas_heater', 'air_conditioning', 'heat_pump', 'fireplace', 'none'
  )),
  heating_quality_rating INTEGER CHECK (heating_quality_rating >= 1 AND heating_quality_rating <= 10),
  has_thermostat BOOLEAN DEFAULT false,
  has_individual_temperature_control BOOLEAN DEFAULT false,
  cooling_type TEXT CHECK (cooling_type IN (
    'air_conditioning', 'fan', 'ceiling_fan', 'portable_ac', 'none'
  )),

  -- Interior Design Style & Aesthetic
  design_style TEXT CHECK (design_style IN (
    'modern', 'contemporary', 'minimalist', 'scandinavian', 'industrial',
    'bohemian', 'vintage', 'mid_century', 'rustic', 'traditional',
    'eclectic', 'japandi', 'art_deco', 'coastal', 'farmhouse', 'mixed'
  )),
  design_quality_rating INTEGER CHECK (design_quality_rating >= 1 AND design_quality_rating <= 10),
  aesthetic_appeal_rating INTEGER CHECK (aesthetic_appeal_rating >= 1 AND aesthetic_appeal_rating <= 10),

  -- Furniture & Decor Concept
  furniture_style TEXT CHECK (furniture_style IN (
    'ikea', 'designer', 'vintage', 'custom', 'antique', 'mixed', 'minimalist', 'luxury'
  )),
  furniture_condition TEXT CHECK (furniture_condition IN ('new', 'excellent', 'good', 'fair', 'needs_replacement')),
  furniture_quality_rating INTEGER CHECK (furniture_quality_rating >= 1 AND furniture_quality_rating <= 10),

  -- Color Scheme & Atmosphere
  wall_color TEXT, -- e.g., 'white', 'beige', 'gray', 'blue', 'accent_wall'
  color_palette TEXT[], -- ['white', 'gray', 'wood_tones', 'blue_accents']
  room_atmosphere TEXT CHECK (room_atmosphere IN (
    'cozy', 'bright', 'airy', 'minimal', 'warm', 'cool', 'energetic',
    'calming', 'luxurious', 'basic', 'creative', 'professional'
  )),

  -- Flooring
  flooring_type TEXT CHECK (flooring_type IN (
    'hardwood', 'laminate', 'tile', 'carpet', 'vinyl', 'concrete', 'marble', 'parquet'
  )),
  flooring_condition TEXT CHECK (flooring_condition IN ('new', 'excellent', 'good', 'fair', 'worn')),
  has_rug BOOLEAN DEFAULT false,

  -- Ceiling & Height
  ceiling_height_cm INTEGER CHECK (ceiling_height_cm >= 200 AND ceiling_height_cm <= 600),
  ceiling_type TEXT CHECK (ceiling_type IN ('standard', 'high', 'exposed_beams', 'vaulted', 'coffered', 'dropped')),

  -- Acoustics & Sound
  noise_insulation_rating INTEGER CHECK (noise_insulation_rating >= 1 AND noise_insulation_rating <= 10),
  is_soundproof BOOLEAN DEFAULT false,
  noise_level_from_street TEXT CHECK (noise_level_from_street IN ('silent', 'quiet', 'moderate', 'noisy', 'very_noisy')),
  noise_level_from_neighbors TEXT CHECK (noise_level_from_neighbors IN ('silent', 'quiet', 'moderate', 'noisy', 'very_noisy')),

  -- Room Smell & Air Quality
  air_quality_rating INTEGER CHECK (air_quality_rating >= 1 AND air_quality_rating <= 10),
  has_air_purifier BOOLEAN DEFAULT false,
  has_humidifier BOOLEAN DEFAULT false,
  ventilation_type TEXT CHECK (ventilation_type IN ('natural', 'mechanical', 'ac_system', 'poor')),

  -- Special Features
  has_plants BOOLEAN DEFAULT false,
  has_artwork BOOLEAN DEFAULT false,
  has_mirror BOOLEAN DEFAULT false,
  has_bookshelf BOOLEAN DEFAULT false,
  has_desk_lamp BOOLEAN DEFAULT false,
  has_mood_lighting BOOLEAN DEFAULT false,
  has_smart_home_features BOOLEAN DEFAULT false,

  -- Photos specific to aesthetic features
  aesthetic_photos TEXT[], -- URLs to photos highlighting design/aesthetics

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_room_aesthetics UNIQUE(room_id)
);

-- Index for filtering by design style and quality
CREATE INDEX idx_room_aesthetics_design_style ON property_room_aesthetics(design_style);
CREATE INDEX idx_room_aesthetics_heating_type ON property_room_aesthetics(heating_type);
CREATE INDEX idx_room_aesthetics_natural_light ON property_room_aesthetics(natural_light_rating);
CREATE INDEX idx_room_aesthetics_quality ON property_room_aesthetics(design_quality_rating, aesthetic_appeal_rating);

-- RLS Policies
ALTER TABLE property_room_aesthetics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view room aesthetics for published properties"
  ON property_room_aesthetics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM property_rooms pr
      JOIN properties p ON pr.property_id = p.id
      WHERE pr.id = property_room_aesthetics.room_id
      AND p.status = 'published'
      AND p.is_available = true
    )
  );

CREATE POLICY "Property owners can manage their room aesthetics"
  ON property_room_aesthetics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM property_rooms pr
      JOIN properties p ON pr.property_id = p.id
      WHERE pr.id = property_room_aesthetics.room_id
      AND p.owner_id = auth.uid()
    )
  );

-- ============================================
-- 2. PROPERTY-LEVEL AESTHETIC ATTRIBUTES
-- ============================================

-- Extend existing properties table with additional aesthetic fields
ALTER TABLE properties ADD COLUMN IF NOT EXISTS building_style TEXT CHECK (building_style IN (
  'modern', 'contemporary', 'classic', 'art_nouveau', 'art_deco',
  'industrial', 'brutalist', 'traditional', 'mixed'
));

ALTER TABLE properties ADD COLUMN IF NOT EXISTS building_age_years INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS year_renovated INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS renovation_quality TEXT CHECK (renovation_quality IN (
  'never', 'basic', 'partial', 'full', 'luxury', 'recent'
));

ALTER TABLE properties ADD COLUMN IF NOT EXISTS common_areas_quality INTEGER CHECK (common_areas_quality >= 1 AND common_areas_quality <= 10);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS overall_cleanliness_rating INTEGER CHECK (overall_cleanliness_rating >= 1 AND overall_cleanliness_rating <= 10);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS maintenance_quality INTEGER CHECK (maintenance_quality >= 1 AND maintenance_quality <= 10);

-- Common area features
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_coworking_space BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_rooftop_terrace BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_garden_access BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_bike_storage BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_storage_room BOOLEAN DEFAULT false;

-- ============================================
-- 3. ENHANCED VIEWS FOR COMPLETE ROOM DATA
-- ============================================

CREATE OR REPLACE VIEW rooms_with_complete_details AS
SELECT
  pr.*,
  pc.utilities_total,
  pc.shared_living_total,
  (pr.price + COALESCE(pc.utilities_total, 0) + COALESCE(pc.shared_living_total, 0)) as total_monthly_cost,
  pra.natural_light_rating,
  pra.sun_exposure,
  pra.sun_hours_per_day,
  pra.heating_type,
  pra.heating_quality_rating,
  pra.design_style,
  pra.design_quality_rating,
  pra.aesthetic_appeal_rating,
  pra.furniture_style,
  pra.furniture_quality_rating,
  pra.room_atmosphere,
  pra.flooring_type,
  pra.ceiling_height_cm,
  pra.noise_insulation_rating,
  pra.air_quality_rating,
  pra.color_palette,
  pra.has_plants,
  pra.has_artwork,
  pra.has_mood_lighting,
  pra.aesthetic_photos,
  p.title as property_title,
  p.address,
  p.city,
  p.neighborhood,
  p.images as property_images,
  p.amenities as property_amenities
FROM property_rooms pr
LEFT JOIN property_costs pc ON pr.property_id = pc.property_id
LEFT JOIN property_room_aesthetics pra ON pr.id = pra.room_id
LEFT JOIN properties p ON pr.property_id = p.id;

-- ============================================
-- 4. SEARCH & FILTER HELPER FUNCTIONS
-- ============================================

-- Function to search rooms by aesthetic criteria
CREATE OR REPLACE FUNCTION search_rooms_by_aesthetics(
  p_design_styles TEXT[] DEFAULT NULL,
  p_min_natural_light INTEGER DEFAULT NULL,
  p_heating_types TEXT[] DEFAULT NULL,
  p_min_design_quality INTEGER DEFAULT NULL,
  p_furniture_styles TEXT[] DEFAULT NULL,
  p_room_atmospheres TEXT[] DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_max_price NUMERIC DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  room_id UUID,
  property_id UUID,
  room_name TEXT,
  price NUMERIC,
  total_monthly_cost NUMERIC,
  size_sqm NUMERIC,
  design_style TEXT,
  design_quality_rating INTEGER,
  natural_light_rating INTEGER,
  heating_type TEXT,
  furniture_style TEXT,
  room_atmosphere TEXT,
  property_title TEXT,
  city TEXT,
  neighborhood TEXT,
  is_available BOOLEAN,
  available_from DATE,
  aesthetic_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pr.id as room_id,
    pr.property_id,
    pr.room_name,
    pr.price,
    (pr.price + COALESCE(pc.utilities_total, 0) + COALESCE(pc.shared_living_total, 0)) as total_monthly_cost,
    pr.size_sqm,
    pra.design_style,
    pra.design_quality_rating,
    pra.natural_light_rating,
    pra.heating_type,
    pra.furniture_style,
    pra.room_atmosphere,
    p.title as property_title,
    p.city,
    p.neighborhood,
    pr.is_available,
    pr.available_from,
    -- Calculate aesthetic score (weighted average)
    (
      COALESCE(pra.design_quality_rating, 5) * 0.3 +
      COALESCE(pra.aesthetic_appeal_rating, 5) * 0.3 +
      COALESCE(pra.natural_light_rating, 5) * 0.2 +
      COALESCE(pra.furniture_quality_rating, 5) * 0.1 +
      COALESCE(pra.heating_quality_rating, 5) * 0.1
    ) as aesthetic_score
  FROM property_rooms pr
  LEFT JOIN property_costs pc ON pr.property_id = pc.property_id
  LEFT JOIN property_room_aesthetics pra ON pr.id = pra.room_id
  JOIN properties p ON pr.property_id = p.id
  WHERE
    p.status = 'published'
    AND p.is_available = true
    AND pr.is_available = true
    -- Filter by design style
    AND (p_design_styles IS NULL OR pra.design_style = ANY(p_design_styles))
    -- Filter by natural light
    AND (p_min_natural_light IS NULL OR pra.natural_light_rating >= p_min_natural_light)
    -- Filter by heating type
    AND (p_heating_types IS NULL OR pra.heating_type = ANY(p_heating_types))
    -- Filter by design quality
    AND (p_min_design_quality IS NULL OR pra.design_quality_rating >= p_min_design_quality)
    -- Filter by furniture style
    AND (p_furniture_styles IS NULL OR pra.furniture_style = ANY(p_furniture_styles))
    -- Filter by room atmosphere
    AND (p_room_atmospheres IS NULL OR pra.room_atmosphere = ANY(p_room_atmospheres))
    -- Filter by city
    AND (p_city IS NULL OR p.city ILIKE p_city)
    -- Filter by max price (including utilities)
    AND (p_max_price IS NULL OR (pr.price + COALESCE(pc.utilities_total, 0) + COALESCE(pc.shared_living_total, 0)) <= p_max_price)
  ORDER BY aesthetic_score DESC, pr.price ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 5. UPDATE TRIGGER FOR TIMESTAMPS
-- ============================================

CREATE OR REPLACE FUNCTION update_room_aesthetics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_room_aesthetics_updated_at
  BEFORE UPDATE ON property_room_aesthetics
  FOR EACH ROW
  EXECUTE FUNCTION update_room_aesthetics_updated_at();

-- ============================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE property_room_aesthetics IS 'Enhanced room aesthetic and environmental attributes including natural light, heating, design style, and atmosphere';
COMMENT ON COLUMN property_room_aesthetics.natural_light_rating IS 'Rating from 1 (dark) to 10 (extremely bright/sunny)';
COMMENT ON COLUMN property_room_aesthetics.sun_exposure IS 'What time of day the room gets direct sunlight';
COMMENT ON COLUMN property_room_aesthetics.design_style IS 'Interior design style category (modern, minimalist, bohemian, etc.)';
COMMENT ON COLUMN property_room_aesthetics.heating_quality_rating IS 'How effective and comfortable the heating system is (1-10)';
COMMENT ON COLUMN property_room_aesthetics.furniture_style IS 'Type and quality of furniture (IKEA, designer, vintage, etc.)';
COMMENT ON COLUMN property_room_aesthetics.room_atmosphere IS 'Overall vibe and feeling of the room';
COMMENT ON COLUMN property_room_aesthetics.aesthetic_appeal_rating IS 'Overall visual appeal and design quality (1-10)';

COMMENT ON FUNCTION search_rooms_by_aesthetics IS 'Search and filter rooms by aesthetic criteria with calculated aesthetic score';
