/**
 * Modern Finances Page with OCR Scanner & Smart Splitter
 * Premium compact UI with charts and analytics
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
import ExpenseDetailModal from '@/components/finances/ExpenseDetailModal';
import ExpenseHistoryModal from '@/components/finances/ExpenseHistoryModal';
import CompactExpenseList from '@/components/finances/CompactExpenseList';
import { ExpenseProgressChart, CategoryBreakdownChart, MiniSparkline } from '@/components/finances/ExpenseCharts';
import ResidenceFinanceOverview from '@/components/finances/ResidenceFinanceOverview';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  ArrowRight,
  Check,
  Download,
  Scan,
  Sparkles,
  ChevronRight,
  BarChart3,
  PieChart,
  Receipt,
} from 'lucide-react';
import { toast } from 'sonner';
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

  // New modal states
  const [selectedExpense, setSelectedExpense] = useState<ExpenseWithDetails | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyInitialView, setHistoryInitialView] = useState<'list' | 'calendar'>('list');

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
      toast.error('Erreur: Données manquantes');
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
        setCreateMode(null);
        setScanResult(null);
        await loadData();

        toast.success('Dépense créée avec succès ! 🎉', {
          description: `${scanResult.title} - €${scanResult.amount.toFixed(2)}`,
          duration: 5000,
        });
      } else {
        toast.error('Erreur lors de la création', {
          description: result.error,
          duration: 5000,
        });
      }
    } catch (error: any) {
      toast.error('Erreur inattendue', {
        description: error.message,
        duration: 5000,
      });
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

      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[Finances] Export error:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  // Handle marking a split as paid
  const handleMarkAsPaid = async (expenseId: string, userId: string) => {
    const result = await expenseService.markSplitAsPaid(expenseId, userId);
    if (result.success) {
      toast.success('Marqué comme payé !');
      await loadData();
      if (selectedExpense?.id === expenseId) {
        const updatedExpenses = await expenseService.getPropertyExpenses(propertyId!, currentUserId!);
        const updated = updatedExpenses.find((e) => e.id === expenseId);
        if (updated) setSelectedExpense(updated);
      }
    } else {
      toast.error('Erreur', { description: result.error });
    }
  };

  // Open history modal with optional view mode
  const openHistoryModal = (view: 'list' | 'calendar' = 'list') => {
    setHistoryInitialView(view);
    setShowHistoryModal(true);
  };

  // Handle expense click from history modal
  const handleExpenseClickFromHistory = (expense: ExpenseWithDetails) => {
    setSelectedExpense(expense);
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const yourShare = expenses.reduce((sum, exp) => sum + (exp.your_share || 0), 0);
  const totalBalance = balances.reduce((sum, bal) => sum + bal.amount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={60} />
          <p className="text-sm text-gray-500 mt-3">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <HubLayout>
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
            style={{
              background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)',
            }}
          >
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Finances</h1>
            <p className="text-xs text-gray-500">
              {expenses.length} dépense{expenses.length !== 1 ? 's' : ''} • €{totalExpenses.toFixed(0)} total
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => openHistoryModal('calendar')}
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-full border-gray-200 text-gray-600 hover:text-[#ee5736] hover:border-[#ee5736]"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            Calendrier
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-full border-gray-200 text-gray-600 hover:text-[#ee5736] hover:border-[#ee5736]"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            PDF
          </Button>
          <Button
            onClick={() => setCreateMode('scanner')}
            size="sm"
            className="h-8 text-xs rounded-full text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)' }}
          >
            <Scan className="w-3.5 h-3.5 mr-1.5" />
            Scanner
          </Button>
        </div>
      </div>

      {/* Compact Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Total</span>
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(238, 87, 54, 0.1)' }}
            >
              <DollarSign className="w-3.5 h-3.5" style={{ color: '#ee5736' }} />
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900">€{totalExpenses.toFixed(0)}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MiniSparkline expenses={expenses} days={7} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Ta part</span>
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255, 128, 23, 0.1)' }}
            >
              <Users className="w-3.5 h-3.5" style={{ color: '#ff8017' }} />
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900">€{yourShare.toFixed(0)}</p>
          <p className="text-[10px] text-gray-400">
            {totalExpenses > 0 ? Math.round((yourShare / totalExpenses) * 100) : 0}% du total
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            'bg-white rounded-xl p-3 border shadow-sm',
            totalBalance >= 0 ? 'border-green-100' : 'border-red-100'
          )}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Solde</span>
            <div
              className={cn(
                'w-6 h-6 rounded-lg flex items-center justify-center',
                totalBalance >= 0 ? 'bg-green-50' : 'bg-red-50'
              )}
            >
              {totalBalance >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
              )}
            </div>
          </div>
          <p className={cn('text-lg font-bold', totalBalance >= 0 ? 'text-green-600' : 'text-red-600')}>
            {totalBalance >= 0 ? '+' : ''}€{totalBalance.toFixed(0)}
          </p>
          <p className="text-[10px] text-gray-400">
            {totalBalance >= 0 ? 'On te doit' : 'Tu dois'}
          </p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-[#ee5736]" />
            <h3 className="text-sm font-semibold text-gray-900">Progression</h3>
          </div>
          <ExpenseProgressChart expenses={expenses} period="month" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-[#ee5736]" />
            <h3 className="text-sm font-semibold text-gray-900">Par catégorie</h3>
          </div>
          <CategoryBreakdownChart expenses={expenses} />
        </motion.div>
      </div>

      {/* Residence Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-6"
      >
        <ResidenceFinanceOverview
          expenses={expenses}
          balances={balances}
          currentUserId={currentUserId || ''}
          roommates={roommates}
        />
      </motion.div>

      {/* Two Column Layout: Expenses + Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Expenses - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <button
            onClick={() => openHistoryModal('list')}
            className="w-full flex items-center justify-between p-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#ee5736]" />
              <h3 className="text-sm font-semibold text-gray-900">Dépenses récentes</h3>
              <Badge className="text-[10px] px-1.5 py-0 bg-gray-100 text-gray-600 border-none">
                {expenses.length}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#ee5736] transition-colors">
              <span>Tout voir</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          <div className="p-2">
            <CompactExpenseList
              expenses={expenses}
              onExpenseClick={setSelectedExpense}
              maxItems={5}
            />
          </div>
        </motion.div>

        {/* Balances - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-2 p-3 border-b border-gray-50">
            <Users className="w-4 h-4 text-[#ee5736]" />
            <h3 className="text-sm font-semibold text-gray-900">Soldes entre colocs</h3>
          </div>

          <div className="p-2">
            {balances.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-2">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-sm font-medium text-gray-900">Tout est réglé !</p>
                <p className="text-xs text-gray-500">Aucun solde en attente</p>
              </div>
            ) : (
              <div className="space-y-1">
                {balances.map((balance) => (
                  <div
                    key={balance.userId}
                    className={cn(
                      'flex items-center justify-between p-2.5 rounded-xl transition-colors',
                      balance.amount >= 0
                        ? 'bg-green-50/50 hover:bg-green-50'
                        : 'bg-red-50/50 hover:bg-red-50'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold',
                          balance.amount >= 0
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                            : 'bg-gradient-to-br from-red-500 to-rose-600'
                        )}
                      >
                        {balance.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{balance.userName}</p>
                        <p className="text-[10px] text-gray-500">
                          {balance.amount >= 0 ? 'Te doit' : 'Tu lui dois'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          'text-sm font-bold tabular-nums',
                          balance.amount >= 0 ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {balance.amount >= 0 ? '+' : ''}€{Math.abs(balance.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setCreateMode('scanner')}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white z-40"
        style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)' }}
      >
        <Scan className="w-6 h-6" />
      </button>

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
                    <LoadingHouse size={48} />
                    <p className="text-sm text-gray-500 mt-3">Création de la dépense...</p>
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

      {/* Expense Detail Modal */}
      <ExpenseDetailModal
        expense={selectedExpense}
        isOpen={selectedExpense !== null}
        onClose={() => setSelectedExpense(null)}
        onMarkAsPaid={handleMarkAsPaid}
        currentUserId={currentUserId || undefined}
      />

      {/* Expense History Modal */}
      <ExpenseHistoryModal
        expenses={expenses}
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onExpenseClick={handleExpenseClickFromHistory}
        onExport={handleExport}
        initialView={historyInitialView}
      />
    </HubLayout>
  );
}
