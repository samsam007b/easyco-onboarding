'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import { useLanguage } from '@/lib/i18n/use-language';
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
  Settings,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

// V3 Owner gradient constants
const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)';
const ownerGradientLight = 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)';

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
  const { getSection, language } = useLanguage();
  const t = getSection('dashboard')?.owner?.maintenancePage;
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
        label: t?.priority?.high?.[language] || 'Urgent',
        icon: AlertCircle
      },
      medium: {
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        label: t?.priority?.medium?.[language] || 'Moyen',
        icon: Clock
      },
      low: {
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: t?.priority?.low?.[language] || 'Faible',
        icon: Activity
      }
    };
    return config[priority];
  };

  const getStatusConfig = (status: 'pending' | 'in_progress' | 'completed') => {
    const config = {
      pending: {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: t?.status?.pending?.[language] || 'En attente',
        icon: Clock
      },
      in_progress: {
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: t?.status?.inProgress?.[language] || 'En cours',
        icon: Settings
      },
      completed: {
        className: 'bg-green-100 text-green-800 border-green-200',
        label: t?.status?.completed?.[language] || 'Terminé',
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: ownerGradientLight }}
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t?.loading?.title?.[language] || 'Chargement de la maintenance...'}
          </h3>
          <p className="text-gray-600">
            {t?.loading?.subtitle?.[language] || 'Préparation de vos données'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: ownerGradientLight }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6"
        >
          {/* V3 Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: ownerGradient }} />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-10" style={{ background: ownerGradient }} />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                {/* V3 Animated Icon with glow and sparkles */}
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-2xl blur-lg"
                    style={{ background: ownerGradient }}
                  />
                  <div
                    className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: ownerGradient }}
                  >
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </motion.div>
                </div>
                {t?.header?.title?.[language] || 'Maintenance'}
              </h1>
              <p className="text-gray-600">
                {t?.header?.subtitle?.[language] || 'Gérer les tickets de maintenance de vos propriétés'}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => {/* TODO: Open add ticket modal */}}
                className="rounded-full text-white border-0 shadow-md hover:shadow-lg transition-all"
                style={{
                  background: ownerGradient,
                  boxShadow: '0 4px 12px rgba(156, 86, 152, 0.3)'
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                {t?.header?.newTicket?.[language] || 'Nouveau Ticket'}
              </Button>
            </motion.div>
          </div>

          {/* Stats with V3 styling */}
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Total - Owner primary */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden p-4 rounded-xl border border-purple-200/50 shadow-sm"
              style={{ background: ownerGradientLight }}
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full opacity-15" style={{ background: ownerGradient }} />
              <div className="relative flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ background: ownerGradient }}
                >
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {t?.stats?.total?.[language] || 'Total'}
                </p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#9c5698' }}>{stats.total}</p>
            </motion.div>

            {/* Pending - Amber semantic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.15 }}
              className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200/50 shadow-sm"
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-amber-400 opacity-15" />
              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-sm">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {t?.stats?.pending?.[language] || 'En attente'}
                </p>
              </div>
              <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
            </motion.div>

            {/* In Progress - Blue semantic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200/50 shadow-sm"
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-blue-400 opacity-15" />
              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {t?.stats?.inProgress?.[language] || 'En cours'}
                </p>
              </div>
              <p className="text-2xl font-bold text-blue-700">{stats.in_progress}</p>
            </motion.div>

            {/* Completed - Green semantic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.25 }}
              className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200/50 shadow-sm"
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-green-400 opacity-15" />
              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {t?.stats?.completed?.[language] || 'Terminés'}
                </p>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </motion.div>
          </div>

          {/* Filters with V3 styling */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { value: 'all', label: t?.filters?.all?.[language] || 'Tous', count: stats.total },
              { value: 'pending', label: t?.filters?.pending?.[language] || 'En attente', count: stats.pending },
              { value: 'in_progress', label: t?.filters?.inProgress?.[language] || 'En cours', count: stats.in_progress },
              { value: 'completed', label: t?.filters?.completed?.[language] || 'Terminés', count: stats.completed }
            ].map((filter) => (
              <motion.div key={filter.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant={filterStatus === filter.value ? 'default' : 'outline'}
                  onClick={() => setFilterStatus(filter.value as typeof filterStatus)}
                  size="sm"
                  className={cn(
                    "rounded-full transition-all border",
                    filterStatus === filter.value
                      ? 'text-white border-transparent shadow-md'
                      : 'hover:border-purple-400 bg-white/80'
                  )}
                  style={filterStatus === filter.value ? {
                    background: ownerGradient,
                    boxShadow: '0 4px 12px rgba(156, 86, 152, 0.3)'
                  } : undefined}
                >
                  {filter.label} ({filter.count})
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-200"
          >
            {/* V3 Decorative circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: ownerGradient }} />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-10" style={{ background: ownerGradient }} />

            {/* V3 Animated Icon */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-2xl blur-lg"
                style={{ background: ownerGradient }}
              />
              <div
                className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: ownerGradient }}
              >
                <Wrench className="w-10 h-10 text-white" />
              </div>
              <motion.div
                animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
              </motion.div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {t?.empty?.title?.[language] || 'Aucun ticket trouvé'}
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              {filterStatus === 'all'
                ? (t?.empty?.createFirst?.[language] || 'Créez votre premier ticket de maintenance')
                : (t?.empty?.noWithStatus?.[language] || 'Aucun ticket avec ce statut')}
            </p>
            {filterStatus === 'all' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {/* TODO: Open add ticket modal */}}
                  className="rounded-full text-white border-0 px-8 shadow-md hover:shadow-lg transition-all"
                  style={{
                    background: ownerGradient,
                    boxShadow: '0 4px 12px rgba(156, 86, 152, 0.3)'
                  }}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t?.empty?.createButton?.[language] || 'Créer un ticket'}
                </Button>
              </motion.div>
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
                  whileHover={{ scale: 1.01, y: -2 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
                  style={{ borderLeftWidth: '4px', borderLeftColor: '#9c5698' }}
                  onClick={() => {/* TODO: Open ticket details */}}
                >
                  {/* V3 Decorative circle */}
                  <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10" style={{ background: ownerGradient }} />

                  <div className="relative flex flex-col lg:flex-row gap-6">
                    {/* Ticket Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                          style={{ background: ownerGradient }}
                        >
                          <Wrench className="w-5 h-5 text-white" />
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
                                <span>{t?.card?.assignedTo?.[language] || 'Assigné à :'} <span className="font-semibold">{ticket.assignedTo}</span></span>
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

                    {/* Action Area with V3 styling */}
                    <div className="flex lg:flex-col gap-2 lg:w-48">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            /* TODO: View details */
                          }}
                        >
                          {t?.actions?.viewDetails?.[language] || 'Voir Détails'}
                        </Button>
                      </motion.div>
                      {ticket.status !== 'completed' && (
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                          <Button
                            className="w-full rounded-xl text-white border-0 shadow-md transition-all"
                            style={{
                              background: ownerGradient,
                              boxShadow: '0 4px 12px rgba(156, 86, 152, 0.3)'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              /* TODO: Update status */
                            }}
                          >
                            {ticket.status === 'pending'
                              ? (t?.actions?.start?.[language] || 'Commencer')
                              : (t?.actions?.complete?.[language] || 'Terminer')}
                          </Button>
                        </motion.div>
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
