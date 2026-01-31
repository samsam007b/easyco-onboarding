/**
 * Maintenance Request Service
 * Handles: Issue reporting, tracking, photo uploads, cost management
 */

import { createClient } from '@/lib/auth/supabase-client';

// ============================================================================
// i18n TRANSLATIONS
// ============================================================================
type Language = 'fr' | 'en' | 'nl' | 'de';

let currentLang: Language = 'fr';

export function setMaintenanceServiceLanguage(lang: Language) {
  currentLang = lang;
}

const translations = {
  unknownUser: {
    fr: 'Utilisateur inconnu',
    en: 'Unknown user',
    nl: 'Onbekende gebruiker',
    de: 'Unbekannter Benutzer',
  },
  property: {
    fr: 'Propriété',
    en: 'Property',
    nl: 'Eigendom',
    de: 'Immobilie',
  },
  errors: {
    createRequest: {
      fr: 'Erreur lors de la création de la demande',
      en: 'Error creating the request',
      nl: 'Fout bij het aanmaken van het verzoek',
      de: 'Fehler beim Erstellen der Anfrage',
    },
    updateRequest: {
      fr: 'Erreur lors de la mise à jour',
      en: 'Error updating the request',
      nl: 'Fout bij het bijwerken',
      de: 'Fehler beim Aktualisieren',
    },
    updateStatus: {
      fr: 'Erreur lors de la mise à jour du statut',
      en: 'Error updating the status',
      nl: 'Fout bij het bijwerken van de status',
      de: 'Fehler beim Aktualisieren des Status',
    },
    deleteRequest: {
      fr: 'Erreur lors de la suppression',
      en: 'Error deleting the request',
      nl: 'Fout bij het verwijderen',
      de: 'Fehler beim Löschen',
    },
  },
};
import type {
  MaintenanceRequest,
  MaintenanceRequestWithCreator,
  MaintenanceRequestWithProperty,
  MaintenanceCategory,
  MaintenancePriority,
  CreateMaintenanceForm,
  UpdateMaintenanceForm,
  MaintenanceStats,
  MaintenanceStatus,
} from '@/types/maintenance.types';

/** Property info for batch fetching */
interface PropertyInfo {
  id: string;
  title: string;  // Note: properties table uses 'title' not 'name'
}

/** Internal type for maintenance request with joined profile data */
interface RequestWithProfile {
  id: string;
  property_id: string;
  created_by: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  location?: string;
  images: string[];
  estimated_cost?: number;
  actual_cost?: number;
  assigned_to?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

class MaintenanceService {
  // Create fresh client for each request to ensure user session is current
  private getSupabase() {
    return createClient();
  }

  /**
   * Get maintenance requests for multiple properties (batch query - fixes N+1)
   * Returns requests enriched with property_name
   */
  async getRequestsForProperties(
    properties: PropertyInfo[],
    filters?: {
      status?: MaintenanceStatus[];
      category?: string;
    }
  ): Promise<MaintenanceRequestWithProperty[]> {
    try {
      if (properties.length === 0) return [];

      const propertyIds = properties.map(p => p.id);
      const propertyMap = new Map(properties.map(p => [p.id, p.title]));

      let query = this.getSupabase()
        .from('maintenance_requests')
        .select(`
          *,
          profiles!created_by (
            full_name,
            avatar_url
          )
        `)
        .in('property_id', propertyIds)
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

      const enriched: MaintenanceRequestWithProperty[] =
        (data as RequestWithProfile[] | null)?.map((r) => ({
          id: r.id,
          property_id: r.property_id,
          created_by: r.created_by,
          title: r.title,
          description: r.description,
          category: r.category,
          priority: r.priority,
          status: r.status,
          location: r.location,
          images: r.images,
          estimated_cost: r.estimated_cost,
          actual_cost: r.actual_cost,
          assigned_to: r.assigned_to,
          resolved_at: r.resolved_at,
          created_at: r.created_at,
          updated_at: r.updated_at,
          creator_name: r.profiles?.full_name || translations.unknownUser[currentLang],
          creator_avatar: r.profiles?.avatar_url,
          property_name: propertyMap.get(r.property_id) || translations.property[currentLang],
        })) || [];

      console.log(`[Maintenance] OK: Batch fetched ${enriched.length} requests for ${properties.length} properties`);
      return enriched;
    } catch (error) {
      console.error('[Maintenance] ERROR: Failed to batch fetch requests:', error);
      return [];
    }
  }

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
      let query = this.getSupabase()
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
        (data as RequestWithProfile[] | null)?.map((r) => ({
          ...r,
          creator_name: r.profiles?.full_name || translations.unknownUser[currentLang],
          creator_avatar: r.profiles?.avatar_url,
        })) || [];

      console.log(`[Maintenance] OK: Fetched ${enriched.length} requests`);
      return enriched;
    } catch (error) {
      console.error('[Maintenance] ERROR: Failed to fetch requests:', error);
      return [];
    }
  }

  /**
   * Get a single maintenance request by ID
   */
  async getRequest(requestId: string): Promise<MaintenanceRequestWithCreator | null> {
    try {
      const { data, error } = await this.getSupabase()
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

      const typedData = data as RequestWithProfile;
      const enriched: MaintenanceRequestWithCreator = {
        ...typedData,
        creator_name: typedData.profiles?.full_name || translations.unknownUser[currentLang],
        creator_avatar: typedData.profiles?.avatar_url,
      };

      return enriched;
    } catch (error) {
      console.error('[Maintenance] ERROR: Failed to fetch request:', error);
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
      const { data: request, error } = await this.getSupabase()
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

      console.log('[Maintenance] OK: Request created:', request.id);

      return { success: true, request };
    } catch (error: any) {
      console.error('[Maintenance] ERROR: Failed to create request:', error);
      return {
        success: false,
        error: error.message || translations.errors.createRequest[currentLang],
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

      const { data: request, error } = await this.getSupabase()
        .from('maintenance_requests')
        .update(updateData)
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;

      console.log('[Maintenance] OK: Request updated:', request.id);

      return { success: true, request };
    } catch (error: any) {
      console.error('[Maintenance] ERROR: Failed to update request:', error);
      return {
        success: false,
        error: error.message || translations.errors.updateRequest[currentLang],
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

      const { error } = await this.getSupabase()
        .from('maintenance_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      console.log(`[Maintenance] OK: Status updated to '${status}'`);

      return { success: true };
    } catch (error: any) {
      console.error('[Maintenance] ERROR: Failed to update status:', error);
      return {
        success: false,
        error: error.message || translations.errors.updateStatus[currentLang],
      };
    }
  }

  /**
   * Delete a maintenance request
   */
  async deleteRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.getSupabase()
        .from('maintenance_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      console.log('[Maintenance] OK: Request deleted:', requestId);

      return { success: true };
    } catch (error: any) {
      console.error('[Maintenance] ERROR: Failed to delete request:', error);
      return {
        success: false,
        error: error.message || translations.errors.deleteRequest[currentLang],
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

        const { data, error } = await this.getSupabase().storage
          .from('property-documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        // Get public URL
        const {
          data: { publicUrl },
        } = this.getSupabase().storage.from('property-documents').getPublicUrl(data.path);

        return publicUrl;
      } catch (error) {
        console.error('[Maintenance] ERROR: Failed to upload image:', error);
        return null;
      }
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Get maintenance statistics for multiple properties (batch - fixes N+1)
   */
  async getStatsForProperties(propertyIds: string[]): Promise<Map<string, MaintenanceStats>> {
    const result = new Map<string, MaintenanceStats>();

    if (propertyIds.length === 0) return result;

    try {
      // Single query for all properties
      const { data: requests } = await this.getSupabase()
        .from('maintenance_requests')
        .select('*')
        .in('property_id', propertyIds);

      // Initialize empty stats for all properties
      propertyIds.forEach(id => {
        result.set(id, {
          total_requests: 0,
          open_count: 0,
          in_progress_count: 0,
          resolved_count: 0,
          avg_resolution_time_hours: 0,
          total_cost: 0,
          by_category: {} as Record<string, number>,
          by_priority: {} as Record<string, number>,
        });
      });

      if (!requests || requests.length === 0) return result;

      // Group requests by property and calculate stats
      const requestsByProperty = new Map<string, typeof requests>();
      requests.forEach(r => {
        const list = requestsByProperty.get(r.property_id) || [];
        list.push(r);
        requestsByProperty.set(r.property_id, list);
      });

      requestsByProperty.forEach((propRequests, propertyId) => {
        const open_count = propRequests.filter(r => r.status === 'open').length;
        const in_progress_count = propRequests.filter(r => r.status === 'in_progress').length;
        const resolved_count = propRequests.filter(r => r.status === 'resolved').length;

        // Average resolution time
        const resolvedRequests = propRequests.filter(r => r.resolved_at && r.created_at);
        const avgResolutionHours = resolvedRequests.length > 0
          ? resolvedRequests.reduce((sum, r) => {
              const created = new Date(r.created_at).getTime();
              const resolved = new Date(r.resolved_at!).getTime();
              return sum + (resolved - created) / (1000 * 60 * 60);
            }, 0) / resolvedRequests.length
          : 0;

        // Total cost
        const total_cost = propRequests.reduce((sum, r) => sum + Number(r.actual_cost || 0), 0);

        // Count by category
        const by_category = propRequests.reduce((acc: Record<string, number>, r) => {
          acc[r.category] = (acc[r.category] || 0) + 1;
          return acc;
        }, {});

        // Count by priority
        const by_priority = propRequests.reduce((acc: Record<string, number>, r) => {
          acc[r.priority] = (acc[r.priority] || 0) + 1;
          return acc;
        }, {});

        result.set(propertyId, {
          total_requests: propRequests.length,
          open_count,
          in_progress_count,
          resolved_count,
          avg_resolution_time_hours: Math.round(avgResolutionHours),
          total_cost,
          by_category,
          by_priority,
        });
      });

      console.log(`[Maintenance] OK: Batch stats for ${propertyIds.length} properties`);
      return result;
    } catch (error) {
      console.error('[Maintenance] ERROR: Failed to batch fetch stats:', error);
      return result;
    }
  }

  /**
   * Get maintenance statistics for a property
   */
  async getStats(propertyId: string): Promise<MaintenanceStats> {
    try {
      const { data: requests } = await this.getSupabase()
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
      console.error('[Maintenance] ERROR: Failed to calculate stats:', error);
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
      const { count, error } = await this.getSupabase()
        .from('maintenance_requests')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', propertyId)
        .eq('status', 'open');

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('[Maintenance] ERROR: Failed to get open count:', error);
      return 0;
    }
  }
}

export const maintenanceService = new MaintenanceService();
