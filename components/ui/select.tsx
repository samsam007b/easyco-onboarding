import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * Label text
   */
  label?: string

  /**
   * Error message to display
   */
  error?: string

  /**
   * Helper text to display below select
   */
  helperText?: string

  /**
   * Select options
   */
  options: SelectOption[]

  /**
   * Placeholder text
   */
  placeholder?: string

  /**
   * Full width select
   */
  fullWidth?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder = 'Select an option',
      fullWidth = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${React.useId()}`
    const hasError = Boolean(error)

    return (
      <div className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-3 pr-10 rounded-full border-2 transition-all duration-200',
              'text-gray-900 appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
              hasError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50'
                : 'border-gray-300 focus:border-[#4A148C] focus:ring-[#4A148C]/50',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronDown className="w-5 h-5" />
          </div>
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

Select.displayName = 'Select'

export { Select }
