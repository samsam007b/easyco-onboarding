-- Migration: Create Properties Table
-- Description: Main table for property listings created by Owners
-- Date: 2025-10-28
-- Critical: This table is referenced by applications, matches, favorites

-- ============================================
-- CREATE PROPERTIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Information
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('apartment', 'house', 'studio', 'coliving', 'shared_room', 'private_room', 'entire_place')),

  -- Location
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  neighborhood VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'France',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Property Details
  bedrooms INTEGER NOT NULL DEFAULT 1 CHECK (bedrooms >= 0 AND bedrooms <= 20),
  bathrooms INTEGER NOT NULL DEFAULT 1 CHECK (bathrooms >= 0 AND bathrooms <= 10),
  total_rooms INTEGER CHECK (total_rooms >= 0 AND total_rooms <= 50),
  surface_area INTEGER CHECK (surface_area > 0 AND surface_area <= 10000), -- in square meters
  floor_number INTEGER CHECK (floor_number >= -5 AND floor_number <= 200),
  total_floors INTEGER CHECK (total_floors >= 1 AND total_floors <= 200),
  furnished BOOLEAN DEFAULT false,

  -- Pricing
  monthly_rent DECIMAL(10, 2) NOT NULL CHECK (monthly_rent >= 0 AND monthly_rent <= 1000000),
  charges DECIMAL(10, 2) DEFAULT 0 CHECK (charges >= 0), -- additional charges
  deposit DECIMAL(10, 2) CHECK (deposit >= 0), -- security deposit

  -- Availability
  available_from DATE,
  available_until DATE,
  minimum_stay_months INTEGER DEFAULT 1 CHECK (minimum_stay_months >= 1 AND minimum_stay_months <= 24),
  maximum_stay_months INTEGER CHECK (maximum_stay_months >= 1 AND maximum_stay_months <= 60),
  is_available BOOLEAN DEFAULT true,

  -- Amenities (stored as JSONB for flexibility)
  amenities JSONB DEFAULT '[]'::jsonb,
  -- Example: ["wifi", "parking", "elevator", "balcony", "garden", "gym", "laundry", "dishwasher", "washing_machine"]

  -- Rules & Preferences
  smoking_allowed BOOLEAN DEFAULT false,
  pets_allowed BOOLEAN DEFAULT false,
  couples_allowed BOOLEAN DEFAULT true,
  children_allowed BOOLEAN DEFAULT true,

  -- Images
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  main_image TEXT,

  -- Status & Metadata
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'rented', 'under_review')),
  views_count INTEGER DEFAULT 0 CHECK (views_count >= 0),
  applications_count INTEGER DEFAULT 0 CHECK (applications_count >= 0),
  favorites_count INTEGER DEFAULT 0 CHECK (favorites_count >= 0),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  published_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,

  -- Search & Indexing
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('french',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(city, '') || ' ' ||
      coalesce(neighborhood, '')
    )
  ) STORED
);

-- ============================================
-- CREATE INDEXES
-- ============================================

-- Primary indexes for filtering
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_neighborhood ON public.properties(neighborhood);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_is_available ON public.properties(is_available);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON public.properties(property_type);

-- Price range queries
CREATE INDEX IF NOT EXISTS idx_properties_monthly_rent ON public.properties(monthly_rent);
CREATE INDEX IF NOT EXISTS idx_properties_rent_bedrooms ON public.properties(monthly_rent, bedrooms);

-- Timestamps
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_published_at ON public.properties(published_at DESC);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_properties_search_vector ON public.properties USING GIN(search_vector);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_properties_owner_status ON public.properties(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_properties_city_status_available ON public.properties(city, status, is_available) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_properties_published_available ON public.properties(status, is_available, monthly_rent) WHERE status = 'published' AND is_available = true;

-- GIN index for amenities queries
CREATE INDEX IF NOT EXISTS idx_properties_amenities ON public.properties USING GIN(amenities);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Policy: Owners can view their own properties
DROP POLICY IF EXISTS "Owners can view own properties" ON public.properties;
CREATE POLICY "Owners can view own properties"
  ON public.properties
  FOR SELECT
  USING (auth.uid() = owner_id);

-- Policy: Owners can insert their own properties
DROP POLICY IF EXISTS "Owners can create properties" ON public.properties;
CREATE POLICY "Owners can create properties"
  ON public.properties
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Owners can update their own properties
DROP POLICY IF EXISTS "Owners can update own properties" ON public.properties;
CREATE POLICY "Owners can update own properties"
  ON public.properties
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Owners can delete their own properties
DROP POLICY IF EXISTS "Owners can delete own properties" ON public.properties;
CREATE POLICY "Owners can delete own properties"
  ON public.properties
  FOR DELETE
  USING (auth.uid() = owner_id);

-- Policy: Everyone can view published and available properties
DROP POLICY IF EXISTS "Anyone can view published properties" ON public.properties;
CREATE POLICY "Anyone can view published properties"
  ON public.properties
  FOR SELECT
  USING (status = 'published' AND is_available = true);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_properties_timestamp ON public.properties;
CREATE TRIGGER update_properties_timestamp
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION update_properties_updated_at();

-- Trigger to set published_at when status changes to published
CREATE OR REPLACE FUNCTION set_property_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    NEW.published_at = NOW();
  END IF;

  IF NEW.status = 'archived' AND (OLD.status IS NULL OR OLD.status != 'archived') THEN
    NEW.archived_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_property_published_at_trigger ON public.properties;
CREATE TRIGGER set_property_published_at_trigger
  BEFORE INSERT OR UPDATE OF status ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION set_property_published_at();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to publish a property
CREATE OR REPLACE FUNCTION publish_property(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.properties
  SET
    status = 'published',
    published_at = NOW()
  WHERE id = property_id AND owner_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to archive a property
CREATE OR REPLACE FUNCTION archive_property(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.properties
  SET
    status = 'archived',
    is_available = false,
    archived_at = NOW()
  WHERE id = property_id AND owner_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark property as rented
CREATE OR REPLACE FUNCTION mark_property_as_rented(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.properties
  SET
    status = 'rented',
    is_available = false
  WHERE id = property_id AND owner_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment views count
CREATE OR REPLACE FUNCTION increment_property_views(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.properties
  SET views_count = views_count + 1
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get properties by city with filters
CREATE OR REPLACE FUNCTION get_properties_by_city(
  p_city VARCHAR,
  p_min_price DECIMAL DEFAULT 0,
  p_max_price DECIMAL DEFAULT 1000000,
  p_bedrooms INTEGER DEFAULT NULL,
  p_property_type VARCHAR DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  monthly_rent DECIMAL,
  bedrooms INTEGER,
  property_type VARCHAR,
  main_image TEXT,
  views_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.monthly_rent,
    p.bedrooms,
    p.property_type,
    p.main_image,
    p.views_count
  FROM public.properties p
  WHERE
    p.city = p_city
    AND p.status = 'published'
    AND p.is_available = true
    AND p.monthly_rent BETWEEN p_min_price AND p_max_price
    AND (p_bedrooms IS NULL OR p.bedrooms = p_bedrooms)
    AND (p_property_type IS NULL OR p.property_type = p_property_type)
  ORDER BY p.published_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.properties IS 'Stores property listings created by property owners';
COMMENT ON COLUMN public.properties.owner_id IS 'References the user who owns/manages this property';
COMMENT ON COLUMN public.properties.amenities IS 'Array of amenity tags (wifi, parking, elevator, etc.)';
COMMENT ON COLUMN public.properties.images IS 'Array of image URLs from Supabase Storage';
COMMENT ON COLUMN public.properties.main_image IS 'Primary image URL for the property';
COMMENT ON COLUMN public.properties.search_vector IS 'Full-text search vector for title, description, city, and neighborhood';
COMMENT ON COLUMN public.properties.status IS 'Property status: draft, published, archived, rented, under_review';
COMMENT ON COLUMN public.properties.views_count IS 'Number of times this property has been viewed';
COMMENT ON COLUMN public.properties.applications_count IS 'Number of applications received for this property';
COMMENT ON COLUMN public.properties.favorites_count IS 'Number of users who favorited this property';

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'properties') THEN
    RAISE NOTICE '✓ Properties table created successfully';
  ELSE
    RAISE EXCEPTION '✗ Properties table creation failed';
  END IF;
END $$;
