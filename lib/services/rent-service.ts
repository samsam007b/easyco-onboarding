/**
 * Rent Payment Service for Managing Monthly Rent
 * Handles: Payment tracking, reminders, history, projections
 */

import { createClient } from '@/lib/auth/supabase-client';

// ============================================================================
// i18n TRANSLATIONS
// ============================================================================
type Language = 'fr' | 'en' | 'nl' | 'de';

let currentLang: Language = 'fr';

export function setRentServiceLanguage(lang: Language) {
  currentLang = lang;
}

const translations = {
  unknownProperty: {
    fr: 'Propriété inconnue',
    en: 'Unknown property',
    nl: 'Onbekende woning',
    de: 'Unbekannte Immobilie',
  },
  errors: {
    recordPayment: {
      fr: "Erreur lors de l'enregistrement du paiement",
      en: 'Error recording payment',
      nl: 'Fout bij het registreren van de betaling',
      de: 'Fehler beim Aufzeichnen der Zahlung',
    },
    uploadProof: {
      fr: "Erreur lors de l'upload du justificatif",
      en: 'Error uploading receipt',
      nl: 'Fout bij het uploaden van het bewijs',
      de: 'Fehler beim Hochladen des Belegs',
    },
    createSchedule: {
      fr: "Erreur lors de la création de l'échéancier",
      en: 'Error creating payment schedule',
      nl: 'Fout bij het aanmaken van het betalingsschema',
      de: 'Fehler beim Erstellen des Zahlungsplans',
    },
  },
};
import type {
  RentPayment,
  RentPaymentWithProperty,
  UpcomingRentDue,
  CreateRentPaymentForm,
} from '@/types/finances.types';

class RentService {
  private supabase = createClient();

  /**
   * Get upcoming rent due dates for a user
   */
  async getUpcomingDues(
    userId: string,
    daysAhead: number = 30
  ): Promise<UpcomingRentDue[]> {
    try {
      const { data, error } = await this.supabase.rpc('get_upcoming_rent_dues', {
        p_user_id: userId,
        p_days_ahead: daysAhead,
      });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('[Rent] ❌ Failed to fetch upcoming dues:', error);
      return [];
    }
  }

  /**
   * Get rent payment history for a user
   */
  async getPaymentHistory(
    userId: string,
    limit: number = 12
  ): Promise<RentPaymentWithProperty[]> {
    try {
      const { data: payments, error } = await this.supabase
        .from('rent_payments')
        .select(
          `
          *,
          properties (
            title,
            address
          )
        `
        )
        .eq('user_id', userId)
        .order('month', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const enriched: RentPaymentWithProperty[] =
        payments?.map((p) => ({
          ...p,
          property_name: (p.properties as any)?.title || translations.unknownProperty[currentLang],
          property_address: (p.properties as any)?.address,
        })) || [];

      return enriched;
    } catch (error) {
      console.error('[Rent] ❌ Failed to fetch payment history:', error);
      return [];
    }
  }

  /**
   * Create or update a rent payment
   */
  async recordPayment(
    propertyId: string,
    userId: string,
    form: CreateRentPaymentForm
  ): Promise<{ success: boolean; payment?: RentPayment; error?: string }> {
    try {
      let proofUrl: string | undefined;

      // Upload proof if provided
      if (form.proof) {
        const uploadResult = await this.uploadProof(propertyId, userId, form.proof);
        if (uploadResult.success && uploadResult.url) {
          proofUrl = uploadResult.url;
        }
      }

      // Upsert rent payment (unique constraint on property_id, user_id, month)
      const { data: payment, error } = await this.supabase
        .from('rent_payments')
        .upsert(
          {
            property_id: propertyId,
            user_id: userId,
            month: form.month,
            amount: parseFloat(form.amount),
            due_date: form.due_date,
            proof_url: proofUrl,
            notes: form.notes || null,
            status: proofUrl ? 'paid' : 'pending',
            paid_at: proofUrl ? new Date().toISOString() : null,
          },
          {
            onConflict: 'property_id,user_id,month',
          }
        )
        .select()
        .single();

      if (error) throw error;

      console.log('[Rent] ✅ Payment recorded:', payment.id);

      return { success: true, payment };
    } catch (error: any) {
      console.error('[Rent] ❌ Failed to record payment:', error);
      return {
        success: false,
        error: error.message || translations.errors.recordPayment[currentLang],
      };
    }
  }

  /**
   * Upload payment proof to Supabase Storage
   */
  private async uploadProof(
    propertyId: string,
    userId: string,
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const fileName = `rent/${propertyId}/${userId}/${Date.now()}_${file.name}`;

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
      console.error('[Rent] ❌ Failed to upload proof:', error);
      return {
        success: false,
        error: error.message || translations.errors.uploadProof[currentLang],
      };
    }
  }

  /**
   * Get rent statistics for a user
   */
  async getRentStats(userId: string) {
    try {
      const { data: payments } = await this.supabase
        .from('rent_payments')
        .select('amount, status, paid_at, due_date')
        .eq('user_id', userId)
        .order('month', { ascending: false })
        .limit(12);

      if (!payments || payments.length === 0) {
        return {
          total_paid: 0,
          total_pending: 0,
          avg_monthly: 0,
          on_time_percentage: 0,
          overdue_count: 0,
        };
      }

      const paidPayments = payments.filter((p) => p.status === 'paid');
      const pendingPayments = payments.filter((p) => p.status === 'pending');
      const overduePayments = payments.filter((p) => p.status === 'overdue');

      // Calculate on-time percentage (paid before or on due date)
      const onTimePayments = paidPayments.filter((p) => {
        if (!p.paid_at || !p.due_date) return false;
        return new Date(p.paid_at) <= new Date(p.due_date);
      });

      const onTimePercentage =
        paidPayments.length > 0
          ? Math.round((onTimePayments.length / paidPayments.length) * 100)
          : 0;

      // Calculate totals
      const totalPaid = paidPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      const totalPending = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      const avgMonthly = totalPaid / (paidPayments.length || 1);

      return {
        total_paid: totalPaid,
        total_pending: totalPending,
        avg_monthly: avgMonthly,
        on_time_percentage: onTimePercentage,
        overdue_count: overduePayments.length,
      };
    } catch (error) {
      console.error('[Rent] ❌ Failed to calculate stats:', error);
      return {
        total_paid: 0,
        total_pending: 0,
        avg_monthly: 0,
        on_time_percentage: 0,
        overdue_count: 0,
      };
    }
  }

  /**
   * Mark a rent payment as overdue
   * (Usually called by a cron job or background task)
   */
  async markOverduePayments(): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .from('rent_payments')
        .update({ status: 'overdue' })
        .eq('status', 'pending')
        .lt('due_date', new Date().toISOString().split('T')[0])
        .select('id');

      if (error) throw error;

      const count = data?.length || 0;
      console.log(`[Rent] ✅ Marked ${count} payments as overdue`);

      return count;
    } catch (error) {
      console.error('[Rent] ❌ Failed to mark overdue payments:', error);
      return 0;
    }
  }

  /**
   * Create rent payment schedule for next N months
   * Useful for initial setup or annual renewal
   */
  async createPaymentSchedule(
    propertyId: string,
    userId: string,
    monthlyAmount: number,
    dueDay: number = 5, // 5th of each month by default
    monthsAhead: number = 12
  ): Promise<{ success: boolean; created: number; error?: string }> {
    try {
      const payments = [];
      const today = new Date();

      for (let i = 0; i < monthsAhead; i++) {
        const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
        const dueDate = new Date(month.getFullYear(), month.getMonth(), dueDay);

        payments.push({
          property_id: propertyId,
          user_id: userId,
          month: month.toISOString().split('T')[0],
          amount: monthlyAmount,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'pending',
        });
      }

      const { data, error } = await this.supabase
        .from('rent_payments')
        .upsert(payments, {
          onConflict: 'property_id,user_id,month',
        })
        .select('id');

      if (error) throw error;

      const created = data?.length || 0;
      console.log(`[Rent] ✅ Created payment schedule: ${created} payments`);

      return { success: true, created };
    } catch (error: any) {
      console.error('[Rent] ❌ Failed to create payment schedule:', error);
      return {
        success: false,
        created: 0,
        error: error.message || translations.errors.createSchedule[currentLang],
      };
    }
  }
}

export const rentService = new RentService();
