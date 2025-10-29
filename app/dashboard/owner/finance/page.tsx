'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/home/owner')}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-purple-900">Finance Report</h1>
              <p className="text-gray-600 mt-1">Comprehensive financial overview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">€{financialData.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-white/80 mt-1">↑ 12% from last month</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-red-400 to-red-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingDown className="h-5 w-5" />
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">€{financialData.totalExpenses.toLocaleString()}</p>
              <p className="text-sm text-white/80 mt-1">↑ 5% from last month</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-green-400 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5" />
                Net Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">€{financialData.netProfit.toLocaleString()}</p>
              <p className="text-sm text-white/80 mt-1">↑ 15% from last month</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <PieChart className="h-5 w-5" />
                Occupancy Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{financialData.occupancyRate}%</p>
              <p className="text-sm text-white/80 mt-1">↑ 3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Breakdown */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Financial Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.monthlyBreakdown.map((month, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-semibold">{month.month}</h4>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="font-semibold text-green-600">€{month.revenue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Expenses</p>
                      <p className="font-semibold text-red-600">€{month.expenses.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Profit</p>
                      <p className="font-semibold text-blue-600">
                        €{(month.revenue - month.expenses).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart Placeholder */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Revenue vs Expenses Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
              <p className="text-gray-500">Chart visualization coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
