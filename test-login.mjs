import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

console.log('🔐 Test Supabase Authentication\n');

const email = await question('Email: ');
const password = await question('Password: ');

console.log('\n🔑 Attempting to sign in...\n');

// Step 1: Sign in
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email,
  password
});

if (authError) {
  console.log('❌ Authentication failed:', authError.message);
  rl.close();
  process.exit(1);
}

console.log('✅ Authentication successful!');
console.log(`   User ID: ${authData.user.id}`);
console.log(`   Email: ${authData.user.email}`);
console.log(`   Access Token: ${authData.session.access_token.substring(0, 20)}...`);

// Decode JWT to show what iOS app will see
const token = authData.session.access_token;
const payload = token.split('.')[1];
let base64 = payload
  .replaceAll('-', '+')
  .replaceAll('_', '/');
while (base64.length % 4 !== 0) base64 += '=';

const decoded = JSON.parse(Buffer.from(base64, 'base64').toString());
console.log('\n📋 JWT Payload:');
console.log(`   sub (user_id): ${decoded.sub}`);
console.log(`   email: ${decoded.email}`);

// Step 2: Query user_profiles
console.log('\n👤 Querying user_profiles...');

const { data: profiles, error: profileError } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', authData.user.id);

if (profileError) {
  console.log('❌ Profile query error:', profileError.message);
  console.log('   Details:', profileError);
  rl.close();
  process.exit(1);
}

if (!profiles || profiles.length === 0) {
  console.log('❌ NO PROFILE FOUND!');
  console.log(`   → user_profiles has no row where user_id = '${authData.user.id}'`);
  console.log('\n🔧 This is why iOS login fails!');
  console.log('   The profile needs to be created with the correct user_id.');
  rl.close();
  process.exit(1);
}

const profile = profiles[0];
console.log('✅ Profile found!');
console.log(`   Profile ID: ${profile.id}`);
console.log(`   User ID (FK): ${profile.user_id}`);
console.log(`   User Type: ${profile.user_type}`);
console.log(`   Name: ${profile.first_name || 'N/A'} ${profile.last_name || 'N/A'}`);
console.log(`   Phone: ${profile.phone_number || 'N/A'}`);

console.log('\n✅ This user should be able to login to iOS app!\n');

rl.close();
