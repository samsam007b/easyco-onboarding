import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/use-language'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Badge variant
   */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'

  /**
   * Badge size
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * Dismissible badge (shows close button)
   */
  dismissible?: boolean

  /**
   * On dismiss callback
   */
  onDismiss?: () => void

  /**
   * Icon to display before text
   */
  icon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      dismissible = false,
      onDismiss,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const { language, getSection } = useLanguage()
    const ariaLabels = getSection('ariaLabels')

    const variantStyles = {
      default: 'bg-gray-100 text-gray-800 border-gray-200',
      primary: 'bg-[#FFD600]/10 text-[#9c5698] border-[#FFD600]/30',
      secondary: 'bg-[#9c5698]/10 text-[#9c5698] border-[#9c5698]/30',
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
    }

    const sizeStyles = {
      sm: 'text-xs px-2 py-0.5 gap-1',
      md: 'text-sm px-3 py-1 gap-1.5',
      lg: 'text-base px-4 py-1.5 gap-2',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full border',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && <span className="inline-flex">{icon}</span>}
        <span>{children}</span>
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex items-center justify-center hover:opacity-70 transition-opacity"
            aria-label={ariaLabels?.dismiss?.[language] || 'Dismiss'}
          >
            <X className={cn(
              size === 'sm' && 'w-3 h-3',
              size === 'md' && 'w-3.5 h-3.5',
              size === 'lg' && 'w-4 h-4'
            )} />
          </button>
        )}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
