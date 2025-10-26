'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sun, Moon, Briefcase, Dumbbell, Cigarette } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function DailyHabitsPage() {
  const router = useRouter();
  const { t, getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [wakeUpTime, setWakeUpTime] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [workSchedule, setWorkSchedule] = useState('');
  const [sportFrequency, setSportFrequency] = useState('');
  const [isSmoker, setIsSmoker] = useState(false);

  const handleContinue = () => {
    // Save to localStorage
    safeLocalStorage.set('dailyHabits', {
      wakeUpTime,
      sleepTime,
      workSchedule,
      sportFrequency,
      isSmoker,
    });

    // Navigate to next step
    router.push('/onboarding/searcher/home-lifestyle');
  };

  const canContinue = wakeUpTime && sleepTime && workSchedule && sportFrequency;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md mx-auto">

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] w-2/6 transition-all" />
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-[color:var(--easy-purple)] hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)] mb-2">
            {onboarding.dailyHabits.title}
          </h1>
          <p className="text-gray-600">
            {onboarding.dailyHabits.subtitle}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Wake-up time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Sun className="w-4 h-4 text-yellow-600" />
              </div>
              {onboarding.dailyHabits.wakeUpTime}
            </label>
            <select
              value={wakeUpTime}
              onChange={(e) => setWakeUpTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">{onboarding.dailyHabits.select}</option>
              <option value="early">{onboarding.dailyHabits.early5to7}</option>
              <option value="moderate">{onboarding.dailyHabits.moderate7to9}</option>
              <option value="late">{onboarding.dailyHabits.late9plus}</option>
            </select>
          </div>

          {/* Sleep time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Moon className="w-4 h-4 text-purple-600" />
              </div>
              {onboarding.dailyHabits.sleepTime}
            </label>
            <select
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">{onboarding.dailyHabits.select}</option>
              <option value="early">{onboarding.dailyHabits.early9to10}</option>
              <option value="moderate">{onboarding.dailyHabits.moderate10to12}</option>
              <option value="late">{onboarding.dailyHabits.late12plus}</option>
            </select>
          </div>

          {/* Work/Study schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              {onboarding.dailyHabits.workSchedule}
            </label>
            <select
              value={workSchedule}
              onChange={(e) => setWorkSchedule(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">{onboarding.dailyHabits.select}</option>
              <option value="traditional">{onboarding.dailyHabits.traditional9to5}</option>
              <option value="flexible">{onboarding.dailyHabits.flexible}</option>
              <option value="remote">{onboarding.dailyHabits.remote}</option>
              <option value="student">{onboarding.dailyHabits.student}</option>
            </select>
          </div>

          {/* Sport frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-green-600" />
              </div>
              {onboarding.dailyHabits.sportFrequency}
            </label>
            <select
              value={sportFrequency}
              onChange={(e) => setSportFrequency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">{onboarding.dailyHabits.select}</option>
              <option value="daily">{onboarding.dailyHabits.daily}</option>
              <option value="few-times-week">{onboarding.dailyHabits.fewTimesWeek}</option>
              <option value="once-week">{onboarding.dailyHabits.onceWeek}</option>
              <option value="rarely">{onboarding.dailyHabits.rarely}</option>
            </select>
          </div>

          {/* Smoker toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Cigarette className="w-4 h-4 text-gray-600" />
              </div>
              <span className="font-medium text-gray-700">{onboarding.dailyHabits.iAmSmoker}</span>
            </div>
            <button
              onClick={() => setIsSmoker(!isSmoker)}
              className={`relative w-14 h-8 rounded-full transition ${
                isSmoker ? 'bg-[color:var(--easy-purple)]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                  isSmoker ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full mt-12 py-4 rounded-full font-semibold text-lg transition shadow-md ${
            canContinue
              ? 'bg-[color:var(--easy-yellow)] text-black hover:opacity-90 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {common.continue}
        </button>
      </div>
    </main>
  );
}
