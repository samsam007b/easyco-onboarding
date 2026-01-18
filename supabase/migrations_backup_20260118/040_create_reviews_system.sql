-- Create reviews table for properties and residents
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Review type: property or resident
  review_type TEXT NOT NULL CHECK (review_type IN ('property', 'resident')),

  -- Foreign keys
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  resident_id UUID REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Rating (1-5 stars)
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),

  -- Review content
  title TEXT,
  comment TEXT,

  -- Detailed ratings for properties
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  amenities_rating INTEGER CHECK (amenities_rating >= 1 AND amenities_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),

  -- Helpful votes
  helpful_count INTEGER DEFAULT 0,

  -- Verification - only tenants who stayed can review
  verified_stay BOOLEAN DEFAULT false,
  stay_duration_months INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT review_target_check CHECK (
    (review_type = 'property' AND property_id IS NOT NULL AND resident_id IS NULL) OR
    (review_type = 'resident' AND resident_id IS NOT NULL AND property_id IS NULL)
  ),

  -- Prevent duplicate reviews
  UNIQUE(reviewer_id, property_id),
  UNIQUE(reviewer_id, resident_id)
);

-- Indexes for performance
CREATE INDEX idx_reviews_property_id ON public.reviews(property_id);
CREATE INDEX idx_reviews_resident_id ON public.reviews(resident_id);
CREATE INDEX idx_reviews_reviewer_id ON public.reviews(reviewer_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Anyone can view published reviews
CREATE POLICY "Anyone can view reviews"
  ON public.reviews
  FOR SELECT
  USING (true);

-- Users can create reviews for properties they stayed at
CREATE POLICY "Users can create reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON public.reviews
  FOR UPDATE
  USING (auth.uid() = reviewer_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON public.reviews
  FOR DELETE
  USING (auth.uid() = reviewer_id);

-- Function to update review timestamp
CREATE OR REPLACE FUNCTION update_review_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp
CREATE TRIGGER trigger_update_review_timestamp
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_review_timestamp();

-- Function to calculate average rating for a property
CREATE OR REPLACE FUNCTION calculate_property_rating(p_property_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  avg_rating NUMERIC;
  total_reviews INTEGER;
BEGIN
  SELECT
    ROUND(AVG(rating)::numeric, 2),
    COUNT(*)::INTEGER
  INTO avg_rating, total_reviews
  FROM public.reviews
  WHERE property_id = p_property_id;

  result := jsonb_build_object(
    'average_rating', COALESCE(avg_rating, 0),
    'total_reviews', COALESCE(total_reviews, 0)
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate average rating for a resident
CREATE OR REPLACE FUNCTION calculate_resident_rating(p_resident_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  avg_rating NUMERIC;
  total_reviews INTEGER;
BEGIN
  SELECT
    ROUND(AVG(rating)::numeric, 2),
    COUNT(*)::INTEGER
  INTO avg_rating, total_reviews
  FROM public.reviews
  WHERE resident_id = p_resident_id;

  result := jsonb_build_object(
    'average_rating', COALESCE(avg_rating, 0),
    'total_reviews', COALESCE(total_reviews, 0)
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update property rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_property_rating()
RETURNS TRIGGER AS $$
DECLARE
  p_id UUID;
BEGIN
  -- Get property_id from OLD or NEW
  IF TG_OP = 'DELETE' THEN
    p_id := OLD.property_id;
  ELSE
    p_id := NEW.property_id;
  END IF;

  -- Only update if this is a property review
  IF p_id IS NOT NULL THEN
    -- Update the properties table with new rating
    UPDATE public.properties
    SET
      rating = (
        SELECT ROUND(AVG(rating)::numeric, 2)
        FROM public.reviews
        WHERE property_id = p_id
      ),
      reviews_count = (
        SELECT COUNT(*)
        FROM public.reviews
        WHERE property_id = p_id
      ),
      updated_at = now()
    WHERE id = p_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update property rating
CREATE TRIGGER trigger_update_property_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_property_rating();

-- Function to check if user can review property (must have stayed there)
CREATE OR REPLACE FUNCTION can_review_property(p_property_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_approved_application BOOLEAN;
BEGIN
  -- Check if user has an approved application for this property
  SELECT EXISTS(
    SELECT 1
    FROM public.applications
    WHERE property_id = p_property_id
    AND applicant_id = p_user_id
    AND status = 'approved'
  ) INTO has_approved_application;

  RETURN has_approved_application;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table to track helpful votes on reviews
CREATE TABLE IF NOT EXISTS public.review_helpful_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(review_id, user_id)
);

-- Index for helpful votes
CREATE INDEX idx_review_helpful_votes_review_id ON public.review_helpful_votes(review_id);
CREATE INDEX idx_review_helpful_votes_user_id ON public.review_helpful_votes(user_id);

-- Enable RLS on helpful votes
ALTER TABLE public.review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Anyone can view helpful votes
CREATE POLICY "Anyone can view helpful votes"
  ON public.review_helpful_votes
  FOR SELECT
  USING (true);

-- Users can add helpful votes
CREATE POLICY "Users can add helpful votes"
  ON public.review_helpful_votes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their helpful votes
CREATE POLICY "Users can remove helpful votes"
  ON public.review_helpful_votes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update helpful count when vote is added/removed
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.reviews
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.review_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.reviews
    SET helpful_count = helpful_count - 1
    WHERE id = OLD.review_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update helpful count
CREATE TRIGGER trigger_update_review_helpful_count
  AFTER INSERT OR DELETE ON public.review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Comments
COMMENT ON TABLE public.reviews IS 'Property and resident reviews';
COMMENT ON COLUMN public.reviews.review_type IS 'Type of review: property or resident';
COMMENT ON COLUMN public.reviews.verified_stay IS 'Whether the reviewer actually stayed at the property';
COMMENT ON COLUMN public.reviews.helpful_count IS 'Number of users who found this review helpful';

COMMENT ON TABLE public.review_helpful_votes IS 'Tracks which users found reviews helpful';
