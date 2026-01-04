'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Home,
  Briefcase,
  User,
  Calendar,
  Clock,
  MessageCircle,
  CreditCard,
  FileText,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Languages,
  PawPrint,
  Cigarette,
  Heart,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr, enUS, nl, de } from 'date-fns/locale';
import { ownerGradient, healthColors } from '@/lib/constants/owner-theme';
import { useLanguage } from '@/lib/i18n/use-language';

const dateLocales: Record<string, typeof fr> = { fr, en: enUS, nl, de };

interface TenantRelationshipCardProps {
  tenant: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl?: string;
    age?: number;
    occupation?: string;
    propertyId: string;
    propertyName: string;
    moveInDate?: string;
    leaseDurationMonths?: number;
    languages?: string[];
    hasPets?: boolean;
    isSmoker?: boolean;
    // Health metrics
    healthScore: number; // 0-100
    paymentStatus: 'paid' | 'pending' | 'overdue';
    lastPaymentDate?: string;
    communicationScore: number; // 0-100
    hasOpenTickets: boolean;
    openTicketCount?: number;
  };
  index?: number;
  onOpenDetails?: (tenantId: string) => void;
}

export function TenantRelationshipCard({
  tenant,
  index = 0,
  onOpenDetails
}: TenantRelationshipCardProps) {
  const router = useRouter();
  const { language, getSection } = useLanguage();
  const ariaLabels = getSection('ariaLabels');
  const locale = dateLocales[language] || fr;

  // Get health category
  const getHealthCategory = (score: number) => {
    if (score >= 80) return 'excellent';
    if (score >= 50) return 'attention';
    return 'critical';
  };

  const healthCategory = getHealthCategory(tenant.healthScore);
  const healthConfig = healthColors[healthCategory];

  // Payment status config
  const getPaymentStatusConfig = (status: 'paid' | 'pending' | 'overdue') => {
    const configs = {
      paid: {
        className: 'bg-green-100 text-green-700 border-green-200',
        label: 'Payé',
        icon: CheckCircle,
      },
      pending: {
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        label: 'En attente',
        icon: Clock,
      },
      overdue: {
        className: 'bg-red-100 text-red-700 border-red-200',
        label: 'Impayé',
        icon: AlertCircle,
      },
    };
    return configs[status];
  };

  const paymentConfig = getPaymentStatusConfig(tenant.paymentStatus);
  const PaymentIcon = paymentConfig.icon;

  // Calculate lease end date
  const getLeaseEndDate = () => {
    if (!tenant.moveInDate || !tenant.leaseDurationMonths) return null;
    const endDate = new Date(tenant.moveInDate);
    endDate.setMonth(endDate.getMonth() + tenant.leaseDurationMonths);
    return endDate;
  };

  const leaseEndDate = getLeaseEndDate();
  const isLeavingSoon = leaseEndDate && leaseEndDate <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get trend icon based on health score
  const getTrendIcon = () => {
    if (tenant.healthScore >= 80) return { icon: TrendingUp, color: 'text-emerald-500' };
    if (tenant.healthScore >= 50) return { icon: Minus, color: 'text-amber-500' };
    return { icon: TrendingDown, color: 'text-red-500' };
  };

  const trend = getTrendIcon();
  const TrendIcon = trend.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ delay: 0.05 + index * 0.02 }}
      className="relative overflow-hidden bg-white/80 backdrop-blur-sm superellipse-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onOpenDetails?.(tenant.id)}
    >
      {/* Health indicator strip at top */}
      <div
        className="h-1"
        style={{ background: healthConfig.gradient }}
      />

      <div className="p-5">
        {/* Decorative circle */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10" style={{ background: ownerGradient }} />

        <div className="relative flex gap-4">
          {/* Avatar with health ring */}
          <div className="flex-shrink-0 relative">
            <div
              className="absolute inset-0 superellipse-2xl"
              style={{
                background: healthConfig.gradient,
                padding: '2px',
              }}
            >
              <div className="w-full h-full superellipse-2xl bg-white" />
            </div>
            {tenant.photoUrl ? (
              <img
                src={tenant.photoUrl}
                alt={`${tenant.firstName} ${tenant.lastName}`}
                className="relative w-16 h-16 superellipse-2xl object-cover"
                style={{ border: '2px solid transparent' }}
              />
            ) : (
              <div
                className="relative w-16 h-16 superellipse-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
                style={{ background: ownerGradient }}
              >
                {getInitials(tenant.firstName, tenant.lastName)}
              </div>
            )}

            {/* Health score badge */}
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white"
              style={{
                background: healthConfig.gradient,
                color: 'white'
              }}
            >
              {tenant.healthScore}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {tenant.firstName} {tenant.lastName}
                  </h3>
                  <TrendIcon className={cn("w-4 h-4", trend.color)} />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Home className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{tenant.propertyName}</span>
                </div>
              </div>
              <Badge className={cn(paymentConfig.className, "border flex-shrink-0")}>
                <PaymentIcon className="w-3 h-3 mr-1" />
                {paymentConfig.label}
              </Badge>
            </div>

            {/* Details row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
              {tenant.occupation && (
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                  <span>{tenant.occupation}</span>
                </div>
              )}
              {tenant.age && (
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>{tenant.age} ans</span>
                </div>
              )}
            </div>

            {/* Lifestyle and status badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {/* Health category badge */}
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: healthConfig.bg,
                  color: healthConfig.text,
                  borderColor: healthConfig.border
                }}
              >
                <Heart className="w-3 h-3" />
                {healthCategory === 'excellent' ? 'Excellente relation' :
                 healthCategory === 'attention' ? 'À surveiller' : 'Action requise'}
              </span>

              {/* Open tickets badge */}
              {tenant.hasOpenTickets && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-200">
                  <AlertCircle className="w-3 h-3" />
                  {tenant.openTicketCount || 1} ticket{(tenant.openTicketCount || 1) > 1 ? 's' : ''} ouvert{(tenant.openTicketCount || 1) > 1 ? 's' : ''}
                </span>
              )}

              {/* Lifestyle badges */}
              {tenant.languages && tenant.languages.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">
                  <Languages className="w-3 h-3" />
                  {tenant.languages.slice(0, 2).join(', ')}
                </span>
              )}
              {tenant.hasPets && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs">
                  <PawPrint className="w-3 h-3" />
                  Animaux
                </span>
              )}
              {tenant.isSmoker && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">
                  <Cigarette className="w-3 h-3" />
                  Fumeur
                </span>
              )}
            </div>

            {/* Lease and actions row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                {tenant.moveInDate && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Depuis {format(new Date(tenant.moveInDate), 'MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                )}
                {leaseEndDate && (
                  <div className={cn(
                    "flex items-center gap-1",
                    isLeavingSoon ? "text-amber-600 font-medium" : "text-gray-500"
                  )}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Fin: {format(leaseEndDate, 'MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg h-8 w-8 p-0 hover:bg-purple-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/owner/leases?tenant=${tenant.id}`);
                  }}
                  title={ariaLabels?.viewLease?.[language] || 'Voir le bail'}
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg h-8 w-8 p-0 hover:bg-purple-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/owner/messages?tenant=${tenant.id}`);
                  }}
                  title={ariaLabels?.sendMessage?.[language] || 'Envoyer un message'}
                >
                  <MessageCircle className="w-4 h-4 text-gray-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg h-8 w-8 p-0 hover:bg-purple-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/owner/finance?tenant=${tenant.id}`);
                  }}
                  title={ariaLabels?.viewPayments?.[language] || 'Voir les paiements'}
                >
                  <CreditCard className="w-4 h-4 text-gray-500" />
                </Button>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TenantRelationshipCard;
