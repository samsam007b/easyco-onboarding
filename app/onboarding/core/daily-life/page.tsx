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
      toast.error(t('coreOnboarding.dailyLife.errors.occupationRequired'));
      return;
    }
    if (!wakeUpTime) {
      toast.error(t('coreOnboarding.dailyLife.errors.wakeUpRequired'));
      return;
    }
    if (!sleepTime) {
      toast.error(t('coreOnboarding.dailyLife.errors.sleepRequired'));
      return;
    }
    if (!workSchedule) {
      toast.error(t('coreOnboarding.dailyLife.errors.workScheduleRequired'));
      return;
    }
    if (hasPets && !petType.trim()) {
      toast.error(t('coreOnboarding.dailyLife.errors.petTypeRequired'));
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
    { value: 'student', labelKey: 'student' },
    { value: 'employee', labelKey: 'employee' },
    { value: 'remote', labelKey: 'remote' },
    { value: 'freelance', labelKey: 'freelance' },
    { value: 'intern', labelKey: 'intern' },
    { value: 'job_seeker', labelKey: 'jobSeeker' },
    { value: 'other', labelKey: 'other' },
  ];

  const wakeUpOptions = [
    { value: 'early', labelKey: 'earlyBird', icon: <Sun className="w-5 h-5" />, descKey: 'before7am' },
    { value: 'moderate', labelKey: 'moderate', icon: <Sun className="w-5 h-5" />, descKey: '7amTo9am' },
    { value: 'late', labelKey: 'lateRiser', icon: <Moon className="w-5 h-5" />, descKey: 'after9am' },
  ];

  const sleepOptions = [
    { value: 'early', labelKey: 'early', icon: <Moon className="w-5 h-5" />, descKey: 'before11pm' },
    { value: 'moderate', labelKey: 'moderate', icon: <Moon className="w-5 h-5" />, descKey: '11pmTo1am' },
    { value: 'late', labelKey: 'late', icon: <Moon className="w-5 h-5" />, descKey: 'after1am' },
  ];

  const workScheduleOptions = [
    { value: 'office', labelKey: 'office' },
    { value: 'hybrid', labelKey: 'hybrid' },
    { value: 'remote', labelKey: 'remote' },
    { value: 'flexible', labelKey: 'flexible' },
    { value: 'student', labelKey: 'studentSchedule' },
  ];

  return (
    <OnboardingLayout
      role={role}
      backUrl={`/onboarding/core/basic-info?role=${role}`}
      backLabel={common.back}
      progress={{
        current: 2,
        total: 4,
        label: t('coreOnboarding.dailyLife.progress'),
        stepName: t('coreOnboarding.dailyLife.stepName'),
      }}
      isLoading={isLoading}
      loadingText={common.loading}
    >
      <OnboardingHeading
        role={role}
        title={t('coreOnboarding.dailyLife.title')}
        description={t('coreOnboarding.dailyLife.description')}
      />

      <div className="space-y-6">
        {/* Occupation Status */}
        <div>
          <OnboardingLabel required>{t('coreOnboarding.dailyLife.occupationStatus')}</OnboardingLabel>
          <OnboardingGrid columns={2}>
            {occupationOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role={role}
                selected={occupationStatus === option.value}
                onClick={() => setOccupationStatus(option.value)}
              >
                {t(`coreOnboarding.dailyLife.occupations.${option.labelKey}`)}
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Wake Up Time */}
        <div>
          <OnboardingLabel required>{t('coreOnboarding.dailyLife.wakeUpTime')}</OnboardingLabel>
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
                  <div className="font-medium text-sm">{t(`coreOnboarding.dailyLife.wakeUpOptions.${option.labelKey}`)}</div>
                  <div className="text-xs text-gray-500 mt-1">{t(`coreOnboarding.dailyLife.wakeUpOptions.${option.descKey}`)}</div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Sleep Time */}
        <div>
          <OnboardingLabel required>{t('coreOnboarding.dailyLife.bedtime')}</OnboardingLabel>
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
                  <div className="font-medium text-sm">{t(`coreOnboarding.dailyLife.bedtimeOptions.${option.labelKey}`)}</div>
                  <div className="text-xs text-gray-500 mt-1">{t(`coreOnboarding.dailyLife.bedtimeOptions.${option.descKey}`)}</div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Work Schedule */}
        <div>
          <OnboardingLabel required>{t('coreOnboarding.dailyLife.workSchedule')}</OnboardingLabel>
          <OnboardingGrid columns={2}>
            {workScheduleOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role={role}
                selected={workSchedule === option.value}
                onClick={() => setWorkSchedule(option.value)}
              >
                {t(`coreOnboarding.dailyLife.workScheduleOptions.${option.labelKey}`)}
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Smoking */}
        <div>
          <OnboardingLabel required>{t('coreOnboarding.dailyLife.smoking')}</OnboardingLabel>
          <OnboardingGrid columns={2}>
            <OnboardingSelectionCard
              role={role}
              selected={!smoking}
              onClick={() => setSmoking(false)}
            >
              <div className="flex items-center justify-center gap-2">
                <CigaretteOff className="w-5 h-5" />
                <span>{t('coreOnboarding.dailyLife.smokingOptions.nonSmoker')}</span>
              </div>
            </OnboardingSelectionCard>
            <OnboardingSelectionCard
              role={role}
              selected={smoking}
              onClick={() => setSmoking(true)}
            >
              <div className="flex items-center justify-center gap-2">
                <Cigarette className="w-5 h-5" />
                <span>{t('coreOnboarding.dailyLife.smokingOptions.smoker')}</span>
              </div>
            </OnboardingSelectionCard>
          </OnboardingGrid>
        </div>

        {/* Pets */}
        <div>
          <OnboardingLabel required>{t('coreOnboarding.dailyLife.pets')}</OnboardingLabel>
          <OnboardingGrid columns={2}>
            <OnboardingSelectionCard
              role={role}
              selected={!hasPets}
              onClick={() => { setHasPets(false); setPetType(''); }}
            >
              {t('coreOnboarding.dailyLife.petsOptions.noPets')}
            </OnboardingSelectionCard>
            <OnboardingSelectionCard
              role={role}
              selected={hasPets}
              onClick={() => setHasPets(true)}
            >
              <div className="flex items-center justify-center gap-2">
                <PawPrint className="w-5 h-5" />
                <span>{t('coreOnboarding.dailyLife.petsOptions.yesPets')}</span>
              </div>
            </OnboardingSelectionCard>
          </OnboardingGrid>

          {hasPets && (
            <div className="mt-3">
              <OnboardingInput
                role={role}
                type="text"
                label={t('coreOnboarding.dailyLife.petType')}
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                placeholder={t('coreOnboarding.dailyLife.petTypePlaceholder')}
                required
              />
            </div>
          )}
        </div>

        {/* Cleanliness */}
        <OnboardingSlider
          role={role}
          label={t('coreOnboarding.dailyLife.cleanlinessLevel')}
          value={cleanliness}
          onChange={setCleanliness}
          min={1}
          max={10}
          minLabel={t('coreOnboarding.dailyLife.cleanlinessOptions.relaxed')}
          maxLabel={t('coreOnboarding.dailyLife.cleanlinessOptions.spotless')}
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
