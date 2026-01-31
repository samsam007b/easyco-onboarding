/**
 * Vendor Service
 * Handles CRUD operations for vendors (prestataires) and vendor ratings
 */

import { createClient } from '@/lib/auth/supabase-client';

// =====================================================
// TYPES
// =====================================================

export type VendorCategory =
  | 'plumbing'
  | 'electrical'
  | 'heating'
  | 'appliances'
  | 'structural'
  | 'cleaning'
  | 'pest_control'
  | 'locksmith'
  | 'painting'
  | 'gardening'
  | 'general'
  | 'other';

export interface Vendor {
  id: string;
  ownerId: string;
  name: string;
  companyName?: string;
  category: VendorCategory;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  siret?: string;
  insuranceNumber?: string;
  isVerified: boolean;
  averageRating: number;
  totalRatings: number;
  totalJobs: number;
  isFavorite: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorRating {
  id: string;
  vendorId: string;
  maintenanceRequestId?: string;
  ownerId: string;
  propertyId?: string;
  overallRating: number;
  qualityRating?: number;
  punctualityRating?: number;
  priceRating?: number;
  communicationRating?: number;
  title?: string;
  comment?: string;
  jobType?: string;
  jobCost?: number;
  jobDate?: Date;
  wouldRecommend: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVendorData {
  name: string;
  companyName?: string;
  category: VendorCategory;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  siret?: string;
  insuranceNumber?: string;
  notes?: string;
  isFavorite?: boolean;
}

export interface CreateRatingData {
  vendorId: string;
  maintenanceRequestId?: string;
  propertyId?: string;
  overallRating: number;
  qualityRating?: number;
  punctualityRating?: number;
  priceRating?: number;
  communicationRating?: number;
  title?: string;
  comment?: string;
  jobType?: string;
  jobCost?: number;
  jobDate?: Date;
  wouldRecommend?: boolean;
}

// Category labels for UI
export const vendorCategoryLabels: Record<VendorCategory, string> = {
  plumbing: 'Plomberie',
  electrical: 'Electricite',
  heating: 'Chauffage',
  appliances: 'Electromenager',
  structural: 'Maconnerie',
  cleaning: 'Nettoyage',
  pest_control: 'Nuisibles',
  locksmith: 'Serrurerie',
  painting: 'Peinture',
  gardening: 'Jardinage',
  general: 'General',
  other: 'Autre',
};

// =====================================================
// SERVICE CLASS
// =====================================================

class VendorService {
  // Create fresh client for each request to ensure user session is current
  private getSupabase() {
    return createClient();
  }

  // =====================================================
  // VENDOR CRUD
  // =====================================================

  /**
   * Get all vendors for the current owner
   */
  async getVendors(ownerId: string): Promise<Vendor[]> {
    try {
      const { data, error } = await this.getSupabase()
        .from('vendors')
        .select('*')
        .eq('owner_id', ownerId)
        .order('is_favorite', { ascending: false })
        .order('average_rating', { ascending: false })
        .order('name', { ascending: true });

      if (error) {
        console.error('[VendorService] Error fetching vendors:', error);
        return [];
      }

      return (data || []).map(this.mapVendorFromDb);
    } catch (error) {
      console.error('[VendorService] Error:', error);
      return [];
    }
  }

  /**
   * Get vendors by category
   */
  async getVendorsByCategory(ownerId: string, category: VendorCategory): Promise<Vendor[]> {
    try {
      const { data, error } = await this.getSupabase()
        .from('vendors')
        .select('*')
        .eq('owner_id', ownerId)
        .eq('category', category)
        .order('is_favorite', { ascending: false })
        .order('average_rating', { ascending: false });

      if (error) {
        console.error('[VendorService] Error fetching vendors by category:', error);
        return [];
      }

      return (data || []).map(this.mapVendorFromDb);
    } catch (error) {
      console.error('[VendorService] Error:', error);
      return [];
    }
  }

  /**
   * Get a single vendor by ID
   */
  async getVendor(vendorId: string): Promise<Vendor | null> {
    try {
      const { data, error } = await this.getSupabase()
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (error) {
        console.error('[VendorService] Error fetching vendor:', error);
        return null;
      }

      return data ? this.mapVendorFromDb(data) : null;
    } catch (error) {
      console.error('[VendorService] Error:', error);
      return null;
    }
  }

  /**
   * Create a new vendor
   */
  async createVendor(ownerId: string, vendorData: CreateVendorData): Promise<Vendor | null> {
    try {
      const { data, error } = await this.getSupabase()
        .from('vendors')
        .insert({
          owner_id: ownerId,
          name: vendorData.name,
          company_name: vendorData.companyName,
          category: vendorData.category,
          phone: vendorData.phone,
          email: vendorData.email,
          address: vendorData.address,
          city: vendorData.city,
          postal_code: vendorData.postalCode,
          siret: vendorData.siret,
          insurance_number: vendorData.insuranceNumber,
          notes: vendorData.notes,
          is_favorite: vendorData.isFavorite || false,
        })
        .select()
        .single();

      if (error) {
        console.error('[VendorService] Error creating vendor:', error);
        return null;
      }

      return data ? this.mapVendorFromDb(data) : null;
    } catch (error) {
      console.error('[VendorService] Error:', error);
      return null;
    }
  }

  /**
   * Update a vendor
   */
  async updateVendor(vendorId: string, updates: Partial<CreateVendorData>): Promise<Vendor | null> {
    try {
      const { data, error } = await this.getSupabase()
        .from('vendors')
        .update({
          name: updates.name,
          company_name: updates.companyName,
          category: updates.category,
          phone: updates.phone,
          email: updates.email,
          address: updates.address,
          city: updates.city,
          postal_code: updates.postalCode,
          siret: updates.siret,
          insurance_number: updates.insuranceNumber,
          notes: updates.notes,
          is_favorite: updates.isFavorite,
        })
        .eq('id', vendorId)
        .select()
        .single();

      if (error) {
        console.error('[VendorService] Error updating vendor:', error);
        return null;
      }

      return data ? this.mapVendorFromDb(data) : null;
    } catch (error) {
      console.error('[VendorService] Error:', error);
      return null;
    }
  }

  /**
   * Toggle vendor favorite status
   */
  async toggleFavorite(vendorId: string, isFavorite: boolean): Promise<boolean> {
    try {
      const { error } = await this.getSupabase()
        .from('vendors')
        .update({ is_favorite: isFavorite })
        .eq('id', vendorId);

      if (error) {
        console.error('[VendorService] Error toggling favorite:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[VendorService] Error:', error);
      return false;
    }
  }

  /**
   * Delete a vendor
   */
  async deleteVendor(vendorId: string): Promise<boolean> {
    try {
      const { error } = await this.getSupabase()
        .from('vendors')
        .delete()
        .eq('id', vendorId);

      if (error) {
        console.error('[VendorService] Error deleting vendor:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[VendorService] Error:', error);
      return false;
    }
  }

  // =====================================================
  // VENDOR RATINGS
  // =====================================================

  /**
   * Get ratings for a vendor
   */
  async getVendorRatings(vendorId: string): Promise<VendorRating[]> {
    try {
      const { data, error } = await this.getSupabase()
        .from('vendor_ratings')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[VendorService] Error fetching ratings:', error);
        return [];
      }

      return (data || []).map(this.mapRatingFromDb);
    } catch (error) {
      console.error('[VendorService] Error:', error);
      return [];
    }
  }

  /**
   * Submit a rating for a vendor
   */
  async submitRating(ownerId: string, ratingData: CreateRatingData): Promise<VendorRating | null> {
    try {
      const { data, error } = await this.getSupabase()
        .from('vendor_ratings')
        .insert({
          vendor_id: ratingData.vendorId,
          maintenance_request_id: ratingData.maintenanceRequestId,
          owner_id: ownerId,
          property_id: ratingData.propertyId,
          overall_rating: ratingData.overallRating,
          quality_rating: ratingData.qualityRating,
          punctuality_rating: ratingData.punctualityRating,
          price_rating: ratingData.priceRating,
          communication_rating: ratingData.communicationRating,
          title: ratingData.title,
          comment: ratingData.comment,
          job_type: ratingData.jobType,
          job_cost: ratingData.jobCost,
          job_date: ratingData.jobDate?.toISOString().split('T')[0],
          would_recommend: ratingData.wouldRecommend ?? true,
        })
        .select()
        .single();

      if (error) {
        console.error('[VendorService] Error submitting rating:', error);
        return null;
      }

      // Mark maintenance request as rated if applicable
      if (ratingData.maintenanceRequestId) {
        await this.getSupabase()
          .from('maintenance_requests')
          .update({ vendor_rating_submitted: true })
          .eq('id', ratingData.maintenanceRequestId);
      }

      return data ? this.mapRatingFromDb(data) : null;
    } catch (error) {
      console.error('[VendorService] Error:', error);
      return null;
    }
  }

  /**
   * Check if a maintenance request has been rated
   */
  async isMaintenanceRated(maintenanceRequestId: string): Promise<boolean> {
    try {
      const { data, error } = await this.getSupabase()
        .from('vendor_ratings')
        .select('id')
        .eq('maintenance_request_id', maintenanceRequestId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.error('[VendorService] Error checking rating:', error);
      }

      return !!data;
    } catch (error) {
      console.error('[VendorService] Error:', error);
      return false;
    }
  }

  // =====================================================
  // ASSIGN VENDOR TO MAINTENANCE
  // =====================================================

  /**
   * Assign a vendor to a maintenance request
   */
  async assignVendorToMaintenance(maintenanceRequestId: string, vendorId: string): Promise<boolean> {
    try {
      // Get vendor name for the assigned_to field (for backwards compatibility)
      const vendor = await this.getVendor(vendorId);
      if (!vendor) return false;

      const { error } = await this.getSupabase()
        .from('maintenance_requests')
        .update({
          vendor_id: vendorId,
          assigned_to: vendor.name,
        })
        .eq('id', maintenanceRequestId);

      if (error) {
        console.error('[VendorService] Error assigning vendor:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[VendorService] Error:', error);
      return false;
    }
  }

  /**
   * Remove vendor from maintenance request
   */
  async unassignVendorFromMaintenance(maintenanceRequestId: string): Promise<boolean> {
    try {
      const { error } = await this.getSupabase()
        .from('maintenance_requests')
        .update({
          vendor_id: null,
          assigned_to: null,
        })
        .eq('id', maintenanceRequestId);

      if (error) {
        console.error('[VendorService] Error unassigning vendor:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[VendorService] Error:', error);
      return false;
    }
  }

  // =====================================================
  // HELPERS
  // =====================================================

  private mapVendorFromDb(row: any): Vendor {
    return {
      id: row.id,
      ownerId: row.owner_id,
      name: row.name,
      companyName: row.company_name,
      category: row.category,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      postalCode: row.postal_code,
      siret: row.siret,
      insuranceNumber: row.insurance_number,
      isVerified: row.is_verified,
      averageRating: parseFloat(row.average_rating) || 0,
      totalRatings: row.total_ratings || 0,
      totalJobs: row.total_jobs || 0,
      isFavorite: row.is_favorite,
      notes: row.notes,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  private mapRatingFromDb(row: any): VendorRating {
    return {
      id: row.id,
      vendorId: row.vendor_id,
      maintenanceRequestId: row.maintenance_request_id,
      ownerId: row.owner_id,
      propertyId: row.property_id,
      overallRating: row.overall_rating,
      qualityRating: row.quality_rating,
      punctualityRating: row.punctuality_rating,
      priceRating: row.price_rating,
      communicationRating: row.communication_rating,
      title: row.title,
      comment: row.comment,
      jobType: row.job_type,
      jobCost: row.job_cost ? parseFloat(row.job_cost) : undefined,
      jobDate: row.job_date ? new Date(row.job_date) : undefined,
      wouldRecommend: row.would_recommend,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

export const vendorService = new VendorService();
