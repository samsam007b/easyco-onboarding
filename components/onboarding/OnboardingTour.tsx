'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { OnboardingStep } from '@/lib/hooks/useOnboarding';

interface OnboardingTourProps {
  isActive: boolean;
  currentStep: number;
  currentStepData: OnboardingStep;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onComplete: () => void;
  variant?: 'searcher' | 'resident';
}

// Gradient colors based on variant
const GRADIENTS = {
  searcher: {
    primary: 'linear-gradient(135deg, #9c5698 0%, #9D7EE5 50%, #FFA040 100%)',
    bg: 'from-purple-500 via-purple-600 to-orange-500',
    accent: '#9D7EE5',
  },
  resident: {
    primary: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
    bg: 'from-red-500 via-orange-500 to-orange-400',
    accent: '#ee5736',
  },
};

export default function OnboardingTour({
  isActive,
  currentStep,
  currentStepData,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  onComplete,
  variant = 'searcher',
}: OnboardingTourProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const colors = GRADIENTS[variant];
  const isLastStep = currentStep === totalSteps - 1;

  // Find and highlight the target element
  useEffect(() => {
    if (!isActive || !currentStepData?.target) return;

    const findElement = () => {
      const element = document.querySelector(currentStepData.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);

        // Calculate tooltip position
        const tooltipWidth = 320;
        const tooltipHeight = 200;
        const padding = 16;
        const arrowOffset = 12;

        let x = 0;
        let y = 0;

        const position = currentStepData.position || 'bottom';

        switch (position) {
          case 'top':
            x = rect.left + rect.width / 2 - tooltipWidth / 2;
            y = rect.top - tooltipHeight - arrowOffset;
            break;
          case 'bottom':
            x = rect.left + rect.width / 2 - tooltipWidth / 2;
            y = rect.bottom + arrowOffset;
            break;
          case 'left':
            x = rect.left - tooltipWidth - arrowOffset;
            y = rect.top + rect.height / 2 - tooltipHeight / 2;
            break;
          case 'right':
            x = rect.right + arrowOffset;
            y = rect.top + rect.height / 2 - tooltipHeight / 2;
            break;
        }

        // Keep tooltip within viewport
        x = Math.max(padding, Math.min(x, window.innerWidth - tooltipWidth - padding));
        y = Math.max(padding, Math.min(y, window.innerHeight - tooltipHeight - padding));

        setTooltipPosition({ x, y });

        // Scroll element into view if needed
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // Wait for DOM to settle
    const timer = setTimeout(findElement, 100);
    window.addEventListener('resize', findElement);
    window.addEventListener('scroll', findElement);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', findElement);
      window.removeEventListener('scroll', findElement);
    };
  }, [isActive, currentStepData]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Overlay with spotlight cutout - no click to skip, only explicit actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] pointer-events-none"
            style={{
              background: targetRect
                ? `radial-gradient(ellipse ${targetRect.width + 40}px ${targetRect.height + 40}px at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent 0%, rgba(0, 0, 0, 0.75) 100%)`
                : 'rgba(0, 0, 0, 0.75)',
            }}
          />

          {/* Clickable spotlight area - clicking advances the tour */}
          {targetRect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed z-[9999] cursor-pointer"
              onClick={isLastStep ? onComplete : onNext}
              style={{
                left: targetRect.left - 8,
                top: targetRect.top - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
                borderRadius: 16,
                boxShadow: `0 0 0 4px ${colors.accent}, 0 0 20px ${colors.accent}40`,
              }}
              title="Cliquez pour continuer"
            />
          )}

          {/* Tooltip */}
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed z-[10000] w-[320px]"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Header */}
              <div
                className="p-4 text-white"
                style={{ background: colors.primary }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium opacity-90">
                      Étape {currentStep + 1} sur {totalSteps}
                    </span>
                  </div>
                  <button
                    onClick={onSkip}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold">{currentStepData?.title}</h3>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {currentStepData?.description}
                </p>

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mb-4">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        i === currentStep
                          ? 'w-6'
                          : i < currentStep
                          ? 'bg-gray-300'
                          : 'bg-gray-200'
                      )}
                      style={i === currentStep ? { background: colors.primary } : {}}
                    />
                  ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSkip}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Passer le tour
                  </Button>

                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onPrev}
                        className="rounded-full"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      size="sm"
                      onClick={isLastStep ? onComplete : onNext}
                      className="rounded-full text-white px-4"
                      style={{ background: colors.primary }}
                    >
                      {isLastStep ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Terminé !
                        </>
                      ) : (
                        <>
                          Suivant
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
