'use client';

/**
 * Owner Finance Analytics Page - V2 Data-Rich Design
 * Inspired by Resident Finances with Owner 5-color palette
 */

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
  TrendingDown,
  BarChart3,
  RefreshCw,
  Download,
  Building2,
  ChevronRight,
  Percent,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  Wallet,
  PieChart as PieChartIcon,
  Calendar,
  Users,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { exportFinanceToCSV, exportFinanceToPDF, type FinanceExportData } from '@/lib/services/export-service';
import { PaymentTable, FinanceAlerts, DocumentsModal, type PaymentRecord, type FinanceAlertData } from '@/components/owner/finances';
import { financesService, type FinancesOverview, type RentPaymentRecord } from '@/lib/services/finances-service';
import {
  ownerGradient,
  ownerGradientLight,
  ownerPageBackground,
  ownerPalette,
  ownerColors,
  semanticColors
} from '@/lib/constants/owner-theme';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

// Property colors for pie chart (using owner palette)
const PROPERTY_COLORS = [
  ownerColors.primary,
  ownerColors.secondary,
  ownerColors.tertiary,
  ownerColors.quaternary,
  ownerColors.accent,
  '#6B7280', // gray for overflow
];

interface PropertyFinance {
  id: string;
  title: string;
  city: string;
  monthlyRent: number;
  status: string;
  collected: number;
  pending: number;
  overdue: number;
}

// Mini Sparkline Component
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 24;
  const padding = 2;

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="opacity-60">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// Progress Bar Component
function ProgressBar({
  value,
  max,
  color,
  bgColor,
  showLabel = true
}: {
  value: number;
  max: number;
  color: string;
  bgColor: string;
  showLabel?: boolean;
}) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: bgColor }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium" style={{ color }}>{Math.round(percent)}%</span>
      )}
    </div>
  );
}

// Custom Tooltip for Area Chart
function CustomAreaTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-gray-200 shadow-lg">
      <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value?.toLocaleString()}€
        </p>
      ))}
    </div>
  );
}

// Custom Tooltip for Pie Chart
function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-gray-200 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">{data.name}</p>
      <p className="text-sm text-gray-600">{data.value?.toLocaleString()}€</p>
    </div>
  );
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
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState<string>('');

  const loadData = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setActiveRole('owner');
      setCurrentUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profile?.full_name) {
        setOwnerName(profile.full_name);
      }

      const [overviewData, paymentsData, comparisonData] = await Promise.all([
        financesService.getFinancesOverview(user.id),
        financesService.getRecentPayments(user.id, 20),
        financesService.getMonthlyComparison(user.id),
      ]);

      setOverview(overviewData);
      setRecentPayments(paymentsData);
      setComparison(comparisonData);

      // Load property breakdown
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
            collected,
            pending,
            overdue,
          };
        });

        setProperties(propertyFinances);
      }
    } catch (error) {
      console.error('Error loading finance data:', error);
      toast.error(getHookTranslation('finance', 'loadFailed'));
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

  // Data for property pie chart
  const propertyChartData = useMemo(() => {
    return properties.slice(0, 5).map((p) => ({
      name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
      value: p.collected + p.pending,
    }));
  }, [properties]);

  // Trend sparkline data
  const trendSparkline = useMemo(() => {
    if (!overview?.trend) return [];
    return overview.trend.map(t => t.collected);
  }, [overview?.trend]);

  // Handle payment actions
  const handleMarkPaid = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('rent_payments')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', paymentId);

      if (error) throw error;

      toast.success(getHookTranslation('finance', 'paymentMarkedPaid'));
      await loadData(true);
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      toast.error(getHookTranslation('finance', 'updateFailed'));
    }
  };

  const handleSendReminder = async (paymentId: string) => {
    try {
      toast.loading(getHookTranslation('finance', 'sendingReminder'), { id: 'reminder' });

      const response = await fetch('/api/owner/payments/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || getHookTranslation('finance', 'reminderFailed'));
      }

      toast.success(`${getHookTranslation('finance', 'reminderSent')} (${result.sentTo})`, { id: 'reminder' });
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error(
        error instanceof Error ? error.message : getHookTranslation('finance', 'reminderFailed'),
        { id: 'reminder' }
      );
    }
  };

  // Export handlers
  const formatDateForExport = (date: Date): string => {
    return date.toLocaleDateString('fr-FR');
  };

  const handleExportCSV = useCallback(() => {
    if (!overview || recentPayments.length === 0) {
      toast.error(getHookTranslation('finance', 'noDataToExport'));
      return;
    }

    const exportData: FinanceExportData = {
      payments: recentPayments.map(p => ({
        date: formatDateForExport(p.dueDate),
        tenant: p.tenantName,
        property: p.propertyTitle,
        amount: p.amount,
        status: p.status,
        paymentMethod: 'Virement',
      })),
      summary: {
        totalCollected: overview.paymentSummary.paid,
        totalExpected: overview.paymentSummary.paid + overview.paymentSummary.pending + overview.paymentSummary.overdue,
        totalOverdue: overview.paymentSummary.overdue,
        collectionRate: overview.kpis.collectionRate,
      },
      period: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    };

    exportFinanceToCSV(exportData);
    toast.success(getHookTranslation('finance', 'csvDownloaded'));
  }, [overview, recentPayments]);

  const handleExportPDF = useCallback(() => {
    if (!overview || recentPayments.length === 0) {
      toast.error(getHookTranslation('finance', 'noDataToExport'));
      return;
    }

    const exportData: FinanceExportData = {
      payments: recentPayments.map(p => ({
        date: formatDateForExport(p.dueDate),
        tenant: p.tenantName,
        property: p.propertyTitle,
        amount: p.amount,
        status: p.status,
        paymentMethod: 'Virement',
      })),
      summary: {
        totalCollected: overview.paymentSummary.paid,
        totalExpected: overview.paymentSummary.paid + overview.paymentSummary.pending + overview.paymentSummary.overdue,
        totalOverdue: overview.paymentSummary.overdue,
        collectionRate: overview.kpis.collectionRate,
      },
      period: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    };

    exportFinanceToPDF(exportData);
    toast.success(getHookTranslation('finance', 'pdfPreparing'));
  }, [overview, recentPayments]);

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

  const totalExpected = (overview?.paymentSummary.paid || 0) +
                        (overview?.paymentSummary.pending || 0) +
                        (overview?.paymentSummary.overdue || 0);

  return (
    <div className="min-h-screen" style={{ background: ownerPageBackground }}>
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8"
      >
        {/* Header with individual colors */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: ownerPalette.primary.main,
                boxShadow: `0 8px 24px ${ownerPalette.primary.shadow}`,
              }}
            >
              <Wallet className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Finances</h1>
              <p className="text-sm text-gray-500">
                {properties.length} propriétés • {overview?.kpis.monthlyRevenue?.toLocaleString() || 0}€/mois
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => loadData(true)}
                variant="outline"
                size="sm"
                disabled={isRefreshing}
                className="h-9 text-sm rounded-xl border-2 font-medium shadow-sm"
                style={{
                  borderColor: ownerPalette.secondary.border,
                  color: ownerPalette.secondary.main,
                }}
              >
                <RefreshCw className={cn('w-4 h-4 mr-2', isRefreshing && 'animate-spin')} />
                Actualiser
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowDocumentsModal(true)}
                variant="outline"
                size="sm"
                className="h-9 text-sm rounded-xl border-2 font-medium shadow-sm"
                style={{
                  borderColor: ownerPalette.tertiary.border,
                  color: ownerPalette.tertiary.main,
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </Button>
            </motion.div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    className="h-9 text-sm rounded-xl text-white font-semibold shadow-lg"
                    style={{
                      background: ownerGradient,
                      boxShadow: `0 4px 14px ${ownerPalette.primary.shadow}`,
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                    <Sparkles className="w-3.5 h-3.5 ml-1.5 text-white/80" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer rounded-lg">
                  <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
                  Export CSV (Excel)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer rounded-lg">
                  <FileText className="w-4 h-4 mr-2 text-red-600" />
                  Export PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Colorful KPI Cards - Each with different color */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Revenue Card - Primary Color */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden rounded-2xl p-4 shadow-lg"
            style={{
              background: ownerPalette.primary.bg,
              boxShadow: `0 8px 24px ${ownerPalette.primary.shadow}`,
            }}
          >
            <div
              className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{ backgroundColor: ownerPalette.primary.main }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: ownerPalette.primary.text }}>
                Revenus totaux
              </span>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: ownerPalette.primary.main }}
              >
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              €{(overview?.kpis.monthlyRevenue || 0).toLocaleString()}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <MiniSparkline data={trendSparkline} color={ownerPalette.primary.main} />
              <span className="text-xs font-medium" style={{ color: ownerPalette.primary.main }}>
                Ce mois
              </span>
            </div>
          </motion.div>

          {/* Collected Card - Tertiary Color */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden rounded-2xl p-4 shadow-lg"
            style={{
              background: ownerPalette.tertiary.bg,
              boxShadow: `0 8px 24px ${ownerPalette.tertiary.shadow}`,
            }}
          >
            <div
              className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{ backgroundColor: ownerPalette.tertiary.main }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: ownerPalette.tertiary.text }}>
                Encaissé
              </span>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: ownerPalette.tertiary.main }}
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              €{(overview?.paymentSummary.paid || 0).toLocaleString()}
            </p>
            <ProgressBar
              value={overview?.paymentSummary.paid || 0}
              max={totalExpected}
              color={ownerPalette.tertiary.main}
              bgColor={ownerPalette.tertiary.light}
            />
          </motion.div>

          {/* Pending Card - Quaternary Color */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden rounded-2xl p-4 shadow-lg"
            style={{
              background: ownerPalette.quaternary.bg,
              boxShadow: `0 8px 24px ${ownerPalette.quaternary.shadow}`,
            }}
          >
            <div
              className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{ backgroundColor: ownerPalette.quaternary.main }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: ownerPalette.quaternary.text }}>
                En attente
              </span>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: ownerPalette.quaternary.main }}
              >
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              €{(overview?.paymentSummary.pending || 0).toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-2">
              {(overview?.paymentSummary.pendingCount || 0) > 0 && (
                <Badge
                  className="text-xs"
                  style={{
                    backgroundColor: ownerPalette.quaternary.light,
                    color: ownerPalette.quaternary.main,
                    border: `1px solid ${ownerPalette.quaternary.border}`,
                  }}
                >
                  {overview?.paymentSummary.pendingCount} paiement(s)
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Overdue Card - Accent Color (or semantic danger) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden rounded-2xl p-4 shadow-lg"
            style={{
              background: (overview?.paymentSummary.overdue || 0) > 0
                ? semanticColors.danger.light
                : ownerPalette.accent.bg,
              boxShadow: (overview?.paymentSummary.overdue || 0) > 0
                ? '0 8px 24px rgba(220, 38, 38, 0.15)'
                : `0 8px 24px ${ownerPalette.accent.shadow}`,
            }}
          >
            <div
              className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{
                backgroundColor: (overview?.paymentSummary.overdue || 0) > 0
                  ? '#EF4444'
                  : ownerPalette.accent.main
              }}
            />
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm font-medium"
                style={{
                  color: (overview?.paymentSummary.overdue || 0) > 0
                    ? semanticColors.danger.text
                    : ownerPalette.accent.text
                }}
              >
                Impayés
              </span>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
                style={{
                  background: (overview?.paymentSummary.overdue || 0) > 0
                    ? semanticColors.danger.gradient
                    : ownerPalette.accent.main
                }}
              >
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              €{(overview?.paymentSummary.overdue || 0).toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-2">
              {(overview?.paymentSummary.overdueCount || 0) > 0 ? (
                <Badge variant="error" className="text-xs">
                  {overview?.paymentSummary.overdueCount} en retard
                </Badge>
              ) : (
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Aucun impayé
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Area Chart - Progression */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: ownerPalette.primary.main }}
              >
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Progression</h2>
                <p className="text-sm text-gray-500">6 derniers mois</p>
              </div>
              {comparison && (
                <div className="ml-auto flex items-center gap-1">
                  {comparison.changePercent >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={cn(
                    'text-sm font-semibold',
                    comparison.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {comparison.changePercent >= 0 ? '+' : ''}{comparison.changePercent}%
                  </span>
                </div>
              )}
            </div>

            {overview?.trend && overview.trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={overview.trend}>
                  <defs>
                    <linearGradient id="ownerAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ownerPalette.tertiary.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={ownerPalette.tertiary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="monthLabel"
                    stroke="#999"
                    style={{ fontSize: '12px' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#999"
                    style={{ fontSize: '12px' }}
                    tickLine={false}
                    tickFormatter={(value) => `${value}€`}
                  />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="collected"
                    name="Encaissé"
                    stroke={ownerPalette.tertiary.main}
                    strokeWidth={3}
                    fill="url(#ownerAreaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>Aucune donnée disponible</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Pie Chart - Par propriété */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: ownerPalette.secondary.main }}
              >
                <PieChartIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Par propriété</h2>
                <p className="text-sm text-gray-500">Répartition revenus</p>
              </div>
            </div>

            {propertyChartData.length > 0 ? (
              <div className="relative">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={propertyChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {propertyChartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PROPERTY_COLORS[index % PROPERTY_COLORS.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-bold text-gray-900">
                    €{propertyChartData.reduce((s, p) => s + p.value, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Building2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>Aucune propriété</p>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="mt-4 space-y-2">
              {propertyChartData.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PROPERTY_COLORS[index] }}
                    />
                    <span className="text-gray-600 truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">€{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Summary Cards Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Collection Rate Card */}
          <div
            className="rounded-2xl p-5 border"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F0F7 100%)',
              borderColor: ownerPalette.primary.border,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Taux d'encaissement</p>
                <p className="text-3xl font-bold" style={{ color: ownerPalette.primary.main }}>
                  {overview?.kpis.collectionRate || 100}%
                </p>
                <p className="text-xs text-gray-500 mt-1">{overview?.paymentSummary.paidCount || 0} paiements reçus</p>
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: ownerPalette.primary.light }}
              >
                <Percent className="w-7 h-7" style={{ color: ownerPalette.primary.main }} />
              </div>
            </div>
          </div>

          {/* This Month Card */}
          <div
            className="rounded-2xl p-5 border"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 100%)',
              borderColor: ownerPalette.tertiary.border,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ce mois</p>
                <p className="text-3xl font-bold" style={{ color: ownerPalette.tertiary.main }}>
                  €{comparison?.currentMonth.collected.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  sur €{comparison?.currentMonth.expected.toLocaleString() || 0} attendus
                </p>
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: ownerPalette.tertiary.light }}
              >
                <Calendar className="w-7 h-7" style={{ color: ownerPalette.tertiary.main }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts Section */}
        {alertsData.length > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <FinanceAlerts
              alerts={alertsData}
              onAlertClick={(alert) => router.push(alert.href)}
              maxVisible={3}
            />
          </motion.div>
        )}

        {/* Payment Table */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: ownerPalette.secondary.main }} />
            Derniers paiements
            {tablePayments.length > 0 && (
              <Badge
                className="ml-2"
                style={{
                  backgroundColor: ownerPalette.secondary.light,
                  color: ownerPalette.secondary.main,
                }}
              >
                {tablePayments.length}
              </Badge>
            )}
          </h2>
          <PaymentTable
            payments={tablePayments}
            onMarkPaid={handleMarkPaid}
            onSendReminder={handleSendReminder}
            isLoading={isRefreshing}
          />
        </motion.div>
      </motion.main>

      {/* Documents Modal */}
      {showDocumentsModal && currentUserId && (
        <DocumentsModal
          open={showDocumentsModal}
          onClose={() => setShowDocumentsModal(false)}
          ownerId={currentUserId}
          ownerName={ownerName}
        />
      )}
    </div>
  );
}
