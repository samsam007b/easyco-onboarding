'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  User,
  Search,
  Heart,
  MessageCircle,
  Home,
  Users,
  Sliders,
  UserCheck,
  Trophy,
  Rocket,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChecklistItem } from '@/lib/hooks/useGettingStarted';
import Link from 'next/link';

// Map icon names to components
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  Search,
  Heart,
  MessageCircle,
  Home,
  Users,
  Sliders,
  UserCheck,
};

interface GettingStartedChecklistProps {
  items: ChecklistItem[];
  completedCount: number;
  totalCount: number;
  progress: number;
  isAllComplete: boolean;
  onDismiss: () => void;
  onCompleteItem?: (itemId: string) => void;
  variant?: 'searcher' | 'resident';
}

// V2 Fun Design Colors
const GRADIENTS = {
  searcher: {
    primary: 'linear-gradient(135deg, #9c5698 0%, #9D7EE5 50%, #FFA040 100%)',
    bg: 'linear-gradient(135deg, #faf5ff 0%, #fef3c7 100%)',
    accent: '#9D7EE5',
    shadow: 'rgba(157, 126, 229, 0.25)',
  },
  resident: {
    primary: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)',
    bg: 'linear-gradient(135deg, #fff5f3 0%, #ffe8e0 100%)',
    accent: '#e05747',
    shadow: 'rgba(255, 101, 30, 0.25)',
  },
};

export default function GettingStartedChecklist({
  items,
  completedCount,
  totalCount,
  progress,
  isAllComplete,
  onDismiss,
  onCompleteItem,
  variant = 'searcher',
}: GettingStartedChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const colors = GRADIENTS[variant];

  // Completion celebration state
  if (isAllComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden superellipse-3xl p-8 text-center"
        style={{
          background: colors.bg,
          boxShadow: `0 20px 60px ${colors.shadow}`,
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -right-12 -top-12 w-40 h-40 rounded-full opacity-30"
          style={{ background: colors.primary }}
        />
        <div
          className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full opacity-20"
          style={{ background: colors.primary }}
        />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-5 superellipse-2xl flex items-center justify-center"
            style={{
              background: colors.primary,
              boxShadow: `0 12px 32px ${colors.shadow}`,
            }}
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black text-gray-900 mb-2"
          >
            Bravo, tu es prêt(e) !
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 leading-relaxed"
          >
            Tu as complété toutes les étapes de démarrage.
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden superellipse-3xl bg-white"
      style={{
        boxShadow: `0 20px 60px ${colors.shadow}`,
      }}
    >
      {/* Header with gradient */}
      <div
        className="relative overflow-hidden p-5 text-white cursor-pointer"
        style={{ background: colors.primary }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Decorative circles in header */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white/10" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 superellipse-xl bg-white/20 backdrop-blur flex items-center justify-center"
              >
                <Rocket className="w-6 h-6" />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">Bien démarrer</h3>
                <p className="text-sm opacity-90">
                  {completedCount}/{totalCount} étapes complétées
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
                className="p-2 hover:bg-white/20 superellipse-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
              <motion.div
                animate={{ rotate: isExpanded ? 0 : 180 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronUp className="w-6 h-6" />
              </motion.div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Items list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 space-y-2">
              {items.map((item, index) => {
                const IconComponent = ICONS[item.icon] || Circle;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={!item.isCompleted ? { scale: 1.01, x: 4 } : {}}
                    className={cn(
                      'relative overflow-hidden flex items-center gap-4 p-4 superellipse-2xl transition-all',
                      item.isCompleted
                        ? 'bg-gray-50'
                        : 'hover:bg-gray-50 cursor-pointer'
                    )}
                    onClick={() => !item.isCompleted && onCompleteItem?.(item.id)}
                  >
                    {/* Decorative circle for incomplete items */}
                    {!item.isCompleted && (
                      <div
                        className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-10"
                        style={{ background: colors.primary }}
                      />
                    )}

                    {/* Checkbox / Icon */}
                    <motion.div
                      whileHover={!item.isCompleted ? { rotate: 5 } : {}}
                      className={cn(
                        'relative z-10 w-10 h-10 superellipse-xl flex items-center justify-center transition-all flex-shrink-0',
                        item.isCompleted
                          ? 'text-white'
                          : 'text-gray-400'
                      )}
                      style={
                        item.isCompleted
                          ? { background: colors.primary }
                          : { background: colors.bg }
                      }
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <div style={{ color: colors.accent }}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                      )}
                    </motion.div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 min-w-0">
                      <p
                        className={cn(
                          'font-semibold',
                          item.isCompleted
                            ? 'text-gray-400 line-through'
                            : 'text-gray-900'
                        )}
                      >
                        {item.title}
                      </p>
                      {!item.isCompleted && (
                        <p className="text-sm text-gray-500 truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Action button */}
                    {!item.isCompleted && item.action && (
                      <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
                        {item.action.href ? (
                          <Link href={item.action.href}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                className="superellipse-xl h-9 px-4 text-sm font-semibold text-white border-none"
                                style={{
                                  background: colors.primary,
                                  boxShadow: `0 4px 12px ${colors.shadow}`,
                                }}
                              >
                                {item.action.label}
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </Button>
                            </motion.div>
                          </Link>
                        ) : (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              className="superellipse-xl h-9 px-4 text-sm font-semibold text-white border-none"
                              onClick={item.action.onClick}
                              style={{
                                background: colors.primary,
                                boxShadow: `0 4px 12px ${colors.shadow}`,
                              }}
                            >
                              {item.action.label}
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Motivation message */}
            <div className="px-4 pb-5">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative overflow-hidden p-4 superellipse-2xl text-center"
                style={{ background: colors.bg }}
              >
                {/* Decorative circle */}
                <div
                  className="absolute -right-6 -top-6 w-20 h-20 rounded-full opacity-20"
                  style={{ background: colors.primary }}
                />

                <div className="relative z-10 flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: colors.accent }} />
                  </motion.div>
                  <span className="text-gray-700 font-medium">
                    Plus que{' '}
                    <span className="font-bold" style={{ color: colors.accent }}>
                      {totalCount - completedCount}
                    </span>{' '}
                    étape{totalCount - completedCount > 1 ? 's' : ''} !
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
