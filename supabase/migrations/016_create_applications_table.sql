-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Property and applicant
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Application details
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'withdrawn', 'expired')),

  -- Move-in details
  desired_move_in_date DATE,
  lease_duration_months INTEGER,

  -- Applicant information (snapshot at time of application)
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,

  -- Professional/Financial info
  occupation TEXT,
  monthly_income DECIMAL,
  employer_name TEXT,

  -- Personal message
  message TEXT,

  -- Documents (URLs to Supabase Storage)
  id_document_url TEXT,
  proof_of_income_url TEXT,
  reference_letter_url TEXT,

  -- Review
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  rejection_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Prevent duplicate applications
  UNIQUE(property_id, applicant_id)
);

-- Indexes for performance
CREATE INDEX idx_applications_property_id ON public.applications(property_id);
CREATE INDEX idx_applications_applicant_id ON public.applications(applicant_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX idx_applications_property_status ON public.applications(property_id, status);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Applicants can view their own applications
CREATE POLICY "Applicants can view own applications"
  ON public.applications
  FOR SELECT
  USING (auth.uid() = applicant_id);

-- Property owners can view applications for their properties
CREATE POLICY "Owners can view applications for their properties"
  ON public.applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id
      AND p.owner_id = auth.uid()
    )
  );

-- Authenticated users can create applications
CREATE POLICY "Users can create applications"
  ON public.applications
  FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

-- Applicants can update their own pending applications
CREATE POLICY "Applicants can update own pending applications"
  ON public.applications
  FOR UPDATE
  USING (
    auth.uid() = applicant_id
    AND status IN ('pending', 'reviewing')
  );

-- Property owners can update applications for their properties
CREATE POLICY "Owners can update applications for their properties"
  ON public.applications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id
      AND p.owner_id = auth.uid()
    )
  );

-- Applicants can withdraw their applications
CREATE POLICY "Applicants can delete own applications"
  ON public.applications
  FOR DELETE
  USING (auth.uid() = applicant_id AND status = 'pending');

-- Function to update application timestamp
CREATE OR REPLACE FUNCTION update_application_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp
CREATE TRIGGER trigger_update_application_timestamp
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION update_application_timestamp();

-- Function to notify when new application is submitted
CREATE OR REPLACE FUNCTION notify_new_application()
RETURNS TRIGGER AS $$
DECLARE
  owner_id UUID;
  property_title TEXT;
BEGIN
  -- Get property owner and title
  SELECT p.owner_id, p.title INTO owner_id, property_title
  FROM public.properties p
  WHERE p.id = NEW.property_id;

  -- Create notification for property owner
  PERFORM create_notification(
    owner_id,
    'application',
    'New application received',
    NEW.applicant_name || ' applied for your property "' || COALESCE(property_title, 'Untitled') || '"',
    NEW.applicant_id,
    NEW.property_id,
    NULL,
    '/applications/' || NEW.id,
    jsonb_build_object('application_id', NEW.id, 'status', NEW.status)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification when application is submitted
CREATE TRIGGER trigger_notify_new_application
  AFTER INSERT ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_application();

-- Function to notify applicant when application status changes
CREATE OR REPLACE FUNCTION notify_application_status_change()
RETURNS TRIGGER AS $$
DECLARE
  property_title TEXT;
  status_message TEXT;
BEGIN
  -- Only notify if status changed
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  -- Get property title
  SELECT title INTO property_title
  FROM public.properties
  WHERE id = NEW.property_id;

  -- Create status message
  CASE NEW.status
    WHEN 'approved' THEN
      status_message := 'Your application for "' || COALESCE(property_title, 'Untitled') || '" has been approved! 🎉';
    WHEN 'rejected' THEN
      status_message := 'Your application for "' || COALESCE(property_title, 'Untitled') || '" was not accepted.';
    WHEN 'reviewing' THEN
      status_message := 'Your application for "' || COALESCE(property_title, 'Untitled') || '" is being reviewed.';
    ELSE
      status_message := 'Your application status has changed to: ' || NEW.status;
  END CASE;

  -- Create notification for applicant
  PERFORM create_notification(
    NEW.applicant_id,
    'application_status',
    'Application status update',
    status_message,
    NULL,
    NEW.property_id,
    NULL,
    '/applications/' || NEW.id,
    jsonb_build_object('application_id', NEW.id, 'status', NEW.status)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to notify on status change
CREATE TRIGGER trigger_notify_application_status_change
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_application_status_change();

-- Add application count to properties (materialized view or function)
CREATE OR REPLACE FUNCTION get_property_application_count(p_property_id UUID)
RETURNS INTEGER AS $$
DECLARE
  app_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO app_count
  FROM public.applications
  WHERE property_id = p_property_id
  AND status IN ('pending', 'reviewing', 'approved');

  RETURN COALESCE(app_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE public.applications IS 'Stores property rental applications from searchers';
COMMENT ON COLUMN public.applications.status IS 'Application status: pending, reviewing, approved, rejected, withdrawn, expired';
COMMENT ON COLUMN public.applications.desired_move_in_date IS 'When the applicant wants to move in';
COMMENT ON COLUMN public.applications.message IS 'Personal message from applicant to owner';
COMMENT ON COLUMN public.applications.review_notes IS 'Internal notes from owner about the application';
COMMENT ON COLUMN public.applications.rejection_reason IS 'Reason provided to applicant if rejected';
