import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { 
  Plus, 
  Wifi, 
  ShoppingCart, 
  Zap, 
  Droplets,
  Trash2,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

const ROOMMATES = [
  {
    id: 1,
    name: "You",
    avatar: "",
    balance: -45.50,
    initials: "ME"
  },
  {
    id: 2,
    name: "Sarah M.",
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTUwOTE3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    balance: 23.75,
    initials: "SM"
  },
  {
    id: 3,
    name: "Alex K.",
    avatar: "https://images.unsplash.com/photo-1561065533-316e3142d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjB5b3VuZ3xlbnwxfHx8fDE3NTU0MzQwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    balance: 21.75,
    initials: "AK"
  }
];

const EXPENSES = [
  {
    id: 1,
    title: "Internet & Wi-Fi",
    icon: Wifi,
    amount: 45.00,
    splitAmount: 15.00,
    paidBy: "Sarah M.",
    dueDate: "Jan 15, 2025",
    status: "paid",
    category: "utilities",
    participants: 3
  },
  {
    id: 2,
    title: "Groceries (Dec)",
    icon: ShoppingCart,
    amount: 127.50,
    splitAmount: 42.50,
    paidBy: "You",
    dueDate: "Dec 30, 2024",
    status: "pending",
    category: "food",
    participants: 3
  },
  {
    id: 3,
    title: "Electricity Bill",
    icon: Zap,
    amount: 89.25,
    splitAmount: 29.75,
    paidBy: "Alex K.",
    dueDate: "Jan 5, 2025",
    status: "overdue",
    category: "utilities",
    participants: 3
  },
  {
    id: 4,
    title: "Water Bill",
    icon: Droplets,
    amount: 34.80,  
    splitAmount: 11.60,
    paidBy: "Sarah M.",
    dueDate: "Jan 10, 2025",
    status: "paid",
    category: "utilities",
    participants: 3
  },
  {
    id: 5,
    title: "Cleaning Service",
    icon: Trash2,
    amount: 60.00,
    splitAmount: 20.00,
    paidBy: "You",
    dueDate: "Jan 20, 2025",
    status: "upcoming",
    category: "cleaning",
    participants: 3
  }
];

interface SharedExpensesScreenProps {
  onBack: () => void;
}

export function SharedExpensesScreen({ onBack }: SharedExpensesScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const categories = [
    { id: "all", label: "All", count: EXPENSES.length },
    { id: "utilities", label: "Utilities", count: 3 },
    { id: "food", label: "Food", count: 1 },
    { id: "cleaning", label: "Cleaning", count: 1 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-[var(--color-easyCo-mustard)] text-black';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return CheckCircle;
      case 'overdue':
        return AlertCircle;
      default:
        return Calendar;
    }
  };

  const totalOwed = ROOMMATES.find(r => r.name === "You")?.balance || 0;
  const filteredExpenses = selectedCategory === "all" 
    ? EXPENSES 
    : EXPENSES.filter(expense => expense.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-[var(--color-easyCo-purple)] px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20 rounded-xl p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-white">Shared Expenses</h1>
              <p className="text-white/80 text-sm">Split bills with your roommates</p>
            </div>
          </div>
          <Button className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Balance Overview */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 rounded-2xl">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white mb-1">
                {totalOwed < 0 ? '-' : ''}€{Math.abs(totalOwed).toFixed(2)}
              </div>
              <p className="text-white/80 text-sm">
                {totalOwed < 0 ? 'You owe in total' : 'You are owed in total'}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {ROOMMATES.map((roommate) => (
                <div key={roommate.id} className="text-center">
                  <Avatar className="w-12 h-12 mx-auto mb-2">
                    <AvatarImage src={roommate.avatar} alt={roommate.name} />
                    <AvatarFallback className="bg-[var(--color-easyCo-mustard)] text-black font-medium">
                      {roommate.initials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-white text-sm font-medium mb-1">{roommate.name}</p>
                  <p className={`text-xs ${roommate.balance < 0 ? 'text-red-300' : 'text-green-300'}`}>
                    {roommate.balance < 0 ? '-' : '+'}€{Math.abs(roommate.balance).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "secondary"}
              className={`flex-shrink-0 px-4 py-2 rounded-xl cursor-pointer ${
                selectedCategory === category.id
                  ? 'bg-[var(--color-easyCo-purple)] text-white'
                  : 'bg-[var(--color-easyCo-gray-light)] border border-[var(--color-easyCo-gray-medium)] text-[var(--color-easyCo-gray-dark)]'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label} ({category.count})
            </Badge>
          ))}
        </div>
      </div>

      {/* Expenses List */}
      <div className="p-6 space-y-4">
        {filteredExpenses.map((expense) => {
          const StatusIcon = getStatusIcon(expense.status);
          
          return (
            <Card key={expense.id} className="shadow-sm border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 bg-[var(--color-easyCo-purple)]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <expense.icon className="w-6 h-6 text-[var(--color-easyCo-purple)]" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[var(--color-easyCo-purple)]">
                        {expense.title}
                      </h3>
                      <div className="text-right ml-4">
                        <div className="font-bold text-lg text-[var(--color-easyCo-purple)]">
                          €{expense.splitAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-[var(--color-easyCo-gray-dark)]">
                          your share
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-[var(--color-easyCo-gray-dark)]">
                        Total: €{expense.amount.toFixed(2)} • Paid by {expense.paidBy}
                      </div>
                      <Badge className={`${getStatusColor(expense.status)} px-2 py-1 text-xs`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {expense.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-[var(--color-easyCo-gray-dark)]">
                        <Users className="w-4 h-4 mr-1" />
                        Split between {expense.participants} people
                      </div>
                      <div className="flex items-center text-[var(--color-easyCo-gray-dark)]">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due {expense.dueDate}
                      </div>
                    </div>
                  </div>
                </div>
                
                {expense.status === 'pending' && (
                  <div className="px-4 pb-4">
                    <Button className="w-full bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-xl">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Pay €{expense.splitAmount.toFixed(2)}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}