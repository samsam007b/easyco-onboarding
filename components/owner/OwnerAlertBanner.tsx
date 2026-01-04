'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, AlertTriangle, Info, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { semanticColors } from '@/lib/constants/owner-theme';

type Severity = 'critical' | 'warning' | 'info' | 'success';

interface OwnerAlertBannerProps {
  severity: Severity;
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  show?: boolean;
  className?: string;
}

const severityConfig: Record<Severity, {
  gradient: string;
  bg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  buttonBorder: string;
  buttonHover: string;
  defaultIcon: LucideIcon;
}> = {
  critical: {
    gradient: semanticColors.danger.gradient,
    bg: 'bg-gradient-to-r from-red-50 to-rose-50',
    border: 'border-red-200',
    textPrimary: 'text-red-800',
    textSecondary: 'text-red-600',
    buttonBorder: 'border-red-300',
    buttonHover: 'hover:bg-red-100',
    defaultIcon: AlertTriangle,
  },
  warning: {
    gradient: semanticColors.warning.gradient,
    bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    textPrimary: 'text-amber-800',
    textSecondary: 'text-amber-600',
    buttonBorder: 'border-amber-300',
    buttonHover: 'hover:bg-amber-100',
    defaultIcon: AlertTriangle,
  },
  info: {
    gradient: semanticColors.info.gradient,
    bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    textPrimary: 'text-blue-800',
    textSecondary: 'text-blue-600',
    buttonBorder: 'border-blue-300',
    buttonHover: 'hover:bg-blue-100',
    defaultIcon: Info,
  },
  success: {
    gradient: semanticColors.success.gradient,
    bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
    border: 'border-emerald-200',
    textPrimary: 'text-emerald-800',
    textSecondary: 'text-emerald-600',
    buttonBorder: 'border-emerald-300',
    buttonHover: 'hover:bg-emerald-100',
    defaultIcon: CheckCircle,
  },
};

export function OwnerAlertBanner({
  severity,
  title,
  description,
  icon,
  action,
  onDismiss,
  show = true,
  className,
}: OwnerAlertBannerProps) {
  const config = severityConfig[severity];
  const IconComponent = icon || config.defaultIcon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={className}
        >
          <div
            className={cn(
              'relative overflow-hidden superellipse-2xl p-4 border-2',
              config.bg,
              config.border
            )}
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className="w-12 h-12 superellipse-xl flex items-center justify-center flex-shrink-0"
                style={{ background: config.gradient }}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={cn('font-bold', config.textPrimary)}>
                  {title}
                </h3>
                <p className={cn('text-sm', config.textSecondary)}>
                  {description}
                </p>
              </div>

              {/* Action */}
              {action && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={action.onClick}
                  className={cn(
                    'rounded-full border-2 font-medium flex-shrink-0',
                    config.buttonBorder,
                    config.textPrimary,
                    config.buttonHover
                  )}
                >
                  {action.label}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Multiple alerts container
interface UrgentAction {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
}

interface OwnerUrgentActionsProps {
  actions: UrgentAction[];
  maxVisible?: number;
  onViewAll?: () => void;
  className?: string;
}

export function OwnerUrgentActions({
  actions,
  maxVisible = 3,
  onViewAll,
  className,
}: OwnerUrgentActionsProps) {
  const visibleActions = actions.slice(0, maxVisible);
  const hasMore = actions.length > maxVisible;

  if (actions.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      {visibleActions.map((action, index) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <OwnerAlertBanner
            severity={action.severity}
            title={action.title}
            description={action.description}
            icon={action.icon}
            action={
              action.onClick || action.href
                ? {
                    label: 'Traiter',
                    onClick: action.onClick || (() => {}),
                  }
                : undefined
            }
          />
        </motion.div>
      ))}

      {hasMore && onViewAll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="w-full text-gray-500 hover:text-gray-700"
          >
            Voir toutes les actions ({actions.length - maxVisible} de plus)
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
