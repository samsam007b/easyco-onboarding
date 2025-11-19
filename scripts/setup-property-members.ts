/**
 * Setup property members for testing
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupPropertyMembers() {
  console.log('🔧 Setting up property members...\n');

  try {
    // 1. Get a property
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('id')
      .limit(1)
      .single();

    if (propError || !properties) {
      console.error('❌ No properties found.');
      return;
    }

    const propertyId = properties.id;
    console.log(`✅ Found property: ${propertyId}`);

    // 2. Get user profiles (residents)
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('user_id, first_name, last_name, user_type')
      .eq('user_type', 'resident')
      .limit(5);

    if (profilesError || !profiles || profiles.length === 0) {
      console.error('❌ No resident profiles found.');
      return;
    }

    console.log(`✅ Found ${profiles.length} resident profiles\n`);

    // 3. Check existing property_members
    const { data: existingMembers } = await supabase
      .from('property_members')
      .select('user_id')
      .eq('property_id', propertyId);

    const existingUserIds = new Set(existingMembers?.map(m => m.user_id) || []);

    // 4. Create property_members for profiles not yet linked to the property
    const membersToCreate = profiles
      .filter(p => !existingUserIds.has(p.user_id))
      .map(profile => ({
        property_id: propertyId,
        user_id: profile.user_id,
        role: 'member' as const,
        status: 'active' as const,
        move_in_date: new Date().toISOString().split('T')[0]
      }));

    if (membersToCreate.length === 0) {
      console.log('✅ All profiles already have property memberships');
      return;
    }

    const { data: createdMembers, error: createError } = await supabase
      .from('property_members')
      .insert(membersToCreate)
      .select();

    if (createError) {
      console.error('❌ Error creating property members:', createError);
      return;
    }

    console.log(`✅ Created ${createdMembers.length} property memberships`);

    // 5. Display linked members
    for (const profile of profiles.filter(p => !existingUserIds.has(p.user_id))) {
      console.log(`✅ Linked ${profile.first_name} ${profile.last_name} to property`);
    }

    console.log('\n🎉 Property members setup completed!');
    console.log(`📊 Property ${propertyId} now has members ready for expenses\n`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

setupPropertyMembers();
