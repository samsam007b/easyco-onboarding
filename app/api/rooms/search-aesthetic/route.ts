import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { AestheticSearchFilters } from '@/types/room-aesthetics.types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const filters: AestheticSearchFilters = await request.json();

    // Call the Supabase function for aesthetic search
    const { data, error } = await supabase.rpc('search_rooms_by_aesthetics', {
      p_design_styles: filters.design_styles || null,
      p_min_natural_light: filters.min_natural_light || null,
      p_heating_types: filters.heating_types || null,
      p_min_design_quality: filters.min_design_quality || null,
      p_furniture_styles: filters.furniture_styles || null,
      p_room_atmospheres: filters.room_atmospheres || null,
      p_city: filters.city || null,
      p_max_price: filters.max_price || null,
      p_limit: filters.limit || 20,
      p_offset: filters.offset || 0,
    });

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ results: data || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
