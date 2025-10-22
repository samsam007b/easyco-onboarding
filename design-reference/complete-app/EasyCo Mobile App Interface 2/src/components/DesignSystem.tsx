import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Palette,
  Type,
  Square,
  CreditCard,
  MousePointer,
  Layers,
  Home,
  Zap,
  Droplets,
  Wrench,
  DollarSign,
  FileText,
  TrendingUp,
  TrendingDown,
  Wifi,
  Car,
  Shield,
  Thermometer,
  Building,
  Users,
  Star,
  Heart,
  MapPin,
  Calendar,
  Check,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface DesignSystemProps {
  onBack: () => void;
}

export function DesignSystem({ onBack }: DesignSystemProps) {
  const [activeTab, setActiveTab] = useState("colors");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-[var(--color-easyCo-purple)] px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-white">EasyCo Design System</h1>
            <p className="text-white/80 text-sm">Modern, minimal, and friendly</p>
          </div>
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 rounded-xl"
          >
            ← Back
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-[var(--color-easyCo-gray-light)] rounded-xl h-12">
            <TabsTrigger value="colors" className="rounded-xl">
              <Palette className="w-4 h-4 mr-2" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="rounded-xl">
              <Type className="w-4 h-4 mr-2" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="buttons" className="rounded-xl">
              <MousePointer className="w-4 h-4 mr-2" />
              Buttons
            </TabsTrigger>
            <TabsTrigger value="cards" className="rounded-xl">
              <Square className="w-4 h-4 mr-2" />
              Cards
            </TabsTrigger>
            <TabsTrigger value="inputs" className="rounded-xl">
              <CreditCard className="w-4 h-4 mr-2" />
              Inputs
            </TabsTrigger>
            <TabsTrigger value="components" className="rounded-xl">
              <Layers className="w-4 h-4 mr-2" />
              Components
            </TabsTrigger>
            <TabsTrigger value="icons" className="rounded-xl">
              <Home className="w-4 h-4 mr-2" />
              Icons
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="p-6 space-y-8">
            {/* Primary Colors */}
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-easyCo-purple)] mb-4">Primary Colors</h2>
              <div className="grid grid-cols-3 gap-4">
                <Card className="border-0 rounded-2xl overflow-hidden">
                  <div className="h-24 bg-[var(--color-easyCo-purple)]"></div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Deep Purple</h3>
                    <p className="text-sm text-[var(--color-easyCo-gray-dark)]">#4A148C</p>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">Primary brand color</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 rounded-2xl overflow-hidden">
                  <div className="h-24 bg-[var(--color-easyCo-mustard)]"></div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Mustard Yellow</h3>
                    <p className="text-sm text-[var(--color-easyCo-gray-dark)]">#FFD600</p>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">Accent & CTA color</p>
                  </CardContent>
                </Card>

                <Card className="border-0 rounded-2xl overflow-hidden">
                  <div className="h-24 bg-white border border-[var(--color-easyCo-gray-medium)]"></div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Pure White</h3>
                    <p className="text-sm text-[var(--color-easyCo-gray-dark)]">#FFFFFF</p>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">Clarity & space</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Secondary Colors */}
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-easyCo-purple)] mb-4">Secondary Colors</h2>
              <div className="grid grid-cols-4 gap-4">
                <Card className="border-0 rounded-2xl overflow-hidden">
                  <div className="h-20 bg-[var(--color-easyCo-purple-light)]"></div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">Light Purple</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">#7E57C2</p>
                  </CardContent>
                </Card>

                <Card className="border-0 rounded-2xl overflow-hidden">
                  <div className="h-20 bg-[var(--color-easyCo-purple-dark)]"></div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">Dark Purple</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">#311B92</p>
                  </CardContent>
                </Card>

                <Card className="border-0 rounded-2xl overflow-hidden">
                  <div className="h-20 bg-[var(--color-easyCo-mustard-dark)]"></div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">Dark Mustard</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">#F57F17</p>
                  </CardContent>
                </Card>

                <Card className="border-0 rounded-2xl overflow-hidden">
                  <div className="h-20 bg-[var(--color-easyCo-gray-light)]"></div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">Light Gray</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">#F5F5F5</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Status Colors */}
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-easyCo-purple)] mb-4">Status Colors</h2>
              <div className="grid grid-cols-4 gap-4">
                <Card className="border-0 rounded-2xl overflow-hidden">
                  <div className="h-20 bg-green-500"></div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">Success</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">#10B981</p>
                  </CardContent>
                </Card>

                <Card className="border-0 rounded-2xl overflow-hidden">
                  <div className="h-20 bg-orange-500"></div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">Warning</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">#F59E0B</p>
                  </CardContent>
                </Card>

                <Card className="border-0 rounded-2xl overflow-hidden">
                  <div className="h-20 bg-red-500"></div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">Error</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">#EF4444</p>
                  </CardContent>
                </Card>

                <Card className="border-0 rounded-2xl overflow-hidden">
                  <div className="h-20 bg-blue-500"></div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">Info</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">#3B82F6</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="p-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-easyCo-purple)] mb-6">Typography Scale</h2>
              <div className="space-y-6">
                <Card className="border-0 rounded-2xl p-6">
                  <h1 className="text-3xl font-bold text-[var(--color-easyCo-purple)]">Heading 1 - Main Titles</h1>
                  <p className="text-sm text-[var(--color-easyCo-gray-dark)] mt-2">3xl / Bold / Purple</p>
                </Card>

                <Card className="border-0 rounded-2xl p-6">
                  <h2 className="text-2xl font-semibold text-[var(--color-easyCo-purple)]">Heading 2 - Section Titles</h2>
                  <p className="text-sm text-[var(--color-easyCo-gray-dark)] mt-2">2xl / Semibold / Purple</p>
                </Card>

                <Card className="border-0 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-[var(--color-easyCo-purple)]">Heading 3 - Subsection Titles</h3>
                  <p className="text-sm text-[var(--color-easyCo-gray-dark)] mt-2">xl / Semibold / Purple</p>
                </Card>

                <Card className="border-0 rounded-2xl p-6">
                  <p className="text-base text-[var(--color-easyCo-gray-dark)]">Body Text - This is the standard body text used throughout the application. It should be easily readable and provide good contrast.</p>
                  <p className="text-sm text-[var(--color-easyCo-gray-dark)] mt-2">base / Regular / Gray Dark</p>
                </Card>

                <Card className="border-0 rounded-2xl p-6">
                  <p className="text-sm text-[var(--color-easyCo-gray-dark)]">Caption Text - Used for secondary information, timestamps, and metadata.</p>
                  <p className="text-xs text-[var(--color-easyCo-gray-dark)] mt-2">sm / Regular / Gray Dark</p>
                </Card>

                <Card className="border-0 rounded-2xl p-6">
                  <p className="text-xs text-[var(--color-easyCo-gray-dark)]">Small Text - Used for legal text, disclaimers, and fine print.</p>
                  <p className="text-xs text-[var(--color-easyCo-gray-dark)] mt-2">xs / Regular / Gray Dark</p>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Buttons Tab */}
          <TabsContent value="buttons" className="p-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-easyCo-purple)] mb-6">Button Variants</h2>
              <div className="space-y-6">
                {/* Primary Buttons */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Primary Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl">
                      Primary CTA
                    </Button>
                    <Button size="lg" className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl">
                      Large Primary
                    </Button>
                    <Button size="sm" className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-xl">
                      Small Primary
                    </Button>
                  </div>
                </div>

                {/* Secondary Buttons */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Secondary Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button className="bg-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple-dark)] text-white rounded-2xl">
                      Secondary Action
                    </Button>
                    <Button size="lg" className="bg-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple-dark)] text-white rounded-2xl">
                      Large Secondary
                    </Button>
                    <Button size="sm" className="bg-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple-dark)] text-white rounded-xl">
                      Small Secondary
                    </Button>
                  </div>
                </div>

                {/* Outline Buttons */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Outline Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="border-2 border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-2xl hover:bg-[var(--color-easyCo-purple)] hover:text-white">
                      Outline Button
                    </Button>
                    <Button variant="outline" size="lg" className="border-2 border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-2xl hover:bg-[var(--color-easyCo-purple)] hover:text-white">
                      Large Outline
                    </Button>
                    <Button variant="outline" size="sm" className="border border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-xl hover:bg-[var(--color-easyCo-purple)] hover:text-white">
                      Small Outline
                    </Button>
                  </div>
                </div>

                {/* Ghost Buttons */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Ghost Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="ghost" className="text-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple)]/10 rounded-2xl">
                      Ghost Button
                    </Button>
                    <Button variant="ghost" size="lg" className="text-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple)]/10 rounded-2xl">
                      Large Ghost
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple)]/10 rounded-xl">
                      Small Ghost
                    </Button>
                  </div>
                </div>

                {/* Disabled Buttons */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Disabled State</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button disabled className="bg-[var(--color-easyCo-gray-medium)] text-[var(--color-easyCo-gray-dark)] rounded-2xl">
                      Disabled Primary
                    </Button>
                    <Button variant="outline" disabled className="border border-[var(--color-easyCo-gray-medium)] text-[var(--color-easyCo-gray-dark)] rounded-2xl">
                      Disabled Outline
                    </Button>
                    <Button variant="ghost" disabled className="text-[var(--color-easyCo-gray-dark)] rounded-2xl">
                      Disabled Ghost
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="p-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-easyCo-purple)] mb-6">Card Components</h2>
              
              {/* Property Card */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Property Card</h3>
                <Card className="border-0 rounded-3xl overflow-hidden shadow-lg max-w-sm">
                  <div className="relative">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xpdmluZyUyMHNwYWNlfGVufDF8fHx8MTc1NTQzNDA1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Property"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Button size="sm" variant="ghost" className="w-8 h-8 rounded-full bg-white/90 p-0">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-[var(--color-easyCo-mustard)] text-black">
                        Available Now
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[var(--color-easyCo-purple)]">Modern Coliving Space</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[var(--color-easyCo-mustard)]" fill="currentColor" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      Ixelles, Brussels
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-[var(--color-easyCo-purple)]">€650</span>
                        <span className="text-sm text-[var(--color-easyCo-gray-dark)]">/month</span>
                      </div>
                      <Button size="sm" className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-xl">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Finance KPI Cards */}
              <div>
                <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Finance KPI Cards</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-0 rounded-2xl bg-gradient-to-br from-green-50 to-green-100">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <Badge className="bg-green-100 text-green-800">+12%</Badge>
                      </div>
                      <h3 className="font-semibold text-green-800 mb-1">Monthly Revenue</h3>
                      <p className="text-2xl font-bold text-green-900">€8,450</p>
                      <p className="text-sm text-green-700">vs last month</p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">95%</Badge>
                      </div>
                      <h3 className="font-semibold text-blue-800 mb-1">Occupancy Rate</h3>
                      <p className="text-2xl font-bold text-blue-900">18/19</p>
                      <p className="text-sm text-blue-700">rooms occupied</p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center">
                          <TrendingDown className="w-5 h-5 text-white" />
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">-€340</Badge>
                      </div>
                      <h3 className="font-semibold text-orange-800 mb-1">Monthly Expenses</h3>
                      <p className="text-2xl font-bold text-orange-900">€2,160</p>
                      <p className="text-sm text-orange-700">vs last month</p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-[var(--color-easyCo-purple)] rounded-2xl flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">+8%</Badge>
                      </div>
                      <h3 className="font-semibold text-purple-800 mb-1">Net Profit</h3>
                      <p className="text-2xl font-bold text-purple-900">€6,290</p>
                      <p className="text-sm text-purple-700">this month</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Inputs Tab */}
          <TabsContent value="inputs" className="p-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-easyCo-purple)] mb-6">Form Elements</h2>
              
              <div className="space-y-6 max-w-md">
                {/* Input Fields */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Input Fields</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="rounded-2xl border-2 border-[var(--color-easyCo-gray-medium)] focus:border-[var(--color-easyCo-purple)]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="rounded-2xl border-2 border-[var(--color-easyCo-gray-medium)] focus:border-[var(--color-easyCo-purple)]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="error-input">Input with Error</Label>
                      <Input
                        id="error-input"
                        placeholder="Invalid input"
                        className="rounded-2xl border-2 border-red-500 focus:border-red-500"
                      />
                      <p className="text-sm text-red-500 mt-1">This field is required</p>
                    </div>

                    <div>
                      <Label htmlFor="disabled-input">Disabled Input</Label>
                      <Input
                        id="disabled-input"
                        placeholder="Disabled input"
                        disabled
                        className="rounded-2xl border-2 border-[var(--color-easyCo-gray-medium)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Dropdowns */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Dropdowns</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Location</Label>
                      <Select>
                        <SelectTrigger className="rounded-2xl border-2 border-[var(--color-easyCo-gray-medium)] focus:border-[var(--color-easyCo-purple)]">
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brussels">Brussels</SelectItem>
                          <SelectItem value="antwerp">Antwerp</SelectItem>
                          <SelectItem value="ghent">Ghent</SelectItem>
                          <SelectItem value="leuven">Leuven</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Property Type</Label>
                      <Select>
                        <SelectTrigger className="rounded-2xl border-2 border-[var(--color-easyCo-gray-medium)] focus:border-[var(--color-easyCo-purple)]">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="room">Room</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="p-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-easyCo-purple)] mb-6">UI Components</h2>
              
              {/* Badges */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Badges & Status</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-[var(--color-easyCo-mustard)] text-black">Available Now</Badge>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Popular</Badge>
                  <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
                  <Badge className="bg-red-100 text-red-800">Unavailable</Badge>
                  <Badge variant="outline" className="border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)]">Featured</Badge>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Progress Indicators</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Occupancy Rate</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Budget Used</span>
                      <span>62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Profile Completion</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Avatars */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Avatars</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTUwOTE3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="User" />
                    <AvatarFallback className="bg-[var(--color-easyCo-mustard)] text-black">SM</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-[var(--color-easyCo-purple)] text-white">JD</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[var(--color-easyCo-gray-medium)] text-[var(--color-easyCo-gray-dark)]">AK</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Modal */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Modal Dialog</h3>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl">
                      Open Modal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-3xl border-0">
                    <DialogHeader>
                      <DialogTitle className="text-[var(--color-easyCo-purple)]">Book Your Visit</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-[var(--color-easyCo-gray-dark)] mb-4">
                        Schedule a viewing for this amazing coliving space in Brussels.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <Label>Preferred Date</Label>
                          <Input type="date" className="rounded-2xl border-2 border-[var(--color-easyCo-gray-medium)]" />
                        </div>
                        <div>
                          <Label>Time Preference</Label>
                          <Select>
                            <SelectTrigger className="rounded-2xl">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">Morning (9-12)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12-17)</SelectItem>
                              <SelectItem value="evening">Evening (17-20)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsModalOpen(false)}
                          className="flex-1 rounded-2xl border-[var(--color-easyCo-gray-medium)]"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => setIsModalOpen(false)}
                          className="flex-1 bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl"
                        >
                          Book Visit
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Tabs */}
              <div>
                <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Tab Navigation</h3>
                <Tabs defaultValue="overview" className="w-full max-w-md">
                  <TabsList className="grid w-full grid-cols-3 bg-[var(--color-easyCo-gray-light)] rounded-2xl">
                    <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
                    <TabsTrigger value="details" className="rounded-xl">Details</TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-xl">Reviews</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-4">
                    <Card className="border-0 rounded-2xl">
                      <CardContent className="p-4">
                        <p className="text-[var(--color-easyCo-gray-dark)]">Property overview content goes here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="details" className="mt-4">
                    <Card className="border-0 rounded-2xl">
                      <CardContent className="p-4">
                        <p className="text-[var(--color-easyCo-gray-dark)]">Detailed property information goes here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="reviews" className="mt-4">
                    <Card className="border-0 rounded-2xl">
                      <CardContent className="p-4">
                        <p className="text-[var(--color-easyCo-gray-dark)]">User reviews and ratings go here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </TabsContent>

          {/* Icons Tab */}
          <TabsContent value="icons" className="p-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-easyCo-purple)] mb-6">Icon Library</h2>
              
              {/* Expense Category Icons */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Expense Categories</h3>
                <div className="grid grid-cols-4 gap-4">
                  <Card className="border-0 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <Home className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-sm">Rent</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">Monthly rent payments</p>
                  </Card>

                  <Card className="border-0 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="font-medium text-sm">Utilities</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">Electricity, gas, water</p>
                  </Card>

                  <Card className="border-0 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <Wrench className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-sm">Maintenance</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">Repairs & upkeep</p>
                  </Card>

                  <Card className="border-0 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <h4 className="font-medium text-sm">Taxes</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">Property taxes</p>
                  </Card>

                  <Card className="border-0 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <Wifi className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-sm">Internet</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">WiFi & connectivity</p>
                  </Card>

                  <Card className="border-0 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <Car className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="font-medium text-sm">Parking</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">Parking fees</p>
                  </Card>

                  <Card className="border-0 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-medium text-sm">Insurance</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">Property insurance</p>
                  </Card>

                  <Card className="border-0 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <Droplets className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h4 className="font-medium text-sm">Water</h4>
                    <p className="text-xs text-[var(--color-easyCo-gray-dark)]">Water utilities</p>
                  </Card>
                </div>
              </div>

              {/* Status Icons */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Status Indicators</h3>
                <div className="grid grid-cols-4 gap-4">
                  <Card className="border-0 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-sm">Success</h4>
                  </Card>

                  <Card className="border-0 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h4 className="font-medium text-sm">Error</h4>
                  </Card>

                  <Card className="border-0 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="font-medium text-sm">Warning</h4>
                  </Card>

                  <Card className="border-0 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <Info className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-sm">Info</h4>
                  </Card>
                </div>
              </div>

              {/* Navigation Icons */}
              <div>
                <h3 className="text-lg font-medium text-[var(--color-easyCo-purple)] mb-4">Navigation Icons</h3>
                <div className="grid grid-cols-6 gap-4">
                  {[
                    { icon: Home, label: "Home" },
                    { icon: Building, label: "Properties" },
                    { icon: Users, label: "Roommates" },
                    { icon: DollarSign, label: "Finance" },
                    { icon: Calendar, label: "Calendar" },
                    { icon: Star, label: "Favorites" },
                    { icon: MapPin, label: "Location" },
                    { icon: Thermometer, label: "Climate" },
                  ].map((item, index) => (
                    <Card key={index} className="border-0 rounded-2xl p-3 text-center">
                      <div className="w-10 h-10 bg-[var(--color-easyCo-purple)]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <item.icon className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                      </div>
                      <h4 className="font-medium text-xs">{item.label}</h4>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}