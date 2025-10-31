#!/usr/bin/env node

/**
 * Script pour vérifier et appliquer la migration saved_searches
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

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndApplyMigration() {
  console.log('🔍 Checking if saved_searches table exists...\n');

  try {
    // Test if table exists by querying it
    const { data, error } = await supabase
      .from('saved_searches')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') {
      // Table doesn't exist (PGRST116: relation "public.saved_searches" does not exist)
      console.log('⚠️  Table saved_searches does not exist.\n');
      console.log('📋 To apply the migration:');
      console.log('1. Go to https://supabase.com/dashboard/project/fgthoyilfupywmpmiuwd/sql/new');
      console.log('2. Copy and paste the content of: supabase/migrations/041_create_saved_searches.sql');
      console.log('3. Click "Run" to execute the migration\n');

      const migrationPath = path.join(__dirname, '../supabase/migrations/041_create_saved_searches.sql');
      const migrationContent = fs.readFileSync(migrationPath, 'utf8');

      console.log('Migration SQL Preview:');
      console.log('━'.repeat(80));
      console.log(migrationContent.substring(0, 500) + '...\n');

      return false;
    } else if (error) {
      console.error('❌ Error checking table:', error.message);
      return false;
    } else {
      console.log('✅ Table saved_searches already exists!');
      console.log(`   Found ${data?.length || 0} saved searches in database.\n`);
      return true;
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    return false;
  }
}

checkAndApplyMigration();
