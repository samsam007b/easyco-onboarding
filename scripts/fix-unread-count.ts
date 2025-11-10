import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

async function main() {
  console.log('🔧 Fixing get_unread_count function...\n');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Read the migration file
  const migrationSQL = fs.readFileSync(
    'supabase/migrations/999_fix_get_unread_count_security_definer.sql',
    'utf8'
  );

  console.log('📄 Migration SQL:\n');
  console.log(migrationSQL);
  console.log('\n' + '='.repeat(80) + '\n');

  // The SQL is already correct, we just need to apply it via Supabase Dashboard
  console.log('📋 INSTRUCTIONS:');
  console.log('1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new');
  console.log('2. Copy the SQL above');
  console.log('3. Paste and run it');
  console.log('4. Come back here and press Enter to test\n');

  // Wait for user
  console.log('⏸️  Waiting for you to apply the migration...');
  console.log('Press Ctrl+C to exit, or wait 10 seconds to test anyway...\n');

  await new Promise(resolve => setTimeout(resolve, 10000));

  // Test the function
  console.log('🧪 Testing function...\n');

  const { data: users } = await supabase
    .from('users')
    .select('id, email')
    .limit(1)
    .single();

  if (!users) {
    console.log('❌ No users found in database');
    return;
  }

  console.log(`Testing with user: ${users.email}`);

  const { data: count, error } = await supabase
    .rpc('get_unread_count', { target_user_id: users.id });

  if (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('Code:', error.code);
    console.log('\n💡 The function probably needs to be created manually.');
    console.log('Please run the SQL in Supabase Dashboard SQL Editor.');
  } else {
    console.log('\n✅ SUCCESS! Function works!');
    console.log(`Unread count for ${users.email}: ${count}`);
    console.log('\n🎉 You can now uncomment the code in:');
    console.log('   - app/dashboard/searcher/layout.tsx (lines 72-80)');
    console.log('   - components/dashboard/ModernSearcherDashboard.tsx (lines 88-95)');
  }
}

main().catch(console.error);
