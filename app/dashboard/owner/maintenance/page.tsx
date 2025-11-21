'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  MapPin,
  Activity,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaintenanceTicket {
  id: string;
  property: string;
  issue: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string | null;
  created: string;
}

export default function MaintenancePage() {
  const router = useRouter();
  const { setActiveRole } = useRole();
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setActiveRole('owner');
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const tickets: MaintenanceTicket[] = [
    {
      id: '1',
      property: 'Brussels Centre Apartment',
      issue: 'Réparation du chauffage',
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'Jean Technicien',
      created: 'Il y a 2 heures',
    },
    {
      id: '2',
      property: 'Ixelles Coliving',
      issue: 'Serrure de porte cassée',
      priority: 'medium',
      status: 'pending',
      assignedTo: null,
      created: 'Il y a 1 jour',
    },
    {
      id: '3',
      property: 'Etterbeek Studio',
      issue: 'Fuite du robinet',
      priority: 'low',
      status: 'completed',
      assignedTo: 'Michel Plombier',
      created: 'Il y a 3 jours',
    },
  ];

  const getPriorityConfig = (priority: 'high' | 'medium' | 'low') => {
    const config = {
      high: {
        className: 'bg-red-100 text-red-800 border-red-200',
        label: 'Urgent',
        icon: AlertCircle
      },
      medium: {
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        label: 'Moyen',
        icon: Clock
      },
      low: {
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Faible',
        icon: Activity
      }
    };
    return config[priority];
  };

  const getStatusConfig = (status: 'pending' | 'in_progress' | 'completed') => {
    const config = {
      pending: {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'En attente',
        icon: Clock
      },
      in_progress: {
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'En cours',
        icon: Settings
      },
      completed: {
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'Terminé',
        icon: CheckCircle
      }
    };
    return config[status];
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filterStatus === 'all') return true;
    return ticket.status === filterStatus;
  });

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'pending').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    completed: tickets.filter(t => t.status === 'completed').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Chargement de la maintenance...</h3>
          <p className="text-gray-600">Préparation de vos données</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-200/70 to-indigo-200/70 flex items-center justify-center shadow-sm">
                  <Wrench className="w-6 h-6 text-gray-700" />
                </div>
                Maintenance
              </h1>
              <p className="text-gray-600">
                Gérer les tickets de maintenance de vos propriétés
              </p>
            </div>
            <Button
              onClick={() => {/* TODO: Open add ticket modal */}}
              className="rounded-full bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 hover:from-purple-300/70 hover:to-indigo-300/70 shadow-sm hover:shadow-md hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau Ticket
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 p-4 rounded-xl border border-purple-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="w-4 h-4 text-purple-600" />
                <p className="text-sm text-gray-600 font-medium">Total</p>
              </div>
              <p className="text-2xl font-bold text-purple-900">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-yellow-50/50 to-amber-50/50 p-4 rounded-xl border border-yellow-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <p className="text-sm text-gray-600 font-medium">En attente</p>
              </div>
              <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 p-4 rounded-xl border border-blue-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-gray-600 font-medium">En cours</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">{stats.in_progress}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 p-4 rounded-xl border border-green-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm text-gray-600 font-medium">Terminés</p>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Tous', count: stats.total },
              { value: 'pending', label: 'En attente', count: stats.pending },
              { value: 'in_progress', label: 'En cours', count: stats.in_progress },
              { value: 'completed', label: 'Terminés', count: stats.completed }
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={filterStatus === filter.value ? 'default' : 'outline'}
                onClick={() => setFilterStatus(filter.value as typeof filterStatus)}
                size="sm"
                className={cn(
                  "rounded-full transition-all",
                  filterStatus === filter.value
                    ? 'bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 border-purple-300 hover:from-purple-300/70 hover:to-indigo-300/70'
                    : 'hover:border-purple-300'
                )}
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-200"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-200/70 to-indigo-200/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Wrench className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Aucun ticket trouvé
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              {filterStatus === 'all'
                ? 'Créez votre premier ticket de maintenance'
                : 'Aucun ticket avec ce statut'}
            </p>
            {filterStatus === 'all' && (
              <Button
                onClick={() => {/* TODO: Open add ticket modal */}}
                className="rounded-full bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 hover:from-purple-300/70 hover:to-indigo-300/70 px-8 shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Créer un ticket
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket, index) => {
              const statusConfig = getStatusConfig(ticket.status);
              const priorityConfig = getPriorityConfig(ticket.priority);
              const StatusIcon = statusConfig.icon;
              const PriorityIcon = priorityConfig.icon;

              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-[1.01] p-6 cursor-pointer"
                  onClick={() => {/* TODO: Open ticket details */}}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Ticket Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                          <Wrench className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold text-gray-900">
                              {ticket.issue}
                            </h3>
                            <Badge className={statusConfig.className}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                            <Badge className={priorityConfig.className}>
                              <PriorityIcon className="w-3 h-3 mr-1" />
                              {priorityConfig.label}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span>{ticket.property}</span>
                            </div>

                            {ticket.assignedTo && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <User className="w-4 h-4 text-gray-500" />
                                <span>Assigné à : <span className="font-semibold">{ticket.assignedTo}</span></span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{ticket.created}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex lg:flex-col gap-2 lg:w-48">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl hover:bg-purple-50 hover:border-purple-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          /* TODO: View details */
                        }}
                      >
                        Voir Détails
                      </Button>
                      {ticket.status !== 'completed' && (
                        <Button
                          className="flex-1 rounded-xl bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 hover:from-purple-300/70 hover:to-indigo-300/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            /* TODO: Update status */
                          }}
                        >
                          {ticket.status === 'pending' ? 'Commencer' : 'Terminer'}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
