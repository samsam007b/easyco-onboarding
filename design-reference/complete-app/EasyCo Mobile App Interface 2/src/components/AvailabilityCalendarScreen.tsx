import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Users,
  Star,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Mock property data
const PROPERTY_DATA = {
  id: 1,
  title: "Cozy Studio in Ixelles",
  price: "€650",
  location: "Brussels, Ixelles",
  roommates: 2,
  rating: 4.8,
  reviewCount: 24,
  image: "https://images.unsplash.com/photo-1662454419622-a41092ecd245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1NTQxNDgwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  totalRooms: 3,
  occupiedRooms: 2,
  availableRooms: 1
};

// Mock calendar data for 2025
const CALENDAR_DATA = {
  "2025-01": {
    available: [15, 20, 25],
    moveOut: [14, 19, 24],
    occupied: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 16, 17, 18, 21, 22, 23, 26, 27, 28, 29, 30, 31]
  },
  "2025-02": {
    available: [1, 5, 10, 15, 20],
    moveOut: [4, 9, 14, 19],
    occupied: [2, 3, 6, 7, 8, 11, 12, 13, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28]
  },
  "2025-03": {
    available: [1, 8, 15, 22, 29],
    moveOut: [7, 14, 21, 28],
    occupied: [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 23, 24, 25, 26, 27, 30, 31]
  }
};

interface AvailabilityCalendarScreenProps {
  propertyId: number;
  onBack: () => void;
  onBookViewing: () => void;
}

export function AvailabilityCalendarScreen({ propertyId, onBack, onBookViewing }: AvailabilityCalendarScreenProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
  const monthData = CALENDAR_DATA[monthKey] || { available: [], moveOut: [], occupied: [] };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

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
    setSelectedDate(null);
  };

  const getDayStatus = (day: number) => {
    if (monthData.available.includes(day)) return 'available';
    if (monthData.moveOut.includes(day)) return 'moveOut';
    if (monthData.occupied.includes(day)) return 'occupied';
    return 'future';
  };

  const getDayStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 text-white';
      case 'moveOut':
        return 'bg-[var(--color-easyCo-mustard)] text-black';
      case 'occupied':
        return 'bg-red-100 text-red-600';
      case 'future':
        return 'bg-gray-100 text-gray-400';
      default:
        return 'bg-gray-100 text-gray-400';
    }
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
      const status = getDayStatus(day);
      const isToday = day === new Date().getDate() && 
                     currentMonth === new Date().getMonth() && 
                     currentYear === new Date().getFullYear();
      const isSelected = selectedDate?.getDate() === day &&
                        selectedDate?.getMonth() === currentMonth &&
                        selectedDate?.getFullYear() === currentYear;

      days.push(
        <button
          key={day}
          onClick={() => {
            if (status === 'available' || status === 'moveOut') {
              setSelectedDate(new Date(currentYear, currentMonth, day));
            }
          }}
          className={`h-10 w-10 rounded-xl text-sm font-medium transition-all relative ${
            getDayStatusColor(status)
          } ${
            isSelected ? 'ring-2 ring-[var(--color-easyCo-purple)] ring-offset-2' : ''
          } ${
            isToday ? 'ring-1 ring-[var(--color-easyCo-purple)]' : ''
          } ${
            status === 'available' || status === 'moveOut' ? 'cursor-pointer hover:scale-105' : 'cursor-default'
          }`}
          disabled={status === 'occupied' || status === 'future'}
        >
          {day}
          {status === 'available' && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
          {status === 'moveOut' && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-easyCo-mustard)] rounded-full border-2 border-white"></div>
          )}
        </button>
      );
    }

    return days;
  };

  const getSelectedDateInfo = () => {
    if (!selectedDate) return null;
    
    const day = selectedDate.getDate();
    const status = getDayStatus(day);
    
    if (status === 'available') {
      return {
        title: "Room Available",
        description: "You can move in on this date",
        icon: CheckCircle,
        color: "text-green-600"
      };
    } else if (status === 'moveOut') {
      return {
        title: "Move-out Date",
        description: "Current tenant moves out, room available next day",
        icon: Clock,
        color: "text-[var(--color-easyCo-mustard)]"
      };
    }
    
    return null;
  };

  const selectedDateInfo = getSelectedDateInfo();

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-0">
            <ArrowLeft className="w-6 h-6 text-[var(--color-easyCo-purple)]" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-[var(--color-easyCo-purple)]">Availability Calendar</h1>
            <p className="text-sm text-[var(--color-easyCo-gray-dark)]">Find the perfect move-in date</p>
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div className="p-6">
        <Card className="rounded-2xl shadow-sm border-0 mb-6">
          <div className="flex">
            <ImageWithFallback
              src={PROPERTY_DATA.image}
              alt={PROPERTY_DATA.title}
              className="w-20 h-20 object-cover rounded-2xl m-4"
            />
            <CardContent className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-1">
                    {PROPERTY_DATA.title}
                  </h3>
                  <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm mb-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {PROPERTY_DATA.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[var(--color-easyCo-purple)]">{PROPERTY_DATA.price}</div>
                  <div className="text-xs text-[var(--color-easyCo-gray-dark)]">per month</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center text-[var(--color-easyCo-gray-dark)]">
                    <Users className="w-3 h-3 mr-1" />
                    {PROPERTY_DATA.roommates} roommates
                  </div>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-[var(--color-easyCo-mustard)] mr-1" fill="currentColor" />
                    <span className="font-medium">{PROPERTY_DATA.rating}</span>
                  </div>
                </div>
                
                <Badge className="bg-green-100 text-green-800 text-xs">
                  {PROPERTY_DATA.availableRooms}/{PROPERTY_DATA.totalRooms} available
                </Badge>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Calendar Header */}
        <Card className="rounded-2xl shadow-sm border-0 mb-6">
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
              
              <h2 className="font-semibold text-[var(--color-easyCo-purple)]">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              
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
            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Available to move in</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[var(--color-easyCo-mustard)] rounded"></div>
                <span>Tenant moves out</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                <span>Future dates</span>
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
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Info */}
        {selectedDate && selectedDateInfo && (
          <Card className="rounded-2xl shadow-sm border-0 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  selectedDateInfo.title === "Room Available" ? 'bg-green-100' : 'bg-[var(--color-easyCo-mustard)]/20'
                }`}>
                  <selectedDateInfo.icon className={`w-6 h-6 ${selectedDateInfo.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-1">
                    {selectedDateInfo.title}
                  </h3>
                  <p className="text-sm text-[var(--color-easyCo-gray-dark)] mb-3">
                    {selectedDateInfo.description}
                  </p>
                  <div className="text-sm">
                    <span className="font-medium">Selected Date: </span>
                    <span className="text-[var(--color-easyCo-purple)]">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onBookViewing}
            className="w-full bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black py-4 rounded-2xl"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Viewing
          </Button>
          
          {selectedDate && (
            <Button 
              variant="outline"
              className="w-full border-2 border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] py-4 rounded-2xl"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Apply for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 text-sm mb-1">Booking Information</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Availability dates are updated in real-time. We recommend booking a viewing as soon as possible for your preferred dates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}