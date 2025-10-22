import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Plus, 
  Edit, 
  MapPin, 
  Users, 
  Calendar,
  DollarSign,
  Eye,
  Settings,
  Home,
  Bed
} from "lucide-react";

const MOCK_COLIVINGS = [
  {
    id: 1,
    title: "Modern House in Ixelles",
    address: "Rue de la Paix 15, 1050 Ixelles",
    image: "https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU1ODc3MDg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    totalRooms: 4,
    availableRooms: 2,
    occupiedRooms: 2,
    monthlyRevenue: 2680,
    averagePrice: 670,
    status: "active"
  },
  {
    id: 2,
    title: "Student Residence Saint-Gilles",
    address: "Avenue de la Couronne 89, 1060 Saint-Gilles",
    image: "https://images.unsplash.com/photo-1743116591552-9ff5e8c1ad31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMHN0dWRlbnQlMjBob3VzaW5nfGVufDF8fHx8MTc1NTg3NzA4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    totalRooms: 6,
    availableRooms: 1,
    occupiedRooms: 5,
    monthlyRevenue: 3200,
    averagePrice: 533,
    status: "active"
  },
  {
    id: 3,
    title: "Luxury Loft in Uccle",
    address: "Chaussée de Waterloo 234, 1180 Uccle",
    image: "https://images.unsplash.com/photo-1727328982998-b3ec4ed239cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBsaXZpbmclMjByb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1NTg3NzA5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    totalRooms: 3,
    availableRooms: 0,
    occupiedRooms: 3,
    monthlyRevenue: 2700,
    averagePrice: 900,
    status: "active"
  }
];

interface MyColivingsScreenProps {
  onEditColiving: (colivingId: number) => void;
  onAddColiving: () => void;
}

export function MyColivingsScreen({ onEditColiving, onAddColiving }: MyColivingsScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const totalRevenue = MOCK_COLIVINGS.reduce((sum, coliving) => sum + coliving.monthlyRevenue, 0);
  const totalRooms = MOCK_COLIVINGS.reduce((sum, coliving) => sum + coliving.totalRooms, 0);
  const totalAvailable = MOCK_COLIVINGS.reduce((sum, coliving) => sum + coliving.availableRooms, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyColor = (available: number, total: number) => {
    const occupancyRate = ((total - available) / total) * 100;
    if (occupancyRate >= 90) return 'text-green-600';
    if (occupancyRate >= 70) return 'text-[var(--color-easyCo-mustard)]';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-[var(--color-easyCo-purple)] px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">My Co-livings</h1>
            <p className="text-white/80 text-sm">Manage your properties and rooms</p>
          </div>
          <Button 
            onClick={onAddColiving}
            className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">€{totalRevenue.toLocaleString()}</div>
            <div className="text-white/80 text-sm">Monthly Revenue</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{totalRooms}</div>
            <div className="text-white/80 text-sm">Total Rooms</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{totalAvailable}</div>
            <div className="text-white/80 text-sm">Available Now</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            { id: "all", label: "All Properties", count: MOCK_COLIVINGS.length },
            { id: "available", label: "Has Availability", count: 2 },
            { id: "full", label: "Fully Occupied", count: 1 }
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
              {filter.label} ({filter.count})
            </Badge>
          ))}
        </div>
      </div>

      {/* Co-livings List */}
      <div className="p-6 space-y-4">
        {MOCK_COLIVINGS.map((coliving) => (
          <Card key={coliving.id} className="shadow-sm border-0 rounded-2xl overflow-hidden">
            <div className="flex">
              <ImageWithFallback
                src={coliving.image}
                alt={coliving.title}
                className="w-24 h-24 object-cover flex-shrink-0 m-4 rounded-2xl"
              />
              
              <CardContent className="flex-1 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[var(--color-easyCo-purple)]">
                        {coliving.title}
                      </h3>
                      <Badge className={`${getStatusColor(coliving.status)} text-xs`}>
                        {coliving.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {coliving.address}
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="font-bold text-lg text-[var(--color-easyCo-purple)]">
                      €{coliving.monthlyRevenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-[var(--color-easyCo-gray-dark)]">per month</div>
                  </div>
                </div>

                {/* Room Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Bed className="w-4 h-4 text-[var(--color-easyCo-purple)]" />
                      <span className="font-semibold text-[var(--color-easyCo-purple)]">
                        {coliving.totalRooms}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--color-easyCo-gray-dark)]">Total Rooms</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className={`w-4 h-4 ${getOccupancyColor(coliving.availableRooms, coliving.totalRooms)}`} />
                      <span className={`font-semibold ${getOccupancyColor(coliving.availableRooms, coliving.totalRooms)}`}>
                        {coliving.occupiedRooms}/{coliving.totalRooms}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--color-easyCo-gray-dark)]">Occupied</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="w-4 h-4 text-[var(--color-easyCo-purple)]" />
                      <span className="font-semibold text-[var(--color-easyCo-purple)]">
                        €{coliving.averagePrice}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--color-easyCo-gray-dark)]">Avg. Price</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-xl"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => onEditColiving(coliving.id)}
                    className="flex-1 bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black text-xs rounded-xl"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Manage
                  </Button>
                </div>

                {/* Availability Alert */}
                {coliving.availableRooms > 0 && (
                  <div className="mt-3 p-2 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-xs text-green-700 text-center">
                      <Home className="w-3 h-3 inline mr-1" />
                      {coliving.availableRooms} room{coliving.availableRooms > 1 ? 's' : ''} available for booking
                    </div>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        ))}

        {/* Empty State */}
        {MOCK_COLIVINGS.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[var(--color-easyCo-gray-medium)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-[var(--color-easyCo-gray-dark)]" />
            </div>
            <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-2">No Properties Yet</h3>
            <p className="text-[var(--color-easyCo-gray-dark)] text-sm mb-4">
              Add your first co-living property to start managing rooms and bookings.
            </p>
            <Button 
              onClick={onAddColiving}
              className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Property
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}