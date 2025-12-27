'use server';

import { createClient } from '@/lib/auth/supabase-server';
import { revalidatePath } from 'next/cache';

// ============================================================================
// ERROR RESOLUTION ACTIONS
// ============================================================================

export async function resolveError(errorId: string) {
  const supabase = await createClient();

  // Get current admin user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Non autorise' };
  }

  // Verify admin status
  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!admin) {
    return { success: false, error: 'Acces admin requis' };
  }

  const { error } = await supabase
    .from('security_errors')
    .update({
      resolved: true,
      resolved_at: new Date().toISOString(),
      resolved_by: user.id,
    })
    .eq('id', errorId);

  if (error) {
    console.error('[Security] Error resolving:', error);
    return { success: false, error: error.message };
  }

  // Log the action
  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'security_error_resolved',
    resource_type: 'security_error',
    resource_id: errorId,
    metadata: { resolved_at: new Date().toISOString() },
  });

  revalidatePath('/admin/dashboard/security');
  return { success: true };
}

export async function reopenError(errorId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Non autorise' };
  }

  const { error } = await supabase
    .from('security_errors')
    .update({
      resolved: false,
      resolved_at: null,
      resolved_by: null,
    })
    .eq('id', errorId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/dashboard/security');
  return { success: true };
}

export async function bulkResolveErrors(errorIds: string[]) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Non autorise' };
  }

  const { error } = await supabase
    .from('security_errors')
    .update({
      resolved: true,
      resolved_at: new Date().toISOString(),
      resolved_by: user.id,
    })
    .in('id', errorIds);

  if (error) {
    return { success: false, error: error.message };
  }

  // Log bulk action
  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'security_errors_bulk_resolved',
    resource_type: 'security_error',
    metadata: { count: errorIds.length, error_ids: errorIds },
  });

  revalidatePath('/admin/dashboard/security');
  return { success: true, count: errorIds.length };
}

// ============================================================================
// ALERT ACTIONS
// ============================================================================

export async function acknowledgeAlert(alertId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Non autorise' };
  }

  const { error } = await supabase
    .from('security_alerts')
    .update({
      acknowledged: true,
      acknowledged_at: new Date().toISOString(),
      acknowledged_by: user.id,
    })
    .eq('id', alertId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Log the action
  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'security_alert_acknowledged',
    resource_type: 'security_alert',
    resource_id: alertId,
  });

  revalidatePath('/admin/dashboard/security');
  return { success: true };
}

export async function bulkAcknowledgeAlerts(alertIds: string[]) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Non autorise' };
  }

  const { error } = await supabase
    .from('security_alerts')
    .update({
      acknowledged: true,
      acknowledged_at: new Date().toISOString(),
      acknowledged_by: user.id,
    })
    .in('id', alertIds);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/dashboard/security');
  return { success: true, count: alertIds.length };
}

// ============================================================================
// NOTIFICATION ACTIONS
// ============================================================================

export async function sendTestAlert() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Non autorise' };
  }

  // Create a test alert
  const { error } = await supabase.from('security_alerts').insert({
    severity: 'low',
    title: 'Test Alert',
    description: 'This is a test alert to verify the notification system is working correctly.',
    alert_type: 'test',
    source: 'manual',
    metadata: { triggered_by: user.id },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================================================
// DATA REFRESH
// ============================================================================

export async function refreshSecurityData() {
  revalidatePath('/admin/dashboard/security');
  return { success: true };
}
