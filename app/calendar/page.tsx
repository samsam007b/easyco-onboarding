'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock events data
  const events = [
    {
      id: '1',
      title: 'Rent Payment Due',
      date: '2024-11-05',
      type: 'payment',
      time: '17:00',
    },
    {
      id: '2',
      title: 'House Meeting',
      date: '2024-11-08',
      type: 'meeting',
      time: '19:00',
    },
    {
      id: '3',
      title: 'Kitchen Cleaning',
      date: '2024-11-10',
      type: 'chore',
      time: '10:00',
    },
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'bg-red-100 text-red-700';
      case 'meeting':
        return 'bg-yellow-100 text-yellow-700';
      case 'chore':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
                <p className="text-gray-600 mt-1">Manage your events and tasks</p>
              </div>
            </div>
            <Button className="bg-purple-700 hover:bg-purple-800 rounded-2xl gap-2">
              <Plus className="h-5 w-5" />
              Add Event
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={previousMonth}
                      className="rounded-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextMonth}
                      className="rounded-full"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Calendar view coming soon</p>
                  <p className="text-sm text-gray-500">
                    Full calendar integration is being developed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div>
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{event.date}</p>
                        <p>{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
