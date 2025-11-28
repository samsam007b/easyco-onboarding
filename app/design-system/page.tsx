'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Type,
  Square,
  Layers,
  ToggleLeft,
  BoxSelect,
  Sparkles,
  Moon,
  Sun,
  Check,
  X,
  ArrowRight,
  Home,
  Users,
  Euro,
  Heart,
  Star,
  MapPin,
  ChevronDown,
  AlertTriangle,
  Info,
  Zap,
  // Icons Section - All commonly used icons
  Image as ImageIcon,
  Search,
  Bell,
  Settings,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CreditCard,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  Upload,
  Share,
  Copy,
  Clipboard,
  ExternalLink,
  Link,
  Send,
  MessageCircle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Flag,
  Award,
  Target,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Activity,
  Wifi,
  WifiOff,
  Bluetooth,
  Battery,
  Volume2,
  VolumeX,
  Camera,
  Video,
  Mic,
  MicOff,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RefreshCw,
  RotateCcw,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  Move,
  Crosshair,
  Navigation,
  Compass,
  Map,
  Globe,
  Building,
  Building2,
  Store,
  ShoppingCart,
  ShoppingBag,
  Package,
  Gift,
  Truck,
  Plane,
  Car,
  Bike,
  Bus,
  Train,
  Coffee,
  Utensils,
  Wine,
  Beer,
  Cigarette,
  Pill,
  Thermometer,
  Droplet,
  Umbrella,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sunrise,
  Sunset,
  Moon as MoonIcon,
  Sun as SunIcon,
  Lightbulb,
  Flashlight,
  Flame,
  Snowflake,
  Wind,
  Waves,
  Leaf,
  TreeDeciduous,
  Flower2,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Footprints,
  Baby,
  Accessibility,
  Glasses,
  Watch,
  Shirt,
  Briefcase,
  GraduationCap,
  BookOpen,
  FileText,
  Folder,
  FolderOpen,
  Archive,
  Inbox,
  PenTool,
  Highlighter,
  Eraser,
  Scissors,
  Ruler,
  Palette as PaletteIcon,
  Pipette,
  Layers as LayersIcon,
  Grid,
  Layout,
  Columns,
  Rows,
  Table,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Terminal,
  Command,
  Hash,
  AtSign,
  Percent,
  DollarSign,
  Coins,
  Wallet,
  Receipt,
  Calculator,
  Scale,
  Gavel,
  Handshake,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Users as UsersIcon,
  Crown,
  Gem,
  Key,
  Fingerprint,
  Scan,
  QrCode,
  Barcode,
  Tag,
  Tags,
  Bookmark as BookmarkIcon,
  Heart as HeartIcon,
  Bed,
  Bath,
  Sofa,
  Tv,
  Radio,
  Speaker,
  Headphones,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Watch as WatchIcon,
  Printer,
  HardDrive,
  Cpu,
  MemoryStick,
  Server,
  Database,
  Cloud,
  CloudOff,
  Wifi as WifiIcon,
  Signal,
  Rss,
  Cast,
  Airplay,
  Gamepad2,
  Joystick,
  Puzzle,
  Dices,
  Trophy,
  Medal,
  PartyPopper,
  Cake,
  Sparkle,
  Wand2,
  CircleDot,
  CircleCheck,
  CircleX,
  CircleAlert,
  CircleHelp,
  TriangleAlert,
  OctagonAlert,
  Ban,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  LockOpen,
  Unlock,
  KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Section =
  | 'colors'
  | 'typography'
  | 'icons'
  | 'buttons'
  | 'cards'
  | 'shadows'
  | 'inputs'
  | 'badges'
  | 'choices';

const sections: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'colors', label: 'Couleurs', icon: Palette },
  { id: 'typography', label: 'Typographie', icon: Type },
  { id: 'icons', label: 'Icônes & Logo', icon: ImageIcon },
  { id: 'buttons', label: 'Boutons', icon: Square },
  { id: 'cards', label: 'Cartes', icon: Layers },
  { id: 'shadows', label: 'Ombres & Effets', icon: Moon },
  { id: 'inputs', label: 'Formulaires', icon: ToggleLeft },
  { id: 'badges', label: 'Badges', icon: BoxSelect },
  { id: 'choices', label: 'V1 vs V2', icon: Sparkles },
];

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState<Section>('colors');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-orange-500 to-yellow-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EasyCo Design System</h1>
              <p className="text-sm text-gray-500">Documentation visuelle des composants</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 shrink-0 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto border-r border-gray-200 bg-white p-4">
          <ul className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <Icon className={cn('w-5 h-5', isActive ? 'text-purple-500' : 'text-gray-400')} />
                    {section.label}
                    {section.id === 'choices' && (
                      <Badge className="ml-auto bg-orange-500 text-white border-0 text-xs">Important</Badge>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'colors' && <ColorsSection />}
              {activeSection === 'typography' && <TypographySection />}
              {activeSection === 'icons' && <IconsSection />}
              {activeSection === 'buttons' && <ButtonsSection />}
              {activeSection === 'cards' && <CardsSection />}
              {activeSection === 'shadows' && <ShadowsSection />}
              {activeSection === 'inputs' && <InputsSection />}
              {activeSection === 'badges' && <BadgesSection />}
              {activeSection === 'choices' && <ChoicesSection />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ============================================
   COLORS SECTION
   ============================================ */

// Définition des couleurs en dur pour l'affichage
const searcherColors: Record<number, string> = {
  50: '#FFFEF0', 100: '#FFF9E6', 200: '#FFF59D', 300: '#FFEB3B',
  400: '#FFD249', 500: '#FFC107', 600: '#F9A825', 700: '#F57F17',
  800: '#E65100', 900: '#BF360C'
};
const ownerColors: Record<number, string> = {
  50: '#F9F8FF', 100: '#F3F1FF', 200: '#E0D9FF', 300: '#BAB2E3',
  400: '#8E7AD6', 500: '#6E56CF', 600: '#5B45B8', 700: '#4A148C',
  800: '#38006B', 900: '#1A0033'
};
const residentColors: Record<number, string> = {
  50: '#FFFAF8', 100: '#FFF3EF', 200: '#FFB88C', 300: '#FF8C5C',
  400: '#FF6F3C', 500: '#FF5722', 600: '#E64A19', 700: '#D84315',
  800: '#BF360C', 900: '#8D2A0E'
};

function ColorsSection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Couleurs</h2>
        <p className="text-gray-600">Palette de couleurs basée sur les 3 rôles EasyCo</p>
      </div>

      {/* Role Colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Searcher */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500" />
            <h3 className="text-xl font-bold text-gray-900">Searcher</h3>
            <Badge className="bg-yellow-500 text-white border-0">Jaune/Doré</Badge>
          </div>
          <div className="space-y-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="flex items-center gap-3">
                <div
                  className="w-16 h-10 rounded-lg shadow-sm border border-gray-100"
                  style={{ backgroundColor: searcherColors[shade] }}
                />
                <span className="text-sm font-mono text-gray-600">--searcher-{shade}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Owner */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
            <h3 className="text-xl font-bold text-gray-900">Owner</h3>
            <Badge className="bg-purple-600 text-white border-0">Mauve</Badge>
          </div>
          <div className="space-y-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="flex items-center gap-3">
                <div
                  className="w-16 h-10 rounded-lg shadow-sm border border-gray-100"
                  style={{ backgroundColor: ownerColors[shade] }}
                />
                <span className="text-sm font-mono text-gray-600">--owner-{shade}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resident */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500" />
            <h3 className="text-xl font-bold text-gray-900">Resident</h3>
            <Badge className="bg-orange-500 text-white border-0">Orange</Badge>
          </div>
          <div className="space-y-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="flex items-center gap-3">
                <div
                  className="w-16 h-10 rounded-lg shadow-sm border border-gray-100"
                  style={{ backgroundColor: residentColors[shade] }}
                />
                <span className="text-sm font-mono text-gray-600">--resident-{shade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradients */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Gradients</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-600 via-orange-500 to-yellow-400">
            <p className="text-white font-bold text-lg">Gradient Brand</p>
            <p className="text-white/80 text-sm font-mono">--gradient-brand</p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400">
            <p className="text-white font-bold text-lg">Gradient Searcher</p>
            <p className="text-white/80 text-sm font-mono">--gradient-searcher</p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-400 to-pink-400">
            <p className="text-white font-bold text-lg">Gradient Owner</p>
            <p className="text-white/80 text-sm font-mono">--gradient-owner</p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400">
            <p className="text-white font-bold text-lg">Gradient Resident</p>
            <p className="text-white/80 text-sm font-mono">--gradient-resident</p>
          </div>
        </div>
      </div>

      {/* Semantic Colors */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Couleurs Sémantiques</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-500 rounded-xl text-white">
            <p className="font-bold">Success</p>
            <p className="text-sm opacity-80">#10B981</p>
          </div>
          <div className="p-4 bg-red-500 rounded-xl text-white">
            <p className="font-bold">Error</p>
            <p className="text-sm opacity-80">#EF4444</p>
          </div>
          <div className="p-4 bg-yellow-500 rounded-xl text-white">
            <p className="font-bold">Warning</p>
            <p className="text-sm opacity-80">#F59E0B</p>
          </div>
          <div className="p-4 bg-blue-500 rounded-xl text-white">
            <p className="font-bold">Info</p>
            <p className="text-sm opacity-80">#3B82F6</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   TYPOGRAPHY SECTION
   ============================================ */
function TypographySection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Typographie</h2>
        <p className="text-gray-600">Famille de police: Inter</p>
      </div>

      {/* Font Sizes */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Tailles</h3>
        <div className="space-y-4 bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-baseline gap-4 border-b border-gray-100 pb-4">
            <span className="text-xs text-gray-500 w-20">text-xs</span>
            <span className="text-xs">The quick brown fox (12px)</span>
          </div>
          <div className="flex items-baseline gap-4 border-b border-gray-100 pb-4">
            <span className="text-xs text-gray-500 w-20">text-sm</span>
            <span className="text-sm">The quick brown fox (14px)</span>
          </div>
          <div className="flex items-baseline gap-4 border-b border-gray-100 pb-4">
            <span className="text-xs text-gray-500 w-20">text-base</span>
            <span className="text-base">The quick brown fox (16px)</span>
          </div>
          <div className="flex items-baseline gap-4 border-b border-gray-100 pb-4">
            <span className="text-xs text-gray-500 w-20">text-lg</span>
            <span className="text-lg">The quick brown fox (18px)</span>
          </div>
          <div className="flex items-baseline gap-4 border-b border-gray-100 pb-4">
            <span className="text-xs text-gray-500 w-20">text-xl</span>
            <span className="text-xl">The quick brown fox (20px)</span>
          </div>
          <div className="flex items-baseline gap-4 border-b border-gray-100 pb-4">
            <span className="text-xs text-gray-500 w-20">text-2xl</span>
            <span className="text-2xl">The quick brown fox (24px)</span>
          </div>
          <div className="flex items-baseline gap-4 border-b border-gray-100 pb-4">
            <span className="text-xs text-gray-500 w-20">text-3xl</span>
            <span className="text-3xl">The quick brown fox (30px)</span>
          </div>
          <div className="flex items-baseline gap-4 border-b border-gray-100 pb-4">
            <span className="text-xs text-gray-500 w-20">text-4xl</span>
            <span className="text-4xl">The quick brown fox (36px)</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-gray-500 w-20">text-5xl</span>
            <span className="text-5xl">The quick brown fox (48px)</span>
          </div>
        </div>
      </div>

      {/* Font Weights */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Graisses</h3>
        <div className="space-y-4 bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 w-24">font-normal</span>
            <span className="text-2xl font-normal">Exemple de texte (400)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 w-24">font-medium</span>
            <span className="text-2xl font-medium">Exemple de texte (500)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 w-24">font-semibold</span>
            <span className="text-2xl font-semibold">Exemple de texte (600)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 w-24">font-bold</span>
            <span className="text-2xl font-bold">Exemple de texte (700)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   ICONS SECTION
   ============================================ */

// Groupes d'icônes organisés par catégorie
const iconGroups = {
  'Navigation': [
    { icon: Home, name: 'Home' },
    { icon: Search, name: 'Search' },
    { icon: Menu, name: 'Menu' },
    { icon: ChevronLeft, name: 'ChevronLeft' },
    { icon: ChevronRight, name: 'ChevronRight' },
    { icon: ChevronUp, name: 'ChevronUp' },
    { icon: ChevronDown, name: 'ChevronDown' },
    { icon: ArrowRight, name: 'ArrowRight' },
    { icon: ExternalLink, name: 'ExternalLink' },
    { icon: MoreHorizontal, name: 'MoreHorizontal' },
    { icon: MoreVertical, name: 'MoreVertical' },
  ],
  'Utilisateurs': [
    { icon: User, name: 'User' },
    { icon: Users, name: 'Users' },
    { icon: UserPlus, name: 'UserPlus' },
    { icon: UserMinus, name: 'UserMinus' },
    { icon: UserCheck, name: 'UserCheck' },
    { icon: UserX, name: 'UserX' },
    { icon: Crown, name: 'Crown' },
    { icon: Baby, name: 'Baby' },
    { icon: Accessibility, name: 'Accessibility' },
  ],
  'Communication': [
    { icon: Mail, name: 'Mail' },
    { icon: Phone, name: 'Phone' },
    { icon: MessageCircle, name: 'MessageCircle' },
    { icon: MessageSquare, name: 'MessageSquare' },
    { icon: Send, name: 'Send' },
    { icon: Bell, name: 'Bell' },
    { icon: Share, name: 'Share' },
    { icon: Inbox, name: 'Inbox' },
  ],
  'Actions': [
    { icon: Plus, name: 'Plus' },
    { icon: Minus, name: 'Minus' },
    { icon: X, name: 'X' },
    { icon: Check, name: 'Check' },
    { icon: Edit, name: 'Edit' },
    { icon: Trash2, name: 'Trash2' },
    { icon: Copy, name: 'Copy' },
    { icon: Download, name: 'Download' },
    { icon: Upload, name: 'Upload' },
    { icon: RefreshCw, name: 'RefreshCw' },
    { icon: Filter, name: 'Filter' },
    { icon: SortAsc, name: 'SortAsc' },
  ],
  'Immobilier & Logement': [
    { icon: Building, name: 'Building' },
    { icon: Building2, name: 'Building2' },
    { icon: Home, name: 'Home' },
    { icon: Bed, name: 'Bed' },
    { icon: Bath, name: 'Bath' },
    { icon: Sofa, name: 'Sofa' },
    { icon: Key, name: 'Key' },
    { icon: KeyRound, name: 'KeyRound' },
    { icon: Lock, name: 'Lock' },
    { icon: Unlock, name: 'Unlock' },
  ],
  'Localisation': [
    { icon: MapPin, name: 'MapPin' },
    { icon: Map, name: 'Map' },
    { icon: Navigation, name: 'Navigation' },
    { icon: Compass, name: 'Compass' },
    { icon: Globe, name: 'Globe' },
    { icon: Crosshair, name: 'Crosshair' },
  ],
  'Finances': [
    { icon: Euro, name: 'Euro' },
    { icon: DollarSign, name: 'DollarSign' },
    { icon: CreditCard, name: 'CreditCard' },
    { icon: Wallet, name: 'Wallet' },
    { icon: Coins, name: 'Coins' },
    { icon: Receipt, name: 'Receipt' },
    { icon: Calculator, name: 'Calculator' },
    { icon: TrendingUp, name: 'TrendingUp' },
    { icon: TrendingDown, name: 'TrendingDown' },
    { icon: BarChart, name: 'BarChart' },
    { icon: PieChart, name: 'PieChart' },
  ],
  'Temps & Calendrier': [
    { icon: Calendar, name: 'Calendar' },
    { icon: Clock, name: 'Clock' },
    { icon: Sunrise, name: 'Sunrise' },
    { icon: Sunset, name: 'Sunset' },
    { icon: MoonIcon, name: 'Moon' },
    { icon: SunIcon, name: 'Sun' },
  ],
  'Social & Feedback': [
    { icon: Heart, name: 'Heart' },
    { icon: Star, name: 'Star' },
    { icon: ThumbsUp, name: 'ThumbsUp' },
    { icon: ThumbsDown, name: 'ThumbsDown' },
    { icon: Bookmark, name: 'Bookmark' },
    { icon: Flag, name: 'Flag' },
    { icon: Award, name: 'Award' },
    { icon: Trophy, name: 'Trophy' },
    { icon: Medal, name: 'Medal' },
    { icon: PartyPopper, name: 'PartyPopper' },
    { icon: Sparkles, name: 'Sparkles' },
  ],
  'Sécurité': [
    { icon: Shield, name: 'Shield' },
    { icon: ShieldCheck, name: 'ShieldCheck' },
    { icon: ShieldAlert, name: 'ShieldAlert' },
    { icon: Lock, name: 'Lock' },
    { icon: LockOpen, name: 'LockOpen' },
    { icon: Eye, name: 'Eye' },
    { icon: EyeOff, name: 'EyeOff' },
    { icon: Fingerprint, name: 'Fingerprint' },
    { icon: Scan, name: 'Scan' },
  ],
  'Statuts & Alertes': [
    { icon: CircleCheck, name: 'CircleCheck' },
    { icon: CircleX, name: 'CircleX' },
    { icon: CircleAlert, name: 'CircleAlert' },
    { icon: CircleHelp, name: 'CircleHelp' },
    { icon: AlertTriangle, name: 'AlertTriangle' },
    { icon: Info, name: 'Info' },
    { icon: Ban, name: 'Ban' },
    { icon: Zap, name: 'Zap' },
    { icon: Activity, name: 'Activity' },
  ],
  'Mode de vie': [
    { icon: Coffee, name: 'Coffee' },
    { icon: Utensils, name: 'Utensils' },
    { icon: Wine, name: 'Wine' },
    { icon: Cigarette, name: 'Cigarette' },
    { icon: Dog, name: 'Dog' },
    { icon: Cat, name: 'Cat' },
    { icon: Leaf, name: 'Leaf' },
    { icon: TreeDeciduous, name: 'TreeDeciduous' },
    { icon: Bike, name: 'Bike' },
    { icon: Car, name: 'Car' },
  ],
  'Travail & Éducation': [
    { icon: Briefcase, name: 'Briefcase' },
    { icon: GraduationCap, name: 'GraduationCap' },
    { icon: BookOpen, name: 'BookOpen' },
    { icon: FileText, name: 'FileText' },
    { icon: Folder, name: 'Folder' },
    { icon: Clipboard, name: 'Clipboard' },
    { icon: PenTool, name: 'PenTool' },
    { icon: Lightbulb, name: 'Lightbulb' },
    { icon: Target, name: 'Target' },
    { icon: Handshake, name: 'Handshake' },
  ],
  'Tech & Médias': [
    { icon: Wifi, name: 'Wifi' },
    { icon: Smartphone, name: 'Smartphone' },
    { icon: Laptop, name: 'Laptop' },
    { icon: Monitor, name: 'Monitor' },
    { icon: Camera, name: 'Camera' },
    { icon: Video, name: 'Video' },
    { icon: ImageIcon, name: 'Image' },
    { icon: Tv, name: 'Tv' },
    { icon: Headphones, name: 'Headphones' },
    { icon: Settings, name: 'Settings' },
  ],
};

function IconsSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Object.keys(iconGroups);

  const filteredGroups = Object.entries(iconGroups).reduce((acc, [category, icons]) => {
    if (selectedCategory && category !== selectedCategory) return acc;

    const filtered = icons.filter(icon =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof iconGroups[keyof typeof iconGroups]>);

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Icônes & Logo</h2>
        <p className="text-gray-600">Bibliothèque Lucide React et logos EasyCo</p>
      </div>

      {/* Logo EasyCo */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Logo EasyCo</h3>
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo SVG */}
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gray-50 rounded-xl p-6 w-full flex items-center justify-center">
                <img
                  src="/logos/easyco-logo.svg"
                  alt="EasyCo Logo SVG"
                  className="h-16"
                />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">Logo Principal</p>
                <p className="text-xs text-gray-500 font-mono">/logos/easyco-logo.svg</p>
              </div>
            </div>

            {/* Icon only */}
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gray-50 rounded-xl p-6 w-full flex items-center justify-center">
                <img
                  src="/logos/easyco-icon-300.png"
                  alt="EasyCo Icon"
                  className="h-16 w-16"
                />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">Icône seule</p>
                <p className="text-xs text-gray-500 font-mono">/logos/easyco-icon-300.png</p>
              </div>
            </div>

            {/* Logo on dark */}
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gray-900 rounded-xl p-6 w-full flex items-center justify-center">
                <img
                  src="/logos/easyco-logo.svg"
                  alt="EasyCo Logo on dark"
                  className="h-16"
                />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">Sur fond sombre</p>
                <p className="text-xs text-gray-500">Même fichier SVG</p>
              </div>
            </div>
          </div>

          {/* Tailles disponibles */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-4">Tailles disponibles :</p>
            <div className="flex flex-wrap items-end gap-6">
              <div className="flex flex-col items-center gap-2">
                <img src="/logos/easyco-icon-300.png" alt="300px" className="h-8 w-8" />
                <span className="text-xs text-gray-500">300px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img src="/logos/easyco-icon-600.png" alt="600px" className="h-12 w-12" />
                <span className="text-xs text-gray-500">600px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img src="/logos/easyco-icon-1200.png" alt="1200px" className="h-16 w-16" />
                <span className="text-xs text-gray-500">1200px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favicon et App Icons */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Favicon & App Icons</h3>
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex flex-col items-center gap-2">
              <img src="/favicon.png" alt="Favicon" className="h-8 w-8" />
              <span className="text-xs text-gray-500">favicon.png</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src="/apple-touch-icon.png" alt="Apple Touch" className="h-12 w-12 rounded-xl" />
              <span className="text-xs text-gray-500">apple-touch-icon</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src="/icons/icon-192x192.png" alt="PWA 192" className="h-12 w-12 rounded-xl" />
              <span className="text-xs text-gray-500">PWA 192x192</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src="/icons/icon-512x512.png" alt="PWA 512" className="h-16 w-16 rounded-xl" />
              <span className="text-xs text-gray-500">PWA 512x512</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Bibliothèque d'icônes (Lucide)</h3>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une icône..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                !selectedCategory
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              Toutes
            </button>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grille d'icônes par catégorie */}
      {Object.entries(filteredGroups).map(([category, icons]) => (
        <div key={category} className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">{category}</h4>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {icons.map(({ icon: IconComponent, name }) => (
                <div
                  key={name}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  title={name}
                >
                  <IconComponent className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors" />
                  <span className="text-[10px] text-gray-400 group-hover:text-gray-600 text-center truncate w-full">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Tailles d'icônes */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Tailles recommandées</h3>
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-end gap-8">
            <div className="flex flex-col items-center gap-2">
              <Home className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-500">16px (w-4)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Home className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-500">20px (w-5)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Home className="w-6 h-6 text-gray-600" />
              <span className="text-xs text-gray-500">24px (w-6)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Home className="w-8 h-8 text-gray-600" />
              <span className="text-xs text-gray-500">32px (w-8)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Home className="w-10 h-10 text-gray-600" />
              <span className="text-xs text-gray-500">40px (w-10)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Home className="w-12 h-12 text-gray-600" />
              <span className="text-xs text-gray-500">48px (w-12)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Couleurs d'icônes */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Couleurs d'icônes</h3>
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col items-center gap-2">
              <Heart className="w-8 h-8 text-gray-400" />
              <span className="text-xs text-gray-500">gray-400</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Heart className="w-8 h-8 text-gray-600" />
              <span className="text-xs text-gray-500">gray-600</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Heart className="w-8 h-8 text-gray-900" />
              <span className="text-xs text-gray-500">gray-900</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Heart className="w-8 h-8 text-purple-600" />
              <span className="text-xs text-gray-500">purple-600</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Heart className="w-8 h-8 text-orange-500" />
              <span className="text-xs text-gray-500">orange-500</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Heart className="w-8 h-8 text-yellow-500" />
              <span className="text-xs text-gray-500">yellow-500</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Heart className="w-8 h-8 text-green-500" />
              <span className="text-xs text-gray-500">green-500</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Heart className="w-8 h-8 text-red-500" />
              <span className="text-xs text-gray-500">red-500</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Heart className="w-8 h-8 text-blue-500" />
              <span className="text-xs text-gray-500">blue-500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   BUTTONS SECTION
   ============================================ */
function ButtonsSection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Boutons</h2>
        <p className="text-gray-600">Variantes et tailles disponibles</p>
      </div>

      {/* Variants */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Variantes</h3>
        <div className="flex flex-wrap gap-4 bg-white rounded-2xl p-6 border border-gray-200">
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Tailles</h3>
        <div className="flex flex-wrap items-center gap-4 bg-white rounded-2xl p-6 border border-gray-200">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Heart className="w-5 h-5" /></Button>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Avec icônes</h3>
        <div className="flex flex-wrap gap-4 bg-white rounded-2xl p-6 border border-gray-200">
          <Button>
            <Heart className="w-4 h-4 mr-2" />
            J'aime
          </Button>
          <Button variant="outline">
            Continuer
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* States */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">États</h3>
        <div className="flex flex-wrap gap-4 bg-white rounded-2xl p-6 border border-gray-200">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   CARDS SECTION
   ============================================ */
function CardsSection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Cartes</h2>
        <p className="text-gray-600">Différentes variantes de cartes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Default */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-3">Default</p>
          <Card>
            <CardHeader>
              <CardTitle>Titre de carte</CardTitle>
              <CardDescription>Description courte ici</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Contenu de la carte avec du texte explicatif.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Bordered */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-3">Bordered</p>
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Titre de carte</CardTitle>
              <CardDescription>Description courte ici</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Contenu de la carte avec du texte explicatif.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Elevated */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-3">Elevated</p>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Titre de carte</CardTitle>
              <CardDescription>Description courte ici</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Contenu de la carte avec du texte explicatif.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Interactive */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Interactive</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card interactive>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Home className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Carte interactive</h4>
                <p className="text-sm text-gray-500">Hover pour voir l'effet</p>
              </div>
            </CardContent>
          </Card>
          <Card interactive>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Carte interactive</h4>
                <p className="text-sm text-gray-500">Hover pour voir l'effet</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   SHADOWS SECTION
   ============================================ */
function ShadowsSection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Ombres & Effets</h2>
        <p className="text-gray-600">Niveaux d'élévation et effets visuels</p>
      </div>

      {/* Shadows */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Ombres</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'].map((shadow) => (
            <div key={shadow} className={`bg-white rounded-2xl p-6 ${shadow}`}>
              <p className="font-mono text-sm text-gray-600">{shadow}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Border Radius</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { class: 'rounded-lg', label: '12px' },
            { class: 'rounded-xl', label: '16px' },
            { class: 'rounded-2xl', label: '24px' },
            { class: 'rounded-3xl', label: '32px' },
            { class: 'rounded-full', label: 'full' },
          ].map((radius) => (
            <div key={radius.class} className={`bg-owner-100 ${radius.class} p-6 flex flex-col items-center justify-center`}>
              <p className="font-mono text-xs text-gray-600">{radius.class}</p>
              <p className="text-xs text-gray-400">{radius.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Glassmorphism */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Glassmorphism</h3>
        <div className="relative h-64 rounded-2xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-purple-500 to-yellow-400" />

          {/* Animated blobs */}
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-300/50 rounded-full blur-2xl" />

          {/* Glass card */}
          <div className="absolute inset-8 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-6 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-2xl font-bold mb-2">Glassmorphism</p>
              <p className="text-sm opacity-80">backdrop-blur-xl + bg-white/20</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   INPUTS SECTION
   ============================================ */
function InputsSection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Formulaires</h2>
        <p className="text-gray-600">Champs de saisie et éléments de formulaire</p>
      </div>

      {/* Inputs */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Inputs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl p-6 border border-gray-200">
          <Input label="Label standard" placeholder="Placeholder text" />
          <Input label="Avec icône" placeholder="Rechercher..." leftIcon={<MapPin className="w-5 h-5" />} />
          <Input label="Avec erreur" placeholder="Email" error="Cette adresse email est invalide" />
          <Input label="Avec aide" placeholder="Mot de passe" helperText="Minimum 8 caractères" type="password" />
          <Input label="Requis" placeholder="Champ obligatoire" required />
          <Input label="Désactivé" placeholder="Non modifiable" disabled />
        </div>
      </div>
    </div>
  );
}

/* ============================================
   BADGES SECTION
   ============================================ */
function BadgesSection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Badges</h2>
        <p className="text-gray-600">Tags et indicateurs visuels</p>
      </div>

      {/* Variants */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Variantes</h3>
        <div className="flex flex-wrap gap-3 bg-white rounded-2xl p-6 border border-gray-200">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Tailles</h3>
        <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl p-6 border border-gray-200">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Avec icônes</h3>
        <div className="flex flex-wrap gap-3 bg-white rounded-2xl p-6 border border-gray-200">
          <Badge variant="success" icon={<Check className="w-3 h-3" />}>Vérifié</Badge>
          <Badge variant="warning" icon={<AlertTriangle className="w-3 h-3" />}>Attention</Badge>
          <Badge variant="info" icon={<Info className="w-3 h-3" />}>Information</Badge>
          <Badge variant="error" icon={<X className="w-3 h-3" />}>Erreur</Badge>
        </div>
      </div>

      {/* Dismissible */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Fermables</h3>
        <div className="flex flex-wrap gap-3 bg-white rounded-2xl p-6 border border-gray-200">
          <Badge dismissible onDismiss={() => {}}>Tag fermable</Badge>
          <Badge variant="primary" dismissible onDismiss={() => {}}>Filtre actif</Badge>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   CHOICES SECTION - V1 vs V2
   ============================================ */
function ChoicesSection() {
  const [selectedChoices, setSelectedChoices] = useState<Record<string, 'v1' | 'v2'>>({});

  const toggleChoice = (id: string, version: 'v1' | 'v2') => {
    setSelectedChoices(prev => ({ ...prev, [id]: version }));
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">V1 vs V2 : Les choix à faire</h2>
        <p className="text-gray-600">Compare les deux directions de design et choisis ta préférence</p>
      </div>

      {/* Choice 1: Cards Style */}
      <ChoiceComparison
        id="cards"
        title="Style de cartes"
        description="Flat minimaliste vs Glassmorphism premium"
        v1={{
          label: "V1 - Flat",
          description: "Simple, épuré, professionnel",
          render: (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Home className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Appartement Paris 11</h4>
                  <p className="text-sm text-gray-500">850€/mois · 3 chambres</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="default">Meublé</Badge>
                <Badge variant="default">WiFi</Badge>
              </div>
            </div>
          )
        }}
        v2={{
          label: "V2 - Glassmorphism",
          description: "Moderne, premium, immersif",
          render: (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-purple-50 to-yellow-100">
                <div className="absolute top-0 left-1/4 w-20 h-20 bg-orange-300/60 rounded-full blur-2xl" />
                <div className="absolute bottom-0 right-1/3 w-24 h-24 bg-purple-300/50 rounded-full blur-2xl" />
              </div>
              {/* Glass layer */}
              <div className="relative bg-white/60 backdrop-blur-xl p-6 border border-white/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Appartement Paris 11</h4>
                    <p className="text-sm text-gray-600">850€/mois · 3 chambres</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0">Meublé</Badge>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">WiFi</Badge>
                </div>
              </div>
            </div>
          )
        }}
        selectedVersion={selectedChoices['cards']}
        onSelect={(v) => toggleChoice('cards', v)}
      />

      {/* Choice 2: Buttons Style */}
      <ChoiceComparison
        id="buttons"
        title="Style de boutons"
        description="Solid classique vs Gradient vibrant"
        v1={{
          label: "V1 - Solid",
          description: "Couleur unie, sobre",
          render: (
            <div className="flex gap-4 items-center justify-center p-6 bg-gray-50 rounded-xl">
              <button className="px-6 py-3 bg-owner-600 text-white rounded-full font-medium hover:bg-owner-700 transition-colors">
                Bouton primaire
              </button>
              <button className="px-6 py-3 border-2 border-owner-500 text-owner-600 rounded-full font-medium hover:bg-owner-50 transition-colors">
                Secondaire
              </button>
            </div>
          )
        }}
        v2={{
          label: "V2 - Gradient",
          description: "Dégradé, dynamique",
          render: (
            <div className="flex gap-4 items-center justify-center p-6 bg-gray-50 rounded-xl">
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                Bouton primaire
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                Secondaire
              </button>
            </div>
          )
        }}
        selectedVersion={selectedChoices['buttons']}
        onSelect={(v) => toggleChoice('buttons', v)}
      />

      {/* Choice 3: Shadows */}
      <ChoiceComparison
        id="shadows"
        title="Intensité des ombres"
        description="Subtile vs Prononcée"
        v1={{
          label: "V1 - Légère",
          description: "shadow-sm à shadow-md",
          render: (
            <div className="flex gap-6 items-center justify-center p-8 bg-gray-100 rounded-xl">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="font-medium text-gray-700">Carte légère</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <p className="font-medium text-gray-700">Carte medium</p>
              </div>
            </div>
          )
        }}
        v2={{
          label: "V2 - Marquée",
          description: "shadow-lg à shadow-2xl",
          render: (
            <div className="flex gap-6 items-center justify-center p-8 bg-gray-100 rounded-xl">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <p className="font-medium text-gray-700">Carte élevée</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <p className="font-medium text-gray-700">Carte très élevée</p>
              </div>
            </div>
          )
        }}
        selectedVersion={selectedChoices['shadows']}
        onSelect={(v) => toggleChoice('shadows', v)}
      />

      {/* Choice 4: Badges */}
      <ChoiceComparison
        id="badges"
        title="Style de badges"
        description="Discret vs Coloré"
        v1={{
          label: "V1 - Discret",
          description: "Fond léger, bordure subtile",
          render: (
            <div className="flex flex-wrap gap-3 items-center justify-center p-6 bg-gray-50 rounded-xl">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-200">
                Meublé
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
                Disponible
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
                Vérifié
              </span>
            </div>
          )
        }}
        v2={{
          label: "V2 - Vibrant",
          description: "Couleurs vives, gradients",
          render: (
            <div className="flex flex-wrap gap-3 items-center justify-center p-6 bg-gray-50 rounded-xl">
              <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-full text-sm font-medium shadow-md">
                Meublé
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-sm font-medium shadow-md">
                Disponible
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-full text-sm font-medium shadow-md">
                Vérifié
              </span>
            </div>
          )
        }}
        selectedVersion={selectedChoices['badges']}
        onSelect={(v) => toggleChoice('badges', v)}
      />

      {/* Choice 5: Background Effects */}
      <ChoiceComparison
        id="backgrounds"
        title="Effets de fond"
        description="Statique vs Animé/Dynamique"
        v1={{
          label: "V1 - Statique",
          description: "Couleur unie ou dégradé simple",
          render: (
            <div className="h-32 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Fond simple et calme</p>
            </div>
          )
        }}
        v2={{
          label: "V2 - Dynamique",
          description: "Blobs animés, effets blur",
          render: (
            <div className="relative h-32 rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 via-purple-50 to-yellow-50">
              <motion.div
                className="absolute top-0 left-1/4 w-16 h-16 bg-orange-300/60 rounded-full blur-2xl"
                animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 right-1/3 w-20 h-20 bg-purple-300/50 rounded-full blur-2xl"
                animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative z-10 h-full flex items-center justify-center">
                <p className="text-gray-600 font-medium">Fond vivant et premium</p>
              </div>
            </div>
          )
        }}
        selectedVersion={selectedChoices['backgrounds']}
        onSelect={(v) => toggleChoice('backgrounds', v)}
      />

      {/* Summary */}
      <div className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-2xl p-8 border border-purple-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-500" />
          Résumé de tes choix
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['cards', 'buttons', 'shadows', 'badges', 'backgrounds'].map((key) => (
            <div key={key} className="bg-white rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500 mb-1 capitalize">{key}</p>
              <p className="font-bold text-lg">
                {selectedChoices[key] ? selectedChoices[key].toUpperCase() : '—'}
              </p>
            </div>
          ))}
        </div>

        {Object.keys(selectedChoices).length > 0 && (
          <div className="mt-6 p-4 bg-white rounded-xl">
            <p className="text-sm text-gray-600">
              <strong>Tendance :</strong>{' '}
              {Object.values(selectedChoices).filter(v => v === 'v1').length > Object.values(selectedChoices).filter(v => v === 'v2').length
                ? '📋 Tu penches vers un design Flat/Minimaliste'
                : Object.values(selectedChoices).filter(v => v === 'v2').length > Object.values(selectedChoices).filter(v => v === 'v1').length
                ? '✨ Tu penches vers un design Glassmorphism/Premium'
                : '⚖️ Tu es entre les deux directions'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================
   CHOICE COMPARISON COMPONENT
   ============================================ */
interface ChoiceComparisonProps {
  id: string;
  title: string;
  description: string;
  v1: {
    label: string;
    description: string;
    render: React.ReactNode;
  };
  v2: {
    label: string;
    description: string;
    render: React.ReactNode;
  };
  selectedVersion?: 'v1' | 'v2';
  onSelect: (version: 'v1' | 'v2') => void;
}

function ChoiceComparison({ id, title, description, v1, v2, selectedVersion, onSelect }: ChoiceComparisonProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* V1 */}
        <div
          className={cn(
            "p-6 cursor-pointer transition-all border-r border-gray-100",
            selectedVersion === 'v1' ? 'bg-green-50 ring-2 ring-inset ring-green-500' : 'hover:bg-gray-50'
          )}
          onClick={() => onSelect('v1')}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-lg font-bold text-gray-900">{v1.label}</span>
              <p className="text-sm text-gray-500">{v1.description}</p>
            </div>
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
              selectedVersion === 'v1' ? 'bg-green-500 border-green-500' : 'border-gray-300'
            )}>
              {selectedVersion === 'v1' && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>
          <div className="mt-4">
            {v1.render}
          </div>
        </div>

        {/* V2 */}
        <div
          className={cn(
            "p-6 cursor-pointer transition-all",
            selectedVersion === 'v2' ? 'bg-green-50 ring-2 ring-inset ring-green-500' : 'hover:bg-gray-50'
          )}
          onClick={() => onSelect('v2')}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-lg font-bold text-gray-900">{v2.label}</span>
              <p className="text-sm text-gray-500">{v2.description}</p>
            </div>
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
              selectedVersion === 'v2' ? 'bg-green-500 border-green-500' : 'border-gray-300'
            )}>
              {selectedVersion === 'v2' && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>
          <div className="mt-4">
            {v2.render}
          </div>
        </div>
      </div>
    </div>
  );
}
