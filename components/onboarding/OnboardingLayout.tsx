'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LoadingHouse from '@/components/ui/LoadingHouse';

export type OnboardingRole = 'searcher' | 'owner' | 'resident';

// Theme colors per role
export const roleThemes = {
  searcher: {
    // Orange theme for searchers
    gradient: 'from-[#FF8C42] via-[#FFA040] to-[#FFB85C]',
    gradientBg: 'from-orange-50 to-orange-100',
    primary: '#FF8C42',
    primaryLight: 'orange-50',
    focusRing: 'focus:ring-orange-500',
    selectedBorder: 'border-orange-500',
    selectedBg: 'bg-orange-50',
    accent: 'accent-orange-500',
    logoColors: {
      easy: 'text-[#FF8C42]',
      co: 'text-[#FFB85C]',
    },
  },
  owner: {
    // Purple theme for owners
    gradient: 'from-[#4A148C] via-[#6A1B9A] to-[#7B1FA2]',
    gradientBg: 'from-purple-50 to-purple-100',
    primary: '#4A148C',
    primaryLight: 'purple-50',
    focusRing: 'focus:ring-purple-500',
    selectedBorder: 'border-purple-500',
    selectedBg: 'bg-purple-50',
    accent: 'accent-purple-500',
    logoColors: {
      easy: 'text-[#4A148C]',
      co: 'text-[#FFD600]',
    },
  },
  resident: {
    // V3 Option C Orange theme for residents
    gradient: 'from-[#e05747] via-[#ff651e] to-[#ff9014]',
    gradientBg: 'from-orange-50 to-orange-100',
    primary: '#ff651e',
    primaryLight: 'orange-50',
    focusRing: 'focus:ring-orange-500',
    selectedBorder: 'border-orange-500',
    selectedBg: 'bg-orange-50',
    accent: 'accent-orange-500',
    logoColors: {
      easy: 'text-[#e05747]',
      co: 'text-[#ff9014]',
    },
  },
} as const;

interface OnboardingLayoutProps {
  children: ReactNode;
  role: OnboardingRole;
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

export default function OnboardingLayout({
  children,
  role,
  backUrl,
  backLabel = 'Back',
  progress,
  isLoading = false,
  loadingText = 'Loading...',
}: OnboardingLayoutProps) {
  const router = useRouter();
  const theme = roleThemes[role];
  const progressPercent = progress ? Math.round((progress.current / progress.total) * 100) : 0;

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
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradientBg}`}>
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push(backUrl)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{backLabel}</span>
          </button>
          <div className="text-2xl font-bold">
            <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>EASY</span>
            <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Co</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        {progress && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {progress.label || `Step ${progress.current} of ${progress.total}`}
              </span>
              {progress.stepName && (
                <span className="text-sm text-gray-500">{progress.stepName}</span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${theme.gradient} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// Export theme utilities for use in child components
export function useOnboardingTheme(role: OnboardingRole) {
  return roleThemes[role];
}
