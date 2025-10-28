/**
 * Seed Demo Data Script
 * Creates test users and profiles for development/demo purposes
 * Run with: npx tsx scripts/seed-demo-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Demo users data
const demoUsers = {
  searchers: [
    {
      email: 'sophie.laurent@demo.easyco.com',
      password: 'Demo123!',
      firstName: 'Sophie',
      lastName: 'Laurent',
      phone: '+32 485 12 34 56',
      dateOfBirth: '1995-06-15',
      nationality: 'Belgian',
      bio: 'Jeune professionnelle dans le marketing digital, passionnée de yoga et de cuisine. Je recherche une colocation conviviale avec des personnes ouvertes et respectueuses.',
      occupation: 'Marketing Manager',
      monthlyIncome: 2800,
      preferredCities: ['Ixelles', 'Saint-Gilles', 'Etterbeek'],
      budgetMin: 600,
      budgetMax: 900,
      lifestylePreferences: {
        smoking: 'no',
        pets: 'no_preference',
        noise_level: 'moderate',
        cleanliness: 'very_clean',
        interests: ['yoga', 'cooking', 'hiking', 'photography'],
      },
    },
    {
      email: 'ahmed.elmansouri@demo.easyco.com',
      password: 'Demo123!',
      firstName: 'Ahmed',
      lastName: 'El Mansouri',
      phone: '+32 486 23 45 67',
      dateOfBirth: '2001-03-22',
      nationality: 'Moroccan',
      bio: 'Étudiant en ingénieur informatique à l\'ULB. Calme et studieux, j\'aime jouer aux jeux vidéo et faire du sport.',
      occupation: 'Student',
      monthlyIncome: 850,
      preferredCities: ['Ixelles', 'Schaerbeek', 'Auderghem'],
      budgetMin: 400,
      budgetMax: 600,
      lifestylePreferences: {
        smoking: 'no',
        pets: 'yes',
        noise_level: 'quiet',
        cleanliness: 'clean',
        interests: ['gaming', 'football', 'cinema', 'tech'],
      },
    },
    {
      email: 'emma.vanderberg@demo.easyco.com',
      password: 'Demo123!',
      firstName: 'Emma',
      lastName: 'Van Der Berg',
      phone: '+32 487 34 56 78',
      dateOfBirth: '1988-11-08',
      nationality: 'Belgian',
      bio: 'Designer freelance travaillant de chez moi. J\'adore les plantes, la décoration et les soirées jeux de société.',
      occupation: 'Freelance Designer',
      monthlyIncome: 2200,
      preferredCities: ['Forest', 'Uccle', 'Saint-Gilles'],
      budgetMin: 700,
      budgetMax: 1000,
      lifestylePreferences: {
        smoking: 'no',
        pets: 'yes',
        noise_level: 'quiet',
        cleanliness: 'very_clean',
        interests: ['design', 'plants', 'board_games', 'reading'],
      },
    },
    {
      email: 'lucas.dubois@demo.easyco.com',
      password: 'Demo123!',
      firstName: 'Lucas',
      lastName: 'Dubois',
      phone: '+32 488 45 67 89',
      dateOfBirth: '1992-04-18',
      nationality: 'French',
      bio: 'Comptable chez EY, en couple. Nous sommes calmes, organisés et respectueux. Cherchons un appartement pour nous deux.',
      occupation: 'Accountant',
      monthlyIncome: 3500,
      preferredCities: ['Woluwe-Saint-Pierre', 'Etterbeek', 'Auderghem'],
      budgetMin: 900,
      budgetMax: 1300,
      lifestylePreferences: {
        smoking: 'no',
        pets: 'yes',
        noise_level: 'quiet',
        cleanliness: 'very_clean',
        interests: ['cooking', 'hiking', 'travel', 'music'],
      },
    },
    {
      email: 'maria.santos@demo.easyco.com',
      password: 'Demo123!',
      firstName: 'Maria',
      lastName: 'Santos',
      phone: '+32 489 56 78 90',
      dateOfBirth: '1990-09-25',
      nationality: 'Portuguese',
      bio: 'Venue du Portugal pour travailler à la Commission Européenne. Sociable et aventurière.',
      occupation: 'EU Policy Advisor',
      monthlyIncome: 3200,
      preferredCities: ['Bruxelles-Centre', 'Ixelles', 'Saint-Josse'],
      budgetMin: 750,
      budgetMax: 1100,
      lifestylePreferences: {
        smoking: 'occasionally',
        pets: 'no',
        noise_level: 'lively',
        cleanliness: 'clean',
        interests: ['travel', 'food', 'nightlife', 'languages'],
      },
    },
  ],
  owners: [
    {
      email: 'jeanmarc.petit@demo.easyco.com',
      password: 'Demo123!',
      firstName: 'Jean-Marc',
      lastName: 'Petit',
      phone: '+32 475 11 22 33',
      dateOfBirth: '1975-05-12',
      nationality: 'Belgian',
      bio: 'Propriétaire d\'un appartement rénové à Ixelles que je loue depuis 5 ans.',
      hostingExperience: 'experienced',
      ownerType: 'individual',
      hasProperty: true,
      propertyCity: 'Ixelles',
      propertyType: 'apartment',
    },
    {
      email: 'isabelle.moreau@demo.easyco.com',
      password: 'Demo123!',
      firstName: 'Isabelle',
      lastName: 'Moreau',
      phone: '+32 476 22 33 44',
      dateOfBirth: '1968-08-30',
      nationality: 'Belgian',
      bio: 'Propriétaire de plusieurs biens immobiliers à Bruxelles. 15 ans d\'expérience.',
      hostingExperience: 'expert',
      ownerType: 'individual',
      hasProperty: true,
      propertyCity: 'Saint-Gilles',
      propertyType: 'house',
    },
    {
      email: 'thomas.janssens@demo.easyco.com',
      password: 'Demo123!',
      firstName: 'Thomas',
      lastName: 'Janssens',
      phone: '+32 477 33 44 55',
      dateOfBirth: '1985-02-14',
      nationality: 'Belgian',
      bio: 'Premier investissement locatif ! Studio moderne à Schaerbeek.',
      hostingExperience: 'beginner',
      ownerType: 'individual',
      hasProperty: true,
      propertyCity: 'Schaerbeek',
      propertyType: 'studio',
    },
    {
      email: 'sophie.vermeulen@demo.easyco.com',
      password: 'Demo123!',
      firstName: 'Sophie',
      lastName: 'Vermeulen',
      phone: '+32 478 44 55 66',
      dateOfBirth: '1980-12-03',
      nationality: 'Belgian',
      bio: 'Grande maison de coliving à Forest avec jardin. J\'adore créer une communauté conviviale.',
      hostingExperience: 'experienced',
      ownerType: 'individual',
      hasProperty: true,
      propertyCity: 'Forest',
      propertyType: 'coliving',
    },
  ],
  residents: [
    {
      email: 'pierre.lecomte@demo.easyco.com',
      password: 'Demo123!',
      firstName: 'Pierre',
      lastName: 'Lecomte',
      phone: '+32 491 11 22 33',
      dateOfBirth: '1993-07-20',
      nationality: 'Belgian',
      bio: 'Ingénieur civil habitant à Ixelles. Calme en semaine, sociable le weekend.',
      occupation: 'Civil Engineer',
      monthlyIncome: 3100,
      lifestylePreferences: {
        smoking: 'no',
        pets: 'yes',
        noise_level: 'moderate',
        cleanliness: 'clean',
        interests: ['cinema', 'cooking', 'cycling', 'beer'],
      },
    },
    {
      email: 'laura.gonzalez@demo.easyco.com',
      password: 'Demo123!',
      firstName: 'Laura',
      lastName: 'Gonzalez',
      phone: '+32 492 22 33 44',
      dateOfBirth: '1998-03-15',
      nationality: 'Spanish',
      bio: 'Doctorante en biologie à l\'ULB. Organisée et respectueuse.',
      occupation: 'PhD Student',
      monthlyIncome: 1100,
      lifestylePreferences: {
        smoking: 'no',
        pets: 'no',
        noise_level: 'quiet',
        cleanliness: 'very_clean',
        interests: ['science', 'yoga', 'books', 'art'],
      },
    },
    {
      email: 'maxime.dubois@demo.easyco.com',
      password: 'Demo123!',
      firstName: 'Maxime',
      lastName: 'Dubois',
      phone: '+32 493 33 44 55',
      dateOfBirth: '1996-11-28',
      nationality: 'French',
      bio: 'Je travaille dans une startup tech à Bruxelles. Dynamique et ouvert.',
      occupation: 'Software Developer',
      monthlyIncome: 2400,
      lifestylePreferences: {
        smoking: 'occasionally',
        pets: 'no_preference',
        noise_level: 'lively',
        cleanliness: 'moderate',
        interests: ['tech', 'nightlife', 'sports', 'travel'],
      },
    },
  ],
};

// Properties data
const properties = [
  {
    title: 'Superbe appartement 2 chambres rénové - Ixelles',
    description: 'Magnifique appartement de 85m² entièrement rénové au cœur d\'Ixelles, à 5 minutes à pied de la place Flagey.',
    propertyType: 'apartment',
    address: 'Avenue de la Couronne 234',
    city: 'Ixelles',
    neighborhood: 'Flagey',
    postalCode: '1050',
    bedrooms: 2,
    bathrooms: 1,
    surfaceArea: 85,
    furnished: true,
    monthlyRent: 1250,
    charges: 150,
    deposit: 2500,
    amenities: ['wifi', 'elevator', 'balcony', 'dishwasher', 'washing_machine', 'heating', 'furnished'],
    images: [
      'https://images.unsplash.com/photo-1502672260066-6bc36a8baf37?w=800',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800',
    ],
    ownerEmail: 'jeanmarc.petit@demo.easyco.com',
  },
  {
    title: 'Studio moderne tout équipé - Schaerbeek',
    description: 'Charmant studio de 35m² entièrement meublé et équipé, parfait pour étudiant ou jeune professionnel.',
    propertyType: 'studio',
    address: 'Rue Josaphat 145',
    city: 'Schaerbeek',
    neighborhood: 'Diamant',
    postalCode: '1030',
    bedrooms: 0,
    bathrooms: 1,
    surfaceArea: 35,
    furnished: true,
    monthlyRent: 650,
    charges: 80,
    deposit: 1300,
    amenities: ['wifi', 'washing_machine', 'heating', 'furnished'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
    ],
    ownerEmail: 'thomas.janssens@demo.easyco.com',
  },
  {
    title: 'Coliving dans maison de maître avec jardin - Forest',
    description: 'Magnifique maison de maître de 280m² transformée en espace de coliving moderne et convivial.',
    propertyType: 'coliving',
    address: 'Avenue Besme 89',
    city: 'Forest',
    neighborhood: 'Altitude 100',
    postalCode: '1190',
    bedrooms: 6,
    bathrooms: 3,
    surfaceArea: 280,
    furnished: true,
    monthlyRent: 695,
    charges: 200,
    deposit: 1390,
    amenities: ['wifi', 'garden', 'laundry', 'dishwasher', 'washing_machine', 'heating', 'furnished', 'parking'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    ],
    ownerEmail: 'sophie.vermeulen@demo.easyco.com',
  },
  {
    title: 'Appartement de standing 3 chambres - Woluwe',
    description: 'Superbe appartement haut de gamme de 120m² dans une résidence moderne et sécurisée.',
    propertyType: 'apartment',
    address: 'Avenue de Tervueren 412',
    city: 'Woluwe-Saint-Pierre',
    neighborhood: 'Montgomery',
    postalCode: '1150',
    bedrooms: 3,
    bathrooms: 2,
    surfaceArea: 120,
    furnished: false,
    monthlyRent: 1800,
    charges: 250,
    deposit: 3600,
    amenities: ['wifi', 'elevator', 'balcony', 'parking', 'dishwasher', 'washing_machine', 'heating'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
    ],
    ownerEmail: 'isabelle.moreau@demo.easyco.com',
  },
  {
    title: 'Maison de caractère 4 chambres avec jardin - Saint-Gilles',
    description: 'Charmante maison bruxelloise typique de 150m² répartis sur 3 niveaux.',
    propertyType: 'house',
    address: 'Rue de la Victoire 78',
    city: 'Saint-Gilles',
    neighborhood: 'Parvis',
    postalCode: '1060',
    bedrooms: 4,
    bathrooms: 2,
    surfaceArea: 150,
    furnished: false,
    monthlyRent: 2100,
    charges: 200,
    deposit: 4200,
    amenities: ['wifi', 'garden', 'laundry', 'dishwasher', 'washing_machine', 'heating', 'balcony'],
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
    ],
    ownerEmail: 'isabelle.moreau@demo.easyco.com',
  },
];

async function createUser(email: string, password: string, metadata: any) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log(`⚠️  User ${email} already exists, fetching existing user...`);
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const user = existingUser?.users.find(u => u.email === email);
      return user;
    }
    throw error;
  }

  return data.user;
}

async function createProfile(userId: string, userType: string, profileData: any) {
  const { error } = await supabase.from('user_profiles').upsert({
    user_id: userId,
    email: profileData.email,
    first_name: profileData.firstName,
    last_name: profileData.lastName,
    phone: profileData.phone,
    date_of_birth: profileData.dateOfBirth,
    nationality: profileData.nationality,
    user_type: userType,
    profile_status: 'complete',
    bio: profileData.bio,
    occupation: profileData.occupation,
    monthly_income: profileData.monthlyIncome,
    preferred_cities: profileData.preferredCities,
    budget_min: profileData.budgetMin,
    budget_max: profileData.budgetMax,
    lifestyle_preferences: profileData.lifestylePreferences || null,
    hosting_experience: profileData.hostingExperience,
    owner_type: profileData.ownerType,
    has_property: profileData.hasProperty,
    property_city: profileData.propertyCity,
    property_type: profileData.propertyType,
  });

  if (error) throw error;
}

async function createProperty(ownerId: string, propertyData: any) {
  const { error } = await supabase.from('properties').insert({
    owner_id: ownerId,
    title: propertyData.title,
    description: propertyData.description,
    property_type: propertyData.propertyType,
    address: propertyData.address,
    city: propertyData.city,
    neighborhood: propertyData.neighborhood,
    postal_code: propertyData.postalCode,
    country: 'Belgium',
    bedrooms: propertyData.bedrooms,
    bathrooms: propertyData.bathrooms,
    surface_area: propertyData.surfaceArea,
    furnished: propertyData.furnished,
    monthly_rent: propertyData.monthlyRent,
    charges: propertyData.charges,
    deposit: propertyData.deposit,
    amenities: propertyData.amenities,
    images: propertyData.images,
    main_image: propertyData.images[0],
    status: 'published',
    is_available: true,
    smoking_allowed: false,
    pets_allowed: propertyData.propertyType === 'coliving' || propertyData.propertyType === 'house',
    couples_allowed: true,
    minimum_stay_months: 3,
  });

  if (error) throw error;
}

async function seedData() {
  console.log('🌱 Starting demo data seeding...\n');

  const userIdMap: Record<string, string> = {};

  try {
    // Create Searchers
    console.log('👥 Creating Searcher profiles...');
    for (const searcher of demoUsers.searchers) {
      const user = await createUser(searcher.email, searcher.password, {
        first_name: searcher.firstName,
        last_name: searcher.lastName,
      });
      if (user) {
        await createProfile(user.id, 'searcher', searcher);
        userIdMap[searcher.email] = user.id;
        console.log(`   ✅ Created: ${searcher.firstName} ${searcher.lastName} (${searcher.email})`);
      }
    }

    // Create Owners
    console.log('\n🏠 Creating Owner profiles...');
    for (const owner of demoUsers.owners) {
      const user = await createUser(owner.email, owner.password, {
        first_name: owner.firstName,
        last_name: owner.lastName,
      });
      if (user) {
        await createProfile(user.id, 'owner', owner);
        userIdMap[owner.email] = user.id;
        console.log(`   ✅ Created: ${owner.firstName} ${owner.lastName} (${owner.email})`);
      }
    }

    // Create Residents
    console.log('\n🏘️  Creating Resident profiles...');
    for (const resident of demoUsers.residents) {
      const user = await createUser(resident.email, resident.password, {
        first_name: resident.firstName,
        last_name: resident.lastName,
      });
      if (user) {
        await createProfile(user.id, 'resident', resident);
        userIdMap[resident.email] = user.id;
        console.log(`   ✅ Created: ${resident.firstName} ${resident.lastName} (${resident.email})`);
      }
    }

    // Create Properties
    console.log('\n🏢 Creating Properties...');
    for (const property of properties) {
      const ownerId = userIdMap[property.ownerEmail];
      if (ownerId) {
        await createProperty(ownerId, property);
        console.log(`   ✅ Created: ${property.title} (${property.city})`);
      }
    }

    console.log('\n✨ Demo data seeding completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   • ${demoUsers.searchers.length} Searchers`);
    console.log(`   • ${demoUsers.owners.length} Owners`);
    console.log(`   • ${demoUsers.residents.length} Residents`);
    console.log(`   • ${properties.length} Properties`);
    console.log('\n🔐 Login credentials:');
    console.log('   Email: any email from above');
    console.log('   Password: Demo123!');
    console.log('\n');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
