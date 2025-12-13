/**
 * Modern Tasks Page with Smart Rotations
 * Complete task management with automatic rotations
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import HubLayout from '@/components/hub/HubLayout';
import {
  CheckCircle2,
  Clock,
  Calendar,
  RotateCw,
  Plus,
  Users,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { taskService } from '@/lib/services/task-service';
import type { TaskWithDetails, CreateTaskForm, CompleteTaskForm } from '@/types/tasks.types';

const CATEGORY_OPTIONS = [
  { value: 'cleaning', label: 'Nettoyage', emoji: '🧹', color: 'bg-blue-100 text-blue-700' },
  { value: 'groceries', label: 'Courses', emoji: '🛒', color: 'bg-green-100 text-green-700' },
  { value: 'maintenance', label: 'Entretien', emoji: '🔧', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'admin', label: 'Administratif', emoji: '📋', color: 'bg-purple-100 text-purple-700' },
  { value: 'other', label: 'Autre', emoji: '📦', color: 'bg-gray-100 text-gray-700' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Basse', color: 'bg-gray-100 text-gray-600' },
  { value: 'medium', label: 'Moyenne', color: 'bg-blue-100 text-blue-600' },
  { value: 'high', label: 'Haute', color: 'bg-orange-100 text-orange-600' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-600' },
];

export default function ModernTasksPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | null>(null);

  const [createForm, setCreateForm] = useState<CreateTaskForm>({
    title: '',
    description: '',
    category: 'cleaning',
    priority: 'medium',
    due_date: new Date().toISOString().split('T')[0],
    recurrence: 'none',
  });

  const [completeForm, setCompleteForm] = useState<CompleteTaskForm>({
    task_id: '',
    completion_notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setCurrentUserId(user.id);

      const { data: membershipData } = await supabase.rpc('get_user_property_membership', {
        p_user_id: user.id,
      });

      if (!membershipData?.property_id) {
        setIsLoading(false);
        return;
      }

      setPropertyId(membershipData.property_id);

      const tasksData = await taskService.getPropertyTasks(membershipData.property_id, user.id);
      setTasks(tasksData);

      setIsLoading(false);
    } catch (error) {
      console.error('[Tasks] Error:', error);
      setIsLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!propertyId || !currentUserId) return;

    setIsSubmitting(true);

    try {
      const result = await taskService.createTask(propertyId, currentUserId, createForm);

      if (result.success) {
        setShowCreateModal(false);
        setCreateForm({
          title: '',
          description: '',
          category: 'cleaning',
          priority: 'medium',
          due_date: new Date().toISOString().split('T')[0],
          recurrence: 'none',
        });
        await loadData();
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!selectedTask) return;

    setIsSubmitting(true);

    try {
      const result = await taskService.completeTask({
        ...completeForm,
        task_id: selectedTask.id,
      });

      if (result.success) {
        setShowCompleteModal(false);
        setSelectedTask(null);
        setCompleteForm({ task_id: '', completion_notes: '' });
        await loadData();
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRotateTask = async (taskId: string) => {
    try {
      const result = await taskService.rotateTask(taskId);

      if (result.success) {
        alert(`✅ Tâche assignée à ${result.new_assignee_name}`);
        await loadData();
      } else {
        alert(`Erreur: ${result.message}`);
      }
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const myTasks = pendingTasks.filter((t) => t.assigned_to === currentUserId);
  const overdueTasks = pendingTasks.filter((t) => t.is_overdue);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <HubLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="relative w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg grain-medium"
              style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
            >
              <CheckCircle2 className="w-7 h-7 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Tâches Ménagères</h1>
              <p className="text-gray-600">Organisation et rotations automatiques</p>
            </div>
          </div>

          <Button onClick={() => setShowCreateModal(true)} className="cta-resident rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle tâche
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Mes tâches', value: myTasks.length, icon: Users, gradient: 'from-[#d9574f] to-[#ff5b21]' },
          { label: 'En attente', value: pendingTasks.length, icon: Clock, gradient: 'from-[#ff5b21] to-[#ff8017]' },
          { label: 'Terminées', value: completedTasks.length, icon: CheckCircle2, gradient: 'from-[#d9574f] via-[#ff5b21] to-[#ff8017]' },
          { label: 'En retard', value: overdueTasks.length, icon: AlertCircle, gradient: 'from-[#ee5736] to-[#ff6e1c]' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br", stat.gradient)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-600">{stat.label}</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tasks List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Toutes les tâches</h3>

        <div className="space-y-3">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(217, 87, 79, 0.12)' }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: '#ee5736' }} />
              </div>
              <p className="font-semibold text-gray-900 mb-2">Aucune tâche en attente</p>
              <p className="text-sm text-gray-500">Tout est fait ! 🎉</p>
            </div>
          ) : (
            pendingTasks.map((task, index) => {
              const category = CATEGORY_OPTIONS.find((c) => c.value === task.category);
              const priority = PRIORITY_OPTIONS.find((p) => p.value === task.priority);
              const isMyTask = task.assigned_to === currentUserId;

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className={cn(
                    'group flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer',
                    isMyTask
                      ? 'border-gray-200 hover:shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  )}
                  style={isMyTask ? { background: 'linear-gradient(135deg, rgba(217, 87, 79, 0.08) 0%, rgba(255, 128, 23, 0.08) 100%)' } : undefined}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl', category?.color)}>
                      {category?.emoji}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{task.title}</h4>
                        {task.has_rotation && (
                          <Badge className="text-xs border-none text-white" style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                            <RotateCw className="w-3 h-3 mr-1" />
                            Rotation
                          </Badge>
                        )}
                        {task.is_overdue && (
                          <Badge className="bg-red-100 text-red-700 text-xs border-red-200">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            En retard
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" style={{ color: '#ee5736' }} />
                          {task.assigned_to_name}
                        </span>
                        {task.due_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" style={{ color: '#ee5736' }} />
                            {new Date(task.due_date).toLocaleDateString('fr-FR')}
                            {task.days_until_due !== undefined && (
                              <span className={cn(task.days_until_due < 3 ? 'text-red-600' : 'text-gray-500')}>
                                (J{task.days_until_due > 0 ? `-${task.days_until_due}` : task.days_until_due})
                              </span>
                            )}
                          </span>
                        )}
                        <Badge className={priority?.color}>{priority?.label}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isMyTask && (
                      <Button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowCompleteModal(true);
                        }}
                        size="sm"
                        className="cta-resident rounded-full"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Terminer
                      </Button>
                    )}
                    {task.has_rotation && (
                      <Button
                        onClick={() => handleRotateTask(task.id)}
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                      >
                        <RotateCw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Create Task Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvelle tâche</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Titre *</Label>
              <Input
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder="Ex: Nettoyer la cuisine"
                className="rounded-xl"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="Détails (optionnel)"
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Catégorie</Label>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm({ ...createForm, category: e.target.value as any })}
                  className="w-full rounded-xl border border-gray-300 p-2"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.emoji} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Priorité</Label>
                <select
                  value={createForm.priority}
                  onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value as any })}
                  className="w-full rounded-xl border border-gray-300 p-2"
                >
                  {PRIORITY_OPTIONS.map((pri) => (
                    <option key={pri.value} value={pri.value}>
                      {pri.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label>Date d'échéance</Label>
              <Input
                type="date"
                value={createForm.due_date}
                onChange={(e) => setCreateForm({ ...createForm, due_date: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1 rounded-full">
                Annuler
              </Button>
              <Button onClick={handleCreateTask} disabled={isSubmitting || !createForm.title} className="flex-1 rounded-full cta-resident">
                {isSubmitting ? 'Création...' : 'Créer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Task Modal */}
      <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Terminer la tâche</DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900">{selectedTask.title}</h4>
                {selectedTask.description && (
                  <p className="text-sm text-gray-600 mt-1">{selectedTask.description}</p>
                )}
              </div>

              <div>
                <Label>Notes de complétion</Label>
                <Textarea
                  value={completeForm.completion_notes}
                  onChange={(e) => setCompleteForm({ ...completeForm, completion_notes: e.target.value })}
                  placeholder="Comment ça s'est passé ? (optionnel)"
                  className="rounded-xl"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowCompleteModal(false)} className="flex-1 rounded-full">
                  Annuler
                </Button>
                <Button onClick={handleCompleteTask} disabled={isSubmitting} className="flex-1 rounded-full cta-resident">
                  <Check className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Finalisation...' : 'Marquer comme terminée'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </HubLayout>
  );
}
