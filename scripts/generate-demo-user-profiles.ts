import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// 20 diverse demo profiles with varied characteristics
const demoProfiles = [
  {
    firstName: 'Marie', lastName: 'Lefevre',
    bio: 'Designer graphique de 26 ans, créative et organisée. J\'adore les plantes et la déco.',
    occupation_status: 'employed', field: 'Design', budgetMin: 600, budgetMax: 850,
    cleanliness: 'very_tidy', sociability: 'high', wakeUp: 'moderate', sleep: 'moderate',
    smoker: false, pets: false, cooking: 'often', districts: ['Ixelles', 'Saint-Gilles'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Thomas', lastName: 'Dubois',
    bio: 'Développeur fullstack, 28 ans. Passionné de tech et gaming. Calme et respectueux.',
    occupation_status: 'employed', field: 'Software Developer', budgetMin: 700, budgetMax: 950,
    cleanliness: 'tidy', sociability: 'medium', wakeUp: 'late', sleep: 'late',
    smoker: false, pets: false, cooking: 'sometimes', districts: ['Bruxelles', 'Etterbeek'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Amelie', lastName: 'Martin',
    bio: 'Étudiante en médecine, 24 ans. Studieuse mais sociable. Cherche une ambiance conviviale.',
    occupation_status: 'student', field: 'Medicine Student', budgetMin: 500, budgetMax: 700,
    cleanliness: 'very_tidy', sociability: 'high', wakeUp: 'early', sleep: 'moderate',
    smoker: false, pets: false, cooking: 'rarely', districts: ['Ixelles', 'Etterbeek'],
    petTolerance: false, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Lucas', lastName: 'Bernard',
    bio: 'Consultant en management, 30 ans. Voyage souvent pour le travail. Professionnel et propre.',
    occupation_status: 'employed', field: 'Consultant', budgetMin: 800, budgetMax: 1100,
    cleanliness: 'very_tidy', sociability: 'low', wakeUp: 'early', sleep: 'early',
    smoker: false, pets: false, cooking: 'rarely', districts: ['Bruxelles', 'Ixelles'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Clara', lastName: 'Petit',
    bio: 'Architecte d\'intérieur, 27 ans. Aime cuisiner et recevoir. Recherche coloc dynamique.',
    occupation_status: 'employed', field: 'Architect', budgetMin: 650, budgetMax: 900,
    cleanliness: 'tidy', sociability: 'high', wakeUp: 'moderate', sleep: 'late',
    smoker: false, pets: true, cooking: 'daily', districts: ['Saint-Gilles', 'Ixelles'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Nathan', lastName: 'Robert',
    bio: 'Photographe freelance, 29 ans. Créatif et flexible. Cherche environnement inspirant.',
    occupation_status: 'freelance', field: 'Photographer', budgetMin: 550, budgetMax: 750,
    cleanliness: 'moderate', sociability: 'medium', wakeUp: 'late', sleep: 'late',
    smoker: true, pets: false, cooking: 'sometimes', districts: ['Saint-Gilles', 'Schaerbeek'],
    petTolerance: true, smokingTolerance: true, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Emma', lastName: 'Richard',
    bio: 'Data analyst, 25 ans. Introvertie mais gentille. Besoin de calme pour travailler.',
    occupation_status: 'employed', field: 'Data Analyst', budgetMin: 600, budgetMax: 800,
    cleanliness: 'very_tidy', sociability: 'low', wakeUp: 'moderate', sleep: 'moderate',
    smoker: false, pets: false, cooking: 'sometimes', districts: ['Etterbeek', 'Bruxelles'],
    petTolerance: false, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Hugo', lastName: 'Durand',
    bio: 'Professeur de français, 31 ans. Calme et organisé. Aime la lecture et le cinéma.',
    occupation_status: 'employed', field: 'Teacher', budgetMin: 700, budgetMax: 900,
    cleanliness: 'tidy', sociability: 'medium', wakeUp: 'early', sleep: 'early',
    smoker: false, pets: false, cooking: 'often', districts: ['Ixelles', 'Etterbeek'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Lea', lastName: 'Moreau',
    bio: 'Chef de projet marketing, 28 ans. Énergique et sociale. Adore organiser des soirées.',
    occupation_status: 'employed', field: 'Marketing Manager', budgetMin: 750, budgetMax: 1000,
    cleanliness: 'moderate', sociability: 'high', wakeUp: 'moderate', sleep: 'late',
    smoker: false, pets: true, cooking: 'often', districts: ['Bruxelles', 'Saint-Gilles'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Antoine', lastName: 'Simon',
    bio: 'Ingénieur civil, 29 ans. Pratique beaucoup de sport. Cherche coloc active.',
    occupation_status: 'employed', field: 'Civil Engineer', budgetMin: 700, budgetMax: 950,
    cleanliness: 'tidy', sociability: 'high', wakeUp: 'early', sleep: 'early',
    smoker: false, pets: false, cooking: 'sometimes', districts: ['Ixelles', 'Etterbeek'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Camille', lastName: 'Laurent',
    bio: 'UX Designer, 26 ans. Créative et empathique. Cherche ambiance zen et bienveillante.',
    occupation_status: 'employed', field: 'UX Designer', budgetMin: 650, budgetMax: 850,
    cleanliness: 'tidy', sociability: 'medium', wakeUp: 'moderate', sleep: 'moderate',
    smoker: false, pets: true, cooking: 'often', districts: ['Saint-Gilles', 'Ixelles'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Maxime', lastName: 'Lefebvre',
    bio: 'Étudiant en droit, 23 ans. Sérieux mais sympa. Cherche coloc calme pour étudier.',
    occupation_status: 'student', field: 'Law Student', budgetMin: 450, budgetMax: 650,
    cleanliness: 'moderate', sociability: 'low', wakeUp: 'moderate', sleep: 'late',
    smoker: false, pets: false, cooking: 'rarely', districts: ['Etterbeek', 'Schaerbeek'],
    petTolerance: false, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Sarah', lastName: 'Michel',
    bio: 'Journaliste indépendante, 27 ans. Curieuse et bavarde. Adore les débats intellectuels.',
    occupation_status: 'freelance', field: 'Journalist', budgetMin: 600, budgetMax: 800,
    cleanliness: 'moderate', sociability: 'high', wakeUp: 'late', sleep: 'late',
    smoker: true, pets: false, cooking: 'sometimes', districts: ['Saint-Gilles', 'Bruxelles'],
    petTolerance: true, smokingTolerance: true, photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Alexandre', lastName: 'Garcia',
    bio: 'Commercial B2B, 30 ans. Dynamique et positif. Voyage beaucoup pour le travail.',
    occupation_status: 'employed', field: 'Sales Manager', budgetMin: 750, budgetMax: 1000,
    cleanliness: 'moderate', sociability: 'high', wakeUp: 'early', sleep: 'moderate',
    smoker: false, pets: false, cooking: 'rarely', districts: ['Bruxelles', 'Ixelles'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Oceane', lastName: 'David',
    bio: 'Infirmière, 25 ans. Horaires variables. Calme et bienveillante. Cherche coloc flexible.',
    occupation_status: 'employed', field: 'Nurse', budgetMin: 550, budgetMax: 750,
    cleanliness: 'very_tidy', sociability: 'medium', wakeUp: 'early', sleep: 'early',
    smoker: false, pets: false, cooking: 'sometimes', districts: ['Schaerbeek', 'Etterbeek'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Jules', lastName: 'Bertrand',
    bio: 'Musicien et prof de musique, 28 ans. Créatif et passionné. Pratique à la maison (casque).',
    occupation_status: 'employed', field: 'Music Teacher', budgetMin: 500, budgetMax: 700,
    cleanliness: 'moderate', sociability: 'high', wakeUp: 'late', sleep: 'late',
    smoker: false, pets: true, cooking: 'sometimes', districts: ['Saint-Gilles', 'Schaerbeek'],
    petTolerance: true, smokingTolerance: true, photo: 'https://images.unsplash.com/photo-1520409364224-63400afe26e5?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Manon', lastName: 'Roux',
    bio: 'Psychologue, 29 ans. Empathique et à l\'écoute. Cherche environnement harmonieux.',
    occupation_status: 'employed', field: 'Psychologist', budgetMin: 700, budgetMax: 900,
    cleanliness: 'tidy', sociability: 'medium', wakeUp: 'moderate', sleep: 'moderate',
    smoker: false, pets: false, cooking: 'often', districts: ['Ixelles', 'Etterbeek'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Theo', lastName: 'Vincent',
    bio: 'Étudiant en informatique, 22 ans. Geek sympathique. Gaming et séries le soir.',
    occupation_status: 'student', field: 'Computer Science Student', budgetMin: 400, budgetMax: 600,
    cleanliness: 'moderate', sociability: 'low', wakeUp: 'late', sleep: 'late',
    smoker: false, pets: false, cooking: 'rarely', districts: ['Etterbeek', 'Schaerbeek'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Zoe', lastName: 'Fournier',
    bio: 'Entrepreneure dans la mode durable, 27 ans. Écolo et créative. Cherche personnes engagées.',
    occupation_status: 'entrepreneur', field: 'Entrepreneur', budgetMin: 600, budgetMax: 850,
    cleanliness: 'tidy', sociability: 'high', wakeUp: 'moderate', sleep: 'moderate',
    smoker: false, pets: true, cooking: 'daily', districts: ['Saint-Gilles', 'Ixelles'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80'
  },
  {
    firstName: 'Gabriel', lastName: 'Morel',
    bio: 'Traducteur freelance, 26 ans. Travaille à domicile. Calme et discret mais sympa.',
    occupation_status: 'freelance', field: 'Translator', budgetMin: 500, budgetMax: 700,
    cleanliness: 'tidy', sociability: 'low', wakeUp: 'moderate', sleep: 'late',
    smoker: false, pets: false, cooking: 'sometimes', districts: ['Ixelles', 'Bruxelles'],
    petTolerance: true, smokingTolerance: false, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80'
  },
];

function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function generateEmail(firstName: string, lastName: string): string {
  return `${removeAccents(firstName).toLowerCase()}.${removeAccents(lastName).toLowerCase()}@izzicodemo.be`;
}

function randomMoveInDate(): string {
  const daysFromNow = Math.floor(Math.random() * 90) + 14; // 2 weeks to 3 months
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

async function generateProfile(profile: typeof demoProfiles[0], index: number) {
  const email = generateEmail(profile.firstName, profile.lastName);
  console.log(`\n📝 [${index + 1}/20] ${profile.firstName} ${profile.lastName}`);

  try {
    // 1. Create auth user
    let userId: string;

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'DemoPassword123!',
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log(`⚠️  User already exists, skipping...`);
        return;
      } else {
        console.error(`❌ Auth error:`, authError.message);
        return;
      }
    }

    userId = authData.user.id;
    console.log(`✅ Created auth user`);

    // 2. Create user_profiles entry
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
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
        profile_completion_score: Math.floor(Math.random() * 30) + 70, // 70-100
      });

    if (profileError) {
      console.error(`❌ Profile error:`, profileError.message);
      return;
    }

    console.log(`✅ Created user_profile`);
    console.log(`   💰 Budget: €${profile.budgetMin}-${profile.budgetMax}/mois`);
    console.log(`   📍 Districts: ${profile.districts.join(', ')}`);
    console.log(`   🧹 Cleanliness: ${profile.cleanliness}`);
    console.log(`   👥 Sociability: ${profile.sociability}`);
    console.log(`   🎯 Occupation: ${profile.field}`);

  } catch (error: any) {
    console.error(`❌ Unexpected error:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting demo user profiles generation...\n');
  console.log('📊 Creating 20 diverse searcher profiles for People matching\n');

  for (let i = 0; i < demoProfiles.length; i++) {
    await generateProfile(demoProfiles[i], i);
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n\n🎉 Demo generation completed!');
  console.log('📧 Password for all accounts: DemoPassword123!');
  console.log('🔍 Check the People view to see the new profiles!');
}

main().catch(console.error);
