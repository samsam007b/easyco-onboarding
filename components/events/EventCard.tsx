'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  Check,
  Tag,
  ExternalLink,
  Home,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Event, AttendeeStatus } from '@/lib/types/events';
import { useRole } from '@/lib/role/role-context';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

// ============================================================================
// ROLE-BASED COLORS (V3 Color System)
// Source: brand-identity/izzico-color-system.html
// ============================================================================

// Signature Gradient: The official Izzico brand gradient (3 role primaries)
// Source: brand-identity/izzico-color-system.html
const SIGNATURE_GRADIENT = 'linear-gradient(135deg, #9c5698 0%, #c85570 20%, #d15659 35%, #e05747 50%, #ff7c10 75%, #ffa000 100%)';

const ROLE_COLORS = {
  resident: {
    gradient: SIGNATURE_GRADIENT, // Use brand gradient for consistency
    primary: '#e05747',
    cardBg: 'linear-gradient(135deg, #FEF2EE 0%, #FDE8E4 100%)',
    shadow: 'rgba(224, 87, 71, 0.15)',
    hoverShadow: 'rgba(224, 87, 71, 0.25)',
  },
  searcher: {
    gradient: SIGNATURE_GRADIENT, // Use brand gradient for consistency
    primary: '#ffa000',
    cardBg: 'linear-gradient(135deg, #FFF9E6 0%, #FFF4D4 100%)',
    shadow: 'rgba(255, 160, 0, 0.15)',
    hoverShadow: 'rgba(255, 160, 0, 0.25)',
  },
  owner: {
    gradient: SIGNATURE_GRADIENT, // Use brand gradient for consistency
    primary: '#9c5698',
    cardBg: 'linear-gradient(135deg, #F8F0F7 0%, #F3E6F1 100%)',
    shadow: 'rgba(156, 86, 152, 0.15)',
    hoverShadow: 'rgba(156, 86, 152, 0.25)',
  },
} as const;

// ============================================================================
// EVENT CARD COMPONENT
// ============================================================================

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact' | 'featured';
  showCategory?: boolean;
  showAttendees?: boolean;
  showPropertyBadge?: boolean;
  currentStatus?: AttendeeStatus;
  onStatusChange?: (status: AttendeeStatus) => void;
  onClick?: (event: Event) => void;
}

const EventCard = memo(function EventCard({
  event,
  variant = 'default',
  showCategory = true,
  showAttendees = true,
  showPropertyBadge = true,
  currentStatus,
  onStatusChange,
  onClick,
}: EventCardProps) {
  const { activeRole } = useRole();
  const roleColors = ROLE_COLORS[activeRole || 'resident'];

  // Format date
  const eventDate = new Date(event.start_date);
  const formattedDate = format(eventDate, 'EEE d MMM', { locale: fr });
  const formattedTime = format(eventDate, 'HH:mm');

  // Calculate card classes
  const isPropertyEvent = event.event_type === 'property';
  const isFeatured = event.is_featured;
  const isPartner = event.is_partner_event;

  // Attendance button state
  const isGoing = currentStatus === 'going';
  const isInterested = currentStatus === 'interested';

  // Variants
  const isCompact = variant === 'compact';
  const isFeaturedVariant = variant === 'featured';

  // Click handler
  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  // Status change handlers
  const handleInterested = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(isInterested ? 'not_going' : 'interested');
    }
  };

  const handleGoing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(isGoing ? 'not_going' : 'going');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={handleClick}
        className={cn(
          'overflow-hidden cursor-pointer transition-all duration-300',
          'hover:shadow-xl border-0',
          isFeaturedVariant && 'ring-2 ring-offset-2',
          isCompact ? 'h-32' : 'h-auto'
        )}
        style={{
          boxShadow: `0 8px 24px ${roleColors.shadow}`,
        }}
      >
        <div className={cn('flex', isCompact ? 'flex-row h-full' : 'flex-col')}>
          {/* Cover Image */}
          <div
            className={cn(
              'relative overflow-hidden',
              isCompact ? 'w-32 h-full' : 'w-full h-48'
            )}
          >
            {event.cover_image_url ? (
              <img
                src={event.cover_image_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: roleColors.cardBg,
                }}
              >
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {/* Featured Badge */}
            {isFeatured && !isCompact && (
              <div className="absolute top-2 left-2">
                <Badge
                  className="font-heading font-semibold"
                  style={{
                    background: roleColors.gradient,
                    color: 'white',
                  }}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Recommandé
                </Badge>
              </div>
            )}

            {/* Property Badge */}
            {isPropertyEvent && showPropertyBadge && (
              <div className="absolute top-2 right-2">
                <Badge
                  variant="secondary"
                  className="bg-white/90 backdrop-blur font-heading"
                >
                  <Home className="w-3 h-3 mr-1" />
                  Co-living
                </Badge>
              </div>
            )}

            {/* Price Badge */}
            {!isCompact && (
              <div className="absolute bottom-2 right-2">
                {event.is_free ? (
                  <Badge className="bg-emerald-500 text-white font-heading font-bold">
                    GRATUIT
                  </Badge>
                ) : (
                  <Badge className="bg-white/90 backdrop-blur font-heading font-semibold">
                    {event.price_min}€
                    {event.price_max && ` - ${event.price_max}€`}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col">
            {/* Category */}
            {showCategory && event.category && (
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="font-heading text-xs"
                  style={{
                    borderColor: roleColors.primary,
                    color: roleColors.primary,
                  }}
                >
                  {event.category.name_fr}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h3
              className={cn(
                'font-heading font-bold mb-2',
                isCompact ? 'text-sm line-clamp-1' : 'text-lg line-clamp-2'
              )}
            >
              {event.title}
            </h3>

            {/* Date & Location */}
            <div className="flex flex-col gap-1 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="font-sans">
                  {formattedDate} • {formattedTime}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="font-sans line-clamp-1">
                  {event.venue_name || event.city}
                </span>
              </div>
            </div>

            {/* Promo (Partner Events) */}
            {isPartner && event.promo_code && !isCompact && (
              <div
                className="p-2 rounded-lg mb-3 flex items-center gap-2"
                style={{
                  background: roleColors.cardBg,
                }}
              >
                <Tag className="w-4 h-4" style={{ color: roleColors.primary }} />
                <span className="text-sm font-heading font-semibold">
                  {event.promo_description}
                </span>
              </div>
            )}

            {/* Attendees */}
            {showAttendees && (event.going_count || event.interested_count) && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Users className="w-4 h-4" />
                <span className="font-sans">
                  {event.going_count || 0} participant
                  {(event.going_count || 0) > 1 ? 's' : ''} •{' '}
                  {event.interested_count || 0} intéressé
                  {(event.interested_count || 0) > 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Property Attendees */}
            {event.property_attendees && event.property_attendees.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-heading font-semibold text-gray-700 mb-1">
                  {event.property_attendees.length} colocataire
                  {event.property_attendees.length > 1 ? 's' : ''} y va
                  {event.property_attendees.length > 1 ? 'nt' : ''}
                </div>
                <div className="flex -space-x-2">
                  {event.property_attendees.slice(0, 3).map((attendee: any) => (
                    <img
                      key={attendee.id}
                      src={attendee.avatar_url || '/default-avatar.png'}
                      alt={attendee.full_name}
                      className="w-6 h-6 rounded-full border-2 border-white"
                    />
                  ))}
                  {event.property_attendees.length > 3 && (
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold">
                      +{event.property_attendees.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions (if not compact) */}
            {!isCompact && (
              <div className="flex gap-2 mt-auto">
                <Button
                  variant={isInterested ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleInterested}
                  className={cn(
                    'flex-1 font-heading',
                    isInterested && 'text-white'
                  )}
                  style={
                    isInterested
                      ? { background: roleColors.primary }
                      : { borderColor: roleColors.primary, color: roleColors.primary }
                  }
                >
                  <Heart
                    className={cn('w-4 h-4 mr-1', isInterested && 'fill-current')}
                  />
                  {isInterested ? 'Intéressé' : "M'intéresse"}
                </Button>

                <Button
                  variant={isGoing ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleGoing}
                  className={cn('flex-1 font-heading', isGoing && 'text-white')}
                  style={
                    isGoing
                      ? { background: roleColors.primary }
                      : { borderColor: roleColors.primary, color: roleColors.primary }
                  }
                >
                  <Check className="w-4 h-4 mr-1" />
                  {isGoing ? "J'y vais" : 'Je participe'}
                </Button>
              </div>
            )}

            {/* External Link (for public events) */}
            {event.external_url && !isCompact && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 font-heading"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(event.external_url, '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Voir détails
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

export default EventCard;
