'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sun, Moon, Briefcase, Dumbbell, Cigarette } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';

export default function DailyHabitsPage() {
  const router = useRouter();
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
            Daily Habits
          </h1>
          <p className="text-gray-600">
            Your routine helps us find compatible housemates.
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
              Wake-up time
            </label>
            <select
              value={wakeUpTime}
              onChange={(e) => setWakeUpTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="early">Early (5-7 AM)</option>
              <option value="moderate">Moderate (7-9 AM)</option>
              <option value="late">Late (9 AM+)</option>
            </select>
          </div>

          {/* Sleep time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Moon className="w-4 h-4 text-purple-600" />
              </div>
              Sleep time
            </label>
            <select
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="early">Early (9-10 PM)</option>
              <option value="moderate">Moderate (10-12 PM)</option>
              <option value="late">Late (12 PM+)</option>
            </select>
          </div>

          {/* Work/Study schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              Work/Study schedule
            </label>
            <select
              value={workSchedule}
              onChange={(e) => setWorkSchedule(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="traditional">Traditional (9-5)</option>
              <option value="flexible">Flexible</option>
              <option value="remote">Remote</option>
              <option value="student">Student</option>
            </select>
          </div>

          {/* Sport frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-green-600" />
              </div>
              Sport frequency
            </label>
            <select
              value={sportFrequency}
              onChange={(e) => setSportFrequency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="daily">Daily</option>
              <option value="few-times-week">Few times a week</option>
              <option value="once-week">Once a week</option>
              <option value="rarely">Rarely</option>
            </select>
          </div>

          {/* Smoker toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Cigarette className="w-4 h-4 text-gray-600" />
              </div>
              <span className="font-medium text-gray-700">I am a smoker</span>
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
          Continue
        </button>
      </div>
    </main>
  );
}
