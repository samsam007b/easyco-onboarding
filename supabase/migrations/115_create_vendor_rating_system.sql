-- =====================================================
-- Migration: Vendor Rating System
-- Creates vendors table and vendor_ratings table
-- for tracking service providers and their ratings
-- =====================================================

-- Drop existing if needed (for development)
DROP TABLE IF EXISTS vendor_ratings CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;

-- =====================================================
-- VENDORS TABLE
-- Stores service provider information
-- =====================================================
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Owner who added the vendor
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Basic Info
  name TEXT NOT NULL,
  company_name TEXT,

  -- Category matching maintenance categories
  category TEXT NOT NULL CHECK (category IN (
    'plumbing', 'electrical', 'heating', 'appliances',
    'structural', 'cleaning', 'pest_control', 'locksmith',
    'painting', 'gardening', 'general', 'other'
  )),

  -- Contact
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,

  -- Business details
  siret TEXT, -- French business registration number
  insurance_number TEXT,
  is_verified BOOLEAN DEFAULT false,

  -- Computed ratings (updated by trigger)
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,

  -- Preferences
  is_favorite BOOLEAN DEFAULT false,
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for owner queries
CREATE INDEX idx_vendors_owner_id ON vendors(owner_id);
CREATE INDEX idx_vendors_category ON vendors(category);
CREATE INDEX idx_vendors_rating ON vendors(average_rating DESC);

-- =====================================================
-- VENDOR RATINGS TABLE
-- Stores individual ratings after maintenance completion
-- =====================================================
CREATE TABLE IF NOT EXISTS vendor_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  maintenance_request_id UUID REFERENCES maintenance_requests(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,

  -- Ratings (1-5 stars)
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  punctuality_rating INTEGER CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
  price_rating INTEGER CHECK (price_rating >= 1 AND price_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),

  -- Review content
  title TEXT,
  comment TEXT,

  -- Job details
  job_type TEXT, -- Category of maintenance work
  job_cost DECIMAL(10,2),
  job_date DATE,

  -- Would recommend?
  would_recommend BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate ratings for same maintenance request
  UNIQUE(maintenance_request_id, owner_id)
);

-- Indexes
CREATE INDEX idx_vendor_ratings_vendor_id ON vendor_ratings(vendor_id);
CREATE INDEX idx_vendor_ratings_owner_id ON vendor_ratings(owner_id);
CREATE INDEX idx_vendor_ratings_created_at ON vendor_ratings(created_at DESC);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to calculate and update vendor rating
CREATE OR REPLACE FUNCTION update_vendor_rating()
RETURNS TRIGGER AS $$
DECLARE
  new_avg DECIMAL(3,2);
  rating_count INTEGER;
  job_count INTEGER;
BEGIN
  -- Calculate new average rating
  SELECT
    COALESCE(AVG(overall_rating), 0),
    COUNT(*)
  INTO new_avg, rating_count
  FROM vendor_ratings
  WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id);

  -- Count total jobs
  SELECT COUNT(DISTINCT maintenance_request_id)
  INTO job_count
  FROM vendor_ratings
  WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id)
    AND maintenance_request_id IS NOT NULL;

  -- Update vendor record
  UPDATE vendors
  SET
    average_rating = new_avg,
    total_ratings = rating_count,
    total_jobs = GREATEST(job_count, rating_count),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.vendor_id, OLD.vendor_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update vendor rating
DROP TRIGGER IF EXISTS trigger_update_vendor_rating ON vendor_ratings;
CREATE TRIGGER trigger_update_vendor_rating
  AFTER INSERT OR UPDATE OR DELETE ON vendor_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_rating();

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_vendors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_vendors_updated_at ON vendors;
CREATE TRIGGER trigger_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_vendors_updated_at();

DROP TRIGGER IF EXISTS trigger_vendor_ratings_updated_at ON vendor_ratings;
CREATE TRIGGER trigger_vendor_ratings_updated_at
  BEFORE UPDATE ON vendor_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_vendors_updated_at();

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_ratings ENABLE ROW LEVEL SECURITY;

-- Vendors: Owners can only see and manage their own vendors
CREATE POLICY vendors_select_own ON vendors
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY vendors_insert_own ON vendors
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY vendors_update_own ON vendors
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY vendors_delete_own ON vendors
  FOR DELETE USING (owner_id = auth.uid());

-- Vendor Ratings: Owners can see all ratings for their vendors
CREATE POLICY vendor_ratings_select ON vendor_ratings
  FOR SELECT USING (
    owner_id = auth.uid() OR
    vendor_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid())
  );

CREATE POLICY vendor_ratings_insert ON vendor_ratings
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY vendor_ratings_update ON vendor_ratings
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY vendor_ratings_delete ON vendor_ratings
  FOR DELETE USING (owner_id = auth.uid());

-- =====================================================
-- MODIFY MAINTENANCE REQUESTS
-- Add vendor_id foreign key reference
-- =====================================================

-- Add vendor_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maintenance_requests' AND column_name = 'vendor_id'
  ) THEN
    ALTER TABLE maintenance_requests ADD COLUMN vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL;
    CREATE INDEX idx_maintenance_requests_vendor_id ON maintenance_requests(vendor_id);
  END IF;
END $$;

-- Add vendor_rating_submitted column to track if rating was given
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maintenance_requests' AND column_name = 'vendor_rating_submitted'
  ) THEN
    ALTER TABLE maintenance_requests ADD COLUMN vendor_rating_submitted BOOLEAN DEFAULT false;
  END IF;
END $$;

-- =====================================================
-- SAMPLE VENDOR DATA (Optional - for development)
-- =====================================================

-- Uncomment below to add sample vendors for development
/*
INSERT INTO vendors (owner_id, name, company_name, category, phone, email, average_rating, total_ratings, is_favorite)
VALUES
  ((SELECT id FROM profiles LIMIT 1), 'Jean Plombier', 'Plomberie Express', 'plumbing', '06 12 34 56 78', 'jean@plomberie.fr', 4.5, 12, true),
  ((SELECT id FROM profiles LIMIT 1), 'Marie Electricite', 'Elec Pro 75', 'electrical', '06 98 76 54 32', 'marie@elecpro.fr', 4.8, 8, false),
  ((SELECT id FROM profiles LIMIT 1), 'Pierre Chauffage', 'Chauffage Services', 'heating', '06 55 44 33 22', 'pierre@chauffage.fr', 4.2, 5, true);
*/

COMMENT ON TABLE vendors IS 'Service providers added by property owners for maintenance work';
COMMENT ON TABLE vendor_ratings IS 'Ratings and reviews for vendors after maintenance completion';
COMMENT ON COLUMN vendors.average_rating IS 'Calculated average of all ratings (1-5), updated by trigger';
COMMENT ON COLUMN vendor_ratings.would_recommend IS 'Boolean indicating if owner would recommend this vendor';
