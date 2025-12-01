'use client';

import { ReactNode, InputHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { OnboardingRole, roleThemes } from './OnboardingLayout';

// =============================================================================
// ONBOARDING HEADING
// =============================================================================
interface OnboardingHeadingProps {
  role: OnboardingRole;
  title: string;
  description?: string;
}

export function OnboardingHeading({ role, title, description }: OnboardingHeadingProps) {
  const theme = roleThemes[role];

  return (
    <div className="mb-6">
      <h1 className={`text-3xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent mb-2`}>
        {title}
      </h1>
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
    </div>
  );
}

// =============================================================================
// ONBOARDING INPUT
// =============================================================================
interface OnboardingInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  role: OnboardingRole;
  label: string;
  required?: boolean;
  icon?: LucideIcon;
  error?: string;
}

export const OnboardingInput = forwardRef<HTMLInputElement, OnboardingInputProps>(
  ({ role, label, required, icon: Icon, error, ...props }, ref) => {
    const theme = roleThemes[role];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
          <input
            ref={ref}
            className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border border-gray-300 rounded-lg ${theme.focusRing} focus:ring-2 focus:border-transparent outline-none transition-all`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

OnboardingInput.displayName = 'OnboardingInput';

// =============================================================================
// ONBOARDING BUTTON
// =============================================================================
interface OnboardingButtonProps {
  role: OnboardingRole;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function OnboardingButton({
  role,
  children,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary',
  className = '',
}: OnboardingButtonProps) {
  const theme = roleThemes[role];

  const baseClasses = 'w-full py-4 rounded-lg font-semibold text-lg transition-all';

  const variantClasses = {
    primary: disabled
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
      : `bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-white`,
    secondary: disabled
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
      : `bg-white text-gray-700 border border-gray-300 hover:border-gray-400`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// =============================================================================
// ONBOARDING SELECTION CARD
// =============================================================================
interface OnboardingSelectionCardProps {
  role: OnboardingRole;
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export function OnboardingSelectionCard({
  role,
  selected,
  onClick,
  children,
  className = '',
}: OnboardingSelectionCardProps) {
  const theme = roleThemes[role];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all text-left ${
        selected
          ? `${theme.selectedBorder} ${theme.selectedBg}`
          : 'border-gray-300 hover:border-gray-400'
      } ${className}`}
    >
      {children}
    </button>
  );
}

// =============================================================================
// ONBOARDING SLIDER
// =============================================================================
interface OnboardingSliderProps {
  role: OnboardingRole;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

export function OnboardingSlider({
  role,
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  minLabel,
  maxLabel,
}: OnboardingSliderProps) {
  const theme = roleThemes[role];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className="space-y-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${theme.accent}`}
        />
        <div className="flex justify-between items-center">
          {minLabel && <span className="text-sm text-gray-500">{minLabel}</span>}
          <span className={`text-2xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
            {value}
          </span>
          {maxLabel && <span className="text-sm text-gray-500">{maxLabel}</span>}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ONBOARDING LABEL
// =============================================================================
interface OnboardingLabelProps {
  children: ReactNode;
  required?: boolean;
  className?: string;
}

export function OnboardingLabel({ children, required, className = '' }: OnboardingLabelProps) {
  return (
    <label className={`block text-sm font-medium text-gray-700 mb-3 ${className}`}>
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

// =============================================================================
// ONBOARDING GRID
// =============================================================================
interface OnboardingGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function OnboardingGrid({ children, columns = 2, className = '' }: OnboardingGridProps) {
  const colClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <div className={`grid ${colClasses[columns]} gap-3 ${className}`}>
      {children}
    </div>
  );
}
