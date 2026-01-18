-- ============================================================================
-- ADD amount_owed COLUMN TO EXPENSE_SPLITS TABLE
-- ============================================================================
-- This column tracks how much each user owes for a split expense
-- ============================================================================

BEGIN;

-- Add amount_owed column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expense_splits' AND column_name = 'amount_owed'
  ) THEN
    ALTER TABLE expense_splits
    ADD COLUMN amount_owed DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (amount_owed >= 0);

    RAISE NOTICE '✅ Added amount_owed column to expense_splits table';
  ELSE
    RAISE NOTICE '⚠️  Column amount_owed already exists';
  END IF;
END $$;

-- If there's an old 'amount' column, migrate data and drop it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expense_splits' AND column_name = 'amount'
  ) THEN
    -- Copy data from old column to new column
    UPDATE expense_splits SET amount_owed = amount WHERE amount_owed = 0;

    -- Drop the old column
    ALTER TABLE expense_splits DROP COLUMN amount;

    RAISE NOTICE '✅ Migrated data from amount to amount_owed and dropped old column';
  END IF;
END $$;

COMMIT;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE '   - Column amount_owed is ready in expense_splits';
END $$;
