'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Heart, MessageCircle, Volume2, Smile, PartyPopper, Sofa, DoorOpen, Sparkles, BookOpen, Coffee, Guitar } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import IconBadge from '@/components/IconBadge';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function ResidentPersonalityPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const resident = getSection('resident');
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);

  // Personality fields from PDF
  const [introvertExtrovertScale, setIntrovertExtrovertScale] = useState(3);
  const [sociabilityLevel, setSociabilityLevel] = useState('');
  const [preferredInteractionType, setPreferredInteractionType] = useState('');
  const [homeActivityLevel, setHomeActivityLevel] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('residentPersonality', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setIntrovertExtrovertScale(saved.introvertExtrovertScale || profileData.introvert_extrovert_scale || 3);
          setSociabilityLevel(saved.sociabilityLevel || profileData.sociability_level || '');
          setPreferredInteractionType(saved.preferredInteractionType || profileData.preferred_interaction_type || '');
          setHomeActivityLevel(saved.homeActivityLevel || profileData.home_activity_level || '');
        } else if (saved.sociabilityLevel) {
          setIntrovertExtrovertScale(saved.introvertExtrovertScale || 3);
          setSociabilityLevel(saved.sociabilityLevel);
          setPreferredInteractionType(saved.preferredInteractionType);
          setHomeActivityLevel(saved.homeActivityLevel);
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading personality data:', error);
      toast.error(common.errors.loadFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!sociabilityLevel) {
      toast.error(resident.personality.errors.sociabilityRequired);
      return;
    }
    if (!preferredInteractionType) {
      toast.error(resident.personality.errors.interactionRequired);
      return;
    }
    if (!homeActivityLevel) {
      toast.error(resident.personality.errors.activityRequired);
      return;
    }

    // Save to localStorage
    safeLocalStorage.set('residentPersonality', {
      introvertExtrovertScale,
      sociabilityLevel,
      preferredInteractionType,
      homeActivityLevel,
    });

    // Navigate to next step
    router.push('/onboarding/resident/living-situation');
  };

  const canContinue = sociabilityLevel && preferredInteractionType && homeActivityLevel;

  const getPersonalityLabel = () => {
    if (introvertExtrovertScale <= 2) return 'Introvert';
    if (introvertExtrovertScale >= 4) return 'Extrovert';
    return 'Ambivert';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600">{common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/onboarding/resident/lifestyle')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{common.back}</span>
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
            <span className="text-sm font-medium text-gray-700">{resident.personality.progress}</span>
            <span className="text-sm text-gray-500">{resident.personality.title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-[#e05747] via-[#ff651e] to-[#ff9014] h-2 rounded-full transition-all" style={{ width: '75%' }} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e05747] via-[#ff651e] to-[#ff9014] bg-clip-text text-transparent mb-2">
              {resident.personality.heading}
            </h1>
            <p className="text-gray-600">
              {resident.personality.description}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Introvert/Extrovert Scale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Introvert ↔ Extrovert Scale
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={introvertExtrovertScale}
                  onChange={(e) => setIntrovertExtrovertScale(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Introvert</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-[#e05747] via-[#ff651e] to-[#ff9014] bg-clip-text text-transparent">{getPersonalityLabel()}</span>
                  <span className="text-sm text-gray-500">Extrovert</span>
                </div>
              </div>
            </div>

            {/* Sociability Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Social Activity Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'low', label: 'Low', icon: Volume2, variant: 'blue' as const, desc: 'I prefer quiet time' },
                  { value: 'medium', label: 'Medium', icon: Smile, variant: 'green' as const, desc: 'Balanced social life' },
                  { value: 'high', label: 'High', icon: PartyPopper, variant: 'orange' as const, desc: 'Love being social' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSociabilityLevel(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      sociabilityLevel === option.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <IconBadge icon={option.icon} variant={option.variant} size="lg" />
                      </div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Interaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Living Style <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {[
                  { value: 'cozy_evenings', label: 'Cozy Evenings', icon: Sofa, variant: 'purple' as const, desc: 'Movie nights and chill hangouts' },
                  { value: 'independent_living', label: 'Independent Living', icon: DoorOpen, variant: 'blue' as const, desc: 'Respect each other\'s space' },
                  { value: 'community_events', label: 'Community Events', icon: Sparkles, variant: 'pink' as const, desc: 'Group activities and parties' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPreferredInteractionType(option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      preferredInteractionType === option.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <IconBadge icon={option.icon} variant={option.variant} size="lg" />
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500 mt-1">{option.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Home Activity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How Active Are You at Home? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'quiet', label: 'Quiet', icon: BookOpen, variant: 'blue' as const, desc: 'Mostly in my room' },
                  { value: 'social', label: 'Social', icon: Coffee, variant: 'orange' as const, desc: 'Often in common areas' },
                  { value: 'very_active', label: 'Very Active', icon: Guitar, variant: 'purple' as const, desc: 'Always doing something' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setHomeActivityLevel(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      homeActivityLevel === option.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <IconBadge icon={option.icon} variant={option.variant} size="lg" />
                      </div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-8">
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                canContinue
                  ? 'bg-gradient-to-r from-[#e05747] via-[#ff651e] to-[#ff9014] hover:opacity-90 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {common.continue}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
