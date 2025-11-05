'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  ArrowRight,
  Plus,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  date: string;
  status: 'paid' | 'pending';
}

interface Balance {
  userId: string;
  userName: string;
  amount: number; // Positive = owes you, Negative = you owe them
}

export default function HubFinancesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      title: 'Courses Carrefour',
      amount: 120.50,
      paidBy: 'Sarah',
      splitBetween: ['Sarah', 'Marc', 'Julie', 'Toi'],
      date: '2024-11-01',
      status: 'paid'
    },
    {
      id: '2',
      title: 'Internet Fibre',
      amount: 40,
      paidBy: 'Toi',
      splitBetween: ['Sarah', 'Marc', 'Julie', 'Toi'],
      date: '2024-10-30',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Netflix Premium',
      amount: 17.99,
      paidBy: 'Marc',
      splitBetween: ['Marc', 'Julie', 'Toi'],
      date: '2024-10-28',
      status: 'paid'
    }
  ]);

  const [balances, setBalances] = useState<Balance[]>([
    { userId: '1', userName: 'Sarah', amount: -30.12 },
    { userId: '2', userName: 'Marc', amount: 15.00 },
    { userId: '3', userName: 'Julie', amount: -5.99 }
  ]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/login');
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const yourShare = expenses.reduce((sum, exp) =>
    sum + (exp.splitBetween.includes('Toi') ? exp.amount / exp.splitBetween.length : 0), 0
  );
  const totalBalance = balances.reduce((sum, bal) => sum + bal.amount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4 rounded-full"
          >
            ← Retour au hub
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Finances Partagées
          </h1>
          <p className="text-gray-600">
            Gérez vos dépenses et vos remboursements entre colocataires
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFA040] to-[#FFB85C] flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <Badge>Ce mois</Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Dépenses Totales</h3>
            <p className="text-3xl font-bold text-gray-900">€{totalExpenses.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <Badge>Ta part</Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Ton Total</h3>
            <p className="text-3xl font-bold text-gray-900">€{yourShare.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                totalBalance >= 0
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-700"
                  : "bg-gradient-to-br from-red-500 to-red-700"
              )}>
                {totalBalance >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-white" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-white" />
                )}
              </div>
              <Badge variant={totalBalance >= 0 ? 'success' : 'error'}>Solde</Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              {totalBalance >= 0 ? 'On te doit' : 'Tu dois'}
            </h3>
            <p className={cn(
              "text-3xl font-bold",
              totalBalance >= 0 ? "text-emerald-600" : "text-red-600"
            )}>
              {totalBalance >= 0 ? '+' : ''}€{totalBalance.toFixed(2)}
            </p>
          </motion.div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Dépenses Récentes</h3>
              <Button
                size="sm"
                className="rounded-full bg-gradient-to-r from-orange-600 to-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>

            <div className="space-y-3">
              {expenses.map((expense, index) => {
                const shareAmount = expense.amount / expense.splitBetween.length;

                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{expense.title}</p>
                        <p className="text-xs text-gray-500">
                          Payé par {expense.paidBy} • {new Date(expense.date).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Ta part: €{shareAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">€{expense.amount.toFixed(2)}</p>
                      <Badge variant={expense.status === 'paid' ? 'success' : 'warning'}>
                        {expense.status === 'paid' ? 'Payé' : 'En attente'}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Balances */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Soldes Entre Colocataires</h3>

            <div className="space-y-3">
              {balances.map((balance, index) => (
                <motion.div
                  key={balance.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                      balance.amount >= 0 ? "bg-emerald-600" : "bg-red-600"
                    )}>
                      {balance.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{balance.userName}</p>
                      <p className="text-xs text-gray-500">
                        {balance.amount >= 0 ? 'Te doit' : 'Tu lui dois'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-lg font-bold",
                      balance.amount >= 0 ? "text-emerald-600" : "text-red-600"
                    )}>
                      {balance.amount >= 0 ? '+' : ''}€{Math.abs(balance.amount).toFixed(2)}
                    </p>
                    {balance.amount < 0 && (
                      <Button size="sm" className="mt-2 rounded-full text-xs">
                        Rembourser
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
