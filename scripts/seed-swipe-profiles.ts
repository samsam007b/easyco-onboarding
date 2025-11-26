import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const frenchFirstNames = [
  'Antoine', 'Lucas', 'Thomas', 'Hugo', 'Louis',
  'Emma', 'Léa', 'Chloé', 'Manon', 'Sarah',
  'Nathan', 'Mathis', 'Enzo', 'Maxime', 'Alexandre',
  'Camille', 'Julie', 'Marie', 'Laura', 'Clara'
];

const frenchLastNames = [
  'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert',
  'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon',
  'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David',
  'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel'
];

const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateEmail = (firstName: string, lastName: string) =>
  `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

const randomAge = () => Math.floor(Math.random() * 30) + 20; // 20-49

const getDateOfBirth = (age: number) => {
  const year = new Date().getFullYear() - age;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

const randomBudget = () => Math.floor(Math.random() * 800) + 400; // 400-1200

const randomCities = () => {
  const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille', 'Nantes'];
  const count = Math.floor(Math.random() * 3) + 1; // 1-3 cities
  const selected: string[] = [];
  for (let i = 0; i < count; i++) {
    const city = randomFrom(cities);
    if (!selected.includes(city)) {
      selected.push(city);
    }
  }
  return selected;
};

const generateTestProfile = (index: number) => {
  const firstName = randomFrom(frenchFirstNames);
  const lastName = randomFrom(frenchLastNames);
  const age = randomAge();

  return {
    user_id: randomUUID(),
    email: `${generateEmail(firstName, lastName)}.${index}`,
    first_name: firstName,
    last_name: lastName,
    phone_number: `+33 6 ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`,
    date_of_birth: getDateOfBirth(age),
    profile_photo_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

async function main() {
  console.log('🌱 Seeding swipe test profiles...\n');

  // Generate 15 test profiles
  const profiles = Array.from({ length: 15 }, (_, i) => generateTestProfile(i));

  console.log(`📝 Generated ${profiles.length} test profiles`);

  // Insert profiles
  const { data, error } = await supabase
    .from('profiles')
    .insert(profiles)
    .select();

  if (error) {
    console.error('❌ Error inserting profiles:', error);
    process.exit(1);
  }

  console.log(`✅ Successfully inserted ${data?.length || 0} profiles\n`);

  // Display sample profiles
  console.log('📋 Sample profiles:');
  data?.slice(0, 3).forEach((profile: any, i: number) => {
    console.log(`\n${i + 1}. ${profile.first_name} ${profile.last_name}`);
    console.log(`   Email: ${profile.email}`);
    console.log(`   Date of Birth: ${profile.date_of_birth}`);
    console.log(`   Phone: ${profile.phone_number}`);
  });

  console.log('\n✨ Done! You can now test the swipe interface.');
  console.log('💡 Tip: Use the reload button in the app to see these profiles.\n');
}

main().catch(console.error);
