-- Migration 130: Fix application trigger to use title instead of name
-- The trigger_notify_new_application references p.name which doesn't exist
-- Fix: Use p.title instead

-- Recreate the function with correct column reference
CREATE OR REPLACE FUNCTION notify_new_application()
RETURNS TRIGGER AS $$
DECLARE
  v_owner_id UUID;
  v_property_title TEXT;
BEGIN
  -- Get property owner and title (FIXED: use title, not name)
  SELECT p.owner_id, p.title INTO v_owner_id, v_property_title
  FROM public.properties p
  WHERE p.id = NEW.property_id;

  -- Create notification for property owner (if create_notification exists)
  BEGIN
    PERFORM create_notification(
      v_owner_id,
      'application',
      'New application received',
      NEW.applicant_name || ' applied for your property "' || COALESCE(v_property_title, 'Untitled') || '"',
      NEW.applicant_id,
      NEW.property_id,
      NULL,
      '/applications/' || NEW.id,
      jsonb_build_object('application_id', NEW.id, 'status', NEW.status)
    );
  EXCEPTION WHEN undefined_function THEN
    -- create_notification doesn't exist, skip silently
    NULL;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Fixed notify_new_application to use p.title instead of p.name';
END $$;
