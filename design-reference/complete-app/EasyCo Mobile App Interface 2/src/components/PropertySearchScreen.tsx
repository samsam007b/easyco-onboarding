import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Users, 
  Bed, 
  Wifi, 
  Car, 
  Coffee, 
  ArrowLeft,
  Heart,
  MoreHorizontal,
  ChevronDown,
  Minus,
  Plus,
  X,
  Calendar,
  Euro
} from "lucide-react";

interface PropertySearchScreenProps {
  onBack: () => void;
  onPropertySelect: (propertyId: number) => void;
  onBookVisit?: (propertyId: number) => void;
  onApplyNow?: (propertyId: number) => void;
}

const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Modern House in Ixelles",
    address: "Rue de la Paix 15, 1050 Ixelles",
    image: "https://images.unsplash.com/photo-1608382247646-ac26b7abbcdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGJydXNzZWxzfGVufDF8fHx8MTc1ODQ3NTQ0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 650,
    occupancy: "3/4 rooms",
    occupancyPercentage: 75,
    landlord: {
      name: "Sarah M.",
      rating: 4.9,
      avatar: "https://images.unsplash.com/photo-1583525225141-1adb30017fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMGxhbmRsb3JkJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4NDc1NDUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    amenities: ["Wifi", "Parking", "Kitchen"],
    coordinates: { lat: 50.8275, lng: 4.3731 },
    distance: "0.8 km from ULB",
    availableRooms: 1,
    isFavorite: false,
    tags: ["Student-friendly", "Metro nearby"]
  },
  {
    id: 2,
    title: "Student Residence Saint-Gilles",
    address: "Avenue Fonsny 22, 1060 Saint-Gilles",
    image: "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYXBhcnRtZW50JTIwaW50ZXJpb3IlMjBzdHVkZW50fGVufDF8fHx8MTc1ODQ3NTQ0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 580,
    occupancy: "5/6 rooms",
    occupancyPercentage: 83,
    landlord: {
      name: "Marc T.",
      rating: 4.7,
      avatar: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwc3R1ZGVudHxlbnwxfHx8fDE3NTg0NjEzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    amenities: ["Wifi", "Kitchen", "Study Room"],
    coordinates: { lat: 50.8247, lng: 4.3474 },
    distance: "1.2 km from VUB",
    availableRooms: 1,
    isFavorite: true,
    tags: ["Budget-friendly", "All utilities included"]
  },
  {
    id: 3,
    title: "Luxury Loft in Uccle",
    address: "Chaussée de Waterloo 890, 1180 Uccle",
    image: "https://images.unsplash.com/photo-1581209410127-8211e90da024?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwc2hhcmVkJTIwYXBhcnRtZW50JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NTg0NzU0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 850,
    occupancy: "2/3 rooms",
    occupancyPercentage: 67,
    landlord: {
      name: "Emma L.",
      rating: 4.8,
      avatar: "https://images.unsplash.com/photo-1697393140613-5ad40c84ab36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHBvcnRyYWl0JTIwZmVtYWxlfGVufDF8fHx8MTc1ODQ3NTE4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    amenities: ["Wifi", "Parking", "Kitchen", "Balcony"],
    coordinates: { lat: 50.7927, lng: 4.3463 },
    distance: "2.5 km from ULB",
    availableRooms: 1,
    isFavorite: false,
    tags: ["Premium", "Balcony"]
  },
  {
    id: 4,
    title: "Cozy Flat in Etterbeek",
    address: "Rue des Tongres 45, 1040 Etterbeek",
    image: "https://images.unsplash.com/photo-1671725501632-3980b640f420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzaGFyZWQlMjBraXRjaGVuJTIwY29saXZpbmd8ZW58MXx8fHwxNzU4NDc1NDUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: 720,
    occupancy: "4/5 rooms",
    occupancyPercentage: 80,
    landlord: {
      name: "Alex D.",
      rating: 4.6,
      avatar: "https://images.unsplash.com/photo-1561065533-316e3142d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjB5b3VuZyUyMHBlcnNvbnxlbnwxfHx8fDE3NTg0MjUwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    amenities: ["Wifi", "Kitchen"],
    coordinates: { lat: 50.8363, lng: 4.3889 },
    distance: "1.8 km from ULB",
    availableRooms: 1,
    isFavorite: false,
    tags: ["Metro nearby", "Quiet area"]
  }
];

export function PropertySearchScreen({ onBack, onPropertySelect, onBookVisit, onApplyNow }: PropertySearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([400, 1000]);
  const [roommates, setRoommates] = useState("any");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState("any");

  // Map pins data (simplified for demo)
  const mapPins = MOCK_PROPERTIES.map(property => ({
    id: property.id,
    lat: property.coordinates.lat,
    lng: property.coordinates.lng,
    price: property.price,
    isSelected: selectedProperty === property.id
  }));

  const filteredProperties = MOCK_PROPERTIES.filter(property => {
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPrice && matchesSearch;
  });

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setPriceRange([400, 1000]);
    setRoommates("any");
    setSelectedAmenities([]);
    setPropertyType("any");
  };

  const handlePropertyClick = (propertyId: number) => {
    setSelectedProperty(propertyId);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Search */}
      <div className="bg-white border-b border-[var(--color-easyCo-gray-medium)] sticky top-0 z-40">
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-[var(--color-easyCo-purple)]">Find Your Perfect Coliving</h1>
              <p className="text-sm text-[var(--color-easyCo-gray-dark)]">
                {filteredProperties.length} properties available
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
            <Input
              placeholder="Search by location, university, or neighborhood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-16 rounded-3xl border-[var(--color-easyCo-gray-medium)] bg-[var(--color-easyCo-gray-light)] focus:border-[var(--color-easyCo-purple)]"
            />
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-2xl border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)]"
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </Button>
          </div>

          {/* Filter Tags */}
          {(selectedAmenities.length > 0 || roommates !== "any" || priceRange[0] !== 400 || priceRange[1] !== 1000) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {priceRange[0] !== 400 || priceRange[1] !== 1000 ? (
                <Badge className="bg-[var(--color-easyCo-purple)] text-white">
                  €{priceRange[0]} - €{priceRange[1]}
                </Badge>
              ) : null}
              {roommates !== "any" && (
                <Badge className="bg-[var(--color-easyCo-purple)] text-white">
                  {roommates} roommates
                </Badge>
              )}
              {selectedAmenities.map(amenity => (
                <Badge key={amenity} className="bg-[var(--color-easyCo-purple)] text-white">
                  {amenity}
                </Badge>
              ))}
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-[var(--color-easyCo-gray-dark)] h-6 px-2"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Map/List Toggle */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowMap(true)}
              variant={showMap ? "default" : "outline"}
              size="sm"
              className={`rounded-2xl ${showMap ? 'bg-[var(--color-easyCo-purple)]' : 'border-[var(--color-easyCo-gray-medium)]'}`}
            >
              <MapPin className="w-4 h-4 mr-1" />
              Map
            </Button>
            <Button
              onClick={() => setShowMap(false)}
              variant={!showMap ? "default" : "outline"}
              size="sm"
              className={`rounded-2xl ${!showMap ? 'bg-[var(--color-easyCo-purple)]' : 'border-[var(--color-easyCo-gray-medium)]'}`}
            >
              List
            </Button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="border-t border-[var(--color-easyCo-gray-medium)] bg-[var(--color-easyCo-gray-light)] px-6 py-4">
            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-easyCo-purple)] mb-3">
                  Monthly Budget
                </label>
                <div className="px-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1200}
                    min={300}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-[var(--color-easyCo-gray-dark)] mt-2">
                    <span>€{priceRange[0]}</span>
                    <span>€{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Roommates */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-easyCo-purple)] mb-3">
                  Number of Roommates
                </label>
                <Select value={roommates} onValueChange={setRoommates}>
                  <SelectTrigger className="rounded-2xl border-[var(--color-easyCo-gray-medium)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any number</SelectItem>
                    <SelectItem value="1-2">1-2 roommates</SelectItem>
                    <SelectItem value="3-4">3-4 roommates</SelectItem>
                    <SelectItem value="5+">5+ roommates</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-easyCo-purple)] mb-3">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Wifi", "Parking", "Kitchen", "Study Room", "Balcony", "Garden"].map(amenity => (
                    <Button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                      size="sm"
                      className={`rounded-2xl ${
                        selectedAmenities.includes(amenity) 
                          ? 'bg-[var(--color-easyCo-purple)]' 
                          : 'border-[var(--color-easyCo-gray-medium)]'
                      }`}
                    >
                      {amenity}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Section */}
      {showMap && (
        <div className="h-80 bg-gradient-to-br from-blue-50 to-[var(--color-easyCo-gray-light)] relative border-b border-[var(--color-easyCo-gray-medium)]">
          {/* Simplified Map Background */}
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-[var(--color-easyCo-purple)]/10 to-[var(--color-easyCo-mustard)]/10"></div>
            </div>
            
            {/* Property Pins */}
            {mapPins.map((pin) => (
              <div
                key={pin.id}
                onClick={() => handlePropertyClick(pin.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                  pin.isSelected ? 'scale-110 z-20' : 'z-10 hover:scale-105'
                }`}
                style={{
                  left: `${20 + (pin.id * 20)}%`,
                  top: `${30 + (pin.id * 15)}%`
                }}
              >
                <div className={`bg-white rounded-2xl px-3 py-2 shadow-lg border-2 ${
                  pin.isSelected 
                    ? 'border-[var(--color-easyCo-mustard)] bg-[var(--color-easyCo-mustard)]' 
                    : 'border-[var(--color-easyCo-purple)]'
                }`}>
                  <div className={`text-sm font-bold ${
                    pin.isSelected ? 'text-black' : 'text-[var(--color-easyCo-purple)]'
                  }`}>
                    €{pin.price}
                  </div>
                </div>
                <div className={`w-3 h-3 ${
                  pin.isSelected ? 'bg-[var(--color-easyCo-mustard)]' : 'bg-[var(--color-easyCo-purple)]'
                } transform rotate-45 mx-auto -mt-1.5 border border-white`}></div>
              </div>
            ))}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-white border-[var(--color-easyCo-gray-medium)] rounded-xl p-2 w-10 h-10"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white border-[var(--color-easyCo-gray-medium)] rounded-xl p-2 w-10 h-10"
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Property List */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4 space-y-4">
          {filteredProperties.map((property) => (
            <Card 
              key={property.id}
              onClick={() => handlePropertyClick(property.id)}
              className={`border-0 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden ${
                selectedProperty === property.id ? 'ring-2 ring-[var(--color-easyCo-mustard)]' : ''
              }`}
            >
              <div className="flex">
                {/* Property Image */}
                <div className="w-32 h-32 flex-shrink-0 relative">
                  <ImageWithFallback
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 hover:bg-white rounded-full"
                  >
                    <Heart className={`w-4 h-4 ${property.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </Button>
                  <Badge className="absolute bottom-2 left-2 bg-[var(--color-easyCo-purple)] text-white text-xs">
                    {property.availableRooms} room{property.availableRooms !== 1 ? 's' : ''} left
                  </Badge>
                </div>

                {/* Property Details */}
                <CardContent className="flex-1 p-4">
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-[var(--color-easyCo-purple)] text-lg mb-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 text-[var(--color-easyCo-gray-dark)] text-sm">
                          <MapPin className="w-3 h-3" />
                          {property.address}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-[var(--color-easyCo-purple)]">
                          €{property.price}
                        </div>
                        <div className="text-xs text-[var(--color-easyCo-gray-dark)]">per month</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {property.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-[var(--color-easyCo-gray-light)] text-[var(--color-easyCo-gray-dark)]">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-[var(--color-easyCo-gray-dark)]">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {property.occupancy}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[var(--color-easyCo-mustard)]" fill="currentColor" />
                        {property.landlord.rating}
                      </div>
                      <div className="text-xs">{property.distance}</div>
                    </div>

                    {/* Landlord & Amenities */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={property.landlord.avatar} alt={property.landlord.name} />
                          <AvatarFallback className="text-xs">{property.landlord.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-[var(--color-easyCo-gray-dark)]">Host: {property.landlord.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {property.amenities.slice(0, 3).map(amenity => (
                          <div key={amenity} className="w-6 h-6 bg-[var(--color-easyCo-gray-light)] rounded-full flex items-center justify-center">
                            {amenity === "Wifi" && <Wifi className="w-3 h-3 text-[var(--color-easyCo-purple)]" />}
                            {amenity === "Parking" && <Car className="w-3 h-3 text-[var(--color-easyCo-purple)]" />}
                            {amenity === "Kitchen" && <Coffee className="w-3 h-3 text-[var(--color-easyCo-purple)]" />}
                          </div>
                        ))}
                        {property.amenities.length > 3 && (
                          <Badge className="bg-[var(--color-easyCo-gray-light)] text-[var(--color-easyCo-gray-dark)] text-xs">
                            +{property.amenities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Occupancy Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-[var(--color-easyCo-gray-dark)]">
                        <span>Occupancy</span>
                        <span>{property.occupancyPercentage}% full</span>
                      </div>
                      <div className="w-full bg-[var(--color-easyCo-gray-light)] rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-[var(--color-easyCo-purple)] to-[var(--color-easyCo-purple-light)] h-1.5 rounded-full transition-all"
                          style={{ width: `${property.occupancyPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      {selectedProperty && (
        <div className="bg-white border-t border-[var(--color-easyCo-gray-medium)] px-6 py-4 shadow-lg">
          <div className="flex gap-3">
            <Button
              onClick={() => onBookVisit?.(selectedProperty)}
              variant="outline"
              className="flex-1 rounded-2xl border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple)] hover:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book a Visit
            </Button>
            <Button
              onClick={() => onApplyNow?.(selectedProperty)}
              className="flex-1 bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl"
            >
              <Euro className="w-4 h-4 mr-2" />
              Apply Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}