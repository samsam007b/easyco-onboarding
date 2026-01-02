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
  type ApplicationData,
  type ApplicationStatus,
  type ApplicationType,
} from '@/components/owner/portfolio';
import { ownerGradientLight, ownerPageBackground, ownerGradient } from '@/lib/constants/owner-theme';

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

  // Transform to ApplicationData format
  const allApplications = useMemo((): ApplicationData[] => {
    const individual: ApplicationData[] = applications.map((app) => ({
      id: app.id,
      type: 'individual' as ApplicationType,
      status: app.status as ApplicationStatus,
      propertyId: app.property_id,
      propertyTitle: app.property?.title || 'Propriété',
      propertyCity: app.property?.city || '',
      applicantName: app.applicant_name,
      applicantEmail: app.applicant_email,
      applicantPhone: app.applicant_phone || undefined,
      monthlyIncome: app.monthly_income || undefined,
      profession: app.occupation || undefined,
      moveInDate: app.desired_move_in_date ? new Date(app.desired_move_in_date) : undefined,
      message: app.message || undefined,
      createdAt: new Date(app.created_at),
      updatedAt: new Date(app.updated_at || app.created_at),
    }));

    const group: ApplicationData[] = groupApps.map((app) => ({
      id: app.id,
      type: 'group' as ApplicationType,
      status: app.status as ApplicationStatus,
      propertyId: app.property_id,
      propertyTitle: app.property?.title || 'Propriété',
      propertyCity: app.property?.city || '',
      applicantName: app.group?.name || 'Groupe',
      monthlyIncome: app.combined_income || undefined,
      message: app.message || undefined,
      createdAt: new Date(app.created_at),
      updatedAt: new Date(app.updated_at || app.created_at),
      groupSize: app.group?.members?.length || 2,
    }));

    return [...individual, ...group];
  }, [applications, groupApps]);

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
        toast.success(`Candidature passée en "${getStatusLabel(newStatus)}"`);
        await loadApplications(true);
      }
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    const labels: Record<ApplicationStatus, string> = {
      pending: 'En attente',
      reviewing: 'En cours',
      approved: 'Approuvée',
      rejected: 'Refusée',
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
        success = await updateGroupApplicationStatus(
          app.id,
          newStatus,
          actionModal.action === 'reject' ? rejectReason || undefined : undefined
        );
      } else {
        success = await updateApplicationStatus(
          app.id,
          newStatus,
          actionModal.action === 'reject' ? rejectReason || undefined : undefined
        );
      }

      if (success) {
        toast.success(
          actionModal.action === 'approve'
            ? (t?.toast?.approveSuccess?.[language] || 'Candidature approuvée !')
            : (t?.toast?.rejectSuccess?.[language] || 'Candidature rejetée')
        );
        await loadApplications(true);
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
            {t?.loading?.title?.[language] || 'Chargement des candidatures...'}
          </h3>
          <p className="text-gray-600">
            {t?.loading?.subtitle?.[language] || 'Préparation de vos données'}
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
          title={t?.header?.title?.[language] || 'Candidatures'}
          subtitle={t?.header?.subtitle?.[language] || 'Gérez les candidatures pour vos biens'}
          breadcrumb={{ label: 'Portfolio', href: '/dashboard/owner/portfolio' }}
          currentPage="Candidatures"
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-full"
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', isRefreshing && 'animate-spin')} />
              Actualiser
            </Button>
          }
        />

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3"
        >
          {[
            { label: 'Total', value: stats.total, color: '#9c5698' },
            { label: 'Individuelles', value: stats.individual, color: '#3b82f6' },
            { label: 'Groupes', value: stats.groups, color: '#c2566b' },
            { label: 'En attente', value: stats.pending, color: '#f59e0b' },
            { label: 'En cours', value: stats.reviewing, color: '#3b82f6' },
            { label: 'Approuvées', value: stats.approved, color: '#10b981' },
            { label: 'Refusées', value: stats.rejected, color: '#ef4444' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + idx * 0.05 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
                <span className="text-xs text-gray-600">{stat.label}</span>
              </div>
              <p className="text-xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-4"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un candidat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-gray-200"
              />
            </div>

            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'rounded-xl justify-between min-w-[140px]',
                    filterType !== 'all' && 'border-purple-300 bg-purple-50'
                  )}
                >
                  {filterType === 'all' ? 'Tous types' : filterType === 'individual' ? 'Individuelles' : 'Groupes'}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {[
                  { value: 'all', label: 'Tous types' },
                  { value: 'individual', label: 'Individuelles' },
                  { value: 'group', label: 'Groupes' },
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
                    'rounded-xl justify-between min-w-[140px]',
                    filterStatus !== 'all' && 'border-purple-300 bg-purple-50'
                  )}
                >
                  {filterStatus === 'all' ? 'Tous statuts' : getStatusLabel(filterStatus)}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {[
                  { value: 'all', label: 'Tous statuts' },
                  { value: 'pending', label: 'En attente' },
                  { value: 'reviewing', label: 'En cours' },
                  { value: 'approved', label: 'Approuvées' },
                  { value: 'rejected', label: 'Refusées' },
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
                      'rounded-xl justify-between min-w-[160px]',
                      filterProperty !== 'all' && 'border-purple-300 bg-purple-50'
                    )}
                  >
                    <span className="truncate max-w-[120px]">
                      {filterProperty === 'all'
                        ? 'Toutes propriétés'
                        : properties.find((p) => p.id === filterProperty)?.title || 'Propriété'}
                    </span>
                    <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-h-60 overflow-auto">
                  <DropdownMenuItem
                    onClick={() => setFilterProperty('all')}
                    className={cn(filterProperty === 'all' && 'bg-purple-50')}
                  >
                    Toutes les propriétés
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
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl"
              >
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Results count */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {filteredApplications.length === allApplications.length ? (
                <>{allApplications.length} candidature{allApplications.length > 1 ? 's' : ''}</>
              ) : (
                <>{filteredApplications.length} sur {allApplications.length} candidature{allApplications.length > 1 ? 's' : ''}</>
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
              className="relative overflow-hidden bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-200"
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
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
                      className="w-full rounded-xl"
                      onClick={handleCloseModal}
                      disabled={processingAction}
                    >
                      {t?.modal?.cancel?.[language] || 'Annuler'}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      className={cn(
                        'w-full rounded-xl text-white shadow-md',
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
    </div>
  );
}
