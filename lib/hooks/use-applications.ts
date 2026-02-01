'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { toasts } from '@/lib/toast-helpers';
import { logger } from '@/lib/utils/logger';
import { getHookTranslation } from '@/lib/i18n/get-language';

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

export interface GroupApplication {
  id: string;
  group_id: string;
  property_id: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'withdrawn';
  message?: string;
  combined_income?: number;
  reviewed_at?: string;
  reviewed_by?: string;
  review_notes?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  group?: {
    id: string;
    name: string;
    description?: string;
    max_members: number;
    members: Array<{
      user: {
        id: string;
        full_name: string;
        email: string;
      };
    }>;
  };
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
  const [groupApplications, setGroupApplications] = useState<GroupApplication[]>([]);
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
            setGroupApplications([]);
            setIsLoading(false);
            return;
          }

          const propertyIds = properties.map(p => p.id);
          query = query.in('property_id', propertyIds);

          // Also load group applications for these properties
          const { data: groupApps, error: groupError } = await supabase
            .from('group_applications')
            .select(`
              *,
              group:groups(
                id,
                name,
                description,
                max_members,
                members:group_members(
                  user:users(id, full_name, email)
                )
              ),
              property:properties(*)
            `)
            .in('property_id', propertyIds)
            .order('created_at', { ascending: false });

          if (groupError) {
            logger.supabaseError('load group applications', groupError, {
              userId,
              propertyIds: propertyIds.slice(0, 5), // Log first 5 IDs only
            });
            setGroupApplications([]);
          } else {
            setGroupApplications(groupApps || []);
          }
        } else {
          // Load applications submitted by this user
          query = query.eq('applicant_id', userId);
          setGroupApplications([]); // No group apps for applicant view
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        setApplications(data || []);
      } catch (error: any) {
        logger.supabaseError('load applications', error, {
          userId,
          asOwner,
        });
        toast.error(getHookTranslation('applications', 'loadFailed'));
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
        logger.supabaseError('get application', error, { applicationId });
        toast.error(getHookTranslation('applications', 'loadSingleFailed'));
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
        logger.supabaseError('check application', error, { userId, propertyId });
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
        logger.supabaseError('create application', error, { userId, propertyId: applicationData.property_id });
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
        logger.supabaseError('update application status', error, { applicationId, status });
        toast.error(getHookTranslation('applications', 'updateFailed'));
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

        toast.success(getHookTranslation('applications', 'withdrawn'));
        await loadApplications();
        return true;
      } catch (error: any) {
        logger.supabaseError('withdraw application', error, { applicationId, userId });
        toast.error(getHookTranslation('applications', 'withdrawFailed'));
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

        toast.success(getHookTranslation('applications', 'deleted'));
        await loadApplications();
        return true;
      } catch (error: any) {
        logger.supabaseError('delete application', error, { applicationId, userId });
        toast.error(getHookTranslation('applications', 'deleteFailed'));
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
        logger.supabaseError('get application stats', error, { userId, propertyId });
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

  // Update group application status (approve/reject)
  const updateGroupApplicationStatus = useCallback(
    async (
      groupApplicationId: string,
      newStatus: GroupApplication['status'],
      rejectionReason?: string
    ): Promise<boolean> => {
      try {
        const updateData: any = {
          status: newStatus,
          updated_at: new Date().toISOString(),
        };

        if (newStatus === 'approved' || newStatus === 'rejected') {
          updateData.reviewed_at = new Date().toISOString();
          updateData.reviewed_by = userId;
          if (newStatus === 'rejected' && rejectionReason) {
            updateData.rejection_reason = rejectionReason;
          }
        }

        const { error } = await supabase
          .from('group_applications')
          .update(updateData)
          .eq('id', groupApplicationId);

        if (error) throw error;

        toast.success(`Group application ${newStatus}!`);
        return true;
      } catch (error: any) {
        logger.supabaseError('update group application status', error, { groupApplicationId, newStatus });
        toast.error(getHookTranslation('applications', 'updateGroupFailed'));
        return false;
      }
    },
    [userId, supabase]
  );

  return {
    applications,
    groupApplications,
    isLoading,
    loadApplications,
    getApplication,
    hasApplied,
    createApplication,
    updateApplicationStatus,
    updateGroupApplicationStatus,
    withdrawApplication,
    deleteApplication,
    getApplicationStats,
  };
}
