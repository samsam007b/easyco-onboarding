'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  DollarSign,
  Calendar,
  ArrowRight,
  Plus,
  Eye,
  MapPin,
  Bed,
  Bath,
  Sparkles,
  Wrench,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  FileText,
  MessageCircle,
  Bell,
  BarChart3,
  Wallet,
  Home,
  RefreshCw,
  MoreHorizontal,
  Settings,
  Download,
  PieChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Property } from '@/types/property.types';
import SubscriptionBanner from '@/components/subscriptions/SubscriptionBanner';
import UpgradeNotification from '@/components/subscriptions/UpgradeNotification';
import { useLanguage } from '@/lib/i18n/use-language';
import { rentService } from '@/lib/services/rent-service';
import { maintenanceService } from '@/lib/services/maintenance-service';
import { AddPropertyModal } from './AddPropertyModal';

// V3 Owner Gradient Colors
const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)';
const ownerGradientLight = 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)';

// Semantic colors for urgency
const urgentGradient = 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)';
const warningGradient = 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)';
const successGradient = 'linear-gradient(135deg, #059669 0%, #10B981 100%)';

interface UrgentAction {
  id: string;
  type: 'overdue_rent' | 'urgent_maintenance' | 'expiring_lease' | 'pending_application';
  title: string;
  description: string;
  propertyName: string;
  propertyId: string;
  severity: 'critical' | 'warning' | 'info';
  actionLabel: string;
  actionPath: string;
  createdAt?: string;
  amount?: number;
}

interface PropertyStatus {
  id: string;
  title: string;
  city: string;
  status: string;
  mainImage?: string;
  monthlyRent: number;
  occupancyStatus: 'occupied' | 'vacant' | 'pending';
  hasOverdueRent: boolean;
  overdueAmount?: number;
  openMaintenanceCount: number;
  urgentMaintenanceCount: number;
  leaseExpiringDays?: number;
  viewsCount: number;
  bedrooms: number;
  bathrooms: number;
}

interface UpcomingDeadline {
  id: string;
  type: 'rent_due' | 'lease_expiry' | 'maintenance_scheduled' | 'insurance_renewal';
  title: string;
  date: Date;
  propertyName: string;
  propertyId: string;
  amount?: number;
}

interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalExpected: number;
  totalCollected: number;
  overdueAmount: number;
  overdueCount: number;
  totalProperties: number;
  occupiedProperties: number;
  vacantProperties: number;
  occupationRate: number;
  pendingApplications: number;
  openMaintenanceCount: number;
  urgentMaintenanceCount: number;
  totalViews: number;
}

export default function OwnerCommandCenter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const owner = getSection('dashboard')?.owner;

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyStatuses, setPropertyStatuses] = useState<PropertyStatus[]>([]);
  const [urgentActions, setUrgentActions] = useState<UrgentAction[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([]);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalExpected: 0,
    totalCollected: 0,
    overdueAmount: 0,
    overdueCount: 0,
    totalProperties: 0,
    occupiedProperties: 0,
    vacantProperties: 0,
    occupationRate: 0,
    pendingApplications: 0,
    openMaintenanceCount: 0,
    urgentMaintenanceCount: 0,
    totalViews: 0,
  });

  // Load all dashboard data
  const loadDashboardData = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      // Load properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (!propertiesData) {
        setIsLoading(false);
        return;
      }

      setProperties(propertiesData);

      // Calculate base stats
      const published = propertiesData.filter(p => p.status === 'published').length;
      const rented = propertiesData.filter(p => p.status === 'rented').length;
      const occupationRate = propertiesData.length > 0 ? Math.round((rented / propertiesData.length) * 100) : 0;
      const totalViews = propertiesData.reduce((sum, p) => sum + (p.views_count || 0), 0);
      const totalExpected = propertiesData.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);

      // Get applications count
      const propertyIds = propertiesData.map(p => p.id);
      let pendingApplications = 0;
      if (propertyIds.length > 0) {
        const { count } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .in('property_id', propertyIds)
          .eq('status', 'pending');
        pendingApplications = count || 0;
      }

      // Batch fetch all data to avoid N+1 queries
      const urgentActionsTemp: UrgentAction[] = [];
      const deadlinesTemp: UpcomingDeadline[] = [];
      const propertyStatusesTemp: PropertyStatus[] = [];
      let totalOverdueAmount = 0;
      let totalOverdueCount = 0;
      let totalOpenMaintenance = 0;
      let totalUrgentMaintenance = 0;

      // BATCH: Get maintenance stats for ALL properties in one query
      const maintenanceStatsMap = await maintenanceService.getStatsForProperties(propertyIds);

      // BATCH: Get rent payments for ALL properties in one query
      const { data: allRentPayments } = await supabase
        .from('rent_payments')
        .select('*')
        .in('property_id', propertyIds)
        .order('month', { ascending: false });

      // Group rent payments by property_id
      const rentPaymentsByProperty = new Map<string, typeof allRentPayments>();
      allRentPayments?.forEach(payment => {
        const existing = rentPaymentsByProperty.get(payment.property_id) || [];
        existing.push(payment);
        rentPaymentsByProperty.set(payment.property_id, existing);
      });

      // Process each property using cached batch data
      for (const property of propertiesData) {
        // Get maintenance stats from batch result
        const maintenanceStats = maintenanceStatsMap.get(property.id) || {
          open_count: 0,
          in_progress_count: 0,
          by_priority: {} as Record<string, number>,
        };
        const openCount = maintenanceStats.open_count + maintenanceStats.in_progress_count;
        const urgentCount = maintenanceStats.by_priority?.high || 0;

        totalOpenMaintenance += openCount;
        totalUrgentMaintenance += urgentCount;

        // Get rent payments from batch result (limit to 3 most recent)
        const rentPayments = (rentPaymentsByProperty.get(property.id) || []).slice(0, 3);
        const overduePayments = rentPayments.filter(p => p.status === 'overdue');
        const hasOverdueRent = overduePayments.length > 0;
        const overdueAmount = overduePayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

        if (hasOverdueRent) {
          totalOverdueAmount += overdueAmount;
          totalOverdueCount += overduePayments.length;

          // Add urgent action
          urgentActionsTemp.push({
            id: `overdue-${property.id}`,
            type: 'overdue_rent',
            title: 'Loyer impayé',
            description: `€${overdueAmount.toLocaleString()} en retard`,
            propertyName: property.title,
            propertyId: property.id,
            severity: 'critical',
            actionLabel: 'Voir détails',
            actionPath: `/dashboard/owner/finance?property=${property.id}`,
            amount: overdueAmount,
          });
        }

        // Add urgent maintenance actions
        if (urgentCount > 0) {
          urgentActionsTemp.push({
            id: `maintenance-${property.id}`,
            type: 'urgent_maintenance',
            title: 'Maintenance urgente',
            description: `${urgentCount} ticket${urgentCount > 1 ? 's' : ''} prioritaire${urgentCount > 1 ? 's' : ''}`,
            propertyName: property.title,
            propertyId: property.id,
            severity: 'warning',
            actionLabel: 'Traiter',
            actionPath: `/dashboard/owner/maintenance?property=${property.id}`,
          });
        }

        // Calculate lease expiry (mock - would come from leases table)
        // TODO: Connect to real leases table
        const leaseExpiringDays = property.status === 'rented' ? Math.floor(Math.random() * 120) : undefined;

        if (leaseExpiringDays !== undefined && leaseExpiringDays <= 30) {
          urgentActionsTemp.push({
            id: `lease-${property.id}`,
            type: 'expiring_lease',
            title: 'Bail expirant',
            description: `Expire dans ${leaseExpiringDays} jour${leaseExpiringDays > 1 ? 's' : ''}`,
            propertyName: property.title,
            propertyId: property.id,
            severity: leaseExpiringDays <= 14 ? 'critical' : 'warning',
            actionLabel: 'Renouveler',
            actionPath: `/dashboard/owner/leases?property=${property.id}`,
          });

          deadlinesTemp.push({
            id: `lease-deadline-${property.id}`,
            type: 'lease_expiry',
            title: 'Expiration du bail',
            date: new Date(Date.now() + leaseExpiringDays * 24 * 60 * 60 * 1000),
            propertyName: property.title,
            propertyId: property.id,
          });
        }

        // Get next rent due (mock - would come from rent_payments)
        const nextRentDue = new Date();
        nextRentDue.setMonth(nextRentDue.getMonth() + 1);
        nextRentDue.setDate(5);

        if (property.status === 'rented') {
          deadlinesTemp.push({
            id: `rent-deadline-${property.id}`,
            type: 'rent_due',
            title: 'Loyer dû',
            date: nextRentDue,
            propertyName: property.title,
            propertyId: property.id,
            amount: property.monthly_rent,
          });
        }

        // Build property status
        propertyStatusesTemp.push({
          id: property.id,
          title: property.title,
          city: property.city || '',
          status: property.status,
          mainImage: property.main_image,
          monthlyRent: property.monthly_rent || 0,
          occupancyStatus: property.status === 'rented' ? 'occupied' :
                          property.status === 'published' ? 'vacant' : 'pending',
          hasOverdueRent,
          overdueAmount: hasOverdueRent ? overdueAmount : undefined,
          openMaintenanceCount: openCount,
          urgentMaintenanceCount: urgentCount,
          leaseExpiringDays,
          viewsCount: property.views_count || 0,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
        });
      }

      // Add pending applications as actions
      if (pendingApplications > 0) {
        urgentActionsTemp.push({
          id: 'applications-pending',
          type: 'pending_application',
          title: 'Candidatures en attente',
          description: `${pendingApplications} candidature${pendingApplications > 1 ? 's' : ''} à examiner`,
          propertyName: 'Toutes propriétés',
          propertyId: '',
          severity: 'info',
          actionLabel: 'Examiner',
          actionPath: '/dashboard/owner/applications',
        });
      }

      // Sort urgent actions by severity
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      urgentActionsTemp.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

      // Sort deadlines by date
      deadlinesTemp.sort((a, b) => a.date.getTime() - b.date.getTime());

      // Update all state
      setUrgentActions(urgentActionsTemp);
      setUpcomingDeadlines(deadlinesTemp.slice(0, 5));
      setPropertyStatuses(propertyStatusesTemp);
      setStats({
        totalRevenue: totalExpected - totalOverdueAmount,
        revenueChange: 8, // Would calculate from historical data
        totalExpected,
        totalCollected: totalExpected - totalOverdueAmount,
        overdueAmount: totalOverdueAmount,
        overdueCount: totalOverdueCount,
        totalProperties: propertiesData.length,
        occupiedProperties: rented,
        vacantProperties: published,
        occupationRate,
        pendingApplications,
        openMaintenanceCount: totalOpenMaintenance,
        urgentMaintenanceCount: totalUrgentMaintenance,
        totalViews,
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Check URL for addProperty parameter
  useEffect(() => {
    if (searchParams.get('addProperty') === 'true') {
      setShowAddPropertyModal(true);
      // Remove the query param from URL without navigation
      router.replace('/dashboard/owner', { scroll: false });
    }
  }, [searchParams, router]);

  // Generate revenue chart data (would be from real data)
  const generateRevenueData = () => {
    const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun'] as const;
    const monthNames: Record<typeof monthKeys[number], string> = {
      jan: 'Jan', feb: 'Fév', mar: 'Mar', apr: 'Avr', may: 'Mai', jun: 'Juin'
    };

    return monthKeys.map((key) => ({
      month: monthNames[key],
      collected: Math.floor(stats.totalExpected * (0.85 + Math.random() * 0.15)),
      expected: stats.totalExpected,
    }));
  };

  const revenueData = generateRevenueData();

  // Severity styling helpers
  const getSeverityStyles = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          iconBg: urgentGradient,
          badge: 'bg-red-100 text-red-700',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: 'text-amber-600',
          iconBg: warningGradient,
          badge: 'bg-amber-100 text-amber-700',
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          iconBg: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
          badge: 'bg-blue-100 text-blue-700',
        };
    }
  };

  const getActionIcon = (type: UrgentAction['type']) => {
    switch (type) {
      case 'overdue_rent': return DollarSign;
      case 'urgent_maintenance': return Wrench;
      case 'expiring_lease': return FileText;
      case 'pending_application': return Users;
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #F8F0F7 0%, #FFFFFF 50%, #FDF5F9 100%)' }}
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {owner?.loadingDashboard || 'Loading Command Center...'}
          </h3>
          <p className="text-gray-600">{owner?.preparingData || 'Analyzing your properties'}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #F8F0F7 0%, #FFFFFF 50%, #FDF5F9 100%)' }}
    >
      <UpgradeNotification />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="relative w-16 h-16"
              >
                <motion.div
                  className="absolute inset-0 superellipse-2xl opacity-30"
                  style={{ background: ownerGradient, filter: 'blur(12px)' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                />
                <div
                  className="relative w-16 h-16 superellipse-2xl flex items-center justify-center shadow-lg"
                  style={{ background: ownerGradient, boxShadow: '0 8px 24px rgba(156, 86, 152, 0.3)' }}
                >
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: '#c2566b' }} />
                </motion.div>
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Command Center
                </h1>
                <p className="text-gray-600 text-lg">
                  Pilotez votre portefeuille immobilier
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadDashboardData(true)}
                disabled={isRefreshing}
                className="rounded-full"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
                Actualiser
              </Button>

              {/* Quick Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    <MoreHorizontal className="w-4 h-4 mr-2" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" style={{ color: '#9c5698' }} />
                    Navigation rapide
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/owner/tenants')}
                      className="cursor-pointer"
                    >
                      <Users className="w-4 h-4 mr-2" style={{ color: '#9c5698' }} />
                      Locataires
                      <span className="ml-auto text-xs text-gray-400">→</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/owner/leases')}
                      className="cursor-pointer"
                    >
                      <FileText className="w-4 h-4 mr-2" style={{ color: '#a5568d' }} />
                      Baux
                      <span className="ml-auto text-xs text-gray-400">→</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/owner/finance')}
                      className="cursor-pointer"
                    >
                      <Wallet className="w-4 h-4 mr-2" style={{ color: '#af5682' }} />
                      Finances
                      <span className="ml-auto text-xs text-gray-400">→</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/owner/maintenance')}
                      className="cursor-pointer"
                    >
                      <Wrench className="w-4 h-4 mr-2" style={{ color: '#b85676' }} />
                      Maintenance
                      <span className="ml-auto text-xs text-gray-400">→</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Settings className="w-4 h-4" style={{ color: '#c2566b' }} />
                    Outils
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setShowAddPropertyModal(true)}
                      className="cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-2" style={{ color: '#059669' }} />
                      Ajouter une propriété
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {/* Export functionality */}}
                      className="cursor-pointer"
                    >
                      <Download className="w-4 h-4 mr-2" style={{ color: '#6366f1' }} />
                      Exporter rapport
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/owner/finances')}
                      className="cursor-pointer"
                    >
                      <PieChart className="w-4 h-4 mr-2" style={{ color: '#8b5cf6' }} />
                      Analytics & Finances
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowAddPropertyModal(true)}
                  className="rounded-full text-white shadow-lg"
                  style={{ background: ownerGradient, boxShadow: '0 4px 14px rgba(156, 86, 152, 0.3)' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle propriété
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {userId && <SubscriptionBanner userId={userId} />}

        {/* URGENT ACTIONS SECTION */}
        <AnimatePresence>
          {urgentActions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 superellipse-lg flex items-center justify-center"
                  style={{ background: urgentGradient }}
                >
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Actions urgentes</h2>
                <Badge variant="error" className="ml-2">
                  {urgentActions.filter(a => a.severity === 'critical').length} critique{urgentActions.filter(a => a.severity === 'critical').length > 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {urgentActions.slice(0, 6).map((action, index) => {
                  const styles = getSeverityStyles(action.severity);
                  const Icon = getActionIcon(action.type);

                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => router.push(action.actionPath)}
                      className={cn(
                        "relative overflow-hidden superellipse-2xl p-4 cursor-pointer border-2 transition-all",
                        styles.bg,
                        styles.border
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 superellipse-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: styles.iconBg }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{action.title}</h3>
                            {action.severity === 'critical' && (
                              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{action.description}</p>
                          <p className="text-xs text-gray-500 truncate">{action.propertyName}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue KPI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            onClick={() => router.push('/dashboard/owner/finance')}
            className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.12)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20" style={{ background: successGradient }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-emerald-700">Revenus du mois</span>
                <div className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md" style={{ background: successGradient }}>
                  <Wallet className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                €{stats.totalCollected.toLocaleString()}
              </p>
              {stats.overdueAmount > 0 ? (
                <div className="flex items-center gap-1 text-sm font-medium text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>€{stats.overdueAmount.toLocaleString()} impayé</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tout encaissé</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Properties KPI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.03, y: -4 }}
            onClick={() => router.push('/dashboard/owner/properties')}
            className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer shadow-lg"
            style={{ background: ownerGradientLight, boxShadow: '0 8px 24px rgba(156, 86, 152, 0.12)' }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20" style={{ background: ownerGradient }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium" style={{ color: '#9c5698' }}>Propriétés</span>
                <div className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md" style={{ background: ownerGradient }}>
                  <Building2 className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stats.totalProperties}</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-emerald-600 font-medium">{stats.occupiedProperties} louées</span>
                <span className="text-gray-400">•</span>
                <span className="text-amber-600 font-medium">{stats.vacantProperties} vacantes</span>
              </div>
            </div>
          </motion.div>

          {/* Occupation KPI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-5 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #FDF5F9 0%, #FAE8F0 100%)',
              boxShadow: '0 8px 24px rgba(175, 86, 130, 0.12)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20" style={{ background: 'linear-gradient(135deg, #af5682 0%, #c2566b 100%)' }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium" style={{ color: '#af5682' }}>Taux d'occupation</span>
                <div className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #af5682 0%, #c2566b 100%)' }}>
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stats.occupationRate}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${stats.occupationRate}%`,
                    background: ownerGradient,
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Maintenance KPI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.03, y: -4 }}
            onClick={() => router.push('/dashboard/owner/maintenance')}
            className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer shadow-lg"
            style={{
              background: stats.urgentMaintenanceCount > 0
                ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
                : 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
              boxShadow: stats.urgentMaintenanceCount > 0
                ? '0 8px 24px rgba(217, 119, 6, 0.12)'
                : '0 8px 24px rgba(16, 185, 129, 0.12)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20" style={{ background: stats.urgentMaintenanceCount > 0 ? warningGradient : successGradient }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className={cn("text-sm font-medium", stats.urgentMaintenanceCount > 0 ? "text-amber-700" : "text-emerald-700")}>
                  Maintenance
                </span>
                <div
                  className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md"
                  style={{ background: stats.urgentMaintenanceCount > 0 ? warningGradient : successGradient }}
                >
                  <Wrench className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stats.openMaintenanceCount}</p>
              {stats.urgentMaintenanceCount > 0 ? (
                <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{stats.urgentMaintenanceCount} urgent{stats.urgentMaintenanceCount > 1 ? 's' : ''}</span>
                </div>
              ) : stats.openMaintenanceCount > 0 ? (
                <p className="text-sm font-medium text-gray-600">tickets ouverts</p>
              ) : (
                <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tout résolu</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Property Status Cards (2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 relative overflow-hidden bg-white superellipse-3xl shadow-lg p-6"
            style={{ boxShadow: '0 8px 32px rgba(156, 86, 152, 0.1)' }}
          >
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-5" style={{ background: ownerGradient }} />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md" style={{ background: ownerGradient }}>
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Statut des propriétés</h3>
                  <p className="text-sm text-gray-500">{stats.totalProperties} propriétés</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/owner/properties')}
                className="rounded-full"
              >
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {propertyStatuses.length === 0 ? (
              <div className="text-center py-12 superellipse-2xl" style={{ background: ownerGradientLight }} >
                <div className="w-16 h-16 mx-auto mb-4 superellipse-2xl flex items-center justify-center" style={{ background: ownerGradient }}>
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Aucune propriété</h4>
                <p className="text-gray-600 mb-4">Ajoutez votre première propriété pour commencer</p>
                <Button
                  onClick={() => setShowAddPropertyModal(true)}
                  className="rounded-full text-white"
                  style={{ background: ownerGradient }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une propriété
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {propertyStatuses.slice(0, 4).map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => router.push(`/properties/${property.id}`)}
                    className={cn(
                      "relative superellipse-2xl p-4 cursor-pointer border-2 transition-all",
                      property.hasOverdueRent || property.urgentMaintenanceCount > 0
                        ? "border-red-200 bg-red-50/50"
                        : property.leaseExpiringDays && property.leaseExpiringDays <= 30
                        ? "border-amber-200 bg-amber-50/50"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    )}
                  >
                    {/* Status indicators */}
                    <div className="absolute top-3 right-3 flex gap-1">
                      {property.hasOverdueRent && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: urgentGradient }}>
                          <DollarSign className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {property.urgentMaintenanceCount > 0 && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: warningGradient }}>
                          <Wrench className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {property.leaseExpiringDays && property.leaseExpiringDays <= 30 && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: warningGradient }}>
                          <Clock className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Property image */}
                    <div className="w-full h-24 superellipse-xl mb-3 overflow-hidden" style={{ background: ownerGradientLight }}>
                      {property.mainImage ? (
                        <img src={property.mainImage} alt={property.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-8 h-8" style={{ color: '#af5682' }} />
                        </div>
                      )}
                    </div>

                    {/* Property info */}
                    <h4 className="font-bold text-gray-900 mb-1 truncate pr-16">{property.title}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{property.city}</span>
                    </div>

                    {/* Quick stats */}
                    <div className="flex items-center justify-between text-sm">
                      <Badge
                        variant={property.occupancyStatus === 'occupied' ? 'success' : property.occupancyStatus === 'vacant' ? 'warning' : 'secondary'}
                      >
                        {property.occupancyStatus === 'occupied' ? 'Louée' : property.occupancyStatus === 'vacant' ? 'Vacante' : 'En attente'}
                      </Badge>
                      <span className="font-semibold" style={{ color: '#9c5698' }}>
                        €{property.monthlyRent.toLocaleString()}/mois
                      </span>
                    </div>

                    {/* Alert messages */}
                    {(property.hasOverdueRent || property.urgentMaintenanceCount > 0 || (property.leaseExpiringDays && property.leaseExpiringDays <= 30)) && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                        {property.hasOverdueRent && (
                          <p className="text-xs text-red-600 font-medium">
                            €{property.overdueAmount?.toLocaleString()} impayé
                          </p>
                        )}
                        {property.urgentMaintenanceCount > 0 && (
                          <p className="text-xs text-amber-600 font-medium">
                            {property.urgentMaintenanceCount} maintenance urgente
                          </p>
                        )}
                        {property.leaseExpiringDays && property.leaseExpiringDays <= 30 && (
                          <p className="text-xs text-amber-600 font-medium">
                            Bail expire dans {property.leaseExpiringDays}j
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Upcoming Deadlines (1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden bg-white superellipse-3xl shadow-lg p-6"
            style={{ boxShadow: '0 8px 32px rgba(156, 86, 152, 0.1)' }}
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-5" style={{ background: ownerGradient }} />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md" style={{ background: ownerGradient }}>
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Échéances</h3>
                <p className="text-sm text-gray-500">30 prochains jours</p>
              </div>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-gray-600">Aucune échéance à venir</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => {
                  const daysUntil = Math.ceil((deadline.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysUntil <= 7;

                  return (
                    <motion.div
                      key={deadline.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + index * 0.05 }}
                      className={cn(
                        "p-3 superellipse-xl border transition-all hover:shadow-md cursor-pointer",
                        isUrgent ? "border-amber-200 bg-amber-50" : "border-gray-100 bg-gray-50"
                      )}
                      onClick={() => router.push(`/properties/${deadline.propertyId}`)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{deadline.title}</p>
                          <p className="text-xs text-gray-500 truncate">{deadline.propertyName}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={cn(
                            "text-sm font-semibold",
                            isUrgent ? "text-amber-600" : "text-gray-600"
                          )}>
                            {daysUntil === 0 ? "Aujourd'hui" : daysUntil === 1 ? "Demain" : `${daysUntil}j`}
                          </p>
                          {deadline.amount && (
                            <p className="text-xs text-gray-500">€{deadline.amount.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* REVENUE CHART */}
        {properties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative overflow-hidden bg-white superellipse-3xl shadow-lg p-6"
            style={{ boxShadow: '0 8px 32px rgba(156, 86, 152, 0.1)' }}
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10" style={{ background: ownerGradient }} />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md" style={{ background: successGradient }}>
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Évolution des revenus</h3>
                  <p className="text-sm text-gray-500">6 derniers mois</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/owner/finance')}
                className="rounded-full"
              >
                Détails
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#999" style={{ fontSize: '12px' }} />
                <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  formatter={(value) => [`€${value ?? 0}`, '']}
                />
                <Line
                  type="monotone"
                  dataKey="collected"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Encaissé"
                />
                <Line
                  type="monotone"
                  dataKey="expected"
                  stroke="#9c5698"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#9c5698', r: 3 }}
                  name="Attendu"
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-gray-600">Encaissé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#9c5698' }} />
                <span className="text-sm text-gray-600">Attendu</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Messages', icon: MessageCircle, path: '/dashboard/owner/messages', count: 0 },
            { label: 'Candidatures', icon: Users, path: '/dashboard/owner/applications', count: stats.pendingApplications },
            { label: 'Finance', icon: DollarSign, path: '/dashboard/owner/finance', count: stats.overdueCount },
            { label: 'Maintenance', icon: Wrench, path: '/dashboard/owner/maintenance', count: stats.openMaintenanceCount },
          ].map((action, index) => (
            <motion.div
              key={action.label}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(action.path)}
              className="relative overflow-hidden superellipse-2xl p-4 bg-white shadow-lg cursor-pointer border border-gray-100 hover:border-gray-200 transition-all"
              style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 superellipse-xl flex items-center justify-center"
                  style={{ background: ownerGradientLight }}
                >
                  <action.icon className="w-5 h-5" style={{ color: '#9c5698' }} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{action.label}</p>
                  {action.count > 0 && (
                    <p className="text-xs text-amber-600 font-medium">{action.count} en attente</p>
                  )}
                </div>
              </div>
              {action.count > 0 && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: action.count > 0 && action.label === 'Finance' ? urgentGradient : warningGradient }}
                >
                  {action.count}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Add Property Modal */}
      <AddPropertyModal
        open={showAddPropertyModal}
        onOpenChange={setShowAddPropertyModal}
        onSuccess={() => loadDashboardData(true)}
      />
    </div>
  );
}
