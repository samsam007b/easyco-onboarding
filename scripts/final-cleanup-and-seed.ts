import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Properties to DELETE (the 5 "aesthetic" ones)
const PROPERTIES_TO_DELETE = [
  '8778b466-b613-4bf3-a677-6e64d4896e75', // Industrial Loft in Antwerp
  '3ec26dab-aec7-4084-944a-1afb72c33144', // Modern Coliving Space in Brussels
  '6b4d7c6d-0845-4d95-b201-ea210afc4717', // Scandinavian Apartment in Ghent
  'b582f626-10ac-44e9-b5ad-dcf48f6354c9', // Bohemian Artist Studio in Liège
  'f5e58c00-c848-494d-b67e-cb231c150bde', // Luxury Design Apartment in Waterloo
];

// Properties to KEEP (the 5 original ones)
const PROPERTIES_TO_KEEP = [
  '085f477f-6d5a-4e55-a2b8-683fddee7b89', // Appartement 2 Chambres - Ixelles Flagey
  '1433f47f-c622-4842-bfe4-dffa929e869f', // Studio Schaerbeek - Quartier Diamant
  '99e4b0c7-5e19-46c0-b2e3-ed2e92d1857f', // Coliving Forest - Maison Communautaire
  '31c31752-15ae-4c5b-afb5-8157b99c4bfa', // Appartement 3 Chambres - Woluwe Standing
  'bc33c41c-48a1-48c4-b635-9ece6a598fa1', // Maison 4 Chambres - Saint-Gilles Parvis
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRoomAesthetics(roomId: string, roomNumber: number) {
  const sunExposures = ['morning', 'afternoon', 'evening', 'all_day', 'variable'];
  const windowOrientations = ['north', 'south', 'east', 'west'];
  const heatingTypes = ['central_heating', 'radiator', 'floor_heating', 'electric_heater'];
  const designStyles = ['modern', 'contemporary', 'minimalist', 'scandinavian', 'industrial', 'bohemian', 'vintage', 'traditional'];
  const furnitureStyles = ['ikea', 'designer', 'vintage', 'mixed', 'minimalist'];
  const furnitureConditions = ['new', 'excellent', 'good'];
  const roomAtmospheres = ['cozy', 'bright', 'airy', 'warm', 'cool', 'calming', 'creative'];
  const flooringTypes = ['hardwood', 'laminate', 'tile', 'carpet', 'parquet'];

  return {
    room_id: roomId,

    // Natural Light & Sun
    natural_light_rating: getRandomInt(6, 10),
    sun_exposure: getRandomElement(sunExposures),
    sun_hours_per_day: getRandomInt(3, 8),
    number_of_windows: getRandomInt(1, 3),
    window_orientation: [getRandomElement(windowOrientations)], // Array of orientations
    has_curtains: Math.random() > 0.3,
    has_blinds: Math.random() > 0.4,
    has_shutters: Math.random() > 0.6,

    // Heating & Temperature
    heating_type: getRandomElement(heatingTypes),
    heating_quality_rating: getRandomInt(6, 10),
    has_thermostat: Math.random() > 0.5,
    has_individual_temperature_control: Math.random() > 0.6,

    // Design & Aesthetics
    design_style: getRandomElement(designStyles),
    design_quality_rating: getRandomInt(6, 10),
    aesthetic_appeal_rating: getRandomInt(6, 10),

    // Furniture
    furniture_style: getRandomElement(furnitureStyles),
    furniture_quality_rating: getRandomInt(6, 9),
    furniture_condition: getRandomElement(furnitureConditions),

    // Room Atmosphere
    room_atmosphere: getRandomElement(roomAtmospheres),

    // Flooring & Structure
    flooring_type: getRandomElement(flooringTypes),
    has_rug: Math.random() > 0.5,
    ceiling_height_cm: getRandomInt(245, 310),

    // Air & Noise
    air_quality_rating: getRandomInt(5, 9),
    noise_insulation_rating: getRandomInt(4, 9),
    is_soundproof: Math.random() > 0.7,

    // Amenities & Features
    has_air_purifier: Math.random() > 0.8,
    has_humidifier: Math.random() > 0.85,
    has_plants: Math.random() > 0.4,
    has_artwork: Math.random() > 0.5,
    has_mirror: Math.random() > 0.6,
    has_bookshelf: Math.random() > 0.5,
    has_desk_lamp: Math.random() > 0.6,
    has_mood_lighting: Math.random() > 0.4,
    has_smart_home_features: Math.random() > 0.7,
  };
}

async function finalCleanupAndSeed() {
  console.log('🧹 Starting final cleanup and seed...\n');

  // 1. Delete the 5 "aesthetic" properties
  console.log('🗑️  Deleting 5 aesthetic properties...\n');

  for (const propertyId of PROPERTIES_TO_DELETE) {
    const { data: property } = await supabase
      .from('properties')
      .select('title')
      .eq('id', propertyId)
      .single();

    console.log(`   Deleting: ${property?.title || propertyId}`);

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      console.error(`   ❌ Error:`, error.message);
    } else {
      console.log(`   ✅ Deleted`);
    }
  }

  console.log('\n✅ Deletion complete!\n');

  // 2. Generate aesthetics for ALL rooms in the 5 kept properties
  console.log('🎨 Generating aesthetics for all rooms in kept properties...\n');

  for (const propertyId of PROPERTIES_TO_KEEP) {
    const { data: property } = await supabase
      .from('properties')
      .select('title, city')
      .eq('id', propertyId)
      .single();

    console.log(`\n🏠 ${property?.title} (${property?.city})`);

    // Get all rooms for this property
    const { data: rooms, error: roomsError } = await supabase
      .from('property_rooms')
      .select('id, room_number, room_name')
      .eq('property_id', propertyId);

    if (roomsError) {
      console.error('   ❌ Error fetching rooms:', roomsError.message);
      continue;
    }

    console.log(`   Found ${rooms?.length || 0} rooms`);

    for (const room of rooms || []) {
      console.log(`   🛏️  Room ${room.room_number}: ${room.room_name || 'Sans nom'}`);

      // Check if aesthetics already exist
      const { data: existing } = await supabase
        .from('property_room_aesthetics')
        .select('id')
        .eq('room_id', room.id)
        .single();

      if (existing) {
        console.log('      ⚠️  Aesthetics already exist, skipping');
        continue;
      }

      // Generate and insert
      const aestheticsData = generateRoomAesthetics(room.id, room.room_number);

      const { error: insertError } = await supabase
        .from('property_room_aesthetics')
        .insert(aestheticsData);

      if (insertError) {
        console.error('      ❌ Error:', insertError.message);
      } else {
        console.log('      ✅ Aesthetics created');
      }
    }
  }

  // 3. Final statistics
  console.log('\n\n📊 FINAL STATISTICS:\n');

  const { count: totalProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });

  const { count: totalRooms } = await supabase
    .from('property_rooms')
    .select('*', { count: 'exact', head: true });

  const { count: totalAesthetics } = await supabase
    .from('property_room_aesthetics')
    .select('*', { count: 'exact', head: true });

  console.log(`Total properties: ${totalProperties}`);
  console.log(`Total rooms: ${totalRooms}`);
  console.log(`Total aesthetics: ${totalAesthetics}`);

  if (totalRooms && totalAesthetics) {
    const coverage = ((totalAesthetics / totalRooms) * 100).toFixed(1);
    console.log(`\n✅ Coverage: ${coverage}%`);

    if (coverage === '100.0') {
      console.log('🎉 Perfect! All rooms have aesthetics data!');
    }
  }

  console.log('\n🎉 Done!');
}

finalCleanupAndSeed().catch(console.error);
