import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('🧪 Testing Supabase select() with specific columns...\n');

// First, sign in to get a token
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'sam7777jones@gmail.com',
  password: 'Leumas1?'
});

if (authError) {
  console.log('❌ Auth failed:', authError.message);
  process.exit(1);
}

console.log('✅ Authenticated\n');

// Test 1: Select with * (all columns)
console.log('📋 Test 1: select("*")');
const { data: data1, error: error1 } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', '47959c9b-30c4-4cff-af0c-866679f5b651')
  .limit(1);

if (error1) {
  console.log('❌ Error:', error1.message);
} else {
  console.log(`✅ Returned ${data1?.length || 0} rows`);
  if (data1 && data1.length > 0) {
    console.log('   user_type:', data1[0].user_type);
    console.log('   Columns count:', Object.keys(data1[0]).length);
  }
}

// Test 2: Select with specific columns
console.log('\n📋 Test 2: select("id,user_id,first_name,last_name,phone_number,profile_photo_url,user_type,created_at,updated_at")');
const { data: data2, error: error2 } = await supabase
  .from('user_profiles')
  .select('id,user_id,first_name,last_name,phone_number,profile_photo_url,user_type,created_at,updated_at')
  .eq('user_id', '47959c9b-30c4-4cff-af0c-866679f5b651')
  .limit(1);

if (error2) {
  console.log('❌ Error:', error2.message);
} else {
  console.log(`✅ Returned ${data2?.length || 0} rows`);
  if (data2 && data2.length > 0) {
    console.log('   Full result:', JSON.stringify(data2[0], null, 2));
  }
}

// Test 3: Without select() at all
console.log('\n📋 Test 3: No select() call (default behavior)');
const { data: data3, error: error3 } = await supabase
  .from('user_profiles')
  .eq('user_id', '47959c9b-30c4-4cff-af0c-866679f5b651')
  .limit(1);

if (error3) {
  console.log('❌ Error:', error3.message);
} else {
  console.log(`✅ Returned ${data3?.length || 0} rows`);
  if (data3 && data3.length > 0) {
    console.log('   user_type:', data3[0].user_type);
  }
}

console.log('\n✅ Tests complete!');
