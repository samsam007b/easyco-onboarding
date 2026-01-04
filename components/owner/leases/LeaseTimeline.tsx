'use client';

import { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Home,
  User,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, addMonths, differenceInDays, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ownerGradient, semanticColors } from '@/lib/constants/owner-theme';

interface TimelineLease {
  id: string;
  tenantName: string;
  tenantPhoto?: string;
  propertyName: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'ending_soon' | 'expired' | 'future';
  monthlyRent: number;
}

interface LeaseTimelineProps {
  leases: TimelineLease[];
  className?: string;
  onLeaseClick?: (leaseId: string) => void;
}

const statusColors = {
  active: { bg: semanticColors.success.gradient, border: '#22c55e', text: '#166534' },
  ending_soon: { bg: semanticColors.warning.gradient, border: '#f59e0b', text: '#92400E' },
  expired: { bg: semanticColors.danger.gradient, border: '#ef4444', text: '#991B1B' },
  future: { bg: semanticColors.info.gradient, border: '#3b82f6', text: '#1e40af' },
};

export function LeaseTimeline({ leases, className, onLeaseClick }: LeaseTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = normal, 0.5 = zoomed out, 2 = zoomed in
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const [hoveredLease, setHoveredLease] = useState<string | null>(null);

  // Calculate timeline range
  const timelineRange = useMemo(() => {
    if (leases.length === 0) {
      const now = new Date();
      return {
        start: startOfMonth(addMonths(now, -3)),
        end: endOfMonth(addMonths(now, 12)),
      };
    }

    const allDates = leases.flatMap(l => [l.startDate, l.endDate]);
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));

    return {
      start: startOfMonth(addMonths(minDate, -1)),
      end: endOfMonth(addMonths(maxDate, 3)),
    };
  }, [leases]);

  // Generate months for header
  const months = useMemo(() => {
    return eachMonthOfInterval({ start: timelineRange.start, end: timelineRange.end });
  }, [timelineRange]);

  const totalDays = differenceInDays(timelineRange.end, timelineRange.start);
  const dayWidth = 4 * zoomLevel; // pixels per day
  const totalWidth = totalDays * dayWidth;

  // Calculate lease bar position and width
  const getLeasePosition = (lease: TimelineLease) => {
    const startOffset = differenceInDays(lease.startDate, timelineRange.start);
    const duration = differenceInDays(lease.endDate, lease.startDate);
    return {
      left: startOffset * dayWidth,
      width: Math.max(duration * dayWidth, 40), // Minimum width for visibility
    };
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev * 1.5, 4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev / 1.5, 0.5));

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 200;
      containerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const now = new Date();
  const nowPosition = differenceInDays(now, timelineRange.start) * dayWidth;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-sm"
            style={{ background: ownerGradient }}
          >
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Timeline des Baux</h3>
            <p className="text-sm text-gray-500">Vue Gantt de vos contrats de location</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleScroll('left')}
            className="rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="rounded-lg"
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-500 min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="rounded-lg"
            disabled={zoomLevel >= 4}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleScroll('right')}
            className="rounded-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="relative">
        {/* Legend */}
        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-green-500 to-emerald-500" />
            <span className="text-gray-600">Actif</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-amber-500 to-yellow-500" />
            <span className="text-gray-600">Fin proche</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-red-500 to-rose-500" />
            <span className="text-gray-600">Expiré</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-blue-500 to-cyan-500" />
            <span className="text-gray-600">À venir</span>
          </div>
        </div>

        {/* Scrollable timeline */}
        <div
          ref={containerRef}
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ maxHeight: '400px' }}
        >
          <div style={{ width: totalWidth, minWidth: '100%' }} className="relative">
            {/* Months header */}
            <div className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-sm border-b border-gray-200 flex">
              {months.map((month, i) => {
                const monthStart = Math.max(0, differenceInDays(month, timelineRange.start));
                const nextMonth = addMonths(month, 1);
                const monthEnd = Math.min(totalDays, differenceInDays(nextMonth, timelineRange.start));
                const monthWidth = (monthEnd - monthStart) * dayWidth;

                return (
                  <div
                    key={i}
                    className="border-r border-gray-200 px-2 py-2 text-xs font-medium text-gray-600 flex-shrink-0"
                    style={{ width: monthWidth }}
                  >
                    {format(month, 'MMM yyyy', { locale: fr })}
                  </div>
                );
              })}
            </div>

            {/* Now indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
              style={{ left: nowPosition }}
            >
              <div className="absolute -top-0.5 -left-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-medium rounded">
                Aujourd'hui
              </div>
            </div>

            {/* Lease rows */}
            <div className="relative">
              {leases.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun bail à afficher</p>
                </div>
              ) : (
                <div className="py-2">
                  {leases.map((lease, index) => {
                    const { left, width } = getLeasePosition(lease);
                    const colors = statusColors[lease.status];
                    const isHovered = hoveredLease === lease.id;

                    return (
                      <div key={lease.id} className="relative h-14 mb-1">
                        {/* Background row */}
                        <div className="absolute inset-0 bg-gray-50/50 border-b border-gray-100" />

                        {/* Property label (fixed left) */}
                        <div className="absolute left-0 top-0 bottom-0 w-48 bg-white/90 backdrop-blur-sm z-10 border-r border-gray-200 flex items-center px-3 gap-2">
                          {lease.tenantPhoto ? (
                            <img
                              src={lease.tenantPhoto}
                              alt={lease.tenantName}
                              className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                              style={{ background: ownerGradient }}
                            >
                              {getInitials(lease.tenantName)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {lease.tenantName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {lease.propertyName}
                            </p>
                          </div>
                        </div>

                        {/* Lease bar */}
                        <motion.div
                          whileHover={{ scale: 1.02, y: -1 }}
                          onHoverStart={() => setHoveredLease(lease.id)}
                          onHoverEnd={() => setHoveredLease(null)}
                          onClick={() => onLeaseClick?.(lease.id)}
                          className={cn(
                            "absolute top-2 h-10 rounded-lg cursor-pointer shadow-sm transition-shadow",
                            isHovered && "shadow-md z-10"
                          )}
                          style={{
                            left: left + 200, // Offset for fixed labels
                            width,
                            background: colors.bg,
                            borderLeft: `3px solid ${colors.border}`,
                          }}
                        >
                          {/* Bar content */}
                          <div className="h-full px-2 flex items-center justify-between overflow-hidden">
                            <span className="text-xs font-medium text-white truncate">
                              {width > 100 ? `${format(lease.startDate, 'MMM yy', { locale: fr })} - ${format(lease.endDate, 'MMM yy', { locale: fr })}` : ''}
                            </span>
                            {width > 80 && (
                              <span className="text-xs text-white/80 font-semibold flex-shrink-0">
                                {lease.monthlyRent}€
                              </span>
                            )}
                          </div>

                          {/* Hover tooltip */}
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute left-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]"
                            >
                              <p className="font-semibold text-gray-900">{lease.tenantName}</p>
                              <p className="text-sm text-gray-500 mb-2">{lease.propertyName}</p>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Début:</span>
                                  <span className="font-medium">{format(lease.startDate, 'd MMM yyyy', { locale: fr })}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Fin:</span>
                                  <span className="font-medium">{format(lease.endDate, 'd MMM yyyy', { locale: fr })}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Loyer:</span>
                                  <span className="font-bold" style={{ color: '#9c5698' }}>{lease.monthlyRent}€/mois</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default LeaseTimeline;
