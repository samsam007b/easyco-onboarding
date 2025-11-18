import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Checking user_profiles table schema and data...\n');

// Get the specific user's profile
const { data: profiles, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', '47959c9b-30c4-4cff-af0c-866679f5b651');

if (error) {
  console.log('❌ Error:', error.message);
  console.log('   Details:', error);
  process.exit(1);
}

if (!profiles || profiles.length === 0) {
  console.log('❌ No profile found for user_id: 47959c9b-30c4-4cff-af0c-866679f5b651');
  process.exit(1);
}

console.log('✅ Profile found!\n');
console.log('📋 Actual data structure:');
console.log(JSON.stringify(profiles[0], null, 2));

console.log('\n📝 Available columns:');
const columns = Object.keys(profiles[0]);
columns.forEach(col => {
  const value = profiles[0][col];
  const type = typeof value;
  console.log(`   - ${col}: ${type} = ${value === null ? 'NULL' : value}`);
});

// Check if user_type exists
if ('user_type' in profiles[0]) {
  console.log('\n✅ user_type column EXISTS');
  console.log(`   Value: ${profiles[0].user_type}`);
} else {
  console.log('\n❌ user_type column DOES NOT EXIST in user_profiles table!');
  console.log('   This is why iOS decoding fails.');
}
