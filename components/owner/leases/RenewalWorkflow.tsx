'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Repeat,
  Calendar,
  MessageCircle,
  FileSignature,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Send,
  XCircle,
  User,
  Home,
  Euro,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ownerGradient, semanticColors } from '@/lib/constants/owner-theme';

interface RenewalLease {
  id: string;
  tenantName: string;
  tenantPhoto?: string;
  propertyName: string;
  endDate: Date;
  monthlyRent: number;
  daysRemaining: number;
  renewalStatus: 'pending' | 'contacted' | 'negotiating' | 'confirmed' | 'declined';
  lastContactDate?: Date;
}

interface RenewalWorkflowProps {
  leases: RenewalLease[];
  className?: string;
  onContact?: (leaseId: string) => void;
  onRenew?: (leaseId: string) => void;
  onDecline?: (leaseId: string) => void;
}

const renewalStatusConfig = {
  pending: {
    label: 'À contacter',
    icon: Clock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
  },
  contacted: {
    label: 'Contacté',
    icon: Send,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
  },
  negotiating: {
    label: 'En négociation',
    icon: MessageCircle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
  },
  confirmed: {
    label: 'Confirmé',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
  },
  declined: {
    label: 'Refusé',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
  },
};

export function RenewalWorkflow({
  leases,
  className,
  onContact,
  onRenew,
  onDecline
}: RenewalWorkflowProps) {
  const router = useRouter();
  const [expandedLease, setExpandedLease] = useState<string | null>(null);

  // Group leases by urgency
  const urgentLeases = leases.filter(l => l.daysRemaining <= 30);
  const soonLeases = leases.filter(l => l.daysRemaining > 30 && l.daysRemaining <= 60);
  const upcomingLeases = leases.filter(l => l.daysRemaining > 60);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 30) return 'text-red-600';
    if (days <= 60) return 'text-amber-600';
    return 'text-gray-600';
  };

  const getUrgencyBg = (days: number) => {
    if (days <= 30) return 'bg-red-50 border-red-200';
    if (days <= 60) return 'bg-amber-50 border-amber-200';
    return 'bg-gray-50 border-gray-200';
  };

  if (leases.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8 text-center",
          className
        )}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun renouvellement en attente</h3>
        <p className="text-gray-500">Tous vos baux sont en cours et ne nécessitent pas d'action immédiate.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: ownerGradient }}
            >
              <Repeat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Workflow de Renouvellement</h3>
              <p className="text-sm text-gray-500">{leases.length} bail{leases.length > 1 ? 'x' : ''} à renouveler</p>
            </div>
          </div>

          {/* Summary badges */}
          <div className="flex items-center gap-2">
            {urgentLeases.length > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                {urgentLeases.length} urgent{urgentLeases.length > 1 ? 's' : ''}
              </span>
            )}
            {soonLeases.length > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                {soonLeases.length} bientôt
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Workflow Pipeline */}
      <div className="p-5">
        {/* Pipeline stages indicator */}
        <div className="flex items-center justify-between mb-6 px-4">
          {['pending', 'contacted', 'negotiating', 'confirmed'].map((stage, index) => {
            const config = renewalStatusConfig[stage as keyof typeof renewalStatusConfig];
            const stageCount = leases.filter(l => l.renewalStatus === stage).length;
            const Icon = config.icon;

            return (
              <div key={stage} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    stageCount > 0 ? config.bgColor : 'bg-gray-100'
                  )}>
                    <Icon className={cn("w-5 h-5", stageCount > 0 ? config.color : 'text-gray-400')} />
                  </div>
                  <span className={cn(
                    "text-xs font-medium mt-1",
                    stageCount > 0 ? config.color : 'text-gray-400'
                  )}>
                    {config.label}
                  </span>
                  {stageCount > 0 && (
                    <span className={cn(
                      "text-xs font-bold",
                      config.color
                    )}>
                      ({stageCount})
                    </span>
                  )}
                </div>
                {index < 3 && (
                  <div className="w-16 h-0.5 bg-gray-200 mx-2" />
                )}
              </div>
            );
          })}
        </div>

        {/* Lease items */}
        <div className="space-y-3">
          {leases.map((lease, index) => {
            const statusConfig = renewalStatusConfig[lease.renewalStatus];
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedLease === lease.id;

            return (
              <motion.div
                key={lease.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "border-2 rounded-xl overflow-hidden transition-all",
                  getUrgencyBg(lease.daysRemaining)
                )}
              >
                {/* Main row */}
                <div
                  className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/50 transition-colors"
                  onClick={() => setExpandedLease(isExpanded ? null : lease.id)}
                >
                  {/* Avatar */}
                  {lease.tenantPhoto ? (
                    <img
                      src={lease.tenantPhoto}
                      alt={lease.tenantName}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ background: ownerGradient }}
                    >
                      {getInitials(lease.tenantName)}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{lease.tenantName}</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium border",
                        statusConfig.bgColor,
                        statusConfig.color,
                        statusConfig.borderColor
                      )}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" />
                        {lease.propertyName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Euro className="w-3.5 h-3.5" />
                        {lease.monthlyRent}€/mois
                      </span>
                    </div>
                  </div>

                  {/* Days remaining */}
                  <div className="text-right flex-shrink-0">
                    <div className={cn("text-lg font-bold", getUrgencyColor(lease.daysRemaining))}>
                      {lease.daysRemaining}j
                    </div>
                    <div className="text-xs text-gray-500">restants</div>
                  </div>

                  {/* Expand icon */}
                  <ChevronRight className={cn(
                    "w-5 h-5 text-gray-400 transition-transform",
                    isExpanded && "rotate-90"
                  )} />
                </div>

                {/* Expanded actions */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-200 bg-white/60"
                    >
                      <div className="p-4">
                        {/* Dates info */}
                        <div className="flex items-center gap-6 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Fin du bail:</span>
                            <span className="font-medium">{format(lease.endDate, 'd MMMM yyyy', { locale: fr })}</span>
                          </div>
                          {lease.lastContactDate && (
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Dernier contact:</span>
                              <span className="font-medium">{format(lease.lastContactDate, 'd MMM', { locale: fr })}</span>
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          {lease.renewalStatus !== 'confirmed' && lease.renewalStatus !== 'declined' && (
                            <>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onContact?.(lease.id);
                                }}
                                variant="outline"
                                size="sm"
                                className="rounded-lg flex-1"
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Contacter
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRenew?.(lease.id);
                                }}
                                size="sm"
                                className="rounded-lg flex-1 text-white"
                                style={{ background: ownerGradient }}
                              >
                                <FileSignature className="w-4 h-4 mr-2" />
                                Renouveler
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDecline?.(lease.id);
                                }}
                                variant="ghost"
                                size="sm"
                                className="rounded-lg text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {lease.renewalStatus === 'confirmed' && (
                            <div className="flex-1 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-medium">Renouvellement confirmé</span>
                            </div>
                          )}
                          {lease.renewalStatus === 'declined' && (
                            <div className="flex-1 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                              <XCircle className="w-5 h-5" />
                              <span className="font-medium">Le locataire ne souhaite pas renouveler</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default RenewalWorkflow;
