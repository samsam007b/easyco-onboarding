import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  MapPin, 
  Users, 
  Star, 
  Calendar,
  DollarSign,
  Bed,
  Filter,
  Search
} from "lucide-react";

const AVAILABLE_COLIVINGS = [
  {
    id: 1,
    title: "Modern House in Ixelles",
    address: "Rue de la Paix 15, 1050 Ixelles",
    image: "https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU1ODc3MDg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8,
    reviewCount: 24,
    availableRooms: [
      {
        id: 2,
        name: "Studio Room",
        price: 620,
        size: "14 m²",
        availableFrom: "Feb 1, 2025",
        image: "https://images.unsplash.com/photo-1556889882-50d7a74e8be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnQlMjBtb2Rlcm4lMjBjbGVhbnxlbnwxfHx8fDE3NTU4NzcxNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      },
      {
        id: 4,
        name: "Garden Room",
        price: 650,
        size: "15 m²",
        availableFrom: "Available Now",
        image: "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwYXBhcnRtZW50JTIwcm9vbSUyMGNvenl8ZW58MXx8fHwxNzU1ODc3MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      }
    ],
    currentRoommates: 2,
    totalRooms: 4,
    features: ["Near University", "Garden", "WiFi", "Furnished"]
  },
  {
    id: 2,
    title: "Student Residence Saint-Gilles",
    address: "Avenue de la Couronne 89, 1060 Saint-Gilles",
    image: "https://images.unsplash.com/photo-1743116591552-9ff5e8c1ad31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMHN0dWRlbnQlMjBob3VzaW5nfGVufDF8fHx8MTc1NTg3NzA4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.6,
    reviewCount: 18,
    availableRooms: [
      {
        id: 6,
        name: "Single Room",
        price: 480,
        size: "12 m²",
        availableFrom: "Mar 1, 2025",
        image: "https://images.unsplash.com/photo-1556889882-50d7a74e8be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnQlMjBtb2Rlcm4lMjBjbGVhbnxlbnwxfHx8fDE3NTU4NzcxNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      }
    ],
    currentRoommates: 5,
    totalRooms: 6,
    features: ["Student Friendly", "Common Areas", "Study Room", "Laundry"]
  }
];

interface AvailableColivingsScreenProps {
  onRoomSelect: (colivingId: number, roomId: number) => void;
  onColivingSelect: (colivingId: number) => void;
}

export function AvailableColivingsScreen({ onRoomSelect, onColivingSelect }: AvailableColivingsScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const totalAvailableRooms = AVAILABLE_COLIVINGS.reduce(
    (sum, coliving) => sum + coliving.availableRooms.length, 
    0
  );

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-[var(--color-easyCo-purple)] px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-white">Available Co-livings</h1>
            <p className="text-white/80 text-sm">Find your perfect room</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/20 rounded-xl"
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-easyCo-gray-dark)] w-5 h-5" />
          <input
            placeholder="Search location, area, or features..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-0 text-[var(--color-easyCo-purple)] placeholder:text-[var(--color-easyCo-gray-dark)]"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-lg font-bold text-white">{totalAvailableRooms}</div>
            <div className="text-white/80 text-xs">Available Rooms</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-lg font-bold text-white">{AVAILABLE_COLIVINGS.length}</div>
            <div className="text-white/80 text-xs">Properties</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-lg font-bold text-white">€480+</div>
            <div className="text-white/80 text-xs">From</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            { id: "all", label: "All" },
            { id: "available-now", label: "Available Now" },
            { id: "under-500", label: "Under €500" },
            { id: "students", label: "Student Friendly" },
            { id: "furnished", label: "Furnished" }
          ].map((filter) => (
            <Badge
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "secondary"}
              className={`flex-shrink-0 px-4 py-2 rounded-xl cursor-pointer ${
                selectedFilter === filter.id
                  ? 'bg-[var(--color-easyCo-purple)] text-white'
                  : 'bg-[var(--color-easyCo-gray-light)] border border-[var(--color-easyCo-gray-medium)] text-[var(--color-easyCo-gray-dark)]'
              }`}
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Co-livings List */}
      <div className="p-6 space-y-6">
        {AVAILABLE_COLIVINGS.map((coliving) => (
          <Card key={coliving.id} className="shadow-sm border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              {/* Property Header */}
              <div className="p-4 border-b border-[var(--color-easyCo-gray-light)]">
                <div className="flex items-start gap-4">
                  <ImageWithFallback
                    src={coliving.image}
                    alt={coliving.title}
                    className="w-20 h-20 object-cover rounded-2xl flex-shrink-0"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-1">
                          {coliving.title}
                        </h3>
                        <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          {coliving.address}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          <Star className="w-3 h-3 text-[var(--color-easyCo-mustard)] mr-1" fill="currentColor" />
                          <span className="font-medium text-sm">{coliving.rating}</span>
                          <span className="text-xs text-[var(--color-easyCo-gray-dark)] ml-1">
                            ({coliving.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center text-[var(--color-easyCo-gray-dark)]">
                          <Users className="w-4 h-4 mr-1" />
                          {coliving.currentRoommates} current roommates
                        </div>
                        <div className="flex items-center text-[var(--color-easyCo-gray-dark)]">
                          <Bed className="w-4 h-4 mr-1" />
                          {coliving.availableRooms.length} available
                        </div>
                      </div>
                      
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => onColivingSelect(coliving.id)}
                        className="text-xs border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-xl"
                      >
                        View All Details
                      </Button>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {coliving.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs bg-[var(--color-easyCo-gray-light)] text-[var(--color-easyCo-gray-dark)]">
                          {feature}
                        </Badge>
                      ))}
                      {coliving.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-[var(--color-easyCo-gray-light)] text-[var(--color-easyCo-gray-dark)]">
                          +{coliving.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Rooms */}
              <div className="p-4">
                <h4 className="font-medium text-[var(--color-easyCo-purple)] mb-3">
                  Available Rooms ({coliving.availableRooms.length})
                </h4>
                
                <div className="space-y-3">
                  {coliving.availableRooms.map((room) => (
                    <div 
                      key={room.id}
                      className="flex items-center gap-4 p-3 bg-[var(--color-easyCo-gray-light)] rounded-2xl hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => onRoomSelect(coliving.id, room.id)}
                    >
                      <ImageWithFallback
                        src={room.image}
                        alt={room.name}
                        className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h5 className="font-medium text-[var(--color-easyCo-purple)] text-sm">
                              {room.name}
                            </h5>
                            <div className="flex items-center gap-3 text-xs text-[var(--color-easyCo-gray-dark)]">
                              <span className="flex items-center">
                                <Bed className="w-3 h-3 mr-1" />
                                {room.size}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {room.availableFrom}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-[var(--color-easyCo-purple)]">
                              €{room.price}
                            </div>
                            <div className="text-xs text-[var(--color-easyCo-gray-dark)]">per month</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full mt-4 bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl py-3"
                  onClick={() => onColivingSelect(coliving.id)}
                >
                  View Property & Book Room
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Load More */}
        <div className="text-center pt-4">
          <Button 
            variant="outline"
            className="border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-2xl px-8"
          >
            Load More Properties
          </Button>
        </div>
      </div>
    </div>
  );
}