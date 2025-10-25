import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export interface PageHeaderProps {
  /**
   * Page title
   */
  title: string

  /**
   * Page description/subtitle
   */
  description?: string

  /**
   * Back button configuration
   */
  back?: {
    href: string
    label?: string
  }

  /**
   * Actions to display on the right (buttons, etc.)
   */
  actions?: React.ReactNode

  /**
   * Breadcrumbs
   */
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>

  /**
   * Custom className
   */
  className?: string
}

export function PageHeader({
  title,
  description,
  back,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 pb-6 border-b border-gray-100', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-gray-400">/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-[#4A148C] transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Back button */}
      {back && (
        <Link
          href={back.href}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#4A148C] transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{back.label || 'Back'}</span>
        </Link>
      )}

      {/* Title and actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#4A148C] mb-2">{title}</h1>
          {description && (
            <p className="text-gray-600 text-lg">{description}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

PageHeader.displayName = 'PageHeader'
