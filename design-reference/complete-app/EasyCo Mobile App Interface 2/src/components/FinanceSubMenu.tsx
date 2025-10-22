import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Separator } from "./ui/separator";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Download,
  FileText,
  BarChart3,
  PieChart,
  Zap,
  Wrench,
  Receipt,
  Shield,
  Home,
  Calendar,
  Filter,
  Eye,
  Users
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface FinanceSubMenuProps {
  onBack: () => void;
}

const PROPERTY_PERFORMANCE_DATA = [
  { month: "Jan", property1: 2840, property2: 2400, property3: 1780, total: 7020 },
  { month: "Feb", property1: 2840, property2: 2880, property3: 2140, total: 7860 },
  { month: "Mar", property1: 2840, property2: 2400, property3: 1780, total: 7020 },
  { month: "Apr", property1: 2840, property2: 2640, property3: 1780, total: 7260 },
  { month: "May", property1: 2840, property2: 2880, property3: 2140, total: 7860 },
  { month: "Jun", property1: 2840, property2: 2400, property3: 2140, total: 7380 },
  { month: "Jul", property1: 2840, property2: 2880, property3: 2140, total: 7860 },
  { month: "Aug", property1: 2840, property2: 2640, property3: 1780, total: 7260 },
  { month: "Sep", property1: 2840, property2: 2400, property3: 2140, total: 7380 },
  { month: "Oct", property1: 2840, property2: 2880, property3: 1780, total: 7500 },
  { month: "Nov", property1: 2840, property2: 2640, property3: 2140, total: 7620 },
  { month: "Dec", property1: 2840, property2: 2880, property3: 2140, total: 7860 }
];

const REVENUE_DATA = [
  { month: "Jan", rental: 7020, deposits: 850, fees: 120 },
  { month: "Feb", rental: 7860, deposits: 420, fees: 95 },
  { month: "Mar", rental: 7020, deposits: 280, fees: 140 },
  { month: "Apr", rental: 7260, deposits: 560, fees: 110 },
  { month: "May", rental: 7860, deposits: 350, fees: 125 },
  { month: "Jun", rental: 7380, deposits: 470, fees: 85 },
  { month: "Jul", rental: 7860, deposits: 630, fees: 155 },
  { month: "Aug", rental: 7260, deposits: 290, fees: 75 },
  { month: "Sep", rental: 7380, deposits: 420, fees: 135 },
  { month: "Oct", rental: 7500, deposits: 380, fees: 90 },
  { month: "Nov", rental: 7620, deposits: 520, fees: 165 },
  { month: "Dec", rental: 7860, deposits: 640, fees: 145 }
];

const EXPENSES_DATA = [
  {
    id: 1,
    date: "2025-01-20",
    description: "Electricity Bill - Property 1",
    category: "utilities",
    amount: 245.50,
    property: "Modern House in Ixelles"
  },
  {
    id: 2,
    date: "2025-01-18",
    description: "Plumber Repair - Kitchen Sink",
    category: "maintenance",
    amount: 180.00,
    property: "Student Residence Saint-Gilles"
  },
  {
    id: 3,
    date: "2025-01-15",
    description: "Property Insurance Premium",
    category: "insurance",
    amount: 420.00,
    property: "All Properties"
  },
  {
    id: 4,
    date: "2025-01-12",
    description: "Internet Service Provider",
    category: "utilities",
    amount: 89.99,
    property: "Modern House in Ixelles"
  },
  {
    id: 5,
    date: "2025-01-10",
    description: "Professional Cleaning Service",
    category: "maintenance",
    amount: 150.00,
    property: "Luxury Loft in Uccle"
  },
  {
    id: 6,
    date: "2025-01-08",
    description: "Property Tax Assessment",
    category: "taxes",
    amount: 350.00,
    property: "All Properties"
  },
  {
    id: 7,
    date: "2025-01-05",
    description: "Water & Waste Management",
    category: "utilities",
    amount: 125.80,
    property: "Student Residence Saint-Gilles"
  },
  {
    id: 8,
    date: "2025-01-03",
    description: "HVAC System Maintenance",
    category: "maintenance",
    amount: 280.00,
    property: "Luxury Loft in Uccle"
  }
];

const CATEGORY_ICONS = {
  utilities: { icon: Zap, color: "text-blue-600", bg: "bg-blue-100" },
  maintenance: { icon: Wrench, color: "text-orange-600", bg: "bg-orange-100" },
  insurance: { icon: Shield, color: "text-green-600", bg: "bg-green-100" },
  taxes: { icon: Receipt, color: "text-purple-600", bg: "bg-purple-100" }
};

export function FinanceSubMenu({ onBack }: FinanceSubMenuProps) {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [dateFilter, setDateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Calculate key metrics
  const totalRevenue = REVENUE_DATA.reduce((sum, month) => 
    sum + month.rental + month.deposits + month.fees, 0
  );
  const totalExpenses = EXPENSES_DATA.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const roi = ((netProfit / totalExpenses) * 100).toFixed(1);
  const occupancyRate = 87; // Mock data

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    const categoryInfo = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
    if (!categoryInfo) return { icon: Receipt, color: "text-gray-600", bg: "bg-gray-100" };
    return categoryInfo;
  };

  const filteredExpenses = EXPENSES_DATA.filter(expense => {
    const categoryMatch = categoryFilter === "all" || expense.category === categoryFilter;
    // Add date filtering logic here if needed
    return categoryMatch;
  });

  const exportToCsv = () => {
    console.log("Exporting to CSV...");
    // Implementation for CSV export
  };

  const exportToPdf = () => {
    console.log("Exporting to PDF...");
    // Implementation for PDF export
  };

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2 rounded-2xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-easyCo-purple)]">Finance Center</h1>
              <p className="text-[var(--color-easyCo-gray-dark)] text-sm">Complete financial overview & analytics</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={exportToCsv}
              variant="outline" 
              className="rounded-2xl border-[var(--color-easyCo-gray-medium)] hover:border-[var(--color-easyCo-purple)]"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button 
              onClick={exportToPdf}
              className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl"
            >
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 rounded-3xl shadow-sm bg-gradient-to-br from-[var(--color-easyCo-purple)] to-[var(--color-easyCo-purple-dark)] text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-[var(--color-easyCo-mustard)]" />
                    <span className="text-sm text-[var(--color-easyCo-mustard)]">+12.5%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-[var(--color-easyCo-mustard)]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 rounded-3xl shadow-sm bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Net Profit</p>
                  <p className="text-2xl font-bold">{formatCurrency(netProfit)}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-white/80" />
                    <span className="text-sm text-white/80">Healthy</span>
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 rounded-3xl shadow-sm bg-gradient-to-br from-[var(--color-easyCo-mustard)] to-[var(--color-easyCo-mustard-dark)] text-black">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black/70 text-sm mb-1">ROI</p>
                  <p className="text-2xl font-bold">{roi}%</p>
                  <div className="flex items-center gap-1 mt-2">
                    <BarChart3 className="w-4 h-4 text-black/70" />
                    <span className="text-sm text-black/70">Above target</span>
                  </div>
                </div>
                <PieChart className="w-8 h-8 text-black/70" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 rounded-3xl shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Occupancy Rate</p>
                  <p className="text-2xl font-bold">{occupancyRate}%</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Users className="w-4 h-4 text-white/80" />
                    <span className="text-sm text-white/80">Excellent</span>
                  </div>
                </div>
                <Home className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'expenses', label: 'Expenses', icon: Receipt },
            { id: 'revenues', label: 'Revenues', icon: DollarSign },
            { id: 'reports', label: 'Reports', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap transition-all font-medium ${
                selectedTab === tab.id
                  ? 'bg-[var(--color-easyCo-purple)] text-white shadow-lg'
                  : 'text-[var(--color-easyCo-gray-dark)] hover:bg-[var(--color-easyCo-gray-light)]'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Property Performance Chart */}
            <Card className="border-0 rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-[var(--color-easyCo-purple)] flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Property Performance Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={PROPERTY_PERFORMANCE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value, name) => [formatCurrency(Number(value)), name]}
                      labelStyle={{ color: '#000' }}
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="property1" 
                      stroke="#4A148C" 
                      strokeWidth={3}
                      dot={{ fill: '#4A148C', strokeWidth: 2, r: 4 }}
                      name="Modern House Ixelles"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="property2" 
                      stroke="#FFD600" 
                      strokeWidth={3}
                      dot={{ fill: '#FFD600', strokeWidth: 2, r: 4 }}
                      name="Student Residence Saint-Gilles"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="property3" 
                      stroke="#7E57C2" 
                      strokeWidth={3}
                      dot={{ fill: '#7E57C2', strokeWidth: 2, r: 4 }}
                      name="Luxury Loft Uccle"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[var(--color-easyCo-purple)] text-lg">Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-easyCo-gray-dark)]">Average Monthly Revenue</span>
                    <span className="font-bold text-[var(--color-easyCo-purple)]">{formatCurrency(totalRevenue / 12)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-easyCo-gray-dark)]">Average Monthly Expenses</span>
                    <span className="font-bold text-red-600">{formatCurrency(totalExpenses / 12)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Net Monthly Profit</span>
                    <span className="font-bold text-green-600">{formatCurrency(netProfit / 12)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[var(--color-easyCo-purple)] text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-easyCo-gray-dark)]">Portfolio ROI</span>
                    <Badge className="bg-green-100 text-green-800">{roi}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-easyCo-gray-dark)]">Overall Occupancy</span>
                    <Badge className="bg-blue-100 text-blue-800">{occupancyRate}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-easyCo-gray-dark)]">Properties Managed</span>
                    <span className="font-bold text-[var(--color-easyCo-purple)]">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-easyCo-gray-dark)]">Total Rooms</span>
                    <span className="font-bold text-[var(--color-easyCo-purple)]">13</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedTab === 'expenses' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 rounded-2xl border-[var(--color-easyCo-gray-medium)]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="taxes">Taxes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Expenses Table */}
            <Card className="border-0 rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-[var(--color-easyCo-purple)] flex items-center gap-2">
                  <Receipt className="w-6 h-6" />
                  Recent Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => {
                      const categoryInfo = getCategoryIcon(expense.category);
                      return (
                        <TableRow key={expense.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${categoryInfo.bg} rounded-2xl flex items-center justify-center`}>
                                <categoryInfo.icon className={`w-5 h-5 ${categoryInfo.color}`} />
                              </div>
                              <span className="capitalize font-medium">{expense.category}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[var(--color-easyCo-gray-dark)]" />
                              {new Date(expense.date).toLocaleDateString('en-GB', { 
                                day: '2-digit', 
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="font-medium text-[var(--color-easyCo-purple)]">{expense.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-[var(--color-easyCo-gray-dark)]">
                              {expense.property}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-[var(--color-easyCo-purple)]">
                            {formatCurrency(expense.amount)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'revenues' && (
          <div className="space-y-6">
            {/* Revenue Breakdown Chart */}
            <Card className="border-0 rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-[var(--color-easyCo-purple)] flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  Revenue Breakdown by Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value, name) => [formatCurrency(Number(value)), name]}
                      labelStyle={{ color: '#000' }}
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rental" 
                      stackId="1"
                      stroke="#4A148C" 
                      fill="#4A148C" 
                      fillOpacity={0.8}
                      name="Rental Income"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="deposits" 
                      stackId="1"
                      stroke="#FFD600" 
                      fill="#FFD600" 
                      fillOpacity={0.8}
                      name="Security Deposits"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="fees" 
                      stackId="1"
                      stroke="#7E57C2" 
                      fill="#7E57C2" 
                      fillOpacity={0.8}
                      name="Service Fees"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 rounded-3xl shadow-sm bg-gradient-to-br from-[var(--color-easyCo-purple)] to-[var(--color-easyCo-purple-dark)] text-white">
                <CardContent className="p-6">
                  <h3 className="text-white/80 text-sm mb-2">Rental Income</h3>
                  <p className="text-2xl font-bold mb-2">
                    {formatCurrency(REVENUE_DATA.reduce((sum, month) => sum + month.rental, 0))}
                  </p>
                  <p className="text-sm text-white/80">92% of total revenue</p>
                </CardContent>
              </Card>

              <Card className="border-0 rounded-3xl shadow-sm bg-gradient-to-br from-[var(--color-easyCo-mustard)] to-[var(--color-easyCo-mustard-dark)] text-black">
                <CardContent className="p-6">
                  <h3 className="text-black/70 text-sm mb-2">Security Deposits</h3>
                  <p className="text-2xl font-bold mb-2">
                    {formatCurrency(REVENUE_DATA.reduce((sum, month) => sum + month.deposits, 0))}
                  </p>
                  <p className="text-sm text-black/70">6% of total revenue</p>
                </CardContent>
              </Card>

              <Card className="border-0 rounded-3xl shadow-sm bg-gradient-to-br from-[var(--color-easyCo-purple-light)] to-[var(--color-easyCo-purple)] text-white">
                <CardContent className="p-6">
                  <h3 className="text-white/80 text-sm mb-2">Service Fees</h3>
                  <p className="text-2xl font-bold mb-2">
                    {formatCurrency(REVENUE_DATA.reduce((sum, month) => sum + month.fees, 0))}
                  </p>
                  <p className="text-sm text-white/80">2% of total revenue</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedTab === 'reports' && (
          <div className="space-y-6">
            <Card className="border-0 rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-[var(--color-easyCo-purple)] flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Generate Financial Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-[var(--color-easyCo-gray-light)] rounded-2xl">
                    <h3 className="font-bold text-[var(--color-easyCo-purple)] mb-2">Monthly Report</h3>
                    <p className="text-sm text-[var(--color-easyCo-gray-dark)] mb-4">
                      Complete monthly financial summary including revenue, expenses, and ROI analysis.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={exportToPdf}
                        className="bg-[var(--color-easyCo-purple)] rounded-2xl flex-1"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button 
                        onClick={exportToCsv}
                        variant="outline" 
                        className="rounded-2xl flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 bg-[var(--color-easyCo-gray-light)] rounded-2xl">
                    <h3 className="font-bold text-[var(--color-easyCo-purple)] mb-2">Tax Report</h3>
                    <p className="text-sm text-[var(--color-easyCo-gray-dark)] mb-4">
                      Tax-ready expense report with categorized deductions and income statements.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={exportToPdf}
                        className="bg-[var(--color-easyCo-purple)] rounded-2xl flex-1"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button 
                        onClick={exportToCsv}
                        variant="outline" 
                        className="rounded-2xl flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 bg-[var(--color-easyCo-gray-light)] rounded-2xl">
                    <h3 className="font-bold text-[var(--color-easyCo-purple)] mb-2">Performance Analysis</h3>
                    <p className="text-sm text-[var(--color-easyCo-gray-dark)] mb-4">
                      Detailed property performance metrics with occupancy rates and revenue trends.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={exportToPdf}
                        className="bg-[var(--color-easyCo-purple)] rounded-2xl flex-1"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button 
                        onClick={exportToCsv}
                        variant="outline" 
                        className="rounded-2xl flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 bg-[var(--color-easyCo-gray-light)] rounded-2xl">
                    <h3 className="font-bold text-[var(--color-easyCo-purple)] mb-2">Annual Summary</h3>
                    <p className="text-sm text-[var(--color-easyCo-gray-dark)] mb-4">
                      Comprehensive yearly overview with financial projections and investment insights.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={exportToPdf}
                        className="bg-[var(--color-easyCo-purple)] rounded-2xl flex-1"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button 
                        onClick={exportToCsv}
                        variant="outline" 
                        className="rounded-2xl flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}