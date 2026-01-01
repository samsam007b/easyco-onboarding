/**
 * Expense Charts
 * Recharts-based visualizations for expense tracking
 * - Area chart for expense progression over time
 * - Donut chart for category breakdown
 */

'use client';

import { useMemo } from 'react';
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
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';
import type { ExpenseWithDetails } from '@/types/finances.types';

// Category colors matching the app theme
const CATEGORY_COLORS: Record<string, string> = {
  rent: '#a855f7',      // purple
  utilities: '#3b82f6', // blue
  groceries: '#22c55e', // green
  cleaning: '#06b6d4',  // cyan
  maintenance: '#f97316', // orange
  internet: '#6366f1',  // indigo
  other: '#6b7280',     // gray
};

interface ExpenseChartsProps {
  expenses: ExpenseWithDetails[];
  period?: 'week' | 'month' | 'year';
}

// Helper to group expenses by date
interface GroupByDateOptions {
  locale: string;
  weekPrefix: string;
}

function groupByDate(
  expenses: ExpenseWithDetails[],
  period: 'week' | 'month' | 'year',
  options: GroupByDateOptions
) {
  const grouped = new Map<string, number>();
  const { locale, weekPrefix } = options;

  expenses.forEach((exp) => {
    const date = new Date(exp.date);
    let key: string;

    if (period === 'week') {
      // Group by day for weekly view
      key = date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric' });
    } else if (period === 'month') {
      // Group by week for monthly view
      const weekNum = Math.ceil(date.getDate() / 7);
      key = `${weekPrefix} ${weekNum}`;
    } else {
      // Group by month for yearly view
      key = date.toLocaleDateString(locale, { month: 'short' });
    }

    grouped.set(key, (grouped.get(key) || 0) + exp.amount);
  });

  return Array.from(grouped.entries()).map(([name, amount]) => ({
    name,
    amount: Math.round(amount * 100) / 100,
  }));
}

// Helper to group expenses by category
function groupByCategory(
  expenses: ExpenseWithDetails[],
  getCategoryLabel: (category: string) => string
) {
  const grouped = new Map<string, number>();

  expenses.forEach((exp) => {
    const cat = exp.category || 'other';
    grouped.set(cat, (grouped.get(cat) || 0) + exp.amount);
  });

  return Array.from(grouped.entries())
    .map(([category, amount]) => ({
      category,
      label: getCategoryLabel(category),
      amount: Math.round(amount * 100) / 100,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS.other,
    }))
    .sort((a, b) => b.amount - a.amount);
}

// Calculate trend
function calculateTrend(expenses: ExpenseWithDetails[], period: 'week' | 'month' | 'year') {
  const now = new Date();
  let currentStart: Date;
  let previousStart: Date;
  let previousEnd: Date;

  if (period === 'week') {
    currentStart = new Date(now);
    currentStart.setDate(now.getDate() - 7);
    previousEnd = new Date(currentStart);
    previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 7);
  } else if (period === 'month') {
    currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    previousEnd = new Date(currentStart);
  } else {
    currentStart = new Date(now.getFullYear(), 0, 1);
    previousStart = new Date(now.getFullYear() - 1, 0, 1);
    previousEnd = new Date(currentStart);
  }

  const currentTotal = expenses
    .filter((e) => new Date(e.date) >= currentStart)
    .reduce((sum, e) => sum + e.amount, 0);

  const previousTotal = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d >= previousStart && d < previousEnd;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  if (previousTotal === 0) return { percentage: 0, direction: 'neutral' as const };

  const percentage = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
  const direction = percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral';

  return { percentage: Math.abs(percentage), direction };
}

// Custom tooltip for area chart
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-100 text-sm">
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-gray-600">
        <span className="font-semibold text-[#ff651e]">€{payload[0].value.toFixed(2)}</span>
      </p>
    </div>
  );
}

/**
 * Area Chart - Expense progression over time
 */
export function ExpenseProgressChart({
  expenses,
  period = 'month',
}: ExpenseChartsProps) {
  const { language, getSection } = useLanguage();
  const charts = getSection('expenseCharts');

  // Locale mapping for date formatting
  const localeMap: Record<string, string> = {
    fr: 'fr-FR',
    en: 'en-US',
    nl: 'nl-NL',
    de: 'de-DE',
  };
  const locale = localeMap[language] || 'fr-FR';
  const weekPrefix = charts?.weekPrefix || 'Sem';

  const data = useMemo(
    () => groupByDate(expenses, period, { locale, weekPrefix }),
    [expenses, period, locale, weekPrefix]
  );
  const trend = useMemo(() => calculateTrend(expenses, period), [expenses, period]);
  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const periodLabel =
    period === 'week'
      ? charts?.thisWeek || 'cette semaine'
      : period === 'month'
        ? charts?.thisMonth || 'ce mois'
        : charts?.thisYear || 'cette année';

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {charts?.total || 'Total'} {periodLabel}
          </p>
          <p className="text-2xl font-bold text-gray-900">€{total.toFixed(2)}</p>
        </div>
        <div
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
            trend.direction === 'up' && 'bg-red-50 text-red-600',
            trend.direction === 'down' && 'bg-green-50 text-green-600',
            trend.direction === 'neutral' && 'bg-gray-50 text-gray-600'
          )}
        >
          {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
          {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
          {trend.direction === 'neutral' && <Minus className="w-3 h-3" />}
          <span>{trend.percentage}%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[140px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff651e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ff651e" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `€${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#ff651e"
              strokeWidth={2}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Donut Chart - Category breakdown
 */
export function CategoryBreakdownChart({ expenses }: { expenses: ExpenseWithDetails[] }) {
  const { getSection } = useLanguage();
  const charts = getSection('expenseCharts');

  // Helper to get translated category label
  const getCategoryLabel = (category: string): string => {
    const categoryMap: Record<string, string> = {
      rent: charts?.catRent || 'Loyer',
      utilities: charts?.catUtilities || 'Charges',
      groceries: charts?.catGroceries || 'Courses',
      cleaning: charts?.catCleaning || 'Ménage',
      maintenance: charts?.catMaintenance || 'Entretien',
      internet: charts?.catInternet || 'Internet',
      other: charts?.catOther || 'Autre',
    };
    return categoryMap[category] || category;
  };

  const data = useMemo(
    () => groupByCategory(expenses, getCategoryLabel),
    [expenses, charts]
  );
  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[180px] text-sm text-gray-500">
        {charts?.noData || 'Aucune donnée'}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Donut */}
      <div className="relative w-[120px] h-[120px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={55}
              dataKey="amount"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-gray-500">{charts?.total || 'Total'}</p>
            <p className="text-sm font-bold text-gray-900">€{Math.round(total)}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-1.5 min-w-0">
        {data.slice(0, 5).map((item) => (
          <div key={item.category} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600 truncate">{item.label}</span>
            </div>
            <span className="text-xs font-medium text-gray-900 tabular-nums flex-shrink-0">
              €{item.amount.toFixed(0)}
            </span>
          </div>
        ))}
        {data.length > 5 && (
          <p className="text-xs text-gray-400">
            {(charts?.othersCount || '+{count} autres').replace('{count}', String(data.length - 5))}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Mini sparkline for compact stat cards
 */
export function MiniSparkline({
  expenses,
  days = 7,
}: {
  expenses: ExpenseWithDetails[];
  days?: number;
}) {
  const data = useMemo(() => {
    const now = new Date();
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayTotal = expenses
        .filter((e) => e.date.split('T')[0] === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);

      result.push({ day: i, amount: dayTotal });
    }

    return result;
  }, [expenses, days]);

  return (
    <div className="h-[30px] w-[60px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff651e" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#ff651e" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#ff651e"
            strokeWidth={1.5}
            fill="url(#sparkGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
