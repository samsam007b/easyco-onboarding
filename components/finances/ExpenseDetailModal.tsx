/**
 * Expense Detail Modal
 * Shows full expense details including receipt image, OCR data, and splits
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  X,
  Calendar,
  User,
  Receipt,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  Scan,
  ShoppingCart,
  Store,
  CreditCard,
} from 'lucide-react';
import type { ExpenseWithDetails, OCRData, ExpenseSplit } from '@/types/finances.types';

interface ExpenseDetailModalProps {
  expense: ExpenseWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsPaid?: (expenseId: string, userId: string) => Promise<void>;
  currentUserId?: string;
}

// categoryLabels are now dynamically provided via translations

const categoryColors: Record<string, string> = {
  rent: 'bg-purple-100 text-purple-700',
  utilities: 'bg-blue-100 text-blue-700',
  groceries: 'bg-green-100 text-green-700',
  cleaning: 'bg-cyan-100 text-cyan-700',
  maintenance: 'bg-orange-100 text-orange-700',
  internet: 'bg-indigo-100 text-indigo-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function ExpenseDetailModal({
  expense,
  isOpen,
  onClose,
  onMarkAsPaid,
  currentUserId,
}: ExpenseDetailModalProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptZoom, setReceiptZoom] = useState(1);
  const [showOCRDetails, setShowOCRDetails] = useState(false);
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

  const { language, getSection } = useLanguage();
  const detail = getSection('expenseDetail');

  // Locale mapping for date formatting
  const localeMap: Record<string, string> = {
    fr: 'fr-FR',
    en: 'en-US',
    nl: 'nl-NL',
    de: 'de-DE',
  };
  const locale = localeMap[language] || 'fr-FR';

  // Helper function to get translated category labels
  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      rent: detail?.catRent || 'Loyer',
      utilities: detail?.catUtilities || 'Charges',
      groceries: detail?.catGroceries || 'Courses',
      cleaning: detail?.catCleaning || 'Ménage',
      maintenance: detail?.catMaintenance || 'Entretien',
      internet: detail?.catInternet || 'Internet',
      other: detail?.catOther || 'Autre',
    };
    return labels[category] || category;
  };

  if (!expense) return null;

  const ocrData: OCRData | null = expense.ocr_data
    ? typeof expense.ocr_data === 'string'
      ? JSON.parse(expense.ocr_data)
      : expense.ocr_data
    : null;

  const handleMarkAsPaid = async (split: ExpenseSplit) => {
    if (!onMarkAsPaid) return;
    setMarkingPaid(split.user_id);
    try {
      await onMarkAsPaid(expense.id, split.user_id);
    } finally {
      setMarkingPaid(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <DialogTitle className="sr-only">{detail?.expenseDetails || 'Détails de la dépense'}: {expense.title}</DialogTitle>

        <div className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div
            className="relative p-6 pb-4"
            style={{
              background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <Receipt className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-white truncate">{expense.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={cn('text-xs', categoryColors[expense.category])}>
                    {getCategoryLabel(expense.category)}
                  </Badge>
                  {expense.receipt_image_url && (
                    <Badge className="text-xs bg-white/20 text-white border-none">
                      <Scan className="w-3 h-3 mr-1" />
                      OCR
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="mt-6 text-center">
              <p className="text-white/80 text-sm font-medium">{detail?.totalAmount || 'Montant total'}</p>
              <p className="text-5xl font-bold text-white mt-1">
                €{expense.amount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{detail?.paidBy || 'Payé par'}</p>
                  <p className="font-semibold text-gray-900">{expense.paid_by_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{detail?.date || 'Date'}</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(expense.date).toLocaleDateString(locale, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {expense.description && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 font-medium mb-1">{detail?.description || 'Description'}</p>
                <p className="text-gray-900">{expense.description}</p>
              </div>
            )}

            {/* Receipt Image */}
            {expense.receipt_image_url && (
              <div className="space-y-3">
                <button
                  onClick={() => setShowReceipt(!showReceipt)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{detail?.receiptPhoto || 'Photo du ticket'}</p>
                      <p className="text-xs text-gray-500">{detail?.clickToView || 'Cliquez pour voir'}</p>
                    </div>
                  </div>
                  {showReceipt ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                <AnimatePresence>
                  {showReceipt && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="relative bg-gray-900 rounded-xl p-4">
                        {/* Zoom Controls */}
                        <div className="absolute top-2 right-2 flex gap-2 z-10">
                          <button
                            onClick={() => setReceiptZoom(Math.max(0.5, receiptZoom - 0.25))}
                            className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <ZoomOut className="w-4 h-4 text-gray-700" />
                          </button>
                          <button
                            onClick={() => setReceiptZoom(Math.min(3, receiptZoom + 0.25))}
                            className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <ZoomIn className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>

                        <div className="overflow-auto max-h-[400px]">
                          <img
                            src={expense.receipt_image_url}
                            alt={detail?.receiptAlt || 'Ticket de caisse'}
                            className="mx-auto transition-transform duration-200"
                            style={{ transform: `scale(${receiptZoom})` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* OCR Data */}
            {ocrData && (
              <div className="space-y-3">
                <button
                  onClick={() => setShowOCRDetails(!showOCRDetails)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Scan className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{detail?.ocrData || 'Données OCR extraites'}</p>
                      <p className="text-xs text-gray-500">
                        {detail?.confidence || 'Confiance:'} {Math.round((ocrData.confidence || 0) * 100)}%
                      </p>
                    </div>
                  </div>
                  {showOCRDetails ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                <AnimatePresence>
                  {showOCRDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                        {/* Merchant */}
                        {ocrData.merchant && (
                          <div className="flex items-center gap-3">
                            <Store className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">{detail?.merchant || 'Commerce'}</p>
                              <p className="font-medium text-gray-900">{ocrData.merchant}</p>
                            </div>
                          </div>
                        )}

                        {/* Detected Total */}
                        {ocrData.total && (
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">{detail?.detectedTotal || 'Total détecté'}</p>
                              <p className="font-medium text-gray-900">€{ocrData.total.toFixed(2)}</p>
                            </div>
                          </div>
                        )}

                        {/* Items */}
                        {ocrData.items && ocrData.items.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <ShoppingCart className="w-5 h-5 text-gray-400" />
                              <p className="text-xs text-gray-500 font-medium">
                                {detail?.detectedItems || 'Articles détectés'} ({ocrData.items.length})
                              </p>
                            </div>
                            <div className="space-y-2 ml-7">
                              {ocrData.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between py-1.5 px-3 bg-white rounded-lg text-sm"
                                >
                                  <span className="text-gray-900">{item.name}</span>
                                  {item.total_price && (
                                    <span className="text-gray-600 font-medium">
                                      €{item.total_price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Splits */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" />
                {detail?.splitTitle || 'Répartition'} ({expense.splits?.length || 0} {detail?.people || 'personnes'})
              </h3>

              <div className="space-y-2">
                {expense.splits?.map((split) => {
                  const isPayer = split.user_id === expense.paid_by_id;
                  const isCurrentUser = split.user_id === currentUserId;

                  return (
                    <div
                      key={split.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-xl border transition-all',
                        split.paid
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center font-bold text-white',
                            split.paid
                              ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                              : 'bg-gradient-to-br from-gray-400 to-gray-500'
                          )}
                        >
                          {isPayer ? '€' : (isCurrentUser ? (detail?.you || 'Toi').charAt(0) : '?')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {isPayer ? expense.paid_by_name : (isCurrentUser ? (detail?.you || 'Toi') : (detail?.roommate || 'Colocataire'))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isPayer ? (detail?.hasPaid || 'A payé') : split.paid ? (detail?.reimbursed || 'Remboursé') : (detail?.owes || 'Doit')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <p
                          className={cn(
                            'font-bold',
                            split.paid ? 'text-green-600' : 'text-gray-900'
                          )}
                        >
                          €{split.amount_owed.toFixed(2)}
                        </p>

                        {split.paid ? (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                        ) : !isPayer && onMarkAsPaid ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsPaid(split)}
                            disabled={markingPaid === split.user_id}
                            className="h-8 rounded-full text-xs border-green-300 text-green-600 hover:bg-green-50"
                          >
                            {markingPaid === split.user_id ? (
                              <Clock className="w-3 h-3 animate-spin" />
                            ) : (
                              detail?.markPaid || 'Marquer payé'
                            )}
                          </Button>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
