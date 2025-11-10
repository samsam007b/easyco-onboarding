import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

async function executeSQLViaManagementAPI() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

  if (!projectRef) {
    throw new Error('Could not extract project ref from URL');
  }

  console.log('🔧 Applying SQL migration via Supabase Management API...\n');
  console.log(`Project: ${projectRef}\n`);

  // Read the SQL
  const sql = fs.readFileSync(
    'supabase/migrations/999_fix_get_unread_count_security_definer.sql',
    'utf8'
  );

  console.log('📄 SQL to execute:');
  console.log('='.repeat(80));
  console.log(sql);
  console.log('='.repeat(80));
  console.log('');

  // Unfortunately, Supabase JS client doesn't support executing raw SQL
  // We need to use the Supabase Management API or psql

  console.log('⚠️  Supabase JS Client does not support executing raw SQL directly.');
  console.log('');
  console.log('📋 Please choose one of these methods:');
  console.log('');
  console.log('METHOD 1: Via Supabase Dashboard (RECOMMENDED)');
  console.log('  1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
  console.log('  2. Copy the SQL above');
  console.log('  3. Paste and click RUN');
  console.log('');
  console.log('METHOD 2: Via Supabase CLI');
  console.log('  Run: npx supabase db push');
  console.log('  (This will apply ALL pending migrations)');
  console.log('');
  console.log('METHOD 3: Quick manual application');
  console.log('  The SQL is saved in: APPLY_THIS_IN_SUPABASE.sql');
  console.log('');

  // Test if function already exists
  console.log('🧪 Testing if function already exists...\n');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: user } = await supabase
    .from('users')
    .select('id, email')
    .limit(1)
    .single();

  if (user) {
    const { data: count, error } = await supabase
      .rpc('get_unread_count', { target_user_id: user.id });

    if (error) {
      console.log('❌ Function does NOT exist or has errors');
      console.log(`   Error: ${error.message} (${error.code})`);
      console.log('');
      console.log('👉 Please apply the SQL using one of the methods above');
    } else {
      console.log('✅ Function EXISTS and works!');
      console.log(`   Test count: ${count}`);
      console.log('');
      console.log('🎉 You can now uncomment the frontend code!');
    }
  }
}

executeSQLViaManagementAPI().catch(console.error);
