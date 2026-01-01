'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import { useLanguage } from '@/lib/i18n/use-language';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';

// V3 Owner gradient palette
const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)';
const ownerGradientLight = 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)';

export default function FinanceReportPage() {
  const router = useRouter();
  const { setActiveRole } = useRole();
  const { getSection, language } = useLanguage();
  const t = getSection('dashboard')?.owner?.financePage;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setActiveRole('owner');
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const financialData = {
    totalRevenue: 12450,
    totalExpenses: 3200,
    netProfit: 9250,
    occupancyRate: 85,
    revenueChange: 12,
    expensesChange: 5,
    profitChange: 15,
    occupancyChange: 3,
    monthlyBreakdown: [
      { month: 'Jan', revenue: 10200, expenses: 2800, profit: 7400 },
      { month: 'Fév', revenue: 10800, expenses: 2950, profit: 7850 },
      { month: 'Mar', revenue: 11200, expenses: 3100, profit: 8100 },
      { month: 'Avr', revenue: 12450, expenses: 3200, profit: 9250 },
    ],
  };

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
            {t?.loading?.subtitle?.[language] || 'Préparation de vos données'}
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
        {/* Header - V3 Fun Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6"
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10"
            style={{ background: ownerGradient }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-10"
            style={{ background: ownerGradient }}
          />

          <div className="relative mb-6">
            <div className="flex items-center gap-4 mb-2">
              {/* V3 Animated Icon with Glow */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="relative w-14 h-14"
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-30"
                  style={{ background: ownerGradient, filter: 'blur(12px)' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                />
                {/* Main icon */}
                <div
                  className="relative w-full h-full rounded-2xl flex items-center justify-center"
                  style={{ background: ownerGradient, boxShadow: '0 8px 24px rgba(156, 86, 152, 0.3)' }}
                >
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                {/* Floating sparkle */}
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
                  {t?.header?.title?.[language] || 'Rapport Financier'}
                </h1>
                <p className="text-gray-600">
                  {t?.header?.subtitle?.[language] || "Vue d'ensemble complète de vos finances"}
                </p>
              </div>
            </div>
          </div>

          {/* KPI Cards - V3 Fun Style */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Revenue - Amber Semantic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-xl border border-amber-200/50 shadow-sm"
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-amber-400 opacity-15" />
              <div className="relative flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-sm">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {t?.kpi?.totalRevenue?.[language] || 'Revenus Totaux'}
                </p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                €{financialData.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-sm text-amber-700">
                <ArrowUpRight className="w-4 h-4" />
                <span className="font-semibold">{financialData.revenueChange}%</span>
                <span className="text-gray-600">{t?.kpi?.vsLastMonth?.[language] || 'vs mois dernier'}</span>
              </div>
            </motion.div>

            {/* Expenses - Red Semantic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.15 }}
              className="relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-xl border border-red-200/50 shadow-sm"
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-red-400 opacity-15" />
              <div className="relative flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-sm">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {t?.kpi?.totalExpenses?.[language] || 'Dépenses Totales'}
                </p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                €{financialData.totalExpenses.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-sm text-red-700">
                <ArrowUpRight className="w-4 h-4" />
                <span className="font-semibold">{financialData.expensesChange}%</span>
                <span className="text-gray-600">{t?.kpi?.vsLastMonth?.[language] || 'vs mois dernier'}</span>
              </div>
            </motion.div>

            {/* Net Profit - Green Semantic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200/50 shadow-sm"
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-green-400 opacity-15" />
              <div className="relative flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {t?.kpi?.netProfit?.[language] || 'Bénéfice Net'}
                </p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                €{financialData.netProfit.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-sm text-green-700">
                <ArrowUpRight className="w-4 h-4" />
                <span className="font-semibold">{financialData.profitChange}%</span>
                <span className="text-gray-600">{t?.kpi?.vsLastMonth?.[language] || 'vs mois dernier'}</span>
              </div>
            </motion.div>

            {/* Occupancy Rate - Owner Primary */}
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
                <p className="text-sm font-medium text-gray-700">
                  {t?.kpi?.occupancyRate?.[language] || "Taux d'Occupation"}
                </p>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#9c5698' }}>
                {financialData.occupancyRate}%
              </p>
              <div className="flex items-center gap-1 text-sm" style={{ color: '#9c5698' }}>
                <ArrowUpRight className="w-4 h-4" />
                <span className="font-semibold">{financialData.occupancyChange}%</span>
                <span className="text-gray-600">{t?.kpi?.vsLastMonth?.[language] || 'vs mois dernier'}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Monthly Breakdown - V3 Fun Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6"
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
            style={{ background: ownerGradient }}
          />

          <h2 className="relative text-xl font-bold text-gray-900 mb-6">
            {t?.monthly?.title?.[language] || 'Détails Mensuels'}
          </h2>
          <div className="relative space-y-3">
            {financialData.monthlyBreakdown.map((month, idx) => {
              // Map month abbreviations to translation keys
              const monthKeys: Record<string, 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec'> = {
                'Jan': 'jan', 'Fév': 'feb', 'Mar': 'mar', 'Avr': 'apr',
                'Mai': 'may', 'Juin': 'jun', 'Juil': 'jul', 'Août': 'aug',
                'Sep': 'sep', 'Oct': 'oct', 'Nov': 'nov', 'Déc': 'dec'
              };
              const monthKey = monthKeys[month.month];
              const translatedMonth = monthKey ? (t?.months?.[monthKey]?.[language] || month.month) : month.month;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border border-purple-200/30 shadow-sm"
                  style={{ background: ownerGradientLight, borderLeftWidth: '4px', borderLeftColor: '#9c5698' }}
                >
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-10" style={{ background: ownerGradient }} />
                  <div className="relative flex-1 mb-3 sm:mb-0">
                    <h4 className="text-lg font-bold text-gray-900">{translatedMonth}</h4>
                  </div>
                  <div className="relative flex flex-wrap gap-6">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-gray-600 mb-1 font-medium">
                        {t?.monthly?.revenue?.[language] || 'Revenus'}
                      </p>
                      <p className="font-bold text-green-700 text-lg">
                        €{month.revenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-gray-600 mb-1 font-medium">
                        {t?.monthly?.expenses?.[language] || 'Dépenses'}
                      </p>
                      <p className="font-bold text-red-700 text-lg">
                        €{month.expenses.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-gray-600 mb-1 font-medium">
                        {t?.monthly?.profit?.[language] || 'Bénéfice'}
                      </p>
                      <p className="font-bold text-lg" style={{ color: '#9c5698' }}>
                        €{month.profit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Chart Placeholder - V3 Fun Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8"
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-10"
            style={{ background: ownerGradient }}
          />

          <h2 className="relative text-xl font-bold text-gray-900 mb-6">
            {t?.chart?.title?.[language] || 'Revenus vs Dépenses'}
          </h2>
          <div
            className="relative overflow-hidden h-64 flex items-center justify-center rounded-2xl border border-purple-200/30"
            style={{ background: ownerGradientLight }}
          >
            {/* Decorative elements */}
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20"
              style={{ background: ownerGradient }}
            />
            <div
              className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-10"
              style={{ background: ownerGradient }}
            />

            <div className="relative z-10 text-center">
              {/* V3 Animated Icon */}
              <motion.div
                className="relative w-20 h-20 mx-auto mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-30"
                  style={{ background: ownerGradient, filter: 'blur(12px)' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                />
                {/* Main icon */}
                <div
                  className="relative w-full h-full rounded-2xl flex items-center justify-center"
                  style={{ background: ownerGradient, boxShadow: '0 8px 24px rgba(156, 86, 152, 0.3)' }}
                >
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                {/* Floating sparkle */}
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: '#c2566b' }} />
                </motion.div>
              </motion.div>
              <p className="text-gray-700 text-lg font-medium">
                {t?.chart?.comingSoon?.[language] || 'Visualisation à venir'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {t?.chart?.comingSoonSubtitle?.[language] || 'Graphiques interactifs bientôt disponibles'}
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
