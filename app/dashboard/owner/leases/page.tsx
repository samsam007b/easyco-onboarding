'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Home,
  User,
  Euro,
  RefreshCw,
  Download,
  ChevronRight,
  CalendarClock,
  CalendarCheck,
  CalendarX,
  FileSignature,
  Repeat,
  TrendingUp,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays, differenceInMonths, addMonths, isPast, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';

// V3 Owner gradient constants
const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)';
const ownerGradientLight = 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)';

type LeaseStatus = 'active' | 'ending_soon' | 'expired' | 'future';

interface Lease {
  id: string;
  resident_id: string;
  property_id: string;
  property_name: string;
  property_address: string;
  tenant_name: string;
  tenant_photo: string | null;
  start_date: Date;
  end_date: Date;
  duration_months: number;
  monthly_rent: number;
  status: LeaseStatus;
  days_remaining: number;
  progress_percent: number;
}

interface LeaseStats {
  total: number;
  active: number;
  endingSoon: number;
  expired: number;
  totalMonthlyRent: number;
}

export default function LeasesPage() {
  const router = useRouter();
  const { setActiveRole } = useRole();

  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | LeaseStatus>('all');
  const [leases, setLeases] = useState<Lease[]>([]);
  const [stats, setStats] = useState<LeaseStats>({
    total: 0,
    active: 0,
    endingSoon: 0,
    expired: 0,
    totalMonthlyRent: 0,
  });

  // Fetch lease data
  const fetchLeasesData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      setActiveRole('owner');

      // 1. Get user's properties with rent info
      const { data: userProperties, error: propError } = await supabase
        .from('properties')
        .select('id, name, address, city, monthly_rent')
        .eq('owner_id', user.id);

      if (propError) {
        console.error('[Leases] Failed to fetch properties:', propError);
        setIsLoading(false);
        return;
      }

      if (!userProperties || userProperties.length === 0) {
        setLeases([]);
        setIsLoading(false);
        return;
      }

      const propertyIds = userProperties.map(p => p.id);
      const propertyMap = new Map(userProperties.map(p => [p.id, p]));

      // 2. Fetch residents with lease info
      const { data: residents, error: resError } = await supabase
        .from('property_residents')
        .select('id, property_id, first_name, last_name, photo_url, move_in_date, lease_duration_months')
        .in('property_id', propertyIds)
        .not('move_in_date', 'is', null)
        .not('lease_duration_months', 'is', null);

      if (resError) {
        console.error('[Leases] Failed to fetch residents:', resError);
      }

      const now = new Date();
      const threeMonthsFromNow = addMonths(now, 3);

      // Transform residents to leases
      const leasesData: Lease[] = (residents || []).map(r => {
        const property = propertyMap.get(r.property_id);
        const startDate = new Date(r.move_in_date);
        const endDate = addMonths(startDate, r.lease_duration_months);
        const daysRemaining = differenceInDays(endDate, now);
        const totalDays = differenceInDays(endDate, startDate);
        const elapsedDays = differenceInDays(now, startDate);
        const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

        let status: LeaseStatus = 'active';
        if (isPast(endDate)) {
          status = 'expired';
        } else if (isFuture(startDate)) {
          status = 'future';
        } else if (endDate <= threeMonthsFromNow) {
          status = 'ending_soon';
        }

        return {
          id: r.id,
          resident_id: r.id,
          property_id: r.property_id,
          property_name: property?.name || 'Propriété',
          property_address: property ? `${property.address}, ${property.city}` : '',
          tenant_name: `${r.first_name} ${r.last_name}`,
          tenant_photo: r.photo_url,
          start_date: startDate,
          end_date: endDate,
          duration_months: r.lease_duration_months,
          monthly_rent: property?.monthly_rent || 0,
          status,
          days_remaining: Math.max(0, daysRemaining),
          progress_percent: progress,
        };
      });

      // Sort: ending_soon first, then by end_date
      leasesData.sort((a, b) => {
        const statusOrder = { ending_soon: 0, active: 1, future: 2, expired: 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return a.end_date.getTime() - b.end_date.getTime();
      });

      setLeases(leasesData);

      // Calculate stats
      const active = leasesData.filter(l => l.status === 'active').length;
      const endingSoon = leasesData.filter(l => l.status === 'ending_soon').length;
      const expired = leasesData.filter(l => l.status === 'expired').length;
      const totalMonthlyRent = leasesData
        .filter(l => l.status === 'active' || l.status === 'ending_soon')
        .reduce((sum, l) => sum + l.monthly_rent, 0);

      setStats({
        total: leasesData.length,
        active,
        endingSoon,
        expired,
        totalMonthlyRent,
      });

    } catch (error) {
      console.error('[Leases] Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router, setActiveRole]);

  useEffect(() => {
    fetchLeasesData();
  }, [fetchLeasesData]);

  // Filter leases
  const filteredLeases = leases.filter(lease => {
    if (filterStatus === 'all') return true;
    return lease.status === filterStatus;
  });

  // Get status config
  const getStatusConfig = (status: LeaseStatus) => {
    const config = {
      active: {
        className: 'bg-green-100 text-green-700 border-green-200',
        label: 'Actif',
        icon: CheckCircle,
        color: '#22c55e',
      },
      ending_soon: {
        className: 'bg-amber-100 text-amber-700 border-amber-200',
        label: 'Fin proche',
        icon: AlertTriangle,
        color: '#f59e0b',
      },
      expired: {
        className: 'bg-red-100 text-red-700 border-red-200',
        label: 'Expiré',
        icon: XCircle,
        color: '#ef4444',
      },
      future: {
        className: 'bg-blue-100 text-blue-700 border-blue-200',
        label: 'À venir',
        icon: CalendarClock,
        color: '#3b82f6',
      },
    };
    return config[status];
  };

  // Get initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
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
            Chargement des baux...
          </h3>
          <p className="text-gray-600">
            Analyse des contrats de location
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
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </motion.div>
                </div>
                Baux
              </h1>
              <p className="text-gray-600">
                {stats.total} contrat{stats.total !== 1 ? 's' : ''} de location
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLoading(true);
                    fetchLeasesData();
                  }}
                  className="rounded-full border-gray-300 hover:border-purple-400"
                >
                  <RefreshCw className="w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {/* TODO: Create new lease */}}
                  className="rounded-full text-white border-0 shadow-md hover:shadow-lg transition-all"
                  style={{
                    background: ownerGradient,
                    boxShadow: '0 4px 12px rgba(156, 86, 152, 0.3)'
                  }}
                >
                  <FileSignature className="w-5 h-5 mr-2" />
                  Nouveau Bail
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Stats */}
          <div className="relative grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Total */}
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
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Total</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#9c5698' }}>{stats.total}</p>
            </motion.div>

            {/* Active */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.15 }}
              className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200/50 shadow-sm"
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-green-400 opacity-15" />
              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Actifs</p>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.active}</p>
            </motion.div>

            {/* Ending Soon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200/50 shadow-sm"
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-amber-400 opacity-15" />
              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Fin proche</p>
              </div>
              <p className="text-2xl font-bold text-amber-700">{stats.endingSoon}</p>
              <p className="text-xs text-gray-500">dans 3 mois</p>
            </motion.div>

            {/* Expired */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.25 }}
              className="relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border border-red-200/50 shadow-sm"
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-red-400 opacity-15" />
              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-sm">
                  <XCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Expirés</p>
              </div>
              <p className="text-2xl font-bold text-red-700">{stats.expired}</p>
            </motion.div>

            {/* Monthly Revenue */}
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
                <p className="text-sm text-gray-600 font-medium">Loyers</p>
              </div>
              <p className="text-xl font-bold" style={{ color: '#9c5698' }}>
                {stats.totalMonthlyRent.toLocaleString('fr-FR')}€
              </p>
              <p className="text-xs text-gray-500">/mois</p>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all' as const, label: 'Tous', count: stats.total },
              { value: 'active' as const, label: 'Actifs', count: stats.active },
              { value: 'ending_soon' as const, label: 'Fin proche', count: stats.endingSoon },
              { value: 'expired' as const, label: 'Expirés', count: stats.expired }
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

        {/* Leases List */}
        <AnimatePresence mode="wait">
          {filteredLeases.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-200"
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: ownerGradient }} />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-10" style={{ background: ownerGradient }} />

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
                  <FileText className="w-10 h-10 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {filterStatus === 'all' ? 'Aucun bail' : 'Aucun bail trouvé'}
              </h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                {filterStatus === 'all'
                  ? 'Ajoutez des locataires avec des dates de bail pour voir les contrats ici'
                  : 'Essayez un autre filtre'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredLeases.map((lease, index) => {
                const statusConfig = getStatusConfig(lease.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={lease.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={{ delay: 0.05 + index * 0.02 }}
                    className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
                    style={{
                      borderLeftWidth: '4px',
                      borderLeftColor: statusConfig.color,
                    }}
                    onClick={() => {/* TODO: Open lease details */}}
                  >
                    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10" style={{ background: ownerGradient }} />

                    <div className="relative flex flex-col lg:flex-row gap-6">
                      {/* Tenant and Property Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          {/* Tenant Avatar */}
                          <div className="flex-shrink-0">
                            {lease.tenant_photo ? (
                              <img
                                src={lease.tenant_photo}
                                alt={lease.tenant_name}
                                className="w-14 h-14 rounded-xl object-cover shadow-sm"
                              />
                            ) : (
                              <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                                style={{ background: ownerGradient }}
                              >
                                {getInitials(lease.tenant_name)}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-lg font-bold text-gray-900">
                                {lease.tenant_name}
                              </h3>
                              <Badge className={cn(statusConfig.className, "border")}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Home className="w-4 h-4 text-gray-400" />
                              <span className="truncate">{lease.property_name}</span>
                            </div>
                          </div>

                          {/* Monthly Rent */}
                          <div className="text-right flex-shrink-0">
                            <div className="text-xl font-bold" style={{ color: '#9c5698' }}>
                              {lease.monthly_rent.toLocaleString('fr-FR')}€
                            </div>
                            <div className="text-xs text-gray-500">/mois</div>
                          </div>
                        </div>

                        {/* Lease Timeline */}
                        <div className="space-y-3">
                          {/* Date range */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <CalendarCheck className="w-4 h-4 text-green-500" />
                              <span>Début: {format(lease.start_date, 'd MMM yyyy', { locale: fr })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <CalendarX className="w-4 h-4 text-red-500" />
                              <span>Fin: {format(lease.end_date, 'd MMM yyyy', { locale: fr })}</span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="relative">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${lease.progress_percent}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{
                                  background: lease.status === 'expired'
                                    ? '#ef4444'
                                    : lease.status === 'ending_soon'
                                      ? '#f59e0b'
                                      : ownerGradient
                                }}
                              />
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                              <span>{lease.duration_months} mois</span>
                              {lease.status !== 'expired' && (
                                <span className={cn(
                                  lease.status === 'ending_soon' && "text-amber-600 font-medium"
                                )}>
                                  {lease.days_remaining} jours restants
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2 lg:w-40">
                        {lease.status === 'ending_soon' && (
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                            <Button
                              className="w-full rounded-xl text-white border-0 shadow-md transition-all"
                              style={{
                                background: ownerGradient,
                                boxShadow: '0 4px 12px rgba(156, 86, 152, 0.3)'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                /* TODO: Renew lease */
                              }}
                            >
                              <Repeat className="w-4 h-4 mr-2" />
                              Renouveler
                            </Button>
                          </motion.div>
                        )}
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              /* TODO: Download contract */
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Contrat
                          </Button>
                        </motion.div>
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
