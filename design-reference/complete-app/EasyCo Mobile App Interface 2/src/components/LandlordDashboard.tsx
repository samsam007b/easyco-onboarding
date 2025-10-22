import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Plus, 
  Home, 
  Users, 
  MessageCircle, 
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
  DollarSign,
  Star,
  MoreVertical,
  MapPin,
  Clock,
  BarChart3,
  AlertTriangle,
  Zap,
  Wrench,
  Receipt,
  Shield,
  FileText,
  Settings,
  Bell,
  ClipboardList,
  UserCheck,
  Building2,
  PieChart,
  Download,
  Filter
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const MONTHLY_DATA = [
  { month: "Jan", revenue: 4200, expenses: 1800 },
  { month: "Feb", revenue: 4500, expenses: 2100 },
  { month: "Mar", revenue: 4800, expenses: 1950 },
  { month: "Apr", revenue: 4600, expenses: 2200 },
  { month: "May", revenue: 5100, expenses: 1750 },
  { month: "Jun", revenue: 4900, expenses: 2000 },
  { month: "Jul", revenue: 5300, expenses: 1900 },
  { month: "Aug", revenue: 5200, expenses: 2300 },
  { month: "Sep", revenue: 4800, expenses: 1850 },
  { month: "Oct", revenue: 5000, expenses: 2100 },
  { month: "Nov", revenue: 4700, expenses: 1950 },
  { month: "Dec", revenue: 5100, expenses: 2200 }
];

const YEARLY_DATA = [
  { month: "2021", revenue: 52000, expenses: 22000 },
  { month: "2022", revenue: 58000, expenses: 24000 },
  { month: "2023", revenue: 62000, expenses: 26000 },
  { month: "2024", revenue: 58800, expenses: 24300 }
];

const APPLICATIONS_DATA = [
  { status: "New", count: 12, color: "bg-blue-500" },
  { status: "Interview", count: 5, color: "bg-yellow-500" },
  { status: "Visit", count: 8, color: "bg-purple-500" },
  { status: "Approved", count: 3, color: "bg-green-500" },
  { status: "Rejected", count: 2, color: "bg-red-500" }
];

const MAINTENANCE_TICKETS = [
  {
    id: 1,
    title: "WiFi Connection Issues",
    property: "Modern House Ixelles",
    priority: "high",
    status: "in_progress",
    assignedTo: "TechFix Pro",
    created: "2 hours ago"
  },
  {
    id: 2,
    title: "Kitchen Faucet Leak",
    property: "Student Residence Saint-Gilles",
    priority: "medium",
    status: "pending",
    assignedTo: "PlumbCare",
    created: "1 day ago"
  }
];

interface LandlordDashboardProps {
  onFinanceSelect?: () => void;
  onViewProperties?: () => void;
  onViewApplications?: () => void;
  onViewMaintenance?: () => void;
  onViewMessages?: () => void;
}

export function LandlordDashboard({ 
  onFinanceSelect,
  onViewProperties,
  onViewApplications,
  onViewMaintenance,
  onViewMessages
}: LandlordDashboardProps = {}) {
  const [chartPeriod, setChartPeriod] = useState<"monthly" | "yearly">("monthly");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    category: "",
    property: ""
  });

  // Calculate totals
  const chartData = chartPeriod === "monthly" ? MONTHLY_DATA : YEARLY_DATA;
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = chartData.reduce((sum, item) => sum + item.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const overallOccupancy = 87; // Mock occupancy rate

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleAddExpense = () => {
    if (expenseForm.description && expenseForm.amount && expenseForm.category) {
      console.log("Adding expense:", expenseForm);
      setExpenseForm({ description: "", amount: "", category: "", property: "" });
      setShowAddExpenseModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--color-easyCo-purple)] via-[var(--color-easyCo-purple-dark)] to-purple-800 px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Investment Dashboard</h1>
            <p className="text-purple-100">Professional property portfolio management</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-2xl p-2 relative"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-easyCo-mustard)] rounded-full"></div>
            </Button>
            
            <Dialog open={showAddExpenseModal} onOpenChange={setShowAddExpenseModal}>
              <DialogTrigger asChild>
                <Button className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl font-medium shadow-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-[var(--color-easyCo-purple)]">Add New Expense</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Expense description"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                    className="rounded-2xl border-[var(--color-easyCo-gray-medium)] focus:border-[var(--color-easyCo-purple)]"
                  />
                  <Input
                    type="number"
                    placeholder="Amount (€)"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                    className="rounded-2xl border-[var(--color-easyCo-gray-medium)] focus:border-[var(--color-easyCo-purple)]"
                  />
                  <Select value={expenseForm.category} onValueChange={(value) => setExpenseForm({...expenseForm, category: value})}>
                    <SelectTrigger className="rounded-2xl border-[var(--color-easyCo-gray-medium)]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="taxes">Taxes</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleAddExpense} className="flex-1 bg-[var(--color-easyCo-purple)] rounded-2xl">
                      Add Expense
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddExpenseModal(false)} className="flex-1 rounded-2xl">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--color-easyCo-mustard)] rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-black" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</div>
                <div className="text-xs text-purple-100">Total Revenue</div>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</div>
                <div className="text-xs text-purple-100">Total Expenses</div>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{formatCurrency(netProfit)}</div>
                <div className="text-xs text-purple-100">Net Profit</div>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{overallOccupancy}%</div>
                <div className="text-xs text-purple-100">Occupancy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6 pb-8 -mt-4">
        {/* Revenue vs Expenses Chart */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[var(--color-easyCo-purple)] flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Revenue vs Expenses
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={chartPeriod === "monthly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartPeriod("monthly")}
                  className={`rounded-xl ${chartPeriod === "monthly" ? 'bg-[var(--color-easyCo-mustard)] text-black hover:bg-[var(--color-easyCo-mustard-dark)]' : 'border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)]'}`}
                >
                  Monthly
                </Button>
                <Button
                  variant={chartPeriod === "yearly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartPeriod("yearly")}
                  className={`rounded-xl ${chartPeriod === "yearly" ? 'bg-[var(--color-easyCo-mustard)] text-black hover:bg-[var(--color-easyCo-mustard-dark)]' : 'border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)]'}`}
                >
                  Yearly
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value, name) => [formatCurrency(Number(value)), name]}
                  labelStyle={{ color: '#000' }}
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4A148C" 
                  strokeWidth={3}
                  dot={{ fill: '#4A148C', strokeWidth: 2, r: 4 }}
                  name="Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#dc2626" 
                  strokeWidth={3}
                  dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card 
            className="border-0 rounded-2xl shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:shadow-xl transition-all"
            onClick={onViewProperties}
          >
            <CardContent className="p-4 text-center">
              <Home className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold mb-1">My Properties</div>
              <div className="text-sm opacity-90">3 properties</div>
            </CardContent>
          </Card>

          <Card 
            className="border-0 rounded-2xl shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white cursor-pointer hover:shadow-xl transition-all"
            onClick={onFinanceSelect}
          >
            <CardContent className="p-4 text-center">
              <PieChart className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold mb-1">Finance Report</div>
              <div className="text-sm opacity-90">View detailed</div>
            </CardContent>
          </Card>

          <Card 
            className="border-0 rounded-2xl shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white cursor-pointer hover:shadow-xl transition-all"
            onClick={onViewApplications}
          >
            <CardContent className="p-4 text-center">
              <ClipboardList className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold mb-1">Applications</div>
              <div className="text-sm opacity-90">30 pending</div>
            </CardContent>
          </Card>

          <Card 
            className="border-0 rounded-2xl shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-pointer hover:shadow-xl transition-all"
            onClick={onViewMaintenance}
          >
            <CardContent className="p-4 text-center">
              <Wrench className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold mb-1">Maintenance</div>
              <div className="text-sm opacity-90">2 active tickets</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Pipeline */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[var(--color-easyCo-purple)] flex items-center gap-2">
                <UserCheck className="w-6 h-6" />
                Applications Pipeline
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onViewApplications}
                className="border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-xl"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {APPLICATIONS_DATA.map((item) => (
                <div key={item.status} className="text-center">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-2`}>
                    <span className="text-2xl font-bold">{item.count}</span>
                  </div>
                  <div className="font-medium text-[var(--color-easyCo-purple)] text-sm">{item.status}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Maintenance Tickets */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[var(--color-easyCo-purple)] flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Active Maintenance
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onViewMaintenance}
                className="border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-xl"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MAINTENANCE_TICKETS.map((ticket) => (
                <div key={ticket.id} className="flex items-center gap-3 p-3 bg-[var(--color-easyCo-gray-light)] rounded-2xl">
                  <div className={`w-3 h-3 rounded-full ${
                    ticket.priority === "high" ? "bg-red-500" : 
                    ticket.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-[var(--color-easyCo-purple)] text-sm">{ticket.title}</div>
                    <div className="text-xs text-[var(--color-easyCo-gray-dark)]">{ticket.property}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded-lg ${
                      ticket.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                      ticket.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-[var(--color-easyCo-gray-dark)] mt-1">{ticket.created}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[var(--color-easyCo-purple)] flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Recent Messages
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onViewMessages}
                className="border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-xl"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1585394938061-ef6927c9bee0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1NTQ5MTM5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Emma" />
                  <AvatarFallback>EM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-[var(--color-easyCo-purple)] text-sm">Emma Wilson</div>
                  <div className="text-xs text-[var(--color-easyCo-gray-dark)]">Interested in viewing the Ixelles property...</div>
                </div>
                <div className="text-xs text-[var(--color-easyCo-gray-dark)]">2h ago</div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[var(--color-easyCo-gray-light)] rounded-2xl">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1561065533-316e3142d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjB5b3VuZ3xlbnwxfHx8fDE3NTU0MzQwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Mike" />
                  <AvatarFallback>MJ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-[var(--color-easyCo-purple)] text-sm">Mike Johnson</div>
                  <div className="text-xs text-[var(--color-easyCo-gray-dark)]">Questions about utilities and pricing...</div>
                </div>
                <div className="text-xs text-[var(--color-easyCo-gray-dark)]">5h ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}