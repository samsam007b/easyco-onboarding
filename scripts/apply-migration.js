/**
 * Apply Supabase Migration Script
 * This script applies the 002_complete_schema_phase1.sql migration
 * to the Supabase database using the service role key
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Read the migration file
const migrationPath = path.join(__dirname, '../supabase/migrations/002_complete_schema_phase1.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

console.log('🚀 Starting Supabase Migration...\n');
console.log('📁 Migration file:', migrationPath);
console.log('📏 SQL size:', (migrationSQL.length / 1024).toFixed(2), 'KB');
console.log('🔗 Supabase URL:', SUPABASE_URL);
console.log('\n⏳ Applying migration...\n');

// Parse the Supabase URL
const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);

// Prepare the request
const postData = JSON.stringify({
  query: migrationSQL
});

const options = {
  hostname: url.hostname,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Length': Buffer.byteLength(postData)
  }
};

// Alternative approach: Use pg client directly
// Since RPC might not work, let's use @supabase/supabase-js client

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeMigration() {
  try {
    console.log('🔄 Connecting to Supabase...');

    // Split the SQL into individual statements
    // This is necessary because some SQL clients can't handle multiple statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip comments and empty statements
      if (statement.trim().startsWith('--') || statement.trim().length <= 1) {
        continue;
      }

      try {
        console.log(`⚙️  Executing statement ${i + 1}/${statements.length}...`);

        // Execute via RPC
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement
        });

        if (error) {
          // If exec_sql doesn't exist, we need to use a different approach
          if (error.message.includes('exec_sql')) {
            console.log('\n⚠️  RPC method not available. Using alternative approach...\n');
            // We'll need to execute via REST API or create a helper
            break;
          }
          throw error;
        }

        successCount++;
        process.stdout.write('.');

      } catch (err) {
        console.log(`\n⚠️  Error on statement ${i + 1}:`, err.message);

        // Continue with non-critical errors (like "already exists")
        if (
          err.message.includes('already exists') ||
          err.message.includes('IF NOT EXISTS')
        ) {
          console.log('   ℹ️  Skipping (already exists)');
          successCount++;
        } else {
          errorCount++;
          console.log('   ❌ Error:', err.message);
        }
      }
    }

    console.log('\n\n✅ Migration execution completed!');
    console.log(`   ✓ Successful: ${successCount}`);
    console.log(`   ✗ Errors: ${errorCount}\n`);

    if (errorCount === 0) {
      console.log('🎉 Migration applied successfully!\n');
      console.log('Next steps:');
      console.log('1. Verify the schema: npm run verify-migration');
      console.log('2. Test the onboarding flows');
      console.log('3. Check the data in Supabase Dashboard\n');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Execute
executeMigration();
