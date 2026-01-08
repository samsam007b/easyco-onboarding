'use client';

import { Icon as FeatherIcon } from 'react-feather';
import { LucideIcon } from 'lucide-react';

interface IconBadgeProps {
  icon: FeatherIcon | LucideIcon;
  variant?:
    | 'purple'
    | 'blue'
    | 'green'
    | 'yellow'
    | 'orange'
    | 'red'
    | 'pink'
    | 'teal'
    | 'indigo'
    | 'cyan'
    | 'owner'
    | 'resident'
    | 'searcher';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const variantStyles = {
  // Role-based variants (Izzico brand colors - use these for role-specific UI)
  owner: {
    background: 'bg-owner-100',
    icon: 'text-owner-600',
  },
  resident: {
    background: 'bg-resident-100',
    icon: 'text-resident-600',
  },
  searcher: {
    background: 'bg-searcher-100',
    icon: 'text-searcher-600',
  },
  // Categorical/semantic color variants (for non-role contexts like relationship types, status indicators, etc.)
  purple: {
    background: 'bg-purple-100',
    icon: 'text-purple-600',
  },
  blue: {
    background: 'bg-blue-100',
    icon: 'text-blue-600',
  },
  green: {
    background: 'bg-green-100',
    icon: 'text-green-600',
  },
  yellow: {
    background: 'bg-yellow-100',
    icon: 'text-yellow-600',
  },
  orange: {
    background: 'bg-orange-100',
    icon: 'text-orange-600',
  },
  red: {
    background: 'bg-red-100',
    icon: 'text-red-600',
  },
  pink: {
    background: 'bg-pink-100',
    icon: 'text-pink-600',
  },
  teal: {
    background: 'bg-teal-100',
    icon: 'text-teal-600',
  },
  indigo: {
    background: 'bg-indigo-100',
    icon: 'text-indigo-600',
  },
  cyan: {
    background: 'bg-cyan-100',
    icon: 'text-cyan-600',
  },
};

const sizeStyles = {
  sm: {
    container: 'w-8 h-8',
    icon: 'w-4 h-4',
  },
  md: {
    container: 'w-10 h-10',
    icon: 'w-5 h-5',
  },
  lg: {
    container: 'w-12 h-12',
    icon: 'w-6 h-6',
  },
  xl: {
    container: 'w-16 h-16',
    icon: 'w-8 h-8',
  },
};

export default function IconBadge({
  icon: Icon,
  variant = 'blue',
  size = 'md',
  className = '',
}: IconBadgeProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <div
      className={`${sizeStyle.container} ${variantStyle.background} rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
    >
      <Icon className={`${sizeStyle.icon} ${variantStyle.icon}`} />
    </div>
  );
}
