import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// IDs of the 5 properties to KEEP
const PROPERTIES_TO_KEEP = [
  '8778b466-b613-4bf3-a677-6e64d4896e75', // Industrial Loft in Antwerp
  '3ec26dab-aec7-4084-944a-1afb72c33144', // Modern Coliving Space in Brussels
  '6b4d7c6d-0845-4d95-b201-ea210afc4717', // Scandinavian Apartment in Ghent
  'b582f626-10ac-44e9-b5ad-dcf48f6354c9', // Bohemian Artist Studio in Liège
  'f5e58c00-c848-494d-b67e-cb231c150bde', // Luxury Design Apartment in Waterloo
];

// Aesthetic data templates for different room types
const aestheticTemplates = {
  modern: {
    design_style: 'modern',
    furniture_style: 'ikea',
    room_atmosphere: 'bright',
    heating_type: 'floor_heating',
    flooring_type: 'laminate',
  },
  industrial: {
    design_style: 'industrial',
    furniture_style: 'mixed',
    room_atmosphere: 'creative',
    heating_type: 'radiator',
    flooring_type: 'concrete',
  },
  scandinavian: {
    design_style: 'scandinavian',
    furniture_style: 'ikea',
    room_atmosphere: 'calming',
    heating_type: 'floor_heating',
    flooring_type: 'hardwood',
  },
  bohemian: {
    design_style: 'bohemian',
    furniture_style: 'vintage',
    room_atmosphere: 'creative',
    heating_type: 'radiator',
    flooring_type: 'hardwood',
  },
  luxury: {
    design_style: 'contemporary',
    furniture_style: 'designer',
    room_atmosphere: 'luxurious',
    heating_type: 'floor_heating',
    flooring_type: 'marble',
  },
};

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRoomAesthetics(propertyId: string, roomId: string, roomNumber: number) {
  // Choose template based on property
  let template;
  if (propertyId === '8778b466-b613-4bf3-a677-6e64d4896e75') {
    template = aestheticTemplates.industrial;
  } else if (propertyId === '3ec26dab-aec7-4084-944a-1afb72c33144') {
    template = aestheticTemplates.modern;
  } else if (propertyId === '6b4d7c6d-0845-4d95-b201-ea210afc4717') {
    template = aestheticTemplates.scandinavian;
  } else if (propertyId === 'b582f626-10ac-44e9-b5ad-dcf48f6354c9') {
    template = aestheticTemplates.bohemian;
  } else {
    template = aestheticTemplates.luxury;
  }

  const sunExposures = ['morning', 'afternoon', 'evening', 'all_day'];
  const windowOrientations = ['north', 'south', 'east', 'west'];

  return {
    room_id: roomId,
    natural_light_rating: getRandomInt(6, 10),
    sun_exposure: sunExposures[Math.floor(Math.random() * sunExposures.length)],
    sun_hours_per_day: getRandomInt(3, 8),
    number_of_windows: getRandomInt(1, 3),
    window_orientation: windowOrientations[Math.floor(Math.random() * windowOrientations.length)],
    has_curtains: Math.random() > 0.5,
    has_blinds: Math.random() > 0.5,
    has_shutters: Math.random() > 0.3,
    heating_type: template.heating_type,
    heating_quality_rating: getRandomInt(7, 10),
    has_thermostat: template.heating_type === 'floor_heating',
    has_individual_temperature_control: Math.random() > 0.5,
    design_style: template.design_style,
    design_quality_rating: getRandomInt(7, 10),
    aesthetic_appeal_rating: getRandomInt(7, 10),
    furniture_style: template.furniture_style,
    furniture_quality_rating: getRandomInt(6, 9),
    furniture_condition: ['excellent', 'good'][Math.floor(Math.random() * 2)],
    room_atmosphere: template.room_atmosphere,
    flooring_type: template.flooring_type,
    has_rug: Math.random() > 0.5,
    ceiling_height_cm: getRandomInt(250, 300),
    air_quality_rating: getRandomInt(6, 9),
    noise_insulation_rating: getRandomInt(5, 9),
    is_soundproof: Math.random() > 0.7,
    has_air_purifier: Math.random() > 0.7,
    has_humidifier: Math.random() > 0.8,
    has_plants: Math.random() > 0.4,
    has_artwork: Math.random() > 0.5,
    has_mirror: Math.random() > 0.6,
    has_bookshelf: Math.random() > 0.5,
    has_desk_lamp: Math.random() > 0.6,
    has_mood_lighting: Math.random() > 0.4,
    has_smart_home_features: propertyId === 'f5e58c00-c848-494d-b67e-cb231c150bde', // Only luxury property
  };
}

async function cleanupAndSeedAesthetics() {
  console.log('🧹 Starting cleanup and seed process...\n');

  // 1. Get all properties
  const { data: allProperties, error: propError } = await supabase
    .from('properties')
    .select('id, title, city');

  if (propError) {
    console.error('❌ Error fetching properties:', propError);
    return;
  }

  console.log(`📊 Total properties: ${allProperties?.length || 0}`);
  console.log(`✅ Properties to keep: ${PROPERTIES_TO_KEEP.length}\n`);

  // 2. Delete properties NOT in the keep list
  const propertiesToDelete = allProperties?.filter(p => !PROPERTIES_TO_KEEP.includes(p.id)) || [];

  console.log(`🗑️  Deleting ${propertiesToDelete.length} properties...\n`);

  for (const property of propertiesToDelete) {
    console.log(`   Deleting: ${property.title} (${property.city})`);

    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', property.id);

    if (deleteError) {
      console.error(`   ❌ Error deleting ${property.title}:`, deleteError.message);
    } else {
      console.log(`   ✅ Deleted successfully`);
    }
  }

  console.log('\n✅ Cleanup complete!\n');

  // 3. For each property to keep, generate aesthetics for ALL rooms
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
      console.error('   ❌ Error fetching rooms:', roomsError);
      continue;
    }

    console.log(`   Found ${rooms?.length || 0} rooms`);

    // For each room, check if aesthetics exist, if not create them
    for (const room of rooms || []) {
      console.log(`\n   🛏️  Room ${room.room_number}: ${room.room_name || 'Sans nom'}`);

      // Check if aesthetics already exist
      const { data: existingAesthetics } = await supabase
        .from('property_room_aesthetics')
        .select('id')
        .eq('room_id', room.id)
        .single();

      if (existingAesthetics) {
        console.log('      ✅ Aesthetics already exist, skipping');
        continue;
      }

      // Generate and insert aesthetics
      const aestheticsData = generateRoomAesthetics(propertyId, room.id, room.room_number);

      const { error: insertError } = await supabase
        .from('property_room_aesthetics')
        .insert(aestheticsData);

      if (insertError) {
        console.error('      ❌ Error inserting aesthetics:', insertError.message);
      } else {
        console.log('      ✅ Aesthetics created successfully');
      }
    }
  }

  // 4. Final statistics
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
  console.log(`Total room aesthetics: ${totalAesthetics}`);

  if (totalRooms && totalAesthetics) {
    const coverage = ((totalAesthetics / totalRooms) * 100).toFixed(1);
    console.log(`\n✅ Coverage: ${coverage}% (should be 100%)`);
  }

  console.log('\n🎉 Done!');
}

cleanupAndSeedAesthetics().catch(console.error);
