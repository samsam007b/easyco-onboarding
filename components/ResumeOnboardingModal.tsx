// components/ResumeOnboardingModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, RefreshCcw, PlayCircle } from 'lucide-react';
import { getOnboardingProgress } from '@/lib/hooks/use-auto-save';
import { useLanguage } from '@/lib/i18n/use-language';

export default function ResumeOnboardingModal() {
  const router = useRouter();
  const { getSection } = useLanguage();
  const resume = getSection('onboarding').resumeOnboarding;
  const [isOpen, setIsOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only check if we're client-side
    if (typeof window !== 'undefined') {
      checkOnboardingProgress();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkOnboardingProgress = async () => {
    try {
      const progress = await getOnboardingProgress();

      if (progress?.isIncomplete && progress.currentStep) {
        setResumeUrl(progress.currentStep);
        setIsOpen(true);
      }
    } catch (error) {
      // FIXME: Use logger.error('Error checking onboarding progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResume = () => {
    if (resumeUrl) {
      router.push(resumeUrl);
    }
    setIsOpen(false);
  };

  const handleStartFresh = () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      const keys = [
        'searcherProfileType',
        'basicInfo',
        'dailyHabits',
        'lifestyle',
        'homeLifestyle',
        'preferences',
      ];
      keys.forEach((key) => localStorage.removeItem(key));
    }
    setIsOpen(false);
    router.push('/onboarding/searcher/profile-type');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (isLoading || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
            <RefreshCcw className="w-8 h-8 text-[var(--easy-purple)]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {resume.title}
          </h2>
          <p className="text-gray-600">
            {resume.subtitle}
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleResume}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[var(--easy-purple)] text-white font-semibold text-lg hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            <PlayCircle className="w-5 h-5" />
            {resume.continue}
          </button>

          <button
            onClick={handleStartFresh}
            className="w-full py-4 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            {resume.startFresh}
          </button>

          <button
            onClick={handleClose}
            className="w-full py-3 text-gray-500 hover:text-gray-700 transition text-sm"
          >
            {resume.later}
          </button>
        </div>

        {/* Info */}
        <div className="text-center text-xs text-gray-500">
          {resume.info}
        </div>
      </div>
    </div>
  );
}
