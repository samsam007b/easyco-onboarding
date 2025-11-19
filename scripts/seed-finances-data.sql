-- ============================================================================
-- SEED DATA FOR FINANCES PAGE TESTING
-- ============================================================================
-- Run this in Supabase SQL Editor to create demo data
-- ============================================================================

BEGIN;

-- Get the current authenticated user's ID (you'll need to replace this with your actual user ID)
-- You can find your user ID in Supabase Auth > Users
DO $$
DECLARE
  current_user_id UUID;
  test_property_id UUID;
  expense1_id UUID;
  expense2_id UUID;
  expense3_id UUID;
BEGIN
  -- Get the first user (or you can specify a specific user_id)
  SELECT id INTO current_user_id FROM auth.users LIMIT 1;

  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please create a user first.';
  END IF;

  -- Get or create a property
  SELECT id INTO test_property_id FROM properties LIMIT 1;

  IF test_property_id IS NULL THEN
    INSERT INTO properties (name, address, city, postal_code, country, bedrooms, bathrooms, surface_area, rent_amount)
    VALUES ('Appartement Test', '123 Rue de Test', 'Paris', '75001', 'France', 3, 1, 75, 1200)
    RETURNING id INTO test_property_id;
  END IF;

  -- Ensure user has a profile (only if doesn't exist to avoid trigger issues)
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = current_user_id) THEN
    INSERT INTO user_profiles (user_id, user_type, first_name, last_name)
    VALUES (current_user_id, 'resident', 'Test', 'User');
  END IF;

  -- Create property membership (this links the user to the property)
  INSERT INTO property_members (property_id, user_id, role, status, move_in_date)
  VALUES (test_property_id, current_user_id, 'resident', 'active', CURRENT_DATE)
  ON CONFLICT (property_id, user_id, status) DO NOTHING;

  -- Create demo expenses
  INSERT INTO expenses (id, property_id, created_by, paid_by_id, title, description, amount, category, date, status)
  VALUES
    (gen_random_uuid(), test_property_id, current_user_id, current_user_id, 'Courses de la semaine', 'Supermarché', 85.50, 'groceries', CURRENT_DATE - 2, 'paid'),
    (gen_random_uuid(), test_property_id, current_user_id, current_user_id, 'Facture Internet', 'Fibre Orange', 29.99, 'internet', CURRENT_DATE - 5, 'paid'),
    (gen_random_uuid(), test_property_id, current_user_id, current_user_id, 'Électricité', 'EDF', 68.75, 'utilities', CURRENT_DATE - 10, 'paid'),
    (gen_random_uuid(), test_property_id, current_user_id, current_user_id, 'Pizza party', 'Soirée coloc', 45.00, 'groceries', CURRENT_DATE, 'pending')
  RETURNING id INTO expense1_id;

  -- Get all expense IDs
  FOR expense1_id IN
    SELECT id FROM expenses WHERE property_id = test_property_id
  LOOP
    -- Create expense splits for each expense (split equally with the user)
    INSERT INTO expense_splits (expense_id, user_id, amount_owed, paid, paid_at)
    VALUES (
      expense1_id,
      current_user_id,
      (SELECT amount FROM expenses WHERE id = expense1_id),
      true,
      NOW()
    );
  END LOOP;

  RAISE NOTICE '✅ Demo data created successfully!';
  RAISE NOTICE '   - Property: %', test_property_id;
  RAISE NOTICE '   - User: %', current_user_id;
  RAISE NOTICE '   - Expenses: 4 demo expenses created';
END $$;

COMMIT;
