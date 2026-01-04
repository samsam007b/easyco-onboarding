'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Building2,
  User,
  Calendar,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr, enUS, nl, de } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import { ownerGradient, semanticColors } from '@/lib/constants/owner-theme';
import { useLanguage } from '@/lib/i18n/use-language';

const dateLocales: Record<string, Locale> = { fr, en: enUS, nl, de };
const numberLocales: Record<string, string> = { fr: 'fr-FR', en: 'en-US', nl: 'nl-NL', de: 'de-DE' };

const t = {
  status: {
    paid: { fr: 'Payé', en: 'Paid', nl: 'Betaald', de: 'Bezahlt' },
    pending: { fr: 'En attente', en: 'Pending', nl: 'In afwachting', de: 'Ausstehend' },
    overdue: { fr: 'En retard', en: 'Overdue', nl: 'Achterstallig', de: 'Überfällig' },
  },
  filter: {
    all: { fr: 'Tous', en: 'All', nl: 'Alle', de: 'Alle' },
    paid: { fr: 'Payés', en: 'Paid', nl: 'Betaald', de: 'Bezahlt' },
    pending: { fr: 'Attente', en: 'Pending', nl: 'Afwachtend', de: 'Ausstehend' },
    overdue: { fr: 'Retard', en: 'Overdue', nl: 'Achterstallig', de: 'Überfällig' },
  },
  search: {
    placeholder: { fr: 'Rechercher...', en: 'Search...', nl: 'Zoeken...', de: 'Suchen...' },
  },
  summary: {
    payments: { fr: 'paiements', en: 'payments', nl: 'betalingen', de: 'Zahlungen' },
    collected: { fr: 'encaissés', en: 'collected', nl: 'ontvangen', de: 'eingezogen' },
    toCollect: { fr: 'à percevoir', en: 'to collect', nl: 'te ontvangen', de: 'ausstehend' },
  },
  table: {
    property: { fr: 'Propriété', en: 'Property', nl: 'Eigendom', de: 'Immobilie' },
    tenant: { fr: 'Locataire', en: 'Tenant', nl: 'Huurder', de: 'Mieter' },
    amount: { fr: 'Montant', en: 'Amount', nl: 'Bedrag', de: 'Betrag' },
    dueDate: { fr: 'Échéance', en: 'Due date', nl: 'Vervaldatum', de: 'Fälligkeitsdatum' },
    status: { fr: 'Statut', en: 'Status', nl: 'Status', de: 'Status' },
    actions: { fr: 'Actions', en: 'Actions', nl: 'Acties', de: 'Aktionen' },
  },
  empty: {
    title: { fr: 'Aucun paiement trouvé', en: 'No payments found', nl: 'Geen betalingen gevonden', de: 'Keine Zahlungen gefunden' },
    subtitle: { fr: 'Modifiez vos filtres de recherche', en: 'Adjust your search filters', nl: 'Pas uw zoekfilters aan', de: 'Passen Sie Ihre Suchfilter an' },
  },
  actions: {
    paidOn: { fr: 'Payé le', en: 'Paid on', nl: 'Betaald op', de: 'Bezahlt am' },
    markPaid: { fr: 'Marquer payé', en: 'Mark paid', nl: 'Markeer betaald', de: 'Als bezahlt markieren' },
    sendReminder: { fr: 'Relancer', en: 'Send reminder', nl: 'Herinnering sturen', de: 'Erinnerung senden' },
  },
};

export interface PaymentRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantName: string;
  tenantId: string;
  amount: number;
  dueDate: Date;
  paidAt?: Date;
  status: 'paid' | 'pending' | 'overdue';
  month: string;
}

export type PaymentSortField = 'dueDate' | 'amount' | 'property' | 'tenant' | 'status';
export type PaymentSortOrder = 'asc' | 'desc';

interface PaymentTableProps {
  payments: PaymentRecord[];
  onMarkPaid?: (paymentId: string) => void;
  onSendReminder?: (paymentId: string) => void;
  onPaymentClick?: (payment: PaymentRecord) => void;
  isLoading?: boolean;
}

const getStatusConfig = (language: string) => ({
  paid: {
    label: t.status.paid[language as keyof typeof t.status.paid] || 'Paid',
    icon: CheckCircle2,
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    iconColor: '#059669',
  },
  pending: {
    label: t.status.pending[language as keyof typeof t.status.pending] || 'Pending',
    icon: Clock,
    className: 'bg-amber-100 text-amber-700 border-amber-200',
    iconColor: '#D97706',
  },
  overdue: {
    label: t.status.overdue[language as keyof typeof t.status.overdue] || 'Overdue',
    icon: AlertTriangle,
    className: 'bg-red-100 text-red-700 border-red-200',
    iconColor: '#DC2626',
  },
});

export function PaymentTable({
  payments,
  onMarkPaid,
  onSendReminder,
  onPaymentClick,
  isLoading = false,
}: PaymentTableProps) {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [sortField, setSortField] = useState<PaymentSortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<PaymentSortOrder>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Memoized status config based on language
  const statusConfig = useMemo(() => getStatusConfig(language), [language]);

  // Filter and sort payments
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.propertyTitle.toLowerCase().includes(searchLower) ||
          p.tenantName.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'property':
          comparison = a.propertyTitle.localeCompare(b.propertyTitle);
          break;
        case 'tenant':
          comparison = a.tenantName.localeCompare(b.tenantName);
          break;
        case 'status':
          const statusOrder = { overdue: 0, pending: 1, paid: 2 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [payments, search, statusFilter, sortField, sortOrder]);

  // Toggle sort
  const handleSort = (field: PaymentSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Summary stats
  const stats = useMemo(() => ({
    total: filteredPayments.length,
    paid: filteredPayments.filter((p) => p.status === 'paid').length,
    pending: filteredPayments.filter((p) => p.status === 'pending').length,
    overdue: filteredPayments.filter((p) => p.status === 'overdue').length,
    totalAmount: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
    paidAmount: filteredPayments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0),
  }), [filteredPayments]);

  const SortIcon = sortOrder === 'asc' ? SortAsc : SortDesc;

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 superellipse-xl bg-gray-200 mb-4" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header with filters */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t.search.placeholder[language as keyof typeof t.search.placeholder] || 'Search...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-full bg-gray-50 border-gray-200"
            />
          </div>

          {/* Status filters */}
          <div className="flex items-center gap-2">
            {(['all', 'paid', 'pending', 'overdue'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  statusFilter === status
                    ? 'text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                style={statusFilter === status ? { background: ownerGradient } : {}}
              >
                {status === 'all'
                  ? `${t.filter.all[language as keyof typeof t.filter.all] || 'All'} (${payments.length})`
                  : status === 'paid'
                  ? `${t.filter.paid[language as keyof typeof t.filter.paid] || 'Paid'} (${stats.paid})`
                  : status === 'pending'
                  ? `${t.filter.pending[language as keyof typeof t.filter.pending] || 'Pending'} (${stats.pending})`
                  : `${t.filter.overdue[language as keyof typeof t.filter.overdue] || 'Overdue'} (${stats.overdue})`}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <span className="text-gray-500">
            <strong className="text-gray-900">{stats.total}</strong> {t.summary.payments[language as keyof typeof t.summary.payments] || 'payments'}
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-emerald-600">
            <strong>{stats.paidAmount.toLocaleString(numberLocales[language] || 'en-US')}€</strong> {t.summary.collected[language as keyof typeof t.summary.collected] || 'collected'}
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-amber-600">
            <strong>{(stats.totalAmount - stats.paidAmount).toLocaleString(numberLocales[language] || 'en-US')}€</strong> {t.summary.toCollect[language as keyof typeof t.summary.toCollect] || 'to collect'}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/80">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('property')}
              >
                <div className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {t.table.property[language as keyof typeof t.table.property] || 'Property'}
                  {sortField === 'property' && <SortIcon className="w-3 h-3" />}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('tenant')}
              >
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {t.table.tenant[language as keyof typeof t.table.tenant] || 'Tenant'}
                  {sortField === 'tenant' && <SortIcon className="w-3 h-3" />}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center gap-1">
                  {t.table.amount[language as keyof typeof t.table.amount] || 'Amount'}
                  {sortField === 'amount' && <SortIcon className="w-3 h-3" />}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('dueDate')}
              >
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {t.table.dueDate[language as keyof typeof t.table.dueDate] || 'Due date'}
                  {sortField === 'dueDate' && <SortIcon className="w-3 h-3" />}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  {t.table.status[language as keyof typeof t.table.status] || 'Status'}
                  {sortField === 'status' && <SortIcon className="w-3 h-3" />}
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                {t.table.actions[language as keyof typeof t.table.actions] || 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-12 h-12 superellipse-xl flex items-center justify-center mb-3"
                      style={{ background: ownerGradient }}
                    >
                      <Filter className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-600 font-medium">{t.empty.title[language as keyof typeof t.empty.title] || 'No payments found'}</p>
                    <p className="text-sm text-gray-400 mt-1">{t.empty.subtitle[language as keyof typeof t.empty.subtitle] || 'Adjust your search filters'}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment, index) => {
                const config = statusConfig[payment.status];
                const StatusIcon = config.icon;
                const isExpanded = expandedId === payment.id;

                return (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={cn(
                      'hover:bg-gray-50/50 transition-colors cursor-pointer',
                      payment.status === 'overdue' && 'bg-red-50/30'
                    )}
                    onClick={() => onPaymentClick?.(payment)}
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900 text-sm">{payment.propertyTitle}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-700">{payment.tenantName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-gray-900">{payment.amount.toLocaleString(numberLocales[language] || 'en-US')}€</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600">
                        {format(new Date(payment.dueDate), 'd MMM yyyy', { locale: dateLocales[language] || dateLocales.en })}
                      </p>
                      {payment.paidAt && (
                        <p className="text-xs text-emerald-600">
                          {t.actions.paidOn[language as keyof typeof t.actions.paidOn] || 'Paid on'} {format(new Date(payment.paidAt), 'd MMM', { locale: dateLocales[language] || dateLocales.en })}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                          config.className
                        )}
                      >
                        <StatusIcon className="w-3.5 h-3.5" style={{ color: config.iconColor }} />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {payment.status !== 'paid' && onMarkPaid && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkPaid(payment.id)}
                            className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">{t.actions.markPaid[language as keyof typeof t.actions.markPaid] || 'Mark paid'}</span>
                          </Button>
                        )}
                        {payment.status === 'overdue' && onSendReminder && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSendReminder(payment.id)}
                            className="h-8 px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          >
                            <Send className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">{t.actions.sendReminder[language as keyof typeof t.actions.sendReminder] || 'Send reminder'}</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
