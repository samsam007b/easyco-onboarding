-- =====================================================
-- SUBSCRIPTION SYSTEM FOR CLOSED BETA LAUNCH
-- =====================================================
-- Owner: 3 months free trial, then €29/month
-- Resident: 6 months free trial, then €9/month
-- Auto-create subscription on onboarding completion
-- =====================================================

-- Create subscription_status enum
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'past_due', 'canceled', 'expired');

-- Create subscription_plan enum
CREATE TYPE subscription_plan AS ENUM ('owner_monthly', 'resident_monthly', 'owner_annual', 'resident_annual');

-- =====================================================
-- TABLE: subscriptions
-- =====================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('owner', 'resident')),

  -- Plan details
  plan subscription_plan NOT NULL,
  status subscription_status NOT NULL DEFAULT 'trial',

  -- Trial period
  trial_start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trial_end_date TIMESTAMPTZ NOT NULL,
  trial_days_total INTEGER NOT NULL, -- 90 for owner, 180 for resident

  -- Billing
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL,
  next_billing_date TIMESTAMPTZ,

  -- Payment
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  payment_method_last4 TEXT,
  payment_method_brand TEXT,

  -- Cancellation
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  cancellation_reason TEXT,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id), -- One subscription per user
  CONSTRAINT valid_trial_dates CHECK (trial_end_date > trial_start_date),
  CONSTRAINT valid_period_dates CHECK (current_period_end > current_period_start)
);

-- Add index for efficient queries
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_trial_end ON subscriptions(trial_end_date);
CREATE INDEX idx_subscriptions_next_billing ON subscriptions(next_billing_date);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

-- =====================================================
-- TABLE: subscription_events (audit log)
-- =====================================================
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  event_type TEXT NOT NULL, -- 'created', 'trial_started', 'trial_ending_soon', 'trial_ended', 'payment_succeeded', 'payment_failed', 'canceled', 'reactivated'
  event_data JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscription_events_subscription ON subscription_events(subscription_id);
CREATE INDEX idx_subscription_events_user ON subscription_events(user_id);
CREATE INDEX idx_subscription_events_type ON subscription_events(event_type);
CREATE INDEX idx_subscription_events_created ON subscription_events(created_at DESC);

-- =====================================================
-- FUNCTION: Auto-create subscription on onboarding completion
-- =====================================================
CREATE OR REPLACE FUNCTION auto_create_subscription_on_onboarding()
RETURNS TRIGGER AS $$
DECLARE
  v_trial_days INTEGER;
  v_trial_end TIMESTAMPTZ;
  v_plan subscription_plan;
BEGIN
  -- Only trigger when onboarding is marked as completed
  IF NEW.onboarding_completed = TRUE AND (OLD.onboarding_completed IS NULL OR OLD.onboarding_completed = FALSE) THEN

    -- Determine trial period based on user_type
    IF NEW.user_type = 'owner' THEN
      v_trial_days := 90; -- 3 months
      v_plan := 'owner_monthly';
    ELSIF NEW.user_type = 'resident' THEN
      v_trial_days := 180; -- 6 months
      v_plan := 'resident_monthly';
    ELSE
      -- Searcher or other types: no subscription
      RETURN NEW;
    END IF;

    v_trial_end := NOW() + (v_trial_days || ' days')::INTERVAL;

    -- Create subscription record (only if doesn't exist)
    INSERT INTO subscriptions (
      user_id,
      user_type,
      plan,
      status,
      trial_start_date,
      trial_end_date,
      trial_days_total,
      current_period_start,
      current_period_end,
      next_billing_date
    )
    VALUES (
      NEW.id,
      NEW.user_type,
      v_plan,
      'trial',
      NOW(),
      v_trial_end,
      v_trial_days,
      NOW(),
      v_trial_end,
      v_trial_end
    )
    ON CONFLICT (user_id) DO NOTHING; -- Prevent duplicate subscriptions

    -- Log event
    INSERT INTO subscription_events (
      subscription_id,
      user_id,
      event_type,
      event_data
    )
    SELECT
      s.id,
      NEW.id,
      'trial_started',
      jsonb_build_object(
        'user_type', NEW.user_type,
        'trial_days', v_trial_days,
        'trial_end_date', v_trial_end
      )
    FROM subscriptions s
    WHERE s.user_id = NEW.id;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGER: Auto-create subscription when onboarding completes
-- =====================================================
DROP TRIGGER IF EXISTS trigger_auto_create_subscription ON users;

CREATE TRIGGER trigger_auto_create_subscription
  AFTER UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_subscription_on_onboarding();

-- =====================================================
-- FUNCTION: Get subscription status with computed fields
-- =====================================================
CREATE OR REPLACE FUNCTION get_subscription_status(p_user_id UUID)
RETURNS TABLE (
  subscription_id UUID,
  user_type TEXT,
  plan subscription_plan,
  status subscription_status,
  is_trial BOOLEAN,
  trial_days_remaining INTEGER,
  trial_progress_percent INTEGER,
  days_until_billing INTEGER,
  trial_end_date TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id AS subscription_id,
    s.user_type,
    s.plan,
    s.status,
    (s.status = 'trial') AS is_trial,
    GREATEST(0, EXTRACT(DAY FROM (s.trial_end_date - NOW()))::INTEGER) AS trial_days_remaining,
    LEAST(100, GREATEST(0,
      (100 * EXTRACT(EPOCH FROM (NOW() - s.trial_start_date)) /
       EXTRACT(EPOCH FROM (s.trial_end_date - s.trial_start_date)))::INTEGER
    )) AS trial_progress_percent,
    CASE
      WHEN s.next_billing_date IS NOT NULL THEN
        GREATEST(0, EXTRACT(DAY FROM (s.next_billing_date - NOW()))::INTEGER)
      ELSE NULL
    END AS days_until_billing,
    s.trial_end_date,
    s.next_billing_date,
    s.current_period_end,
    s.cancel_at_period_end
  FROM subscriptions s
  WHERE s.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Check if subscription trial is ending soon (7 days)
-- =====================================================
CREATE OR REPLACE FUNCTION is_trial_ending_soon(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_days_remaining INTEGER;
BEGIN
  SELECT GREATEST(0, EXTRACT(DAY FROM (trial_end_date - NOW()))::INTEGER)
  INTO v_days_remaining
  FROM subscriptions
  WHERE user_id = p_user_id AND status = 'trial';

  RETURN (v_days_remaining IS NOT NULL AND v_days_remaining <= 7 AND v_days_remaining > 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS POLICIES: Row Level Security
-- =====================================================

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscription
CREATE POLICY subscriptions_select_own
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own subscription (for cancellation)
CREATE POLICY subscriptions_update_own
  ON subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own subscription events
CREATE POLICY subscription_events_select_own
  ON subscription_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role can do everything (for backend operations)
CREATE POLICY subscriptions_service_all
  ON subscriptions
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY subscription_events_service_all
  ON subscription_events
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- FUNCTION: Update subscription status (cron job will use this)
-- =====================================================
CREATE OR REPLACE FUNCTION update_expired_trials()
RETURNS INTEGER AS $$
DECLARE
  v_updated_count INTEGER;
BEGIN
  -- Update trials that have expired to 'expired' status
  WITH updated AS (
    UPDATE subscriptions
    SET
      status = 'expired',
      updated_at = NOW()
    WHERE
      status = 'trial'
      AND trial_end_date < NOW()
      AND stripe_subscription_id IS NULL -- No payment method set up
    RETURNING id, user_id
  )
  INSERT INTO subscription_events (subscription_id, user_id, event_type, event_data)
  SELECT
    id,
    user_id,
    'trial_ended',
    jsonb_build_object('reason', 'trial_expired', 'auto_updated', TRUE)
  FROM updated;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;

  RETURN v_updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_subscriptions_updated_at ON subscriptions;

CREATE TRIGGER trigger_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();

-- =====================================================
-- INITIAL DATA / COMMENTS
-- =====================================================

COMMENT ON TABLE subscriptions IS 'Subscription management for Owner and Resident users with trial periods';
COMMENT ON TABLE subscription_events IS 'Audit log of all subscription-related events';
COMMENT ON COLUMN subscriptions.trial_days_total IS 'Total trial days: 90 for owner, 180 for resident';
COMMENT ON COLUMN subscriptions.cancel_at_period_end IS 'If TRUE, subscription will not renew after current period';
COMMENT ON FUNCTION auto_create_subscription_on_onboarding() IS 'Automatically creates subscription when user completes onboarding';
COMMENT ON FUNCTION get_subscription_status(UUID) IS 'Returns computed subscription status with trial progress and billing info';
COMMENT ON FUNCTION update_expired_trials() IS 'Batch update expired trials (should be called by cron job daily)';
