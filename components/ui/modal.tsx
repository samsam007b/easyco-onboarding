'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/use-language'

export interface ModalProps {
  /**
   * Modal open state
   */
  open: boolean

  /**
   * On close callback
   */
  onClose: () => void

  /**
   * Modal title
   */
  title?: string

  /**
   * Modal description
   */
  description?: string

  /**
   * Modal size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'

  /**
   * Show close button
   */
  showClose?: boolean

  /**
   * Close on overlay click
   */
  closeOnOverlayClick?: boolean

  /**
   * Close on escape key
   */
  closeOnEscape?: boolean

  /**
   * Modal content
   */
  children: React.ReactNode

  /**
   * Footer content
   */
  footer?: React.ReactNode

  /**
   * Custom className for modal content
   */
  className?: string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  showClose = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  footer,
  className,
}: ModalProps) {
  const { language, getSection } = useLanguage()
  const ariaLabels = getSection('ariaLabels')

  // Handle escape key
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!closeOnEscape || !open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, closeOnEscape, onClose])

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        className={cn(
          'relative w-full bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200',
          sizeStyles[size]
        )}
      >
        {/* Header */}
        {(title || description || showClose) && (
          <div className="flex items-start justify-between p-6 border-b border-gray-100">
            <div className="flex-1">
              {title && (
                <h2
                  id="modal-title"
                  className="text-2xl font-bold text-gray-900 mb-1"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="text-sm text-gray-600"
                >
                  {description}
                </p>
              )}
            </div>

            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                aria-label={ariaLabels?.closeModal?.[language] || 'Close modal'}
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn('p-6', className)}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

Modal.displayName = 'Modal'
