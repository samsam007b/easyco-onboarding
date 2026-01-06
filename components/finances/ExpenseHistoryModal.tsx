/**
 * Expense History Modal - Fun & Colorful Design
 * Full expense history with search, filters, and calendar view toggle
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  X,
  Search,
  Calendar as CalendarIcon,
  List,
  Filter,
  Download,
  ChevronDown,
  DollarSign,
  Sparkles,
  Receipt,
  Home,
  Lightbulb,
  ShoppingCart,
  Brush,
  Wrench,
  Wifi,
  Package,
} from 'lucide-react';
import ExpenseListByPeriod from './ExpenseListByPeriod';
import ExpenseCalendarView from './ExpenseCalendarView';
import type { ExpenseWithDetails, ExpenseCategory } from '@/types/finances.types';

interface ExpenseHistoryModalProps {
  expenses: ExpenseWithDetails[];
  isOpen: boolean;
  onClose: () => void;
  onExpenseClick: (expense: ExpenseWithDetails) => void;
  onExport?: () => void;
  initialView?: 'list' | 'calendar';
}


const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  rent: Home,
  utilities: Lightbulb,
  groceries: ShoppingCart,
  cleaning: Brush,
  maintenance: Wrench,
  internet: Wifi,
  other: Package,
};

const allCategories: ExpenseCategory[] = [
  'rent',
  'utilities',
  'groceries',
  'cleaning',
  'maintenance',
  'internet',
  'other',
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

export default function ExpenseHistoryModal({
  expenses,
  isOpen,
  onClose,
  onExpenseClick,
  onExport,
  initialView = 'list',
}: ExpenseHistoryModalProps) {
  const { getSection } = useLanguage();
  const history = getSection('expenseHistory');

  // Helper to get translated category label
  const getCategoryLabel = (category: string): string => {
    const categoryMap: Record<string, string> = {
      rent: history?.catRent || 'Loyer',
      utilities: history?.catUtilities || 'Charges',
      groceries: history?.catGroceries || 'Courses',
      cleaning: history?.catCleaning || 'Ménage',
      maintenance: history?.catMaintenance || 'Entretien',
      internet: history?.catInternet || 'Internet',
      other: history?.catOther || 'Autre',
    };
    return categoryMap[category] || category;
  };

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>(initialView);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.title.toLowerCase().includes(query) ||
          exp.description?.toLowerCase().includes(query) ||
          exp.paid_by_name?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((exp) => exp.category === selectedCategory);
    }

    return result;
  }, [expenses, searchQuery, selectedCategory]);

  // Stats
  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-hidden p-0 superellipse-3xl border-2 border-orange-100"
        style={{ boxShadow: '0 25px 80px rgba(255, 101, 30, 0.2)' }}
      >
        <DialogTitle className="sr-only">{history?.title || 'Historique des dépenses'}</DialogTitle>

        {/* Decorative gradient circles */}
        <div
          className="absolute -right-20 -top-20 w-56 h-56 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)' }}
        />
        <div
          className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 100%)' }}
        />

        <div className="flex flex-col h-[90vh] relative z-10">
          {/* Header - V3 Fun gradient background */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
            className="flex-shrink-0 p-6 pb-4 border-b-2 border-orange-100"
            style={{
              background: 'linear-gradient(135deg, #FFF5F0 0%, #FFEDE5 100%)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative w-14 h-14 superellipse-2xl overflow-hidden flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)',
                    boxShadow: '0 12px 32px rgba(255, 101, 30, 0.35)',
                  }}
                >
                  <Receipt className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {history?.title || 'Historique des dépenses'}
                    <Sparkles className="w-5 h-5" style={{ color: '#e05747' }} />
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Badge
                      className="text-xs border-none text-white font-bold"
                      style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 100%)' }}
                    >
                      {filteredExpenses.length}
                    </Badge>
                    {(history?.expenseCount || '{count} dépense{plural}')
                      .replace('{count}', '')
                      .replace('{plural}', filteredExpenses.length !== 1 ? 's' : '')} • {history?.total || 'Total'}:{' '}
                    <span className="font-bold text-gray-900">€{totalAmount.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle - Colorful pill */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-1.5 rounded-full shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.8)',
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all',
                      viewMode === 'list'
                        ? 'text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                    style={
                      viewMode === 'list'
                        ? {
                            background: 'linear-gradient(135deg, #e05747 0%, #e05747 100%)',
                            boxShadow: '0 4px 12px rgba(255, 101, 30, 0.4)',
                          }
                        : {}
                    }
                  >
                    <List className="w-4 h-4" />
                    {history?.list || 'Liste'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('calendar')}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all',
                      viewMode === 'calendar'
                        ? 'text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                    style={
                      viewMode === 'calendar'
                        ? {
                            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
                          }
                        : {}
                    }
                  >
                    <CalendarIcon className="w-4 h-4" />
                    {history?.calendar || 'Calendrier'}
                  </motion.button>
                </motion.div>

                {/* Export Button */}
                {onExport && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onExport}
                      className="rounded-full border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 font-semibold shadow-sm"
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      PDF
                    </Button>
                  </motion.div>
                )}

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-10 h-10 superellipse-xl flex items-center justify-center text-white transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #e05747 0%, #e05747 100%)',
                    boxShadow: '0 4px 12px rgba(255, 101, 30, 0.3)',
                  }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Search & Filters - V3 Fun styling */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255, 101, 30, 0.15)' }}
                >
                  <Search className="w-4 h-4" style={{ color: '#e05747' }} />
                </div>
                <Input
                  placeholder={history?.searchPlaceholder || 'Rechercher une dépense...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 py-6 superellipse-2xl border-2 border-gray-200 hover:border-orange-200 focus:border-orange-400 focus:bg-orange-50/30 text-base transition-all"
                />
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    'superellipse-2xl px-5 py-6 border-2 font-semibold shadow-sm transition-all',
                    selectedCategory !== 'all'
                      ? 'border-orange-300 text-orange-600 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <Filter className="w-5 h-5 mr-2" />
                  {history?.filters || 'Filtres'}
                  {selectedCategory !== 'all' && (
                    <Badge
                      className="ml-2 text-xs text-white border-none animate-pulse"
                      style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 100%)' }}
                    >
                      1
                    </Badge>
                  )}
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 ml-1 transition-transform duration-300',
                      showFilters && 'rotate-180'
                    )}
                  />
                </Button>
              </motion.div>
            </div>

            {/* Filter Panel - Colorful category pills */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="pt-5"
                  >
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {history?.category || 'Catégorie'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory('all')}
                        className={cn(
                          'px-4 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm',
                          selectedCategory === 'all'
                            ? 'text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
                        )}
                        style={
                          selectedCategory === 'all'
                            ? {
                                background: 'linear-gradient(135deg, #e05747 0%, #e05747 100%)',
                                boxShadow: '0 4px 12px rgba(255, 101, 30, 0.35)',
                              }
                            : {}
                        }
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        {history?.all || 'Toutes'}
                      </motion.button>
                      {allCategories.map((cat) => {
                        const CatIcon = categoryIcons[cat] || Package;
                        return (
                          <motion.button
                            key={cat}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                              'px-4 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm flex items-center gap-1',
                              selectedCategory === cat
                                ? 'text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
                            )}
                            style={
                              selectedCategory === cat
                                ? {
                                    background: 'linear-gradient(135deg, #e05747 0%, #e05747 100%)',
                                    boxShadow: '0 4px 12px rgba(255, 101, 30, 0.35)',
                                  }
                                : {}
                            }
                          >
                            <CatIcon className="w-4 h-4" />
                            {getCategoryLabel(cat)}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Content - Animated list/calendar */}
          <div className="flex-1 overflow-y-auto p-6 pt-2 bg-white">
            <AnimatePresence mode="wait">
              {viewMode === 'list' ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
                >
                  <ExpenseListByPeriod
                    expenses={filteredExpenses}
                    onExpenseClick={onExpenseClick}
                    showPeriodHeaders={true}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
                >
                  <ExpenseCalendarView
                    expenses={filteredExpenses}
                    onExpenseClick={onExpenseClick}
                    onDayClick={(date, dayExpenses) => {
                      if (dayExpenses.length === 1) {
                        onExpenseClick(dayExpenses[0]);
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
