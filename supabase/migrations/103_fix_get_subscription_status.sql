-- =====================================================
-- FIX get_subscription_status FUNCTION
-- =====================================================
-- The function was incorrectly trying to select trial_days_remaining
-- as a stored column, but it should be computed dynamically.
-- =====================================================

-- Drop existing function
DROP FUNCTION IF EXISTS public.get_subscription_status(uuid);

-- Recreate function with correct column references
CREATE OR REPLACE FUNCTION public.get_subscription_status(p_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_subscription RECORD;
  v_trial_days_remaining INTEGER;
  v_result jsonb;
BEGIN
  -- Get subscription info
  SELECT
    status,
    plan,
    trial_end_date,
    trial_start_date,
    trial_days_total,
    stripe_customer_id,
    stripe_subscription_id,
    current_period_start,
    current_period_end,
    cancel_at_period_end
  INTO v_subscription
  FROM public.subscriptions
  WHERE user_id = p_user_id;

  -- If no subscription found, return error
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'error', 'No subscription found',
      'can_access_features', false
    );
  END IF;

  -- Compute trial_days_remaining dynamically
  v_trial_days_remaining := GREATEST(0, EXTRACT(DAY FROM (v_subscription.trial_end_date - NOW()))::INTEGER);

  -- Build response JSON
  v_result := jsonb_build_object(
    'status', v_subscription.status,
    'plan', v_subscription.plan,
    'trial_end_date', v_subscription.trial_end_date,
    'trial_days_remaining', v_trial_days_remaining,
    'trial_days_total', v_subscription.trial_days_total,
    'is_trial_active', (v_subscription.status = 'trial' AND v_subscription.trial_end_date > NOW()),
    'requires_payment', (v_subscription.status IN ('trial', 'past_due') AND v_subscription.trial_end_date <= NOW()),
    'can_access_features', (v_subscription.status IN ('trial', 'active') AND (v_subscription.status != 'trial' OR v_subscription.trial_end_date > NOW())),
    'has_stripe_subscription', (v_subscription.stripe_subscription_id IS NOT NULL),
    'current_period_start', v_subscription.current_period_start,
    'current_period_end', v_subscription.current_period_end,
    'cancel_at_period_end', COALESCE(v_subscription.cancel_at_period_end, false)
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_subscription_status(uuid) TO authenticated;

COMMENT ON FUNCTION public.get_subscription_status IS 'Get comprehensive subscription status including computed trial days and Stripe billing info';
