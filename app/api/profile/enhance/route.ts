import { createClient } from '@/lib/auth/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';

export async function POST(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: apiT('common.unauthorized', lang) },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { success: false, error: apiT('profile.missingSectionOrData', lang) },
        { status: 400 }
      );
    }

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
          { success: false, error: apiT('profile.invalidSection', lang) },
          { status: 400 }
        );
    }

    // Use native upsert instead of manual INSERT/UPDATE logic
    // This avoids 400 errors from NOT NULL constraints

    // [DEBUG] DETAILED LOGGING FOR DEBUGGING
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[DEBUG] UPSERT ATTEMPT - Profile Enhance API');
    console.log('[EMAIL] User:', user.email);
    console.log('[ID] User ID:', user.id);
    console.log('[SECTION] Section:', section);
    console.log('[DATA] Update Data:', JSON.stringify(updateData, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const result = await supabase
      .from('user_profiles')
      .upsert(
        {
          user_id: user.id,
          ...updateData,
        },
        {
          onConflict: 'user_id',
          ignoreDuplicates: false,
        }
      );

    if (result.error) {
      console.error('[ERROR] DATABASE ERROR:', {
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint,
        code: result.error.code,
      });
      return NextResponse.json(
        {
          success: false,
          error: result.error.message,
          details: result.error.details,
          hint: result.error.hint,
          code: result.error.code,
        },
        { status: 500 }
      );
    }

    console.log('[OK] UPSERT SUCCESS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { success: false, error: error.message || apiT('common.internalServerError', lang) },
      { status: 500 }
    );
  }
}
