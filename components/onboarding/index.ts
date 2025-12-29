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

// Getting Started checklist
export { default as GettingStartedChecklist } from './GettingStartedChecklist';
export {
  useGettingStarted,
  SEARCHER_CHECKLIST_ITEMS,
  RESIDENT_CHECKLIST_ITEMS,
} from '@/lib/hooks/useGettingStarted';
export type { ChecklistItem } from '@/lib/hooks/useGettingStarted';

// Celebrations
export { useCelebration } from '@/lib/hooks/useCelebration';
export { celebrateToast, quickToast, showToast, setToastVariant } from '@/lib/utils/celebrations';
