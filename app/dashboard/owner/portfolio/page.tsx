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
import { useLanguage } from '@/lib/i18n/use-language';

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
  const { language, getSection } = useLanguage();
  const t = getSection('ownerPortfolio');

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
      toast.error(t?.errorLoading?.[language] || 'Error loading portfolio data');
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
            {t?.loading?.[language] || 'Loading...'}
          </h3>
          <p className="text-gray-600">{t?.preparingPortfolio?.[language] || 'Preparing your portfolio'}</p>
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
          title={t?.pageTitle?.[language] || 'Real Estate Portfolio'}
          subtitle={t?.pageSubtitle?.[language] || 'Your properties at a glance'}
          breadcrumb={{ label: t?.commandCenter?.[language] || 'Command Center', href: '/dashboard/owner' }}
          currentPage={t?.portfolio?.[language] || 'Portfolio'}
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="rounded-full"
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', isRefreshing && 'animate-spin')} />
              {t?.refresh?.[language] || 'Refresh'}
            </Button>
          }
        />

        {/* KPIs Section - Individual colors like resident Finance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Properties - PRIMARY solid color */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard/owner/properties')}
              className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer"
              style={{
                background: ownerPalette.primary.main,
                boxShadow: `0 8px 32px ${ownerPalette.primary.shadow}`,
              }}
            >
              {/* Decorative circle */}
              <div
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-15"
                style={{ background: 'white' }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-11 h-11 superellipse-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                  >
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  {overview?.properties.draft && overview.properties.draft > 0 && (
                    <span className="px-2.5 py-1 bg-white/25 rounded-full text-xs font-semibold text-white">
                      {overview.properties.draft}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {overview?.properties.total || 0}
                </p>
                <p className="text-white/90 text-sm font-medium">
                  {t?.totalProperties?.[language] || 'Total properties'}
                </p>
                <div className="mt-3 flex items-center gap-2 text-white/70 text-xs">
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{overview?.properties.published || 0} {t?.published?.[language] || 'published'}</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Applications - TERTIARY solid color */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard/owner/applications')}
              className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer"
              style={{
                background: ownerPalette.tertiary.main,
                boxShadow: `0 8px 32px ${ownerPalette.tertiary.shadow}`,
              }}
            >
              {/* Decorative circle */}
              <div
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-15"
                style={{ background: 'white' }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-11 h-11 superellipse-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                  >
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  {overview?.applications.pending && overview.applications.pending > 0 && (
                    <span className="px-2.5 py-1 bg-white/25 rounded-full text-xs font-semibold text-white">
                      {overview.applications.pending}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {overview?.applications.total || 0}
                </p>
                <p className="text-white/90 text-sm font-medium">
                  {t?.applications?.[language] || 'Applications'}
                </p>
                <div className="mt-3 flex items-center gap-2 text-white/70 text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{overview?.applications.approved || 0} {t?.approved?.[language] || 'approved'}</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Occupancy Rate - White card with progress bar */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer bg-white"
              style={{
                border: `1px solid ${ownerPalette.quaternary.border}`,
                boxShadow: `0 4px 16px rgba(0,0,0,0.06)`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-11 h-11 superellipse-xl flex items-center justify-center"
                  style={{ background: ownerPalette.quaternary.main }}
                >
                  <Percent className="w-6 h-6 text-white" />
                </div>
                {(overview?.performance.occupancyRate || 0) >= 80 ? (
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: semanticColors.success.bg, color: semanticColors.success.text }}
                  >
                    {t?.excellent?.[language] || 'Excellent'}
                  </span>
                ) : (overview?.properties.vacant || 0) > 0 ? (
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: semanticColors.warning.bg, color: semanticColors.warning.text }}
                  >
                    {overview?.properties.vacant} {(overview?.properties.vacant || 0) > 1 ? (t?.vacants?.[language] || 'vacant') : (t?.vacant?.[language] || 'vacant')}
                  </span>
                ) : null}
              </div>
              <p
                className="text-3xl font-bold mb-1"
                style={{ color: ownerPalette.quaternary.text }}
              >
                {overview?.performance.occupancyRate || 0}%
              </p>
              <p className="text-gray-600 text-sm font-medium">
                {t?.occupancyRate?.[language] || 'Occupancy rate'}
              </p>
              {/* Progress bar */}
              <div className="mt-3">
                <div className="h-2.5 rounded-full overflow-hidden bg-gray-100">
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

            {/* Card 4: Monthly Rent - White card with green accent */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard/owner/finances')}
              className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer bg-white"
              style={{
                border: `1px solid ${semanticColors.success.border}`,
                boxShadow: `0 4px 16px rgba(0,0,0,0.06)`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-11 h-11 superellipse-xl flex items-center justify-center"
                  style={{ background: semanticColors.success.gradient }}
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: semanticColors.success.bg, color: semanticColors.success.text }}
                >
                  {t?.perMonth?.[language] || '/month'}
                </span>
              </div>
              <p
                className="text-3xl font-bold mb-1"
                style={{ color: semanticColors.success.text }}
              >
                {(overview?.performance.totalMonthlyRent || 0).toLocaleString()}€
              </p>
              <p className="text-gray-600 text-sm font-medium">
                {t?.monthlyRent?.[language] || 'Monthly rent'}
              </p>
              <div className="mt-3 text-xs text-gray-500">
                ~{(overview?.performance.avgRentPerProperty || 0).toLocaleString()}€ {t?.perProperty?.[language] || '/ property'}
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
            <div className="bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: '#c2566b' }} />
                  {t?.actionsRequired?.[language] || 'Actions required'}
                </h2>
                {actions.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                    style={{ color: '#9c5698' }}
                  >
                    {t?.viewAll?.[language] || 'View all'} ({actions.length})
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>

              {actions.length === 0 ? (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 mx-auto superellipse-2xl flex items-center justify-center mb-4"
                    style={{ background: semanticColors.success.gradient }}
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600">{t?.noActionsRequired?.[language] || 'No actions required'}</p>
                  <p className="text-sm text-gray-500 mt-1">{t?.allUnderControl?.[language] || 'Everything is under control!'}</p>
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
                          'flex items-center gap-4 p-4 superellipse-xl cursor-pointer transition-all',
                          'hover:shadow-md',
                          action.severity === 'critical'
                            ? 'bg-red-50 border border-red-200 hover:border-red-300'
                            : action.severity === 'warning'
                            ? 'bg-amber-50 border border-amber-200 hover:border-amber-300'
                            : 'bg-blue-50 border border-blue-200 hover:border-blue-300'
                        )}
                      >
                        <div
                          className="w-10 h-10 superellipse-lg flex items-center justify-center flex-shrink-0"
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
            <div className="bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Home className="w-5 h-5" style={{ color: '#9c5698' }} />
                  {t?.recentProperties?.[language] || 'Recent properties'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard/owner/properties')}
                  className="text-sm"
                  style={{ color: '#9c5698' }}
                >
                  {t?.viewAllProperties?.[language] || 'View all'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {recentProperties.length === 0 ? (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 mx-auto superellipse-2xl flex items-center justify-center mb-4 opacity-50"
                    style={{ background: ownerGradient }}
                  >
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-500 text-sm">{t?.noPropertiesYet?.[language] || 'No properties yet'}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => router.push('/properties/add')}
                  >
                    {t?.addProperty?.[language] || 'Add property'}
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
                      className="flex items-center gap-3 p-3 superellipse-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all"
                    >
                      {/* Property Image or Placeholder */}
                      <div className="w-14 h-14 superellipse-lg overflow-hidden flex-shrink-0 bg-gray-200">
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
                          {property.city} · {property.bedrooms} {t?.bedrooms?.[language] || 'bd'} · {property.monthlyRent.toLocaleString()}€
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
                              ? (t?.rented?.[language] || 'Rented')
                              : property.status === 'published'
                              ? (t?.vacant?.[language] || 'Vacant')
                              : property.status === 'draft'
                              ? (t?.draft?.[language] || 'Draft')
                              : (t?.archived?.[language] || 'Archived')}
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
            {t?.quickAccess?.[language] || 'Quick access'}
          </h2>

          <OwnerNavigationGrid>
            <OwnerNavigationCard
              title={t?.properties?.[language] || 'Properties'}
              description={t?.managePortfolio?.[language] || 'Manage your real estate portfolio'}
              icon={Building2}
              href="/dashboard/owner/properties"
              stats={[
                { label: t?.published?.[language] || 'published', value: overview?.properties.published || 0 },
                ...(overview?.properties.draft
                  ? [{ label: t?.drafts?.[language] || 'drafts', value: overview.properties.draft, variant: 'warning' as const }]
                  : []),
              ]}
              badge={
                overview?.properties.vacant
                  ? { count: overview.properties.vacant, variant: 'warning' }
                  : undefined
              }
            />
            <OwnerNavigationCard
              title={t?.applications?.[language] || 'Applications'}
              description={t?.evaluateCandidates?.[language] || 'Evaluate candidates for your properties'}
              icon={Users}
              href="/dashboard/owner/applications"
              stats={[
                { label: t?.total?.[language] || 'total', value: overview?.applications.total || 0 },
                ...(overview?.applications.pending
                  ? [{ label: t?.pending?.[language] || 'pending', value: overview.applications.pending, variant: 'warning' as const }]
                  : []),
              ]}
              badge={
                overview?.applications.pending && overview.applications.pending >= 5
                  ? { count: overview.applications.pending, variant: 'danger' }
                  : undefined
              }
            />
            <OwnerNavigationCard
              title={t?.performance?.[language] || 'Performance'}
              description={t?.analyzePortfolio?.[language] || 'Analyze your portfolio profitability'}
              icon={TrendingUp}
              href="/dashboard/owner/finance"
              stats={[
                { label: t?.totalViews?.[language] || 'total views', value: overview?.performance.totalViews || 0 },
                { label: t?.requests?.[language] || 'requests', value: overview?.performance.totalInquiries || 0 },
              ]}
            />
          </OwnerNavigationGrid>
        </motion.div>

        {/* Summary Bar - Subtle white with colored stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 mb-4"
        >
          <div
            className="superellipse-2xl p-5 bg-white border"
            style={{ borderColor: ownerPalette.primary.border }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-1">
                <p
                  className="text-3xl font-bold"
                  style={{ color: ownerPalette.primary.main }}
                >
                  {overview?.properties.total || 0}
                </p>
                <p className="text-gray-500 text-sm">{t?.totalProperties?.[language] || 'Total properties'}</p>
              </div>
              <div className="text-center space-y-1">
                <p
                  className="text-3xl font-bold"
                  style={{ color: ownerPalette.tertiary.main }}
                >
                  {overview?.properties.rented || 0}
                </p>
                <p className="text-gray-500 text-sm">{t?.rentedProperties?.[language] || 'Rented properties'}</p>
              </div>
              <div className="text-center space-y-1">
                <p
                  className="text-3xl font-bold"
                  style={{ color: ownerPalette.quaternary.main }}
                >
                  {overview?.applications.approved || 0}
                </p>
                <p className="text-gray-500 text-sm">{t?.acceptedTenants?.[language] || 'Accepted tenants'}</p>
              </div>
              <div className="text-center space-y-1">
                <p
                  className="text-3xl font-bold"
                  style={{ color: semanticColors.success.text }}
                >
                  {overview?.performance.avgRentPerProperty
                    ? `${overview.performance.avgRentPerProperty.toLocaleString()}€`
                    : '0€'}
                </p>
                <p className="text-gray-500 text-sm">{t?.averageRent?.[language] || 'Average rent'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
