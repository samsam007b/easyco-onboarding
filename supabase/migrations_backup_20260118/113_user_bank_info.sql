-- =====================================================
-- USER BANK INFO FOR P2P PAYMENTS
-- =====================================================
-- Stores IBAN and payment info for residents to receive
-- payments from other roommates (expense settlements).
-- This is NOT for processing payments - just for display.
-- Actual payments happen bank-to-bank or via Payconiq.
-- =====================================================

-- =====================================================
-- TABLE: user_bank_info
-- =====================================================
CREATE TABLE IF NOT EXISTS user_bank_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- IBAN (encrypted at rest via Supabase)
  iban VARCHAR(34), -- IBAN format: max 34 chars (e.g., BE68 5390 0754 7034)
  iban_verified BOOLEAN DEFAULT FALSE,
  bank_name VARCHAR(100), -- KBC, ING, Belfius, etc.
  account_holder_name VARCHAR(255), -- Name on account

  -- Alternative payment methods
  revtag VARCHAR(50), -- Revolut tag (e.g., @michel123)
  payconiq_enabled BOOLEAN DEFAULT TRUE, -- If user has Payconiq

  -- BIC/SWIFT (optional, for international)
  bic VARCHAR(11),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_bank_info_user_id ON user_bank_info(user_id);

-- =====================================================
-- TABLE: payment_settlements (P2P debt settlements)
-- =====================================================
CREATE TABLE IF NOT EXISTS payment_settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who owes whom
  payer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  -- Amount and reason
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'EUR',
  description TEXT, -- "Wifi Janvier", "Courses 15/01"

  -- Related expense (optional)
  expense_id UUID REFERENCES expenses(id) ON DELETE SET NULL,

  -- Status flow: pending -> confirmed -> verified (or disputed)
  status TEXT CHECK (status IN (
    'pending',      -- Payer claims they paid
    'confirmed',    -- Payee confirms receipt
    'disputed',     -- Payee disputes the payment
    'cancelled'     -- Either party cancelled
  )) DEFAULT 'pending',

  -- Payment method used
  payment_method TEXT CHECK (payment_method IN (
    'bank_transfer',
    'payconiq',
    'revolut',
    'cash',
    'other'
  )),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ, -- When payer marked as paid
  confirmed_at TIMESTAMPTZ, -- When payee confirmed

  -- Notes
  payer_note TEXT,
  payee_note TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_settlements_payer ON payment_settlements(payer_id);
CREATE INDEX IF NOT EXISTS idx_payment_settlements_payee ON payment_settlements(payee_id);
CREATE INDEX IF NOT EXISTS idx_payment_settlements_property ON payment_settlements(property_id);
CREATE INDEX IF NOT EXISTS idx_payment_settlements_status ON payment_settlements(status);
CREATE INDEX IF NOT EXISTS idx_payment_settlements_expense ON payment_settlements(expense_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE user_bank_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settlements ENABLE ROW LEVEL SECURITY;

-- user_bank_info: Users can only see/edit their own
CREATE POLICY "Users can view own bank info"
  ON user_bank_info FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bank info"
  ON user_bank_info FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bank info"
  ON user_bank_info FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bank info"
  ON user_bank_info FOR DELETE
  USING (auth.uid() = user_id);

-- Roommates can view each other's IBAN (for payments)
CREATE POLICY "Roommates can view bank info for payments"
  ON user_bank_info FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM property_members pm1
      JOIN property_members pm2 ON pm1.property_id = pm2.property_id
      WHERE pm1.user_id = auth.uid()
        AND pm2.user_id = user_bank_info.user_id
        AND pm1.status = 'active'
        AND pm2.status = 'active'
    )
  );

-- payment_settlements: Payer and payee can view
CREATE POLICY "Users can view own settlements"
  ON payment_settlements FOR SELECT
  USING (auth.uid() = payer_id OR auth.uid() = payee_id);

-- Only payer can create settlement
CREATE POLICY "Payers can create settlements"
  ON payment_settlements FOR INSERT
  WITH CHECK (auth.uid() = payer_id);

-- Payer can update (cancel) or payee can update (confirm/dispute)
CREATE POLICY "Users can update own settlements"
  ON payment_settlements FOR UPDATE
  USING (auth.uid() = payer_id OR auth.uid() = payee_id);

-- =====================================================
-- FUNCTION: Get user bank info for display to roommates
-- (Returns masked IBAN for privacy)
-- =====================================================
CREATE OR REPLACE FUNCTION get_roommate_payment_info(p_user_id UUID)
RETURNS TABLE (
  user_id UUID,
  iban_display VARCHAR,
  bank_name VARCHAR,
  account_holder_name VARCHAR,
  revtag VARCHAR,
  payconiq_enabled BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if caller is a roommate
  IF NOT EXISTS (
    SELECT 1 FROM property_members pm1
    JOIN property_members pm2 ON pm1.property_id = pm2.property_id
    WHERE pm1.user_id = auth.uid()
      AND pm2.user_id = p_user_id
      AND pm1.status = 'active'
      AND pm2.status = 'active'
  ) THEN
    RAISE EXCEPTION 'Not authorized to view this information';
  END IF;

  RETURN QUERY
  SELECT
    ubi.user_id,
    -- Show full IBAN (roommates need it to pay)
    ubi.iban AS iban_display,
    ubi.bank_name,
    ubi.account_holder_name,
    ubi.revtag,
    ubi.payconiq_enabled
  FROM user_bank_info ubi
  WHERE ubi.user_id = p_user_id;
END;
$$;

-- =====================================================
-- FUNCTION: Create or update settlement
-- =====================================================
CREATE OR REPLACE FUNCTION create_payment_settlement(
  p_payee_id UUID,
  p_property_id UUID,
  p_amount DECIMAL,
  p_description TEXT DEFAULT NULL,
  p_expense_id UUID DEFAULT NULL,
  p_payment_method TEXT DEFAULT 'bank_transfer'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_settlement_id UUID;
BEGIN
  INSERT INTO payment_settlements (
    payer_id,
    payee_id,
    property_id,
    amount,
    description,
    expense_id,
    payment_method,
    paid_at
  ) VALUES (
    auth.uid(),
    p_payee_id,
    p_property_id,
    p_amount,
    p_description,
    p_expense_id,
    p_payment_method,
    NOW()
  )
  RETURNING id INTO v_settlement_id;

  RETURN v_settlement_id;
END;
$$;

-- =====================================================
-- FUNCTION: Confirm payment received
-- =====================================================
CREATE OR REPLACE FUNCTION confirm_payment_settlement(p_settlement_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE payment_settlements
  SET
    status = 'confirmed',
    confirmed_at = NOW()
  WHERE id = p_settlement_id
    AND payee_id = auth.uid()
    AND status = 'pending';

  RETURN FOUND;
END;
$$;

-- =====================================================
-- FUNCTION: Dispute payment
-- =====================================================
CREATE OR REPLACE FUNCTION dispute_payment_settlement(
  p_settlement_id UUID,
  p_note TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE payment_settlements
  SET
    status = 'disputed',
    payee_note = p_note
  WHERE id = p_settlement_id
    AND payee_id = auth.uid()
    AND status = 'pending';

  RETURN FOUND;
END;
$$;

-- =====================================================
-- Updated at trigger
-- =====================================================
CREATE OR REPLACE FUNCTION update_bank_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_bank_info_updated_at
  BEFORE UPDATE ON user_bank_info
  FOR EACH ROW
  EXECUTE FUNCTION update_bank_info_updated_at();
