/**
 * Script to seed database with sample rooms including aesthetic attributes
 * Run with: npx tsx scripts/seed-aesthetic-rooms.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample data templates
const sampleRooms = [
  {
    property: {
      title: 'Modern Coliving Space in Brussels City Center',
      city: 'Brussels',
      neighborhood: 'Ixelles',
      address: 'Avenue Louise 123',
      building_style: 'modern' as const,
      building_age_years: 5,
      renovation_quality: 'luxury' as const,
      common_areas_quality: 9,
      overall_cleanliness_rating: 9,
    },
    rooms: [
      {
        room_name: 'Sunny Master Room',
        price: 850,
        size_sqm: 22,
        description:
          'Spacious master bedroom with abundant natural light and modern minimalist design. Features floor-to-ceiling windows facing south.',
        aesthetics: {
          natural_light_rating: 10,
          sun_exposure: 'all_day' as const,
          sun_hours_per_day: 8,
          number_of_windows: 2,
          window_orientation: ['south', 'east'] as const,
          window_size: 'floor_to_ceiling' as const,
          has_curtains: true,
          heating_type: 'floor_heating' as const,
          heating_quality_rating: 9,
          has_individual_temperature_control: true,
          design_style: 'minimalist' as const,
          design_quality_rating: 9,
          aesthetic_appeal_rating: 10,
          furniture_style: 'ikea' as const,
          furniture_quality_rating: 8,
          wall_color: 'white',
          color_palette: ['#FFFFFF', '#F5F5F5', '#8B7355', '#2C5F4F'],
          room_atmosphere: 'bright' as const,
          flooring_type: 'hardwood' as const,
          ceiling_height_cm: 300,
          noise_insulation_rating: 8,
          air_quality_rating: 9,
          has_plants: true,
          has_artwork: true,
          has_mood_lighting: true,
        },
      },
      {
        room_name: 'Cozy Reading Nook',
        price: 750,
        size_sqm: 18,
        description:
          'Warm and inviting room with vintage furniture and afternoon sun. Perfect for book lovers.',
        aesthetics: {
          natural_light_rating: 7,
          sun_exposure: 'afternoon' as const,
          sun_hours_per_day: 4,
          number_of_windows: 1,
          window_orientation: ['west'] as const,
          heating_type: 'radiator' as const,
          heating_quality_rating: 7,
          design_style: 'vintage' as const,
          design_quality_rating: 8,
          aesthetic_appeal_rating: 8,
          furniture_style: 'vintage' as const,
          furniture_quality_rating: 7,
          room_atmosphere: 'cozy' as const,
          flooring_type: 'hardwood' as const,
          ceiling_height_cm: 280,
          has_plants: true,
          has_bookshelf: true,
        },
      },
    ],
  },
  {
    property: {
      title: 'Industrial Loft in Antwerp',
      city: 'Antwerp',
      neighborhood: 'Zuid',
      address: 'Waalsekaai 45',
      building_style: 'industrial' as const,
      building_age_years: 120,
      year_renovated: 2020,
      renovation_quality: 'full' as const,
      common_areas_quality: 8,
    },
    rooms: [
      {
        room_name: 'Loft Studio',
        price: 900,
        size_sqm: 35,
        description:
          'Open-plan industrial loft with exposed brick and high ceilings. Creative atmosphere with excellent natural light.',
        aesthetics: {
          natural_light_rating: 9,
          sun_exposure: 'morning' as const,
          sun_hours_per_day: 6,
          number_of_windows: 3,
          window_orientation: ['north', 'east'] as const,
          window_size: 'large' as const,
          heating_type: 'radiator' as const,
          heating_quality_rating: 7,
          design_style: 'industrial' as const,
          design_quality_rating: 9,
          aesthetic_appeal_rating: 9,
          furniture_style: 'mixed' as const,
          furniture_quality_rating: 8,
          wall_color: 'exposed brick',
          room_atmosphere: 'creative' as const,
          flooring_type: 'concrete' as const,
          ceiling_height_cm: 400,
          ceiling_type: 'exposed_beams' as const,
          noise_insulation_rating: 6,
          has_artwork: true,
          has_plants: true,
        },
      },
    ],
  },
  {
    property: {
      title: 'Scandinavian Apartment in Ghent',
      city: 'Ghent',
      neighborhood: 'Patershol',
      address: 'Oudburg 78',
      building_style: 'traditional' as const,
      building_age_years: 80,
      year_renovated: 2021,
      renovation_quality: 'full' as const,
      common_areas_quality: 8,
    },
    rooms: [
      {
        room_name: 'Nordic Dream',
        price: 780,
        size_sqm: 20,
        description:
          'Light and airy Scandinavian-style room with natural materials and calming color palette.',
        aesthetics: {
          natural_light_rating: 8,
          sun_exposure: 'morning' as const,
          sun_hours_per_day: 5,
          number_of_windows: 2,
          window_orientation: ['east', 'north'] as const,
          heating_type: 'floor_heating' as const,
          heating_quality_rating: 9,
          cooling_type: 'fan' as const,
          design_style: 'scandinavian' as const,
          design_quality_rating: 9,
          aesthetic_appeal_rating: 9,
          furniture_style: 'ikea' as const,
          furniture_quality_rating: 7,
          color_palette: ['#FFFFFF', '#E8E4E0', '#A89F91', '#8FA998'],
          room_atmosphere: 'calming' as const,
          flooring_type: 'laminate' as const,
          ceiling_height_cm: 270,
          noise_insulation_rating: 7,
          air_quality_rating: 8,
          ventilation_type: 'natural' as const,
          has_plants: true,
        },
      },
    ],
  },
  {
    property: {
      title: 'Bohemian Artist Studio in Liège',
      city: 'Liège',
      neighborhood: 'Outremeuse',
      address: 'Rue Roture 34',
      building_style: 'art_nouveau' as const,
      building_age_years: 110,
      renovation_quality: 'partial' as const,
    },
    rooms: [
      {
        room_name: 'Bohemian Paradise',
        price: 650,
        size_sqm: 25,
        description:
          'Eclectic room full of character with vintage furniture and colorful decor. Perfect for creative souls.',
        aesthetics: {
          natural_light_rating: 7,
          sun_exposure: 'variable' as const,
          sun_hours_per_day: 5,
          number_of_windows: 2,
          heating_type: 'radiator' as const,
          heating_quality_rating: 6,
          design_style: 'bohemian' as const,
          design_quality_rating: 7,
          aesthetic_appeal_rating: 8,
          furniture_style: 'vintage' as const,
          furniture_quality_rating: 6,
          color_palette: ['#D4A574', '#8B6F47', '#C44536', '#2E5266'],
          room_atmosphere: 'creative' as const,
          flooring_type: 'hardwood' as const,
          ceiling_height_cm: 320,
          has_plants: true,
          has_artwork: true,
        },
      },
    ],
  },
  {
    property: {
      title: 'Luxury Design Apartment in Waterloo',
      city: 'Waterloo',
      neighborhood: 'Center',
      address: 'Chaussée de Bruxelles 456',
      building_style: 'contemporary' as const,
      building_age_years: 3,
      renovation_quality: 'luxury' as const,
      common_areas_quality: 10,
    },
    rooms: [
      {
        room_name: 'Designer Suite',
        price: 1200,
        size_sqm: 30,
        description:
          'Ultra-modern designer room with smart home features, premium furniture, and exceptional finishes.',
        aesthetics: {
          natural_light_rating: 9,
          sun_exposure: 'all_day' as const,
          sun_hours_per_day: 7,
          number_of_windows: 3,
          window_orientation: ['south', 'west'] as const,
          window_size: 'large' as const,
          has_blinds: true,
          heating_type: 'floor_heating' as const,
          heating_quality_rating: 10,
          cooling_type: 'air_conditioning' as const,
          has_individual_temperature_control: true,
          design_style: 'contemporary' as const,
          design_quality_rating: 10,
          aesthetic_appeal_rating: 10,
          furniture_style: 'designer' as const,
          furniture_condition: 'new' as const,
          furniture_quality_rating: 10,
          color_palette: ['#2C2C2C', '#FFFFFF', '#D4AF37', '#1A4D2E'],
          room_atmosphere: 'luxurious' as const,
          flooring_type: 'marble' as const,
          ceiling_height_cm: 280,
          noise_insulation_rating: 10,
          is_soundproof: true,
          air_quality_rating: 10,
          has_air_purifier: true,
          ventilation_type: 'ac_system' as const,
          has_mood_lighting: true,
          has_smart_home_features: true,
        },
      },
    ],
  },
];

async function seedAestheticRooms() {
  console.log('🌟 Starting to seed aesthetic room data...\n');

  try {
    // Get owner ID from environment or try to find one
    let ownerId = process.env.OWNER_ID;

    if (!ownerId) {
      console.log('⚠️  No OWNER_ID provided, trying to find a user...\n');
      const { data: authUsers, error: userError } = await supabase.auth.admin.listUsers();

      if (userError || !authUsers || authUsers.users.length === 0) {
        console.error('❌ No users found. Please create a user first by running:');
        console.error('   npx tsx scripts/create-demo-owner.ts');
        return;
      }

      ownerId = authUsers.users[0].id;
    }

    console.log(`Using owner ID: ${ownerId}\n`);

    for (const sampleProperty of sampleRooms) {
      console.log(`📍 Creating property: ${sampleProperty.property.title}`);

      // Create property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          owner_id: ownerId,
          title: sampleProperty.property.title,
          description: `Beautiful ${sampleProperty.property.building_style} property in ${sampleProperty.property.neighborhood}`,
          property_type: 'coliving',
          city: sampleProperty.property.city,
          neighborhood: sampleProperty.property.neighborhood,
          address: sampleProperty.property.address,
          postal_code: '1000',
          country: 'Belgium',
          bedrooms: sampleProperty.rooms.length,
          bathrooms: Math.ceil(sampleProperty.rooms.length / 2),
          surface_area: sampleProperty.rooms.reduce((sum, r) => sum + r.size_sqm, 0),
          furnished: true,
          monthly_rent: Math.min(...sampleProperty.rooms.map((r) => r.price)),
          charges: 150,
          deposit: 1000,
          is_available: true,
          status: 'published',
          building_style: sampleProperty.property.building_style,
          building_age_years: sampleProperty.property.building_age_years,
          year_renovated: sampleProperty.property.year_renovated,
          renovation_quality: sampleProperty.property.renovation_quality,
          common_areas_quality: sampleProperty.property.common_areas_quality,
          overall_cleanliness_rating: sampleProperty.property.overall_cleanliness_rating,
          amenities: ['wifi', 'kitchen', 'laundry', 'heating'],
        })
        .select()
        .single();

      if (propertyError) {
        console.error(`❌ Error creating property: ${propertyError.message}`);
        continue;
      }

      console.log(`✅ Property created: ${property.id}`);

      // Create property costs
      const { error: costsError } = await supabase.from('property_costs').insert({
        property_id: property.id,
        utilities_total: 100,
        utilities_electricity: 40,
        utilities_water: 20,
        utilities_heating: 30,
        utilities_internet: 10,
        shared_living_total: 50,
        shared_living_cleaning_service: 30,
        shared_living_wifi: 20,
      });

      if (costsError) {
        console.error(`⚠️ Warning: Could not create property costs: ${costsError.message}`);
      }

      // Create rooms
      for (let i = 0; i < sampleProperty.rooms.length; i++) {
        const roomData = sampleProperty.rooms[i];
        console.log(`  🛏️  Creating room: ${roomData.room_name}`);

        const { data: room, error: roomError } = await supabase
          .from('property_rooms')
          .insert({
            property_id: property.id,
            room_number: i + 1,
            room_name: roomData.room_name,
            description: roomData.description,
            price: roomData.price,
            size_sqm: roomData.size_sqm,
            floor_number: Math.floor(Math.random() * 3) + 1,
            has_private_bathroom: Math.random() > 0.5,
            has_balcony: Math.random() > 0.7,
            has_desk: true,
            has_wardrobe: true,
            is_furnished: true,
            is_available: true,
            available_from: new Date().toISOString().split('T')[0],
          })
          .select()
          .single();

        if (roomError) {
          console.error(`  ❌ Error creating room: ${roomError.message}`);
          continue;
        }

        console.log(`  ✅ Room created: ${room.id}`);

        // Create aesthetic attributes
        const { error: aestheticsError } = await supabase
          .from('property_room_aesthetics')
          .insert({
            room_id: room.id,
            ...roomData.aesthetics,
          });

        if (aestheticsError) {
          console.error(
            `  ⚠️ Warning: Could not create aesthetics: ${aestheticsError.message}`
          );
        } else {
          console.log(`  ✨ Aesthetic attributes added`);
        }
      }

      console.log('');
    }

    console.log('🎉 Successfully seeded all aesthetic room data!');
    console.log(`\nCreated:`);
    console.log(`  - ${sampleRooms.length} properties`);
    console.log(`  - ${sampleRooms.reduce((sum, p) => sum + p.rooms.length, 0)} rooms with aesthetic data`);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the seed function
seedAestheticRooms()
  .then(() => {
    console.log('\n✅ Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
