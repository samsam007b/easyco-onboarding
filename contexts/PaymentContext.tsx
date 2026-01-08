'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { useAuth } from '@/lib/contexts/auth-context';
import { useLanguage } from '@/lib/i18n/use-language';
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

// =============================================================================
// TRANSLATIONS
// =============================================================================
const t = {
  auth: {
    required: {
      fr: 'Tu dois être connecté',
      en: 'You must be logged in',
      nl: 'U moet ingelogd zijn',
      de: 'Sie müssen angemeldet sein',
    },
  },
  accounts: {
    loadError: {
      fr: 'Erreur lors du chargement des moyens de paiement',
      en: 'Error loading payment methods',
      nl: 'Fout bij laden van betaalmethodes',
      de: 'Fehler beim Laden der Zahlungsmethoden',
    },
    added: {
      fr: 'Moyen de paiement ajouté avec succès',
      en: 'Payment method added successfully',
      nl: 'Betaalmethode succesvol toegevoegd',
      de: 'Zahlungsmethode erfolgreich hinzugefügt',
    },
    addError: {
      fr: "Erreur lors de l'ajout du moyen de paiement",
      en: 'Error adding payment method',
      nl: 'Fout bij toevoegen betaalmethode',
      de: 'Fehler beim Hinzufügen der Zahlungsmethode',
    },
    removed: {
      fr: 'Moyen de paiement supprimé',
      en: 'Payment method removed',
      nl: 'Betaalmethode verwijderd',
      de: 'Zahlungsmethode entfernt',
    },
    removeError: {
      fr: 'Erreur lors de la suppression',
      en: 'Error removing',
      nl: 'Fout bij verwijderen',
      de: 'Fehler beim Entfernen',
    },
    defaultUpdated: {
      fr: 'Moyen de paiement par défaut mis à jour',
      en: 'Default payment method updated',
      nl: 'Standaard betaalmethode bijgewerkt',
      de: 'Standard-Zahlungsmethode aktualisiert',
    },
    updateError: {
      fr: 'Erreur lors de la mise à jour',
      en: 'Error updating',
      nl: 'Fout bij bijwerken',
      de: 'Fehler beim Aktualisieren',
    },
  },
  transactions: {
    loadError: {
      fr: 'Erreur lors du chargement des transactions',
      en: 'Error loading transactions',
      nl: 'Fout bij laden van transacties',
      de: 'Fehler beim Laden der Transaktionen',
    },
    created: {
      fr: 'Transaction créée',
      en: 'Transaction created',
      nl: 'Transactie aangemaakt',
      de: 'Transaktion erstellt',
    },
    createError: {
      fr: 'Erreur lors de la création de la transaction',
      en: 'Error creating transaction',
      nl: 'Fout bij aanmaken transactie',
      de: 'Fehler beim Erstellen der Transaktion',
    },
    updated: {
      fr: 'Transaction mise à jour',
      en: 'Transaction updated',
      nl: 'Transactie bijgewerkt',
      de: 'Transaktion aktualisiert',
    },
    updateError: {
      fr: 'Erreur lors de la mise à jour',
      en: 'Error updating',
      nl: 'Fout bij bijwerken',
      de: 'Fehler beim Aktualisieren',
    },
  },
  schedules: {
    loadError: {
      fr: 'Erreur lors du chargement des échéanciers',
      en: 'Error loading payment schedules',
      nl: 'Fout bij laden van betalingsschema\'s',
      de: 'Fehler beim Laden der Zahlungspläne',
    },
    created: {
      fr: 'Échéancier créé avec succès',
      en: 'Payment schedule created successfully',
      nl: 'Betalingsschema succesvol aangemaakt',
      de: 'Zahlungsplan erfolgreich erstellt',
    },
    createError: {
      fr: "Erreur lors de la création de l'échéancier",
      en: 'Error creating payment schedule',
      nl: 'Fout bij aanmaken betalingsschema',
      de: 'Fehler beim Erstellen des Zahlungsplans',
    },
    updated: {
      fr: 'Échéancier mis à jour',
      en: 'Payment schedule updated',
      nl: 'Betalingsschema bijgewerkt',
      de: 'Zahlungsplan aktualisiert',
    },
    updateError: {
      fr: 'Erreur lors de la mise à jour',
      en: 'Error updating',
      nl: 'Fout bij bijwerken',
      de: 'Fehler beim Aktualisieren',
    },
    deleted: {
      fr: 'Échéancier supprimé',
      en: 'Payment schedule deleted',
      nl: 'Betalingsschema verwijderd',
      de: 'Zahlungsplan gelöscht',
    },
    deleteError: {
      fr: 'Erreur lors de la suppression',
      en: 'Error deleting',
      nl: 'Fout bij verwijderen',
      de: 'Fehler beim Löschen',
    },
  },
  payments: {
    createError: {
      fr: 'Erreur lors de la création du paiement',
      en: 'Error creating payment',
      nl: 'Fout bij aanmaken betaling',
      de: 'Fehler beim Erstellen der Zahlung',
    },
    confirmed: {
      fr: 'Paiement confirmé avec succès',
      en: 'Payment confirmed successfully',
      nl: 'Betaling succesvol bevestigd',
      de: 'Zahlung erfolgreich bestätigt',
    },
    confirmError: {
      fr: 'Erreur lors de la confirmation du paiement',
      en: 'Error confirming payment',
      nl: 'Fout bij bevestigen betaling',
      de: 'Fehler beim Bestätigen der Zahlung',
    },
  },
};

type Language = 'fr' | 'en' | 'nl' | 'de';

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
  const { language } = useLanguage();
  const langRef = useRef<Language>(language as Language);
  langRef.current = language as Language;
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
      toast.error(t.accounts.loadError[langRef.current]);
    }
  };

  const addPaymentAccount = async (params: CreatePaymentAccountParams): Promise<PaymentAccount | null> => {
    if (!user) {
      toast.error(t.auth.required[langRef.current]);
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
      toast.success(t.accounts.added[langRef.current]);
      return data;
    } catch (error) {
      console.error('Error adding payment account:', error);
      toast.error(t.accounts.addError[langRef.current]);
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
      toast.success(t.accounts.removed[langRef.current]);
      return true;
    } catch (error) {
      console.error('Error removing payment account:', error);
      toast.error(t.accounts.removeError[langRef.current]);
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
      toast.success(t.accounts.defaultUpdated[langRef.current]);
      return true;
    } catch (error) {
      console.error('Error setting default payment account:', error);
      toast.error(t.accounts.updateError[langRef.current]);
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
      toast.error(t.transactions.loadError[langRef.current]);
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (params: CreateTransactionParams): Promise<Transaction | null> => {
    if (!user) {
      toast.error(t.auth.required[langRef.current]);
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
      toast.success(t.transactions.created[langRef.current]);
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error(t.transactions.createError[langRef.current]);
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
      toast.success(t.transactions.updated[langRef.current]);
      return true;
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error(t.transactions.updateError[langRef.current]);
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
      toast.error(t.schedules.loadError[langRef.current]);
    }
  };

  const createPaymentSchedule = async (
    params: CreatePaymentScheduleParams
  ): Promise<PaymentSchedule | null> => {
    if (!user) {
      toast.error(t.auth.required[langRef.current]);
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
      toast.success(t.schedules.created[langRef.current]);
      return data;
    } catch (error) {
      console.error('Error creating payment schedule:', error);
      toast.error(t.schedules.createError[langRef.current]);
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
      toast.success(t.schedules.updated[langRef.current]);
      return true;
    } catch (error) {
      console.error('Error updating payment schedule:', error);
      toast.error(t.schedules.updateError[langRef.current]);
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
      toast.success(t.schedules.deleted[langRef.current]);
      return true;
    } catch (error) {
      console.error('Error deleting payment schedule:', error);
      toast.error(t.schedules.deleteError[langRef.current]);
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
      toast.error(t.auth.required[langRef.current]);
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
      toast.error(t.payments.createError[langRef.current]);
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

      toast.success(t.payments.confirmed[langRef.current]);
      await loadTransactions();
      return true;
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error(t.payments.confirmError[langRef.current]);
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
