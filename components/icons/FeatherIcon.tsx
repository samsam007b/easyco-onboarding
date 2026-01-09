/**
 * FeatherIcon Component
 *
 * Wrapper pour Feather Icons avec intégration du système de rôles Izzico
 * Utilise les couleurs et tailles du design system
 */

import React from 'react';
import { Icon as FeatherIconType } from 'react-feather';
import {
  FeatherIconProps,
  getIconSize,
  getIconClasses,
  defaultStrokeWidth,
} from '@/lib/icons/feather-config';

export default function FeatherIcon({
  icon: Icon,
  size = 'md',
  role = 'neutral',
  className,
  strokeWidth = defaultStrokeWidth,
  'aria-label': ariaLabel,
  ...props
}: FeatherIconProps & React.SVGProps<SVGSVGElement>) {
  const sizeInPixels = getIconSize(size);
  const iconClasses = getIconClasses(role, typeof size === 'string' ? size : undefined, className);

  return (
    <Icon
      size={sizeInPixels}
      strokeWidth={strokeWidth}
      className={iconClasses}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : 'presentation'}
      {...props}
    />
  );
}
