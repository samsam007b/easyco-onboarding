import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Star, 
  Calendar,
  DollarSign,
  Bed,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  CheckCircle,
  Wifi,
  Tv,
  Car,
  Coffee
} from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ROOM_DATA = {
  id: 2,
  name: "Studio Room",
  description: "Cozy room with desk area, perfect for students. This bright room features a comfortable single bed, spacious wardrobe, study desk with chair, and large windows providing plenty of natural light. The room is fully furnished and ready to move in.",
  price: 620,
  size: "14 m²",
  availableFrom: "Feb 1, 2025",
  images: [
    "https://images.unsplash.com/photo-1556889882-50d7a74e8be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnQlMjBtb2Rlcm4lMjBjbGVhbnxlbnwxfHx8fDE3NTU4NzcxNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwYXBhcnRtZW50JTIwcm9vbSUyMGNvenl8ZW58MXx8fHwxNzU1ODc3MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ],
  coliving: {
    title: "Modern House in Ixelles",
    address: "Rue de la Paix 15, 1050 Ixelles",
    rating: 4.8,
    reviewCount: 24,
    currentRoommates: [
      { name: "Sarah M.", age: 23, occupation: "Student" },
      { name: "Alex K.", age: 25, occupation: "Developer" }
    ]
  },
  amenities: [
    { icon: Wifi, label: "High-speed WiFi" },
    { icon: Tv, label: "Smart TV" },
    { icon: Coffee, label: "Coffee machine" },
    { icon: Car, label: "Parking available" }
  ],
  roomFeatures: [
    "Single bed with quality mattress",
    "Study desk with ergonomic chair",
    "Large wardrobe with hangers",
    "Full-length mirror",
    "Blackout curtains",
    "Desk lamp and reading light"
  ]
};

interface RoomDetailsScreenProps {
  roomId: number;
  colivingId: number;  
  onBack: () => void;
  onBookRoom: () => void;
  onViewCalendar: () => void;
}

export function RoomDetailsScreen({ roomId, colivingId, onBack, onBookRoom, onViewCalendar }: RoomDetailsScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 1)); // February 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLiked, setIsLiked] = useState(false);

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

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? ROOM_DATA.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === ROOM_DATA.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

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
      const isSelected = selectedDate?.getDate() === day &&
                        selectedDate?.getMonth() === currentMonth &&
                        selectedDate?.getFullYear() === currentYear;
      
      // Mock availability: available from day 1 onwards
      const isAvailable = day >= 1;

      days.push(
        <button
          key={day}
          onClick={() => {
            if (isAvailable) {
              setSelectedDate(new Date(currentYear, currentMonth, day));
            }
          }}
          className={`h-10 w-10 rounded-xl text-sm font-medium transition-all ${
            isAvailable 
              ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          } ${
            isSelected ? 'ring-2 ring-[var(--color-easyCo-purple)] ring-offset-2' : ''
          } ${
            isToday ? 'ring-1 ring-[var(--color-easyCo-mustard)]' : ''
          }`}
          disabled={!isAvailable}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-0">
            <ArrowLeft className="w-6 h-6 text-[var(--color-easyCo-purple)]" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-[var(--color-easyCo-purple)]">{ROOM_DATA.name}</h1>
            <p className="text-sm text-[var(--color-easyCo-gray-dark)]">{ROOM_DATA.coliving.title}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full ${isLiked ? 'text-red-500' : 'text-[var(--color-easyCo-gray-dark)]'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 rounded-full text-[var(--color-easyCo-gray-dark)]">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pb-24">
        {/* Image Gallery */}
        <div className="relative">
          <ImageWithFallback
            src={ROOM_DATA.images[currentImageIndex]}
            alt={ROOM_DATA.name}
            className="w-full h-64 object-cover"
          />
          
          {/* Image Navigation */}
          {ROOM_DATA.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-0"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {ROOM_DATA.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Room Info */}
          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="font-semibold text-[var(--color-easyCo-purple)] mb-2">
                    {ROOM_DATA.name}
                  </h2>
                  <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    {ROOM_DATA.coliving.address}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-[var(--color-easyCo-mustard)] mr-1" fill="currentColor" />
                      <span className="font-medium">{ROOM_DATA.coliving.rating}</span>
                      <span className="text-[var(--color-easyCo-gray-dark)] ml-1">
                        ({ROOM_DATA.coliving.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-[var(--color-easyCo-gray-dark)]">
                      <Bed className="w-4 h-4 mr-1" />
                      {ROOM_DATA.size}
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className="font-bold text-2xl text-[var(--color-easyCo-purple)]">
                    €{ROOM_DATA.price}
                  </div>
                  <div className="text-sm text-[var(--color-easyCo-gray-dark)]">per month</div>
                  <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                    {ROOM_DATA.availableFrom}
                  </Badge>
                </div>
              </div>

              <p className="text-[var(--color-easyCo-gray-dark)] leading-relaxed">
                {ROOM_DATA.description}
              </p>
            </CardContent>
          </Card>

          {/* Room Features */}
          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-4">Room Features</h3>
              <div className="grid grid-cols-1 gap-2">
                {ROOM_DATA.roomFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-[var(--color-easyCo-gray-dark)]">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shared Amenities */}
          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-4">Shared Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {ROOM_DATA.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <amenity.icon className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                    <span className="text-sm text-[var(--color-easyCo-gray-dark)]">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Roommates */}
          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-4">
                Your Future Roommates ({ROOM_DATA.coliving.currentRoommates.length})
              </h3>
              <div className="space-y-3">
                {ROOM_DATA.coliving.currentRoommates.map((roommate, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-easyCo-purple)]/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                    </div>
                    <div>
                      <div className="font-medium text-[var(--color-easyCo-purple)] text-sm">
                        {roommate.name}, {roommate.age}
                      </div>
                      <div className="text-xs text-[var(--color-easyCo-gray-dark)]">
                        {roommate.occupation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability Calendar */}
          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--color-easyCo-purple)]">Availability Calendar</h3>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={onViewCalendar}
                  className="text-xs border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-xl"
                >
                  Full Calendar
                </Button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <h4 className="font-medium text-[var(--color-easyCo-purple)]">
                  {MONTHS[currentMonth]} {currentYear}
                </h4>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
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
              <div className="grid grid-cols-7 gap-1 mb-4">
                {renderCalendar()}
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                  <span>Not available</span>
                </div>
              </div>

              {selectedDate && (
                <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-sm text-center">
                    <span className="font-medium text-green-800">
                      Selected: {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-easyCo-gray-medium)] p-6">
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="flex-1 border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-2xl py-4"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Viewing
          </Button>
          <Button 
            onClick={onBookRoom}
            className="flex-1 bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl py-4"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Book This Room
          </Button>
        </div>
      </div>
    </div>
  );
}