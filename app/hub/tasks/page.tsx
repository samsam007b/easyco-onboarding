'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
  User,
  Calendar as CalendarIcon,
  AlertCircle,
  X,
  ListTodo,
  Sparkles,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  assignedToName?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
}

export default function HubTasksPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentPropertyId, setCurrentPropertyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignedTo: ''
  });
  const [roommates, setRoommates] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setCurrentUserId(user.id);

      // Get user's property membership using RPC function
      const { data: membershipData, error: memberError } = await supabase
        .rpc('get_user_property_membership', { p_user_id: user.id });

      if (memberError || !membershipData?.property_id) {
        console.error('No property membership found');
        setIsLoading(false);
        return;
      }

      const propertyId = membershipData.property_id;
      setCurrentPropertyId(propertyId);

      // Load roommates for task assignment from property_members
      const { data: membersData } = await supabase
        .from('property_members')
        .select('user_id')
        .eq('property_id', propertyId)
        .eq('status', 'active');

      // Get user profiles for roommates
      const memberUserIds = membersData?.map(m => m.user_id) || [];
      const { data: roommatesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', memberUserIds);

      if (roommatesData) {
        setRoommates(roommatesData.map(r => ({
          id: r.id,
          name: r.id === user.id ? 'Toi' : `${r.first_name} ${r.last_name}`
        })));
      }

      // Fetch tasks
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('property_id', propertyId)
        .order('due_date', { ascending: true });

      if (error) throw error;

      // Fetch user names
      const userIds = [
        ...new Set([
          ...tasksData.map(t => t.created_by),
          ...tasksData.map(t => t.assigned_to).filter(Boolean)
        ])
      ];

      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      const userMap = new Map(
        usersData?.map(u => [u.id, `${u.first_name} ${u.last_name}`])
      );

      // Enrich tasks with user names
      const enrichedTasks = tasksData.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.due_date,
        priority: task.priority as 'low' | 'medium' | 'high',
        status: task.status as 'pending' | 'in_progress' | 'completed',
        assignedTo: task.assigned_to,
        assignedToName: task.assigned_to
          ? (task.assigned_to === user.id ? 'Toi' : userMap.get(task.assigned_to) || 'Inconnu')
          : 'Non assigné',
        createdBy: task.created_by,
        createdByName: task.created_by === user.id ? 'Toi' : userMap.get(task.created_by) || 'Inconnu',
        createdAt: task.created_at
      }));

      setTasks(enrichedTasks);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setIsLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let newStatus: 'pending' | 'in_progress' | 'completed' = 'pending';
    if (task.status === 'pending') newStatus = 'in_progress';
    else if (task.status === 'in_progress') newStatus = 'completed';
    else newStatus = 'pending';

    // Optimistic update
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ));

    // Update in database
    const { error } = await supabase
      .from('tasks')
      .update({
        status: newStatus,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error);
      // Revert optimistic update
      setTasks(tasks.map(t =>
        t.id === taskId ? task : t
      ));
    }
  };

  const deleteTask = async (taskId: string) => {
    // Optimistic update
    setTasks(tasks.filter(t => t.id !== taskId));

    // Delete from database
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      // Reload tasks
      loadTasks();
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim() || !currentUserId || !currentPropertyId) return;

    setIsCreating(true);

    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          title: newTask.title,
          description: newTask.description || null,
          due_date: newTask.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to 7 days from now
          priority: newTask.priority,
          status: 'pending',
          assigned_to: newTask.assignedTo || null,
          created_by: currentUserId,
          property_id: currentPropertyId
        });

      if (error) throw error;

      // Reset form and close modal
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        assignedTo: ''
      });
      setShowCreateModal(false);

      // Reload tasks
      loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(task => task.status === filter);

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Urgent';
      case 'medium': return 'Moyen';
      case 'low': return 'Bas';
      default: return priority;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'in_progress': return Clock;
      default: return Circle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-orange-600';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-6 rounded-full hover:bg-gradient-to-r hover:from-[#d9574f]/10 hover:to-[#ff8017]/10 transition-colors"
          >
            ← Retour au hub
          </Button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                     style={{
                       background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)'
                     }}>
                  <ListTodo className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Tâches de la Coloc
                </h1>
              </div>
              <p className="ml-15" style={{ color: '#ee5736' }}>
                Organisez et suivez les tâches communes avec vos colocataires
              </p>
            </div>

            <Button
              onClick={() => setShowCreateModal(true)}
              className="rounded-full text-white font-medium hover:shadow-lg transition-all flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle tâche
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.button
              onClick={() => setFilter(filter === 'pending' ? 'all' : 'pending')}
              className={cn(
                "bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all text-left border-2",
                filter === 'pending' ? "border-[#ff5b21]" : "border-transparent hover:border-gray-200"
              )}
              style={filter === 'pending' ? { background: 'rgba(217, 87, 79, 0.08)' } : undefined}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">À faire</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{pendingCount}</p>
                  <p className="text-xs text-gray-500 mt-1">tâches en attente</p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Circle className="w-7 h-7 text-gray-600" />
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setFilter(filter === 'in_progress' ? 'all' : 'in_progress')}
              className={cn(
                "bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all text-left border-2",
                filter === 'in_progress' ? "border-[#ff5b21]" : "border-transparent hover:border-gray-200"
              )}
              style={filter === 'in_progress' ? { background: 'rgba(217, 87, 79, 0.08)' } : undefined}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#ee5736' }}>En cours</p>
                  <p className="text-4xl font-bold mt-2" style={{
                    background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>{inProgressCount}</p>
                  <p className="text-xs text-gray-500 mt-1">tâches actives</p>
                </div>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center"
                     style={{
                       background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)'
                     }}>
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setFilter(filter === 'completed' ? 'all' : 'completed')}
              className={cn(
                "bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all text-left border-2",
                filter === 'completed' ? "border-green-400 bg-green-50/50" : "border-transparent hover:border-gray-200"
              )}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Terminées</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{completedCount}</p>
                  <p className="text-xs text-gray-500 mt-1">tâches complétées</p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </motion.button>
          </div>

          {/* Active Filter Badge */}
          {filter !== 'all' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2"
            >
              <Badge className="px-3 py-1" style={{ background: 'rgba(217, 87, 79, 0.12)', color: '#c23f21', borderColor: 'rgba(217, 87, 79, 0.2)' }}>
                Filtré par : {filter === 'pending' ? 'À faire' : filter === 'in_progress' ? 'En cours' : 'Terminées'}
              </Badge>
              <button
                onClick={() => setFilter('all')}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Afficher tout
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Tasks List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, index) => {
              const StatusIcon = getStatusIcon(task.status);
              const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className={cn(
                    "group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border",
                    task.status === 'completed' ? "opacity-70 border-green-200" : "border-gray-200 hover:border-[#ff8c6b]"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={cn(
                        "flex-shrink-0 transition-all hover:scale-110 active:scale-95",
                        getStatusColor(task.status)
                      )}
                    >
                      <StatusIcon className="w-7 h-7" strokeWidth={2.5} />
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className={cn(
                          "text-lg font-bold",
                          task.status === 'completed' ? "line-through text-gray-500" : "text-gray-900"
                        )}>
                          {task.title}
                        </h3>

                        <Button
                          onClick={() => deleteTask(task.id)}
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Priority Badge */}
                        <Badge className={cn(
                          "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                          getPriorityColor(task.priority)
                        )}>
                          {getPriorityLabel(task.priority)}
                        </Badge>

                        {/* Due Date */}
                        <div className={cn(
                          "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
                          isOverdue ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                        )}>
                          {isOverdue && <AlertCircle className="w-3.5 h-3.5" />}
                          <CalendarIcon className="w-3.5 h-3.5" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Assigned To */}
                        <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(217, 87, 79, 0.12)', color: '#c23f21' }}>
                          <User className="w-3.5 h-3.5" />
                          <span>{task.assignedToName || 'Non assigné'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl shadow-xl p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(217, 87, 79, 0.05) 0%, rgba(255, 128, 23, 0.05) 100%)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(217, 87, 79, 0.2)'
            }}
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                 style={{
                   background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)'
                 }}>
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {filter === 'all' ? 'Aucune tâche pour le moment' : `Aucune tâche ${filter === 'pending' ? 'à faire' : filter === 'in_progress' ? 'en cours' : 'terminée'}`}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filter === 'all'
                ? 'Créez votre première tâche pour commencer à organiser la vie de votre coloc efficacement'
                : filter === 'completed'
                ? 'Vous n\'avez pas encore complété de tâches. Commencez dès maintenant!'
                : 'Changez de filtre ou créez une nouvelle tâche'
              }
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="rounded-full text-white hover:shadow-lg transition-all px-6 py-6 text-base"
              style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Créer ma première tâche
            </Button>
          </motion.div>
        )}

        {/* Task Creation Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setShowCreateModal(false)}
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={() => setShowCreateModal(false)}
              >
                <div
                  className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="sticky top-0 p-6 rounded-t-3xl" style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">Nouvelle Tâche</h2>
                          <p className="text-white/80 text-sm">Créer une tâche pour la coloc</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowCreateModal(false)}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Titre de la tâche *
                      </label>
                      <Input
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Ex: Sortir les poubelles, Nettoyer la cuisine..."
                        className="rounded-xl border-gray-300 focus:border-[#ff5b21] focus:ring-[#ff5b21]"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description (optionnel)
                      </label>
                      <Textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Ajouter plus de détails sur la tâche..."
                        rows={3}
                        className="rounded-xl border-gray-300 focus:border-[#ff5b21] focus:ring-[#ff5b21]"
                      />
                    </div>

                    {/* Priority and Due Date Row */}
                    <div className="space-y-4">
                      {/* Priority - Modern Radio Buttons */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Priorité
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => setNewTask({ ...newTask, priority: 'low' })}
                            className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                              newTask.priority === 'low'
                                ? 'border-green-500 bg-green-50 shadow-md'
                                : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                            }`}
                          >
                            <div className={`text-2xl mb-1 transition-transform ${newTask.priority === 'low' ? 'scale-110' : ''}`}>
                              🟢
                            </div>
                            <span className={`text-xs font-semibold ${newTask.priority === 'low' ? 'text-green-700' : 'text-gray-600'}`}>
                              Basse
                            </span>
                            {newTask.priority === 'low' && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setNewTask({ ...newTask, priority: 'medium' })}
                            className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                              newTask.priority === 'medium'
                                ? 'border-yellow-500 bg-yellow-50 shadow-md'
                                : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50/50'
                            }`}
                          >
                            <div className={`text-2xl mb-1 transition-transform ${newTask.priority === 'medium' ? 'scale-110' : ''}`}>
                              🟡
                            </div>
                            <span className={`text-xs font-semibold ${newTask.priority === 'medium' ? 'text-yellow-700' : 'text-gray-600'}`}>
                              Moyenne
                            </span>
                            {newTask.priority === 'medium' && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setNewTask({ ...newTask, priority: 'high' })}
                            className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                              newTask.priority === 'high'
                                ? 'border-red-500 bg-red-50 shadow-md'
                                : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                            }`}
                          >
                            <div className={`text-2xl mb-1 transition-transform ${newTask.priority === 'high' ? 'scale-110' : ''}`}>
                              🔴
                            </div>
                            <span className={`text-xs font-semibold ${newTask.priority === 'high' ? 'text-red-700' : 'text-gray-600'}`}>
                              Haute
                            </span>
                            {newTask.priority === 'high' && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Due Date */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date d'échéance
                        </label>
                        <Input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          className="rounded-xl border-gray-300 focus:border-[#ff5b21] focus:ring-[#ff5b21]"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    {/* Assigned To - Modern Select */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Assigner à
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewTask({ ...newTask, assignedTo: '' })}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                            newTask.assignedTo === ''
                              ? 'shadow-md'
                              : 'border-gray-200'
                          }`}
                          style={newTask.assignedTo === '' ? {
                            borderColor: '#ff5b21',
                            background: 'rgba(217, 87, 79, 0.08)'
                          } : undefined}
                          onMouseEnter={(e) => {
                            if (newTask.assignedTo !== '') {
                              e.currentTarget.style.borderColor = '#ff8c6b';
                              e.currentTarget.style.background = 'rgba(217, 87, 79, 0.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (newTask.assignedTo !== '') {
                              e.currentTarget.style.borderColor = '#e5e7eb';
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="text-xs font-semibold" style={newTask.assignedTo === '' ? { color: '#c23f21' } : { color: '#6b7280' }}>
                            Non assigné
                          </span>
                        </button>

                        {roommates.map((roommate) => (
                          <button
                            key={roommate.id}
                            type="button"
                            onClick={() => setNewTask({ ...newTask, assignedTo: roommate.id })}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                              newTask.assignedTo === roommate.id
                                ? 'shadow-md'
                                : 'border-gray-200'
                            }`}
                            style={newTask.assignedTo === roommate.id ? {
                              borderColor: '#ff5b21',
                              background: 'rgba(217, 87, 79, 0.08)'
                            } : undefined}
                            onMouseEnter={(e) => {
                              if (newTask.assignedTo !== roommate.id) {
                                e.currentTarget.style.borderColor = '#ff8c6b';
                                e.currentTarget.style.background = 'rgba(217, 87, 79, 0.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (newTask.assignedTo !== roommate.id) {
                                e.currentTarget.style.borderColor = '#e5e7eb';
                                e.currentTarget.style.background = 'transparent';
                              }
                            }}
                          >
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                 style={{
                                   background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)'
                                 }}>
                              {roommate.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-semibold" style={newTask.assignedTo === roommate.id ? { color: '#c23f21' } : { color: '#6b7280' }}>
                              {roommate.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => setShowCreateModal(false)}
                        variant="outline"
                        className="flex-1 rounded-full border-gray-300 hover:bg-gray-50"
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={createTask}
                        disabled={!newTask.title.trim() || isCreating}
                        className="flex-1 rounded-full text-white hover:shadow-lg transition-all disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
                      >
                        {isCreating ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Création...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Créer la tâche
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
