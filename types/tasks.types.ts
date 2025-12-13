/**
 * Task Types for EasyCo Resident Hub
 * Includes: Tasks, Rotations, Exchanges, Availability
 */

// ============================================================================
// TASK TYPES
// ============================================================================

export type TaskCategory = 'cleaning' | 'groceries' | 'maintenance' | 'admin' | 'other';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface Task {
  id: string;
  property_id: string;
  created_by: string;
  assigned_to: string;

  // Basic info
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;

  // Scheduling
  due_date?: string; // ISO date
  recurrence: TaskRecurrence;

  // Completion
  completed_at?: string;
  proof_image_url?: string;
  completion_notes?: string;

  // Tracking
  skip_count: number;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface TaskWithDetails extends Task {
  assigned_to_name?: string;
  assigned_to_avatar?: string;
  created_by_name?: string;
  has_rotation: boolean;
  days_until_due?: number;
  is_overdue: boolean;
}

// ============================================================================
// ROTATION TYPES
// ============================================================================

export type RotationFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface TaskRotation {
  id: string;
  task_id: string;

  // Configuration
  rotation_order: string[]; // Array of user IDs
  current_position: number;

  // Frequency
  frequency: RotationFrequency;
  rotation_day?: number; // 0-6 for weekly, 1-31 for monthly

  // Tracking
  last_rotated_at?: string;
  next_rotation_at?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface TaskRotationWithUsers extends TaskRotation {
  users: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  current_assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
  next_assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// ============================================================================
// EXCHANGE TYPES
// ============================================================================

export type ExchangeStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export interface TaskExchange {
  id: string;
  task_id: string;

  // Participants
  requester_id: string;
  target_id: string;

  // Dates
  original_date: string; // ISO date
  proposed_date?: string; // ISO date

  // Status
  status: ExchangeStatus;

  // Response
  responded_at?: string;
  message?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface TaskExchangeWithDetails extends TaskExchange {
  task_title: string;
  requester_name: string;
  requester_avatar?: string;
  target_name: string;
  target_avatar?: string;
}

// ============================================================================
// AVAILABILITY TYPES
// ============================================================================

export type UnavailabilityReason = 'vacation' | 'work_trip' | 'illness' | 'other';

export interface UserAvailability {
  id: string;
  user_id: string;
  property_id: string;

  // Period
  unavailable_from: string; // ISO date
  unavailable_to: string; // ISO date

  // Reason
  reason: UnavailabilityReason;
  notes?: string;

  // Behavior
  auto_reassign: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// STATS & ANALYTICS TYPES
// ============================================================================

export interface TaskStats {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  completion_rate: number; // Percentage

  // By category
  by_category: Array<{
    category: TaskCategory;
    count: number;
    completed: number;
  }>;

  // By user
  by_user: Array<{
    user_id: string;
    user_name: string;
    total: number;
    completed: number;
    completion_rate: number;
  }>;
}

export interface RotationStats {
  total_rotations: number;
  active_rotations: number;
  upcoming_rotations: Array<{
    task_id: string;
    task_title: string;
    next_rotation_at: string;
    next_assignee_name: string;
  }>;
}

// ============================================================================
// FORM TYPES (UI)
// ============================================================================

export interface CreateTaskForm {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  due_date: string;
  recurrence: TaskRecurrence;
  assigned_to?: string; // If null, will be auto-assigned via rotation
}

export interface SetupRotationForm {
  task_id: string;
  user_ids: string[]; // Order matters
  frequency: RotationFrequency;
  rotation_day?: number;
  start_immediately: boolean;
}

export interface RequestExchangeForm {
  task_id: string;
  target_user_id: string;
  original_date: string;
  proposed_date?: string;
  message?: string;
}

export interface SetAvailabilityForm {
  unavailable_from: string;
  unavailable_to: string;
  reason: UnavailabilityReason;
  notes: string;
  auto_reassign: boolean;
}

export interface CompleteTaskForm {
  task_id: string;
  completion_notes: string;
  proof_photo?: File;
}

// ============================================================================
// VIEW TYPES
// ============================================================================

export interface UpcomingTask {
  task_id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  due_date: string;
  days_until_due: number;
  has_rotation: boolean;
  can_exchange: boolean;
}

export interface CalendarTask {
  id: string;
  title: string;
  date: string;
  category: TaskCategory;
  priority: TaskPriority;
  assigned_to: string;
  assigned_to_name: string;
  status: TaskStatus;
}

// ============================================================================
// ACTION TYPES
// ============================================================================

export interface RotateTaskResult {
  success: boolean;
  new_assignee?: string;
  new_assignee_name?: string;
  message: string;
}

export interface ExchangeResponse {
  exchange_id: string;
  status: 'accepted' | 'declined';
  message?: string;
}
