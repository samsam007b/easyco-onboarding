/**
 * MARKETING SEED SCRIPT - Complete Owner Dashboard Demo Data
 * ============================================================
 * Creates realistic data for marketing screenshots/videos
 *
 * Run with: npx tsx scripts/seed-marketing-complete.ts
 *
 * Target: baudonsamuel@gmail.com
 *
 * STRATEGY: 3 properties with distinct profiles
 *
 * 1. Villa Harmony (Star Performer)
 *    - 5/6 rooms occupied, 100% payment rate
 *    - Health: 92% | No urgent issues
 *
 * 2. Appartement Flagey (Normal)
 *    - 2/2 rooms occupied, 1 pending payment
 *    - Health: 78% | 1 ticket in progress
 *
 * 3. Maison Saint-Gilles (Needs Attention)
 *    - 3/4 rooms occupied, 1 overdue payment
 *    - Health: 58% | 2 urgent tickets | Applications pending
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  subMonths, subDays, addMonths, addDays,
  format, startOfMonth, differenceInDays
} from 'date-fns';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TARGET_EMAIL = 'baudonsamuel@gmail.com';

// ============================================================================
// DATA DEFINITIONS
// ============================================================================

const PROPERTIES = [
  {
    id: uuidv4(),
    title: 'Villa Harmony - Coliving Premium',
    description: `Magnifique villa de 320m² transformée en espace de coliving haut de gamme à Uccle. 6 chambres spacieuses, 3 salles de bain modernes, grand jardin avec terrasse.`,
    property_type: 'coliving',
    address: 'Avenue Winston Churchill 145',
    city: 'Uccle',
    neighborhood: 'Churchill',
    postal_code: '1180',
    bedrooms: 6,
    bathrooms: 3,
    surface_area: 320,
    furnished: true,
    monthly_rent: 850,
    charges: 180,
    deposit: 1700,
    amenities: ['wifi', 'garden', 'parking', 'laundry', 'dishwasher', 'gym'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    ],
    // Marketing profile
    occupancy: 5, // 5/6 rooms
    profile: 'star', // Everything is great
    monthsOwned: 18,
  },
  {
    id: uuidv4(),
    title: 'Appartement Standing Flagey',
    description: `Superbe appartement de 95m² entièrement rénové au cœur d'Ixelles, à 2 minutes de la Place Flagey.`,
    property_type: 'apartment',
    address: 'Rue Malibran 78',
    city: 'Ixelles',
    neighborhood: 'Flagey',
    postal_code: '1050',
    bedrooms: 2,
    bathrooms: 1,
    surface_area: 95,
    furnished: true,
    monthly_rent: 1450,
    charges: 150,
    deposit: 2900,
    amenities: ['wifi', 'elevator', 'balcony', 'dishwasher'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1e741c86a7?w=800',
    ],
    occupancy: 2, // 2/2 rooms - full
    profile: 'normal',
    monthsOwned: 14,
  },
  {
    id: uuidv4(),
    title: 'Maison de Maître Saint-Gilles',
    description: `Charmante maison bruxelloise typique de 180m² répartie sur 3 niveaux. Architecture préservée avec éléments d'époque.`,
    property_type: 'house',
    address: 'Rue de la Victoire 56',
    city: 'Saint-Gilles',
    neighborhood: 'Parvis',
    postal_code: '1060',
    bedrooms: 4,
    bathrooms: 2,
    surface_area: 180,
    furnished: false,
    monthly_rent: 2200,
    charges: 200,
    deposit: 4400,
    amenities: ['wifi', 'garden', 'laundry', 'cellar', 'fireplace'],
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    ],
    occupancy: 3, // 3/4 rooms - 1 vacant
    profile: 'attention', // Has issues
    monthsOwned: 10,
  },
];

// Residents with realistic profiles
const RESIDENTS = [
  // Villa Harmony (5 residents)
  { firstName: 'Emma', lastName: 'Van Den Berg', age: 28, occupation: 'UX Designer chez Spotify', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', propertyIndex: 0, monthsIn: 14, rent: 850, paymentStatus: 'paid' },
  { firstName: 'Lucas', lastName: 'Dubois', age: 26, occupation: 'Data Scientist chez BNP', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', propertyIndex: 0, monthsIn: 12, rent: 850, paymentStatus: 'paid' },
  { firstName: 'Sofia', lastName: 'Martinez', age: 30, occupation: 'Avocate - Droit européen', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', propertyIndex: 0, monthsIn: 10, rent: 850, paymentStatus: 'paid' },
  { firstName: 'Thomas', lastName: 'Janssen', age: 27, occupation: 'Développeur Full-Stack', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', propertyIndex: 0, monthsIn: 8, rent: 850, paymentStatus: 'paid' },
  { firstName: 'Julie', lastName: 'Moreau', age: 25, occupation: 'Consultante McKinsey', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', propertyIndex: 0, monthsIn: 4, rent: 850, paymentStatus: 'paid' },

  // Appartement Flagey (2 residents)
  { firstName: 'Alexandre', lastName: 'Petit', age: 32, occupation: 'Architecte associé', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', propertyIndex: 1, monthsIn: 11, rent: 725, paymentStatus: 'pending' }, // Pending this month
  { firstName: 'Camille', lastName: 'Laurent', age: 29, occupation: 'Journaliste - Le Soir', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', propertyIndex: 1, monthsIn: 11, rent: 725, paymentStatus: 'paid' },

  // Maison Saint-Gilles (3 residents, 1 vacant)
  { firstName: 'Pierre', lastName: 'Fontaine', age: 34, occupation: 'Médecin généraliste', photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400', propertyIndex: 2, monthsIn: 8, rent: 550, paymentStatus: 'paid' },
  { firstName: 'Marie', lastName: 'Lecomte', age: 31, occupation: 'Professeure - École européenne', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', propertyIndex: 2, monthsIn: 8, rent: 550, paymentStatus: 'overdue' }, // 15 days overdue!
  { firstName: 'Antoine', lastName: 'Bernard', age: 28, occupation: 'Ingénieur civil', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', propertyIndex: 2, monthsIn: 5, rent: 550, paymentStatus: 'paid' },
];

// Maintenance tickets - varied statuses and priorities
const MAINTENANCE_TICKETS = [
  // Villa Harmony - All resolved (Star property)
  { title: 'Entretien chaudière annuel', category: 'heating', priority: 'medium', status: 'resolved', cost: 180, propertyIndex: 0, daysAgo: 45, resolutionDays: 1 },
  { title: 'Remplacement ampoules LED', category: 'electrical', priority: 'low', status: 'resolved', cost: 65, propertyIndex: 0, daysAgo: 30, resolutionDays: 2 },
  { title: 'Nettoyage gouttières', category: 'cleaning', priority: 'low', status: 'resolved', cost: 120, propertyIndex: 0, daysAgo: 60, resolutionDays: 3 },

  // Appartement Flagey - 1 in progress
  { title: 'Réparation interphone', category: 'electrical', priority: 'medium', status: 'in_progress', cost: null, propertyIndex: 1, daysAgo: 5, resolutionDays: null },
  { title: 'Fuite robinet cuisine', category: 'plumbing', priority: 'medium', status: 'resolved', cost: 95, propertyIndex: 1, daysAgo: 40, resolutionDays: 2 },
  { title: 'Serrure porte balcon', category: 'other', priority: 'low', status: 'resolved', cost: 150, propertyIndex: 1, daysAgo: 90, resolutionDays: 4 },

  // Maison Saint-Gilles - 2 urgent, 1 in progress, some resolved
  { title: 'URGENT: Fuite d\'eau sous-sol', category: 'plumbing', priority: 'emergency', status: 'open', cost: null, propertyIndex: 2, daysAgo: 1, resolutionDays: null },
  { title: 'Panne chauffage chambre 2', category: 'heating', priority: 'high', status: 'open', cost: null, propertyIndex: 2, daysAgo: 3, resolutionDays: null },
  { title: 'Fissure mur salon', category: 'structural', priority: 'medium', status: 'in_progress', cost: null, propertyIndex: 2, daysAgo: 12, resolutionDays: null },
  { title: 'Porte jardin grince', category: 'other', priority: 'low', status: 'open', cost: null, propertyIndex: 2, daysAgo: 7, resolutionDays: null },
  { title: 'Panne chauffe-eau', category: 'plumbing', priority: 'high', status: 'resolved', cost: 450, propertyIndex: 2, daysAgo: 60, resolutionDays: 2 },
  { title: 'Remplacement serrure entrée', category: 'other', priority: 'medium', status: 'resolved', cost: 220, propertyIndex: 2, daysAgo: 100, resolutionDays: 1 },

  // Additional resolved tickets for history
  { title: 'Débouchage évier sdb', category: 'plumbing', priority: 'medium', status: 'resolved', cost: 85, propertyIndex: 0, daysAgo: 120, resolutionDays: 1 },
  { title: 'Réparation volet ch.3', category: 'structural', priority: 'low', status: 'resolved', cost: 175, propertyIndex: 0, daysAgo: 180, resolutionDays: 5 },
  { title: 'Ramonage cheminée', category: 'heating', priority: 'medium', status: 'resolved', cost: 140, propertyIndex: 2, daysAgo: 150, resolutionDays: 1 },
];

// Applications for the vacant room in Saint-Gilles
const APPLICATIONS = [
  { name: 'Sarah Dupont', email: 'sarah.dupont@gmail.com', occupation: 'Marketing Manager', status: 'reviewing', daysAgo: 2 },
  { name: 'Marc Lefebvre', email: 'marc.lefebvre@outlook.com', occupation: 'Ingénieur logiciel', status: 'pending', daysAgo: 4 },
  { name: 'Léa Martin', email: 'lea.martin@gmail.com', occupation: 'Graphiste freelance', status: 'pending', daysAgo: 5 },
  { name: 'Nicolas Rousseau', email: 'n.rousseau@yahoo.fr', occupation: 'Chef de projet', status: 'pending', daysAgo: 7 },
  { name: 'Émilie Blanc', email: 'emilie.b@hotmail.com', occupation: 'Infirmière', status: 'rejected', daysAgo: 10 },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getUserId(email: string): Promise<string | null> {
  const { data } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('email', email)
    .single();
  return data?.user_id || null;
}

async function cleanExistingData(userId: string) {
  console.log('🧹 Cleaning existing data...');

  const { data: props } = await supabase
    .from('properties')
    .select('id')
    .eq('owner_id', userId);

  if (props && props.length > 0) {
    const ids = props.map(p => p.id);

    // Delete in order (foreign keys)
    await supabase.from('applications').delete().in('property_id', ids);
    await supabase.from('maintenance_requests').delete().in('property_id', ids);
    await supabase.from('property_residents').delete().in('property_id', ids);
    await supabase.from('rent_payments').delete().in('property_id', ids);
    await supabase.from('property_members').delete().in('property_id', ids);
    await supabase.from('properties').delete().in('id', ids);

    console.log(`   Deleted ${props.length} existing properties and related data`);
  }
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function seedMarketingData() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🎯 IZZICO MARKETING SEED - Complete Owner Dashboard Demo');
  console.log('═══════════════════════════════════════════════════════════\n');

  // 1. Get user
  const userId = await getUserId(TARGET_EMAIL);
  if (!userId) {
    console.error(`❌ User not found: ${TARGET_EMAIL}`);
    process.exit(1);
  }
  console.log(`✅ Found user: ${TARGET_EMAIL}\n`);

  // 2. Clean existing data
  await cleanExistingData(userId);

  // 3. Create properties
  console.log('\n🏠 Creating properties...');
  const now = new Date();
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
      monthly_rent: prop.monthly_rent,
      charges: prop.charges,
      deposit: prop.deposit,
      amenities: prop.amenities,
      images: prop.images,
      main_image: prop.images[0],
      status: 'published',
      is_available: prop.occupancy < prop.bedrooms,
      smoking_allowed: false,
      pets_allowed: prop.property_type !== 'apartment',
      couples_allowed: true,
      minimum_stay_months: prop.property_type === 'coliving' ? 6 : 12,
      published_at: publishedAt.toISOString(),
      created_at: subDays(publishedAt, 7).toISOString(),
    });

    if (error) {
      console.error(`   ❌ ${prop.title}: ${error.message}`);
    } else {
      const occupancyPct = Math.round((prop.occupancy / prop.bedrooms) * 100);
      console.log(`   ✅ ${prop.title} (${prop.city}) - ${occupancyPct}% occupé`);
    }
  }

  // 4. Create residents
  console.log('\n👥 Creating residents...');
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
      gender: res.age > 0 ? (res.firstName.endsWith('a') || res.firstName.endsWith('e') || res.firstName === 'Marie' || res.firstName === 'Julie' || res.firstName === 'Sofia' || res.firstName === 'Emma' || res.firstName === 'Camille' ? 'Femme' : 'Homme') : null,
      occupation: res.occupation,
      bio: `Professionnel(le) dynamique cherchant un cadre de vie agréable.`,
      photo_url: res.photo,
      interests: ['Sport', 'Culture', 'Voyages'],
      languages: ['Français', 'Anglais'],
      is_smoker: false,
      has_pets: Math.random() > 0.8,
      cleanliness_level: 7 + Math.floor(Math.random() * 3),
      noise_tolerance: 5 + Math.floor(Math.random() * 4),
      social_preference: 6 + Math.floor(Math.random() * 4),
      move_in_date: format(moveInDate, 'yyyy-MM-dd'),
      lease_duration_months: 12,
      created_at: subDays(moveInDate, 14).toISOString(),
    });

    if (error) {
      console.error(`   ❌ ${res.firstName} ${res.lastName}: ${error.message}`);
    } else {
      const propName = PROPERTIES[res.propertyIndex].title.split(' - ')[0];
      const statusIcon = res.paymentStatus === 'paid' ? '💚' : res.paymentStatus === 'pending' ? '🟡' : '🔴';
      console.log(`   ${statusIcon} ${res.firstName} ${res.lastName} → ${propName}`);
    }
  }

  // 5. Create maintenance tickets
  console.log('\n🔧 Creating maintenance tickets...');
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
      description: `Demande de maintenance: ${ticket.title}`,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      estimated_cost: ticket.cost ? ticket.cost * 0.9 : null,
      actual_cost: ticket.cost,
      assigned_to: ticket.status !== 'open' ? 'Entreprise Maintenance Pro' : null,
      resolved_at: resolvedAt?.toISOString() || null,
      created_at: createdAt.toISOString(),
      updated_at: (resolvedAt || now).toISOString(),
    });

    if (error) {
      console.error(`   ❌ ${ticket.title}: ${error.message}`);
    } else {
      if (ticket.status === 'open') openCount++;
      else if (ticket.status === 'in_progress') inProgressCount++;
      else resolvedCount++;
    }
  }
  console.log(`   📊 Open: ${openCount} | In Progress: ${inProgressCount} | Resolved: ${resolvedCount}`);

  // 6. Create applications for vacant room
  console.log('\n📝 Creating applications...');
  const vacantPropertyId = propertyIds[2]; // Maison Saint-Gilles

  for (const app of APPLICATIONS) {
    const { error } = await supabase.from('applications').insert({
      id: uuidv4(),
      property_id: vacantPropertyId,
      applicant_id: userId, // Use owner as placeholder (normally would be different users)
      applicant_name: app.name,
      applicant_email: app.email,
      occupation: app.occupation,
      status: app.status,
      message: `Bonjour, je suis très intéressé(e) par votre bien. ${app.occupation} depuis 3 ans.`,
      desired_move_in_date: format(addDays(now, 30), 'yyyy-MM-dd'),
      lease_duration_months: 12,
      created_at: subDays(now, app.daysAgo).toISOString(),
    });

    if (error) {
      console.error(`   ❌ ${app.name}: ${error.message}`);
    } else {
      const statusIcon = app.status === 'reviewing' ? '👀' : app.status === 'pending' ? '⏳' : '❌';
      console.log(`   ${statusIcon} ${app.name} - ${app.status}`);
    }
  }

  // 7. Create rent payments (12 months history)
  console.log('\n💰 Creating rent payment history...');
  let paymentCount = 0;
  let paidCount = 0;
  let pendingCount = 0;
  let overdueCount = 0;

  for (const res of RESIDENTS) {
    const propertyId = propertyIds[res.propertyIndex];

    // Generate payments for each month the resident has been there
    for (let monthsAgo = res.monthsIn; monthsAgo >= 0; monthsAgo--) {
      const paymentMonth = subMonths(now, monthsAgo);
      const monthStart = startOfMonth(paymentMonth);
      const dueDate = addDays(monthStart, 4); // Due on 5th

      // Determine status based on resident's payment profile
      let status = 'paid';
      let paidAt: Date | null = addDays(dueDate, Math.floor(Math.random() * 3) - 1); // Paid 1 day before to 2 days after

      if (monthsAgo === 0) {
        // Current month
        if (res.paymentStatus === 'paid') {
          status = 'paid';
          paidAt = subDays(now, Math.floor(Math.random() * 5));
        } else if (res.paymentStatus === 'pending') {
          status = 'pending';
          paidAt = null;
        } else if (res.paymentStatus === 'overdue') {
          status = 'overdue';
          paidAt = null;
        }
      }

      const { error } = await supabase.from('rent_payments').insert({
        id: uuidv4(),
        property_id: propertyId,
        user_id: userId, // Use owner as placeholder
        month: format(monthStart, 'yyyy-MM-dd'),
        amount: res.rent,
        status,
        due_date: format(dueDate, 'yyyy-MM-dd'),
        paid_at: paidAt?.toISOString() || null,
        created_at: subDays(dueDate, 5).toISOString(),
      });

      if (!error) {
        paymentCount++;
        if (status === 'paid') paidCount++;
        else if (status === 'pending') pendingCount++;
        else if (status === 'overdue') overdueCount++;
      }
    }
  }
  console.log(`   📊 Total: ${paymentCount} | Paid: ${paidCount} | Pending: ${pendingCount} | Overdue: ${overdueCount}`);

  // 8. Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('✨ MARKETING DATA SEEDING COMPLETE!\n');

  console.log('📊 DASHBOARD PREVIEW:\n');

  console.log('💰 Revenus mensuels:');
  console.log('   • Villa Harmony:    5 × 850€  = 4,250€');
  console.log('   • Appt Flagey:      2 × 725€  = 1,450€');
  console.log('   • Maison St-Gilles: 3 × 550€  = 1,650€');
  console.log('   ─────────────────────────────────────');
  console.log('   TOTAL ATTENDU:                 7,350€/mois\n');

  console.log('🏥 Health Scores:');
  console.log('   • Villa Harmony:    92% ✅ (Star performer)');
  console.log('   • Appt Flagey:      78% 🟡 (Normal)');
  console.log('   • Maison St-Gilles: 58% 🔴 (Needs attention)\n');

  console.log('🎯 Actions urgentes visibles:');
  console.log('   • 1 loyer impayé (15 jours) - Marie Lecomte');
  console.log('   • 2 tickets urgents (fuite + chauffage)');
  console.log('   • 1 chambre vacante avec 4 candidatures\n');

  console.log('🔗 Voir le dashboard:');
  console.log('   https://easyco-onboarding.vercel.app/dashboard/owner/gestion');
  console.log('   https://easyco-onboarding.vercel.app/dashboard/owner/finance');
  console.log('   https://easyco-onboarding.vercel.app/dashboard/owner/portfolio');
  console.log('═══════════════════════════════════════════════════════════\n');
}

// Run
seedMarketingData().catch(console.error);
