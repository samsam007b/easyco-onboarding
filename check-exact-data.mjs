import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Test avec SERVICE_ROLE_KEY pour bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Test avec ANON_KEY + auth token (comme iOS)
const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const userId = '47959c9b-30c4-4cff-af0c-866679f5b651';

console.log('='.repeat(60));
console.log('TEST 1: Query with SERVICE_ROLE_KEY (bypass RLS)');
console.log('='.repeat(60));

const { data: adminData, error: adminError } = await supabaseAdmin
  .from('user_profiles')
  .select('id, user_id, user_type, first_name, last_name, created_at, updated_at')
  .eq('user_id', userId);

if (adminError) {
  console.log('❌ Error:', adminError);
} else {
  console.log('✅ Data:', JSON.stringify(adminData, null, 2));
}

console.log('\n' + '='.repeat(60));
console.log('TEST 2: Login and query with ANON_KEY + auth (like iOS)');
console.log('='.repeat(60));

const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
  email: 'sam7777jones@gmail.com',
  password: 'Leumas1?'
});

if (authError) {
  console.log('❌ Auth error:', authError);
  process.exit(1);
}

console.log('✅ Authenticated, token:', authData.session.access_token.substring(0, 30) + '...');

// Now query with the authenticated client
const { data: userData, error: userError } = await supabaseAuth
  .from('user_profiles')
  .select('id, user_id, user_type, first_name, last_name, created_at, updated_at')
  .eq('user_id', userId);

if (userError) {
  console.log('❌ Error:', userError);
} else {
  console.log('✅ Data:', JSON.stringify(userData, null, 2));
}
