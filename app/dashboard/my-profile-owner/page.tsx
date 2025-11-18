'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, DollarSign, Home, Shield, TrendingUp, Building2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface ProfileData {
  full_name: string;
  email: string;
  user_type: string;
  onboarding_completed: boolean;
  // Owner fields
  landlord_type?: string;
  company_name?: string;
  phone_number?: string;
  owner_type?: string;
  primary_location?: string;
  hosting_experience?: string;
  has_property?: boolean;
  property_city?: string;
  property_type?: string;
  // Enhanced profile fields
  experience_years?: number;
  management_type?: string;
  owner_bio?: string;
  iban?: string;
  swift_bic?: string;
  verification_status?: string;
}

export default function MyProfileOwnerPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const dashboard = getSection('dashboard');
  const common = getSection('common');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [stats, setStats] = useState({
    properties: 0,
    applications: 0,
    activeListings: 0,
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
        landlord_type: profileData?.landlord_type,
        company_name: profileData?.company_name,
        phone_number: profileData?.phone_number,
        owner_type: profileData?.owner_type,
        primary_location: profileData?.primary_location,
        hosting_experience: profileData?.hosting_experience,
        has_property: profileData?.has_property,
        property_city: profileData?.property_city,
        property_type: profileData?.property_type,
        experience_years: profileData?.experience_years,
        management_type: profileData?.management_type,
        owner_bio: profileData?.owner_bio,
        iban: profileData?.iban,
        swift_bic: profileData?.swift_bic,
        verification_status: profileData?.verification_status,
      };

      setProfile(combinedProfile);
      calculateCompletion(combinedProfile);

      // Load properties count
      const { data: properties } = await supabase
        .from('properties')
        .select('id, status')
        .eq('owner_id', user.id);

      if (properties) {
        setStats({
          properties: properties.length,
          applications: 0, // TODO: implement when applications table exists
          activeListings: properties.filter(p => p.status === 'published').length,
        });
      }

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
      profile.landlord_type,
      profile.phone_number,
      profile.owner_type,
      profile.primary_location,
      profile.hosting_experience,
      profile.has_property,
      profile.property_city,
      profile.property_type,
      profile.experience_years,
      profile.management_type,
      profile.owner_bio,
      profile.iban,
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
      title: dashboard.myProfileOwner.propertyInformation,
      icon: Home,
      description: dashboard.myProfileOwner.propertyInfoDescription,
      link: '/onboarding/owner/property-info',
      hasData: !!(profile.has_property && profile.property_city && profile.property_type),
    },
    {
      title: dashboard.myProfileOwner.paymentBanking,
      icon: DollarSign,
      description: dashboard.myProfileOwner.paymentDescription,
      link: '/onboarding/owner/payment-info',
      hasData: !!(profile.iban && profile.swift_bic),
    },
    {
      title: dashboard.myProfileOwner.experienceManagement,
      icon: Building2,
      description: dashboard.myProfileOwner.experienceDescription,
      link: '/profile/enhance-owner/experience',
      hasData: !!(profile.experience_years || profile.management_type),
    },
    {
      title: dashboard.myProfileOwner.ownerBioStory,
      icon: FileText,
      description: dashboard.myProfileOwner.bioDescription,
      link: '/profile/enhance-owner/bio',
      hasData: !!profile.owner_bio,
    },
    {
      title: dashboard.myProfileOwner.verificationDocuments,
      icon: Shield,
      description: dashboard.myProfileOwner.verificationDescription,
      link: '/profile/enhance-owner/verification',
      hasData: profile.verification_status === 'verified',
    },
  ];

  const getLandlordTypeLabel = () => {
    if (profile.landlord_type === 'individual') return dashboard.myProfileOwner.landlordTypes.individual;
    if (profile.landlord_type === 'agency') return dashboard.myProfileOwner.landlordTypes.agency;
    if (profile.landlord_type === 'company') return dashboard.myProfileOwner.landlordTypes.company;
    return dashboard.myProfileOwner.landlordTypes.owner;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard/owner')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#4A148C] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{common.backToDashboard}</span>
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
              <p className="text-gray-600 capitalize">
                {getLandlordTypeLabel()}
              </p>
              {profile.company_name && (
                <p className="text-sm text-gray-500 mt-1">{profile.company_name}</p>
              )}
            </div>
          </div>

          {/* Profile Completion */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{dashboard.myProfileOwner.profileCompletion}</span>
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
              <div className="text-2xl font-bold text-[#4A148C] mb-1">{stats.properties}</div>
              <div className="text-sm text-gray-600">{dashboard.myProfileOwner.stats.properties}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-[#4A148C] mb-1">{stats.activeListings}</div>
              <div className="text-sm text-gray-600">{dashboard.myProfileOwner.stats.activeListings}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-[#4A148C] mb-1">{stats.applications}</div>
              <div className="text-sm text-gray-600">{dashboard.myProfileOwner.stats.applications}</div>
            </div>
          </div>
        </div>

        {/* Enhance Your Profile Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-[#4A148C]" />
            <h2 className="text-2xl font-bold text-[#4A148C]">{dashboard.myProfileOwner.enhanceTitle}</h2>
          </div>
          <p className="text-gray-600 mb-6">
            {dashboard.myProfileOwner.enhanceDescription}
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
                      {section.hasData ? common.edit : dashboard.myProfileOwner.addDetails}
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
            onClick={() => router.push('/onboarding/owner/basic-info')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Edit className="w-4 h-4 mr-2" />
            {dashboard.myProfileOwner.editCoreProfile}
          </Button>
        </div>
      </main>
    </div>
  );
}
