'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
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
  ArrowDownRight
} from 'lucide-react';

export default function FinanceReportPage() {
  const router = useRouter();
  const { setActiveRole } = useRole();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chargement des finances...</h3>
          <p className="text-gray-600">Préparation de vos données</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6"
        >
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-200/70 to-indigo-200/70 flex items-center justify-center shadow-sm">
                <BarChart3 className="w-6 h-6 text-gray-700" />
              </div>
              Rapport Financier
            </h1>
            <p className="text-gray-600">
              Vue d'ensemble complète de vos finances
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-amber-50/50 to-yellow-50/50 p-5 rounded-xl border border-amber-200/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-700" />
                </div>
                <p className="text-sm font-medium text-gray-700">Revenus Totaux</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                €{financialData.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-sm text-amber-700">
                <ArrowUpRight className="w-4 h-4" />
                <span className="font-semibold">{financialData.revenueChange}%</span>
                <span className="text-gray-600">vs mois dernier</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-red-50/50 to-rose-50/50 p-5 rounded-xl border border-red-200/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-700" />
                </div>
                <p className="text-sm font-medium text-gray-700">Dépenses Totales</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                €{financialData.totalExpenses.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-sm text-red-700">
                <ArrowUpRight className="w-4 h-4" />
                <span className="font-semibold">{financialData.expensesChange}%</span>
                <span className="text-gray-600">vs mois dernier</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 p-5 rounded-xl border border-green-200/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-700" />
                </div>
                <p className="text-sm font-medium text-gray-700">Bénéfice Net</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                €{financialData.netProfit.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-sm text-green-700">
                <ArrowUpRight className="w-4 h-4" />
                <span className="font-semibold">{financialData.profitChange}%</span>
                <span className="text-gray-600">vs mois dernier</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 p-5 rounded-xl border border-blue-200/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-blue-700" />
                </div>
                <p className="text-sm font-medium text-gray-700">Taux d'Occupation</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {financialData.occupancyRate}%
              </p>
              <div className="flex items-center gap-1 text-sm text-blue-700">
                <ArrowUpRight className="w-4 h-4" />
                <span className="font-semibold">{financialData.occupancyChange}%</span>
                <span className="text-gray-600">vs mois dernier</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Monthly Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Détails Mensuels</h2>
          <div className="space-y-3">
            {financialData.monthlyBreakdown.map((month, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gradient-to-br from-gray-50/50 to-slate-50/50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all"
              >
                <div className="flex-1 mb-3 sm:mb-0">
                  <h4 className="text-lg font-bold text-gray-900">{month.month}</h4>
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Revenus</p>
                    <p className="font-bold text-green-700 text-lg">
                      €{month.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Dépenses</p>
                    <p className="font-bold text-red-700 text-lg">
                      €{month.expenses.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Bénéfice</p>
                    <p className="font-bold text-purple-700 text-lg">
                      €{month.profit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenus vs Dépenses</h2>
          <div className="relative overflow-hidden h-64 flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/50 rounded-2xl border border-purple-200/30">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-200/20 to-indigo-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-300/10 to-indigo-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="w-20 h-20 bg-gradient-to-br from-purple-200/70 to-indigo-200/70 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
              >
                <BarChart3 className="w-10 h-10 text-gray-700" />
              </motion.div>
              <p className="text-gray-600 text-lg font-medium">Visualisation à venir</p>
              <p className="text-sm text-gray-500 mt-2">Graphiques interactifs bientôt disponibles</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
