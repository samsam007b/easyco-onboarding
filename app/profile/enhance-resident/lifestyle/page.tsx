'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coffee, Moon, Music, Utensils, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

export default function LifestyleResidentPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Lifestyle preferences
  const [sleepSchedule, setSleepSchedule] = useState<'early-bird' | 'night-owl' | 'flexible' | ''>('');
  const [cleanliness, setCleanliness] = useState<'very-clean' | 'moderately-clean' | 'relaxed' | ''>('');
  const [noiseTolerance, setNoiseTolerance] = useState<'quiet' | 'moderate' | 'lively' | ''>('');
  const [cookingFrequency, setCookingFrequency] = useState<'daily' | 'often' | 'rarely' | ''>('');
  const [guestsFrequency, setGuestsFrequency] = useState<'never' | 'rarely' | 'sometimes' | 'often' | ''>('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('lifestyle_preferences')
        .eq('user_id', user.id)
        .single();

      if (profileData?.lifestyle_preferences) {
        const prefs = profileData.lifestyle_preferences;
        setSleepSchedule(prefs.sleepSchedule || '');
        setCleanliness(prefs.cleanliness || '');
        setNoiseTolerance(prefs.noiseTolerance || '');
        setCookingFrequency(prefs.cookingFrequency || '');
        setGuestsFrequency(prefs.guestsFrequency || '');
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading lifestyle preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!sleepSchedule || !cleanliness || !noiseTolerance) {
      toast.error('Please answer all required questions');
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const lifestylePreferences = {
        sleepSchedule,
        cleanliness,
        noiseTolerance,
        cookingFrequency,
        guestsFrequency,
      };

      const { error } = await supabase
        .from('user_profiles')
        .update({ lifestyle_preferences: lifestylePreferences })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Lifestyle preferences saved!');
      router.push('/dashboard/my-profile-resident');
    } catch (error) {
      // FIXME: Use logger.error('Error saving lifestyle preferences:', error);
      toast.error(common.errors.unexpected);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard/my-profile-resident')}
          className="mb-6 text-[#4A148C] hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#4A148C] mb-2">
            Lifestyle Preferences
          </h1>
          <p className="text-gray-600">
            Help us understand your daily lifestyle and living habits
          </p>
        </div>

        <div className="space-y-6">
          {/* Sleep Schedule */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Moon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sleep Schedule *</h3>
                <p className="text-sm text-gray-500">When do you typically sleep?</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setSleepSchedule('early-bird')}
                className={`p-4 rounded-xl text-sm font-medium transition border-2 ${
                  sleepSchedule === 'early-bird'
                    ? 'bg-[#4A148C] text-white border-[#4A148C]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#4A148C]'
                }`}
              >
                <div className="text-2xl mb-1">🌅</div>
                Early Bird
                <div className="text-xs mt-1 opacity-70">Sleep before 11pm</div>
              </button>
              <button
                onClick={() => setSleepSchedule('night-owl')}
                className={`p-4 rounded-xl text-sm font-medium transition border-2 ${
                  sleepSchedule === 'night-owl'
                    ? 'bg-[#4A148C] text-white border-[#4A148C]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#4A148C]'
                }`}
              >
                <div className="text-2xl mb-1">🦉</div>
                Night Owl
                <div className="text-xs mt-1 opacity-70">Sleep after 1am</div>
              </button>
              <button
                onClick={() => setSleepSchedule('flexible')}
                className={`p-4 rounded-xl text-sm font-medium transition border-2 ${
                  sleepSchedule === 'flexible'
                    ? 'bg-[#4A148C] text-white border-[#4A148C]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#4A148C]'
                }`}
              >
                <div className="text-2xl mb-1">⏰</div>
                Flexible
                <div className="text-xs mt-1 opacity-70">Varies by day</div>
              </button>
            </div>
          </div>

          {/* Cleanliness */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cleanliness Level *</h3>
                <p className="text-sm text-gray-500">How clean do you keep your space?</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setCleanliness('very-clean')}
                className={`p-4 rounded-xl text-sm font-medium transition border-2 ${
                  cleanliness === 'very-clean'
                    ? 'bg-[#4A148C] text-white border-[#4A148C]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#4A148C]'
                }`}
              >
                <div className="text-2xl mb-1">✨</div>
                Very Clean
                <div className="text-xs mt-1 opacity-70">Everything spotless</div>
              </button>
              <button
                onClick={() => setCleanliness('moderately-clean')}
                className={`p-4 rounded-xl text-sm font-medium transition border-2 ${
                  cleanliness === 'moderately-clean'
                    ? 'bg-[#4A148C] text-white border-[#4A148C]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#4A148C]'
                }`}
              >
                <div className="text-2xl mb-1">👍</div>
                Moderate
                <div className="text-xs mt-1 opacity-70">Tidy most times</div>
              </button>
              <button
                onClick={() => setCleanliness('relaxed')}
                className={`p-4 rounded-xl text-sm font-medium transition border-2 ${
                  cleanliness === 'relaxed'
                    ? 'bg-[#4A148C] text-white border-[#4A148C]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#4A148C]'
                }`}
              >
                <div className="text-2xl mb-1">😌</div>
                Relaxed
                <div className="text-xs mt-1 opacity-70">Lived-in feel</div>
              </button>
            </div>
          </div>

          {/* Noise Tolerance */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <Music className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Noise Preference *</h3>
                <p className="text-sm text-gray-500">What's your ideal noise level?</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setNoiseTolerance('quiet')}
                className={`p-4 rounded-xl text-sm font-medium transition border-2 ${
                  noiseTolerance === 'quiet'
                    ? 'bg-[#4A148C] text-white border-[#4A148C]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#4A148C]'
                }`}
              >
                <div className="text-2xl mb-1">🤫</div>
                Quiet
                <div className="text-xs mt-1 opacity-70">Peace & tranquility</div>
              </button>
              <button
                onClick={() => setNoiseTolerance('moderate')}
                className={`p-4 rounded-xl text-sm font-medium transition border-2 ${
                  noiseTolerance === 'moderate'
                    ? 'bg-[#4A148C] text-white border-[#4A148C]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#4A148C]'
                }`}
              >
                <div className="text-2xl mb-1">🔉</div>
                Moderate
                <div className="text-xs mt-1 opacity-70">Normal sounds OK</div>
              </button>
              <button
                onClick={() => setNoiseTolerance('lively')}
                className={`p-4 rounded-xl text-sm font-medium transition border-2 ${
                  noiseTolerance === 'lively'
                    ? 'bg-[#4A148C] text-white border-[#4A148C]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#4A148C]'
                }`}
              >
                <div className="text-2xl mb-1">🔊</div>
                Lively
                <div className="text-xs mt-1 opacity-70">Energy & vibes</div>
              </button>
            </div>
          </div>

          {/* Cooking Frequency */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cooking Frequency</h3>
                <p className="text-sm text-gray-500">How often do you cook at home?</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: 'daily', label: 'Daily', emoji: '👨‍🍳' },
                { value: 'often', label: 'Often', emoji: '🍳' },
                { value: 'rarely', label: 'Rarely', emoji: '🍕' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setCookingFrequency(option.value as any)}
                  className={`p-4 rounded-xl text-sm font-medium transition border-2 ${
                    cookingFrequency === option.value
                      ? 'bg-[#FFD600] text-black border-[#FFD600]'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FFD600]'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guests Frequency */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Having Guests Over</h3>
                <p className="text-sm text-gray-500">How often do you have visitors?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: 'never', label: 'Never' },
                { value: 'rarely', label: 'Rarely' },
                { value: 'sometimes', label: 'Sometimes' },
                { value: 'often', label: 'Often' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setGuestsFrequency(option.value as any)}
                  className={`p-3 rounded-xl text-sm font-medium transition border-2 ${
                    guestsFrequency === option.value
                      ? 'bg-[#FFD600] text-black border-[#FFD600]'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FFD600]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-8">
          <Button
            onClick={() => router.push('/dashboard/my-profile-resident')}
            variant="outline"
            className="flex-1"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !sleepSchedule || !cleanliness || !noiseTolerance}
            className="flex-1 bg-[#FFD600] text-black hover:bg-[#FFD600]/90"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </main>
  );
}
