'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import { useLanguage } from '@/lib/i18n/use-language';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
  RefreshCw,
  Download,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
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
import type { Property } from '@/types/property.types';

// V3 Owner gradient palette
const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)';
const ownerGradientLight = 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)';
const successGradient = 'linear-gradient(135deg, #059669 0%, #10B981 100%)';
const warningGradient = 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)';
const dangerGradient = 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)';

interface RentPayment {
  id: string;
  property_id: string;
  user_id: string;
  month: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  paid_at?: string;
  proof_url?: string;
}

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
  payments: RentPayment[];
}

interface FinancialStats {
  totalExpected: number;
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  overdueCount: number;
  occupationRate: number;
  collectionRate: number;
  propertiesCount: number;
  occupiedCount: number;
}

interface MonthlyData {
  month: string;
  collected: number;
  expected: number;
  pending: number;
}

export default function FinanceReportPage() {
  const router = useRouter();
  const supabase = createClient();
  const { setActiveRole } = useRole();
  const { getSection, language } = useLanguage();
  const t = getSection('dashboard')?.owner?.financePage;

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [properties, setProperties] = useState<PropertyFinance[]>([]);
  const [stats, setStats] = useState<FinancialStats>({
    totalExpected: 0,
    totalCollected: 0,
    totalPending: 0,
    totalOverdue: 0,
    overdueCount: 0,
    occupationRate: 0,
    collectionRate: 0,
    propertiesCount: 0,
    occupiedCount: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  const loadFinanceData = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);
      setActiveRole('owner');

      // Load properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (!propertiesData || propertiesData.length === 0) {
        setIsLoading(false);
        return;
      }

      const propertyIds = propertiesData.map(p => p.id);

      // Load rent payments for all properties
      const { data: payments } = await supabase
        .from('rent_payments')
        .select('*')
        .in('property_id', propertyIds)
        .order('month', { ascending: false });

      // Calculate per-property finances
      const propertyFinances: PropertyFinance[] = propertiesData.map(property => {
        const propertyPayments = payments?.filter(p => p.property_id === property.id) || [];

        const collected = propertyPayments
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + Number(p.amount || 0), 0);

        const pending = propertyPayments
          .filter(p => p.status === 'pending')
          .reduce((sum, p) => sum + Number(p.amount || 0), 0);

        const overdue = propertyPayments
          .filter(p => p.status === 'overdue')
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
          payments: propertyPayments,
        };
      });

      setProperties(propertyFinances);

      // Calculate overall stats
      const totalExpected = propertiesData
        .filter(p => p.status === 'rented')
        .reduce((sum, p) => sum + (p.monthly_rent || 0), 0);

      const totalCollected = payments
        ?.filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

      const totalPending = payments
        ?.filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

      const totalOverdue = payments
        ?.filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

      const overdueCount = payments?.filter(p => p.status === 'overdue').length || 0;

      const occupiedCount = propertiesData.filter(p => p.status === 'rented').length;
      const occupationRate = propertiesData.length > 0
        ? Math.round((occupiedCount / propertiesData.length) * 100)
        : 0;

      const collectionRate = (totalCollected + totalOverdue) > 0
        ? Math.round((totalCollected / (totalCollected + totalOverdue)) * 100)
        : 100;

      setStats({
        totalExpected,
        totalCollected,
        totalPending,
        totalOverdue,
        overdueCount,
        occupationRate,
        collectionRate,
        propertiesCount: propertiesData.length,
        occupiedCount,
      });

      // Generate monthly data for chart (last 6 months)
      const monthlyDataTemp: MonthlyData[] = [];
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = monthNames[date.getMonth()];

        const monthPayments = payments?.filter(p => p.month.startsWith(monthKey)) || [];

        const collected = monthPayments
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + Number(p.amount || 0), 0);

        const pending = monthPayments
          .filter(p => p.status === 'pending' || p.status === 'overdue')
          .reduce((sum, p) => sum + Number(p.amount || 0), 0);

        monthlyDataTemp.push({
          month: monthLabel,
          collected,
          expected: totalExpected, // Monthly expected
          pending,
        });
      }

      setMonthlyData(monthlyDataTemp);

    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase, router, setActiveRole]);

  useEffect(() => {
    loadFinanceData();
  }, [loadFinanceData]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #F8F0F7 0%, #FFFFFF 50%, #FDF5F9 100%)' }}
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

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #F8F0F7 0%, #FFFFFF 50%, #FDF5F9 100%)' }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10" style={{ background: ownerGradient }} />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-10" style={{ background: ownerGradient }} />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="relative w-14 h-14"
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-30"
                  style={{ background: ownerGradient, filter: 'blur(12px)' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                />
                <div
                  className="relative w-full h-full rounded-2xl flex items-center justify-center"
                  style={{ background: ownerGradient, boxShadow: '0 8px 24px rgba(156, 86, 152, 0.3)' }}
                >
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: '#c2566b' }} />
                </motion.div>
              </motion.div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {t?.header?.title?.[language] || 'Finances'}
                </h1>
                <p className="text-gray-600">
                  {t?.header?.subtitle?.[language] || 'Suivi des loyers et revenus'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadFinanceData(true)}
                disabled={isRefreshing}
                className="rounded-full"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
                Actualiser
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Collected - Green */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200/50 shadow-sm"
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-green-400 opacity-15" />
              <div className="relative flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: successGradient }}>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">Encaissé</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                €{stats.totalCollected.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-sm text-green-700">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">{stats.collectionRate}%</span>
                <span className="text-gray-600">taux de recouvrement</span>
              </div>
            </motion.div>

            {/* Pending - Amber */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.15 }}
              className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-xl border border-amber-200/50 shadow-sm"
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-amber-400 opacity-15" />
              <div className="relative flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: warningGradient }}>
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">En attente</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                €{stats.totalPending.toLocaleString()}
              </p>
              <p className="text-sm text-amber-700">À percevoir ce mois</p>
            </motion.div>

            {/* Overdue - Red */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.2 }}
              className={cn(
                "relative overflow-hidden p-5 rounded-xl border shadow-sm",
                stats.totalOverdue > 0
                  ? "bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50"
                  : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50"
              )}
            >
              <div className={cn(
                "absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-15",
                stats.totalOverdue > 0 ? "bg-red-400" : "bg-green-400"
              )} />
              <div className="relative flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: stats.totalOverdue > 0 ? dangerGradient : successGradient }}
                >
                  {stats.totalOverdue > 0 ? (
                    <AlertTriangle className="w-5 h-5 text-white" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-700">Impayés</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                €{stats.totalOverdue.toLocaleString()}
              </p>
              {stats.totalOverdue > 0 ? (
                <p className="text-sm text-red-700 font-medium">
                  {stats.overdueCount} paiement{stats.overdueCount > 1 ? 's' : ''} en retard
                </p>
              ) : (
                <p className="text-sm text-green-700">Aucun impayé</p>
              )}
            </motion.div>

            {/* Occupation Rate - Owner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.25 }}
              className="relative overflow-hidden p-5 rounded-xl border border-purple-200/50 shadow-sm"
              style={{ background: ownerGradientLight }}
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20" style={{ background: ownerGradient }} />
              <div className="relative flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: ownerGradient }}
                >
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">Taux d'occupation</p>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#9c5698' }}>
                {stats.occupationRate}%
              </p>
              <p className="text-sm" style={{ color: '#9c5698' }}>
                {stats.occupiedCount}/{stats.propertiesCount} propriétés louées
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Chart Section */}
        {monthlyData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ background: ownerGradient }} />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: successGradient }}>
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Évolution des revenus</h2>
                  <p className="text-sm text-gray-500">6 derniers mois</p>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#999" style={{ fontSize: '12px' }} />
                <YAxis stroke="#999" style={{ fontSize: '12px' }} tickFormatter={(value) => `€${value}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  formatter={(value: number) => [`€${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Bar
                  dataKey="collected"
                  name="Encaissé"
                  fill="#10B981"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="pending"
                  name="En attente/Impayé"
                  fill="#F59E0B"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Properties Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8"
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-10" style={{ background: ownerGradient }} />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: ownerGradient }}>
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Par propriété</h2>
                <p className="text-sm text-gray-500">{properties.length} propriétés</p>
              </div>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-12" style={{ background: ownerGradientLight }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: ownerGradient }}>
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Aucune propriété</h4>
              <p className="text-gray-600 mb-4">Ajoutez votre première propriété pour voir les finances</p>
              <Button
                onClick={() => router.push('/properties/add')}
                className="rounded-full text-white"
                style={{ background: ownerGradient }}
              >
                Ajouter une propriété
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.map((property, idx) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  onClick={() => router.push(`/properties/${property.id}`)}
                  className={cn(
                    "relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border shadow-sm cursor-pointer transition-all",
                    property.overdue > 0
                      ? "border-red-200 bg-red-50/50"
                      : "border-purple-200/30"
                  )}
                  style={property.overdue === 0 ? { background: ownerGradientLight, borderLeftWidth: '4px', borderLeftColor: '#9c5698' } : { borderLeftWidth: '4px', borderLeftColor: '#DC2626' }}
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
                        €{property.monthlyRent.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs text-gray-500 mb-1">Encaissé</p>
                      <p className="font-bold text-green-700">
                        €{property.collected.toLocaleString()}
                      </p>
                    </div>

                    {property.overdue > 0 && (
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-red-600 mb-1 font-medium">Impayé</p>
                        <p className="font-bold text-red-700">
                          €{property.overdue.toLocaleString()}
                        </p>
                      </div>
                    )}

                    <Badge
                      variant={property.status === 'rented' ? 'success' : property.status === 'published' ? 'warning' : 'secondary'}
                    >
                      {property.status === 'rented' ? 'Louée' : property.status === 'published' ? 'Vacante' : property.status}
                    </Badge>

                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
