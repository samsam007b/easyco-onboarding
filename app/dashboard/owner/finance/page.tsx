'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FinanceReportPage() {
  const router = useRouter();

  const financialData = {
    totalRevenue: 12450,
    totalExpenses: 3200,
    netProfit: 9250,
    occupancyRate: 85,
    monthlyBreakdown: [
      { month: 'Jan', revenue: 10200, expenses: 2800 },
      { month: 'Feb', revenue: 10800, expenses: 2950 },
      { month: 'Mar', revenue: 11200, expenses: 3100 },
      { month: 'Apr', revenue: 12450, expenses: 3200 },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/home/owner')}
              className="rounded-full hover:scale-105 transition-transform"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-900 to-purple-700 bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                Rapport Financier
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Vue d'ensemble complète de vos finances
              </p>
            </div>
          </div>

          {/* KPI Cards - Elegant subtle design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">Revenus Totaux</p>
              </div>
              <p className="text-3xl font-bold text-amber-900 mb-1">
                €{financialData.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-amber-700">↑ 12% vs mois dernier</p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-sm">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">Dépenses Totales</p>
              </div>
              <p className="text-3xl font-bold text-rose-900 mb-1">
                €{financialData.totalExpenses.toLocaleString()}
              </p>
              <p className="text-sm text-rose-700">↑ 5% vs mois dernier</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">Bénéfice Net</p>
              </div>
              <p className="text-3xl font-bold text-emerald-900 mb-1">
                €{financialData.netProfit.toLocaleString()}
              </p>
              <p className="text-sm text-emerald-700">↑ 15% vs mois dernier</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">Taux d'Occupation</p>
              </div>
              <p className="text-3xl font-bold text-blue-900 mb-1">
                {financialData.occupancyRate}%
              </p>
              <p className="text-sm text-blue-700">↑ 3% vs mois dernier</p>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Détails Mensuels</h2>
          <div className="space-y-3">
            {financialData.monthlyBreakdown.map((month, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex-1 mb-3 sm:mb-0">
                  <h4 className="text-lg font-semibold text-gray-900">{month.month}</h4>
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-600 mb-1">Revenus</p>
                    <p className="font-bold text-emerald-700 text-lg">
                      €{month.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-600 mb-1">Dépenses</p>
                    <p className="font-bold text-rose-700 text-lg">
                      €{month.expenses.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-600 mb-1">Bénéfice</p>
                    <p className="font-bold text-purple-700 text-lg">
                      €{(month.revenue - month.expenses).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenus vs Dépenses</h2>
          <div className="relative overflow-hidden h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50/30 rounded-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-200/20 to-purple-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-300/10 to-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 text-lg">Visualisation à venir</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
