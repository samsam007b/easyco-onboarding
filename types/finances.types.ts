/**
 * Finance Types for EasyCo Resident Hub
 * Includes: Expenses, Rent Payments, Balances, OCR Data
 */

// ============================================================================
// EXPENSE TYPES
// ============================================================================

export type ExpenseCategory =
  | 'rent'
  | 'utilities'
  | 'groceries'
  | 'cleaning'
  | 'maintenance'
  | 'internet'
  | 'other';

export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export type SplitMethod = 'equal' | 'custom' | 'percentage' | 'by_item';

export interface Expense {
  id: string;
  property_id: string;
  created_by: string;
  paid_by_id: string;

  // Basic info
  title: string;
  description?: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO date format

  // Status
  status: ExpenseStatus;

  // Splitting
  split_type: SplitMethod; // Legacy field
  split_method: SplitMethod;

  // Receipts & OCR
  receipt_url?: string; // Legacy field
  receipt_image_url?: string; // New OCR-enabled field
  ocr_data?: OCRData;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  user_id: string;
  amount_owed: number;
  paid: boolean;
  paid_at?: string;
  created_at: string;
}

export interface ExpenseWithDetails extends Expense {
  // Enriched data
  paid_by_name?: string;
  paid_by_avatar?: string;
  split_count: number;
  your_share: number;
  splits: ExpenseSplit[];
}

// ============================================================================
// OCR TYPES
// ============================================================================

export interface OCRData {
  // Raw text from OCR
  raw_text: string;

  // Extracted structured data
  merchant?: string;
  total?: number;
  date?: string;
  items?: OCRLineItem[];

  // Metadata
  confidence: number; // 0-1 score from Tesseract
  processed_at: string;
  language: string;
}

export interface OCRLineItem {
  name: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
}

export interface OCRResult {
  success: boolean;
  data?: OCRData;
  error?: string;
}

// ============================================================================
// RENT PAYMENT TYPES
// ============================================================================

export type RentPaymentStatus = 'pending' | 'paid' | 'overdue' | 'partial';

export interface RentPayment {
  id: string;
  property_id: string;
  user_id: string;

  // Payment details
  month: string; // ISO date format (first day of month)
  amount: number;
  status: RentPaymentStatus;

  // Proof and tracking
  proof_url?: string;
  paid_at?: string;
  due_date: string;

  // Notes
  notes?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface RentPaymentWithProperty extends RentPayment {
  property_name: string;
  property_address?: string;
}

export interface UpcomingRentDue {
  payment_id: string;
  property_id: string;
  property_name: string;
  amount: number;
  due_date: string;
  status: RentPaymentStatus;
  days_until_due: number;
}

// ============================================================================
// BALANCE & SETTLEMENT TYPES
// ============================================================================

export interface Balance {
  userId: string;
  userName: string;
  userAvatar?: string;
  amount: number; // Positive = they owe you, Negative = you owe them
  breakdown?: BalanceBreakdown[];
}

export interface BalanceBreakdown {
  expense_id: string;
  expense_title: string;
  amount: number;
  date: string;
}

// ============================================================================
// STATS & ANALYTICS TYPES
// ============================================================================

export interface FinanceStats {
  // Totals
  total_expenses: number;
  your_share: number;
  total_balance: number; // Net balance (positive or negative)

  // Breakdown by category
  by_category: CategoryExpense[];

  // Monthly trend
  monthly_average: number;
  this_month: number;
  last_month: number;
}

export interface CategoryExpense {
  category: ExpenseCategory;
  total: number;
  count: number;
  average: number;
}

// ============================================================================
// FORM TYPES (UI)
// ============================================================================

export interface CreateExpenseForm {
  title: string;
  amount: string; // String in form, converted to number
  category: ExpenseCategory;
  description: string;
  date: string;
  receipt?: File;
}

export interface SplitConfig {
  method: SplitMethod;
  splits: SplitAllocation[];
}

export interface SplitAllocation {
  user_id: string;
  user_name: string;
  amount?: number; // For custom split
  percentage?: number; // For percentage split
  items?: string[]; // For by-item split
}

export interface CreateRentPaymentForm {
  month: string;
  amount: string;
  due_date: string;
  proof?: File;
  notes: string;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export interface ExpenseExportOptions {
  format: 'pdf' | 'csv';
  date_from?: string;
  date_to?: string;
  categories?: ExpenseCategory[];
  include_settled?: boolean;
}

export interface ExpenseExportData {
  filename: string;
  blob: Blob;
  download_url?: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface FinanceNotification {
  type: 'rent_due' | 'expense_created' | 'payment_received' | 'balance_reminder';
  title: string;
  message: string;
  action_url?: string;
  priority: 'low' | 'medium' | 'high';
  data?: Record<string, any>;
}
