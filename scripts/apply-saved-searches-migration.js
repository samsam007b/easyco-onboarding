#!/usr/bin/env node

/**
 * Script pour appliquer la migration saved_searches directement via SQL
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: {
    schema: 'public'
  }
});

async function applyMigration() {
  console.log('🚀 Applying saved_searches migration...\n');

  try {
    const migrationPath = path.join(__dirname, '../supabase/migrations/041_create_saved_searches.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded');
    console.log('📝 Executing SQL...\n');

    // Execute via RPC call
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // If RPC doesn't exist, we need to apply manually
      if (error.code === '42883') {
        console.log('⚠️  Direct SQL execution not available via Supabase client.');
        console.log('');
        console.log('📋 Please apply the migration manually:');
        console.log('');
        console.log('1. Go to: https://supabase.com/dashboard/project/fgthoyilfupywmpmiuwd/sql/new');
        console.log('2. Copy the content of: supabase/migrations/041_create_saved_searches.sql');
        console.log('3. Paste it in the SQL editor');
        console.log('4. Click "Run"');
        console.log('');
        console.log('Or use the Supabase CLI with proper credentials:');
        console.log('  npx supabase db push');
        console.log('');
      } else {
        console.error('❌ Error applying migration:', error);
      }
      return false;
    }

    console.log('✅ Migration applied successfully!');
    console.log('');
    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    console.log('');
    console.log('📋 Manual migration required:');
    console.log('Go to: https://supabase.com/dashboard/project/fgthoyilfupywmpmiuwd/sql/new');
    console.log('And run: supabase/migrations/041_create_saved_searches.sql');
    console.log('');
    return false;
  }
}

applyMigration();
