import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Debug authentication issue...\n');
console.log('📧 Enter the email you are trying to login with (or leave empty to check all):');

// For now, let's check all users
const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();

if (authError) {
  console.log('❌ Cannot list auth users:', authError.message);
  process.exit(1);
}

console.log(`\n✅ Found ${users.length} auth users\n`);

for (const authUser of users) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📧 Email: ${authUser.email}`);
  console.log(`🆔 Auth ID: ${authUser.id}`);

  // Check if profile exists
  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, user_id, user_type, first_name, last_name, created_at')
    .eq('user_id', authUser.id);

  if (profileError) {
    console.log(`❌ Error querying profile: ${profileError.message}`);
  } else if (!profiles || profiles.length === 0) {
    console.log('❌ NO PROFILE FOUND in user_profiles!');
    console.log('   → This user cannot login to iOS app');
    console.log(`   → Fix: Create profile with user_id = '${authUser.id}'`);
  } else {
    const profile = profiles[0];
    console.log('✅ Profile exists:');
    console.log(`   - Profile ID: ${profile.id}`);
    console.log(`   - User ID (FK): ${profile.user_id}`);
    console.log(`   - User Type: ${profile.user_type}`);
    console.log(`   - Name: ${profile.first_name || 'N/A'} ${profile.last_name || 'N/A'}`);
    console.log(`   - Created: ${profile.created_at}`);

    if (profile.user_id !== authUser.id) {
      console.log(`⚠️  WARNING: user_id mismatch!`);
      console.log(`   Profile user_id: ${profile.user_id}`);
      console.log(`   Auth user id: ${authUser.id}`);
    }
  }
}

console.log(`\n${'='.repeat(60)}\n`);
console.log('📝 Summary:');
console.log(`   Total auth users: ${users.length}`);

const { data: allProfiles } = await supabase
  .from('user_profiles')
  .select('user_id');

const profileUserIds = new Set(allProfiles?.map(p => p.user_id) || []);
const usersWithProfile = users.filter(u => profileUserIds.has(u.id));
const usersWithoutProfile = users.filter(u => !profileUserIds.has(u.id));

console.log(`   Users with profile: ${usersWithProfile.length} ✅`);
console.log(`   Users without profile: ${usersWithoutProfile.length} ❌`);

if (usersWithoutProfile.length > 0) {
  console.log('\n🔧 Users that need profiles created:');
  usersWithoutProfile.forEach(u => {
    console.log(`   - ${u.email} (id: ${u.id})`);
  });
}
