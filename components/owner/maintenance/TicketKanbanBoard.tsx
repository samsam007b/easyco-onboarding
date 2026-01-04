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
  DragOverEvent,
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
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle,
  Home,
  Calendar,
  User,
  Phone,
  Euro,
  GripVertical,
  MoreHorizontal,
  ChevronRight,
  Zap,
  Droplets,
  Flame,
  Lightbulb,
  Key,
  Paintbrush,
  Bug,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ownerGradient, priorityColors, statusColors } from '@/lib/constants/owner-theme';

export type TicketStatus = 'open' | 'in_progress' | 'resolved';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'plumbing' | 'electrical' | 'heating' | 'appliance' | 'locksmith' | 'painting' | 'pest' | 'other';

export interface MaintenanceTicket {
  id: string;
  title: string;
  description: string;
  propertyId: string;
  propertyName: string;
  tenantId?: string;
  tenantName?: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: Date;
  updatedAt: Date;
  estimatedCost?: number;
  actualCost?: number;
  vendorId?: string;
  vendorName?: string;
  scheduledDate?: Date;
}

interface TicketKanbanBoardProps {
  tickets: MaintenanceTicket[];
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => void;
  onTicketClick?: (ticket: MaintenanceTicket) => void;
  className?: string;
}

const categoryIcons: Record<TicketCategory, typeof Wrench> = {
  plumbing: Droplets,
  electrical: Zap,
  heating: Flame,
  appliance: Lightbulb,
  locksmith: Key,
  painting: Paintbrush,
  pest: Bug,
  other: Wrench,
};

const categoryLabels: Record<TicketCategory, string> = {
  plumbing: 'Plomberie',
  electrical: 'Électricité',
  heating: 'Chauffage',
  appliance: 'Électroménager',
  locksmith: 'Serrurerie',
  painting: 'Peinture',
  pest: 'Nuisibles',
  other: 'Autre',
};

const columns: { id: TicketStatus; title: string; icon: typeof Clock }[] = [
  { id: 'open', title: 'Ouvert', icon: AlertTriangle },
  { id: 'in_progress', title: 'En cours', icon: Clock },
  { id: 'resolved', title: 'Résolu', icon: CheckCircle },
];

// Sortable Ticket Card
function SortableTicketCard({
  ticket,
  onClick,
}: {
  ticket: MaintenanceTicket;
  onClick?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const CategoryIcon = categoryIcons[ticket.category];
  const priorityConfig = priorityColors[ticket.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white superellipse-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer",
        isDragging && "opacity-50 shadow-lg ring-2 ring-purple-400"
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
            <div className="flex items-center gap-2 mb-1">
              <Badge
                className={cn(
                  "border text-[10px] px-1.5 py-0",
                  priorityConfig.bg,
                  priorityConfig.text,
                  priorityConfig.border
                )}
              >
                {ticket.priority === 'urgent' ? 'URGENT' :
                 ticket.priority === 'high' ? 'Haute' :
                 ticket.priority === 'medium' ? 'Moyenne' : 'Basse'}
              </Badge>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(ticket.createdAt, { addSuffix: true, locale: fr })}
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
              {ticket.title}
            </h4>
          </div>
        </div>

        {/* Category and property */}
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <CategoryIcon className="w-3.5 h-3.5" style={{ color: '#9c5698' }} />
            <span>{categoryLabels[ticket.category]}</span>
          </div>
          <div className="flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate max-w-[120px]">{ticket.propertyName}</span>
          </div>
        </div>

        {/* Footer with tenant and cost */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {ticket.tenantName ? (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <User className="w-3 h-3" />
              <span className="truncate max-w-[80px]">{ticket.tenantName}</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Pas de locataire</span>
          )}

          {ticket.estimatedCost && (
            <div className="flex items-center gap-1 text-xs font-medium" style={{ color: '#9c5698' }}>
              <Euro className="w-3 h-3" />
              <span>{ticket.estimatedCost}€</span>
            </div>
          )}
        </div>

        {/* Scheduled date if exists */}
        {ticket.scheduledDate && (
          <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 bg-blue-50 superellipse-lg px-2 py-1">
            <Calendar className="w-3 h-3" />
            <span>Prévu: {format(ticket.scheduledDate, 'd MMM', { locale: fr })}</span>
          </div>
        )}

        {/* Vendor if assigned */}
        {ticket.vendorName && (
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 bg-emerald-50 superellipse-lg px-2 py-1">
            <Wrench className="w-3 h-3" />
            <span>{ticket.vendorName}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Drag Overlay Card (shown while dragging)
function DragOverlayCard({ ticket }: { ticket: MaintenanceTicket }) {
  const CategoryIcon = categoryIcons[ticket.category];
  const priorityConfig = priorityColors[ticket.priority];

  return (
    <div className="bg-white superellipse-xl border-2 border-purple-400 shadow-xl p-4 w-[280px]">
      <div className="flex items-center gap-2 mb-2">
        <Badge
          className={cn(
            "border text-[10px] px-1.5 py-0",
            priorityConfig.bg,
            priorityConfig.text,
            priorityConfig.border
          )}
        >
          {ticket.priority === 'urgent' ? 'URGENT' :
           ticket.priority === 'high' ? 'Haute' :
           ticket.priority === 'medium' ? 'Moyenne' : 'Basse'}
        </Badge>
      </div>
      <h4 className="font-semibold text-gray-900 text-sm mb-2">
        {ticket.title}
      </h4>
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <CategoryIcon className="w-3.5 h-3.5" style={{ color: '#9c5698' }} />
        <span>{categoryLabels[ticket.category]}</span>
      </div>
    </div>
  );
}

export function TicketKanbanBoard({
  tickets,
  onStatusChange,
  onTicketClick,
  className,
}: TicketKanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<MaintenanceTicket | null>(null);

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

  // Group tickets by status
  const ticketsByStatus = useMemo(() => {
    const grouped: Record<TicketStatus, MaintenanceTicket[]> = {
      open: [],
      in_progress: [],
      resolved: [],
    };

    tickets.forEach((ticket) => {
      grouped[ticket.status].push(ticket);
    });

    // Sort each group by priority (urgent first) and then by date
    Object.keys(grouped).forEach((status) => {
      grouped[status as TicketStatus].sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    });

    return grouped;
  }, [tickets]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const ticket = tickets.find((t) => t.id === active.id);
    setActiveTicket(ticket || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTicket = tickets.find((t) => t.id === active.id);
    if (!activeTicket) return;

    // Check if dropping over a column
    const overColumn = columns.find((col) => col.id === over.id);
    if (overColumn && activeTicket.status !== overColumn.id) {
      // Will be handled in dragEnd
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveTicket(null);

    if (!over) return;

    const activeTicket = tickets.find((t) => t.id === active.id);
    if (!activeTicket) return;

    // Check if dropped on a column
    const overColumn = columns.find((col) => col.id === over.id);
    if (overColumn && activeTicket.status !== overColumn.id) {
      onStatusChange(activeTicket.id, overColumn.id);
      return;
    }

    // Check if dropped on another ticket
    const overTicket = tickets.find((t) => t.id === over.id);
    if (overTicket && activeTicket.status !== overTicket.status) {
      onStatusChange(activeTicket.id, overTicket.status);
    }
  };

  // Count by priority for stats
  const urgentCount = tickets.filter((t) => t.priority === 'urgent' && t.status !== 'resolved').length;
  const openCount = ticketsByStatus.open.length;
  const inProgressCount = ticketsByStatus.in_progress.length;

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
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-sm"
              style={{ background: ownerGradient }}
            >
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Tableau des tickets
                {urgentCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full animate-pulse">
                    {urgentCount} urgent{urgentCount > 1 ? 's' : ''}
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500">
                {openCount} ouvert{openCount > 1 ? 's' : ''} · {inProgressCount} en cours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map((column) => {
              const columnTickets = ticketsByStatus[column.id];
              const StatusIcon = column.icon;
              const statusConfig = statusColors[column.id];

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
                        style={{ background: statusConfig.gradient }}
                      >
                        <StatusIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-gray-700">{column.title}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 text-xs font-bold rounded-full"
                      style={{
                        backgroundColor: statusConfig.bg,
                        color: statusConfig.text,
                      }}
                    >
                      {columnTickets.length}
                    </span>
                  </div>

                  {/* Droppable area */}
                  <SortableContext
                    items={columnTickets.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div
                      className={cn(
                        "space-y-3 min-h-[300px] p-1 superellipse-lg transition-colors",
                        activeId && "bg-purple-50/50 border-2 border-dashed border-purple-200"
                      )}
                      data-column={column.id}
                    >
                      {columnTickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                          <StatusIcon className="w-10 h-10 mb-2 opacity-50" />
                          <p className="text-sm">Aucun ticket</p>
                        </div>
                      ) : (
                        columnTickets.map((ticket) => (
                          <SortableTicketCard
                            key={ticket.id}
                            ticket={ticket}
                            onClick={() => onTicketClick?.(ticket)}
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
            {activeTicket && <DragOverlayCard ticket={activeTicket} />}
          </DragOverlay>
        </DndContext>
      </div>
    </motion.div>
  );
}

export default TicketKanbanBoard;
