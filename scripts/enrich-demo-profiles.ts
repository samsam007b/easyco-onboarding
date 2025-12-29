import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Enhanced profile data with complete onboarding info
const enrichedData = [
  {
    email: 'marie.lefevre@izzicodemo.be',
    languages: ['Français', 'Anglais'],
    interests: ['Design', 'Plantes', 'Décoration', 'Art'],
    hobbies: ['Jardinage', 'DIY', 'Photographie'],
    core_values: ['Créativité', 'Respect', 'Communication'],
    important_qualities: ['Organisation', 'Propreté', 'Bonne humeur'],
    deal_breakers: ['Désordre excessif', 'Manque de communication'],
    guest_frequency: 'sometimes',
    shared_meals_interest: true,
    coworking_space_needed: false,
    gym_access_needed: false,
    sports_frequency: 'sometimes',
    drinks_alcohol: true,
    diet_type: 'flexitarian',
    music_habits: 'headphones_mostly',
    introvert_extrovert_scale: 4,
    openness_to_sharing: 'very_open',
    communication_style: 'diplomatic',
    cultural_openness: 'very_open',
    work_schedule: 'office',
    preferred_coliving_size: 'medium',
    preferred_gender_mix: 'mixed',
    quiet_hours_preference: false,
    open_to_meetups: true,
    event_interest: 'high'
  },
  {
    email: 'thomas.dubois@izzicodemo.be',
    languages: ['Français', 'Anglais', 'Néerlandais'],
    interests: ['Tech', 'Gaming', 'Cinéma', 'Musique'],
    hobbies: ['Jeux vidéo', 'Programmation', 'Séries'],
    core_values: ['Respect', 'Tranquillité', 'Honnêteté'],
    important_qualities: ['Calme', 'Discrétion', 'Tolérance'],
    deal_breakers: ['Bruit excessif', 'Manque de respect des espaces'],
    guest_frequency: 'rarely',
    shared_meals_interest: false,
    coworking_space_needed: true,
    gym_access_needed: false,
    sports_frequency: 'rarely',
    drinks_alcohol: true,
    diet_type: 'omnivore',
    music_habits: 'headphones_only',
    introvert_extrovert_scale: 2,
    openness_to_sharing: 'moderate',
    communication_style: 'casual',
    cultural_openness: 'open',
    work_schedule: 'hybrid',
    preferred_coliving_size: 'small',
    preferred_gender_mix: 'no_preference',
    quiet_hours_preference: true,
    open_to_meetups: false,
    event_interest: 'low'
  },
  {
    email: 'amelie.martin@izzicodemo.be',
    languages: ['Français', 'Anglais'],
    interests: ['Médecine', 'Sciences', 'Lecture', 'Yoga'],
    hobbies: ['Lecture', 'Yoga', 'Running'],
    core_values: ['Études', 'Santé', 'Bien-être', 'Discipline'],
    important_qualities: ['Calme pour étudier', 'Propreté', 'Respect des horaires'],
    deal_breakers: ['Bruit pendant les révisions', 'Désordre'],
    guest_frequency: 'sometimes',
    shared_meals_interest: true,
    coworking_space_needed: false,
    gym_access_needed: true,
    sports_frequency: 'often',
    drinks_alcohol: false,
    diet_type: 'vegetarian',
    music_habits: 'quiet_background',
    introvert_extrovert_scale: 4,
    openness_to_sharing: 'moderate',
    communication_style: 'direct',
    cultural_openness: 'very_open',
    work_schedule: 'student',
    preferred_coliving_size: 'medium',
    preferred_gender_mix: 'same_gender',
    quiet_hours_preference: true,
    open_to_meetups: true,
    event_interest: 'medium'
  },
  {
    email: 'lucas.bernard@izzicodemo.be',
    languages: ['Français', 'Anglais', 'Espagnol'],
    interests: ['Business', 'Voyages', 'Sport', 'Networking'],
    hobbies: ['Running', 'Golf', 'Lecture business'],
    core_values: ['Professionnalisme', 'Efficacité', 'Respect'],
    important_qualities: ['Propreté impeccable', 'Tranquillité', 'Indépendance'],
    deal_breakers: ['Désordre', 'Bruit'],
    guest_frequency: 'rarely',
    shared_meals_interest: false,
    coworking_space_needed: true,
    gym_access_needed: true,
    sports_frequency: 'daily',
    drinks_alcohol: true,
    diet_type: 'omnivore',
    music_habits: 'none',
    introvert_extrovert_scale: 3,
    openness_to_sharing: 'private',
    communication_style: 'direct',
    cultural_openness: 'open',
    work_schedule: 'flexible',
    preferred_coliving_size: 'small',
    preferred_gender_mix: 'no_preference',
    quiet_hours_preference: true,
    open_to_meetups: false,
    event_interest: 'low'
  },
  {
    email: 'clara.petit@izzicodemo.be',
    languages: ['Français', 'Italien', 'Anglais'],
    interests: ['Architecture', 'Cuisine', 'Art', 'Décoration'],
    hobbies: ['Cuisine', 'Peinture', 'Marchés vintage'],
    core_values: ['Créativité', 'Partage', 'Convivialité'],
    important_qualities: ['Ouverture d\'esprit', 'Sociabilité', 'Respect'],
    deal_breakers: ['Fermeture d\'esprit', 'Individualisme excessif'],
    guest_frequency: 'often',
    shared_meals_interest: true,
    coworking_space_needed: false,
    gym_access_needed: false,
    sports_frequency: 'sometimes',
    drinks_alcohol: true,
    diet_type: 'flexitarian',
    music_habits: 'social_listening',
    introvert_extrovert_scale: 5,
    openness_to_sharing: 'very_open',
    communication_style: 'casual',
    cultural_openness: 'very_open',
    work_schedule: 'office',
    preferred_coliving_size: 'large',
    preferred_gender_mix: 'mixed',
    quiet_hours_preference: false,
    open_to_meetups: true,
    event_interest: 'high'
  },
];

async function enrichProfile(data: typeof enrichedData[0]) {
  console.log(`\n📝 Enriching profile: ${data.email}`);

  try {
    // Get user_id from email
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email === data.email);

    if (!user) {
      console.log(`⚠️  User not found, skipping...`);
      return;
    }

    // Update user_profiles with enriched data
    const { error } = await supabase
      .from('user_profiles')
      .update({
        languages_spoken: data.languages,
        interests: data.interests,
        hobbies: data.hobbies,
        core_values: data.core_values,
        important_qualities: data.important_qualities,
        deal_breakers: data.deal_breakers,
        guest_frequency: data.guest_frequency,
        shared_meals_interest: data.shared_meals_interest,
        coworking_space_needed: data.coworking_space_needed,
        gym_access_needed: data.gym_access_needed,
        sports_frequency: data.sports_frequency,
        drinks_alcohol: data.drinks_alcohol,
        diet_type: data.diet_type,
        music_habits: data.music_habits,
        introvert_extrovert_scale: data.introvert_extrovert_scale,
        openness_to_sharing: data.openness_to_sharing,
        communication_style: data.communication_style,
        cultural_openness: data.cultural_openness,
        work_schedule: data.work_schedule,
        preferred_coliving_size: data.preferred_coliving_size,
        preferred_gender_mix: data.preferred_gender_mix,
        quiet_hours_preference: data.quiet_hours_preference,
        open_to_meetups: data.open_to_meetups,
        event_interest: data.event_interest,
        profile_completion_score: 100,
      })
      .eq('user_id', user.id);

    if (error) {
      console.error(`❌ Error:`, error.message);
      return;
    }

    console.log(`✅ Profile enriched successfully`);

  } catch (error: any) {
    console.error(`❌ Unexpected error:`, error.message);
  }
}

async function main() {
  console.log('🚀 Enriching demo profiles with complete onboarding data...\n');

  for (const data of enrichedData) {
    await enrichProfile(data);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n✅ Profile enrichment completed!');
  console.log('🔍 Profiles now have complete onboarding data for better matching');
}

main().catch(console.error);
