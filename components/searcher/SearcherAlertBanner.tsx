'use client';

import { motion } from 'framer-motion';
import { LucideIcon, ChevronRight, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { searcherGradientVibrant, semanticColors, searcherAnimations } from '@/lib/constants/searcher-theme';

type AlertSeverity = 'info' | 'warning' | 'critical' | 'success';

interface SearcherAlertBannerProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  severity?: AlertSeverity;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const severityStyles: Record<AlertSeverity, {
  gradient: string;
  bgGradient: string;
  textColor: string;
  borderColor: string;
  defaultIcon: LucideIcon;
}> = {
  info: {
    gradient: semanticColors.info.gradient,
    bgGradient: semanticColors.info.light,
    textColor: semanticColors.info.text,
    borderColor: semanticColors.info.border,
    defaultIcon: Info,
  },
  warning: {
    gradient: searcherGradientVibrant,
    bgGradient: 'linear-gradient(135deg, #FFF9E6 0%, #FFF5DC 100%)',
    textColor: '#C67A30',
    borderColor: '#FFD49A',
    defaultIcon: AlertTriangle,
  },
  critical: {
    gradient: semanticColors.danger.gradient,
    bgGradient: semanticColors.danger.light,
    textColor: semanticColors.danger.text,
    borderColor: semanticColors.danger.border,
    defaultIcon: AlertTriangle,
  },
  success: {
    gradient: semanticColors.success.gradient,
    bgGradient: semanticColors.success.light,
    textColor: semanticColors.success.text,
    borderColor: semanticColors.success.border,
    defaultIcon: CheckCircle,
  },
};

export function SearcherAlertBanner({
  title,
  description,
  icon,
  severity = 'info',
  href,
  onClick,
  className,
}: SearcherAlertBannerProps) {
  const router = useRouter();
  const styles = severityStyles[severity];
  const Icon = icon || styles.defaultIcon;
  const isClickable = !!href || !!onClick;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <motion.div
      {...searcherAnimations.fadeInUp}
      whileHover={isClickable ? { scale: 1.01 } : undefined}
      whileTap={isClickable ? { scale: 0.99 } : undefined}
      onClick={isClickable ? handleClick : undefined}
      className={cn(
        'relative overflow-hidden superellipse-2xl p-4 border',
        isClickable && 'cursor-pointer',
        className
      )}
      style={{
        background: styles.bgGradient,
        borderColor: styles.borderColor,
      }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className="w-10 h-10 superellipse-xl flex items-center justify-center flex-shrink-0"
          style={{ background: styles.gradient }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 truncate">{description}</p>
        </div>

        {/* Chevron for clickable */}
        {isClickable && (
          <ChevronRight
            className="w-5 h-5 flex-shrink-0"
            style={{ color: styles.textColor }}
          />
        )}
      </div>
    </motion.div>
  );
}

// Container for multiple alerts
interface SearcherAlertStackProps {
  children: React.ReactNode;
  className?: string;
}

export function SearcherAlertStack({ children, className }: SearcherAlertStackProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {children}
    </div>
  );
}
