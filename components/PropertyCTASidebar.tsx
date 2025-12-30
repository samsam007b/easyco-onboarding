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
        <Card className="border-orange-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              {property?.sidebar?.ownerContact || 'Votre contact propriétaire'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                {owner.profile_photo_url ? (
                  <img
                    src={owner.profile_photo_url}
                    alt={`${owner.first_name} ${owner.last_name}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-base">
                  {owner.first_name} {owner.last_name}
                </p>
                {owner.company_name && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="truncate">{owner.company_name}</span>
                  </div>
                )}
                {owner.email && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{owner.email}</span>
                  </div>
                )}
                {owner.phone && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{owner.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Trust badges - V1 Discret */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{property?.sidebar?.verified || 'Vérifié'}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
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
      <Card className="sticky top-24">
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
          <div className="space-y-3 pt-4 border-t">
            <Button
              onClick={handleApply}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6"
              disabled={!selectedRoom?.is_available}
            >
              <Send className="w-5 h-5 mr-2" />
              {property?.sidebar?.applyForRoom || 'Candidater pour cette chambre'}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleScheduleTour}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {property?.sidebar?.visit || 'Visite'}
              </Button>
              <Button
                onClick={handleVirtualTour}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Video className="w-4 h-4 mr-2" />
                {property?.sidebar?.virtual || 'Virtuelle'}
              </Button>
            </div>

            <Button
              onClick={handleContact}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Phone className="w-4 h-4 mr-2" />
              {property?.sidebar?.contactOwner || 'Contacter le propriétaire'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Property Info Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-700">{propertyAddress}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-500" />
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              {property?.sidebar?.availability || 'Disponibilité'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">{property?.sidebar?.availableStarting || 'Disponible à partir du'}</p>
              <p className="text-2xl font-bold text-gray-900">
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

      {/* Trust Badges - V1 Discret */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                <span className="text-lg">✓</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{property?.sidebar?.propertyVerified || 'Propriété vérifiée'}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                <span className="text-lg">🔒</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{property?.sidebar?.securePayment || 'Paiement sécurisé'}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                <span className="text-lg">📋</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{property?.sidebar?.standardLease || 'Contrat de bail standard'}</p>
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

      {/* Virtual Tour Modal - Simple for now */}
      {showVirtualTour && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{property?.sidebar?.virtualTour || 'Visite virtuelle'}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVirtualTour(false)}
                >
                  {common?.close || 'Fermer'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">{property?.sidebar?.virtualTourComingSoon || 'Visite virtuelle à venir'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
