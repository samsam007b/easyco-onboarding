import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text
   */
  label?: string

  /**
   * Error message to display
   */
  error?: string

  /**
   * Helper text to display below input
   */
  helperText?: string

  /**
   * Icon to display on the left side
   */
  leftIcon?: React.ReactNode

  /**
   * Icon to display on the right side
   */
  rightIcon?: React.ReactNode

  /**
   * Full width input
   */
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${React.useId()}`
    const hasError = Boolean(error)

    return (
      <div className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-3 rounded-full border-2 transition-all duration-200',
              'text-gray-900 placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
              hasError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50'
                : 'border-gray-300 focus:border-[#4A148C] focus:ring-[#4A148C]/50',
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={cn(
              'text-sm',
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

Input.displayName = 'Input'

export { Input }
