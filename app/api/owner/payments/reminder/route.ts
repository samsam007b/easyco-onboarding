import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPaymentReminder, type PaymentReminderData } from '@/lib/services/email-service';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';
import { rateLimitMiddleware, getRateLimitIdentifier } from '@/lib/middleware/rate-limit';

// Create admin client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    // RATE LIMITING: 5 requests per minute (expensive email operations)
    // Uses IP-based limiting since this endpoint uses service role key
    const identifier = getRateLimitIdentifier(request);
    const rateLimitResponse = await rateLimitMiddleware(request, 'expensive', identifier);
    if (rateLimitResponse) {
      return rateLimitResponse; // 429 Too Many Requests
    }

    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: apiT('owner.paymentIdRequired', lang) },
        { status: 400 }
      );
    }

    // Get payment details with related data
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('rent_payments')
      .select(`
        id,
        amount,
        due_date,
        status,
        property_id,
        tenant_id,
        properties (
          id,
          title,
          owner_id,
          profiles:owner_id (
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      console.error('[PaymentReminder] Payment not found:', paymentError);
      return NextResponse.json(
        { error: apiT('owner.paymentNotFound', lang) },
        { status: 404 }
      );
    }

    // Get tenant information
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', payment.tenant_id)
      .single();

    if (tenantError || !tenant) {
      console.error('[PaymentReminder] Tenant not found:', tenantError);
      return NextResponse.json(
        { error: apiT('owner.tenantNotFound', lang) },
        { status: 404 }
      );
    }

    if (!tenant.email) {
      return NextResponse.json(
        { error: apiT('owner.tenantEmailNotAvailable', lang) },
        { status: 400 }
      );
    }

    // Extract property and owner info safely
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const properties = payment.properties as any;
    const property = properties || {};
    const ownerProfile = property.profiles?.[0] || property.profiles || null;

    // Prepare reminder data
    const reminderData: PaymentReminderData = {
      tenantName: `${tenant.first_name || ''} ${tenant.last_name || ''}`.trim() || 'Locataire',
      tenantEmail: tenant.email,
      propertyTitle: property.title || 'Propriete',
      amount: Number(payment.amount),
      dueDate: new Date(payment.due_date),
      ownerName: ownerProfile
        ? `${ownerProfile.first_name || ''} ${ownerProfile.last_name || ''}`.trim()
        : 'Proprietaire',
      paymentId: payment.id,
    };

    // Send the reminder
    const result = await sendPaymentReminder(reminderData);

    if (!result.success) {
      console.error('[PaymentReminder] Failed to send:', result.error);
      return NextResponse.json(
        { error: result.error || apiT('owner.reminderError', lang) },
        { status: 500 }
      );
    }

    // Log the reminder sent (could be stored in a separate table for tracking)
    console.log(`[PaymentReminder] Sent to ${tenant.email} for payment ${paymentId}`);

    // Optionally update a reminder_sent_at field if it exists
    await supabaseAdmin
      .from('rent_payments')
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq('id', paymentId);

    return NextResponse.json({
      success: true,
      message: apiT('owner.reminderSentSuccess', lang),
      messageId: result.messageId,
      sentTo: tenant.email,
    });
  } catch (error) {
    console.error('[PaymentReminder] Error:', error);
    return NextResponse.json(
      { error: apiT('common.internalServerError', lang) },
      { status: 500 }
    );
  }
}
