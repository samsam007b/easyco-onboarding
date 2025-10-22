import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { 
  User,
  Edit,
  Settings,
  Bell,
  Shield,
  Globe,
  Moon,
  Smartphone,
  Key,
  FileText,
  Eye,
  LogOut,
  ChevronRight,
  Check,
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  Briefcase,
  ArrowLeft,
  Users,
  TrendingUp,
  Target,
  Leaf,
  DollarSign,
  Hash,
  Factory,
  Zap,
  MessageSquare,
  Clock,
  Rocket,
  ShieldCheck,
  Lightbulb,
  BarChart3,
  Recycle,
  Scale,
  Truck,
  Star,
  Calendar,
  ChevronLeft,
  Plus
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: "landlord" | "tenant" | "searcher" | "guest";
  avatar: string;
  location: string;
  occupation?: string;
  university?: string;
  verified: boolean;
  onboardingCompleted?: boolean;
}

interface OnboardingData {
  companyBasics: {
    companyName: string;
    registrationNumber: string;
    industry: string;
    province: string;
    city: string;
  };
  companyStructure: {
    employeeCount: string;
    companyStatus: string;
    annualRevenue: string;
    hrManagement: string;
  };
  challenges: string[];
  goals: {
    growth: boolean;
    innovation: boolean;
    efficiency: boolean;
    sustainability: boolean;
  };
  carbonCompliance: {
    emissionsEstimate: string;
    regulatoryAwareness: boolean;
    sustainabilityInterest: boolean;
  };
  preferences: {
    communicationMethod: string;
    alertFrequency: string;
  };
}

interface PreferencesState {
  language: "en" | "fr" | "nl";
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };
  darkMode: boolean;
}

interface SecurityState {
  twoFactorEnabled: boolean;
  connectedDevices: Array<{
    id: string;
    name: string;
    type: string;
    lastActive: string;
    current: boolean;
  }>;
}

interface ProfileScreenProps {
  onBack?: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+32 496 12 34 56",
    role: "tenant",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5c8?w=150&h=150&fit=crop&crop=face",
    location: "Brussels, Belgium",
    occupation: "Digital Marketing Specialist",
    university: "VUB - Brussels University",
    verified: true,
    onboardingCompleted: false
  });

  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    companyBasics: {
      companyName: "",
      registrationNumber: "",
      industry: "",
      province: "",
      city: ""
    },
    companyStructure: {
      employeeCount: "",
      companyStatus: "",
      annualRevenue: "",
      hrManagement: ""
    },
    challenges: [],
    goals: {
      growth: false,
      innovation: false,
      efficiency: false,
      sustainability: false
    },
    carbonCompliance: {
      emissionsEstimate: "",
      regulatoryAwareness: false,
      sustainabilityInterest: false
    },
    preferences: {
      communicationMethod: "",
      alertFrequency: ""
    }
  });

  const [preferences, setPreferences] = useState<PreferencesState>({
    language: "en",
    notifications: {
      push: true,
      email: true,
      sms: false,
      marketing: false
    },
    darkMode: false
  });

  const [security, setSecurity] = useState<SecurityState>({
    twoFactorEnabled: true,
    connectedDevices: [
      { id: "1", name: "iPhone 14 Pro", type: "Mobile", lastActive: "Currently active", current: true },
      { id: "2", name: "MacBook Pro", type: "Desktop", lastActive: "2 hours ago", current: false },
      { id: "3", name: "iPad Air", type: "Tablet", lastActive: "Yesterday", current: false }
    ]
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState(userProfile);

  const handleSaveProfile = () => {
    setUserProfile(editForm);
    setIsEditingProfile(false);
  };

  const startOnboarding = () => {
    setIsOnboarding(true);
    setOnboardingStep(1);
  };

  const nextOnboardingStep = () => {
    if (onboardingStep < 6) {
      setOnboardingStep(onboardingStep + 1);
    }
  };

  const prevOnboardingStep = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const completeOnboarding = () => {
    setUserProfile(prev => ({ ...prev, onboardingCompleted: true }));
    setIsOnboarding(false);
    setOnboardingStep(1);
  };

  const updateOnboardingData = (section: keyof OnboardingData, data: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const toggleChallenge = (challenge: string) => {
    setOnboardingData(prev => ({
      ...prev,
      challenges: prev.challenges.includes(challenge)
        ? prev.challenges.filter(c => c !== challenge)
        : [...prev.challenges, challenge]
    }));
  };

  const toggleGoal = (goal: keyof OnboardingData['goals']) => {
    setOnboardingData(prev => ({
      ...prev,
      goals: { ...prev.goals, [goal]: !prev.goals[goal] }
    }));
  };

  const handleLanguageChange = (language: "en" | "fr" | "nl") => {
    setPreferences(prev => ({ ...prev, language }));
  };

  const handleNotificationChange = (type: keyof PreferencesState["notifications"], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: value }
    }));
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "landlord": return "Property Owner";
      case "tenant": return "Current Resident";
      case "searcher": return "Looking for Housing";
      case "guest": return "Guest User";
      default: return role;
    }
  };

  const getLanguageDisplay = (lang: string) => {
    switch (lang) {
      case "en": return "English";
      case "fr": return "Français";
      case "nl": return "Nederlands";
      default: return lang;
    }
  };

  const renderOnboardingStep = () => {
    const stepProgress = (onboardingStep / 6) * 100;

    switch (onboardingStep) {
      case 1:
        return (
          <Card className="rounded-3xl shadow-sm border-0 p-6">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Building className="w-12 h-12 text-[var(--color-easyCo-purple)] mx-auto" />
                <h2 className="text-xl font-bold text-[var(--color-easyCo-purple)]">Company Basics</h2>
                <p className="text-sm text-[var(--color-easyCo-gray-dark)]">Tell us about your company</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={onboardingData.companyBasics.companyName}
                    onChange={(e) => updateOnboardingData('companyBasics', { companyName: e.target.value })}
                    placeholder="Enter your company name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Company Registration Number</Label>
                  <Input
                    value={onboardingData.companyBasics.registrationNumber}
                    onChange={(e) => updateOnboardingData('companyBasics', { registrationNumber: e.target.value })}
                    placeholder="BE 0123.456.789"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Industry</Label>
                  <Select 
                    value={onboardingData.companyBasics.industry} 
                    onValueChange={(value) => updateOnboardingData('companyBasics', { industry: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Province</Label>
                    <Select 
                      value={onboardingData.companyBasics.province} 
                      onValueChange={(value) => updateOnboardingData('companyBasics', { province: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brussels">Brussels</SelectItem>
                        <SelectItem value="antwerp">Antwerp</SelectItem>
                        <SelectItem value="flemish-brabant">Flemish Brabant</SelectItem>
                        <SelectItem value="walloon-brabant">Walloon Brabant</SelectItem>
                        <SelectItem value="west-flanders">West Flanders</SelectItem>
                        <SelectItem value="east-flanders">East Flanders</SelectItem>
                        <SelectItem value="limburg">Limburg</SelectItem>
                        <SelectItem value="liege">Liège</SelectItem>
                        <SelectItem value="namur">Namur</SelectItem>
                        <SelectItem value="hainaut">Hainaut</SelectItem>
                        <SelectItem value="luxembourg">Luxembourg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input
                      value={onboardingData.companyBasics.city}
                      onChange={(e) => updateOnboardingData('companyBasics', { city: e.target.value })}
                      placeholder="City"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );

      case 2:
        return (
          <Card className="rounded-3xl shadow-sm border-0 p-6">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Users className="w-12 h-12 text-[var(--color-easyCo-purple)] mx-auto" />
                <h2 className="text-xl font-bold text-[var(--color-easyCo-purple)]">Company Size & Structure</h2>
                <p className="text-sm text-[var(--color-easyCo-gray-dark)]">Help us understand your organization</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Number of Employees</Label>
                  <RadioGroup 
                    value={onboardingData.companyStructure.employeeCount}
                    onValueChange={(value) => updateOnboardingData('companyStructure', { employeeCount: value })}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="1-5" id="emp1-5" />
                      <Label htmlFor="emp1-5" className="flex-1 cursor-pointer">1-5</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="6-20" id="emp6-20" />
                      <Label htmlFor="emp6-20" className="flex-1 cursor-pointer">6-20</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="21-50" id="emp21-50" />
                      <Label htmlFor="emp21-50" className="flex-1 cursor-pointer">21-50</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="50+" id="emp50+" />
                      <Label htmlFor="emp50+" className="flex-1 cursor-pointer">50+</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-base font-medium mb-3 block">Company Status</Label>
                  <RadioGroup 
                    value={onboardingData.companyStructure.companyStatus}
                    onValueChange={(value) => updateOnboardingData('companyStructure', { companyStatus: value })}
                    className="grid grid-cols-3 gap-3"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="tpe" id="tpe" />
                      <Label htmlFor="tpe" className="flex-1 cursor-pointer text-sm">TPE</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="sme" id="sme" />
                      <Label htmlFor="sme" className="flex-1 cursor-pointer text-sm">SME</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="scale-up" id="scale-up" />
                      <Label htmlFor="scale-up" className="flex-1 cursor-pointer text-sm">Scale-up</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-base font-medium mb-3 block">Annual Revenue</Label>
                  <RadioGroup 
                    value={onboardingData.companyStructure.annualRevenue}
                    onValueChange={(value) => updateOnboardingData('companyStructure', { annualRevenue: value })}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="<500k" id="rev500k" />
                      <Label htmlFor="rev500k" className="flex-1 cursor-pointer">&lt; 500K</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="500k-2m" id="rev500k2m" />
                      <Label htmlFor="rev500k2m" className="flex-1 cursor-pointer">500K - 2M</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="2m-10m" id="rev2m10m" />
                      <Label htmlFor="rev2m10m" className="flex-1 cursor-pointer">2M - 10M</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="10m+" id="rev10m+" />
                      <Label htmlFor="rev10m+" className="flex-1 cursor-pointer">10M+</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-base font-medium mb-3 block">HR Management</Label>
                  <RadioGroup 
                    value={onboardingData.companyStructure.hrManagement}
                    onValueChange={(value) => updateOnboardingData('companyStructure', { hrManagement: value })}
                    className="grid grid-cols-3 gap-3"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="internal" id="hr-internal" />
                      <Label htmlFor="hr-internal" className="flex-1 cursor-pointer text-sm">Internal</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="outsourced" id="hr-outsourced" />
                      <Label htmlFor="hr-outsourced" className="flex-1 cursor-pointer text-sm">Outsourced</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="mixed" id="hr-mixed" />
                      <Label htmlFor="hr-mixed" className="flex-1 cursor-pointer text-sm">Mixed</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </Card>
        );

      case 3:
        return (
          <Card className="rounded-3xl shadow-sm border-0 p-6">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Target className="w-12 h-12 text-[var(--color-easyCo-purple)] mx-auto" />
                <h2 className="text-xl font-bold text-[var(--color-easyCo-purple)]">Current Challenges</h2>
                <p className="text-sm text-[var(--color-easyCo-gray-dark)]">Select all challenges your company faces</p>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: 'admin', label: 'Administrative & Compliance', icon: FileText },
                  { id: 'recruitment', label: 'Recruitment & Talent Shortage', icon: Users },
                  { id: 'digital', label: 'Digitalization / Cybersecurity', icon: ShieldCheck },
                  { id: 'funding', label: 'Funding & Grants', icon: DollarSign },
                  { id: 'energy', label: 'Energy Transition & Sustainability', icon: Leaf },
                  { id: 'market', label: 'Market Development (Local / International)', icon: TrendingUp }
                ].map((challenge) => (
                  <div key={challenge.id} className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                    <Checkbox
                      id={challenge.id}
                      checked={onboardingData.challenges.includes(challenge.id)}
                      onCheckedChange={() => toggleChallenge(challenge.id)}
                    />
                    <challenge.icon className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                    <Label htmlFor={challenge.id} className="flex-1 cursor-pointer">{challenge.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );

      case 4:
        return (
          <Card className="rounded-3xl shadow-sm border-0 p-6">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Rocket className="w-12 h-12 text-[var(--color-easyCo-purple)] mx-auto" />
                <h2 className="text-xl font-bold text-[var(--color-easyCo-purple)]">Goals & Priorities</h2>
                <p className="text-sm text-[var(--color-easyCo-gray-dark)]">What are your main objectives?</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {[
                  { 
                    key: 'growth' as keyof OnboardingData['goals'], 
                    label: 'Growth', 
                    description: 'Increase revenue by X%', 
                    icon: TrendingUp,
                    color: 'text-green-600'
                  },
                  { 
                    key: 'innovation' as keyof OnboardingData['goals'], 
                    label: 'Innovation', 
                    description: 'Invest in digital tools', 
                    icon: Lightbulb,
                    color: 'text-blue-600'
                  },
                  { 
                    key: 'efficiency' as keyof OnboardingData['goals'], 
                    label: 'Efficiency', 
                    description: 'Reduce administrative time', 
                    icon: Zap,
                    color: 'text-yellow-600'
                  },
                  { 
                    key: 'sustainability' as keyof OnboardingData['goals'], 
                    label: 'Sustainability', 
                    description: 'Reduce carbon footprint', 
                    icon: Leaf,
                    color: 'text-green-600'
                  }
                ].map((goal) => (
                  <div 
                    key={goal.key}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      onboardingData.goals[goal.key] 
                        ? 'border-[var(--color-easyCo-purple)] bg-[var(--color-easyCo-purple-light)]' 
                        : 'border-gray-200 hover:border-[var(--color-easyCo-purple)]'
                    }`}
                    onClick={() => toggleGoal(goal.key)}
                  >
                    <div className="flex items-center space-x-3">
                      <goal.icon className={`w-6 h-6 ${goal.color}`} />
                      <div className="flex-1">
                        <div className="font-medium">{goal.label}</div>
                        <div className="text-sm text-[var(--color-easyCo-gray-dark)]">{goal.description}</div>
                      </div>
                      {onboardingData.goals[goal.key] && (
                        <Check className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );

      case 5:
        return (
          <Card className="rounded-3xl shadow-sm border-0 p-6">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Leaf className="w-12 h-12 text-[var(--color-easyCo-purple)] mx-auto" />
                <h2 className="text-xl font-bold text-[var(--color-easyCo-purple)]">Carbon & Compliance</h2>
                <p className="text-sm text-[var(--color-easyCo-gray-dark)]">Optional sustainability assessment</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Current Emissions Estimate</Label>
                  <RadioGroup 
                    value={onboardingData.carbonCompliance.emissionsEstimate}
                    onValueChange={(value) => updateOnboardingData('carbonCompliance', { emissionsEstimate: value })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="low" id="emissions-low" />
                      <Label htmlFor="emissions-low" className="flex-1 cursor-pointer">Low (&lt; 10 tons CO2/year)</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="medium" id="emissions-medium" />
                      <Label htmlFor="emissions-medium" className="flex-1 cursor-pointer">Medium (10-50 tons CO2/year)</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="high" id="emissions-high" />
                      <Label htmlFor="emissions-high" className="flex-1 cursor-pointer">High (&gt; 50 tons CO2/year)</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="unknown" id="emissions-unknown" />
                      <Label htmlFor="emissions-unknown" className="flex-1 cursor-pointer">I don't know</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Scale className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                    <div>
                      <div className="font-medium">Regulatory Obligations Awareness</div>
                      <div className="text-sm text-[var(--color-easyCo-gray-dark)]">Do you know your compliance requirements?</div>
                    </div>
                  </div>
                  <Switch 
                    checked={onboardingData.carbonCompliance.regulatoryAwareness}
                    onCheckedChange={(checked) => updateOnboardingData('carbonCompliance', { regulatoryAwareness: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                    <div>
                      <div className="font-medium">Interest in Sustainability Grants</div>
                      <div className="text-sm text-[var(--color-easyCo-gray-dark)]">Would you like information about funding opportunities?</div>
                    </div>
                  </div>
                  <Switch 
                    checked={onboardingData.carbonCompliance.sustainabilityInterest}
                    onCheckedChange={(checked) => updateOnboardingData('carbonCompliance', { sustainabilityInterest: checked })}
                  />
                </div>
              </div>
            </div>
          </Card>
        );

      case 6:
        return (
          <Card className="rounded-3xl shadow-sm border-0 p-6">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Bell className="w-12 h-12 text-[var(--color-easyCo-purple)] mx-auto" />
                <h2 className="text-xl font-bold text-[var(--color-easyCo-purple)]">Preferences & Notifications</h2>
                <p className="text-sm text-[var(--color-easyCo-gray-dark)]">How would you like to stay updated?</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Communication Preferences</Label>
                  <RadioGroup 
                    value={onboardingData.preferences.communicationMethod}
                    onValueChange={(value) => updateOnboardingData('preferences', { communicationMethod: value })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="email" id="comm-email" />
                      <Mail className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                      <Label htmlFor="comm-email" className="flex-1 cursor-pointer">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="whatsapp" id="comm-whatsapp" />
                      <MessageSquare className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                      <Label htmlFor="comm-whatsapp" className="flex-1 cursor-pointer">WhatsApp</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="dashboard" id="comm-dashboard" />
                      <BarChart3 className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                      <Label htmlFor="comm-dashboard" className="flex-1 cursor-pointer">Dashboard only</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-base font-medium mb-3 block">Alert Frequency</Label>
                  <RadioGroup 
                    value={onboardingData.preferences.alertFrequency}
                    onValueChange={(value) => updateOnboardingData('preferences', { alertFrequency: value })}
                    className="grid grid-cols-3 gap-3"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="immediate" id="freq-immediate" />
                      <Label htmlFor="freq-immediate" className="flex-1 cursor-pointer text-sm">Immediate</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="weekly" id="freq-weekly" />
                      <Label htmlFor="freq-weekly" className="flex-1 cursor-pointer text-sm">Weekly</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-[var(--color-easyCo-gray-50)] transition-colors">
                      <RadioGroupItem value="monthly" id="freq-monthly" />
                      <Label htmlFor="freq-monthly" className="flex-1 cursor-pointer text-sm">Monthly</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  // Show onboarding if user hasn't completed it
  if (isOnboarding || !userProfile.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-[var(--color-easyCo-gray-50)]">
        {/* Onboarding Header */}
        <div className="bg-[var(--color-easyCo-purple)] px-6 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {onboardingStep > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevOnboardingStep}
                  className="text-white hover:bg-white/20 rounded-xl p-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              <h1 className="text-xl font-semibold text-white">Company Onboarding</h1>
            </div>
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-white hover:bg-white/20 rounded-xl p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-white text-sm">
              <span>Step {onboardingStep} of 6</span>
              <span>{Math.round((onboardingStep / 6) * 100)}% Complete</span>
            </div>
            <Progress 
              value={(onboardingStep / 6) * 100} 
              className="h-2 bg-white/20"
            />
            <p className="text-white/90 text-sm">You're almost done! Complete your profile to get personalized recommendations.</p>
          </div>
        </div>

        {/* Onboarding Content */}
        <div className="p-6">
          {renderOnboardingStep()}
          
          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {onboardingStep > 1 && (
              <Button
                variant="outline"
                onClick={prevOnboardingStep}
                className="flex-1 border-[var(--color-easyCo-gray-300)] rounded-2xl h-12"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            
            {onboardingStep < 6 ? (
              <Button
                onClick={nextOnboardingStep}
                className="flex-1 bg-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple-dark)] rounded-2xl h-12"
              >
                Next Step
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={completeOnboarding}
                className="flex-1 bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl h-12"
              >
                <Check className="w-4 h-4 mr-2" />
                Finish & Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-[var(--color-easyCo-purple)] px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-white hover:bg-white/20 rounded-xl p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <h1 className="text-xl font-semibold text-white">Profile & Settings</h1>
          </div>
          <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-xl">
                <Edit className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={editForm.occupation || ""}
                    onChange={(e) => setEditForm(prev => ({ ...prev, occupation: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => setIsEditingProfile(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} className="flex-1 bg-[var(--color-easyCo-purple)]">
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback className="text-lg">{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-[var(--color-easyCo-mustard)] rounded-full flex items-center justify-center">
              <Camera className="w-4 h-4 text-black" />
            </button>
          </div>
          
          <div className="flex-1 text-white">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{userProfile.name}</h2>
              {userProfile.verified && <Check className="w-5 h-5 text-[var(--color-easyCo-mustard)]" />}
            </div>
            <Badge className="bg-[var(--color-easyCo-mustard)] text-black text-xs mb-2">
              {getRoleDisplay(userProfile.role)}
            </Badge>
            <div className="space-y-1 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {userProfile.location}
              </div>
              {userProfile.occupation && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {userProfile.occupation}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Onboarding CTA Card */}
        {!userProfile.onboardingCompleted && (
          <Card className="rounded-3xl shadow-sm border-0 bg-gradient-to-r from-[var(--color-easyCo-purple-light)] to-[var(--color-easyCo-mustard-light)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--color-easyCo-purple)] rounded-2xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[var(--color-easyCo-purple)] mb-1">Complete Your Company Profile</h3>
                  <p className="text-sm text-[var(--color-easyCo-gray-dark)] mb-3">
                    Get personalized recommendations and unlock all features by completing your company onboarding.
                  </p>
                  <Button
                    onClick={startOnboarding}
                    className="bg-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple-dark)] text-white rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Start Setup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Info */}
        <Card className="rounded-3xl shadow-sm border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-[var(--color-easyCo-purple)]">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-[var(--color-easyCo-gray-dark)]">{userProfile.email}</div>
                </div>
              </div>
              {userProfile.verified && <Check className="w-5 h-5 text-green-500" />}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-[var(--color-easyCo-gray-dark)]">{userProfile.phone}</div>
                </div>
              </div>
              {userProfile.verified && <Check className="w-5 h-5 text-green-500" />}
            </div>
          </CardContent>
        </Card>

        {/* Company Summary (if onboarding completed) */}
        {userProfile.onboardingCompleted && (
          <Card className="rounded-3xl shadow-sm border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-[var(--color-easyCo-purple)]">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5" />
                  Company Profile
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startOnboarding}
                  className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)]"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Factory className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                  <div>
                    <div className="font-medium">{onboardingData.companyBasics.companyName || "Company Name"}</div>
                    <div className="text-sm text-[var(--color-easyCo-gray-dark)]">{onboardingData.companyBasics.industry || "Industry"}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-[var(--color-easyCo-gray-dark)]">
                      {onboardingData.companyBasics.city && onboardingData.companyBasics.province
                        ? `${onboardingData.companyBasics.city}, ${onboardingData.companyBasics.province}`
                        : "Location not specified"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                  <div>
                    <div className="font-medium">Team Size</div>
                    <div className="text-sm text-[var(--color-easyCo-gray-dark)]">{onboardingData.companyStructure.employeeCount || "Not specified"} employees</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                  <div>
                    <div className="font-medium">Company Status</div>
                    <div className="text-sm text-[var(--color-easyCo-gray-dark)]">{onboardingData.companyStructure.companyStatus?.toUpperCase() || "Not specified"}</div>
                  </div>
                </div>
              </div>
              
              {/* Active Goals */}
              {Object.values(onboardingData.goals).some(Boolean) && (
                <div className="mt-6">
                  <Label className="text-sm font-medium text-[var(--color-easyCo-gray-dark)] mb-3 block">Active Priorities</Label>
                  <div className="flex flex-wrap gap-2">
                    {onboardingData.goals.growth && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Growth
                      </Badge>
                    )}
                    {onboardingData.goals.innovation && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        <Lightbulb className="w-3 h-3 mr-1" />
                        Innovation
                      </Badge>
                    )}
                    {onboardingData.goals.efficiency && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        <Zap className="w-3 h-3 mr-1" />
                        Efficiency
                      </Badge>
                    )}
                    {onboardingData.goals.sustainability && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        <Leaf className="w-3 h-3 mr-1" />
                        Sustainability
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Preferences */}
        <Card className="rounded-3xl shadow-sm border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-[var(--color-easyCo-purple)]">
              <Settings className="w-5 h-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                <Label className="font-medium">Language</Label>
              </div>
              <Select value={preferences.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="nl">Nederlands</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Notifications */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                <Label className="font-medium">Notifications</Label>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-[var(--color-easyCo-gray-dark)]">Get notified about important updates</div>
                  </div>
                  <Switch 
                    checked={preferences.notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-[var(--color-easyCo-gray-dark)]">Receive updates via email</div>
                  </div>
                  <Switch 
                    checked={preferences.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-[var(--color-easyCo-gray-dark)]">Important alerts via SMS</div>
                  </div>
                  <Switch 
                    checked={preferences.notifications.sms}
                    onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Marketing Communications</div>
                    <div className="text-sm text-[var(--color-easyCo-gray-dark)]">Tips, offers, and news</div>
                  </div>
                  <Switch 
                    checked={preferences.notifications.marketing}
                    onCheckedChange={(checked) => handleNotificationChange("marketing", checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                <div>
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-sm text-[var(--color-easyCo-gray-dark)]">Toggle dark theme</div>
                </div>
              </div>
              <Switch 
                checked={preferences.darkMode}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, darkMode: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="rounded-3xl shadow-sm border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-[var(--color-easyCo-purple)]">
              <Shield className="w-5 h-5" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-between border-[var(--color-easyCo-gray-medium)] rounded-2xl h-auto p-4"
            >
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                <div className="text-left">
                  <div className="font-medium">Change Password</div>
                  <div className="text-sm text-[var(--color-easyCo-gray-dark)]">Update your account password</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
            </Button>

            <div className="flex items-center justify-between p-4 border border-[var(--color-easyCo-gray-medium)] rounded-2xl">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-[var(--color-easyCo-gray-dark)]">Add an extra layer of security</div>
                </div>
              </div>
              <Switch 
                checked={security.twoFactorEnabled}
                onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactorEnabled: checked }))}
              />
            </div>

            <Button 
              variant="outline" 
              className="w-full justify-between border-[var(--color-easyCo-gray-medium)] rounded-2xl h-auto p-4"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
                <div className="text-left">
                  <div className="font-medium">Connected Devices</div>
                  <div className="text-sm text-[var(--color-easyCo-gray-dark)]">{security.connectedDevices.length} devices connected</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
            </Button>
          </CardContent>
        </Card>

        {/* Legal & Support */}
        <Card className="rounded-3xl shadow-sm border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-[var(--color-easyCo-purple)]">
              <FileText className="w-5 h-5" />
              Legal & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-between text-left h-auto p-4 hover:bg-[var(--color-easyCo-gray-light)]"
            >
              <div>
                <div className="font-medium">GDPR Data Request</div>
                <div className="text-sm text-[var(--color-easyCo-gray-dark)]">Download or delete your data</div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
            </Button>

            <Button 
              variant="ghost" 
              className="w-full justify-between text-left h-auto p-4 hover:bg-[var(--color-easyCo-gray-light)]"
            >
              <div>
                <div className="font-medium">Terms of Service</div>
                <div className="text-sm text-[var(--color-easyCo-gray-dark)]">Read our terms and conditions</div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
            </Button>

            <Button 
              variant="ghost" 
              className="w-full justify-between text-left h-auto p-4 hover:bg-[var(--color-easyCo-gray-light)]"
            >
              <div>
                <div className="font-medium">Privacy Policy</div>
                <div className="text-sm text-[var(--color-easyCo-gray-dark)]">How we protect your information</div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
            </Button>

            <Button 
              variant="ghost" 
              className="w-full justify-between text-left h-auto p-4 hover:bg-[var(--color-easyCo-gray-light)]"
            >
              <div>
                <div className="font-medium">Contact Support</div>
                <div className="text-sm text-[var(--color-easyCo-gray-dark)]">Get help with your account</div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-easyCo-gray-dark)]" />
            </Button>
          </CardContent>
        </Card>

        {/* Demo Controls (for testing) */}
        <Card className="rounded-3xl shadow-sm border-0 bg-[var(--color-easyCo-gray-50)]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-[var(--color-easyCo-gray-600)] text-sm">
              <Settings className="w-4 h-4" />
              Demo Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Onboarding Status</div>
                <div className="text-xs text-[var(--color-easyCo-gray-dark)]">Toggle completion state</div>
              </div>
              <Switch 
                checked={userProfile.onboardingCompleted || false}
                onCheckedChange={(checked) => setUserProfile(prev => ({ ...prev, onboardingCompleted: checked }))}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={startOnboarding}
              className="w-full text-[var(--color-easyCo-purple)] border-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple-light)]"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Launch Onboarding Flow
            </Button>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card className="rounded-3xl shadow-sm border-0">
          <CardContent className="p-4">
            <Button 
              variant="ghost" 
              className="w-full text-red-600 hover:bg-red-50 rounded-2xl h-auto p-4"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center text-sm text-[var(--color-easyCo-gray-dark)] pb-8">
          EasyCo v2.1.0 • Made with ❤️ in Brussels
        </div>
      </div>
    </div>
  );
}