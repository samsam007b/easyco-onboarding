import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Users, 
  Star, 
  Calendar,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Layers,
  Navigation
} from "lucide-react";

// Brussels-focused properties in different communes
const BRUSSELS_PROPERTIES = [
  {
    id: 1,
    title: "Modern Studio in Ixelles",
    price: "€650",
    location: "Ixelles, Near ULB",
    commune: "Ixelles",
    roommates: 2,
    rating: 4.8,
    reviewCount: 24,
    // Ixelles coordinates (near ULB)
    latitude: 50.8263,
    longitude: 4.3719,
    image: "https://images.unsplash.com/photo-1679211934250-aa8512613468?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnVzc2VscyUyMGFwYXJ0bWVudCUyMG1vZGVybiUyMGxpdmluZ3xlbnwxfHx8fDE3NTU1Mjg4MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableFrom: "Feb 15, 2025",
    features: ["Near University", "Trendy Area", "WiFi", "Furnished"]
  },
  {
    id: 2,
    title: "Artistic Loft in Saint-Gilles",
    price: "€580",
    location: "Saint-Gilles, Parvis Area",
    commune: "Saint-Gilles",
    roommates: 3,
    rating: 4.6,
    reviewCount: 18,
    // Saint-Gilles coordinates (Parvis area)
    latitude: 50.8370,
    longitude: 4.3440,
    image: "https://images.unsplash.com/photo-1611234688667-76b6d8fadd75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGFwYXJ0bWVudCUyMGJydXNzZWxzfGVufDF8fHx8MTc1NTUyODgyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableFrom: "Jan 1, 2025",
    features: ["Artistic District", "High Ceilings", "Creative Community", "Garden"]
  },
  {
    id: 3,
    title: "Luxury Share in Uccle",
    price: "€890",
    location: "Uccle, Residential Area",
    commune: "Uccle",
    roommates: 2,
    rating: 4.9,
    reviewCount: 31,
    // Uccle coordinates (residential area)
    latitude: 50.7927,
    longitude: 4.3356,
    image: "https://images.unsplash.com/photo-1680770638423-6d4c1089bd7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBicnVzc2VscyUyMGludGVyaW9yfGVufDF8fHx8MTc1NTUyODgyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableFrom: "Mar 10, 2025",
    features: ["Upscale Area", "Garden", "Parking", "Professional"]
  },
  {
    id: 4,
    title: "Student House in Schaerbeek",
    price: "€450",
    location: "Schaerbeek, Multicultural",
    commune: "Schaerbeek",
    roommates: 4,
    rating: 4.5,
    reviewCount: 22,
    // Schaerbeek coordinates
    latitude: 50.8676,
    longitude: 4.3730,
    image: "https://images.unsplash.com/photo-1716662556853-eda5b05ae70b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwaG91c2luZyUyMHJvb20lMjBicnVzc2Vsc3xlbnwxfHx8fDE3NTU1Mjg4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableFrom: "Feb 1, 2025",
    features: ["Budget Friendly", "Diverse Community", "Metro Access", "Large Rooms"]
  },
  {
    id: 5,
    title: "Modern Flat in Etterbeek",
    price: "€720",
    location: "Etterbeek, Near VUB",
    commune: "Etterbeek",
    roommates: 3,
    rating: 4.7,
    reviewCount: 15,
    // Etterbeek coordinates (near VUB)
    latitude: 50.8205,
    longitude: 4.3890,
    image: "https://images.unsplash.com/photo-1651748252841-64b311831ee1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBsaXZpbmclMjBzcGFjZSUyMGJydXNzZWxzfGVufDF8fHx8MTc1NTUyODgzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableFrom: "Available Now",
    features: ["Near VUB", "Modern", "Co-working Space", "Gym"]
  }
];

// Brussels center coordinates for map positioning
const BRUSSELS_CENTER = {
  latitude: 50.8503,
  longitude: 4.3517
};

interface MapSearchScreenProps {
  onBack: () => void;
  onPropertySelect: (propertyId: number) => void;
  onViewCalendar: (propertyId: number) => void;
}

export function MapSearchScreen({ onBack, onPropertySelect, onViewCalendar }: MapSearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapCenter, setMapCenter] = useState(BRUSSELS_CENTER);

  const selectedPropertyData = selectedProperty 
    ? BRUSSELS_PROPERTIES.find(p => p.id === selectedProperty)
    : null;

  // Convert Brussels coordinates to map position (centered on Brussels)
  const getMapPosition = (lat: number, lng: number) => {
    const latRange = 0.15; // Covers Brussels metro area
    const lngRange = 0.25;
    
    const x = ((lng - (BRUSSELS_CENTER.longitude - lngRange/2)) / lngRange) * 100;
    const y = (1 - (lat - (BRUSSELS_CENTER.latitude - latRange/2)) / latRange) * 100;
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const resetMapView = () => {
    setMapCenter(BRUSSELS_CENTER);
    setZoomLevel(1);
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)] relative overflow-hidden">
      {/* Header with Search */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 pt-12">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="w-10 h-10 bg-white shadow-md rounded-full p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-easyCo-gray-dark)] w-5 h-5" />
            <Input
              placeholder="Search in Brussels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white shadow-md border-0 rounded-2xl focus:shadow-lg"
            />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="w-10 h-10 bg-white shadow-md rounded-full p-0"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Quick Filters - Brussels specific */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["Under €500", "Student Areas", "Near Metro", "Available Now", "Ixelles", "Saint-Gilles", "Uccle"].map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="flex-shrink-0 px-4 py-2 bg-white shadow-sm border-0 rounded-xl text-[var(--color-easyCo-gray-dark)] cursor-pointer hover:bg-[var(--color-easyCo-purple)] hover:text-white transition-colors"
            >
              {filter}
            </Badge>
          ))}
        </div>
      </div>

      {/* Brussels Map Area */}
      <div className="relative w-full h-full bg-gradient-to-br from-green-50 via-blue-50 to-gray-50">
        {/* Brussels Map Background with more detail */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="brussels-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#4A148C" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#brussels-grid)" />
          </svg>
        </div>

        {/* Brussels Districts/Communes outline */}
        <svg className="absolute inset-0 w-full h-full" style={{ transform: `scale(${zoomLevel})` }}>
          {/* Brussels Pentagon (city center) */}
          <polygon
            points="200,180 250,160 280,200 250,240 200,220"
            stroke="#4A148C"
            strokeWidth="2"
            fill="rgba(74, 20, 140, 0.1)"
            opacity="0.8"
          />
          
          {/* Major roads/boulevards */}
          <path
            d="M 50 200 Q 150 180 250 200 T 450 200"
            stroke="#6B7280"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 200 50 Q 220 150 240 250 T 260 450"
            stroke="#6B7280"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          
          {/* Ring road indication */}
          <circle
            cx="250"
            cy="200"
            r="150"
            stroke="#9CA3AF"
            strokeWidth="2"
            fill="none"
            opacity="0.4"
            strokeDasharray="10,5"
          />
        </svg>

        {/* Property Pins with Brussels positioning */}
        <div className="absolute inset-0" style={{ transform: `scale(${zoomLevel})` }}>
          {BRUSSELS_PROPERTIES.map((property) => {
            const position = getMapPosition(property.latitude, property.longitude);
            
            return (
              <div
                key={property.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
                onClick={() => setSelectedProperty(property.id)}
              >
                <div className={`relative ${selectedProperty === property.id ? 'z-10' : 'z-0'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    selectedProperty === property.id
                      ? 'bg-[var(--color-easyCo-mustard)] scale-125'
                      : 'bg-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple-dark)]'
                  }`}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Price Tag */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white px-3 py-1 rounded-lg shadow-md text-sm font-semibold text-[var(--color-easyCo-purple)] whitespace-nowrap">
                      {property.price}
                    </div>
                  </div>

                  {/* Commune Label */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[var(--color-easyCo-purple)] px-2 py-1 rounded-md text-xs font-medium text-white whitespace-nowrap opacity-90">
                      {property.commune}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-24 right-6 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoomLevel(Math.min(zoomLevel + 0.3, 2))}
          className="w-12 h-12 bg-white shadow-md rounded-full p-0"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoomLevel(Math.max(zoomLevel - 0.3, 0.7))}
          className="w-12 h-12 bg-white shadow-md rounded-full p-0"
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetMapView}
          className="w-12 h-12 bg-white shadow-md rounded-full p-0"
          title="Reset View"
        >
          <Navigation className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 bg-white shadow-md rounded-full p-0"
        >
          <Layers className="w-5 h-5" />
        </Button>
      </div>

      {/* Property Preview Card */}
      {selectedPropertyData && (
        <div className="absolute bottom-6 left-6 right-6 z-30">
          <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
            <div className="flex">
              <ImageWithFallback
                src={selectedPropertyData.image}
                alt={selectedPropertyData.title}
                className="w-28 h-28 object-cover flex-shrink-0"
              />
              <CardContent className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-1 text-sm">
                      {selectedPropertyData.title}
                    </h3>
                    <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-xs mb-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {selectedPropertyData.location}
                    </div>
                    <Badge variant="outline" className="text-xs border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)]">
                      {selectedPropertyData.commune}
                    </Badge>
                  </div>
                  <div className="text-right ml-3">
                    <div className="font-bold text-[var(--color-easyCo-purple)] text-lg">{selectedPropertyData.price}</div>
                    <div className="text-xs text-[var(--color-easyCo-gray-dark)]">per month</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center text-[var(--color-easyCo-gray-dark)]">
                      <Users className="w-3 h-3 mr-1" />
                      {selectedPropertyData.roommates} roommates
                    </div>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-[var(--color-easyCo-mustard)] mr-1" fill="currentColor" />
                      <span className="font-medium">{selectedPropertyData.rating}</span>
                    </div>
                  </div>
                  
                  <Badge 
                    className={`text-xs ${
                      selectedPropertyData.availableFrom === "Available Now"
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedPropertyData.availableFrom}
                  </Badge>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedPropertyData.features.slice(0, 3).map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs bg-[var(--color-easyCo-gray-light)] text-[var(--color-easyCo-gray-dark)]">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => onViewCalendar(selectedPropertyData.id)}
                    variant="outline"
                    className="flex-1 text-xs border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-xl"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Calendar
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => onPropertySelect(selectedPropertyData.id)}
                    className="flex-1 bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black text-xs rounded-xl"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      )}

      {/* Results Summary */}
      <div className="absolute top-32 left-6 z-20">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
          <span className="text-sm font-medium text-[var(--color-easyCo-purple)]">
            {BRUSSELS_PROPERTIES.length} properties in Brussels
          </span>
        </div>
      </div>

      {/* Brussels Info Panel */}
      <div className="absolute top-32 right-6 z-20">
        <div className="bg-[var(--color-easyCo-purple)]/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm">
          <span className="text-xs font-medium text-white">
            🇧🇪 Brussels Capital Region
          </span>
        </div>
      </div>
    </div>
  );
}