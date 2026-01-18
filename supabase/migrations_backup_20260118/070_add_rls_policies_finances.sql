-- ============================================================================
-- ADD RLS POLICIES FOR FINANCES TABLES
-- ============================================================================
-- This migration adds Row Level Security policies for:
-- - property_members
-- - expenses
-- - expense_splits
-- ============================================================================

BEGIN;

-- ============================================================================
-- PROPERTY_MEMBERS RLS POLICIES
-- ============================================================================

-- Enable RLS on property_members
ALTER TABLE property_members ENABLE ROW LEVEL SECURITY;

-- Users can view their own property memberships
CREATE POLICY "property_members_select_own"
ON property_members FOR SELECT
USING (auth.uid() = user_id);

-- Users can view all members of properties they belong to
CREATE POLICY "property_members_select_property"
ON property_members FOR SELECT
USING (
  property_id IN (
    SELECT property_id FROM property_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Users can insert their own memberships (for invitations)
CREATE POLICY "property_members_insert_own"
ON property_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own memberships
CREATE POLICY "property_members_update_own"
ON property_members FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================================================
-- EXPENSES RLS POLICIES
-- ============================================================================

-- Enable RLS on expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Users can view expenses for properties they belong to
CREATE POLICY "expenses_select_property_members"
ON expenses FOR SELECT
USING (
  property_id IN (
    SELECT property_id FROM property_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Users can create expenses for properties they belong to
CREATE POLICY "expenses_insert_property_members"
ON expenses FOR INSERT
WITH CHECK (
  property_id IN (
    SELECT property_id FROM property_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Users can update their own expenses
CREATE POLICY "expenses_update_own"
ON expenses FOR UPDATE
USING (created_by = auth.uid());

-- Users can delete their own expenses
CREATE POLICY "expenses_delete_own"
ON expenses FOR DELETE
USING (created_by = auth.uid());

-- ============================================================================
-- EXPENSE_SPLITS RLS POLICIES
-- ============================================================================

-- Enable RLS on expense_splits
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;

-- Users can view expense splits for expenses in their properties
CREATE POLICY "expense_splits_select_property_members"
ON expense_splits FOR SELECT
USING (
  expense_id IN (
    SELECT e.id FROM expenses e
    INNER JOIN property_members pm ON e.property_id = pm.property_id
    WHERE pm.user_id = auth.uid() AND pm.status = 'active'
  )
);

-- Users can create expense splits for expenses in their properties
CREATE POLICY "expense_splits_insert_property_members"
ON expense_splits FOR INSERT
WITH CHECK (
  expense_id IN (
    SELECT e.id FROM expenses e
    INNER JOIN property_members pm ON e.property_id = pm.property_id
    WHERE pm.user_id = auth.uid() AND pm.status = 'active'
  )
);

-- Users can update their own splits (to mark as paid)
CREATE POLICY "expense_splits_update_own"
ON expense_splits FOR UPDATE
USING (user_id = auth.uid());

COMMIT;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies created successfully!';
  RAISE NOTICE '   - property_members: 4 policies';
  RAISE NOTICE '   - expenses: 4 policies';
  RAISE NOTICE '   - expense_splits: 3 policies';
END $$;
