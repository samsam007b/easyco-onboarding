'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApplications } from '@/lib/hooks/use-applications';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import type { Application, GroupApplication } from '@/lib/hooks/use-applications';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  FileText,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Sparkles,
  Search,
  Filter,
  ChevronDown,
  Users,
  UserCheck,
  UserX,
  User,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { OwnerPageHeader } from '@/components/owner';
import {
  ApplicationPipeline,
  CreateLeaseModal,
  type ApplicationData,
  type ApplicationStatus,
  type ApplicationType,
} from '@/components/owner/portfolio';
import {
  ownerGradientLight,
  ownerPageBackground,
  ownerGradient,
  ownerPalette,
  semanticColors,
} from '@/lib/constants/owner-theme';

type FilterStatus = 'all' | ApplicationStatus;
type FilterType = 'all' | ApplicationType;

export default function OwnerApplicationsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { setActiveRole } = useRole();
  const { getSection, language } = useLanguage();
  const t = getSection('dashboard')?.owner?.applicationsPage;

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [groupApps, setGroupApps] = useState<GroupApplication[]>([]);
  const [properties, setProperties] = useState<{ id: string; title: string }[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterProperty, setFilterProperty] = useState<string>('all');

  // Modal state
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    action: 'approve' | 'reject' | null;
    application: ApplicationData | null;
  }>({
    open: false,
    action: null,
    application: null,
  });
  const [rejectReason, setRejectReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // Lease creation modal state
  const [leaseModal, setLeaseModal] = useState<{
    open: boolean;
    application: ApplicationData | null;
    applicantId: string | null;
  }>({
    open: false,
    application: null,
    applicantId: null,
  });

  const {
    applications: hookApplications,
    groupApplications: hookGroupApplications,
    loadApplications,
    updateApplicationStatus,
    updateGroupApplicationStatus,
  } = useApplications(userId || undefined);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setActiveRole('owner');

        // Load owner properties
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('id, title')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (propertiesData) {
          setProperties(propertiesData);
        }

        await loadApplications(true);
      } else {
        router.push('/login');
      }

      setLoading(false);
    };

    init();
  }, [supabase, router, setActiveRole, loadApplications]);

  useEffect(() => {
    if (hookApplications) {
      setApplications(hookApplications);
    }
    if (hookGroupApplications) {
      setGroupApps(hookGroupApplications);
    }
  }, [hookApplications, hookGroupApplications]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadApplications(true);
    setIsRefreshing(false);
  }, [loadApplications]);

  // Transform to ApplicationData format (with applicantId for lease creation)
  const allApplications = useMemo((): (ApplicationData & { applicantId?: string })[] => {
    const individual: (ApplicationData & { applicantId?: string })[] = applications.map((app) => ({
      id: app.id,
      type: 'individual' as ApplicationType,
      status: app.status as ApplicationStatus,
      propertyId: app.property_id,
      propertyTitle: app.property?.title || (t?.fallback?.property?.[language] || 'Property'),
      propertyCity: app.property?.city || '',
      applicantId: app.applicant_id,
      applicantName: app.applicant_name,
      applicantEmail: app.applicant_email,
      applicantPhone: app.applicant_phone || undefined,
      monthlyIncome: app.monthly_income || undefined,
      profession: app.occupation || undefined,
      moveInDate: app.desired_move_in_date ? new Date(app.desired_move_in_date) : undefined,
      leaseDurationMonths: app.lease_duration_months || undefined,
      message: app.message || undefined,
      createdAt: new Date(app.created_at),
      updatedAt: new Date(app.updated_at || app.created_at),
    }));

    const group: ApplicationData[] = groupApps.map((app) => ({
      id: app.id,
      type: 'group' as ApplicationType,
      status: app.status as ApplicationStatus,
      propertyId: app.property_id,
      propertyTitle: app.property?.title || (t?.fallback?.property?.[language] || 'Property'),
      propertyCity: app.property?.city || '',
      applicantName: app.group?.name || (t?.fallback?.group?.[language] || 'Group'),
      monthlyIncome: app.combined_income || undefined,
      message: app.message || undefined,
      createdAt: new Date(app.created_at),
      updatedAt: new Date(app.updated_at || app.created_at),
      groupSize: app.group?.members?.length || 2,
    }));

    return [...individual, ...group];
  }, [applications, groupApps, t, language]);

  // Apply filters
  const filteredApplications = useMemo(() => {
    return allApplications.filter((app) => {
      // Status filter
      if (filterStatus !== 'all' && app.status !== filterStatus) return false;

      // Type filter
      if (filterType !== 'all' && app.type !== filterType) return false;

      // Property filter
      if (filterProperty !== 'all' && app.propertyId !== filterProperty) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = app.applicantName.toLowerCase().includes(query);
        const matchesProperty = app.propertyTitle.toLowerCase().includes(query);
        const matchesProfession = app.profession?.toLowerCase().includes(query);
        if (!matchesName && !matchesProperty && !matchesProfession) return false;
      }

      return true;
    });
  }, [allApplications, filterStatus, filterType, filterProperty, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    total: allApplications.length,
    individual: applications.length,
    groups: groupApps.length,
    pending: allApplications.filter((a) => a.status === 'pending').length,
    reviewing: allApplications.filter((a) => a.status === 'reviewing').length,
    approved: allApplications.filter((a) => a.status === 'approved').length,
    rejected: allApplications.filter((a) => a.status === 'rejected').length,
  }), [allApplications, applications.length, groupApps.length]);

  // Handle status change from pipeline drag
  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    const app = allApplications.find((a) => a.id === applicationId);
    if (!app) return;

    const isGroup = app.type === 'group';

    try {
      let success = false;
      if (isGroup) {
        success = await updateGroupApplicationStatus(applicationId, newStatus);
      } else {
        success = await updateApplicationStatus(applicationId, newStatus);
      }

      if (success) {
        toast.success(`${t?.toast?.statusChanged?.[language] || 'Application moved to'} "${getStatusLabel(newStatus)}"`);
        await loadApplications(true);
      }
    } catch (error) {
      toast.error(t?.toast?.statusChangeError?.[language] || 'Error changing status');
    }
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    const labels: Record<ApplicationStatus, string> = {
      pending: t?.status?.pending?.[language] || 'Pending',
      reviewing: t?.status?.reviewing?.[language] || 'In review',
      approved: t?.status?.approved?.[language] || 'Approved',
      rejected: t?.status?.rejected?.[language] || 'Rejected',
    };
    return labels[status];
  };

  // Handle approve/reject actions
  const handleOpenActionModal = (action: 'approve' | 'reject', application: ApplicationData) => {
    setActionModal({ open: true, action, application });
    setRejectReason('');
  };

  const handleCloseModal = () => {
    if (!processingAction) {
      setActionModal({ open: false, action: null, application: null });
      setRejectReason('');
    }
  };

  const handleConfirmAction = async () => {
    if (!actionModal.application || !actionModal.action) return;

    setProcessingAction(true);

    try {
      const app = actionModal.application;
      const isGroup = app.type === 'group';
      const newStatus = actionModal.action === 'approve' ? 'approved' : 'rejected';
      let success = false;

      if (isGroup) {
        // For group applications: notes param is used for rejection reason
        success = await updateGroupApplicationStatus(
          app.id,
          newStatus,
          actionModal.action === 'reject' ? rejectReason || undefined : undefined
        );
      } else {
        // For individual applications: 3rd param = reviewNotes, 4th param = rejectionReason
        success = await updateApplicationStatus(
          app.id,
          newStatus,
          undefined, // reviewNotes
          actionModal.action === 'reject' ? rejectReason || undefined : undefined // rejectionReason
        );
      }

      if (success) {
        toast.success(
          actionModal.action === 'approve'
            ? (t?.toast?.approveSuccess?.[language] || 'Candidature approuvée !')
            : (t?.toast?.rejectSuccess?.[language] || 'Candidature rejetée')
        );
        await loadApplications(true);

        // If approved and individual application, offer to create lease
        if (actionModal.action === 'approve' && !isGroup) {
          // Find the full application data with applicantId
          const fullApp = allApplications.find(a => a.id === app.id);
          const applicantId = (fullApp as ApplicationData & { applicantId?: string })?.applicantId;

          if (applicantId) {
            // Slight delay for better UX
            setTimeout(() => {
              setLeaseModal({
                open: true,
                application: app,
                applicantId: applicantId,
              });
            }, 500);
          }
        }
      }

      handleCloseModal();
    } catch (error) {
      toast.error(t?.toast?.actionError?.[language] || 'Erreur lors de l\'action');
    } finally {
      setProcessingAction(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: ownerGradientLight }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center mb-6">
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t?.loading?.title?.[language] || 'Loading applications...'}
          </h3>
          <p className="text-gray-600">
            {t?.loading?.subtitle?.[language] || 'Preparing your data'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: ownerPageBackground }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <OwnerPageHeader
          icon={FileText}
          title={t?.header?.title?.[language] || 'Applications'}
          subtitle={t?.header?.subtitle?.[language] || 'Manage applications for your properties'}
          breadcrumb={{ label: t?.breadcrumb?.portfolio?.[language] || 'Portfolio', href: '/dashboard/owner/portfolio' }}
          currentPage={t?.breadcrumb?.applications?.[language] || 'Applications'}
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-full"
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', isRefreshing && 'animate-spin')} />
              {t?.actions?.refresh?.[language] || 'Refresh'}
            </Button>
          }
        />

        {/* Bold KPI Cards - 4 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Card 1: Total Applications - PRIMARY Solid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer"
            style={{ background: ownerPalette.primary.main }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
              style={{ background: 'rgba(255,255,255,0.3)' }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-12 h-12 superellipse-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-white/80 bg-white/20 px-2 py-1 rounded-full">
                  {t?.stats?.total?.[language] || 'Total'}
                </span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{stats.total}</p>
              <p className="text-sm text-white/80">
                {t?.stats?.candidatures?.[language] || 'candidatures reçues'}
              </p>
              <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2 text-xs text-white/70">
                <User className="w-3.5 h-3.5" />
                <span>{stats.individual} {t?.stats?.individuals?.[language] || 'individuels'}</span>
                <span className="mx-1">•</span>
                <Users className="w-3.5 h-3.5" />
                <span>{stats.groups} {t?.stats?.groupsLabel?.[language] || 'groupes'}</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Pending - TERTIARY Solid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer"
            style={{ background: ownerPalette.tertiary.main }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
              style={{ background: 'rgba(255,255,255,0.3)' }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-12 h-12 superellipse-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-white/80 bg-white/20 px-2 py-1 rounded-full">
                  {t?.stats?.actionRequired?.[language] || 'À traiter'}
                </span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{stats.pending + stats.reviewing}</p>
              <p className="text-sm text-white/80">
                {t?.stats?.awaitingDecision?.[language] || 'en attente de décision'}
              </p>
              <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2 text-xs text-white/70">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{stats.pending} {t?.status?.pending?.[language] || 'nouvelles'}</span>
                <span className="mx-1">•</span>
                <span>{stats.reviewing} {t?.status?.reviewing?.[language] || 'en cours'}</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Approved - White with Success accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer bg-white border"
            style={{ borderColor: semanticColors.success.border }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
              style={{ background: semanticColors.success.gradient }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-12 h-12 superellipse-xl flex items-center justify-center"
                  style={{ background: semanticColors.success.bg }}
                >
                  <UserCheck className="w-6 h-6" style={{ color: semanticColors.success.text }} />
                </div>
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ background: semanticColors.success.bg, color: semanticColors.success.text }}
                >
                  {t?.status?.approved?.[language] || 'Approuvées'}
                </span>
              </div>
              <p className="text-4xl font-bold mb-1" style={{ color: semanticColors.success.text }}>
                {stats.approved}
              </p>
              <p className="text-sm text-gray-600">
                {t?.stats?.candidatesAccepted?.[language] || 'candidats acceptés'}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: semanticColors.success.text }} />
                <span>
                  {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% {t?.stats?.acceptanceRate?.[language] || "taux d'acceptation"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Rejected - White with Danger accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer bg-white border"
            style={{ borderColor: semanticColors.danger.border }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
              style={{ background: semanticColors.danger.gradient }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-12 h-12 superellipse-xl flex items-center justify-center"
                  style={{ background: semanticColors.danger.bg }}
                >
                  <UserX className="w-6 h-6" style={{ color: semanticColors.danger.text }} />
                </div>
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ background: semanticColors.danger.bg, color: semanticColors.danger.text }}
                >
                  {t?.status?.rejected?.[language] || 'Refusées'}
                </span>
              </div>
              <p className="text-4xl font-bold mb-1" style={{ color: semanticColors.danger.text }}>
                {stats.rejected}
              </p>
              <p className="text-sm text-gray-600">
                {t?.stats?.candidatesRejected?.[language] || 'candidatures refusées'}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: semanticColors.danger.text }} />
                <span>
                  {stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}% {t?.stats?.rejectionRate?.[language] || 'taux de refus'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 p-4"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <Input
                type="text"
                placeholder={t?.filters?.searchPlaceholder?.[language] || 'Search for an applicant...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 superellipse-xl border-gray-200"
                aria-label={t?.filters?.searchAriaLabel?.[language] || 'Search applicant by name, property or profession'}
              />
            </div>

            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'superellipse-xl justify-between min-w-[140px]',
                    filterType !== 'all' && 'border-purple-300 bg-purple-50'
                  )}
                >
                  {filterType === 'all'
                    ? (t?.filters?.allTypes?.[language] || 'All types')
                    : filterType === 'individual'
                      ? (t?.filters?.individual?.[language] || 'Individual')
                      : (t?.filters?.groups?.[language] || 'Groups')}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {[
                  { value: 'all', label: t?.filters?.allTypes?.[language] || 'All types' },
                  { value: 'individual', label: t?.filters?.individual?.[language] || 'Individual' },
                  { value: 'group', label: t?.filters?.groups?.[language] || 'Groups' },
                ].map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setFilterType(option.value as FilterType)}
                    className={cn(filterType === option.value && 'bg-purple-50')}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'superellipse-xl justify-between min-w-[140px]',
                    filterStatus !== 'all' && 'border-purple-300 bg-purple-50'
                  )}
                >
                  {filterStatus === 'all' ? (t?.filters?.allStatuses?.[language] || 'All statuses') : getStatusLabel(filterStatus)}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {[
                  { value: 'all', label: t?.filters?.allStatuses?.[language] || 'All statuses' },
                  { value: 'pending', label: t?.status?.pending?.[language] || 'Pending' },
                  { value: 'reviewing', label: t?.status?.reviewing?.[language] || 'In review' },
                  { value: 'approved', label: t?.status?.approved?.[language] || 'Approved' },
                  { value: 'rejected', label: t?.status?.rejected?.[language] || 'Rejected' },
                ].map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setFilterStatus(option.value as FilterStatus)}
                    className={cn(filterStatus === option.value && 'bg-purple-50')}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Property Filter */}
            {properties.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'superellipse-xl justify-between min-w-[160px]',
                      filterProperty !== 'all' && 'border-purple-300 bg-purple-50'
                    )}
                  >
                    <span className="truncate max-w-[120px]">
                      {filterProperty === 'all'
                        ? (t?.filters?.allProperties?.[language] || 'All properties')
                        : properties.find((p) => p.id === filterProperty)?.title || (t?.filters?.property?.[language] || 'Property')}
                    </span>
                    <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-h-60 overflow-auto">
                  <DropdownMenuItem
                    onClick={() => setFilterProperty('all')}
                    className={cn(filterProperty === 'all' && 'bg-purple-50')}
                  >
                    {t?.filters?.allProperties?.[language] || 'All properties'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {properties.map((property) => (
                    <DropdownMenuItem
                      key={property.id}
                      onClick={() => setFilterProperty(property.id)}
                      className={cn(filterProperty === property.id && 'bg-purple-50')}
                    >
                      {property.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Reset Filters */}
            {(filterStatus !== 'all' || filterType !== 'all' || filterProperty !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterType('all');
                  setFilterProperty('all');
                  setSearchQuery('');
                }}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 superellipse-xl"
              >
                {t?.filters?.reset?.[language] || 'Reset'}
              </Button>
            )}
          </div>

          {/* Results count */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {filteredApplications.length === allApplications.length ? (
                <>{allApplications.length} {allApplications.length > 1 ? (t?.results?.applications?.[language] || 'applications') : (t?.results?.application?.[language] || 'application')}</>
              ) : (
                <>{filteredApplications.length} {t?.results?.of?.[language] || 'of'} {allApplications.length} {allApplications.length > 1 ? (t?.results?.applications?.[language] || 'applications') : (t?.results?.application?.[language] || 'application')}</>
              )}
            </span>
          </div>
        </motion.div>

        {/* Application Pipeline */}
        <div className="mt-6">
          <ApplicationPipeline
            applications={filteredApplications}
            onStatusChange={handleStatusChange}
            onApprove={(app) => handleOpenActionModal('approve', app)}
            onReject={(app) => handleOpenActionModal('reject', app)}
          />
        </div>
      </main>

      {/* Action Confirmation Modal */}
      <AnimatePresence>
        {actionModal.open && actionModal.application && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseModal}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative overflow-hidden bg-white superellipse-3xl shadow-2xl p-8 max-w-md w-full border border-gray-200"
            >
              {/* Decorative top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: actionModal.action === 'approve'
                    ? 'linear-gradient(90deg, #22c55e 0%, #10b981 100%)'
                    : 'linear-gradient(90deg, #ef4444 0%, #ec4899 100%)',
                }}
              />

              <div className="text-center">
                {/* Animated Icon */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="relative w-16 h-16 mx-auto mb-4"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-30"
                    style={{
                      background: actionModal.action === 'approve'
                        ? 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
                      filter: 'blur(12px)',
                    }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <div
                    className="relative w-full h-full rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: actionModal.action === 'approve'
                        ? 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
                    }}
                  >
                    {actionModal.action === 'approve' ? (
                      <ThumbsUp className="w-8 h-8 text-white" />
                    ) : (
                      <ThumbsDown className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  >
                    <Sparkles
                      className="w-5 h-5"
                      style={{ color: actionModal.action === 'approve' ? '#22c55e' : '#ef4444' }}
                    />
                  </motion.div>
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {actionModal.action === 'approve'
                    ? (t?.modal?.approveTitle?.[language] || 'Approuver la candidature')
                    : (t?.modal?.rejectTitle?.[language] || 'Rejeter la candidature')}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-2">
                  {actionModal.action === 'approve'
                    ? (t?.modal?.approveConfirm?.[language] || 'Êtes-vous sûr de vouloir approuver la candidature de')
                    : (t?.modal?.rejectConfirm?.[language] || 'Êtes-vous sûr de vouloir rejeter la candidature de')}
                </p>
                <p className="font-semibold text-gray-900 mb-4">
                  "{actionModal.application.applicantName}" ?
                </p>

                {/* Reject reason input */}
                {actionModal.action === 'reject' && (
                  <div className="mb-6 text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t?.modal?.rejectReasonLabel?.[language] || 'Raison du rejet (optionnel)'}
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder={t?.modal?.rejectReasonPlaceholder?.[language] || 'Expliquez pourquoi vous rejetez cette candidature...'}
                      className="w-full px-4 py-3 superellipse-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      rows={4}
                      disabled={processingAction}
                    />
                  </div>
                )}

                {actionModal.action === 'approve' && (
                  <p className="text-sm text-gray-600 mb-8">
                    {t?.modal?.notifyApplicant?.[language] || 'Le candidat sera notifié de votre décision.'}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full superellipse-xl"
                      onClick={handleCloseModal}
                      disabled={processingAction}
                    >
                      {t?.modal?.cancel?.[language] || 'Annuler'}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      className={cn(
                        'w-full superellipse-xl text-white shadow-md',
                        actionModal.action === 'approve'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                          : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                      )}
                      onClick={handleConfirmAction}
                      disabled={processingAction}
                    >
                      {processingAction ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          {t?.modal?.processing?.[language] || 'Traitement...'}
                        </>
                      ) : actionModal.action === 'approve' ? (
                        t?.actions?.approve?.[language] || 'Approuver'
                      ) : (
                        t?.actions?.reject?.[language] || 'Rejeter'
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Lease Modal */}
      {leaseModal.application && (
        <CreateLeaseModal
          isOpen={leaseModal.open}
          onClose={() => setLeaseModal({ open: false, application: null, applicantId: null })}
          onSuccess={async () => {
            await loadApplications(true);
          }}
          applicationData={{
            id: leaseModal.application.id,
            applicantId: leaseModal.applicantId || undefined,
            applicantName: leaseModal.application.applicantName,
            applicantEmail: leaseModal.application.applicantEmail,
            applicantPhone: leaseModal.application.applicantPhone,
            propertyId: leaseModal.application.propertyId,
            propertyTitle: leaseModal.application.propertyTitle,
            moveInDate: leaseModal.application.moveInDate,
            monthlyRent: leaseModal.application.monthlyIncome
              ? Math.round(leaseModal.application.monthlyIncome / 3)
              : undefined,
            leaseDurationMonths: (leaseModal.application as ApplicationData & { leaseDurationMonths?: number }).leaseDurationMonths,
          }}
        />
      )}
    </div>
  );
}
