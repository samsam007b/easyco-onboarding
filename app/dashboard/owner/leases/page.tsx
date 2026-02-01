'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  RefreshCw,
  Download,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  CalendarClock,
  CalendarCheck,
  CalendarX,
  FileSignature,
  Repeat,
  Home,
  Euro,
  Clock,
  Users,
  GanttChart,
  Workflow
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays, addMonths, isPast, isFuture } from 'date-fns';
import { fr, enUS, nl, de, type Locale } from 'date-fns/locale';
import { useLanguage } from '@/lib/i18n/use-language';

// Shared Owner Components
import {
  OwnerPageHeader,
  OwnerKPICard,
  OwnerKPIGrid,
  OwnerAlertBanner
} from '@/components/owner';

// Lease-specific Components
import { LeaseTimeline } from '@/components/owner/leases';
import { RenewalWorkflow } from '@/components/owner/leases';

// Theme constants
import { ownerGradient, ownerGradientLight } from '@/lib/constants/owner-theme';

// Services
import { downloadLeaseDocument, type LeaseDocumentData } from '@/lib/services/lease-document-service';
import { toast } from 'sonner';

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
  averageDuration: number;
}

export default function LeasesPage() {
  const router = useRouter();
  const { setActiveRole } = useRole();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.owner?.leasesPage;

  // Date-fns locale mapping
  const dateLocaleMap: Record<string, Locale> = { fr, en: enUS, nl, de };
  const dateLocale = dateLocaleMap[language] || fr;

  // Number locale mapping
  const numberLocaleMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', nl: 'nl-NL', de: 'de-DE' };
  const numberLocale = numberLocaleMap[language] || 'fr-FR';

  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | LeaseStatus>('all');
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [leases, setLeases] = useState<Lease[]>([]);
  const [stats, setStats] = useState<LeaseStats>({
    total: 0,
    active: 0,
    endingSoon: 0,
    expired: 0,
    totalMonthlyRent: 0,
    averageDuration: 0,
  });

  // Debounce ref for refresh button (prevents rapid successive clicks)
  const lastRefreshRef = useRef<number>(0);
  const REFRESH_DEBOUNCE_MS = 2000;

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
        .select('id, title, address, city, monthly_rent')
        .eq('owner_id', user.id);

      if (propError) {
        console.error('[Leases] Failed to fetch properties:', propError);
        toast.error(t?.toast?.failedToLoadProperties?.[language] || 'Failed to load your properties');
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
        toast.error(t?.toast?.errorLoadingLeases?.[language] || 'Error loading leases');
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
          property_name: property?.title || 'Propriété',
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
      const avgDuration = leasesData.length > 0
        ? Math.round(leasesData.reduce((sum, l) => sum + l.duration_months, 0) / leasesData.length)
        : 0;

      setStats({
        total: leasesData.length,
        active,
        endingSoon,
        expired,
        totalMonthlyRent,
        averageDuration: avgDuration,
      });

    } catch (error) {
      console.error('[Leases] Error fetching data:', error);
      toast.error(t?.toast?.errorLoadingData?.[language] || 'Error loading data');
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

  // Transform leases for Timeline component
  const timelineLeases = useMemo(() => {
    return leases.map(lease => ({
      id: lease.id,
      tenantName: lease.tenant_name,
      propertyName: lease.property_name,
      startDate: lease.start_date,
      endDate: lease.end_date,
      status: lease.status,
      monthlyRent: lease.monthly_rent,
    }));
  }, [leases]);

  // Transform leases for RenewalWorkflow component
  const renewalLeases = useMemo(() => {
    // Only include ending_soon and expired leases for renewal workflow
    return leases
      .filter(l => l.status === 'ending_soon' || l.status === 'expired')
      .map(lease => ({
        id: lease.id,
        tenantName: lease.tenant_name,
        tenantPhoto: lease.tenant_photo || undefined,
        propertyName: lease.property_name,
        endDate: lease.end_date,
        monthlyRent: lease.monthly_rent,
        renewalStatus: 'pending' as const, // Default to pending - would come from DB in real app
        daysRemaining: lease.days_remaining,
      }));
  }, [leases]);

  // Get status config
  const getStatusConfig = (status: LeaseStatus) => {
    const config = {
      active: {
        className: 'bg-green-100 text-green-700 border-green-200',
        label: t?.status?.active?.[language] || 'Active',
        icon: CheckCircle,
        color: '#22c55e',
      },
      ending_soon: {
        className: 'bg-amber-100 text-amber-700 border-amber-200',
        label: t?.status?.endingSoon?.[language] || 'Ending soon',
        icon: AlertTriangle,
        color: '#f59e0b',
      },
      expired: {
        className: 'bg-red-100 text-red-700 border-red-200',
        label: t?.status?.expired?.[language] || 'Expired',
        icon: XCircle,
        color: '#ef4444',
      },
      future: {
        className: 'bg-blue-100 text-blue-700 border-blue-200',
        label: t?.status?.future?.[language] || 'Upcoming',
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

  // Handle lease document download
  const handleDownloadContract = (lease: Lease) => {
    const documentData: LeaseDocumentData = {
      leaseId: lease.id,
      propertyTitle: lease.property_name,
      propertyAddress: lease.property_address,
      tenantName: lease.tenant_name,
      monthlyRent: lease.monthly_rent,
      startDate: lease.start_date,
      endDate: lease.end_date,
      durationMonths: lease.duration_months,
    };

    toast.loading(t?.toast?.preparingContract?.[language] || 'Preparing contract...', { id: 'download-lease' });

    const result = downloadLeaseDocument(documentData);

    if (result.success) {
      toast.success(t?.toast?.documentReady?.[language] || 'Document ready to print', {
        id: 'download-lease',
        description: t?.toast?.saveToPdfHint?.[language] || 'Use "Save as PDF" in the dialog'
      });
    } else {
      toast.error(t?.toast?.generationError?.[language] || 'Error generating document', {
        id: 'download-lease',
        description: result.error
      });
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
            {t?.loading?.title?.[language] || 'Loading leases...'}
          </h3>
          <p className="text-gray-600">
            {t?.loading?.subtitle?.[language] || 'Analyzing rental contracts'}
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
            onClick={() => router.push('/dashboard/owner/gestion')}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t?.breadcrumb?.parent?.[language] || 'Management'}
          </button>
          <span className="text-gray-300">/</span>
          <span className="font-medium" style={{ color: '#9c5698' }}>{t?.breadcrumb?.current?.[language] || 'Leases'}</span>
        </motion.div>

        {/* Header using shared component */}
        <OwnerPageHeader
          icon={FileText}
          title={t?.header?.title?.[language] || 'Leases'}
          subtitle={t?.header?.subtitle?.[language]?.replace('{count}', String(stats.total)) ||
            `${stats.total} rental contract(s)`}
          actions={
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    const now = Date.now();
                    if (isLoading || now - lastRefreshRef.current < REFRESH_DEBOUNCE_MS) return;
                    lastRefreshRef.current = now;
                    setIsLoading(true);
                    fetchLeasesData();
                  }}
                  className="rounded-full border-gray-300 hover:border-purple-400"
                  aria-label="Actualiser les baux"
                  disabled={isLoading}
                >
                  <RefreshCw className={cn('w-5 h-5', isLoading && 'animate-spin')} />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    // Navigate to applications page where leases can be created from approved applications
                    toast.info(t?.header?.newLeaseInfo?.[language] || 'To create a lease, accept an application from the Applications page');
                    router.push('/dashboard/owner/applications');
                  }}
                  className="rounded-full text-white border-0 shadow-md hover:shadow-lg transition-all"
                  style={{
                    background: ownerGradient,
                    boxShadow: '0 4px 12px rgba(156, 86, 152, 0.3)'
                  }}
                >
                  <FileSignature className="w-5 h-5 mr-2" />
                  {t?.header?.newLease?.[language] || 'New Lease'}
                </Button>
              </motion.div>
            </div>
          }
        />

        {/* KPIs */}
        <OwnerKPIGrid columns={4} className="mt-6 mb-6">
          <OwnerKPICard
            icon={FileText}
            title={t?.kpi?.total?.[language] || 'Total'}
            value={stats.total}
            variant="primary"
          />
          <OwnerKPICard
            icon={CheckCircle}
            title={t?.kpi?.active?.[language] || 'Active'}
            value={stats.active}
            variant="success"
          />
          <OwnerKPICard
            icon={AlertTriangle}
            title={t?.kpi?.endingSoon?.[language] || 'Ending soon (3 mo.)'}
            value={stats.endingSoon}
            variant="warning"
          />
          <OwnerKPICard
            icon={Euro}
            title={t?.kpi?.monthlyRent?.[language] || 'Monthly rent'}
            value={`${stats.totalMonthlyRent.toLocaleString(numberLocale)}€`}
            variant="primary"
          />
        </OwnerKPIGrid>

        {/* View Toggle and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-full">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={cn(
                "rounded-full",
                viewMode === 'list' && 'text-white'
              )}
              style={viewMode === 'list' ? { background: ownerGradient } : undefined}
            >
              <Users className="w-4 h-4 mr-2" />
              {t?.viewMode?.list?.[language] || 'List'}
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('timeline')}
              className={cn(
                "rounded-full",
                viewMode === 'timeline' && 'text-white'
              )}
              style={viewMode === 'timeline' ? { background: ownerGradient } : undefined}
            >
              <GanttChart className="w-4 h-4 mr-2" />
              {t?.viewMode?.timeline?.[language] || 'Timeline'}
            </Button>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all' as const, label: t?.filters?.all?.[language] || 'All', count: stats.total },
              { value: 'active' as const, label: t?.filters?.active?.[language] || 'Active', count: stats.active },
              { value: 'ending_soon' as const, label: t?.filters?.endingSoon?.[language] || 'Ending soon', count: stats.endingSoon },
              { value: 'expired' as const, label: t?.filters?.expired?.[language] || 'Expired', count: stats.expired }
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
        </div>

        {/* Alert Banner */}
        {(stats.expired > 0 || stats.endingSoon > 0) && (
          <OwnerAlertBanner
            severity={stats.expired > 0 ? 'critical' : 'warning'}
            title={
              stats.expired > 0
                ? (t?.alert?.expiredTitle?.[language]?.replace('{count}', String(stats.expired)) ||
                   `${stats.expired} expired lease${stats.expired > 1 ? 's' : ''} to renew`)
                : (t?.alert?.endingSoonTitle?.[language]?.replace('{count}', String(stats.endingSoon)) ||
                   `${stats.endingSoon} lease${stats.endingSoon > 1 ? 's' : ''} expiring soon`)
            }
            description={
              stats.expired > 0
                ? (t?.alert?.expiredDescription?.[language] || 'Action required to renew or terminate these contracts')
                : (t?.alert?.endingSoonDescription?.[language] || 'Consider contacting your tenants to discuss renewal')
            }
            action={{
              label: t?.alert?.viewLeases?.[language] || 'View leases',
              onClick: () => setFilterStatus(stats.expired > 0 ? 'expired' : 'ending_soon')
            }}
            className="mb-6"
          />
        )}

        {/* UNIQUE SECTION 1: Lease Timeline (Gantt-like) */}
        {viewMode === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <LeaseTimeline
              leases={timelineLeases}
              onLeaseClick={(leaseId) => {
                const lease = leases.find(l => l.id === leaseId);
                if (lease) {
                  const fromDate = format(lease.start_date, 'dd MMM yyyy', { locale: dateLocale });
                  const toDate = format(lease.end_date, 'dd MMM yyyy', { locale: dateLocale });
                  toast.info(
                    t?.toast?.leaseInfo?.[language]
                      ?.replace('{tenant}', lease.tenant_name)
                      ?.replace('{from}', fromDate)
                      ?.replace('{to}', toDate) ||
                    `Lease for ${lease.tenant_name} - ${fromDate} to ${toDate}`
                  );
                }
              }}
            />
          </motion.div>
        )}

        {/* UNIQUE SECTION 2: Renewal Workflow Pipeline */}
        {renewalLeases.length > 0 && viewMode === 'list' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <RenewalWorkflow
              leases={renewalLeases}
              onContact={(leaseId) => {
                const lease = leases.find(l => l.id === leaseId);
                if (lease) {
                  router.push(`/dashboard/owner/messages?tenant=${lease.resident_id}`);
                }
              }}
              onRenew={(leaseId) => {
                const lease = leases.find(l => l.id === leaseId);
                if (lease) {
                  // Redirect to messaging with renewal context
                  toast.success(
                    language === 'fr'
                      ? `Redirection vers la messagerie pour discuter du renouvellement avec ${lease.tenant_name}`
                      : `Redirecting to messaging to discuss renewal with ${lease.tenant_name}`,
                    { duration: 2000 }
                  );
                  router.push(`/dashboard/owner/messages?tenant=${lease.resident_id}&context=renewal`);
                }
              }}
              onDecline={(leaseId) => {
                const lease = leases.find(l => l.id === leaseId);
                if (lease) {
                  // Redirect to messaging to notify tenant about non-renewal
                  toast.info(
                    language === 'fr'
                      ? `Contactez ${lease.tenant_name} pour l'informer de la non-reconduction du bail`
                      : `Contact ${lease.tenant_name} to inform about lease non-renewal`,
                    { duration: 3000 }
                  );
                  router.push(`/dashboard/owner/messages?tenant=${lease.resident_id}&context=termination`);
                }
              }}
            />
          </motion.div>
        )}

        {/* Leases List */}
        {viewMode === 'list' && (
          <AnimatePresence mode="wait">
            {filteredLeases.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative overflow-hidden bg-white/80 backdrop-blur-sm superellipse-3xl p-12 text-center border border-gray-200"
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: ownerGradient }} />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-10" style={{ background: ownerGradient }} />

                <div className="relative w-20 h-20 mx-auto mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 superellipse-2xl blur-lg"
                    style={{ background: ownerGradient }}
                  />
                  <div
                    className="relative w-20 h-20 superellipse-2xl flex items-center justify-center shadow-lg"
                    style={{ background: ownerGradient }}
                  >
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {filterStatus === 'all'
                    ? (t?.empty?.noLeases?.[language] || 'No leases')
                    : (t?.empty?.noLeasesFound?.[language] || 'No leases found')}
                </h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  {filterStatus === 'all'
                    ? (t?.empty?.addTenantsHint?.[language] || 'Add tenants with lease dates to see contracts here')
                    : (t?.empty?.tryAnotherFilter?.[language] || 'Try another filter')}
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5" style={{ color: '#9c5698' }} />
                    {t?.list?.allContracts?.[language] || 'All contracts'}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {t?.list?.leaseCount?.[language]?.replace('{count}', String(filteredLeases.length)) ||
                     `${filteredLeases.length} lease${filteredLeases.length !== 1 ? 's' : ''}`}
                  </span>
                </div>

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
                      className="relative overflow-hidden bg-white/80 backdrop-blur-sm superellipse-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
                      style={{
                        borderLeftWidth: '4px',
                        borderLeftColor: statusConfig.color,
                      }}
                      onClick={() => {
                        const fromDate = format(lease.start_date, 'dd MMM yyyy', { locale: dateLocale });
                        const toDate = format(lease.end_date, 'dd MMM yyyy', { locale: dateLocale });
                        toast.info(
                          t?.toast?.leaseInfo?.[language]
                            ?.replace('{tenant}', lease.tenant_name)
                            ?.replace('{from}', fromDate)
                            ?.replace('{to}', toDate) ||
                          `Lease for ${lease.tenant_name} - ${fromDate} to ${toDate}`
                        );
                      }}
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
                                  className="w-14 h-14 superellipse-xl object-cover shadow-sm"
                                />
                              ) : (
                                <div
                                  className="w-14 h-14 superellipse-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
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
                                {lease.monthly_rent.toLocaleString(numberLocale)}€
                              </div>
                              <div className="text-xs text-gray-500">/{t?.list?.perMonth?.[language] || 'month'}</div>
                            </div>
                          </div>

                          {/* Lease Timeline */}
                          <div className="space-y-3">
                            {/* Date range */}
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <CalendarCheck className="w-4 h-4 text-green-500" />
                                <span>{t?.list?.start?.[language] || 'Start'}: {format(lease.start_date, 'd MMM yyyy', { locale: dateLocale })}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <CalendarX className="w-4 h-4 text-red-500" />
                                <span>{t?.list?.end?.[language] || 'End'}: {format(lease.end_date, 'd MMM yyyy', { locale: dateLocale })}</span>
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
                                <span>{lease.duration_months} {t?.list?.months?.[language] || 'months'}</span>
                                {lease.status !== 'expired' && (
                                  <span className={cn(
                                    lease.status === 'ending_soon' && "text-amber-600 font-medium"
                                  )}>
                                    {t?.list?.daysRemaining?.[language]?.replace('{count}', String(lease.days_remaining)) ||
                                     `${lease.days_remaining} days remaining`}
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
                                className="w-full superellipse-xl text-white border-0 shadow-md transition-all"
                                style={{
                                  background: ownerGradient,
                                  boxShadow: '0 4px 12px rgba(156, 86, 152, 0.3)'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.info(
                                    t?.toast?.renewalComingSoon?.[language]?.replace('{tenant}', lease.tenant_name) ||
                                    `Lease renewal for ${lease.tenant_name} - Coming soon`
                                  );
                                }}
                              >
                                <Repeat className="w-4 h-4 mr-2" />
                                {t?.actions?.renew?.[language] || 'Renew'}
                              </Button>
                            </motion.div>
                          )}
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full superellipse-xl hover:bg-purple-50 hover:border-purple-400 transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadContract(lease);
                              }}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              {t?.actions?.contract?.[language] || 'Contract'}
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
        )}
      </main>
    </div>
  );
}
