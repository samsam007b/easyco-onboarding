-- =====================================================
-- ADD STRIPE FIELDS TO SUBSCRIPTIONS TABLE
-- =====================================================
-- Adds Stripe-related columns to track payment information
-- =====================================================

-- Add Stripe-related fields to subscriptions table
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id
  ON public.subscriptions(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id
  ON public.subscriptions(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- Add unique constraint on stripe_subscription_id (one subscription per Stripe sub)
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id_unique
  ON public.subscriptions(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.subscriptions.stripe_customer_id IS 'Stripe Customer ID (cus_...) - Links to Stripe customer';
COMMENT ON COLUMN public.subscriptions.stripe_subscription_id IS 'Stripe Subscription ID (sub_...) - Links to Stripe subscription';
COMMENT ON COLUMN public.subscriptions.stripe_price_id IS 'Stripe Price ID (price_...) - The selected pricing plan';
COMMENT ON COLUMN public.subscriptions.current_period_start IS 'Start of current billing period (from Stripe)';
COMMENT ON COLUMN public.subscriptions.current_period_end IS 'End of current billing period (from Stripe)';
COMMENT ON COLUMN public.subscriptions.cancel_at_period_end IS 'Whether subscription will cancel at end of current period';

-- Drop existing function first (to allow changing return type)
DROP FUNCTION IF EXISTS public.get_subscription_status(uuid);

-- Update the get_subscription_status function to include Stripe info
CREATE OR REPLACE FUNCTION public.get_subscription_status(p_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_subscription RECORD;
  v_result jsonb;
BEGIN
  -- Get subscription info
  SELECT
    status,
    plan,
    trial_end_date,
    trial_days_remaining,
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

  -- Build response JSON
  v_result := jsonb_build_object(
    'status', v_subscription.status,
    'plan', v_subscription.plan,
    'trial_end_date', v_subscription.trial_end_date,
    'trial_days_remaining', v_subscription.trial_days_remaining,
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

COMMENT ON FUNCTION public.get_subscription_status IS 'Get comprehensive subscription status including Stripe billing info';
