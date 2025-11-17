'use client';

/**
 * SkipLink Component
 *
 * Provides a keyboard-accessible link to skip navigation and jump to main content.
 * Essential for keyboard users and screen reader users.
 *
 * WCAG 2.1 Level A requirement: 2.4.1 Bypass Blocks
 */

interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

export default function SkipLink({
  targetId = 'main-content',
  label = 'Aller au contenu principal'
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-[9999]
        bg-orange-600 text-white
        px-6 py-3 rounded-lg
        font-semibold
        focus:outline-none focus:ring-4 focus:ring-orange-300
        transition-all
      "
      style={{
        // Custom sr-only that works with focus
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 9999,
      }}
    >
      {label}
    </a>
  );
}
