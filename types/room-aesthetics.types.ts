/**
 * Enhanced Room Aesthetics & Environmental Features
 * Booking.com-style detailed attributes with innovative aesthetic tracking
 */

// ============================================
// ENUMS & CONSTANTS
// ============================================

export type SunExposure = 'none' | 'morning' | 'afternoon' | 'evening' | 'all_day' | 'variable';

export type WindowOrientation = 'north' | 'south' | 'east' | 'west';

export type WindowSize = 'small' | 'medium' | 'large' | 'floor_to_ceiling' | 'skylight';

export type HeatingType =
  | 'central_heating'
  | 'radiator'
  | 'floor_heating'
  | 'electric_heater'
  | 'gas_heater'
  | 'air_conditioning'
  | 'heat_pump'
  | 'fireplace'
  | 'none';

export type CoolingType = 'air_conditioning' | 'fan' | 'ceiling_fan' | 'portable_ac' | 'none';

export type DesignStyle =
  | 'modern'
  | 'contemporary'
  | 'minimalist'
  | 'scandinavian'
  | 'industrial'
  | 'bohemian'
  | 'vintage'
  | 'mid_century'
  | 'rustic'
  | 'traditional'
  | 'eclectic'
  | 'japandi'
  | 'art_deco'
  | 'coastal'
  | 'farmhouse'
  | 'mixed';

export type FurnitureStyle =
  | 'ikea'
  | 'designer'
  | 'vintage'
  | 'custom'
  | 'antique'
  | 'mixed'
  | 'minimalist'
  | 'luxury';

export type FurnitureCondition = 'new' | 'excellent' | 'good' | 'fair' | 'needs_replacement';

export type RoomAtmosphere =
  | 'cozy'
  | 'bright'
  | 'airy'
  | 'minimal'
  | 'warm'
  | 'cool'
  | 'energetic'
  | 'calming'
  | 'luxurious'
  | 'basic'
  | 'creative'
  | 'professional';

export type FlooringType =
  | 'hardwood'
  | 'laminate'
  | 'tile'
  | 'carpet'
  | 'vinyl'
  | 'concrete'
  | 'marble'
  | 'parquet';

export type FlooringCondition = 'new' | 'excellent' | 'good' | 'fair' | 'worn';

export type CeilingType = 'standard' | 'high' | 'exposed_beams' | 'vaulted' | 'coffered' | 'dropped';

export type NoiseLevel = 'silent' | 'quiet' | 'moderate' | 'noisy' | 'very_noisy';

export type VentilationType = 'natural' | 'mechanical' | 'ac_system' | 'poor';

// Building-level types
export type BuildingStyle =
  | 'modern'
  | 'contemporary'
  | 'classic'
  | 'art_nouveau'
  | 'art_deco'
  | 'industrial'
  | 'brutalist'
  | 'traditional'
  | 'mixed';

export type RenovationQuality = 'never' | 'basic' | 'partial' | 'full' | 'luxury' | 'recent';

// ============================================
// MAIN INTERFACE
// ============================================

export interface PropertyRoomAesthetics {
  id: string;
  room_id: string;

  // Natural Light & Sun
  natural_light_rating?: number; // 1-10
  sun_exposure?: SunExposure;
  sun_hours_per_day?: number; // 0-24

  // Window Details
  number_of_windows?: number;
  window_orientation?: WindowOrientation[];
  window_size?: WindowSize;
  has_curtains?: boolean;
  has_blinds?: boolean;
  has_shutters?: boolean;

  // Heating & Temperature
  heating_type?: HeatingType;
  heating_quality_rating?: number; // 1-10
  has_thermostat?: boolean;
  has_individual_temperature_control?: boolean;
  cooling_type?: CoolingType;

  // Design & Aesthetics
  design_style?: DesignStyle;
  design_quality_rating?: number; // 1-10
  aesthetic_appeal_rating?: number; // 1-10

  // Furniture
  furniture_style?: FurnitureStyle;
  furniture_condition?: FurnitureCondition;
  furniture_quality_rating?: number; // 1-10

  // Colors & Atmosphere
  wall_color?: string;
  color_palette?: string[];
  room_atmosphere?: RoomAtmosphere;

  // Flooring
  flooring_type?: FlooringType;
  flooring_condition?: FlooringCondition;
  has_rug?: boolean;

  // Ceiling
  ceiling_height_cm?: number;
  ceiling_type?: CeilingType;

  // Acoustics & Noise
  noise_insulation_rating?: number; // 1-10
  is_soundproof?: boolean;
  noise_level_from_street?: NoiseLevel;
  noise_level_from_neighbors?: NoiseLevel;

  // Air Quality
  air_quality_rating?: number; // 1-10
  has_air_purifier?: boolean;
  has_humidifier?: boolean;
  ventilation_type?: VentilationType;

  // Special Features
  has_plants?: boolean;
  has_artwork?: boolean;
  has_mirror?: boolean;
  has_bookshelf?: boolean;
  has_desk_lamp?: boolean;
  has_mood_lighting?: boolean;
  has_smart_home_features?: boolean;

  // Photos
  aesthetic_photos?: string[];

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

// ============================================
// EXTENDED PROPERTY TYPE
// ============================================

export interface PropertyWithAesthetics {
  // Building aesthetics
  building_style?: BuildingStyle;
  building_age_years?: number;
  year_renovated?: number;
  renovation_quality?: RenovationQuality;

  // Quality ratings
  common_areas_quality?: number; // 1-10
  overall_cleanliness_rating?: number; // 1-10
  maintenance_quality?: number; // 1-10

  // Common amenities
  has_coworking_space?: boolean;
  has_rooftop_terrace?: boolean;
  has_garden_access?: boolean;
  has_bike_storage?: boolean;
  has_storage_room?: boolean;
}

// ============================================
// COMPLETE ROOM WITH ALL DATA
// ============================================

export interface RoomWithCompleteDetails {
  // Basic room info
  id: string;
  property_id: string;
  room_number: number;
  room_name?: string;
  description?: string;
  price: number;
  size_sqm: number;
  floor_number?: number;

  // Basic features
  has_private_bathroom: boolean;
  has_balcony: boolean;
  has_desk: boolean;
  has_wardrobe: boolean;
  is_furnished: boolean;
  window_view?: string;
  photos?: string[];
  features?: string[];

  // Availability
  is_available: boolean;
  available_from?: string;
  current_occupant_id?: string;

  // Costs
  utilities_total?: number;
  shared_living_total?: number;
  total_monthly_cost: number;

  // Aesthetic attributes
  natural_light_rating?: number;
  sun_exposure?: SunExposure;
  sun_hours_per_day?: number;
  heating_type?: HeatingType;
  heating_quality_rating?: number;
  design_style?: DesignStyle;
  design_quality_rating?: number;
  aesthetic_appeal_rating?: number;
  furniture_style?: FurnitureStyle;
  furniture_quality_rating?: number;
  room_atmosphere?: RoomAtmosphere;
  flooring_type?: FlooringType;
  ceiling_height_cm?: number;
  noise_insulation_rating?: number;
  air_quality_rating?: number;
  color_palette?: string[];
  has_plants?: boolean;
  has_artwork?: boolean;
  has_mood_lighting?: boolean;
  aesthetic_photos?: string[];

  // Property info
  property_title?: string;
  address?: string;
  city?: string;
  neighborhood?: string;
  property_images?: string[];
  property_amenities?: string[];

  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================
// SEARCH & FILTER PARAMETERS
// ============================================

export interface AestheticSearchFilters {
  // Design filters
  design_styles?: DesignStyle[];
  min_natural_light?: number; // 1-10
  heating_types?: HeatingType[];
  min_design_quality?: number; // 1-10
  furniture_styles?: FurnitureStyle[];
  room_atmospheres?: RoomAtmosphere[];

  // Basic filters
  city?: string;
  max_price?: number;
  min_size?: number;
  has_private_bathroom?: boolean;

  // Pagination
  limit?: number;
  offset?: number;
}

export interface AestheticSearchResult extends RoomWithCompleteDetails {
  aesthetic_score: number; // Calculated weighted score
}

// ============================================
// CREATE/UPDATE PAYLOADS
// ============================================

export interface CreateRoomAestheticsInput {
  room_id: string;
  natural_light_rating?: number;
  sun_exposure?: SunExposure;
  sun_hours_per_day?: number;
  number_of_windows?: number;
  window_orientation?: WindowOrientation[];
  window_size?: WindowSize;
  has_curtains?: boolean;
  has_blinds?: boolean;
  has_shutters?: boolean;
  heating_type?: HeatingType;
  heating_quality_rating?: number;
  has_thermostat?: boolean;
  has_individual_temperature_control?: boolean;
  cooling_type?: CoolingType;
  design_style?: DesignStyle;
  design_quality_rating?: number;
  aesthetic_appeal_rating?: number;
  furniture_style?: FurnitureStyle;
  furniture_condition?: FurnitureCondition;
  furniture_quality_rating?: number;
  wall_color?: string;
  color_palette?: string[];
  room_atmosphere?: RoomAtmosphere;
  flooring_type?: FlooringType;
  flooring_condition?: FlooringCondition;
  has_rug?: boolean;
  ceiling_height_cm?: number;
  ceiling_type?: CeilingType;
  noise_insulation_rating?: number;
  is_soundproof?: boolean;
  noise_level_from_street?: NoiseLevel;
  noise_level_from_neighbors?: NoiseLevel;
  air_quality_rating?: number;
  has_air_purifier?: boolean;
  has_humidifier?: boolean;
  ventilation_type?: VentilationType;
  has_plants?: boolean;
  has_artwork?: boolean;
  has_mirror?: boolean;
  has_bookshelf?: boolean;
  has_desk_lamp?: boolean;
  has_mood_lighting?: boolean;
  has_smart_home_features?: boolean;
  aesthetic_photos?: string[];
}

export type UpdateRoomAestheticsInput = Partial<CreateRoomAestheticsInput>;

// ============================================
// DISPLAY HELPERS
// ============================================

export const DESIGN_STYLE_LABELS: Record<DesignStyle, string> = {
  modern: 'Modern',
  contemporary: 'Contemporary',
  minimalist: 'Minimalist',
  scandinavian: 'Scandinavian',
  industrial: 'Industrial',
  bohemian: 'Bohemian',
  vintage: 'Vintage',
  mid_century: 'Mid-Century',
  rustic: 'Rustic',
  traditional: 'Traditional',
  eclectic: 'Eclectic',
  japandi: 'Japandi',
  art_deco: 'Art Deco',
  coastal: 'Coastal',
  farmhouse: 'Farmhouse',
  mixed: 'Mixed',
};

export const HEATING_TYPE_LABELS: Record<HeatingType, string> = {
  central_heating: 'Central Heating',
  radiator: 'Radiator',
  floor_heating: 'Floor Heating',
  electric_heater: 'Electric Heater',
  gas_heater: 'Gas Heater',
  air_conditioning: 'Air Conditioning',
  heat_pump: 'Heat Pump',
  fireplace: 'Fireplace',
  none: 'No Heating',
};

export const FURNITURE_STYLE_LABELS: Record<FurnitureStyle, string> = {
  ikea: 'IKEA',
  designer: 'Designer',
  vintage: 'Vintage',
  custom: 'Custom Made',
  antique: 'Antique',
  mixed: 'Mixed Styles',
  minimalist: 'Minimalist',
  luxury: 'Luxury',
};

export const ROOM_ATMOSPHERE_LABELS: Record<RoomAtmosphere, string> = {
  cozy: 'Cozy',
  bright: 'Bright',
  airy: 'Airy',
  minimal: 'Minimal',
  warm: 'Warm',
  cool: 'Cool',
  energetic: 'Energetic',
  calming: 'Calming',
  luxurious: 'Luxurious',
  basic: 'Basic',
  creative: 'Creative',
  professional: 'Professional',
};

export const SUN_EXPOSURE_LABELS: Record<SunExposure, string> = {
  none: 'No Direct Sun',
  morning: 'Morning Sun',
  afternoon: 'Afternoon Sun',
  evening: 'Evening Sun',
  all_day: 'All Day Sun',
  variable: 'Variable',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate aesthetic score for a room (0-10)
 * Weighted average of design quality, appeal, light, furniture, and heating
 */
export function calculateAestheticScore(aesthetics?: PropertyRoomAesthetics): number {
  if (!aesthetics) return 5; // Default neutral score

  const designQuality = aesthetics.design_quality_rating || 5;
  const aestheticAppeal = aesthetics.aesthetic_appeal_rating || 5;
  const naturalLight = aesthetics.natural_light_rating || 5;
  const furnitureQuality = aesthetics.furniture_quality_rating || 5;
  const heatingQuality = aesthetics.heating_quality_rating || 5;

  const score =
    designQuality * 0.3 +
    aestheticAppeal * 0.3 +
    naturalLight * 0.2 +
    furnitureQuality * 0.1 +
    heatingQuality * 0.1;

  return Math.round(score * 10) / 10; // Round to 1 decimal
}

/**
 * Get a color-coded rating label
 */
export function getRatingLabel(rating?: number): { label: string; color: string } {
  if (!rating) return { label: 'Not rated', color: 'gray' };

  if (rating >= 9) return { label: 'Exceptional', color: 'green' };
  if (rating >= 8) return { label: 'Excellent', color: 'green' };
  if (rating >= 7) return { label: 'Very Good', color: 'blue' };
  if (rating >= 6) return { label: 'Good', color: 'blue' };
  if (rating >= 5) return { label: 'Average', color: 'yellow' };
  if (rating >= 4) return { label: 'Below Average', color: 'orange' };
  return { label: 'Poor', color: 'red' };
}

/**
 * Get natural light description
 */
export function getNaturalLightDescription(rating?: number): string {
  if (!rating) return 'Lighting info not available';

  if (rating >= 9) return 'Exceptionally bright with abundant natural light';
  if (rating >= 7) return 'Bright room with plenty of natural light';
  if (rating >= 5) return 'Moderate natural light';
  if (rating >= 3) return 'Limited natural light';
  return 'Dark room with minimal natural light';
}

/**
 * Format sun hours for display
 */
export function formatSunHours(hours?: number, exposure?: SunExposure): string {
  if (!hours) {
    return exposure ? SUN_EXPOSURE_LABELS[exposure] : 'Sun info not available';
  }

  if (hours === 0) return 'No direct sunlight';
  if (hours < 2) return `${hours}h of sun (limited)`;
  if (hours < 4) return `${hours}h of sun (moderate)`;
  if (hours < 6) return `${hours}h of sun (good)`;
  return `${hours}h of sun (excellent)`;
}

/**
 * Get icon name for design style (use with Lucide icons)
 */
export function getDesignStyleIconName(style?: DesignStyle): string {
  const icons: Record<DesignStyle, string> = {
    modern: 'Sparkles',
    contemporary: 'Building2',
    minimalist: 'Square',
    scandinavian: 'TreePine',
    industrial: 'Factory',
    bohemian: 'Flower2',
    vintage: 'Radio',
    mid_century: 'Armchair',
    rustic: 'TreeDeciduous',
    traditional: 'Landmark',
    eclectic: 'Palette',
    japandi: 'Leaf',
    art_deco: 'Gem',
    coastal: 'Waves',
    farmhouse: 'Home',
    mixed: 'Shuffle',
  };

  return style ? icons[style] : 'Home';
}
