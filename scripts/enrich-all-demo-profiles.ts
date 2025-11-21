import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Random generators for realistic data
const languages = [
  ['Français', 'Anglais'],
  ['Français', 'Anglais', 'Néerlandais'],
  ['Français', 'Anglais', 'Espagnol'],
  ['Français', 'Anglais', 'Italien'],
  ['Français', 'Anglais', 'Allemand'],
];

const interestsSets = [
  ['Design', 'Art', 'Photographie', 'Voyages'],
  ['Tech', 'Gaming', 'Cinéma', 'Musique'],
  ['Sport', 'Santé', 'Cuisine', 'Nature'],
  ['Lecture', 'Écriture', 'Histoire', 'Culture'],
  ['Business', 'Entrepreneuriat', 'Networking', 'Innovation'],
];

const hobbiesSets = [
  ['Yoga', 'Méditation', 'Lecture', 'Cuisine'],
  ['Running', 'Vélo', 'Natation', 'Randonnée'],
  ['Photographie', 'Peinture', 'Musique', 'Cinéma'],
  ['Jeux vidéo', 'Programmation', 'Tech DIY'],
  ['Jardinage', 'DIY', 'Décoration', 'Bricolage'],
];

const coreValuesSets = [
  ['Respect', 'Honnêteté', 'Communication'],
  ['Propreté', 'Organisation', 'Ponctualité'],
  ['Convivialité', 'Partage', 'Ouverture d\'esprit'],
  ['Indépendance', 'Tranquillité', 'Discrétion'],
  ['Créativité', 'Innovation', 'Spontanéité'],
];

function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateEnrichedData() {
  return {
    languages_spoken: randomFrom(languages),
    interests: randomFrom(interestsSets),
    hobbies: randomFrom(hobbiesSets),
    core_values: randomFrom(coreValuesSets),
    important_qualities: [
      randomFrom(['Propreté', 'Organisation', 'Ponctualité', 'Respect']),
      randomFrom(['Communication', 'Honnêteté', 'Ouverture', 'Tolérance']),
      randomFrom(['Calme', 'Convivialité', 'Discrétion', 'Sociabilité'])
    ],
    deal_breakers: [
      randomFrom(['Désordre', 'Bruit excessif', 'Manque de respect', 'Manque de communication'])
    ],
    guest_frequency: randomFrom(['never', 'rarely', 'sometimes', 'often']),
    shared_meals_interest: Math.random() > 0.5,
    coworking_space_needed: Math.random() > 0.7,
    gym_access_needed: Math.random() > 0.6,
    sports_frequency: randomFrom(['never', 'rarely', 'sometimes', 'often', 'daily']),
    drinks_alcohol: Math.random() > 0.3,
    diet_type: randomFrom(['omnivore', 'vegetarian', 'vegan', 'flexitarian', 'pescatarian']),
    music_habits: randomFrom(['none', 'headphones_only', 'headphones_mostly', 'quiet_background', 'social_listening']),
    introvert_extrovert_scale: Math.floor(Math.random() * 5) + 1, // 1-5
    openness_to_sharing: randomFrom(['private', 'moderate', 'open', 'very_open']),
    communication_style: randomFrom(['direct', 'diplomatic', 'casual', 'formal']),
    cultural_openness: randomFrom(['conservative', 'moderate', 'open', 'very_open']),
    work_schedule: randomFrom(['office', 'hybrid', 'remote', 'flexible', 'student']),
    preferred_coliving_size: randomFrom(['small', 'medium', 'large', 'very_large']),
    preferred_gender_mix: randomFrom(['no_preference', 'same_gender', 'mixed']),
    quiet_hours_preference: Math.random() > 0.5,
    open_to_meetups: Math.random() > 0.4,
    event_interest: randomFrom(['low', 'medium', 'high']),
    profile_completion_score: Math.floor(Math.random() * 20) + 80, // 80-100
  };
}

async function enrichAllProfiles() {
  console.log('🚀 Enriching all demo profiles...\n');

  try {
    // Get all demo profiles
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('user_id, first_name, last_name')
      .eq('user_type', 'searcher')
      .is('interests', null); // Only enrich profiles without interests (not yet enriched)

    if (error) throw error;

    if (!profiles || profiles.length === 0) {
      console.log('✅ All profiles already enriched!');
      return;
    }

    console.log(`📊 Found ${profiles.length} profiles to enrich\n`);

    for (const profile of profiles) {
      console.log(`📝 Enriching: ${profile.first_name} ${profile.last_name}`);

      const enrichedData = generateEnrichedData();

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(enrichedData)
        .eq('user_id', profile.user_id);

      if (updateError) {
        console.error(`❌ Error for ${profile.first_name}:`, updateError.message);
      } else {
        console.log(`✅ Enriched successfully`);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n🎉 All profiles enriched!');
    console.log('🔍 Profiles now have complete onboarding data for better matching');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

enrichAllProfiles().catch(console.error);
