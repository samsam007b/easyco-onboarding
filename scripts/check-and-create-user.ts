/**
 * Check if users exist, create one if needed for seeding
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function checkAndCreateUser() {
  console.log('🔍 Checking for existing users...\n');

  // Check profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, user_type, email')
    .limit(5);

  if (profilesError) {
    console.error('❌ Error checking profiles:', profilesError.message);
    return;
  }

  if (profiles && profiles.length > 0) {
    console.log(`✅ Found ${profiles.length} existing user(s):`);
    profiles.forEach((profile, i) => {
      console.log(`   ${i + 1}. ID: ${profile.id}`);
      console.log(`      Type: ${profile.user_type || 'not set'}`);
      console.log(`      Email: ${profile.email || 'not set'}\n`);
    });
    console.log('✅ You can proceed with seeding! Run:');
    console.log('   npx tsx scripts/seed-aesthetic-rooms.ts\n');
    return;
  }

  console.log('⚠️  No users found. Creating a demo user for seeding...\n');

  // Create a demo user
  const demoEmail = `demo-owner-${Date.now()}@easyco.test`;
  const demoPassword = 'DemoPassword123!';

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: demoEmail,
    password: demoPassword,
    email_confirm: true,
    user_metadata: {
      user_type: 'owner',
    },
  });

  if (authError) {
    console.error('❌ Error creating auth user:', authError.message);
    return;
  }

  console.log('✅ Demo user created!');
  console.log(`   Email: ${demoEmail}`);
  console.log(`   ID: ${authData.user.id}\n`);

  // Create profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    user_type: 'owner',
    email: demoEmail,
    onboarding_completed: true,
  });

  if (profileError) {
    console.error('⚠️  Warning: Could not create profile:', profileError.message);
  } else {
    console.log('✅ Profile created!\n');
  }

  console.log('🎉 Ready to seed! Run:');
  console.log('   npx tsx scripts/seed-aesthetic-rooms.ts\n');
}

checkAndCreateUser()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
