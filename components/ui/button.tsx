import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual variant
   * - primary: Yellow background (EasyCo brand)
   * - secondary: Purple background (EasyCo brand)
   * - outline: Transparent with border
   * - ghost: Transparent without border
   * - destructive: Red for dangerous actions
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'

  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * Full width button
   */
  fullWidth?: boolean

  /**
   * Loading state
   */
  loading?: boolean

  /**
   * Icon to display before text
   */
  leftIcon?: React.ReactNode

  /**
   * Icon to display after text
   */
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantStyles = {
      primary:
        'bg-[#FFD600] text-black hover:bg-[#F5C400] focus:ring-[#FFD600]/50 shadow-sm hover:shadow-md',
      secondary:
        'bg-[#4A148C] text-white hover:bg-[#6A1B9A] focus:ring-[#4A148C]/50 shadow-sm hover:shadow-md',
      outline:
        'border-2 border-gray-300 text-gray-700 hover:border-[#4A148C] hover:text-[#4A148C] focus:ring-[#4A148C]/50 bg-white',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
      destructive:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50 shadow-sm hover:shadow-md',
    }

    const sizeStyles = {
      sm: 'text-sm px-4 py-2 rounded-full',
      md: 'text-base px-6 py-3 rounded-full',
      lg: 'text-lg px-8 py-4 rounded-full',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
