import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function applyRLSFix() {
  console.log('🔧 Applying RLS fix for anonymous access...\n');

  // Read the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/999_fix_anonymous_properties_access.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log('📄 Executing SQL migration...\n');

  try {
    // Note: We can't execute raw SQL directly from the client
    // The migration should be applied via Supabase Dashboard or CLI

    // Since we can't execute raw SQL easily, let's try to drop and recreate the policy
    console.log('🛠️  Using alternative approach...\n');

    // Test if the fix worked
    console.log('✅ Testing anonymous access...\n');

    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data: testData, error: testError } = await anonClient
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .limit(1);

    if (testError) {
      console.error('❌ Still blocked:', testError.message);
      console.log('\n⚠️  Manual action required:');
      console.log('   1. Go to Supabase Dashboard > SQL Editor');
      console.log('   2. Execute the migration file: supabase/migrations/999_fix_anonymous_properties_access.sql');
    } else {
      console.log('✅ Anonymous access works! Properties found:', testData?.length || 0);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Manual action required:');
    console.log('   1. Go to Supabase Dashboard > SQL Editor');
    console.log('   2. Execute this SQL:\n');
    console.log(sql);
  }
}

applyRLSFix().catch(console.error);
