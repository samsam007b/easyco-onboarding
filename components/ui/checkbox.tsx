import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Check } from 'lucide-react'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * Label text
   */
  label?: React.ReactNode

  /**
   * Error message to display
   */
  error?: string

  /**
   * Helper text to display below checkbox
   */
  helperText?: string

  /**
   * Checkbox size
   */
  size?: 'sm' | 'md' | 'lg'
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      size = 'md',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${React.useId()}`
    const hasError = Boolean(error)

    const sizeStyles = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    }

    const iconSizeStyles = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <div className="relative flex items-center justify-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              disabled={disabled}
              className={cn(
                'peer appearance-none rounded border-2 transition-all duration-200',
                'cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'checked:bg-[#4A148C] checked:border-[#4A148C]',
                hasError
                  ? 'border-red-300 focus:ring-red-500/50'
                  : 'border-gray-300 focus:ring-[#4A148C]/50',
                sizeStyles[size],
                className
              )}
              {...props}
            />
            <Check
              className={cn(
                'absolute pointer-events-none text-white opacity-0 peer-checked:opacity-100 transition-opacity',
                iconSizeStyles[size]
              )}
            />
          </div>

          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'text-gray-700 cursor-pointer select-none',
                disabled && 'opacity-50 cursor-not-allowed',
                size === 'sm' && 'text-sm',
                size === 'md' && 'text-base',
                size === 'lg' && 'text-lg'
              )}
            >
              {label}
            </label>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={cn(
              'text-sm ml-8',
              hasError ? 'text-red-600' : 'text-gray-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
