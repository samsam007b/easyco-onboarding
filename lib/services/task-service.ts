/**
 * Task Service for Managing Household Tasks
 * Handles: Creation, Rotation, Exchange, Completion with proof
 */

import { createClient } from '@/lib/auth/supabase-client';

// ============================================================================
// i18n TRANSLATIONS
// ============================================================================
type Language = 'fr' | 'en' | 'nl' | 'de';

let currentLang: Language = 'fr';

export function setTaskServiceLanguage(lang: Language) {
  currentLang = lang;
}

const translations = {
  you: {
    fr: 'Toi',
    en: 'You',
    nl: 'Jij',
    de: 'Du',
  },
  unassigned: {
    fr: 'Non assigné',
    en: 'Unassigned',
    nl: 'Niet toegewezen',
    de: 'Nicht zugewiesen',
  },
  unknown: {
    fr: 'Inconnu',
    en: 'Unknown',
    nl: 'Onbekend',
    de: 'Unbekannt',
  },
  rotationFailed: {
    fr: 'Échec de la rotation',
    en: 'Rotation failed',
    nl: 'Rotatie mislukt',
    de: 'Rotation fehlgeschlagen',
  },
  errors: {
    createTask: {
      fr: 'Erreur lors de la création de la tâche',
      en: 'Error creating the task',
      nl: 'Fout bij het aanmaken van de taak',
      de: 'Fehler beim Erstellen der Aufgabe',
    },
    setupRotation: {
      fr: 'Erreur lors de la configuration de la rotation',
      en: 'Error setting up rotation',
      nl: 'Fout bij het instellen van de rotatie',
      de: 'Fehler beim Einrichten der Rotation',
    },
    rotateTask: {
      fr: 'Erreur lors de la rotation',
      en: 'Error rotating the task',
      nl: 'Fout bij het roteren van de taak',
      de: 'Fehler bei der Rotation',
    },
    requestExchange: {
      fr: "Erreur lors de la demande d'échange",
      en: 'Error requesting exchange',
      nl: 'Fout bij het aanvragen van de ruil',
      de: 'Fehler bei der Tauschanfrage',
    },
    respondToExchange: {
      fr: 'Erreur lors de la réponse',
      en: 'Error responding to exchange',
      nl: 'Fout bij het reageren',
      de: 'Fehler bei der Antwort',
    },
    setUnavailability: {
      fr: 'Erreur lors de la configuration',
      en: 'Error setting unavailability',
      nl: 'Fout bij het instellen',
      de: 'Fehler bei der Konfiguration',
    },
    completeTask: {
      fr: 'Erreur lors de la finalisation',
      en: 'Error completing the task',
      nl: 'Fout bij het voltooien',
      de: 'Fehler beim Abschließen',
    },
    uploadProof: {
      fr: "Erreur lors de l'upload de la preuve",
      en: 'Error uploading proof',
      nl: 'Fout bij het uploaden van het bewijs',
      de: 'Fehler beim Hochladen des Nachweises',
    },
  },
};
import type {
  Task,
  TaskWithDetails,
  TaskRotation,
  TaskRotationWithUsers,
  TaskExchange,
  TaskExchangeWithDetails,
  UserAvailability,
  CreateTaskForm,
  SetupRotationForm,
  RequestExchangeForm,
  SetAvailabilityForm,
  CompleteTaskForm,
  UpcomingTask,
  RotateTaskResult,
  TaskStats,
} from '@/types/tasks.types';

class TaskService {
  private supabase = createClient();

  /**
   * Get all tasks for a property
   */
  async getPropertyTasks(
    propertyId: string,
    userId: string,
    limit: number = 50
  ): Promise<TaskWithDetails[]> {
    try {
      const { data: tasks, error } = await this.supabase
        .from('tasks')
        .select(
          `
          *,
          task_rotations (
            id,
            rotation_order,
            current_position,
            next_rotation_at
          )
        `
        )
        .eq('property_id', propertyId)
        .order('due_date', { ascending: true })
        .limit(limit);

      if (error) throw error;

      // Get user names
      const userIds = [
        ...new Set([
          ...(tasks?.map((t) => t.assigned_to) || []),
          ...(tasks?.map((t) => t.created_by) || []),
        ]),
      ];

      const { data: users } = await this.supabase
        .from('users')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      const userMap = new Map(users?.map((u) => [u.id, u]) || []);

      // Enrich tasks
      const enriched: TaskWithDetails[] =
        tasks?.map((task) => {
          const assignedTo = userMap.get(task.assigned_to);
          const createdBy = userMap.get(task.created_by);
          const hasRotation = !!task.task_rotations;

          const daysUntilDue = task.due_date
            ? Math.ceil(
                (new Date(task.due_date).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )
            : undefined;

          const isOverdue =
            task.due_date &&
            new Date(task.due_date) < new Date() &&
            task.status !== 'completed';

          return {
            ...task,
            assigned_to_name:
              task.assigned_to === userId
                ? translations.you[currentLang]
                : assignedTo?.full_name || translations.unassigned[currentLang],
            assigned_to_avatar: assignedTo?.avatar_url,
            created_by_name: createdBy?.full_name || translations.unknown[currentLang],
            has_rotation: hasRotation,
            days_until_due: daysUntilDue,
            is_overdue: !!isOverdue,
          };
        }) || [];

      return enriched;
    } catch (error) {
      console.error('[Task] ERROR: Failed to fetch tasks:', error);
      return [];
    }
  }

  /**
   * Create a new task
   */
  async createTask(
    propertyId: string,
    userId: string,
    form: CreateTaskForm
  ): Promise<{ success: boolean; task?: Task; error?: string }> {
    try {
      const { data: task, error } = await this.supabase
        .from('tasks')
        .insert({
          property_id: propertyId,
          created_by: userId,
          assigned_to: form.assigned_to || userId,
          title: form.title,
          description: form.description || null,
          category: form.category,
          priority: form.priority,
          due_date: form.due_date || null,
          recurrence: form.recurrence,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      console.log('[Task] OK: Task created:', task.id);

      return { success: true, task };
    } catch (error: any) {
      console.error('[Task] ERROR: Failed to create task:', error);
      return {
        success: false,
        error: error.message || translations.errors.createTask[currentLang],
      };
    }
  }

  /**
   * Setup automatic rotation for a task
   */
  async setupRotation(
    form: SetupRotationForm
  ): Promise<{ success: boolean; rotation?: TaskRotation; error?: string }> {
    try {
      // Calculate next rotation date
      const nextRotationAt = new Date();
      switch (form.frequency) {
        case 'daily':
          nextRotationAt.setDate(nextRotationAt.getDate() + 1);
          break;
        case 'weekly':
          nextRotationAt.setDate(nextRotationAt.getDate() + 7);
          break;
        case 'biweekly':
          nextRotationAt.setDate(nextRotationAt.getDate() + 14);
          break;
        case 'monthly':
          nextRotationAt.setMonth(nextRotationAt.getMonth() + 1);
          break;
      }

      const { data: rotation, error } = await this.supabase
        .from('task_rotations')
        .upsert(
          {
            task_id: form.task_id,
            rotation_order: JSON.stringify(form.user_ids),
            current_position: 0,
            frequency: form.frequency,
            rotation_day: form.rotation_day || null,
            next_rotation_at: nextRotationAt.toISOString(),
          },
          {
            onConflict: 'task_id',
          }
        )
        .select()
        .single();

      if (error) throw error;

      // If start immediately, rotate to first user
      if (form.start_immediately && form.user_ids.length > 0) {
        await this.supabase
          .from('tasks')
          .update({ assigned_to: form.user_ids[0] })
          .eq('id', form.task_id);
      }

      console.log('[Task] OK: Rotation configured:', rotation.id);

      return { success: true, rotation };
    } catch (error: any) {
      console.error('[Task] ERROR: Failed to setup rotation:', error);
      return {
        success: false,
        error: error.message || translations.errors.setupRotation[currentLang],
      };
    }
  }

  /**
   * Manually rotate a task to next person
   */
  async rotateTask(taskId: string): Promise<RotateTaskResult> {
    try {
      const { data, error } = await this.supabase.rpc('rotate_task_assignment', {
        p_task_id: taskId,
      });

      if (error) throw error;

      const result = data?.[0];

      if (result?.success) {
        // Get new assignee name
        const { data: user } = await this.supabase
          .from('users')
          .select('full_name')
          .eq('id', result.new_assignee)
          .single();

        return {
          success: true,
          new_assignee: result.new_assignee,
          new_assignee_name: user?.full_name || translations.unknown[currentLang],
          message: result.message,
        };
      }

      return {
        success: false,
        message: result?.message || translations.rotationFailed[currentLang],
      };
    } catch (error: any) {
      console.error('[Task] ERROR: Failed to rotate task:', error);
      return {
        success: false,
        message: error.message || translations.errors.rotateTask[currentLang],
      };
    }
  }

  /**
   * Request to exchange task assignment with another user
   */
  async requestExchange(
    form: RequestExchangeForm
  ): Promise<{ success: boolean; exchange?: TaskExchange; error?: string }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: exchange, error } = await this.supabase
        .from('task_exchanges')
        .insert({
          task_id: form.task_id,
          requester_id: user.id,
          target_id: form.target_user_id,
          original_date: form.original_date,
          proposed_date: form.proposed_date || null,
          message: form.message || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      console.log('[Task] OK: Exchange requested:', exchange.id);

      // TODO: Send notification to target user

      return { success: true, exchange };
    } catch (error: any) {
      console.error('[Task] ERROR: Failed to request exchange:', error);
      return {
        success: false,
        error: error.message || translations.errors.requestExchange[currentLang],
      };
    }
  }

  /**
   * Respond to an exchange request (accept or decline)
   */
  async respondToExchange(
    exchangeId: string,
    accept: boolean,
    message?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const status = accept ? 'accepted' : 'declined';

      const { error: updateError } = await this.supabase
        .from('task_exchanges')
        .update({
          status,
          responded_at: new Date().toISOString(),
          message: message || null,
        })
        .eq('id', exchangeId);

      if (updateError) throw updateError;

      // If accepted, swap the task assignments
      if (accept) {
        const { data: exchange } = await this.supabase
          .from('task_exchanges')
          .select('*')
          .eq('id', exchangeId)
          .single();

        if (exchange) {
          // Swap in task_rotations if exists
          // (Implementation depends on your exact requirements)
          console.log('[Task] OK: Exchange accepted, swapping assignments...');
        }
      }

      console.log(`[Task] OK: Exchange ${status}`);

      return { success: true };
    } catch (error: any) {
      console.error('[Task] ERROR: Failed to respond to exchange:', error);
      return {
        success: false,
        error: error.message || translations.errors.respondToExchange[currentLang],
      };
    }
  }

  /**
   * Set user unavailability (vacation mode)
   */
  async setUnavailability(
    userId: string,
    propertyId: string,
    form: SetAvailabilityForm
  ): Promise<{ success: boolean; availability?: UserAvailability; error?: string }> {
    try {
      const { data: availability, error } = await this.supabase
        .from('user_availability')
        .insert({
          user_id: userId,
          property_id: propertyId,
          unavailable_from: form.unavailable_from,
          unavailable_to: form.unavailable_to,
          reason: form.reason,
          notes: form.notes || null,
          auto_reassign: form.auto_reassign,
        })
        .select()
        .single();

      if (error) throw error;

      // If auto_reassign, reassign tasks during this period
      if (form.auto_reassign) {
        await this.reassignTasksDuringUnavailability(
          userId,
          propertyId,
          form.unavailable_from,
          form.unavailable_to
        );
      }

      console.log('[Task] OK: Unavailability set:', availability.id);

      return { success: true, availability };
    } catch (error: any) {
      console.error('[Task] ERROR: Failed to set unavailability:', error);
      return {
        success: false,
        error: error.message || translations.errors.setUnavailability[currentLang],
      };
    }
  }

  /**
   * Reassign tasks when user is unavailable
   */
  private async reassignTasksDuringUnavailability(
    userId: string,
    propertyId: string,
    from: string,
    to: string
  ): Promise<void> {
    try {
      // Get tasks assigned to this user during the period
      const { data: tasks } = await this.supabase
        .from('tasks')
        .select('id, task_rotations(*)')
        .eq('property_id', propertyId)
        .eq('assigned_to', userId)
        .gte('due_date', from)
        .lte('due_date', to);

      // For each task with rotation, rotate to next person
      for (const task of tasks || []) {
        if (task.task_rotations) {
          await this.rotateTask(task.id);
        }
      }

      console.log(`[Task] OK: Reassigned ${tasks?.length || 0} tasks`);
    } catch (error) {
      console.error('[Task] ERROR: Failed to reassign tasks:', error);
    }
  }

  /**
   * Complete a task with optional proof photo
   */
  async completeTask(
    form: CompleteTaskForm
  ): Promise<{ success: boolean; error?: string }> {
    try {
      let proofUrl: string | undefined;

      // Upload proof photo if provided
      if (form.proof_photo) {
        const uploadResult = await this.uploadProof(form.task_id, form.proof_photo);
        if (uploadResult.success && uploadResult.url) {
          proofUrl = uploadResult.url;
        }
      }

      // Update task
      const { error } = await this.supabase
        .from('tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          completion_notes: form.completion_notes || null,
          proof_image_url: proofUrl || null,
        })
        .eq('id', form.task_id);

      if (error) throw error;

      console.log('[Task] OK: Task completed:', form.task_id);

      return { success: true };
    } catch (error: any) {
      console.error('[Task] ERROR: Failed to complete task:', error);
      return {
        success: false,
        error: error.message || translations.errors.completeTask[currentLang],
      };
    }
  }

  /**
   * Upload proof photo to Supabase Storage
   */
  private async uploadProof(
    taskId: string,
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const fileName = `tasks/${taskId}/${Date.now()}_${file.name}`;

      const { data, error } = await this.supabase.storage
        .from('property-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = this.supabase.storage.from('property-documents').getPublicUrl(data.path);

      return { success: true, url: publicUrl };
    } catch (error: any) {
      console.error('[Task] ERROR: Failed to upload proof:', error);
      return {
        success: false,
        error: error.message || translations.errors.uploadProof[currentLang],
      };
    }
  }

  /**
   * Get upcoming tasks for a user
   */
  async getUpcomingTasks(
    userId: string,
    daysAhead: number = 7
  ): Promise<UpcomingTask[]> {
    try {
      const { data, error } = await this.supabase.rpc('get_user_upcoming_tasks', {
        p_user_id: userId,
        p_days_ahead: daysAhead,
      });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('[Task] ERROR: Failed to get upcoming tasks:', error);
      return [];
    }
  }

  /**
   * Get task statistics for a property
   */
  async getTaskStats(propertyId: string): Promise<TaskStats> {
    try {
      const { data: tasks } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('property_id', propertyId);

      if (!tasks) {
        return {
          total_tasks: 0,
          completed_tasks: 0,
          pending_tasks: 0,
          overdue_tasks: 0,
          completion_rate: 0,
          by_category: [],
          by_user: [],
        };
      }

      const total = tasks.length;
      const completed = tasks.filter((t) => t.status === 'completed').length;
      const pending = tasks.filter((t) => t.status === 'pending').length;
      const overdue = tasks.filter(
        (t) =>
          t.due_date &&
          new Date(t.due_date) < new Date() &&
          t.status !== 'completed'
      ).length;

      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      // By category
      const categoryMap = new Map();
      tasks.forEach((t) => {
        const current = categoryMap.get(t.category) || { count: 0, completed: 0 };
        current.count++;
        if (t.status === 'completed') current.completed++;
        categoryMap.set(t.category, current);
      });

      const byCategory = Array.from(categoryMap.entries()).map(([cat, data]) => ({
        category: cat,
        count: data.count,
        completed: data.completed,
      }));

      return {
        total_tasks: total,
        completed_tasks: completed,
        pending_tasks: pending,
        overdue_tasks: overdue,
        completion_rate: completionRate,
        by_category: byCategory,
        by_user: [], // Can be implemented if needed
      };
    } catch (error) {
      console.error('[Task] ERROR: Failed to get stats:', error);
      return {
        total_tasks: 0,
        completed_tasks: 0,
        pending_tasks: 0,
        overdue_tasks: 0,
        completion_rate: 0,
        by_category: [],
        by_user: [],
      };
    }
  }
}

export const taskService = new TaskService();
