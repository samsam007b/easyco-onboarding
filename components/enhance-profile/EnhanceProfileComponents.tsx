'use client';

import { ReactNode, TextareaHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { enhanceThemes, EnhanceRole } from './EnhanceProfileLayout';
import { ArrowRight, Sparkles, Lightbulb, ClipboardList, Lock, Zap } from 'lucide-react';

// Map icon names to Lucide components for EnhanceProfileInfoBox
const ICON_MAP: Record<string, ReactNode> = {
  'lightbulb': <Lightbulb className="w-4 h-4" />,
  'clipboard': <ClipboardList className="w-4 h-4" />,
  'lock': <Lock className="w-4 h-4" />,
  'sparkles': <Sparkles className="w-4 h-4" />,
};

interface EnhanceProfileHeadingProps {
  role: EnhanceRole;
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function EnhanceProfileHeading({ role, title, description, icon }: EnhanceProfileHeadingProps) {
  const theme = enhanceThemes[role];

  return (
    <div className="text-center mb-8">
      {icon && (
        <div className={`w-16 h-16 ${theme.bgLight} superellipse-2xl flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
      )}
      <h1 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent mb-2`}>
        {title}
      </h1>
      {description && (
        <p className="text-gray-600 text-sm sm:text-base">{description}</p>
      )}
    </div>
  );
}

interface EnhanceProfileTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  role: EnhanceRole;
  label: string;
  helperText?: string;
  maxLength?: number;
  value: string;
}

export function EnhanceProfileTextarea({
  role,
  label,
  helperText,
  maxLength,
  value,
  ...props
}: EnhanceProfileTextareaProps) {
  const theme = enhanceThemes[role];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {helperText && (
        <p className="text-xs text-gray-500 mb-3">{helperText}</p>
      )}
      <textarea
        value={value}
        className={`w-full px-4 py-3 border border-gray-300 superellipse-lg ${theme.focusRing} focus:border-transparent outline-none transition-all resize-none`}
        {...props}
      />
      {maxLength && (
        <p className="text-xs text-gray-500 mt-1">{value.length} / {maxLength} characters</p>
      )}
    </div>
  );
}

interface EnhanceProfileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  role: EnhanceRole;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: ReactNode;
}

export function EnhanceProfileButton({
  role,
  children,
  variant = 'primary',
  icon,
  ...props
}: EnhanceProfileButtonProps) {
  const theme = enhanceThemes[role];

  const baseClasses = 'px-6 py-3 sm:py-4 superellipse-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2';

  const variantClasses = {
    primary: `bg-gradient-to-r ${theme.gradient} text-white hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`,
    secondary: `${theme.bgLight} ${theme.textPrimary} hover:opacity-90`,
    outline: `border-2 border-gray-300 text-gray-700 hover:bg-gray-50`,
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
      {icon || (variant === 'primary' && <ArrowRight className="w-5 h-5" />)}
    </button>
  );
}

interface EnhanceProfileSelectionCardProps {
  role: EnhanceRole;
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function EnhanceProfileSelectionCard({
  role,
  selected,
  onClick,
  children,
  icon,
  className = '',
}: EnhanceProfileSelectionCardProps) {
  const theme = enhanceThemes[role];

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 superellipse-xl border transition-all duration-200 font-medium ${
        selected
          ? `bg-gradient-to-br ${theme.gradient} text-white border-transparent shadow-lg hover:shadow-xl transform hover:scale-[1.02]`
          : `bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md`
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div className="flex-1 text-center">{children}</div>
        </div>
        {selected && (
          <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <div className="w-2.5 h-2.5 bg-white rounded-full" />
          </div>
        )}
      </div>
    </button>
  );
}

interface EnhanceProfileSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function EnhanceProfileSection({ title, children, className = '' }: EnhanceProfileSectionProps) {
  return (
    <div className={className}>
      {title && (
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      )}
      {children}
    </div>
  );
}

interface EnhanceProfileInfoBoxProps {
  role: EnhanceRole;
  title?: string;
  children: ReactNode;
  icon?: string | ReactNode;
}

export function EnhanceProfileInfoBox({ role, title, children, icon }: EnhanceProfileInfoBoxProps) {
  const theme = enhanceThemes[role];

  // Resolve string icons to Lucide components
  const resolvedIcon = typeof icon === 'string' ? (ICON_MAP[icon] || icon) : icon;

  return (
    <div className={`${theme.bgLight} ${theme.borderLight} border superellipse-xl p-4`}>
      {title && (
        <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          {resolvedIcon && <span className="flex items-center">{resolvedIcon}</span>}
          {title}
        </h3>
      )}
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}

interface EnhanceProfileTagProps {
  role: EnhanceRole;
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export function EnhanceProfileTag({ role, children, selected = false, onClick, onRemove, disabled = false }: EnhanceProfileTagProps) {
  const theme = enhanceThemes[role];

  const TagElement = onClick ? 'button' : 'div';

  return (
    <TagElement
      onClick={disabled ? undefined : onClick}
      disabled={onClick && disabled ? disabled : undefined}
      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
        selected
          ? `bg-gradient-to-r ${theme.gradient} text-white shadow-md`
          : `bg-gray-100 text-gray-700 ${onClick && !disabled ? 'hover:bg-gray-200 cursor-pointer' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
      }`}
    >
      {children}
    </TagElement>
  );
}
