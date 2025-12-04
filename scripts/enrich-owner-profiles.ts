/**
 * Enrich owner profiles with lifestyle data for roommate matching
 * This adds realistic variation to create diverse compatibility scores
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Generate diverse lifestyle profiles
const lifestyleProfiles = [
  {
    // Very clean, quiet, early riser
    cleanliness_preference: 'spotless',
    cleanliness_expectation: 'spotless',
    sociability_level: 'low',
    wake_up_time: 'early',
    sleep_time: 'early',
    work_schedule: 'traditional',
    guest_frequency: 'rarely',
    shared_meals_interest: false,
    communication_style: 'minimal',
    core_values: ['Quietude', 'Ordre', 'Routine'],
    is_smoker: false,
    has_pets: false,
    cooking_frequency: 'often',
    drinks_alcohol: false,
  },
  {
    // Social, flexible, night owl
    cleanliness_preference: 'tidy',
    cleanliness_expectation: 'tidy',
    sociability_level: 'high',
    wake_up_time: 'late',
    sleep_time: 'late',
    work_schedule: 'flexible',
    guest_frequency: 'often',
    shared_meals_interest: true,
    communication_style: 'casual',
    core_values: ['Convivialité', 'Partage', 'Ouverture'],
    is_smoker: false,
    has_pets: true,
    cooking_frequency: 'often',
    drinks_alcohol: true,
  },
  {
    // Moderate, balanced
    cleanliness_preference: 'tidy',
    cleanliness_expectation: 'tidy',
    sociability_level: 'moderate',
    wake_up_time: 'normal',
    sleep_time: 'normal',
    work_schedule: 'remote',
    guest_frequency: 'sometimes',
    shared_meals_interest: true,
    communication_style: 'casual',
    core_values: ['Respect', 'Équilibre', 'Flexibilité'],
    is_smoker: false,
    has_pets: false,
    cooking_frequency: 'sometimes',
    drinks_alcohol: true,
  },
  {
    // Student lifestyle
    cleanliness_preference: 'comfortable',
    cleanliness_expectation: 'comfortable',
    sociability_level: 'high',
    wake_up_time: 'late',
    sleep_time: 'late',
    work_schedule: 'student',
    guest_frequency: 'often',
    shared_meals_interest: true,
    communication_style: 'casual',
    core_values: ['Ambiance', 'Économie', 'Convivialité'],
    is_smoker: true,
    has_pets: false,
    cooking_frequency: 'rarely',
    drinks_alcohol: true,
  },
  {
    // Professional, tidy
    cleanliness_preference: 'spotless',
    cleanliness_expectation: 'spotless',
    sociability_level: 'moderate',
    wake_up_time: 'early',
    sleep_time: 'normal',
    work_schedule: 'traditional',
    guest_frequency: 'rarely',
    shared_meals_interest: false,
    communication_style: 'formal',
    core_values: ['Professionnalisme', 'Respect', 'Tranquillité'],
    is_smoker: false,
    has_pets: false,
    cooking_frequency: 'sometimes',
    drinks_alcohol: false,
  },
  {
    // Relaxed, creative
    cleanliness_preference: 'tidy',
    cleanliness_expectation: 'tidy',
    sociability_level: 'moderate',
    wake_up_time: 'normal',
    sleep_time: 'late',
    work_schedule: 'flexible',
    guest_frequency: 'sometimes',
    shared_meals_interest: true,
    communication_style: 'casual',
    core_values: ['Créativité', 'Liberté', 'Partage'],
    is_smoker: false,
    has_pets: true,
    cooking_frequency: 'often',
    drinks_alcohol: true,
  },
];

async function enrichOwnerProfiles() {
  console.log('🎨 Enriching owner profiles with lifestyle data\n');

  // Get all properties with their owners
  const { data: properties, error: propError } = await supabase
    .from('properties')
    .select('id, title, owner_id')
    .eq('status', 'published')
    .not('owner_id', 'is', null);

  if (propError || !properties) {
    console.log('❌ Failed to fetch properties:', propError);
    return;
  }

  console.log(`📋 Found ${properties.length} properties with owners\n`);

  let enrichedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];

    // Get owner profile
    const { data: ownerProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id, first_name, last_name, cleanliness_preference, sociability_level')
      .eq('user_id', property.owner_id)
      .single();

    if (profileError || !ownerProfile) {
      console.log(`⚠️  Skipped ${property.title} - no owner profile`);
      skippedCount++;
      continue;
    }

    // Check if already has lifestyle data
    if (ownerProfile.cleanliness_preference && ownerProfile.sociability_level) {
      console.log(`✓ Skipped ${property.title} - owner already has lifestyle data`);
      skippedCount++;
      continue;
    }

    // Assign a lifestyle profile (cycle through them for variety)
    const lifestyleProfile = lifestyleProfiles[i % lifestyleProfiles.length];

    // Update owner profile
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update(lifestyleProfile)
      .eq('user_id', property.owner_id);

    if (updateError) {
      console.log(`❌ Failed to update ${property.title}:`, updateError.message);
      continue;
    }

    console.log(`✅ Enriched ${property.title}`);
    console.log(`   Owner: ${ownerProfile.first_name} ${ownerProfile.last_name}`);
    console.log(`   Profile: cleanliness=${lifestyleProfile.cleanliness_preference}, social=${lifestyleProfile.sociability_level}, wake=${lifestyleProfile.wake_up_time}`);
    enrichedCount++;
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Enriched: ${enrichedCount} owners`);
  console.log(`   ⏭️  Skipped: ${skippedCount} owners`);
  console.log(`   📦 Total: ${properties.length} properties`);

  console.log('\n✨ Done! You can now run the matching system to see varied scores.');
}

enrichOwnerProfiles().catch(console.error);
