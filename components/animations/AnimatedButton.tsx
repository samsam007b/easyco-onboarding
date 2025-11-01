'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: 'scale' | 'lift' | 'glow' | 'ripple';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function AnimatedButton({
  children,
  variant = 'scale',
  className = '',
  onClick,
  disabled,
  type = 'button',
}: AnimatedButtonProps) {
  const getAnimationProps = () => {
    switch (variant) {
      case 'scale':
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
        };
      case 'lift':
        return {
          whileHover: { y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.15)' },
          whileTap: { y: 0 },
          transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
        };
      case 'glow':
        return {
          whileHover: {
            boxShadow: '0 0 20px rgba(74, 20, 140, 0.5)',
            scale: 1.02,
          },
          whileTap: { scale: 0.98 },
          transition: { duration: 0.2 },
        };
      case 'ripple':
        return {
          whileTap: { scale: 0.95 },
          transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
        };
      default:
        return {};
    }
  };

  return (
    <motion.button
      {...getAnimationProps()}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn('transition-colors', className)}
    >
      {children}
    </motion.button>
  );
}
