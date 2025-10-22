import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Bed,
  Users,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Settings
} from "lucide-react";

const MOCK_ROOMS = [
  {
    id: 1,
    name: "Master Bedroom",
    description: "Spacious room with private bathroom and balcony access",
    size: "18 m²",
    price: 750,
    image: "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwYXBhcnRtZW50JTIwcm9vbSUyMGNvenl8ZW58MXx8fHwxNzU1ODc3MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "occupied",
    occupant: "Sarah M.",
    availableFrom: null,
    color: "#4A148C"
  },
  {
    id: 2,
    name: "Studio Room",
    description: "Cozy room with desk area, perfect for students",
    size: "14 m²",
    price: 620,
    image: "https://images.unsplash.com/photo-1556889882-50d7a74e8be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnQlMjBtb2Rlcm4lMjBjbGVhbnxlbnwxfHx8fDE3NTU4NzcxNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "available",
    occupant: null,
    availableFrom: "Feb 1, 2025",
    color: "#FFD600"
  },
  {
    id: 3,
    name: "Corner Room",
    description: "Bright corner room with large windows",
    size: "16 m²",
    price: 690,
    image: "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwYXBhcnRtZW50JTIwcm9vbSUyMGNvenl8ZW58MXx8fHwxNzU1ODc3MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "occupied",
    occupant: "Alex K.",
    availableFrom: null,
    color: "#7E57C2"
  },
  {
    id: 4,
    name: "Garden Room",
    description: "Ground floor room with direct garden access",
    size: "15 m²",
    price: 650,
    image: "https://images.unsplash.com/photo-1556889882-50d7a74e8be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnQlMjBtb2Rlcm4lMjBjbGVhbnxlbnwxfHx8fDE3NTU4NzcxNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "available",
    occupant: null,
    availableFrom: "Available Now",
    color: "#F57F17"
  }
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface EditColivingScreenProps {
  colivingId: number;
  onBack: () => void;
  onAddRoom: () => void;
  onEditRoom: (roomId: number) => void;
}

export function EditColivingScreen({ colivingId, onBack, onAddRoom, onEditRoom }: EditColivingScreenProps) {
  const [activeTab, setActiveTab] = useState("rooms");
  const [selectedRoom, setSelectedRoom] = useState<number | null>(1);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedRoomData = selectedRoom ? MOCK_ROOMS.find(r => r.id === selectedRoom) : null;

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10 w-10"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === new Date().getDate() && 
                     currentMonth === new Date().getMonth() && 
                     currentYear === new Date().getFullYear();
      
      // Mock availability data
      const isOccupied = selectedRoomData?.status === 'occupied' && day <= 15;
      const isBlocked = day >= 20 && day <= 25; // Mock blocked dates
      
      let dayColor = 'bg-gray-50 text-gray-700';
      if (isOccupied) dayColor = 'bg-red-100 text-red-700';
      if (isBlocked) dayColor = 'bg-gray-300 text-gray-600';
      if (!isOccupied && !isBlocked) dayColor = 'bg-green-100 text-green-700';

      days.push(
        <button
          key={day}
          className={`h-10 w-10 rounded-xl text-sm font-medium transition-all relative ${dayColor} ${
            isToday ? 'ring-2 ring-[var(--color-easyCo-purple)]' : ''
          } hover:scale-105 cursor-pointer`}
        >
          {day}
          {selectedRoomData && (
            <div 
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
              style={{ backgroundColor: selectedRoomData.color }}
            ></div>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-[var(--color-easyCo-purple)] px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-0 text-white hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-white">Modern House in Ixelles</h1>
            <p className="text-white/80 text-sm">Manage rooms and calendars</p>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Settings className="w-6 h-6" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="font-bold text-white">{MOCK_ROOMS.length}</div>
            <div className="text-white/80 text-xs">Rooms</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="font-bold text-white">{MOCK_ROOMS.filter(r => r.status === 'occupied').length}</div>
            <div className="text-white/80 text-xs">Occupied</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="font-bold text-white">{MOCK_ROOMS.filter(r => r.status === 'available').length}</div>
            <div className="text-white/80 text-xs">Available</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="font-bold text-white">€{MOCK_ROOMS.reduce((sum, room) => sum + room.price, 0)}</div>
            <div className="text-white/80 text-xs">Monthly</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="rooms" 
              className="flex-1 py-4 text-sm data-[state=active]:bg-[var(--color-easyCo-purple)] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--color-easyCo-purple)]"
            >
              <Bed className="w-4 h-4 mr-2" />
              Rooms
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="flex-1 py-4 text-sm data-[state=active]:bg-[var(--color-easyCo-purple)] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--color-easyCo-purple)]"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Room Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="mt-0">
            <div className="p-6">
              {/* Add Room Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-[var(--color-easyCo-purple)]">Room Management</h2>
                <Button 
                  onClick={onAddRoom}
                  className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Room
                </Button>
              </div>

              {/* Rooms List */}
              <div className="space-y-4">
                {MOCK_ROOMS.map((room) => (
                  <Card key={room.id} className="shadow-sm border-0 rounded-2xl overflow-hidden">
                    <div className="flex">
                      <ImageWithFallback
                        src={room.image}
                        alt={room.name}
                        className="w-20 h-20 object-cover flex-shrink-0 m-4 rounded-xl"
                      />
                      
                      <CardContent className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-[var(--color-easyCo-purple)]">
                                {room.name}
                              </h3>
                              <Badge className={`${getStatusColor(room.status)} text-xs`}>
                                {room.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-[var(--color-easyCo-gray-dark)] mb-2">
                              {room.description}
                            </p>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="font-bold text-lg text-[var(--color-easyCo-purple)]">
                              €{room.price}
                            </div>
                            <div className="text-xs text-[var(--color-easyCo-gray-dark)]">per month</div>
                          </div>
                        </div>

                        {/* Room Info */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center text-[var(--color-easyCo-gray-dark)]">
                              <Bed className="w-3 h-3 mr-1" />
                              {room.size}
                            </div>
                            {room.occupant && (
                              <div className="flex items-center text-[var(--color-easyCo-gray-dark)]">
                                <Users className="w-3 h-3 mr-1" />
                                {room.occupant}
                              </div>
                            )}
                          </div>
                          
                          {room.availableFrom && (
                            <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                              {room.availableFrom}
                            </Badge>
                          )}
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
                            onClick={() => onEditRoom(room.id)}
                            className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black text-xs rounded-xl"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50 text-xs rounded-xl px-3"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <div className="p-6">
              {/* Room Selector */}
              <div className="mb-6">
                <h2 className="font-semibold text-[var(--color-easyCo-purple)] mb-4">Room-Specific Calendar</h2>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {MOCK_ROOMS.map((room) => (
                    <Button
                      key={room.id}
                      variant={selectedRoom === room.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRoom(room.id)}
                      className={`flex-shrink-0 rounded-xl ${
                        selectedRoom === room.id
                          ? 'bg-[var(--color-easyCo-purple)] text-white'
                          : 'border-[var(--color-easyCo-gray-medium)]'
                      }`}
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: room.color }}
                      ></div>
                      {room.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              {selectedRoomData && (
                <Card className="rounded-2xl shadow-sm border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateMonth('prev')}
                        className="p-2"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      
                      <h3 className="font-semibold text-[var(--color-easyCo-purple)]">
                        {MONTHS[currentMonth]} {currentYear} - {selectedRoomData.name}
                      </h3>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateMonth('next')}
                        className="p-2"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-3 gap-3 mb-6 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                        <span>Occupied</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span>Blocked</span>
                      </div>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {WEEKDAYS.map((weekday) => (
                        <div
                          key={weekday}
                          className="h-8 flex items-center justify-center text-xs font-medium text-[var(--color-easyCo-gray-dark)]"
                        >
                          {weekday}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-6">
                      {renderCalendar()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="flex-1 border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-xl"
                      >
                        <EyeOff className="w-4 h-4 mr-2" />
                        Block Dates
                      </Button>
                      <Button 
                        className="flex-1 bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-xl"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Make Available
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}