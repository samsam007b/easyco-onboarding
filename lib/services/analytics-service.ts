import { SupabaseClient } from '@supabase/supabase-js';
import {
  PropertyView,
  SearchHistory,
  UserActivityStats,
  PropertyViewWithDetails,
  SearchTrend,
  MostViewedProperty,
  AnalyticsSummary,
  TrackPropertyViewInput,
  TrackSearchInput,
} from '@/types/analytics.types';

export class AnalyticsService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Track a property view
   */
  async trackPropertyView(input: TrackPropertyViewInput): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();

    await this.supabase.from('property_views').insert({
      user_id: user?.id,
      property_id: input.property_id,
      view_duration: input.view_duration,
      source: input.source,
      session_id: !user ? this.getSessionId() : null,
    });
  }

  /**
   * Track a search query
   */
  async trackSearch(input: TrackSearchInput): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();

    await this.supabase.from('search_history').insert({
      user_id: user?.id,
      search_query: input.search_query,
      filters: input.filters,
      results_count: input.results_count,
      clicked_property_id: input.clicked_property_id,
      session_id: !user ? this.getSessionId() : null,
    });
  }

  /**
   * Get user's property view history
   */
  async getPropertyViewHistory(limit: number = 50): Promise<PropertyViewWithDetails[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('property_views')
      .select(`
        *,
        property:properties (
          id,
          title,
          city,
          monthly_rent,
          main_image
        )
      `)
      .eq('user_id', user.id)
      .order('viewed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get user's search history
   */
  async getSearchHistory(limit: number = 50): Promise<SearchHistory[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('search_history')
      .select('*')
      .eq('user_id', user.id)
      .order('searched_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get user activity statistics
   */
  async getUserActivityStats(): Promise<UserActivityStats | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('user_activity_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Get user's most viewed properties
   */
  async getMostViewedProperties(limit: number = 10): Promise<MostViewedProperty[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase.rpc('get_user_most_viewed_properties', {
      p_user_id: user.id,
      p_limit: limit,
    });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get search trends over time
   */
  async getSearchTrends(days: number = 30): Promise<SearchTrend[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase.rpc('get_user_search_trends', {
      p_user_id: user.id,
      p_days: days,
    });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get analytics summary
   */
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const stats = await this.getUserActivityStats();

    if (!stats) {
      return {
        totalSearches: 0,
        totalViews: 0,
        totalFavorites: 0,
        totalApplications: 0,
        averageViewsPerDay: 0,
        averageSearchesPerDay: 0,
      };
    }

    // Calculate days since first activity
    const daysSinceStart = Math.max(
      1,
      Math.floor(
        (new Date().getTime() - new Date(stats.first_activity_at).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    return {
      totalSearches: stats.total_searches,
      totalViews: stats.total_property_views,
      totalFavorites: stats.total_favorites,
      totalApplications: stats.total_applications,
      averageViewsPerDay: Math.round(stats.total_property_views / daysSinceStart),
      averageSearchesPerDay: Math.round(stats.total_searches / daysSinceStart),
      mostViewedCity: stats.preferred_cities[0],
      mostSearchedPriceRange: stats.preferred_price_range,
    };
  }

  /**
   * Get recently viewed properties with details
   */
  async getRecentlyViewedProperties(limit: number = 10): Promise<any[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('property_views')
      .select(`
        viewed_at,
        properties (*)
      `)
      .eq('user_id', user.id)
      .order('viewed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Remove duplicates (keep most recent view of each property)
    const seen = new Set();
    const unique = (data || []).filter((item: any) => {
      if (!item.properties) return false;
      if (seen.has(item.properties.id)) return false;
      seen.add(item.properties.id);
      return true;
    });

    return unique.map((item: any) => item.properties);
  }

  /**
   * Clear user's history
   */
  async clearHistory(type: 'views' | 'searches' | 'all'): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    if (type === 'views' || type === 'all') {
      await this.supabase.from('property_views').delete().eq('user_id', user.id);
    }

    if (type === 'searches' || type === 'all') {
      await this.supabase.from('search_history').delete().eq('user_id', user.id);
    }
  }

  /**
   * Get or create session ID for anonymous tracking
   */
  private getSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }
}
