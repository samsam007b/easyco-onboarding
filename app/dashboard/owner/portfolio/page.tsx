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
  DollarSign,
  CheckCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import {
  OwnerPageHeader,
  OwnerNavigationCard,
  OwnerNavigationGrid,
} from '@/components/owner';
import {
  ownerGradient,
  ownerGradientLight,
  ownerPageBackground,
  ownerPalette,
  semanticColors,
} from '@/lib/constants/owner-theme';
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

        {/* Bold KPIs Section - 5-color palette */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Properties - PRIMARY gradient (hero card) */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard/owner/properties')}
              className="relative overflow-hidden rounded-2xl p-5 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${ownerPalette.primary.main} 0%, ${ownerPalette.secondary.main} 100%)`,
                boxShadow: `0 8px 32px ${ownerPalette.primary.shadow}`,
              }}
            >
              {/* Decorative circles */}
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20"
                style={{ background: 'white' }}
              />
              <div
                className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full opacity-10"
                style={{ background: 'white' }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                  >
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  {overview?.properties.draft && overview.properties.draft > 0 && (
                    <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                      {overview.properties.draft} brouillon{overview.properties.draft > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {overview?.properties.total || 0}
                </p>
                <p className="text-white/80 text-sm font-medium">
                  Biens au total
                </p>
                <div className="mt-3 flex items-center gap-2 text-white/70 text-xs">
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{overview?.properties.published || 0} publiés</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Applications - TERTIARY light background */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard/owner/applications')}
              className="relative overflow-hidden rounded-2xl p-5 cursor-pointer"
              style={{
                background: ownerPalette.tertiary.light,
                border: `2px solid ${ownerPalette.tertiary.border}`,
                boxShadow: `0 4px 16px ${ownerPalette.tertiary.shadow}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: ownerPalette.tertiary.main }}
                >
                  <Users className="w-5 h-5 text-white" />
                </div>
                {overview?.applications.pending && overview.applications.pending > 0 && (
                  <span
                    className="px-2 py-1 rounded-full text-xs font-bold text-white animate-pulse"
                    style={{ background: semanticColors.warning.gradient }}
                  >
                    {overview.applications.pending} en attente
                  </span>
                )}
              </div>
              <p
                className="text-3xl font-bold mb-1"
                style={{ color: ownerPalette.tertiary.text }}
              >
                {overview?.applications.total || 0}
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: ownerPalette.tertiary.text, opacity: 0.8 }}
              >
                Candidatures
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs" style={{ color: ownerPalette.tertiary.text }}>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: semanticColors.success.text }} />
                  {overview?.applications.approved || 0} acceptées
                </span>
              </div>
            </motion.div>

            {/* Card 3: Occupancy Rate - QUATERNARY with progress */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-2xl p-5 cursor-pointer"
              style={{
                background: ownerPalette.quaternary.light,
                border: `2px solid ${ownerPalette.quaternary.border}`,
                boxShadow: `0 4px 16px ${ownerPalette.quaternary.shadow}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: ownerPalette.quaternary.main }}
                >
                  <Percent className="w-5 h-5 text-white" />
                </div>
                {(overview?.performance.occupancyRate || 0) >= 80 ? (
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ background: semanticColors.success.bg, color: semanticColors.success.text }}
                  >
                    Excellent
                  </span>
                ) : (overview?.properties.vacant || 0) > 0 ? (
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ background: semanticColors.warning.bg, color: semanticColors.warning.text }}
                  >
                    {overview?.properties.vacant} vacant{(overview?.properties.vacant || 0) > 1 ? 's' : ''}
                  </span>
                ) : null}
              </div>
              <p
                className="text-3xl font-bold mb-1"
                style={{ color: ownerPalette.quaternary.text }}
              >
                {overview?.performance.occupancyRate || 0}%
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: ownerPalette.quaternary.text, opacity: 0.8 }}
              >
                Taux d'occupation
              </p>
              {/* Progress bar */}
              <div className="mt-3">
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: ownerPalette.quaternary.border }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${overview?.performance.occupancyRate || 0}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        (overview?.performance.occupancyRate || 0) >= 80
                          ? semanticColors.success.gradient
                          : (overview?.performance.occupancyRate || 0) >= 50
                          ? semanticColors.warning.gradient
                          : semanticColors.danger.gradient,
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Card 4: Monthly Rent - ACCENT (changes based on revenue) */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard/owner/finances')}
              className="relative overflow-hidden rounded-2xl p-5 cursor-pointer"
              style={{
                background:
                  (overview?.performance.totalMonthlyRent || 0) > 0
                    ? semanticColors.success.bg
                    : ownerPalette.accent.light,
                border: `2px solid ${
                  (overview?.performance.totalMonthlyRent || 0) > 0
                    ? semanticColors.success.border
                    : ownerPalette.accent.border
                }`,
                boxShadow: `0 4px 16px ${ownerPalette.accent.shadow}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      (overview?.performance.totalMonthlyRent || 0) > 0
                        ? semanticColors.success.gradient
                        : ownerPalette.accent.main,
                  }}
                >
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    background:
                      (overview?.performance.totalMonthlyRent || 0) > 0
                        ? semanticColors.success.bg
                        : ownerPalette.accent.light,
                    color:
                      (overview?.performance.totalMonthlyRent || 0) > 0
                        ? semanticColors.success.text
                        : ownerPalette.accent.text,
                    border: `1px solid ${
                      (overview?.performance.totalMonthlyRent || 0) > 0
                        ? semanticColors.success.border
                        : ownerPalette.accent.border
                    }`,
                  }}
                >
                  /mois
                </span>
              </div>
              <p
                className="text-3xl font-bold mb-1"
                style={{
                  color:
                    (overview?.performance.totalMonthlyRent || 0) > 0
                      ? semanticColors.success.text
                      : ownerPalette.accent.text,
                }}
              >
                {(overview?.performance.totalMonthlyRent || 0).toLocaleString()}€
              </p>
              <p
                className="text-sm font-medium"
                style={{
                  color:
                    (overview?.performance.totalMonthlyRent || 0) > 0
                      ? semanticColors.success.text
                      : ownerPalette.accent.text,
                  opacity: 0.8,
                }}
              >
                Loyers mensuels
              </p>
              <div
                className="mt-3 text-xs"
                style={{
                  color:
                    (overview?.performance.totalMonthlyRent || 0) > 0
                      ? semanticColors.success.text
                      : ownerPalette.accent.text,
                }}
              >
                ~{(overview?.performance.avgRentPerProperty || 0).toLocaleString()}€ / bien
              </div>
            </motion.div>
          </div>
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

        {/* Summary Bar - Bold gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 mb-4"
        >
          <div
            className="relative overflow-hidden rounded-2xl p-5"
            style={{
              background: ownerGradient,
              boxShadow: `0 8px 32px ${ownerPalette.primary.shadow}`,
            }}
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-white blur-2xl" />
              <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-white blur-3xl" />
            </div>

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <p className="text-3xl font-bold text-white">
                  {overview?.properties.total || 0}
                </p>
                <p className="text-white/70 text-sm">Biens au total</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-white">
                  {overview?.properties.rented || 0}
                </p>
                <p className="text-white/70 text-sm">Biens loués</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-white">
                  {overview?.applications.approved || 0}
                </p>
                <p className="text-white/70 text-sm">Locataires acceptés</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-white">
                  {overview?.performance.avgRentPerProperty
                    ? `${overview.performance.avgRentPerProperty.toLocaleString()}€`
                    : '0€'}
                </p>
                <p className="text-white/70 text-sm">Loyer moyen</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
