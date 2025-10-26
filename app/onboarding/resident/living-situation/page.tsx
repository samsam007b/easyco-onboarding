'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Home, Calendar, FileText } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ResidentLivingSituationPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const resident = getSection('resident');
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Living situation fields
  const [currentCity, setCurrentCity] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('residentLivingSituation', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setCurrentCity(saved.currentCity || profileData.current_city || '');
          setMoveInDate(saved.moveInDate || profileData.move_in_date || '');
          setBio(saved.bio || profileData.bio || '');
        } else if (saved.currentCity) {
          setCurrentCity(saved.currentCity);
          setMoveInDate(saved.moveInDate);
          setBio(saved.bio);
        }
      }
    } catch (error) {
      console.error('Error loading living situation data:', error);
      toast.error(common.errors.loadFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!currentCity.trim()) {
      toast.error(resident.livingSituation.errors.cityRequired);
      return;
    }
    if (!moveInDate) {
      toast.error(resident.livingSituation.errors.dateRequired);
      return;
    }
    if (!bio.trim()) {
      toast.error(resident.livingSituation.errors.bioRequired);
      return;
    }
    if (bio.length < 20) {
      toast.error(resident.livingSituation.errors.bioTooShort);
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error(common.errors.noUser);
        return;
      }

      // Get all saved data from localStorage
      const basicInfo = safeLocalStorage.get('residentBasicInfo', {}) as any;
      const lifestyle = safeLocalStorage.get('residentLifestyle', {}) as any;
      const personality = safeLocalStorage.get('residentPersonality', {}) as any;

      // Combine all data
      const profileData = {
        user_id: user.id,
        // Basic Info
        first_name: basicInfo.firstName,
        last_name: basicInfo.lastName,
        date_of_birth: basicInfo.dateOfBirth,
        nationality: basicInfo.nationality,
        phone_number: basicInfo.phoneNumber,
        languages_spoken: basicInfo.languages,

        // Lifestyle
        occupation_status: lifestyle.occupationStatus,
        wake_up_time: lifestyle.wakeUpTime,
        sleep_time: lifestyle.sleepTime,
        smoker: lifestyle.isSmoker,
        cleanliness_preference: lifestyle.cleanlinessPreference,

        // Personality
        introvert_extrovert_scale: personality.introvertExtrovertScale,
        sociability_level: personality.sociabilityLevel,
        preferred_interaction_type: personality.preferredInteractionType,
        home_activity_level: personality.homeActivityLevel,

        // Living Situation
        current_city: currentCity,
        move_in_date: moveInDate,
        bio: bio,
      };

      // Upsert profile data
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (profileError) {
        console.error('Profile error:', profileError);
        toast.error(common.errors.saveFailed);
        return;
      }

      // Update users table to mark onboarding as completed
      const { error: userError } = await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (userError) {
        console.error('User update error:', userError);
        toast.error(common.errors.saveFailed);
        return;
      }

      // Clear localStorage
      safeLocalStorage.remove('residentBasicInfo');
      safeLocalStorage.remove('residentLifestyle');
      safeLocalStorage.remove('residentPersonality');
      safeLocalStorage.remove('residentLivingSituation');

      toast.success(resident.livingSituation.success, {
        description: resident.livingSituation.successDesc
      });

      router.push('/dashboard/resident');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error(common.errors.unexpected);
    } finally {
      setIsSaving(false);
    }
  };

  const canComplete = currentCity && moveInDate && bio.length >= 20;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/onboarding/resident/personality')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            disabled={isSaving}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{common.actions.back}</span>
          </button>
          <div className="text-2xl font-bold">
            <span className="text-[#4A148C]">EASY</span>
            <span className="text-[#FFD600]">Co</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{resident.livingSituation.progress}</span>
            <span className="text-sm text-gray-500">{resident.livingSituation.title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#4A148C] h-2 rounded-full transition-all" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#4A148C] mb-2">
              {resident.livingSituation.heading}
            </h1>
            <p className="text-gray-600">
              {resident.livingSituation.description}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Current City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {resident.livingSituation.fields.city.label} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  placeholder={resident.livingSituation.fields.city.placeholder}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Move-in Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {resident.livingSituation.fields.moveInDate.label} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {resident.livingSituation.fields.bio.label} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={resident.livingSituation.fields.bio.placeholder}
                  rows={5}
                  maxLength={500}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {bio.length < 20 ? resident.livingSituation.fields.bio.charCount.replace('{count}', String(20 - bio.length)) : resident.livingSituation.fields.bio.charValid}
                </span>
                <span className="text-xs text-gray-500">{bio.length}/500</span>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-[#4A148C] mb-2 flex items-center gap-2">
                <span>💡</span>
                {resident.livingSituation.tipsTitle}
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• {resident.livingSituation.tip1}</li>
                <li>• {resident.livingSituation.tip2}</li>
                <li>• {resident.livingSituation.tip3}</li>
                <li>• {resident.livingSituation.tip4}</li>
              </ul>
            </div>
          </div>

          {/* Complete Button */}
          <div className="mt-8">
            <button
              onClick={handleComplete}
              disabled={!canComplete || isSaving}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                canComplete && !isSaving
                  ? 'bg-[#FFD600] hover:bg-[#F57F17] text-black'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                  <span>{resident.livingSituation.completing}</span>
                </div>
              ) : (
                resident.livingSituation.complete
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
