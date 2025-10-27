'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { toasts } from '@/lib/toast-helpers';

export interface Application {
  id: string;
  property_id: string;
  applicant_id: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'withdrawn' | 'expired';
  desired_move_in_date?: string;
  lease_duration_months?: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  occupation?: string;
  monthly_income?: number;
  employer_name?: string;
  message?: string;
  id_document_url?: string;
  proof_of_income_url?: string;
  reference_letter_url?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  review_notes?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  property?: any;
}

export interface CreateApplicationData {
  property_id: string;
  desired_move_in_date?: string;
  lease_duration_months?: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  occupation?: string;
  monthly_income?: number;
  employer_name?: string;
  message?: string;
}

export function useApplications(userId?: string) {
  const supabase = createClient();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load applications (either for applicant or property owner)
  const loadApplications = useCallback(
    async (asOwner: boolean = false) => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        let query = supabase.from('applications').select('*, property:properties(*)');

        if (asOwner) {
          // Load applications for properties owned by this user
          const { data: properties } = await supabase
            .from('properties')
            .select('id')
            .eq('owner_id', userId);

          if (!properties || properties.length === 0) {
            setApplications([]);
            setIsLoading(false);
            return;
          }

          const propertyIds = properties.map(p => p.id);
          query = query.in('property_id', propertyIds);
        } else {
          // Load applications submitted by this user
          query = query.eq('applicant_id', userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        setApplications(data || []);
      } catch (error: any) {
        console.error('Error loading applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setIsLoading(false);
      }
    },
    [userId, supabase]
  );

  // Get a single application by ID
  const getApplication = useCallback(
    async (applicationId: string): Promise<Application | null> => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*, property:properties(*)')
          .eq('id', applicationId)
          .single();

        if (error) throw error;

        return data;
      } catch (error: any) {
        console.error('Error loading application:', error);
        toast.error('Failed to load application');
        return null;
      }
    },
    [supabase]
  );

  // Check if user has already applied for a property
  const hasApplied = useCallback(
    async (propertyId: string): Promise<boolean> => {
      if (!userId) return false;

      try {
        const { data, error } = await supabase
          .from('applications')
          .select('id')
          .eq('property_id', propertyId)
          .eq('applicant_id', userId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;

        return !!data;
      } catch (error: any) {
        console.error('Error checking application:', error);
        return false;
      }
    },
    [userId, supabase]
  );

  // Create a new application
  const createApplication = useCallback(
    async (applicationData: CreateApplicationData): Promise<boolean> => {
      if (!userId) {
        toasts.permissionDenied();
        return false;
      }

      try {
        // Check if already applied
        const alreadyApplied = await hasApplied(applicationData.property_id);
        if (alreadyApplied) {
          toasts.validationError('application - you already applied');
          return false;
        }

        const { error } = await supabase.from('applications').insert({
          ...applicationData,
          applicant_id: userId,
          status: 'pending',
        });

        if (error) throw error;

        toasts.applicationSubmitted();
        await loadApplications();
        return true;
      } catch (error: any) {
        console.error('Error creating application:', error);
        toasts.serverError();
        return false;
      }
    },
    [userId, supabase, hasApplied, loadApplications]
  );

  // Update application status (for owners)
  const updateApplicationStatus = useCallback(
    async (
      applicationId: string,
      status: Application['status'],
      reviewNotes?: string,
      rejectionReason?: string
    ): Promise<boolean> => {
      try {
        const updateData: any = {
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId,
        };

        if (reviewNotes) updateData.review_notes = reviewNotes;
        if (rejectionReason) updateData.rejection_reason = rejectionReason;

        const { error } = await supabase
          .from('applications')
          .update(updateData)
          .eq('id', applicationId);

        if (error) throw error;

        toast.success(`Application ${status}`);
        await loadApplications(true);
        return true;
      } catch (error: any) {
        console.error('Error updating application:', error);
        toast.error('Failed to update application');
        return false;
      }
    },
    [userId, supabase, loadApplications]
  );

  // Withdraw application (for applicants)
  const withdrawApplication = useCallback(
    async (applicationId: string): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('applications')
          .update({ status: 'withdrawn' })
          .eq('id', applicationId)
          .eq('applicant_id', userId);

        if (error) throw error;

        toast.success('Application withdrawn');
        await loadApplications();
        return true;
      } catch (error: any) {
        console.error('Error withdrawing application:', error);
        toast.error('Failed to withdraw application');
        return false;
      }
    },
    [userId, supabase, loadApplications]
  );

  // Delete application (only pending ones)
  const deleteApplication = useCallback(
    async (applicationId: string): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', applicationId)
          .eq('applicant_id', userId)
          .eq('status', 'pending');

        if (error) throw error;

        toast.success('Application deleted');
        await loadApplications();
        return true;
      } catch (error: any) {
        console.error('Error deleting application:', error);
        toast.error('Failed to delete application');
        return false;
      }
    },
    [userId, supabase, loadApplications]
  );

  // Get application statistics (for owners)
  const getApplicationStats = useCallback(
    async (propertyId?: string) => {
      if (!userId) return null;

      try {
        let query = supabase
          .from('applications')
          .select('status', { count: 'exact', head: false });

        if (propertyId) {
          query = query.eq('property_id', propertyId);
        } else {
          // Get all properties owned by user
          const { data: properties } = await supabase
            .from('properties')
            .select('id')
            .eq('owner_id', userId);

          if (!properties || properties.length === 0) {
            return { total: 0, pending: 0, reviewing: 0, approved: 0, rejected: 0 };
          }

          const propertyIds = properties.map(p => p.id);
          query = query.in('property_id', propertyIds);
        }

        const { data, error } = await query;

        if (error) throw error;

        const stats = {
          total: data.length,
          pending: data.filter(a => a.status === 'pending').length,
          reviewing: data.filter(a => a.status === 'reviewing').length,
          approved: data.filter(a => a.status === 'approved').length,
          rejected: data.filter(a => a.status === 'rejected').length,
        };

        return stats;
      } catch (error: any) {
        console.error('Error getting application stats:', error);
        return null;
      }
    },
    [userId, supabase]
  );

  // Initial load
  useEffect(() => {
    if (userId) {
      loadApplications();
    }
  }, [userId]);

  return {
    applications,
    isLoading,
    loadApplications,
    getApplication,
    hasApplied,
    createApplication,
    updateApplicationStatus,
    withdrawApplication,
    deleteApplication,
    getApplicationStats,
  };
}
