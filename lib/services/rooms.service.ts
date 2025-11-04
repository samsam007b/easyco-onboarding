import { createClient } from '@/lib/auth/supabase-client';
import {
  PropertyRoom,
  RoomWithTotal,
  PropertyCosts,
  PropertyLifestyleMetrics,
  ResidentProfile,
  UtilitiesCosts,
  SharedLivingCosts
} from '@/types/room.types';

/**
 * Fetch all rooms for a property with total costs
 */
export async function getPropertyRooms(propertyId: string): Promise<RoomWithTotal[]> {
  const supabase = createClient();

  // Fetch rooms
  const { data: rooms, error: roomsError } = await supabase
    .from('property_rooms')
    .select('*')
    .eq('property_id', propertyId)
    .order('room_number', { ascending: true });

  if (roomsError) {
    console.error('Error fetching rooms:', roomsError);
    throw new Error('Failed to fetch rooms');
  }

  if (!rooms || rooms.length === 0) {
    return [];
  }

  // Fetch costs for the property
  const costs = await getPropertyCosts(propertyId);

  // Combine rooms with cost data
  const roomsWithTotal: RoomWithTotal[] = rooms.map(room => ({
    ...room,
    utilities_share: costs.utilities.total,
    shared_living_share: costs.shared_living.total,
    total_monthly_cost: room.price + costs.utilities.total + costs.shared_living.total
  }));

  return roomsWithTotal;
}

/**
 * Fetch a single room by ID with total costs
 */
export async function getRoomById(roomId: string): Promise<RoomWithTotal | null> {
  const supabase = createClient();

  const { data: room, error } = await supabase
    .from('property_rooms')
    .select('*')
    .eq('id', roomId)
    .single();

  if (error || !room) {
    console.error('Error fetching room:', error);
    return null;
  }

  const costs = await getPropertyCosts(room.property_id);

  return {
    ...room,
    utilities_share: costs.utilities.total,
    shared_living_share: costs.shared_living.total,
    total_monthly_cost: room.price + costs.utilities.total + costs.shared_living.total
  };
}

/**
 * Fetch property costs breakdown
 */
export async function getPropertyCosts(propertyId: string): Promise<PropertyCosts> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('property_costs')
    .select('*')
    .eq('property_id', propertyId)
    .single();

  if (error || !data) {
    console.error('Error fetching costs:', error);
    // Return default empty costs
    return {
      utilities: { total: 0 },
      shared_living: { total: 0 }
    };
  }

  // Transform database format to application format
  const utilities: UtilitiesCosts = {
    total: data.utilities_total || 0,
    breakdown: {
      electricity: data.utilities_electricity,
      water: data.utilities_water,
      heating: data.utilities_heating,
      gas: data.utilities_gas,
      internet: data.utilities_internet,
      trash: data.utilities_trash,
      other: data.utilities_other
    }
  };

  const shared_living: SharedLivingCosts = {
    total: data.shared_living_total || 0,
    breakdown: {
      cleaning_service: data.shared_living_cleaning_service,
      wifi: data.shared_living_wifi,
      cleaning_supplies: data.shared_living_cleaning_supplies,
      shared_groceries: data.shared_living_groceries,
      maintenance: data.shared_living_maintenance,
      insurance: data.shared_living_insurance,
      other: data.shared_living_other
    }
  };

  return {
    utilities,
    shared_living,
    deposit: data.deposit,
    agency_fee: data.agency_fee,
    admin_fee: data.admin_fee
  };
}

/**
 * Fetch property lifestyle metrics
 */
export async function getPropertyLifestyleMetrics(
  propertyId: string
): Promise<PropertyLifestyleMetrics | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('property_lifestyle_metrics')
    .select('*')
    .eq('property_id', propertyId)
    .single();

  if (error || !data) {
    console.error('Error fetching lifestyle metrics:', error);
    return null;
  }

  return {
    party_vibe: data.party_vibe,
    cleanliness: data.cleanliness,
    noise_level: data.noise_level,
    social_interaction: data.social_interaction,
    smoking_allowed: data.smoking_allowed,
    pets_allowed: data.pets_allowed,
    guests_allowed: data.guests_allowed,
    shared_meals_frequency: data.shared_meals_frequency,
    common_space_usage: data.common_space_usage
  };
}

/**
 * Fetch current residents of a property
 */
export async function getPropertyResidents(propertyId: string): Promise<ResidentProfile[]> {
  const supabase = createClient();

  // Fetch residents directly from property_residents table
  const { data: residents, error } = await supabase
    .from('property_residents')
    .select('*')
    .eq('property_id', propertyId);

  if (error || !residents) {
    console.error('Error fetching residents:', error);
    return [];
  }

  return residents.map(resident => ({
    id: resident.id,
    user_id: resident.id, // Using resident.id as user_id since they don't have user accounts
    first_name: resident.first_name,
    last_name: resident.last_name,
    age: resident.age,
    profile_photo_url: resident.photo_url,
    occupation: resident.occupation,
    occupation_status: null, // Not in property_residents table
    nationality: null, // Not in property_residents table
    languages: resident.languages,
    bio: resident.bio,
    interests: resident.interests,
    cleanliness_preference: resident.cleanliness_level,
    noise_tolerance: resident.noise_tolerance,
    sociability_level: resident.social_preference,
    is_smoker: resident.is_smoker,
    has_pets: resident.has_pets,
    move_in_date: resident.move_in_date,
    room_id: null // Not tracked in property_residents
  }));
}

/**
 * Get the cheapest available room for a property
 */
export async function getCheapestRoom(propertyId: string): Promise<RoomWithTotal | null> {
  const rooms = await getPropertyRooms(propertyId);
  const availableRooms = rooms.filter(r => r.is_available);

  if (availableRooms.length === 0) {
    return null;
  }

  return availableRooms.reduce((cheapest, room) =>
    room.price < cheapest.price ? room : cheapest
  );
}

/**
 * Get the soonest available room for a property
 */
export async function getSoonestAvailableRoom(propertyId: string): Promise<RoomWithTotal | null> {
  const rooms = await getPropertyRooms(propertyId);
  const availableRooms = rooms.filter(r => r.is_available && r.available_from);

  if (availableRooms.length === 0) {
    return null;
  }

  return availableRooms.reduce((soonest, room) => {
    const soonestDate = soonest.available_from ? new Date(soonest.available_from) : new Date();
    const roomDate = room.available_from ? new Date(room.available_from) : new Date();
    return roomDate < soonestDate ? room : soonest;
  });
}

/**
 * Filter rooms based on user criteria
 */
export interface RoomFilterCriteria {
  max_budget?: number;
  min_size?: number;
  requires_private_bathroom?: boolean;
  requires_balcony?: boolean;
  earliest_move_in?: string;
}

export async function filterRooms(
  propertyId: string,
  criteria: RoomFilterCriteria
): Promise<RoomWithTotal[]> {
  let rooms = await getPropertyRooms(propertyId);

  // Filter by budget
  if (criteria.max_budget) {
    rooms = rooms.filter(r => r.total_monthly_cost <= criteria.max_budget!);
  }

  // Filter by size
  if (criteria.min_size) {
    rooms = rooms.filter(r => r.size_sqm && r.size_sqm >= criteria.min_size!);
  }

  // Filter by private bathroom
  if (criteria.requires_private_bathroom) {
    rooms = rooms.filter(r => r.has_private_bathroom);
  }

  // Filter by balcony
  if (criteria.requires_balcony) {
    rooms = rooms.filter(r => r.has_balcony);
  }

  // Filter by move-in date
  if (criteria.earliest_move_in) {
    const targetDate = new Date(criteria.earliest_move_in);
    rooms = rooms.filter(r => {
      if (!r.available_from) return true; // Available immediately
      return new Date(r.available_from) <= targetDate;
    });
  }

  return rooms;
}

/**
 * Get complete property data for details page
 */
export interface PropertyDetailsData {
  rooms: RoomWithTotal[];
  costs: PropertyCosts;
  lifestyleMetrics: PropertyLifestyleMetrics | null;
  residents: ResidentProfile[];
  cheapestRoom: RoomWithTotal | null;
  soonestRoom: RoomWithTotal | null;
}

export async function getPropertyDetailsData(
  propertyId: string
): Promise<PropertyDetailsData> {
  // Fetch all data in parallel
  const [rooms, costs, lifestyleMetrics, residents] = await Promise.all([
    getPropertyRooms(propertyId),
    getPropertyCosts(propertyId),
    getPropertyLifestyleMetrics(propertyId),
    getPropertyResidents(propertyId)
  ]);

  // Calculate cheapest and soonest
  const availableRooms = rooms.filter(r => r.is_available);

  const cheapestRoom = availableRooms.length > 0
    ? availableRooms.reduce((min, room) => room.price < min.price ? room : min)
    : null;

  const soonestRoom = availableRooms
    .filter(r => r.available_from)
    .sort((a, b) => {
      const dateA = new Date(a.available_from!).getTime();
      const dateB = new Date(b.available_from!).getTime();
      return dateA - dateB;
    })[0] || null;

  return {
    rooms,
    costs,
    lifestyleMetrics,
    residents,
    cheapestRoom,
    soonestRoom
  };
}

/**
 * Create or update property costs
 */
export async function upsertPropertyCosts(
  propertyId: string,
  costs: Partial<PropertyCosts>
): Promise<boolean> {
  const supabase = createClient();

  const dataToUpsert = {
    property_id: propertyId,
    utilities_total: costs.utilities?.total || 0,
    utilities_electricity: costs.utilities?.breakdown?.electricity,
    utilities_water: costs.utilities?.breakdown?.water,
    utilities_heating: costs.utilities?.breakdown?.heating,
    utilities_gas: costs.utilities?.breakdown?.gas,
    utilities_internet: costs.utilities?.breakdown?.internet,
    utilities_trash: costs.utilities?.breakdown?.trash,
    utilities_other: costs.utilities?.breakdown?.other,
    shared_living_total: costs.shared_living?.total || 0,
    shared_living_cleaning_service: costs.shared_living?.breakdown?.cleaning_service,
    shared_living_wifi: costs.shared_living?.breakdown?.wifi,
    shared_living_cleaning_supplies: costs.shared_living?.breakdown?.cleaning_supplies,
    shared_living_groceries: costs.shared_living?.breakdown?.shared_groceries,
    shared_living_maintenance: costs.shared_living?.breakdown?.maintenance,
    shared_living_insurance: costs.shared_living?.breakdown?.insurance,
    shared_living_other: costs.shared_living?.breakdown?.other,
    deposit: costs.deposit,
    agency_fee: costs.agency_fee,
    admin_fee: costs.admin_fee
  };

  const { error } = await supabase
    .from('property_costs')
    .upsert(dataToUpsert, { onConflict: 'property_id' });

  if (error) {
    console.error('Error upserting costs:', error);
    return false;
  }

  return true;
}

/**
 * Create or update property lifestyle metrics
 */
export async function upsertPropertyLifestyleMetrics(
  propertyId: string,
  metrics: PropertyLifestyleMetrics
): Promise<boolean> {
  const supabase = createClient();

  const dataToUpsert = {
    property_id: propertyId,
    ...metrics
  };

  const { error } = await supabase
    .from('property_lifestyle_metrics')
    .upsert(dataToUpsert, { onConflict: 'property_id' });

  if (error) {
    console.error('Error upserting lifestyle metrics:', error);
    return false;
  }

  return true;
}
