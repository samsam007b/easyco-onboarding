'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
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
} from 'lucide-react';
import { toast } from 'sonner';

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
    if (!confirm(t?.confirmWithdraw?.[language] || 'Êtes-vous sûr de vouloir retirer cette candidature ?')) {
      return;
    }

    const success = await withdrawApplication(applicationId);
    if (success) {
      toast.success(t?.messages?.withdrawn?.[language] || 'Candidature retirée');
      await loadApplicationsData();
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm(t?.confirmDelete?.[language] || 'Êtes-vous sûr de vouloir supprimer cette candidature de votre historique ?')) {
      return;
    }

    const success = await deleteApplication(applicationId);
    if (success) {
      toast.success(t?.messages?.deleted?.[language] || 'Candidature supprimée');
      await loadApplicationsData();
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    const config = {
      pending: { variant: 'warning' as const, icon: Clock, label: t?.status?.pending?.[language] || 'En attente' },
      reviewing: { variant: 'default' as const, icon: Eye, label: t?.status?.reviewing?.[language] || 'En cours d\'examen' },
      approved: { variant: 'success' as const, icon: CheckCircle, label: t?.status?.approved?.[language] || 'Approuvée' },
      rejected: { variant: 'default' as const, icon: XCircle, label: t?.status?.rejected?.[language] || 'Non acceptée' },
      withdrawn: { variant: 'default' as const, icon: XCircle, label: t?.status?.withdrawn?.[language] || 'Retirée' },
      expired: { variant: 'default' as const, icon: Clock, label: t?.status?.expired?.[language] || 'Expirée' },
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
      <PageContainer center>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingHouse size={64} />
            <p className="mt-4 text-gray-600">{t?.loading?.[language] || 'Chargement de vos candidatures...'}</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer center>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t?.title?.[language] || 'Mes Candidatures'}</h1>
            <p className="text-gray-600">{t?.subtitle?.[language] || 'Suis l\'état de tes candidatures'}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-orange-600">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">{t?.stats?.pending?.[language] || 'En attente'}</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">{t?.stats?.approved?.[language] || 'Approuvées'}</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">{t?.stats?.rejected?.[language] || 'Refusées'}</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('all')}
          size="sm"
          className={filterStatus === 'all' ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]' : ''}
        >
          {t?.filters?.all?.[language] || 'Toutes'} ({stats.total})
        </Button>
        <Button
          variant={filterStatus === 'pending' || filterStatus === 'reviewing' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('pending')}
          size="sm"
          className={filterStatus === 'pending' || filterStatus === 'reviewing' ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]' : ''}
        >
          {t?.filters?.pending?.[language] || 'En attente'} ({stats.pending})
        </Button>
        <Button
          variant={filterStatus === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('approved')}
          size="sm"
          className={filterStatus === 'approved' ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]' : ''}
        >
          {t?.filters?.approved?.[language] || 'Approuvées'} ({stats.approved})
        </Button>
        <Button
          variant={filterStatus === 'rejected' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('rejected')}
          size="sm"
          className={filterStatus === 'rejected' ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]' : ''}
        >
          {t?.filters?.rejected?.[language] || 'Refusées'} ({stats.rejected})
        </Button>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-3xl border-2 border-orange-100 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-orange-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-100/40 to-orange-200/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative flex flex-col items-center justify-center py-20 px-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-orange-500/30 animate-pulse">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              {filterStatus === 'all'
                ? (t?.empty?.noApplications?.[language] || 'Aucune candidature pour le moment')
                : (t?.empty?.filtered?.[language] || `Aucune candidature ${filterStatus === 'pending' ? 'en attente' : filterStatus}`)}
            </h3>
            <p className="text-lg text-gray-600 text-center max-w-md mb-8">
              {filterStatus === 'all'
                ? (t?.empty?.startExploring?.[language] || 'Commence à explorer les propriétés et postule à celles qui te plaisent')
                : (t?.empty?.tryOtherFilter?.[language] || 'Essaie de sélectionner un autre filtre')}
            </p>
            {filterStatus === 'all' && (
              <Button
                onClick={() => router.push('/properties/browse')}
                className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548] px-8 py-6 text-lg rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {t?.empty?.exploreButton?.[language] || 'Explorer les propriétés'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Left: Property Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      {/* Property Image Placeholder */}
                      <div
                        className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
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
                            className="object-cover rounded-lg"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3
                            className="text-lg font-semibold text-gray-900 hover:text-orange-600 cursor-pointer"
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
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">{t?.card?.yourMessage?.[language] || 'Ton message'}:</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{application.message}</p>
                          </div>
                        )}

                        <p className="text-xs text-gray-500 mt-3">
                          {t?.card?.appliedOn?.[language] || 'Candidature envoyée le'} {new Date(application.created_at).toLocaleDateString()}
                        </p>

                        {/* Approval/Rejection Message */}
                        {application.status === 'approved' && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <p className="text-sm font-medium text-green-800">
                                {t?.card?.approved?.message?.[language] || 'Félicitations ! Ta candidature a été approuvée.'}
                              </p>
                            </div>
                            {application.reviewed_at && (
                              <p className="text-xs text-green-700 mt-1">
                                {t?.card?.approved?.on?.[language] || 'Approuvée le'} {new Date(application.reviewed_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}

                        {application.status === 'rejected' && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <XCircle className="w-5 h-5 text-red-600" />
                              <p className="text-sm font-medium text-red-800">
                                {t?.card?.rejected?.message?.[language] || 'Ta candidature n\'a pas été acceptée.'}
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
                        className="text-orange-600 hover:text-orange-700"
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
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {t?.actions?.delete?.[language] || 'Supprimer'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
