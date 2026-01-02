'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import {
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  RefreshCw,
  Home,
  Eye,
  MessageSquare,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  FileEdit,
  Clock,
  Percent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import {
  OwnerPageHeader,
  OwnerKPICard,
  OwnerKPIGrid,
  OwnerNavigationCard,
  OwnerNavigationGrid,
} from '@/components/owner';
import { ownerGradient, ownerGradientLight, ownerPageBackground, semanticColors } from '@/lib/constants/owner-theme';
import {
  portfolioService,
  type PortfolioOverview,
  type PortfolioAction,
  type PropertyPreview,
} from '@/lib/services/portfolio-service';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function PortfolioHubPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [overview, setOverview] = useState<PortfolioOverview | null>(null);
  const [actions, setActions] = useState<PortfolioAction[]>([]);
  const [recentProperties, setRecentProperties] = useState<PropertyPreview[]>([]);

  const loadData = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch all data in parallel
      const [overviewData, actionsData, propertiesData] = await Promise.all([
        portfolioService.getPortfolioOverview(user.id),
        portfolioService.getPortfolioActions(user.id),
        portfolioService.getRecentProperties(user.id, 3),
      ]);

      setOverview(overviewData);
      setActions(actionsData);
      setRecentProperties(propertiesData);
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
      toast.error('Erreur lors du chargement des données du portfolio');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get action icon
  const getActionIcon = (type: PortfolioAction['type']) => {
    switch (type) {
      case 'application_pending':
        return Users;
      case 'application_new':
        return MessageSquare;
      case 'property_draft':
        return FileEdit;
      case 'property_vacant':
        return Home;
      default:
        return AlertTriangle;
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
            Loading...
          </h3>
          <p className="text-gray-600">Preparing your portfolio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: ownerPageBackground }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <OwnerPageHeader
          icon={Briefcase}
          title="Portfolio Immobilier"
          subtitle="Votre patrimoine en un coup d'œil"
          breadcrumb={{ label: 'Command Center', href: '/dashboard/owner' }}
          currentPage="Portfolio"
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="rounded-full"
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', isRefreshing && 'animate-spin')} />
              Actualiser
            </Button>
          }
        />

        {/* KPIs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <OwnerKPIGrid columns={4}>
            <OwnerKPICard
              title="Biens"
              value={overview?.properties.total || 0}
              icon={Building2}
              variant="primary"
              subtext={
                overview?.properties.published
                  ? `${overview.properties.published} publiés`
                  : undefined
              }
              onClick={() => router.push('/dashboard/owner/properties')}
            />
            <OwnerKPICard
              title="Candidatures"
              value={overview?.applications.total || 0}
              icon={Users}
              variant={overview?.applications.pending ? 'warning' : 'info'}
              badge={
                overview?.applications.pending
                  ? { label: `${overview.applications.pending} en attente`, variant: 'warning' }
                  : undefined
              }
              onClick={() => router.push('/dashboard/owner/applications')}
            />
            <OwnerKPICard
              title="Taux d'occupation"
              value={`${overview?.performance.occupancyRate || 0}%`}
              icon={Percent}
              variant={
                (overview?.performance.occupancyRate || 0) >= 80
                  ? 'success'
                  : (overview?.performance.occupancyRate || 0) >= 50
                  ? 'warning'
                  : 'danger'
              }
              subtext={
                overview?.properties.vacant
                  ? `${overview.properties.vacant} vacant${overview.properties.vacant > 1 ? 's' : ''}`
                  : 'Tout loué'
              }
            />
            <OwnerKPICard
              title="Loyers mensuels"
              value={`${(overview?.performance.totalMonthlyRent || 0).toLocaleString()}€`}
              icon={TrendingUp}
              variant="success"
              subtext={
                overview?.performance.avgRentPerProperty
                  ? `~${overview.performance.avgRentPerProperty.toLocaleString()}€/bien`
                  : undefined
              }
              onClick={() => router.push('/dashboard/owner/finance')}
            />
          </OwnerKPIGrid>
        </motion.div>

        {/* Actions Required & Recent Properties */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Actions Required */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: '#c2566b' }} />
                  Actions requises
                </h2>
                {actions.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                    style={{ color: '#9c5698' }}
                  >
                    Voir tout ({actions.length})
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>

              {actions.length === 0 ? (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: semanticColors.success.gradient }}
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600">Aucune action requise</p>
                  <p className="text-sm text-gray-500 mt-1">Tout est sous contrôle !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {actions.slice(0, 4).map((action, index) => {
                    const ActionIcon = getActionIcon(action.type);
                    return (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => router.push(action.href)}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all',
                          'hover:shadow-md',
                          action.severity === 'critical'
                            ? 'bg-red-50 border border-red-200 hover:border-red-300'
                            : action.severity === 'warning'
                            ? 'bg-amber-50 border border-amber-200 hover:border-amber-300'
                            : 'bg-blue-50 border border-blue-200 hover:border-blue-300'
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background:
                              action.severity === 'critical'
                                ? semanticColors.danger.gradient
                                : action.severity === 'warning'
                                ? semanticColors.warning.gradient
                                : semanticColors.info.gradient,
                          }}
                        >
                          <ActionIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              'font-semibold truncate',
                              action.severity === 'critical'
                                ? 'text-red-800'
                                : action.severity === 'warning'
                                ? 'text-amber-800'
                                : 'text-blue-800'
                            )}
                          >
                            {action.title}
                          </p>
                          <p
                            className={cn(
                              'text-sm truncate',
                              action.severity === 'critical'
                                ? 'text-red-600'
                                : action.severity === 'warning'
                                ? 'text-amber-600'
                                : 'text-blue-600'
                            )}
                          >
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Properties Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Home className="w-5 h-5" style={{ color: '#9c5698' }} />
                  Derniers biens
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard/owner/properties')}
                  className="text-sm"
                  style={{ color: '#9c5698' }}
                >
                  Voir tous
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {recentProperties.length === 0 ? (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 opacity-50"
                    style={{ background: ownerGradient }}
                  >
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-500 text-sm">Aucun bien pour le moment</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => router.push('/properties/add')}
                  >
                    Ajouter un bien
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => router.push(`/properties/${property.id}`)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all"
                    >
                      {/* Property Image or Placeholder */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                        {property.mainImage ? (
                          <img
                            src={property.mainImage}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: ownerGradient }}
                          >
                            <Home className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Property Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {property.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {property.city} · {property.bedrooms} ch · {property.monthlyRent.toLocaleString()}€
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {/* Status Badge */}
                          <span
                            className={cn(
                              'px-2 py-0.5 text-[10px] font-medium rounded-full',
                              property.isRented
                                ? 'bg-emerald-100 text-emerald-700'
                                : property.status === 'published'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-600'
                            )}
                          >
                            {property.isRented
                              ? 'Loué'
                              : property.status === 'published'
                              ? 'Vacant'
                              : property.status === 'draft'
                              ? 'Brouillon'
                              : 'Archivé'}
                          </span>
                          {/* Stats */}
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Eye className="w-3 h-3" />
                            {property.views}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <MessageSquare className="w-3 h-3" />
                            {property.inquiries}
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: '#9c5698' }} />
            Accès rapide
          </h2>

          <OwnerNavigationGrid>
            <OwnerNavigationCard
              title="Propriétés"
              description="Gérez votre parc immobilier"
              icon={Building2}
              href="/dashboard/owner/properties"
              stats={[
                { label: 'publiés', value: overview?.properties.published || 0 },
                ...(overview?.properties.draft
                  ? [{ label: 'brouillons', value: overview.properties.draft, variant: 'warning' as const }]
                  : []),
              ]}
              badge={
                overview?.properties.vacant
                  ? { count: overview.properties.vacant, variant: 'warning' }
                  : undefined
              }
            />
            <OwnerNavigationCard
              title="Candidatures"
              description="Évaluez les candidats pour vos biens"
              icon={Users}
              href="/dashboard/owner/applications"
              stats={[
                { label: 'total', value: overview?.applications.total || 0 },
                ...(overview?.applications.pending
                  ? [{ label: 'en attente', value: overview.applications.pending, variant: 'warning' as const }]
                  : []),
              ]}
              badge={
                overview?.applications.pending && overview.applications.pending >= 5
                  ? { count: overview.applications.pending, variant: 'danger' }
                  : undefined
              }
            />
            <OwnerNavigationCard
              title="Performance"
              description="Analysez la rentabilité de votre portfolio"
              icon={TrendingUp}
              href="/dashboard/owner/finance"
              stats={[
                { label: 'vues totales', value: overview?.performance.totalViews || 0 },
                { label: 'demandes', value: overview?.performance.totalInquiries || 0 },
              ]}
            />
          </OwnerNavigationGrid>
        </motion.div>

        {/* Quick Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 mb-4"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold" style={{ color: '#9c5698' }}>
                  {overview?.properties.total || 0}
                </p>
                <p className="text-xs text-gray-500">Biens au total</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#059669' }}>
                  {overview?.properties.rented || 0}
                </p>
                <p className="text-xs text-gray-500">Biens loués</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {overview?.applications.approved || 0}
                </p>
                <p className="text-xs text-gray-500">Candidats acceptés</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#9c5698' }}>
                  {overview?.performance.avgRentPerProperty
                    ? `${overview.performance.avgRentPerProperty.toLocaleString()}€`
                    : '0€'}
                </p>
                <p className="text-xs text-gray-500">Loyer moyen</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
