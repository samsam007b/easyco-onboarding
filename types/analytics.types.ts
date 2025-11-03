export interface PropertyView {
  id: string;
  user_id?: string;
  property_id: string;
  view_duration?: number;
  source?: string;
  viewed_at: string;
  session_id?: string;
}

export interface SearchHistory {
  id: string;
  user_id?: string;
  search_query?: string;
  filters: Record<string, any>;
  results_count: number;
  clicked_property_id?: string;
  searched_at: string;
  session_id?: string;
}

export interface UserActivityStats {
  id: string;
  user_id: string;
  total_searches: number;
  total_property_views: number;
  total_favorites: number;
  total_applications: number;
  total_messages_sent: number;
  preferred_cities: string[];
  preferred_price_range?: {
    min: number;
    max: number;
  };
  preferred_property_types: string[];
  first_activity_at: string;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyViewWithDetails extends PropertyView {
  property?: {
    id: string;
    title: string;
    city: string;
    monthly_rent: number;
    main_image?: string;
  };
}

export interface SearchTrend {
  search_date: string;
  search_count: number;
}

export interface ViewTrend {
  view_date: string;
  view_count: number;
}

export interface MostViewedProperty {
  property_id: string;
  view_count: number;
  last_viewed: string;
}

export interface AnalyticsSummary {
  totalSearches: number;
  totalViews: number;
  totalFavorites: number;
  totalApplications: number;
  averageViewsPerDay: number;
  averageSearchesPerDay: number;
  mostViewedCity?: string;
  mostSearchedPriceRange?: {
    min: number;
    max: number;
  };
}

export interface TrackPropertyViewInput {
  property_id: string;
  view_duration?: number;
  source?: string;
}

export interface TrackSearchInput {
  search_query?: string;
  filters: Record<string, any>;
  results_count: number;
  clicked_property_id?: string;
}
