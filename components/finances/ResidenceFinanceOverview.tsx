/**
 * Residence Finance Overview
 * Global view of all residence expenses and contributions
 * Premium compact design matching Messages page style
 */

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Receipt,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import type { ExpenseWithDetails, Balance } from '@/types/finances.types';
import { MiniSparkline } from './ExpenseCharts';

interface ResidenceFinanceOverviewProps {
  expenses: ExpenseWithDetails[];
  balances: Balance[];
  roommates: Array<{ id: string; name: string }>;
  currentUserId: string;
}

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  trend?: { direction: 'up' | 'down' | 'neutral'; value: string };
  sparkline?: React.ReactNode;
  accent?: boolean;
}

function StatCard({ label, value, subValue, icon, trend, sparkline, accent }: StatCardProps) {
  return (
    <div
      className={cn(
        'p-3 rounded-xl border transition-all',
        accent
          ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-100'
          : 'bg-white border-gray-100 hover:border-gray-200'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
          <p className={cn('text-lg font-bold truncate', accent ? 'text-[#ee5736]' : 'text-gray-900')}>
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              accent
                ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                : 'bg-gray-100 text-gray-600'
            )}
          >
            {icon}
          </div>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium',
                trend.direction === 'up' && 'text-red-500',
                trend.direction === 'down' && 'text-green-500',
                trend.direction === 'neutral' && 'text-gray-400'
              )}
            >
              {trend.direction === 'up' && <ArrowUpRight className="w-3 h-3" />}
              {trend.direction === 'down' && <ArrowDownRight className="w-3 h-3" />}
              <span>{trend.value}</span>
            </div>
          )}
          {sparkline}
        </div>
      </div>
    </div>
  );
}

interface ContributorRowProps {
  name: string;
  amount: number;
  total: number;
  isCurrentUser: boolean;
  youLabel: string;
}

function ContributorRow({ name, amount, total, isCurrentUser, youLabel }: ContributorRowProps) {
  const percentage = total > 0 ? (amount / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0',
          isCurrentUser
            ? 'bg-gradient-to-br from-orange-500 to-red-500'
            : 'bg-gradient-to-br from-gray-400 to-gray-500'
        )}
      >
        {(isCurrentUser ? youLabel : name).charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-900 truncate">
            {isCurrentUser ? youLabel : name}
          </span>
          <span className="text-sm font-semibold text-gray-900 tabular-nums">
            €{amount.toFixed(2)}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full',
              isCurrentUser
                ? 'bg-gradient-to-r from-orange-500 to-red-500'
                : 'bg-gray-400'
            )}
          />
        </div>
      </div>
      <span className="text-xs text-gray-500 tabular-nums flex-shrink-0">
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
}

export default function ResidenceFinanceOverview({
  expenses,
  balances,
  roommates,
  currentUserId,
}: ResidenceFinanceOverviewProps) {
  const { getSection } = useLanguage();
  const overview = getSection('financeOverview');

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total residence expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // This month's expenses
    const thisMonthExpenses = expenses
      .filter((e) => new Date(e.date) >= thisMonth)
      .reduce((sum, e) => sum + e.amount, 0);

    // Last month's expenses
    const lastMonthExpenses = expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d >= lastMonth && d <= lastMonthEnd;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    // Month over month trend
    const monthTrend = lastMonthExpenses > 0
      ? Math.round(((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100)
      : 0;

    // Your share this month
    const yourShareThisMonth = expenses
      .filter((e) => new Date(e.date) >= thisMonth)
      .reduce((sum, e) => sum + (e.your_share || 0), 0);

    // Contribution by person
    const contributionByPerson = new Map<string, number>();
    expenses.forEach((e) => {
      if (e.paid_by_id) {
        contributionByPerson.set(
          e.paid_by_id,
          (contributionByPerson.get(e.paid_by_id) || 0) + e.amount
        );
      }
    });

    // Your balance
    const yourBalance = balances.reduce((sum, b) => sum + b.amount, 0);

    // Average per expense
    const avgPerExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

    return {
      totalExpenses,
      thisMonthExpenses,
      lastMonthExpenses,
      monthTrend,
      yourShareThisMonth,
      contributionByPerson,
      yourBalance,
      avgPerExpense,
      expenseCount: expenses.length,
    };
  }, [expenses, balances]);

  // Format contributors list
  const contributors = useMemo(() => {
    const list: { id: string; name: string; amount: number }[] = [];

    roommates.forEach((r) => {
      list.push({
        id: r.id,
        name: r.name,
        amount: stats.contributionByPerson.get(r.id) || 0,
      });
    });

    // Sort by amount descending
    list.sort((a, b) => b.amount - a.amount);

    return list;
  }, [roommates, stats.contributionByPerson]);

  return (
    <div className="space-y-4">
      {/* Main Stats Grid - Compact 2x2 */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          label={overview?.totalResidence || 'Total résidence'}
          value={`€${stats.totalExpenses.toFixed(0)}`}
          subValue={(overview?.expensesCount || '{count} dépenses').replace('{count}', String(stats.expenseCount))}
          icon={<DollarSign className="w-4 h-4" />}
          accent
        />
        <StatCard
          label={overview?.thisMonth || 'Ce mois'}
          value={`€${stats.thisMonthExpenses.toFixed(0)}`}
          icon={<Calendar className="w-4 h-4" />}
          trend={{
            direction: stats.monthTrend > 0 ? 'up' : stats.monthTrend < 0 ? 'down' : 'neutral',
            value: `${Math.abs(stats.monthTrend)}%`,
          }}
        />
        <StatCard
          label={overview?.yourShareThisMonth || 'Ta part ce mois'}
          value={`€${stats.yourShareThisMonth.toFixed(0)}`}
          icon={<Users className="w-4 h-4" />}
          sparkline={<MiniSparkline expenses={expenses} days={7} />}
        />
        <StatCard
          label={overview?.yourBalance || 'Ton solde'}
          value={`€${Math.abs(stats.yourBalance).toFixed(0)}`}
          subValue={stats.yourBalance >= 0
            ? (overview?.youAreOwed || 'On te doit')
            : (overview?.youOwe || 'Tu dois')}
          icon={<PiggyBank className="w-4 h-4" />}
        />
      </div>

      {/* Contributors Breakdown */}
      {contributors.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-gray-600" />
            </div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {overview?.contributions || 'Contributions'}
            </h4>
          </div>
          <div className="space-y-1">
            {contributors.map((c) => (
              <ContributorRow
                key={c.id}
                name={c.name}
                amount={c.amount}
                total={stats.totalExpenses}
                isCurrentUser={c.id === currentUserId}
                youLabel={overview?.you || 'Toi'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
