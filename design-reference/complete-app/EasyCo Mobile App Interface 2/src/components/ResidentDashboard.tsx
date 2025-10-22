import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

import { 
  Home,
  Users,
  DollarSign,
  AlertTriangle,
  Calendar,
  MessageCircle,
  Plus,
  UserPlus,
  Wrench,
  TrendingUp,
  Clock,
  MapPin,
  Wifi,
  Car,
  Utensils,
  Coffee,
  Zap,
  CheckCircle,
  AlertCircle,
  Bell,
  Eye,
  ArrowRight,
  Star,
  Heart,
  Target
} from "lucide-react";

interface ResidentDashboardProps {
  onViewExpenses: () => void;
  onAddExpense: () => void;
  onInviteRoommate: () => void;
  onReportIssue: () => void;
  onViewCalendar: () => void;
  onViewMessages: () => void;
  onViewNotifications: () => void;
}

export function ResidentDashboard({ 
  onViewExpenses,
  onAddExpense,
  onInviteRoommate,
  onReportIssue,
  onViewCalendar,
  onViewMessages,
  onViewNotifications
}: ResidentDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "community">("overview");

  // Current coliving data
  const currentColiving = {
    id: 1,
    name: "Brussels Central Coliving",
    address: "Rue de la Loi 123, Brussels",
    image: "https://images.unsplash.com/photo-1556909135-f7bdad19c4f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1NTUyNzYwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    roomNumber: "Room 3B",
    moveInDate: "Sep 2024",
    contractEnd: "Sep 2025"
  };

  // Roommates data
  const roommates = [
    {
      id: 1,
      name: "Emma",
      room: "3A",
      avatar: "https://images.unsplash.com/photo-1561065533-316e3142d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMGhhcHB5fGVufDF8fHx8MTc1NTUyNzU5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "online"
    },
    {
      id: 2,
      name: "Marcus",
      room: "3C",
      avatar: "https://images.unsplash.com/photo-1670841062505-1f8f6d45862a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMHBlcnNvbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzU1NTI3NTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "offline"
    },
    {
      id: 3,
      name: "Sofia",
      room: "3D",
      avatar: "https://images.unsplash.com/photo-1624240046299-03455da0a0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2xsZWdlJTIwc3R1ZGVudCUyMHBvcnRyYWl0JTIwZnJpZW5kbHl8ZW58MXx8fHwxNzU1NTI3NTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "online"
    }
  ];

  // Bills and expenses data
  const financialData = {
    rentPaid: 850,
    rentTotal: 900,
    billsPaid: 120,
    billsTotal: 150,
    sharedExpenses: 45,
    nextRentDue: "Jan 1, 2025",
    pendingExpenses: 3
  };

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: "expense_added",
      title: "Emma added grocery expense",
      subtitle: "€23.50 - Shared kitchen supplies",
      time: "2 hours ago",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "maintenance_completed",
      title: "WiFi issue resolved",
      subtitle: "Maintenance request #142",
      time: "1 day ago",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      id: 3,
      type: "new_roommate",
      title: "Alex joined your coliving",
      subtitle: "Room 3E - Welcome party planned!",
      time: "3 days ago",
      icon: UserPlus,
      color: "text-blue-600"
    }
  ];

  // Upcoming tasks/events
  const upcomingTasks = [
    {
      id: 1,
      title: "Rent payment due",
      date: "Jan 1",
      type: "payment",
      priority: "high"
    },
    {
      id: 2,
      title: "Monthly house meeting",
      date: "Jan 3",
      type: "meeting",
      priority: "medium"
    },
    {
      id: 3,
      title: "Cleaning schedule: Kitchen",
      date: "Tomorrow",
      type: "chore",
      priority: "medium"
    }
  ];

  const rentProgress = (financialData.rentPaid / financialData.rentTotal) * 100;
  const billsProgress = (financialData.billsPaid / financialData.billsTotal) * 100;

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--color-easyCo-purple)] via-[var(--color-easyCo-purple-dark)] to-purple-800 px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Good evening! 🏠</h1>
            <p className="text-purple-100">Welcome to your coliving hub</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onViewNotifications}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-2xl p-2 relative"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-easyCo-mustard)] rounded-full"></div>
            </Button>
            <Button
              onClick={onViewMessages}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-2xl p-2 relative"
            >
              <MessageCircle className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-easyCo-mustard)] rounded-full"></div>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-xl font-bold text-white">{roommates.length + 1}</div>
            <div className="text-xs text-purple-100">Residents</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-xl font-bold text-white">€{financialData.sharedExpenses}</div>
            <div className="text-xs text-purple-100">Pending</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-xl font-bold text-white">{upcomingTasks.length}</div>
            <div className="text-xs text-purple-100">Tasks</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-xl font-bold text-white">94%</div>
            <div className="text-xs text-purple-100">Happy</div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6 pb-8 -mt-4">
        {/* Current Coliving Property Card */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white overflow-hidden">
          <div className="relative h-48">
            <img 
              src={currentColiving.image} 
              alt={currentColiving.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{currentColiving.name}</h3>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{currentColiving.address}</span>
                  </div>
                </div>
                <Badge className="bg-[var(--color-easyCo-mustard)] text-black border-0">
                  {currentColiving.roomNumber}
                </Badge>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-purple-50 rounded-2xl">
                <div className="text-sm text-[var(--color-easyCo-purple)] mb-1">Moved in</div>
                <div className="font-semibold text-[var(--color-easyCo-purple)]">{currentColiving.moveInDate}</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-2xl">
                <div className="text-sm text-[var(--color-easyCo-mustard-dark)] mb-1">Contract until</div>
                <div className="font-semibold text-[var(--color-easyCo-mustard-dark)]">{currentColiving.contractEnd}</div>
              </div>
            </div>

            {/* Roommates */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[var(--color-easyCo-purple)]">Your Roommates</h4>
                <span className="text-sm text-[var(--color-easyCo-gray-dark)]">{roommates.length} other residents</span>
              </div>
              <div className="flex items-center gap-3">
                {roommates.map((roommate) => (
                  <div key={roommate.id} className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                        <AvatarImage src={roommate.avatar} alt={roommate.name} />
                        <AvatarFallback>{roommate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        roommate.status === "online" ? "bg-[var(--color-easyCo-success)]" : "bg-gray-300"
                      }`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--color-easyCo-purple)]">{roommate.name}</div>
                      <div className="text-xs text-[var(--color-easyCo-gray-dark)]">{roommate.room}</div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={onInviteRoommate}
                  variant="outline"
                  size="sm"
                  className="ml-2 border-[var(--color-easyCo-mustard)] text-[var(--color-easyCo-purple)] hover:bg-yellow-50 rounded-xl"
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Invite
                </Button>
              </div>
            </div>

            {/* Amenities */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-2 bg-[var(--color-easyCo-gray-light)] rounded-xl">
                <Wifi className="w-5 h-5 text-[var(--color-easyCo-purple)] mx-auto mb-1" />
                <span className="text-xs text-[var(--color-easyCo-gray-dark)]">WiFi</span>
              </div>
              <div className="text-center p-2 bg-[var(--color-easyCo-gray-light)] rounded-xl">
                <Utensils className="w-5 h-5 text-[var(--color-easyCo-purple)] mx-auto mb-1" />
                <span className="text-xs text-[var(--color-easyCo-gray-dark)]">Kitchen</span>
              </div>
              <div className="text-center p-2 bg-[var(--color-easyCo-gray-light)] rounded-xl">
                <Car className="w-5 h-5 text-[var(--color-easyCo-purple)] mx-auto mb-1" />
                <span className="text-xs text-[var(--color-easyCo-gray-dark)]">Parking</span>
              </div>
              <div className="text-center p-2 bg-[var(--color-easyCo-gray-light)] rounded-xl">
                <Coffee className="w-5 h-5 text-[var(--color-easyCo-purple)] mx-auto mb-1" />
                <span className="text-xs text-[var(--color-easyCo-gray-dark)]">Lounge</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rent & Bills Progress */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Financial Overview</h3>
              <Button
                onClick={onViewExpenses}
                variant="outline"
                size="sm"
                className="border-green-200 text-green-600 hover:bg-green-50 rounded-xl"
              >
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>

            <div className="space-y-6">
              {/* Rent Progress */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800">Monthly Rent</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">€{financialData.rentPaid} / €{financialData.rentTotal}</div>
                    <div className="text-xs text-gray-500">Due: {financialData.nextRentDue}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${rentProgress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">Paid</span>
                  <span className="text-xs text-gray-500">{Math.round(rentProgress)}% complete</span>
                </div>
              </div>

              {/* Bills Progress */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-800">Utilities & Bills</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">€{financialData.billsPaid} / €{financialData.billsTotal}</div>
                    <div className="text-xs text-gray-500">This month</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${billsProgress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">Paid</span>
                  <span className="text-xs text-gray-500">{Math.round(billsProgress)}% complete</span>
                </div>
              </div>

              {/* Shared Expenses */}
              <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <div className="font-medium text-yellow-800">Shared Expenses Pending</div>
                    <div className="text-sm text-yellow-600">
                      €{financialData.sharedExpenses} from {financialData.pendingExpenses} expenses
                    </div>
                  </div>
                  <Button 
                    onClick={onViewExpenses}
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 rounded-xl"
                  >
                    Review
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-[var(--color-easyCo-purple)] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={onAddExpense}
                className="h-20 bg-gradient-to-br from-[var(--color-easyCo-mustard)] to-[var(--color-easyCo-mustard-dark)] hover:from-[var(--color-easyCo-mustard-dark)] hover:to-yellow-600 text-black rounded-2xl flex flex-col gap-2 shadow-lg"
              >
                <Plus className="w-6 h-6" />
                <span className="text-sm">Add Expense</span>
              </Button>
              
              <Button
                onClick={onInviteRoommate}
                className="h-20 bg-gradient-to-br from-[var(--color-easyCo-purple)] to-[var(--color-easyCo-purple-dark)] hover:from-[var(--color-easyCo-purple-dark)] hover:to-purple-800 text-white rounded-2xl flex flex-col gap-2 shadow-lg"
              >
                <UserPlus className="w-6 h-6" />
                <span className="text-sm">Invite Roommate</span>
              </Button>
              
              <Button
                onClick={onReportIssue}
                className="h-20 bg-gradient-to-br from-[var(--color-easyCo-error)] to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl flex flex-col gap-2 shadow-lg"
              >
                <AlertTriangle className="w-6 h-6" />
                <span className="text-sm">Report Issue</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks & Events */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Upcoming Tasks</h3>
              <Button
                onClick={onViewCalendar}
                variant="outline"
                size="sm"
                className="border-green-200 text-green-600 hover:bg-green-50 rounded-xl"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
            </div>

            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === "high" ? "bg-red-500" : 
                    task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{task.title}</div>
                    <div className="text-xs text-gray-500">{task.date}</div>
                  </div>
                  <Badge className={`text-xs ${
                    task.type === "payment" ? "bg-red-100 text-red-700" :
                    task.type === "meeting" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {task.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
            
            <div className="space-y-3">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                    <div className={`w-10 h-10 rounded-xl ${
                      activity.color.includes('green') ? 'bg-green-100' : 
                      activity.color.includes('blue') ? 'bg-blue-100' : 'bg-yellow-100'
                    } flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.subtitle}</p>
                    </div>
                    <div className="text-xs text-gray-400">{activity.time}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Community Mood */}
        <Card className="border-0 rounded-3xl shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-[var(--color-easyCo-purple-light)]">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-easyCo-mustard)] to-[var(--color-easyCo-mustard-dark)] rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-easyCo-purple)] mb-2">Community Happiness: 94% 💜</h3>
                <p className="text-[var(--color-easyCo-purple)] text-sm leading-relaxed mb-3">
                  Your coliving community is thriving! High satisfaction with cleanliness, 
                  communication, and shared activities.
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {roommates.slice(0, 3).map((roommate) => (
                      <Avatar key={roommate.id} className="w-6 h-6 border-2 border-white">
                        <AvatarImage src={roommate.avatar} alt={roommate.name} />
                        <AvatarFallback>{roommate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs text-[var(--color-easyCo-purple)]">+You rated this month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}