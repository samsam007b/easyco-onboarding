#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTable() {
  console.log('🔍 Checking notifications table structure...\n');

  try {
    // Try to query the table structure
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.log('⚠️  Table "notifications" does not exist yet.');
        console.log('This is normal if you haven\'t applied the migration.\n');
        return false;
      }
      console.error('❌ Error:', error.message);
      return false;
    }

    console.log('✅ Table "notifications" exists!');
    console.log('Current structure from sample query:', data);
    console.log('\nTo see full schema, run this SQL in Supabase Dashboard:');
    console.log('SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = \'notifications\';');
    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    return false;
  }
}

checkTable();
