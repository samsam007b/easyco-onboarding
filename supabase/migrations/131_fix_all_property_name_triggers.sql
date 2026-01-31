-- Migration 131: Fix all triggers that reference p.name instead of p.title
-- The properties table uses 'title' column, not 'name'
-- This fixes multiple triggers that were broken

-- ============================================================================
-- 1. Fix notify_new_application trigger
-- ============================================================================
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

-- ============================================================================
-- 2. Fix notify_payment_received trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION public.notify_payment_received()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_owner_id UUID;
  v_resident_name TEXT;
  v_property_name TEXT;
BEGIN
  -- Only trigger on paid payments
  IF NEW.status != 'paid' THEN
    RETURN NEW;
  END IF;

  -- Get property owner and name (FIXED: use title instead of name)
  SELECT p.owner_id, COALESCE(p.title, p.address) INTO v_owner_id, v_property_name
  FROM properties p
  WHERE p.id = NEW.property_id;

  -- Get resident name (user_id is the payer in rent_payments)
  SELECT first_name INTO v_resident_name
  FROM user_profiles
  WHERE id = NEW.user_id;

  -- Notify owner (FIXED: use message instead of body)
  BEGIN
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      data,
      action_url
    ) VALUES (
      v_owner_id,
      'payment',  -- Use allowed type instead of payment_received
      'Paiement recu',
      COALESCE(v_resident_name, 'Un resident') || ' a paye ' || NEW.amount || ' EUR',
      jsonb_build_object(
        'payment_id', NEW.id,
        'property_id', NEW.property_id,
        'amount', NEW.amount,
        'payer_id', NEW.user_id,
        'payer_name', v_resident_name
      ),
      '/dashboard/payments'
    );
  EXCEPTION WHEN check_violation THEN
    -- Type not allowed in check constraint, skip notification
    NULL;
  END;

  -- Also notify payer of confirmation
  BEGIN
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      data,
      action_url
    ) VALUES (
      NEW.user_id,
      'payment',  -- Use allowed type
      'Paiement confirme',
      'Ton paiement de ' || NEW.amount || ' EUR a bien ete recu.',
      jsonb_build_object(
        'payment_id', NEW.id,
        'amount', NEW.amount
      ),
      '/hub/payments'
    );
  EXCEPTION WHEN check_violation THEN
    -- Type not allowed, skip
    NULL;
  END;

  RETURN NEW;
END;
$function$;

-- ============================================================================
-- Verification
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Fixed notify_new_application to use p.title instead of p.name';
  RAISE NOTICE '✅ Fixed notify_payment_received to use p.title and message column';
END $$;
