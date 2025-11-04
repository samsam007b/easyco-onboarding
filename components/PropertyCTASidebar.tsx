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
      window.location.href = `mailto:${owner.email}?subject=Intéressé par ${propertyTitle}`;
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
      {/* Room Selection */}
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="text-lg">Sélectionnez votre chambre</CardTitle>
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
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-6"
              disabled={!selectedRoom?.is_available}
            >
              <Send className="w-5 h-5 mr-2" />
              Candidater pour cette chambre
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleScheduleTour}
                variant="outline"
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Visite
              </Button>
              <Button
                onClick={handleVirtualTour}
                variant="outline"
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <Video className="w-4 h-4 mr-2" />
                Virtuelle
              </Button>
            </div>

            <Button
              onClick={handleContact}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Phone className="w-4 h-4 mr-2" />
              Contacter le propriétaire
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Property Owner Card - NOUVELLE VERSION SIMPLIFIÉE */}
      <Card className="bg-white border-4 border-red-500">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-red-600">
            CARTE PROPRIÉTAIRE TEST
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">Owner exists: {owner ? 'YES' : 'NO'}</p>
            {owner && (
              <>
                <p className="font-semibold">{owner.first_name} {owner.last_name}</p>
                <p className="text-sm text-gray-600">{owner.email}</p>
                <p className="text-sm text-gray-600">{owner.phone}</p>
              </>
            )}
            {!owner && <p className="text-red-600">NO OWNER DATA!</p>}
          </div>
        </CardContent>
      </Card>

      {/* Property Info Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-700">{propertyAddress}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span>
                {selectedRoom?.is_available
                  ? selectedRoom.available_from
                    ? `Disponible dès le ${new Date(selectedRoom.available_from).toLocaleDateString('fr-FR')}`
                    : 'Disponible immédiatement'
                  : 'Occupée'
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
              <Calendar className="w-5 h-5 text-orange-600" />
              Disponibilité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Disponible à partir du</p>
              <p className="text-2xl font-bold text-orange-600">
                {new Date(selectedRoom.available_from).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trust Badges */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-lg">✓</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Propriété vérifiée</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-lg">🔒</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Paiement sécurisé</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-lg">📋</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Contrat de bail standard</p>
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
                <CardTitle>Visite virtuelle</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVirtualTour(false)}
                >
                  Fermer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Visite virtuelle à venir</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
