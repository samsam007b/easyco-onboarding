'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import { useLanguage } from '@/lib/i18n/use-language';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  AlertTriangle,
  Home,
  XCircle,
  DollarSign,
  RefreshCw,
  TrendingUp,
  Loader2,
  ChevronLeft,
  Users,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { maintenanceService } from '@/lib/services/maintenance-service';
import type {
  MaintenanceRequestWithCreator,
  MaintenanceStatus,
  MaintenancePriority,
  MaintenanceCategory,
  MAINTENANCE_CATEGORIES,
  MAINTENANCE_PRIORITIES
} from '@/types/maintenance.types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// V3 Owner gradient constants
const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)';
const ownerGradientLight = 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)';

// Category config for display
const CATEGORY_CONFIG: Record<MaintenanceCategory, { label: string; emoji: string; color: string }> = {
  plumbing: { label: 'Plomberie', emoji: '🚰', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  electrical: { label: 'Électricité', emoji: '⚡', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  heating: { label: 'Chauffage', emoji: '🔥', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  appliances: { label: 'Électroménager', emoji: '🔌', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  structural: { label: 'Structure', emoji: '🏗️', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  cleaning: { label: 'Nettoyage', emoji: '🧹', color: 'bg-green-100 text-green-700 border-green-200' },
  pest_control: { label: 'Nuisibles', emoji: '🐛', color: 'bg-red-100 text-red-700 border-red-200' },
  other: { label: 'Autre', emoji: '🔧', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
};

interface PropertyInfo {
  id: string;
  name: string;
}

interface MaintenanceStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  totalCost: number;
  avgResolutionHours: number;
}

export default function MaintenancePage() {
  const router = useRouter();
  const { setActiveRole } = useRole();
  const { getSection, language } = useLanguage();
  const t = getSection('dashboard')?.owner?.maintenancePage;

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | MaintenanceStatus>('all');
  const [requests, setRequests] = useState<MaintenanceRequestWithCreator[]>([]);
  const [properties, setProperties] = useState<PropertyInfo[]>([]);
  const [stats, setStats] = useState<MaintenanceStats>({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    totalCost: 0,
    avgResolutionHours: 0,
  });

  // Fetch all maintenance requests across user's properties
  const fetchMaintenanceData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      setActiveRole('owner');

      // 1. Get user's properties
      const { data: userProperties, error: propError } = await supabase
        .from('properties')
        .select('id, name')
        .eq('owner_id', user.id);

      if (propError) {
        console.error('[Maintenance] Failed to fetch properties:', propError);
        setIsLoading(false);
        return;
      }

      if (!userProperties || userProperties.length === 0) {
        setProperties([]);
        setRequests([]);
        setIsLoading(false);
        return;
      }

      setProperties(userProperties);

      // 2. Fetch maintenance requests for all properties
      const allRequests: MaintenanceRequestWithCreator[] = [];

      for (const property of userProperties) {
        const propertyRequests = await maintenanceService.getRequests(property.id);
        // Add property name to each request for display
        const enrichedRequests = propertyRequests.map(req => ({
          ...req,
          property_name: property.name,
        }));
        allRequests.push(...enrichedRequests);
      }

      // Sort by created_at descending
      allRequests.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setRequests(allRequests);

      // 3. Calculate stats
      const openCount = allRequests.filter(r => r.status === 'open').length;
      const inProgressCount = allRequests.filter(r => r.status === 'in_progress').length;
      const resolvedCount = allRequests.filter(r =>
        r.status === 'resolved' || r.status === 'closed'
      ).length;
      const totalCost = allRequests.reduce((sum, r) => sum + (r.actual_cost || 0), 0);

      // Calculate average resolution time
      const resolvedRequests = allRequests.filter(r => r.resolved_at && r.created_at);
      const avgHours = resolvedRequests.length > 0
        ? resolvedRequests.reduce((sum, r) => {
            const created = new Date(r.created_at).getTime();
            const resolved = new Date(r.resolved_at!).getTime();
            return sum + (resolved - created) / (1000 * 60 * 60);
          }, 0) / resolvedRequests.length
        : 0;

      setStats({
        total: allRequests.length,
        open: openCount,
        in_progress: inProgressCount,
        resolved: resolvedCount,
        totalCost,
        avgResolutionHours: Math.round(avgHours),
      });

    } catch (error) {
      console.error('[Maintenance] Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router, setActiveRole]);

  useEffect(() => {
    fetchMaintenanceData();
  }, [fetchMaintenanceData]);

  // Update request status
  const handleUpdateStatus = async (requestId: string, newStatus: MaintenanceStatus) => {
    setIsUpdating(requestId);
    try {
      const result = await maintenanceService.updateStatus(requestId, newStatus);
      if (result.success) {
        // Refresh data
        await fetchMaintenanceData();
      } else {
        console.error('Failed to update status:', result.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  // Priority config for display
  const getPriorityConfig = (priority: MaintenancePriority) => {
    const config = {
      low: {
        className: 'bg-gray-100 text-gray-700 border-gray-200',
        label: 'Basse',
        icon: Activity,
        borderColor: '#9ca3af'
      },
      medium: {
        className: 'bg-blue-100 text-blue-700 border-blue-200',
        label: 'Moyenne',
        icon: Clock,
        borderColor: '#3b82f6'
      },
      high: {
        className: 'bg-orange-100 text-orange-700 border-orange-200',
        label: 'Haute',
        icon: AlertTriangle,
        borderColor: '#f97316'
      },
      emergency: {
        className: 'bg-red-100 text-red-800 border-red-300',
        label: 'Urgence',
        icon: AlertCircle,
        borderColor: '#ef4444'
      }
    };
    return config[priority] || config.medium;
  };

  // Status config for display
  const getStatusConfig = (status: MaintenanceStatus) => {
    const config = {
      open: {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Ouvert',
        icon: Clock
      },
      in_progress: {
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'En cours',
        icon: Settings
      },
      resolved: {
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'Résolu',
        icon: CheckCircle
      },
      closed: {
        className: 'bg-gray-100 text-gray-700 border-gray-200',
        label: 'Fermé',
        icon: XCircle
      },
      cancelled: {
        className: 'bg-red-100 text-red-700 border-red-200',
        label: 'Annulé',
        icon: XCircle
      }
    };
    return config[status] || config.open;
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  // Format relative date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr
      });
    } catch {
      return dateString;
    }
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
            Chargement de la maintenance...
          </h3>
          <p className="text-gray-600">
            Récupération des demandes depuis Supabase
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
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm mb-4"
        >
          <button
            onClick={() => router.push('/dashboard/owner')}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Command Center
          </button>
          <span className="text-gray-300">/</span>
          <span className="font-medium" style={{ color: '#9c5698' }}>Maintenance</span>
        </motion.div>

        {/* Quick Navigation Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-4"
        >
          <button
            onClick={() => router.push('/dashboard/owner/tenants')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/60 border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700 transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            Locataires
          </button>
          <button
            onClick={() => router.push('/dashboard/owner/leases')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/60 border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            Baux
          </button>
          <button
            onClick={() => router.push('/dashboard/owner/finance')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/60 border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700 transition-all"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Finances
          </button>
        </motion.div>

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
                Maintenance
              </h1>
              <p className="text-gray-600">
                {properties.length > 0
                  ? `${requests.length} demande${requests.length !== 1 ? 's' : ''} sur ${properties.length} propriété${properties.length !== 1 ? 's' : ''}`
                  : 'Aucune propriété trouvée'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Refresh button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLoading(true);
                    fetchMaintenanceData();
                  }}
                  className="rounded-full border-gray-300 hover:border-purple-400"
                >
                  <RefreshCw className="w-5 h-5" />
                </Button>
              </motion.div>
              {/* New ticket button */}
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
                  Nouvelle Demande
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Stats with V3 styling */}
          <div className="relative grid grid-cols-2 lg:grid-cols-5 gap-4">
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
                <p className="text-sm text-gray-600 font-medium">Total</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#9c5698' }}>{stats.total}</p>
            </motion.div>

            {/* Open - Amber semantic */}
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
                <p className="text-sm text-gray-600 font-medium">Ouvertes</p>
              </div>
              <p className="text-2xl font-bold text-amber-700">{stats.open}</p>
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
                <p className="text-sm text-gray-600 font-medium">En cours</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">{stats.in_progress}</p>
            </motion.div>

            {/* Resolved - Green semantic */}
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
                <p className="text-sm text-gray-600 font-medium">Résolues</p>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.resolved}</p>
            </motion.div>

            {/* Total Cost / Avg Resolution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200/50 shadow-sm col-span-2 lg:col-span-1"
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full opacity-15" style={{ background: ownerGradient }} />
              <div className="relative flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ background: ownerGradient }}
                >
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Performance</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-lg font-bold" style={{ color: '#9c5698' }}>
                  {stats.avgResolutionHours > 0 ? `${stats.avgResolutionHours}h` : '-'}
                </p>
                <span className="text-xs text-gray-500">moy. résolution</span>
              </div>
              {stats.totalCost > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Coûts: {stats.totalCost.toFixed(0)}€
                </p>
              )}
            </motion.div>
          </div>

          {/* Filters with V3 styling */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { value: 'all' as const, label: 'Toutes', count: stats.total },
              { value: 'open' as const, label: 'Ouvertes', count: stats.open },
              { value: 'in_progress' as const, label: 'En cours', count: stats.in_progress },
              { value: 'resolved' as const, label: 'Résolues', count: stats.resolved }
            ].map((filter) => (
              <motion.div key={filter.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant={filterStatus === filter.value ? 'default' : 'outline'}
                  onClick={() => setFilterStatus(filter.value)}
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

        {/* Alert Banner for Urgent Open Requests */}
        <AnimatePresence>
          {requests.filter(r => r.status === 'open' && r.priority === 'high').length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <div className="relative overflow-hidden rounded-2xl p-4 border-2 bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center flex-shrink-0"
                  >
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-red-800">
                      {requests.filter(r => r.status === 'open' && r.priority === 'high').length} demande{requests.filter(r => r.status === 'open' && r.priority === 'high').length > 1 ? 's' : ''} urgente{requests.filter(r => r.status === 'open' && r.priority === 'high').length > 1 ? 's' : ''} en attente
                    </h3>
                    <p className="text-sm text-red-600">
                      Ces demandes nécessitent une intervention rapide
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterStatus('open')}
                    className="rounded-full border-2 border-red-300 text-red-700 hover:bg-red-100 font-medium"
                  >
                    Voir les urgences
                    <AlertCircle className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Requests List */}
        <AnimatePresence mode="wait">
          {filteredRequests.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                {properties.length === 0
                  ? 'Aucune propriété'
                  : filterStatus === 'all'
                    ? 'Aucune demande de maintenance'
                    : 'Aucune demande avec ce statut'}
              </h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                {properties.length === 0
                  ? 'Ajoutez une propriété pour commencer à gérer la maintenance'
                  : filterStatus === 'all'
                    ? 'Vos propriétés sont en parfait état !'
                    : 'Essayez un autre filtre'}
              </p>
              {filterStatus === 'all' && properties.length > 0 && (
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
                    Créer une demande
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredRequests.map((request, index) => {
                const statusConfig = getStatusConfig(request.status);
                const priorityConfig = getPriorityConfig(request.priority);
                const categoryConfig = CATEGORY_CONFIG[request.category] || CATEGORY_CONFIG.other;
                const StatusIcon = statusConfig.icon;
                const PriorityIcon = priorityConfig.icon;
                const isBeingUpdated = isUpdating === request.id;

                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={{ delay: 0.1 + index * 0.03 }}
                    className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
                    style={{
                      borderLeftWidth: '4px',
                      borderLeftColor: priorityConfig.borderColor
                    }}
                    onClick={() => {/* TODO: Open request details */}}
                  >
                    {/* V3 Decorative circle */}
                    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10" style={{ background: ownerGradient }} />

                    <div className="relative flex flex-col lg:flex-row gap-6">
                      {/* Request Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          {/* Category Icon */}
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm text-xl"
                            style={{ background: ownerGradientLight }}
                          >
                            {categoryConfig.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-lg font-bold text-gray-900">
                                {request.title}
                              </h3>
                              <Badge className={cn(statusConfig.className, "border")}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                              <Badge className={cn(priorityConfig.className, "border")}>
                                <PriorityIcon className="w-3 h-3 mr-1" />
                                {priorityConfig.label}
                              </Badge>
                              <Badge className={cn(categoryConfig.color, "border")}>
                                {categoryConfig.label}
                              </Badge>
                            </div>

                            {request.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {request.description}
                              </p>
                            )}

                            <div className="space-y-1.5 text-sm">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Home className="w-4 h-4 text-gray-500" />
                                <span>{(request as any).property_name || 'Propriété'}</span>
                              </div>

                              {request.location && (
                                <div className="flex items-center gap-2 text-gray-700">
                                  <MapPin className="w-4 h-4 text-gray-500" />
                                  <span>{request.location}</span>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-gray-700">
                                <User className="w-4 h-4 text-gray-500" />
                                <span>Signalé par: <span className="font-medium">{request.creator_name}</span></span>
                              </div>

                              {request.assigned_to && (
                                <div className="flex items-center gap-2 text-gray-700">
                                  <Wrench className="w-4 h-4 text-gray-500" />
                                  <span>Assigné à: <span className="font-semibold">{request.assigned_to}</span></span>
                                </div>
                              )}

                              <div className="flex items-center gap-4 text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(request.created_at)}</span>
                                </div>
                                {request.actual_cost && (
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>{request.actual_cost}€</span>
                                  </div>
                                )}
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
                            Voir Détails
                          </Button>
                        </motion.div>

                        {/* Status update buttons */}
                        {request.status === 'open' && (
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                            <Button
                              className="w-full rounded-xl text-white border-0 shadow-md transition-all"
                              style={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                              }}
                              disabled={isBeingUpdated}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(request.id, 'in_progress');
                              }}
                            >
                              {isBeingUpdated ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Settings className="w-4 h-4 mr-2" />
                                  Commencer
                                </>
                              )}
                            </Button>
                          </motion.div>
                        )}

                        {request.status === 'in_progress' && (
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                            <Button
                              className="w-full rounded-xl text-white border-0 shadow-md transition-all"
                              style={{
                                background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                              }}
                              disabled={isBeingUpdated}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(request.id, 'resolved');
                              }}
                            >
                              {isBeingUpdated ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Résoudre
                                </>
                              )}
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
