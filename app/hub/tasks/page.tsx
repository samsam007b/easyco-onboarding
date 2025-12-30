/**
 * Modern Tasks Page with Smart Rotations - V2 Fun Design
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
  Sparkles,
  Brush,
  ShoppingCart,
  Wrench,
  ClipboardList,
  Package,
  FileText,
  PenLine,
} from 'lucide-react';

// V2 Fun Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
  },
};
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
  { value: 'cleaning', label: 'Nettoyage', icon: Brush, color: 'bg-blue-100 text-blue-700' },
  { value: 'groceries', label: 'Courses', icon: ShoppingCart, color: 'bg-green-100 text-green-700' },
  { value: 'maintenance', label: 'Entretien', icon: Wrench, color: 'bg-yellow-100 text-yellow-700' },
  { value: 'admin', label: 'Administratif', icon: ClipboardList, color: 'bg-purple-100 text-purple-700' },
  { value: 'other', label: 'Autre', icon: Package, color: 'bg-gray-100 text-gray-700' },
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
        alert(`Tâche assignée à ${result.new_assignee_name}`);
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
      {/* Header - V2 Fun Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                boxShadow: '0 8px 24px rgba(238, 87, 54, 0.35)',
              }}
            >
              <CheckCircle2 className="w-7 h-7 text-white relative z-10" />
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Tâches Ménagères
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-orange-500" />
                Organisation et rotations automatiques
              </p>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="rounded-full text-white border-none shadow-lg hover:shadow-xl transition-all font-semibold"
              style={{
                background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                boxShadow: '0 4px 16px rgba(238, 87, 54, 0.4)',
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle tâche
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards - V2 Fun */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Mes tâches', value: myTasks.length, icon: Users, gradient: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)', shadow: 'rgba(217, 87, 79, 0.35)' },
          { label: 'En attente', value: pendingTasks.length, icon: Clock, gradient: 'linear-gradient(135deg, #ff5b21 0%, #ff8017 100%)', shadow: 'rgba(255, 91, 33, 0.35)' },
          { label: 'Terminées', value: completedTasks.length, icon: CheckCircle2, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', shadow: 'rgba(16, 185, 129, 0.35)' },
          { label: 'En retard', value: overdueTasks.length, icon: AlertCircle, gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', shadow: 'rgba(239, 68, 68, 0.35)' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer border-2 border-transparent hover:border-orange-100"
              style={{
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md"
                  style={{
                    background: stat.gradient,
                    boxShadow: `0 4px 12px ${stat.shadow}`,
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="text-sm font-bold text-gray-600">
                  {stat.label}
                </h3>
              </div>
              <p
                className="text-3xl font-bold"
                style={{
                  background: stat.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Tasks List - V2 Fun */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 25, delay: 0.3 }}
        className="bg-white rounded-3xl shadow-lg p-6 border-2 border-transparent"
        style={{
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ClipboardList className="w-5 h-5" style={{ color: '#ee5736' }} />
          Toutes les tâches
          <Badge
            className="text-xs border-none text-white font-bold ml-2"
            style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)' }}
          >
            {pendingTasks.length}
          </Badge>
        </h3>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {pendingTasks.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-12"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                }}
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ y: [-2, 2, -2], rotate: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </motion.div>
              </motion.div>
              <p className="font-bold text-gray-900 mb-2 text-lg">Aucune tâche en attente</p>
              <p className="text-sm text-gray-500">Tout est fait !</p>
            </motion.div>
          ) : (
            pendingTasks.map((task) => {
              const category = CATEGORY_OPTIONS.find((c) => c.value === task.category);
              const priority = PRIORITY_OPTIONS.find((p) => p.value === task.priority);
              const isMyTask = task.assigned_to === currentUserId;

              return (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  className={cn(
                    'group flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer',
                    isMyTask
                      ? 'border-orange-200 hover:shadow-lg'
                      : 'bg-gray-50/50 border-gray-200 hover:border-gray-300'
                  )}
                  style={isMyTask ? {
                    background: 'linear-gradient(135deg, rgba(255,245,243,1) 0%, rgba(255,255,255,1) 100%)',
                    boxShadow: '0 4px 16px rgba(238, 87, 54, 0.1)',
                  } : undefined}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-sm', category?.color)}
                    >
                      {category?.icon && <category.icon className="w-6 h-6" />}
                    </motion.div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{task.title}</h4>
                        {task.has_rotation && (
                          <Badge
                            className="text-xs border-none text-white font-semibold shadow-sm"
                            style={{
                              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
                            }}
                          >
                            <RotateCw className="w-3 h-3 mr-1" />
                            Rotation
                          </Badge>
                        )}
                        {task.is_overdue && (
                          <Badge
                            className="text-xs text-white border-none font-semibold shadow-sm"
                            style={{
                              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                            }}
                          >
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
                              <span className={cn(
                                'font-semibold',
                                task.days_until_due < 3 ? 'text-red-600' : 'text-gray-500'
                              )}>
                                (J{task.days_until_due > 0 ? `-${task.days_until_due}` : task.days_until_due})
                              </span>
                            )}
                          </span>
                        )}
                        <Badge className={cn(priority?.color, 'font-semibold')}>{priority?.label}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isMyTask && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => {
                            setSelectedTask(task);
                            setShowCompleteModal(true);
                          }}
                          size="sm"
                          className="rounded-full text-white font-semibold shadow-md"
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                          }}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Terminer
                        </Button>
                      </motion.div>
                    )}
                    {task.has_rotation && (
                      <motion.div whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          onClick={() => handleRotateTask(task.id)}
                          size="sm"
                          variant="outline"
                          className="rounded-full border-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                        >
                          <RotateCw className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </motion.div>

      {/* Create Task Modal - V2 Fun */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg rounded-3xl border-2 border-orange-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5" style={{ color: '#ee5736' }} />
              Nouvelle tâche
            </DialogTitle>
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
                      {cat.label}
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
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 rounded-full border-gray-200 hover:border-transparent"
                style={{ color: '#ee5736' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(217, 87, 79, 0.08) 0%, rgba(255, 128, 23, 0.08) 100%)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateTask}
                disabled={isSubmitting || !createForm.title}
                className="flex-1 rounded-full text-white border-none shadow-lg hover:shadow-xl transition-all"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
              >
                {isSubmitting ? 'Création...' : 'Créer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Task Modal - V2 Fun */}
      <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
        <DialogContent className="max-w-lg rounded-3xl border-2 border-emerald-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Terminer la tâche
            </DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4 border-2 border-emerald-100"
                style={{
                  background: 'linear-gradient(135deg, rgba(236,253,245,1) 0%, rgba(255,255,255,1) 100%)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedTask.title}</h4>
                    {selectedTask.description && (
                      <p className="text-sm text-gray-600">{selectedTask.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              <div>
                <Label className="font-semibold text-gray-700 flex items-center gap-2">
                  <PenLine className="w-4 h-4" style={{ color: '#ee5736' }} />
                  Notes de complétion
                </Label>
                <Textarea
                  value={completeForm.completion_notes}
                  onChange={(e) => setCompleteForm({ ...completeForm, completion_notes: e.target.value })}
                  placeholder="Comment ça s'est passé ? (optionnel)"
                  className="rounded-xl mt-2 border-2 border-gray-200 focus:border-emerald-300"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 rounded-full border-2 border-gray-200 hover:border-gray-300 font-semibold"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleCompleteTask}
                  disabled={isSubmitting}
                  className="flex-1 rounded-full text-white border-none shadow-lg hover:shadow-xl transition-all font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Finalisation...' : 'Terminer'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </HubLayout>
  );
}
