'use client';

import { useState } from 'react';
import { PropertyRoom, RoomWithTotal } from '@/types/room.types';
import { Badge } from '@/components/ui/badge';
import { Check, Bed, Maximize, Calendar, BathIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomPricingSelectorProps {
  rooms: RoomWithTotal[];
  selectedRoomId?: string;
  onRoomSelect: (room: RoomWithTotal) => void;
  showFeatures?: boolean;
}

export default function RoomPricingSelector({
  rooms,
  selectedRoomId,
  onRoomSelect,
  showFeatures = true
}: RoomPricingSelectorProps) {
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
    if (!dateString) return 'Immédiatement';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">Sélectionnez une chambre</h3>
        <span className="text-sm text-gray-500">{rooms.length} disponible{rooms.length > 1 ? 's' : ''}</span>
      </div>

      {rooms.map((room) => {
        const isSelected = selectedRoomId === room.id;
        const isCheapest = cheapestRoom?.id === room.id;
        const isSoonest = soonestRoom?.id === room.id;

        return (
          <button
            key={room.id}
            onClick={() => onRoomSelect(room)}
            disabled={!room.is_available}
            className={cn(
              "w-full text-left p-4 rounded-xl border-2 transition-all",
              isSelected
                ? "border-orange-500 bg-orange-50 shadow-md"
                : room.is_available
                ? "border-gray-200 hover:border-orange-300 hover:bg-orange-50/30"
                : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
            )}
          >
            <div className="flex items-start justify-between">
              {/* Room Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">
                    {room.room_name || `Chambre ${room.room_number}`}
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
                      Meilleur prix
                    </Badge>
                  )}
                  {isSoonest && room.is_available && !isCheapest && (
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                      Bientôt dispo
                    </Badge>
                  )}
                  {!room.is_available && (
                    <Badge variant="default" className="text-xs bg-gray-200 text-gray-600">
                      Occupée
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
                        <span>Salle de bain privée</span>
                      </div>
                    )}
                    {room.has_balcony && (
                      <div className="flex items-center gap-1">
                        <span>🌿</span>
                        <span>Balcon</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Availability */}
                {room.is_available && room.available_from && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Dispo: {formatDate(room.available_from)}</span>
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
                <div className="text-xs text-gray-500">/mois</div>
                {isSelected && (
                  <div className="text-xs text-gray-600 mt-1">
                    + €{room.utilities_share + room.shared_living_share} charges
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
