'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { supabase } from '@/lib/supabaseClient';

export default function ReviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const basicInfo = safeLocalStorage.get('basicInfo', {});
    const dailyHabits = safeLocalStorage.get('dailyHabits', {});
    const homeLifestyle = safeLocalStorage.get('homeLifestyle', {});
    const socialVibe = safeLocalStorage.get('socialVibe', {});
    const preferences = safeLocalStorage.get('preferences', {});
    const testerId = safeLocalStorage.get('tester_id', null);

    setData({ basicInfo, dailyHabits, homeLifestyle, socialVibe, preferences, testerId });
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare lifestyle array from collected data
      const lifestyleArray = [
        data.dailyHabits?.isSmoker ? 'smoker' : 'non-smoker',
        data.homeLifestyle?.cleanliness || '',
        data.homeLifestyle?.hasPets ? 'has-pets' : 'no-pets',
        data.socialVibe?.socialEnergy || '',
      ].filter(Boolean);

      const { error } = await supabase.from('test_onboardings').insert([{
        tester_id: data.testerId,
        budget_min: data.preferences?.budgetMin || null,
        budget_max: data.preferences?.budgetMax || null,
        areas: data.preferences?.preferredDistrict || null,
        move_in_date: null, // Can be added in preferences later
        lifestyle: lifestyleArray,
      }]);

      if (error) throw error;

      // Clear localStorage after successful submission
      safeLocalStorage.remove('basicInfo');
      safeLocalStorage.remove('dailyHabits');
      safeLocalStorage.remove('homeLifestyle');
      safeLocalStorage.remove('socialVibe');
      safeLocalStorage.remove('preferences');

      router.push('/onboarding/searcher/success');
    } catch (err: any) {
      alert('Error: ' + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 text-[color:var(--easy-purple)]">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[color:var(--easy-purple)] mb-2">Review Your Profile</h1>
          <p className="text-gray-600">Make sure everything looks good</p>
        </div>
        <div className="space-y-4 mb-8">
          {data.basicInfo && Object.keys(data.basicInfo).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-[color:var(--easy-purple)] mb-3">Basic Info</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt>Date of Birth:</dt><dd className="font-medium">{data.basicInfo.dateOfBirth}</dd></div>
                <div className="flex justify-between"><dt>Nationality:</dt><dd className="font-medium">{data.basicInfo.nationality}</dd></div>
                <div className="flex justify-between"><dt>Languages:</dt><dd className="font-medium">{data.basicInfo.languages?.join(', ')}</dd></div>
              </dl>
            </div>
          )}
          {data.dailyHabits && Object.keys(data.dailyHabits).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-[color:var(--easy-purple)] mb-3">Daily Habits</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt>Wake-up:</dt><dd className="font-medium capitalize">{data.dailyHabits.wakeUpTime}</dd></div>
                <div className="flex justify-between"><dt>Sleep:</dt><dd className="font-medium capitalize">{data.dailyHabits.sleepTime}</dd></div>
                <div className="flex justify-between"><dt>Smoker:</dt><dd className="font-medium">{data.dailyHabits.isSmoker ? 'Yes' : 'No'}</dd></div>
              </dl>
            </div>
          )}
          {data.preferences && Object.keys(data.preferences).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-[color:var(--easy-purple)] mb-3">Preferences</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt>Budget:</dt><dd className="font-medium">€{data.preferences.budgetMin} - €{data.preferences.budgetMax}</dd></div>
                <div className="flex justify-between"><dt>District:</dt><dd className="font-medium">{data.preferences.preferredDistrict || 'Any'}</dd></div>
              </dl>
            </div>
          )}
        </div>
        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-4 rounded-full bg-[color:var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
          {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>) : (<><CheckCircle2 className="w-5 h-5" />Submit My Profile</>)}
        </button>
      </div>
    </main>
  );
}
