'use client';

import { motion } from 'framer-motion';

interface EnhancedSkeletonProps {
  variant?: 'card' | 'list' | 'dashboard' | 'header';
  count?: number;
}

export default function EnhancedSkeleton({ variant = 'card', count = 1 }: EnhancedSkeletonProps) {
  const shimmer = {
    hidden: { x: '-100%' },
    visible: {
      x: '100%',
      transition: {
        repeat: Infinity as number,
        duration: 1.5,
        ease: 'linear' as const,
      },
    },
  };

  if (variant === 'dashboard') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile completion skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-white superellipse-2xl border border-gray-200"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
            <div className="w-24 h-9 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-2 bg-gray-200 rounded-full w-full animate-pulse" />
        </motion.div>

        {/* Overview section skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[32px] bg-gradient-to-br from-purple-50 via-orange-50 to-yellow-50 p-8 md:p-12 relative overflow-hidden"
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{ width: '50%' }}
            />
          </div>

          <div className="relative z-10">
            {/* Central icon skeleton */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-white superellipse-3xl shadow-2xl animate-pulse" />
            </div>

            {/* KPI cards skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm superellipse-2xl p-4">
                  <div className="w-10 h-10 bg-gray-200 superellipse-xl mb-3 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse" />
                  <div className="h-7 bg-gray-200 rounded w-12 animate-pulse" />
                </div>
              ))}
            </div>

            {/* CTA buttons skeleton */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="h-12 bg-white/50 backdrop-blur-sm rounded-full w-full sm:w-64 animate-pulse" />
              <div className="h-12 bg-white/50 backdrop-blur-sm rounded-full w-full sm:w-64 animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Search hero skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[32px] bg-white p-6 shadow-xl relative overflow-hidden"
        >
          <motion.div
            variants={shimmer}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{ width: '50%' }}
          />
          <div className="relative z-10 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 superellipse-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-3xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo skeleton */}
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />

            {/* Nav items skeleton */}
            <div className="hidden lg:flex items-center gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-24 h-10 bg-gray-200 superellipse-xl animate-pulse" />
              ))}
            </div>

            {/* Right actions skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white superellipse-xl p-4 shadow-sm relative overflow-hidden"
          >
            <motion.div
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{ width: '50%' }}
            />
            <div className="relative z-10 flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Default: card variant
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white superellipse-2xl shadow-lg overflow-hidden relative"
        >
          {/* Shimmer effect overlay */}
          <motion.div
            variants={shimmer}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-10 pointer-events-none"
            style={{ width: '50%' }}
          />

          <div className="relative">
            {/* Image skeleton */}
            <div className="h-48 sm:h-56 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />

            {/* Content skeleton */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>

              {/* Details */}
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded-full w-24 animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
