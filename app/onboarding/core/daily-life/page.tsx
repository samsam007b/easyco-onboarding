'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sun, Moon, Briefcase, Sparkles, Cigarette, CigaretteOff, PawPrint } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingSelectionCard,
  OnboardingLabel,
  OnboardingGrid,
  OnboardingInput,
  OnboardingSlider,
} from '@/components/onboarding';

export default function CoreDailyLifePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, getSection } = useLanguage();
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);

  // Detect role
  const role = (searchParams.get('role') as 'searcher' | 'resident') || 'searcher';

  const [occupationStatus, setOccupationStatus] = useState('');
  const [wakeUpTime, setWakeUpTime] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [workSchedule, setWorkSchedule] = useState('');
  const [smoking, setSmoking] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [petType, setPetType] = useState('');
  const [cleanliness, setCleanliness] = useState(5);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = () => {
    try {
      const saved = safeLocalStorage.get('coreDailyLife', {}) as any;
      if (saved.occupationStatus) setOccupationStatus(saved.occupationStatus);
      if (saved.wakeUpTime) setWakeUpTime(saved.wakeUpTime);
      if (saved.sleepTime) setSleepTime(saved.sleepTime);
      if (saved.workSchedule) setWorkSchedule(saved.workSchedule);
      if (saved.smoking !== undefined) setSmoking(saved.smoking);
      if (saved.hasPets !== undefined) setHasPets(saved.hasPets);
      if (saved.petType) setPetType(saved.petType);
      if (saved.cleanliness) setCleanliness(saved.cleanliness);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!occupationStatus) {
      toast.error('Occupation status is required');
      return;
    }
    if (!wakeUpTime) {
      toast.error('Wake up time is required');
      return;
    }
    if (!sleepTime) {
      toast.error('Sleep time is required');
      return;
    }
    if (!workSchedule) {
      toast.error('Work schedule is required');
      return;
    }
    if (hasPets && !petType.trim()) {
      toast.error('Please specify your pet type');
      return;
    }

    safeLocalStorage.set('coreDailyLife', {
      occupationStatus,
      wakeUpTime,
      sleepTime,
      workSchedule,
      smoking,
      hasPets,
      petType: hasPets ? petType : null,
      cleanliness,
    });

    router.push(`/onboarding/core/social-personality?role=${role}`);
  };

  const canContinue = occupationStatus && wakeUpTime && sleepTime && workSchedule && (!hasPets || petType);

  const occupationOptions = [
    { value: 'student', label: 'Student' },
    { value: 'employee', label: 'Employee' },
    { value: 'remote', label: 'Remote Worker' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'intern', label: 'Intern' },
    { value: 'job_seeker', label: 'Job Seeker' },
    { value: 'other', label: 'Other' },
  ];

  const wakeUpOptions = [
    { value: 'early', label: 'Early Bird', icon: <Sun className="w-5 h-5" />, desc: 'Before 7am' },
    { value: 'moderate', label: 'Moderate', icon: <Sun className="w-5 h-5" />, desc: '7am - 9am' },
    { value: 'late', label: 'Late Riser', icon: <Moon className="w-5 h-5" />, desc: 'After 9am' },
  ];

  const sleepOptions = [
    { value: 'early', label: 'Early', icon: <Moon className="w-5 h-5" />, desc: 'Before 11pm' },
    { value: 'moderate', label: 'Moderate', icon: <Moon className="w-5 h-5" />, desc: '11pm - 1am' },
    { value: 'late', label: 'Late', icon: <Moon className="w-5 h-5" />, desc: 'After 1am' },
  ];

  const workScheduleOptions = [
    { value: 'office', label: 'Office (9-5)' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'remote', label: 'Remote' },
    { value: 'flexible', label: 'Flexible Hours' },
    { value: 'student', label: 'Student Schedule' },
  ];

  return (
    <OnboardingLayout
      role={role}
      backUrl={`/onboarding/core/basic-info?role=${role}`}
      backLabel={common.back}
      progress={{
        current: 2,
        total: 4,
        label: 'Step 2 of 4',
        stepName: 'Daily Life',
      }}
      isLoading={isLoading}
      loadingText={common.loading}
    >
      <OnboardingHeading
        role={role}
        title="Your Daily Routine"
        description="Help us understand your lifestyle and habits"
      />

      <div className="space-y-6">
        {/* Occupation Status */}
        <div>
          <OnboardingLabel required>Occupation Status</OnboardingLabel>
          <OnboardingGrid columns={2}>
            {occupationOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role={role}
                selected={occupationStatus === option.value}
                onClick={() => setOccupationStatus(option.value)}
              >
                {option.label}
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Wake Up Time */}
        <div>
          <OnboardingLabel required>Typical Wake-Up Time</OnboardingLabel>
          <OnboardingGrid columns={3}>
            {wakeUpOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role={role}
                selected={wakeUpTime === option.value}
                onClick={() => setWakeUpTime(option.value)}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2 text-gray-600">{option.icon}</div>
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Sleep Time */}
        <div>
          <OnboardingLabel required>Typical Bedtime</OnboardingLabel>
          <OnboardingGrid columns={3}>
            {sleepOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role={role}
                selected={sleepTime === option.value}
                onClick={() => setSleepTime(option.value)}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2 text-gray-600">{option.icon}</div>
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Work Schedule */}
        <div>
          <OnboardingLabel required>Work Schedule</OnboardingLabel>
          <OnboardingGrid columns={2}>
            {workScheduleOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role={role}
                selected={workSchedule === option.value}
                onClick={() => setWorkSchedule(option.value)}
              >
                {option.label}
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Smoking */}
        <div>
          <OnboardingLabel required>Do you smoke?</OnboardingLabel>
          <OnboardingGrid columns={2}>
            <OnboardingSelectionCard
              role={role}
              selected={!smoking}
              onClick={() => setSmoking(false)}
            >
              <div className="flex items-center justify-center gap-2">
                <CigaretteOff className="w-5 h-5" />
                <span>Non-smoker</span>
              </div>
            </OnboardingSelectionCard>
            <OnboardingSelectionCard
              role={role}
              selected={smoking}
              onClick={() => setSmoking(true)}
            >
              <div className="flex items-center justify-center gap-2">
                <Cigarette className="w-5 h-5" />
                <span>Smoker</span>
              </div>
            </OnboardingSelectionCard>
          </OnboardingGrid>
        </div>

        {/* Pets */}
        <div>
          <OnboardingLabel required>Do you have pets?</OnboardingLabel>
          <OnboardingGrid columns={2}>
            <OnboardingSelectionCard
              role={role}
              selected={!hasPets}
              onClick={() => { setHasPets(false); setPetType(''); }}
            >
              No pets
            </OnboardingSelectionCard>
            <OnboardingSelectionCard
              role={role}
              selected={hasPets}
              onClick={() => setHasPets(true)}
            >
              <div className="flex items-center justify-center gap-2">
                <PawPrint className="w-5 h-5" />
                <span>Yes, I have pets</span>
              </div>
            </OnboardingSelectionCard>
          </OnboardingGrid>

          {hasPets && (
            <div className="mt-3">
              <OnboardingInput
                role={role}
                type="text"
                label="Pet Type"
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                placeholder="e.g., Dog, Cat, etc."
                required
              />
            </div>
          )}
        </div>

        {/* Cleanliness */}
        <OnboardingSlider
          role={role}
          label="Cleanliness Level"
          value={cleanliness}
          onChange={setCleanliness}
          min={1}
          max={10}
          minLabel="Relaxed"
          maxLabel="Spotless"
        />
      </div>

      {/* Continue Button */}
      <div className="mt-8">
        <OnboardingButton
          role={role}
          onClick={handleContinue}
          disabled={!canContinue}
        >
          {common.continue}
        </OnboardingButton>
      </div>
    </OnboardingLayout>
  );
}
