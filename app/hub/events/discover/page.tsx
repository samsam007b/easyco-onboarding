'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Filter,
  Search,
  Sparkles,
  MapPin,
  Euro,
  Clock,
  Grid3x3,
  List,
  ChevronDown,
  X,
  TrendingUp,
} from 'lucide-react';
import { useRole } from '@/lib/role/role-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import EventCard from '@/components/events/EventCard';
import { MOCK_EVENTS, MOCK_CATEGORIES, RECOMMENDED_EVENTS } from '@/lib/mock-data/events';
import { Event, EventCategory, AttendeeStatus } from '@/lib/types/events';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

// ============================================================================
// ROLE COLORS (V3 Color System)
// Source: brand-identity/izzico-color-system.html
// ============================================================================

// Signature Gradient: The official Izzico brand gradient (3 role primaries)
const SIGNATURE_GRADIENT = 'linear-gradient(135deg, #9c5698 0%, #c85570 20%, #d15659 35%, #e05747 50%, #ff7c10 75%, #ffa000 100%)';

const ROLE_COLORS = {
  resident: {
    gradient: SIGNATURE_GRADIENT, // Use brand gradient for consistency
    primary: '#e05747',
    bg: 'from-orange-50 to-red-50',
    cardBg: 'linear-gradient(135deg, #FEF2EE 0%, #FDE8E4 100%)',
  },
  searcher: {
    gradient: SIGNATURE_GRADIENT, // Use brand gradient for consistency
    primary: '#ffa000',
    bg: 'from-yellow-50 to-orange-50',
    cardBg: 'linear-gradient(135deg, #FFF9E6 0%, #FFF4D4 100%)',
  },
  owner: {
    gradient: SIGNATURE_GRADIENT, // Use brand gradient for consistency
    primary: '#9c5698',
    bg: 'from-purple-50 to-pink-50',
    cardBg: 'linear-gradient(135deg, #F8F0F7 0%, #F3E6F1 100%)',
  },
} as const;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EventsDiscoverPage() {
  const { activeRole } = useRole();
  const roleColors = ROLE_COLORS[activeRole || 'resident'];

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [userAttendance, setUserAttendance] = useState<Record<string, AttendeeStatus>>({
    'evt-1': 'interested',
    'evt-4': 'going',
    'evt-7': 'going',
  });

  // Filter events
  const filteredEvents = useMemo(() => {
    let events = [...MOCK_EVENTS];

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.city.toLowerCase().includes(query) ||
          e.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      events = events.filter((e) => e.category_id && selectedCategories.includes(e.category_id));
    }

    // Price filter
    if (priceFilter === 'free') {
      events = events.filter((e) => e.is_free);
    } else if (priceFilter === 'paid') {
      events = events.filter((e) => !e.is_free);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekEnd = addDays(today, 7);
      const monthEnd = addDays(today, 30);

      events = events.filter((e) => {
        const eventDate = parseISO(e.start_date);
        if (dateFilter === 'today') {
          return isSameDay(eventDate, today);
        } else if (dateFilter === 'week') {
          return eventDate >= today && eventDate <= weekEnd;
        } else if (dateFilter === 'month') {
          return eventDate >= today && eventDate <= monthEnd;
        }
        return true;
      });
    }

    return events;
  }, [searchQuery, selectedCategories, priceFilter, dateFilter]);

  // Handle attendance change
  const handleAttendanceChange = (eventId: string, status: AttendeeStatus) => {
    setUserAttendance((prev) => ({
      ...prev,
      [eventId]: status,
    }));
  };

  // Toggle category
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceFilter('all');
    setDateFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || priceFilter !== 'all' || dateFilter !== 'all' || searchQuery;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${roleColors.bg} pb-20`}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-heading text-4xl font-bold mb-2">
                Découvre ta ville avec Izzico
              </h1>
              <p className="text-gray-600 font-sans">
                {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} à venir près
                de chez toi
              </p>
            </div>

            {/* View mode toggle */}
            <div className="hidden md:flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="font-heading"
              >
                <Grid3x3 className="w-4 h-4 mr-1" />
                Grille
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="font-heading"
              >
                <List className="w-4 h-4 mr-1" />
                Liste
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('timeline')}
                className="font-heading"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Timeline
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un événement, une activité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none font-sans transition-colors"
              style={{
                outlineColor: roleColors.primary,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = roleColors.primary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '';
              }}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="font-heading"
            >
              <Filter className="w-4 h-4 mr-1" />
              Filtres
              {hasActiveFilters && (
                <Badge
                  className="ml-2 text-white px-1.5 py-0.5 text-xs"
                  style={{ background: roleColors.primary }}
                >
                  {selectedCategories.length +
                    (priceFilter !== 'all' ? 1 : 0) +
                    (dateFilter !== 'all' ? 1 : 0)}
                </Badge>
              )}
            </Button>

            <Button
              variant={priceFilter === 'free' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPriceFilter(priceFilter === 'free' ? 'all' : 'free')}
              className="font-heading"
            >
              Gratuit uniquement
            </Button>

            <Button
              variant={dateFilter === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateFilter(dateFilter === 'week' ? 'all' : 'week')}
              className="font-heading"
            >
              Cette semaine
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="font-heading">
                <X className="w-4 h-4 mr-1" />
                Réinitialiser
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Catégories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {MOCK_CATEGORIES.map((cat) => (
                    <Badge
                      key={cat.id}
                      variant={selectedCategories.includes(cat.id) ? 'default' : 'secondary'}
                      className="cursor-pointer font-heading hover:scale-105 transition-transform"
                      onClick={() => toggleCategory(cat.id)}
                      style={{
                        backgroundColor: selectedCategories.includes(cat.id) ? cat.color : undefined,
                        borderColor: cat.color,
                        color: selectedCategories.includes(cat.id) ? 'white' : cat.color,
                      }}
                    >
                      {cat.name_fr}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
                  <Euro className="w-4 h-4" />
                  Prix
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant={priceFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriceFilter('all')}
                    className="font-heading"
                  >
                    Tous
                  </Button>
                  <Button
                    variant={priceFilter === 'free' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriceFilter('free')}
                    className="font-heading"
                  >
                    Gratuit
                  </Button>
                  <Button
                    variant={priceFilter === 'paid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriceFilter('paid')}
                    className="font-heading"
                  >
                    Payant
                  </Button>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Période
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant={dateFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('all')}
                    className="font-heading"
                  >
                    Tous
                  </Button>
                  <Button
                    variant={dateFilter === 'today' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('today')}
                    className="font-heading"
                  >
                    Aujourd'hui
                  </Button>
                  <Button
                    variant={dateFilter === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('week')}
                    className="font-heading"
                  >
                    Cette semaine
                  </Button>
                  <Button
                    variant={dateFilter === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter('month')}
                    className="font-heading"
                  >
                    Ce mois
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recommendations Section */}
        {!hasActiveFilters && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" style={{ color: roleColors.primary }} />
              <h2 className="font-heading text-2xl font-bold">Recommandé pour toi</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RECOMMENDED_EVENTS.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="default"
                  showCategory
                  showAttendees
                  currentStatus={userAttendance[event.id]}
                  onStatusChange={(status) => handleAttendanceChange(event.id, status)}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Events List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl font-bold">
              {hasActiveFilters ? 'Résultats de recherche' : 'Tous les événements'}
            </h2>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 font-sans">Triés par date</span>
            </div>
          </div>

          {viewMode === 'timeline' ? (
            <TimelineView
              events={filteredEvents}
              userAttendance={userAttendance}
              onAttendanceChange={handleAttendanceChange}
            />
          ) : (
            <div
              className={cn(
                'gap-6',
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'flex flex-col'
              )}
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EventCard
                    event={event}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                    showCategory
                    showAttendees
                    showPropertyBadge
                    currentStatus={userAttendance[event.id]}
                    onStatusChange={(status) => handleAttendanceChange(event.id, status)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: roleColors.cardBg }}
              >
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-sans text-lg mb-2">Aucun événement trouvé</p>
              <p className="text-gray-400 font-sans">Essaie de changer les filtres !</p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} className="mt-4 font-heading">
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ============================================================================
// TIMELINE VIEW COMPONENT
// ============================================================================

function TimelineView({
  events,
  userAttendance,
  onAttendanceChange,
}: {
  events: Event[];
  userAttendance: Record<string, AttendeeStatus>;
  onAttendanceChange: (eventId: string, status: AttendeeStatus) => void;
}) {
  const { activeRole } = useRole();
  const roleColors = ROLE_COLORS[activeRole || 'resident'];
  // Group events by date
  const eventsByDate = useMemo(() => {
    const groups: Record<string, Event[]> = {};

    events.forEach((event) => {
      const date = format(parseISO(event.start_date), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });

    return groups;
  }, [events]);

  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <div className="space-y-8">
      {sortedDates.map((date, index) => (
        <motion.div
          key={date}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Date Header */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="text-white rounded-xl p-3 min-w-[80px] text-center"
              style={{ background: roleColors.gradient }}
            >
              <div className="font-heading text-2xl font-bold">
                {format(parseISO(date), 'd')}
              </div>
              <div className="font-sans text-xs uppercase">
                {format(parseISO(date), 'MMM', { locale: fr })}
              </div>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold">
                {format(parseISO(date), 'EEEE', { locale: fr })}
              </h3>
              <p className="text-gray-600 font-sans text-sm">
                {eventsByDate[date].length} événement
                {eventsByDate[date].length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Events for this date */}
          <div className="ml-24 space-y-4">
            {eventsByDate[date].map((event) => (
              <EventCard
                key={event.id}
                event={event}
                variant="compact"
                showCategory
                showAttendees
                showPropertyBadge
                currentStatus={userAttendance[event.id]}
                onStatusChange={(status) => onAttendanceChange(event.id, status)}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
