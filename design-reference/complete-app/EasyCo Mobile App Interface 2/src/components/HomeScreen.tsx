import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ImageCarousel } from "./ImageCarousel";
import { AutosuggestSearch } from "./AutosuggestSearch";
import { useFavorites } from "./FavoritesContext";
import { 
  SlidersHorizontal, 
  MapPin, 
  Users, 
  Star, 
  Heart,
  ChevronDown,
  ChevronUp,
  Bed,
  Calendar,
  DollarSign,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const FEATURED_COLIVINGS = [
  {
    id: 1,
    images: [
      "https://images.unsplash.com/photo-1662454419622-a41092ecd245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBraXRjaGVuJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1NTUyNjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZpbmclMjByb29tJTIwbW9kZXJuJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1NTUyNjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1449247613801-ab06418e2861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBhcGFydG1lbnQlMjBvdXRkb29yfGVufDF8fHx8MTc1NTUyNjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    title: "Modern House in Ixelles",
    address: "Rue de la Paix 15, 1050 Ixelles",
    rating: 4.8,
    reviewCount: 24,
    totalRoommates: 4,
    tags: ["Near University", "Garden", "WiFi", "Furnished"],
    rooms: [
      {
        id: 1,
        name: "Master Bedroom",
        price: 750,
        size: "18 m²",
        availableFrom: "Feb 15, 2025",
        status: "available",
        image: "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwYXBhcnRtZW50JTIwcm9vbSUyMGNvenl8ZW58MXx8fHwxNzU1ODc3MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        features: ["Private bathroom", "Balcony access", "Large windows"]
      },
      {
        id: 2,
        name: "Studio Room",
        price: 620,
        size: "14 m²",
        availableFrom: "Available Now",
        status: "available",
        image: "https://images.unsplash.com/photo-1556889882-50d7a74e8be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnQlMjBtb2Rlcm4lMjBjbGVhbnxlbnwxfHx8fDE3NTU4NzcxNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        features: ["Study desk", "Built-in wardrobe", "Natural light"]
      },
      {
        id: 3,
        name: "Corner Room",
        price: 690,
        size: "16 m²",
        availableFrom: "Mar 1, 2025",
        status: "occupied",
        image: "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwYXBhcnRtZW50JTIwcm9vbSUyMGNvenl8ZW58MXx8fHwxNzU1ODc3MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        features: ["Corner windows", "Extra space", "City view"]
      }
    ]
  },
  {
    id: 2,
    images: [
      "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb3p5JTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc1NTUyNjE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMGFyZWElMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU1NTI2MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXVuZHJ5JTIwcm9vbSUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NTU1MjYxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    title: "Student Residence Saint-Gilles",
    address: "Avenue de la Couronne 89, 1060 Saint-Gilles",
    rating: 4.6,
    reviewCount: 18,
    totalRoommates: 6,
    tags: ["Student Friendly", "Common Areas", "Study Room", "Laundry"],
    rooms: [
      {
        id: 4,
        name: "Single Room A",
        price: 480,
        size: "12 m²",
        availableFrom: "Feb 1, 2025",
        status: "available",
        image: "https://images.unsplash.com/photo-1556889882-50d7a74e8be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnQlMjBtb2Rlcm4lMjBjbGVhbnxlbnwxfHx8fDE3NTU4NzcxNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        features: ["Study desk", "Shared bathroom", "WiFi included"]
      },
      {
        id: 5,
        name: "Single Room B",
        price: 500,
        size: "13 m²",
        availableFrom: "Mar 15, 2025",
        status: "available",
        image: "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwYXBhcnRtZW50JTIwcm9vbSUyMGNvenl8ZW58MXx8fHwxNzU1ODc3MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        features: ["Large window", "Built-in storage", "Near common area"]
      }
    ]
  },
  {
    id: 3,
    images: [
      "https://images.unsplash.com/photo-1657084031100-6925483d8a7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBraXRjaGVuJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1NTUyNjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaW0lMjBhcGFydG1lbnQlMjBmaXRuZXNzfGVufDF8fHx8MTc1NTUyNjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1NTUyNjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    title: "Luxury Loft in Uccle",
    address: "Chaussée de Waterloo 234, 1180 Uccle",
    rating: 4.9,
    reviewCount: 31,
    totalRoommates: 3,
    tags: ["Professional", "Gym", "Parking", "High-end"],
    rooms: [
      {
        id: 6,
        name: "Premium Suite",
        price: 890,
        size: "22 m²",
        availableFrom: "Apr 1, 2025",
        status: "available",
        image: "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwYXBhcnRtZW50JTIwcm9vbSUyMGNvenl8ZW58MXx8fHwxNzU1ODc3MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        features: ["En-suite bathroom", "Walk-in closet", "Terrace access"]
      }
    ]
  }
];

const FILTER_OPTIONS = [
  { label: "Budget", active: false },
  { label: "Location", active: false },
  { label: "Roommates", active: true },
  { label: "Type", active: false }
];

const SEARCH_SUGGESTIONS = [
  // Brussels Municipalities  
  "Ixelles",
  "Saint-Gilles", 
  "Uccle",
  "Etterbeek",
  "Schaerbeek",
  "Forest",
  "Molenbeek-Saint-Jean",
  "Anderlecht",
  "Woluwe-Saint-Lambert",
  "Woluwe-Saint-Pierre",
  "Jette",
  "Koekelberg",
  "Berchem-Sainte-Agathe",
  "Ganshoren",
  "Evere",
  "Saint-Josse-ten-Noode",
  "Watermael-Boitsfort",
  "Auderghem",
  "Brussels City Centre",
  
  // Universities & Schools
  "ULB - Université Libre de Bruxelles",
  "VUB - Vrije Universiteit Brussel", 
  "UCLouvain Saint-Louis",
  "Solvay Business School",
  "ICHEC Brussels Management School",
  "Erasmus University College",
  "Institut Saint-Louis",
  "EPHEC",
  "HE Leonard de Vinci",
  "IESN",
  
  // Popular Areas & Landmarks
  "European Quarter",
  "Matonge",
  "Chatelain",
  "Place Flagey",
  "Louise",
  "Schuman",
  "Arts-Loi",
  "Central Station",
  "Midi Station",
  "Atomium",
  "Royal Palace",
  "Grand Place",
  "Sablon",
  "Place Eugène Flagey",
  "Boulevard Anspach",
  "Avenue Louise",
  "Rue Neuve",
  
  // Transport Hubs
  "Gare du Midi",
  "Gare Centrale", 
  "Gare du Nord",
  "Metro Louise",
  "Metro Schuman",
  "Metro Arts-Loi",
  "Metro Maelbeek",
  "Metro Merode",
  "Metro Montgomery",
  "Metro Delta",
  
  // Keywords
  "near university",
  "student housing",
  "furnished apartment",
  "shared kitchen",
  "garden access",
  "parking included",
  "gym facilities",
  "study room",
  "laundry facilities",
  "bike storage",
  "terrace",
  "balcony",
  "professional housing",
  "young professionals",
  "co-living space",
  "modern apartment",
  "renovated building"
];

interface HomeScreenProps {
  onPropertySelect?: (propertyId: number) => void;
  onRoomSelect?: (colivingId: number, roomId: number) => void;
  onViewCalendar?: (roomId: number) => void;
}

export function HomeScreen({ onPropertySelect, onRoomSelect, onViewCalendar }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(FILTER_OPTIONS);
  const [expandedColiving, setExpandedColiving] = useState<number | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const toggleFilter = (index: number) => {
    setFilters(prev => prev.map((filter, i) => 
      i === index ? { ...filter, active: !filter.active } : filter
    ));
  };

  const toggleColivingExpansion = (colivingId: number) => {
    setExpandedColiving(prev => prev === colivingId ? null : colivingId);
  };

  const getAvailableRooms = (rooms: any[]) => {
    return rooms.filter(room => room.status === 'available');
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-easyCo-purple)]">EasyCo</h1>
            <p className="text-[var(--color-easyCo-gray-dark)] text-sm">Find your perfect home</p>
          </div>
          <div className="w-10 h-10 bg-[var(--color-easyCo-purple)] rounded-full flex items-center justify-center">
            <span className="text-white font-medium">JD</span>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mb-4">
          <AutosuggestSearch
            value={searchQuery}
            onChange={setSearchQuery}
            suggestions={SEARCH_SUGGESTIONS}
            placeholder="Search by location, university, or area..."
          />
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" className="flex-shrink-0 border-[var(--color-easyCo-gray-medium)] rounded-xl">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
          {filters.map((filter, index) => (
            <Badge
              key={filter.label}
              variant={filter.active ? "default" : "secondary"}
              className={`flex-shrink-0 px-4 py-2 rounded-xl cursor-pointer ${
                filter.active 
                  ? 'bg-[var(--color-easyCo-purple)] text-white' 
                  : 'bg-white border border-[var(--color-easyCo-gray-medium)] text-[var(--color-easyCo-gray-dark)]'
              }`}
              onClick={() => toggleFilter(index)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[var(--color-easyCo-purple)]">2.3k+</div>
            <div className="text-xs text-[var(--color-easyCo-gray-dark)]">Active Listings</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[var(--color-easyCo-purple)]">15k+</div>
            <div className="text-xs text-[var(--color-easyCo-gray-dark)]">Happy Users</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-[var(--color-easyCo-purple)]">4.8★</div>
            <div className="text-xs text-[var(--color-easyCo-gray-dark)]">Avg Rating</div>
          </div>
        </div>

        {/* Featured Co-livings */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-easyCo-purple)]">Featured Co-livings</h2>
            <Button variant="ghost" size="sm" className="text-[var(--color-easyCo-purple)]">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {FEATURED_COLIVINGS.map((coliving) => {
              const availableRooms = getAvailableRooms(coliving.rooms);
              const isExpanded = expandedColiving === coliving.id;
              
              return (
                <Card key={coliving.id} className="overflow-hidden shadow-sm border-0 rounded-2xl">
                  <div className="relative">
                    <ImageCarousel
                      images={coliving.images}
                      alt={coliving.title}
                      className="rounded-t-2xl"
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(coliving.id);
                      }}
                      className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          isFavorite(coliving.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-[var(--color-easyCo-gray-dark)]'
                        }`} 
                      />
                    </button>
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-[var(--color-easyCo-mustard)] text-black">
                        Featured
                      </Badge>
                    </div>
                    {availableRooms.length > 0 && (
                      <div className="absolute bottom-4 left-4 z-10">
                        <Badge className="bg-green-600 text-white">
                          {availableRooms.length} room{availableRooms.length > 1 ? 's' : ''} available
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[var(--color-easyCo-purple)]">{coliving.title}</h3>
                      <div className="text-right">
                        <div className="font-bold text-lg text-[var(--color-easyCo-purple)]">
                          €{Math.min(...availableRooms.map(r => r.price))}+
                        </div>
                        <div className="text-xs text-[var(--color-easyCo-gray-dark)]">per month</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {coliving.address}
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        {coliving.totalRoommates} total residents
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-[var(--color-easyCo-mustard)] mr-1" fill="currentColor" />
                        <span className="text-sm font-medium">{coliving.rating}</span>
                        <span className="text-xs text-[var(--color-easyCo-gray-dark)] ml-1">
                          ({coliving.reviewCount})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {coliving.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-[var(--color-easyCo-gray-light)] text-[var(--color-easyCo-gray-dark)]">
                          {tag}
                        </Badge>
                      ))}
                      {coliving.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-[var(--color-easyCo-gray-light)] text-[var(--color-easyCo-gray-dark)]">
                          +{coliving.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => toggleColivingExpansion(coliving.id)}
                        variant="outline"
                        className="flex-1 border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-xl hover:bg-[var(--color-easyCo-purple)] hover:text-white transition-colors"
                      >
                        <Info className="w-4 h-4 mr-2" />
                        More Details
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 ml-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-2" />
                        )}
                      </Button>
                      <Button 
                        onClick={() => onPropertySelect?.(coliving.id)}
                        className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-xl px-6"
                      >
                        View Property
                      </Button>
                    </div>

                    {/* Expandable Room Sub-Menu */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-[var(--color-easyCo-gray-medium)]">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-[var(--color-easyCo-purple)] flex items-center">
                                <Bed className="w-4 h-4 mr-2" />
                                Available Rooms ({availableRooms.length})
                              </h4>
                              <Badge variant="outline" className="text-xs border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)]">
                                Room Sub-Menu
                              </Badge>
                            </div>
                            
                            {availableRooms.length > 0 ? (
                              <div className="space-y-3">
                                {availableRooms.map((room) => (
                                  <motion.div
                                    key={room.id}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-[var(--color-easyCo-gray-light)] rounded-2xl p-4 hover:shadow-sm transition-shadow"
                                  >
                                    <div className="flex items-start gap-3">
                                      <ImageWithFallback
                                        src={room.image}
                                        alt={room.name}
                                        className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                                      />
                                      
                                      <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                          <div>
                                            <h5 className="font-medium text-[var(--color-easyCo-purple)] text-sm mb-1">
                                              {room.name}
                                            </h5>
                                            <div className="flex items-center gap-3 text-xs text-[var(--color-easyCo-gray-dark)]">
                                              <span className="flex items-center">
                                                <Bed className="w-3 h-3 mr-1" />
                                                {room.size}
                                              </span>
                                              <Badge className={`${getRoomStatusColor(room.status)} text-xs`}>
                                                {room.status}
                                              </Badge>
                                            </div>
                                          </div>
                                          
                                          <div className="text-right">
                                            <div className="font-bold text-[var(--color-easyCo-purple)]">
                                              €{room.price}
                                            </div>
                                            <div className="text-xs text-[var(--color-easyCo-gray-dark)]">per month</div>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center text-xs text-[var(--color-easyCo-gray-dark)] mb-2">
                                          <Calendar className="w-3 h-3 mr-1" />
                                          {room.availableFrom}
                                        </div>
                                        
                                        {/* Room Features */}
                                        <div className="flex flex-wrap gap-1 mb-3">
                                          {room.features.slice(0, 2).map((feature) => (
                                            <Badge key={feature} variant="secondary" className="text-xs bg-white text-[var(--color-easyCo-gray-dark)]">
                                              {feature}
                                            </Badge>
                                          ))}
                                          {room.features.length > 2 && (
                                            <Badge variant="secondary" className="text-xs bg-white text-[var(--color-easyCo-gray-dark)]">
                                              +{room.features.length - 2}
                                            </Badge>
                                          )}
                                        </div>
                                        
                                        {/* Room Actions */}
                                        <div className="flex gap-2">
                                          <Button 
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onViewCalendar?.(room.id)}
                                            className="text-xs border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-xl flex-1"
                                          >
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Calendar
                                          </Button>
                                          <Button 
                                            size="sm"
                                            onClick={() => onRoomSelect?.(coliving.id, room.id)}
                                            className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black text-xs rounded-xl flex-1"
                                          >
                                            <DollarSign className="w-3 h-3 mr-1" />
                                            Book Room
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-[var(--color-easyCo-gray-dark)] text-sm">
                                <Bed className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                No rooms currently available
                              </div>
                            )}
                            
                            {/* Additional Co-living Info */}
                            <div className="mt-4 p-3 bg-white rounded-xl">
                              <div className="text-xs text-[var(--color-easyCo-gray-dark)] text-center">
                                Total of {coliving.rooms.length} rooms • {coliving.rooms.filter(r => r.status === 'occupied').length} occupied • {availableRooms.length} available
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}