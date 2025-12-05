'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { usePayment } from '@/contexts/PaymentContext';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  CreditCard,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PaymentsPage() {
  const { user } = useAuth();
  const {
    transactions,
    paymentSchedules,
    upcomingPayments,
    transactionSummary,
    paymentAccounts,
    isLoading,
  } = usePayment();

  const [selectedTab, setSelectedTab] = useState<'transactions' | 'schedules' | 'accounts'>('transactions');

  // Get role-specific colors
  const getRoleColors = () => {
    const role = user?.user_metadata?.user_type;
    if (role === 'owner') return {
      gradient: 'linear-gradient(135deg, #F3F1FF 0%, #F9F8FF 100%)',
      primary: 'bg-purple-600',
      primaryText: 'text-purple-600',
      primaryHover: 'hover:bg-purple-700',
      border: 'border-purple-200',
      bg: 'bg-purple-50',
    };
    if (role === 'resident') return {
      gradient: 'linear-gradient(135deg, #FFF3EF 0%, #FFE5DC 100%)',
      primary: 'bg-orange-600',
      primaryText: 'text-orange-600',
      primaryHover: 'hover:bg-orange-700',
      border: 'border-orange-200',
      bg: 'bg-orange-50',
    };
    return {
      gradient: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBEA 100%)',
      primary: 'bg-yellow-600',
      primaryText: 'text-yellow-600',
      primaryHover: 'hover:bg-yellow-700',
      border: 'border-yellow-200',
      bg: 'bg-yellow-50',
    };
  };

  const colors = getRoleColors();

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-BE', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-BE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Get transaction status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" className="text-xs">Payé</Badge>;
      case 'pending':
        return <Badge variant="warning" className="text-xs">En attente</Badge>;
      case 'failed':
        return <Badge variant="error" className="text-xs">Échoué</Badge>;
      case 'cancelled':
        return <Badge variant="default" className="text-xs">Annulé</Badge>;
      case 'refunded':
        return <Badge variant="info" className="text-xs">Remboursé</Badge>;
      default:
        return <Badge variant="default" className="text-xs">{status}</Badge>;
    }
  };

  // Get transaction type label
  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      rent_payment: 'Loyer',
      security_deposit: 'Caution',
      application_fee: 'Frais de dossier',
      service_fee: 'Frais de service',
      refund: 'Remboursement',
      damage_charge: 'Frais de dégâts',
      utility_payment: 'Charges',
      other: 'Autre',
    };
    return labels[type] || type;
  };

  // Get payment frequency label
  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      weekly: 'Hebdomadaire',
      biweekly: 'Bimensuel',
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      yearly: 'Annuel',
    };
    return labels[frequency] || frequency;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center pt-20">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="rounded-3xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200"
          style={{ background: colors.gradient }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #9c5698 0%, #FF5722 50%, #FFB10B 100%)',
                  }}
                >
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                Paiements
              </h1>
              <p className="text-gray-600">Gérez vos paiements et échéanciers</p>
            </div>

            <Button className={`${colors.primary} ${colors.primaryHover} text-white`}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau paiement
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {transactionSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Paid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF5722 100%)' }}
                >
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total payé</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(transactionSummary.total_paid)}
              </p>
            </motion.div>

            {/* Total Received */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                >
                  <ArrowDownLeft className="w-6 h-6 text-white" />
                </div>
                <TrendingDown className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total reçu</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(transactionSummary.total_received)}
              </p>
            </motion.div>

            {/* Pending Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
                >
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">En attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(transactionSummary.pending_amount)}
              </p>
            </motion.div>

            {/* Transaction Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #9c5698 0%, #5B45B8 100%)' }}
                >
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactionSummary.transaction_count}
              </p>
            </motion.div>
          </div>
        )}

        {/* Upcoming Payments */}
        {upcomingPayments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Paiements à venir
            </h2>
            <div className="space-y-3">
              {upcomingPayments.slice(0, 5).map((payment) => (
                <div
                  key={payment.schedule_id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${payment.auto_pay_enabled ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getTransactionTypeLabel(payment.payment_type)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(payment.next_payment_date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    {payment.auto_pay_enabled && (
                      <p className="text-xs text-green-600">Auto-paiement</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('transactions')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                selectedTab === 'transactions'
                  ? `${colors.primaryText} border-b-2 ${colors.border}`
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Transactions ({transactions.length})
            </button>
            <button
              onClick={() => setSelectedTab('schedules')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                selectedTab === 'schedules'
                  ? `${colors.primaryText} border-b-2 ${colors.border}`
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Échéanciers ({paymentSchedules.length})
            </button>
            <button
              onClick={() => setSelectedTab('accounts')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                selectedTab === 'accounts'
                  ? `${colors.primaryText} border-b-2 ${colors.border}`
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Moyens de paiement ({paymentAccounts.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Transactions Tab */}
            {selectedTab === 'transactions' && (
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
                      style={{
                        background: 'linear-gradient(135deg, #9c5698 0%, #FF5722 50%, #FFB10B 100%)',
                      }}
                    >
                      <CreditCard className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-gray-600">Aucune transaction</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            transaction.payer_id === user?.id ? 'bg-red-50' : 'bg-green-50'
                          }`}
                        >
                          {transaction.payer_id === user?.id ? (
                            <ArrowUpRight className="w-6 h-6 text-red-600" />
                          ) : (
                            <ArrowDownLeft className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {getTransactionTypeLabel(transaction.transaction_type)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {transaction.description || formatDate(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(transaction.status)}
                        <p className={`font-semibold ${
                          transaction.payer_id === user?.id ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.payer_id === user?.id ? '-' : '+'}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Schedules Tab */}
            {selectedTab === 'schedules' && (
              <div className="space-y-4">
                {paymentSchedules.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
                      style={{
                        background: 'linear-gradient(135deg, #9c5698 0%, #FF5722 50%, #FFB10B 100%)',
                      }}
                    >
                      <Calendar className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-gray-600">Aucun échéancier configuré</p>
                  </div>
                ) : (
                  paymentSchedules.map((schedule) => (
                    <motion.div
                      key={schedule.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">
                            {getTransactionTypeLabel(schedule.payment_type)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {getFrequencyLabel(schedule.frequency)} • {formatCurrency(schedule.amount)}
                          </p>
                        </div>
                        <Badge variant={schedule.is_active ? 'success' : 'default'}>
                          {schedule.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Prochain paiement</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(schedule.next_payment_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Auto-paiement</p>
                          <p className="font-medium text-gray-900">
                            {schedule.auto_pay_enabled ? 'Activé' : 'Désactivé'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Payment Accounts Tab */}
            {selectedTab === 'accounts' && (
              <div className="space-y-4">
                {paymentAccounts.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
                      style={{
                        background: 'linear-gradient(135deg, #9c5698 0%, #FF5722 50%, #FFB10B 100%)',
                      }}
                    >
                      <CreditCard className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-gray-600 mb-4">Aucun moyen de paiement</p>
                    <Button className={`${colors.primary} ${colors.primaryHover} text-white`}>
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un moyen de paiement
                    </Button>
                  </div>
                ) : (
                  paymentAccounts.map((account) => (
                    <motion.div
                      key={account.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, #9c5698 0%, #FF5722 50%, #FFB10B 100%)',
                            }}
                          >
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {account.card_brand || account.bank_name || 'Compte bancaire'}
                              {account.last_four && ` •••• ${account.last_four}`}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {account.is_default && (
                                <Badge variant="primary" className="text-xs">Par défaut</Badge>
                              )}
                              {account.is_verified ? (
                                <Badge variant="success" className="text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Vérifié
                                </Badge>
                              ) : (
                                <Badge variant="warning" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  En attente
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {account.expiry_month && account.expiry_year && (
                          <p className="text-sm text-gray-600">
                            Expire {account.expiry_month}/{account.expiry_year}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
