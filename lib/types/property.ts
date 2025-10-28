/**
 * Property Types
 * TypeScript types and interfaces for the properties table
 */

// Property type enum
export type PropertyType =
  | 'apartment'
  | 'house'
  | 'studio'
  | 'coliving'
  | 'shared_room'
  | 'private_room'
  | 'entire_place';

// Property status enum
export type PropertyStatus =
  | 'draft'
  | 'published'
  | 'archived'
  | 'rented'
  | 'under_review';

// Amenity types (common amenities)
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
  | 'kitchen'
  | 'furnished'
  | 'pets_allowed'
  | 'smoking_allowed'
  | 'wheelchair_accessible'
  | 'security'
  | 'concierge'
  | 'pool'
  | 'terrace';

// Main Property interface
export interface Property {
  id: string;
  owner_id: string;

  // Basic Information
  title: string;
  description: string | null;
  property_type: PropertyType;

  // Location
  address: string;
  city: string;
  neighborhood: string | null;
  postal_code: string;
  country: string;
  latitude: number | null;
  longitude: number | null;

  // Property Details
  bedrooms: number;
  bathrooms: number;
  total_rooms: number | null;
  surface_area: number | null; // in square meters
  floor_number: number | null;
  total_floors: number | null;
  furnished: boolean;

  // Pricing
  monthly_rent: number;
  charges: number;
  deposit: number | null;

  // Availability
  available_from: string | null; // ISO date string
  available_until: string | null; // ISO date string
  minimum_stay_months: number;
  maximum_stay_months: number | null;
  is_available: boolean;

  // Amenities
  amenities: PropertyAmenity[];

  // Rules & Preferences
  smoking_allowed: boolean;
  pets_allowed: boolean;
  couples_allowed: boolean;
  children_allowed: boolean;

  // Images
  images: string[]; // Array of image URLs
  main_image: string | null;

  // Status & Metadata
  status: PropertyStatus;
  views_count: number;
  applications_count: number;
  favorites_count: number;

  // Timestamps
  created_at: string;
  updated_at: string;
  published_at: string | null;
  archived_at: string | null;
}

// Property creation input (for forms)
export interface PropertyCreateInput {
  title: string;
  description?: string;
  property_type: PropertyType;

  // Location
  address: string;
  city: string;
  neighborhood?: string;
  postal_code: string;
  country?: string;
  latitude?: number;
  longitude?: number;

  // Property Details
  bedrooms: number;
  bathrooms: number;
  total_rooms?: number;
  surface_area?: number;
  floor_number?: number;
  total_floors?: number;
  furnished?: boolean;

  // Pricing
  monthly_rent: number;
  charges?: number;
  deposit?: number;

  // Availability
  available_from?: string;
  available_until?: string;
  minimum_stay_months?: number;
  maximum_stay_months?: number;

  // Amenities
  amenities?: PropertyAmenity[];

  // Rules
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  couples_allowed?: boolean;
  children_allowed?: boolean;

  // Images
  images?: string[];
  main_image?: string;
}

// Property update input (partial)
export type PropertyUpdateInput = Partial<PropertyCreateInput> & {
  id: string;
};

// Property filters for search
export interface PropertyFilters {
  city?: string;
  neighborhood?: string;
  property_type?: PropertyType;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: PropertyAmenity[];
  is_furnished?: boolean;
  pets_allowed?: boolean;
  smoking_allowed?: boolean;
  available_from?: string;
  minimum_stay_months?: number;
  maximum_stay_months?: number;
}

// Property with owner info (for listings)
export interface PropertyWithOwner extends Property {
  owner: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    phone?: string;
  };
}

// Property stats (for owner dashboard)
export interface PropertyStats {
  total_properties: number;
  published_properties: number;
  draft_properties: number;
  rented_properties: number;
  total_views: number;
  total_applications: number;
  total_favorites: number;
  avg_applications_per_property: number;
}

// Property card (minimal info for lists)
export interface PropertyCard {
  id: string;
  title: string;
  property_type: PropertyType;
  city: string;
  neighborhood: string | null;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  surface_area: number | null;
  main_image: string | null;
  images: string[];
  status: PropertyStatus;
  views_count: number;
  favorites_count: number;
  is_available: boolean;
  published_at: string | null;
}

// Property validation constraints
export const PROPERTY_CONSTRAINTS = {
  title: {
    minLength: 10,
    maxLength: 255,
  },
  description: {
    minLength: 50,
    maxLength: 5000,
  },
  bedrooms: {
    min: 0,
    max: 20,
  },
  bathrooms: {
    min: 0,
    max: 10,
  },
  total_rooms: {
    min: 0,
    max: 50,
  },
  surface_area: {
    min: 1,
    max: 10000,
  },
  monthly_rent: {
    min: 0,
    max: 1000000,
  },
  charges: {
    min: 0,
    max: 10000,
  },
  deposit: {
    min: 0,
    max: 50000,
  },
  minimum_stay_months: {
    min: 1,
    max: 24,
  },
  maximum_stay_months: {
    min: 1,
    max: 60,
  },
  images: {
    maxCount: 20,
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  },
} as const;

// Property type labels (for UI)
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Apartment',
  house: 'House',
  studio: 'Studio',
  coliving: 'Coliving Space',
  shared_room: 'Shared Room',
  private_room: 'Private Room',
  entire_place: 'Entire Place',
};

// Property status labels (for UI)
export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
  rented: 'Rented',
  under_review: 'Under Review',
};

// Amenity labels (for UI)
export const AMENITY_LABELS: Record<PropertyAmenity, string> = {
  wifi: 'Wi-Fi',
  parking: 'Parking',
  elevator: 'Elevator',
  balcony: 'Balcony',
  garden: 'Garden',
  gym: 'Gym',
  laundry: 'Laundry',
  dishwasher: 'Dishwasher',
  washing_machine: 'Washing Machine',
  dryer: 'Dryer',
  air_conditioning: 'Air Conditioning',
  heating: 'Heating',
  kitchen: 'Kitchen',
  furnished: 'Furnished',
  pets_allowed: 'Pets Allowed',
  smoking_allowed: 'Smoking Allowed',
  wheelchair_accessible: 'Wheelchair Accessible',
  security: 'Security',
  concierge: 'Concierge',
  pool: 'Pool',
  terrace: 'Terrace',
};

// Helper function to format price
export function formatPrice(price: number, currency: string = '€'): string {
  return `${currency}${price.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

// Helper function to format property type
export function formatPropertyType(type: PropertyType): string {
  return PROPERTY_TYPE_LABELS[type] || type;
}

// Helper function to format status
export function formatPropertyStatus(status: PropertyStatus): string {
  return PROPERTY_STATUS_LABELS[status] || status;
}

// Helper function to format amenity
export function formatAmenity(amenity: PropertyAmenity): string {
  return AMENITY_LABELS[amenity] || amenity;
}

// Helper function to check if property is editable
export function isPropertyEditable(property: Property): boolean {
  return property.status === 'draft' || property.status === 'under_review';
}

// Helper function to check if property can be published
export function canPublishProperty(property: Property): boolean {
  return (
    property.status === 'draft' &&
    property.title.length >= PROPERTY_CONSTRAINTS.title.minLength &&
    property.description !== null &&
    property.description !== undefined &&
    property.description.length >= PROPERTY_CONSTRAINTS.description.minLength &&
    property.images.length > 0 &&
    property.monthly_rent > 0
  );
}
