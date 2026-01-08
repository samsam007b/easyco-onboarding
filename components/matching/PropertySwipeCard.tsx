'use client';

import { useState, useCallback, memo } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import {
  Heart,
  X,
  MapPin,
  Euro,
  Home,
  Users,
  Sparkles,
  Info,
  Star,
  Bed,
  Bath,
  Calendar,
  Wifi,
  Car,
  Utensils,
  Sofa,
  TreeDeciduous,
  Cigarette,
  Dog,
  ChevronRight,
  Shield,
  TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

interface PropertySwipeCardProps {
  property: any;
  compatibilityScore?: number;
  residents?: any[];
  onSwipe: (direction: 'left' | 'right' | 'super') => void;
  onCardClick?: () => void;
  style?: React.CSSProperties;
  isPreview?: boolean;
  index?: number;
}

export const PropertySwipeCard = memo(function PropertySwipeCard({
  property,
  compatibilityScore,
  residents = [],
  onSwipe,
  onCardClick,
  style,
  isPreview = false,
  index = 0
}: PropertySwipeCardProps) {
  const { getSection } = useLanguage();
  const matching = getSection('matching');
  const [showDetails, setShowDetails] = useState(false);
  const [exitX, setExitX] = useState(0);
  const [exitY, setExitY] = useState(0);
  const [swipeType, setSwipeType] = useState<'left' | 'right' | 'super' | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-25, 25]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

  // Like/Pass indicators opacity
  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const passOpacity = useTransform(x, [-150, 0], [1, 0]);
  const superLikeOpacity = useTransform(y, [-150, 0], [1, 0]);

  const getCompatibilityColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 90) return 'bg-emerald-100 text-emerald-700';
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 70) return 'bg-searcher-100 text-searcher-700';
    return 'bg-searcher-100 text-searcher-700';
  };

  const getCompatibilityEmoji = (score?: number) => {
    if (!score) return '🏠';
    if (score >= 90) return '💚';
    if (score >= 80) return '✨';
    if (score >= 70) return '👍';
    return '🤔';
  };

  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 120;
    const superLikeThreshold = 150;

    // Super Like (swipe up)
    if (info.offset.y < -superLikeThreshold) {
      setExitY(-1200);
      setSwipeType('super');
      setTimeout(() => onSwipe('super'), 100);
    }
    // Like (swipe right)
    else if (info.offset.x > swipeThreshold) {
      setExitX(1200);
      setSwipeType('right');
      setTimeout(() => onSwipe('right'), 100);
    }
    // Pass (swipe left)
    else if (info.offset.x < -swipeThreshold) {
      setExitX(-1200);
      setSwipeType('left');
      setTimeout(() => onSwipe('left'), 100);
    }
  }, [onSwipe]);

  // Core info badges
  const coreInfo = [
    { icon: Euro, label: `${property.monthly_rent}€/${matching.swipe?.perMonth || 'mois'}`, color: 'text-searcher-600' },
    { icon: Bed, label: `${property.bedrooms} ${matching.swipe?.bedrooms || 'chambres'}`, color: 'text-blue-600' },
    { icon: Bath, label: `${property.bathrooms} ${matching.swipe?.bathrooms || 'SdB'}`, color: 'text-cyan-600' },
    { icon: Users, label: `${residents.length}/${property.total_rooms || property.bedrooms} ${matching.swipe?.roommates || 'colocataires'}`, color: 'text-green-600' },
  ];

  // Amenities
  const amenities = [
    { key: 'furnished', icon: Sofa, label: matching.swipe?.furnished || 'Meublé', value: property.furnished },
    { key: 'wifi', icon: Wifi, label: 'WiFi', value: property.wifi },
    { key: 'parking', icon: Car, label: matching.swipe?.parking || 'Parking', value: property.parking },
    { key: 'balcony', icon: TreeDeciduous, label: matching.swipe?.balcony || 'Balcon', value: property.balcony },
    { key: 'pets_allowed', icon: Dog, label: matching.swipe?.petsOk || 'Animaux OK', value: property.pets_allowed },
    { key: 'smoking_allowed', icon: Cigarette, label: matching.swipe?.smokingOk || 'Fumeur OK', value: property.smoking_allowed },
  ].filter(a => a.value);

  if (isPreview) {
    return (
      <motion.div
        className={cn(
          "absolute inset-0 superellipse-3xl shadow-2xl overflow-hidden pointer-events-none transition-all duration-300",
          index === 1 ? "scale-[0.95] opacity-40 blur-sm" : "scale-[0.90] opacity-20 blur-md"
        )}
        style={{
          ...style,
          zIndex: -index,
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="absolute w-full h-full cursor-grab active:cursor-grabbing touch-none"
        style={{
          x,
          y,
          rotate,
          opacity,
          zIndex: 10,
        }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={1}
        onDragEnd={handleDragEnd}
        animate={{
          x: exitX,
          y: exitY,
          transition: { type: 'spring' as const, stiffness: 300, damping: 30 }
        }}
      >
        <div className="relative w-full h-full bg-white superellipse-3xl shadow-2xl overflow-hidden">
          {/* Main Image */}
          <div className="relative h-[55%]">
            {property.main_image || (property.images && property.images[0]) ? (
              <Image
                src={property.main_image || property.images[0]}
                alt={property.title}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                quality={90}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-searcher-100 via-searcher-50 to-searcher-50 flex items-center justify-center">
                <Home className="w-24 h-24 text-searcher-300" />
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

            {/* Top Bar - Compatibility Score */}
            {compatibilityScore && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 right-4"
              >
                <div className={cn(
                  "px-4 py-2.5 superellipse-2xl backdrop-blur-xl shadow-lg flex items-center gap-2",
                  getCompatibilityColor(compatibilityScore)
                )}>
                  <span className="text-2xl">{getCompatibilityEmoji(compatibilityScore)}</span>
                  <div>
                    <p className="text-xs font-semibold opacity-80">Match</p>
                    <p className="text-xl font-bold">{compatibilityScore}%</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Featured Badge */}
            {property.is_featured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-searcher-400 to-searcher-500 text-white border-0 shadow-lg">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {matching.swipe?.favorite || 'Coup de cœur'}
                </Badge>
              </div>
            )}

            {/* Property Title & Location */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {property.title}
              </h2>
              <div className="flex items-center gap-2 text-white/95 drop-shadow-md">
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-medium">
                  {property.neighborhood || property.city}
                  {property.postal_code && `, ${property.postal_code}`}
                </span>
              </div>
            </div>

            {/* Info Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="absolute top-4 left-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-20"
            >
              <Info className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Content Area - with glassmorphism */}
          <div className="relative h-[45%] overflow-hidden">
            {/* Animated background lights - Slow right to left */}
            <div className="absolute inset-0 bg-gradient-to-br from-searcher-50 via-searcher-100 to-searcher-50">
              <div className="absolute top-0 left-1/4 w-40 h-40 bg-searcher-300/60 rounded-full blur-2xl"
                   style={{ animation: 'float 20s ease-in-out infinite' }} />
              <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-searcher-400/50 rounded-full blur-2xl"
                   style={{ animation: 'float 25s ease-in-out infinite 5s' }} />
              <div className="absolute top-1/2 left-1/2 w-44 h-44 bg-searcher-200/50 rounded-full blur-2xl"
                   style={{ animation: 'float 22s ease-in-out infinite 10s' }} />
            </div>

            {/* Glassmorphism layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/50 backdrop-blur-2xl backdrop-saturate-150 z-10"
                 style={{
                   WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                   backdropFilter: 'blur(40px) saturate(150%)'
                 }}
            />
            <div className="absolute inset-0 border-t border-white/30 shadow-lg z-10" />

            <div className="relative z-20 p-6 overflow-y-auto h-full">
              {/* Core Info - Always Visible */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {coreInfo.map((info, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-gray-50 superellipse-xl"
                  >
                    <info.icon className={cn("w-5 h-5", info.color)} />
                    <span className="text-sm font-semibold text-gray-700">{info.label}</span>
                  </div>
                ))}
              </div>

            {/* Residents Preview */}
            {residents.length > 0 && (
              <div className="mb-4 p-4 bg-gradient-to-r from-searcher-50 to-searcher-100 superellipse-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4 text-searcher-600" />
                    {matching.swipe?.currentRoommates || 'Colocataires actuels'}
                  </p>
                  <span className="text-xs text-gray-600">{residents.length} {residents.length > 1 ? (matching.swipe?.persons || 'personnes') : (matching.swipe?.person || 'personne')}</span>
                </div>
                <div className="flex items-center gap-2">
                  {residents.slice(0, 4).map((resident, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-searcher-400 to-searcher-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md"
                      title={resident.full_name}
                    >
                      {resident.full_name?.charAt(0) || '?'}
                    </div>
                  ))}
                  {residents.length > 4 && (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs border-2 border-white shadow-md">
                      +{residents.length - 4}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {matching.swipe?.amenities || 'Équipements'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="flex items-center gap-1.5 px-3 py-1"
                    >
                      <amenity.icon className="w-3.5 h-3.5" />
                      {amenity.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Available From */}
            {property.available_from && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="w-4 h-4" />
                <span>{matching.swipe?.availableFrom || 'Disponible à partir du'} {new Date(property.available_from).toLocaleDateString('fr-FR')}</span>
              </div>
            )}

            {/* CTA to see more */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCardClick?.();
              }}
              className="w-full py-3 bg-gradient-to-r from-searcher-50 to-searcher-100 border-2 border-searcher-200 superellipse-xl flex items-center justify-center gap-2 text-searcher-700 font-semibold hover:from-searcher-100 hover:to-searcher-200 transition-all group"
            >
              <span>{matching.swipe?.viewAllDetails || 'Voir tous les détails'}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            </div>
          </div>

          {/* Swipe Indicators */}
          <motion.div
            className="absolute top-1/3 left-8 pointer-events-none z-20"
            style={{ opacity: likeOpacity }}
          >
            <div className="px-6 py-3 bg-green-500 text-white text-3xl font-bold superellipse-2xl rotate-[-20deg] shadow-2xl border-4 border-white">
              {matching.swipe?.like || "❤️ J'AIME"}
            </div>
          </motion.div>

          <motion.div
            className="absolute top-1/3 right-8 pointer-events-none z-20"
            style={{ opacity: passOpacity }}
          >
            <div className="px-6 py-3 bg-red-500 text-white text-3xl font-bold superellipse-2xl rotate-[20deg] shadow-2xl border-4 border-white">
              {matching.swipe?.pass || '❌ PASSE'}
            </div>
          </motion.div>

          <motion.div
            className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-20"
            style={{ opacity: superLikeOpacity }}
          >
            <div className="px-6 py-3 bg-gradient-to-r from-owner-500 to-searcher-500 text-white text-3xl font-bold superellipse-2xl shadow-2xl border-4 border-white flex items-center gap-2">
              <Star className="w-8 h-8 fill-current" />
              {matching.swipe?.superLike || 'SUPER LIKE'}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Expandable Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-white rounded-t-3xl md:superellipse-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <h3 className="text-2xl font-bold text-gray-900">{matching.swipe?.fullDetails || 'Détails complets'}</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Description */}
                {property.description && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{matching.swipe?.description || 'Description'}</h4>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </div>
                )}

                {/* All Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{matching.swipe?.area || 'Superficie'}</p>
                    <p className="font-semibold">{property.total_area || 'N/A'} m²</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{matching.swipe?.type || 'Type'}</p>
                    <p className="font-semibold capitalize">{property.property_type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{matching.swipe?.floor || 'Étage'}</p>
                    <p className="font-semibold">{property.floor || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{matching.swipe?.year || 'Année'}</p>
                    <p className="font-semibold">{property.year_built || 'N/A'}</p>
                  </div>
                </div>

                {/* Compatibility Breakdown */}
                {compatibilityScore && (
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 superellipse-xl">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      {matching.swipe?.whyMatch || 'Pourquoi ce match ?'}
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>✓ {matching.swipe?.matchReason1 || 'Budget compatible avec tes préférences'}</p>
                      <p>✓ {matching.swipe?.matchReason2 || 'Localisation dans ta zone recherchée'}</p>
                      <p>✓ {matching.swipe?.matchReason3 || 'Type de logement correspondant'}</p>
                      <p>✓ {matching.swipe?.matchReason4 || 'Disponibilités alignées'}</p>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  className="w-full bg-gradient-to-r from-searcher-500 to-searcher-600 hover:from-searcher-600 hover:to-searcher-700 text-white"
                  size="lg"
                  onClick={() => {
                    setShowDetails(false);
                    onCardClick?.();
                  }}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  {matching.swipe?.iLoveThisPlace || "J'aime ce logement !"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
