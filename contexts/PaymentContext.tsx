'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { useAuth } from '@/lib/contexts/auth-context';
import { toast } from 'sonner';
import type {
  PaymentAccount,
  Transaction,
  PaymentSchedule,
  UpcomingPayment,
  TransactionSummary,
  PaymentContextValue,
  CreatePaymentAccountParams,
  CreateTransactionParams,
  CreatePaymentScheduleParams,
  UpdateTransactionParams,
  UpdatePaymentScheduleParams,
  StripePaymentIntent,
  Currency,
} from '@/types/payment.types';

const PaymentContext = createContext<PaymentContextValue | undefined>(undefined);

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
}

export function PaymentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const supabase = createClient();

  // State
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentSchedules, setPaymentSchedules] = useState<PaymentSchedule[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [transactionSummary, setTransactionSummary] = useState<TransactionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ============================================================================
  // PAYMENT ACCOUNTS
  // ============================================================================

  const loadPaymentAccounts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payment_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentAccounts(data || []);
    } catch (error) {
      console.error('Error loading payment accounts:', error);
      toast.error('Erreur lors du chargement des moyens de paiement');
    }
  };

  const addPaymentAccount = async (params: CreatePaymentAccountParams): Promise<PaymentAccount | null> => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return null;
    }

    try {
      // If this is set as default, unset other defaults first
      if (params.is_default) {
        await supabase
          .from('payment_accounts')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('payment_accounts')
        .insert({
          user_id: user.id,
          ...params,
          is_verified: false, // Requires verification
        })
        .select()
        .single();

      if (error) throw error;

      setPaymentAccounts(prev => [data, ...prev]);
      toast.success('Moyen de paiement ajouté avec succès');
      return data;
    } catch (error) {
      console.error('Error adding payment account:', error);
      toast.error('Erreur lors de l\'ajout du moyen de paiement');
      return null;
    }
  };

  const removePaymentAccount = async (accountId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('payment_accounts')
        .delete()
        .eq('id', accountId)
        .eq('user_id', user.id);

      if (error) throw error;

      setPaymentAccounts(prev => prev.filter(acc => acc.id !== accountId));
      toast.success('Moyen de paiement supprimé');
      return true;
    } catch (error) {
      console.error('Error removing payment account:', error);
      toast.error('Erreur lors de la suppression');
      return false;
    }
  };

  const setDefaultPaymentAccount = async (accountId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Unset all defaults
      await supabase
        .from('payment_accounts')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Set new default
      const { error } = await supabase
        .from('payment_accounts')
        .update({ is_default: true })
        .eq('id', accountId)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadPaymentAccounts();
      toast.success('Moyen de paiement par défaut mis à jour');
      return true;
    } catch (error) {
      console.error('Error setting default payment account:', error);
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
  };

  // ============================================================================
  // TRANSACTIONS
  // ============================================================================

  const loadTransactions = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          payer:users!transactions_payer_id_fkey(id, full_name, email, avatar_url),
          payee:users!transactions_payee_id_fkey(id, full_name, email, avatar_url),
          property:properties(id, title, address)
        `)
        .or(`payer_id.eq.${user.id},payee_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Erreur lors du chargement des transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (params: CreateTransactionParams): Promise<Transaction | null> => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          payer_id: user.id,
          ...params,
          status: 'pending',
          platform_fee: 0,
          processing_fee: 0,
        })
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => [data, ...prev]);
      toast.success('Transaction créée');
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Erreur lors de la création de la transaction');
      return null;
    }
  };

  const updateTransaction = async (
    transactionId: string,
    params: UpdateTransactionParams
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('transactions')
        .update(params)
        .eq('id', transactionId)
        .or(`payer_id.eq.${user.id},payee_id.eq.${user.id}`);

      if (error) throw error;

      await loadTransactions();
      toast.success('Transaction mise à jour');
      return true;
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
  };

  const loadTransactionSummary = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_transaction_summary', { user_uuid: user.id, months_back: 12 });

      if (error) throw error;

      if (data && data.length > 0) {
        setTransactionSummary(data[0]);
      }
    } catch (error) {
      console.error('Error loading transaction summary:', error);
    }
  };

  // ============================================================================
  // PAYMENT SCHEDULES
  // ============================================================================

  const loadPaymentSchedules = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payment_schedules')
        .select(`
          *,
          payment_account:payment_accounts(*),
          property:properties(id, title, address)
        `)
        .or(`payer_id.eq.${user.id},payee_id.eq.${user.id}`)
        .order('next_payment_date', { ascending: true });

      if (error) throw error;
      setPaymentSchedules(data || []);
    } catch (error) {
      console.error('Error loading payment schedules:', error);
      toast.error('Erreur lors du chargement des échéanciers');
    }
  };

  const createPaymentSchedule = async (
    params: CreatePaymentScheduleParams
  ): Promise<PaymentSchedule | null> => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('payment_schedules')
        .insert({
          payer_id: user.id,
          ...params,
          next_payment_date: params.start_date,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setPaymentSchedules(prev => [data, ...prev]);
      toast.success('Échéancier créé avec succès');
      return data;
    } catch (error) {
      console.error('Error creating payment schedule:', error);
      toast.error('Erreur lors de la création de l\'échéancier');
      return null;
    }
  };

  const updatePaymentSchedule = async (
    scheduleId: string,
    params: UpdatePaymentScheduleParams
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('payment_schedules')
        .update(params)
        .eq('id', scheduleId)
        .or(`payer_id.eq.${user.id},payee_id.eq.${user.id}`);

      if (error) throw error;

      await loadPaymentSchedules();
      toast.success('Échéancier mis à jour');
      return true;
    } catch (error) {
      console.error('Error updating payment schedule:', error);
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
  };

  const deletePaymentSchedule = async (scheduleId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('payment_schedules')
        .delete()
        .eq('id', scheduleId)
        .eq('payer_id', user.id);

      if (error) throw error;

      setPaymentSchedules(prev => prev.filter(s => s.id !== scheduleId));
      toast.success('Échéancier supprimé');
      return true;
    } catch (error) {
      console.error('Error deleting payment schedule:', error);
      toast.error('Erreur lors de la suppression');
      return false;
    }
  };

  const loadUpcomingPayments = async (daysAhead: number = 30) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_upcoming_payments', { user_uuid: user.id, days_ahead: daysAhead });

      if (error) throw error;
      setUpcomingPayments(data || []);
    } catch (error) {
      console.error('Error loading upcoming payments:', error);
    }
  };

  // ============================================================================
  // STRIPE INTEGRATION
  // ============================================================================

  const createPaymentIntent = async (
    amount: number,
    currency: Currency = 'EUR'
  ): Promise<StripePaymentIntent | null> => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return null;
    }

    try {
      // This would call your backend API to create a Stripe PaymentIntent
      // For now, this is a placeholder
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency }),
      });

      if (!response.ok) throw new Error('Failed to create payment intent');

      const data = await response.json();
      return data.paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Erreur lors de la création du paiement');
      return null;
    }
  };

  const confirmPayment = async (paymentIntentId: string): Promise<boolean> => {
    try {
      // This would call your backend API to confirm the payment
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId }),
      });

      if (!response.ok) throw new Error('Failed to confirm payment');

      toast.success('Paiement confirmé avec succès');
      await loadTransactions();
      return true;
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Erreur lors de la confirmation du paiement');
      return false;
    }
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Load initial data when user is authenticated
  useEffect(() => {
    if (user) {
      loadPaymentAccounts();
      loadTransactions();
      loadPaymentSchedules();
      loadUpcomingPayments();
      loadTransactionSummary();
    } else {
      // Clear data on logout
      setPaymentAccounts([]);
      setTransactions([]);
      setPaymentSchedules([]);
      setUpcomingPayments([]);
      setTransactionSummary(null);
    }
  }, [user]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: PaymentContextValue = {
    paymentAccounts,
    transactions,
    paymentSchedules,
    upcomingPayments,
    transactionSummary,
    isLoading,

    loadPaymentAccounts,
    addPaymentAccount,
    removePaymentAccount,
    setDefaultPaymentAccount,

    loadTransactions,
    createTransaction,
    updateTransaction,
    loadTransactionSummary,

    loadPaymentSchedules,
    createPaymentSchedule,
    updatePaymentSchedule,
    deletePaymentSchedule,
    loadUpcomingPayments,

    createPaymentIntent,
    confirmPayment,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}
