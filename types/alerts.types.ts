export interface PropertyAlert {
  id: string;
  user_id: string;
  name: string;
  criteria: AlertCriteria;
  is_active: boolean;
  email_notifications: boolean;
  in_app_notifications: boolean;
  notification_frequency: 'instant' | 'daily' | 'weekly';
  created_at: string;
  updated_at: string;
  last_notified_at?: string;
}

export interface AlertCriteria {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  propertyType?: string;
  amenities?: string[];
  furnished?: boolean | null;
}

export interface PropertyNotification {
  id: string;
  user_id: string;
  property_id: string;
  alert_id?: string;
  type: 'new_property' | 'price_drop' | 'status_change' | 'new_match';
  title: string;
  message?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface CreateAlertInput {
  name: string;
  criteria: AlertCriteria;
  email_notifications?: boolean;
  in_app_notifications?: boolean;
  notification_frequency?: 'instant' | 'daily' | 'weekly';
}

export interface UpdateAlertInput {
  name?: string;
  criteria?: AlertCriteria;
  is_active?: boolean;
  email_notifications?: boolean;
  in_app_notifications?: boolean;
  notification_frequency?: 'instant' | 'daily' | 'weekly';
}
