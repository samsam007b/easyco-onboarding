/**
 * Service for fetching and managing room aesthetic data
 */

import { createClient } from '@/lib/auth/supabase-client';
import { PropertyRoomAesthetics } from '@/types/room-aesthetics.types';
import { RoomWithTotal } from '@/types/room.types';

/**
 * Fetch aesthetic data for a single room
 */
export async function getRoomAesthetics(roomId: string): Promise<PropertyRoomAesthetics | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('property_room_aesthetics')
    .select('*')
    .eq('room_id', roomId)
    .single();

  if (error) {
    console.error('Error fetching room aesthetics:', error);
    return null;
  }

  return data;
}

/**
 * Fetch aesthetic data for multiple rooms
 */
export async function getRoomsWithAesthetics(
  roomIds: string[]
): Promise<Map<string, PropertyRoomAesthetics>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('property_room_aesthetics')
    .select('*')
    .in('room_id', roomIds);

  if (error) {
    console.error('Error fetching rooms aesthetics:', error);
    return new Map();
  }

  // Create a map of room_id => aesthetics
  const aestheticsMap = new Map<string, PropertyRoomAesthetics>();
  data?.forEach((aesthetics) => {
    aestheticsMap.set(aesthetics.room_id, aesthetics);
  });

  return aestheticsMap;
}

/**
 * Enhance rooms array with aesthetic data
 */
export async function enhanceRoomsWithAesthetics(
  rooms: RoomWithTotal[]
): Promise<RoomWithTotal[]> {
  if (!rooms || rooms.length === 0) return rooms;

  const roomIds = rooms.map((room) => room.id);
  const aestheticsMap = await getRoomsWithAesthetics(roomIds);

  return rooms.map((room) => ({
    ...room,
    aesthetics: aestheticsMap.get(room.id),
  }));
}

/**
 * Get rooms with complete details including aesthetics from the database view
 */
export async function getRoomsWithCompleteDetails(
  propertyId: string
): Promise<RoomWithTotal[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('rooms_with_complete_details')
    .select('*')
    .eq('property_id', propertyId);

  if (error) {
    console.error('Error fetching rooms with complete details:', error);
    return [];
  }

  return data as RoomWithTotal[];
}

/**
 * Create or update aesthetic data for a room
 */
export async function upsertRoomAesthetics(
  roomId: string,
  aesthetics: Partial<PropertyRoomAesthetics>
): Promise<PropertyRoomAesthetics | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('property_room_aesthetics')
    .upsert({
      room_id: roomId,
      ...aesthetics,
    })
    .select()
    .single();

  if (error) {
    console.error('Error upserting room aesthetics:', error);
    return null;
  }

  return data;
}
