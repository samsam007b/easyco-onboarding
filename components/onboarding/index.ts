// Existing onboarding flow components
export { default as OnboardingLayout } from './OnboardingLayout';
export { roleThemes } from './OnboardingLayout';
export type { OnboardingRole } from './OnboardingLayout';
export {
  OnboardingHeading,
  OnboardingInput,
  OnboardingButton,
  OnboardingSelectionCard,
  OnboardingSlider,
  OnboardingLabel,
  OnboardingGrid,
} from './OnboardingComponents';
export { default as ProgressBar } from './ProgressBar';
export { default as MainResidentWelcome } from './MainResidentWelcome';
export { default as ResidentWelcome } from './ResidentWelcome';

// New interactive onboarding tour
export { default as OnboardingTour } from './OnboardingTour';
export { useOnboarding } from '@/lib/hooks/useOnboarding';
export type { OnboardingStep } from '@/lib/hooks/useOnboarding';
