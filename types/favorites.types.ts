/**
 * Favorites System Type Definitions
 * Types for saved properties, wishlists, comparisons, and saved searches
 */

// ============================================================================
// USER FAVORITES TYPES
// ============================================================================

export interface UserFavorite {
  id: string;
  user_id: string;
  property_id: string;

  // Notes
  user_notes?: string;
  priority: number; // 1-5

  // Status
  is_active: boolean;
  visited: boolean;
  visit_date?: string;

  // Metadata
  created_at: string;
  updated_at: string;

  // Joined data (not in DB)
  property?: {
    id: string;
    title: string;
    city?: string;
    neighborhood?: string;
    monthly_rent: number;
    main_image?: string;
    bedrooms: number;
    available_from?: string;
    status?: string;
  };
}

export interface FavoriteWithDetails {
  favorite_id: string;
  property_id: string;
  property_title: string;
  property_city?: string;
  property_neighborhood?: string;
  monthly_rent: number;
  main_image?: string;
  bedrooms: number;
  available_from?: string;
  user_notes?: string;
  priority: number;
  visited: boolean;
  created_at: string;
}

// ============================================================================
// PROPERTY COMPARISON TYPES
// ============================================================================

export interface PropertyComparison {
  id: string;
  user_id: string;
  name?: string;

  // Properties being compared
  property_ids: string[];

  // Status
  is_active: boolean;

  // Metadata
  created_at: string;
  updated_at: string;

  // Joined data
  properties?: PropertyComparisonItem[];
}

export interface PropertyComparisonItem {
  id: string;
  title: string;
  city?: string;
  neighborhood?: string;
  monthly_rent: number;
  main_image?: string;
  bedrooms: number;
  bathrooms: number;
  square_meters?: number;
  furnished: boolean;
  balcony: boolean;
  parking: boolean;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  available_from?: string;
  description?: string;
}

// ============================================================================
// SAVED SEARCH TYPES
// ============================================================================

export interface SavedSearchCriteria {
  city?: string;
  neighborhood?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  balcony?: boolean;
  parking?: boolean;
  pets_allowed?: boolean;
  smoking_allowed?: boolean;
  available_from?: string;
  [key: string]: any;
}

export interface SavedSearch {
  id: string;
  user_id: string;

  // Search details
  search_name: string;
  criteria: SavedSearchCriteria;

  // Notifications
  notify_on_match: boolean;
  last_notification_sent_at?: string;

  // Status
  is_active: boolean;

  // Metadata
  created_at: string;
  updated_at: string;

  // Computed
  matching_count?: number;
}

export interface PropertyMatch {
  property_id: string;
  title: string;
  city?: string;
  monthly_rent: number;
  bedrooms: number;
  match_score: number;
}

// ============================================================================
// FORM/INPUT TYPES
// ============================================================================

export interface AddFavoriteParams {
  property_id: string;
  user_notes?: string;
  priority?: number;
}

export interface UpdateFavoriteParams {
  user_notes?: string;
  priority?: number;
  visited?: boolean;
  visit_date?: string;
  is_active?: boolean;
}

export interface CreateComparisonParams {
  name?: string;
  property_ids: string[];
}

export interface UpdateComparisonParams {
  name?: string;
  property_ids?: string[];
  is_active?: boolean;
}

export interface CreateSavedSearchParams {
  search_name: string;
  criteria: SavedSearchCriteria;
  notify_on_match?: boolean;
}

export interface UpdateSavedSearchParams {
  search_name?: string;
  criteria?: SavedSearchCriteria;
  notify_on_match?: boolean;
  is_active?: boolean;
}

// ============================================================================
// WISHLIST TYPES
// ============================================================================

export type WishlistFilterType = 'all' | 'high-priority' | 'visited' | 'not-visited';

export interface WishlistFilters {
  filter: WishlistFilterType;
  sortBy: 'priority' | 'date' | 'price';
  sortOrder: 'asc' | 'desc';
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

// ============================================================================
// CONTEXT VALUE TYPE
// ============================================================================

export interface FavoritesContextValue {
  // State
  favorites: FavoriteWithDetails[];
  comparisons: PropertyComparison[];
  savedSearches: SavedSearch[];
  favoritesCount: number;
  isLoading: boolean;

  // Favorites
  loadFavorites: () => Promise<void>;
  addFavorite: (params: AddFavoriteParams) => Promise<UserFavorite | null>;
  updateFavorite: (favoriteId: string, params: UpdateFavoriteParams) => Promise<boolean>;
  removeFavorite: (favoriteId: string) => Promise<boolean>;
  isFavorited: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => Promise<boolean>;

  // Comparisons
  loadComparisons: () => Promise<void>;
  createComparison: (params: CreateComparisonParams) => Promise<PropertyComparison | null>;
  updateComparison: (comparisonId: string, params: UpdateComparisonParams) => Promise<boolean>;
  deleteComparison: (comparisonId: string) => Promise<boolean>;
  addPropertyToComparison: (comparisonId: string, propertyId: string) => Promise<boolean>;
  removePropertyFromComparison: (comparisonId: string, propertyId: string) => Promise<boolean>;

  // Saved Searches
  loadSavedSearches: () => Promise<void>;
  createSavedSearch: (params: CreateSavedSearchParams) => Promise<SavedSearch | null>;
  updateSavedSearch: (searchId: string, params: UpdateSavedSearchParams) => Promise<boolean>;
  deleteSavedSearch: (searchId: string) => Promise<boolean>;
  findMatchingProperties: (searchId: string) => Promise<PropertyMatch[]>;

  // Stats
  getFavoritesCount: () => Promise<number>;
}
