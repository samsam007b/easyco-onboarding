/**
 * Sync Matching Data Script
 *
 * This script syncs data from user_matching_profiles to user_profiles
 * to ensure the matching algorithm has access to onboarding data.
 *
 * PROBLEM IDENTIFIED:
 * - Onboarding QUICK saves to: user_matching_profiles
 * - Matching algorithm reads from: user_profiles
 * - Result: Matching doesn't work with QUICK onboarding data!
 *
 * SOLUTION:
 * - Sync data between tables OR
 * - Update matching algorithm to read from user_matching_profiles
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface MatchingProfile {
  user_id: string;
  min_budget?: number;
  max_budget?: number;
  preferred_city?: string;
  is_smoker?: boolean;
  has_pets?: boolean;
  cleanliness_level?: number;
  preferred_room_type?: string;
  desired_move_in_date?: string;
}

async function syncMatchingData() {
  console.log('🔄 Starting data synchronization...\n');

  // 1. Get all user_matching_profiles
  const { data: matchingProfiles, error: fetchError } = await supabase
    .from('user_matching_profiles')
    .select('*');

  if (fetchError) {
    console.error('❌ Error fetching matching profiles:', fetchError);
    return;
  }

  console.log(`📊 Found ${matchingProfiles?.length || 0} profiles in user_matching_profiles`);

  if (!matchingProfiles || matchingProfiles.length === 0) {
    console.log('⚠️  No data to sync');
    return;
  }

  // 2. For each profile, upsert into user_profiles
  let synced = 0;
  let errors = 0;

  for (const mp of matchingProfiles) {
    try {
      // Check if user_profile exists
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('user_id', mp.user_id)
        .single();

      const profileData = {
        user_id: mp.user_id,
        // Budget - use aliases for compatibility
        min_budget: mp.min_budget,
        max_budget: mp.max_budget,
        budget_min: mp.min_budget, // Alias
        budget_max: mp.max_budget, // Alias

        // Location
        preferred_cities: mp.preferred_city ? [mp.preferred_city] : null,
        current_city: mp.preferred_city,

        // Lifestyle
        smoking: mp.is_smoker,
        is_smoker: mp.is_smoker, // Alias
        pets: mp.has_pets,
        has_pets: mp.has_pets, // Alias
        cleanliness_level: mp.cleanliness_level,

        // Preferences
        room_type: mp.preferred_room_type,
        preferred_room_type: mp.preferred_room_type, // Alias
        move_in_date: mp.desired_move_in_date,
        preferred_move_in_date: mp.desired_move_in_date, // Alias

        updated_at: new Date().toISOString(),
      };

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('user_id', mp.user_id);

        if (error) throw error;
        console.log(`  ✅ Updated profile for user ${mp.user_id.substring(0, 8)}...`);
      } else {
        // Insert new
        const { error } = await supabase
          .from('user_profiles')
          .insert(profileData);

        if (error) throw error;
        console.log(`  ✅ Created profile for user ${mp.user_id.substring(0, 8)}...`);
      }

      synced++;
    } catch (error: any) {
      console.error(`  ❌ Error syncing user ${mp.user_id.substring(0, 8)}:`, error.message);
      errors++;
    }
  }

  console.log(`\n📊 SYNC COMPLETE:`);
  console.log(`   ✅ Synced: ${synced}`);
  console.log(`   ❌ Errors: ${errors}`);

  // 3. Verify sync
  console.log('\n🔍 Verifying sync...');
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('user_id, min_budget, max_budget')
    .limit(3);

  if (profiles && profiles.length > 0) {
    console.log('   Sample user_profiles data:');
    profiles.forEach(p => {
      console.log(`   - User ${p.user_id.substring(0, 8)}...: Budget ${p.min_budget}-${p.max_budget}€`);
    });
  }

  console.log('\n✨ Matching algorithm should now work with onboarding data!');
}

syncMatchingData().catch(console.error);
