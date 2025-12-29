/**
 * Expense History Modal
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
import {
  X,
  Search,
  Calendar as CalendarIcon,
  List,
  Filter,
  Download,
  ChevronDown,
  DollarSign,
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

const categoryLabels: Record<string, string> = {
  rent: 'Loyer',
  utilities: 'Charges',
  groceries: 'Courses',
  cleaning: 'Ménage',
  maintenance: 'Entretien',
  internet: 'Internet',
  other: 'Autre',
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

export default function ExpenseHistoryModal({
  expenses,
  isOpen,
  onClose,
  onExpenseClick,
  onExport,
  initialView = 'list',
}: ExpenseHistoryModalProps) {
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogTitle className="sr-only">Historique des dépenses</DialogTitle>

        <div className="flex flex-col h-[90vh]">
          {/* Header */}
          <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                  }}
                >
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Historique des dépenses</h2>
                  <p className="text-sm text-gray-500">
                    {filteredExpenses.length} dépense{filteredExpenses.length !== 1 ? 's' : ''} •{' '}
                    Total: €{totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                      viewMode === 'list'
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    <List className="w-4 h-4" />
                    Liste
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                      viewMode === 'calendar'
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    Calendrier
                  </button>
                </div>

                {/* Export */}
                {onExport && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    className="rounded-full"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                )}

                {/* Close */}
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une dépense..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full border-gray-200"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'rounded-full',
                  selectedCategory !== 'all' && 'border-[#ee5736] text-[#ee5736]'
                )}
              >
                <Filter className="w-4 h-4 mr-1" />
                Filtres
                {selectedCategory !== 'all' && (
                  <Badge
                    className="ml-1.5 text-xs text-white border-none"
                    style={{ background: '#ee5736' }}
                  >
                    1
                  </Badge>
                )}
                <ChevronDown
                  className={cn(
                    'w-4 h-4 ml-1 transition-transform',
                    showFilters && 'rotate-180'
                  )}
                />
              </Button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Catégorie
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                          selectedCategory === 'all'
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                        style={
                          selectedCategory === 'all'
                            ? { background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)' }
                            : {}
                        }
                      >
                        Toutes
                      </button>
                      {allCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                            selectedCategory === cat
                              ? 'text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          )}
                          style={
                            selectedCategory === cat
                              ? { background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)' }
                              : {}
                          }
                        >
                          {categoryLabels[cat]}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {viewMode === 'list' ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <ExpenseCalendarView
                    expenses={filteredExpenses}
                    onExpenseClick={onExpenseClick}
                    onDayClick={(date, dayExpenses) => {
                      // Could show a popover or filter to that day
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
