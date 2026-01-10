'use client';

import { X, Sun, Thermometer, Palette, Heart, Bed, Wind, Volume2, Sparkles, Home, Maximize } from 'lucide-react';
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

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: {
    id: string;
    name: string;
    size: number;
    price: number;
    has_private_bathroom: boolean;
    has_balcony: boolean;
    floor_level?: number;
    available_from: string;
    aesthetics?: PropertyRoomAesthetics;
  };
}

export default function RoomDetailsModal({ isOpen, onClose, room }: RoomDetailsModalProps) {
  const { language, getSection } = useLanguage();
  const roomDetails = getSection('property')?.roomDetails;

  // Locale map for date formatting
  const localeMap: Record<string, string> = {
    fr: 'fr-FR',
    en: 'en-US',
    nl: 'nl-NL',
    de: 'de-DE',
  };

  if (!isOpen) return null;

  const aesthetics = room.aesthetics;

  // Helper function to render rating bars
  const renderRating = (rating: number, label: string) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-searcher-500 rounded-full transition-all"
            style={{ width: `${(rating / 10) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-searcher-600 w-8">{rating}/10</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white superellipse-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between superellipse-t-2xl">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{room.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {room.size}m² · {room.price}€/{roomDetails?.perMonth || 'mois'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-searcher-50 superellipse-xl">
                <Maximize className="w-5 h-5 text-searcher-600" />
                <div>
                  <p className="text-xs text-gray-600">{roomDetails?.surface || 'Surface'}</p>
                  <p className="font-semibold text-gray-900">{room.size} m²</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 superellipse-xl">
                <Home className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">{roomDetails?.floor || 'Étage'}</p>
                  <p className="font-semibold text-gray-900">
                    {room.floor_level ? `${room.floor_level}e` : (roomDetails?.notSpecified || 'Non spécifié')}
                  </p>
                </div>
              </div>

              {room.has_balcony && (
                <div className="flex items-center gap-3 p-4 bg-green-50 superellipse-xl">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">{roomDetails?.extras || 'Extras'}</p>
                    <p className="font-semibold text-gray-900">{roomDetails?.balcony || 'Balcon'}</p>
                  </div>
                </div>
              )}

              {room.has_private_bathroom && (
                <div className="flex items-center gap-3 p-4 bg-purple-50 superellipse-xl">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">{roomDetails?.bathroom || 'Salle de bain'}</p>
                    <p className="font-semibold text-gray-900">{roomDetails?.private || 'Privée'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Aesthetics Section */}
            {aesthetics && (
              <>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-searcher-600" />
                    {roomDetails?.ambianceComfort || 'Ambiance & Confort'}
                  </h3>

                  <div className="space-y-4">
                    {/* Natural Light */}
                    {aesthetics.natural_light_rating && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Sun className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-gray-900">{roomDetails?.naturalLight || 'Lumière naturelle'}</span>
                        </div>
                        {renderRating(aesthetics.natural_light_rating, roomDetails?.brightness || 'Luminosité')}
                        {aesthetics.sun_exposure && (
                          <p className="text-sm text-gray-600 ml-6">
                            {roomDetails?.exposure || 'Exposition'}: {SUN_EXPOSURE_LABELS[aesthetics.sun_exposure]}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Heating */}
                    {aesthetics.heating_type && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-gray-900">{roomDetails?.heating || 'Chauffage'}</span>
                        </div>
                        <p className="text-sm text-gray-600 ml-6">
                          {roomDetails?.type || 'Type'}: {HEATING_TYPE_LABELS[aesthetics.heating_type]}
                        </p>
                        {aesthetics.heating_quality_rating && (
                          renderRating(aesthetics.heating_quality_rating, roomDetails?.quality || 'Qualité')
                        )}
                      </div>
                    )}

                    {/* Design Style */}
                    {aesthetics.design_style && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Palette className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-gray-900">{roomDetails?.designStyle || 'Style design'}</span>
                        </div>
                        <p className="text-sm text-gray-600 ml-6">
                          {DESIGN_STYLE_LABELS[aesthetics.design_style]}
                        </p>
                        {aesthetics.color_palette && (
                          <p className="text-sm text-gray-500 ml-6">
                            {roomDetails?.palette || 'Palette'}: {aesthetics.color_palette}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Room Atmosphere */}
                    {aesthetics.room_atmosphere && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-pink-600" />
                          <span className="text-sm font-medium text-gray-900">{roomDetails?.atmosphere || 'Atmosphère'}</span>
                        </div>
                        <p className="text-sm text-gray-600 ml-6">
                          {ROOM_ATMOSPHERE_LABELS[aesthetics.room_atmosphere]}
                        </p>
                      </div>
                    )}

                    {/* Furniture */}
                    {aesthetics.furniture_style && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Bed className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium text-gray-900">{roomDetails?.furniture || 'Mobilier'}</span>
                        </div>
                        <p className="text-sm text-gray-600 ml-6">
                          {roomDetails?.style || 'Style'}: {FURNITURE_STYLE_LABELS[aesthetics.furniture_style]}
                        </p>
                        {aesthetics.furniture_condition && (
                          <p className="text-sm text-gray-600 ml-6">
                            {roomDetails?.condition || 'Condition'}: {aesthetics.furniture_condition === 'new' ? (roomDetails?.conditionNew || 'Neuf') :
                                       aesthetics.furniture_condition === 'excellent' ? (roomDetails?.conditionExcellent || 'Excellent') :
                                       aesthetics.furniture_condition === 'good' ? (roomDetails?.conditionGood || 'Bon') :
                                       aesthetics.furniture_condition === 'fair' ? (roomDetails?.conditionFair || 'Correct') : (roomDetails?.conditionNeedsReplacement || 'À remplacer')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Air Quality */}
                    {aesthetics.air_quality_rating && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Wind className="w-4 h-4 text-cyan-600" />
                          <span className="text-sm font-medium text-gray-900">{roomDetails?.airQuality || 'Qualité de l\'air'}</span>
                        </div>
                        {renderRating(aesthetics.air_quality_rating, roomDetails?.quality || 'Qualité')}
                      </div>
                    )}

                    {/* Noise Insulation */}
                    {aesthetics.noise_insulation_rating && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Volume2 className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{roomDetails?.noiseInsulation || 'Isolation phonique'}</span>
                        </div>
                        {renderRating(aesthetics.noise_insulation_rating, roomDetails?.insulation || 'Isolation')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Features */}
                {(aesthetics.has_plants ||
                  aesthetics.has_artwork ||
                  aesthetics.has_mood_lighting ||
                  aesthetics.has_smart_home_features) && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {roomDetails?.specialFeatures || 'Caractéristiques spéciales'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {aesthetics.has_plants && (
                        <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {roomDetails?.plants || 'Plantes'}
                        </span>
                      )}
                      {aesthetics.has_artwork && (
                        <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {roomDetails?.artwork || 'Artwork'}
                        </span>
                      )}
                      {aesthetics.has_mood_lighting && (
                        <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          {roomDetails?.moodLighting || 'Éclairage d\'ambiance'}
                        </span>
                      )}
                      {aesthetics.has_smart_home_features && (
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {roomDetails?.smartHome || 'Smart Home'}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                {(aesthetics.flooring_type || aesthetics.ceiling_height_cm) && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {roomDetails?.additionalInfo || 'Informations complémentaires'}
                    </h3>
                    <div className="space-y-2">
                      {aesthetics.flooring_type && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{roomDetails?.flooring || 'Sol'}:</span> {aesthetics.flooring_type}
                        </p>
                      )}
                      {aesthetics.ceiling_height_cm && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{roomDetails?.ceilingHeight || 'Hauteur sous plafond'}:</span>{' '}
                          {(aesthetics.ceiling_height_cm / 100).toFixed(2)}m
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* No Aesthetics Message */}
            {!aesthetics && (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  {roomDetails?.noDetailsAvailable || 'Les détails d\'ambiance de cette chambre ne sont pas encore disponibles'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 superellipse-b-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{roomDetails?.availableFrom || 'Disponible à partir du'}</p>
                <p className="font-semibold text-gray-900">
                  {new Date(room.available_from).toLocaleDateString(localeMap[language] || 'en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{roomDetails?.monthlyPrice || 'Prix mensuel'}</p>
                <p className="text-2xl font-bold text-searcher-600">{room.price}€</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
