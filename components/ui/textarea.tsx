import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label text
   */
  label?: string

  /**
   * Error message to display
   */
  error?: string

  /**
   * Helper text to display below textarea
   */
  helperText?: string

  /**
   * Show character count
   */
  showCount?: boolean

  /**
   * Full width textarea
   */
  fullWidth?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showCount = false,
      fullWidth = false,
      disabled,
      maxLength,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${React.useId()}`
    const hasError = Boolean(error)
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={textareaId} className="text-sm font-medium text-gray-700">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {showCount && maxLength && (
              <span className="text-xs text-gray-500">
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          className={cn(
            'w-full px-4 py-3 superellipse-2xl border-2 transition-all duration-200',
            'text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
            'resize-y min-h-[100px]',
            hasError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50'
              : 'border-gray-300 focus:border-[#4A148C] focus:ring-[#4A148C]/50',
            className
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea'

export { Textarea }
