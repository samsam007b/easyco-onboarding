import { createClient } from '@/lib/auth/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { success: false, error: 'Missing section or data' },
        { status: 400 }
      );
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    let updateData: Record<string, any> = {};

    // Map sections to appropriate columns
    switch (section) {
      case 'about':
        updateData.about_me = data.aboutMe;
        updateData.looking_for = data.lookingFor;
        if (data.bio) updateData.bio = data.bio;
        break;

      case 'hobbies':
        updateData.hobbies = data.hobbies;
        break;

      case 'personality':
        updateData.extended_personality = {
          hobbies: data.hobbies || [],
          interests: data.interests || [],
          personalityTraits: data.personalityTraits || []
        };
        break;

      case 'values':
        updateData.core_values = data.coreValues || [];
        updateData.important_qualities = data.importantQualities || [];
        updateData.deal_breakers = data.dealBreakers || [];
        break;

      case 'financial':
        updateData.financial_info = {
          incomeRange: data.incomeRange,
          hasGuarantor: data.hasGuarantor,
          employmentType: data.employmentType
        };
        break;

      case 'community':
        updateData.community_preferences = {
          eventInterest: data.eventInterest,
          enjoySharedMeals: data.enjoySharedMeals,
          openToMeetups: data.openToMeetups
        };
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid section' },
          { status: 400 }
        );
    }

    let result;
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id);
    } else {
      // Insert new profile
      result = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          ...updateData,
        });
    }

    if (result.error) {
      console.error('Database error:', result.error);
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
