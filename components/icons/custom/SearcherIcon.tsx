/**
 * Custom Searcher Role Icon - Izzico Design System
 *
 * Magnifying glass with rounded squircle aesthetic
 * Uses Searcher role color (#ffa000) or gradient
 */

import React from 'react';

export interface SearcherIconProps {
  size?: number;
  color?: string;
  useGradient?: boolean;
  className?: string;
  strokeWidth?: number;
}

export default function SearcherIcon({
  size = 24,
  color = '#ffa000',
  useGradient = false,
  className = '',
  strokeWidth = 2.5,
}: SearcherIconProps) {
  const gradientId = `searcher-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-label="Searcher"
      role="img"
    >
      {useGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffa000" />
            <stop offset="50%" stopColor="#ffb933" />
            <stop offset="100%" stopColor="#ffd966" />
          </linearGradient>
        </defs>
      )}

      {/* Magnifying glass with rounded squircle style */}
      <circle
        cx="10"
        cy="10"
        r="6"
        stroke={useGradient ? `url(#${gradientId})` : color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Handle with rounded end (squircle style) */}
      <path
        d="M14.5 14.5L19.5 19.5"
        stroke={useGradient ? `url(#${gradientId})` : color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Rounded cap at handle end */}
      <circle
        cx="19.5"
        cy="19.5"
        r={strokeWidth / 2}
        fill={useGradient ? `url(#${gradientId})` : color}
      />
    </svg>
  );
}
