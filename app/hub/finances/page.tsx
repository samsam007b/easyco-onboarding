/**
 * Modern Finances Page with OCR Scanner & Smart Splitter
 * Complete expense management for residents
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import HubLayout from '@/components/hub/HubLayout';
import ExpenseScanner, { type ScanResult } from '@/components/finances/ExpenseScanner';
import SmartSplitter from '@/components/finances/SmartSplitter';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  ArrowRight,
  Plus,
  Check,
  Clock,
  Download,
  Scan,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { expenseService } from '@/lib/services/expense-service';
import type { ExpenseWithDetails, Balance, SplitConfig } from '@/types/finances.types';

type CreateMode = 'scanner' | 'splitter' | null;

export default function ModernFinancesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<ExpenseWithDetails[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [roommates, setRoommates] = useState<Array<{ id: string; name: string }>>([]);

  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setCurrentUserId(user.id);

      // Get property membership
      const { data: membershipData, error: memberError } = await supabase.rpc(
        'get_user_property_membership',
        { p_user_id: user.id }
      );

      if (memberError || !membershipData?.property_id) {
        console.log('❌ No property membership found');
        setIsLoading(false);
        return;
      }

      setPropertyId(membershipData.property_id);

      // Load expenses
      const expensesData = await expenseService.getPropertyExpenses(
        membershipData.property_id,
        user.id
      );
      setExpenses(expensesData);

      // Load balances
      const balancesData = await expenseService.calculateBalances(
        membershipData.property_id,
        user.id
      );
      setBalances(balancesData);

      // Load roommates (for splitter)
      const { data: members } = await supabase
        .from('property_members')
        .select(
          `
          user_id,
          users (
            full_name
          )
        `
        )
        .eq('property_id', membershipData.property_id)
        .eq('status', 'active');

      if (members) {
        const roommatesData = members.map((m: any) => ({
          id: m.user_id,
          name: m.users?.full_name || 'Inconnu',
        }));
        setRoommates(roommatesData);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('[Finances] Error loading data:', error);
      setIsLoading(false);
    }
  };

  // Handle expense scan completion
  const handleScanComplete = (result: ScanResult) => {
    setScanResult(result);
    setCreateMode('splitter');
  };

  // Handle split completion and create expense
  const handleSplitComplete = async (splitConfig: SplitConfig) => {
    if (!currentUserId || !propertyId || !scanResult) {
      alert('Erreur: Données manquantes');
      return;
    }

    setIsCreating(true);

    try {
      const result = await expenseService.createExpense(
        propertyId,
        currentUserId,
        {
          title: scanResult.title,
          amount: scanResult.amount.toString(),
          category: scanResult.category,
          description: scanResult.description,
          date: scanResult.date,
          receipt: scanResult.receiptFile,
        },
        splitConfig
      );

      if (result.success) {
        console.log('✅ Expense created successfully');
        setCreateMode(null);
        setScanResult(null);
        await loadData(); // Reload expenses
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error: any) {
      console.error('[Finances] Error creating expense:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  // Export expenses to PDF
  const handleExport = async () => {
    if (!propertyId) return;

    try {
      const result = await expenseService.exportToPDF(propertyId, 'Ma Résidence', {
        format: 'pdf',
      });

      // Download file
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[Finances] Export error:', error);
      alert('Erreur lors de l\'export');
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const yourShare = expenses.reduce((sum, exp) => sum + (exp.your_share || 0), 0);
  const totalBalance = balances.reduce((sum, bal) => sum + bal.amount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">Chargement...</p>
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
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="relative w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg grain-medium"
              style={{
                background:
                  'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
              }}
            >
              <DollarSign className="w-7 h-7 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Finances Partagées
              </h1>
              <p className="text-gray-600">
                Gérez vos dépenses avec scan OCR intelligent
              </p>
            </div>
          </div>

          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="hidden md:flex rounded-full border-gray-200 hover:border-transparent"
            style={{ color: '#ee5736' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(217, 87, 79, 0.08) 0%, rgba(255, 128, 23, 0.08) 100%)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Download className="w-4 h-4 mr-2" style={{ color: '#ee5736' }} />
            Export PDF
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="relative w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center shadow-md grain-medium"
              style={{
                background:
                  'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
              }}
            >
              <DollarSign className="w-7 h-7 text-white relative z-10" />
            </div>
            <Badge className="text-xs border-none text-white" style={{ background: 'rgba(217, 87, 79, 0.8)' }}>
              Ce mois
            </Badge>
          </div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Dépenses Totales
          </h3>
          <p className="text-4xl font-bold text-gray-900">
            €{totalExpenses.toFixed(2)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="relative w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center shadow-md grain-subtle"
              style={{
                background: 'linear-gradient(135deg, #ff5b21 0%, #ff8017 100%)',
              }}
            >
              <Users className="w-7 h-7 text-white relative z-10" />
            </div>
            <Badge className="text-xs border-none text-white" style={{ background: 'rgba(255, 91, 33, 0.8)' }}>
              Ta part
            </Badge>
          </div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Ton Total
          </h3>
          <p className="text-4xl font-bold text-gray-900">€{yourShare.toFixed(2)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={cn(
            'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border',
            totalBalance >= 0
              ? 'border-transparent hover:border-green-200'
              : 'border-transparent hover:border-red-200'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={cn(
                'relative w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center shadow-md',
                totalBalance >= 0
                  ? 'bg-gradient-to-br from-emerald-500 to-green-600 grain-subtle'
                  : 'bg-gradient-to-br from-red-500 to-rose-600 grain-subtle'
              )}
            >
              {totalBalance >= 0 ? (
                <TrendingUp className="w-7 h-7 text-white relative z-10" />
              ) : (
                <TrendingDown className="w-7 h-7 text-white relative z-10" />
              )}
            </div>
            <Badge
              className={cn(
                totalBalance >= 0
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-red-100 text-red-700 border-red-200'
              )}
            >
              Solde
            </Badge>
          </div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {totalBalance >= 0 ? 'On te doit' : 'Tu dois'}
          </h3>
          <p
            className={cn(
              'text-4xl font-bold',
              totalBalance >= 0 ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {totalBalance >= 0 ? '+' : ''}€{totalBalance.toFixed(2)}
          </p>
        </motion.div>
      </div>

      {/* Quick Action: Add Expense with Scanner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <button
          onClick={() => setCreateMode('scanner')}
          className="w-full text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] flex items-center justify-between group"
          style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Scan className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold mb-1">Scanner un ticket</h3>
              <p className="text-sm text-white/80">
                OCR intelligent + split automatique
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
          </div>
        </button>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Dépenses Récentes</h3>
          </div>

          <div className="space-y-3">
            {expenses.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div
                  className="relative w-20 h-20 mx-auto mb-4 rounded-3xl overflow-hidden flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(217, 87, 79, 0.12) 0%, rgba(255, 128, 23, 0.2) 100%)',
                  }}
                >
                  <DollarSign
                    className="w-10 h-10 relative z-10"
                    style={{ color: '#ee5736' }}
                  />
                </div>
                <p className="font-semibold text-gray-900 mb-2">
                  Aucune dépense enregistrée
                </p>
                <p className="text-sm text-gray-500">
                  Scannez votre premier ticket pour commencer
                </p>
              </div>
            ) : (
              expenses.slice(0, 5).map((expense, index) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-[#fff5f3] rounded-2xl hover:shadow-md transition-all cursor-pointer border border-gray-100"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{
                        background:
                          'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)',
                      }}
                    >
                      <DollarSign className="w-6 h-6 text-white relative z-10" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {expense.title}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <span className="truncate">Payé par {expense.paid_by_name}</span>
                        <span>•</span>
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="flex-shrink-0">
                          {new Date(expense.date).toLocaleDateString('fr-FR')}
                        </span>
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge className="text-xs border-none text-white" style={{ background: 'rgba(217, 87, 79, 0.8)' }}>
                          Ta part: €{(expense.your_share || 0).toFixed(2)}
                        </Badge>
                        {expense.receipt_image_url && (
                          <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                            <Scan className="w-3 h-3 mr-1 inline" />
                            OCR
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-xl font-bold text-gray-900">
                      €{expense.amount.toFixed(2)}
                    </p>
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
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Soldes Entre Colocataires
          </h3>

          <div className="space-y-3">
            {balances.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <p className="font-semibold text-gray-900 mb-2">Tout est réglé !</p>
                <p className="text-sm text-gray-500">
                  Aucun solde en attente
                </p>
              </div>
            ) : (
              balances.map((balance, index) => (
                <motion.div
                  key={balance.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className={cn(
                    'group flex items-center justify-between p-4 rounded-2xl hover:shadow-md transition-all cursor-pointer border',
                    balance.amount >= 0
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50/30 border-transparent hover:border-green-200'
                      : 'bg-gradient-to-r from-red-50 to-rose-50/30 border-transparent hover:border-red-200'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md',
                        balance.amount >= 0
                          ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                          : 'bg-gradient-to-br from-red-500 to-rose-600'
                      )}
                    >
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
                            <p className="text-xs text-red-600 font-medium">
                              Tu lui dois
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        'text-xl font-bold mb-1',
                        balance.amount >= 0 ? 'text-emerald-600' : 'text-red-600'
                      )}
                    >
                      {balance.amount >= 0 ? '+' : ''}€
                      {Math.abs(balance.amount).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Expense Creation Modal */}
      <Dialog open={createMode !== null} onOpenChange={() => setCreateMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            {createMode === 'scanner' ? 'Scanner un ticket' : 'Répartir la dépense'}
          </DialogTitle>
          <AnimatePresence mode="wait">
            {createMode === 'scanner' && (
              <ExpenseScanner
                onComplete={handleScanComplete}
                onCancel={() => setCreateMode(null)}
              />
            )}

            {createMode === 'splitter' && scanResult && (
              <div>
                {isCreating ? (
                  <div className="text-center py-16">
                    <LoadingHouse size={64} />
                    <p className="text-gray-600 font-medium mt-4">
                      Création de la dépense...
                    </p>
                  </div>
                ) : (
                  <SmartSplitter
                    totalAmount={scanResult.amount}
                    roommates={roommates}
                    onComplete={handleSplitComplete}
                    onBack={() => setCreateMode('scanner')}
                  />
                )}
              </div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </HubLayout>
  );
}
