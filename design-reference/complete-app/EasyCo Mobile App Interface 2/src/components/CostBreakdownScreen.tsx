import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { 
  ArrowLeft, 
  Wifi, 
  Tv, 
  Zap, 
  Wrench, 
  Sparkles,
  Info,
  Calendar,
  DollarSign
} from "lucide-react";

const BUDGET_DATA = [
  {
    id: 'wifi',
    name: 'Wi-Fi / Internet',
    monthlyAmount: 25,
    yearlyAmount: 300,
    percentage: 20.8,
    icon: Wifi,
    color: '#4A148C',
    description: 'High-speed fiber internet (100+ Mbps) shared among all residents'
  },
  {
    id: 'streaming',
    name: 'Streaming Services',
    monthlyAmount: 18,
    yearlyAmount: 216,
    percentage: 15.0,
    icon: Tv,
    color: '#7E57C2',
    description: 'Netflix, Spotify Premium, and other shared entertainment subscriptions'
  },
  {
    id: 'utilities',
    name: 'Water & Electricity',
    monthlyAmount: 45,
    yearlyAmount: 540,
    percentage: 37.5,
    icon: Zap,
    color: '#FFD600',
    description: 'Monthly utilities split equally among all residents based on usage'
  },
  {
    id: 'maintenance',
    name: 'Repairs / Maintenance',
    monthlyAmount: 20,
    yearlyAmount: 240,
    percentage: 16.7,
    icon: Wrench,
    color: '#F57F17',
    description: 'Occasional maintenance and shared appliance fixes and upkeep'
  },
  {
    id: 'cleaning',
    name: 'Cleaning Service',
    monthlyAmount: 12,
    yearlyAmount: 144,
    percentage: 10.0,
    icon: Sparkles,
    color: '#9C27B0',
    description: 'Professional cleaning of common areas twice per month'
  }
];

const TOTAL_MONTHLY = BUDGET_DATA.reduce((sum, item) => sum + item.monthlyAmount, 0);
const TOTAL_YEARLY = BUDGET_DATA.reduce((sum, item) => sum + item.yearlyAmount, 0);

interface CostBreakdownScreenProps {
  onBack: () => void;
}

export function CostBreakdownScreen({ onBack }: CostBreakdownScreenProps) {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={BUDGET_DATA}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey={viewMode === 'monthly' ? 'monthlyAmount' : 'yearlyAmount'}
          label={({ percentage }) => `${percentage.toFixed(1)}%`}
          labelLine={false}
        >
          {BUDGET_DATA.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`€${value}`, viewMode === 'monthly' ? 'Monthly' : 'Yearly']}
          labelFormatter={(label) => BUDGET_DATA.find(item => item.name === label)?.name || label}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={BUDGET_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value: number) => [`€${value}`, viewMode === 'monthly' ? 'Monthly' : 'Yearly']}
        />
        <Bar 
          dataKey={viewMode === 'monthly' ? 'monthlyAmount' : 'yearlyAmount'} 
          fill="#4A148C"
          radius={[4, 4, 0, 0]}
        >
          {BUDGET_DATA.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-[var(--color-easyCo-purple)] px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-0 text-white hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-white">Everyday Life Budget</h1>
            <p className="text-white/80 text-sm">Additional living costs breakdown</p>
          </div>
        </div>

        {/* Total Cost Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-white mb-1">
            €{viewMode === 'monthly' ? TOTAL_MONTHLY : TOTAL_YEARLY}
          </div>
          <div className="text-white/80 text-sm">
            Total additional cost per {viewMode === 'monthly' ? 'month' : 'year'}
          </div>
          <div className="text-white/60 text-xs mt-2">
            + Your room rent (€620/month)
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* View Controls */}
        <div className="flex gap-3">
          <div className="flex bg-white rounded-2xl p-1 shadow-sm">
            <Button
              variant={viewMode === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('monthly')}
              className={`text-xs rounded-xl ${
                viewMode === 'monthly' 
                  ? 'bg-[var(--color-easyCo-purple)] text-white' 
                  : 'text-[var(--color-easyCo-purple)]'
              }`}
            >
              <Calendar className="w-3 h-3 mr-1" />
              Monthly
            </Button>
            <Button
              variant={viewMode === 'yearly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('yearly')}
              className={`text-xs rounded-xl ${
                viewMode === 'yearly' 
                  ? 'bg-[var(--color-easyCo-purple)] text-white' 
                  : 'text-[var(--color-easyCo-purple)]'
              }`}
            >
              <DollarSign className="w-3 h-3 mr-1" />
              Yearly
            </Button>
          </div>

          <div className="flex bg-white rounded-2xl p-1 shadow-sm">
            <Button
              variant={chartType === 'pie' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('pie')}
              className={`text-xs rounded-xl ${
                chartType === 'pie' 
                  ? 'bg-[var(--color-easyCo-purple)] text-white' 
                  : 'text-[var(--color-easyCo-purple)]'
              }`}
            >
              Pie Chart
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              className={`text-xs rounded-xl ${
                chartType === 'bar' 
                  ? 'bg-[var(--color-easyCo-purple)] text-white' 
                  : 'text-[var(--color-easyCo-purple)]'
              }`}
            >
              Bar Chart
            </Button>
          </div>
        </div>

        {/* Chart Visualization */}
        <Card className="rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-4 text-center">
              Cost Distribution ({viewMode === 'monthly' ? 'Monthly' : 'Yearly'})
            </h3>
            {chartType === 'pie' ? renderPieChart() : renderBarChart()}
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        <Card className="rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-4">Detailed Breakdown</h3>
            
            <div className="space-y-4">
              {BUDGET_DATA.map((item) => {
                const IconComponent = item.icon;
                const amount = viewMode === 'monthly' ? item.monthlyAmount : item.yearlyAmount;
                
                return (
                  <div key={item.id} className="border border-[var(--color-easyCo-gray-medium)] rounded-2xl p-4">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <IconComponent 
                          className="w-6 h-6" 
                          style={{ color: item.color }}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-[var(--color-easyCo-purple)] text-sm mb-1">
                              {item.name}
                            </h4>
                            <p className="text-xs text-[var(--color-easyCo-gray-dark)] leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="font-bold text-lg" style={{ color: item.color }}>
                              €{amount}
                            </div>
                            <div className="text-xs text-[var(--color-easyCo-gray-dark)]">
                              {item.percentage.toFixed(1)}% of total
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-[var(--color-easyCo-gray-light)] rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: item.color
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="rounded-2xl shadow-sm border-0 bg-gradient-to-r from-[var(--color-easyCo-purple)]/5 to-[var(--color-easyCo-mustard)]/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[var(--color-easyCo-purple)] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-[var(--color-easyCo-purple)] text-sm mb-2">
                  What's Included
                </h4>
                <p className="text-xs text-[var(--color-easyCo-gray-dark)] leading-relaxed mb-3">
                  These costs are automatically split among all residents and billed monthly. 
                  No need to set up individual accounts or worry about coordinating payments.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center text-green-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    No setup fees
                  </div>
                  <div className="flex items-center text-green-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    Transparent billing
                  </div>
                  <div className="flex items-center text-green-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    Shared equally
                  </div>
                  <div className="flex items-center text-green-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    Monthly billing
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Calculation */}
        <Card className="rounded-2xl shadow-sm border-0 bg-[var(--color-easyCo-purple)]/5">
          <CardContent className="p-6">
            <h4 className="font-medium text-[var(--color-easyCo-purple)] mb-4 text-center">
              Your Total {viewMode === 'monthly' ? 'Monthly' : 'Yearly'} Cost
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--color-easyCo-gray-dark)]">Room rent</span>
                <span className="font-medium">
                  €{viewMode === 'monthly' ? '620' : '7,440'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--color-easyCo-gray-dark)]">Additional costs</span>
                <span className="font-medium">
                  €{viewMode === 'monthly' ? TOTAL_MONTHLY : TOTAL_YEARLY}
                </span>
              </div>
              <div className="h-px bg-[var(--color-easyCo-gray-medium)]"></div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--color-easyCo-purple)]">Total</span>
                <span className="font-bold text-xl text-[var(--color-easyCo-purple)]">
                  €{viewMode === 'monthly' ? (620 + TOTAL_MONTHLY) : (7440 + TOTAL_YEARLY)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}