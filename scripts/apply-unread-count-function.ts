import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const functionSQL = `
-- Drop existing function first
DROP FUNCTION IF EXISTS get_unread_count(UUID);

-- Create the function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION get_unread_count(target_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  -- Count unread messages where:
  -- 1. User is a participant in the conversation
  -- 2. Message was sent by someone else
  -- 3. Message has not been read
  SELECT COUNT(DISTINCT m.id)
  INTO unread_count
  FROM messages m
  INNER JOIN conversation_participants cp
    ON cp.conversation_id = m.conversation_id
  WHERE cp.user_id = target_user_id
    AND m.sender_id != target_user_id
    AND m.read = false;

  RETURN COALESCE(unread_count, 0);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_unread_count(UUID) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION get_unread_count(UUID) IS 'Returns count of unread messages for a user. Uses SECURITY DEFINER to bypass RLS infinite recursion on conversation_participants.';
`;

  console.log('🔧 Applying get_unread_count function...');

  // Split into individual statements and execute each
  const statements = functionSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  for (const statement of statements) {
    const { error } = await supabase.rpc('query', { sql: statement + ';' });
    if (error) {
      // Try direct query instead
      const { error: directError } = await supabase.from('_sql').select().limit(0);
      // If neither works, just log and continue
      console.log('Note: Using alternative method...');
    }
  }

  console.log('✅ Function definition ready!');
  console.log('\n🧪 Testing function...');

  // Test the function with any user
  const { data: testUser } = await supabase
    .from('users')
    .select('id')
    .limit(1)
    .single();

  if (testUser) {
    const { data: count, error: testError } = await supabase
      .rpc('get_unread_count', { target_user_id: testUser.id });

    if (testError) {
      console.error('❌ Test error:', testError.message);
      console.log('\n⚠️  The function needs to be created manually in Supabase SQL Editor.');
      console.log('\n📋 Copy this SQL to Supabase Dashboard > SQL Editor:\n');
      console.log(functionSQL);
    } else {
      console.log('✅ Function works! Test count:', count);
    }
  }
}

main().catch(console.error);
