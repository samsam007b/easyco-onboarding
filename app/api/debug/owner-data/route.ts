/**
 * Debug API - Check owner data access
 * GET /api/debug/owner-data
 *
 * Returns diagnostic info about:
 * - Current user session
 * - Properties owned by the user
 * - Why data might not be showing
 */

import { createClient } from '@/lib/auth/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  // 1. Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json({
      success: false,
      error: 'Auth error',
      details: authError.message,
      suggestion: 'Make sure you are logged in',
    });
  }

  if (!user) {
    return NextResponse.json({
      success: false,
      error: 'Not authenticated',
      suggestion: 'Please log in first',
    });
  }

  // 2. Check properties for this user
  const { data: properties, error: propError } = await supabase
    .from('properties')
    .select('id, title, city, status, monthly_rent')
    .eq('owner_id', user.id);

  // 3. Check property_residents for these properties
  let residents = null;
  let rentPayments = null;

  if (properties && properties.length > 0) {
    const propertyIds = properties.map(p => p.id);

    const { data: resData } = await supabase
      .from('property_residents')
      .select('id, first_name, last_name, property_id')
      .in('property_id', propertyIds);
    residents = resData;

    const { data: payData, count } = await supabase
      .from('rent_payments')
      .select('id, amount, status', { count: 'exact' })
      .in('property_id', propertyIds)
      .limit(5);
    rentPayments = { sample: payData, total: count };
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
    },
    expectedOwnerId: '0fae7f94-49ff-477e-86eb-4d4742d1c616',
    isCorrectUser: user.id === '0fae7f94-49ff-477e-86eb-4d4742d1c616',
    data: {
      properties: {
        count: properties?.length || 0,
        items: properties || [],
        error: propError?.message,
      },
      residents: {
        count: residents?.length || 0,
      },
      rentPayments: rentPayments,
    },
    suggestion: properties?.length === 0
      ? 'No properties found for this user. Check if you are logged in as baudonsamuel@gmail.com'
      : 'Data found! If pages still show 0, check browser cache or try hard refresh',
  });
}
