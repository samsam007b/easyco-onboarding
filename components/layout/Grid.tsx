import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns
   */
  cols?: 1 | 2 | 3 | 4 | 6 | 12

  /**
   * Gap size between grid items
   */
  gap?: 'none' | 'sm' | 'md' | 'lg'

  /**
   * Responsive breakpoints configuration
   */
  responsive?: {
    sm?: 1 | 2 | 3 | 4
    md?: 1 | 2 | 3 | 4
    lg?: 1 | 2 | 3 | 4 | 6
    xl?: 1 | 2 | 3 | 4 | 6 | 12
  }
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      cols = 1,
      gap = 'md',
      responsive,
      children,
      ...props
    },
    ref
  ) => {
    const colsStyles = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    }

    const gapStyles = {
      none: 'gap-0',
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
    }

    // Build responsive classes
    const responsiveClasses = responsive
      ? Object.entries(responsive)
          .map(([breakpoint, cols]) => {
            const prefix = {
              sm: 'sm:',
              md: 'md:',
              lg: 'lg:',
              xl: 'xl:',
            }[breakpoint]

            const colClass = {
              1: 'grid-cols-1',
              2: 'grid-cols-2',
              3: 'grid-cols-3',
              4: 'grid-cols-4',
              6: 'grid-cols-6',
              12: 'grid-cols-12',
            }[cols as number]

            return `${prefix}${colClass}`
          })
          .join(' ')
      : ''

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          colsStyles[cols],
          gapStyles[gap],
          responsiveClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Grid.displayName = 'Grid'

// Grid Item component for more control
export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Column span
   */
  colSpan?: 1 | 2 | 3 | 4 | 6 | 12 | 'full'

  /**
   * Row span
   */
  rowSpan?: 1 | 2 | 3 | 4 | 'full'
}

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      className,
      colSpan = 1,
      rowSpan = 1,
      children,
      ...props
    },
    ref
  ) => {
    const colSpanStyles = {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      6: 'col-span-6',
      12: 'col-span-12',
      full: 'col-span-full',
    }

    const rowSpanStyles = {
      1: 'row-span-1',
      2: 'row-span-2',
      3: 'row-span-3',
      4: 'row-span-4',
      full: 'row-span-full',
    }

    return (
      <div
        ref={ref}
        className={cn(
          colSpanStyles[colSpan],
          rowSpanStyles[rowSpan],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GridItem.displayName = 'GridItem'
