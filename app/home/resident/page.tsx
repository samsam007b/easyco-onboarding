'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { createBrowserClient } from '@supabase/ssr';
import {
  Users,
  DollarSign,
  Calendar,
  Heart,
  Bell,
  MessageCircle,
  Plus,
  UserPlus,
  AlertTriangle,
  MapPin,
  Wifi,
  Utensils,
  Car,
  Home,
  LayoutDashboard,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { QuickStatsCard } from '@/components/home/QuickStatsCard';
import { ActivityFeed, ActivityItem } from '@/components/home/ActivityFeed';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ResidentHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    residentsCount: 6,
    pendingExpenses: 125,
    upcomingTasks: 3,
    communityHappiness: 94,
  });
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [roommates, setRoommates] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [financialStatus, setFinancialStatus] = useState({
    rentPaid: 85,
    billsPaid: 100,
    sharedExpensesPending: 45,
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadResidentData();
  }, [user]);

  const loadResidentData = async () => {
    if (!user) return;

    // TODO: Load actual resident data from database
    // For now, using mock data

    // Mock property data
    setCurrentProperty({
      id: '1',
      name: 'Brussels Coliving Hub',
      address: 'Rue de la Loi 123, 1000 Brussels',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      room_number: '204',
      move_in_date: '2024-01-15',
      contract_end: '2024-12-31',
      amenities: ['wifi', 'kitchen', 'parking', 'workspace'],
    });

    // Mock roommates data
    setRoommates([
      {
        id: '1',
        name: 'Sophie M.',
        avatar: 'https://i.pravatar.cc/150?img=1',
        online: true,
      },
      {
        id: '2',
        name: 'Thomas L.',
        avatar: 'https://i.pravatar.cc/150?img=2',
        online: true,
      },
      {
        id: '3',
        name: 'Marie D.',
        avatar: 'https://i.pravatar.cc/150?img=3',
        online: false,
      },
      {
        id: '4',
        name: 'Lucas B.',
        avatar: 'https://i.pravatar.cc/150?img=4',
        online: false,
      },
    ]);

    // Mock recent activities
    setRecentActivities([
      {
        id: '1',
        icon: DollarSign,
        iconBgColor: 'bg-green-500',
        title: 'Shared expense added',
        subtitle: 'Sophie added grocery expenses (€45)',
        time: '2h ago',
      },
      {
        id: '2',
        icon: CheckCircle2,
        iconBgColor: 'bg-blue-500',
        title: 'Maintenance completed',
        subtitle: 'Kitchen sink repair finished',
        time: '1d ago',
      },
      {
        id: '3',
        icon: UserPlus,
        iconBgColor: 'bg-purple-500',
        title: 'New roommate',
        subtitle: 'Lucas moved into room 203',
        time: '3d ago',
      },
    ]);
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, any> = {
      wifi: Wifi,
      kitchen: Utensils,
      parking: Car,
      workspace: Home,
    };
    const Icon = icons[amenity] || Home;
    return <Icon className="h-5 w-5 text-orange-700" />;
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{greeting()}! 🏠</h1>
              <p className="text-gray-600 mt-1">Welcome to your coliving hub</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full relative"
                onClick={() => router.push('/notifications')}
              >
                <Bell className="h-5 w-5" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full relative"
                onClick={() => router.push('/messages')}
              >
                <MessageCircle className="h-5 w-5" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl gap-2"
                onClick={() => router.push('/dashboard/resident')}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickStatsCard
            icon={Users}
            label="Residents"
            value={stats.residentsCount}
            iconBgColor="bg-orange-100"
          />
          <QuickStatsCard
            icon={DollarSign}
            label="Pending Expenses"
            value={`€${stats.pendingExpenses}`}
            iconBgColor="bg-orange-100"
          />
          <QuickStatsCard
            icon={Calendar}
            label="Upcoming Tasks"
            value={stats.upcomingTasks}
            iconBgColor="bg-blue-100"
          />
          <QuickStatsCard
            icon={Heart}
            label="Community Happiness"
            value={`${stats.communityHappiness}%`}
            iconBgColor="bg-pink-100"
          />
        </div>

        {/* Current Coliving Property Card */}
        {currentProperty && (
          <Card className="rounded-3xl shadow-xl overflow-hidden">
            <div className="relative h-64">
              <img
                src={currentProperty.image}
                alt={currentProperty.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <Badge className="mb-3 bg-yellow-500 text-white">
                  Room {currentProperty.room_number}
                </Badge>
                <h2 className="text-3xl font-bold mb-2">{currentProperty.name}</h2>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="h-4 w-4" />
                  <span>{currentProperty.address}</span>
                </div>
              </div>
            </div>
            <CardContent className="p-6 space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Move-in Date</p>
                  <p className="font-semibold text-green-700">
                    {new Date(currentProperty.move_in_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Contract Ends</p>
                  <p className="font-semibold text-blue-700">
                    {new Date(currentProperty.contract_end).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Roommates */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Roommates ({roommates.length})</h3>
                  <Button
                    size="sm"
                    className="bg-purple-700 hover:bg-purple-800 rounded-xl"
                    onClick={() => router.push('/matching/swipe?context=resident_matching')}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {roommates.map((roommate) => (
                    <div key={roommate.id} className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={roommate.avatar} />
                          <AvatarFallback>{roommate.name[0]}</AvatarFallback>
                        </Avatar>
                        {roommate.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{roommate.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-bold text-lg mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {currentProperty.amenities.map((amenity: string) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl"
                    >
                      {getAmenityIcon(amenity)}
                      <span className="text-sm font-medium capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Overview */}
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-xl mb-4">Financial Overview</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Rent</span>
                  <span className="text-gray-600">{financialStatus.rentPaid}% paid</span>
                </div>
                <Progress value={financialStatus.rentPaid} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Bills & Utilities</span>
                  <span className="text-gray-600">{financialStatus.billsPaid}% paid</span>
                </div>
                <Progress value={financialStatus.billsPaid} className="h-2" />
              </div>

              <div className="p-4 bg-yellow-50 rounded-xl flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    Shared expenses pending review
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    €{financialStatus.sharedExpensesPending} in groceries and supplies
                  </p>
                </div>
                <Button size="sm" variant="outline" className="rounded-xl">
                  Review
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 rounded-xl">
                View All
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl">
                Pay Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            className="h-24 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
            onClick={() => router.push('/expenses/add')}
          >
            <div className="flex items-center gap-3">
              <Plus className="h-6 w-6" />
              <span className="text-lg font-semibold">Add Expense</span>
            </div>
          </Button>
          <Button
            className="h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            onClick={() => router.push('/matching/swipe?context=resident_matching')}
          >
            <div className="flex items-center gap-3">
              <UserPlus className="h-6 w-6" />
              <span className="text-lg font-semibold">Invite Roommate</span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-24 rounded-2xl border-2 border-red-300 hover:bg-red-50"
            onClick={() => router.push('/issues/report')}
          >
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-lg font-semibold">Report Issue</span>
            </div>
          </Button>
        </div>

        {/* Upcoming Tasks & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-4">Upcoming Tasks & Events</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">Rent payment due</p>
                    <p className="text-sm text-gray-600">Tomorrow, 5:00 PM</p>
                  </div>
                  <Badge className="bg-red-100 text-red-700">Payment</Badge>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">House meeting</p>
                    <p className="text-sm text-gray-600">Friday, 7:00 PM</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">Meeting</Badge>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">Kitchen cleaning</p>
                    <p className="text-sm text-gray-600">Saturday, 10:00 AM</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Chore</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 rounded-xl">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
            </CardContent>
          </Card>

          <ActivityFeed activities={recentActivities} maxItems={5} />
        </div>

        {/* Community Mood Card */}
        <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-purple-600 to-purple-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-yellow-500 rounded-2xl">
                <Heart className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  Community Happiness: {stats.communityHappiness}% 💜
                </h3>
                <p className="text-white/90 mb-4">
                  Your coliving community is thriving! Everyone rated their satisfaction highly
                  this month.
                </p>
                <div className="flex -space-x-2">
                  {roommates.slice(0, 4).map((roommate) => (
                    <Avatar key={roommate.id} className="border-2 border-white">
                      <AvatarImage src={roommate.avatar} />
                      <AvatarFallback>{roommate.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-white/20 flex items-center justify-center text-sm font-semibold">
                    +2
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
