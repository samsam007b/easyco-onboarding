'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  User,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  Calendar,
  Euro,
  Briefcase,
  GripVertical,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Star,
  UserPlus,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { fr, enUS, nl, de } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import { ownerGradient, semanticColors } from '@/lib/constants/owner-theme';
import { useLanguage } from '@/lib/i18n/use-language';

const dateLocales: Record<string, Locale> = { fr, en: enUS, nl, de };

const numberLocales: Record<string, string> = { fr: 'fr-FR', en: 'en-US', nl: 'nl-NL', de: 'de-DE' };

const t = {
  columns: {
    pending: { fr: 'En attente', en: 'Pending', nl: 'In afwachting', de: 'Ausstehend' },
    reviewing: { fr: 'En cours', en: 'Reviewing', nl: 'In behandeling', de: 'In Bearbeitung' },
    approved: { fr: 'Approuvées', en: 'Approved', nl: 'Goedgekeurd', de: 'Genehmigt' },
    rejected: { fr: 'Refusées', en: 'Rejected', nl: 'Afgewezen', de: 'Abgelehnt' },
  },
  status: {
    approved: { fr: 'Approuvée', en: 'Approved', nl: 'Goedgekeurd', de: 'Genehmigt' },
    rejected: { fr: 'Refusée', en: 'Rejected', nl: 'Afgewezen', de: 'Abgelehnt' },
  },
  header: {
    title: { fr: 'Pipeline Candidatures', en: 'Application Pipeline', nl: 'Kandidatenpijplijn', de: 'Bewerbungspipeline' },
    newSingular: { fr: 'nouveau', en: 'new', nl: 'nieuw', de: 'neu' },
    newPlural: { fr: 'nouveaux', en: 'new', nl: 'nieuw', de: 'neu' },
    pending: { fr: 'en attente', en: 'pending', nl: 'in afwachting', de: 'ausstehend' },
    reviewing: { fr: 'en cours', en: 'reviewing', nl: 'in behandeling', de: 'in Bearbeitung' },
  },
  empty: {
    noApplications: { fr: 'Aucune candidature', en: 'No applications', nl: 'Geen aanvragen', de: 'Keine Bewerbungen' },
  },
  income: {
    perMonth: { fr: '/mois', en: '/month', nl: '/maand', de: '/Monat' },
  },
};

export type ApplicationStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';
export type ApplicationType = 'individual' | 'group';

export interface ApplicationData {
  id: string;
  type: ApplicationType;
  status: ApplicationStatus;
  propertyId: string;
  propertyTitle: string;
  propertyCity: string;
  applicantName: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicantAvatar?: string;
  monthlyIncome?: number;
  profession?: string;
  moveInDate?: Date;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  compatibilityScore?: number; // 0-100
  groupSize?: number; // For group applications
  documents?: string[];
}

interface ApplicationPipelineProps {
  applications: ApplicationData[];
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
  onApplicationClick?: (application: ApplicationData) => void;
  onApprove?: (application: ApplicationData) => void;
  onReject?: (application: ApplicationData) => void;
  className?: string;
}

const getColumns = (language: string): { id: ApplicationStatus; title: string; icon: typeof Clock; color: string }[] => [
  { id: 'pending', title: t.columns.pending[language as keyof typeof t.columns.pending] || 'Pending', icon: Clock, color: '#f59e0b' },
  { id: 'reviewing', title: t.columns.reviewing[language as keyof typeof t.columns.reviewing] || 'Reviewing', icon: Eye, color: '#3b82f6' },
  { id: 'approved', title: t.columns.approved[language as keyof typeof t.columns.approved] || 'Approved', icon: CheckCircle, color: '#10b981' },
  { id: 'rejected', title: t.columns.rejected[language as keyof typeof t.columns.rejected] || 'Rejected', icon: XCircle, color: '#ef4444' },
];

// Sortable Application Card
function SortableApplicationCard({
  application,
  onClick,
  onApprove,
  onReject,
}: {
  application: ApplicationData;
  onClick?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const { language } = useLanguage();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const scoreColor = useMemo(() => {
    if (!application.compatibilityScore) return '#9ca3af';
    if (application.compatibilityScore >= 80) return '#10b981';
    if (application.compatibilityScore >= 60) return '#f59e0b';
    return '#ef4444';
  }, [application.compatibilityScore]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white superellipse-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer',
        isDragging && 'opacity-50 shadow-lg ring-2 ring-purple-400'
      )}
      onClick={onClick}
    >
      <div className="p-4">
        {/* Header with drag handle */}
        <div className="flex items-start gap-2 mb-3">
          <button
            {...attributes}
            {...listeners}
            className="flex-shrink-0 mt-1 p-1 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </button>

          <div className="flex-1 min-w-0">
            {/* Applicant info */}
            <div className="flex items-center gap-2 mb-2">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                {application.applicantAvatar ? (
                  <img
                    src={application.applicantAvatar}
                    alt={application.applicantName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: ownerGradient }}
                  >
                    {application.applicantName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate text-sm">
                    {application.applicantName}
                  </p>
                  {application.type === 'group' && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[10px] px-1.5 py-0">
                      <Users className="w-3 h-3 mr-1" />
                      {application.groupSize || 2}
                    </Badge>
                  )}
                </div>
                {application.profession && (
                  <p className="text-xs text-gray-500 truncate">
                    {application.profession}
                  </p>
                )}
              </div>

              {/* Compatibility Score */}
              {application.compatibilityScore !== undefined && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${scoreColor}20`,
                    color: scoreColor,
                  }}
                >
                  <Star className="w-3 h-3" />
                  {application.compatibilityScore}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Property info */}
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 superellipse-lg">
            <Home className="w-3.5 h-3.5" style={{ color: '#9c5698' }} />
            <span className="truncate max-w-[120px]">{application.propertyTitle}</span>
          </div>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500">{application.propertyCity}</span>
        </div>

        {/* Key info */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          {application.monthlyIncome && (
            <div className="flex items-center gap-1 text-gray-600">
              <Euro className="w-3.5 h-3.5 text-emerald-500" />
              <span>{application.monthlyIncome.toLocaleString(numberLocales[language] || 'en-US')}€{t.income.perMonth[language as keyof typeof t.income.perMonth] || '/month'}</span>
            </div>
          )}
          {application.moveInDate && (
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{format(application.moveInDate, 'd MMM', { locale: dateLocales[language] || dateLocales.en })}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(application.createdAt, { addSuffix: true, locale: dateLocales[language] || dateLocales.en })}
          </span>

          {/* Quick actions */}
          {(onApprove || onReject) && application.status !== 'approved' && application.status !== 'rejected' && (
            <div className="flex items-center gap-1">
              {onApprove && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-emerald-600 hover:bg-emerald-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApprove();
                  }}
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>
              )}
              {onReject && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReject();
                  }}
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {application.status === 'approved' && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle className="w-3.5 h-3.5" />
              {t.status.approved[language as keyof typeof t.status.approved] || 'Approved'}
            </span>
          )}
          {application.status === 'rejected' && (
            <span className="flex items-center gap-1 text-xs text-red-600">
              <XCircle className="w-3.5 h-3.5" />
              {t.status.rejected[language as keyof typeof t.status.rejected] || 'Rejected'}
            </span>
          )}
        </div>

        {/* Message preview if exists */}
        {application.message && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 line-clamp-2 italic">
              "{application.message}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Drag Overlay Card
function DragOverlayCard({ application }: { application: ApplicationData }) {
  return (
    <div className="bg-white superellipse-xl border-2 border-purple-400 shadow-xl p-4 w-[280px]">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ background: ownerGradient }}
        >
          {application.applicantName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{application.applicantName}</p>
          <p className="text-xs text-gray-500">{application.propertyTitle}</p>
        </div>
      </div>
    </div>
  );
}

export function ApplicationPipeline({
  applications,
  onStatusChange,
  onApplicationClick,
  onApprove,
  onReject,
  className,
}: ApplicationPipelineProps) {
  const { language } = useLanguage();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeApplication, setActiveApplication] = useState<ApplicationData | null>(null);

  // Memoized columns based on language
  const columns = useMemo(() => getColumns(language), [language]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group applications by status
  const applicationsByStatus = useMemo(() => {
    const grouped: Record<ApplicationStatus, ApplicationData[]> = {
      pending: [],
      reviewing: [],
      approved: [],
      rejected: [],
    };

    applications.forEach((app) => {
      grouped[app.status].push(app);
    });

    // Sort each group by score (if available) and then by date
    Object.keys(grouped).forEach((status) => {
      grouped[status as ApplicationStatus].sort((a, b) => {
        // Sort by score first
        if (a.compatibilityScore !== undefined && b.compatibilityScore !== undefined) {
          if (a.compatibilityScore !== b.compatibilityScore) {
            return b.compatibilityScore - a.compatibilityScore;
          }
        }
        // Then by date
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    });

    return grouped;
  }, [applications]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const app = applications.find((a) => a.id === active.id);
    setActiveApplication(app || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveApplication(null);

    if (!over) return;

    const activeApp = applications.find((a) => a.id === active.id);
    if (!activeApp) return;

    // Check if dropped on a column
    const overColumn = columns.find((col) => col.id === over.id);
    if (overColumn && activeApp.status !== overColumn.id) {
      onStatusChange(activeApp.id, overColumn.id);
      return;
    }

    // Check if dropped on another application
    const overApp = applications.find((a) => a.id === over.id);
    if (overApp && activeApp.status !== overApp.status) {
      onStatusChange(activeApp.id, overApp.status);
    }
  };

  // Stats
  const pendingCount = applicationsByStatus.pending.length;
  const reviewingCount = applicationsByStatus.reviewing.length;
  const totalNew = applications.filter(
    (a) => a.createdAt.getTime() > Date.now() - 24 * 60 * 60 * 1000
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-sm"
              style={{ background: ownerGradient }}
            >
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {t.header.title[language as keyof typeof t.header.title] || 'Application Pipeline'}
                {totalNew > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-600 rounded-full animate-pulse">
                    +{totalNew} {totalNew > 1
                      ? (t.header.newPlural[language as keyof typeof t.header.newPlural] || 'new')
                      : (t.header.newSingular[language as keyof typeof t.header.newSingular] || 'new')}
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500">
                {pendingCount} {t.header.pending[language as keyof typeof t.header.pending] || 'pending'} · {reviewingCount} {t.header.reviewing[language as keyof typeof t.header.reviewing] || 'reviewing'}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="hidden md:flex items-center gap-4">
            {columns.map((col) => (
              <div key={col.id} className="flex items-center gap-1.5 text-xs text-gray-600">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <span>{applicationsByStatus[col.id].length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {columns.map((column) => {
              const columnApps = applicationsByStatus[column.id];
              const ColumnIcon = column.icon;

              return (
                <div
                  key={column.id}
                  className="bg-gray-50/80 superellipse-xl p-3 min-h-[400px]"
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 superellipse-lg flex items-center justify-center"
                        style={{ backgroundColor: `${column.color}20` }}
                      >
                        <ColumnIcon
                          className="w-4 h-4"
                          style={{ color: column.color }}
                        />
                      </div>
                      <span className="font-semibold text-gray-700 text-sm">
                        {column.title}
                      </span>
                    </div>
                    <span
                      className="px-2 py-0.5 text-xs font-bold rounded-full"
                      style={{
                        backgroundColor: `${column.color}20`,
                        color: column.color,
                      }}
                    >
                      {columnApps.length}
                    </span>
                  </div>

                  {/* Droppable area */}
                  <SortableContext
                    items={columnApps.map((a) => a.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div
                      className={cn(
                        'space-y-3 min-h-[300px] p-1 superellipse-lg transition-colors',
                        activeId && 'bg-purple-50/50 border-2 border-dashed border-purple-200'
                      )}
                      data-column={column.id}
                    >
                      {columnApps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                          <ColumnIcon className="w-10 h-10 mb-2 opacity-50" />
                          <p className="text-sm">{t.empty.noApplications[language as keyof typeof t.empty.noApplications] || 'No applications'}</p>
                        </div>
                      ) : (
                        columnApps.map((app) => (
                          <SortableApplicationCard
                            key={app.id}
                            application={app}
                            onClick={() => onApplicationClick?.(app)}
                            onApprove={onApprove ? () => onApprove(app) : undefined}
                            onReject={onReject ? () => onReject(app) : undefined}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>

          {/* Drag overlay */}
          <DragOverlay>
            {activeApplication && <DragOverlayCard application={activeApplication} />}
          </DragOverlay>
        </DndContext>
      </div>
    </motion.div>
  );
}

export default ApplicationPipeline;
