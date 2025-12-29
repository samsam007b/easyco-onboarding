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

const GRADIENTS = {
  searcher: {
    primary: 'linear-gradient(135deg, #9c5698 0%, #9D7EE5 50%, #FFA040 100%)',
    bg: 'from-purple-500 via-purple-600 to-orange-500',
    light: 'from-purple-50 to-orange-50',
    accent: '#9D7EE5',
  },
  resident: {
    primary: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
    bg: 'from-red-500 via-orange-500 to-orange-400',
    light: 'from-orange-50 to-amber-50',
    accent: '#ff5b21',
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

  // Don't render if all complete and dismissed
  if (isAllComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'rounded-2xl p-6 text-center bg-gradient-to-br',
          colors.light,
          'border border-gray-100'
        )}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ background: colors.primary }}
        >
          <Trophy className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Bravo, tu es prêt(e) ! 🎉
        </h3>
        <p className="text-sm text-gray-600">
          Tu as complété toutes les étapes de démarrage.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-4 text-white cursor-pointer"
        style={{ background: colors.primary }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Bien démarrer</h3>
              <p className="text-xs opacity-90">
                {completedCount}/{totalCount} étapes complétées
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Items list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 space-y-1">
              {items.map((item, index) => {
                const IconComponent = ICONS[item.icon] || Circle;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl transition-all',
                      item.isCompleted
                        ? 'bg-gray-50'
                        : 'hover:bg-gray-50 cursor-pointer'
                    )}
                    onClick={() => !item.isCompleted && onCompleteItem?.(item.id)}
                  >
                    {/* Checkbox */}
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0',
                        item.isCompleted
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-400'
                      )}
                      style={item.isCompleted ? { background: colors.primary } : {}}
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <IconComponent className="w-4 h-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          item.isCompleted
                            ? 'text-gray-400 line-through'
                            : 'text-gray-900'
                        )}
                      >
                        {item.title}
                      </p>
                      {!item.isCompleted && (
                        <p className="text-xs text-gray-500 truncate">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Action button */}
                    {!item.isCompleted && item.action && (
                      <div onClick={(e) => e.stopPropagation()}>
                        {item.action.href ? (
                          <Link href={item.action.href}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs rounded-full h-7 px-3"
                              style={{ borderColor: colors.accent, color: colors.accent }}
                            >
                              {item.action.label}
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs rounded-full h-7 px-3"
                            onClick={item.action.onClick}
                            style={{ borderColor: colors.accent, color: colors.accent }}
                          >
                            {item.action.label}
                          </Button>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Motivation message */}
            <div className="px-4 pb-4">
              <div className={cn('p-3 rounded-xl bg-gradient-to-r text-center', colors.light)}>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
                  <span className="text-gray-600">
                    Plus que <strong style={{ color: colors.accent }}>{totalCount - completedCount}</strong> étape{totalCount - completedCount > 1 ? 's' : ''} !
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
