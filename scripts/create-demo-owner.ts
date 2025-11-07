/**
 * Create a demo property owner for testing the aesthetic rooms system
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createDemoOwner() {
  console.log('🏠 Creating demo property owner...\n');

  const demoEmail = `demo-owner-${Date.now()}@easyco.demo`;
  const demoPassword = 'DemoOwner123!';

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: {
        user_type: 'owner',
        full_name: 'Demo Property Owner',
      },
    });

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message);
      return;
    }

    console.log('✅ Auth user created!');
    console.log(`   ID: ${authData.user.id}`);
    console.log(`   Email: ${demoEmail}`);
    console.log(`   Password: ${demoPassword}\n`);

    // Create user profile
    const { error: profileError } = await supabase.from('user_profiles').upsert({
      id: authData.user.id,
      user_type: 'owner',
      email: demoEmail,
      first_name: 'Demo',
      last_name: 'Owner',
      onboarding_completed: true,
      profile_completion_score: 100,
    });

    if (profileError) {
      console.log('⚠️  Note: Could not create user_profiles entry:', profileError.message);
      console.log('   This is OK if the table doesn\'t exist yet.\n');
    } else {
      console.log('✅ User profile created!\n');
    }

    console.log('🎉 Demo owner is ready!');
    console.log('\n📝 Login credentials:');
    console.log(`   Email: ${demoEmail}`);
    console.log(`   Password: ${demoPassword}`);
    console.log('\n✅ Now run the seed script with this user ID:');
    console.log(`   OWNER_ID=${authData.user.id} npx tsx scripts/seed-aesthetic-rooms.ts\n`);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createDemoOwner()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
