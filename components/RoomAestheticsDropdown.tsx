'use client';

import { useState } from 'react';
import { ChevronDown, Sun, Thermometer, Palette, Bed, Wind, Volume2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PropertyRoomAesthetics,
  DESIGN_STYLE_LABELS,
  HEATING_TYPE_LABELS,
  FURNITURE_STYLE_LABELS,
  ROOM_ATMOSPHERE_LABELS,
  SUN_EXPOSURE_LABELS,
  getRatingLabel,
  getDesignStyleIconName,
} from '@/types/room-aesthetics.types';
import { useLanguage } from '@/lib/i18n/use-language';

interface RoomAestheticsDropdownProps {
  aesthetics?: PropertyRoomAesthetics;
  isOpen: boolean;
  onToggle: () => void;
}

export default function RoomAestheticsDropdown({
  aesthetics,
  isOpen,
  onToggle,
}: RoomAestheticsDropdownProps) {
  const { getSection } = useLanguage();
  const roomAesthetics = getSection('property')?.roomAesthetics;

  if (!aesthetics) return null;

  const hasAnyData =
    aesthetics.natural_light_rating ||
    aesthetics.heating_type ||
    aesthetics.design_style ||
    aesthetics.room_atmosphere ||
    aesthetics.furniture_style;

  if (!hasAnyData) return null;

  return (
    <div className="mt-2 border-t pt-2">
      {/* Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="w-full flex items-center justify-between text-xs text-gray-600 hover:text-searcher-600 transition-colors py-1"
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-medium">{roomAesthetics?.detailsAmbiance || 'Détails & Ambiance'}</span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="mt-2 space-y-2 text-xs bg-gray-50 rounded-lg p-3 border border-gray-100">
          {/* Natural Light */}
          {aesthetics.natural_light_rating && (
            <div className="flex items-start gap-2">
              <Sun className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-medium text-gray-700">{roomAesthetics?.naturalLight || 'Lumière naturelle'}</span>
                  <RatingBadge rating={aesthetics.natural_light_rating} />
                </div>
                {aesthetics.sun_exposure && (
                  <p className="text-gray-600">
                    {SUN_EXPOSURE_LABELS[aesthetics.sun_exposure]}
                    {aesthetics.sun_hours_per_day && ` • ${aesthetics.sun_hours_per_day}${roomAesthetics?.hoursPerDay || 'h/jour'}`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Heating */}
          {aesthetics.heating_type && (
            <div className="flex items-start gap-2">
              <Thermometer className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-medium text-gray-700">{roomAesthetics?.heating || 'Chauffage'}</span>
                  {aesthetics.heating_quality_rating && (
                    <RatingBadge rating={aesthetics.heating_quality_rating} />
                  )}
                </div>
                <p className="text-gray-600">{HEATING_TYPE_LABELS[aesthetics.heating_type]}</p>
                {aesthetics.has_individual_temperature_control && (
                  <p className="text-green-600 text-[11px] mt-0.5">
                    ✓ {roomAesthetics?.individualTempControl || 'Contrôle individuel de température'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Design Style */}
          {aesthetics.design_style && (
            <div className="flex items-start gap-2">
              <Palette className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-medium text-gray-700">{roomAesthetics?.decorationStyle || 'Style de décoration'}</span>
                  {aesthetics.design_quality_rating && (
                    <RatingBadge rating={aesthetics.design_quality_rating} />
                  )}
                </div>
                <p className="text-gray-600">
                  {getDesignStyleIconName(aesthetics.design_style)}{' '}
                  {DESIGN_STYLE_LABELS[aesthetics.design_style]}
                </p>
                {aesthetics.color_palette && aesthetics.color_palette.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-gray-500">{roomAesthetics?.colors || 'Couleurs'}:</span>
                    {aesthetics.color_palette.slice(0, 5).map((color, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Room Atmosphere */}
          {aesthetics.room_atmosphere && (
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-medium text-gray-700">{roomAesthetics?.ambiance || 'Ambiance'}: </span>
                <span className="text-gray-600">
                  {ROOM_ATMOSPHERE_LABELS[aesthetics.room_atmosphere]}
                </span>
              </div>
            </div>
          )}

          {/* Furniture */}
          {aesthetics.furniture_style && (
            <div className="flex items-start gap-2">
              <Bed className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-medium text-gray-700">{roomAesthetics?.furniture || 'Mobilier'}</span>
                  {aesthetics.furniture_quality_rating && (
                    <RatingBadge rating={aesthetics.furniture_quality_rating} />
                  )}
                </div>
                <p className="text-gray-600">
                  {FURNITURE_STYLE_LABELS[aesthetics.furniture_style]}
                  {aesthetics.furniture_condition && (
                    <span className="text-gray-500">
                      {' '}
                      • {aesthetics.furniture_condition === 'new' ? (roomAesthetics?.conditionNew || 'Neuf') :
                         aesthetics.furniture_condition === 'excellent' ? (roomAesthetics?.conditionExcellent || 'Excellent état') :
                         aesthetics.furniture_condition === 'good' ? (roomAesthetics?.conditionGood || 'Bon état') :
                         aesthetics.furniture_condition === 'fair' ? (roomAesthetics?.conditionFair || 'État correct') : (roomAesthetics?.conditionNeedsReplacement || 'À remplacer')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Air Quality */}
          {aesthetics.air_quality_rating && (
            <div className="flex items-start gap-2">
              <Wind className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-medium text-gray-700">{roomAesthetics?.airQuality || 'Qualité de l\'air'}</span>
                  <RatingBadge rating={aesthetics.air_quality_rating} />
                </div>
                {aesthetics.ventilation_type && (
                  <p className="text-gray-600 capitalize">
                    {roomAesthetics?.ventilation || 'Ventilation'} {aesthetics.ventilation_type.replace('_', ' ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Noise Insulation */}
          {aesthetics.noise_insulation_rating && (
            <div className="flex items-start gap-2">
              <Volume2 className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-medium text-gray-700">{roomAesthetics?.noiseInsulation || 'Isolation phonique'}</span>
                  <RatingBadge rating={aesthetics.noise_insulation_rating} />
                </div>
                {aesthetics.is_soundproof && (
                  <p className="text-green-600 text-[11px]">✓ {roomAesthetics?.soundproof || 'Insonorisé'}</p>
                )}
              </div>
            </div>
          )}

          {/* Special Features */}
          {(aesthetics.has_plants ||
            aesthetics.has_artwork ||
            aesthetics.has_mood_lighting ||
            aesthetics.has_smart_home_features) && (
            <div className="pt-2 border-t border-gray-200">
              <p className="font-medium text-gray-700 mb-1.5">{roomAesthetics?.specialFeatures || 'Caractéristiques spéciales'}</p>
              <div className="flex flex-wrap gap-1.5">
                {aesthetics.has_plants && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[11px]">
                    {roomAesthetics?.plants || 'Plantes'}
                  </span>
                )}
                {aesthetics.has_artwork && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[11px]">
                    {roomAesthetics?.artwork || 'Œuvres d\'art'}
                  </span>
                )}
                {aesthetics.has_mood_lighting && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[11px]">
                    {roomAesthetics?.moodLighting || 'Éclairage d\'ambiance'}
                  </span>
                )}
                {aesthetics.has_smart_home_features && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[11px]">
                    {roomAesthetics?.smartHome || 'Domotique'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Flooring Info */}
          {aesthetics.flooring_type && (
            <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-200">
              {roomAesthetics?.floor || 'Sol'}: {aesthetics.flooring_type === 'hardwood' ? (roomAesthetics?.floorHardwood || 'Parquet') :
                    aesthetics.flooring_type === 'laminate' ? (roomAesthetics?.floorLaminate || 'Stratifié') :
                    aesthetics.flooring_type === 'tile' ? (roomAesthetics?.floorTile || 'Carrelage') :
                    aesthetics.flooring_type === 'carpet' ? (roomAesthetics?.floorCarpet || 'Moquette') :
                    aesthetics.flooring_type === 'vinyl' ? (roomAesthetics?.floorVinyl || 'Vinyle') :
                    aesthetics.flooring_type === 'concrete' ? (roomAesthetics?.floorConcrete || 'Béton') :
                    aesthetics.flooring_type === 'marble' ? (roomAesthetics?.floorMarble || 'Marbre') : (roomAesthetics?.floorHardwood || 'Parquet')}
              {aesthetics.ceiling_height_cm && ` • ${roomAesthetics?.height || 'Hauteur'}: ${(aesthetics.ceiling_height_cm / 100).toFixed(1)}m`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Rating Badge Component
function RatingBadge({ rating }: { rating: number }) {
  const { label, color } = getRatingLabel(rating);
  const colorClasses = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-700',
  };

  return (
    <span
      className={cn(
        'px-1.5 py-0.5 rounded text-[10px] font-medium',
        colorClasses[color as keyof typeof colorClasses]
      )}
    >
      {rating}/10
    </span>
  );
}
