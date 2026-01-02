'use client';

/**
 * Owner Finances Hub - BOLD V2 Design
 * Each KPI card has a distinct visible color from the 5-color palette
 * NO generic white cards - real colors for visual impact
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Percent,
  BarChart3,
  AlertCircle,
  Home,
  BadgeEuro,
  PiggyBank,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ownerGradient,
  ownerGradientLight,
  ownerPageBackground,
  ownerPalette,
  ownerColors,
  semanticColors,
} from '@/lib/constants/owner-theme';
import {
  financesService,
  type FinancesOverview,
  type FinanceAlert,
} from '@/lib/services/finances-service';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
  },
};

export default function FinancesHubPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.owner?.finances;

  // Number locale mapping for currency formatting
  const numberLocaleMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', nl: 'nl-NL', de: 'de-DE' };
  const numberLocale = numberLocaleMap[language] || 'fr-FR';

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [overview, setOverview] = useState<FinancesOverview | null>(null);
  const [comparison, setComparison] = useState<{
    currentMonth: { collected: number; expected: number };
    previousMonth: { collected: number; expected: number };
    changePercent: number;
  } | null>(null);

  const loadData = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const [overviewData, comparisonData] = await Promise.all([
        financesService.getFinancesOverview(user.id),
        financesService.getMonthlyComparison(user.id),
      ]);

      setOverview(overviewData);
      setComparison(comparisonData);
    } catch (error) {
      console.error('Failed to load finances data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getAlertIcon = (type: FinanceAlert['type']) => {
    switch (type) {
      case 'overdue': return AlertCircle;
      case 'upcoming_due': return Clock;
      case 'collection_low': return TrendingDown;
      case 'vacant_property': return Home;
      default: return AlertTriangle;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(numberLocale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t?.loading?.title?.[language] || 'Loading...'}</h3>
          <p className="text-gray-600">{t?.loading?.subtitle?.[language] || 'Analyzing your finances'}</p>
        </div>
      </div>
    );
  }

  const collectionRate = overview?.kpis.collectionRate || 100;

  return (
    <div className="min-h-screen" style={{ background: ownerPageBackground }}>
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
      >
        {/* Header - Clean and minimal */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
              style={{ background: ownerGradient }}
            >
              <Wallet className="w-7 h-7 text-white" />
              <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t?.header?.title?.[language] || 'Finances'}</h1>
              <p className="text-gray-500 text-sm">{t?.header?.subtitle?.[language] || 'Overview of your income'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="rounded-full border-gray-300"
          >
            <RefreshCw className={cn('w-4 h-4 mr-2', isRefreshing && 'animate-spin')} />
            {t?.header?.refresh?.[language] || 'Refresh'}
          </Button>
        </motion.div>

        {/* BOLD KPI Cards - Each with distinct visible color */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Revenue - PRIMARY color (mauve) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/dashboard/owner/finance')}
            className="cursor-pointer rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${ownerPalette.primary.main} 0%, ${ownerPalette.secondary.main} 100%)`,
              boxShadow: `0 8px 32px ${ownerPalette.primary.shadow}`,
            }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -mr-8 -mt-8" />
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 -ml-4 -mb-4" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 text-sm font-medium">{t?.kpi?.monthlyRevenue?.[language] || 'Monthly revenue'}</span>
                <BadgeEuro className="w-5 h-5 text-white/60" />
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {formatCurrency(overview?.kpis.monthlyRevenue || 0)}
              </p>
              <div className="flex items-center gap-1">
                {comparison?.changePercent !== 0 && comparison?.changePercent !== undefined ? (
                  <>
                    {comparison.changePercent > 0 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-300" />
                    )}
                    <span className={cn(
                      'text-sm font-medium',
                      comparison.changePercent > 0 ? 'text-emerald-300' : 'text-red-300'
                    )}>
                      {comparison.changePercent > 0 ? '+' : ''}{comparison.changePercent}%
                    </span>
                  </>
                ) : (
                  <span className="text-white/60 text-sm">{t?.kpi?.stable?.[language] || 'Stable'}</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Card 2: Pending - TERTIARY color (rose) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/dashboard/owner/finance')}
            className="cursor-pointer rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: ownerPalette.tertiary.light,
              border: `2px solid ${ownerPalette.tertiary.border}`,
            }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-6 -mt-6"
              style={{ background: `${ownerPalette.tertiary.main}15` }} />
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: ownerPalette.tertiary.text }} className="text-sm font-medium">
                {t?.kpi?.pending?.[language] || 'Pending'}
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: ownerPalette.tertiary.main }}
              >
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(overview?.kpis.pendingPayments || 0)}
            </p>
            {(overview?.paymentSummary.pendingCount || 0) > 0 ? (
              <span
                className="text-sm font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: `${ownerPalette.tertiary.main}20`,
                  color: ownerPalette.tertiary.text,
                }}
              >
                {overview?.paymentSummary.pendingCount} {t?.kpi?.payments?.[language] || 'payment(s)'}
              </span>
            ) : (
              <span className="text-sm text-gray-500">{t?.kpi?.nonePending?.[language] || 'None pending'}</span>
            )}
          </motion.div>

          {/* Card 3: Overdue - ACCENT color (coral/danger) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/dashboard/owner/finance')}
            className="cursor-pointer rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: (overview?.kpis.overdueAmount || 0) > 0
                ? `linear-gradient(135deg, ${ownerPalette.accent.main} 0%, #d63a52 100%)`
                : semanticColors.success.bg,
              border: (overview?.kpis.overdueAmount || 0) > 0 ? 'none' : `2px solid ${semanticColors.success.border}`,
              boxShadow: (overview?.kpis.overdueAmount || 0) > 0
                ? `0 8px 32px ${ownerPalette.accent.shadow}`
                : 'none',
            }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 -mr-6 -mt-6" />
            <div className="flex items-center justify-between mb-3">
              <span className={cn(
                'text-sm font-medium',
                (overview?.kpis.overdueAmount || 0) > 0 ? 'text-white/80' : 'text-emerald-700'
              )}>
                {t?.kpi?.overdue?.[language] || 'Overdue'}
              </span>
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  (overview?.kpis.overdueAmount || 0) > 0 ? 'bg-white/20' : ''
                )}
                style={{
                  background: (overview?.kpis.overdueAmount || 0) === 0
                    ? semanticColors.success.gradient
                    : undefined,
                }}
              >
                {(overview?.kpis.overdueAmount || 0) > 0 ? (
                  <AlertCircle className="w-4 h-4 text-white" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <p className={cn(
              'text-3xl font-bold mb-2',
              (overview?.kpis.overdueAmount || 0) > 0 ? 'text-white' : 'text-emerald-700'
            )}>
              {formatCurrency(overview?.kpis.overdueAmount || 0)}
            </p>
            {(overview?.paymentSummary.overdueCount || 0) > 0 ? (
              <span className="text-sm font-medium text-white/90 px-2 py-0.5 rounded-full bg-white/20">
                {overview?.paymentSummary.overdueCount} {t?.kpi?.late?.[language] || 'late'}
              </span>
            ) : (
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> {t?.kpi?.allPaid?.[language] || 'All paid'}
              </span>
            )}
          </motion.div>

          {/* Card 4: Collection Rate - QUATERNARY color */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: ownerPalette.quaternary.light,
              border: `2px solid ${ownerPalette.quaternary.border}`,
            }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-6 -mt-6"
              style={{ background: `${ownerPalette.quaternary.main}15` }} />
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: ownerPalette.quaternary.text }} className="text-sm font-medium">
                {t?.kpi?.collectionRate?.[language] || 'Collection rate'}
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: ownerPalette.quaternary.main }}
              >
                <Percent className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{collectionRate}%</p>
            {/* Mini progress bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(collectionRate, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-full rounded-full"
                style={{
                  background: collectionRate >= 90
                    ? semanticColors.success.gradient
                    : collectionRate >= 70
                    ? semanticColors.warning.gradient
                    : semanticColors.danger.gradient,
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Alerts Section - 2 cols */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div
                className="px-6 py-4 border-b border-gray-100 flex items-center justify-between"
                style={{ background: ownerPalette.accent.light }}
              >
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: ownerPalette.accent.main }} />
                  {t?.alerts?.title?.[language] || 'Financial alerts'}
                </h2>
                {(overview?.alerts?.length || 0) > 0 && (
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full text-white"
                    style={{ background: ownerPalette.accent.main }}
                  >
                    {overview?.alerts?.length}
                  </span>
                )}
              </div>

              <div className="p-6">
                {!overview?.alerts || overview.alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <div
                      className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                      style={{ background: semanticColors.success.gradient }}
                    >
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900">{t?.alerts?.empty?.title?.[language] || 'No alerts'}</p>
                    <p className="text-sm text-gray-500 mt-1">{t?.alerts?.empty?.subtitle?.[language] || 'Your finances are in order!'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {overview.alerts.slice(0, 4).map((alert, index) => {
                      const AlertIcon = getAlertIcon(alert.type);
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => router.push(alert.href)}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all',
                            'hover:shadow-md hover:scale-[1.01]',
                            alert.severity === 'critical'
                              ? 'bg-red-50 border-2 border-red-200 hover:border-red-300'
                              : alert.severity === 'warning'
                              ? 'bg-amber-50 border-2 border-amber-200 hover:border-amber-300'
                              : 'bg-blue-50 border-2 border-blue-200 hover:border-blue-300'
                          )}
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background:
                                alert.severity === 'critical'
                                  ? semanticColors.danger.gradient
                                  : alert.severity === 'warning'
                                  ? semanticColors.warning.gradient
                                  : semanticColors.info.gradient,
                            }}
                          >
                            <AlertIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'font-semibold truncate',
                              alert.severity === 'critical' ? 'text-red-800'
                                : alert.severity === 'warning' ? 'text-amber-800' : 'text-blue-800'
                            )}>
                              {alert.title}
                            </p>
                            <p className={cn(
                              'text-sm truncate',
                              alert.severity === 'critical' ? 'text-red-600'
                                : alert.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'
                            )}>
                              {alert.description}
                            </p>
                          </div>
                          {alert.amount && (
                            <span className={cn(
                              'text-sm font-bold flex-shrink-0',
                              alert.severity === 'critical' ? 'text-red-700'
                                : alert.severity === 'warning' ? 'text-amber-700' : 'text-blue-700'
                            )}>
                              {formatCurrency(alert.amount)}
                            </span>
                          )}
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Trend Chart - 1 col */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full">
              <div
                className="px-6 py-4 border-b border-gray-100 flex items-center justify-between"
                style={{ background: ownerPalette.primary.light }}
              >
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" style={{ color: ownerPalette.primary.main }} />
                  {t?.trend?.title?.[language] || 'Trend'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard/owner/finance')}
                  className="text-sm h-8 px-2"
                  style={{ color: ownerPalette.primary.main }}
                >
                  {t?.trend?.details?.[language] || 'Details'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {overview?.trend.slice(-4).map((month, index) => {
                    const percentage = month.expected > 0
                      ? Math.round((month.collected / month.expected) * 100)
                      : 0;
                    // Rotate through owner colors
                    const colors = [ownerPalette.primary, ownerPalette.secondary, ownerPalette.tertiary, ownerPalette.quaternary];
                    const color = colors[index % colors.length];
                    return (
                      <div key={month.month} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{month.monthLabel}</span>
                          <span className="text-gray-500 text-xs">
                            {formatCurrency(month.collected)}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                            className="h-full rounded-full"
                            style={{ background: color.main }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Current month highlight */}
                <div
                  className="mt-6 p-4 rounded-xl"
                  style={{ background: ownerPalette.primary.light }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: ownerPalette.primary.text }}>
                      {t?.trend?.thisMonth?.[language] || 'This month'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold" style={{ color: ownerPalette.primary.main }}>
                        {formatCurrency(comparison?.currentMonth.collected || 0)}
                      </span>
                      {comparison && comparison.changePercent !== 0 && (
                        <span className={cn(
                          'flex items-center text-xs font-semibold px-2 py-0.5 rounded-full',
                          comparison.changePercent > 0
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        )}>
                          {comparison.changePercent > 0 ? (
                            <ArrowUpRight className="w-3 h-3 mr-0.5" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-0.5" />
                          )}
                          {Math.abs(comparison.changePercent)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions - Bold colored cards */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PiggyBank className="w-5 h-5" style={{ color: ownerPalette.secondary.main }} />
            {t?.quickActions?.title?.[language] || 'Financial management'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Analytics Card - Secondary color */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard/owner/finance')}
              className="cursor-pointer rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${ownerPalette.secondary.main} 0%, ${ownerPalette.tertiary.main} 100%)`,
                boxShadow: `0 8px 32px ${ownerPalette.secondary.shadow}`,
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -mr-12 -mt-12" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 -ml-8 -mb-8" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Paiements & Analytics</h3>
                <p className="text-white/70 text-sm mb-4">
                  Suivez les encaissements et analysez vos revenus en détail
                </p>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 rounded-lg px-3 py-1.5">
                    <span className="text-white text-sm font-semibold">
                      {formatCurrency(overview?.paymentSummary.paid || 0)} encaissés
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/60" />
                </div>
              </div>
            </motion.div>

            {/* Portfolio Card - Quaternary color */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard/owner/portfolio')}
              className="cursor-pointer rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: ownerPalette.quaternary.light,
                border: `2px solid ${ownerPalette.quaternary.border}`,
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-12 -mt-12"
                style={{ background: `${ownerPalette.quaternary.main}10` }} />
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: ownerPalette.quaternary.main }}
                >
                  <Home className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Portfolio</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Consultez la performance de vos biens immobiliers
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="rounded-lg px-3 py-1.5"
                    style={{ background: `${ownerPalette.quaternary.main}15` }}
                  >
                    <span style={{ color: ownerPalette.quaternary.text }} className="text-sm font-semibold">
                      {overview?.kpis.occupationRate || 0}% occupation
                    </span>
                  </div>
                  <div
                    className="rounded-lg px-3 py-1.5"
                    style={{ background: `${ownerPalette.quaternary.main}15` }}
                  >
                    <span style={{ color: ownerPalette.quaternary.text }} className="text-sm font-semibold">
                      {formatCurrency(overview?.kpis.avgRentPerProperty || 0)} loyer moy.
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Summary - Full gradient CTA */}
        <motion.div variants={itemVariants} className="mt-8 mb-4">
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: ownerGradient,
              boxShadow: '0 8px 32px rgba(156, 86, 152, 0.25)',
            }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-1/2 w-32 h-32 rounded-full bg-white/5 -ml-16 -mb-16" />
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(overview?.paymentSummary.paid || 0)}
                </p>
                <p className="text-white/70 text-sm mt-1">Encaissé ce mois</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(overview?.paymentSummary.pending || 0)}
                </p>
                <p className="text-white/70 text-sm mt-1">En attente</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(overview?.paymentSummary.overdue || 0)}
                </p>
                <p className="text-white/70 text-sm mt-1">En retard</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  {overview?.kpis.collectionRate || 100}%
                </p>
                <p className="text-white/70 text-sm mt-1">Taux d'encaissement</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
