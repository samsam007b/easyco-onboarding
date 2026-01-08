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
    // Searcher theme - v3 color system
    gradient: 'from-searcher-600 via-searcher-500 to-searcher-400',
    gradientBg: 'from-searcher-50 to-searcher-100',
    primary: 'hsl(var(--searcher-500))',
    primaryLight: 'searcher-50',
    focusRing: 'focus:ring-searcher-500',
    selectedBorder: 'border-searcher-500',
    selectedBg: 'bg-searcher-50',
    accent: 'accent-searcher-500',
    logoColors: {
      easy: 'text-[#FF8C42]',
      co: 'text-[#FFB85C]',
    },
  },
  owner: {
    // Owner theme - v3 color system
    gradient: 'from-owner-600 via-owner-500 to-owner-400',
    gradientBg: 'from-owner-50 to-owner-100',
    primary: 'hsl(var(--owner-500))',
    primaryLight: 'owner-50',
    focusRing: 'focus:ring-owner-500',
    selectedBorder: 'border-owner-500',
    selectedBg: 'bg-owner-50',
    accent: 'accent-owner-500',
    logoColors: {
      easy: 'text-[#9c5698]',
      co: 'text-[#FFD600]',
    },
  },
  resident: {
    // Resident theme - v3 color system
    gradient: 'from-resident-600 via-resident-500 to-resident-400',
    gradientBg: 'from-resident-50 to-resident-100',
    primary: 'hsl(var(--resident-500))',
    primaryLight: 'resident-50',
    focusRing: 'focus:ring-resident-500',
    selectedBorder: 'border-resident-500',
    selectedBg: 'bg-resident-50',
    accent: 'accent-resident-500',
    logoColors: {
      easy: 'text-[#e05747]',
      co: 'text-[#e05747]',
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
        <div className="bg-white superellipse-3xl shadow-lg p-8">
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
