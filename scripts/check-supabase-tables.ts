/**
 * Script to check Supabase tables and diagnose production issues
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTable(tableName: string) {
  console.log(`\n🔍 Checking table: ${tableName}`);

  try {
    // Try to select from the table
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`❌ Error accessing ${tableName}:`, error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
      return false;
    }

    console.log(`✅ Table ${tableName} exists and is accessible`);
    console.log(`   Row count: ${count ?? 'unknown'}`);
    return true;
  } catch (err) {
    console.error(`❌ Exception accessing ${tableName}:`, err);
    return false;
  }
}

async function checkRPC(functionName: string, params: any) {
  console.log(`\n🔍 Checking RPC function: ${functionName}`);

  try {
    const { data, error } = await supabase.rpc(functionName, params);

    if (error) {
      console.error(`❌ Error calling ${functionName}:`, error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
      return false;
    }

    console.log(`✅ RPC function ${functionName} works`);
    console.log(`   Result:`, data);
    return true;
  } catch (err) {
    console.error(`❌ Exception calling ${functionName}:`, err);
    return false;
  }
}

async function main() {
  console.log('🚀 Supabase Production Diagnostic\n');
  console.log('Project URL:', supabaseUrl);
  console.log('='.repeat(60));

  // Check critical tables
  const tables = [
    'users',
    'favorites',
    'user_matches',
    'conversation_participants',
    'properties',
    'applications',
    'property_rooms',
    'property_room_aesthetics'
  ];

  const results: Record<string, boolean> = {};

  for (const table of tables) {
    results[table] = await checkTable(table);
  }

  // Try to get a test user
  console.log(`\n🔍 Checking if there are any users`);
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, full_name, user_type')
      .limit(1);

    if (error) {
      console.error('❌ Cannot query users:', error.message);
    } else if (users && users.length > 0) {
      console.log('✅ Found test user:', users[0]);

      // Try RPC with this user
      await checkRPC('get_unread_count', { target_user_id: users[0].id });
    } else {
      console.log('⚠️  No users found in database');
    }
  } catch (err) {
    console.error('❌ Exception querying users:', err);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY\n');

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  console.log(`Tables accessible: ${passed}/${total}`);
  console.log('');

  for (const [table, success] of Object.entries(results)) {
    console.log(`  ${success ? '✅' : '❌'} ${table}`);
  }

  if (passed < total) {
    console.log('\n⚠️  ISSUES FOUND:');
    console.log('Some tables are not accessible. This could be due to:');
    console.log('1. Tables not created (migrations not applied)');
    console.log('2. RLS policies blocking access');
    console.log('3. Wrong table names');
    console.log('\nCheck Supabase Dashboard → Table Editor');
  } else {
    console.log('\n✅ All tables are accessible!');
  }
}

main().catch(console.error);
