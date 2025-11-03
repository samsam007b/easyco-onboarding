import { SupabaseClient } from '@supabase/supabase-js';
import {
  SavedSearch,
  SavedSearchShare,
  SavedSearchWithShares,
  CreateSavedSearchInput,
  UpdateSavedSearchInput,
  ShareSearchInput,
} from '@/types/saved-searches.types';

export class SavedSearchesService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Create a new saved search
   */
  async createSavedSearch(input: CreateSavedSearchInput): Promise<SavedSearch> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('saved_searches')
      .insert({
        user_id: user.id,
        name: input.name,
        filters: input.filters,
        description: input.description,
        is_favorite: input.is_favorite ?? false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get all saved searches for current user
   */
  async getUserSavedSearches(): Promise<SavedSearch[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get saved searches shared with current user
   */
  async getSharedWithMeSearches(): Promise<SavedSearchWithShares[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get accepted shares for current user
    const { data: shares, error: sharesError } = await this.supabase
      .from('saved_search_shares')
      .select('*, saved_searches(*)')
      .eq('shared_with_user_id', user.id)
      .eq('status', 'accepted');

    if (sharesError) throw sharesError;

    // Transform to SavedSearchWithShares
    const searches = (shares || []).map((share: any) => ({
      ...share.saved_searches,
      shares: [share],
    }));

    return searches;
  }

  /**
   * Get favorite saved searches
   */
  async getFavoriteSavedSearches(): Promise<SavedSearch[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_favorite', true)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get a single saved search with shares
   */
  async getSavedSearch(searchId: string): Promise<SavedSearchWithShares> {
    const { data, error } = await this.supabase
      .from('saved_searches')
      .select('*, saved_search_shares(*)')
      .eq('id', searchId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get saved search by share code
   */
  async getSavedSearchByShareCode(shareCode: string): Promise<SavedSearchWithShares> {
    const { data, error } = await this.supabase
      .from('saved_searches')
      .select('*, saved_search_shares(*)')
      .eq('share_code', shareCode)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update a saved search
   */
  async updateSavedSearch(
    searchId: string,
    input: UpdateSavedSearchInput
  ): Promise<SavedSearch> {
    const { data, error } = await this.supabase
      .from('saved_searches')
      .update(input)
      .eq('id', searchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(searchId: string, isFavorite: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('saved_searches')
      .update({ is_favorite: isFavorite })
      .eq('id', searchId);

    if (error) throw error;
  }

  /**
   * Delete a saved search
   */
  async deleteSavedSearch(searchId: string): Promise<void> {
    const { error } = await this.supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId);

    if (error) throw error;
  }

  /**
   * Increment view count
   */
  async incrementViewCount(searchId: string): Promise<void> {
    await this.supabase.rpc('increment_search_view_count', {
      search_id: searchId,
    });
  }

  /**
   * Enable sharing for a search
   */
  async enableSharing(searchId: string): Promise<string> {
    // Generate unique share code
    let shareCode: string;
    let isUnique = false;

    while (!isUnique) {
      shareCode = await this.generateShareCode();

      // Check if code already exists
      const { data } = await this.supabase
        .from('saved_searches')
        .select('id')
        .eq('share_code', shareCode)
        .single();

      if (!data) isUnique = true;
    }

    // Update search with share code
    const { error } = await this.supabase
      .from('saved_searches')
      .update({
        is_shared: true,
        share_code: shareCode!,
      })
      .eq('id', searchId);

    if (error) throw error;
    return shareCode!;
  }

  /**
   * Disable sharing for a search
   */
  async disableSharing(searchId: string): Promise<void> {
    const { error } = await this.supabase
      .from('saved_searches')
      .update({
        is_shared: false,
        share_code: null,
      })
      .eq('id', searchId);

    if (error) throw error;
  }

  /**
   * Share search with specific user
   */
  async shareWithUser(input: ShareSearchInput): Promise<SavedSearchShare> {
    const { data, error } = await this.supabase
      .from('saved_search_shares')
      .insert({
        saved_search_id: input.saved_search_id,
        shared_with_email: input.shared_with_email,
        can_edit: input.can_edit ?? false,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Accept a share invitation
   */
  async acceptShare(shareId: string): Promise<void> {
    const { error } = await this.supabase
      .from('saved_search_shares')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', shareId);

    if (error) throw error;
  }

  /**
   * Decline a share invitation
   */
  async declineShare(shareId: string): Promise<void> {
    const { error } = await this.supabase
      .from('saved_search_shares')
      .update({ status: 'declined' })
      .eq('id', shareId);

    if (error) throw error;
  }

  /**
   * Remove a share
   */
  async removeShare(shareId: string): Promise<void> {
    const { error } = await this.supabase
      .from('saved_search_shares')
      .delete()
      .eq('id', shareId);

    if (error) throw error;
  }

  /**
   * Get pending share invitations for current user
   */
  async getPendingInvitations(): Promise<SavedSearchShare[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('saved_search_shares')
      .select('*')
      .eq('shared_with_user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Generate a random share code
   */
  private async generateShareCode(): Promise<string> {
    const { data, error } = await this.supabase.rpc('generate_share_code');
    if (error) {
      // Fallback to client-side generation
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
    return data;
  }

  /**
   * Get statistics for saved searches
   */
  async getStats(): Promise<{
    total: number;
    favorites: number;
    shared: number;
    sharedWithMe: number;
  }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const [
      { count: total },
      { count: favorites },
      { count: shared },
      { count: sharedWithMe },
    ] = await Promise.all([
      this.supabase
        .from('saved_searches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
      this.supabase
        .from('saved_searches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_favorite', true),
      this.supabase
        .from('saved_searches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_shared', true),
      this.supabase
        .from('saved_search_shares')
        .select('*', { count: 'exact', head: true })
        .eq('shared_with_user_id', user.id)
        .eq('status', 'accepted'),
    ]);

    return {
      total: total || 0,
      favorites: favorites || 0,
      shared: shared || 0,
      sharedWithMe: sharedWithMe || 0,
    };
  }
}
