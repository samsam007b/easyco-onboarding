'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
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
  Loader2,
  CheckCircle,
  Save,
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
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Navigation,
  Compass,
  Map,
  Globe,
  Building,
  Building2,
  Package,
  Gift,
  Truck,
  Car,
  Coffee,
  Lightbulb,
  Briefcase,
  GraduationCap,
  BookOpen,
  FileText,
  Folder,
  Key,
  Fingerprint,
  Wifi,
  Smartphone,
  Laptop,
  Monitor,
  Camera,
  Video,
  Tv,
  Headphones,
  Bed,
  Bath,
  Sofa,
  Dog,
  Cat,
  Leaf,
  TreeDeciduous,
  Bike,
  Baby,
  Accessibility,
  Crown,
  LockOpen,
  KeyRound,
  CircleCheck,
  CircleX,
  CircleAlert,
  CircleHelp,
  Ban,
  ShieldCheck,
  ShieldAlert,
  Unlock,
  Moon as MoonIcon,
  Sun as SunIcon,
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
  { id: 'icons', label: 'Icones & Logo', icon: ImageIcon },
  { id: 'buttons', label: 'Boutons', icon: Square },
  { id: 'cards', label: 'Cartes', icon: Layers },
  { id: 'shadows', label: 'Ombres & Effets', icon: Moon },
  { id: 'inputs', label: 'Formulaires', icon: ToggleLeft },
  { id: 'badges', label: 'Badges', icon: BoxSelect },
  { id: 'choices', label: 'V1 vs V2', icon: Sparkles },
];

export default function AdminDesignSystemPage() {
  const [activeSection, setActiveSection] = useState<Section>('colors');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-orange-500 to-yellow-400 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Design System</h1>
          <p className="text-sm text-slate-400">Documentation visuelle des composants EasyCo</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 rounded-xl p-2 border border-slate-700">
        <div className="flex flex-wrap gap-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                {section.label}
                {section.id === 'choices' && (
                  <span className="ml-1 px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">!</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
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
    </div>
  );
}

/* ============================================
   COLORS SECTION
   ============================================ */

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
    <div className="space-y-8">
      {/* Role Colors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Searcher */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500" />
            <h3 className="text-lg font-bold text-white">Searcher</h3>
            <Badge className="bg-yellow-500 text-white border-0">Jaune/Dore</Badge>
          </div>
          <div className="space-y-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="flex items-center gap-3">
                <div
                  className="w-12 h-8 rounded-lg border border-slate-600"
                  style={{ backgroundColor: searcherColors[shade] }}
                />
                <span className="text-xs font-mono text-slate-400">--searcher-{shade}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Owner */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
            <h3 className="text-lg font-bold text-white">Owner</h3>
            <Badge className="bg-purple-600 text-white border-0">Mauve</Badge>
          </div>
          <div className="space-y-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="flex items-center gap-3">
                <div
                  className="w-12 h-8 rounded-lg border border-slate-600"
                  style={{ backgroundColor: ownerColors[shade] }}
                />
                <span className="text-xs font-mono text-slate-400">--owner-{shade}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resident */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500" />
            <h3 className="text-lg font-bold text-white">Resident</h3>
            <Badge className="bg-orange-500 text-white border-0">Orange</Badge>
          </div>
          <div className="space-y-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="flex items-center gap-3">
                <div
                  className="w-12 h-8 rounded-lg border border-slate-600"
                  style={{ backgroundColor: residentColors[shade] }}
                />
                <span className="text-xs font-mono text-slate-400">--resident-{shade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradients */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Gradients</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-600 via-orange-500 to-yellow-400">
            <p className="text-white font-bold">Gradient Brand</p>
            <p className="text-white/80 text-xs font-mono">--gradient-brand</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400">
            <p className="text-white font-bold">Gradient Searcher</p>
            <p className="text-white/80 text-xs font-mono">--gradient-searcher</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-400 to-pink-400">
            <p className="text-white font-bold">Gradient Owner</p>
            <p className="text-white/80 text-xs font-mono">--gradient-owner</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400">
            <p className="text-white font-bold">Gradient Resident</p>
            <p className="text-white/80 text-xs font-mono">--gradient-resident</p>
          </div>
        </div>
      </div>

      {/* Semantic Colors */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Couleurs Semantiques</h3>
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
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Tailles de police</h3>
        <div className="space-y-4">
          {[
            { class: 'text-xs', size: '12px' },
            { class: 'text-sm', size: '14px' },
            { class: 'text-base', size: '16px' },
            { class: 'text-lg', size: '18px' },
            { class: 'text-xl', size: '20px' },
            { class: 'text-2xl', size: '24px' },
            { class: 'text-3xl', size: '30px' },
            { class: 'text-4xl', size: '36px' },
          ].map((item) => (
            <div key={item.class} className="flex items-baseline gap-4 border-b border-slate-700 pb-3">
              <span className="text-xs text-slate-500 w-20 font-mono">{item.class}</span>
              <span className={cn(item.class, 'text-white')}>The quick brown fox ({item.size})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Graisses</h3>
        <div className="space-y-4">
          {[
            { class: 'font-normal', weight: '400' },
            { class: 'font-medium', weight: '500' },
            { class: 'font-semibold', weight: '600' },
            { class: 'font-bold', weight: '700' },
          ].map((item) => (
            <div key={item.class} className="flex items-center gap-4">
              <span className="text-xs text-slate-500 w-24 font-mono">{item.class}</span>
              <span className={cn('text-2xl text-white', item.class)}>Exemple ({item.weight})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================
   ICONS SECTION
   ============================================ */
const iconGroups = {
  'Navigation': [
    { icon: Home, name: 'Home' },
    { icon: Search, name: 'Search' },
    { icon: Menu, name: 'Menu' },
    { icon: ChevronLeft, name: 'ChevronLeft' },
    { icon: ChevronRight, name: 'ChevronRight' },
    { icon: ArrowRight, name: 'ArrowRight' },
    { icon: ExternalLink, name: 'ExternalLink' },
  ],
  'Utilisateurs': [
    { icon: User, name: 'User' },
    { icon: Users, name: 'Users' },
    { icon: Crown, name: 'Crown' },
    { icon: Baby, name: 'Baby' },
    { icon: Accessibility, name: 'Accessibility' },
  ],
  'Immobilier': [
    { icon: Building, name: 'Building' },
    { icon: Building2, name: 'Building2' },
    { icon: Home, name: 'Home' },
    { icon: Bed, name: 'Bed' },
    { icon: Bath, name: 'Bath' },
    { icon: Key, name: 'Key' },
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
  ],
  'Securite': [
    { icon: Shield, name: 'Shield' },
    { icon: ShieldCheck, name: 'ShieldCheck' },
    { icon: Lock, name: 'Lock' },
    { icon: Unlock, name: 'Unlock' },
    { icon: Eye, name: 'Eye' },
    { icon: EyeOff, name: 'EyeOff' },
    { icon: Fingerprint, name: 'Fingerprint' },
  ],
};

function IconsSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = Object.entries(iconGroups).reduce((acc, [category, icons]) => {
    const filtered = icons.filter(icon =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof iconGroups[keyof typeof iconGroups]>);

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Logo EasyCo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white rounded-xl p-4 w-full flex items-center justify-center">
              <img src="/logos/easyco-logo.svg" alt="Logo" className="h-12" />
            </div>
            <span className="text-sm text-slate-400">Sur fond clair</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-slate-900 rounded-xl p-4 w-full flex items-center justify-center">
              <img src="/logos/easyco-logo.svg" alt="Logo" className="h-12" />
            </div>
            <span className="text-sm text-slate-400">Sur fond sombre</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-orange-500 rounded-xl p-4 w-full flex items-center justify-center">
              <img src="/logos/easyco-icon-300.png" alt="Icon" className="h-12 w-12" />
            </div>
            <span className="text-sm text-slate-400">Icone seule</span>
          </div>
        </div>
      </div>

      {/* Styles d'icones - 3 approches */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Styles d'icones : 3 approches</h3>
        <p className="text-sm text-slate-400 mb-6">Comparaison des differentes facons de styliser les icones</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Terne */}
          <div className="bg-slate-700/50 rounded-xl p-4">
            <h4 className="font-semibold text-slate-300 mb-3">Style 1 : Terne (Muted)</h4>
            <div className="grid grid-cols-3 gap-3">
              {[User, Settings, Bell, Shield, Mail, Phone].map((Icon, i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="w-10 h-10 rounded-lg bg-slate-600/50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3 font-mono">text-gray-400, bg-gray-50</p>
          </div>

          {/* Vif */}
          <div className="bg-slate-700/50 rounded-xl p-4">
            <h4 className="font-semibold text-purple-400 mb-3">Style 2 : Vif (Vivid)</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 font-mono">text-[color]-600, bg-[color]-100</p>
          </div>

          {/* Gradient */}
          <div className="bg-slate-700/50 rounded-xl p-4">
            <h4 className="font-semibold text-orange-400 mb-3">Style 3 : Gradient</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400/30 to-amber-400/30 flex items-center justify-center border border-orange-400/20">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center border border-purple-400/20">
                  <Settings className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400/30 to-sky-400/30 flex items-center justify-center border border-blue-400/20">
                  <Bell className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-400/30 to-rose-400/30 flex items-center justify-center border border-red-400/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400/30 to-emerald-400/30 flex items-center justify-center border border-green-400/20">
                  <Mail className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400/30 to-lime-400/30 flex items-center justify-center border border-yellow-400/20">
                  <Phone className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 font-mono">bg-gradient from-X/70 to-Y/70</p>
          </div>
        </div>

        {/* Comparaison */}
        <div className="mt-6 p-4 bg-slate-700/30 rounded-xl">
          <h4 className="font-medium text-white mb-3">Meme icone, 3 styles</h4>
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-slate-600/50 flex items-center justify-center">
                <Settings className="w-7 h-7 text-slate-400" />
              </div>
              <span className="text-xs text-slate-500">Terne</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-600" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Settings className="w-7 h-7 text-purple-400" />
              </div>
              <span className="text-xs text-purple-400">Vif</span>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-600" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center border border-purple-400/20">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs text-orange-400">Gradient</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <p className="text-sm text-orange-300">
              <strong>Probleme actuel :</strong> L'app melange ces 3 styles sans coherence.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-lg font-bold text-white">Bibliotheque Lucide</h3>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm"
            />
          </div>
        </div>

        {Object.entries(filteredGroups).map(([category, icons]) => (
          <div key={category} className="mb-6">
            <h4 className="text-sm font-semibold text-slate-400 mb-3">{category}</h4>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
              {icons.map(({ icon: IconComponent, name }) => (
                <div
                  key={name}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer group"
                  title={name}
                >
                  <IconComponent className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  <span className="text-[9px] text-slate-500 text-center truncate w-full">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tailles */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Tailles recommandees</h3>
        <div className="flex items-end gap-6">
          {[
            { size: 'w-4', px: '16px' },
            { size: 'w-5', px: '20px' },
            { size: 'w-6', px: '24px' },
            { size: 'w-8', px: '32px' },
            { size: 'w-10', px: '40px' },
            { size: 'w-12', px: '48px' },
          ].map(({ size, px }) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Home className={cn(size, 'h-auto text-slate-400')} />
              <span className="text-xs text-slate-500">{px}</span>
            </div>
          ))}
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
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Variantes</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Tailles</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Heart className="w-5 h-5" /></Button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Avec icones</h3>
        <div className="flex flex-wrap gap-4">
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

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Gradients EasyCo</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full font-medium hover:from-purple-700 hover:to-purple-800 transition-all">
            Owner Style
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            Searcher Style
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
            Resident Style
          </button>
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <p className="text-sm font-medium text-slate-400 mb-3">Default</p>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Titre de carte</CardTitle>
              <CardDescription>Description courte</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Contenu de la carte.</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <p className="text-sm font-medium text-slate-400 mb-3">Bordered</p>
          <Card variant="bordered" className="bg-white">
            <CardHeader>
              <CardTitle>Titre de carte</CardTitle>
              <CardDescription>Description courte</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Contenu de la carte.</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <p className="text-sm font-medium text-slate-400 mb-3">Elevated</p>
          <Card variant="elevated" className="bg-white">
            <CardHeader>
              <CardTitle>Titre de carte</CardTitle>
              <CardDescription>Description courte</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Contenu de la carte.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Glassmorphism</h3>
        <div className="relative h-48 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-purple-500 to-yellow-400" />
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-300/50 rounded-full blur-2xl" />
          <div className="absolute inset-8 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-6 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-xl font-bold mb-2">Glassmorphism</p>
              <p className="text-sm opacity-80">backdrop-blur-xl + bg-white/20</p>
            </div>
          </div>
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
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Ombres</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'].map((shadow) => (
            <div key={shadow} className={`bg-white rounded-xl p-4 ${shadow}`}>
              <p className="font-mono text-xs text-gray-600">{shadow}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Border Radius</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { class: 'rounded-lg', label: '12px' },
            { class: 'rounded-xl', label: '16px' },
            { class: 'rounded-2xl', label: '24px' },
            { class: 'rounded-3xl', label: '32px' },
            { class: 'rounded-full', label: 'full' },
          ].map((radius) => (
            <div key={radius.class} className={`bg-purple-500/20 ${radius.class} p-4 flex flex-col items-center justify-center`}>
              <p className="font-mono text-xs text-slate-300">{radius.class}</p>
              <p className="text-xs text-slate-500">{radius.label}</p>
            </div>
          ))}
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
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Inputs (theme clair)</h3>
        <div className="bg-white rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Label standard" placeholder="Placeholder text" />
            <Input label="Avec icone" placeholder="Rechercher..." leftIcon={<MapPin className="w-5 h-5" />} />
            <Input label="Avec erreur" placeholder="Email" error="Cette adresse email est invalide" />
            <Input label="Requis" placeholder="Champ obligatoire" required />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Inputs (theme sombre - admin)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              placeholder="admin@easyco.be"
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
            <input
              type="password"
              placeholder="********"
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            />
          </div>
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
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Variantes</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Tailles</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Avec icones</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success" icon={<Check className="w-3 h-3" />}>Verifie</Badge>
          <Badge variant="warning" icon={<AlertTriangle className="w-3 h-3" />}>Attention</Badge>
          <Badge variant="info" icon={<Info className="w-3 h-3" />}>Information</Badge>
          <Badge variant="error" icon={<X className="w-3 h-3" />}>Erreur</Badge>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Badges Gradient</h3>
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-full text-sm font-medium shadow-md">
            Meuble
          </span>
          <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-sm font-medium shadow-md">
            Disponible
          </span>
          <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-full text-sm font-medium shadow-md">
            Verifie
          </span>
          <span className="px-3 py-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-full text-sm font-medium shadow-md">
            Premium
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   CHOICES SECTION - V1 vs V2
   ============================================ */

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem('design_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('design_session_id', sessionId);
  }
  return sessionId;
}

function ChoicesSection() {
  const [selectedChoices, setSelectedChoices] = useState<Record<string, 'v1' | 'v2'>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const choiceDefinitions = {
    cards: { title: 'Style de cartes', v1Label: 'V1 - Flat', v2Label: 'V2 - Glassmorphism' },
    buttons: { title: 'Style de boutons', v1Label: 'V1 - Solid', v2Label: 'V2 - Gradient' },
    shadows: { title: 'Intensite des ombres', v1Label: 'V1 - Legere', v2Label: 'V2 - Marquee' },
    badges: { title: 'Style de badges', v1Label: 'V1 - Discret', v2Label: 'V2 - Vibrant' },
    backgrounds: { title: 'Effets de fond', v1Label: 'V1 - Statique', v2Label: 'V2 - Dynamique' },
    icons: { title: 'Style d\'icones', v1Label: 'V1 - Vif (Vivid)', v2Label: 'V2 - Gradient' },
  };

  const toggleChoice = (id: string, version: 'v1' | 'v2') => {
    setSelectedChoices(prev => ({ ...prev, [id]: version }));
    setSaved(prev => ({ ...prev, [id]: false }));
  };

  const updateFeedback = (id: string, feedback: string) => {
    setFeedbacks(prev => ({ ...prev, [id]: feedback }));
    setSaved(prev => ({ ...prev, [id]: false }));
  };

  const saveChoice = async (choiceKey: string) => {
    const version = selectedChoices[choiceKey];
    if (!version || !sessionId) return;

    setSaving(prev => ({ ...prev, [choiceKey]: true }));

    try {
      const def = choiceDefinitions[choiceKey as keyof typeof choiceDefinitions];

      const { error } = await supabase
        .from('design_choices')
        .upsert({
          session_id: sessionId,
          choice_key: choiceKey,
          choice_title: def.title,
          selected_version: version,
          v1_label: def.v1Label,
          v2_label: def.v2Label,
          feedback: feedbacks[choiceKey] || null,
        }, {
          onConflict: 'session_id,choice_key',
          ignoreDuplicates: false,
        });

      if (error) {
        const { error: insertError } = await supabase
          .from('design_choices')
          .insert({
            session_id: sessionId,
            choice_key: choiceKey,
            choice_title: def.title,
            selected_version: version,
            v1_label: def.v1Label,
            v2_label: def.v2Label,
            feedback: feedbacks[choiceKey] || null,
          });

        if (insertError) throw insertError;
      }

      setSaved(prev => ({ ...prev, [choiceKey]: true }));
      setTimeout(() => {
        setSaved(prev => ({ ...prev, [choiceKey]: false }));
      }, 3000);
    } catch (error) {
      console.error('Error saving choice:', error);
    } finally {
      setSaving(prev => ({ ...prev, [choiceKey]: false }));
    }
  };

  const saveAllChoices = async () => {
    const keys = Object.keys(selectedChoices);
    for (const key of keys) {
      await saveChoice(key);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
        <p className="text-orange-300">
          <strong>Important :</strong> Cette section permet de choisir entre 2 directions de design.
          Tes choix sont enregistres et aident a prendre la decision finale.
        </p>
      </div>

      {/* Choice: Cards */}
      <ChoiceCard
        id="cards"
        title="Style de cartes"
        description="Flat minimaliste vs Glassmorphism premium"
        v1Content={
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Home className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Appartement Paris</p>
                <p className="text-sm text-gray-500">850EUR/mois</p>
              </div>
            </div>
          </div>
        }
        v2Content={
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-purple-50 to-yellow-100">
              <div className="absolute top-0 left-1/4 w-12 h-12 bg-orange-300/60 rounded-full blur-xl" />
            </div>
            <div className="relative bg-white/60 backdrop-blur-xl p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Appartement Paris</p>
                  <p className="text-sm text-gray-600">850EUR/mois</p>
                </div>
              </div>
            </div>
          </div>
        }
        selectedVersion={selectedChoices['cards']}
        onSelect={(v) => toggleChoice('cards', v)}
        feedback={feedbacks['cards'] || ''}
        onFeedbackChange={(f) => updateFeedback('cards', f)}
        onSave={() => saveChoice('cards')}
        saving={saving['cards']}
        saved={saved['cards']}
      />

      {/* Choice: Buttons */}
      <ChoiceCard
        id="buttons"
        title="Style de boutons"
        description="Solid classique vs Gradient vibrant"
        v1Content={
          <div className="flex gap-3 bg-gray-50 p-4 rounded-lg">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium">
              Primaire
            </button>
            <button className="px-4 py-2 border-2 border-purple-500 text-purple-600 rounded-full text-sm font-medium">
              Secondaire
            </button>
          </div>
        }
        v2Content={
          <div className="flex gap-3 bg-gray-50 p-4 rounded-lg">
            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full text-sm font-medium shadow-lg">
              Primaire
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-lg">
              Secondaire
            </button>
          </div>
        }
        selectedVersion={selectedChoices['buttons']}
        onSelect={(v) => toggleChoice('buttons', v)}
        feedback={feedbacks['buttons'] || ''}
        onFeedbackChange={(f) => updateFeedback('buttons', f)}
        onSave={() => saveChoice('buttons')}
        saving={saving['buttons']}
        saved={saved['buttons']}
      />

      {/* Choice: Icons */}
      <ChoiceCard
        id="icons"
        title="Style d'icones"
        description="Couleurs vives vs Fond gradient"
        v1Content={
          <div className="flex gap-3 p-4 bg-white rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        }
        v2Content={
          <div className="flex gap-3 p-4 bg-white rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-200/80 to-amber-200/80 flex items-center justify-center border border-orange-200/50">
              <User className="w-5 h-5 text-gray-700" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-200/70 to-pink-200/70 flex items-center justify-center border border-purple-200/50">
              <Settings className="w-5 h-5 text-gray-700" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-200/70 to-sky-200/70 flex items-center justify-center border border-blue-200/50">
              <Bell className="w-5 h-5 text-gray-700" />
            </div>
          </div>
        }
        selectedVersion={selectedChoices['icons']}
        onSelect={(v) => toggleChoice('icons', v)}
        feedback={feedbacks['icons'] || ''}
        onFeedbackChange={(f) => updateFeedback('icons', f)}
        onSave={() => saveChoice('icons')}
        saving={saving['icons']}
        saved={saved['icons']}
      />

      {/* Choice: Badges */}
      <ChoiceCard
        id="badges"
        title="Style de badges"
        description="Discret vs Vibrant"
        v1Content={
          <div className="flex gap-2 p-4 bg-white rounded-lg">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs border border-gray-200">
              Meuble
            </span>
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
              Disponible
            </span>
          </div>
        }
        v2Content={
          <div className="flex gap-2 p-4 bg-white rounded-lg">
            <span className="px-2 py-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-full text-xs font-medium shadow">
              Meuble
            </span>
            <span className="px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-xs font-medium shadow">
              Disponible
            </span>
          </div>
        }
        selectedVersion={selectedChoices['badges']}
        onSelect={(v) => toggleChoice('badges', v)}
        feedback={feedbacks['badges'] || ''}
        onFeedbackChange={(f) => updateFeedback('badges', f)}
        onSave={() => saveChoice('badges')}
        saving={saving['badges']}
        saved={saved['badges']}
      />

      {/* Summary */}
      <div className="bg-gradient-to-br from-purple-900/50 to-slate-800 rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Resume de tes choix
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {['cards', 'buttons', 'icons', 'badges'].map((key) => (
            <div key={key} className="bg-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-400 mb-1 capitalize">{key}</p>
              <p className="font-bold text-lg text-white">
                {selectedChoices[key] ? selectedChoices[key].toUpperCase() : '—'}
              </p>
              {saved[key] && <p className="text-xs text-green-400 mt-1">Enregistre</p>}
            </div>
          ))}
        </div>

        {Object.keys(selectedChoices).length > 0 && (
          <>
            <div className="p-4 bg-slate-700/30 rounded-xl mb-4">
              <p className="text-sm text-slate-300">
                <strong>Tendance :</strong>{' '}
                {Object.values(selectedChoices).filter(v => v === 'v1').length > Object.values(selectedChoices).filter(v => v === 'v2').length
                  ? 'Tu penches vers un design Flat/Minimaliste'
                  : Object.values(selectedChoices).filter(v => v === 'v2').length > Object.values(selectedChoices).filter(v => v === 'v1').length
                  ? 'Tu penches vers un design Glassmorphism/Premium'
                  : 'Tu es entre les deux directions'}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={saveAllChoices}
                disabled={Object.values(saving).some(s => s)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {Object.values(saving).some(s => s) ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer tous mes choix
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================
   CHOICE CARD COMPONENT
   ============================================ */
interface ChoiceCardProps {
  id: string;
  title: string;
  description: string;
  v1Content: React.ReactNode;
  v2Content: React.ReactNode;
  selectedVersion?: 'v1' | 'v2';
  onSelect: (version: 'v1' | 'v2') => void;
  feedback?: string;
  onFeedbackChange?: (feedback: string) => void;
  onSave?: () => void;
  saving?: boolean;
  saved?: boolean;
}

function ChoiceCard({
  id,
  title,
  description,
  v1Content,
  v2Content,
  selectedVersion,
  onSelect,
  feedback = '',
  onFeedbackChange,
  onSave,
  saving = false,
  saved = false,
}: ChoiceCardProps) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* V1 */}
        <div
          className={cn(
            "p-4 cursor-pointer transition-all border-r border-slate-700",
            selectedVersion === 'v1' ? 'bg-green-500/10 ring-2 ring-inset ring-green-500' : 'hover:bg-slate-700/50'
          )}
          onClick={() => onSelect('v1')}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">V1 - Flat</span>
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
              selectedVersion === 'v1' ? 'bg-green-500 border-green-500' : 'border-slate-500'
            )}>
              {selectedVersion === 'v1' && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
          {v1Content}
        </div>

        {/* V2 */}
        <div
          className={cn(
            "p-4 cursor-pointer transition-all",
            selectedVersion === 'v2' ? 'bg-green-500/10 ring-2 ring-inset ring-green-500' : 'hover:bg-slate-700/50'
          )}
          onClick={() => onSelect('v2')}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">V2 - Premium</span>
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
              selectedVersion === 'v2' ? 'bg-green-500 border-green-500' : 'border-slate-500'
            )}>
              {selectedVersion === 'v2' && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
          {v2Content}
        </div>
      </div>

      {/* Feedback */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/50">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <textarea
              value={feedback}
              onChange={(e) => onFeedbackChange?.(e.target.value)}
              placeholder="Ton feedback (optionnel)..."
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none text-sm outline-none"
              rows={2}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave?.();
            }}
            disabled={!selectedVersion || saving}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
              selectedVersion
                ? saved
                  ? "bg-green-500 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            )}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
