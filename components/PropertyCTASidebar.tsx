'use client';

import { useState } from 'react';
import { RoomWithTotal, PropertyCosts } from '@/types/room.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Video, Phone, Send, User, MapPin, Mail, Building2 } from 'lucide-react';
import RoomPricingSelector from '@/components/RoomPricingSelector';
import CostBreakdownCard from '@/components/CostBreakdownCard';
import ScheduleTourModal from '@/components/ScheduleTourModal';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';
import { useTheme } from '@/contexts/ThemeContext';

// ============================================
// V3-fun Searcher Color System
// ============================================
const SEARCHER_COLORS = {
  primary: '#ffa000',
  hover: '#D98400',
  accent: '#FBBF24',
  subtle: '#FCD34D',
  light: '#FDE68A',
  dark: '#A16300',
  card: '#FFFBEB',
  cardDark: 'rgba(255, 160, 0, 0.08)',
  border: 'rgba(255, 160, 0, 0.15)',
  borderDark: 'rgba(255, 160, 0, 0.25)',
  gradient: 'linear-gradient(135deg, #ffa000 0%, #D98400 100%)',
};

interface PropertyOwner {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  profile_photo_url?: string;
  company_name?: string;
}

interface PropertyCTASidebarProps {
  rooms: RoomWithTotal[];
  costs: PropertyCosts;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  owner?: PropertyOwner;
  hasVirtualTour?: boolean;
  className?: string;
}

export default function PropertyCTASidebar({
  rooms,
  costs,
  propertyId,
  propertyTitle,
  propertyAddress,
  owner,
  hasVirtualTour = false,
  className
}: PropertyCTASidebarProps) {
  const { language, getSection } = useLanguage();
  const property = getSection('property');
  const common = getSection('common');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Locale map for date formatting
  const localeMap: Record<string, string> = {
    fr: 'fr-FR',
    en: 'en-US',
    nl: 'nl-NL',
    de: 'de-DE',
  };

  const [selectedRoom, setSelectedRoom] = useState<RoomWithTotal | undefined>(
    rooms.find(r => r.is_available) || rooms[0]
  );
  const [showScheduleTour, setShowScheduleTour] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);

  // Get cheapest available room for default selection
  const cheapestRoom = rooms
    .filter(r => r.is_available)
    .reduce((min, room) => room.price < min.price ? room : min, rooms[0]);

  const handleRoomSelect = (room: RoomWithTotal) => {
    setSelectedRoom(room);
  };

  const handleScheduleTour = () => {
    setShowScheduleTour(true);
  };

  const handleVirtualTour = () => {
    setShowVirtualTour(true);
  };

  const handleContact = () => {
    // Open contact form or email
    if (owner?.email) {
      window.location.href = `mailto:${owner.email}?subject=${property?.sidebar?.interestedIn || 'Intéressé par'} ${propertyTitle}`;
    }
  };

  const handleApply = () => {
    // Navigate to application page
    window.location.href = `/properties/${propertyId}/apply?room=${selectedRoom?.id}`;
  };

  // Debug log
  console.log('PropertyCTASidebar - owner prop:', owner);
  console.log('PropertyCTASidebar - owner exists?', !!owner);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Property Owner Card */}
      {owner && (
        <Card
          className="superellipse-2xl border-0"
          style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
            boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)',
            border: `1px solid ${isDark ? SEARCHER_COLORS.borderDark : SEARCHER_COLORS.border}`,
          }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-5 h-5" style={{ color: SEARCHER_COLORS.primary }} />
              {property?.sidebar?.ownerContact || 'Votre contact propriétaire'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <div
                className="w-14 h-14 superellipse-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
                }}
              >
                {owner.profile_photo_url ? (
                  <img
                    src={owner.profile_photo_url}
                    alt={`${owner.first_name} ${owner.last_name}`}
                    className="w-full h-full superellipse-xl object-cover"
                  />
                ) : (
                  <User className="w-7 h-7" style={{ color: isDark ? '#9ca3af' : '#6b7280' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-base ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {owner.first_name} {owner.last_name}
                </p>
                {owner.company_name && (
                  <div className={`flex items-center gap-1 text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="truncate">{owner.company_name}</span>
                  </div>
                )}
                {owner.email && (
                  <div className={`flex items-center gap-1 text-xs mt-1.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{owner.email}</span>
                  </div>
                )}
                {owner.phone && (
                  <div className={`flex items-center gap-1 text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    <Phone className="w-3.5 h-3.5" />
                    <span>{owner.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Trust badges - V3-fun style */}
            <div className={`flex items-center gap-2 mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
              <div
                className="flex items-center gap-1 text-xs px-2 py-1 superellipse-full"
                style={{
                  background: isDark ? SEARCHER_COLORS.cardDark : SEARCHER_COLORS.card,
                  color: isDark ? SEARCHER_COLORS.subtle : SEARCHER_COLORS.dark,
                }}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{property?.sidebar?.verified || 'Vérifié'}</span>
              </div>
              <div
                className="flex items-center gap-1 text-xs px-2 py-1 superellipse-full"
                style={{
                  background: isDark ? SEARCHER_COLORS.cardDark : SEARCHER_COLORS.card,
                  color: isDark ? SEARCHER_COLORS.subtle : SEARCHER_COLORS.dark,
                }}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">{property?.sidebar?.responsive || 'Réactif'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Room Selection */}
      <Card
        className="sticky top-24 superellipse-2xl border-0"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
          boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        <CardHeader>
          <CardTitle className="text-lg">{property?.sidebar?.selectRoom || 'Sélectionnez votre chambre'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoomPricingSelector
            rooms={rooms}
            selectedRoomId={selectedRoom?.id}
            onRoomSelect={handleRoomSelect}
            showFeatures={true}
          />

          {/* Cost Breakdown */}
          {selectedRoom && (
            <CostBreakdownCard
              selectedRoom={selectedRoom}
              costs={costs}
              className="mt-4"
            />
          )}

          {/* Primary CTAs */}
          <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <Button
              onClick={handleApply}
              className="w-full text-white font-semibold py-6 superellipse-xl transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{
                background: SEARCHER_COLORS.gradient,
              }}
              disabled={!selectedRoom?.is_available}
            >
              <Send className="w-5 h-5 mr-2" />
              {property?.sidebar?.applyForRoom || 'Candidater pour cette chambre'}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleScheduleTour}
                variant="outline"
                className="superellipse-xl transition-all hover:scale-[1.02]"
                style={{
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                  color: isDark ? '#d1d5db' : '#374151',
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'transparent',
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {property?.sidebar?.visit || 'Visite'}
              </Button>
              <Button
                onClick={handleVirtualTour}
                variant="outline"
                className="superellipse-xl transition-all hover:scale-[1.02]"
                style={{
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                  color: isDark ? '#d1d5db' : '#374151',
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'transparent',
                }}
              >
                <Video className="w-4 h-4 mr-2" />
                {property?.sidebar?.virtual || 'Virtuelle'}
              </Button>
            </div>

            <Button
              onClick={handleContact}
              variant="outline"
              className="w-full superellipse-xl transition-all hover:scale-[1.02]"
              style={{
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                color: isDark ? '#d1d5db' : '#374151',
                background: isDark ? 'rgba(255,255,255,0.03)' : 'transparent',
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              {property?.sidebar?.contactOwner || 'Contacter le propriétaire'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Property Info Summary */}
      <Card
        className="superellipse-2xl border-0"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
          boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: SEARCHER_COLORS.primary }} />
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{propertyAddress}</p>
            </div>
            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Calendar className="w-4 h-4" style={{ color: SEARCHER_COLORS.primary }} />
              <span>
                {selectedRoom?.is_available
                  ? selectedRoom.available_from
                    ? `${property?.sidebar?.availableFrom || 'Disponible dès le'} ${new Date(selectedRoom.available_from).toLocaleDateString(localeMap[language] || 'en-US')}`
                    : property?.sidebar?.availableNow || 'Disponible immédiatement'
                  : property?.sidebar?.occupied || 'Occupée'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mini Calendar for Availability */}
      {selectedRoom?.available_from && (
        <Card
          className="superellipse-2xl border-0"
          style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
            boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: SEARCHER_COLORS.primary }} />
              {property?.sidebar?.availability || 'Disponibilité'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="superellipse-xl p-4 text-center"
              style={{
                background: isDark ? SEARCHER_COLORS.cardDark : SEARCHER_COLORS.card,
                border: `1px solid ${isDark ? SEARCHER_COLORS.borderDark : SEARCHER_COLORS.border}`,
              }}
            >
              <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{property?.sidebar?.availableStarting || 'Disponible à partir du'}</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                {new Date(selectedRoom.available_from).toLocaleDateString(localeMap[language] || 'en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trust Badges - V3-fun */}
      <Card
        className="superellipse-2xl border-0"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : SEARCHER_COLORS.card,
          boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.04)',
          border: `1px solid ${isDark ? SEARCHER_COLORS.borderDark : SEARCHER_COLORS.border}`,
        }}
      >
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 superellipse-full flex items-center justify-center"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
                }}
              >
                <span style={{ color: '#22c55e' }}>✓</span>
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{property?.sidebar?.propertyVerified || 'Propriété vérifiée'}</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 superellipse-full flex items-center justify-center"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
                }}
              >
                <span style={{ color: '#22c55e' }}>✓</span>
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{property?.sidebar?.securePayment || 'Paiement sécurisé'}</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 superellipse-full flex items-center justify-center"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
                }}
              >
                <span style={{ color: '#22c55e' }}>✓</span>
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{property?.sidebar?.standardLease || 'Contrat de bail standard'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Tour Modal */}
      {showScheduleTour && (
        <ScheduleTourModal
          propertyId={propertyId}
          propertyTitle={propertyTitle}
          isOpen={showScheduleTour}
          onClose={() => setShowScheduleTour(false)}
          hasVirtualTour={hasVirtualTour}
        />
      )}

      {/* Virtual Tour Modal - V3-fun style */}
      {showVirtualTour && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <Card
            className="max-w-4xl w-full superellipse-2xl border-0"
            style={{
              background: isDark ? 'rgba(30,30,40,0.98)' : '#FFFFFF',
              boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
            }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" style={{ color: SEARCHER_COLORS.primary }} />
                  {property?.sidebar?.virtualTour || 'Visite virtuelle'}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVirtualTour(false)}
                  className="superellipse-lg"
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                  }}
                >
                  {common?.close || 'Fermer'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="aspect-video superellipse-xl flex items-center justify-center"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                }}
              >
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>{property?.sidebar?.virtualTourComingSoon || 'Visite virtuelle à venir'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
