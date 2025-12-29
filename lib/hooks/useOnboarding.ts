'use client';

import { useState, useEffect, useCallback } from 'react';

export interface OnboardingStep {
  id: string;
  target: string; // CSS selector for the element to highlight
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    onClick?: () => void;
  };
}

interface UseOnboardingOptions {
  tourId: string; // Unique identifier for this tour (e.g., 'searcher-dashboard', 'resident-hub')
  steps: OnboardingStep[];
  onComplete?: () => void;
  onSkip?: () => void;
}

const STORAGE_KEY = 'easyco_onboarding_completed';

export function useOnboarding({ tourId, steps, onComplete, onSkip }: UseOnboardingOptions) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(true); // Default to true to prevent flash

  // Check if tour was already completed
  useEffect(() => {
    const completedTours = localStorage.getItem(STORAGE_KEY);
    if (completedTours) {
      const parsed = JSON.parse(completedTours);
      setHasCompleted(parsed[tourId] === true);
    } else {
      setHasCompleted(false);
    }
  }, [tourId]);

  // Auto-start tour for new users after a small delay
  useEffect(() => {
    if (!hasCompleted) {
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1500); // Wait for page to load
      return () => clearTimeout(timer);
    }
  }, [hasCompleted]);

  const markAsCompleted = useCallback(() => {
    const completedTours = localStorage.getItem(STORAGE_KEY);
    const parsed = completedTours ? JSON.parse(completedTours) : {};
    parsed[tourId] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    setHasCompleted(true);
  }, [tourId]);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    markAsCompleted();
    onComplete?.();
  }, [markAsCompleted, onComplete]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    markAsCompleted();
    onSkip?.();
  }, [markAsCompleted, onSkip]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endTour();
    }
  }, [currentStep, steps.length, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  }, [steps.length]);

  // Reset tour (for testing/debugging)
  const resetTour = useCallback(() => {
    const completedTours = localStorage.getItem(STORAGE_KEY);
    const parsed = completedTours ? JSON.parse(completedTours) : {};
    delete parsed[tourId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    setHasCompleted(false);
    setCurrentStep(0);
  }, [tourId]);

  return {
    isActive,
    currentStep,
    currentStepData: steps[currentStep],
    totalSteps: steps.length,
    hasCompleted,
    startTour,
    endTour,
    skipTour,
    nextStep,
    prevStep,
    goToStep,
    resetTour,
  };
}
