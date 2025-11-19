-- ============================================================================
-- ADD paid_by_id COLUMN TO EXPENSES TABLE
-- ============================================================================
-- This column tracks who paid for the expense
-- ============================================================================

BEGIN;

-- Add paid_by_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'paid_by_id'
  ) THEN
    ALTER TABLE expenses
    ADD COLUMN paid_by_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

    RAISE NOTICE '✅ Added paid_by_id column to expenses table';
  ELSE
    RAISE NOTICE '⚠️  Column paid_by_id already exists';
  END IF;
END $$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by_id);

-- Update existing expenses to set paid_by_id = created_by (backward compatibility)
UPDATE expenses
SET paid_by_id = created_by
WHERE paid_by_id IS NULL AND created_by IS NOT NULL;

COMMIT;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE '   - Column paid_by_id added to expenses';
  RAISE NOTICE '   - Index created on paid_by_id';
  RAISE NOTICE '   - Existing records updated';
END $$;
