'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Clock,
  Home,
  TrendingDown,
  ArrowRight,
  CheckCircle,
  Bell,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ownerGradient, semanticColors } from '@/lib/constants/owner-theme';

export type FinanceAlertType = 'overdue' | 'upcoming_due' | 'collection_low' | 'vacant_property';
export type FinanceAlertSeverity = 'critical' | 'warning' | 'info';

export interface FinanceAlertData {
  id: string;
  type: FinanceAlertType;
  severity: FinanceAlertSeverity;
  title: string;
  description: string;
  amount?: number;
  propertyId?: string;
  propertyTitle?: string;
  href: string;
  createdAt: string;
}

interface FinanceAlertsProps {
  alerts: FinanceAlertData[];
  onAlertClick?: (alert: FinanceAlertData) => void;
  onDismiss?: (alertId: string) => void;
  maxVisible?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

const alertTypeConfig = {
  overdue: {
    icon: AlertCircle,
    label: 'Paiement en retard',
  },
  upcoming_due: {
    icon: Clock,
    label: 'Echeance proche',
  },
  collection_low: {
    icon: TrendingDown,
    label: 'Taux bas',
  },
  vacant_property: {
    icon: Home,
    label: 'Bien vacant',
  },
};

const severityConfig = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200 hover:border-red-300',
    textTitle: 'text-red-800',
    textDesc: 'text-red-600',
    iconBg: semanticColors.danger.gradient,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200 hover:border-amber-300',
    textTitle: 'text-amber-800',
    textDesc: 'text-amber-600',
    iconBg: semanticColors.warning.gradient,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200 hover:border-blue-300',
    textTitle: 'text-blue-800',
    textDesc: 'text-blue-600',
    iconBg: semanticColors.info.gradient,
  },
};

export function FinanceAlerts({
  alerts,
  onAlertClick,
  onDismiss,
  maxVisible = 5,
  showViewAll = true,
  onViewAll,
  className,
}: FinanceAlertsProps) {
  const visibleAlerts = alerts.slice(0, maxVisible);
  const hasMoreAlerts = alerts.length > maxVisible;

  // Sort by severity (critical first)
  const sortedAlerts = [...visibleAlerts].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  if (alerts.length === 0) {
    return (
      <div className={cn('bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm p-6', className)}>
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-sm"
            style={{ background: semanticColors.success.gradient }}
          >
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Alertes financieres</h3>
            <p className="text-sm text-gray-500">Notifications importantes</p>
          </div>
        </div>

        <div className="text-center py-8">
          <div
            className="w-16 h-16 mx-auto superellipse-2xl flex items-center justify-center mb-4"
            style={{ background: semanticColors.success.gradient }}
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">Aucune alerte</p>
          <p className="text-sm text-gray-500 mt-1">Vos finances sont en ordre !</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-sm"
            style={{ background: ownerGradient }}
          >
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Alertes financieres</h3>
            <p className="text-sm text-gray-500">{alerts.length} notification{alerts.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        {showViewAll && hasMoreAlerts && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-sm"
            style={{ color: '#9c5698' }}
          >
            Voir tout ({alerts.length})
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedAlerts.map((alert, index) => {
            const typeConfig = alertTypeConfig[alert.type];
            const sevConfig = severityConfig[alert.severity];
            const AlertIcon = typeConfig.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'relative flex items-center gap-4 p-4 superellipse-xl border cursor-pointer transition-all',
                  'hover:shadow-md',
                  sevConfig.bg,
                  sevConfig.border
                )}
                onClick={() => onAlertClick?.(alert)}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 superellipse-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: sevConfig.iconBg }}
                >
                  <AlertIcon className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn('font-semibold truncate', sevConfig.textTitle)}>
                    {alert.title}
                  </p>
                  <p className={cn('text-sm truncate', sevConfig.textDesc)}>
                    {alert.description}
                  </p>
                </div>

                {/* Amount badge */}
                {alert.amount && (
                  <span
                    className={cn(
                      'text-sm font-bold flex-shrink-0 px-2 py-1 superellipse-lg',
                      alert.severity === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : alert.severity === 'warning'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {alert.amount.toLocaleString()}e
                  </span>
                )}

                {/* Dismiss button */}
                {onDismiss && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss(alert.id);
                    }}
                    className={cn(
                      'p-1.5 rounded-full transition-colors flex-shrink-0',
                      alert.severity === 'critical'
                        ? 'hover:bg-red-200 text-red-400 hover:text-red-600'
                        : alert.severity === 'warning'
                        ? 'hover:bg-amber-200 text-amber-400 hover:text-amber-600'
                        : 'hover:bg-blue-200 text-blue-400 hover:text-blue-600'
                    )}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Arrow */}
                <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Summary footer */}
      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {alerts.filter((a) => a.severity === 'critical').length > 0 && (
              <span className="flex items-center gap-1 text-red-600">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {alerts.filter((a) => a.severity === 'critical').length} critique{alerts.filter((a) => a.severity === 'critical').length > 1 ? 's' : ''}
              </span>
            )}
            {alerts.filter((a) => a.severity === 'warning').length > 0 && (
              <span className="flex items-center gap-1 text-amber-600">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {alerts.filter((a) => a.severity === 'warning').length} attention
              </span>
            )}
            {alerts.filter((a) => a.severity === 'info').length > 0 && (
              <span className="flex items-center gap-1 text-blue-600">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {alerts.filter((a) => a.severity === 'info').length} info
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
