import { createClient } from '@/lib/auth/supabase-server';
import { NextResponse } from 'next/server';
import { calculateProfileCompletion, type UserProfile } from '@/lib/profile/profile-completion';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user data from users table
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get profile data from user_profiles table
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Calculate completion using lib/profile/profile-completion.ts (used by dashboard/header)
    const libCompletion = calculateProfileCompletion(profileData as UserProfile);

    // Calculate completion based on /profile page logic (7 sections)
    let completed = 0;
    const total = 7;

    const pageCompletionDetails = {
      basic: { has: !!(userData?.full_name && userData?.avatar_url), value: userData?.full_name && userData?.avatar_url },
      about: { has: !!(profileData?.about_me || profileData?.looking_for), value: { about_me: profileData?.about_me, looking_for: profileData?.looking_for } },
      hobbies: { has: !!(profileData?.hobbies && profileData.hobbies.length > 0), value: profileData?.hobbies },
      personality: { has: !!profileData?.extended_personality, value: profileData?.extended_personality },
      values: { has: !!(profileData?.core_values && profileData.core_values.length > 0), value: profileData?.core_values },
      financial: { has: !!profileData?.financial_info, value: profileData?.financial_info },
      community: { has: !!profileData?.community_preferences, value: profileData?.community_preferences },
    };

    // Count completed
    if (pageCompletionDetails.basic.has) completed++;
    if (pageCompletionDetails.about.has) completed++;
    if (pageCompletionDetails.hobbies.has) completed++;
    if (pageCompletionDetails.personality.has) completed++;
    if (pageCompletionDetails.values.has) completed++;
    if (pageCompletionDetails.financial.has) completed++;
    if (pageCompletionDetails.community.has) completed++;

    const pagePercentage = Math.round((completed / total) * 100);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: userData?.full_name,
        avatar_url: userData?.avatar_url,
      },
      dashboardCompletion: {
        percentage: libCompletion.percentage,
        completedFields: libCompletion.completedFields,
        totalFields: libCompletion.totalFields,
        missingFields: libCompletion.missingFields,
        sections: libCompletion.sections,
        note: '🎯 This is what dashboard/header shows'
      },
      pageCompletion: {
        completed,
        total,
        percentage: pagePercentage,
        details: pageCompletionDetails,
        note: '📄 This is what /profile page shows'
      },
      rawProfileData: profileData
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
