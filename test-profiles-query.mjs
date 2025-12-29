import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Sign in first
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Validate env vars before proceeding
if (!process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD) {
  console.log('❌ Missing TEST_USER_EMAIL or TEST_USER_PASSWORD in .env.local');
  process.exit(1);
}

console.log('🔐 Signing in...\n');

const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: process.env.TEST_USER_EMAIL,
  password: process.env.TEST_USER_PASSWORD
});

if (authError) {
  console.log('❌ Auth failed:', authError.message);
  process.exit(1);
}

console.log('✅ Authenticated\n');

// Test the exact query iOS is making
console.log('📡 Testing: profiles query with specific columns...\n');

const { data, error } = await supabase
  .from('profiles')
  .select('id,user_id,email,first_name,last_name,phone_number,profile_photo_url,created_at,updated_at')
  .eq('user_id', '47959c9b-30c4-4cff-af0c-866679f5b651')
  .limit(1);

if (error) {
  console.log('❌ Error:', error);
} else {
  console.log('✅ Success!');
  console.log('   Rows returned:', data?.length || 0);
  if (data && data.length > 0) {
    console.log('\n📋 Actual response:');
    console.log(JSON.stringify(data[0], null, 2));

    console.log('\n🔑 Keys in response:');
    Object.keys(data[0]).forEach(key => {
      console.log(`   - ${key}: ${typeof data[0][key]}`);
    });
  }
}
