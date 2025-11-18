import { useEffect, useRef } from 'react';

/**
 * useFocusTrap Hook
 *
 * Traps keyboard focus within a container (e.g., modal, dialog)
 * Essential for accessibility - prevents keyboard users from tabbing outside
 * the modal while it's open.
 *
 * WCAG 2.1 Level A requirement: 2.1.2 No Keyboard Trap
 *
 * Usage:
 * const modalRef = useFocusTrap(isOpen);
 * <div ref={modalRef}>...</div>
 */

export function useFocusTrap(isActive: boolean) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first element on mount
    firstFocusable?.focus();

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab: going backwards
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        // Tab: going forwards
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    }

    element.addEventListener('keydown', handleTabKey);

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return ref;
}
