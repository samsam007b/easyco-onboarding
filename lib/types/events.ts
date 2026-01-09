/**
 * Types for Events System
 * Feature: Events discovery & community building
 * Target: Residents (primary), Searchers (secondary)
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export const EVENT_TYPES = ['public', 'property', 'community'] as const;
export type EventType = typeof EVENT_TYPES[number];

export const EVENT_STATUSES = ['draft', 'published', 'cancelled', 'completed', 'archived'] as const;
export type EventStatus = typeof EVENT_STATUSES[number];

export const ATTENDEE_STATUSES = ['interested', 'going', 'maybe', 'not_going', 'attended'] as const;
export type AttendeeStatus = typeof ATTENDEE_STATUSES[number];

export const INVITATION_STATUSES = ['pending', 'accepted', 'declined'] as const;
export type InvitationStatus = typeof INVITATION_STATUSES[number];

export const PRICE_RANGES = ['free', 'budget', 'moderate', 'premium', 'all'] as const;
export type PriceRange = typeof PRICE_RANGES[number];

export const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
export type Weekday = typeof WEEKDAYS[number];

// ============================================================================
// CATEGORY
// ============================================================================

export interface EventCategory {
  id: string;
  slug: string;
  name_fr: string;
  name_en: string;
  name_nl?: string;
  name_de?: string;
  icon_name: string; // Lucide icon name
  color: string; // Hex color
  display_order: number;
  created_at: string;
}

// ============================================================================
// EVENT
// ============================================================================

export interface Event {
  id: string;
  event_type: EventType;

  // Basic Info
  title: string;
  description: string;
  short_description?: string;
  category_id?: string;
  category?: EventCategory; // Populated via join

  // Location
  city: string;
  venue_name?: string;
  venue_address?: string;
  latitude?: number;
  longitude?: number;

  // Timing
  start_date: string; // ISO 8601
  end_date?: string;
  all_day: boolean;
  timezone: string;

  // Media
  cover_image_url?: string;
  images: string[]; // Array of URLs

  // Property Events
  property_id?: string;
  property?: any; // Property type (if needed)
  max_attendees?: number;

  // Public Events
  external_url?: string;
  external_source?: string;
  external_id?: string;

  // Pricing
  price_min: number;
  price_max?: number;
  is_free: boolean;
  currency: string;

  // Partnership & Monetization
  is_partner_event: boolean;
  partner_name?: string;
  partner_logo_url?: string;
  promo_code?: string;
  promo_description?: string;
  affiliate_url?: string;
  commission_rate?: number;

  // Status
  status: EventStatus;
  is_featured: boolean;

  // Metadata
  created_by?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;

  // Tags
  tags: string[];

  // Computed fields (from joins or aggregations)
  attendees_count?: number;
  interested_count?: number;
  going_count?: number;
  reviews_count?: number;
  average_rating?: number;
  user_attendance?: AttendeeStatus; // Current user's status
  property_attendees?: any[]; // Colocataires attending
}

// ============================================================================
// EVENT ATTENDEE
// ============================================================================

export interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  status: AttendeeStatus;

  // Tickets
  ticket_purchased: boolean;
  ticket_reference?: string;
  ticket_price?: number;

  // Social
  invite_friends: boolean;

  // Metadata
  created_at: string;
  updated_at: string;

  // Populated fields
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

// ============================================================================
// EVENT INVITATION
// ============================================================================

export interface EventInvitation {
  id: string;
  event_id: string;
  invited_by: string;
  invited_user_id: string;
  status: InvitationStatus;
  message?: string;
  created_at: string;
  responded_at?: string;

  // Populated fields
  event?: Event;
  inviter?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

// ============================================================================
// EVENT REVIEW
// ============================================================================

export interface EventReview {
  id: string;
  event_id: string;
  user_id: string;
  rating: number; // 1-5
  review_text?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;

  // Populated fields
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

// ============================================================================
// USER EVENT PREFERENCES
// ============================================================================

export interface UserEventPreferences {
  id: string;
  user_id: string;
  preferred_categories: string[]; // Array of category IDs
  max_distance_km: number;
  price_range: PriceRange;
  preferred_days: Weekday[];

  // Notifications
  email_notifications: boolean;
  push_notifications: boolean;
  weekly_digest: boolean;

  created_at: string;
  updated_at: string;
}

// ============================================================================
// EVENT ANALYTICS
// ============================================================================

export interface EventAnalytics {
  id: string;
  event_id: string;
  views_count: number;
  clicks_count: number;
  shares_count: number;
  conversions_count: number;
  commission_earned: number;
  updated_at: string;
}

// ============================================================================
// FILTER & SEARCH
// ============================================================================

export interface EventFilters {
  event_type?: EventType[];
  category_ids?: string[];
  city?: string;
  start_date_min?: string;
  start_date_max?: string;
  is_free?: boolean;
  price_max?: number;
  is_featured?: boolean;
  is_partner_event?: boolean;
  tags?: string[];
  search_query?: string;
  property_id?: string; // For property events
  max_distance_km?: number; // For location-based search
  user_lat?: number;
  user_lng?: number;
}

export interface EventSort {
  field: 'start_date' | 'created_at' | 'relevance' | 'price' | 'distance';
  direction: 'asc' | 'desc';
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface EventsResponse {
  events: Event[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface RecommendedEvent {
  event: Event;
  relevance_score: number;
  reason?: string; // Why this was recommended
}

// ============================================================================
// FORM DATA
// ============================================================================

export interface CreateEventData {
  event_type: EventType;
  title: string;
  description: string;
  short_description?: string;
  category_id?: string;
  city: string;
  venue_name?: string;
  venue_address?: string;
  start_date: string;
  end_date?: string;
  all_day: boolean;
  cover_image_url?: string;
  images?: string[];
  property_id?: string; // Required for property events
  max_attendees?: number;
  price_min?: number;
  price_max?: number;
  is_free: boolean;
  tags?: string[];
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: EventStatus;
}

// ============================================================================
// UI HELPERS
// ============================================================================

export interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact' | 'featured';
  showCategory?: boolean;
  showAttendees?: boolean;
  showPropertyBadge?: boolean;
  onClick?: (event: Event) => void;
}

export interface AttendanceButtonProps {
  event: Event;
  currentStatus?: AttendeeStatus;
  onStatusChange?: (status: AttendeeStatus) => void;
  disabled?: boolean;
}
