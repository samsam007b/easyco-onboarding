'use client';

import { motion } from 'framer-motion';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { searcherGradientVibrant, searcherAnimations } from '@/lib/constants/searcher-theme';
import { cn } from '@/lib/utils';

interface SearcherPageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  showSparkles?: boolean;
  breadcrumb?: {
    label: string;
    href: string;
  };
  currentPage?: string;
}

export function SearcherPageHeader({
  icon: Icon,
  title,
  subtitle,
  actions,
  showSparkles = true,
  breadcrumb,
  currentPage,
}: SearcherPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      {breadcrumb && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm"
        >
          <button
            onClick={() => router.push(breadcrumb.href)}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {breadcrumb.label}
          </button>
          {currentPage && (
            <>
              <span className="text-gray-300">/</span>
              <span className="font-medium" style={{ color: '#FFA040' }}>
                {currentPage}
              </span>
            </>
          )}
        </motion.div>
      )}

      {/* Header Content */}
      <motion.div
        {...searcherAnimations.fadeInUp}
        className="relative overflow-hidden bg-white/80 backdrop-blur-sm superellipse-3xl shadow-sm border border-gray-200 p-6 sm:p-8"
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
          style={{ background: searcherGradientVibrant }}
        />
        <div
          className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-5"
          style={{ background: searcherGradientVibrant }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Animated Icon */}
            <div className="relative">
              {/* Glow effect */}
              <div
                className="absolute inset-0 superellipse-2xl blur-xl animate-pulse"
                style={{ background: searcherGradientVibrant, opacity: 0.3 }}
              />
              {/* Icon container */}
              <motion.div
                whileHover={{ rotate: 3 }}
                className="relative w-14 h-14 sm:w-16 sm:h-16 superellipse-2xl flex items-center justify-center shadow-lg"
                style={{ background: searcherGradientVibrant }}
              >
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </motion.div>
              {/* Sparkle */}
              {showSparkles && (
                <motion.div
                  animate={{
                    y: [0, -2, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </motion.div>
              )}
            </div>

            {/* Text */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {title}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-3">{actions}</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
