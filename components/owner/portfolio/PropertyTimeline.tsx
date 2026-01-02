'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Home,
  Users,
  Wrench,
  Euro,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  AlertTriangle,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  propertyTimelineService,
  type TimelineEvent,
  type TimelineCategory,
  type PropertyTimelineData,
} from '@/lib/services/property-timeline-service';
import { ownerGradient } from '@/lib/constants/owner-theme';

interface PropertyTimelineProps {
  propertyId: string;
  className?: string;
  maxEvents?: number;
  showFilters?: boolean;
}

// Event type configurations
const eventConfig: Record<string, {
  icon: typeof Home;
  color: string;
  bgColor: string;
}> = {
  tenant_move_in: {
    icon: ArrowUpRight,
    color: '#059669',
    bgColor: 'bg-emerald-100',
  },
  tenant_move_out: {
    icon: ArrowDownRight,
    color: '#D97706',
    bgColor: 'bg-amber-100',
  },
  maintenance_created: {
    icon: Wrench,
    color: '#2563EB',
    bgColor: 'bg-blue-100',
  },
  maintenance_resolved: {
    icon: CheckCircle,
    color: '#059669',
    bgColor: 'bg-emerald-100',
  },
  payment_received: {
    icon: Euro,
    color: '#059669',
    bgColor: 'bg-emerald-100',
  },
  payment_overdue: {
    icon: AlertTriangle,
    color: '#DC2626',
    bgColor: 'bg-red-100',
  },
  application_received: {
    icon: FileText,
    color: '#7C3AED',
    bgColor: 'bg-purple-100',
  },
  application_approved: {
    icon: CheckCircle,
    color: '#059669',
    bgColor: 'bg-emerald-100',
  },
  application_rejected: {
    icon: XCircle,
    color: '#DC2626',
    bgColor: 'bg-red-100',
  },
  lease_created: {
    icon: FileText,
    color: '#9c5698',
    bgColor: 'bg-pink-100',
  },
  property_created: {
    icon: Home,
    color: '#6B7280',
    bgColor: 'bg-gray-100',
  },
  property_published: {
    icon: Home,
    color: '#059669',
    bgColor: 'bg-emerald-100',
  },
};

const categoryConfig: Record<TimelineCategory, {
  label: string;
  color: string;
}> = {
  tenant: { label: 'Locataires', color: '#F59E0B' },
  maintenance: { label: 'Maintenance', color: '#2563EB' },
  payment: { label: 'Paiements', color: '#059669' },
  application: { label: 'Candidatures', color: '#7C3AED' },
  lease: { label: 'Baux', color: '#9c5698' },
  property: { label: 'Propriété', color: '#6B7280' },
};

/**
 * Format date for grouping
 */
function getDateGroup(date: Date): string {
  if (isToday(date)) return "Aujourd'hui";
  if (isYesterday(date)) return 'Hier';
  if (isThisWeek(date)) return 'Cette semaine';
  if (isThisMonth(date)) return 'Ce mois';
  return format(date, 'MMMM yyyy', { locale: fr });
}

/**
 * Group events by date
 */
function groupEventsByDate(events: TimelineEvent[]): Map<string, TimelineEvent[]> {
  const groups = new Map<string, TimelineEvent[]>();

  events.forEach((event) => {
    const groupKey = getDateGroup(event.date);
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(event);
  });

  return groups;
}

export function PropertyTimeline({
  propertyId,
  className,
  maxEvents = 50,
  showFilters = true,
}: PropertyTimelineProps) {
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState<PropertyTimelineData | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<TimelineCategory>>(new Set());

  useEffect(() => {
    loadTimeline();
  }, [propertyId]);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const data = await propertyTimelineService.getPropertyTimeline(propertyId, {
        limit: maxEvents,
        categories: selectedCategories.size > 0 ? Array.from(selectedCategories) : undefined,
      });
      setTimelineData(data);
    } catch (error) {
      console.error('[PropertyTimeline] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reload when filters change
  useEffect(() => {
    if (!loading && propertyId) {
      loadTimeline();
    }
  }, [selectedCategories]);

  const toggleCategory = (category: TimelineCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12', className)}>
        <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-4" />
        <p className="text-gray-500">Chargement de l'historique...</p>
      </div>
    );
  }

  if (!timelineData || timelineData.events.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12', className)}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg, rgba(156,86,152,0.1), rgba(194,86,107,0.1))' }}
        >
          <Calendar className="w-8 h-8 text-purple-400" />
        </div>
        <p className="text-gray-500 text-center">Aucun événement dans l'historique</p>
        <p className="text-sm text-gray-400 mt-1">
          Les activités de cette propriété apparaîtront ici
        </p>
      </div>
    );
  }

  const groupedEvents = groupEventsByDate(timelineData.events);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <Users className="w-5 h-5 text-amber-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-amber-700">{timelineData.stats.tenantChanges}</p>
          <p className="text-[10px] text-amber-600">Locataires</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <Wrench className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-blue-700">{timelineData.stats.maintenanceCount}</p>
          <p className="text-[10px] text-blue-600">Maintenance</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center">
          <Euro className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-emerald-700">{timelineData.stats.paymentsReceived}</p>
          <p className="text-[10px] text-emerald-600">Paiements</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-purple-700">{timelineData.stats.totalEvents}</p>
          <p className="text-[10px] text-purple-600">Total</p>
        </div>
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-sm text-gray-500 mr-2">
            <Filter className="w-4 h-4" />
            Filtrer:
          </div>
          {Object.entries(categoryConfig).map(([key, config]) => {
            const category = key as TimelineCategory;
            const isSelected = selectedCategories.size === 0 || selectedCategories.has(category);
            return (
              <button
                key={key}
                onClick={() => toggleCategory(category)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  isSelected
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                )}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

        <AnimatePresence mode="popLayout">
          {Array.from(groupedEvents.entries()).map(([group, events], groupIndex) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: groupIndex * 0.05 }}
              className="mb-6"
            >
              {/* Group Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center relative z-10">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
                <h4 className="font-semibold text-gray-700 capitalize">{group}</h4>
              </div>

              {/* Events */}
              <div className="space-y-2 ml-5 pl-8 border-l-2 border-transparent">
                {events.map((event, eventIndex) => {
                  const config = eventConfig[event.type] || eventConfig.property_created;
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: eventIndex * 0.02 }}
                      className="relative"
                    >
                      {/* Connector dot */}
                      <div
                        className="absolute -left-[41px] top-3 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: config.color }}
                      />

                      {/* Event Card */}
                      <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className={cn(
                              'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                              config.bgColor
                            )}
                          >
                            <Icon className="w-4 h-4" style={{ color: config.color }} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                              <span className="text-xs text-gray-400 flex-shrink-0">
                                {format(event.date, 'HH:mm', { locale: fr })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>

                            {/* Metadata */}
                            {event.metadata && (
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {event.metadata.amount && (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium">
                                    {event.metadata.amount.toLocaleString()}€
                                  </span>
                                )}
                                {event.metadata.priority && (
                                  <span
                                    className={cn(
                                      'px-2 py-0.5 text-xs rounded-full font-medium',
                                      event.metadata.priority === 'emergency'
                                        ? 'bg-red-100 text-red-700'
                                        : event.metadata.priority === 'high'
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-gray-100 text-gray-600'
                                    )}
                                  >
                                    {event.metadata.priority === 'emergency'
                                      ? 'Urgence'
                                      : event.metadata.priority === 'high'
                                      ? 'Priorité haute'
                                      : event.metadata.priority}
                                  </span>
                                )}
                                {event.metadata.category && (
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                                    {event.metadata.category}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PropertyTimeline;
