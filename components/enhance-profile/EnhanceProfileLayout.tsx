'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import LoadingHouse from '@/components/ui/LoadingHouse';

export type EnhanceRole = 'searcher' | 'owner' | 'resident';

export const enhanceThemes = {
  searcher: {
    gradient: 'from-[#FF8C42] via-[#FFA040] to-[#FFB85C]',
    gradientBg: 'from-orange-50 to-orange-100',
    primary: '#FF8C42',
    focusRing: 'focus:ring-orange-500',
    selectedBorder: 'border-orange-500',
    selectedBg: 'bg-orange-50',
    hoverBg: 'hover:bg-orange-50',
    accent: 'accent-orange-500',
    textPrimary: 'text-orange-600',
    bgLight: 'bg-orange-50',
    borderLight: 'border-orange-200',
  },
  owner: {
    gradient: 'from-[#9c5698] via-[#9c5698] to-[#7B1FA2]',
    gradientBg: 'from-purple-50 to-purple-100',
    primary: '#9c5698',
    focusRing: 'focus:ring-purple-500',
    selectedBorder: 'border-purple-500',
    selectedBg: 'bg-purple-50',
    hoverBg: 'hover:bg-purple-50',
    accent: 'accent-purple-500',
    textPrimary: 'text-purple-600',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-200',
  },
  resident: {
    gradient: 'from-[#e05747] via-[#e05747] to-[#e05747]',
    gradientBg: 'from-orange-50 to-red-50',
    primary: '#e05747',
    focusRing: 'focus:ring-orange-500',
    selectedBorder: 'border-orange-500',
    selectedBg: 'bg-orange-50',
    hoverBg: 'hover:bg-orange-50',
    accent: 'accent-orange-500',
    textPrimary: 'text-orange-600',
    bgLight: 'bg-orange-50',
    borderLight: 'border-orange-200',
  },
};

interface EnhanceProfileLayoutProps {
  children: ReactNode;
  role: EnhanceRole;
  backUrl: string;
  backLabel?: string;
  progress?: {
    current: number;
    total: number;
    label?: string;
    stepName?: string;
  };
  isLoading?: boolean;
  loadingText?: string;
}

export default function EnhanceProfileLayout({
  children,
  role,
  backUrl,
  backLabel = 'Back',
  progress,
  isLoading = false,
  loadingText = 'Loading...',
}: EnhanceProfileLayoutProps) {
  const router = useRouter();
  const theme = enhanceThemes[role];

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center`}>
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 mt-4">{loadingText}</p>
        </div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen bg-gradient-to-br ${theme.gradientBg} p-4 sm:p-6`}>
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push(backUrl)}
          className={`mb-6 flex items-center gap-2 ${theme.textPrimary} hover:opacity-70 transition-opacity`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{backLabel}</span>
        </button>

        {/* Progress Bar */}
        {progress && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme.textPrimary}`}>
                {progress.label || `Step ${progress.current} of ${progress.total}`}
              </span>
              {progress.stepName && (
                <span className="text-sm text-gray-500">{progress.stepName}</span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${theme.gradient} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white superellipse-2xl sm:superellipse-3xl shadow-xl p-6 sm:p-10">
          {children}
        </div>
      </div>
    </main>
  );
}
