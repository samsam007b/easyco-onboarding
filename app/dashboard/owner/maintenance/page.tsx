'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
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
  AlertTriangle,
  Home,
  XCircle,
  RefreshCw,
  TrendingUp,
  Loader2,
  LayoutGrid,
  List,
  Euro,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { maintenanceService } from '@/lib/services/maintenance-service';
import type {
  MaintenanceRequestWithCreator,
  MaintenanceRequestWithProperty,
  MaintenanceStatus,
  MaintenancePriority,
  MaintenanceCategory,
} from '@/types/maintenance.types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Shared owner components
import {
  OwnerPageHeader,
  OwnerKPICard,
  OwnerKPIGrid,
  OwnerAlertBanner,
} from '@/components/owner';

// Unique maintenance components
import {
  TicketKanbanBoard,
  CreateTicketModal,
  VendorRatingModal,
  AddVendorModal,
  type MaintenanceTicket,
  type TicketStatus,
  type TicketPriority,
  type TicketCategory,
} from '@/components/owner/maintenance';
import { CostTracker } from '@/components/owner/maintenance/CostTracker';
import { VendorDirectory } from '@/components/owner/maintenance/VendorDirectory';
import { vendorService, type Vendor, type VendorCategory } from '@/lib/services/vendor-service';
import type { CreateMaintenanceForm } from '@/types/maintenance.types';
import { toast } from 'sonner';

import { ownerGradient, ownerGradientLight } from '@/lib/constants/owner-theme';

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

// Map backend categories to Kanban categories
const mapCategory = (category: MaintenanceCategory): TicketCategory => {
  const mapping: Record<MaintenanceCategory, TicketCategory> = {
    plumbing: 'plumbing',
    electrical: 'electrical',
    heating: 'heating',
    appliances: 'appliance',
    structural: 'other',
    cleaning: 'other',
    pest_control: 'pest',
    other: 'other',
  };
  return mapping[category] || 'other';
};

// Map backend priorities to Kanban priorities
const mapPriority = (priority: MaintenancePriority): TicketPriority => {
  const mapping: Record<MaintenancePriority, TicketPriority> = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    emergency: 'urgent',
  };
  return mapping[priority] || 'medium';
};

// Map backend status to Kanban status
const mapStatus = (status: MaintenanceStatus): TicketStatus => {
  if (status === 'open') return 'open';
  if (status === 'in_progress') return 'in_progress';
  return 'resolved';
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

// Map vendor category to ticket category for display
const mapVendorCategoryToTicket = (category: VendorCategory): TicketCategory => {
  const mapping: Record<VendorCategory, TicketCategory> = {
    plumbing: 'plumbing',
    electrical: 'electrical',
    heating: 'heating',
    appliances: 'appliance',
    structural: 'other',
    cleaning: 'other',
    pest_control: 'pest',
    locksmith: 'locksmith',
    painting: 'painting',
    gardening: 'other',
    general: 'other',
    other: 'other',
  };
  return mapping[category] || 'other';
};

export default function MaintenancePage() {
  const router = useRouter();
  const { setActiveRole } = useRole();
  const { getSection, language } = useLanguage();
  const t = getSection('dashboard')?.owner?.maintenancePage;

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingVendor, setRatingVendor] = useState<{ id: string; name: string; maintenanceId?: string; propertyId?: string; jobType?: string } | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filterStatus, setFilterStatus] = useState<'all' | MaintenanceStatus>('all');
  const [requests, setRequests] = useState<MaintenanceRequestWithProperty[]>([]);
  const [properties, setProperties] = useState<PropertyInfo[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [stats, setStats] = useState<MaintenanceStats>({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    totalCost: 0,
    avgResolutionHours: 0,
  });

  // Debounce ref for refresh button (prevents rapid successive clicks)
  const lastRefreshRef = useRef<number>(0);
  const REFRESH_DEBOUNCE_MS = 2000;

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
      setCurrentUserId(user.id);

      // Fetch vendors for this owner
      const ownerVendors = await vendorService.getVendors(user.id);
      setVendors(ownerVendors);

      // 1. Get user's properties
      const { data: userProperties, error: propError } = await supabase
        .from('properties')
        .select('id, name')
        .eq('owner_id', user.id);

      if (propError) {
        console.error('[Maintenance] Failed to fetch properties:', propError);
        toast.error('Impossible de charger vos propriétés');
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

      // 2. Fetch maintenance requests for all properties (single batch query)
      const allRequests = await maintenanceService.getRequestsForProperties(userProperties);

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
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  }, [router, setActiveRole]);

  useEffect(() => {
    fetchMaintenanceData();
  }, [fetchMaintenanceData]);

  // Update request status (for Kanban drag-and-drop)
  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    setIsUpdating(ticketId);
    try {
      // Map Kanban status back to backend status
      const backendStatus: MaintenanceStatus = newStatus === 'resolved' ? 'resolved' : newStatus;
      const result = await maintenanceService.updateStatus(ticketId, backendStatus);
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

  // Create new maintenance ticket
  const handleCreateTicket = async (propertyId: string, form: CreateMaintenanceForm) => {
    setIsCreating(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Vous devez etre connecte pour creer une demande');
        return;
      }

      const result = await maintenanceService.createRequest(propertyId, user.id, form);

      if (result.success) {
        toast.success('Demande de maintenance creee avec succes');
        setShowCreateModal(false);
        await fetchMaintenanceData();
      } else {
        toast.error(result.error || 'Erreur lors de la creation');
      }
    } catch (error) {
      console.error('[Maintenance] Error creating ticket:', error);
      toast.error('Erreur lors de la creation de la demande');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle vendor toggle favorite
  const handleToggleFavorite = async (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    const success = await vendorService.toggleFavorite(vendorId, !vendor.isFavorite);
    if (success) {
      setVendors(prev => prev.map(v =>
        v.id === vendorId ? { ...v, isFavorite: !v.isFavorite } : v
      ));
      toast.success(vendor.isFavorite ? 'Retire des favoris' : 'Ajoute aux favoris');
    } else {
      toast.error('Erreur lors de la mise a jour');
    }
  };

  // Handle vendor rating after resolving a ticket
  const handleRateVendor = (vendorId: string, vendorName: string, maintenanceId?: string, propertyId?: string, jobType?: string) => {
    setRatingVendor({ id: vendorId, name: vendorName, maintenanceId, propertyId, jobType });
    setShowRatingModal(true);
  };

  // Transform vendors for VendorDirectory component format
  const vendorDirectoryData = useMemo(() => {
    return vendors.map(v => ({
      id: v.id,
      name: v.name,
      specialty: mapVendorCategoryToTicket(v.category),
      phone: v.phone || '',
      email: v.email,
      address: v.city ? `${v.address || ''}, ${v.city}`.trim() : v.address,
      rating: v.averageRating,
      totalJobs: v.totalJobs,
      avgResponseTime: undefined, // Would need to calculate from historical data
      isVerified: v.isVerified,
      isFavorite: v.isFavorite,
    }));
  }, [vendors]);

  // Transform requests to Kanban tickets
  const kanbanTickets: MaintenanceTicket[] = useMemo(() => {
    return requests
      .filter(r => r.status !== 'cancelled' && r.status !== 'closed')
      .map(request => ({
        id: request.id,
        title: request.title,
        description: request.description || '',
        propertyId: request.property_id,
        propertyName: request.property_name || 'Propriété',
        tenantId: request.created_by,
        tenantName: request.creator_name,
        status: mapStatus(request.status),
        priority: mapPriority(request.priority),
        category: mapCategory(request.category),
        createdAt: new Date(request.created_at),
        updatedAt: new Date(request.updated_at),
        estimatedCost: request.estimated_cost,
        actualCost: request.actual_cost,
        vendorName: request.assigned_to,
      }));
  }, [requests]);

  // Calculate cost data by category for CostTracker
  const costsByCategory = useMemo(() => {
    const categoryTotals = new Map<string, { amount: number; ticketCount: number }>();

    requests.forEach(request => {
      if (request.actual_cost) {
        const current = categoryTotals.get(request.category) || { amount: 0, ticketCount: 0 };
        categoryTotals.set(request.category, {
          amount: current.amount + request.actual_cost,
          ticketCount: current.ticketCount + 1,
        });
      }
    });

    return Array.from(categoryTotals.entries()).map(([category, data]) => ({
      category: mapCategory(category as MaintenanceCategory),
      amount: data.amount,
      ticketCount: data.ticketCount,
    }));
  }, [requests]);

  // Calculate monthly totals (simplified - would need date filtering in production)
  const currentMonthTotal = useMemo(() => {
    return requests.reduce((sum, r) => sum + (r.actual_cost || 0), 0);
  }, [requests]);

  // Previous month total (mock data - would need historical data in production)
  const previousMonthTotal = currentMonthTotal * 0.8; // Assume 20% less than current

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

  // Filter requests for list view
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

  // Urgent tickets count
  const urgentCount = requests.filter(r =>
    r.status === 'open' && (r.priority === 'high' || r.priority === 'emergency')
  ).length;

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
        {/* Header */}
        <OwnerPageHeader
          icon={Wrench}
          title="Maintenance"
          subtitle={properties.length > 0
            ? `${requests.length} demande${requests.length !== 1 ? 's' : ''} sur ${properties.length} propriété${properties.length !== 1 ? 's' : ''}`
            : 'Aucune propriété trouvée'}
          showSparkles
          breadcrumb={{
            label: 'Gestion',
            href: '/dashboard/owner/gestion',
          }}
          currentPage="Maintenance"
          actions={
            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg" role="group" aria-label="Mode d'affichage">
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                  className={cn(
                    "rounded-md px-3",
                    viewMode === 'kanban' ? 'text-white' : ''
                  )}
                  style={viewMode === 'kanban' ? { background: ownerGradient } : undefined}
                  aria-label="Vue Kanban"
                  aria-pressed={viewMode === 'kanban'}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "rounded-md px-3",
                    viewMode === 'list' ? 'text-white' : ''
                  )}
                  style={viewMode === 'list' ? { background: ownerGradient } : undefined}
                  aria-label="Vue liste"
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Refresh button */}
              <Button
                variant="outline"
                onClick={() => {
                  const now = Date.now();
                  if (isLoading || now - lastRefreshRef.current < REFRESH_DEBOUNCE_MS) return;
                  lastRefreshRef.current = now;
                  setIsLoading(true);
                  fetchMaintenanceData();
                }}
                className="rounded-full border-gray-300 hover:border-purple-400"
                aria-label="Actualiser les données"
                disabled={isLoading}
              >
                <RefreshCw className={cn('w-5 h-5', isLoading && 'animate-spin')} />
              </Button>

              {/* New ticket button */}
              <Button
                onClick={() => setShowCreateModal(true)}
                className="rounded-full text-white border-0 shadow-md hover:shadow-lg transition-all"
                style={{
                  background: ownerGradient,
                  boxShadow: '0 4px 12px rgba(156, 86, 152, 0.3)'
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle Demande
              </Button>
            </div>
          }
        />

        {/* KPIs */}
        <OwnerKPIGrid columns={4} className="mt-6 mb-6">
          <OwnerKPICard
            icon={Clock}
            title="Ouvertes"
            value={stats.open}
            variant="warning"
          />
          <OwnerKPICard
            icon={Settings}
            title="En cours"
            value={stats.in_progress}
            variant="info"
          />
          <OwnerKPICard
            icon={CheckCircle}
            title="Résolues"
            value={stats.resolved}
            variant="success"
          />
          <OwnerKPICard
            icon={TrendingUp}
            title={stats.avgResolutionHours > 0 ? `${stats.avgResolutionHours}h moy.` : "Performance"}
            value={stats.totalCost > 0 ? `${stats.totalCost.toFixed(0)}€` : '-'}
            variant="primary"
          />
        </OwnerKPIGrid>

        {/* Alert Banner for Urgent Requests */}
        <OwnerAlertBanner
          severity="critical"
          title={`${urgentCount} demande${urgentCount > 1 ? 's' : ''} urgente${urgentCount > 1 ? 's' : ''} en attente`}
          description="Ces demandes nécessitent une intervention rapide"
          icon={AlertTriangle}
          action={{
            label: "Voir les urgences",
            onClick: () => setFilterStatus('open')
          }}
          show={urgentCount > 0}
          className="mb-6"
        />

        {/* Main Content - Kanban or List View */}
        <AnimatePresence mode="wait">
          {viewMode === 'kanban' ? (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TicketKanbanBoard
                tickets={kanbanTickets}
                onStatusChange={handleStatusChange}
                onTicketClick={(ticket) => {
                  toast.info(`Ticket: ${ticket.title} - ${ticket.propertyName || 'Propriété'} (${ticket.status})`);
                }}
                className="mb-8"
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Filters */}
              <div className="mb-6 flex flex-wrap gap-2">
                {[
                  { value: 'all' as const, label: 'Toutes', count: stats.total },
                  { value: 'open' as const, label: 'Ouvertes', count: stats.open },
                  { value: 'in_progress' as const, label: 'En cours', count: stats.in_progress },
                  { value: 'resolved' as const, label: 'Résolues', count: stats.resolved }
                ].map((filter) => (
                  <Button
                    key={filter.value}
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
                ))}
              </div>

              {/* Requests List */}
              {filteredRequests.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-200"
                >
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div
                      className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ background: ownerGradient }}
                    >
                      <Wrench className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {filterStatus === 'all'
                      ? 'Aucune demande de maintenance'
                      : 'Aucune demande avec ce statut'}
                  </h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto">
                    {filterStatus === 'all'
                      ? 'Vos propriétés sont en parfait état !'
                      : 'Essayez un autre filtre'}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
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
                        onClick={() => {
                          toast.info(`${request.title} - ${request.property_name} (${statusConfig.label})`);
                        }}
                      >
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
                                </div>

                                {request.description && (
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                    {request.description}
                                  </p>
                                )}

                                <div className="space-y-1.5 text-sm">
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <Home className="w-4 h-4 text-gray-500" />
                                    <span>{request.property_name}</span>
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

                                  <div className="flex items-center gap-4 text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>{formatDate(request.created_at)}</span>
                                    </div>
                                    {request.actual_cost && (
                                      <div className="flex items-center gap-1">
                                        <Euro className="w-4 h-4" />
                                        <span>{request.actual_cost}€</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Area */}
                          <div className="flex lg:flex-col gap-2 lg:w-48">
                            <Button
                              variant="outline"
                              className="flex-1 rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.info(`${request.title} - ${request.description || 'Aucune description'}`);
                              }}
                            >
                              Voir Détails
                            </Button>

                            {request.status === 'open' && (
                              <Button
                                className="flex-1 rounded-xl text-white border-0 shadow-md transition-all"
                                style={{
                                  background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
                                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                }}
                                disabled={isBeingUpdated}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(request.id, 'in_progress');
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
                            )}

                            {request.status === 'in_progress' && (
                              <Button
                                className="flex-1 rounded-xl text-white border-0 shadow-md transition-all"
                                style={{
                                  background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                                }}
                                disabled={isBeingUpdated}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(request.id, 'resolved');
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
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cost Tracker and Vendor Directory - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <CostTracker
            currentMonthTotal={currentMonthTotal}
            previousMonthTotal={previousMonthTotal}
            budgetLimit={5000}
            costsByCategory={costsByCategory}
          />
          <VendorDirectory
            vendors={vendorDirectoryData}
            onContactVendor={(vendor, method) => {
              if (method === 'phone') {
                window.location.href = `tel:${vendor.phone.replace(/\s/g, '')}`;
              } else if (vendor.email) {
                window.location.href = `mailto:${vendor.email}`;
              }
            }}
            onAddVendor={() => setShowAddVendorModal(true)}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </main>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTicket}
        properties={properties}
        isSubmitting={isCreating}
      />

      {/* Add Vendor Modal */}
      <AddVendorModal
        open={showAddVendorModal}
        onClose={() => setShowAddVendorModal(false)}
        onVendorAdded={() => {
          if (currentUserId) {
            vendorService.getVendors(currentUserId).then(setVendors);
          }
        }}
      />

      {/* Vendor Rating Modal */}
      {ratingVendor && (
        <VendorRatingModal
          open={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setRatingVendor(null);
          }}
          vendorId={ratingVendor.id}
          vendorName={ratingVendor.name}
          maintenanceRequestId={ratingVendor.maintenanceId}
          propertyId={ratingVendor.propertyId}
          jobType={ratingVendor.jobType}
          onRatingSubmitted={() => {
            if (currentUserId) {
              vendorService.getVendors(currentUserId).then(setVendors);
            }
          }}
        />
      )}
    </div>
  );
}
