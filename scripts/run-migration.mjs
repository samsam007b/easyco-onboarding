/**
 * Apply Supabase Migration
 * Uses @supabase/supabase-js to execute SQL migration
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Read migration file
const migrationPath = join(__dirname, '../supabase/migrations/002_complete_schema_phase1.sql');
const migrationSQL = readFileSync(migrationPath, 'utf8');

console.log('\n🚀 Supabase Migration Script\n');
console.log('📁 Migration:', '002_complete_schema_phase1.sql');
console.log('📏 Size:', (migrationSQL.length / 1024).toFixed(2), 'KB');
console.log('🔗 Project:', SUPABASE_URL.split('//')[1].split('.')[0]);
console.log('');

// Create Supabase client with service role
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkCurrentSchema() {
  console.log('🔍 Checking current schema...\n');

  try {
    // Check current columns in user_profiles
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.log('   ⚠️  user_profiles table:', error.message);
    } else {
      console.log('   ✓ user_profiles table exists');
      if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        console.log(`   ✓ Current columns: ${columns.length}`);
        console.log(`     Sample: ${columns.slice(0, 5).join(', ')}, ...`);
      }
    }

    // Check if new tables exist
    const { data: verifications, error: vError } = await supabase
      .from('user_verifications')
      .select('*')
      .limit(0);

    if (vError) {
      console.log('   ⚠️  user_verifications table: does not exist (will be created)');
    } else {
      console.log('   ✓ user_verifications table: already exists');
    }

    const { data: consents, error: cError } = await supabase
      .from('user_consents')
      .select('*')
      .limit(0);

    if (cError) {
      console.log('   ⚠️  user_consents table: does not exist (will be created)');
    } else {
      console.log('   ✓ user_consents table: already exists');
    }

    console.log('');

  } catch (error) {
    console.error('   ❌ Error checking schema:', error.message);
  }
}

async function applyMigrationViaSQL() {
  console.log('⚙️  Applying migration via SQL query...\n');

  try {
    // For Supabase, we need to use the REST API with raw SQL
    // The best way is through Supabase Dashboard, but we can try via fetch

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: migrationSQL })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Migration executed successfully!\n');
    return true;

  } catch (error) {
    if (error.message.includes('404') || error.message.includes('not found')) {
      console.log('⚠️  RPC endpoint not available. Using alternative method...\n');
      return false;
    }
    throw error;
  }
}

async function showManualInstructions() {
  console.log('📖 Manual Migration Instructions:\n');
  console.log('Since automatic execution is not available, please apply the migration manually:\n');
  console.log('1. Open Supabase Dashboard:');
  console.log(`   https://supabase.com/dashboard/project/${SUPABASE_URL.split('//')[1].split('.')[0]}\n`);
  console.log('2. Navigate to: SQL Editor\n');
  console.log('3. Click "New Query"\n');
  console.log('4. Copy the entire contents of:');
  console.log('   supabase/migrations/002_complete_schema_phase1.sql\n');
  console.log('5. Paste into the SQL Editor and click "Run"\n');
  console.log('6. Wait for execution (30-60 seconds)\n');
  console.log('7. Verify success with the verification script:\n');
  console.log('   node scripts/verify-migration.mjs\n');
}

async function main() {
  try {
    // Step 1: Check current schema
    await checkCurrentSchema();

    // Step 2: Try to apply migration
    console.log('Attempting to apply migration...\n');

    const success = await applyMigrationViaSQL();

    if (!success) {
      showManualInstructions();
      return;
    }

    // Step 3: Verify migration
    console.log('🔍 Verifying migration...\n');
    await checkCurrentSchema();

    console.log('🎉 Migration completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('');
    showManualInstructions();
  }
}

main();
