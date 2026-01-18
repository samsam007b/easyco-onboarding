-- ============================================================================
-- FIX EXPENSES SCHEMA TO MATCH APPLICATION CODE
-- ============================================================================
-- Add paid_by_id column and rename amount to amount_owed in expense_splits
-- ============================================================================

BEGIN;

-- Add paid_by_id to expenses table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'paid_by_id'
  ) THEN
    ALTER TABLE expenses ADD COLUMN paid_by_id UUID REFERENCES users(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by_id);
  END IF;
END $$;

-- Rename amount to amount_owed in expense_splits if needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expense_splits' AND column_name = 'amount'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expense_splits' AND column_name = 'amount_owed'
  ) THEN
    ALTER TABLE expense_splits RENAME COLUMN amount TO amount_owed;
  END IF;
END $$;

COMMIT;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Expenses schema fixed successfully!';
  RAISE NOTICE '   - Added paid_by_id to expenses table';
  RAISE NOTICE '   - Renamed amount to amount_owed in expense_splits';
END $$;
