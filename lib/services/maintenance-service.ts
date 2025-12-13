/**
 * Maintenance Request Service
 * Handles: Issue reporting, tracking, photo uploads, cost management
 */

import { createClient } from '@/lib/auth/supabase-client';
import type {
  MaintenanceRequest,
  MaintenanceRequestWithCreator,
  CreateMaintenanceForm,
  UpdateMaintenanceForm,
  MaintenanceStats,
  MaintenanceStatus,
} from '@/types/maintenance.types';

class MaintenanceService {
  private supabase = createClient();

  /**
   * Get all maintenance requests for a property
   */
  async getRequests(
    propertyId: string,
    filters?: {
      status?: MaintenanceStatus[];
      category?: string;
    }
  ): Promise<MaintenanceRequestWithCreator[]> {
    try {
      let query = this.supabase
        .from('maintenance_requests')
        .select(
          `
          *,
          profiles!created_by (
            full_name,
            avatar_url
          )
        `
        )
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;

      if (error) throw error;

      const enriched: MaintenanceRequestWithCreator[] =
        data?.map((r) => ({
          ...r,
          creator_name: (r.profiles as any)?.full_name || 'Utilisateur inconnu',
          creator_avatar: (r.profiles as any)?.avatar_url,
        })) || [];

      console.log(`[Maintenance] ✅ Fetched ${enriched.length} requests`);
      return enriched;
    } catch (error) {
      console.error('[Maintenance] ❌ Failed to fetch requests:', error);
      return [];
    }
  }

  /**
   * Get a single maintenance request by ID
   */
  async getRequest(requestId: string): Promise<MaintenanceRequestWithCreator | null> {
    try {
      const { data, error } = await this.supabase
        .from('maintenance_requests')
        .select(
          `
          *,
          profiles!created_by (
            full_name,
            avatar_url
          )
        `
        )
        .eq('id', requestId)
        .single();

      if (error) throw error;

      const enriched: MaintenanceRequestWithCreator = {
        ...data,
        creator_name: (data.profiles as any)?.full_name || 'Utilisateur inconnu',
        creator_avatar: (data.profiles as any)?.avatar_url,
      };

      return enriched;
    } catch (error) {
      console.error('[Maintenance] ❌ Failed to fetch request:', error);
      return null;
    }
  }

  /**
   * Create a new maintenance request
   */
  async createRequest(
    propertyId: string,
    userId: string,
    form: CreateMaintenanceForm
  ): Promise<{ success: boolean; request?: MaintenanceRequest; error?: string }> {
    try {
      let imageUrls: string[] = [];

      // Upload images if provided
      if (form.images && form.images.length > 0) {
        const uploadResults = await this.uploadImages(propertyId, userId, form.images);
        imageUrls = uploadResults.filter((url) => url !== null) as string[];
      }

      // Create request
      const { data: request, error } = await this.supabase
        .from('maintenance_requests')
        .insert({
          property_id: propertyId,
          created_by: userId,
          title: form.title,
          description: form.description,
          category: form.category,
          priority: form.priority,
          location: form.location || null,
          images: imageUrls,
          estimated_cost: form.estimated_cost ? parseFloat(form.estimated_cost) : null,
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;

      console.log('[Maintenance] ✅ Request created:', request.id);

      return { success: true, request };
    } catch (error: any) {
      console.error('[Maintenance] ❌ Failed to create request:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la création de la demande',
      };
    }
  }

  /**
   * Update a maintenance request
   */
  async updateRequest(
    requestId: string,
    updates: Partial<MaintenanceRequest>
  ): Promise<{ success: boolean; request?: MaintenanceRequest; error?: string }> {
    try {
      const updateData: any = { ...updates };

      // If status is being changed to 'resolved', set resolved_at
      if (updates.status === 'resolved' && !updateData.resolved_at) {
        updateData.resolved_at = new Date().toISOString();
      }

      const { data: request, error } = await this.supabase
        .from('maintenance_requests')
        .update(updateData)
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;

      console.log('[Maintenance] ✅ Request updated:', request.id);

      return { success: true, request };
    } catch (error: any) {
      console.error('[Maintenance] ❌ Failed to update request:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour',
      };
    }
  }

  /**
   * Update request status
   */
  async updateStatus(
    requestId: string,
    status: MaintenanceStatus
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = { status };

      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await this.supabase
        .from('maintenance_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      console.log(`[Maintenance] ✅ Status updated to '${status}'`);

      return { success: true };
    } catch (error: any) {
      console.error('[Maintenance] ❌ Failed to update status:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour du statut',
      };
    }
  }

  /**
   * Delete a maintenance request
   */
  async deleteRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      console.log('[Maintenance] ✅ Request deleted:', requestId);

      return { success: true };
    } catch (error: any) {
      console.error('[Maintenance] ❌ Failed to delete request:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression',
      };
    }
  }

  /**
   * Upload maintenance images to Supabase Storage
   */
  private async uploadImages(
    propertyId: string,
    userId: string,
    files: File[]
  ): Promise<(string | null)[]> {
    const uploadPromises = files.map(async (file) => {
      try {
        const fileName = `maintenance/${propertyId}/${userId}/${Date.now()}_${file.name}`;

        const { data, error } = await this.supabase.storage
          .from('property-documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        // Get public URL
        const {
          data: { publicUrl },
        } = this.supabase.storage.from('property-documents').getPublicUrl(data.path);

        return publicUrl;
      } catch (error) {
        console.error('[Maintenance] ❌ Failed to upload image:', error);
        return null;
      }
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Get maintenance statistics for a property
   */
  async getStats(propertyId: string): Promise<MaintenanceStats> {
    try {
      const { data: requests } = await this.supabase
        .from('maintenance_requests')
        .select('*')
        .eq('property_id', propertyId);

      if (!requests || requests.length === 0) {
        return {
          total_requests: 0,
          open_count: 0,
          in_progress_count: 0,
          resolved_count: 0,
          avg_resolution_time_hours: 0,
          total_cost: 0,
          by_category: {} as any,
          by_priority: {} as any,
        };
      }

      // Count by status
      const open_count = requests.filter((r) => r.status === 'open').length;
      const in_progress_count = requests.filter((r) => r.status === 'in_progress').length;
      const resolved_count = requests.filter((r) => r.status === 'resolved').length;

      // Calculate average resolution time
      const resolvedRequests = requests.filter((r) => r.resolved_at && r.created_at);
      const avgResolutionHours =
        resolvedRequests.length > 0
          ? resolvedRequests.reduce((sum, r) => {
              const created = new Date(r.created_at).getTime();
              const resolved = new Date(r.resolved_at!).getTime();
              const hours = (resolved - created) / (1000 * 60 * 60);
              return sum + hours;
            }, 0) / resolvedRequests.length
          : 0;

      // Calculate total cost
      const total_cost = requests.reduce((sum, r) => sum + Number(r.actual_cost || 0), 0);

      // Count by category
      const by_category = requests.reduce((acc: any, r) => {
        acc[r.category] = (acc[r.category] || 0) + 1;
        return acc;
      }, {});

      // Count by priority
      const by_priority = requests.reduce((acc: any, r) => {
        acc[r.priority] = (acc[r.priority] || 0) + 1;
        return acc;
      }, {});

      return {
        total_requests: requests.length,
        open_count,
        in_progress_count,
        resolved_count,
        avg_resolution_time_hours: Math.round(avgResolutionHours),
        total_cost,
        by_category,
        by_priority,
      };
    } catch (error) {
      console.error('[Maintenance] ❌ Failed to calculate stats:', error);
      return {
        total_requests: 0,
        open_count: 0,
        in_progress_count: 0,
        resolved_count: 0,
        avg_resolution_time_hours: 0,
        total_cost: 0,
        by_category: {} as any,
        by_priority: {} as any,
      };
    }
  }

  /**
   * Get open requests count (for badges/notifications)
   */
  async getOpenCount(propertyId: string): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('maintenance_requests')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', propertyId)
        .eq('status', 'open');

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('[Maintenance] ❌ Failed to get open count:', error);
      return 0;
    }
  }
}

export const maintenanceService = new MaintenanceService();
