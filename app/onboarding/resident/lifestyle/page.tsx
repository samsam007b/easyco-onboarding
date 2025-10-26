'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, Moon, Sun, Cigarette, Utensils, Dumbbell } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';

export default function ResidentLifestylePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);

  // Form fields based on PDF filters
  const [occupationStatus, setOccupationStatus] = useState('');
  const [wakeUpTime, setWakeUpTime] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [isSmoker, setIsSmoker] = useState<boolean | null>(null);
  const [cleanlinessPreference, setCleanlinessPreference] = useState(5);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('residentLifestyle', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setOccupationStatus(saved.occupationStatus || profileData.occupation_status || '');
          setWakeUpTime(saved.wakeUpTime || profileData.wake_up_time || '');
          setSleepTime(saved.sleepTime || profileData.sleep_time || '');
          setIsSmoker(saved.isSmoker !== undefined ? saved.isSmoker : profileData.smoker);
          setCleanlinessPreference(saved.cleanlinessPreference || profileData.cleanliness_preference || 5);
        } else if (saved.occupationStatus) {
          setOccupationStatus(saved.occupationStatus);
          setWakeUpTime(saved.wakeUpTime);
          setSleepTime(saved.sleepTime);
          setIsSmoker(saved.isSmoker);
          setCleanlinessPreference(saved.cleanlinessPreference || 5);
        }
      }
    } catch (error) {
      console.error('Error loading lifestyle data:', error);
      toast.error('Failed to load existing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!occupationStatus) {
      toast.error('Please select your occupation status');
      return;
    }
    if (!wakeUpTime) {
      toast.error('Please select your typical wake-up time');
      return;
    }
    if (!sleepTime) {
      toast.error('Please select your typical sleep time');
      return;
    }
    if (isSmoker === null) {
      toast.error('Please indicate if you smoke');
      return;
    }

    // Save to localStorage
    safeLocalStorage.set('residentLifestyle', {
      occupationStatus,
      wakeUpTime,
      sleepTime,
      isSmoker,
      cleanlinessPreference,
    });

    // Navigate to next step
    router.push('/onboarding/resident/personality');
  };

  const canContinue = occupationStatus && wakeUpTime && sleepTime && isSmoker !== null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/onboarding/resident/basic-info')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
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
            <span className="text-sm font-medium text-gray-700">Step 2 of 4</span>
            <span className="text-sm text-gray-500">Lifestyle Essentials</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#4A148C] h-2 rounded-full transition-all" style={{ width: '50%' }} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#4A148C] mb-2">
              Your Lifestyle 🌟
            </h1>
            <p className="text-gray-600">
              Help us understand your daily routine and habits
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Occupation Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Occupation Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', label: 'Student', icon: '🎓' },
                  { value: 'employee', label: 'Employee', icon: '💼' },
                  { value: 'self-employed', label: 'Self-Employed', icon: '🚀' },
                  { value: 'intern', label: 'Intern', icon: '📝' },
                  { value: 'job_seeker', label: 'Job Seeker', icon: '🔍' },
                  { value: 'other', label: 'Other', icon: '➕' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setOccupationStatus(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      occupationStatus === option.value
                        ? 'border-[#4A148C] bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Wake Up Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Typical Wake-Up Time <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'early', label: 'Early Bird', icon: <Sun className="w-5 h-5" />, desc: 'Before 7am' },
                  { value: 'average', label: 'Average', icon: <Sun className="w-5 h-5" />, desc: '7am - 9am' },
                  { value: 'late', label: 'Night Owl', icon: <Moon className="w-5 h-5" />, desc: 'After 9am' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setWakeUpTime(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      wakeUpTime === option.value
                        ? 'border-[#4A148C] bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-2 text-gray-600">{option.icon}</div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Typical Bedtime <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'before_23h', label: 'Before 11pm', icon: <Moon className="w-5 h-5" /> },
                  { value: '23h_01h', label: '11pm - 1am', icon: <Moon className="w-5 h-5" /> },
                  { value: 'after_01h', label: 'After 1am', icon: <Moon className="w-5 h-5" /> },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSleepTime(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      sleepTime === option.value
                        ? 'border-[#4A148C] bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-2 text-gray-600">{option.icon}</div>
                      <div className="font-medium text-sm">{option.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Smoking */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Do you smoke? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: false, label: 'Non-smoker', icon: '🚭' },
                  { value: true, label: 'Smoker', icon: '🚬' },
                ].map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setIsSmoker(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSmoker === option.value
                        ? 'border-[#4A148C] bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 justify-center">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cleanliness Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Cleanliness Level (1 = Relaxed, 10 = Very Tidy)
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={cleanlinessPreference}
                  onChange={(e) => setCleanlinessPreference(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4A148C]"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Relaxed</span>
                  <span className="text-2xl font-bold text-[#4A148C]">{cleanlinessPreference}</span>
                  <span className="text-sm text-gray-500">Very Tidy</span>
                </div>
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
                  ? 'bg-[#FFD600] hover:bg-[#F57F17] text-black'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
