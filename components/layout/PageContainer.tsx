import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Max width variant
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

  /**
   * Padding size
   */
  padding?: 'none' | 'sm' | 'md' | 'lg'

  /**
   * Center content
   */
  center?: boolean
}

export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  (
    {
      className,
      maxWidth = 'xl',
      padding = 'md',
      center = false,
      children,
      ...props
    },
    ref
  ) => {
    const maxWidthStyles = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-5xl',
      xl: 'max-w-6xl',
      '2xl': 'max-w-7xl',
      full: 'max-w-full',
    }

    const paddingStyles = {
      none: 'px-0 py-0',
      sm: 'px-4 py-4',
      md: 'px-6 py-8',
      lg: 'px-8 py-12',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          maxWidthStyles[maxWidth],
          paddingStyles[padding],
          center && 'mx-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

PageContainer.displayName = 'PageContainer'
