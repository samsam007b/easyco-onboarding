/**
 * Custom Star Icon - Izzico Design System
 *
 * Rating/favorite star with rounded squircle aesthetic
 * Can use role colors or signature gradient
 */

import React from 'react';

export interface StarIconProps {
  size?: number;
  color?: string;
  useGradient?: boolean;
  filled?: boolean;
  className?: string;
  strokeWidth?: number;
}

export default function StarIcon({
  size = 24,
  color = '#ffa000',
  useGradient = false,
  filled = false,
  className = '',
  strokeWidth = 2,
}: StarIconProps) {
  const gradientId = `star-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? (useGradient ? `url(#${gradientId})` : color) : 'none'}
      className={className}
      aria-label="Star"
      role="img"
    >
      {useGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9c5698" />
            <stop offset="35%" stopColor="#d15659" />
            <stop offset="50%" stopColor="#e05747" />
            <stop offset="75%" stopColor="#ff7c10" />
            <stop offset="100%" stopColor="#ffa000" />
          </linearGradient>
        </defs>
      )}

      {/* Star with rounded points (friendly, Izzico style) */}
      <path
        d="M12 2L14.5 8.5L21 9.5L16.5 14.5L17.5 21L12 17.5L6.5 21L7.5 14.5L3 9.5L9.5 8.5L12 2Z"
        stroke={useGradient ? `url(#${gradientId})` : color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
