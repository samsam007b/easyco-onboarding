'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Heart,
  Minus,
  Users,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { healthColors } from '@/lib/constants/owner-theme';

interface TenantHealth {
  id: string;
  name: string;
  score: number; // 0-100
  paymentHistory: 'excellent' | 'good' | 'warning' | 'critical';
  communicationScore: number; // 0-100
  leaseCompliance: boolean;
  hasOpenIssues: boolean;
}

interface TenantHealthDashboardProps {
  tenants: TenantHealth[];
  className?: string;
}

export function TenantHealthDashboard({ tenants, className }: TenantHealthDashboardProps) {
  // Categorize tenants by health
  const excellent = tenants.filter(t => t.score >= 80);
  const attention = tenants.filter(t => t.score >= 50 && t.score < 80);
  const critical = tenants.filter(t => t.score < 50);

  const categories = [
    {
      key: 'excellent',
      label: 'Excellent',
      count: excellent.length,
      icon: CheckCircle,
      gradient: healthColors.excellent.gradient,
      bgColor: healthColors.excellent.bg,
      textColor: healthColors.excellent.text,
      borderColor: healthColors.excellent.border,
      description: 'Relations saines, paiements réguliers',
      tenants: excellent.slice(0, 3),
    },
    {
      key: 'attention',
      label: 'Attention',
      count: attention.length,
      icon: Clock,
      gradient: healthColors.attention.gradient,
      bgColor: healthColors.attention.bg,
      textColor: healthColors.attention.text,
      borderColor: healthColors.attention.border,
      description: 'À surveiller, retards occasionnels',
      tenants: attention.slice(0, 3),
    },
    {
      key: 'critical',
      label: 'Critique',
      count: critical.length,
      icon: AlertCircle,
      gradient: healthColors.critical.gradient,
      bgColor: healthColors.critical.bg,
      textColor: healthColors.critical.text,
      borderColor: healthColors.critical.border,
      description: 'Action requise, impayés ou litiges',
      tenants: critical.slice(0, 3),
    },
  ];

  // Calculate overall health
  const totalTenants = tenants.length;
  const avgScore = totalTenants > 0
    ? Math.round(tenants.reduce((sum, t) => sum + t.score, 0) / totalTenants)
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreTrend = (score: number) => {
    if (score >= 80) return { icon: TrendingUp, color: 'text-emerald-500' };
    if (score >= 50) return { icon: Minus, color: 'text-amber-500' };
    return { icon: TrendingDown, color: 'text-red-500' };
  };

  const trend = getScoreTrend(avgScore);
  const TrendIcon = trend.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header with overall score */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Santé Relationnelle</h3>
              <p className="text-sm text-gray-500">Vue globale de vos relations locataires</p>
            </div>
          </div>

          {/* Overall score */}
          <div className="flex items-center gap-3">
            <div className={cn("text-right", getScoreColor(avgScore))}>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold">{avgScore}</span>
                <span className="text-sm font-medium">/100</span>
              </div>
              <span className="text-xs">Score global</span>
            </div>
            <div className={cn("p-2 rounded-lg bg-gray-50", trend.color)}>
              <TrendIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Health Categories */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="relative overflow-hidden rounded-xl border-2 transition-all hover:shadow-md cursor-pointer"
                style={{
                  borderColor: category.borderColor,
                  backgroundColor: category.bgColor
                }}
              >
                {/* Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: category.gradient }}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold" style={{ color: category.textColor }}>
                        {category.label}
                      </span>
                    </div>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: category.textColor }}
                    >
                      {category.count}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{category.description}</p>
                </div>

                {/* Mini tenant list */}
                {category.tenants.length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="space-y-1.5">
                      {category.tenants.map(tenant => (
                        <div
                          key={tenant.id}
                          className="flex items-center justify-between text-sm bg-white/60 rounded-lg px-2.5 py-1.5"
                        >
                          <span className="font-medium text-gray-700 truncate">
                            {tenant.name}
                          </span>
                          <span
                            className="text-xs font-semibold"
                            style={{ color: category.textColor }}
                          >
                            {tenant.score}%
                          </span>
                        </div>
                      ))}
                    </div>
                    {category.count > 3 && (
                      <p className="text-xs text-center mt-2 text-gray-500">
                        +{category.count - 3} autres
                      </p>
                    )}
                  </div>
                )}

                {/* Empty state */}
                {category.count === 0 && (
                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-center py-3 text-sm text-gray-400 bg-white/40 rounded-lg">
                      <Users className="w-4 h-4 mr-2" />
                      Aucun locataire
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default TenantHealthDashboard;
