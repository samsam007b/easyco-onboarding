'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Users, Heart, Home, Shield, TrendingUp, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface ProfileData {
  full_name: string;
  email: string;
  user_type: string;
  onboarding_completed: boolean;
  // Resident fields
  current_city?: string;
  current_lease_end?: string;
  bio?: string;
  interests?: string;
  occupation?: string;
  // Enhanced profile fields
  community_preferences?: any;
  extended_personality?: any;
  lifestyle_preferences?: any;
  verification_status?: string;
}

export default function MyProfileResidentPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const dashboard = getSection('dashboard');
  const common = getSection('common');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [stats, setStats] = useState({
    connections: 0,
    events: 0,
    posts: 0,
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
        // FIXME: Use logger.error('Error loading profile:', profileError);
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
        current_city: profileData?.current_city,
        current_lease_end: profileData?.current_lease_end,
        bio: profileData?.bio,
        interests: profileData?.interests,
        occupation: profileData?.occupation,
        community_preferences: profileData?.community_preferences,
        extended_personality: profileData?.extended_personality,
        lifestyle_preferences: profileData?.lifestyle_preferences,
        verification_status: profileData?.verification_status,
      };

      setProfile(combinedProfile);
      calculateCompletion(combinedProfile);

    } catch (error: any) {
      // FIXME: Use logger.error('Error:', error);
      toast.error(common.errors.unexpected);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCompletion = (profile: ProfileData) => {
    const fields = [
      profile.full_name,
      profile.email,
      profile.current_city,
      profile.current_lease_end,
      profile.bio,
      profile.interests,
      profile.occupation,
      profile.community_preferences,
      profile.extended_personality,
      profile.lifestyle_preferences,
      profile.verification_status,
    ];

    const filledFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
    const percentage = Math.round((filledFields / fields.length) * 100);
    setCompletionPercentage(percentage);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={64} />
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
      title: dashboard.myProfileResident?.livingInfo || 'Current Living Situation',
      icon: Home,
      description: dashboard.myProfileResident?.livingDescription || 'Update your current residence and lease information',
      link: '/onboarding/resident/basic-info',
      hasData: !!(profile.current_city && profile.current_lease_end),
    },
    {
      title: dashboard.myProfileResident?.communityEvents || 'Community & Events',
      icon: Users,
      description: dashboard.myProfileResident?.communityDescription || 'Share your community event preferences',
      link: '/profile/enhance-resident/community',
      hasData: !!profile.community_preferences,
    },
    {
      title: dashboard.myProfileResident?.personalityInterests || 'Personality & Interests',
      icon: Heart,
      description: dashboard.myProfileResident?.personalityDescription || 'Share your interests and personality traits',
      link: '/profile/enhance-resident/personality',
      hasData: !!(profile.extended_personality || profile.interests),
    },
    {
      title: dashboard.myProfileResident?.lifestylePreferences || 'Lifestyle Preferences',
      icon: MessageCircle,
      description: dashboard.myProfileResident?.lifestyleDescription || 'Define your living style and preferences',
      link: '/profile/enhance-resident/lifestyle',
      hasData: !!profile.lifestyle_preferences,
    },
    {
      title: dashboard.myProfileResident?.verification || 'Profile Verification',
      icon: Shield,
      description: dashboard.myProfileResident?.verificationDescription || 'Verify your identity for better connections',
      link: '/profile/enhance-resident/verification',
      hasData: profile.verification_status === 'verified',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard/resident')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#4A148C] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{dashboard.myProfile?.backToDashboard || common.backToDashboard}</span>
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
              {profile.current_city && (
                <p className="text-sm text-gray-500 mt-1">
                  {dashboard.myProfileResident?.currentlyLiving || 'Living in'} {profile.current_city}
                </p>
              )}
            </div>
          </div>

          {/* Profile Completion */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {dashboard.myProfileResident?.profileCompletion || 'Profile Completion'}
              </span>
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
              <div className="text-2xl font-bold text-[#4A148C] mb-1">{stats.connections}</div>
              <div className="text-sm text-gray-600">
                {dashboard.myProfileResident?.stats?.connections || 'Connections'}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-[#4A148C] mb-1">{stats.events}</div>
              <div className="text-sm text-gray-600">
                {dashboard.myProfileResident?.stats?.events || 'Events'}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-[#4A148C] mb-1">{stats.posts}</div>
              <div className="text-sm text-gray-600">
                {dashboard.myProfileResident?.stats?.posts || 'Posts'}
              </div>
            </div>
          </div>
        </div>

        {/* Enhance Your Profile Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-[#4A148C]" />
            <h2 className="text-2xl font-bold text-[#4A148C]">
              {dashboard.myProfile?.enhanceYourProfile || 'Enhance Your Profile'}
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            {dashboard.myProfile?.addMoreDetails || 'Add more details to help you connect with your community'}
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
                        section.hasData ? 'bg-green-100' : 'bg-orange-100'
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
                      {section.hasData ? common.edit : (dashboard.myProfile?.addDetails || 'Add')}
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
            onClick={() => router.push('/onboarding/resident/basic-info')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Edit className="w-4 h-4 mr-2" />
            {dashboard.myProfile?.editCoreProfile || 'Edit Core Profile'}
          </Button>
        </div>
      </main>
    </div>
  );
}
