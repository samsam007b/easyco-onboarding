import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface RadioOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
  description?: string
}

export interface RadioGroupProps {
  /**
   * Radio group name
   */
  name: string

  /**
   * Label for the radio group
   */
  label?: string

  /**
   * Radio options
   */
  options: RadioOption[]

  /**
   * Selected value
   */
  value?: string

  /**
   * Change handler
   */
  onChange?: (value: string) => void

  /**
   * Error message to display
   */
  error?: string

  /**
   * Helper text to display below radio group
   */
  helperText?: string

  /**
   * Radio size
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * Orientation
   */
  orientation?: 'vertical' | 'horizontal'

  /**
   * Disabled state
   */
  disabled?: boolean

  /**
   * Required field
   */
  required?: boolean
}

export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  size = 'md',
  orientation = 'vertical',
  disabled = false,
  required = false,
}: RadioGroupProps) {
  const groupId = React.useId()
  const hasError = Boolean(error)

  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleChange = (optionValue: string) => {
    if (onChange && !disabled) {
      onChange(optionValue)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={cn(
          'flex gap-4',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
      >
        {options.map((option, index) => {
          const optionId = `${groupId}-${index}`
          const isDisabled = disabled || option.disabled
          const isChecked = value === option.value

          return (
            <div key={option.value} className="flex items-start gap-3">
              <div className="relative flex items-center justify-center pt-0.5">
                <input
                  type="radio"
                  id={optionId}
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => handleChange(option.value)}
                  className={cn(
                    'peer appearance-none rounded-full border-2 transition-all duration-200',
                    'cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    hasError
                      ? 'border-red-300 focus:ring-red-500/50'
                      : 'border-gray-300 focus:ring-[#4A148C]/50',
                    sizeStyles[size]
                  )}
                />
                <div
                  className={cn(
                    'absolute pointer-events-none rounded-full bg-[#4A148C]',
                    'opacity-0 peer-checked:opacity-100 transition-opacity',
                    size === 'sm' && 'w-2 h-2',
                    size === 'md' && 'w-2.5 h-2.5',
                    size === 'lg' && 'w-3 h-3'
                  )}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor={optionId}
                  className={cn(
                    'text-gray-700 cursor-pointer select-none',
                    isDisabled && 'opacity-50 cursor-not-allowed',
                    size === 'sm' && 'text-sm',
                    size === 'md' && 'text-base',
                    size === 'lg' && 'text-lg'
                  )}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-sm text-gray-500">{option.description}</p>
                )}
              </div>
            </div>
          )
        })}
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

RadioGroup.displayName = 'RadioGroup'

export { RadioGroup as Radio }
