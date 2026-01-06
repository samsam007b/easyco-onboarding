/**
 * Modern Finances Page with OCR Scanner & Smart Splitter
 * Fun, colorful UI with animations and rich visuals
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import HubLayout from '@/components/hub/HubLayout';
import { useLanguage } from '@/lib/i18n/use-language';
import ExpenseScanner, { type ScanResult } from '@/components/finances/ExpenseScanner';
import SmartSplitter from '@/components/finances/SmartSplitter';
import ManualExpenseForm from '@/components/finances/ManualExpenseForm';
import ExpenseDetailModal from '@/components/finances/ExpenseDetailModal';
import ExpenseHistoryModal from '@/components/finances/ExpenseHistoryModal';
import CompactExpenseList from '@/components/finances/CompactExpenseList';
import { ExpenseProgressChart, CategoryBreakdownChart, MiniSparkline } from '@/components/finances/ExpenseCharts';
import ResidenceFinanceOverview from '@/components/finances/ResidenceFinanceOverview';
import SettleDebtModal from '@/components/finances/SettleDebtModal';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Check,
  Download,
  Scan,
  Sparkles,
  ChevronRight,
  BarChart3,
  PieChart,
  Receipt,
  Wallet,
  CreditCard,
  Banknote,
  Plus,
  PenLine,
} from 'lucide-react';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { expenseService } from '@/lib/services/expense-service';
import type { ExpenseWithDetails, Balance, SplitConfig } from '@/types/finances.types';

type CreateMode = 'scanner' | 'manual' | 'splitter' | null;

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function ModernFinancesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const hub = getSection('dashboard')?.hub;

  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<ExpenseWithDetails[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [roommates, setRoommates] = useState<Array<{ id: string; name: string }>>([]);

  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [selectedExpense, setSelectedExpense] = useState<ExpenseWithDetails | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyInitialView, setHistoryInitialView] = useState<'list' | 'calendar'>('list');

  // Settle debt modal state
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<{ payeeId: string; payeeName: string; amount: number } | null>(null);

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

      const { data: membershipData, error: memberError } = await supabase.rpc(
        'get_user_property_membership',
        { p_user_id: user.id }
      );

      if (memberError || !membershipData?.property_id) {
        setIsLoading(false);
        return;
      }

      setPropertyId(membershipData.property_id);

      const expensesData = await expenseService.getPropertyExpenses(
        membershipData.property_id,
        user.id
      );
      setExpenses(expensesData);

      const balancesData = await expenseService.calculateBalances(
        membershipData.property_id,
        user.id
      );
      setBalances(balancesData);

      const { data: members } = await supabase
        .from('property_members')
        .select(`user_id, users (full_name)`)
        .eq('property_id', membershipData.property_id)
        .eq('status', 'active');

      if (members) {
        const roommatesData = members.map((m: any) => ({
          id: m.user_id,
          name: m.users?.full_name || 'Unknown',
        }));
        setRoommates(roommatesData);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('[Finances] Error loading data:', error);
      setIsLoading(false);
    }
  };

  const handleScanComplete = (result: ScanResult) => {
    setScanResult(result);
    setCreateMode('splitter');
  };

  const handleSplitComplete = async (splitConfig: SplitConfig) => {
    if (!currentUserId || !propertyId || !scanResult) {
      toast.error(getHookTranslation('finance', 'missingData'));
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
        toast.success(getHookTranslation('finance', 'expenseCreated'), {
          description: `${scanResult.title} - €${scanResult.amount.toFixed(2)}`,
          duration: 5000,
        });
      } else {
        toast.error(getHookTranslation('finance', 'expenseCreateFailed'), { description: result.error });
      }
    } catch (error: any) {
      toast.error(getHookTranslation('finance', 'unexpectedError'), { description: error.message });
    } finally {
      setIsCreating(false);
    }
  };

  const handleExport = async () => {
    if (!propertyId) return;
    try {
      const result = await expenseService.exportToPDF(propertyId, 'Ma Résidence', { format: 'pdf' });
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(getHookTranslation('finance', 'exportFailed'));
    }
  };

  const handleMarkAsPaid = async (expenseId: string, userId: string) => {
    const result = await expenseService.markSplitAsPaid(expenseId, userId);
    if (result.success) {
      toast.success(getHookTranslation('finance', 'markedAsPaid'));
      await loadData();
      if (selectedExpense?.id === expenseId) {
        const updatedExpenses = await expenseService.getPropertyExpenses(propertyId!, currentUserId!);
        const updated = updatedExpenses.find((e) => e.id === expenseId);
        if (updated) setSelectedExpense(updated);
      }
    } else {
      toast.error(getHookTranslation('finance', 'error'), { description: result.error });
    }
  };

  const openHistoryModal = (view: 'list' | 'calendar' = 'list') => {
    setHistoryInitialView(view);
    setShowHistoryModal(true);
  };

  const handleExpenseClickFromHistory = (expense: ExpenseWithDetails) => {
    setSelectedExpense(expense);
  };

  const handleSettleDebt = (payeeId: string, payeeName: string, amount: number) => {
    setSelectedDebt({ payeeId, payeeName, amount });
    setSettleModalOpen(true);
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const yourShare = expenses.reduce((sum, exp) => sum + (exp.your_share || 0), 0);
  const totalBalance = balances.reduce((sum, bal) => sum + bal.amount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <LoadingHouse size={60} />
          <p className="text-sm text-gray-500 mt-3">{hub.finances?.loading || 'Loading...'}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <HubLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Fun Header with Gradient */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 superellipse-2xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)',
                boxShadow: '0 8px 24px rgba(255, 101, 30, 0.35)',
              }}
            >
              <Wallet className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{hub.finances?.title || 'Finances'}</h1>
              <p className="text-sm text-gray-500">
                {expenses.length} {expenses.length !== 1 ? (hub.finances?.expensesPlural || 'expenses') : (hub.finances?.expenseSingular || 'expense')} • €{totalExpenses.toFixed(0)} {hub.finances?.total || 'total'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => openHistoryModal('calendar')}
                variant="outline"
                size="sm"
                className="h-9 text-sm superellipse-xl border-2 border-orange-200 text-[#ff7b19] hover:bg-orange-50 hover:border-orange-300 font-medium shadow-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {hub.finances?.calendar || 'Calendar'}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleExport}
                variant="outline"
                size="sm"
                className="h-9 text-sm superellipse-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 font-medium shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setCreateMode('manual')}
                variant="outline"
                size="sm"
                className="h-9 text-sm superellipse-xl border-2 border-orange-200 text-[#e05747] hover:bg-orange-50 hover:border-orange-300 font-semibold shadow-sm"
              >
                <PenLine className="w-4 h-4 mr-2" />
                {hub.finances?.addManual || 'Add'}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setCreateMode('scanner')}
                size="sm"
                className="h-9 text-sm superellipse-xl text-white font-semibold shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)',
                  boxShadow: '0 4px 14px rgba(255, 101, 30, 0.4)',
                }}
              >
                <Scan className="w-4 h-4 mr-2" />
                {hub.finances?.scan || 'Scan'}
                <Sparkles className="w-3.5 h-3.5 ml-1.5 text-white/80" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Colorful Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
          {/* Total Card - Orange Gradient (palette officielle) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #FFF5F0 0%, #FFEDE5 100%)',
              boxShadow: '0 8px 24px rgba(255, 101, 30, 0.15)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{ background: 'linear-gradient(135deg, #e05747, #e05747, #e05747)' }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#e05747]">{hub.finances?.stats?.total || 'Total'}</span>
              <div
                className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #e05747, #e05747, #e05747)' }}
              >
                <DollarSign className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">€{totalExpenses.toFixed(0)}</p>
            <div className="flex items-center gap-2 mt-2">
              <MiniSparkline expenses={expenses} days={7} />
              <span className="text-xs text-[#e05747] font-medium">{hub.finances?.stats?.lastDays || 'Last 7 days'}</span>
            </div>
          </motion.div>

          {/* Your Share Card - Orange (cohérence Resident) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #FFEDE5 0%, #FFD9C7 100%)',
              boxShadow: '0 8px 24px rgba(255, 123, 25, 0.15)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{ background: 'linear-gradient(135deg, #ff7b19, #e05747)' }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#f8572b]">{hub.finances?.stats?.yourShare || 'Your share'}</span>
              <div
                className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #ff7b19, #e05747)' }}
              >
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">€{yourShare.toFixed(0)}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-orange-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${totalExpenses > 0 ? (yourShare / totalExpenses) * 100 : 0}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #ff7b19, #e05747)' }}
                />
              </div>
              <span className="text-xs text-[#ff7b19] font-bold">
                {totalExpenses > 0 ? Math.round((yourShare / totalExpenses) * 100) : 0}%
              </span>
            </div>
          </motion.div>

          {/* Balance Card - Vert/Rouge pastel (sémantique muted) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-4 shadow-lg"
            style={{
              background: totalBalance >= 0
                ? 'linear-gradient(135deg, #F0F7F4 0%, #E8F5EE 100%)'
                : 'linear-gradient(135deg, #FDF5F5 0%, #FAE8E8 100%)',
              boxShadow: totalBalance >= 0
                ? '0 8px 24px rgba(124, 184, 155, 0.15)'
                : '0 8px 24px rgba(208, 128, 128, 0.15)',
            }}
          >
            <div
              className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-15"
              style={{
                background: totalBalance >= 0
                  ? 'linear-gradient(135deg, #7CB89B, #9ECDB5)'
                  : 'linear-gradient(135deg, #D08080, #E0A0A0)',
              }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className={cn('text-sm font-medium', totalBalance >= 0 ? 'text-[#5A9B7A]' : 'text-[#B06060]')}>
                {hub.finances?.stats?.balance || 'Balance'}
              </span>
              <div
                className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                style={{
                  background: totalBalance >= 0
                    ? 'linear-gradient(135deg, #7CB89B, #9ECDB5)'
                    : 'linear-gradient(135deg, #D08080, #E0A0A0)',
                }}
              >
                {totalBalance >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-white" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <p className={cn('text-2xl font-bold', totalBalance >= 0 ? 'text-[#6BA888]' : 'text-[#C07070]')}>
              {totalBalance >= 0 ? '+' : ''}€{Math.abs(totalBalance).toFixed(0)}
            </p>
            <p className={cn('text-xs font-medium mt-2', totalBalance >= 0 ? 'text-[#6BA888]' : 'text-[#C07070]')}>
              {totalBalance >= 0 ? `💰 ${hub.finances?.stats?.youAreOwed || 'You are owed'}` : `💸 ${hub.finances?.stats?.youOwe || 'You owe'}`}
            </p>
          </motion.div>
        </motion.div>

        {/* Charts Section with Shadows - Tous en orange */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white superellipse-2xl p-5 shadow-lg border-2 border-orange-100"
            style={{ boxShadow: '0 12px 32px rgba(255, 101, 30, 0.08)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 superellipse-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #e05747, #e05747, #e05747)' }}
              >
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900">{hub.finances?.charts?.progression || 'Progress'}</h3>
            </div>
            <ExpenseProgressChart expenses={expenses} period="month" />
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white superellipse-2xl p-5 shadow-lg border-2 border-orange-100"
            style={{ boxShadow: '0 12px 32px rgba(255, 123, 25, 0.08)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 superellipse-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #ff7b19, #e05747)' }}
              >
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900">{hub.finances?.charts?.byCategory || 'By category'}</h3>
            </div>
            <CategoryBreakdownChart expenses={expenses} />
          </motion.div>
        </motion.div>

        {/* Residence Overview with Fun Border */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="superellipse-2xl shadow-lg overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fef9c3 50%, #ecfccb 100%)',
            boxShadow: '0 12px 32px rgba(234, 179, 8, 0.12)',
          }}
        >
          <div className="bg-white/80 backdrop-blur-sm m-0.5 rounded-[14px]">
            <ResidenceFinanceOverview
              expenses={expenses}
              balances={balances}
              currentUserId={currentUserId || ''}
              roommates={roommates}
            />
          </div>
        </motion.div>

        {/* Two Column Layout with Fun Accents */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Expenses */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white superellipse-2xl shadow-lg overflow-hidden border-l-4 border-[#e05747]"
            style={{ boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)' }}
          >
            <button
              onClick={() => openHistoryModal('list')}
              className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-orange-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 superellipse-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #e05747, #e05747, #e05747)' }}
                >
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900">{hub.finances?.recentExpenses || 'Recent expenses'}</h3>
                <Badge
                  className="text-xs px-2 py-0.5 font-bold border-none"
                  style={{ background: 'linear-gradient(135deg, #e05747, #e05747, #e05747)', color: 'white' }}
                >
                  {expenses.length}
                </Badge>
              </div>
              <motion.div
                className="flex items-center gap-1 text-sm text-gray-400 group-hover:text-[#e05747] transition-colors"
                whileHover={{ x: 4 }}
              >
                <span className="font-medium">{hub.finances?.viewAll || 'View all'}</span>
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </button>

            <div className="p-3">
              <CompactExpenseList
                expenses={expenses}
                onExpenseClick={setSelectedExpense}
                maxItems={5}
              />
            </div>
          </motion.div>

          {/* Balances - Vert pastel (sémantique muted) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white superellipse-2xl shadow-lg overflow-hidden border-l-4 border-[#7CB89B]"
            style={{ boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)' }}
          >
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <div
                className="w-9 h-9 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #7CB89B, #9ECDB5)' }}
              >
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900">{hub.finances?.balancesBetweenRoommates || 'Balances between roommates'}</h3>
            </div>

            <div className="p-3">
              {balances.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="w-14 h-14 superellipse-2xl flex items-center justify-center mb-3 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #7CB89B, #9ECDB5)' }}
                  >
                    <Check className="w-7 h-7 text-white" />
                  </motion.div>
                  <p className="text-base font-bold text-gray-900">{hub.finances?.emptyBalance?.title || 'All settled!'} 🎉</p>
                  <p className="text-sm text-gray-500">{hub.finances?.emptyBalance?.description || 'No pending balances'}</p>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {balances.map((balance, index) => (
                    <motion.div
                      key={balance.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className={cn(
                        'flex items-center justify-between p-3 superellipse-xl transition-all',
                        balance.amount >= 0
                          ? 'bg-gradient-to-r from-[#F0F7F4] to-[#E8F5EE] hover:shadow-md'
                          : 'bg-gradient-to-r from-[#FDF5F5] to-[#FAE8E8] hover:shadow-md'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 superellipse-xl flex items-center justify-center text-white text-sm font-bold shadow-md"
                          style={{
                            background: balance.amount >= 0
                              ? 'linear-gradient(135deg, #7CB89B, #6BA888)'
                              : 'linear-gradient(135deg, #D08080, #C07070)',
                          }}
                        >
                          {balance.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{balance.userName}</p>
                          <p className="text-xs text-gray-500">
                            {balance.amount >= 0 ? `💰 ${hub.finances?.owesYou || 'Owes you'}` : `💸 ${hub.finances?.youOweThem || 'You owe them'}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            'text-base font-bold tabular-nums',
                            balance.amount >= 0 ? 'text-[#6BA888]' : 'text-[#C07070]'
                          )}
                        >
                          {balance.amount >= 0 ? '+' : ''}€{Math.abs(balance.amount).toFixed(2)}
                        </p>
                        {/* Show "Régler" button only for debts (negative balance = you owe them) */}
                        {balance.amount < 0 && (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSettleDebt(balance.userId, balance.userName, balance.amount);
                              }}
                              className="h-7 px-2.5 text-xs font-semibold superellipse-lg text-white shadow-md"
                              style={{ background: 'linear-gradient(135deg, #7CB89B, #6BA888)' }}
                            >
                              <Banknote className="w-3.5 h-3.5 mr-1" />
                              {hub.finances?.settle || 'Settle'}
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated Floating Action Button - Palette officielle */}
      <motion.button
        onClick={() => setCreateMode('scanner')}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 4px 20px rgba(255, 101, 30, 0.4)',
            '0 8px 30px rgba(255, 101, 30, 0.6)',
            '0 4px 20px rgba(255, 101, 30, 0.4)',
          ],
        }}
        transition={{
          boxShadow: { repeat: Infinity, duration: 2 },
        }}
        className="lg:hidden fixed bottom-6 right-6 w-16 h-16 superellipse-2xl flex items-center justify-center text-white z-40"
        style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)' }}
      >
        <Scan className="w-7 h-7" />
      </motion.button>

      {/* Modals - V3 Fun Design */}
      <Dialog open={createMode !== null} onOpenChange={() => setCreateMode(null)}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 superellipse-3xl border-2 border-orange-100"
          style={{ boxShadow: '0 25px 80px rgba(255, 101, 30, 0.2)' }}
        >
          {/* Decorative gradient circles */}
          <div
            className="absolute -right-20 -top-20 w-56 h-56 rounded-full opacity-15 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)' }}
          />
          <div
            className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 100%)' }}
          />

          <DialogTitle className="sr-only">
            {createMode === 'scanner'
              ? (hub.finances?.modal?.scanTitle || 'Scan a receipt')
              : createMode === 'manual'
              ? (hub.finances?.modal?.manualTitle || 'Add an expense')
              : (hub.finances?.modal?.splitTitle || 'Split the expense')}
          </DialogTitle>

          {/* Content wrapper with padding and z-index */}
          <div className="relative z-10 p-6">
            <AnimatePresence mode="wait">
              {createMode === 'scanner' && (
                <ExpenseScanner
                  onComplete={handleScanComplete}
                  onCancel={() => setCreateMode(null)}
                />
              )}
              {createMode === 'manual' && (
                <ManualExpenseForm
                  onComplete={(data) => {
                    setScanResult(data);
                    setCreateMode('splitter');
                  }}
                  onCancel={() => setCreateMode(null)}
                />
              )}
              {createMode === 'splitter' && scanResult && (
                <div>
                  {isCreating ? (
                    <div className="text-center py-16">
                      <LoadingHouse size={48} />
                      <p className="text-sm text-gray-500 mt-3">{hub.finances?.modal?.creating || 'Creating expense...'}</p>
                    </div>
                  ) : (
                    <SmartSplitter
                      totalAmount={scanResult.amount}
                      roommates={roommates}
                      onComplete={handleSplitComplete}
                      onBack={() => setCreateMode(scanResult.receiptFile ? 'scanner' : 'manual')}
                    />
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>

      <ExpenseDetailModal
        expense={selectedExpense}
        isOpen={selectedExpense !== null}
        onClose={() => setSelectedExpense(null)}
        onMarkAsPaid={handleMarkAsPaid}
        currentUserId={currentUserId || undefined}
      />

      <ExpenseHistoryModal
        expenses={expenses}
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onExpenseClick={handleExpenseClickFromHistory}
        onExport={handleExport}
        initialView={historyInitialView}
      />

      {/* Settle Debt Modal */}
      {selectedDebt && propertyId && (
        <SettleDebtModal
          isOpen={settleModalOpen}
          onClose={() => {
            setSettleModalOpen(false);
            setSelectedDebt(null);
          }}
          payeeId={selectedDebt.payeeId}
          payeeName={selectedDebt.payeeName}
          amount={selectedDebt.amount}
          propertyId={propertyId}
          onPaymentInitiated={() => {
            // Refresh balances after payment is initiated
            loadData();
          }}
        />
      )}
    </HubLayout>
  );
}
