/**
 * Debug API - Check portfolio data access
 * GET /api/debug/portfolio
 */

import { createClient } from '@/lib/auth/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  // 1. Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      success: false,
      error: 'Not authenticated',
    });
  }

  // 2. Direct query - same as portfolio-service.getPortfolioOverview
  const { data: properties, error: propError } = await supabase
    .from('properties')
    .select('id, title, status, monthly_rent, views_count, inquiries_count')
    .eq('owner_id', user.id);

  if (propError) {
    return NextResponse.json({
      success: false,
      error: 'Properties query error',
      details: propError.message,
      userId: user.id,
    });
  }

  if (!properties || properties.length === 0) {
    return NextResponse.json({
      success: false,
      error: 'No properties found',
      userId: user.id,
      queryUsed: `owner_id = ${user.id}`,
    });
  }

  const propertyIds = properties.map(p => p.id);

  // 3. Query residents (same as portfolio-service)
  const { data: residents, error: resError } = await supabase
    .from('property_residents')
    .select('property_id')
    .in('property_id', propertyIds);

  // 4. Calculate stats (same logic as getPropertyStatsSync)
  const rentedPropertyIds = new Set(residents?.map(r => r.property_id) || []);
  const published = properties.filter(p => p.status === 'published').length;
  const rented = rentedPropertyIds.size;
  const vacant = Math.max(0, published - rented);

  // 5. Monthly rent calculation
  const totalMonthlyRent = properties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);
  const avgRent = properties.length > 0 ? Math.round(totalMonthlyRent / properties.length) : 0;
  const occupancyRate = properties.length > 0 ? Math.round((rented / properties.length) * 100) : 0;

  return NextResponse.json({
    success: true,
    userId: user.id,
    properties: {
      count: properties.length,
      published,
      items: properties.map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
        monthly_rent: p.monthly_rent,
      })),
    },
    residents: {
      count: residents?.length || 0,
      error: resError?.message,
      rentedPropertyIds: Array.from(rentedPropertyIds),
    },
    calculatedStats: {
      total: properties.length,
      published,
      rented,
      vacant,
      occupancyRate,
      totalMonthlyRent,
      avgRent,
    },
    debug: {
      propertiesQuerySuccess: !propError,
      residentsQuerySuccess: !resError,
    },
  });
}
