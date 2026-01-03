'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';

// V3-FUN Palette
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_GRADIENT_SOFT = 'linear-gradient(135deg, #FFF9E6 0%, #FEF3C7 100%)';

export default function SearcherApplicationsPage() {
  const router = useRouter();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher?.applications;
  const [userId, setUserId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | Application['status']>('all');

  const { applications: hookApplications, loadApplications, withdrawApplication, deleteApplication } = useApplications(userId || undefined);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);
      await loadApplications(false); // false = as applicant
      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (hookApplications) {
      setApplications(hookApplications);
    }
  }, [hookApplications]);

  const loadApplicationsData = async () => {
    await loadApplications(false);
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
      pending: { variant: 'warning' as const, icon: Clock, label: t?.status?.pending?.[language] || 'En attente', color: 'bg-amber-100 text-amber-700' },
      reviewing: { variant: 'default' as const, icon: Eye, label: t?.status?.reviewing?.[language] || 'En cours d\'examen', color: 'bg-blue-100 text-blue-700' },
      approved: { variant: 'success' as const, icon: CheckCircle, label: t?.status?.approved?.[language] || 'Acceptée', color: 'bg-emerald-100 text-emerald-700' },
      rejected: { variant: 'default' as const, icon: XCircle, label: t?.status?.rejected?.[language] || 'Refusée', color: 'bg-red-100 text-red-700' },
      withdrawn: { variant: 'default' as const, icon: XCircle, label: t?.status?.withdrawn?.[language] || 'Retirée', color: 'bg-gray-100 text-gray-700' },
      expired: { variant: 'default' as const, icon: Clock, label: t?.status?.expired?.[language] || 'Expirée', color: 'bg-gray-100 text-gray-500' },
    };

    const { icon: Icon, label, color } = config[status];
    return (
      <Badge className={`${color} border-0 rounded-lg`}>
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/searcher">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: SEARCHER_GRADIENT }}
                  >
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  {t?.title?.[language] || 'Mes Candidatures'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {stats.total} {stats.total === 1 ? 'candidature envoyée' : 'candidatures envoyées'}
                </p>
              </div>
            </div>

            {stats.total > 0 && (
              <Button
                onClick={() => router.push('/searcher/explore')}
                className="rounded-xl text-white shadow-lg"
                style={{ background: SEARCHER_GRADIENT }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Découvrir plus
              </Button>
            )}
          </div>
        </motion.div>

        {/* Stats KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="rounded-2xl border-amber-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${SEARCHER_GRADIENT}20` }}>
                <Send className="w-6 h-6" style={{ color: '#F59E0B' }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-amber-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-100">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-emerald-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-100">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                <p className="text-sm text-gray-600">Acceptées</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-red-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Refusées</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 flex-wrap mb-6"
        >
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              onClick={() => setFilterStatus(status)}
              size="sm"
              className={`rounded-xl transition-all ${filterStatus === status ? 'text-white shadow-lg' : 'hover:border-amber-300'}`}
              style={filterStatus === status ? { background: SEARCHER_GRADIENT } : {}}
            >
              {status === 'all' && `Toutes (${stats.total})`}
              {status === 'pending' && `En attente (${stats.pending})`}
              {status === 'approved' && `Acceptées (${stats.approved})`}
              {status === 'rejected' && `Refusées (${stats.rejected})`}
            </Button>
          ))}
        </motion.div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl border-2 border-amber-100 shadow-lg"
            style={{ background: SEARCHER_GRADIENT_SOFT }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" style={{ background: SEARCHER_GRADIENT }} />
            <div className="relative flex flex-col items-center justify-center py-20 px-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                style={{ background: SEARCHER_GRADIENT }}
              >
                <FileText className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {filterStatus === 'all' ? 'Pas encore de candidatures' : `Aucune candidature ${filterStatus === 'pending' ? 'en attente' : filterStatus === 'approved' ? 'acceptée' : 'refusée'}`}
              </h3>
              <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                {filterStatus === 'all' ? 'Explorez les propriétés et postulez à celles qui vous plaisent' : 'Essayez de sélectionner un autre filtre'}
              </p>
              {filterStatus === 'all' && (
                <Button
                  onClick={() => router.push('/searcher/explore')}
                  className="text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  style={{ background: SEARCHER_GRADIENT }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Découvrir les propriétés
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
                                className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-amber-600 transition-colors"
                                onClick={() =>
                                  application.property?.id && router.push(`/properties/${application.property.id}`)
                                }
                              >
                                {application.property?.title || 'Propriété'}
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
                                    {application.property.monthly_rent.toLocaleString()}€/mois
                                  </span>
                                </div>
                              </div>
                            )}

                            {application.desired_move_in_date && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Emménagement: {new Date(application.desired_move_in_date).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            )}

                            {application.message && (
                              <div className="mt-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                                <div className="flex items-center gap-2 mb-1">
                                  <MessageSquare className="w-4 h-4 text-amber-600" />
                                  <span className="text-sm font-medium text-gray-700">Votre message:</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">{application.message}</p>
                              </div>
                            )}

                            <p className="text-xs text-gray-500 mt-3">
                              Candidature envoyée le {new Date(application.created_at).toLocaleDateString('fr-FR')}
                            </p>

                            {/* Approval Message */}
                            {application.status === 'approved' && (
                              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                                  <p className="text-sm font-medium text-emerald-800">
                                    Félicitations ! Votre candidature a été acceptée.
                                  </p>
                                </div>
                                {application.reviewed_at && (
                                  <p className="text-xs text-emerald-700 mt-1">
                                    Acceptée le {new Date(application.reviewed_at).toLocaleDateString('fr-FR')}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Rejection Message */}
                            {application.status === 'rejected' && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-center gap-2">
                                  <XCircle className="w-5 h-5 text-red-600" />
                                  <p className="text-sm font-medium text-red-800">
                                    Votre candidature n'a pas été retenue.
                                  </p>
                                </div>
                                {application.rejection_reason && (
                                  <p className="text-sm text-red-700 mt-2">
                                    Raison: {application.rejection_reason}
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
                            Voir
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
                            Retirer
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
                            Supprimer
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
      </div>
    </div>
  );
}
