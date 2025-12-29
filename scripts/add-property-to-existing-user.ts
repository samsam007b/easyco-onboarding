/**
 * Add a test property to an existing user account
 * Usage: npx tsx scripts/add-property-to-existing-user.ts <email>
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addPropertyToUser(email: string) {
  console.log(`🔍 Looking for user: ${email}\n`);

  // 1. Find user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('❌ Error listing users:', listError);
    process.exit(1);
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    console.error(`❌ User not found: ${email}`);
    console.log('\n💡 Available users:');
    users.forEach(u => console.log(`   - ${u.email}`));
    process.exit(1);
  }

  console.log(`✅ Found user: ${user.email} (${user.id})\n`);

  // 2. Check if user has a profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    console.log('⚠️  User has no profile. Creating one...');

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name || 'Samuel',
        last_name: user.user_metadata?.last_name || 'Baudon',
        user_type: 'owner',
        profile_status: 'complete',
        has_property: true,
        bio: 'Propriétaire de test avec propriété de démonstration',
        hosting_experience: 'experienced',
        owner_type: 'individual',
      });

    if (profileError) {
      console.error('❌ Error creating profile:', profileError);
      process.exit(1);
    }

    console.log('✅ Profile created\n');
  } else {
    console.log(`✅ Profile exists: ${profile.first_name} ${profile.last_name}\n`);
  }

  // 3. Check existing properties
  const { data: existingProps } = await supabase
    .from('properties')
    .select('id, title, city')
    .eq('owner_id', user.id);

  if (existingProps && existingProps.length > 0) {
    console.log(`ℹ️  User already has ${existingProps.length} property(ies):`);
    existingProps.forEach(p => console.log(`   - ${p.title} (${p.city})`));
    console.log('\n❓ Add another property? (y/n)');
    // For automation, we'll add it anyway
  }

  // 4. Create test property
  console.log('🏠 Creating test property...\n');

  const testProperty = {
    owner_id: user.id,
    title: 'Appartement de Test - Ixelles (Mon Compte)',
    description: `Ceci est une propriété de test créée automatiquement pour ${email}.

Belle appartement de 75m² au cœur d'Ixelles, idéal pour tester toutes les fonctionnalités de la plateforme Izzico.

Cette propriété a été créée pour vous permettre de :
- Tester le dashboard propriétaire
- Gérer les candidatures
- Modifier les informations de la propriété
- Publier/dépublier l'annonce
- Voir les statistiques de vues

Caractéristiques :
- 2 grandes chambres lumineuses
- Salon spacieux avec parquet
- Cuisine équipée moderne
- Salle de bain complète
- Proche transports (tram 81)`,
    property_type: 'apartment',
    address: 'Avenue Louise 123',
    city: 'Ixelles',
    neighborhood: 'Louise',
    postal_code: '1050',
    country: 'Belgium',
    latitude: 50.8272,
    longitude: 4.3719,
    bedrooms: 2,
    bathrooms: 1,
    surface_area: 75,
    floor_number: 2,
    furnished: true,
    monthly_rent: 1100,
    charges: 120,
    deposit: 2200,
    available_from: new Date().toISOString().split('T')[0],
    minimum_stay_months: 6,
    amenities: ['wifi', 'elevator', 'balcony', 'washing_machine', 'heating', 'furnished'],
    smoking_allowed: false,
    pets_allowed: false,
    couples_allowed: true,
    images: [
      'https://images.unsplash.com/photo-1502672260066-6bc36a8baf37?w=800',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800',
    ],
    main_image: 'https://images.unsplash.com/photo-1502672260066-6bc36a8baf37?w=800',
    status: 'published',
    is_available: true,
  };

  const { data: newProperty, error: propertyError } = await supabase
    .from('properties')
    .insert(testProperty)
    .select()
    .single();

  if (propertyError) {
    console.error('❌ Error creating property:', propertyError);
    process.exit(1);
  }

  console.log('✅ Property created successfully!\n');
  console.log('📋 Details:');
  console.log(`   ID: ${newProperty.id}`);
  console.log(`   Title: ${newProperty.title}`);
  console.log(`   City: ${newProperty.city}`);
  console.log(`   Rent: €${newProperty.monthly_rent}/month`);
  console.log(`   Status: ${newProperty.status}`);
  console.log('\n🎉 You can now see this property in your owner dashboard!\n');
  console.log('🔗 Go to: http://localhost:3000/dashboard/owner/properties\n');
}

// Get email from command line args
const email = process.argv[2];

if (!email) {
  console.error('❌ Usage: npx tsx scripts/add-property-to-existing-user.ts <email>');
  console.log('\nExample:');
  console.log('  npx tsx scripts/add-property-to-existing-user.ts samuel@example.com');
  process.exit(1);
}

addPropertyToUser(email);
