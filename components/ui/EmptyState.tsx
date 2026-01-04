'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './button';

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description: string;
  illustration?: 'search' | 'property' | 'message' | 'favorite' | 'group' | 'document';
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'colorful';
}

export default function EmptyState({
  icon: Icon,
  emoji,
  title,
  description,
  illustration,
  primaryAction,
  secondaryAction,
  children,
  size = 'md',
  variant = 'default',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      iconContainer: 'w-16 h-16 mb-4',
      icon: 'w-8 h-8',
      emoji: 'text-4xl',
      title: 'text-xl',
      description: 'text-sm',
    },
    md: {
      container: 'py-12',
      iconContainer: 'w-24 h-24 mb-6',
      icon: 'w-12 h-12',
      emoji: 'text-6xl',
      title: 'text-2xl',
      description: 'text-base',
    },
    lg: {
      container: 'py-16',
      iconContainer: 'w-32 h-32 mb-8',
      icon: 'w-16 h-16',
      emoji: 'text-8xl',
      title: 'text-3xl',
      description: 'text-lg',
    },
  };

  const sizes = sizeClasses[size];

  const illustrationSvgs = {
    search: (
      <svg className="w-full h-full opacity-20" viewBox="0 0 200 200" fill="none">
        <circle cx="70" cy="70" r="40" stroke="currentColor" strokeWidth="8" />
        <line x1="100" y1="100" x2="140" y2="140" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <circle cx="150" cy="80" r="8" fill="currentColor" opacity="0.5" />
        <circle cx="50" cy="150" r="6" fill="currentColor" opacity="0.3" />
      </svg>
    ),
    property: (
      <svg className="w-full h-full opacity-20" viewBox="0 0 200 200" fill="none">
        <path d="M40 100 L100 50 L160 100 V160 H40 V100Z" stroke="currentColor" strokeWidth="6" fill="none" />
        <rect x="80" y="120" width="40" height="40" fill="currentColor" opacity="0.3" />
        <rect x="60" y="80" width="20" height="20" fill="currentColor" opacity="0.3" />
        <rect x="120" y="80" width="20" height="20" fill="currentColor" opacity="0.3" />
      </svg>
    ),
    message: (
      <svg className="w-full h-full opacity-20" viewBox="0 0 200 200" fill="none">
        <rect x="40" y="60" width="120" height="80" rx="10" stroke="currentColor" strokeWidth="6" />
        <line x1="60" y1="80" x2="140" y2="80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <line x1="60" y1="100" x2="120" y2="100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <line x1="60" y1="120" x2="100" y2="120" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
    favorite: (
      <svg className="w-full h-full opacity-20" viewBox="0 0 200 200" fill="none">
        <path d="M100 160 L60 140 L40 100 L60 60 L100 40 L140 60 L160 100 L140 140 Z" stroke="currentColor" strokeWidth="6" fill="none" />
        <circle cx="100" cy="100" r="30" fill="currentColor" opacity="0.3" />
      </svg>
    ),
    group: (
      <svg className="w-full h-full opacity-20" viewBox="0 0 200 200" fill="none">
        <circle cx="70" cy="70" r="20" fill="currentColor" opacity="0.3" />
        <circle cx="130" cy="70" r="20" fill="currentColor" opacity="0.3" />
        <circle cx="100" cy="130" r="20" fill="currentColor" opacity="0.3" />
        <line x1="70" y1="90" x2="100" y2="110" stroke="currentColor" strokeWidth="4" opacity="0.5" />
        <line x1="130" y1="90" x2="100" y2="110" stroke="currentColor" strokeWidth="4" opacity="0.5" />
      </svg>
    ),
    document: (
      <svg className="w-full h-full opacity-20" viewBox="0 0 200 200" fill="none">
        <rect x="60" y="40" width="80" height="120" rx="8" stroke="currentColor" strokeWidth="6" />
        <line x1="80" y1="70" x2="120" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <line x1="80" y1="90" x2="120" y2="90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <line x1="80" y1="110" x2="110" y2="110" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-center ${sizes.container} px-4`}
    >
      {/* Illustration Background (if specified) */}
      {illustration && (
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 text-gray-300">
              {illustrationSvgs[illustration]}
            </div>
          </div>
          {/* Icon/Emoji on top of illustration */}
          <div className="relative z-10 pt-12">
            {emoji && !Icon && (
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className={sizes.emoji}
              >
                {emoji}
              </motion.div>
            )}
            {Icon && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`${sizes.iconContainer} mx-auto ${
                  variant === 'colorful'
                    ? 'bg-gradient-to-br from-[#9c5698]/10 via-[#FF5722]/10 to-[#FFB10B]/10'
                    : 'bg-gray-100'
                } rounded-full flex items-center justify-center`}
              >
                <Icon className={`${sizes.icon} ${variant === 'colorful' ? 'text-[#FF5722]' : 'text-gray-400'}`} />
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* No Illustration - Simple Icon/Emoji */}
      {!illustration && (
        <div className="mb-6">
          {emoji && !Icon && (
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className={sizes.emoji}
            >
              {emoji}
            </motion.div>
          )}
          {Icon && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`${sizes.iconContainer} mx-auto ${
                variant === 'colorful'
                  ? 'bg-gradient-to-br from-[#9c5698]/10 via-[#FF5722]/10 to-[#FFB10B]/10'
                  : 'bg-gray-100'
              } rounded-full flex items-center justify-center`}
            >
              <Icon className={`${sizes.icon} ${variant === 'colorful' ? 'text-[#FF5722]' : 'text-gray-400'}`} />
            </motion.div>
          )}
        </div>
      )}

      {/* Title */}
      <h3 className={`${sizes.title} font-bold text-gray-900 mb-3`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`${sizes.description} text-gray-600 mb-8 max-w-md mx-auto`}>
        {description}
      </p>

      {/* Custom Children */}
      {children}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          {primaryAction && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={primaryAction.onClick}
                className="bg-gradient-to-br from-[#9c5698] via-[#FF5722] to-[#FFB10B] hover:opacity-90 text-white font-semibold px-6 py-3 superellipse-xl shadow-lg hover:shadow-xl transition-all"
              >
                {primaryAction.icon && <primaryAction.icon className="w-5 h-5 mr-2" />}
                {primaryAction.label}
              </Button>
            </motion.div>
          )}
          {secondaryAction && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={secondaryAction.onClick}
                variant="outline"
                className="border-2 border-gray-300 hover:border-orange-300 hover:bg-orange-50 transition-all px-6 py-3 superellipse-xl"
              >
                {secondaryAction.label}
              </Button>
            </motion.div>
          )}
        </div>
      )}

      {/* Minimal Variant - Just Text Link */}
      {variant === 'minimal' && primaryAction && (
        <button
          onClick={primaryAction.onClick}
          className="text-orange-600 hover:text-orange-700 font-semibold text-sm underline"
        >
          {primaryAction.label}
        </button>
      )}
    </motion.div>
  );
}
