import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Diverse first names
const firstNames = [
  'Emma', 'Lucas', 'Léa', 'Hugo', 'Chloé', 'Louis', 'Camille', 'Arthur',
  'Zoé', 'Gabriel', 'Inès', 'Raphaël', 'Manon', 'Noah', 'Sarah', 'Jules',
  'Jade', 'Adam', 'Lola', 'Tom'
];

// Last names
const lastNames = [
  'Dubois', 'Martin', 'Bernard', 'Petit', 'Robert', 'Richard', 'Durand', 'Moreau',
  'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux',
  'Vincent', 'Fournier', 'Morel', 'Girard'
];

// Professions variées
const professions = [
  'Étudiant en médecine', 'Développeur web', 'Designer graphique', 'Professeur',
  'Ingénieur', 'Architecte', 'Photographe', 'Marketing manager',
  'Data analyst', 'Juriste', 'Infirmier', 'Chef de projet',
  'Entrepreneur', 'Comptable', 'Journaliste', 'Traducteur',
  'UX Designer', 'Commercial', 'Consultant', 'Artiste'
];

// Bio templates
const bioTemplates = [
  (name: string, profession: string) =>
    `Salut ! Je suis ${name}, ${profession.toLowerCase()}. J'aime la musique, les sorties entre amis et les bons restos. Cherche une coloc sympa pour partager de bons moments ! 🎵`,
  (name: string, profession: string) =>
    `${name} ici, ${profession.toLowerCase()}. Passionné de sport et de cuisine. Assez ordonné mais pas maniaque. Recherche une ambiance cool et respectueuse. 🏃‍♂️🍳`,
  (name: string, profession: string) =>
    `Moi c'est ${name}, je bosse comme ${profession.toLowerCase()}. Fan de séries Netflix et de randonnées le week-end. Calme en semaine, sociable le weekend ! 📺🥾`,
  (name: string, profession: string) =>
    `Coucou ! ${name}, ${profession.toLowerCase()} de 25 ans. J'adore lire, voyager et découvrir de nouveaux endroits. Cherche des colocataires ouverts d'esprit. 📚✈️`,
  (name: string, profession: string) =>
    `Hey ! Je m'appelle ${name} et je travaille dans ${profession.toLowerCase()}. Grand fan de gaming et de tech. Respectueux et sympa, promis ! 🎮💻`,
];

// Valeurs pour les préférences
const cleanliness = [3, 4, 5, 6, 7, 8, 9, 10]; // Varied cleanliness levels
const socialLevels = ['très sociale', 'sociale', 'équilibrée', 'calme', 'très calme'];
const sleepSchedules = ['lève-tôt', 'normal', 'couche-tard'];
const workSchedules = ['bureau', 'hybride', 'full remote'];
const petPreferences = ['adore', 'aime bien', 'neutre', 'pas fan'];
const smokingPreferences = ['non-fumeur', 'fumeur social', 'fumeur'];
const musicTastes = ['pop', 'rock', 'hip-hop', 'électronique', 'jazz', 'classique', 'indie'];
const hobbies = [
  'sport', 'cuisine', 'lecture', 'cinéma', 'gaming', 'musique',
  'photographie', 'voyages', 'art', 'yoga', 'running', 'vélo'
];

// Budget ranges
const budgetRanges = [
  { min: 400, max: 600 },
  { min: 500, max: 700 },
  { min: 600, max: 800 },
  { min: 700, max: 900 },
  { min: 800, max: 1000 },
];

// Cities in Brussels
const cities = ['Bruxelles', 'Ixelles', 'Etterbeek', 'Schaerbeek', 'Saint-Gilles'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateEmail(firstName: string, lastName: string): string {
  // Remove accents from names for email
  const cleanFirstName = firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const cleanLastName = lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return `${cleanFirstName}.${cleanLastName}@demo.easyco.be`;
}

async function generateDemoSearcher(index: number) {
  const firstName = firstNames[index];
  const lastName = lastNames[index];
  const email = generateEmail(firstName, lastName);
  const profession = professions[index];
  const bioTemplate = bioTemplates[index % bioTemplates.length];
  const bio = bioTemplate(firstName, profession);

  const budgetRange = getRandomElement(budgetRanges);
  const preferredCities = getRandomElements(cities, Math.floor(Math.random() * 2) + 1);
  const selectedHobbies = getRandomElements(hobbies, Math.floor(Math.random() * 4) + 2);
  const selectedMusic = getRandomElements(musicTastes, Math.floor(Math.random() * 3) + 1);

  // Generate unique preferences for each person
  const preferences = {
    cleanliness_importance: getRandomElement(cleanliness),
    social_level: getRandomElement(socialLevels),
    sleep_schedule: getRandomElement(sleepSchedules),
    work_schedule: getRandomElement(workSchedules),
    pets: getRandomElement(petPreferences),
    smoking: getRandomElement(smokingPreferences),
    hobbies: selectedHobbies,
    music_taste: selectedMusic,
    budget_min: budgetRange.min,
    budget_max: budgetRange.max,
    preferred_cities: preferredCities,
    move_in_date: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Within next 3 months
    room_type: getRandomElement(['private', 'shared']),
    lease_duration: getRandomElement([6, 12, 24]),
    quiet_hours: Math.random() > 0.5,
    guests_allowed: Math.random() > 0.3,
    shared_expenses: Math.random() > 0.4,
  };

  console.log(`\n📝 Generating searcher ${index + 1}/20: ${firstName} ${lastName}`);

  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'DemoPassword123!',
      email_confirm: true,
      user_metadata: {
        full_name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
      }
    });

    if (authError) {
      console.error(`❌ Auth error for ${firstName}:`, authError.message);
      return;
    }

    console.log(`✅ Created auth user: ${email}`);

    // 2. Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        user_type: 'searcher',
        profession,
        onboarding_completed: true,
        profile_completion: 100,
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error(`❌ Profile error for ${firstName}:`, profileError.message);
      return;
    }

    console.log(`✅ Updated profile with profession`);

    // 3. Create searcher preferences
    const { error: prefsError } = await supabase
      .from('searcher_preferences')
      .insert({
        user_id: authData.user.id,
        ...preferences,
      });

    if (prefsError) {
      console.error(`❌ Preferences error for ${firstName}:`, prefsError.message);
      return;
    }

    console.log(`✅ Created searcher preferences`);
    console.log(`   💰 Budget: €${preferences.budget_min}-${preferences.budget_max}/mois`);
    console.log(`   📍 Cities: ${preferredCities.join(', ')}`);
    console.log(`   🧹 Cleanliness: ${preferences.cleanliness_importance}/10`);
    console.log(`   🎵 Music: ${selectedMusic.join(', ')}`);
    console.log(`   🎯 Hobbies: ${selectedHobbies.join(', ')}`);

  } catch (error: any) {
    console.error(`❌ Unexpected error for ${firstName}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting demo searchers generation...\n');
  console.log('📊 This will create 20 diverse searcher profiles for testing matching algorithm\n');

  for (let i = 0; i < 20; i++) {
    await generateDemoSearcher(i);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n\n🎉 Demo searchers generation completed!');
  console.log('📧 All demo accounts use password: DemoPassword123!');
  console.log('🔍 You can now test the matching algorithm in the People view');
}

main().catch(console.error);
