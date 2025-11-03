export interface VirtualTourInfo {
  property_id: string;
  has_virtual_tour: boolean;
  virtual_tour_url?: string;
  virtual_tour_type?: 'matterport' | 'youtube360' | 'custom';
  tour_embed_code?: string;
}

export interface PropertyTour {
  id: string;
  property_id: string;
  user_id: string;
  tour_type: 'virtual' | 'physical';
  scheduled_at: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  confirmed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  attendees_count: number;
  attendee_names?: string[];
  user_notes?: string;
  owner_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VirtualTourView {
  id: string;
  property_id: string;
  user_id?: string;
  view_duration?: number;
  completed: boolean;
  viewed_at: string;
  session_id?: string;
}

export interface ScheduleTourInput {
  property_id: string;
  tour_type: 'virtual' | 'physical';
  scheduled_at: string;
  duration_minutes?: number;
  attendees_count?: number;
  attendee_names?: string[];
  user_notes?: string;
}

export interface UpdateTourInput {
  scheduled_at?: string;
  duration_minutes?: number;
  attendees_count?: number;
  attendee_names?: string[];
  user_notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cancellation_reason?: string;
}

export interface UpcomingTour {
  tour_id: string;
  property_id: string;
  property_title: string;
  tour_type: 'virtual' | 'physical';
  scheduled_at: string;
  status: string;
}
