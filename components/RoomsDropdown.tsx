'use client';

import { useState } from 'react';
import { ChevronDown, Bed, Euro, Ruler, Bath, Armchair, Wind, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoomWithTotal } from '@/types/room.types';
import { useRouter } from 'next/navigation';

interface RoomsDropdownProps {
  rooms: RoomWithTotal[];
  propertyId: string;
  className?: string;
}

export default function RoomsDropdown({ rooms, propertyId, className }: RoomsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!rooms || rooms.length === 0) return null;

  const availableRooms = rooms.filter(room => room.is_available);

  if (availableRooms.length === 0) return null;

  const handleRoomClick = (roomId: string) => {
    // Navigate to property page with room highlighted
    router.push(`/properties/${propertyId}#room-${roomId}`);
  };

  return (
    <div className={cn('mt-3', className)}>
      {/* Toggle Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-purple-50 to-orange-50 hover:from-purple-100 hover:to-orange-100 rounded-lg transition-colors border border-purple-100"
      >
        <div className="flex items-center gap-2">
          <Bed className="w-4 h-4 text-purple-600" />
          <span className="font-semibold text-sm text-gray-900">
            {availableRooms.length} {availableRooms.length > 1 ? 'chambres disponibles' : 'chambre disponible'}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-600 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="mt-2 space-y-2 max-h-96 overflow-y-auto">
          {availableRooms.map((room) => (
            <div
              key={room.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRoomClick(room.id);
              }}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
            >
              {/* Room Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {room.room_name || `Chambre ${room.room_number}`}
                  </h4>
                  {room.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {room.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end ml-3">
                  <span className="text-lg font-bold text-purple-600">
                    €{room.price}
                  </span>
                  <span className="text-xs text-gray-500">/mois</span>
                </div>
              </div>

              {/* Room Features Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {room.size_sqm && (
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{room.size_sqm}m²</span>
                  </div>
                )}
                {room.has_private_bathroom && (
                  <div className="flex items-center gap-1.5 text-green-600">
                    <Bath className="w-3.5 h-3.5" />
                    <span>SdB privée</span>
                  </div>
                )}
                {room.is_furnished && (
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <Armchair className="w-3.5 h-3.5" />
                    <span>Meublée</span>
                  </div>
                )}
                {room.has_balcony && (
                  <div className="flex items-center gap-1.5 text-orange-600">
                    <Wind className="w-3.5 h-3.5" />
                    <span>Balcon</span>
                  </div>
                )}
                {room.window_view && room.window_view !== 'none' && (
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="capitalize">{room.window_view}</span>
                  </div>
                )}
              </div>

              {/* Total Cost Breakdown */}
              {(room.utilities_share > 0 || room.shared_living_share > 0) && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Coût total/mois:</span>
                    <span className="font-semibold text-gray-900">
                      €{room.total_monthly_cost}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    (Loyer + charges €{room.utilities_share + room.shared_living_share})
                  </div>
                </div>
              )}

              {/* Available From */}
              {room.available_from && (
                <div className="mt-2 text-xs text-purple-600 font-medium">
                  Disponible dès le {new Date(room.available_from).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
