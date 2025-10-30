'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { createBrowserClient } from '@supabase/ssr';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Home,
  PieChart as PieChartIcon,
  ClipboardList,
  Wrench,
  Bell,
  MessageCircle,
  Plus,
  LayoutDashboard,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Euro,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Settings,
  FileText,
  Percent,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { QuickStatsCard } from '@/components/home/QuickStatsCard';
import { ActionCard } from '@/components/home/ActionCard';
import { ActivityFeed, ActivityItem } from '@/components/home/ActivityFeed';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function OwnerHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    occupancyRate: 0,
    propertiesCount: 0,
    pendingApplications: 0,
    activeMaintenanceTickets: 0,
    monthlyGrowth: 0,
    averageROI: 0,
    totalTenants: 0,
  });
  const [applicationsPipeline, setApplicationsPipeline] = useState({
    new: 0,
    interview: 0,
    visit: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [maintenanceTickets, setMaintenanceTickets] = useState<any[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadOwnerData();
  }, [user]);

  const loadOwnerData = async () => {
    if (!user) return;

    // Load properties count
    const { count: propertiesCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)
      .eq('status', 'published');

    // Generate mock financial data with realistic trends
    const currentMonth = new Date().getMonth();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Revenue data for last 6 months
    const revenueChartData = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      return {
        month: months[monthIndex],
        revenue: Math.floor(8000 + Math.random() * 4000 + i * 500),
        expenses: Math.floor(2000 + Math.random() * 1500),
      };
    });

    setRevenueData(revenueChartData);

    // Expense breakdown
    setExpenseData([
      { name: 'Maintenance', value: 1200, color: '#FF6F3C' },
      { name: 'Utilities', value: 800, color: '#FFD249' },
      { name: 'Insurance', value: 600, color: '#6E56CF' },
      { name: 'Property Tax', value: 400, color: '#00C6AE' },
      { name: 'Other', value: 200, color: '#FF5C93' },
    ]);

    // Mock financial data
    setStats({
      totalRevenue: 12450,
      totalExpenses: 3200,
      netProfit: 9250,
      occupancyRate: 85,
      propertiesCount: propertiesCount || 0,
      pendingApplications: 8,
      activeMaintenanceTickets: 3,
      monthlyGrowth: 12.5,
      averageROI: 8.2,
      totalTenants: 12,
    });

    setApplicationsPipeline({
      new: 5,
      interview: 2,
      visit: 1,
      approved: 3,
      rejected: 1,
    });

    // Mock maintenance tickets
    setMaintenanceTickets([
      { id: 1, property: 'Brussels Centre', issue: 'Heating System', status: 'urgent', priority: 'high', date: '2024-10-28' },
      { id: 2, property: 'Ixelles Loft', issue: 'Water Leak', status: 'in_progress', priority: 'medium', date: '2024-10-27' },
      { id: 3, property: 'EU Quarter Apt', issue: 'Door Lock', status: 'pending', priority: 'low', date: '2024-10-26' },
    ]);

    // Mock upcoming payments
    setUpcomingPayments([
      { id: 1, tenant: 'Sophie Martin', property: 'Brussels Centre', amount: 1200, dueDate: '2024-11-01', status: 'pending' },
      { id: 2, tenant: 'Thomas Laurent', property: 'Ixelles Loft', amount: 950, dueDate: '2024-11-03', status: 'pending' },
      { id: 3, tenant: 'Marie Dubois', property: 'EU Quarter', amount: 1100, dueDate: '2024-11-05', status: 'pending' },
    ]);

    // Mock recent activities
    setRecentActivities([
      {
        id: '1',
        icon: ClipboardList,
        iconBgColor: 'bg-blue-500',
        title: 'New application',
        subtitle: 'Sophie M. applied for Brussels Centre apartment',
        time: '1h ago',
        onClick: () => router.push('/dashboard/owner/applications'),
      },
      {
        id: '2',
        icon: Wrench,
        iconBgColor: 'bg-orange-500',
        title: 'Maintenance completed',
        subtitle: 'Heating repair in Ixelles property',
        time: '3h ago',
        onClick: () => router.push('/dashboard/owner/maintenance'),
      },
      {
        id: '3',
        icon: MessageCircle,
        iconBgColor: 'bg-green-500',
        title: 'New message',
        subtitle: 'Thomas L. asked about availability',
        time: '5h ago',
        onClick: () => router.push('/messages'),
      },
      {
        id: '4',
        icon: Euro,
        iconBgColor: 'bg-green-600',
        title: 'Payment received',
        subtitle: '€1,200 from Sophie M. for November',
        time: '1d ago',
        onClick: () => router.push('/dashboard/owner/finance'),
      },
      {
        id: '5',
        icon: AlertCircle,
        iconBgColor: 'bg-red-500',
        title: 'Urgent maintenance',
        subtitle: 'Heating system requires immediate attention',
        time: '2d ago',
        onClick: () => router.push('/dashboard/owner/maintenance'),
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4A148C] to-[#7B1FA2] bg-clip-text text-transparent">
                Investment Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Professional property portfolio management</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full relative hover:bg-[#4A148C]/10 border-[#4A148C]/20"
                onClick={() => router.push('/notifications')}
              >
                <Bell className="h-5 w-5 text-[#4A148C]" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </Button>
              <Button
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-2xl gap-2 shadow-lg shadow-yellow-500/30"
                onClick={() => router.push('/dashboard/owner/expenses/add')}
              >
                <Plus className="h-5 w-5" />
                Add Expense
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl gap-2 border-[#4A148C] text-[#4A148C] hover:bg-[#4A148C] hover:text-white transition-all"
                onClick={() => router.push('/dashboard/owner')}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-none shadow-lg bg-gradient-to-br from-yellow-400 to-yellow-600 text-white overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="font-semibold">{stats.monthlyGrowth}%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium mb-1 opacity-90">Total Revenue</h3>
              <p className="text-3xl font-bold">€{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs mt-2 opacity-75">+€1,200 from last month</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-lg bg-gradient-to-br from-red-400 to-red-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="font-semibold">5%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium mb-1 opacity-90">Total Expenses</h3>
              <p className="text-3xl font-bold">€{stats.totalExpenses.toLocaleString()}</p>
              <p className="text-xs mt-2 opacity-75">-€150 from last month</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-lg bg-gradient-to-br from-green-400 to-green-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="font-semibold">15%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium mb-1 opacity-90">Net Profit</h3>
              <p className="text-3xl font-bold">€{stats.netProfit.toLocaleString()}</p>
              <p className="text-xs mt-2 opacity-75">+€1,350 from last month</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Percent className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span className="font-semibold">{stats.averageROI}%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium mb-1 opacity-90">Average ROI</h3>
              <p className="text-3xl font-bold">{stats.occupancyRate}%</p>
              <p className="text-xs mt-2 opacity-75">Occupancy Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="rounded-2xl border-[#4A148C]/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.propertiesCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#4A148C]/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Tenants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTenants}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#4A148C]/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <ClipboardList className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue & Expenses Chart */}
          <Card className="rounded-2xl shadow-lg border-[#4A148C]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Revenue & Expenses</CardTitle>
                  <CardDescription>Last 6 months performance</CardDescription>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-[#4A148C]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4 }}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', r: 4 }}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expense Breakdown Chart */}
          <Card className="rounded-2xl shadow-lg border-[#4A148C]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Expense Breakdown</CardTitle>
                  <CardDescription>Current month distribution</CardDescription>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <PieChartIcon className="w-5 h-5 text-[#4A148C]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Payments & Maintenance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Payments */}
          <Card className="rounded-2xl shadow-lg border-[#4A148C]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Upcoming Payments</CardTitle>
                  <CardDescription>Next 7 days</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => router.push('/dashboard/owner/finance')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Euro className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{payment.tenant}</p>
                      <p className="text-sm text-gray-600">{payment.property}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">€{payment.amount}</p>
                    <p className="text-xs text-gray-500">{payment.dueDate}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Maintenance Tickets */}
          <Card className="rounded-2xl shadow-lg border-[#4A148C]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Maintenance Tickets</CardTitle>
                  <CardDescription>{stats.activeMaintenanceTickets} active tickets</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => router.push('/dashboard/owner/maintenance')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {maintenanceTickets.map((ticket) => (
                <div key={ticket.id} className={`p-4 rounded-xl border-2 ${getStatusColor(ticket.status)} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(ticket.priority)}
                      <h4 className="font-semibold">{ticket.issue}</h4>
                    </div>
                    <Badge className="text-xs">
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{ticket.property}</p>
                  <p className="text-xs text-gray-500">Reported: {ticket.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Applications Pipeline */}
        <Card className="rounded-2xl shadow-lg border-[#4A148C]/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Applications Pipeline</CardTitle>
                <CardDescription>Track applicant progress through stages</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => router.push('/dashboard/owner/applications')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Review All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="relative">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-lg transition-all cursor-pointer"
                     onClick={() => router.push('/dashboard/owner/applications?status=new')}>
                  <div className="text-4xl font-bold text-blue-600 mb-1">{applicationsPipeline.new}</div>
                  <p className="text-sm font-semibold text-gray-700">New</p>
                  <div className="mt-2">
                    <Progress value={applicationsPipeline.new * 10} className="h-2" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 hover:shadow-lg transition-all cursor-pointer"
                     onClick={() => router.push('/dashboard/owner/applications?status=interview')}>
                  <div className="text-4xl font-bold text-yellow-600 mb-1">{applicationsPipeline.interview}</div>
                  <p className="text-sm font-semibold text-gray-700">Interview</p>
                  <div className="mt-2">
                    <Progress value={applicationsPipeline.interview * 10} className="h-2" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-lg transition-all cursor-pointer"
                     onClick={() => router.push('/dashboard/owner/applications?status=visit')}>
                  <div className="text-4xl font-bold text-purple-600 mb-1">{applicationsPipeline.visit}</div>
                  <p className="text-sm font-semibold text-gray-700">Visit</p>
                  <div className="mt-2">
                    <Progress value={applicationsPipeline.visit * 10} className="h-2" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:shadow-lg transition-all cursor-pointer"
                     onClick={() => router.push('/dashboard/owner/applications?status=approved')}>
                  <div className="text-4xl font-bold text-green-600 mb-1">{applicationsPipeline.approved}</div>
                  <p className="text-sm font-semibold text-gray-700">Approved</p>
                  <div className="mt-2">
                    <Progress value={applicationsPipeline.approved * 10} className="h-2" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 hover:shadow-lg transition-all cursor-pointer"
                     onClick={() => router.push('/dashboard/owner/applications?status=rejected')}>
                  <div className="text-4xl font-bold text-red-600 mb-1">{applicationsPipeline.rejected}</div>
                  <p className="text-sm font-semibold text-gray-700">Rejected</p>
                  <div className="mt-2">
                    <Progress value={applicationsPipeline.rejected * 10} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="rounded-2xl shadow-lg border-[#4A148C]/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
            <CardDescription>Latest updates across your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={recentActivities} maxItems={5} />
          </CardContent>
        </Card>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionCard
            title="My Properties"
            description={`Manage ${stats.propertiesCount} properties`}
            icon={Home}
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
            buttonText="View All"
            onClick={() => router.push('/dashboard/owner/properties')}
            className="h-48"
          />
          <ActionCard
            title="Finance Report"
            description="View detailed analytics"
            icon={PieChartIcon}
            gradient="bg-gradient-to-br from-green-500 to-green-700"
            buttonText="View Report"
            onClick={() => router.push('/dashboard/owner/finance')}
            className="h-48"
          />
          <ActionCard
            title="Applications"
            description={`${stats.pendingApplications} pending`}
            icon={ClipboardList}
            badge={stats.pendingApplications > 0 ? `${stats.pendingApplications} New` : undefined}
            gradient="bg-gradient-to-br from-orange-500 to-orange-700"
            buttonText="Review"
            onClick={() => router.push('/dashboard/owner/applications')}
            className="h-48"
          />
          <ActionCard
            title="Maintenance"
            description={`${stats.activeMaintenanceTickets} active tickets`}
            icon={Wrench}
            badge={
              stats.activeMaintenanceTickets > 0
                ? `${stats.activeMaintenanceTickets} Active`
                : undefined
            }
            gradient="bg-gradient-to-br from-purple-500 to-purple-700"
            buttonText="Manage"
            onClick={() => router.push('/dashboard/owner/maintenance')}
            className="h-48"
          />
        </div>
      </div>
    </div>
  );
}
