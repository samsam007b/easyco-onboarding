/**
 * Custom Flag Icon - Izzico Design System
 *
 * Minimalist language/country indicator with rounded squircle aesthetic
 * Displays 2-letter country code instead of emoji flags
 * Follows brand guidelines: no emojis, clean design
 */

import React from 'react';

export type CountryCode = 'FR' | 'GB' | 'NL' | 'DE' | 'ES';

export interface FlagIconProps {
  country: CountryCode;
  size?: number;
  className?: string;
}

// Country metadata
const COUNTRY_DATA: Record<
  CountryCode,
  { code: string; bgColor: string; textColor: string }
> = {
  FR: { code: 'FR', bgColor: '#0055A4', textColor: '#FFFFFF' }, // France blue
  GB: { code: 'GB', bgColor: '#C8102E', textColor: '#FFFFFF' }, // UK red
  NL: { code: 'NL', bgColor: '#FF4F00', textColor: '#FFFFFF' }, // Netherlands orange
  DE: { code: 'DE', bgColor: '#000000', textColor: '#FFD700' }, // Germany black/gold
  ES: { code: 'ES', bgColor: '#C60B1E', textColor: '#FFC400' }, // Spain red/yellow
};

export default function FlagIcon({
  country,
  size = 24,
  className = '',
}: FlagIconProps) {
  const data = COUNTRY_DATA[country];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-label={`${data.code} flag`}
      role="img"
    >
      {/* Rounded squircle background */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        ry="6"
        fill={data.bgColor}
      />

      {/* Country code text */}
      <text
        x="12"
        y="14.5"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="8"
        fontWeight="700"
        fill={data.textColor}
        letterSpacing="0.5"
      >
        {data.code}
      </text>
    </svg>
  );
}
