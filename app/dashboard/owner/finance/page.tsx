'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import { useLanguage } from '@/lib/i18n/use-language';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  BarChart3,
  RefreshCw,
  Download,
  Building2,
  ChevronRight,
  Percent,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { OwnerPageHeader, OwnerKPICard, OwnerKPIGrid } from '@/components/owner';
import { PaymentTable, MonthlyComparison, FinanceAlerts, type PaymentRecord, type FinanceAlertData } from '@/components/owner/finances';
import { financesService, type FinancesOverview, type RentPaymentRecord } from '@/lib/services/finances-service';
import { ownerGradient, ownerGradientLight, ownerPageBackground, semanticColors } from '@/lib/constants/owner-theme';

interface PropertyFinance {
  id: string;
  title: string;
  city: string;
  monthlyRent: number;
  status: string;
  mainImage?: string;
  collected: number;
  pending: number;
  overdue: number;
}

export default function FinanceAnalyticsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { setActiveRole } = useRole();
  const { getSection, language } = useLanguage();
  const t = getSection('dashboard')?.owner?.financePage;

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [overview, setOverview] = useState<FinancesOverview | null>(null);
  const [recentPayments, setRecentPayments] = useState<RentPaymentRecord[]>([]);
  const [comparison, setComparison] = useState<{
    currentMonth: { collected: number; expected: number };
    previousMonth: { collected: number; expected: number };
    changePercent: number;
  } | null>(null);
  const [properties, setProperties] = useState<PropertyFinance[]>([]);

  const loadData = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setActiveRole('owner');

      // Fetch all data in parallel
      const [overviewData, paymentsData, comparisonData] = await Promise.all([
        financesService.getFinancesOverview(user.id),
        financesService.getRecentPayments(user.id, 20),
        financesService.getMonthlyComparison(user.id),
      ]);

      setOverview(overviewData);
      setRecentPayments(paymentsData);
      setComparison(comparisonData);

      // Also load property breakdown
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesData) {
        const propertyIds = propertiesData.map((p) => p.id);
        const { data: payments } = await supabase
          .from('rent_payments')
          .select('*')
          .in('property_id', propertyIds);

        const propertyFinances: PropertyFinance[] = propertiesData.map((property) => {
          const propertyPayments = payments?.filter((p) => p.property_id === property.id) || [];
          const collected = propertyPayments
            .filter((p) => p.status === 'paid')
            .reduce((sum, p) => sum + Number(p.amount || 0), 0);
          const pending = propertyPayments
            .filter((p) => p.status === 'pending')
            .reduce((sum, p) => sum + Number(p.amount || 0), 0);
          const overdue = propertyPayments
            .filter((p) => p.status === 'overdue')
            .reduce((sum, p) => sum + Number(p.amount || 0), 0);

          return {
            id: property.id,
            title: property.title,
            city: property.city || '',
            monthlyRent: property.monthly_rent || 0,
            status: property.status,
            mainImage: property.main_image,
            collected,
            pending,
            overdue,
          };
        });

        setProperties(propertyFinances);
      }
    } catch (error) {
      console.error('Error loading finance data:', error);
      toast.error('Erreur lors du chargement des donnees');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase, router, setActiveRole]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Transform payments for table
  const tablePayments: PaymentRecord[] = useMemo(() => {
    return recentPayments.map((p) => ({
      id: p.id,
      propertyId: p.propertyId,
      propertyTitle: p.propertyTitle,
      tenantName: p.tenantName,
      tenantId: p.tenantId,
      amount: p.amount,
      dueDate: p.dueDate,
      paidAt: p.paidAt,
      status: p.status,
      month: p.month,
    }));
  }, [recentPayments]);

  // Transform alerts
  const alertsData: FinanceAlertData[] = useMemo(() => {
    return (overview?.alerts || []).map((alert) => ({
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      title: alert.title,
      description: alert.description,
      amount: alert.amount,
      propertyId: alert.propertyId,
      propertyTitle: alert.propertyTitle,
      href: alert.href,
      createdAt: alert.createdAt,
    }));
  }, [overview?.alerts]);

  // Handle payment actions
  const handleMarkPaid = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('rent_payments')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', paymentId);

      if (error) throw error;

      toast.success('Paiement marque comme paye');
      await loadData(true);
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      toast.error('Erreur lors de la mise a jour');
    }
  };

  const handleSendReminder = async (paymentId: string) => {
    toast.info('Fonctionnalite de relance en cours de developpement');
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: ownerGradientLight }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center mb-6">
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t?.loading?.title?.[language] || 'Chargement des finances...'}
          </h3>
          <p className="text-gray-600">
            {t?.loading?.subtitle?.[language] || 'Analyse de vos revenus'}
          </p>
        </motion.div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => `${amount.toLocaleString()}e`;

  return (
    <div className="min-h-screen" style={{ background: ownerPageBackground }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <OwnerPageHeader
          icon={BarChart3}
          title={t?.header?.title?.[language] || 'Paiements & Analytics'}
          subtitle={t?.header?.subtitle?.[language] || 'Suivi detaille des loyers et revenus'}
          breadcrumb={{ label: 'Finances', href: '/dashboard/owner/finances' }}
          currentPage="Analytics"
          actions={
            <div className="flex items-center gap-2">
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
              <Button variant="outline" size="sm" className="rounded-full">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          }
        />

        {/* KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <OwnerKPIGrid columns={4}>
            <OwnerKPICard
              title="Encaisse"
              value={formatCurrency(overview?.paymentSummary.paid || 0)}
              icon={CheckCircle2}
              variant="success"
              subtext={`${overview?.paymentSummary.paidCount || 0} paiements`}
            />
            <OwnerKPICard
              title="En attente"
              value={formatCurrency(overview?.paymentSummary.pending || 0)}
              icon={Clock}
              variant={overview?.paymentSummary.pending ? 'warning' : 'success'}
              badge={
                overview?.paymentSummary.pendingCount
                  ? { label: `${overview.paymentSummary.pendingCount} paiement(s)`, variant: 'warning' }
                  : undefined
              }
            />
            <OwnerKPICard
              title="Impayes"
              value={formatCurrency(overview?.paymentSummary.overdue || 0)}
              icon={AlertTriangle}
              variant={(overview?.paymentSummary.overdue || 0) > 0 ? 'danger' : 'success'}
              badge={
                overview?.paymentSummary.overdueCount
                  ? { label: `${overview.paymentSummary.overdueCount} en retard`, variant: 'danger' }
                  : undefined
              }
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

        {/* Chart & Comparison Row */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ background: semanticColors.success.gradient }}
                  >
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Evolution des revenus</h2>
                    <p className="text-sm text-gray-500">6 derniers mois</p>
                  </div>
                </div>
              </div>

              {overview?.trend && overview.trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={overview.trend} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="monthLabel" stroke="#999" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#999" style={{ fontSize: '12px' }} tickFormatter={(value) => `${value}e`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px',
                      }}
                      formatter={(value: number | undefined) => [`${(value ?? 0).toLocaleString()}e`, '']}
                    />
                    <Legend />
                    <Bar dataKey="collected" name="Encaisse" fill="#10B981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="pending" name="En attente" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="overdue" name="Impaye" fill="#EF4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-gray-500">
                  Aucune donnee disponible
                </div>
              )}
            </div>
          </motion.div>

          {/* Monthly Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {comparison && (
              <MonthlyComparison
                data={{
                  currentMonth: {
                    collected: comparison.currentMonth.collected,
                    expected: comparison.currentMonth.expected,
                    label: 'Ce mois',
                  },
                  previousMonth: {
                    collected: comparison.previousMonth.collected,
                    expected: comparison.previousMonth.expected,
                    label: 'Mois precedent',
                  },
                  changePercent: comparison.changePercent,
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Alerts Section */}
        {alertsData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-6"
          >
            <FinanceAlerts
              alerts={alertsData}
              onAlertClick={(alert) => router.push(alert.href)}
              maxVisible={3}
            />
          </motion.div>
        )}

        {/* Payment Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: '#9c5698' }} />
            Derniers paiements
          </h2>
          <PaymentTable
            payments={tablePayments}
            onMarkPaid={handleMarkPaid}
            onSendReminder={handleSendReminder}
            onPaymentClick={(payment) => router.push(`/properties/${payment.propertyId}`)}
          />
        </motion.div>

        {/* Properties Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: ownerGradient }}
                >
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Par propriete</h2>
                  <p className="text-sm text-gray-500">{properties.length} proprietes</p>
                </div>
              </div>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-12" style={{ background: ownerGradientLight }}>
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{ background: ownerGradient }}
                >
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Aucune propriete</h4>
                <p className="text-gray-600">Ajoutez votre premiere propriete pour voir les finances</p>
              </div>
            ) : (
              <div className="space-y-3">
                {properties.map((property, idx) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    transition={{ delay: 0.5 + idx * 0.03 }}
                    onClick={() => router.push(`/properties/${property.id}`)}
                    className={cn(
                      'relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border shadow-sm cursor-pointer transition-all',
                      property.overdue > 0
                        ? 'border-red-200 bg-red-50/50'
                        : 'border-purple-200/30'
                    )}
                    style={
                      property.overdue === 0
                        ? { background: ownerGradientLight, borderLeftWidth: '4px', borderLeftColor: '#9c5698' }
                        : { borderLeftWidth: '4px', borderLeftColor: '#DC2626' }
                    }
                  >
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-10" style={{ background: ownerGradient }} />

                    {/* Property Info */}
                    <div className="relative flex items-center gap-3 flex-1 mb-3 sm:mb-0">
                      <div
                        className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ background: ownerGradientLight }}
                      >
                        {property.mainImage ? (
                          <img src={property.mainImage} alt={property.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-6 h-6" style={{ color: '#9c5698' }} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{property.title}</h4>
                        <p className="text-sm text-gray-500">{property.city}</p>
                      </div>
                    </div>

                    {/* Finance Stats */}
                    <div className="relative flex flex-wrap gap-6 items-center">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-500 mb-1">Loyer mensuel</p>
                        <p className="font-bold" style={{ color: '#9c5698' }}>
                          {property.monthlyRent.toLocaleString()}e
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-500 mb-1">Encaisse</p>
                        <p className="font-bold text-green-700">{property.collected.toLocaleString()}e</p>
                      </div>

                      {property.overdue > 0 && (
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-red-600 mb-1 font-medium">Impaye</p>
                          <p className="font-bold text-red-700">{property.overdue.toLocaleString()}e</p>
                        </div>
                      )}

                      <Badge
                        variant={
                          property.status === 'rented' ? 'success' : property.status === 'published' ? 'warning' : 'secondary'
                        }
                      >
                        {property.status === 'rented' ? 'Louee' : property.status === 'published' ? 'Vacante' : property.status}
                      </Badge>

                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
