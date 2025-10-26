/**
 * Test rapide pour vérifier si saveOnboardingData fonctionne
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

console.log('\n🧪 Test de sauvegarde onboarding\n');

// Données de test (comme celles du screenshot)
const testData = {
  firstName: 'Test',
  lastName: 'User',
  dateOfBirth: '1990-01-01',
  nationality: 'Belgium',
  languagesSpoken: ['french', 'english'],
  wakeUpTime: 'moderate',
  sleepTime: 'early',
  isSmoker: true,
  colivingSize: 'medium',
  genderMix: 'mixed',
  minAge: 18,
  maxAge: 25,
  sharedSpaceImportance: 3,
  budgetMin: 500,
  budgetMax: 750,
  preferredLocationCity: 'Ixelles'
};

async function testSave() {
  try {
    console.log('📝 Données de test:', JSON.stringify(testData, null, 2));

    // Simuler la création d'un user (ou utiliser un user existant)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .eq('user_type', 'searcher')
      .limit(1);

    if (usersError) {
      console.error('❌ Erreur lecture users:', usersError);
      return;
    }

    if (!users || users.length === 0) {
      console.log('⚠️  Aucun user searcher trouvé pour tester');
      console.log('   Créez un compte searcher et réessayez');
      return;
    }

    const userId = users[0].id;
    console.log(`\n✅ User ID pour test: ${userId}`);

    // Préparer les données comme onboarding-helpers.ts le fait
    const profileData = {
      user_id: userId,
      user_type: 'searcher',
      first_name: testData.firstName,
      last_name: testData.lastName,
      date_of_birth: testData.dateOfBirth,
      nationality: testData.nationality,
      languages_spoken: testData.languagesSpoken,
      wake_up_time: testData.wakeUpTime,
      sleep_time: testData.sleepTime,
      is_smoker: testData.isSmoker,
      preferred_coliving_size: testData.colivingSize,
      preferred_gender_mix: testData.genderMix,
      roommate_age_min: testData.minAge,
      roommate_age_max: testData.maxAge,
      shared_space_importance: testData.sharedSpaceImportance,
      budget_min: testData.budgetMin,
      budget_max: testData.budgetMax,
      preferred_location_city: testData.preferredLocationCity,
      updated_at: new Date().toISOString()
    };

    console.log('\n📤 Tentative de sauvegarde...');

    const { error } = await supabase
      .from('user_profiles')
      .upsert(profileData, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('\n❌ ERREUR lors de la sauvegarde:');
      console.error('   Code:', error.code);
      console.error('   Message:', error.message);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
      return;
    }

    console.log('\n✅ Sauvegarde réussie!');

    // Vérifier que les données ont été sauvegardées
    const { data: saved, error: readError } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, budget_min, budget_max, is_smoker')
      .eq('user_id', userId)
      .single();

    if (readError) {
      console.error('❌ Erreur lecture:', readError);
      return;
    }

    console.log('\n✅ Données sauvegardées et vérifiées:');
    console.log(JSON.stringify(saved, null, 2));

  } catch (error) {
    console.error('\n❌ Exception:', error);
  }
}

testSave();
