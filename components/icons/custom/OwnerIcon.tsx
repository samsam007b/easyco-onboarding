/**
 * Custom Owner Role Icon - Izzico Design System
 *
 * House with rounded squircle aesthetic
 * Uses Owner role color (#9c5698) or gradient
 */

import React from 'react';

export interface OwnerIconProps {
  size?: number;
  color?: string;
  useGradient?: boolean;
  className?: string;
  strokeWidth?: number;
}

export default function OwnerIcon({
  size = 24,
  color = '#9c5698',
  useGradient = false,
  className = '',
  strokeWidth = 2.5,
}: OwnerIconProps) {
  const gradientId = `owner-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-label="Owner"
      role="img"
    >
      {useGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9c5698" />
            <stop offset="50%" stopColor="#c85570" />
            <stop offset="100%" stopColor="#d15659" />
          </linearGradient>
        </defs>
      )}

      {/* House base with rounded corners */}
      <path
        d="M4 10L12 3L20 10V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V10Z"
        stroke={useGradient ? `url(#${gradientId})` : color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Door with rounded top (squircle style) */}
      <path
        d="M9 21V13C9 12.4477 9.44772 12 10 12H14C14.5523 12 15 12.4477 15 13V21"
        stroke={useGradient ? `url(#${gradientId})` : color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Rounded detail (doorknob) */}
      <circle
        cx="13"
        cy="17"
        r="0.5"
        fill={useGradient ? `url(#${gradientId})` : color}
      />
    </svg>
  );
}
