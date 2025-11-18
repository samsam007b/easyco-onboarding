import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Checking Supabase users...\n');

// Check auth.users
const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
if (authError) {
  console.log('❌ Auth users error:', authError);
} else {
  console.log('✅ Auth users found:', authUsers.users.length);
  authUsers.users.forEach(user => {
    console.log(`   - ${user.email} (id: ${user.id})`);
  });
}

console.log('');

// Check user_profiles table
const { data: profiles, error: profileError } = await supabase
  .from('user_profiles')
  .select('id, user_id, email, user_type')
  .limit(10);

if (profileError) {
  console.log('❌ Profiles error:', profileError);
} else {
  console.log('✅ User profiles found:', profiles.length);
  profiles.forEach(profile => {
    console.log(`   - ${profile.email} (user_id: ${profile.user_id}, profile_id: ${profile.id})`);
  });
}

console.log('\n🔍 Checking if user_id matches auth.users.id...\n');

if (authUsers && profiles) {
  authUsers.users.forEach(authUser => {
    const matchingProfile = profiles.find(p => p.user_id === authUser.id);
    if (matchingProfile) {
      console.log(`✅ ${authUser.email}: auth.id (${authUser.id}) matches profile.user_id`);
    } else {
      console.log(`❌ ${authUser.email}: NO MATCHING PROFILE FOUND for auth.id ${authUser.id}`);
    }
  });
}
