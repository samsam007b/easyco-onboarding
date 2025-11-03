export interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  filters: SearchFilters;
  description?: string;
  is_favorite: boolean;
  last_viewed_at?: string;
  view_count: number;
  is_shared: boolean;
  share_code?: string;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  propertyType?: string;
  amenities?: string[];
  furnished?: boolean | null;
}

export interface SavedSearchShare {
  id: string;
  saved_search_id: string;
  shared_with_user_id?: string;
  shared_with_email?: string;
  can_edit: boolean;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  accepted_at?: string;
}

export interface SavedSearchWithShares extends SavedSearch {
  shares?: SavedSearchShare[];
  owner?: {
    full_name: string;
    email: string;
  };
}

export interface CreateSavedSearchInput {
  name: string;
  filters: SearchFilters;
  description?: string;
  is_favorite?: boolean;
}

export interface UpdateSavedSearchInput {
  name?: string;
  filters?: SearchFilters;
  description?: string;
  is_favorite?: boolean;
}

export interface ShareSearchInput {
  saved_search_id: string;
  shared_with_email: string;
  can_edit?: boolean;
}
