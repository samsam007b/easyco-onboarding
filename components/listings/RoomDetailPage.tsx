'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Thermometer,
  Sparkles,
  Bed,
  Ruler,
  Euro,
  Calendar,
  MapPin,
  Home,
  Wind,
  Volume2,
  Eye,
  Palette,
  Lightbulb,
  Check,
  X,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  RoomWithCompleteDetails,
  PropertyRoomAesthetics,
  DESIGN_STYLE_LABELS,
  HEATING_TYPE_LABELS,
  FURNITURE_STYLE_LABELS,
  ROOM_ATMOSPHERE_LABELS,
  SUN_EXPOSURE_LABELS,
  calculateAestheticScore,
  getRatingLabel,
  getNaturalLightDescription,
  formatSunHours,
  getDesignStyleIcon,
} from '@/types/room-aesthetics.types';

interface RoomDetailPageProps {
  room: RoomWithCompleteDetails;
  aesthetics?: PropertyRoomAesthetics;
  onBookVisit?: () => void;
  onFavorite?: () => void;
  onContactOwner?: () => void;
  isFavorited?: boolean;
}

export function RoomDetailPage({
  room,
  aesthetics,
  onBookVisit,
  onFavorite,
  onContactOwner,
  isFavorited = false,
}: RoomDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // Combine room photos and aesthetic photos
  const allPhotos = [
    ...(room.photos || []),
    ...(aesthetics?.aesthetic_photos || []),
    ...(room.property_images || []),
  ];

  const aestheticScore = calculateAestheticScore(aesthetics);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allPhotos.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allPhotos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with actions */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{room.room_name || `Room ${room.room_number}`}</h1>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="w-4 h-4" />
              <span>
                {room.neighborhood}, {room.city}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onFavorite}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Heart
                className={`w-6 h-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Share2 className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="relative bg-black">
        <div className="max-w-7xl mx-auto">
          {allPhotos.length > 0 ? (
            <div className="relative aspect-[16/9]">
              <img
                src={allPhotos[currentImageIndex]}
                alt={`Room photo ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navigation arrows */}
              {allPhotos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Photo counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {allPhotos.length}
              </div>

              {/* Show all photos button */}
              <button
                onClick={() => setShowAllPhotos(true)}
                className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Show all photos
              </button>
            </div>
          ) : (
            <div className="aspect-[16/9] flex items-center justify-center bg-gray-200">
              <Home className="w-24 h-24 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <div className="bg-white superellipse-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {room.room_name || `Room ${room.room_number}`} in {room.property_title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      <span>{room.size_sqm}m²</span>
                    </div>
                    {room.floor_number && (
                      <div className="flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        <span>Floor {room.floor_number}</span>
                      </div>
                    )}
                    {room.has_private_bathroom && (
                      <div className="flex items-center gap-1">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Private bathroom</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Aesthetic Score Badge */}
                {aesthetics && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1 bg-searcher-500 text-white px-4 py-2 rounded-full font-semibold">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-lg">{aestheticScore}/10</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Aesthetic Score</p>
                  </div>
                )}
              </div>

              {room.description && (
                <p className="text-gray-700 leading-relaxed">{room.description}</p>
              )}
            </div>

            {/* Aesthetic Highlights - Your Innovation! */}
            {aesthetics && (
              <div className="bg-white superellipse-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-searcher-600" />
                  Room Aesthetics & Atmosphere
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Natural Light */}
                  {aesthetics.natural_light_rating && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sun className="w-5 h-5 text-yellow-500" />
                          <span className="font-medium">Natural Light</span>
                        </div>
                        <RatingBadge rating={aesthetics.natural_light_rating} />
                      </div>
                      <p className="text-sm text-gray-600">
                        {getNaturalLightDescription(aesthetics.natural_light_rating)}
                      </p>
                      {aesthetics.sun_hours_per_day && (
                        <p className="text-sm text-gray-500">
                          {formatSunHours(aesthetics.sun_hours_per_day, aesthetics.sun_exposure)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Heating */}
                  {aesthetics.heating_type && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-5 h-5 text-red-500" />
                          <span className="font-medium">Heating</span>
                        </div>
                        {aesthetics.heating_quality_rating && (
                          <RatingBadge rating={aesthetics.heating_quality_rating} />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {HEATING_TYPE_LABELS[aesthetics.heating_type]}
                      </p>
                      {aesthetics.has_individual_temperature_control && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Individual temperature control
                        </p>
                      )}
                    </div>
                  )}

                  {/* Design Style */}
                  {aesthetics.design_style && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Palette className="w-5 h-5 text-searcher-500" />
                          <span className="font-medium">Design Style</span>
                        </div>
                        {aesthetics.design_quality_rating && (
                          <RatingBadge rating={aesthetics.design_quality_rating} />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {getDesignStyleIcon(aesthetics.design_style)}{' '}
                        {DESIGN_STYLE_LABELS[aesthetics.design_style]}
                      </p>
                      {aesthetics.color_palette && aesthetics.color_palette.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Colors:</span>
                          <div className="flex gap-1">
                            {aesthetics.color_palette.slice(0, 5).map((color, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Room Atmosphere */}
                  {aesthetics.room_atmosphere && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Atmosphere</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {ROOM_ATMOSPHERE_LABELS[aesthetics.room_atmosphere]}
                      </p>
                    </div>
                  )}

                  {/* Furniture */}
                  {aesthetics.furniture_style && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bed className="w-5 h-5 text-searcher-500" />
                          <span className="font-medium">Furniture</span>
                        </div>
                        {aesthetics.furniture_quality_rating && (
                          <RatingBadge rating={aesthetics.furniture_quality_rating} />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {FURNITURE_STYLE_LABELS[aesthetics.furniture_style]}
                      </p>
                      {aesthetics.furniture_condition && (
                        <p className="text-xs text-gray-500 capitalize">
                          Condition: {aesthetics.furniture_condition.replace('_', ' ')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Air Quality */}
                  {aesthetics.air_quality_rating && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wind className="w-5 h-5 text-cyan-500" />
                          <span className="font-medium">Air Quality</span>
                        </div>
                        <RatingBadge rating={aesthetics.air_quality_rating} />
                      </div>
                      {aesthetics.ventilation_type && (
                        <p className="text-sm text-gray-600 capitalize">
                          {aesthetics.ventilation_type.replace('_', ' ')} ventilation
                        </p>
                      )}
                    </div>
                  )}

                  {/* Noise Level */}
                  {aesthetics.noise_insulation_rating && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">Noise Insulation</span>
                        </div>
                        <RatingBadge rating={aesthetics.noise_insulation_rating} />
                      </div>
                      {aesthetics.is_soundproof && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Soundproof room
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Special Features */}
                {(aesthetics.has_plants ||
                  aesthetics.has_artwork ||
                  aesthetics.has_mood_lighting ||
                  aesthetics.has_smart_home_features) && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Special Features
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {aesthetics.has_plants && <FeaturePill icon="•" label="Indoor plants" />}
                      {aesthetics.has_artwork && <FeaturePill icon="•" label="Artwork" />}
                      {aesthetics.has_mood_lighting && (
                        <FeaturePill icon="•" label="Mood lighting" />
                      )}
                      {aesthetics.has_smart_home_features && (
                        <FeaturePill icon="•" label="Smart home" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Standard Features */}
            <div className="bg-white superellipse-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Room Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FeatureItem
                  icon={room.is_furnished ? Check : X}
                  label="Furnished"
                  available={room.is_furnished}
                />
                <FeatureItem
                  icon={room.has_private_bathroom ? Check : X}
                  label="Private Bathroom"
                  available={room.has_private_bathroom}
                />
                <FeatureItem
                  icon={room.has_balcony ? Check : X}
                  label="Balcony"
                  available={room.has_balcony}
                />
                <FeatureItem
                  icon={room.has_desk ? Check : X}
                  label="Desk"
                  available={room.has_desk}
                />
                <FeatureItem
                  icon={room.has_wardrobe ? Check : X}
                  label="Wardrobe"
                  available={room.has_wardrobe}
                />
                {aesthetics?.has_curtains && (
                  <FeatureItem icon={Check} label="Curtains" available={true} />
                )}
              </div>
            </div>

            {/* Property Amenities */}
            {room.property_amenities && room.property_amenities.length > 0 && (
              <div className="bg-white superellipse-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Property Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {room.property_amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="capitalize">{amenity.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white superellipse-xl p-6 shadow-lg sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{room.total_monthly_cost}€</span>
                  <span className="text-gray-600">/month</span>
                </div>

                {/* Cost Breakdown */}
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Rent:</span>
                    <span>{room.price}€</span>
                  </div>
                  {room.utilities_total && room.utilities_total > 0 && (
                    <div className="flex justify-between">
                      <span>Utilities:</span>
                      <span>{room.utilities_total}€</span>
                    </div>
                  )}
                  {room.shared_living_total && room.shared_living_total > 0 && (
                    <div className="flex justify-between">
                      <span>Shared costs:</span>
                      <span>{room.shared_living_total}€</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability */}
              {room.available_from && (
                <div className="mb-6 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Available from {new Date(room.available_from).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onBookVisit}
                  className="w-full bg-searcher-500 text-white py-3 rounded-lg font-semibold hover:bg-searcher-600 transition-all shadow-md"
                >
                  Book a Visit
                </button>
                <button
                  onClick={onContactOwner}
                  className="w-full border-2 border-searcher-600 text-searcher-600 py-3 rounded-lg font-semibold hover:bg-searcher-50 transition-colors"
                >
                  Contact Owner
                </button>
              </div>

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{room.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4" />
                  <span>All costs included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components

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
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color as keyof typeof colorClasses]}`}>
      {rating}/10 · {label}
    </span>
  );
}

function FeatureItem({
  icon: Icon,
  label,
  available,
}: {
  icon: React.ElementType;
  label: string;
  available: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${available ? 'text-gray-700' : 'text-gray-400'}`}>
      <Icon className={`w-4 h-4 ${available ? 'text-green-600' : 'text-gray-400'}`} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

function FeaturePill({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-searcher-50 rounded-lg text-sm text-searcher-900">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
