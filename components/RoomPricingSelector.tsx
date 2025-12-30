'use client';

import { useState } from 'react';
import { PropertyRoom, RoomWithTotal } from '@/types/room.types';
import { PropertyRoomAesthetics } from '@/types/room-aesthetics.types';
import { Badge } from '@/components/ui/badge';
import { Check, Bed, Maximize, Calendar, BathIcon, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import RoomAesthetics from './RoomAestheticsDropdown';
import RoomDetailsModal from './RoomDetailsModal';
import { useLanguage } from '@/lib/i18n/use-language';

interface RoomWithAesthetics extends RoomWithTotal {
  aesthetics?: PropertyRoomAesthetics;
}

interface RoomPricingSelectorProps {
  rooms: RoomWithAesthetics[];
  selectedRoomId?: string;
  onRoomSelect: (room: RoomWithAesthetics) => void;
  showFeatures?: boolean;
}

export default function RoomPricingSelector({
  rooms,
  selectedRoomId,
  onRoomSelect,
  showFeatures = true
}: RoomPricingSelectorProps) {
  const { language, getSection } = useLanguage();
  const roomSelector = getSection('property')?.roomSelector;

  // Locale map for date formatting
  const localeMap: Record<string, string> = {
    fr: 'fr-FR',
    en: 'en-US',
    nl: 'nl-NL',
    de: 'de-DE',
  };

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedRoomForModal, setSelectedRoomForModal] = useState<RoomWithAesthetics | null>(null);

  // Find cheapest and soonest available rooms
  const cheapestRoom = rooms.reduce((min, room) =>
    room.is_available && room.price < min.price ? room : min
  , rooms[0]);

  const soonestRoom = rooms
    .filter(r => r.is_available && r.available_from)
    .sort((a, b) =>
      new Date(a.available_from!).getTime() - new Date(b.available_from!).getTime()
    )[0];

  const formatDate = (dateString?: string) => {
    if (!dateString) return roomSelector?.immediately || 'Immédiatement';
    const date = new Date(dateString);
    return date.toLocaleDateString(localeMap[language] || 'en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{roomSelector?.selectRoom || 'Sélectionnez une chambre'}</h3>
        <span className="text-sm text-gray-500">{rooms.length} {rooms.length > 1 ? (roomSelector?.availablePlural || 'disponibles') : (roomSelector?.available || 'disponible')}</span>
      </div>

      {rooms.map((room) => {
        const isSelected = selectedRoomId === room.id;
        const isCheapest = cheapestRoom?.id === room.id;
        const isSoonest = soonestRoom?.id === room.id;
        const isDropdownOpen = openDropdownId === room.id;

        return (
          <div
            key={room.id}
            className={cn(
              "w-full text-left p-4 rounded-xl border-2 transition-all",
              isSelected
                ? "border-orange-500 bg-orange-50 shadow-md"
                : room.is_available
                ? "border-gray-200 hover:border-orange-300 hover:bg-orange-50/30"
                : "border-gray-100 bg-gray-50 opacity-60"
            )}
          >
            <button
              onClick={() => {
                if (room.is_available) {
                  onRoomSelect(room);
                }
              }}
              disabled={!room.is_available}
              className="w-full text-left"
            >
              <div className="flex items-start justify-between">
                {/* Room Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {room.room_name || `${roomSelector?.room || 'Chambre'} ${room.room_number}`}
                    </h4>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {isCheapest && room.is_available && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        {roomSelector?.bestPrice || 'Meilleur prix'}
                      </Badge>
                    )}
                    {isSoonest && room.is_available && !isCheapest && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        {roomSelector?.soonAvailable || 'Bientôt dispo'}
                      </Badge>
                    )}
                    {!room.is_available && (
                      <Badge variant="default" className="text-xs bg-gray-200 text-gray-600">
                        {roomSelector?.occupied || 'Occupée'}
                      </Badge>
                    )}
                  </div>

                  {/* Features (if enabled and room is available/selected) */}
                  {showFeatures && (room.is_available || isSelected) && (
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-2">
                      {room.size_sqm && (
                        <div className="flex items-center gap-1">
                          <Maximize className="w-3 h-3" />
                          <span>{room.size_sqm}m²</span>
                        </div>
                      )}
                      {room.has_private_bathroom && (
                        <div className="flex items-center gap-1">
                          <BathIcon className="w-3 h-3" />
                          <span>{roomSelector?.privateBathroom || 'Salle de bain privée'}</span>
                        </div>
                      )}
                      {room.has_balcony && (
                        <div className="flex items-center gap-1">
                          <span>🌿</span>
                          <span>{roomSelector?.balcony || 'Balcon'}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Availability */}
                  {room.is_available && room.available_from && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{roomSelector?.availablePrefix || 'Dispo:'} {formatDate(room.available_from)}</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-right ml-4">
                  <div className={cn(
                    "text-xl font-bold",
                    isSelected ? "text-orange-600" : "text-gray-900"
                  )}>
                    €{room.price}
                  </div>
                  <div className="text-xs text-gray-500">{roomSelector?.perMonth || '/mois'}</div>
                  {isSelected && (
                    <div className="text-xs text-gray-600 mt-1">
                      + €{room.utilities_share + room.shared_living_share} {roomSelector?.charges || 'charges'}
                    </div>
                  )}
                </div>
              </div>
            </button>

            {/* View Details Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRoomForModal(room);
              }}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">{roomSelector?.viewAllDetails || 'Voir tous les détails'}</span>
            </button>

            {/* Aesthetics Dropdown (kept for backward compatibility) */}
            {room.aesthetics && false && (
              <RoomAesthetics
                aesthetics={room.aesthetics}
                isOpen={isDropdownOpen}
                onToggle={() => setOpenDropdownId(isDropdownOpen ? null : room.id)}
              />
            )}
          </div>
        );
      })}

      {/* Room Details Modal */}
      {selectedRoomForModal && (
        <RoomDetailsModal
          isOpen={!!selectedRoomForModal}
          onClose={() => setSelectedRoomForModal(null)}
          room={{
            id: selectedRoomForModal.id,
            name: selectedRoomForModal.room_name || `Chambre ${selectedRoomForModal.room_number}`,
            size: selectedRoomForModal.size_sqm || 0,
            price: selectedRoomForModal.price,
            has_private_bathroom: selectedRoomForModal.has_private_bathroom || false,
            has_balcony: selectedRoomForModal.has_balcony || false,
            floor_level: selectedRoomForModal.floor_number,
            available_from: selectedRoomForModal.available_from || new Date().toISOString(),
            aesthetics: selectedRoomForModal.aesthetics,
          }}
        />
      )}
    </div>
  );
}
