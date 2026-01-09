/**
 * Expense Service for Managing Shared Expenses
 * Handles: Creation, Splitting, Settlement, Export
 */

import { createClient } from '@/lib/auth/supabase-client';

// ============================================================================
// i18n TRANSLATIONS
// ============================================================================
type Language = 'fr' | 'en' | 'nl' | 'de';

let currentLang: Language = 'fr';

export function setExpenseServiceLanguage(lang: Language) {
  currentLang = lang;
}

const translations = {
  you: {
    fr: 'Toi',
    en: 'You',
    nl: 'Jij',
    de: 'Du',
  },
  unknown: {
    fr: 'Inconnu',
    en: 'Unknown',
    nl: 'Onbekend',
    de: 'Unbekannt',
  },
  errors: {
    createExpense: {
      fr: 'Erreur lors de la création de la dépense',
      en: 'Error creating the expense',
      nl: 'Fout bij het aanmaken van de uitgave',
      de: 'Fehler beim Erstellen der Ausgabe',
    },
    uploadReceipt: {
      fr: "Erreur lors de l'upload du ticket",
      en: 'Error uploading receipt',
      nl: 'Fout bij het uploaden van het bonnetje',
      de: 'Fehler beim Hochladen des Bons',
    },
  },
  pdf: {
    expenses: {
      fr: 'Dépenses',
      en: 'Expenses',
      nl: 'Uitgaven',
      de: 'Ausgaben',
    },
    allExpenses: {
      fr: 'Toutes les dépenses',
      en: 'All expenses',
      nl: 'Alle uitgaven',
      de: 'Alle Ausgaben',
    },
    dateRange: {
      fr: (from: string, to: string) => `Du ${from} au ${to}`,
      en: (from: string, to: string) => `From ${from} to ${to}`,
      nl: (from: string, to: string) => `Van ${from} tot ${to}`,
      de: (from: string, to: string) => `Von ${from} bis ${to}`,
    },
    columns: {
      date: { fr: 'Date', en: 'Date', nl: 'Datum', de: 'Datum' },
      title: { fr: 'Titre', en: 'Title', nl: 'Titel', de: 'Titel' },
      category: { fr: 'Catégorie', en: 'Category', nl: 'Categorie', de: 'Kategorie' },
      amount: { fr: 'Montant', en: 'Amount', nl: 'Bedrag', de: 'Betrag' },
      status: { fr: 'Statut', en: 'Status', nl: 'Status', de: 'Status' },
    },
  },
};
import { ocrService } from './ocr-service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type {
  Expense,
  ExpenseSplit,
  ExpenseWithDetails,
  CreateExpenseForm,
  SplitConfig,
  ExpenseExportOptions,
  ExpenseExportData,
  OCRData,
  Balance,
} from '@/types/finances.types';

class ExpenseService {
  private supabase = createClient();

  /**
   * Create a new expense with OCR scan (if receipt provided)
   */
  async createExpense(
    propertyId: string,
    userId: string,
    form: CreateExpenseForm,
    splitConfig: SplitConfig
  ): Promise<{ success: boolean; expense?: Expense; error?: string }> {
    console.log('[Expense] 🚀 createExpense called with:', {
      propertyId,
      userId,
      title: form.title,
      amount: form.amount,
      category: form.category,
      date: form.date,
      hasReceipt: !!form.receipt,
      splitMethod: splitConfig.method,
      splitsCount: splitConfig.splits.length,
    });

    try {
      let receiptImageUrl: string | undefined;
      let ocrData: OCRData | undefined;

      // If receipt provided, upload and scan
      if (form.receipt) {
        console.log('[Expense] 📤 Uploading receipt...', form.receipt.name);
        const uploadResult = await this.uploadReceipt(propertyId, form.receipt);
        console.log('[Expense] 📤 Upload result:', uploadResult);

        if (uploadResult.success && uploadResult.url) {
          receiptImageUrl = uploadResult.url;

          // Scan receipt with OCR
          console.log('[Expense] SCAN: Scanning receipt with OCR...');
          const ocrResult = await ocrService.scanReceipt(form.receipt);
          console.log('[Expense] SCAN: OCR result:', ocrResult.success);

          if (ocrResult.success && ocrResult.data) {
            ocrData = ocrResult.data;

            // Auto-fill missing fields from OCR
            if (!form.amount && ocrData.total) {
              form.amount = ocrData.total.toString();
            }
            if (!form.description && ocrData.merchant) {
              form.description = ocrData.merchant;
            }
            if (!form.date && ocrData.date) {
              form.date = ocrData.date;
            }
          }
        }
      }

      const expenseData = {
        property_id: propertyId,
        created_by: userId,
        paid_by_id: userId,
        title: form.title,
        description: form.description || null,
        amount: parseFloat(form.amount),
        category: form.category,
        date: form.date,
        status: 'pending',
        split_method: splitConfig.method,
        receipt_image_url: receiptImageUrl,
        ocr_data: ocrData ? JSON.stringify(ocrData) : null,
      };

      console.log('[Expense] 💾 Inserting expense into database:', expenseData);

      // Create expense
      const { data: expense, error: expenseError } = await this.supabase
        .from('expenses')
        .insert(expenseData)
        .select()
        .single();

      if (expenseError) {
        console.error('[Expense] ERROR: Supabase insert error:', expenseError);
        throw expenseError;
      }

      console.log('[Expense] OK: Expense created successfully:', {
        id: expense.id,
        title: expense.title,
        amount: expense.amount,
      });

      // Create splits
      console.log('[Expense] SPLITS: Creating splits...');
      await this.createSplits(expense.id, splitConfig);
      console.log('[Expense] OK: Splits created successfully');

      return { success: true, expense };
    } catch (error: any) {
      console.error('[Expense] ERROR: Failed to create expense:', error);
      return {
        success: false,
        error: error.message || translations.errors.createExpense[currentLang],
      };
    }
  }

  /**
   * Upload receipt image to Supabase Storage
   */
  private async uploadReceipt(
    propertyId: string,
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const fileName = `${propertyId}/${Date.now()}_${file.name}`;

      const { data, error } = await this.supabase.storage
        .from('property-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = this.supabase.storage.from('property-documents').getPublicUrl(data.path);

      return { success: true, url: publicUrl };
    } catch (error: any) {
      console.error('[Expense] ERROR: Failed to upload receipt:', error);
      return {
        success: false,
        error: error.message || translations.errors.uploadReceipt[currentLang],
      };
    }
  }

  /**
   * Create expense splits based on split configuration
   */
  private async createSplits(
    expenseId: string,
    splitConfig: SplitConfig
  ): Promise<void> {
    const splits = splitConfig.splits.map((allocation) => ({
      expense_id: expenseId,
      user_id: allocation.user_id,
      amount_owed:
        allocation.amount ||
        (allocation.percentage ? 0 : 0), // Calculate based on method
      paid: false,
    }));

    const { error } = await this.supabase.from('expense_splits').insert(splits);

    if (error) {
      console.error('[Expense] ERROR: Failed to create splits:', error);
      throw error;
    }

    console.log(`[Expense] OK: Created ${splits.length} splits`);
  }

  /**
   * Get all expenses for a property with enriched data
   */
  async getPropertyExpenses(
    propertyId: string,
    userId: string,
    limit: number = 50
  ): Promise<ExpenseWithDetails[]> {
    try {
      // Fetch expenses with splits
      const { data: expenses, error } = await this.supabase
        .from('expenses')
        .select(
          `
          *,
          expense_splits (
            id,
            user_id,
            amount_owed,
            paid,
            paid_at
          )
        `
        )
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Get user names for paid_by_id
      const userIds = [...new Set(expenses?.map((e) => e.paid_by_id) || [])];
      const { data: users } = await this.supabase
        .from('users')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      const userMap = new Map(users?.map((u) => [u.id, u]) || []);

      // Enrich expenses
      const enriched: ExpenseWithDetails[] =
        expenses?.map((exp) => {
          const paidBy = userMap.get(exp.paid_by_id);
          const yourSplit = exp.expense_splits?.find((s: ExpenseSplit) => s.user_id === userId);

          return {
            ...exp,
            paid_by_name:
              exp.paid_by_id === userId ? translations.you[currentLang] : paidBy?.full_name || translations.unknown[currentLang],
            paid_by_avatar: paidBy?.avatar_url,
            split_count: exp.expense_splits?.length || 0,
            your_share: yourSplit?.amount_owed || 0,
            splits: exp.expense_splits || [],
          };
        }) || [];

      return enriched;
    } catch (error) {
      console.error('[Expense] ERROR: Failed to fetch expenses:', error);
      return [];
    }
  }

  /**
   * Calculate balances between users
   */
  async calculateBalances(propertyId: string, userId: string): Promise<Balance[]> {
    try {
      const { data: expenses, error } = await this.supabase
        .from('expenses')
        .select(
          `
          id,
          paid_by_id,
          amount,
          expense_splits (
            user_id,
            amount_owed,
            paid
          )
        `
        )
        .eq('property_id', propertyId);

      if (error) throw error;

      const balanceMap = new Map<string, number>();

      expenses?.forEach((exp) => {
        const splits = exp.expense_splits || [];

        splits.forEach((split: any) => {
          if (split.user_id === userId) return; // Skip self

          const current = balanceMap.get(split.user_id) || 0;

          // If I paid and they owe me
          if (exp.paid_by_id === userId && !split.paid) {
            balanceMap.set(split.user_id, current + split.amount_owed);
          }
          // If they paid and I owe them
          else if (exp.paid_by_id === split.user_id) {
            const mySplit = splits.find((s: any) => s.user_id === userId);
            if (mySplit && !mySplit.paid) {
              balanceMap.set(split.user_id, current - mySplit.amount_owed);
            }
          }
        });
      });

      // Get user names
      const userIds = Array.from(balanceMap.keys());
      const { data: users } = await this.supabase
        .from('users')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      const balances: Balance[] = userIds.map((uid) => {
        const user = users?.find((u) => u.id === uid);
        return {
          userId: uid,
          userName: user?.full_name || translations.unknown[currentLang],
          userAvatar: user?.avatar_url,
          amount: balanceMap.get(uid) || 0,
        };
      });

      return balances.filter((b) => Math.abs(b.amount) > 0.01);
    } catch (error) {
      console.error('[Expense] ERROR: Failed to calculate balances:', error);
      return [];
    }
  }

  /**
   * Mark expense split as paid
   */
  async markSplitAsPaid(
    expenseId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('expense_splits')
        .update({
          paid: true,
          paid_at: new Date().toISOString(),
        })
        .eq('expense_id', expenseId)
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Export expenses to PDF
   */
  async exportToPDF(
    propertyId: string,
    propertyName: string,
    options: ExpenseExportOptions
  ): Promise<ExpenseExportData> {
    try {
      // Fetch expenses
      const { data: expenses } = await this.supabase
        .from('expenses')
        .select('*')
        .eq('property_id', propertyId)
        .order('date', { ascending: false });

      // Create PDF
      const doc = new jsPDF();

      // Get locale for date formatting
      const localeMap: Record<Language, string> = { fr: 'fr-FR', en: 'en-US', nl: 'nl-NL', de: 'de-DE' };
      const locale = localeMap[currentLang];

      // Title
      doc.setFontSize(18);
      doc.text(`${translations.pdf.expenses[currentLang]} - ${propertyName}`, 14, 22);

      // Date range
      doc.setFontSize(10);
      const dateRange = options.date_from && options.date_to
        ? translations.pdf.dateRange[currentLang](
            new Date(options.date_from).toLocaleDateString(locale),
            new Date(options.date_to).toLocaleDateString(locale)
          )
        : translations.pdf.allExpenses[currentLang];
      doc.text(dateRange, 14, 30);

      // Table
      const tableData =
        expenses?.map((exp) => [
          new Date(exp.date).toLocaleDateString(locale),
          exp.title,
          exp.category,
          `€${exp.amount.toFixed(2)}`,
          exp.status,
        ]) || [];

      const cols = translations.pdf.columns;
      autoTable(doc, {
        head: [[
          cols.date[currentLang],
          cols.title[currentLang],
          cols.category[currentLang],
          cols.amount[currentLang],
          cols.status[currentLang],
        ]],
        body: tableData,
        startY: 35,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [217, 87, 79] },
      });

      // Generate blob
      const blob = doc.output('blob');
      const filename = `depenses_${propertyName}_${Date.now()}.pdf`;

      return {
        filename,
        blob,
      };
    } catch (error) {
      console.error('[Expense] ERROR: Failed to export PDF:', error);
      throw error;
    }
  }
}

export const expenseService = new ExpenseService();
