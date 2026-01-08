'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import LoadingHouse from '@/components/ui/LoadingHouse';

export type EnhanceRole = 'searcher' | 'owner' | 'resident';

export const enhanceThemes = {
  searcher: {
    gradient: 'from-searcher-600 via-searcher-500 to-searcher-400',
    gradientBg: 'from-searcher-50 to-searcher-100',
    primary: 'hsl(var(--searcher-500))',
    focusRing: 'focus:ring-searcher-500',
    selectedBorder: 'border-searcher-500',
    selectedBg: 'bg-searcher-50',
    hoverBg: 'hover:bg-searcher-50',
    accent: 'accent-searcher-500',
    textPrimary: 'text-searcher-600',
    bgLight: 'bg-searcher-50',
    borderLight: 'border-searcher-200',
  },
  owner: {
    gradient: 'from-owner-600 via-owner-500 to-owner-400',
    gradientBg: 'from-owner-50 to-owner-100',
    primary: 'hsl(var(--owner-500))',
    focusRing: 'focus:ring-owner-500',
    selectedBorder: 'border-owner-500',
    selectedBg: 'bg-owner-50',
    hoverBg: 'hover:bg-owner-50',
    accent: 'accent-owner-500',
    textPrimary: 'text-owner-600',
    bgLight: 'bg-owner-50',
    borderLight: 'border-owner-200',
  },
  resident: {
    gradient: 'from-resident-600 via-resident-500 to-resident-400',
    gradientBg: 'from-resident-50 to-resident-100',
    primary: 'hsl(var(--resident-500))',
    focusRing: 'focus:ring-resident-500',
    selectedBorder: 'border-resident-500',
    selectedBg: 'bg-resident-50',
    hoverBg: 'hover:bg-resident-50',
    accent: 'accent-resident-500',
    textPrimary: 'text-resident-600',
    bgLight: 'bg-resident-50',
    borderLight: 'border-resident-200',
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
