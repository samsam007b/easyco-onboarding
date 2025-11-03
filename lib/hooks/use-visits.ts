'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';

export type VisitType = 'in_person' | 'virtual';
export type VisitStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled_by_visitor'
  | 'cancelled_by_owner'
  | 'no_show';

export interface PropertyVisit {
  id: string;
  property_id: string;
  visitor_id: string;
  owner_id: string;
  scheduled_at: string;
  duration_minutes: number;
  visit_type: VisitType;
  status: VisitStatus;
  visitor_notes?: string;
  owner_response?: string;
  visitor_phone?: string;
  visitor_email?: string;
  meeting_url?: string;
  meeting_password?: string;
  visitor_rating?: number;
  visitor_feedback?: string;
  was_helpful?: boolean;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  completed_at?: string;
  cancelled_at?: string;

  // Joined data
  property?: {
    title: string;
    city: string;
    address: string;
    main_image_url?: string;
  };
  owner?: {
    full_name: string;
    email: string;
    phone?: string;
  };
  visitor?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

export interface TimeSlot {
  id: string;
  slot_name: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  is_active: boolean;
}

export interface AvailableSlot {
  slot_start: string;
  slot_end: string;
  is_available: boolean;
}

export interface VisitAvailability {
  id: string;
  property_id: string;
  owner_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  notes?: string;
  max_visits_per_day: number;
  buffer_minutes: number;
}

export interface BookVisitParams {
  property_id: string;
  owner_id: string;
  scheduled_at: string;
  duration_minutes: number;
  visit_type: VisitType;
  visitor_notes?: string;
  visitor_phone?: string;
  visitor_email?: string;
}

export function useVisits() {
  const supabase = createClient();
  const [visits, setVisits] = useState<PropertyVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's visits (as visitor)
  const fetchMyVisits = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('property_visits')
        .select(`
          *,
          property:properties(title, city, address, main_image_url),
          owner:users!property_visits_owner_id_fkey(full_name, email, phone)
        `)
        .eq('visitor_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setVisits(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load visits');
    } finally {
      setLoading(false);
    }
  };

  // Fetch visits for property owner
  const fetchPropertyVisits = async (propertyId?: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('property_visits')
        .select(`
          *,
          property:properties(title, city, address, main_image_url),
          visitor:users!property_visits_visitor_id_fkey(full_name, email, phone)
        `)
        .eq('owner_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setVisits(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load visits');
    } finally {
      setLoading(false);
    }
  };

  // Get upcoming visits
  const getUpcomingVisits = () => {
    const now = new Date();
    return visits.filter(visit =>
      new Date(visit.scheduled_at) > now &&
      ['pending', 'confirmed'].includes(visit.status)
    );
  };

  // Get past visits
  const getPastVisits = () => {
    const now = new Date();
    return visits.filter(visit =>
      new Date(visit.scheduled_at) <= now ||
      ['completed', 'cancelled_by_visitor', 'cancelled_by_owner', 'no_show'].includes(visit.status)
    );
  };

  // Book a visit
  const bookVisit = async (params: BookVisitParams) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if slot is available
      const { data: isAvailable } = await supabase.rpc('is_slot_available', {
        p_property_id: params.property_id,
        p_scheduled_at: params.scheduled_at,
        p_duration_minutes: params.duration_minutes,
      });

      if (!isAvailable) {
        toast.error('This time slot is no longer available');
        return null;
      }

      // Create visit
      const { data, error } = await supabase
        .from('property_visits')
        .insert({
          ...params,
          visitor_id: user.id,
          status: 'pending',
        })
        .select(`
          *,
          property:properties(title, city, address, main_image_url),
          owner:users!property_visits_owner_id_fkey(full_name, email, phone)
        `)
        .single();

      if (error) throw error;

      toast.success('Visit booked successfully! The owner will confirm shortly.');
      await fetchMyVisits(); // Refresh list
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to book visit');
      return null;
    }
  };

  // Cancel visit (by visitor)
  const cancelVisit = async (visitId: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('property_visits')
        .update({
          status: 'cancelled_by_visitor',
          visitor_notes: reason,
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', visitId);

      if (error) throw error;

      toast.success('Visit cancelled');
      await fetchMyVisits();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel visit');
      return false;
    }
  };

  // Confirm visit (by owner)
  const confirmVisit = async (visitId: string, response?: string, meetingUrl?: string) => {
    try {
      const { error } = await supabase
        .from('property_visits')
        .update({
          status: 'confirmed',
          owner_response: response,
          meeting_url: meetingUrl,
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', visitId);

      if (error) throw error;

      toast.success('Visit confirmed');
      await fetchPropertyVisits();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to confirm visit');
      return false;
    }
  };

  // Mark visit as completed
  const completeVisit = async (visitId: string) => {
    try {
      const { error } = await supabase
        .from('property_visits')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', visitId);

      if (error) throw error;

      toast.success('Visit marked as completed');
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete visit');
      return false;
    }
  };

  // Add feedback to visit
  const addVisitFeedback = async (
    visitId: string,
    rating: number,
    feedback: string,
    wasHelpful: boolean
  ) => {
    try {
      const { error } = await supabase
        .from('property_visits')
        .update({
          visitor_rating: rating,
          visitor_feedback: feedback,
          was_helpful: wasHelpful,
        })
        .eq('id', visitId);

      if (error) throw error;

      toast.success('Thank you for your feedback!');
      await fetchMyVisits();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit feedback');
      return false;
    }
  };

  return {
    visits,
    loading,
    error,
    fetchMyVisits,
    fetchPropertyVisits,
    getUpcomingVisits,
    getPastVisits,
    bookVisit,
    cancelVisit,
    confirmVisit,
    completeVisit,
    addVisitFeedback,
  };
}

// Hook for managing time slots and availability
export function useVisitAvailability(propertyId?: string) {
  const supabase = createClient();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [availability, setAvailability] = useState<VisitAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch time slots
  const fetchTimeSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('visit_time_slots')
        .select('*')
        .eq('is_active', true)
        .order('start_time');

      if (error) throw error;
      setTimeSlots(data || []);
    } catch (err: any) {
      toast.error('Failed to load time slots');
    }
  };

  // Fetch owner availability for a property
  const fetchAvailability = async (propId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('visit_availability')
        .select('*')
        .eq('property_id', propId)
        .eq('is_available', true)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setAvailability(data || []);
    } catch (err: any) {
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  // Get available slots for a specific date
  const getAvailableSlots = async (propId: string, date: string): Promise<AvailableSlot[]> => {
    try {
      const { data, error } = await supabase.rpc('get_available_slots', {
        p_property_id: propId,
        p_date: date,
      });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      toast.error('Failed to load available slots');
      return [];
    }
  };

  // Set availability (for owners)
  const setPropertyAvailability = async (params: {
    property_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    notes?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('visit_availability')
        .upsert({
          ...params,
          owner_id: user.id,
          is_available: true,
        });

      if (error) throw error;

      toast.success('Availability updated');
      await fetchAvailability(params.property_id);
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update availability');
      return false;
    }
  };

  useEffect(() => {
    fetchTimeSlots();
    if (propertyId) {
      fetchAvailability(propertyId);
    }
  }, [propertyId]);

  return {
    timeSlots,
    availability,
    loading,
    fetchAvailability,
    getAvailableSlots,
    setPropertyAvailability,
  };
}
