import { SupabaseClient } from '@supabase/supabase-js';
import {
  PropertyTour,
  ScheduleTourInput,
  UpdateTourInput,
  UpcomingTour,
  VirtualTourView,
} from '@/types/virtual-tours.types';

export class VirtualToursService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Schedule a property tour
   */
  async scheduleTour(input: ScheduleTourInput): Promise<PropertyTour> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('property_tours')
      .insert({
        user_id: user.id,
        property_id: input.property_id,
        tour_type: input.tour_type,
        scheduled_at: input.scheduled_at,
        duration_minutes: input.duration_minutes || 30,
        attendees_count: input.attendees_count || 1,
        attendee_names: input.attendee_names,
        user_notes: input.user_notes,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get user's scheduled tours
   */
  async getUserTours(): Promise<PropertyTour[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('property_tours')
      .select('*')
      .eq('user_id', user.id)
      .order('scheduled_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get upcoming tours
   */
  async getUpcomingTours(limit: number = 10): Promise<UpcomingTour[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase.rpc('get_user_upcoming_tours', {
      p_user_id: user.id,
      p_limit: limit,
    });

    if (error) throw error;
    return data || [];
  }

  /**
   * Update a tour
   */
  async updateTour(tourId: string, input: UpdateTourInput): Promise<PropertyTour> {
    const { data, error } = await this.supabase
      .from('property_tours')
      .update(input)
      .eq('id', tourId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Cancel a tour
   */
  async cancelTour(tourId: string, reason?: string): Promise<void> {
    const { error } = await this.supabase
      .from('property_tours')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason,
      })
      .eq('id', tourId);

    if (error) throw error;
  }

  /**
   * Confirm a tour (for property owners)
   */
  async confirmTour(tourId: string): Promise<void> {
    const { error } = await this.supabase
      .from('property_tours')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
      })
      .eq('id', tourId);

    if (error) throw error;
  }

  /**
   * Get property's virtual tour information
   */
  async getPropertyVirtualTourInfo(property_id: string) {
    const { data, error } = await this.supabase
      .from('properties')
      .select(
        'id, has_virtual_tour, virtual_tour_url, virtual_tour_type, tour_embed_code'
      )
      .eq('id', property_id)
      .single();

    if (error) throw error;

    return {
      property_id: data.id,
      has_virtual_tour: data.has_virtual_tour || false,
      virtual_tour_url: data.virtual_tour_url,
      virtual_tour_type: data.virtual_tour_type,
      tour_embed_code: data.tour_embed_code,
    };
  }

  /**
   * Track virtual tour view
   */
  async trackVirtualTourView(
    propertyId: string,
    viewDuration?: number,
    completed?: boolean
  ): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();

    await this.supabase.from('virtual_tour_views').insert({
      user_id: user?.id,
      property_id: propertyId,
      view_duration: viewDuration,
      completed: completed || false,
      session_id: !user ? this.getSessionId() : null,
    });
  }

  /**
   * Get virtual tour analytics for a property
   */
  async getVirtualTourAnalytics(propertyId: string): Promise<{
    total_views: number;
    completed_views: number;
    average_duration: number;
  }> {
    const { data: views, error } = await this.supabase
      .from('virtual_tour_views')
      .select('view_duration, completed')
      .eq('property_id', propertyId);

    if (error) throw error;

    const totalViews = views?.length || 0;
    const completedViews = views?.filter((v) => v.completed).length || 0;
    const avgDuration =
      views && views.length > 0
        ? views.reduce((sum, v) => sum + (v.view_duration || 0), 0) / views.length
        : 0;

    return {
      total_views: totalViews,
      completed_views: completedViews,
      average_duration: Math.round(avgDuration),
    };
  }

  /**
   * Get session ID for anonymous tracking
   */
  private getSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = sessionStorage.getItem('tour_session_id');
    if (!sessionId) {
      sessionId = `tour_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('tour_session_id', sessionId);
    }
    return sessionId;
  }
}
