'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
  mode?: 'quick' | 'full';
}

export default function ProgressBar({ steps, currentStep, mode = 'full' }: ProgressBarProps) {
  const totalSteps = steps.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Mode Badge */}
        {mode === 'quick' && (
          <div className="flex items-center justify-center mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-orange-800">Mode Rapide</span>
              <span className="text-xs text-orange-600">{totalSteps} étapes</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="relative">
          {/* Background Track */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            {/* Progress Fill */}
            <div
              className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Animated shine effect */}
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Steps Indicators (only show on larger screens) */}
          <div className="hidden md:flex items-center justify-between mt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'flex flex-col items-center gap-2 relative',
                  index < steps.length - 1 && 'flex-1'
                )}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-all duration-300',
                    step.status === 'completed' &&
                      'bg-green-500 border-green-500 text-white scale-110',
                    step.status === 'current' &&
                      'bg-orange-500 border-orange-500 text-white ring-4 ring-orange-200 scale-110',
                    step.status === 'upcoming' &&
                      'bg-white border-gray-300 text-gray-400'
                  )}
                >
                  {step.status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={cn(
                    'text-xs font-medium text-center max-w-[80px] transition-colors',
                    step.status === 'current' && 'text-orange-600 font-bold',
                    step.status === 'completed' && 'text-green-600',
                    step.status === 'upcoming' && 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'absolute top-5 left-[50%] h-0.5 transition-all duration-300',
                      step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                    )}
                    style={{
                      width: 'calc(100% - 2.5rem)',
                      marginLeft: '1.25rem',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Mobile: Simple Text Indicator */}
          <div className="md:hidden flex items-center justify-between mt-3">
            <span className="text-sm font-medium text-gray-700">
              Étape {currentStep + 1} sur {totalSteps}
            </span>
            <span className="text-sm font-semibold text-orange-600">
              {Math.round(progressPercentage)}% complété
            </span>
          </div>
        </div>
      </div>

      {/* Animated Shimmer Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

/**
 * Helper function to generate steps array from current page
 * @param mode - 'quick' or 'full' onboarding mode
 * @param currentPageIndex - Current page index (0-based)
 * @returns Array of steps with status
 */
export function generateStepsArray(
  mode: 'quick' | 'full',
  currentPageIndex: number
): Step[] {
  const quickSteps: Step[] = [
    { id: 'basic-info', label: 'Infos de base', status: 'upcoming' },
    { id: 'budget-location', label: 'Budget & Lieu', status: 'upcoming' },
    { id: 'lifestyle', label: 'Style de vie', status: 'upcoming' },
    { id: 'availability', label: 'Disponibilité', status: 'upcoming' },
    { id: 'complete', label: 'Terminé', status: 'upcoming' },
  ];

  const fullSteps: Step[] = [
    { id: 'profile-type', label: 'Type', status: 'upcoming' },
    { id: 'basic-info', label: 'Infos', status: 'upcoming' },
    { id: 'daily-habits', label: 'Habitudes', status: 'upcoming' },
    { id: 'lifestyle', label: 'Lifestyle', status: 'upcoming' },
    { id: 'home-lifestyle', label: 'Maison', status: 'upcoming' },
    { id: 'ideal-coliving', label: 'Coliving', status: 'upcoming' },
    { id: 'preferences', label: 'Préférences', status: 'upcoming' },
    { id: 'social-vibe', label: 'Social', status: 'upcoming' },
    { id: 'privacy', label: 'Confidentialité', status: 'upcoming' },
    { id: 'verification', label: 'Vérification', status: 'upcoming' },
    { id: 'group-selection', label: 'Groupe', status: 'upcoming' },
    { id: 'review', label: 'Révision', status: 'upcoming' },
    { id: 'success', label: 'Succès', status: 'upcoming' },
  ];

  const steps = mode === 'quick' ? quickSteps : fullSteps;

  return steps.map((step, index) => ({
    ...step,
    status:
      index < currentPageIndex
        ? 'completed'
        : index === currentPageIndex
        ? 'current'
        : 'upcoming',
  }));
}
