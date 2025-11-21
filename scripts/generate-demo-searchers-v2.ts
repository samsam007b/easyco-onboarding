import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Diverse demo data with unique names
const demoProfiles = [
  {
    firstName: 'Sophie', lastName: 'Dubois',
    occupation: 'Étudiante en médecine', budget: { min: 500, max: 700 },
    cities: ['Ixelles', 'Etterbeek'], roomType: 'private', cleanlinessLevel: 8,
    smoker: false, hasPets: false, socialLevel: 7, sleepSchedule: 'normal'
  },
  {
    firstName: 'Lucas', lastName: 'Martin',
    occupation: 'Développeur web', budget: { min: 700, max: 900 },
    cities: ['Bruxelles'], roomType: 'private', cleanlinessLevel: 6,
    smoker: false, hasPets: false, socialLevel: 5, sleepSchedule: 'couche-tard'
  },
  {
    firstName: 'Lea', lastName: 'Bernard',
    occupation: 'Designer graphique', budget: { min: 600, max: 800 },
    cities: ['Saint-Gilles', 'Ixelles'], roomType: 'private', cleanlinessLevel: 9,
    smoker: false, hasPets: true, socialLevel: 8, sleepSchedule: 'normal'
  },
  {
    firstName: 'Hugo', lastName: 'Petit',
    occupation: 'Professeur', budget: { min: 800, max: 1000 },
    cities: ['Etterbeek'], roomType: 'private', cleanlinessLevel: 7,
    smoker: false, hasPets: false, socialLevel: 6, sleepSchedule: 'lève-tôt'
  },
  {
    firstName: 'Chloe', lastName: 'Robert',
    occupation: 'Ingénieure', budget: { min: 700, max: 900 },
    cities: ['Schaerbeek', 'Bruxelles'], roomType: 'private', cleanlinessLevel: 8,
    smoker: false, hasPets: false, socialLevel: 7, sleepSchedule: 'normal'
  },
  {
    firstName: 'Louis', lastName: 'Richard',
    occupation: 'Architecte', budget: { min: 800, max: 1000 },
    cities: ['Ixelles'], roomType: 'private', cleanlinessLevel: 9,
    smoker: false, hasPets: false, socialLevel: 5, sleepSchedule: 'normal'
  },
  {
    firstName: 'Camille', lastName: 'Durand',
    occupation: 'Photographe', budget: { min: 500, max: 700 },
    cities: ['Saint-Gilles', 'Bruxelles'], roomType: 'shared', cleanlinessLevel: 6,
    smoker: true, hasPets: false, socialLevel: 9, sleepSchedule: 'couche-tard'
  },
  {
    firstName: 'Arthur', lastName: 'Moreau',
    occupation: 'Marketing manager', budget: { min: 700, max: 900 },
    cities: ['Ixelles', 'Etterbeek'], roomType: 'private', cleanlinessLevel: 7,
    smoker: false, hasPets: false, socialLevel: 8, sleepSchedule: 'normal'
  },
  {
    firstName: 'Zoe', lastName: 'Simon',
    occupation: 'Data analyst', budget: { min: 600, max: 800 },
    cities: ['Bruxelles'], roomType: 'private', cleanlinessLevel: 8,
    smoker: false, hasPets: true, socialLevel: 6, sleepSchedule: 'normal'
  },
  {
    firstName: 'Gabriel', lastName: 'Laurent',
    occupation: 'Juriste', budget: { min: 800, max: 1000 },
    cities: ['Etterbeek', 'Ixelles'], roomType: 'private', cleanlinessLevel: 9,
    smoker: false, hasPets: false, socialLevel: 4, sleepSchedule: 'lève-tôt'
  },
  {
    firstName: 'Ines', lastName: 'Lefebvre',
    occupation: 'Infirmière', budget: { min: 500, max: 700 },
    cities: ['Schaerbeek'], roomType: 'shared', cleanlinessLevel: 7,
    smoker: false, hasPets: false, socialLevel: 7, sleepSchedule: 'normal'
  },
  {
    firstName: 'Raphael', lastName: 'Michel',
    occupation: 'Chef de projet', budget: { min: 700, max: 900 },
    cities: ['Ixelles', 'Saint-Gilles'], roomType: 'private', cleanlinessLevel: 6,
    smoker: false, hasPets: false, socialLevel: 8, sleepSchedule: 'couche-tard'
  },
  {
    firstName: 'Manon', lastName: 'Garcia',
    occupation: 'Entrepreneure', budget: { min: 800, max: 1000 },
    cities: ['Bruxelles', 'Ixelles'], roomType: 'private', cleanlinessLevel: 8,
    smoker: false, hasPets: true, socialLevel: 9, sleepSchedule: 'normal'
  },
  {
    firstName: 'Noah', lastName: 'David',
    occupation: 'Comptable', budget: { min: 600, max: 800 },
    cities: ['Etterbeek'], roomType: 'private', cleanlinessLevel: 9,
    smoker: false, hasPets: false, socialLevel: 5, sleepSchedule: 'lève-tôt'
  },
  {
    firstName: 'Sarah', lastName: 'Bertrand',
    occupation: 'Journaliste', budget: { min: 700, max: 900 },
    cities: ['Saint-Gilles', 'Bruxelles'], roomType: 'private', cleanlinessLevel: 7,
    smoker: false, hasPets: false, socialLevel: 8, sleepSchedule: 'normal'
  },
  {
    firstName: 'Jules', lastName: 'Roux',
    occupation: 'Traducteur', budget: { min: 500, max: 700 },
    cities: ['Ixelles'], roomType: 'shared', cleanlinessLevel: 6,
    smoker: false, hasPets: false, socialLevel: 6, sleepSchedule: 'couche-tard'
  },
  {
    firstName: 'Jade', lastName: 'Vincent',
    occupation: 'UX Designer', budget: { min: 700, max: 900 },
    cities: ['Bruxelles', 'Ixelles'], roomType: 'private', cleanlinessLevel: 8,
    smoker: false, hasPets: true, socialLevel: 7, sleepSchedule: 'normal'
  },
  {
    firstName: 'Adam', lastName: 'Fournier',
    occupation: 'Commercial', budget: { min: 600, max: 800 },
    cities: ['Schaerbeek', 'Etterbeek'], roomType: 'private', cleanlinessLevel: 5,
    smoker: true, hasPets: false, socialLevel: 9, sleepSchedule: 'normal'
  },
  {
    firstName: 'Lola', lastName: 'Morel',
    occupation: 'Consultante', budget: { min: 800, max: 1000 },
    cities: ['Ixelles'], roomType: 'private', cleanlinessLevel: 9,
    smoker: false, hasPets: false, socialLevel: 6, sleepSchedule: 'lève-tôt'
  },
  {
    firstName: 'Tom', lastName: 'Girard',
    occupation: 'Artiste', budget: { min: 400, max: 600 },
    cities: ['Saint-Gilles', 'Schaerbeek'], roomType: 'shared', cleanlinessLevel: 4,
    smoker: true, hasPets: true, socialLevel: 10, sleepSchedule: 'couche-tard'
  },
];

function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function generateEmail(firstName: string, lastName: string): string {
  return `${removeAccents(firstName).toLowerCase()}.${removeAccents(lastName).toLowerCase()}@demo.easyco.be`;
}

async function generateSearcher(profile: typeof demoProfiles[0], index: number) {
  const email = generateEmail(profile.firstName, profile.lastName);
  console.log(`\n📝 [${index + 1}/20] ${profile.firstName} ${profile.lastName}`);

  try {
    // 1. Get or create auth user
    let userId: string;

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'DemoPassword123!',
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        // User exists, get their ID
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const existingUser = users.find(u => u.email === email);
        if (!existingUser) {
          console.error(`❌ User exists but couldn't find ID`);
          return;
        }
        userId = existingUser.id;
        console.log(`✅ Found existing auth user`);
      } else {
        console.error(`❌ Auth error:`, authError.message);
        return;
      }
    } else {
      userId = authData.user.id;
      console.log(`✅ Created auth user`);
    }

    // 2. Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        email,
        first_name: profile.firstName,
        last_name: profile.lastName,
      })
      .select()
      .single();

    if (profileError) {
      console.error(`❌ Profile error:`, profileError.message);
      return;
    }

    console.log(`✅ Created profile`);

    // 3. Create searcher profile
    const moveInDate = new Date();
    moveInDate.setDate(moveInDate.getDate() + Math.floor(Math.random() * 60) + 14); // 2 weeks to 2.5 months

    const { error: searcherError } = await supabase
      .from('searcher_profiles')
      .insert({
        profile_id: profileData.id,
        budget_min: profile.budget.min,
        budget_max: profile.budget.max,
        preferred_location_city: profile.cities[0],
        preferred_move_in_date: moveInDate.toISOString().split('T')[0],
        minimum_stay_months: Math.random() > 0.5 ? 6 : 12,
        preferred_room_type: profile.roomType,
        preferred_coliving_size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)],
        preferred_gender_mix: ['mixed', 'same_gender', 'no_preference'][Math.floor(Math.random() * 3)],
        pet_tolerance: !profile.hasPets ? (Math.random() > 0.5) : true,
        smoking_tolerance: !profile.smoker ? (Math.random() > 0.7) : true,
      });

    if (searcherError) {
      console.error(`❌ Searcher profile error:`, searcherError.message);
      return;
    }

    console.log(`✅ Created searcher profile`);
    console.log(`   💰 Budget: €${profile.budget.min}-${profile.budget.max}/mois`);
    console.log(`   📍 City: ${profile.cities[0]}`);
    console.log(`   🧹 Cleanliness: ${profile.cleanlinessLevel}/10`);
    console.log(`   🎯 Occupation: ${profile.occupation}`);

  } catch (error: any) {
    console.error(`❌ Unexpected error:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting demo searchers generation (v2)...\n');
  console.log('📊 Creating 20 diverse searcher profiles\n');

  for (let i = 0; i < demoProfiles.length; i++) {
    await generateSearcher(demoProfiles[i], i);
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n\n🎉 Demo generation completed!');
  console.log('📧 Password for all accounts: DemoPassword123!');
  console.log('🔍 Test the matching in People view!');
}

main().catch(console.error);
