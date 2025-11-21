import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Missing profiles that failed due to constraint
const missingProfiles = [
  {
    email: 'clara.petit@easycodemo.be',
    firstName: 'Clara', lastName: 'Petit',
    bio: 'Architecte d\'intérieur, 27 ans. Aime cuisiner et recevoir. Recherche coloc dynamique.',
    occupation_status: 'employed', field: 'Architect', budgetMin: 650, budgetMax: 900,
    cleanliness: 'tidy', sociability: 'high', wakeUp: 'moderate', sleep: 'late',
    smoker: false, pets: true, cooking: 'daily', districts: ['Saint-Gilles', 'Ixelles'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&q=80'
  },
  {
    email: 'lea.moreau@easycodemo.be',
    firstName: 'Lea', lastName: 'Moreau',
    bio: 'Chef de projet marketing, 28 ans. Énergique et sociale. Adore organiser des soirées.',
    occupation_status: 'employed', field: 'Marketing Manager', budgetMin: 750, budgetMax: 1000,
    cleanliness: 'moderate', sociability: 'high', wakeUp: 'moderate', sleep: 'late',
    smoker: false, pets: true, cooking: 'often', districts: ['Bruxelles', 'Saint-Gilles'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&q=80'
  },
  {
    email: 'sarah.michel@easycodemo.be',
    firstName: 'Sarah', lastName: 'Michel',
    bio: 'Journaliste indépendante, 27 ans. Curieuse et bavarde. Adore les débats intellectuels.',
    occupation_status: 'freelance', field: 'Journalist', budgetMin: 600, budgetMax: 800,
    cleanliness: 'moderate', sociability: 'high', wakeUp: 'late', sleep: 'late',
    smoker: true, pets: false, cooking: 'sometimes', districts: ['Saint-Gilles', 'Bruxelles'],
    petTolerance: true, smokingTolerance: true, photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&q=80'
  },
];

function randomMoveInDate(): string {
  const daysFromNow = Math.floor(Math.random() * 90) + 14;
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

async function fixProfile(profile: typeof missingProfiles[0]) {
  console.log(`\n📝 Fixing profile for ${profile.firstName} ${profile.lastName}`);

  try {
    // Get user_id from auth
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email === profile.email);

    if (!user) {
      console.error(`❌ Auth user not found for ${profile.email}`);
      return;
    }

    console.log(`✅ Found auth user: ${user.id}`);

    // Check if profile already exists
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      console.log(`⚠️  Profile already exists, skipping...`);
      return;
    }

    // Create user_profiles entry
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        user_type: 'searcher',
        first_name: profile.firstName,
        last_name: profile.lastName,
        bio: profile.bio,
        profile_photo_url: profile.photo,
        occupation_status: profile.occupation_status,
        field_of_study_or_work: profile.field,

        // Lifestyle
        cleanliness_preference: profile.cleanliness,
        wake_up_time: profile.wakeUp,
        sleep_time: profile.sleep,
        is_smoker: profile.smoker,
        has_pets: profile.pets,
        cooking_frequency: profile.cooking,

        // Sociability
        sociability_level: profile.sociability,

        // Budget and preferences
        budget_min: profile.budgetMin,
        budget_max: profile.budgetMax,
        preferred_districts: profile.districts,
        preferred_move_in_date: randomMoveInDate(),

        // Tolerances
        pet_tolerance: profile.petTolerance,
        smoking_tolerance: profile.smokingTolerance,

        // Misc
        phone_number: `+32 4${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`,
        nationality: ['Belgian', 'French', 'Dutch', 'Italian', 'Spanish'][Math.floor(Math.random() * 5)],
        profile_completion_score: Math.floor(Math.random() * 30) + 70,
      });

    if (profileError) {
      console.error(`❌ Profile error:`, profileError.message);
      return;
    }

    console.log(`✅ Created user_profile`);
    console.log(`   💰 Budget: €${profile.budgetMin}-${profile.budgetMax}/mois`);
    console.log(`   📍 Districts: ${profile.districts.join(', ')}`);

  } catch (error: any) {
    console.error(`❌ Unexpected error:`, error.message);
  }
}

async function main() {
  console.log('🔧 Fixing missing profiles...\n');

  for (const profile of missingProfiles) {
    await fixProfile(profile);
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
