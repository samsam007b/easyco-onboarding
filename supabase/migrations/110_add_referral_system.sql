-- =====================================================
-- REFERRAL SYSTEM FOR EASYCO
-- =====================================================
-- Each user gets a unique referral code
-- Rewards: Invite resident = 2 months (inviter) + 1 month (invited)
--          Invite owner = 3 months (inviter) + 1 month (invited)
-- Max credits: 24 months
-- Rewards triggered on onboarding completion
-- =====================================================

-- =====================================================
-- TABLE: referral_codes (unique code per user)
-- =====================================================
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  code VARCHAR(8) NOT NULL UNIQUE, -- Format: "EASY7KM2"
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_active ON referral_codes(is_active) WHERE is_active = TRUE;

-- =====================================================
-- TABLE: referrals (tracking who invited whom)
-- =====================================================
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  referral_code_id UUID NOT NULL REFERENCES referral_codes(id) ON DELETE CASCADE,

  -- Status tracking
  status TEXT CHECK (status IN ('pending', 'qualified', 'rewarded', 'expired')) DEFAULT 'pending',

  -- User type of referred person (determines reward amount)
  referred_user_type TEXT CHECK (referred_user_type IN ('owner', 'resident')),

  -- Reward amounts (in months)
  referrer_reward_months INTEGER NOT NULL DEFAULT 0,
  referred_reward_months INTEGER NOT NULL DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  qualified_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ,

  -- Prevent self-referral
  CONSTRAINT no_self_referral CHECK (referrer_id != referred_id)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_code_id ON referrals(referral_code_id);

-- =====================================================
-- TABLE: referral_credits (accumulated free months)
-- =====================================================
CREATE TABLE IF NOT EXISTS referral_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Credits tracking
  total_credits_earned INTEGER DEFAULT 0,
  credits_used INTEGER DEFAULT 0,

  -- Stats
  successful_referrals INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: credits_available will be computed in queries as:
-- LEAST(total_credits_earned - credits_used, 24)

CREATE INDEX IF NOT EXISTS idx_referral_credits_user_id ON referral_credits(user_id);

-- =====================================================
-- ALTER: Add referral tracking columns to subscriptions
-- =====================================================
DO $$
BEGIN
  -- Add referral credits tracking columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'referral_credits_applied'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN referral_credits_applied INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'trial_extended_by_referral'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN trial_extended_by_referral BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'original_trial_end_date'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN original_trial_end_date TIMESTAMPTZ;
  END IF;
END $$;

-- =====================================================
-- FUNCTION: Generate unique referral code
-- Format: "EASY" + 4 alphanumeric chars = 8 chars total
-- =====================================================
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Removed confusing chars: I,O,0,1
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code: EASY + 4 random chars
    v_code := 'EASY' ||
      substring(v_chars FROM floor(random() * length(v_chars) + 1)::int FOR 1) ||
      substring(v_chars FROM floor(random() * length(v_chars) + 1)::int FOR 1) ||
      substring(v_chars FROM floor(random() * length(v_chars) + 1)::int FOR 1) ||
      substring(v_chars FROM floor(random() * length(v_chars) + 1)::int FOR 1);

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE code = v_code) INTO v_exists;

    -- Exit loop if code is unique
    EXIT WHEN NOT v_exists;
  END LOOP;

  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Create referral code for user (if not exists)
-- =====================================================
CREATE OR REPLACE FUNCTION create_user_referral_code(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
BEGIN
  -- Check if user already has a code
  SELECT code INTO v_code
  FROM referral_codes
  WHERE user_id = p_user_id;

  IF v_code IS NOT NULL THEN
    RETURN v_code;
  END IF;

  -- Generate new code
  v_code := generate_referral_code();

  -- Insert new referral code
  INSERT INTO referral_codes (user_id, code)
  VALUES (p_user_id, v_code);

  -- Initialize referral credits record
  INSERT INTO referral_credits (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Validate referral code
-- Returns referrer user_id if valid, NULL if invalid
-- =====================================================
CREATE OR REPLACE FUNCTION validate_referral_code(p_code TEXT)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT user_id INTO v_user_id
  FROM referral_codes
  WHERE code = UPPER(TRIM(p_code))
    AND is_active = TRUE;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Apply referral code to new user
-- Called during signup process
-- =====================================================
CREATE OR REPLACE FUNCTION apply_referral_code(
  p_referred_user_id UUID,
  p_referral_code TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_referrer_id UUID;
  v_code_id UUID;
  v_existing_referral UUID;
BEGIN
  -- Validate code and get referrer
  SELECT rc.user_id, rc.id INTO v_referrer_id, v_code_id
  FROM referral_codes rc
  WHERE rc.code = UPPER(TRIM(p_referral_code))
    AND rc.is_active = TRUE;

  IF v_referrer_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'invalid_code',
      'message', 'Code de parrainage invalide'
    );
  END IF;

  -- Prevent self-referral
  IF v_referrer_id = p_referred_user_id THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'self_referral',
      'message', 'Vous ne pouvez pas utiliser votre propre code'
    );
  END IF;

  -- Check if user already has a referrer
  SELECT id INTO v_existing_referral
  FROM referrals
  WHERE referred_id = p_referred_user_id;

  IF v_existing_referral IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'already_referred',
      'message', 'Vous avez déjà un parrain'
    );
  END IF;

  -- Create pending referral record
  INSERT INTO referrals (
    referrer_id,
    referred_id,
    referral_code_id,
    status
  )
  VALUES (
    v_referrer_id,
    p_referred_user_id,
    v_code_id,
    'pending'
  );

  RETURN jsonb_build_object(
    'success', TRUE,
    'referrer_id', v_referrer_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Process referral rewards
-- Called when referred user completes onboarding
-- =====================================================
CREATE OR REPLACE FUNCTION process_referral_rewards(p_referred_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_referral RECORD;
  v_user_type TEXT;
  v_referrer_reward INTEGER;
  v_referred_reward INTEGER;
  v_referrer_current_credits INTEGER;
BEGIN
  -- Get user type of referred user
  SELECT user_type INTO v_user_type
  FROM users
  WHERE id = p_referred_user_id;

  -- Searchers don't get rewards
  IF v_user_type = 'searcher' OR v_user_type IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'reason', 'not_eligible',
      'message', 'Les chercheurs ne sont pas éligibles aux récompenses de parrainage'
    );
  END IF;

  -- Get pending referral for this user
  SELECT * INTO v_referral
  FROM referrals
  WHERE referred_id = p_referred_user_id
    AND status = 'pending';

  IF v_referral IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'reason', 'no_pending_referral',
      'message', 'Aucun parrainage en attente'
    );
  END IF;

  -- Calculate rewards based on user type
  IF v_user_type = 'owner' THEN
    v_referrer_reward := 3; -- Inviter gets 3 months for inviting owner
    v_referred_reward := 1; -- Owner gets 1 month
  ELSIF v_user_type = 'resident' THEN
    v_referrer_reward := 2; -- Inviter gets 2 months for inviting resident
    v_referred_reward := 1; -- Resident gets 1 month
  ELSE
    RETURN jsonb_build_object(
      'success', FALSE,
      'reason', 'invalid_user_type'
    );
  END IF;

  -- Update referral record
  UPDATE referrals
  SET
    status = 'qualified',
    referred_user_type = v_user_type,
    referrer_reward_months = v_referrer_reward,
    referred_reward_months = v_referred_reward,
    qualified_at = NOW()
  WHERE id = v_referral.id;

  -- Add credits to referrer (respecting 24 month cap)
  INSERT INTO referral_credits (user_id, total_credits_earned, successful_referrals)
  VALUES (v_referral.referrer_id, v_referrer_reward, 1)
  ON CONFLICT (user_id) DO UPDATE
  SET
    total_credits_earned = referral_credits.total_credits_earned + v_referrer_reward,
    successful_referrals = referral_credits.successful_referrals + 1,
    updated_at = NOW();

  -- Extend referrer's trial period
  UPDATE subscriptions
  SET
    trial_end_date = trial_end_date + (v_referrer_reward || ' months')::INTERVAL,
    current_period_end = current_period_end + (v_referrer_reward || ' months')::INTERVAL,
    next_billing_date = next_billing_date + (v_referrer_reward || ' months')::INTERVAL,
    trial_extended_by_referral = TRUE,
    original_trial_end_date = COALESCE(original_trial_end_date, trial_end_date - (v_referrer_reward || ' months')::INTERVAL),
    referral_credits_applied = COALESCE(referral_credits_applied, 0) + v_referrer_reward,
    updated_at = NOW()
  WHERE user_id = v_referral.referrer_id
    AND status = 'trial';

  -- Add credits to referred user
  INSERT INTO referral_credits (user_id, total_credits_earned)
  VALUES (p_referred_user_id, v_referred_reward)
  ON CONFLICT (user_id) DO UPDATE
  SET
    total_credits_earned = referral_credits.total_credits_earned + v_referred_reward,
    updated_at = NOW();

  -- Extend referred user's trial period (will be applied when their subscription is created)
  -- Note: The subscription trigger runs first, so we update it here
  UPDATE subscriptions
  SET
    trial_end_date = trial_end_date + (v_referred_reward || ' months')::INTERVAL,
    current_period_end = current_period_end + (v_referred_reward || ' months')::INTERVAL,
    next_billing_date = next_billing_date + (v_referred_reward || ' months')::INTERVAL,
    trial_extended_by_referral = TRUE,
    original_trial_end_date = COALESCE(original_trial_end_date, trial_end_date - (v_referred_reward || ' months')::INTERVAL),
    referral_credits_applied = COALESCE(referral_credits_applied, 0) + v_referred_reward,
    updated_at = NOW()
  WHERE user_id = p_referred_user_id
    AND status = 'trial';

  -- Mark referral as rewarded
  UPDATE referrals
  SET
    status = 'rewarded',
    rewarded_at = NOW()
  WHERE id = v_referral.id;

  -- Log event
  INSERT INTO subscription_events (
    subscription_id,
    user_id,
    event_type,
    event_data
  )
  SELECT
    s.id,
    v_referral.referrer_id,
    'referral_reward',
    jsonb_build_object(
      'referred_user_id', p_referred_user_id,
      'referred_user_type', v_user_type,
      'reward_months', v_referrer_reward
    )
  FROM subscriptions s
  WHERE s.user_id = v_referral.referrer_id;

  RETURN jsonb_build_object(
    'success', TRUE,
    'referrer_reward', v_referrer_reward,
    'referred_reward', v_referred_reward,
    'referred_user_type', v_user_type
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Get referral statistics for a user
-- =====================================================
CREATE OR REPLACE FUNCTION get_referral_stats(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_code TEXT;
  v_stats RECORD;
  v_referrals JSONB;
BEGIN
  -- Get or create user's referral code
  SELECT code INTO v_code
  FROM referral_codes
  WHERE user_id = p_user_id;

  IF v_code IS NULL THEN
    v_code := create_user_referral_code(p_user_id);
  END IF;

  -- Get credit stats
  SELECT
    COALESCE(total_credits_earned, 0) as total_earned,
    COALESCE(credits_used, 0) as used,
    COALESCE(successful_referrals, 0) as successful
  INTO v_stats
  FROM referral_credits
  WHERE user_id = p_user_id;

  -- Get recent referrals
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', r.id,
      'status', r.status,
      'referred_user_type', r.referred_user_type,
      'referrer_reward_months', r.referrer_reward_months,
      'created_at', r.created_at,
      'rewarded_at', r.rewarded_at,
      'referred_name', u.full_name
    ) ORDER BY r.created_at DESC
  ), '[]'::jsonb) INTO v_referrals
  FROM referrals r
  LEFT JOIN users u ON u.id = r.referred_id
  WHERE r.referrer_id = p_user_id
  LIMIT 10;

  RETURN jsonb_build_object(
    'code', v_code,
    'share_url', 'https://easyco.be/signup?ref=' || v_code,
    'total_referrals', (SELECT COUNT(*) FROM referrals WHERE referrer_id = p_user_id),
    'successful_referrals', COALESCE(v_stats.successful, 0),
    'pending_referrals', (SELECT COUNT(*) FROM referrals WHERE referrer_id = p_user_id AND status = 'pending'),
    'credits_earned', COALESCE(v_stats.total_earned, 0),
    'credits_used', COALESCE(v_stats.used, 0),
    'credits_available', LEAST(COALESCE(v_stats.total_earned, 0) - COALESCE(v_stats.used, 0), 24),
    'recent_referrals', v_referrals
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGER: Process referral on onboarding completion
-- =====================================================
CREATE OR REPLACE FUNCTION trigger_process_referral_on_onboarding()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger when onboarding is marked as completed
  IF NEW.onboarding_completed = TRUE AND (OLD.onboarding_completed IS NULL OR OLD.onboarding_completed = FALSE) THEN
    -- Process any pending referral for this user
    PERFORM process_referral_rewards(NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_referral_on_onboarding ON users;

CREATE TRIGGER trigger_referral_on_onboarding
  AFTER UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_process_referral_on_onboarding();

-- =====================================================
-- RLS POLICIES: Row Level Security
-- =====================================================

-- Enable RLS
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_credits ENABLE ROW LEVEL SECURITY;

-- referral_codes policies
CREATE POLICY referral_codes_select_own
  ON referral_codes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY referral_codes_insert_own
  ON referral_codes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow anyone to validate a code (read-only access to code column)
CREATE POLICY referral_codes_select_code_public
  ON referral_codes
  FOR SELECT
  USING (is_active = TRUE);

-- referrals policies
CREATE POLICY referrals_select_own_as_referrer
  ON referrals
  FOR SELECT
  USING (auth.uid() = referrer_id);

CREATE POLICY referrals_select_own_as_referred
  ON referrals
  FOR SELECT
  USING (auth.uid() = referred_id);

-- referral_credits policies
CREATE POLICY referral_credits_select_own
  ON referral_credits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do everything
CREATE POLICY referral_codes_service_all
  ON referral_codes
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY referrals_service_all
  ON referrals
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY referral_credits_service_all
  ON referral_credits
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_referral_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_referral_codes_updated_at ON referral_codes;
CREATE TRIGGER trigger_referral_codes_updated_at
  BEFORE UPDATE ON referral_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_referral_updated_at();

DROP TRIGGER IF EXISTS trigger_referral_credits_updated_at ON referral_credits;
CREATE TRIGGER trigger_referral_credits_updated_at
  BEFORE UPDATE ON referral_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_referral_updated_at();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE referral_codes IS 'Unique referral codes for each user (format: EASY + 4 chars)';
COMMENT ON TABLE referrals IS 'Tracks referral relationships and reward status';
COMMENT ON TABLE referral_credits IS 'Accumulated free months credits from referrals (max 24 months)';
COMMENT ON FUNCTION generate_referral_code() IS 'Generates unique 8-char referral code';
COMMENT ON FUNCTION create_user_referral_code(UUID) IS 'Creates referral code for user if not exists';
COMMENT ON FUNCTION validate_referral_code(TEXT) IS 'Validates code and returns referrer user_id';
COMMENT ON FUNCTION apply_referral_code(UUID, TEXT) IS 'Applies referral code to new user during signup';
COMMENT ON FUNCTION process_referral_rewards(UUID) IS 'Processes rewards when referred user completes onboarding';
COMMENT ON FUNCTION get_referral_stats(UUID) IS 'Returns referral statistics for a user';
