import { createClient } from '@/lib/auth/supabase-server';
import { NextResponse } from 'next/server';

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

    // Calculate completion based on /profile page logic
    let completed = 0;
    const total = 7;

    const completionDetails = {
      basic: { has: !!(userData?.full_name && userData?.avatar_url), value: userData?.full_name && userData?.avatar_url },
      about: { has: !!(profileData?.about_me || profileData?.looking_for), value: { about_me: profileData?.about_me, looking_for: profileData?.looking_for } },
      hobbies: { has: !!(profileData?.hobbies && profileData.hobbies.length > 0), value: profileData?.hobbies },
      personality: { has: !!profileData?.extended_personality, value: profileData?.extended_personality },
      values: { has: !!(profileData?.core_values && profileData.core_values.length > 0), value: profileData?.core_values },
      financial: { has: !!profileData?.financial_info, value: profileData?.financial_info },
      community: { has: !!profileData?.community_preferences, value: profileData?.community_preferences },
    };

    // Count completed
    if (completionDetails.basic.has) completed++;
    if (completionDetails.about.has) completed++;
    if (completionDetails.hobbies.has) completed++;
    if (completionDetails.personality.has) completed++;
    if (completionDetails.values.has) completed++;
    if (completionDetails.financial.has) completed++;
    if (completionDetails.community.has) completed++;

    const percentage = Math.round((completed / total) * 100);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: userData?.full_name,
        avatar_url: userData?.avatar_url,
      },
      completionDetails,
      completion: {
        completed,
        total,
        percentage,
        expected: percentage === 33 ? '✅ Correct!' : `❌ Expected 33%, got ${percentage}%`
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
