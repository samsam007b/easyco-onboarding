'use client';

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
  DollarSign,
  BarChart3,
  AlertCircle,
  Home,
  BadgeEuro,
  PiggyBank,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  OwnerPageHeader,
  OwnerKPICard,
  OwnerKPIGrid,
  OwnerNavigationCard,
  OwnerNavigationGrid,
} from '@/components/owner';
import { ownerGradient, ownerGradientLight, ownerPageBackground, semanticColors } from '@/lib/constants/owner-theme';
import {
  financesService,
  type FinancesOverview,
  type FinanceAlert,
} from '@/lib/services/finances-service';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function FinancesHubPage() {
  const router = useRouter();
  const supabase = createClient();

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

      // Fetch all data in parallel
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

  // Get alert icon
  const getAlertIcon = (type: FinanceAlert['type']) => {
    switch (type) {
      case 'overdue':
        return AlertCircle;
      case 'upcoming_due':
        return Clock;
      case 'collection_low':
        return TrendingDown;
      case 'vacant_property':
        return Home;
      default:
        return AlertTriangle;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chargement...
          </h3>
          <p className="text-gray-600">Analyse de vos finances</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: ownerPageBackground }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <OwnerPageHeader
          icon={Wallet}
          title="Finances"
          subtitle="Suivez vos revenus et paiements"
          breadcrumb={{ label: 'Command Center', href: '/dashboard/owner' }}
          currentPage="Finances"
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
              title="Revenus du mois"
              value={formatCurrency(overview?.kpis.monthlyRevenue || 0)}
              icon={BadgeEuro}
              variant="primary"
              subtext={
                comparison?.changePercent !== 0 && comparison?.changePercent !== undefined
                  ? `${comparison.changePercent > 0 ? '+' : ''}${comparison.changePercent}% vs mois dernier`
                  : 'Stable vs mois dernier'
              }
              onClick={() => router.push('/dashboard/owner/finance')}
            />
            <OwnerKPICard
              title="Paiements en attente"
              value={formatCurrency(overview?.kpis.pendingPayments || 0)}
              icon={Clock}
              variant={overview?.kpis.pendingPayments ? 'warning' : 'success'}
              badge={
                overview?.paymentSummary.pendingCount
                  ? { label: `${overview.paymentSummary.pendingCount} paiement(s)`, variant: 'warning' }
                  : undefined
              }
              onClick={() => router.push('/dashboard/owner/finance')}
            />
            <OwnerKPICard
              title="Impayés"
              value={formatCurrency(overview?.kpis.overdueAmount || 0)}
              icon={AlertCircle}
              variant={
                (overview?.kpis.overdueAmount || 0) > 0 ? 'danger' : 'success'
              }
              badge={
                overview?.paymentSummary.overdueCount
                  ? { label: `${overview.paymentSummary.overdueCount} en retard`, variant: 'danger' }
                  : undefined
              }
              onClick={() => router.push('/dashboard/owner/finance')}
            />
            <OwnerKPICard
              title="Taux d'encaissement"
              value={`${overview?.kpis.collectionRate || 100}%`}
              icon={Percent}
              variant={
                (overview?.kpis.collectionRate || 100) >= 90
                  ? 'success'
                  : (overview?.kpis.collectionRate || 100) >= 70
                  ? 'warning'
                  : 'danger'
              }
              subtext="sur les 3 derniers mois"
            />
          </OwnerKPIGrid>
        </motion.div>

        {/* Alerts & Mini Trend Chart */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: '#c2566b' }} />
                  Alertes financieres
                </h2>
              </div>

              {!overview?.alerts || overview.alerts.length === 0 ? (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: semanticColors.success.gradient }}
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600">Aucune alerte</p>
                  <p className="text-sm text-gray-500 mt-1">Vos finances sont en ordre !</p>
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
                          'hover:shadow-md',
                          alert.severity === 'critical'
                            ? 'bg-red-50 border border-red-200 hover:border-red-300'
                            : alert.severity === 'warning'
                            ? 'bg-amber-50 border border-amber-200 hover:border-amber-300'
                            : 'bg-blue-50 border border-blue-200 hover:border-blue-300'
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
                          <p
                            className={cn(
                              'font-semibold truncate',
                              alert.severity === 'critical'
                                ? 'text-red-800'
                                : alert.severity === 'warning'
                                ? 'text-amber-800'
                                : 'text-blue-800'
                            )}
                          >
                            {alert.title}
                          </p>
                          <p
                            className={cn(
                              'text-sm truncate',
                              alert.severity === 'critical'
                                ? 'text-red-600'
                                : alert.severity === 'warning'
                                ? 'text-amber-600'
                                : 'text-blue-600'
                            )}
                          >
                            {alert.description}
                          </p>
                        </div>
                        {alert.amount && (
                          <span
                            className={cn(
                              'text-sm font-bold flex-shrink-0',
                              alert.severity === 'critical'
                                ? 'text-red-700'
                                : alert.severity === 'warning'
                                ? 'text-amber-700'
                                : 'text-blue-700'
                            )}
                          >
                            {formatCurrency(alert.amount)}
                          </span>
                        )}
                        <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Mini Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" style={{ color: '#9c5698' }} />
                  Tendance
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard/owner/finance')}
                  className="text-sm"
                  style={{ color: '#9c5698' }}
                >
                  Détails
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Mini bar chart */}
              <div className="space-y-3 mt-6">
                {overview?.trend.slice(-4).map((month, index) => {
                  const percentage = month.expected > 0
                    ? Math.round((month.collected / month.expected) * 100)
                    : 0;
                  return (
                    <div key={month.month} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">{month.monthLabel}</span>
                        <span className="text-gray-500">
                          {formatCurrency(month.collected)} / {formatCurrency(month.expected)}
                        </span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentage, 100)}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="h-full rounded-full"
                          style={{
                            background: percentage >= 90
                              ? semanticColors.success.gradient
                              : percentage >= 70
                              ? semanticColors.warning.gradient
                              : semanticColors.danger.gradient,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ce mois</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: '#9c5698' }}>
                      {formatCurrency(comparison?.currentMonth.collected || 0)}
                    </span>
                    {comparison && comparison.changePercent !== 0 && (
                      <span
                        className={cn(
                          'flex items-center text-xs font-medium',
                          comparison.changePercent > 0 ? 'text-emerald-600' : 'text-red-600'
                        )}
                      >
                        {comparison.changePercent > 0 ? (
                          <TrendingUp className="w-3 h-3 mr-0.5" />
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
            <PiggyBank className="w-5 h-5" style={{ color: '#9c5698' }} />
            Gestion financiere
          </h2>

          <OwnerNavigationGrid>
            <OwnerNavigationCard
              title="Paiements & Analytics"
              description="Suivez les encaissements et analysez vos revenus"
              icon={BarChart3}
              href="/dashboard/owner/finance"
              stats={[
                { label: 'encaisses', value: formatCurrency(overview?.paymentSummary.paid || 0) },
                ...(overview?.paymentSummary.overdueCount
                  ? [{ label: 'en retard', value: overview.paymentSummary.overdueCount, variant: 'danger' as const }]
                  : []),
              ]}
              badge={
                overview?.paymentSummary.pendingCount
                  ? { count: overview.paymentSummary.pendingCount, variant: 'warning' }
                  : undefined
              }
            />
            <OwnerNavigationCard
              title="Portfolio"
              description="Consultez la performance de vos biens"
              icon={Home}
              href="/dashboard/owner/portfolio"
              stats={[
                { label: 'taux occupation', value: `${overview?.kpis.occupationRate || 0}%` },
                { label: 'loyer moyen', value: formatCurrency(overview?.kpis.avgRentPerProperty || 0) },
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
                <p className="text-2xl font-bold" style={{ color: '#059669' }}>
                  {formatCurrency(overview?.paymentSummary.paid || 0)}
                </p>
                <p className="text-xs text-gray-500">Encaisse ce mois</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(overview?.paymentSummary.pending || 0)}
                </p>
                <p className="text-xs text-gray-500">En attente</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(overview?.paymentSummary.overdue || 0)}
                </p>
                <p className="text-xs text-gray-500">En retard</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#9c5698' }}>
                  {overview?.kpis.collectionRate || 100}%
                </p>
                <p className="text-xs text-gray-500">Taux d'encaissement</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
