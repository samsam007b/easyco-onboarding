// Room and Pricing Types for EasyCo Platform

import { PropertyRoomAesthetics } from './room-aesthetics.types';

export interface PropertyRoom {
  id: string;
  property_id: string;
  room_number: number;
  room_name?: string;
  description?: string;
  price: number;
  size_sqm?: number;
  is_available: boolean;
  available_from?: string;
  floor_number?: number;
  has_private_bathroom: boolean;
  has_balcony: boolean;
  has_desk: boolean;
  has_wardrobe: boolean;
  is_furnished: boolean;
  window_view?: 'street' | 'courtyard' | 'garden' | 'none';
  photos?: string[];
  features?: string[];
  current_occupant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UtilitiesCosts {
  total: number;
  breakdown?: {
    electricity?: number;
    water?: number;
    heating?: number;
    gas?: number;
    internet?: number;
    trash?: number;
    other?: number;
  };
}

export interface SharedLivingCosts {
  total: number;
  breakdown?: {
    cleaning_service?: number; // Femme de ménage
    wifi?: number;
    cleaning_supplies?: number; // Produits ménagers
    shared_groceries?: number;
    maintenance?: number;
    insurance?: number;
    other?: number;
  };
}

export interface PropertyCosts {
  // Room pricing is handled by PropertyRoom

  // Monthly utilities (charges)
  utilities: UtilitiesCosts;

  // Shared living costs (vie commune)
  shared_living: SharedLivingCosts;

  // Security deposit
  deposit?: number;

  // Additional fees
  agency_fee?: number;
  admin_fee?: number;
}

export interface RoomWithTotal extends PropertyRoom {
  total_monthly_cost: number; // room price + utilities + shared living
  utilities_share: number;
  shared_living_share: number;
  aesthetics?: PropertyRoomAesthetics; // Optional aesthetic data
}

export interface PropertyLifestyleMetrics {
  // Ambiance scores (1-10)
  party_vibe: number; // 1 = calme, 10 = festif
  cleanliness: number; // 1 = relaxed, 10 = spotless
  noise_level: number; // 1 = très calme, 10 = bruyant
  social_interaction: number; // 1 = chacun chez soi, 10 = très social

  // Binary attributes
  smoking_allowed: boolean;
  pets_allowed: boolean;
  guests_allowed: boolean;

  // Shared activities
  shared_meals_frequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'daily';
  common_space_usage?: 'low' | 'medium' | 'high';
}

export interface ResidentProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  age?: number;
  profile_photo_url?: string;
  occupation?: string;
  occupation_status?: 'student' | 'employed' | 'self-employed' | 'unemployed' | 'retired';
  nationality?: string;
  languages?: string[];
  bio?: string;
  interests?: string[];

  // Lifestyle compatibility
  cleanliness_preference?: 'relaxed' | 'moderate' | 'tidy' | 'spotless';
  noise_tolerance?: 'low' | 'medium' | 'high';
  sociability_level?: number; // 1-10
  is_smoker?: boolean;
  has_pets?: boolean;

  move_in_date?: string;
  room_id?: string;
}

export interface RoomSelectionCriteria {
  // User filters
  max_budget?: number;
  min_size?: number;
  requires_private_bathroom?: boolean;
  requires_balcony?: boolean;
  earliest_move_in?: string;

  // Auto-selection priority
  prefer_cheapest: boolean;
  prefer_soonest: boolean;
  prefer_largest: boolean;
}
