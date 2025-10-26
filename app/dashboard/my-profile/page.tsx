'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, DollarSign, Users, Heart, Settings, Shield, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface ProfileData {
  full_name: string;
  email: string;
  user_type: string;
  onboarding_completed: boolean;
  // Searcher fields
  budget?: string;
  location?: string;
  move_in_date?: string;
  lifestyle?: string;
  about?: string;
  // Enhanced profile fields
  financial_info?: any;
  community_preferences?: any;
  extended_personality?: any;
  advanced_preferences?: any;
  verification_status?: string;
}

export default function MyProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const dashboard = getSection('dashboard');
  const common = getSection('common');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [stats, setStats] = useState({
    matches: 0,
    messages: 0,
    favorites: 0,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/login');
        return;
      }

      // Get user data
      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        toast.error(common.errors.loadFailed);
        return;
      }

      // Get detailed profile data
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const combinedProfile: ProfileData = {
        full_name: userData.full_name || user.email?.split('@')[0] || 'User',
        email: userData.email,
        user_type: userData.user_type,
        onboarding_completed: userData.onboarding_completed,
        budget: profileData?.budget,
        location: profileData?.location,
        move_in_date: profileData?.move_in_date,
        lifestyle: profileData?.lifestyle,
        about: profileData?.about,
        financial_info: profileData?.financial_info,
        community_preferences: profileData?.community_preferences,
        extended_personality: profileData?.extended_personality,
        advanced_preferences: profileData?.advanced_preferences,
        verification_status: profileData?.verification_status,
      };

      setProfile(combinedProfile);
      calculateCompletion(combinedProfile);

    } catch (error: any) {
      console.error('Error:', error);
      toast.error(common.errors.unexpected);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCompletion = (profile: ProfileData) => {
    const fields = [
      profile.full_name,
      profile.email,
      profile.budget,
      profile.location,
      profile.move_in_date,
      profile.lifestyle,
      profile.about,
      profile.financial_info,
      profile.community_preferences,
      profile.extended_personality,
      profile.advanced_preferences,
      profile.verification_status,
    ];

    const filledFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
    const percentage = Math.round((filledFields / fields.length) * 100);
    setCompletionPercentage(percentage);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{common.loading}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const profileSections = [
    {
      title: dashboard.myProfile.financialGuaranteeInfo,
      icon: DollarSign,
      description: dashboard.myProfile.financialDescription,
      link: '/profile/enhance/financial',
      hasData: !!profile.financial_info,
    },
    {
      title: dashboard.myProfile.communityEvents,
      icon: Users,
      description: dashboard.myProfile.communityDescription,
      link: '/profile/enhance/community',
      hasData: !!profile.community_preferences,
    },
    {
      title: dashboard.myProfile.extendedPersonality,
      icon: Heart,
      description: dashboard.myProfile.personalityDescription,
      link: '/profile/enhance/personality',
      hasData: !!profile.extended_personality,
    },
    {
      title: dashboard.myProfile.advancedPreferences,
      icon: Settings,
      description: dashboard.myProfile.preferencesDescription,
      link: '/profile/enhance/preferences',
      hasData: !!profile.advanced_preferences,
    },
    {
      title: dashboard.myProfile.profileVerification,
      icon: Shield,
      description: dashboard.myProfile.verificationDescription,
      link: '/profile/enhance/verification',
      hasData: profile.verification_status === 'verified',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push(`/dashboard/${profile.user_type}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#4A148C] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{dashboard.myProfile.backToDashboard}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#4A148C] mb-1">
                {profile.full_name}
              </h1>
              <p className="text-gray-600 capitalize">{profile.user_type}</p>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm font-bold text-[#4A148C]">{completionPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4A148C] to-[#6A1B9A] rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-[#4A148C] mb-1">{stats.matches}</div>
              <div className="text-sm text-gray-600">{dashboard.myProfile.matches}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-[#4A148C] mb-1">{stats.messages}</div>
              <div className="text-sm text-gray-600">{dashboard.myProfile.messages}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-[#4A148C] mb-1">{stats.favorites}</div>
              <div className="text-sm text-gray-600">{dashboard.myProfile.favorites}</div>
            </div>
          </div>
        </div>

        {/* Enhance Your Profile Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-[#4A148C]" />
            <h2 className="text-2xl font-bold text-[#4A148C]">{dashboard.myProfile.enhanceYourProfile}</h2>
          </div>
          <p className="text-gray-600 mb-6">
            {dashboard.myProfile.addMoreDetails}
          </p>

          <div className="grid gap-4">
            {profileSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={section.title}
                  className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        section.hasData ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          section.hasData ? 'text-green-600' : 'text-[#4A148C]'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
                        <p className="text-sm text-gray-600">{section.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => router.push(section.link)}
                      className="ml-4"
                    >
                      {section.hasData ? common.edit : dashboard.myProfile.addDetails}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit Core Profile Button */}
        <div className="text-center">
          <Button
            onClick={() => router.push(`/onboarding/${profile.user_type}/basic-info`)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Edit className="w-4 h-4 mr-2" />
            {dashboard.myProfile.editCoreProfile}
          </Button>
        </div>
      </main>
    </div>
  );
}
