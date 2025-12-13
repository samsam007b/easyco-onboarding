-- ============================================================================
-- ENHANCED FINANCES SYSTEM - Rent Payments + OCR Support
-- ============================================================================
-- Tables: rent_payments, enhanced expenses with receipt_image_url
-- Purpose: Complete finance tracking for residents
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. RENT_PAYMENTS TABLE - Separate rent tracking from expenses
-- ============================================================================
CREATE TABLE IF NOT EXISTS rent_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Payment details
  month DATE NOT NULL, -- First day of the month (e.g., 2025-01-01)
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partial')),

  -- Proof and tracking
  proof_url TEXT, -- Receipt/bank transfer screenshot
  paid_at TIMESTAMPTZ,
  due_date DATE NOT NULL, -- When rent is due (e.g., 5th of each month)

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Unique constraint: one payment per user per month per property
  UNIQUE(property_id, user_id, month)
);

-- ============================================================================
-- 2. ENHANCE EXPENSES TABLE - Add OCR support
-- ============================================================================

-- Add receipt_image_url for OCR scanned receipts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'receipt_image_url'
  ) THEN
    ALTER TABLE expenses ADD COLUMN receipt_image_url TEXT;
    RAISE NOTICE '✅ Added receipt_image_url to expenses table';
  END IF;
END $$;

-- Add OCR metadata (stores raw OCR results for debugging)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'ocr_data'
  ) THEN
    ALTER TABLE expenses ADD COLUMN ocr_data JSONB DEFAULT NULL;
    RAISE NOTICE '✅ Added ocr_data to expenses table';
  END IF;
END $$;

-- Add split_method to track how the expense was split
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'split_method'
  ) THEN
    ALTER TABLE expenses ADD COLUMN split_method TEXT DEFAULT 'equal'
      CHECK (split_method IN ('equal', 'custom', 'percentage', 'by_item'));
    RAISE NOTICE '✅ Added split_method to expenses table';
  END IF;
END $$;

-- ============================================================================
-- 3. INDEXES for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_rent_payments_property ON rent_payments(property_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_user ON rent_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_month ON rent_payments(month);
CREATE INDEX IF NOT EXISTS idx_rent_payments_status ON rent_payments(status);
CREATE INDEX IF NOT EXISTS idx_rent_payments_due_date ON rent_payments(due_date);

CREATE INDEX IF NOT EXISTS idx_expenses_receipt_image ON expenses(receipt_image_url) WHERE receipt_image_url IS NOT NULL;

-- ============================================================================
-- 4. RLS POLICIES - Row Level Security
-- ============================================================================

-- Rent payments: Users can only see their own rent payments and those of their property
ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY rent_payments_select_policy ON rent_payments
  FOR SELECT USING (
    user_id = auth.uid() OR
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY rent_payments_insert_policy ON rent_payments
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY rent_payments_update_policy ON rent_payments
  FOR UPDATE USING (
    user_id = auth.uid()
  );

-- ============================================================================
-- 5. FUNCTIONS for smart rent tracking
-- ============================================================================

-- Function to get upcoming rent due dates for a user
CREATE OR REPLACE FUNCTION get_upcoming_rent_dues(p_user_id UUID, p_days_ahead INTEGER DEFAULT 30)
RETURNS TABLE (
  payment_id UUID,
  property_id UUID,
  property_name TEXT,
  amount DECIMAL(10, 2),
  due_date DATE,
  status TEXT,
  days_until_due INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rp.id as payment_id,
    rp.property_id,
    p.title as property_name,
    rp.amount,
    rp.due_date,
    rp.status,
    (rp.due_date - CURRENT_DATE)::INTEGER as days_until_due
  FROM rent_payments rp
  JOIN properties p ON p.id = rp.property_id
  WHERE rp.user_id = p_user_id
    AND rp.status IN ('pending', 'partial')
    AND rp.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + p_days_ahead
  ORDER BY rp.due_date ASC;
END;
$$;

-- Function to calculate average monthly expenses by category
CREATE OR REPLACE FUNCTION get_expense_averages(
  p_property_id UUID,
  p_months INTEGER DEFAULT 3
)
RETURNS TABLE (
  category TEXT,
  avg_amount DECIMAL(10, 2),
  expense_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.category,
    AVG(e.amount)::DECIMAL(10, 2) as avg_amount,
    COUNT(*)::INTEGER as expense_count
  FROM expenses e
  WHERE e.property_id = p_property_id
    AND e.date >= CURRENT_DATE - (p_months || ' months')::INTERVAL
  GROUP BY e.category
  ORDER BY avg_amount DESC;
END;
$$;

-- ============================================================================
-- 6. TRIGGER for updated_at on rent_payments
-- ============================================================================
CREATE TRIGGER update_rent_payments_updated_at
  BEFORE UPDATE ON rent_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. SEED SAMPLE DATA (optional - for testing)
-- ============================================================================

-- This section is commented out by default
-- Uncomment to seed sample rent payment schedules

/*
-- Create rent payment schedule for next 12 months for all property members
INSERT INTO rent_payments (property_id, user_id, month, amount, status, due_date)
SELECT
  pm.property_id,
  pm.user_id,
  date_trunc('month', CURRENT_DATE + (n || ' months')::INTERVAL)::DATE as month,
  COALESCE(p.monthly_rent, 850.00) as amount,
  CASE
    WHEN n = 0 THEN 'pending'
    ELSE 'pending'
  END as status,
  (date_trunc('month', CURRENT_DATE + (n || ' months')::INTERVAL) + INTERVAL '4 days')::DATE as due_date
FROM property_members pm
JOIN properties p ON p.id = pm.property_id
CROSS JOIN generate_series(0, 11) as n
WHERE pm.status = 'active'
ON CONFLICT (property_id, user_id, month) DO NOTHING;
*/

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
DO $$
DECLARE
  rent_count INTEGER;
  expense_col_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO rent_count FROM rent_payments;

  SELECT COUNT(*) INTO expense_col_count
  FROM information_schema.columns
  WHERE table_name = 'expenses'
    AND column_name IN ('receipt_image_url', 'ocr_data', 'split_method');

  RAISE NOTICE '✅ Enhanced Finances System Migration Complete!';
  RAISE NOTICE '   ├─ rent_payments table created';
  RAISE NOTICE '   ├─ expenses table enhanced with OCR support';
  RAISE NOTICE '   ├─ % new columns added to expenses', expense_col_count;
  RAISE NOTICE '   ├─ RLS policies enabled';
  RAISE NOTICE '   ├─ Helper functions created (get_upcoming_rent_dues, get_expense_averages)';
  RAISE NOTICE '   └─ Current rent_payments: %', rent_count;
END $$;
