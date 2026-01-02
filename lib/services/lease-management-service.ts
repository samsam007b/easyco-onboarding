/**
 * Lease Management Service
 * Handles creating and managing leases from approved applications
 */

import { createClient } from '@/lib/auth/supabase-client';

export interface CreateLeaseFromApplicationData {
  applicationId: string;
  propertyId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  moveInDate: Date;
  leaseDurationMonths: number;
  monthlyRent: number;
  depositAmount?: number;
  terms?: string;
}

export interface LeaseCreationResult {
  success: boolean;
  leaseId?: string;
  error?: string;
}

class LeaseManagementService {
  /**
   * Create a new lease from an approved application
   * This creates a property_resident record and optionally sets up initial rent payment
   */
  async createLeaseFromApplication(data: CreateLeaseFromApplicationData): Promise<LeaseCreationResult> {
    try {
      const supabase = createClient();

      // 1. Check if a resident already exists for this property + applicant
      const { data: existingResident } = await supabase
        .from('property_residents')
        .select('id')
        .eq('property_id', data.propertyId)
        .eq('user_id', data.applicantId)
        .single();

      if (existingResident) {
        return {
          success: false,
          error: 'Ce locataire est déjà associé à cette propriété'
        };
      }

      // 2. Parse applicant name into first/last
      const nameParts = data.applicantName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // 3. Create the property_resident record (which acts as the lease)
      const { data: newResident, error: residentError } = await supabase
        .from('property_residents')
        .insert({
          property_id: data.propertyId,
          user_id: data.applicantId,
          first_name: firstName,
          last_name: lastName,
          email: data.applicantEmail,
          phone: data.applicantPhone || null,
          move_in_date: data.moveInDate.toISOString().split('T')[0],
          lease_duration_months: data.leaseDurationMonths,
          is_active: true,
          // Additional lease fields if the table supports them
          monthly_rent: data.monthlyRent,
          deposit_amount: data.depositAmount || null,
          lease_terms: data.terms || null,
        })
        .select('id')
        .single();

      if (residentError) {
        console.error('[LeaseManagement] Error creating resident:', residentError);

        // If columns don't exist, try with minimal fields
        if (residentError.code === '42703') {
          const { data: minimalResident, error: minimalError } = await supabase
            .from('property_residents')
            .insert({
              property_id: data.propertyId,
              user_id: data.applicantId,
              first_name: firstName,
              last_name: lastName,
              email: data.applicantEmail,
              phone: data.applicantPhone || null,
              move_in_date: data.moveInDate.toISOString().split('T')[0],
              lease_duration_months: data.leaseDurationMonths,
              is_active: true,
            })
            .select('id')
            .single();

          if (minimalError) {
            console.error('[LeaseManagement] Error with minimal insert:', minimalError);
            return {
              success: false,
              error: 'Impossible de créer le bail: ' + minimalError.message
            };
          }

          return {
            success: true,
            leaseId: minimalResident?.id
          };
        }

        return {
          success: false,
          error: 'Impossible de créer le bail: ' + residentError.message
        };
      }

      // 4. Update the application status to mark it as converted to lease
      await supabase
        .from('applications')
        .update({
          status: 'approved',
          review_notes: `Bail créé le ${new Date().toLocaleDateString('fr-FR')}`
        })
        .eq('id', data.applicationId);

      // 5. Create initial rent payment record if needed
      // This is optional - uncomment if you want to auto-create first payment
      /*
      const { error: paymentError } = await supabase
        .from('rent_payments')
        .insert({
          property_id: data.propertyId,
          user_id: data.applicantId,
          amount: data.monthlyRent,
          due_date: data.moveInDate.toISOString().split('T')[0],
          status: 'pending',
          payment_type: 'rent',
        });

      if (paymentError) {
        console.warn('[LeaseManagement] Could not create initial payment:', paymentError);
      }
      */

      console.log(`[LeaseManagement] ✅ Created lease for ${data.applicantName} at property ${data.propertyId}`);

      return {
        success: true,
        leaseId: newResident?.id
      };
    } catch (error) {
      console.error('[LeaseManagement] Unexpected error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inattendue'
      };
    }
  }

  /**
   * Get application details for lease creation
   */
  async getApplicationForLease(applicationId: string): Promise<{
    application: CreateLeaseFromApplicationData | null;
    property: { title: string; monthlyRent: number } | null;
    error?: string;
  }> {
    try {
      const supabase = createClient();

      // Fetch application with property details
      const { data: app, error } = await supabase
        .from('applications')
        .select(`
          id,
          property_id,
          applicant_id,
          applicant_name,
          applicant_email,
          applicant_phone,
          desired_move_in_date,
          lease_duration_months,
          properties (
            id,
            title,
            monthly_rent
          )
        `)
        .eq('id', applicationId)
        .single();

      if (error || !app) {
        return {
          application: null,
          property: null,
          error: 'Application non trouvée'
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const property = app.properties as any;

      return {
        application: {
          applicationId: app.id,
          propertyId: app.property_id,
          applicantId: app.applicant_id,
          applicantName: app.applicant_name,
          applicantEmail: app.applicant_email,
          applicantPhone: app.applicant_phone || undefined,
          moveInDate: app.desired_move_in_date
            ? new Date(app.desired_move_in_date)
            : new Date(),
          leaseDurationMonths: app.lease_duration_months || 12,
          monthlyRent: property?.monthly_rent || 0,
        },
        property: {
          title: property?.title || 'Propriété',
          monthlyRent: property?.monthly_rent || 0,
        }
      };
    } catch (error) {
      console.error('[LeaseManagement] Error fetching application:', error);
      return {
        application: null,
        property: null,
        error: 'Erreur lors de la récupération des données'
      };
    }
  }
}

export const leaseManagementService = new LeaseManagementService();
