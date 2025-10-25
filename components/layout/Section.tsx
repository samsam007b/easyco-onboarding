import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Section title
   */
  title?: string

  /**
   * Section description
   */
  description?: string

  /**
   * Spacing size
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg'

  /**
   * Show divider at bottom
   */
  divider?: boolean

  /**
   * Actions to display on the right side of the header
   */
  actions?: React.ReactNode
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      title,
      description,
      spacing = 'md',
      divider = false,
      actions,
      children,
      ...props
    },
    ref
  ) => {
    const spacingStyles = {
      none: 'py-0',
      sm: 'py-4',
      md: 'py-6',
      lg: 'py-8',
    }

    return (
      <section
        ref={ref}
        className={cn(
          spacingStyles[spacing],
          divider && 'border-b border-gray-100 last:border-0',
          className
        )}
        {...props}
      >
        {(title || description || actions) && (
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              {title && (
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-gray-600">
                  {description}
                </p>
              )}
            </div>

            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        )}

        {children}
      </section>
    )
  }
)

Section.displayName = 'Section'
