'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import {
  Users,
  FileText,
  Wrench,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  UserCheck,
  ClipboardCheck,
  Send,
  Plus,
  ChevronRight,
  Target,
  Zap,
  Info,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS, nl, de, type Locale } from 'date-fns/locale';
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
  healthColors,
  semanticColors,
} from '@/lib/constants/owner-theme';
import { gestionService, type GestionOverview, type UrgentAction, type ActivityItem } from '@/lib/services/gestion-service';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function GestionHubPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.owner?.gestion;

  // Date-fns locale mapping
  const dateLocaleMap: Record<string, Locale> = { fr, en: enUS, nl, de };
  const dateLocale = dateLocaleMap[language] || fr;

  // Number locale mapping
  const numberLocaleMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', nl: 'nl-NL', de: 'de-DE' };
  const numberLocale = numberLocaleMap[language] || 'fr-FR';

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [overview, setOverview] = useState<GestionOverview | null>(null);
  const [urgentActions, setUrgentActions] = useState<UrgentAction[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [showAllActions, setShowAllActions] = useState(false);

  const loadData = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      // Fetch all data in parallel
      const [overviewData, actionsData, activityData] = await Promise.all([
        gestionService.getGestionOverview(user.id),
        gestionService.getUrgentActions(user.id),
        gestionService.getRecentActivity(user.id),
      ]);

      setOverview(overviewData);
      setUrgentActions(actionsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Failed to load gestion data:', error);
      toast.error(t?.toast?.errorLoadingData?.[language] || 'Error loading management data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Health score color
  const getHealthColor = (score: number) => {
    if (score >= 80) return healthColors.excellent;
    if (score >= 50) return healthColors.attention;
    return healthColors.critical;
  };

  // Calculate health score breakdown for visualization
  const healthBreakdown = useMemo(() => {
    if (!overview) return [];

    const items = [];
    const tenantPenalty = Math.min(overview.tenants.withIssues * 10, 30);
    const expiredPenalty = Math.min(overview.leases.expired * 15, 30);
    const expiringPenalty = Math.min(overview.leases.expiringSoon * 5, 15);
    const urgentPenalty = Math.min(overview.maintenance.urgent * 10, 20);
    const openPenalty = Math.min(overview.maintenance.open * 3, 15);

    if (tenantPenalty > 0) {
      items.push({
        label: t?.healthBreakdown?.tenantIssues?.[language] || 'Problèmes locataires',
        penalty: tenantPenalty,
        count: overview.tenants.withIssues,
        icon: Users,
        color: '#EF4444',
      });
    }
    if (expiredPenalty > 0) {
      items.push({
        label: t?.healthBreakdown?.expiredLeases?.[language] || 'Baux expirés',
        penalty: expiredPenalty,
        count: overview.leases.expired,
        icon: FileText,
        color: '#DC2626',
      });
    }
    if (expiringPenalty > 0) {
      items.push({
        label: t?.healthBreakdown?.expiringLeases?.[language] || 'Baux expirant bientôt',
        penalty: expiringPenalty,
        count: overview.leases.expiringSoon,
        icon: Clock,
        color: '#F59E0B',
      });
    }
    if (urgentPenalty > 0) {
      items.push({
        label: t?.healthBreakdown?.urgentMaintenance?.[language] || 'Maintenance urgente',
        penalty: urgentPenalty,
        count: overview.maintenance.urgent,
        icon: Wrench,
        color: '#EF4444',
      });
    }
    if (openPenalty > 0) {
      items.push({
        label: t?.healthBreakdown?.openTickets?.[language] || 'Tickets ouverts',
        penalty: openPenalty,
        count: overview.maintenance.open,
        icon: AlertTriangle,
        color: '#F97316',
      });
    }

    return items;
  }, [overview, language, t]);

  // Trend data for health score visualization
  // TODO: Replace with real historical data from a health_score_history table
  const trendData = useMemo(() => {
    // Generate last 7 days with stable variation pattern
    const baseScore = overview?.healthScore || 100;
    // Stable variation pattern simulating gradual improvement
    const variations = [-5, -3, -4, -2, 0, 1, 2];
    return Array.from({ length: 7 }, (_, i) => ({
      day: i,
      score: Math.max(0, Math.min(100, baseScore + variations[i])),
    }));
  }, [overview?.healthScore]);

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
            {t?.loading?.title?.[language] || 'Loading...'}
          </h3>
          <p className="text-gray-600">{t?.loading?.subtitle?.[language] || 'Preparing your dashboard'}</p>
        </div>
      </div>
    );
  }

  const healthStyle = overview ? getHealthColor(overview.healthScore) : healthColors.excellent;

  return (
    <div className="min-h-screen" style={{ background: ownerPageBackground }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <OwnerPageHeader
          icon={Activity}
          title={t?.header?.title?.[language] || 'Operational Management'}
          subtitle={t?.header?.subtitle?.[language] || 'Manage your portfolio daily'}
          breadcrumb={{ label: t?.header?.breadcrumb?.[language] || 'Command Center', href: '/dashboard/owner' }}
          currentPage={t?.header?.currentPage?.[language] || 'Management'}
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="rounded-full"
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', isRefreshing && 'animate-spin')} />
              {t?.header?.refresh?.[language] || 'Refresh'}
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
            {/* Card 1: Tenants - PRIMARY Solid (hero card) */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard/owner/tenants')}
              className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer"
              style={{
                background: ownerPalette.primary.main,
                boxShadow: `0 8px 32px ${ownerPalette.primary.shadow}`,
              }}
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
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  {overview?.tenants.newThisMonth && overview.tenants.newThisMonth > 0 && (
                    <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                      +{overview.tenants.newThisMonth} {t?.kpi?.thisMonth?.[language] || 'this month'}
                    </span>
                  )}
                </div>
                <p className="text-4xl font-bold text-white mb-1">
                  {overview?.tenants.active || 0}
                </p>
                <p className="text-white/80 text-sm font-medium">
                  {t?.kpi?.activeTenants?.[language] || 'Active tenants'}
                </p>
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2 text-white/70 text-xs">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{t?.kpi?.tenantsOccupying?.[language]?.replace('{count}', String(overview?.tenants.active || 0)) || `${overview?.tenants.active || 0} occupying your properties`}</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Leases - TERTIARY Solid */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard/owner/leases')}
              className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer"
              style={{
                background: ownerPalette.tertiary.main,
                boxShadow: `0 8px 32px ${ownerPalette.tertiary.shadow}`,
              }}
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
                  {overview?.leases.expiringSoon && overview.leases.expiringSoon > 0 && (
                    <span
                      className="px-2 py-1 rounded-full text-xs font-bold text-white animate-pulse"
                      style={{ background: 'rgba(255,255,255,0.3)' }}
                    >
                      {overview.leases.expiringSoon} {t?.kpi?.toRenew?.[language] || 'to renew'}
                    </span>
                  )}
                </div>
                <p className="text-4xl font-bold text-white mb-1">
                  {overview?.leases.active || 0}
                </p>
                <p className="text-white/80 text-sm font-medium">
                  {t?.kpi?.activeLeases?.[language] || 'Active leases'}
                </p>
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2 text-white/70 text-xs">
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>{t?.kpi?.currentContracts?.[language] || 'Current contracts'}</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Maintenance Tickets - White card with accent (danger when urgent) */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard/owner/maintenance')}
              className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer bg-white"
              style={{
                border: `2px solid ${(overview?.maintenance.urgent || 0) > 0 ? semanticColors.danger.border : ownerPalette.quaternary.border}`,
                boxShadow: `0 4px 16px ${ownerPalette.quaternary.shadow}`,
              }}
            >
              {/* Decorative circle */}
              <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
                style={{ background: (overview?.maintenance.urgent || 0) > 0 ? semanticColors.danger.gradient : ownerPalette.quaternary.main }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-12 h-12 superellipse-xl flex items-center justify-center"
                    style={{
                      background: (overview?.maintenance.urgent || 0) > 0
                        ? semanticColors.danger.gradient
                        : ownerPalette.quaternary.main,
                    }}
                  >
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                  {overview?.maintenance.urgent && overview.maintenance.urgent > 0 && (
                    <span
                      className="px-2 py-1 rounded-full text-xs font-bold text-white animate-pulse"
                      style={{ background: semanticColors.danger.gradient }}
                    >
                      {overview.maintenance.urgent} {t?.kpi?.urgent?.[language] || 'urgent'}
                    </span>
                  )}
                </div>
                <p
                  className="text-4xl font-bold mb-1"
                  style={{ color: (overview?.maintenance.urgent || 0) > 0 ? semanticColors.danger.text : ownerPalette.quaternary.text }}
                >
                  {(overview?.maintenance.open || 0) + (overview?.maintenance.inProgress || 0)}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  {t?.kpi?.openTickets?.[language] || 'Open tickets'}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  {overview?.maintenance.open || 0} {t?.kpi?.open?.[language] || 'open'} · {overview?.maintenance.inProgress || 0} {t?.kpi?.inProgress?.[language] || 'in progress'}
                </div>
              </div>
            </motion.div>

            {/* Card 4: Health Score - Enhanced with radial gauge */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer bg-white"
              style={{
                border: `2px solid ${healthStyle.border}`,
                boxShadow: `0 4px 16px ${ownerPalette.accent.shadow}`,
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">
                    {t?.kpi?.globalHealth?.[language] || 'Global health'}
                  </p>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: healthStyle.bg, color: healthStyle.text }}
                  >
                    {overview?.healthScore && overview.healthScore >= 80
                      ? (t?.kpi?.excellent?.[language] || 'Excellent')
                      : overview?.healthScore && overview.healthScore >= 50
                      ? (t?.kpi?.attention?.[language] || 'Attention')
                      : (t?.kpi?.urgentLabel?.[language] || 'Urgent')}
                  </span>
                </div>

                {/* Mini Radial Gauge + Score */}
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="100%"
                        barSize={6}
                        data={[{ value: overview?.healthScore || 100 }]}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <RadialBar
                          background={{ fill: healthStyle.border }}
                          dataKey="value"
                          fill={healthStyle.text}
                          cornerRadius={10}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {overview?.healthScore && overview.healthScore >= 80 ? (
                        <CheckCircle className="w-5 h-5" style={{ color: healthStyle.text }} />
                      ) : (
                        <AlertTriangle className="w-5 h-5" style={{ color: healthStyle.text }} />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold" style={{ color: healthStyle.text }}>
                      {overview?.healthScore || 100}%
                    </p>
                    {/* Mini trend indicator */}
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-12 h-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendData}>
                            <Area
                              type="monotone"
                              dataKey="score"
                              stroke={healthStyle.text}
                              fill={healthStyle.bg}
                              strokeWidth={1.5}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <span className="text-xs text-gray-500">7j</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Health Score Breakdown - Only show if there are issues */}
        {healthBreakdown.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6"
          >
            <div className="bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Target className="w-4 h-4" style={{ color: ownerPalette.accent.main }} />
                  {t?.healthBreakdown?.title?.[language] || 'Points à améliorer'}
                </h3>
                <span className="text-xs text-gray-500">
                  {t?.healthBreakdown?.impactOn?.[language] || 'Impact sur le score'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {healthBreakdown.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: `${item.color}10`, border: `1px solid ${item.color}30` }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: item.color }}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-700 truncate">{item.label}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: item.color }}>
                            -{item.penalty}%
                          </span>
                          <span className="text-xs text-gray-500">({item.count})</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Urgent Actions & Navigation */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Urgent Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: '#c2566b' }} />
                  {t?.urgentActions?.title?.[language] || 'Urgent actions'}
                </h2>
                {urgentActions.length > 4 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                    style={{ color: '#9c5698' }}
                    onClick={() => setShowAllActions(!showAllActions)}
                  >
                    {showAllActions
                      ? (t?.urgentActions?.showLess?.[language] || 'Show less')
                      : `${t?.urgentActions?.viewAll?.[language] || 'View all'} (${urgentActions.length})`}
                    <ArrowRight className={`w-4 h-4 ml-1 transition-transform ${showAllActions ? 'rotate-90' : ''}`} />
                  </Button>
                )}
              </div>

              {urgentActions.length === 0 ? (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 mx-auto superellipse-2xl flex items-center justify-center mb-4"
                    style={{ background: semanticColors.success.gradient }}
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600">{t?.urgentActions?.empty?.title?.[language] || 'No urgent actions'}</p>
                  <p className="text-sm text-gray-500 mt-1">{t?.urgentActions?.empty?.subtitle?.[language] || 'Everything is under control!'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(showAllActions ? urgentActions : urgentActions.slice(0, 4)).map((action, index) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'group p-4 superellipse-xl transition-all',
                        'hover:shadow-md',
                        action.severity === 'critical'
                          ? 'bg-red-50 border border-red-200 hover:border-red-300'
                          : action.severity === 'warning'
                          ? 'bg-amber-50 border border-amber-200 hover:border-amber-300'
                          : 'bg-blue-50 border border-blue-200 hover:border-blue-300'
                      )}
                    >
                      <div className="flex items-center gap-4">
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
                          {action.type === 'payment_overdue' && <DollarSign className="w-5 h-5 text-white" />}
                          {action.type === 'lease_expiring' && <FileText className="w-5 h-5 text-white" />}
                          {action.type === 'maintenance_urgent' && <Wrench className="w-5 h-5 text-white" />}
                          {action.type === 'tenant_leaving' && <Users className="w-5 h-5 text-white" />}
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
                            {action.propertyName && ` • ${action.propertyName}`}
                          </p>
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {action.type === 'payment_overdue' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.success(t?.toast?.reminderSent?.[language] || 'Rappel envoyé');
                              }}
                            >
                              <Send className="w-3.5 h-3.5 mr-1" />
                              {t?.quickAction?.remind?.[language] || 'Rappel'}
                            </Button>
                          )}
                          {action.type === 'maintenance_urgent' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push('/dashboard/owner/maintenance?action=assign');
                              }}
                            >
                              <Zap className="w-3.5 h-3.5 mr-1" />
                              {t?.quickAction?.assign?.[language] || 'Assigner'}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(action.href);
                            }}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Days indicator for overdue/expiring */}
                      {(action.daysOverdue || action.daysUntilExpiry !== undefined) && (
                        <div className="mt-2 pt-2 border-t border-current/10 flex items-center gap-2">
                          <Clock className="w-3 h-3 opacity-60" />
                          <span className="text-xs opacity-70">
                            {action.daysOverdue
                              ? `${action.daysOverdue} ${t?.days?.overdue?.[language] || 'jours de retard'}`
                              : action.daysUntilExpiry !== undefined && action.daysUntilExpiry > 0
                              ? `${action.daysUntilExpiry} ${t?.days?.remaining?.[language] || 'jours restants'}`
                              : action.daysUntilExpiry !== undefined && action.daysUntilExpiry <= 0
                              ? t?.days?.expired?.[language] || 'Expiré'
                              : ''}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm p-6 h-full">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5" style={{ color: '#9c5698' }} />
                {t?.recentActivity?.title?.[language] || 'Recent activity'}
              </h2>

              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">{t?.recentActivity?.empty?.[language] || 'No recent activity'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={cn(
                          'w-8 h-8 superellipse-lg flex items-center justify-center flex-shrink-0',
                          activity.type === 'payment' && 'bg-emerald-100',
                          activity.type === 'maintenance' && 'bg-blue-100',
                          activity.type === 'lease' && 'bg-purple-100',
                          activity.type === 'tenant' && 'bg-pink-100'
                        )}
                      >
                        {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-emerald-600" />}
                        {activity.type === 'maintenance' && <Wrench className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'lease' && <FileText className="w-4 h-4 text-purple-600" />}
                        {activity.type === 'tenant' && <Users className="w-4 h-4 text-pink-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {activity.description}
                          {activity.propertyName && ` • ${activity.propertyName}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: dateLocale })}
                        </p>
                      </div>
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
            {t?.quickAccess?.title?.[language] || 'Quick access'}
          </h2>

          <OwnerNavigationGrid>
            <OwnerNavigationCard
              title={t?.quickAccess?.tenants?.title?.[language] || 'Tenants'}
              description={t?.quickAccess?.tenants?.description?.[language] || 'Manage relationships with your tenants'}
              icon={Users}
              href="/dashboard/owner/tenants"
              stats={[
                { label: t?.quickAccess?.active?.[language] || 'active', value: overview?.tenants.active || 0 },
                ...(overview?.tenants.withIssues
                  ? [{ label: t?.quickAccess?.toFollow?.[language] || 'to follow', value: overview.tenants.withIssues, variant: 'warning' as const }]
                  : []),
              ]}
              badge={
                overview?.tenants.leavingSoon
                  ? { count: overview.tenants.leavingSoon, variant: 'warning' }
                  : undefined
              }
            />
            <OwnerNavigationCard
              title={t?.quickAccess?.leases?.title?.[language] || 'Leases'}
              description={t?.quickAccess?.leases?.description?.[language] || 'Track your rental contracts'}
              icon={FileText}
              href="/dashboard/owner/leases"
              stats={[
                { label: t?.quickAccess?.active?.[language] || 'active', value: overview?.leases.active || 0 },
                ...(overview?.leases.expiringSoon
                  ? [{ label: t?.quickAccess?.expiringSoon?.[language] || 'expiring soon', value: overview.leases.expiringSoon, variant: 'warning' as const }]
                  : []),
              ]}
              badge={
                overview?.leases.expired
                  ? { count: overview.leases.expired, variant: 'danger' }
                  : undefined
              }
            />
            <OwnerNavigationCard
              title={t?.quickAccess?.maintenance?.title?.[language] || 'Maintenance'}
              description={t?.quickAccess?.maintenance?.description?.[language] || 'Handle intervention requests'}
              icon={Wrench}
              href="/dashboard/owner/maintenance"
              stats={[
                { label: t?.quickAccess?.open?.[language] || 'open', value: overview?.maintenance.open || 0 },
                { label: t?.quickAccess?.inProgress?.[language] || 'in progress', value: overview?.maintenance.inProgress || 0 },
              ]}
              badge={
                overview?.maintenance.urgent
                  ? { count: overview.maintenance.urgent, variant: 'danger' }
                  : undefined
              }
            />
          </OwnerNavigationGrid>
        </motion.div>

        {/* Summary Bar - Bold gradient with trend indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 mb-4"
        >
          <div
            className="relative overflow-hidden superellipse-2xl p-5"
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
              {/* Monthly Rents with trend */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <p className="text-3xl font-bold text-white">
                    {overview?.leases.totalMonthlyRent
                      ? `${overview.leases.totalMonthlyRent.toLocaleString(numberLocale)}€`
                      : '0€'}
                  </p>
                </div>
                <p className="text-white/70 text-sm">{t?.summary?.monthlyRents?.[language] || 'Monthly rents'}</p>
                <div className="flex items-center justify-center gap-1 text-xs">
                  <span className="text-emerald-300 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    {t?.summary?.stable?.[language] || 'Stable'}
                  </span>
                </div>
              </div>

              {/* Avg Resolution with trend */}
              <div className="space-y-1">
                <p className="text-3xl font-bold text-white">
                  {overview?.maintenance.avgResolutionHours || 0}h
                </p>
                <p className="text-white/70 text-sm">{t?.summary?.avgResolutionTime?.[language] || 'Avg resolution time'}</p>
                <div className="flex items-center justify-center gap-1 text-xs">
                  {overview?.maintenance.avgResolutionHours && overview.maintenance.avgResolutionHours < 48 ? (
                    <span className="text-emerald-300 flex items-center">
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                      {t?.summary?.fast?.[language] || 'Rapide'}
                    </span>
                  ) : (
                    <span className="text-amber-300 flex items-center">
                      <Clock className="w-3 h-3 mr-0.5" />
                      {t?.summary?.toImprove?.[language] || 'À améliorer'}
                    </span>
                  )}
                </div>
              </div>

              {/* Resolved Tickets */}
              <div className="space-y-1">
                <p className="text-3xl font-bold text-white">
                  {overview?.maintenance.resolved || 0}
                </p>
                <p className="text-white/70 text-sm">{t?.summary?.resolvedTickets?.[language] || 'Resolved tickets'}</p>
                <div className="flex items-center justify-center gap-1 text-xs">
                  <span className="text-white/50">
                    {t?.summary?.thisMonth?.[language] || 'Ce mois'}
                  </span>
                </div>
              </div>

              {/* Maintenance Costs with indicator */}
              <div className="space-y-1">
                <p className="text-3xl font-bold text-white">
                  {overview?.maintenance.totalCost
                    ? `${overview.maintenance.totalCost.toLocaleString(numberLocale)}€`
                    : '0€'}
                </p>
                <p className="text-white/70 text-sm">{t?.summary?.maintenanceCosts?.[language] || 'Maintenance costs'}</p>
                <div className="flex items-center justify-center gap-1 text-xs">
                  {overview?.maintenance.totalCost && overview.maintenance.totalCost > 1000 ? (
                    <span className="text-amber-300 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-0.5" />
                      {t?.summary?.high?.[language] || 'Élevé'}
                    </span>
                  ) : (
                    <span className="text-emerald-300 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-0.5" />
                      {t?.summary?.controlled?.[language] || 'Maîtrisé'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
