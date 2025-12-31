'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApplications } from '@/lib/hooks/use-applications';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import type { Application, GroupApplication } from '@/lib/hooks/use-applications';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Calendar,
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Users,
  Building2,
  UserCircle,
  TrendingUp,
  FileText,
  AlertCircle,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

type ApplicationType = 'individual' | 'group';
type CombinedStatus = Application['status'] | GroupApplication['status'];

export default function OwnerApplicationsPage() {
  const router = useRouter();
  const { setActiveRole } = useRole();
  const { getSection, language } = useLanguage();
  const t = getSection('dashboard')?.owner?.applicationsPage;
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [groupApps, setGroupApps] = useState<GroupApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | CombinedStatus>('all');
  const [filterType, setFilterType] = useState<'all' | ApplicationType>('all');
  const [filterProperty, setFilterProperty] = useState<'all' | string>('all');
  const [properties, setProperties] = useState<any[]>([]);

  // Modal state
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    action: 'approve' | 'reject' | null;
    applicationId: string | null;
    applicationType: 'individual' | 'group';
    applicantName: string;
  }>({
    open: false,
    action: null,
    applicationId: null,
    applicationType: 'individual',
    applicantName: ''
  });
  const [rejectReason, setRejectReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  const {
    applications: hookApplications,
    groupApplications: hookGroupApplications,
    loadApplications,
    updateApplicationStatus,
    updateGroupApplicationStatus,
    isLoading: hookLoading
  } = useApplications(userId || undefined);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setActiveRole('owner');

        // Load profile
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile({
          full_name: profileData?.first_name && profileData?.last_name
            ? `${profileData.first_name} ${profileData.last_name}`
            : userData?.full_name || user.email?.split('@')[0] || 'User',
          email: userData?.email || user.email || '',
          profile_data: profileData || {}
        });

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
      }

      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (hookApplications) {
      setApplications(hookApplications);
    }
    if (hookGroupApplications) {
      setGroupApps(hookGroupApplications);
    }
  }, [hookApplications, hookGroupApplications]);

  const loadApplicationsData = async () => {
    await loadApplications(true);
  };

  const handleOpenActionModal = (
    action: 'approve' | 'reject',
    applicationId: string,
    applicationType: 'individual' | 'group',
    applicantName: string
  ) => {
    setActionModal({
      open: true,
      action,
      applicationId,
      applicationType,
      applicantName
    });
    setRejectReason('');
  };

  const handleCloseModal = () => {
    if (!processingAction) {
      setActionModal({
        open: false,
        action: null,
        applicationId: null,
        applicationType: 'individual',
        applicantName: ''
      });
      setRejectReason('');
    }
  };

  const handleConfirmAction = async () => {
    if (!actionModal.applicationId || !actionModal.action) return;

    setProcessingAction(true);

    try {
      let success = false;

      if (actionModal.action === 'approve') {
        if (actionModal.applicationType === 'group') {
          success = await updateGroupApplicationStatus(actionModal.applicationId, 'approved');
        } else {
          success = await updateApplicationStatus(actionModal.applicationId, 'approved');
        }

        if (success) {
          toast.success(t?.toast?.approveSuccess?.[language] || 'Candidature approuvée !');
          await loadApplicationsData();
        }
      } else if (actionModal.action === 'reject') {
        if (actionModal.applicationType === 'group') {
          success = await updateGroupApplicationStatus(
            actionModal.applicationId,
            'rejected',
            rejectReason || undefined
          );
        } else {
          success = await updateApplicationStatus(
            actionModal.applicationId,
            'rejected',
            rejectReason || undefined
          );
        }

        if (success) {
          toast.success(t?.toast?.rejectSuccess?.[language] || 'Candidature rejetée');
          await loadApplicationsData();
        }
      }

      handleCloseModal();
    } catch (error) {
      toast.error(t?.toast?.actionError?.[language] || 'Erreur lors de l\'action');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleMarkReviewing = async (applicationId: string, isGroup: boolean) => {
    if (isGroup) {
      const success = await updateGroupApplicationStatus(applicationId, 'reviewing');
      if (success) {
        await loadApplicationsData();
      }
    } else {
      const success = await updateApplicationStatus(applicationId, 'reviewing');
      if (success) {
        await loadApplicationsData();
      }
    }
  };

  const getStatusBadge = (status: CombinedStatus) => {
    const config: Record<CombinedStatus, { className: string; label: string; icon: any }> = {
      pending: {
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        label: t?.status?.pending?.[language] || 'En attente',
        icon: Clock
      },
      reviewing: {
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: t?.status?.reviewing?.[language] || 'En révision',
        icon: Eye
      },
      approved: {
        className: 'bg-green-100 text-green-800 border-green-200',
        label: t?.status?.approved?.[language] || 'Approuvée',
        icon: CheckCircle
      },
      rejected: {
        className: 'bg-red-100 text-red-800 border-red-200',
        label: t?.status?.rejected?.[language] || 'Rejetée',
        icon: XCircle
      },
      withdrawn: {
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        label: t?.status?.withdrawn?.[language] || 'Retirée',
        icon: XCircle
      },
      expired: {
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        label: t?.status?.expired?.[language] || 'Expirée',
        icon: Clock
      },
    };

    const statusConfig = config[status];
    const Icon = statusConfig.icon;

    return (
      <Badge className={statusConfig.className}>
        <Icon className="w-3 h-3 mr-1" />
        {statusConfig.label}
      </Badge>
    );
  };

  const filteredIndividualApps = useMemo(() => {
    return applications.filter((app) => {
      const statusMatch = filterStatus === 'all' || app.status === filterStatus;
      const typeMatch = filterType === 'all' || filterType === 'individual';
      const propertyMatch = filterProperty === 'all' || app.property_id === filterProperty;
      return statusMatch && typeMatch && propertyMatch;
    });
  }, [applications, filterStatus, filterType, filterProperty]);

  const filteredGroupApps = useMemo(() => {
    return groupApps.filter((app) => {
      const statusMatch = filterStatus === 'all' || app.status === filterStatus;
      const typeMatch = filterType === 'all' || filterType === 'group';
      const propertyMatch = filterProperty === 'all' || app.property_id === filterProperty;
      return statusMatch && typeMatch && propertyMatch;
    });
  }, [groupApps, filterStatus, filterType, filterProperty]);

  // Calculate stats
  const stats = {
    total: applications.length + groupApps.length,
    individual: applications.length,
    groups: groupApps.length,
    pending: applications.filter((a) => a.status === 'pending').length +
             groupApps.filter((a) => a.status === 'pending').length,
    reviewing: applications.filter((a) => a.status === 'reviewing').length +
               groupApps.filter((a) => a.status === 'reviewing').length,
    approved: applications.filter((a) => a.status === 'approved').length +
              groupApps.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length +
              groupApps.filter((a) => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t?.loading?.title?.[language] || 'Chargement des candidatures...'}
          </h3>
          <p className="text-gray-600">
            {t?.loading?.subtitle?.[language] || 'Préparation de vos données'}
          </p>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-200/70 to-indigo-200/70 flex items-center justify-center shadow-sm">
                  <FileText className="w-6 h-6 text-gray-700" />
                </div>
                {t?.header?.title?.[language] || 'Candidatures'}
              </h1>
              <p className="text-gray-600">
                {t?.header?.subtitle?.[language] || 'Gérer les candidatures individuelles et de groupe pour vos propriétés'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 p-4 rounded-xl border border-purple-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <p className="text-sm text-gray-600 font-medium">{t?.stats?.total?.[language] || 'Total'}</p>
              </div>
              <p className="text-2xl font-bold text-purple-900">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 p-4 rounded-xl border border-blue-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <UserCircle className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-gray-600 font-medium">{t?.stats?.individual?.[language] || 'Individuel'}</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">{stats.individual}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-4 rounded-xl border border-purple-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-600" />
                <p className="text-sm text-gray-600 font-medium">{t?.stats?.groups?.[language] || 'Groupes'}</p>
              </div>
              <p className="text-2xl font-bold text-purple-700">{stats.groups}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-orange-50/50 to-amber-50/50 p-4 rounded-xl border border-orange-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <p className="text-sm text-gray-600 font-medium">{t?.stats?.pending?.[language] || 'En attente'}</p>
              </div>
              <p className="text-2xl font-bold text-orange-700">{stats.pending}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-4 rounded-xl border border-blue-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-gray-600 font-medium">{t?.stats?.reviewing?.[language] || 'En révision'}</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">{stats.reviewing}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 p-4 rounded-xl border border-green-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm text-gray-600 font-medium">{t?.stats?.approved?.[language] || 'Approuvées'}</p>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-red-50/50 to-pink-50/50 p-4 rounded-xl border border-red-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-gray-600 font-medium">{t?.stats?.rejected?.[language] || 'Rejetées'}</p>
              </div>
              <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="mt-6 space-y-4">
            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: t?.filters?.allTypes?.[language] || 'Tous les types', count: stats.total },
                { value: 'individual', label: t?.filters?.individual?.[language] || 'Individuel', count: stats.individual },
                { value: 'group', label: t?.filters?.groups?.[language] || 'Groupes', count: stats.groups }
              ].map((filter) => (
                <Button
                  key={filter.value}
                  variant={filterType === filter.value ? 'default' : 'outline'}
                  onClick={() => setFilterType(filter.value as typeof filterType)}
                  size="sm"
                  className={cn(
                    "rounded-full transition-all",
                    filterType === filter.value
                      ? 'bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 border-purple-300 hover:from-purple-300/70 hover:to-indigo-300/70'
                      : 'hover:border-purple-300'
                  )}
                >
                  {filter.label} ({filter.count})
                </Button>
              ))}
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: t?.filters?.allStatuses?.[language] || 'Tous les statuts' },
                { value: 'pending', label: t?.status?.pending?.[language] || 'En attente', count: stats.pending },
                { value: 'reviewing', label: t?.status?.reviewing?.[language] || 'En révision', count: stats.reviewing },
                { value: 'approved', label: t?.status?.approved?.[language] || 'Approuvées', count: stats.approved },
                { value: 'rejected', label: t?.status?.rejected?.[language] || 'Rejetées', count: stats.rejected }
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
                  {filter.label} {filter.value !== 'all' && `(${filter.count})`}
                </Button>
              ))}
            </div>

            {/* Property Filter */}
            {properties.length > 0 && (
              <div>
                <select
                  value={filterProperty}
                  onChange={(e) => setFilterProperty(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="all">{t?.filters?.allProperties?.[language] || 'Toutes les propriétés'}</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </motion.div>

        {/* Applications List */}
        {filteredIndividualApps.length === 0 && filteredGroupApps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-200"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-200/70 to-indigo-200/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FileText className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {t?.empty?.noApplications?.[language] || 'Aucune candidature trouvée'}
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              {t?.empty?.tryFilters?.[language] || 'Essayez de modifier vos filtres ou attendez de nouvelles candidatures'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Group Applications */}
            {filteredGroupApps.map((groupApp, index) => (
              <motion.div
                key={`group-${groupApp.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-l-4 border-l-purple-500 border border-gray-200 hover:shadow-md transition-all duration-300 p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Group Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-900">
                            {groupApp.group?.name || 'Groupe'}
                          </h3>
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                            {t?.card?.group?.[language] || 'Groupe'}
                          </Badge>
                          {getStatusBadge(groupApp.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">{groupApp.property?.title || 'Propriété'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Group Members */}
                    {groupApp.group?.members && groupApp.group.members.length > 0 && (
                      <div className="mb-4 p-4 bg-purple-50/50 rounded-xl border border-purple-200/30">
                        <p className="text-sm font-semibold text-gray-900 mb-3">
                          {t?.card?.members?.[language] || 'Membres'} ({groupApp.group.members.length}/{groupApp.group.max_members})
                        </p>
                        <div className="space-y-2">
                          {groupApp.group.members.map((member, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                                {member.user.full_name?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <span className="font-medium text-gray-900">{member.user.full_name}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">{member.user.email}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {groupApp.combined_income && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span>{t?.card?.combinedIncome?.[language] || 'Revenu combiné'}: <span className="font-semibold">{groupApp.combined_income.toLocaleString()}€/{t?.card?.perMonth?.[language] || 'mois'}</span></span>
                      </div>
                    )}

                    {groupApp.message && (
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{t?.card?.message?.[language] || 'Message'} :</span>
                        </div>
                        <p className="text-sm text-gray-600">{groupApp.message}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-3">
                      {t?.card?.applicationFrom?.[language] || 'Candidature du'} {new Date(groupApp.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-US')} {t?.card?.at?.[language] || 'à'}{' '}
                      {new Date(groupApp.created_at).toLocaleTimeString(language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-US')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 lg:w-48">
                    {groupApp.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => handleMarkReviewing(groupApp.id, true)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {t?.actions?.review?.[language] || 'Réviser'}
                        </Button>
                        <Button
                          className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleOpenActionModal('approve', groupApp.id, 'group', groupApp.group?.name || 'Groupe')}
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          {t?.actions?.approve?.[language] || 'Approuver'}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                          onClick={() => handleOpenActionModal('reject', groupApp.id, 'group', groupApp.group?.name || 'Groupe')}
                        >
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          {t?.actions?.reject?.[language] || 'Rejeter'}
                        </Button>
                      </>
                    )}

                    {groupApp.status === 'reviewing' && (
                      <>
                        <Button
                          className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleOpenActionModal('approve', groupApp.id, 'group', groupApp.group?.name || 'Groupe')}
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          {t?.actions?.approve?.[language] || 'Approuver'}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                          onClick={() => handleOpenActionModal('reject', groupApp.id, 'group', groupApp.group?.name || 'Groupe')}
                        >
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          {t?.actions?.reject?.[language] || 'Rejeter'}
                        </Button>
                      </>
                    )}

                    {(groupApp.status === 'approved' || groupApp.status === 'rejected') && (
                      <div className="text-sm text-gray-600 text-center lg:text-right">
                        {groupApp.status === 'approved' ? (
                          <div className="text-green-600 font-semibold">
                            <CheckCircle className="w-5 h-5 mx-auto lg:ml-auto mb-1" />
                            {t?.status?.approved?.[language] || 'Approuvée'}
                          </div>
                        ) : (
                          <div className="text-red-600 font-semibold">
                            <XCircle className="w-5 h-5 mx-auto lg:ml-auto mb-1" />
                            {t?.status?.rejected?.[language] || 'Rejetée'}
                          </div>
                        )}
                        {groupApp.reviewed_at && (
                          <p className="text-xs mt-1">
                            {new Date(groupApp.reviewed_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-US')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Individual Applications */}
            {filteredIndividualApps.map((application, index) => (
              <motion.div
                key={`individual-${application.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (filteredGroupApps.length + index) * 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Application Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                        <UserCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-900">
                            {application.applicant_name}
                          </h3>
                          {getStatusBadge(application.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">{application.property?.title || 'Propriété'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{application.applicant_email}</span>
                      </div>

                      {application.applicant_phone && (
                        <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{application.applicant_phone}</span>
                        </div>
                      )}

                      {application.occupation && (
                        <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{application.occupation}</span>
                        </div>
                      )}

                      {application.monthly_income && (
                        <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{application.monthly_income.toLocaleString()}€/mois</span>
                        </div>
                      )}

                      {application.desired_move_in_date && (
                        <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">
                            {t?.card?.moveIn?.[language] || 'Emménagement'}: {new Date(application.desired_move_in_date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-US')}
                          </span>
                        </div>
                      )}

                      {application.lease_duration_months && (
                        <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{application.lease_duration_months} {t?.card?.months?.[language] || 'mois'}</span>
                        </div>
                      )}
                    </div>

                    {application.message && (
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{t?.card?.message?.[language] || 'Message'} :</span>
                        </div>
                        <p className="text-sm text-gray-600">{application.message}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      {t?.card?.applicationFrom?.[language] || 'Candidature du'} {new Date(application.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-US')} {t?.card?.at?.[language] || 'à'}{' '}
                      {new Date(application.created_at).toLocaleTimeString(language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-US')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 lg:w-48">
                    {application.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => handleMarkReviewing(application.id, false)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {t?.actions?.review?.[language] || 'Réviser'}
                        </Button>
                        <Button
                          className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleOpenActionModal('approve', application.id, 'individual', application.applicant_name)}
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          {t?.actions?.approve?.[language] || 'Approuver'}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                          onClick={() => handleOpenActionModal('reject', application.id, 'individual', application.applicant_name)}
                        >
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          {t?.actions?.reject?.[language] || 'Rejeter'}
                        </Button>
                      </>
                    )}

                    {application.status === 'reviewing' && (
                      <>
                        <Button
                          className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleOpenActionModal('approve', application.id, 'individual', application.applicant_name)}
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          {t?.actions?.approve?.[language] || 'Approuver'}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                          onClick={() => handleOpenActionModal('reject', application.id, 'individual', application.applicant_name)}
                        >
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          {t?.actions?.reject?.[language] || 'Rejeter'}
                        </Button>
                      </>
                    )}

                    {(application.status === 'approved' || application.status === 'rejected') && (
                      <div className="text-sm text-gray-600 text-center lg:text-right">
                        {application.status === 'approved' ? (
                          <div className="text-green-600 font-semibold">
                            <CheckCircle className="w-5 h-5 mx-auto lg:ml-auto mb-1" />
                            {t?.status?.approved?.[language] || 'Approuvée'}
                          </div>
                        ) : (
                          <div className="text-red-600 font-semibold">
                            <XCircle className="w-5 h-5 mx-auto lg:ml-auto mb-1" />
                            {t?.status?.rejected?.[language] || 'Rejetée'}
                          </div>
                        )}
                        {application.reviewed_at && (
                          <p className="text-xs mt-1">
                            {new Date(application.reviewed_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-US')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Action Confirmation Modal */}
      <AnimatePresence>
        {actionModal.open && (
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
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-200"
            >
              <div className="text-center">
                {/* Icon */}
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                  actionModal.action === 'approve'
                    ? 'bg-green-100'
                    : 'bg-red-100'
                )}>
                  {actionModal.action === 'approve' ? (
                    <ThumbsUp className="w-8 h-8 text-green-600" />
                  ) : (
                    <ThumbsDown className="w-8 h-8 text-red-600" />
                  )}
                </div>

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
                    : (t?.modal?.rejectConfirm?.[language] || 'Êtes-vous sûr de vouloir rejeter la candidature de')
                  }
                </p>
                <p className="font-semibold text-gray-900 mb-4">
                  "{actionModal.applicantName}" ?
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
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={handleCloseModal}
                    disabled={processingAction}
                  >
                    {t?.modal?.cancel?.[language] || 'Annuler'}
                  </Button>
                  <Button
                    className={cn(
                      "flex-1 rounded-xl text-white",
                      actionModal.action === 'approve'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    )}
                    onClick={handleConfirmAction}
                    disabled={processingAction}
                  >
                    {processingAction ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        {t?.modal?.processing?.[language] || 'Traitement...'}
                      </>
                    ) : (
                      actionModal.action === 'approve'
                        ? (t?.actions?.approve?.[language] || 'Approuver')
                        : (t?.actions?.reject?.[language] || 'Rejeter')
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
