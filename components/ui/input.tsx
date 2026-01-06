import * as React from "react"
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
   * Full width input
   */
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      helperText,
      leftIcon,
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
              'flex h-12 w-full rounded-full border-2 bg-white py-2 text-base transition-all duration-200',
              'ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon ? 'pl-10 pr-6' : 'px-6',
              hasError
                ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500'
                : 'border-gray-300 focus-visible:border-[#9c5698] focus-visible:ring-[#9c5698]',
              className
            )}
            {...props}
          />
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
Input.displayName = "Input"

export { Input }
