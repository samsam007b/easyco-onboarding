/**
 * Maintenance Request Types
 * For tracking property issues and repairs
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type MaintenanceCategory =
  | 'plumbing'
  | 'electrical'
  | 'heating'
  | 'appliances'
  | 'structural'
  | 'cleaning'
  | 'pest_control'
  | 'other';

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'emergency';

export type MaintenanceStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  created_by: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  location?: string;
  images: string[]; // Array of image URLs
  estimated_cost?: number;
  actual_cost?: number;
  assigned_to?: string; // Service provider or roommate name
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ENRICHED TYPES (with joined data)
// ============================================================================

export interface MaintenanceRequestWithCreator extends MaintenanceRequest {
  creator_name: string;
  creator_avatar?: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CreateMaintenanceForm {
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  location?: string;
  images?: File[];
  estimated_cost?: string;
}

export interface UpdateMaintenanceForm {
  status?: MaintenanceStatus;
  assigned_to?: string;
  actual_cost?: string;
  notes?: string;
}

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

export interface MaintenanceStats {
  total_requests: number;
  open_count: number;
  in_progress_count: number;
  resolved_count: number;
  avg_resolution_time_hours: number;
  total_cost: number;
  by_category: Record<MaintenanceCategory, number>;
  by_priority: Record<MaintenancePriority, number>;
}

// ============================================================================
// UI HELPERS
// ============================================================================

export const MAINTENANCE_CATEGORIES: Array<{
  value: MaintenanceCategory;
  label: string;
  emoji: string;
  color: string;
}> = [
  { value: 'plumbing', label: 'Plomberie', emoji: '🚰', color: 'bg-blue-100 text-blue-700' },
  { value: 'electrical', label: 'Électricité', emoji: '⚡', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'heating', label: 'Chauffage', emoji: '🔥', color: 'bg-orange-100 text-orange-700' },
  { value: 'appliances', label: 'Électroménager', emoji: '🔌', color: 'bg-purple-100 text-purple-700' },
  { value: 'structural', label: 'Structure', emoji: '🏗️', color: 'bg-gray-100 text-gray-700' },
  { value: 'cleaning', label: 'Nettoyage', emoji: '🧹', color: 'bg-green-100 text-green-700' },
  { value: 'pest_control', label: 'Nuisibles', emoji: '🐛', color: 'bg-red-100 text-red-700' },
  { value: 'other', label: 'Autre', emoji: '🔧', color: 'bg-indigo-100 text-indigo-700' },
];

export const MAINTENANCE_PRIORITIES: Array<{
  value: MaintenancePriority;
  label: string;
  color: string;
  borderColor: string;
}> = [
  { value: 'low', label: 'Basse', color: 'bg-gray-100 text-gray-700', borderColor: 'border-gray-300' },
  { value: 'medium', label: 'Moyenne', color: 'bg-blue-100 text-blue-700', borderColor: 'border-blue-300' },
  { value: 'high', label: 'Haute', color: 'bg-orange-100 text-orange-700', borderColor: 'border-orange-300' },
  { value: 'emergency', label: 'Urgence', color: 'bg-red-100 text-red-700', borderColor: 'border-red-500' },
];

export const MAINTENANCE_STATUSES: Array<{
  value: MaintenanceStatus;
  label: string;
  color: string;
  icon: string;
}> = [
  { value: 'open', label: 'Ouvert', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: '🆕' },
  { value: 'in_progress', label: 'En cours', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: '⚙️' },
  { value: 'resolved', label: 'Résolu', color: 'bg-green-100 text-green-700 border-green-300', icon: '✅' },
  { value: 'closed', label: 'Fermé', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: '🔒' },
  { value: 'cancelled', label: 'Annulé', color: 'bg-red-100 text-red-700 border-red-300', icon: '❌' },
];
