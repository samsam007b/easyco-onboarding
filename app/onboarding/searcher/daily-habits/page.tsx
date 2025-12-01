'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Briefcase, Dumbbell, Cigarette, CigaretteOff } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingSelectionCard,
  OnboardingLabel,
  OnboardingGrid,
} from '@/components/onboarding';

export default function DailyHabitsPage() {
  const router = useRouter();
  const { t, getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [wakeUpTime, setWakeUpTime] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [workSchedule, setWorkSchedule] = useState('');
  const [sportFrequency, setSportFrequency] = useState('');
  const [isSmoker, setIsSmoker] = useState(false);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = () => {
    try {
      const saved = safeLocalStorage.get('dailyHabits', {}) as any;
      if (saved.wakeUpTime) setWakeUpTime(saved.wakeUpTime);
      if (saved.sleepTime) setSleepTime(saved.sleepTime);
      if (saved.workSchedule) setWorkSchedule(saved.workSchedule);
      if (saved.sportFrequency) setSportFrequency(saved.sportFrequency);
      if (saved.isSmoker !== undefined) setIsSmoker(saved.isSmoker);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    safeLocalStorage.set('dailyHabits', {
      wakeUpTime,
      sleepTime,
      workSchedule,
      sportFrequency,
      isSmoker,
    });
    router.push('/onboarding/searcher/home-lifestyle');
  };

  const canContinue = wakeUpTime && sleepTime && workSchedule && sportFrequency;

  const wakeUpOptions = [
    { value: 'early', label: onboarding.dailyHabits.early5to7, icon: Sun, desc: '5h - 7h' },
    { value: 'moderate', label: onboarding.dailyHabits.moderate7to9, icon: Sun, desc: '7h - 9h' },
    { value: 'late', label: onboarding.dailyHabits.late9plus, icon: Moon, desc: '9h+' },
  ];

  const sleepOptions = [
    { value: 'early', label: onboarding.dailyHabits.early9to10, icon: Moon, desc: '21h - 22h' },
    { value: 'moderate', label: onboarding.dailyHabits.moderate10to12, icon: Moon, desc: '22h - 00h' },
    { value: 'late', label: onboarding.dailyHabits.late12plus, icon: Moon, desc: '00h+' },
  ];

  const workOptions = [
    { value: 'traditional', label: onboarding.dailyHabits.traditional9to5 },
    { value: 'flexible', label: onboarding.dailyHabits.flexible },
    { value: 'remote', label: onboarding.dailyHabits.remote },
    { value: 'student', label: onboarding.dailyHabits.student },
  ];

  const sportOptions = [
    { value: 'daily', label: onboarding.dailyHabits.daily },
    { value: 'few-times-week', label: onboarding.dailyHabits.fewTimesWeek },
    { value: 'once-week', label: onboarding.dailyHabits.onceWeek },
    { value: 'rarely', label: onboarding.dailyHabits.rarely },
  ];

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/basic-info"
      backLabel={common.back}
      progress={{
        current: 2,
        total: 6,
        label: onboarding.dailyHabits.progress || 'Étape 2 sur 6',
        stepName: onboarding.dailyHabits.title,
      }}
      isLoading={isLoading}
      loadingText={common.loading}
    >
      <OnboardingHeading
        role="searcher"
        title={onboarding.dailyHabits.title}
        description={onboarding.dailyHabits.subtitle}
      />

      <div className="space-y-6">
        {/* Wake-up time */}
        <div>
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Sun className="w-4 h-4 text-yellow-600" />
              </div>
              {onboarding.dailyHabits.wakeUpTime}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={3}>
            {wakeUpOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role="searcher"
                selected={wakeUpTime === option.value}
                onClick={() => setWakeUpTime(option.value)}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <option.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Sleep time */}
        <div>
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Moon className="w-4 h-4 text-orange-600" />
              </div>
              {onboarding.dailyHabits.sleepTime}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={3}>
            {sleepOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role="searcher"
                selected={sleepTime === option.value}
                onClick={() => setSleepTime(option.value)}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <option.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Work Schedule */}
        <div>
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              {onboarding.dailyHabits.workSchedule}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={2}>
            {workOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role="searcher"
                selected={workSchedule === option.value}
                onClick={() => setWorkSchedule(option.value)}
              >
                <div className="text-center font-medium text-sm">{option.label}</div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Sport Frequency */}
        <div>
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-green-600" />
              </div>
              {onboarding.dailyHabits.sportFrequency}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={2}>
            {sportOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role="searcher"
                selected={sportFrequency === option.value}
                onClick={() => setSportFrequency(option.value)}
              >
                <div className="text-center font-medium text-sm">{option.label}</div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Smoker toggle */}
        <div>
          <OnboardingLabel>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Cigarette className="w-4 h-4 text-gray-600" />
              </div>
              {onboarding.dailyHabits.iAmSmoker}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={2}>
            <OnboardingSelectionCard
              role="searcher"
              selected={!isSmoker}
              onClick={() => setIsSmoker(false)}
            >
              <div className="flex items-center justify-center gap-2">
                <CigaretteOff className="w-5 h-5 text-green-600" />
                <span className="font-medium">Non-fumeur</span>
              </div>
            </OnboardingSelectionCard>
            <OnboardingSelectionCard
              role="searcher"
              selected={isSmoker}
              onClick={() => setIsSmoker(true)}
            >
              <div className="flex items-center justify-center gap-2">
                <Cigarette className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Fumeur</span>
              </div>
            </OnboardingSelectionCard>
          </OnboardingGrid>
        </div>
      </div>

      <div className="mt-8">
        <OnboardingButton
          role="searcher"
          onClick={handleContinue}
          disabled={!canContinue}
        >
          {common.continue}
        </OnboardingButton>
      </div>
    </OnboardingLayout>
  );
}
