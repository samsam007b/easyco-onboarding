/**
 * Debug script to check roommate matching data
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { mapUserProfileToRoommateProfile } from '../lib/services/roommate-profile-mapper';
import { calculatePropertyRoommateCompatibility } from '../lib/services/roommate-matching-service';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function debugRoommateMatching() {
  console.log('🔍 Debug Roommate Matching System\n');

  // Get user by email (use first searcher in demo)
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const authUser = users.find(u => u.email?.includes('easycodemo.be'));

  if (!authUser) {
    console.log('❌ No demo user found');
    return;
  }

  console.log('👤 Searcher User:', authUser.email);
  console.log('   User ID:', authUser.id);

  // Get searcher profile
  const { data: searcherProfile, error: searcherError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', authUser.id)
    .single();

  if (searcherError || !searcherProfile) {
    console.log('❌ Failed to fetch searcher profile:', searcherError);
    return;
  }

  console.log('\n📊 Searcher Profile Data (Raw):');
  console.log('   cleanliness_preference:', searcherProfile.cleanliness_preference);
  console.log('   cleanliness_expectation:', searcherProfile.cleanliness_expectation);
  console.log('   cleanliness_level:', searcherProfile.cleanliness_level);
  console.log('   sociability_level:', searcherProfile.sociability_level);
  console.log('   social_energy:', searcherProfile.social_energy);
  console.log('   smoking:', searcherProfile.smoking);
  console.log('   is_smoker:', searcherProfile.is_smoker);
  console.log('   smoker:', searcherProfile.smoker);
  console.log('   pets:', searcherProfile.pets);
  console.log('   has_pets:', searcherProfile.has_pets);
  console.log('   wake_up_time:', searcherProfile.wake_up_time);
  console.log('   sleep_time:', searcherProfile.sleep_time);
  console.log('   work_schedule:', searcherProfile.work_schedule);
  console.log('   guest_frequency:', searcherProfile.guest_frequency);
  console.log('   shared_meals_interest:', searcherProfile.shared_meals_interest);
  console.log('   communication_style:', searcherProfile.communication_style);
  console.log('   core_values:', searcherProfile.core_values);
  console.log('   hobbies:', searcherProfile.hobbies);
  console.log('   cooking_frequency:', searcherProfile.cooking_frequency);
  console.log('   drinks_alcohol:', searcherProfile.drinks_alcohol);

  // Convert to RoommateProfile
  const searcherRoommateProfile = mapUserProfileToRoommateProfile(searcherProfile);

  console.log('\n🔄 Converted Searcher RoommateProfile:');
  console.log(JSON.stringify(searcherRoommateProfile, null, 2));

  // Get first property and its owner
  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, owner_id')
    .eq('status', 'published')
    .limit(3);

  if (!properties || properties.length === 0) {
    console.log('\n❌ No properties found');
    return;
  }

  console.log('\n🏠 Testing Compatibility with Properties:\n');

  for (const property of properties) {
    console.log(`\n--- Property: ${property.title} ---`);

    // Get owner profile
    const { data: ownerProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', property.owner_id)
      .single();

    if (!ownerProfile) {
      console.log('   ❌ Owner profile not found');
      continue;
    }

    console.log('   👤 Owner ID:', property.owner_id);
    console.log('   📊 Owner Data:');
    console.log('      cleanliness:', ownerProfile.cleanliness_preference || ownerProfile.cleanliness_level);
    console.log('      social_energy:', ownerProfile.sociability_level || ownerProfile.social_energy);
    console.log('      smoking:', ownerProfile.smoking || ownerProfile.is_smoker);
    console.log('      pets:', ownerProfile.pets || ownerProfile.has_pets);

    const ownerRoommateProfile = mapUserProfileToRoommateProfile(ownerProfile);

    // Calculate compatibility
    const matchResult = calculatePropertyRoommateCompatibility(
      searcherRoommateProfile,
      [ownerRoommateProfile]
    );

    console.log('   🎯 Match Result:');
    console.log('      Overall Score:', matchResult.averageScore, '%');
    console.log('      Breakdown:');
    console.log('         Lifestyle:', matchResult.individualScores[0]?.breakdown.lifestyle, '/ 30');
    console.log('         Schedule:', matchResult.individualScores[0]?.breakdown.schedule, '/ 20');
    console.log('         Social:', matchResult.individualScores[0]?.breakdown.social, '/ 20');
    console.log('         Values:', matchResult.individualScores[0]?.breakdown.values, '/ 15');
    console.log('         Habits:', matchResult.individualScores[0]?.breakdown.habits, '/ 15');
    console.log('      Strengths:', matchResult.individualScores[0]?.strengths);
    console.log('      Concerns:', matchResult.individualScores[0]?.concerns);
  }
}

debugRoommateMatching().catch(console.error);
