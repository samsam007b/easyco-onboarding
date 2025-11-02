/**
 * Payment System Type Definitions
 * Comprehensive types for payment accounts, transactions, schedules, and reminders
 */

// ============================================================================
// PAYMENT ACCOUNT TYPES
// ============================================================================

export type PaymentType = 'card' | 'bank_transfer' | 'sepa_debit' | 'ideal';

export interface PaymentAccount {
  id: string;
  user_id: string;

  // Stripe Integration
  stripe_customer_id?: string;
  stripe_payment_method_id?: string;

  // Payment Method Details
  payment_type?: PaymentType;
  last_four?: string;
  card_brand?: string;
  expiry_month?: number;
  expiry_year?: number;

  // Bank Account
  bank_name?: string;
  account_holder_name?: string;

  // Status
  is_default: boolean;
  is_verified: boolean;

  // Metadata
  created_at: string;
  updated_at: string;
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export type TransactionType =
  | 'rent_payment'
  | 'security_deposit'
  | 'application_fee'
  | 'service_fee'
  | 'refund'
  | 'damage_charge'
  | 'utility_payment'
  | 'other';

export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'card' | 'bank_transfer' | 'sepa_debit' | 'cash' | 'other';

export type Currency = 'EUR' | 'USD' | 'GBP';

export interface Transaction {
  id: string;

  // Parties
  payer_id?: string;
  payee_id?: string;
  property_id?: string;

  // Transaction Details
  amount: number;
  currency: Currency;
  transaction_type: TransactionType;

  // Payment Processing
  status: TransactionStatus;
  payment_method?: PaymentMethod;

  // Stripe Integration
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  stripe_refund_id?: string;

  // Details
  description?: string;
  due_date?: string;
  paid_at?: string;

  // Fees
  platform_fee: number;
  processing_fee: number;

  // Metadata
  metadata?: Record<string, any>;
  receipt_url?: string;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Joined data (not in DB)
  payer?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  payee?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  property?: {
    id: string;
    title: string;
    address?: string;
  };
}

export interface TransactionWithDetails extends Transaction {
  payer: NonNullable<Transaction['payer']>;
  payee?: Transaction['payee'];
  property?: Transaction['property'];
}

// ============================================================================
// PAYMENT SCHEDULE TYPES
// ============================================================================

export type PaymentFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export type SchedulePaymentType = 'rent' | 'utilities' | 'service_fee' | 'other';

export interface PaymentSchedule {
  id: string;

  // Parties
  payer_id: string;
  payee_id?: string;
  property_id?: string;

  // Schedule Details
  amount: number;
  currency: Currency;
  frequency: PaymentFrequency;
  payment_type: SchedulePaymentType;

  // Schedule Timing
  start_date: string;
  end_date?: string;
  next_payment_date: string;
  day_of_month?: number;

  // Auto-payment
  auto_pay_enabled: boolean;
  payment_account_id?: string;

  // Status
  is_active: boolean;

  // Metadata
  description?: string;
  created_at: string;
  updated_at: string;

  // Joined data
  payment_account?: PaymentAccount;
  property?: {
    id: string;
    title: string;
    address?: string;
  };
}

export interface PaymentScheduleWithDetails extends PaymentSchedule {
  payment_account?: PaymentAccount;
  property?: NonNullable<PaymentSchedule['property']>;
}

// ============================================================================
// PAYMENT REMINDER TYPES
// ============================================================================

export type ReminderType =
  | 'upcoming'      // 7 days before
  | 'due_soon'      // 3 days before
  | 'due_today'
  | 'overdue'
  | 'failed_payment';

export type NotificationMethod = 'email' | 'push' | 'sms' | 'in_app';

export interface PaymentReminder {
  id: string;

  transaction_id?: string;
  payment_schedule_id?: string;
  user_id: string;

  // Reminder Details
  reminder_type: ReminderType;
  amount: number;
  due_date: string;

  // Notification
  sent_at: string;
  notification_method?: NotificationMethod;

  // Status
  is_acknowledged: boolean;
  acknowledged_at?: string;

  created_at: string;

  // Joined data
  transaction?: Transaction;
  payment_schedule?: PaymentSchedule;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface TransactionSummary {
  total_paid: number;
  total_received: number;
  pending_amount: number;
  transaction_count: number;
}

export interface UpcomingPayment {
  schedule_id: string;
  amount: number;
  next_payment_date: string;
  payment_type: SchedulePaymentType;
  property_id?: string;
  auto_pay_enabled: boolean;
}

// ============================================================================
// FORM/INPUT TYPES
// ============================================================================

export interface CreatePaymentAccountParams {
  stripe_payment_method_id: string;
  payment_type: PaymentType;
  is_default?: boolean;
}

export interface CreateTransactionParams {
  payee_id?: string;
  property_id?: string;
  amount: number;
  currency?: Currency;
  transaction_type: TransactionType;
  payment_method?: PaymentMethod;
  description?: string;
  due_date?: string;
}

export interface CreatePaymentScheduleParams {
  payee_id?: string;
  property_id?: string;
  amount: number;
  currency?: Currency;
  frequency: PaymentFrequency;
  payment_type: SchedulePaymentType;
  start_date: string;
  end_date?: string;
  day_of_month?: number;
  auto_pay_enabled?: boolean;
  payment_account_id?: string;
  description?: string;
}

export interface UpdateTransactionParams {
  status?: TransactionStatus;
  payment_method?: PaymentMethod;
  paid_at?: string;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  receipt_url?: string;
}

export interface UpdatePaymentScheduleParams {
  amount?: number;
  next_payment_date?: string;
  auto_pay_enabled?: boolean;
  payment_account_id?: string;
  is_active?: boolean;
}

// ============================================================================
// STRIPE TYPES
// ============================================================================

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
}

export interface StripePaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  sepa_debit?: {
    last4: string;
    bank_code?: string;
  };
}

// ============================================================================
// CONTEXT VALUE TYPE
// ============================================================================

export interface PaymentContextValue {
  // State
  paymentAccounts: PaymentAccount[];
  transactions: Transaction[];
  paymentSchedules: PaymentSchedule[];
  upcomingPayments: UpcomingPayment[];
  transactionSummary: TransactionSummary | null;
  isLoading: boolean;

  // Payment Accounts
  loadPaymentAccounts: () => Promise<void>;
  addPaymentAccount: (params: CreatePaymentAccountParams) => Promise<PaymentAccount | null>;
  removePaymentAccount: (accountId: string) => Promise<boolean>;
  setDefaultPaymentAccount: (accountId: string) => Promise<boolean>;

  // Transactions
  loadTransactions: () => Promise<void>;
  createTransaction: (params: CreateTransactionParams) => Promise<Transaction | null>;
  updateTransaction: (transactionId: string, params: UpdateTransactionParams) => Promise<boolean>;
  loadTransactionSummary: () => Promise<void>;

  // Payment Schedules
  loadPaymentSchedules: () => Promise<void>;
  createPaymentSchedule: (params: CreatePaymentScheduleParams) => Promise<PaymentSchedule | null>;
  updatePaymentSchedule: (scheduleId: string, params: UpdatePaymentScheduleParams) => Promise<boolean>;
  deletePaymentSchedule: (scheduleId: string) => Promise<boolean>;
  loadUpcomingPayments: (daysAhead?: number) => Promise<void>;

  // Stripe
  createPaymentIntent: (amount: number, currency?: Currency) => Promise<StripePaymentIntent | null>;
  confirmPayment: (paymentIntentId: string) => Promise<boolean>;
}
