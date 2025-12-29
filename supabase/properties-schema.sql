-- Properties Table Schema for Izzico
-- This table stores property listings created by Owners

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Information
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type VARCHAR(50) NOT NULL, -- apartment, house, studio, coliving, etc.

  -- Location
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'France',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Property Details
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  total_rooms INTEGER,
  surface_area INTEGER, -- in square meters
  floor_number INTEGER,
  total_floors INTEGER,
  furnished BOOLEAN DEFAULT false,

  -- Pricing
  monthly_rent DECIMAL(10, 2) NOT NULL,
  charges DECIMAL(10, 2) DEFAULT 0, -- additional charges
  deposit DECIMAL(10, 2), -- security deposit

  -- Availability
  available_from DATE,
  available_until DATE,
  minimum_stay_months INTEGER DEFAULT 1,
  is_available BOOLEAN DEFAULT true,

  -- Amenities (stored as JSONB for flexibility)
  amenities JSONB DEFAULT '[]'::jsonb,
  -- Example: ["wifi", "parking", "elevator", "balcony", "garden", "gym", "laundry"]

  -- Rules & Preferences
  smoking_allowed BOOLEAN DEFAULT false,
  pets_allowed BOOLEAN DEFAULT false,
  couples_allowed BOOLEAN DEFAULT true,

  -- Images
  images JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"url": "...", "alt": "..."}, ...]
  main_image_url TEXT,

  -- Status & Metadata
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived, rented
  views_count INTEGER DEFAULT 0,
  inquiries_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Search & Indexing
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('french', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(city, ''))
  ) STORED
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_is_available ON public.properties(is_available);
CREATE INDEX IF NOT EXISTS idx_properties_monthly_rent ON public.properties(monthly_rent);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_search_vector ON public.properties USING GIN(search_vector);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_properties_owner_status ON public.properties(owner_id, status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Owners can view their own properties
CREATE POLICY "Owners can view own properties"
  ON public.properties
  FOR SELECT
  USING (auth.uid() = owner_id);

-- Policy: Owners can insert their own properties
CREATE POLICY "Owners can create properties"
  ON public.properties
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Owners can update their own properties
CREATE POLICY "Owners can update own properties"
  ON public.properties
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Owners can delete their own properties
CREATE POLICY "Owners can delete own properties"
  ON public.properties
  FOR DELETE
  USING (auth.uid() = owner_id);

-- Policy: Everyone can view published properties
CREATE POLICY "Anyone can view published properties"
  ON public.properties
  FOR SELECT
  USING (status = 'published' AND is_available = true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_timestamp
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION update_properties_updated_at();

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
    is_available = false
  WHERE id = property_id AND owner_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE public.properties IS 'Stores property listings created by property owners';
COMMENT ON COLUMN public.properties.owner_id IS 'References the user who owns/manages this property';
COMMENT ON COLUMN public.properties.amenities IS 'Array of amenity tags (wifi, parking, etc.)';
COMMENT ON COLUMN public.properties.images IS 'Array of image objects with url and alt text';
COMMENT ON COLUMN public.properties.search_vector IS 'Full-text search vector for title, description, and city';
