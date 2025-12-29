// Property Types for Izzico Platform

export type PropertyType =
  | 'apartment'
  | 'house'
  | 'studio'
  | 'coliving'
  | 'shared_room'
  | 'private_room'
  | 'entire_place';

export type PropertyStatus =
  | 'draft'
  | 'published'
  | 'archived'
  | 'rented';

export interface PropertyImage {
  url: string;
  alt?: string;
}

export type PropertyAmenity =
  | 'wifi'
  | 'parking'
  | 'elevator'
  | 'balcony'
  | 'garden'
  | 'gym'
  | 'laundry'
  | 'dishwasher'
  | 'washing_machine'
  | 'dryer'
  | 'air_conditioning'
  | 'heating'
  | 'tv'
  | 'workspace'
  | 'kitchen'
  | 'private_bathroom';

export interface Property {
  id: string;
  owner_id: string;

  // Basic Information
  title: string;
  description?: string;
  property_type: PropertyType;

  // Location
  address: string;
  city: string;
  postal_code: string;
  country?: string;
  latitude?: number;
  longitude?: number;

  // Property Details
  bedrooms: number;
  bathrooms: number;
  total_rooms?: number;
  surface_area?: number; // in m²
  floor_number?: number;
  total_floors?: number;
  furnished: boolean;

  // Pricing
  monthly_rent: number;
  charges?: number;
  deposit?: number;

  // Availability
  available_from?: string; // ISO date string
  available_until?: string; // ISO date string
  minimum_stay_months?: number;
  is_available: boolean;

  // Amenities & Rules
  amenities: PropertyAmenity[];
  smoking_allowed: boolean;
  pets_allowed: boolean;
  couples_allowed: boolean;

  // Images
  images: PropertyImage[] | string[]; // Can be PropertyImage objects or string URLs
  main_image_url?: string;
  main_image?: string; // Alias for main_image_url for compatibility

  // Status & Metadata
  status: PropertyStatus;
  views_count: number;
  inquiries_count: number;

  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface CreatePropertyInput {
  title: string;
  description?: string;
  property_type: PropertyType;
  address: string;
  city: string;
  postal_code: string;
  bedrooms: number;
  bathrooms: number;
  surface_area?: number;
  furnished: boolean;
  monthly_rent: number;
  charges?: number;
  deposit?: number;
  available_from?: string;
  minimum_stay_months?: number;
  amenities?: PropertyAmenity[];
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  couples_allowed?: boolean;
  images?: PropertyImage[];
}

export interface UpdatePropertyInput extends Partial<CreatePropertyInput> {
  id: string;
}

export interface PropertyFilters {
  city?: string;
  min_rent?: number;
  max_rent?: number;
  min_price?: number; // Alias for min_rent
  max_price?: number; // Alias for max_rent
  bedrooms?: number;
  property_type?: PropertyType;
  furnished?: boolean;
  is_furnished?: boolean; // Alias for furnished
  amenities?: PropertyAmenity[];
  available_from?: string;
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  per_page: number;
}
