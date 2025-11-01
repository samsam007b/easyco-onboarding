'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
  User,
  Calendar as CalendarIcon,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
}

export default function HubTasksPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Payer le loyer',
      description: 'Virement à faire avant le 5 du mois',
      dueDate: '2024-11-05',
      priority: 'high',
      status: 'todo',
      assignedTo: 'Tous',
      createdBy: 'Sarah',
      createdAt: '2024-10-25'
    },
    {
      id: '2',
      title: 'Nettoyage cuisine',
      description: 'Grand nettoyage hebdomadaire',
      dueDate: '2024-11-03',
      priority: 'medium',
      status: 'in_progress',
      assignedTo: 'Marc',
      createdBy: 'Julie',
      createdAt: '2024-11-01'
    },
    {
      id: '3',
      title: 'Réunion mensuelle',
      description: 'Discuter des règles et des dépenses',
      dueDate: '2024-11-08',
      priority: 'medium',
      status: 'todo',
      assignedTo: 'Tous',
      createdBy: 'Sarah',
      createdAt: '2024-10-30'
    },
    {
      id: '4',
      title: 'Sortir les poubelles',
      description: 'Jour de collecte',
      dueDate: '2024-11-02',
      priority: 'low',
      status: 'completed',
      assignedTo: 'Julie',
      createdBy: 'Marc',
      createdAt: '2024-11-01'
    },
    {
      id: '5',
      title: 'Réparer lave-vaisselle',
      description: 'Contacter le réparateur',
      dueDate: '2024-11-10',
      priority: 'high',
      status: 'todo',
      assignedTo: 'Sarah',
      createdBy: 'Sarah',
      createdAt: '2024-10-31'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/login');
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        let newStatus: 'todo' | 'in_progress' | 'completed' = 'todo';
        if (task.status === 'todo') newStatus = 'in_progress';
        else if (task.status === 'in_progress') newStatus = 'completed';
        else newStatus = 'todo';

        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(task => task.status === filter);

  const todoCount = tasks.filter(t => t.status === 'todo').length;
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
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
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
            className="mb-4 rounded-full"
          >
            ← Retour au hub
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Tâches de la Coloc
              </h1>
              <p className="text-gray-600">
                Organisez et suivez les tâches communes
              </p>
            </div>

            <Button
              className="rounded-full bg-gradient-to-r from-orange-600 to-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle tâche
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              onClick={() => setFilter('todo')}
              className={cn(
                "bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left",
                filter === 'todo' && "ring-2 ring-orange-500"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">À faire</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{todoCount}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Circle className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setFilter('in_progress')}
              className={cn(
                "bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left",
                filter === 'in_progress' && "ring-2 ring-orange-500"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En cours</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{inProgressCount}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setFilter('completed')}
              className={cn(
                "bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left",
                filter === 'completed' && "ring-2 ring-orange-500"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terminées</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{completedCount}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className="rounded-full"
            size="sm"
          >
            Toutes
          </Button>
          <Button
            onClick={() => setFilter('todo')}
            variant={filter === 'todo' ? 'default' : 'outline'}
            className="rounded-full"
            size="sm"
          >
            À faire
          </Button>
          <Button
            onClick={() => setFilter('in_progress')}
            variant={filter === 'in_progress' ? 'default' : 'outline'}
            className="rounded-full"
            size="sm"
          >
            En cours
          </Button>
          <Button
            onClick={() => setFilter('completed')}
            variant={filter === 'completed' ? 'default' : 'outline'}
            className="rounded-full"
            size="sm"
          >
            Terminées
          </Button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task, index) => {
              const StatusIcon = getStatusIcon(task.status);
              const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all",
                    task.status === 'completed' && "opacity-60"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={cn(
                        "flex-shrink-0 transition-colors",
                        getStatusColor(task.status)
                      )}
                    >
                      <StatusIcon className="w-6 h-6" />
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className={cn(
                          "text-lg font-bold text-gray-900",
                          task.status === 'completed' && "line-through text-gray-500"
                        )}>
                          {task.title}
                        </h3>

                        <Button
                          onClick={() => deleteTask(task.id)}
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Priority */}
                        <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                          {getPriorityLabel(task.priority)}
                        </Badge>

                        {/* Due Date */}
                        <div className={cn(
                          "flex items-center gap-1 text-xs",
                          isOverdue ? "text-red-600" : "text-gray-600"
                        )}>
                          {isOverdue && <AlertCircle className="w-3 h-3" />}
                          <CalendarIcon className="w-3 h-3" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </div>

                        {/* Assigned To */}
                        {task.assignedTo && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{task.assignedTo}</span>
                          </div>
                        )}
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
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucune tâche {filter !== 'all' && filter}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'completed'
                ? 'Commencez à accomplir vos tâches!'
                : 'Ajoutez votre première tâche pour organiser votre coloc'
              }
            </p>
            <Button className="rounded-full bg-gradient-to-r from-orange-600 to-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Créer une tâche
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
