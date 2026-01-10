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
import { useLanguage } from '@/lib/i18n/use-language';
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

// V3 Color System - Resident Palette from globals.css
const RESIDENT_PRIMARY = 'var(--resident-primary)';
const RESIDENT_GRADIENT = 'var(--gradient-resident-medium)';
const CARD_BG_GRADIENT = 'var(--gradient-resident-subtle)';
const RESIDENT_SHADOW = 'var(--resident-shadow)';

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

// Catégories - Toutes en nuances d'orange pour cohérence interface Resident
const CATEGORY_OPTIONS = [
  { value: 'cleaning', label: 'Cleaning', icon: Brush, color: 'bg-[#FFF5F0] text-[#e05747]' },
  { value: 'groceries', label: 'Groceries', icon: ShoppingCart, color: 'bg-[#FFEDE5] text-[#f8572b]' },
  { value: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'bg-[#FFD9C7] text-[#e05747]' },
  { value: 'admin', label: 'Admin', icon: ClipboardList, color: 'bg-[#fff5f0] text-[#ff7b19]' },
  { value: 'other', label: 'Other', icon: Package, color: 'bg-gray-100 text-gray-600' },
];

// Priorités - Orange dominant + Rouge pastel uniquement pour urgent (sémantique)
const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-500' },
  { value: 'medium', label: 'Medium', color: 'bg-[#FFF5F0] text-[#ff7b19]' },
  { value: 'high', label: 'High', color: 'bg-[#FFEDE5] text-[#f8572b]' },
  { value: 'urgent', label: 'Urgent', color: 'bg-[#FDF5F5] text-[#D08080]' }, // Rouge pastel sémantique
];

export default function ModernTasksPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const hub = getSection('dashboard')?.hub;

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
        alert(`Error: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
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
        alert(`Error: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRotateTask = async (taskId: string) => {
    try {
      const result = await taskService.rotateTask(taskId);

      if (result.success) {
        alert(`Task assigned to ${result.new_assignee_name}`);
        await loadData();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header - Matching Finance Style */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 superellipse-2xl flex items-center justify-center shadow-lg"
              style={{
                background: RESIDENT_GRADIENT,
                boxShadow: `0 8px 24px ${RESIDENT_SHADOW}`,
              }}
            >
              <CheckCircle2 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{hub.tasks?.title || 'Tasks'}</h1>
              <p className="text-sm text-gray-500">
                {pendingTasks.length} {hub.tasks?.pending || 'pending'} • {myTasks.length} {hub.tasks?.forMe || 'for me'}
              </p>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowCreateModal(true)}
              size="sm"
              className="h-9 text-sm superellipse-xl text-white font-semibold shadow-lg"
              style={{
                background: RESIDENT_GRADIENT,
                boxShadow: `0 4px 14px ${RESIDENT_SHADOW}`,
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {hub.tasks?.newTask || 'New task'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards - Matching Finance Style */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* My Tasks Card - Orange Gradient */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-4 shadow-lg"
            style={{
              background: CARD_BG_GRADIENT,
              boxShadow: `0 8px 24px ${RESIDENT_SHADOW}`,
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{ background: RESIDENT_GRADIENT }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: RESIDENT_PRIMARY }}>{hub.tasks?.stats?.myTasks || 'My tasks'}</span>
              <div
                className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: RESIDENT_GRADIENT }}
              >
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{myTasks.length}</p>
            <p className="text-xs font-medium mt-2" style={{ color: RESIDENT_PRIMARY }}>{hub.tasks?.stats?.toDo || 'to do'}</p>
          </motion.div>

          {/* Pending Card - Gris neutre (pas de couleur sémantique) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
              boxShadow: '0 8px 24px rgba(156, 163, 175, 0.15)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-15"
              style={{ background: 'linear-gradient(135deg, #9CA3AF, #D1D5DB)' }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{hub.tasks?.stats?.pendingLabel || 'Pending'}</span>
              <div
                className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #9CA3AF, #D1D5DB)' }}
              >
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{pendingTasks.length}</p>
            <p className="text-xs text-gray-500 font-medium mt-2">{pendingTasks.length !== 1 ? (hub.tasks?.stats?.tasksPlural || 'tasks') : (hub.tasks?.stats?.taskSingular || 'task')}</p>
          </motion.div>

          {/* Completed Card - Vert pastel (sémantique muted) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #F0F7F4 0%, #E8F5EE 100%)',
              boxShadow: '0 8px 24px rgba(124, 184, 155, 0.15)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-15"
              style={{ background: 'linear-gradient(135deg, #7CB89B, #9ECDB5)' }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#5A9B7A]">{hub.tasks?.stats?.completed || 'Completed'}</span>
              <div
                className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #7CB89B, #9ECDB5)' }}
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
            <p className="text-xs text-[#6BA888] font-medium mt-2">{completedTasks.length !== 1 ? (hub.tasks?.stats?.completedPlural || 'completed') : (hub.tasks?.stats?.completedSingular || 'completed')}</p>
          </motion.div>

          {/* Overdue Card - Rouge pastel (sémantique muted) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #FDF5F5 0%, #FAE8E8 100%)',
              boxShadow: '0 8px 24px rgba(208, 128, 128, 0.15)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-15"
              style={{ background: 'linear-gradient(135deg, #D08080, #E0A0A0)' }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#B06060]">{hub.tasks?.stats?.overdue || 'Overdue'}</span>
              <div
                className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #D08080, #E0A0A0)' }}
              >
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{overdueTasks.length}</p>
            <p className="text-xs text-[#C07070] font-medium mt-2">{overdueTasks.length !== 1 ? (hub.tasks?.stats?.urgentPlural || 'urgent') : (hub.tasks?.stats?.urgentSingular || 'urgent')}</p>
          </motion.div>
        </motion.div>

        {/* Tasks List - Matching Finance Style */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="bg-white superellipse-2xl shadow-lg overflow-hidden"
          style={{ boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)' }}
        >
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <div
              className="w-9 h-9 superellipse-xl flex items-center justify-center shadow-md"
              style={{ background: RESIDENT_GRADIENT }}
            >
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900">{hub.tasks?.allTasks || 'All tasks'}</h3>
            <Badge
              className="text-xs px-2 py-0.5 font-bold border-none"
              style={{ background: RESIDENT_GRADIENT, color: 'white' }}
            >
              {pendingTasks.length}
            </Badge>
          </div>

          <div className="p-3">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {pendingTasks.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-12 px-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="relative w-20 h-20 superellipse-2xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: RESIDENT_GRADIENT,
                      boxShadow: `0 8px 24px ${RESIDENT_SHADOW}`,
                    }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{ y: [-2, 2, -2], rotate: [0, 15, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                  </motion.div>
                  <p className="font-bold text-gray-900 mb-2 text-lg">{hub.tasks?.emptyState?.title || 'Aucune tâche en cours'}</p>
                  <p className="text-sm text-gray-500 mb-6">{hub.tasks?.emptyState?.description || 'Bravo, tout est terminé !'}</p>

                  {/* Explanatory notes for task rotation system */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-md mx-auto text-left space-y-3 p-4 superellipse-2xl"
                    style={{ background: CARD_BG_GRADIENT }}
                  >
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <RotateCw className="w-4 h-4" style={{ color: RESIDENT_PRIMARY }} />
                      Comment fonctionnent les tâches ?
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="font-bold" style={{ color: RESIDENT_PRIMARY }}>•</span>
                        <span><strong>Tâches récurrentes :</strong> Les tâches avec rotation s'assignent automatiquement à un colocataire différent à chaque cycle</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold" style={{ color: RESIDENT_PRIMARY }}>•</span>
                        <span><strong>Créer une tâche :</strong> Cliquez sur "Nouvelle tâche" pour ajouter une tâche ponctuelle ou récurrente</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold" style={{ color: RESIDENT_PRIMARY }}>•</span>
                        <span><strong>Rotation manuelle :</strong> Utilisez le bouton de rotation pour passer la tâche au prochain colocataire</span>
                      </li>
                    </ul>
                  </motion.div>
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
                        'group flex items-center justify-between p-4 superellipse-2xl border-2 transition-all cursor-pointer',
                        isMyTask
                          ? 'hover:shadow-lg'
                          : 'bg-gray-50/50 border-gray-200 hover:border-gray-300'
                      )}
                      style={isMyTask ? {
                        background: CARD_BG_GRADIENT,
                        boxShadow: `0 4px 16px ${RESIDENT_SHADOW}`,
                        borderColor: 'rgba(224, 87, 71, 0.2)',
                      } : undefined}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={cn('w-12 h-12 superellipse-xl flex items-center justify-center shadow-sm', category?.color)}
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
                                  background: RESIDENT_GRADIENT,
                                  boxShadow: `0 2px 8px ${RESIDENT_SHADOW}`,
                                }}
                              >
                                <RotateCw className="w-3 h-3 mr-1" />
                                {hub.tasks?.rotation || 'Rotation'}
                              </Badge>
                            )}
                            {task.is_overdue && (
                              <Badge
                                className="text-xs text-white border-none font-semibold shadow-sm"
                                style={{
                                  background: 'linear-gradient(135deg, #D08080 0%, #C07070 100%)',
                                  boxShadow: '0 2px 8px rgba(208, 128, 128, 0.3)',
                                }}
                              >
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {hub.tasks?.overdue || 'Overdue'}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" style={{ color: RESIDENT_PRIMARY }} />
                              {task.assigned_to_name}
                            </span>
                            {task.due_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" style={{ color: RESIDENT_PRIMARY }} />
                                {new Date(task.due_date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'nl' ? 'nl-NL' : language === 'de' ? 'de-DE' : 'en-GB')}
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
                                background: 'linear-gradient(135deg, #7CB89B 0%, #6BA888 100%)',
                                boxShadow: '0 4px 12px rgba(124, 184, 155, 0.35)',
                              }}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              {hub.tasks?.complete || 'Complete'}
                            </Button>
                          </motion.div>
                        )}
                        {task.has_rotation && (
                          <motion.div whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              onClick={() => handleRotateTask(task.id)}
                              size="sm"
                              variant="outline"
                              className="rounded-full border-2 hover:bg-orange-50/50"
                              style={{
                                borderColor: 'rgba(224, 87, 71, 0.3)',
                                color: RESIDENT_PRIMARY,
                              }}
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
          </div>
        </motion.div>
      </motion.div>

      {/* Create Task Modal - V3 Fun Design */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg p-0 overflow-hidden superellipse-3xl border-2" style={{ boxShadow: `0 25px 80px ${RESIDENT_SHADOW}`, borderColor: 'rgba(224, 87, 71, 0.2)' }}>
          {/* Decorative gradient circles */}
          <div
            className="absolute -right-16 -top-16 w-48 h-48 rounded-full opacity-20 pointer-events-none"
            style={{ background: RESIDENT_GRADIENT }}
          />
          <div
            className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full opacity-15 pointer-events-none"
            style={{ background: RESIDENT_GRADIENT }}
          />

          {/* Header */}
          <div
            className="border-b-2 px-6 py-5 flex items-center justify-between"
            style={{ background: CARD_BG_GRADIENT, borderColor: 'rgba(224, 87, 71, 0.2)' }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 superellipse-xl flex items-center justify-center"
                style={{ background: RESIDENT_GRADIENT, boxShadow: `0 8px 24px ${RESIDENT_SHADOW}` }}
              >
                <ClipboardList className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {hub.tasks?.modal?.newTask || 'New task'}
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: RESIDENT_PRIMARY }} />
                  {hub.tasks?.modal?.subtitle || 'Organize your coliving efficiently'}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5 relative z-10">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <div
                  className="w-6 h-6 superellipse-lg flex items-center justify-center"
                  style={{ background: `${RESIDENT_PRIMARY}20` }}
                >
                  <FileText className="w-3.5 h-3.5" style={{ color: RESIDENT_PRIMARY }} />
                </div>
                {hub.tasks?.modal?.titleLabel || 'Title'} *
              </label>
              <Input
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder={hub.tasks?.modal?.titlePlaceholder || 'E.g.: Clean the kitchen'}
                className="w-full px-4 py-3.5 superellipse-2xl border-2 border-gray-200 focus:outline-none transition-all"
                style={{
                  borderColor: 'var(--gray-200)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = RESIDENT_PRIMARY;
                  e.target.style.background = 'rgba(224, 87, 71, 0.03)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--gray-200)';
                  e.target.style.background = 'white';
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <div
                  className="w-6 h-6 superellipse-lg flex items-center justify-center"
                  style={{ background: `${RESIDENT_PRIMARY}20` }}
                >
                  <PenLine className="w-3.5 h-3.5" style={{ color: RESIDENT_PRIMARY }} />
                </div>
                {hub.tasks?.modal?.descriptionLabel || 'Description'}
              </label>
              <Textarea
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder={hub.tasks?.modal?.descriptionPlaceholder || 'Details (optional)'}
                className="w-full px-4 py-3.5 superellipse-2xl border-2 border-gray-200 resize-none transition-all"
                rows={3}
                onFocus={(e) => {
                  e.target.style.borderColor = RESIDENT_PRIMARY;
                  e.target.style.background = 'rgba(224, 87, 71, 0.03)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--gray-200)';
                  e.target.style.background = 'white';
                }}
              />
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <div
                    className="w-6 h-6 superellipse-lg flex items-center justify-center"
                    style={{ background: 'rgba(59, 130, 246, 0.15)' }}
                  >
                    <Package className="w-3.5 h-3.5" style={{ color: '#3b82f6' }} />
                  </div>
                  {hub.tasks?.modal?.categoryLabel || 'Category'}
                </label>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm({ ...createForm, category: e.target.value as any })}
                  className="w-full px-4 py-3.5 superellipse-2xl border-2 border-gray-200 focus:outline-none transition-all bg-white"
                  onFocus={(e) => {
                    e.target.style.borderColor = RESIDENT_PRIMARY;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--gray-200)';
                  }}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {hub.tasks?.categories?.[cat.value] || cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <div
                    className="w-6 h-6 superellipse-lg flex items-center justify-center"
                    style={{ background: 'rgba(168, 85, 247, 0.15)' }}
                  >
                    <AlertCircle className="w-3.5 h-3.5" style={{ color: '#a855f7' }} />
                  </div>
                  {hub.tasks?.modal?.priorityLabel || 'Priority'}
                </label>
                <select
                  value={createForm.priority}
                  onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value as any })}
                  className="w-full px-4 py-3.5 superellipse-2xl border-2 border-gray-200 focus:outline-none transition-all bg-white"
                  onFocus={(e) => {
                    e.target.style.borderColor = RESIDENT_PRIMARY;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--gray-200)';
                  }}
                >
                  {PRIORITY_OPTIONS.map((pri) => (
                    <option key={pri.value} value={pri.value}>
                      {hub.tasks?.priorities?.[pri.value] || pri.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <div
                  className="w-6 h-6 superellipse-lg flex items-center justify-center"
                  style={{ background: 'rgba(16, 185, 129, 0.15)' }}
                >
                  <Calendar className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                </div>
                {hub.tasks?.modal?.dueDateLabel || 'Due date'}
              </label>
              <Input
                type="date"
                value={createForm.due_date}
                onChange={(e) => setCreateForm({ ...createForm, due_date: e.target.value })}
                className="w-full px-4 py-3.5 superellipse-2xl border-2 border-gray-200 focus:outline-none transition-all"
                onFocus={(e) => {
                  e.target.style.borderColor = RESIDENT_PRIMARY;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--gray-200)';
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="w-full superellipse-2xl py-6 font-semibold border-2 transition-all"
                  style={{ borderColor: `${RESIDENT_PRIMARY}40`, color: RESIDENT_PRIMARY }}
                >
                  {hub.tasks?.modal?.cancel || 'Cancel'}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={handleCreateTask}
                  disabled={isSubmitting || !createForm.title}
                  className="w-full superellipse-2xl py-6 font-bold text-white border-none"
                  style={{
                    background: RESIDENT_GRADIENT,
                    boxShadow: `0 12px 32px ${RESIDENT_SHADOW}`,
                  }}
                >
                  {isSubmitting ? (hub.tasks?.modal?.creating || 'Creating...') : (hub.tasks?.modal?.create || 'Create')}
                </Button>
              </motion.div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Task Modal - V2 Fun avec vert pastel */}
      <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
        <DialogContent className="max-w-lg superellipse-3xl border-2 border-[#D4E8DD]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#7CB89B]" />
              {hub.tasks?.completeModal?.title || 'Complete task'}
            </DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="superellipse-2xl p-4 border-2 border-[#D4E8DD]"
                style={{
                  background: 'linear-gradient(135deg, #F0F7F4 0%, #FFFFFF 100%)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, #7CB89B 0%, #6BA888 100%)',
                      boxShadow: '0 4px 12px rgba(124, 184, 155, 0.35)',
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
                  <PenLine className="w-4 h-4" style={{ color: RESIDENT_PRIMARY }} />
                  {hub.tasks?.completeModal?.notesLabel || 'Completion notes'}
                </Label>
                <Textarea
                  value={completeForm.completion_notes}
                  onChange={(e) => setCompleteForm({ ...completeForm, completion_notes: e.target.value })}
                  placeholder={hub.tasks?.completeModal?.notesPlaceholder || 'How did it go? (optional)'}
                  className="superellipse-xl mt-2 border-2 border-gray-200 focus:border-[#9ECDB5]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 rounded-full border-2 border-gray-200 hover:border-gray-300 font-semibold"
                >
                  {hub.tasks?.modal?.cancel || 'Cancel'}
                </Button>
                <Button
                  onClick={handleCompleteTask}
                  disabled={isSubmitting}
                  className="flex-1 rounded-full text-white border-none shadow-lg hover:shadow-xl transition-all font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #7CB89B 0%, #6BA888 100%)',
                    boxShadow: '0 4px 16px rgba(124, 184, 155, 0.4)',
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isSubmitting ? (hub.tasks?.completeModal?.completing || 'Completing...') : (hub.tasks?.complete || 'Complete')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </HubLayout>
  );
}
