'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApplications } from '@/lib/hooks/use-applications';
import { createClient } from '@/lib/auth/supabase-client';
import type { Application } from '@/lib/hooks/use-applications';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  CheckCircle,
  XCircle,
  Clock,
  Home,
  MapPin,
  Euro,
  Calendar,
  MessageSquare,
  Eye,
  Trash2,
  FileText,
  Sparkles,
  Send,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  SearcherPageHeader,
  SearcherKPICard,
  SearcherKPIGrid,
  searcherGradientVibrant,
  searcherGradientLight,
  searcherColors,
  searcherAnimations,
} from '@/components/searcher';

export default function MyApplicationsPage() {
  const router = useRouter();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher?.applications;
  const [userId, setUserId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | Application['status']>('all');

  const { applications: hookApplications, loadApplications, withdrawApplication, deleteApplication, isLoading: hookLoading } = useApplications(userId || undefined);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        await loadApplications(false); // false = as applicant
      }

      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    // Update local applications state when hook applications change
    if (hookApplications) {
      setApplications(hookApplications);
    }
  }, [hookApplications]);

  const loadApplicationsData = async () => {
    await loadApplications(false); // false = as applicant
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm(t?.confirmWithdraw?.[language] || 'Are you sure you want to withdraw this application?')) {
      return;
    }

    const success = await withdrawApplication(applicationId);
    if (success) {
      toast.success(t?.messages?.withdrawn?.[language] || 'Application withdrawn');
      await loadApplicationsData();
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm(t?.confirmDelete?.[language] || 'Are you sure you want to delete this application from your history?')) {
      return;
    }

    const success = await deleteApplication(applicationId);
    if (success) {
      toast.success(t?.messages?.deleted?.[language] || 'Application deleted');
      await loadApplicationsData();
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    const config = {
      pending: { variant: 'warning' as const, icon: Clock, label: t?.status?.pending?.[language] || 'Pending' },
      reviewing: { variant: 'default' as const, icon: Eye, label: t?.status?.reviewing?.[language] || 'Under review' },
      approved: { variant: 'success' as const, icon: CheckCircle, label: t?.status?.approved?.[language] || 'Approved' },
      rejected: { variant: 'default' as const, icon: XCircle, label: t?.status?.rejected?.[language] || 'Not accepted' },
      withdrawn: { variant: 'default' as const, icon: XCircle, label: t?.status?.withdrawn?.[language] || 'Withdrawn' },
      expired: { variant: 'default' as const, icon: Clock, label: t?.status?.expired?.[language] || 'Expired' },
    };

    const { variant, icon: Icon, label } = config[status];
    return (
      <Badge variant={variant}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const filteredApplications = applications.filter((app) =>
    filterStatus === 'all' ? true : app.status === filterStatus
  );

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending' || a.status === 'reviewing').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Chargement de vos candidatures...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          {...searcherAnimations.fadeInUp}
          className="space-y-6"
        >
          {/* Header */}
          <SearcherPageHeader
            icon={FileText}
            title={t?.title?.[language] || 'Mes Candidatures'}
            subtitle={`${stats.total} ${stats.total === 1 ? (t?.count?.singular?.[language] || 'candidature envoyée') : (t?.count?.plural?.[language] || 'candidatures envoyées')}`}
            breadcrumb={{ label: 'Accueil', href: '/dashboard/searcher' }}
            currentPage="Candidatures"
            actions={
              stats.total > 0 && (
                <Button
                  onClick={() => router.push('/properties/browse')}
                  className="rounded-2xl text-white font-semibold"
                  style={{ background: searcherGradientVibrant }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Découvrir plus
                </Button>
              )
            }
          />

          {/* Stats KPIs */}
          <SearcherKPIGrid columns={4}>
            <SearcherKPICard
              title={t?.stats?.total?.[language] || 'Total envoyées'}
              value={stats.total}
              icon={Send}
              variant="primary"
            />
            <SearcherKPICard
              title={t?.stats?.pending?.[language] || 'En attente'}
              value={stats.pending}
              icon={Clock}
              variant="warning"
            />
            <SearcherKPICard
              title={t?.stats?.approved?.[language] || 'Acceptées'}
              value={stats.approved}
              icon={CheckCircle}
              variant="success"
            />
            <SearcherKPICard
              title={t?.stats?.rejected?.[language] || 'Refusées'}
              value={stats.rejected}
              icon={XCircle}
              variant="danger"
            />
          </SearcherKPIGrid>

          {/* Filters */}
          <motion.div
            {...searcherAnimations.fadeInUp}
            className="flex gap-2 flex-wrap"
          >
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
              className={`rounded-xl transition-all ${filterStatus === 'all' ? 'text-white shadow-lg' : 'hover:border-amber-300'}`}
              style={filterStatus === 'all' ? { background: searcherGradientVibrant, boxShadow: '0 4px 12px rgba(255, 160, 64, 0.3)' } : {}}
            >
              {t?.filters?.all?.[language] || 'Toutes'} ({stats.total})
            </Button>
            <Button
              variant={filterStatus === 'pending' || filterStatus === 'reviewing' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
              size="sm"
              className={`rounded-xl transition-all ${filterStatus === 'pending' || filterStatus === 'reviewing' ? 'text-white shadow-lg' : 'hover:border-amber-300'}`}
              style={filterStatus === 'pending' || filterStatus === 'reviewing' ? { background: searcherGradientVibrant, boxShadow: '0 4px 12px rgba(255, 160, 64, 0.3)' } : {}}
            >
              {t?.filters?.pending?.[language] || 'En attente'} ({stats.pending})
            </Button>
            <Button
              variant={filterStatus === 'approved' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('approved')}
              size="sm"
              className={`rounded-xl transition-all ${filterStatus === 'approved' ? 'text-white shadow-lg' : 'hover:border-amber-300'}`}
              style={filterStatus === 'approved' ? { background: searcherGradientVibrant, boxShadow: '0 4px 12px rgba(255, 160, 64, 0.3)' } : {}}
            >
              {t?.filters?.approved?.[language] || 'Acceptées'} ({stats.approved})
            </Button>
            <Button
              variant={filterStatus === 'rejected' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('rejected')}
              size="sm"
              className={`rounded-xl transition-all ${filterStatus === 'rejected' ? 'text-white shadow-lg' : 'hover:border-amber-300'}`}
              style={filterStatus === 'rejected' ? { background: searcherGradientVibrant, boxShadow: '0 4px 12px rgba(255, 160, 64, 0.3)' } : {}}
            >
              {t?.filters?.rejected?.[language] || 'Refusées'} ({stats.rejected})
            </Button>
          </motion.div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <motion.div
              {...searcherAnimations.cardHover}
              className="relative overflow-hidden rounded-3xl border-2 border-amber-100 shadow-lg"
              style={{ background: searcherGradientLight }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" style={{ background: searcherGradientVibrant }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 opacity-10" style={{ background: searcherGradientVibrant }} />

              <div className="relative flex flex-col items-center justify-center py-20 px-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                  style={{ background: searcherGradientVibrant, boxShadow: '0 12px 32px rgba(255, 140, 32, 0.3)' }}
                >
                  <FileText className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {filterStatus === 'all'
                    ? (t?.empty?.noApplications?.[language] || 'Pas encore de candidatures')
                    : (t?.empty?.filtered?.[language] || `Aucune candidature ${filterStatus === 'pending' ? 'en attente' : filterStatus === 'approved' ? 'acceptée' : 'refusée'}`)}
                </h3>
                <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                  {filterStatus === 'all'
                    ? (t?.empty?.startExploring?.[language] || 'Explorez les propriétés et postulez à celles qui vous plaisent')
                    : (t?.empty?.tryOtherFilter?.[language] || 'Essayez de sélectionner un autre filtre')}
                </p>
                {filterStatus === 'all' && (
                  <Button
                    onClick={() => router.push('/properties/browse')}
                    className="text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    style={{ background: searcherGradientVibrant, boxShadow: '0 8px 24px rgba(255, 140, 32, 0.3)' }}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t?.empty?.exploreButton?.[language] || 'Découvrir les propriétés'}
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
              }}
              className="space-y-4"
            >
              {filteredApplications.map((application) => (
                <motion.div
                  key={application.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Card className="hover:shadow-lg transition-all border-gray-200 hover:border-amber-200 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        {/* Left: Property Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            {/* Property Image Placeholder */}
                            <div
                              className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                              onClick={() =>
                                application.property?.id && router.push(`/properties/${application.property.id}`)
                              }
                            >
                              {application.property?.main_image ? (
                                <Image
                                  src={application.property.main_image}
                                  alt={application.property.title || 'Property'}
                                  width={96}
                                  height={96}
                                  sizes="96px"
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Home className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3
                                  className="text-lg font-semibold text-gray-900 cursor-pointer transition-colors"
                                  style={{ ['--tw-text-opacity' as string]: 1 }}
                                  onMouseEnter={(e) => e.currentTarget.style.color = searcherColors.primary}
                                  onMouseLeave={(e) => e.currentTarget.style.color = '#111827'}
                                  onClick={() =>
                                    application.property?.id && router.push(`/properties/${application.property.id}`)
                                  }
                                >
                                  {application.property?.title || 'Property'}
                                </h3>
                                {getStatusBadge(application.status)}
                              </div>

                              {application.property && (
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>
                                      {application.property.city}, {application.property.postal_code}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <Euro className="w-4 h-4" />
                                    <span className="font-semibold">
                                      €{application.property.monthly_rent.toLocaleString()}/{t?.card?.month?.[language] || 'mois'}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {application.desired_move_in_date && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {t?.card?.moveIn?.[language] || 'Emménagement'}: {new Date(application.desired_move_in_date).toLocaleDateString()}
                                  </span>
                                </div>
                              )}

                              {application.message && (
                                <div className="mt-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                                  <div className="flex items-center gap-2 mb-1">
                                    <MessageSquare className="w-4 h-4 text-amber-600" />
                                    <span className="text-sm font-medium text-gray-700">{t?.card?.yourMessage?.[language] || 'Votre message'}:</span>
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-2">{application.message}</p>
                                </div>
                              )}

                              <p className="text-xs text-gray-500 mt-3">
                                {t?.card?.appliedOn?.[language] || 'Candidature envoyée le'} {new Date(application.created_at).toLocaleDateString()}
                              </p>

                              {/* Approval/Rejection Message */}
                              {application.status === 'approved' && (
                                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    <p className="text-sm font-medium text-emerald-800">
                                      {t?.card?.approved?.message?.[language] || 'Félicitations ! Votre candidature a été acceptée.'}
                                    </p>
                                  </div>
                                  {application.reviewed_at && (
                                    <p className="text-xs text-emerald-700 mt-1">
                                      {t?.card?.approved?.on?.[language] || 'Acceptée le'} {new Date(application.reviewed_at).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              )}

                              {application.status === 'rejected' && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                                  <div className="flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    <p className="text-sm font-medium text-red-800">
                                      {t?.card?.rejected?.message?.[language] || 'Votre candidature n\'a pas été retenue.'}
                                    </p>
                                  </div>
                                  {application.rejection_reason && (
                                    <p className="text-sm text-red-700 mt-2">
                                      {t?.card?.rejected?.reason?.[language] || 'Raison'}: {application.rejection_reason}
                                    </p>
                                  )}
                                  {application.reviewed_at && (
                                    <p className="text-xs text-red-700 mt-1">
                                      {t?.card?.rejected?.on?.[language] || 'Examinée le'} {new Date(application.reviewed_at).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex md:flex-col gap-2">
                          {application.property?.id && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/properties/${application.property.id}`)}
                              className="rounded-xl"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              {t?.actions?.viewProperty?.[language] || 'Voir la propriété'}
                            </Button>
                          )}

                          {(application.status === 'pending' || application.status === 'reviewing') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWithdraw(application.id)}
                              className="text-amber-600 hover:text-amber-700 hover:border-amber-300 rounded-xl"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              {t?.actions?.withdraw?.[language] || 'Retirer'}
                            </Button>
                          )}

                          {(application.status === 'rejected' || application.status === 'withdrawn') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(application.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300 rounded-xl"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              {t?.actions?.delete?.[language] || 'Supprimer'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
