-- ============================================================================
-- PAYMENT SYSTEM MIGRATION
-- ============================================================================
-- This migration creates the payment system for rent automation
-- Tables: payment_accounts, transactions, payment_schedules, payment_reminders
-- Features: Stripe integration, automatic rent payments, transaction history

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PAYMENT ACCOUNTS TABLE
-- ============================================================================
-- Stores Stripe customer and payment method information for users
CREATE TABLE IF NOT EXISTS payment_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Stripe Integration
  stripe_customer_id TEXT UNIQUE,
  stripe_payment_method_id TEXT,

  -- Payment Method Details (encrypted/tokenized)
  payment_type TEXT CHECK (payment_type IN ('card', 'bank_transfer', 'sepa_debit', 'ideal')),
  last_four TEXT, -- Last 4 digits of card/account
  card_brand TEXT, -- Visa, Mastercard, etc.
  expiry_month INTEGER,
  expiry_year INTEGER,

  -- Bank Account (for SEPA/transfers)
  bank_name TEXT,
  account_holder_name TEXT,

  -- Status
  is_default BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, stripe_payment_method_id)
);

-- ============================================================================
-- TRANSACTIONS TABLE
-- ============================================================================
-- Records all payment transactions (rent, deposits, fees)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Parties
  payer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  payee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,

  -- Transaction Details
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  currency TEXT DEFAULT 'EUR' CHECK (currency IN ('EUR', 'USD', 'GBP')),

  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'rent_payment',
    'security_deposit',
    'application_fee',
    'service_fee',
    'refund',
    'damage_charge',
    'utility_payment',
    'other'
  )),

  -- Payment Processing
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled',
    'refunded'
  )),

  payment_method TEXT CHECK (payment_method IN ('card', 'bank_transfer', 'sepa_debit', 'cash', 'other')),

  -- Stripe Integration
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  stripe_refund_id TEXT,

  -- Details
  description TEXT,
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,

  -- Fees
  platform_fee DECIMAL(10, 2) DEFAULT 0 CHECK (platform_fee >= 0),
  processing_fee DECIMAL(10, 2) DEFAULT 0 CHECK (processing_fee >= 0),

  -- Metadata
  metadata JSONB DEFAULT '{}',
  receipt_url TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PAYMENT SCHEDULES TABLE
-- ============================================================================
-- Defines recurring payment schedules (e.g., monthly rent)
CREATE TABLE IF NOT EXISTS payment_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Parties
  payer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  payee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,

  -- Schedule Details
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'EUR',

  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),

  payment_type TEXT NOT NULL CHECK (payment_type IN (
    'rent',
    'utilities',
    'service_fee',
    'other'
  )),

  -- Schedule Timing
  start_date DATE NOT NULL,
  end_date DATE,
  next_payment_date DATE NOT NULL,
  day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 31),

  -- Auto-payment
  auto_pay_enabled BOOLEAN DEFAULT false,
  payment_account_id UUID REFERENCES payment_accounts(id) ON DELETE SET NULL,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PAYMENT REMINDERS TABLE
-- ============================================================================
-- Tracks payment reminders sent to users
CREATE TABLE IF NOT EXISTS payment_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  payment_schedule_id UUID REFERENCES payment_schedules(id) ON DELETE CASCADE,

  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Reminder Details
  reminder_type TEXT NOT NULL CHECK (reminder_type IN (
    'upcoming', -- 7 days before
    'due_soon', -- 3 days before
    'due_today',
    'overdue',
    'failed_payment'
  )),

  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,

  -- Notification
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notification_method TEXT CHECK (notification_method IN ('email', 'push', 'sms', 'in_app')),

  -- Status
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Payment Accounts
CREATE INDEX idx_payment_accounts_user_id ON payment_accounts(user_id);
CREATE INDEX idx_payment_accounts_stripe_customer_id ON payment_accounts(stripe_customer_id);

-- Transactions
CREATE INDEX idx_transactions_payer_id ON transactions(payer_id);
CREATE INDEX idx_transactions_payee_id ON transactions(payee_id);
CREATE INDEX idx_transactions_property_id ON transactions(property_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_due_date ON transactions(due_date);
CREATE INDEX idx_transactions_type_status ON transactions(transaction_type, status);

-- Payment Schedules
CREATE INDEX idx_payment_schedules_payer_id ON payment_schedules(payer_id);
CREATE INDEX idx_payment_schedules_property_id ON payment_schedules(property_id);
CREATE INDEX idx_payment_schedules_next_payment ON payment_schedules(next_payment_date);
CREATE INDEX idx_payment_schedules_active ON payment_schedules(is_active) WHERE is_active = true;

-- Payment Reminders
CREATE INDEX idx_payment_reminders_user_id ON payment_reminders(user_id);
CREATE INDEX idx_payment_reminders_transaction_id ON payment_reminders(transaction_id);
CREATE INDEX idx_payment_reminders_due_date ON payment_reminders(due_date);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE payment_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;

-- Payment Accounts Policies
CREATE POLICY "Users can view their own payment accounts"
  ON payment_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment accounts"
  ON payment_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment accounts"
  ON payment_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment accounts"
  ON payment_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Transactions Policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = payer_id OR auth.uid() = payee_id);

CREATE POLICY "Payers can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = payer_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = payer_id OR auth.uid() = payee_id);

-- Payment Schedules Policies
CREATE POLICY "Users can view their payment schedules"
  ON payment_schedules FOR SELECT
  USING (auth.uid() = payer_id OR auth.uid() = payee_id);

CREATE POLICY "Payers can create payment schedules"
  ON payment_schedules FOR INSERT
  WITH CHECK (auth.uid() = payer_id);

CREATE POLICY "Users can update their payment schedules"
  ON payment_schedules FOR UPDATE
  USING (auth.uid() = payer_id OR auth.uid() = payee_id);

CREATE POLICY "Users can delete their payment schedules"
  ON payment_schedules FOR DELETE
  USING (auth.uid() = payer_id);

-- Payment Reminders Policies
CREATE POLICY "Users can view their payment reminders"
  ON payment_reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their payment reminders"
  ON payment_reminders FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_payment_accounts_updated_at
  BEFORE UPDATE ON payment_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_updated_at();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_updated_at();

CREATE TRIGGER update_payment_schedules_updated_at
  BEFORE UPDATE ON payment_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_updated_at();

-- Function to get next payment date based on frequency
CREATE OR REPLACE FUNCTION calculate_next_payment_date(
  current_date DATE,
  frequency_type TEXT,
  day_of_month_param INTEGER DEFAULT NULL
)
RETURNS DATE AS $$
BEGIN
  CASE frequency_type
    WHEN 'weekly' THEN
      RETURN current_date + INTERVAL '7 days';
    WHEN 'biweekly' THEN
      RETURN current_date + INTERVAL '14 days';
    WHEN 'monthly' THEN
      IF day_of_month_param IS NOT NULL THEN
        RETURN (DATE_TRUNC('month', current_date) + INTERVAL '1 month' + (day_of_month_param - 1 || ' days')::INTERVAL)::DATE;
      ELSE
        RETURN (current_date + INTERVAL '1 month')::DATE;
      END IF;
    WHEN 'quarterly' THEN
      RETURN (current_date + INTERVAL '3 months')::DATE;
    WHEN 'yearly' THEN
      RETURN (current_date + INTERVAL '1 year')::DATE;
    ELSE
      RETURN current_date;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to get upcoming payments for a user
CREATE OR REPLACE FUNCTION get_upcoming_payments(user_uuid UUID, days_ahead INTEGER DEFAULT 30)
RETURNS TABLE (
  schedule_id UUID,
  amount DECIMAL,
  next_payment_date DATE,
  payment_type TEXT,
  property_id UUID,
  auto_pay_enabled BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ps.id,
    ps.amount,
    ps.next_payment_date,
    ps.payment_type,
    ps.property_id,
    ps.auto_pay_enabled
  FROM payment_schedules ps
  WHERE ps.payer_id = user_uuid
    AND ps.is_active = true
    AND ps.next_payment_date <= CURRENT_DATE + days_ahead
  ORDER BY ps.next_payment_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get transaction summary for a user
CREATE OR REPLACE FUNCTION get_transaction_summary(user_uuid UUID, months_back INTEGER DEFAULT 12)
RETURNS TABLE (
  total_paid DECIMAL,
  total_received DECIMAL,
  pending_amount DECIMAL,
  transaction_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN payer_id = user_uuid AND status = 'completed' THEN amount ELSE 0 END), 0) as total_paid,
    COALESCE(SUM(CASE WHEN payee_id = user_uuid AND status = 'completed' THEN amount ELSE 0 END), 0) as total_received,
    COALESCE(SUM(CASE WHEN payer_id = user_uuid AND status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount,
    COUNT(*)::INTEGER as transaction_count
  FROM transactions
  WHERE (payer_id = user_uuid OR payee_id = user_uuid)
    AND created_at >= CURRENT_DATE - (months_back || ' months')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE payment_accounts IS 'Stores user payment methods and Stripe customer information';
COMMENT ON TABLE transactions IS 'Records all payment transactions in the system';
COMMENT ON TABLE payment_schedules IS 'Defines recurring payment schedules for rent and other fees';
COMMENT ON TABLE payment_reminders IS 'Tracks payment reminders sent to users';

COMMENT ON FUNCTION calculate_next_payment_date IS 'Calculates the next payment date based on frequency';
COMMENT ON FUNCTION get_upcoming_payments IS 'Returns upcoming payments for a user within specified days';
COMMENT ON FUNCTION get_transaction_summary IS 'Returns transaction summary statistics for a user';
