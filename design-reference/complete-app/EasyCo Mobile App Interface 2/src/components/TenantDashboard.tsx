import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  DollarSign, 
  Home, 
  MapPin, 
  Calendar, 
  Users, 
  Zap, 
  Wifi, 
  Droplets, 
  Wrench, 
  Bell, 
  MessageCircle, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  Coffee,
  Star
} from "lucide-react";

interface TenantDashboardProps {
  onSplitExpenses?: () => void;
  onChat?: () => void;
  onViewExpenses?: () => void;
}

const CURRENT_FLATSHARE = {
  id: 1,
  name: "Sunny Apartment in Ixelles",
  address: "Rue de la Paix 15, 1050 Ixelles, Brussels",
  image: "https://images.unsplash.com/photo-1585945148306-db646373834d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzU4NDc1MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  moveInDate: "Sep 2024",
  roomNumber: "Room 3",
  monthlyRent: 650,
  roommates: [
    {
      id: 1,
      name: "Alex",
      avatar: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwc3R1ZGVudHxlbnwxfHx8fDE3NTg0NjEzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "online",
      study: "Engineering"
    },
    {
      id: 2,
      name: "Sofia",
      avatar: "https://images.unsplash.com/photo-1697393140613-5ad40c84ab36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHBvcnRyYWl0JTIwZmVtYWxlfGVufDF8fHx8MTc1ODQ3NTE4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "away",
      study: "Business"
    },
    {
      id: 3,
      name: "Miguel",
      avatar: "https://images.unsplash.com/photo-1561065533-316e3142d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjB5b3VuZyUyMHBlcnNvbnxlbnwxfHx8fDE3NTg0MjUwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "online",
      study: "Design"
    }
  ],
  rating: 4.8,
  favoriteSpaces: ["Kitchen", "Balcony", "Study Room"]
};

const MONTHLY_BILLS = {
  rent: { amount: 650, paid: true, dueDate: "1st" },
  electricity: { amount: 45.20, paid: true, dueDate: "15th" },
  internet: { amount: 22.50, paid: false, dueDate: "20th" },
  water: { amount: 18.80, paid: true, dueDate: "25th" },
  cleaning: { amount: 25.00, paid: false, dueDate: "30th" }
};

const UPCOMING_EVENTS = [
  {
    id: 1,
    type: "bill",
    title: "Internet Bill Due",
    date: "Jan 20, 2025",
    time: "23:59",
    priority: "medium",
    icon: Wifi,
    amount: 22.50
  },
  {
    id: 2,
    type: "maintenance",
    title: "Heating System Check",
    date: "Jan 22, 2025", 
    time: "14:00-16:00",
    priority: "low",
    icon: Wrench,
    description: "Annual maintenance visit"
  },
  {
    id: 3,
    type: "bill",
    title: "Cleaning Service Payment",
    date: "Jan 30, 2025",
    time: "23:59",
    priority: "medium",
    icon: DollarSign,
    amount: 25.00
  },
  {
    id: 4,
    type: "social",
    title: "Flatmate Movie Night",
    date: "Jan 25, 2025",
    time: "19:30",
    priority: "low",
    icon: Coffee,
    description: "Monthly flatmate bonding activity"
  }
];

export function TenantDashboard({ onSplitExpenses, onChat, onViewExpenses }: TenantDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate bill statistics
  const totalBills = Object.values(MONTHLY_BILLS).reduce((sum, bill) => sum + bill.amount, 0);
  const paidBills = Object.values(MONTHLY_BILLS)
    .filter(bill => bill.paid)
    .reduce((sum, bill) => sum + bill.amount, 0);
  const unpaidBills = totalBills - paidBills;
  const paymentProgress = (paidBills / totalBills) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-[var(--color-easyCo-gray-light)] to-yellow-50">
      {/* Warm Header with Flatshare Info */}
      <div className="bg-gradient-to-r from-[var(--color-easyCo-purple)] via-[var(--color-easyCo-purple-light)] to-[var(--color-easyCo-purple)] px-6 pt-12 pb-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Welcome Home! 🏠</h1>
              <p className="text-white/80 text-sm">Your flatshare dashboard</p>
            </div>
            <Button 
              onClick={onChat}
              className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-full w-12 h-12 p-0"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>

          {/* Current Flatshare Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-3xl overflow-hidden">
            <div className="flex">
              <div className="w-28 h-28 flex-shrink-0">
                <ImageWithFallback
                  src={CURRENT_FLATSHARE.image}
                  alt={CURRENT_FLATSHARE.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="flex-1 p-4 text-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{CURRENT_FLATSHARE.name}</h3>
                    <div className="flex items-center gap-1 text-white/80 text-sm mb-1">
                      <MapPin className="w-3 h-3" />
                      {CURRENT_FLATSHARE.address}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/70">
                      <span>Since {CURRENT_FLATSHARE.moveInDate}</span>
                      <span>•</span>
                      <span>{CURRENT_FLATSHARE.roomNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[var(--color-easyCo-mustard)]" fill="currentColor" />
                    <span className="text-sm font-medium">{CURRENT_FLATSHARE.rating}</span>
                  </div>
                </div>
                
                {/* Roommates */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/70">Flatmates:</span>
                  <div className="flex -space-x-2">
                    {CURRENT_FLATSHARE.roommates.map((roommate) => (
                      <div key={roommate.id} className="relative">
                        <Avatar className="w-7 h-7 border-2 border-white">
                          <AvatarImage src={roommate.avatar} alt={roommate.name} />
                          <AvatarFallback className="text-xs">{roommate.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
                          roommate.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-white/70">+You</span>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 pb-6 space-y-6">
        {/* Match Notification Widget */}
        <Card className="border-0 rounded-3xl shadow-lg bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border border-pink-200/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--color-easyCo-mustard)] to-yellow-300 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-black animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[var(--color-easyCo-purple)] text-lg mb-1">
                  3 people are interested! 💫
                </h3>
                <p className="text-sm text-[var(--color-easyCo-gray-dark)] mb-3">
                  New potential roommates want to connect with you
                </p>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[var(--color-easyCo-purple)] to-[var(--color-easyCo-purple-light)] hover:from-[var(--color-easyCo-purple-dark)] hover:to-[var(--color-easyCo-purple)] text-white rounded-2xl"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  View Matches
                </Button>
              </div>
              <Badge className="bg-[var(--color-easyCo-mustard)] text-black text-lg px-3 py-2 rounded-xl">
                3
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Bills Card */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[var(--color-easyCo-purple)] flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Monthly Bills & Payments
              </CardTitle>
              <Badge className="bg-green-100 text-green-800">
                {Math.round(paymentProgress)}% Paid
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-easyCo-gray-dark)]">Payment Progress</span>
                <span className="font-medium">{formatCurrency(paidBills)} of {formatCurrency(totalBills)}</span>
              </div>
              <Progress value={paymentProgress} className="h-3 bg-gray-100">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                  style={{ width: `${paymentProgress}%` }}
                />
              </Progress>
              <div className="flex justify-between text-xs text-[var(--color-easyCo-gray-dark)]">
                <span>Paid: {formatCurrency(paidBills)}</span>
                <span>Remaining: {formatCurrency(unpaidBills)}</span>
              </div>
            </div>

            <div className="grid gap-3">
              {Object.entries(MONTHLY_BILLS).map(([key, bill]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-[var(--color-easyCo-gray-light)] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      bill.paid ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      {key === 'rent' && <Home className={`w-5 h-5 ${bill.paid ? 'text-green-600' : 'text-orange-600'}`} />}
                      {key === 'electricity' && <Zap className={`w-5 h-5 ${bill.paid ? 'text-green-600' : 'text-orange-600'}`} />}
                      {key === 'internet' && <Wifi className={`w-5 h-5 ${bill.paid ? 'text-green-600' : 'text-orange-600'}`} />}
                      {key === 'water' && <Droplets className={`w-5 h-5 ${bill.paid ? 'text-green-600' : 'text-orange-600'}`} />}
                      {key === 'cleaning' && <Coffee className={`w-5 h-5 ${bill.paid ? 'text-green-600' : 'text-orange-600'}`} />}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-easyCo-purple)] capitalize">{key}</p>
                      <p className="text-xs text-[var(--color-easyCo-gray-dark)]">Due: {bill.dueDate} of month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--color-easyCo-purple)]">{formatCurrency(bill.amount)}</p>
                    <div className="flex items-center gap-1">
                      {bill.paid ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                      )}
                      <span className={`text-xs ${bill.paid ? 'text-green-600' : 'text-orange-600'}`}>
                        {bill.paid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-[var(--color-easyCo-purple)]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={onSplitExpenses}
                className="bg-gradient-to-r from-[var(--color-easyCo-mustard)] to-[var(--color-easyCo-mustard-dark)] hover:from-[var(--color-easyCo-mustard-dark)] hover:to-[var(--color-easyCo-mustard)] text-black rounded-2xl h-16 flex-col gap-1"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Split Expenses</span>
              </Button>

              <Button
                onClick={onViewExpenses}
                variant="outline"
                className="border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple)] hover:text-white rounded-2xl h-16 flex-col gap-1"
              >
                <DollarSign className="w-5 h-5" />
                <span className="text-sm font-medium">View All Bills</span>
              </Button>

              <Button
                onClick={onChat}
                variant="outline"
                className="border-[var(--color-easyCo-gray-medium)] hover:bg-[var(--color-easyCo-gray-light)] rounded-2xl h-16 flex-col gap-1"
              >
                <MessageCircle className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                <span className="text-sm font-medium text-[var(--color-easyCo-purple)]">Group Chat</span>
              </Button>

              <Button
                variant="outline"
                className="border-[var(--color-easyCo-gray-medium)] hover:bg-[var(--color-easyCo-gray-light)] rounded-2xl h-16 flex-col gap-1"
              >
                <Users className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                <span className="text-sm font-medium text-[var(--color-easyCo-purple)]">Flatmates</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-[var(--color-easyCo-purple)] flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {UPCOMING_EVENTS.map((event) => (
              <div 
                key={event.id} 
                className={`p-4 rounded-2xl border-l-4 ${getPriorityColor(event.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <event.icon className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--color-easyCo-purple)] mb-1">{event.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-[var(--color-easyCo-gray-dark)] mb-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-xs text-[var(--color-easyCo-gray-dark)]">{event.description}</p>
                      )}
                      {event.amount && (
                        <p className="text-sm font-medium text-[var(--color-easyCo-purple)] mt-1">
                          Amount: {formatCurrency(event.amount)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge className={`text-xs ${getPriorityBadge(event.priority)}`}>
                    {event.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Flatmate Profiles */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-[var(--color-easyCo-purple)] flex items-center gap-2">
              <Heart className="w-6 h-6" />
              Your Flatmates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {CURRENT_FLATSHARE.roommates.map((roommate) => (
                <div key={roommate.id} className="flex items-center gap-4 p-3 bg-[var(--color-easyCo-gray-light)] rounded-2xl">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={roommate.avatar} alt={roommate.name} />
                      <AvatarFallback>{roommate.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      roommate.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[var(--color-easyCo-purple)]">{roommate.name}</h4>
                    <p className="text-sm text-[var(--color-easyCo-gray-dark)]">{roommate.study} Student</p>
                    <p className="text-xs text-green-600 capitalize">{roommate.status}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onChat}
                    className="rounded-xl border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)]"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Features */}
        <Card className="border-0 rounded-3xl shadow-lg bg-gradient-to-r from-orange-100 to-yellow-100">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-bold text-[var(--color-easyCo-purple)] mb-2">🌟 Community Highlights</h3>
              <p className="text-sm text-[var(--color-easyCo-gray-dark)] mb-4">
                Your flatshare has been rated as one of the friendliest this month!
              </p>
              <div className="flex justify-center gap-4 text-xs text-[var(--color-easyCo-gray-dark)]">
                <span>📚 Study Sessions: 3 this week</span>
                <span>🍕 Group Dinners: 2 planned</span>
                <span>🎬 Movie Nights: Weekly</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}