'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animations = {
    pulse: {
      animate: {
        opacity: [0.5, 1, 0.5],
      },
      transition: {
        duration: 1.5,
        repeat: Infinity as number,
        ease: 'easeInOut' as const,
      },
    },
    wave: {
      animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
      },
      transition: {
        duration: 2,
        repeat: Infinity as number,
        ease: 'linear' as const,
      },
    },
    none: {
      animate: undefined,
      transition: undefined,
    },
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || undefined,
    ...(animation === 'wave' && {
      backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
      backgroundSize: '200% 100%',
    }),
  };

  const currentAnimation = animations[animation];

  return (
    <motion.div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      animate={currentAnimation.animate}
      transition={currentAnimation.transition}
    />
  );
}

// Composants de skeleton spécialisés
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={cn('p-4 border rounded-lg space-y-4', className)}>
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
      <div className="flex gap-2">
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={80} />
      </div>
    </div>
  );
}

export function SkeletonAvatar({ size = 40, className = '' }: { size?: number; className?: string }) {
  return <Skeleton variant="circular" width={size} height={size} className={className} />;
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
}
