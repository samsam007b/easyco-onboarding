import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// 20 unique demo profiles
const demoProfiles = [
  { firstName: 'Sophie', lastName: 'Mercier', occupation: 'Étudiante en médecine', budget: { min: 500, max: 700 }, cities: ['Ixelles'], cleanlinessLevel: 8, roomType: 'private' },
  { firstName: 'Antoine', lastName: 'Leroy', occupation: 'Développeur web', budget: { min: 700, max: 900 }, cities: ['Bruxelles'], cleanlinessLevel: 6, roomType: 'private' },
  { firstName: 'Clara', lastName: 'Bonnet', occupation: 'Designer graphique', budget: { min: 600, max: 800 }, cities: ['Saint-Gilles'], cleanlinessLevel: 9, roomType: 'private' },
  { firstName: 'Maxime', lastName: 'Rousseau', occupation: 'Professeur', budget: { min: 800, max: 1000 }, cities: ['Etterbeek'], cleanlinessLevel: 7, roomType: 'private' },
  { firstName: 'Alice', lastName: 'Fabre', occupation: 'Ingénieure', budget: { min: 700, max: 900 }, cities: ['Schaerbeek'], cleanlinessLevel: 8, roomType: 'private' },
  { firstName: 'Thomas', lastName: 'Perrin', occupation: 'Architecte', budget: { min: 800, max: 1000 }, cities: ['Ixelles'], cleanlinessLevel: 9, roomType: 'private' },
  { firstName: 'Julie', lastName: 'Blanc', occupation: 'Photographe', budget: { min: 500, max: 700 }, cities: ['Saint-Gilles'], cleanlinessLevel: 6, roomType: 'shared' },
  { firstName: 'Paul', lastName: 'Lemoine', occupation: 'Marketing manager', budget: { min: 700, max: 900 }, cities: ['Etterbeek'], cleanlinessLevel: 7, roomType: 'private' },
  { firstName: 'Marine', lastName: 'Gauthier', occupation: 'Data analyst', budget: { min: 600, max: 800 }, cities: ['Bruxelles'], cleanlinessLevel: 8, roomType: 'private' },
  { firstName: 'Nicolas', lastName: 'Martinez', occupation: 'Juriste', budget: { min: 800, max: 1000 }, cities: ['Ixelles'], cleanlinessLevel: 9, roomType: 'private' },
  { firstName: 'Camille', lastName: 'Dupuis', occupation: 'Infirmière', budget: { min: 500, max: 700 }, cities: ['Schaerbeek'], cleanlinessLevel: 7, roomType: 'shared' },
  { firstName: 'Julien', lastName: 'Chevalier', occupation: 'Chef de projet', budget: { min: 700, max: 900 }, cities: ['Saint-Gilles'], cleanlinessLevel: 6, roomType: 'private' },
  { firstName: 'Laura', lastName: 'Colin', occupation: 'Entrepreneure', budget: { min: 800, max: 1000 }, cities: ['Bruxelles'], cleanlinessLevel: 8, roomType: 'private' },
  { firstName: 'Pierre', lastName: 'Marchand', occupation: 'Comptable', budget: { min: 600, max: 800 }, cities: ['Etterbeek'], cleanlinessLevel: 9, roomType: 'private' },
  { firstName: 'Emma', lastName: 'Rey', occupation: 'Journaliste', budget: { min: 700, max: 900 }, cities: ['Ixelles'], cleanlinessLevel: 7, roomType: 'private' },
  { firstName: 'Victor', lastName: 'Arnaud', occupation: 'Traducteur', budget: { min: 500, max: 700 }, cities: ['Schaerbeek'], cleanlinessLevel: 6, roomType: 'shared' },
  { firstName: 'Lucie', lastName: 'Renard', occupation: 'UX Designer', budget: { min: 700, max: 900 }, cities: ['Saint-Gilles'], cleanlinessLevel: 8, roomType: 'private' },
  { firstName: 'Hugo', lastName: 'Giraud', occupation: 'Commercial', budget: { min: 600, max: 800 }, cities: ['Bruxelles'], cleanlinessLevel: 5, roomType: 'private' },
  { firstName: 'Charlotte', lastName: 'Lefebvre', occupation: 'Consultante', budget: { min: 800, max: 1000 }, cities: ['Ixelles'], cleanlinessLevel: 9, roomType: 'private' },
  { firstName: 'Alexandre', lastName: 'Barbier', occupation: 'Artiste', budget: { min: 400, max: 600 }, cities: ['Etterbeek'], cleanlinessLevel: 4, roomType: 'shared' },
];

async function createProfile(profile: typeof demoProfiles[0], index: number) {
  const email = `${profile.firstName.toLowerCase()}.${profile.lastName.toLowerCase()}@demo.easyco.be`;
  console.log(`\n[${index + 1}/20] Creating ${profile.firstName} ${profile.lastName}...`);

  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'DemoPassword123!',
      email_confirm: true,
    });

    if (authError) {
      console.error(`❌ Auth error:`, authError.message);
      return;
    }

    // 2. Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
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

    // 3. Create searcher profile
    const moveInDate = new Date();
    moveInDate.setDate(moveInDate.getDate() + 30);

    const { error: searcherError } = await supabase
      .from('searcher_profiles')
      .insert({
        profile_id: profileData.id,
        budget_min: profile.budget.min,
        budget_max: profile.budget.max,
        preferred_location_city: profile.cities[0],
        preferred_move_in_date: moveInDate.toISOString().split('T')[0],
        minimum_stay_months: 6,
        preferred_room_type: profile.roomType,
        preferred_coliving_size: 'medium',
        pet_tolerance: true,
        smoking_tolerance: false,
      });

    if (searcherError) {
      console.error(`❌ Searcher error:`, searcherError.message);
      return;
    }

    console.log(`✅ Success! ${profile.occupation} - €${profile.budget.min}-${profile.budget.max} in ${profile.cities[0]}`);
  } catch (error: any) {
    console.error(`❌ Error:`, error.message);
  }
}

async function main() {
  console.log('🚀 Creating 20 demo searcher profiles...\n');

  for (let i = 0; i < demoProfiles.length; i++) {
    await createProfile(demoProfiles[i], i);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n\n🎉 Done! Password: DemoPassword123!');
}

main().catch(console.error);
