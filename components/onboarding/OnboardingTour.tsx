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

// Premium gradient colors based on variant
const GRADIENTS = {
  searcher: {
    primary: 'linear-gradient(135deg, #9c5698 0%, #9D7EE5 50%, #FFA040 100%)',
    bg: 'from-purple-500 via-purple-600 to-orange-500',
    accent: '#9D7EE5',
    accentLight: '#b794f6',
    glow: 'rgba(157, 126, 229, 0.6)',
    glowSoft: 'rgba(157, 126, 229, 0.25)',
  },
  resident: {
    primary: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
    bg: 'from-red-500 via-orange-500 to-orange-400',
    accent: '#ee5736',
    accentLight: '#ff7a5c',
    glow: 'rgba(238, 87, 54, 0.6)',
    glowSoft: 'rgba(238, 87, 54, 0.25)',
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
        const tooltipWidth = 340;
        const tooltipHeight = 220;
        const padding = 20;
        const arrowOffset = 16;

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

  // Calculate spotlight dimensions with padding
  const spotlightPadding = 12;
  const spotlightRect = targetRect ? {
    left: targetRect.left - spotlightPadding,
    top: targetRect.top - spotlightPadding,
    width: targetRect.width + spotlightPadding * 2,
    height: targetRect.height + spotlightPadding * 2,
    centerX: targetRect.left + targetRect.width / 2,
    centerY: targetRect.top + targetRect.height / 2,
  } : null;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <>
          {/* Light frosted glass overlay - everything is "blinded" by light */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[9997] pointer-events-none"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px) saturate(120%) brightness(1.1)',
              WebkitBackdropFilter: 'blur(12px) saturate(120%) brightness(1.1)',
            }}
          />

          {/* Subtle light diffraction effect - prismatic shimmer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9997] pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 20% 20%, rgba(255, 200, 150, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse 60% 40% at 80% 30%, rgba(255, 180, 120, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse 50% 60% at 50% 80%, rgba(255, 220, 180, 0.12) 0%, transparent 50%)
              `,
            }}
          />

          {/* Clear cutout - the "window" through the frosted glass */}
          {spotlightRect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9998] pointer-events-none"
              style={{
                background: `radial-gradient(ellipse ${spotlightRect.width + 40}px ${spotlightRect.height + 40}px at ${spotlightRect.centerX}px ${spotlightRect.centerY}px,
                  transparent 0%,
                  transparent 70%,
                  rgba(255, 255, 255, 0.6) 85%,
                  rgba(255, 255, 255, 0.95) 100%)`,
              }}
            />
          )}

          {/* Soft ambient glow around target - warm light effect */}
          {spotlightRect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="fixed z-[9998] pointer-events-none"
              style={{
                left: spotlightRect.left - 20,
                top: spotlightRect.top - 20,
                width: spotlightRect.width + 40,
                height: spotlightRect.height + 40,
                borderRadius: 28,
                background: `radial-gradient(ellipse at center, ${colors.glowSoft} 0%, transparent 70%)`,
                filter: 'blur(15px)',
              }}
            />
          )}

          {/* Outer pulsing glow ring */}
          {spotlightRect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.015, 1],
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="fixed z-[9998] pointer-events-none"
              style={{
                left: spotlightRect.left - 4,
                top: spotlightRect.top - 4,
                width: spotlightRect.width + 8,
                height: spotlightRect.height + 8,
                borderRadius: 22,
                boxShadow: `
                  0 0 0 2px ${colors.glow},
                  0 0 20px ${colors.glow},
                  0 0 40px ${colors.glowSoft}
                `,
              }}
            />
          )}

          {/* Main spotlight frame - clickable, card-like with elevation */}
          {spotlightRect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 28,
                delay: 0.05
              }}
              whileHover={{ scale: 1.008, y: -2 }}
              whileTap={{ scale: 0.995 }}
              className="fixed z-[9999] cursor-pointer"
              onClick={isLastStep ? onComplete : onNext}
              style={{
                left: spotlightRect.left,
                top: spotlightRect.top,
                width: spotlightRect.width,
                height: spotlightRect.height,
                borderRadius: 20,
                background: 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${colors.accent}`,
                boxShadow: `
                  0 8px 32px rgba(0, 0, 0, 0.08),
                  0 16px 48px rgba(0, 0, 0, 0.06),
                  0 2px 8px ${colors.glowSoft},
                  inset 0 0 0 1px rgba(255, 255, 255, 0.5)
                `,
              }}
              title="Cliquez pour continuer"
            >
              {/* Shimmer animation across the frame */}
              <motion.div
                className="absolute inset-0 rounded-[18px] overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    backgroundPosition: ['-200% 0', '200% 0'],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    background: `linear-gradient(120deg, transparent 30%, ${colors.glowSoft} 50%, transparent 70%)`,
                    backgroundSize: '200% 100%',
                  }}
                />
              </motion.div>

              {/* Corner accent dots */}
              <div
                className="absolute -top-1 -left-1 w-2 h-2 rounded-full"
                style={{ background: colors.accent, boxShadow: `0 0 6px ${colors.glow}` }}
              />
              <div
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                style={{ background: colors.accent, boxShadow: `0 0 6px ${colors.glow}` }}
              />
              <div
                className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full"
                style={{ background: colors.accent, boxShadow: `0 0 6px ${colors.glow}` }}
              />
              <div
                className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full"
                style={{ background: colors.accent, boxShadow: `0 0 6px ${colors.glow}` }}
              />
            </motion.div>
          )}

          {/* Premium Tooltip */}
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              delay: 0.1
            }}
            className="fixed z-[10000] w-[340px]"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
            }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderRadius: 20,
                boxShadow: `
                  0 4px 6px rgba(0, 0, 0, 0.04),
                  0 10px 24px rgba(0, 0, 0, 0.08),
                  0 20px 48px rgba(0, 0, 0, 0.08),
                  0 0 0 1px rgba(255, 255, 255, 0.8),
                  inset 0 1px 0 rgba(255, 255, 255, 1)
                `,
              }}
            >
              {/* Header with premium gradient */}
              <div
                className="relative p-5 text-white overflow-hidden"
                style={{ background: colors.primary }}
              >
                {/* Subtle noise texture */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Shine overlay */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 40%, transparent 100%)',
                  }}
                />

                <div className="relative flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="p-1.5 rounded-lg"
                      style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium tracking-wide opacity-95">
                      Étape {currentStep + 1} sur {totalSteps}
                    </span>
                  </div>
                  <button
                    onClick={onSkip}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="relative text-lg font-semibold tracking-tight">
                  {currentStepData?.title}
                </h3>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {currentStepData?.description}
                </p>

                {/* Premium progress indicator */}
                <div className="flex justify-center gap-2 mb-5">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={{
                        width: i === currentStep ? 28 : 8,
                        opacity: i <= currentStep ? 1 : 0.35,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="h-2 rounded-full"
                      style={{
                        background: i === currentStep
                          ? colors.primary
                          : i < currentStep
                            ? colors.accent
                            : '#e5e7eb',
                        boxShadow: i === currentStep ? `0 2px 8px ${colors.glowSoft}` : 'none',
                      }}
                    />
                  ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSkip}
                    className="text-gray-400 hover:text-gray-600 text-xs font-medium tracking-wide"
                  >
                    Passer le tour
                  </Button>

                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onPrev}
                        className="rounded-full w-9 h-9 p-0 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-500" />
                      </Button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={isLastStep ? onComplete : onNext}
                      className="rounded-full text-white px-5 py-2 text-sm font-medium flex items-center gap-1.5 transition-all duration-200"
                      style={{
                        background: colors.primary,
                        boxShadow: `0 4px 14px ${colors.glowSoft}`,
                      }}
                    >
                      {isLastStep ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Terminé !
                        </>
                      ) : (
                        <>
                          Suivant
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
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
