/**
 * MARC VERBEKE - Owner Persona Seed Script
 * =========================================
 * Creates realistic marketing data based on Brussels market research
 *
 * Run with: npx tsx scripts/seed-marc-verbeke.ts
 *
 * Target account: baudonsamuel@gmail.com
 *
 * PORTFOLIO:
 * 1. Villa Clos des Erables (Uccle) - Coliving premium 6ch - 5/6 occupees
 * 2. Maison Parvis (Saint-Gilles) - Colocation 4ch - 4/4 occupees
 * 3. Appartement Flagey (Ixelles) - 2ch - 2/2 occupees
 * 4. Studio Schuman (Etterbeek) - 1ch - 1/1 occupe
 * 5. Kot ULB Solbosch (Ixelles) - 3ch etudiants - 2/3 occupees
 *
 * TOTAL: 16 chambres, 14 occupees, 10 candidatures
 * REVENUS: 9.870 EUR/mois (si 100% occupe: 10.510 EUR)
 *
 * Sources prix:
 * - RTBF/Federia 2025: loyer moyen Bruxelles 1.346 EUR
 * - Coliving: 760 EUR/chambre (Colonies)
 * - Kot etudiant: 490 EUR charges comprises
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  subMonths, subDays, addMonths, addDays,
  format, startOfMonth
} from 'date-fns';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TARGET_EMAIL = 'baudonsamuel@gmail.com';

// ============================================================================
// PROPERTIES - Based on Brussels market research
// ============================================================================

const PROPERTIES = [
  {
    id: uuidv4(),
    title: 'Villa Clos des Erables',
    description: `Villa 4 facades de 340m2 transformee en coliving haut de gamme. 6 chambres spacieuses dont 2 avec salle de bain privative. Grand jardin arbore de 200m2, parking 3 places, salle de sport et espace coworking.`,
    property_type: 'coliving' as const,
    address: 'Avenue du Prince d\'Orange 87',
    city: 'Uccle',
    neighborhood: 'Fort Jaco',
    postal_code: '1180',
    bedrooms: 6,
    bathrooms: 3,
    surface_area: 340,
    furnished: true,
    monthly_rent: 4680, // Total if full (780*4 + 850*2)
    charges: 150,
    deposit: 1700,
    amenities: ['wifi', 'garden', 'parking', 'laundry', 'dishwasher', 'gym', 'coworking'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    ],
    occupancy: 5,
    profile: 'star',
    monthsOwned: 42, // Since 2021
  },
  {
    id: uuidv4(),
    title: 'Maison Parvis Saint-Gilles',
    description: `Maison de maitre 1900 entierement renovee en 2019. 220m2 sur 3 niveaux, 4 chambres spacieuses, 2 salles de bain. Architecture preservee avec elements d'epoque. Terrasse et cave.`,
    property_type: 'house' as const,
    address: 'Rue de la Victoire 42',
    city: 'Saint-Gilles',
    neighborhood: 'Parvis',
    postal_code: '1060',
    bedrooms: 4,
    bathrooms: 2,
    surface_area: 220,
    furnished: true,
    monthly_rent: 2480, // 620*4
    charges: 80,
    deposit: 1240,
    amenities: ['wifi', 'terrace', 'laundry', 'cellar'],
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    ],
    occupancy: 4,
    profile: 'attention', // Has payment issue + maintenance
    monthsOwned: 78, // Since 2018
  },
  {
    id: uuidv4(),
    title: 'Appartement Flagey',
    description: `Appartement 2 chambres de 85m2 entierement renove. Situe a 2 minutes de la Place Flagey, proche de tous commerces et transports. Balcon, cave, parquet.`,
    property_type: 'apartment' as const,
    address: 'Rue Malibran 156',
    city: 'Ixelles',
    neighborhood: 'Flagey',
    postal_code: '1050',
    bedrooms: 2,
    bathrooms: 1,
    surface_area: 85,
    furnished: false,
    monthly_rent: 1450, // Market rate for 2ch Ixelles
    charges: 150,
    deposit: 2900,
    amenities: ['wifi', 'balcony', 'cellar', 'elevator'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1e741c86a7?w=800',
    ],
    occupancy: 2,
    profile: 'stable',
    monthsOwned: 156, // Since 2012 (heritage)
  },
  {
    id: uuidv4(),
    title: 'Studio Schuman',
    description: `Studio meuble standing de 35m2 idealement situe pres de la Commission Europeenne. Entierement equipe, parfait pour expatries et stagiaires EU.`,
    property_type: 'studio' as const,
    address: 'Rue Froissart 89',
    city: 'Etterbeek',
    neighborhood: 'Quartier Europeen',
    postal_code: '1040',
    bedrooms: 1,
    bathrooms: 1,
    surface_area: 35,
    furnished: true,
    monthly_rent: 920, // Premium for EU quarter
    charges: 0, // Included
    deposit: 920,
    amenities: ['wifi', 'elevator', 'fully_equipped'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
    occupancy: 1,
    profile: 'optimal',
    monthsOwned: 24, // Since 2023
  },
  {
    id: uuidv4(),
    title: 'Kot ULB Solbosch',
    description: `Appartement 3 chambres converti en kot etudiant. Situe a 5 minutes a pied du campus ULB Solbosch. Chambres de 12-15m2, cuisine equipee, wifi inclus.`,
    property_type: 'shared_room' as const,
    address: 'Avenue Adolphe Buyl 112',
    city: 'Ixelles',
    neighborhood: 'Solbosch',
    postal_code: '1050',
    bedrooms: 3,
    bathrooms: 1,
    surface_area: 75,
    furnished: true,
    monthly_rent: 1470, // 490*3
    charges: 0, // Included in 490
    deposit: 490,
    amenities: ['wifi', 'kitchen', 'near_campus'],
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    ],
    occupancy: 2,
    profile: 'student', // Student rotation
    monthsOwned: 36, // Since 2022
  },
];

// ============================================================================
// RESIDENTS - Mix of professionals and students
// ============================================================================

const RESIDENTS = [
  // Villa Clos des Erables (5/6 residents) - Young professionals
  {
    firstName: 'Emma',
    lastName: 'Van den Berg',
    age: 28,
    occupation: 'UX Designer @ Spotify',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    propertyIndex: 0,
    monthsIn: 14,
    rent: 850, // With private bathroom
    paymentStatus: 'paid' as const,
    gender: 'Femme',
  },
  {
    firstName: 'Lucas',
    lastName: 'Peeters',
    age: 31,
    occupation: 'Data Scientist @ BNP Fortis',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    propertyIndex: 0,
    monthsIn: 11,
    rent: 850,
    paymentStatus: 'paid' as const,
    gender: 'Homme',
  },
  {
    firstName: 'Sofia',
    lastName: 'Martinez',
    age: 29,
    occupation: 'Avocate - Droit EU',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    propertyIndex: 0,
    monthsIn: 8,
    rent: 780,
    paymentStatus: 'paid' as const,
    gender: 'Femme',
  },
  {
    firstName: 'Thomas',
    lastName: 'Janssen',
    age: 26,
    occupation: 'Consultant @ Deloitte',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    propertyIndex: 0,
    monthsIn: 6,
    rent: 780,
    paymentStatus: 'paid' as const,
    gender: 'Homme',
  },
  {
    firstName: 'Chloe',
    lastName: 'Dubois',
    age: 27,
    occupation: 'Product Manager @ Odoo',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    propertyIndex: 0,
    monthsIn: 3,
    rent: 780,
    paymentStatus: 'paid' as const,
    gender: 'Femme',
  },

  // Maison Parvis (4/4 residents) - Mixed
  {
    firstName: 'Antoine',
    lastName: 'Lemaire',
    age: 32,
    occupation: 'Architecte freelance',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    propertyIndex: 1,
    monthsIn: 18,
    rent: 620,
    paymentStatus: 'paid' as const,
    gender: 'Homme',
  },
  {
    firstName: 'Marie',
    lastName: 'Claessens',
    age: 29,
    occupation: 'Enseignante secondaire',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    propertyIndex: 1,
    monthsIn: 18,
    rent: 620,
    paymentStatus: 'overdue' as const, // 15 days late!
    gender: 'Femme',
  },
  {
    firstName: 'Julien',
    lastName: 'Hermans',
    age: 25,
    occupation: 'Doctorant ULB - Physique',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    propertyIndex: 1,
    monthsIn: 12,
    rent: 620,
    paymentStatus: 'paid' as const,
    gender: 'Homme',
  },
  {
    firstName: 'Yasmine',
    lastName: 'Benali',
    age: 27,
    occupation: 'Infirmiere - Hopital Erasme',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    propertyIndex: 1,
    monthsIn: 10,
    rent: 620,
    paymentStatus: 'paid' as const,
    gender: 'Femme',
  },

  // Appartement Flagey (2/2 residents) - Couple colocataires
  {
    firstName: 'Alexandre',
    lastName: 'Petit',
    age: 34,
    occupation: 'Chef de projet @ Proximus',
    photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400',
    propertyIndex: 2,
    monthsIn: 24,
    rent: 725, // Half of 1450
    paymentStatus: 'paid' as const,
    gender: 'Homme',
  },
  {
    firstName: 'Camille',
    lastName: 'Laurent',
    age: 32,
    occupation: 'Journaliste @ RTBF',
    photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
    propertyIndex: 2,
    monthsIn: 24,
    rent: 725,
    paymentStatus: 'paid' as const,
    gender: 'Femme',
  },

  // Studio Schuman (1/1 resident) - EU expat
  {
    firstName: 'Henrik',
    lastName: 'Lindqvist',
    age: 26,
    occupation: 'Stagiaire Commission EU',
    photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
    propertyIndex: 3,
    monthsIn: 4,
    rent: 920,
    paymentStatus: 'paid' as const,
    gender: 'Homme',
  },

  // Kot ULB (2/3 residents) - Students
  {
    firstName: 'Maxime',
    lastName: 'Wouters',
    age: 21,
    occupation: 'MA1 Ingenieur civil - ULB',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    propertyIndex: 4,
    monthsIn: 8,
    rent: 490,
    paymentStatus: 'paid' as const,
    gender: 'Homme',
  },
  {
    firstName: 'Laura',
    lastName: 'De Smet',
    age: 22,
    occupation: 'MA1 Droit - ULB',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    propertyIndex: 4,
    monthsIn: 8,
    rent: 490,
    paymentStatus: 'paid' as const,
    gender: 'Femme',
  },
];

// ============================================================================
// APPLICATIONS - For vacant rooms
// ============================================================================

const APPLICATIONS = [
  // Villa Clos des Erables - 4 candidatures (1 chambre vacante)
  {
    propertyIndex: 0,
    name: 'Sarah Janssen',
    email: 'sarah.janssen@outlook.com',
    occupation: 'Senior Designer @ Microsoft',
    status: 'reviewing' as const,
    daysAgo: 3,
    message: 'Je travaille en remote pour Microsoft depuis 2 ans et cherche un environnement de coliving premium.',
  },
  {
    propertyIndex: 0,
    name: 'Romain Peeters',
    email: 'romain.peeters@bcg.com',
    occupation: 'Consultant @ BCG',
    status: 'pending' as const,
    daysAgo: 5,
    message: 'Consultant chez BCG, je voyage beaucoup mais cherche une base stable a Bruxelles.',
  },
  {
    propertyIndex: 0,
    name: 'Nina Van Acker',
    email: 'nina.vanacker@proximus.be',
    occupation: 'Data Analyst @ Proximus',
    status: 'pending' as const,
    daysAgo: 7,
    message: 'Actuellement en colocation, je cherche un espace plus premium avec des colocataires professionnels.',
  },
  {
    propertyIndex: 0,
    name: 'Marco Silva',
    email: 'marco.silva@gmail.com',
    occupation: 'Project Manager (expatrie portugais)',
    status: 'pending' as const,
    daysAgo: 8,
    message: 'Je viens d\'arriver a Bruxelles pour un nouveau poste. Le coliving me semble ideal pour m\'integrer.',
  },

  // Kot ULB - 6 candidatures (1 chambre vacante)
  {
    propertyIndex: 4,
    name: 'Amelie Dubois',
    email: 'amelie.dubois@ulb.be',
    occupation: 'BA3 Sciences Po - ULB',
    status: 'reviewing' as const,
    daysAgo: 2,
    message: 'Etudiante serieuse en 3eme annee, je cherche un kot proche du campus pour ma derniere annee de bachelier.',
  },
  {
    propertyIndex: 4,
    name: 'Victor Claessens',
    email: 'victor.claessens@ulb.be',
    occupation: 'BA2 Medecine - ULB',
    status: 'pending' as const,
    daysAgo: 3,
    message: 'Etudiant en medecine, horaires irreguliers. Je cherche un kot calme pour mes etudes.',
  },
  {
    propertyIndex: 4,
    name: 'Ines Benali',
    email: 'ines.benali@ulb.be',
    occupation: 'MA1 Psychologie - ULB',
    status: 'pending' as const,
    daysAgo: 4,
    message: 'Je commence mon master et souhaite me rapprocher du campus.',
  },
  {
    propertyIndex: 4,
    name: 'Arthur Lemaire',
    email: 'arthur.lemaire@ulb.be',
    occupation: 'BA3 Informatique - ULB',
    status: 'pending' as const,
    daysAgo: 5,
    message: 'Developpeur en herbe, je cherche un kot avec bonne connexion internet!',
  },
  {
    propertyIndex: 4,
    name: 'Zoe Martin',
    email: 'zoe.martin@sciencespo.fr',
    occupation: 'Erasmus - Sciences Po Paris',
    status: 'pending' as const,
    daysAgo: 6,
    message: 'Etudiante Erasmus de Paris pour le semestre. Je cherche une colocation sympa.',
  },
  {
    propertyIndex: 4,
    name: 'Noah Hermans',
    email: 'noah.hermans@gmail.com',
    occupation: 'BA1 Droit - ULB',
    status: 'pending' as const,
    daysAgo: 8,
    message: 'Premiere annee a l\'ULB, je quitte le domicile familial a Namur.',
  },
];

// ============================================================================
// MAINTENANCE TICKETS
// ============================================================================

const MAINTENANCE_TICKETS = [
  // Villa Clos des Erables - Minor issues (star property)
  { propertyIndex: 0, title: 'Ampoule grillee - couloir 2eme etage', category: 'electrical', priority: 'low', status: 'resolved', daysAgo: 45, resolutionDays: 2, cost: 15 },
  { propertyIndex: 0, title: 'Robinet cuisine qui goutte', category: 'plumbing', priority: 'medium', status: 'resolved', daysAgo: 30, resolutionDays: 3, cost: 85 },
  { propertyIndex: 0, title: 'Porte garage - telecommande HS', category: 'other', priority: 'low', status: 'resolved', daysAgo: 20, resolutionDays: 5, cost: 45 },

  // Maison Parvis - Issues (attention property)
  { propertyIndex: 1, title: 'Chaudiere - Plus d\'eau chaude', category: 'heating', priority: 'high', status: 'open', daysAgo: 2, resolutionDays: null, cost: null },
  { propertyIndex: 1, title: 'Infiltration toiture - chambre 3', category: 'plumbing', priority: 'high', status: 'in_progress', daysAgo: 8, resolutionDays: null, cost: 350 },
  { propertyIndex: 1, title: 'Serrure porte entree grippee', category: 'other', priority: 'medium', status: 'resolved', daysAgo: 60, resolutionDays: 1, cost: 120 },
  { propertyIndex: 1, title: 'Prise electrique chambre 2 ne fonctionne plus', category: 'electrical', priority: 'medium', status: 'resolved', daysAgo: 40, resolutionDays: 2, cost: 75 },
  { propertyIndex: 1, title: 'Fuite sous evier cuisine', category: 'plumbing', priority: 'medium', status: 'resolved', daysAgo: 90, resolutionDays: 1, cost: 95 },

  // Appartement Flagey - Stable
  { propertyIndex: 2, title: 'Interphone ne fonctionne plus', category: 'electrical', priority: 'low', status: 'resolved', daysAgo: 120, resolutionDays: 7, cost: 180 },
  { propertyIndex: 2, title: 'Joint fenetre salon a remplacer', category: 'other', priority: 'low', status: 'resolved', daysAgo: 80, resolutionDays: 3, cost: 60 },

  // Studio Schuman - Minimal
  { propertyIndex: 3, title: 'Climatisation - Entretien annuel', category: 'heating', priority: 'low', status: 'resolved', daysAgo: 150, resolutionDays: 1, cost: 120 },

  // Kot ULB - Student wear & tear
  { propertyIndex: 4, title: 'Machine a laver fait du bruit', category: 'appliance', priority: 'medium', status: 'in_progress', daysAgo: 5, resolutionDays: null, cost: null },
  { propertyIndex: 4, title: 'Tache humidite salle de bain', category: 'plumbing', priority: 'low', status: 'open', daysAgo: 3, resolutionDays: null, cost: null },
  { propertyIndex: 4, title: 'Plaque de cuisson - 1 feu HS', category: 'appliance', priority: 'medium', status: 'resolved', daysAgo: 35, resolutionDays: 4, cost: 150 },
  { propertyIndex: 4, title: 'Volet chambre 1 bloque', category: 'other', priority: 'low', status: 'resolved', daysAgo: 60, resolutionDays: 2, cost: 90 },
];

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function seedMarcVerbeke() {
  console.log('');
  console.log('========================================================');
  console.log('   MARC VERBEKE - Owner Persona Seed');
  console.log('   Brussels Real Estate Portfolio');
  console.log('========================================================');
  console.log('');

  const now = new Date();

  // 1. Find target user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name')
    .eq('email', TARGET_EMAIL)
    .single();

  if (userError || !user) {
    console.error(`User not found: ${TARGET_EMAIL}`);
    process.exit(1);
  }

  console.log(`Found user: ${user.email}`);
  const userId = user.id;

  // 2. Clean existing data
  console.log('\nCleaning existing data...');
  const { data: existingProps } = await supabase
    .from('properties')
    .select('id')
    .eq('owner_id', userId);

  if (existingProps && existingProps.length > 0) {
    const propIds = existingProps.map(p => p.id);
    await supabase.from('applications').delete().in('property_id', propIds);
    await supabase.from('rent_payments').delete().in('property_id', propIds);
    await supabase.from('maintenance_requests').delete().in('property_id', propIds);
    await supabase.from('property_residents').delete().in('property_id', propIds);
    await supabase.from('properties').delete().eq('owner_id', userId);
    console.log(`   Deleted ${existingProps.length} existing properties`);
  }

  // 3. Create properties
  console.log('\nCreating properties...');
  const propertyIds: string[] = [];

  for (const prop of PROPERTIES) {
    propertyIds.push(prop.id);
    const publishedAt = subMonths(now, prop.monthsOwned);

    const { error } = await supabase.from('properties').insert({
      id: prop.id,
      owner_id: userId,
      title: prop.title,
      description: prop.description,
      property_type: prop.property_type,
      address: prop.address,
      city: prop.city,
      neighborhood: prop.neighborhood,
      postal_code: prop.postal_code,
      country: 'Belgium',
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      surface_area: prop.surface_area,
      furnished: prop.furnished,
      monthly_rent: prop.monthly_rent / prop.bedrooms, // Per room for display
      charges: prop.charges,
      deposit: prop.deposit,
      amenities: prop.amenities,
      images: prop.images,
      main_image: prop.images[0],
      status: 'published',
      is_available: prop.occupancy < prop.bedrooms,
      created_at: publishedAt.toISOString(),
      published_at: publishedAt.toISOString(),
    });

    if (error) {
      console.error(`   Error ${prop.title}: ${error.message}`);
    } else {
      const occupancyPct = Math.round((prop.occupancy / prop.bedrooms) * 100);
      console.log(`   ${prop.title} - ${prop.city} (${occupancyPct}% occupe)`);
    }
  }

  // 4. Create residents
  console.log('\nCreating residents...');
  const residentIds: string[] = [];

  for (const res of RESIDENTS) {
    const residentId = uuidv4();
    residentIds.push(residentId);
    const moveInDate = subMonths(now, res.monthsIn);

    const { error } = await supabase.from('property_residents').insert({
      id: residentId,
      property_id: propertyIds[res.propertyIndex],
      first_name: res.firstName,
      last_name: res.lastName,
      age: res.age,
      gender: res.gender,
      occupation: res.occupation,
      bio: `${res.occupation}`,
      photo_url: res.photo,
      interests: ['Sport', 'Culture', 'Voyages'],
      languages: ['Francais', 'Anglais'],
      is_smoker: false,
      has_pets: false,
      cleanliness_level: 8,
      noise_tolerance: 6,
      social_preference: 7,
      move_in_date: format(moveInDate, 'yyyy-MM-dd'),
      lease_duration_months: res.propertyIndex === 4 ? 10 : 12, // Students = 10 months
      created_at: subDays(moveInDate, 14).toISOString(),
    });

    if (error) {
      console.error(`   Error ${res.firstName}: ${error.message}`);
    } else {
      const statusIcon = res.paymentStatus === 'paid' ? 'OK' : res.paymentStatus === 'overdue' ? 'RETARD' : 'PENDING';
      console.log(`   ${res.firstName} ${res.lastName} - ${PROPERTIES[res.propertyIndex].title.split(' ')[0]} [${statusIcon}]`);
    }
  }

  // 5. Create maintenance tickets
  console.log('\nCreating maintenance tickets...');
  let openCount = 0, inProgressCount = 0, resolvedCount = 0;

  for (const ticket of MAINTENANCE_TICKETS) {
    const createdAt = subDays(now, ticket.daysAgo);
    const resolvedAt = ticket.status === 'resolved' && ticket.resolutionDays
      ? addDays(createdAt, ticket.resolutionDays)
      : null;

    const { error } = await supabase.from('maintenance_requests').insert({
      id: uuidv4(),
      property_id: propertyIds[ticket.propertyIndex],
      created_by: userId,
      title: ticket.title,
      description: `Demande: ${ticket.title}`,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      estimated_cost: ticket.cost ? ticket.cost * 0.9 : null,
      actual_cost: ticket.cost,
      assigned_to: ticket.status !== 'open' ? 'Maintenance Pro SPRL' : null,
      resolved_at: resolvedAt?.toISOString() || null,
      created_at: createdAt.toISOString(),
      updated_at: (resolvedAt || now).toISOString(),
    });

    if (!error) {
      if (ticket.status === 'open') openCount++;
      else if (ticket.status === 'in_progress') inProgressCount++;
      else resolvedCount++;
    }
  }
  console.log(`   Open: ${openCount} | In Progress: ${inProgressCount} | Resolved: ${resolvedCount}`);

  // 6. Create applications
  console.log('\nCreating applications...');
  let appCount = 0;

  for (const app of APPLICATIONS) {
    const { error } = await supabase.from('applications').insert({
      id: uuidv4(),
      property_id: propertyIds[app.propertyIndex],
      applicant_id: uuidv4(), // Fake ID
      applicant_name: app.name,
      applicant_email: app.email,
      occupation: app.occupation,
      status: app.status,
      message: app.message,
      desired_move_in_date: format(addDays(now, 30), 'yyyy-MM-dd'),
      lease_duration_months: app.propertyIndex === 4 ? 10 : 12,
      created_at: subDays(now, app.daysAgo).toISOString(),
    });

    if (!error) {
      appCount++;
      const icon = app.status === 'reviewing' ? 'REVIEW' : 'PENDING';
      console.log(`   ${app.name} -> ${PROPERTIES[app.propertyIndex].title.split(' ')[0]} [${icon}]`);
    }
  }

  // 7. Summary
  console.log('\n========================================================');
  console.log('   SEED COMPLETE - Marc Verbeke Portfolio');
  console.log('========================================================\n');

  console.log('PORTFOLIO:');
  let totalRent = 0;
  let totalOccupied = 0;
  let totalRooms = 0;

  PROPERTIES.forEach((p, i) => {
    const occupiedRent = p.occupancy * (p.monthly_rent / p.bedrooms);
    totalRent += occupiedRent;
    totalOccupied += p.occupancy;
    totalRooms += p.bedrooms;
    console.log(`   ${i + 1}. ${p.title}`);
    console.log(`      ${p.city} | ${p.occupancy}/${p.bedrooms} | ${Math.round(occupiedRent)} EUR/mois`);
  });

  console.log('\nKPIs:');
  console.log(`   Revenus mensuels:    ${Math.round(totalRent).toLocaleString()} EUR`);
  console.log(`   Taux occupation:     ${Math.round((totalOccupied / totalRooms) * 100)}%`);
  console.log(`   Candidatures:        ${appCount}`);
  console.log(`   Tickets ouverts:     ${openCount + inProgressCount}`);

  console.log('\nDASHBOARD:');
  console.log('   https://easyco-onboarding.vercel.app/dashboard/owner/gestion');
  console.log('   https://easyco-onboarding.vercel.app/dashboard/owner/finance');
  console.log('   https://easyco-onboarding.vercel.app/dashboard/owner/portfolio');
  console.log('');
}

// Run
seedMarcVerbeke().catch(console.error);
