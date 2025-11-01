'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  MessageSquare,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MaintenanceTicket {
  id: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'heating' | 'appliance' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  images?: string[];
  comments?: { author: string; text: string; date: string; }[];
}

const CATEGORIES = [
  { id: 'plumbing', label: 'Plomberie', icon: '🚰', color: 'blue' },
  { id: 'electrical', label: 'Électricité', icon: '⚡', color: 'yellow' },
  { id: 'heating', label: 'Chauffage', icon: '🔥', color: 'orange' },
  { id: 'appliance', label: 'Électroménager', icon: '🔧', color: 'purple' },
  { id: 'other', label: 'Autre', icon: '📦', color: 'gray' }
];

export default function HubMaintenancePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([
    {
      id: '1',
      title: 'Fuite d\'eau salle de bain',
      description: 'Le robinet de la douche fuit depuis hier soir. L\'eau coule en continu même quand le robinet est fermé.',
      category: 'plumbing',
      priority: 'high',
      status: 'in_progress',
      createdBy: 'Sarah',
      createdAt: '2024-11-01T10:30:00',
      updatedAt: '2024-11-01T14:00:00',
      assignedTo: 'Plombier Pro',
      comments: [
        { author: 'Plombier Pro', text: 'Je passe demain matin pour réparer', date: '2024-11-01T14:00:00' }
      ]
    },
    {
      id: '2',
      title: 'Chauffage ne fonctionne pas',
      description: 'Le radiateur de la chambre 2 ne chauffe plus du tout.',
      category: 'heating',
      priority: 'urgent',
      status: 'pending',
      createdBy: 'Marc',
      createdAt: '2024-11-02T08:00:00',
      updatedAt: '2024-11-02T08:00:00'
    },
    {
      id: '3',
      title: 'Lave-vaisselle ne démarre plus',
      description: 'Lorsqu\'on appuie sur le bouton start, rien ne se passe.',
      category: 'appliance',
      priority: 'medium',
      status: 'pending',
      createdBy: 'Julie',
      createdAt: '2024-10-31T16:00:00',
      updatedAt: '2024-10-31T16:00:00'
    },
    {
      id: '4',
      title: 'Ampoule grillée couloir',
      description: 'L\'ampoule du couloir est grillée, besoin d\'en changer une.',
      category: 'electrical',
      priority: 'low',
      status: 'completed',
      createdBy: 'Sarah',
      createdAt: '2024-10-28T12:00:00',
      updatedAt: '2024-10-29T10:00:00',
      assignedTo: 'Marc'
    }
  ]);

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

  const filteredTickets = filter === 'all'
    ? tickets
    : tickets.filter(ticket => ticket.status === filter);

  const pendingCount = tickets.filter(t => t.status === 'pending').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const completedCount = tickets.filter(t => t.status === 'completed').length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getCategoryInfo = (category: string) => {
    return CATEGORIES.find(c => c.id === category) || CATEGORIES[4];
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
                Maintenance & Réparations
              </h1>
              <p className="text-gray-600">
                Signalez et suivez les problèmes techniques
              </p>
            </div>

            <Button
              className="rounded-full bg-gradient-to-r from-orange-600 to-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau ticket
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              onClick={() => setFilter('pending')}
              className={cn(
                "bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left",
                filter === 'pending' && "ring-2 ring-orange-500"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{pendingCount}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-gray-600" />
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
                  <p className="text-sm font-medium text-gray-600">Terminés</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{completedCount}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className="rounded-full"
            size="sm"
          >
            Tous
          </Button>
          <Button
            onClick={() => setFilter('pending')}
            variant={filter === 'pending' ? 'default' : 'outline'}
            className="rounded-full"
            size="sm"
          >
            En attente
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
            Terminés
          </Button>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTickets.map((ticket, index) => {
              const categoryInfo = getCategoryInfo(ticket.category);

              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Category Icon */}
                    <div className="text-4xl">{categoryInfo.icon}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{ticket.title}</h3>
                            {getStatusIcon(ticket.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityLabel(ticket.priority)}
                          </Badge>
                          <Badge className="border border-gray-300 bg-white text-gray-700">
                            {categoryInfo.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Créé par {ticket.createdBy}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(ticket.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        {ticket.assignedTo && (
                          <div className="flex items-center gap-1">
                            <Wrench className="w-3 h-3" />
                            Assigné à {ticket.assignedTo}
                          </div>
                        )}
                        <Badge variant={
                          ticket.status === 'completed' ? 'success' :
                          ticket.status === 'in_progress' ? 'warning' :
                          ticket.status === 'cancelled' ? 'error' : 'default'
                        }>
                          {getStatusLabel(ticket.status)}
                        </Badge>
                      </div>

                      {/* Comments */}
                      {ticket.comments && ticket.comments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MessageSquare className="w-4 h-4" />
                            {ticket.comments.length} commentaire{ticket.comments.length > 1 ? 's' : ''}
                          </div>
                          <div className="space-y-2">
                            {ticket.comments.map((comment, idx) => (
                              <div key={idx} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold text-gray-900">{comment.author}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(comment.date).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{comment.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTickets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucun ticket {filter !== 'all' && filter}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'completed'
                ? 'Aucune réparation terminée pour le moment'
                : 'Créez votre premier ticket pour signaler un problème'
              }
            </p>
            <Button className="rounded-full bg-gradient-to-r from-orange-600 to-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Créer un ticket
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
