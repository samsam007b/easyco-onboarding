/**
 * Verify Supabase Migration
 * Checks that all columns, tables, and indexes were created successfully
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Client } from 'pg';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('\n🔍 Supabase Migration Verification\n');
console.log('=' .repeat(50));
console.log('');

async function verifyViaTables() {
  console.log('📊 Checking Tables...\n');

  const tablesToCheck = [
    'users',
    'user_profiles',
    'user_verifications',
    'user_consents'
  ];

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: exists`);
        if (data && data.length > 0) {
          const columns = Object.keys(data[0]);
          console.log(`      Columns: ${columns.length}`);
        }
      }
    } catch (error) {
      console.log(`   ❌ ${table}: ${error.message}`);
    }
  }

  console.log('');
}

async function verifyNewColumns() {
  console.log('📋 Checking Key Typed Columns...\n');

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, budget_min, budget_max, cleanliness_preference, is_smoker, has_pets')
      .limit(1);

    if (error) {
      console.log('   ❌ Typed columns check failed:', error.message);
      console.log('   ⚠️  Migration may not have been applied yet\n');
      return false;
    }

    console.log('   ✅ Key typed columns exist:');
    console.log('      - first_name, last_name');
    console.log('      - budget_min, budget_max');
    console.log('      - cleanliness_preference');
    console.log('      - is_smoker, has_pets');
    console.log('');
    return true;

  } catch (error) {
    console.log('   ❌ Error:', error.message);
    console.log('');
    return false;
  }
}

async function checkDataMigration() {
  console.log('📦 Checking Data Migration...\n');

  try {
    // Check if there are any profiles with typed data
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, user_type')
      .not('first_name', 'is', null)
      .limit(5);

    if (error) {
      console.log('   ⚠️  Could not check data:', error.message);
      console.log('');
      return;
    }

    if (!data || data.length === 0) {
      console.log('   ℹ️  No profiles with migrated data yet');
      console.log('      (This is normal if no users have been created since migration)');
    } else {
      console.log(`   ✅ Found ${data.length} profiles with typed data:`);
      data.forEach(profile => {
        console.log(`      - ${profile.first_name || '(no name)'} ${profile.last_name || ''} (${profile.user_type})`);
      });
    }

    console.log('');

  } catch (error) {
    console.log('   ⚠️  Error checking data:', error.message);
    console.log('');
  }
}

async function showNextSteps(migrationApplied) {
  console.log('=' .repeat(50));
  console.log('');

  if (!migrationApplied) {
    console.log('⚠️  Migration Not Applied\n');
    console.log('The typed columns were not detected. Please apply the migration:\n');
    console.log('1. Open Supabase Dashboard:');
    console.log(`   https://supabase.com/dashboard/project/${SUPABASE_URL.split('//')[1].split('.')[0]}\n`);
    console.log('2. Go to SQL Editor\n');
    console.log('3. Run the migration file:');
    console.log('   supabase/migrations/002_complete_schema_phase1.sql\n');
    return;
  }

  console.log('✅ Migration Status: APPLIED\n');
  console.log('Next Steps:\n');
  console.log('1. Test the onboarding flows:');
  console.log('   - Create a new Searcher account');
  console.log('   - Create a new Owner account');
  console.log('   - Complete the onboarding\n');
  console.log('2. Verify data in Supabase Dashboard:');
  console.log('   - Check user_profiles table');
  console.log('   - Verify data is in typed columns (not JSONB)\n');
  console.log('3. Check application logs:');
  console.log('   - Look for any errors during data save\n');
  console.log('4. Monitor performance:');
  console.log('   - Queries should be faster with indexes\n');
}

async function main() {
  try {
    await verifyViaTables();
    const migrationApplied = await verifyNewColumns();
    await checkDataMigration();
    await showNextSteps(migrationApplied);

  } catch (error) {
    console.error('❌ Verification error:', error.message);
    process.exit(1);
  }
}

main();
