/**
 * Custom Resident Role Icon - Izzico Design System
 *
 * Key with rounded squircle aesthetic
 * Uses Resident role color (#e05747) or gradient
 */

import React from 'react';

export interface ResidentIconProps {
  size?: number;
  color?: string;
  useGradient?: boolean;
  className?: string;
  strokeWidth?: number;
}

export default function ResidentIcon({
  size = 24,
  color = '#e05747',
  useGradient = false,
  className = '',
  strokeWidth = 2.5,
}: ResidentIconProps) {
  const gradientId = `resident-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-label="Resident"
      role="img"
    >
      {useGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e05747" />
            <stop offset="50%" stopColor="#ff7c10" />
            <stop offset="100%" stopColor="#ffa000" />
          </linearGradient>
        </defs>
      )}

      {/* Key head - rounded squircle */}
      <circle
        cx="8"
        cy="8"
        r="4"
        stroke={useGradient ? `url(#${gradientId})` : color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner circle detail */}
      <circle
        cx="8"
        cy="8"
        r="1.5"
        stroke={useGradient ? `url(#${gradientId})` : color}
        strokeWidth={strokeWidth / 2}
      />

      {/* Key shaft with rounded end */}
      <path
        d="M11 11L19 19"
        stroke={useGradient ? `url(#${gradientId})` : color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Key teeth (notches) with rounded style */}
      <path
        d="M15 15V17"
        stroke={useGradient ? `url(#${gradientId})` : color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      <path
        d="M17 17V19"
        stroke={useGradient ? `url(#${gradientId})` : color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Rounded cap at shaft end */}
      <circle
        cx="19"
        cy="19"
        r={strokeWidth / 2}
        fill={useGradient ? `url(#${gradientId})` : color}
      />
    </svg>
  );
}
