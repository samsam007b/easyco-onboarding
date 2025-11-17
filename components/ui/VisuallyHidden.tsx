/**
 * VisuallyHidden Component
 *
 * Hides content visually but keeps it accessible to screen readers.
 * Essential for accessibility - provides context for icon-only buttons,
 * skip links, and other assistive technology needs.
 *
 * Usage:
 * <button>
 *   <Icon />
 *   <VisuallyHidden>Close modal</VisuallyHidden>
 * </button>
 */

import React, { ReactNode } from 'react';

interface VisuallyHiddenProps {
  children: ReactNode;
  as?: React.ElementType;
}

export default function VisuallyHidden({
  children,
  as: Component = 'span'
}: VisuallyHiddenProps) {
  return (
    <Component
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </Component>
  );
}
