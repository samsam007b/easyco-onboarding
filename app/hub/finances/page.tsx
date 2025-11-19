'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import HubLayout from '@/components/hub/HubLayout';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  ArrowRight,
  Plus,
  Check,
  X,
  Clock,
  ShoppingCart,
  Zap,
  Home,
  Wifi,
  Sparkles,
  Wrench,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

interface Expense {
  id: string;
  title: string;
  amount: number;
  paid_by_id: string;
  paid_by_name?: string;
  category: string;
  date: string;
  status: 'paid' | 'pending';
  property_id: string;
  description?: string;
  split_count?: number;
  your_share?: number;
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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'groceries',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setCurrentUserId(user.id);

      // Get user's property_id from property_members
      const { data: membership } = await supabase
        .from('property_members')
        .select('property_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (!membership?.property_id) {
        // No property membership found, redirect to setup
        console.log('❌ No property membership found, redirecting to setup...');
        router.push('/hub/setup-property');
        return;
      }

      setPropertyId(membership.property_id);

      // Fetch expenses with user names
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select(`
          id,
          title,
          amount,
          paid_by_id,
          category,
          date,
          status,
          property_id,
          description,
          expense_splits (
            user_id,
            amount_owed
          )
        `)
        .eq('property_id', membership.property_id)
        .order('date', { ascending: false })
        .limit(10);

      if (expensesError) throw expensesError;

      // Fetch user names for paid_by_id
      const userIds = expensesData?.map(exp => exp.paid_by_id) || [];
      const { data: usersData } = await supabase
        .from('user_profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', userIds);

      const userMap = new Map(
        usersData?.map(u => [u.user_id, `${u.first_name} ${u.last_name}`])
      );

      // Enrich expenses with user names and calculate splits
      const enrichedExpenses = expensesData?.map(exp => {
        const splitCount = exp.expense_splits?.length || 1;
        const yourSplit = exp.expense_splits?.find(s => s.user_id === user.id);

        return {
          id: exp.id,
          title: exp.title,
          amount: exp.amount,
          paid_by_id: exp.paid_by_id,
          paid_by_name: exp.paid_by_id === user.id ? 'Toi' : userMap.get(exp.paid_by_id) || 'Inconnu',
          category: exp.category,
          date: exp.date,
          status: exp.status as 'paid' | 'pending',
          property_id: exp.property_id,
          description: exp.description,
          split_count: splitCount,
          your_share: yourSplit?.amount_owed || (exp.amount / splitCount)
        };
      }) || [];

      setExpenses(enrichedExpenses);

      // Calculate balances (simplified version)
      // In a real app, you'd want a more sophisticated balance calculation
      const balanceMap = new Map<string, { name: string; amount: number }>();

      expensesData?.forEach(exp => {
        const splits = exp.expense_splits || [];
        splits.forEach(split => {
          if (split.user_id !== user.id) {
            const current = balanceMap.get(split.user_id) || { name: '', amount: 0 };

            // If I paid and they owe me
            if (exp.paid_by_id === user.id) {
              current.amount += split.amount_owed;
            }
            // If they paid and I owe them
            else if (exp.paid_by_id === split.user_id) {
              const mySplit = splits.find(s => s.user_id === user.id);
              if (mySplit) {
                current.amount -= mySplit.amount_owed;
              }
            }

            balanceMap.set(split.user_id, current);
          }
        });
      });

      // Fetch user names for balances
      const balanceUserIds = Array.from(balanceMap.keys());
      const { data: balanceUsers } = await supabase
        .from('user_profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', balanceUserIds);

      const balanceList: Balance[] = balanceUserIds.map(userId => {
        const userData = balanceUsers?.find(u => u.user_id === userId);
        const balanceData = balanceMap.get(userId)!;

        return {
          userId,
          userName: userData ? `${userData.first_name} ${userData.last_name}` : 'Inconnu',
          amount: balanceData.amount
        };
      }).filter(b => Math.abs(b.amount) > 0.01); // Filter out zero balances

      setBalances(balanceList);

      // Si pas de données réelles, utiliser des données de démo
      if (enrichedExpenses.length === 0) {
        console.log('📊 No real data found, using mock data for demo purposes');
        const mockExpenses: Expense[] = [
          {
            id: '1',
            title: 'Courses de la semaine',
            amount: 85.50,
            paid_by_id: user.id,
            paid_by_name: 'Toi',
            category: 'groceries',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'paid',
            property_id: 'demo',
            description: 'Supermarché Carrefour',
            split_count: 3,
            your_share: 28.50
          },
          {
            id: '2',
            title: 'Facture Internet',
            amount: 29.99,
            paid_by_id: 'user2',
            paid_by_name: 'Marie',
            category: 'internet',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'paid',
            property_id: 'demo',
            description: 'Fibre Orange',
            split_count: 3,
            your_share: 10.00
          },
          {
            id: '3',
            title: 'Produits ménagers',
            amount: 32.40,
            paid_by_id: user.id,
            paid_by_name: 'Toi',
            category: 'cleaning',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'paid',
            property_id: 'demo',
            split_count: 3,
            your_share: 10.80
          },
          {
            id: '4',
            title: 'Électricité',
            amount: 68.75,
            paid_by_id: 'user3',
            paid_by_name: 'Thomas',
            category: 'utilities',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'paid',
            property_id: 'demo',
            split_count: 3,
            your_share: 22.92
          },
          {
            id: '5',
            title: 'Pizza party',
            amount: 45.00,
            paid_by_id: 'user2',
            paid_by_name: 'Marie',
            category: 'groceries',
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            property_id: 'demo',
            split_count: 3,
            your_share: 15.00
          }
        ];

        const mockBalances: Balance[] = [
          {
            userId: 'user2',
            userName: 'Marie Dupont',
            amount: -15.00
          },
          {
            userId: 'user3',
            userName: 'Thomas Martin',
            amount: 18.70
          }
        ];

        setExpenses(mockExpenses);
        setBalances(mockBalances);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);

      // Si pas de données, utiliser des données de démo
      if (expenses.length === 0) {
        console.log('📊 Using mock data for demo purposes');
        const mockExpenses: Expense[] = [
          {
            id: '1',
            title: 'Courses de la semaine',
            amount: 85.50,
            paid_by_id: currentUserId || 'user1',
            paid_by_name: 'Toi',
            category: 'groceries',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'paid',
            property_id: 'demo',
            description: 'Supermarché Carrefour',
            split_count: 3,
            your_share: 28.50
          },
          {
            id: '2',
            title: 'Facture Internet',
            amount: 29.99,
            paid_by_id: 'user2',
            paid_by_name: 'Marie',
            category: 'internet',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'paid',
            property_id: 'demo',
            description: 'Fibre Orange',
            split_count: 3,
            your_share: 10.00
          },
          {
            id: '3',
            title: 'Produits ménagers',
            amount: 32.40,
            paid_by_id: currentUserId || 'user1',
            paid_by_name: 'Toi',
            category: 'cleaning',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'paid',
            property_id: 'demo',
            split_count: 3,
            your_share: 10.80
          },
          {
            id: '4',
            title: 'Électricité',
            amount: 68.75,
            paid_by_id: 'user3',
            paid_by_name: 'Thomas',
            category: 'utilities',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'paid',
            property_id: 'demo',
            split_count: 3,
            your_share: 22.92
          },
          {
            id: '5',
            title: 'Pizza party',
            amount: 45.00,
            paid_by_id: 'user2',
            paid_by_name: 'Marie',
            category: 'groceries',
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            property_id: 'demo',
            split_count: 3,
            your_share: 15.00
          }
        ];

        const mockBalances: Balance[] = [
          {
            userId: 'user2',
            userName: 'Marie Dupont',
            amount: -15.00 // Tu lui dois 15€
          },
          {
            userId: 'user3',
            userName: 'Thomas Martin',
            amount: 18.70 // Il te doit 18.70€
          }
        ];

        setExpenses(mockExpenses);
        setBalances(mockBalances);
      }

      setIsLoading(false);
    }
  };

  const createExpense = async () => {
    if (!currentUserId || !propertyId) {
      console.error('❌ Cannot create expense:', { currentUserId, propertyId });
      alert('Erreur: Vous devez être membre d\'une propriété pour créer une dépense');
      return;
    }
    if (!newExpense.title || !newExpense.amount) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the expense
      const { data: expense, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          property_id: propertyId,
          created_by: currentUserId,
          paid_by_id: currentUserId,
          title: newExpense.title,
          description: newExpense.description || null,
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          date: newExpense.date,
          status: 'pending',
        })
        .select()
        .single();

      if (expenseError) {
        console.error('Error creating expense:', expenseError);
        throw expenseError;
      }

      console.log('✅ Expense created:', expense);

      // Create expense split (for now, just for the current user)
      const { error: splitError } = await supabase
        .from('expense_splits')
        .insert({
          expense_id: expense.id,
          user_id: currentUserId,
          amount_owed: parseFloat(newExpense.amount),
          paid: false,
        });

      if (splitError) {
        console.error('Error creating split:', splitError);
        throw splitError;
      }

      console.log('✅ Expense split created');

      // Reset form
      setNewExpense({
        title: '',
        amount: '',
        category: 'groceries',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });

      // Close modal
      setShowCreateModal(false);

      console.log('🔄 Reloading data...');

      // Reload data
      await loadData();

      console.log('✅ Data reloaded successfully');
    } catch (error: any) {
      console.error('❌ Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      alert(`Erreur: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const yourShare = expenses.reduce((sum, exp) => sum + (exp.your_share || 0), 0);
  const totalBalance = balances.reduce((sum, bal) => sum + bal.amount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <HubLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
               style={{
                 background: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)'
               }}>
            <DollarSign className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Finances Partagées
          </h1>
        </div>
        <p className="text-gray-600 ml-17">
          Gérez vos dépenses et vos remboursements entre colocataires
        </p>
      </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-transparent hover:border-orange-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center"
                   style={{
                     background: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)'
                   }}>
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">Ce mois</Badge>
            </div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dépenses Totales</h3>
            <p className="text-4xl font-bold text-gray-900">€{totalExpenses.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-transparent hover:border-orange-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">Ta part</Badge>
            </div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ton Total</h3>
            <p className="text-4xl font-bold text-gray-900">€{yourShare.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={cn(
              "bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border",
              totalBalance >= 0 ? "border-transparent hover:border-green-200" : "border-transparent hover:border-red-200"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center",
                totalBalance >= 0
                  ? "bg-gradient-to-br from-emerald-500 to-green-600"
                  : "bg-gradient-to-br from-red-500 to-rose-600"
              )}>
                {totalBalance >= 0 ? (
                  <TrendingUp className="w-7 h-7 text-white" />
                ) : (
                  <TrendingDown className="w-7 h-7 text-white" />
                )}
              </div>
              <Badge className={cn(
                totalBalance >= 0
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200"
              )}>
                Solde
              </Badge>
            </div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {totalBalance >= 0 ? 'On te doit' : 'Tu dois'}
            </h3>
            <p className={cn(
              "text-4xl font-bold",
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
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all p-6 border border-transparent"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Dépenses Récentes</h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  onClick={() => setShowCreateModal(true)}
                  className="rounded-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] hover:shadow-lg transition-shadow"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </motion.div>
            </div>

            <div className="space-y-3">
              {expenses.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
                    <DollarSign className="w-10 h-10 text-orange-500" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-2">Aucune dépense enregistrée</p>
                  <p className="text-sm text-gray-500">Ajoutez votre première dépense pour commencer</p>
                </div>
              ) : (
                expenses.map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-orange-50/30 rounded-2xl hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-orange-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                           style={{
                             background: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)'
                           }}>
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors truncate">{expense.title}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <span className="truncate">Payé par {expense.paid_by_name}</span>
                          <span>•</span>
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="flex-shrink-0">{new Date(expense.date).toLocaleDateString('fr-FR')}</span>
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                            Ta part: €{(expense.your_share || 0).toFixed(2)}
                          </Badge>
                          <Badge className={cn(
                            "text-xs",
                            expense.status === 'paid'
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                          )}>
                            {expense.status === 'paid' ? (
                              <><Check className="w-3 h-3 mr-1 inline" />Payé</>
                            ) : (
                              <><Clock className="w-3 h-3 mr-1 inline" />En attente</>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        €{expense.amount.toFixed(2)}
                      </p>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all ml-auto mt-1" />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Balances */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all p-6 border border-transparent"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Soldes Entre Colocataires</h3>

            <div className="space-y-3">
              {balances.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                    <Users className="w-10 h-10 text-green-500" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-2">Aucun solde à afficher</p>
                  <p className="text-sm text-gray-500">Tous les comptes sont équilibrés</p>
                </div>
              ) : (
                balances.map((balance, index) => (
                <motion.div
                  key={balance.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className={cn(
                    "group flex items-center justify-between p-4 rounded-2xl hover:shadow-md transition-all cursor-pointer border",
                    balance.amount >= 0
                      ? "bg-gradient-to-r from-green-50 to-emerald-50/30 border-transparent hover:border-green-200"
                      : "bg-gradient-to-r from-red-50 to-rose-50/30 border-transparent hover:border-red-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md",
                      balance.amount >= 0
                        ? "bg-gradient-to-br from-emerald-500 to-green-600"
                        : "bg-gradient-to-br from-red-500 to-rose-600"
                    )}>
                      {balance.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{balance.userName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {balance.amount >= 0 ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-green-600" />
                            <p className="text-xs text-green-600 font-medium">Te doit</p>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 text-red-600" />
                            <p className="text-xs text-red-600 font-medium">Tu lui dois</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-xl font-bold mb-1",
                      balance.amount >= 0 ? "text-emerald-600" : "text-red-600"
                    )}>
                      {balance.amount >= 0 ? '+' : ''}€{Math.abs(balance.amount).toFixed(2)}
                    </p>
                    {balance.amount < 0 ? (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="sm" className="rounded-full text-xs bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]">
                          <Check className="w-3 h-3 mr-1" />
                          Rembourser
                        </Button>
                      </motion.div>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all ml-auto" />
                    )}
                  </div>
                </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

      {/* Create Expense Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent">
              Nouvelle Dépense
            </DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle dépense à partager avec vos colocataires
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Titre *
              </Label>
              <Input
                id="title"
                placeholder="Ex: Courses de la semaine"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                className="rounded-xl"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold">
                Montant (€) *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="rounded-xl"
              />
            </div>

            {/* Category */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Catégorie</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'groceries', label: 'Courses', icon: ShoppingCart },
                  { value: 'utilities', label: 'Factures', icon: Zap },
                  { value: 'rent', label: 'Loyer', icon: Home },
                  { value: 'internet', label: 'Internet', icon: Wifi },
                  { value: 'cleaning', label: 'Ménage', icon: Sparkles },
                  { value: 'maintenance', label: 'Entretien', icon: Wrench },
                  { value: 'other', label: 'Autre', icon: Package },
                ].map((category) => {
                  const Icon = category.icon;
                  const isSelected = newExpense.category === category.value;
                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => setNewExpense({ ...newExpense, category: category.value })}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all',
                        'hover:border-orange-300 hover:bg-orange-50',
                        isSelected
                          ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-sm'
                          : 'border-gray-200 bg-white'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-5 h-5',
                          isSelected ? 'text-orange-600' : 'text-gray-400'
                        )}
                      />
                      <span
                        className={cn(
                          'text-sm font-medium',
                          isSelected ? 'text-orange-700' : 'text-gray-700'
                        )}
                      >
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="rounded-xl"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Détails supplémentaires (optionnel)"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={createExpense}
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] hover:shadow-lg transition-shadow"
            >
              {isSubmitting ? 'Création...' : 'Créer la dépense'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </HubLayout>
  );
}
