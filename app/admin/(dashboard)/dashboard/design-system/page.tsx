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
  | 'property-cards'
  | 'profile-cards'
  | 'dropdowns'
  | 'shadows'
  | 'inputs'
  | 'badges'
  | 'gradient-usage'
  | 'choices';

const sections: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'colors', label: 'Couleurs', icon: Palette },
  { id: 'typography', label: 'Typographie', icon: Type },
  { id: 'icons', label: 'Icones & Logo', icon: ImageIcon },
  { id: 'buttons', label: 'Boutons', icon: Square },
  { id: 'cards', label: 'Cartes UI', icon: Layers },
  { id: 'property-cards', label: 'Property Cards', icon: Building2 },
  { id: 'profile-cards', label: 'Profile Cards', icon: User },
  { id: 'dropdowns', label: 'Dropdowns', icon: ChevronDown },
  { id: 'gradient-usage', label: 'Gradient Signature', icon: Zap },
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
          {activeSection === 'property-cards' && <PropertyCardsSection />}
          {activeSection === 'profile-cards' && <ProfileCardsSection />}
          {activeSection === 'dropdowns' && <DropdownsSection />}
          {activeSection === 'gradient-usage' && <GradientUsageSection />}
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

// Les couleurs des roles sont maintenant generees dynamiquement par le GradientSignatureEditor

/* ============================================
   GRADIENT SIGNATURE EDITOR - Curseurs INDEPENDANTS
   ============================================ */
function GradientSignatureEditor() {
  // Gradient EXACT du bouton "S'inscrire" - 3 couleurs seulement (pas de rose!)
  // Source: globals.css --gradient-brand: linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)
  const gradientColors = [
    { pos: 0, hex: '#6E56CF' },    // Mauve (owner-primary)
    { pos: 50, hex: '#FF6F3C' },   // Orange (resident-primary) - au CENTRE
    { pos: 100, hex: '#FFD249' },  // Jaune (searcher-primary)
  ];

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const getColorAtPosition = (position: number): string => {
    let lower = gradientColors[0];
    let upper = gradientColors[gradientColors.length - 1];
    for (let i = 0; i < gradientColors.length - 1; i++) {
      if (position >= gradientColors[i].pos && position <= gradientColors[i + 1].pos) {
        lower = gradientColors[i];
        upper = gradientColors[i + 1];
        break;
      }
    }
    const range = upper.pos - lower.pos;
    const factor = range === 0 ? 0 : (position - lower.pos) / range;
    const lowerRgb = hexToRgb(lower.hex);
    const upperRgb = hexToRgb(upper.hex);
    const r = Math.round(lowerRgb.r + factor * (upperRgb.r - lowerRgb.r));
    const g = Math.round(lowerRgb.g + factor * (upperRgb.g - lowerRgb.g));
    const b = Math.round(lowerRgb.b + factor * (upperRgb.b - lowerRgb.b));
    return rgbToHex(r, g, b);
  };

  // Generateur de palette basee sur les couleurs REELLES du gradient du role
  // Extrait 5 couleurs equidistantes du gradient configure
  const generateColorPalette = (pos: number, width: number) => {
    const start = Math.max(0, pos - width / 2);
    const end = Math.min(100, pos + width / 2);

    if (width <= 2) {
      // Si couleur unie, retourner la meme couleur pour tout
      const solid = getColorAtPosition(pos);
      return {
        color1: solid,
        color2: solid,
        color3: solid,
        color4: solid,
        color5: solid,
      };
    }

    // Extraire 5 couleurs equidistantes du gradient (les vraies couleurs du degrade)
    const step = (end - start) / 4;
    const color1 = getColorAtPosition(start);            // Debut du gradient
    const color2 = getColorAtPosition(start + step);     // 25% du gradient
    const color3 = getColorAtPosition(start + step * 2); // Centre (50%)
    const color4 = getColorAtPosition(start + step * 3); // 75% du gradient
    const color5 = getColorAtPosition(end);              // Fin du gradient

    return {
      color1,
      color2,
      color3,
      color4,
      color5,
    };
  };

  // Curseurs INDEPENDANTS - Position + Largeur (valeurs par defaut basees sur le screenshot)
  const [ownerPos, setOwnerPos] = useState(21);
  const [ownerWidth, setOwnerWidth] = useState(34);
  const [residentPos, setResidentPos] = useState(57);
  const [residentWidth, setResidentWidth] = useState(28);
  const [searcherPos, setSearcherPos] = useState(95);
  const [searcherWidth, setSearcherWidth] = useState(50);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Gradient EXACT comme dans globals.css (angle 135deg = oblique)
  const signatureGradient = 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)';

  const getRoleGradient = (pos: number, width: number) => {
    if (width <= 2) return getColorAtPosition(pos);
    const start = Math.max(0, pos - width / 2);
    const end = Math.min(100, pos + width / 2);
    return `linear-gradient(to right, ${getColorAtPosition(start)}, ${getColorAtPosition(end)})`;
  };

  // Palettes generees pour chaque role
  const ownerPalette = generateColorPalette(ownerPos, ownerWidth);
  const residentPalette = generateColorPalette(residentPos, residentWidth);
  const searcherPalette = generateColorPalette(searcherPos, searcherWidth);

  // Fonction de sauvegarde
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    const config = {
      owner: { pos: ownerPos, width: ownerWidth, palette: ownerPalette },
      resident: { pos: residentPos, width: residentWidth, palette: residentPalette },
      searcher: { pos: searcherPos, width: searcherWidth, palette: searcherPalette },
    };

    // Sauvegarder dans localStorage pour l'instant
    localStorage.setItem('easyco-gradient-config', JSON.stringify(config));

    // Simuler un delai pour le feedback
    await new Promise(resolve => setTimeout(resolve, 500));

    setSaveMessage('Configuration sauvegardee!');
    setIsSaving(false);

    // Effacer le message apres 3 secondes
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Composant pour afficher les carres de couleurs REELLES du gradient
  const ColorSwatches = ({ palette }: { palette: ReturnType<typeof generateColorPalette> }) => (
    <div className="flex gap-1 mt-2">
      <div className="group relative">
        <div className="w-8 h-8 rounded border border-slate-600" style={{ background: palette.color1 }} />
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">0%</span>
      </div>
      <div className="group relative">
        <div className="w-8 h-8 rounded border border-slate-600" style={{ background: palette.color2 }} />
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">25%</span>
      </div>
      <div className="group relative">
        <div className="w-8 h-8 rounded border border-slate-600" style={{ background: palette.color3 }} />
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">50%</span>
      </div>
      <div className="group relative">
        <div className="w-8 h-8 rounded border border-slate-600" style={{ background: palette.color4 }} />
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">75%</span>
      </div>
      <div className="group relative">
        <div className="w-8 h-8 rounded border border-slate-600" style={{ background: palette.color5 }} />
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">100%</span>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h3 className="text-lg font-bold text-white mb-2">Gradient Signature EasyCo</h3>
      <p className="text-sm text-slate-400 mb-6">
        Curseurs independants. Met la largeur a 0 pour une couleur unie.
      </p>

      {/* GRADIENT ORIGINAL */}
      <div className="mb-8">
        <p className="text-xs text-slate-400 mb-3">Gradient signature (couleurs vives) :</p>
        <div className="w-full h-24 rounded-2xl shadow-2xl" style={{ background: signatureGradient }} />
        <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
          <span>0% Mauve</span><span>25%</span><span>50% Orange</span><span>75%</span><span>100% Jaune</span>
        </div>
      </div>

      {/* CURSEURS INDEPENDANTS */}
      <div className="space-y-6 mb-8">
        {/* Owner */}
        <div className="p-4 bg-slate-700/30 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-purple-400 font-bold text-lg">Owner</span>
            <span className="text-slate-400 text-sm font-mono">
              {ownerWidth <= 2 ? `Unie @ ${ownerPos}%` : `${Math.max(0, ownerPos - ownerWidth/2).toFixed(0)}% - ${Math.min(100, ownerPos + ownerWidth/2).toFixed(0)}%`}
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xs text-slate-400 w-16">Position</span>
            <input type="range" min="0" max="100" value={ownerPos}
              onChange={(e) => setOwnerPos(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg cursor-pointer accent-purple-500" />
            <span className="text-xs text-slate-300 w-10 text-right">{ownerPos}%</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xs text-slate-400 w-16">Largeur</span>
            <input type="range" min="0" max="50" value={ownerWidth}
              onChange={(e) => setOwnerWidth(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg cursor-pointer accent-purple-500" />
            <span className="text-xs text-slate-300 w-10 text-right">{ownerWidth}%</span>
          </div>
          <div className="h-14 rounded-xl shadow-lg" style={{ background: getRoleGradient(ownerPos, ownerWidth) }} />
        </div>

        {/* Resident */}
        <div className="p-4 bg-slate-700/30 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-orange-400 font-bold text-lg">Resident</span>
            <span className="text-slate-400 text-sm font-mono">
              {residentWidth <= 2 ? `Unie @ ${residentPos}%` : `${Math.max(0, residentPos - residentWidth/2).toFixed(0)}% - ${Math.min(100, residentPos + residentWidth/2).toFixed(0)}%`}
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xs text-slate-400 w-16">Position</span>
            <input type="range" min="0" max="100" value={residentPos}
              onChange={(e) => setResidentPos(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg cursor-pointer accent-orange-500" />
            <span className="text-xs text-slate-300 w-10 text-right">{residentPos}%</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xs text-slate-400 w-16">Largeur</span>
            <input type="range" min="0" max="50" value={residentWidth}
              onChange={(e) => setResidentWidth(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg cursor-pointer accent-orange-500" />
            <span className="text-xs text-slate-300 w-10 text-right">{residentWidth}%</span>
          </div>
          <div className="h-14 rounded-xl shadow-lg" style={{ background: getRoleGradient(residentPos, residentWidth) }} />
        </div>

        {/* Searcher */}
        <div className="p-4 bg-slate-700/30 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 font-bold text-lg">Searcher</span>
            <span className="text-slate-400 text-sm font-mono">
              {searcherWidth <= 2 ? `Unie @ ${searcherPos}%` : `${Math.max(0, searcherPos - searcherWidth/2).toFixed(0)}% - ${Math.min(100, searcherPos + searcherWidth/2).toFixed(0)}%`}
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xs text-slate-400 w-16">Position</span>
            <input type="range" min="0" max="100" value={searcherPos}
              onChange={(e) => setSearcherPos(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg cursor-pointer accent-yellow-500" />
            <span className="text-xs text-slate-300 w-10 text-right">{searcherPos}%</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xs text-slate-400 w-16">Largeur</span>
            <input type="range" min="0" max="50" value={searcherWidth}
              onChange={(e) => setSearcherWidth(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg cursor-pointer accent-yellow-500" />
            <span className="text-xs text-slate-300 w-10 text-right">{searcherWidth}%</span>
          </div>
          <div className="h-14 rounded-xl shadow-lg" style={{ background: getRoleGradient(searcherPos, searcherWidth) }} />
        </div>
      </div>

      {/* APERCU DES BOUTONS AVEC PALETTES */}
      <div className="mb-8 p-6 bg-slate-700/30 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-white">Apercu des boutons</h4>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sauvegarde...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sauvegarder
              </>
            )}
          </button>
        </div>

        {saveMessage && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
            {saveMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Owner */}
          <div className="text-center">
            <button className="w-full px-8 py-3 text-white rounded-full font-semibold shadow-xl hover:scale-105 transition-transform mb-3"
              style={{ background: getRoleGradient(ownerPos, ownerWidth) }}>Interface Owner</button>
            <p className="text-xs text-slate-400 mb-2">Couleurs du gradient:</p>
            <div className="flex justify-center">
              <ColorSwatches palette={ownerPalette} />
            </div>
            <div className="mt-4 text-[10px] text-slate-500 font-mono space-y-1">
              <div>Debut: {ownerPalette.color1}</div>
              <div>Fin: {ownerPalette.color5}</div>
            </div>
          </div>

          {/* Resident */}
          <div className="text-center">
            <button className="w-full px-8 py-3 text-white rounded-full font-semibold shadow-xl hover:scale-105 transition-transform mb-3"
              style={{ background: getRoleGradient(residentPos, residentWidth) }}>Interface Resident</button>
            <p className="text-xs text-slate-400 mb-2">Couleurs du gradient:</p>
            <div className="flex justify-center">
              <ColorSwatches palette={residentPalette} />
            </div>
            <div className="mt-4 text-[10px] text-slate-500 font-mono space-y-1">
              <div>Debut: {residentPalette.color1}</div>
              <div>Fin: {residentPalette.color5}</div>
            </div>
          </div>

          {/* Searcher */}
          <div className="text-center">
            <button className="w-full px-8 py-3 text-white rounded-full font-semibold shadow-xl hover:scale-105 transition-transform mb-3"
              style={{ background: getRoleGradient(searcherPos, searcherWidth) }}>Interface Searcher</button>
            <p className="text-xs text-slate-400 mb-2">Couleurs du gradient:</p>
            <div className="flex justify-center">
              <ColorSwatches palette={searcherPalette} />
            </div>
            <div className="mt-4 text-[10px] text-slate-500 font-mono space-y-1">
              <div>Debut: {searcherPalette.color1}</div>
              <div>Fin: {searcherPalette.color5}</div>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-3">Boutons alignes :</p>
        <div className="flex gap-0">
          <button className="flex-1 px-6 py-4 text-white rounded-l-full font-semibold shadow-lg"
            style={{ background: getRoleGradient(ownerPos, ownerWidth) }}>Owner</button>
          <button className="flex-1 px-6 py-4 text-white font-semibold shadow-lg"
            style={{ background: getRoleGradient(residentPos, residentWidth) }}>Resident</button>
          <button className="flex-1 px-6 py-4 text-white rounded-r-full font-semibold shadow-lg"
            style={{ background: getRoleGradient(searcherPos, searcherWidth) }}>Searcher</button>
        </div>
      </div>

      {/* CSS GENERE - COMPLET */}
      <div className="p-4 bg-slate-900 rounded-xl">
        <p className="text-xs text-slate-400 mb-3">Couleurs du gradient (a copier dans globals.css) :</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          {/* Owner */}
          <div className="space-y-1">
            <div className="text-purple-400 font-bold mb-2">/* OWNER */</div>
            <div><span className="text-slate-400">--owner-100:</span> <code className="text-green-400">{ownerPalette.color1};</code> <span className="text-slate-600">/* debut */</span></div>
            <div><span className="text-slate-400">--owner-300:</span> <code className="text-green-400">{ownerPalette.color2};</code> <span className="text-slate-600">/* 25% */</span></div>
            <div><span className="text-slate-400">--owner-500:</span> <code className="text-green-400">{ownerPalette.color3};</code> <span className="text-slate-600">/* centre */</span></div>
            <div><span className="text-slate-400">--owner-700:</span> <code className="text-green-400">{ownerPalette.color4};</code> <span className="text-slate-600">/* 75% */</span></div>
            <div><span className="text-slate-400">--owner-900:</span> <code className="text-green-400">{ownerPalette.color5};</code> <span className="text-slate-600">/* fin */</span></div>
            <div className="pt-1"><span className="text-slate-400">--owner-gradient:</span> <code className="text-green-400 text-[10px] break-all">{getRoleGradient(ownerPos, ownerWidth)};</code></div>
          </div>

          {/* Resident */}
          <div className="space-y-1">
            <div className="text-orange-400 font-bold mb-2">/* RESIDENT */</div>
            <div><span className="text-slate-400">--resident-100:</span> <code className="text-green-400">{residentPalette.color1};</code> <span className="text-slate-600">/* debut */</span></div>
            <div><span className="text-slate-400">--resident-300:</span> <code className="text-green-400">{residentPalette.color2};</code> <span className="text-slate-600">/* 25% */</span></div>
            <div><span className="text-slate-400">--resident-500:</span> <code className="text-green-400">{residentPalette.color3};</code> <span className="text-slate-600">/* centre */</span></div>
            <div><span className="text-slate-400">--resident-700:</span> <code className="text-green-400">{residentPalette.color4};</code> <span className="text-slate-600">/* 75% */</span></div>
            <div><span className="text-slate-400">--resident-900:</span> <code className="text-green-400">{residentPalette.color5};</code> <span className="text-slate-600">/* fin */</span></div>
            <div className="pt-1"><span className="text-slate-400">--resident-gradient:</span> <code className="text-green-400 text-[10px] break-all">{getRoleGradient(residentPos, residentWidth)};</code></div>
          </div>

          {/* Searcher */}
          <div className="space-y-1">
            <div className="text-yellow-400 font-bold mb-2">/* SEARCHER */</div>
            <div><span className="text-slate-400">--searcher-100:</span> <code className="text-green-400">{searcherPalette.color1};</code> <span className="text-slate-600">/* debut */</span></div>
            <div><span className="text-slate-400">--searcher-300:</span> <code className="text-green-400">{searcherPalette.color2};</code> <span className="text-slate-600">/* 25% */</span></div>
            <div><span className="text-slate-400">--searcher-500:</span> <code className="text-green-400">{searcherPalette.color3};</code> <span className="text-slate-600">/* centre */</span></div>
            <div><span className="text-slate-400">--searcher-700:</span> <code className="text-green-400">{searcherPalette.color4};</code> <span className="text-slate-600">/* 75% */</span></div>
            <div><span className="text-slate-400">--searcher-900:</span> <code className="text-green-400">{searcherPalette.color5};</code> <span className="text-slate-600">/* fin */</span></div>
            <div className="pt-1"><span className="text-slate-400">--searcher-gradient:</span> <code className="text-green-400 text-[10px] break-all">{getRoleGradient(searcherPos, searcherWidth)};</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher une couleur avec justification
interface ColorAuditCardProps {
  hex: string;
  name: string;
  usage: string;
  justification: string;
  status: 'keep' | 'review' | 'remove' | 'semantic';
  location?: string;
}

function ColorAuditCard({ hex, name, usage, justification, status, location }: ColorAuditCardProps) {
  const statusColors = {
    keep: 'border-green-500/50 bg-green-500/10',
    review: 'border-yellow-500/50 bg-yellow-500/10',
    remove: 'border-red-500/50 bg-red-500/10',
    semantic: 'border-blue-500/50 bg-blue-500/10',
  };

  const statusLabels = {
    keep: { text: 'A conserver', color: 'text-green-400' },
    review: { text: 'A revoir', color: 'text-yellow-400' },
    remove: { text: 'A supprimer?', color: 'text-red-400' },
    semantic: { text: 'Semantique', color: 'text-blue-400' },
  };

  return (
    <div className={`p-4 rounded-xl border ${statusColors[status]}`}>
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-lg border border-slate-600 shadow-inner flex-shrink-0"
          style={{ background: hex }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-white text-sm">{name}</h4>
            <span className={`text-xs ${statusLabels[status].color} font-medium`}>
              {statusLabels[status].text}
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">{hex}</p>
          <p className="text-xs text-slate-300 mt-1">{usage}</p>
          <p className="text-xs text-slate-500 mt-1 italic">{justification}</p>
          {location && (
            <p className="text-[10px] text-slate-600 mt-1 font-mono">📁 {location}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ColorsSection() {
  return (
    <div className="space-y-8">
      {/* GRADIENT SIGNATURE EASYCO - En premier pour configurer les couleurs */}
      <GradientSignatureEditor />

      {/* Semantic Colors */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Couleurs Semantiques</h3>
        <p className="text-sm text-slate-400 mb-4">
          Ces couleurs ont une signification universelle et sont necessaires pour l'UX.
        </p>
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

      {/* AUDIT COMPLET DES COULEURS */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-white">Audit des couleurs de l'application</h3>
          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">A valider</span>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Toutes les couleurs presentes dans l'application, avec leur justification.
          Decidons ensemble lesquelles correspondent a la direction artistique.
        </p>

        {/* Legende */}
        <div className="flex flex-wrap gap-4 mb-6 p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500/50 border border-green-500"></div>
            <span className="text-xs text-slate-300">A conserver</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500/50 border border-yellow-500"></div>
            <span className="text-xs text-slate-300">A revoir</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500/50 border border-red-500"></div>
            <span className="text-xs text-slate-300">A supprimer?</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500/50 border border-blue-500"></div>
            <span className="text-xs text-slate-300">Semantique (necessaire)</span>
          </div>
        </div>

        {/* 1. COULEURS PRINCIPALES DES ROLES */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-gradient-to-r from-purple-500 via-orange-500 to-yellow-500"></span>
            1. Couleurs principales des roles
          </h4>
          <p className="text-xs text-slate-500 mb-4">Ces couleurs forment le coeur de l'identite visuelle.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ColorAuditCard
              hex="#6E56CF"
              name="Owner Primary (Mauve)"
              usage="Couleur principale interface proprietaire"
              justification="Couleur signature du gradient - debut. Evoque la royaute, la possession."
              status="keep"
              location="globals.css, tailwind.config"
            />
            <ColorAuditCard
              hex="#FF6F3C"
              name="Resident Primary (Orange)"
              usage="Couleur principale interface resident"
              justification="Couleur signature du gradient - centre. Evoque la chaleur, le foyer."
              status="keep"
              location="globals.css, tailwind.config"
            />
            <ColorAuditCard
              hex="#FFD249"
              name="Searcher Primary (Jaune)"
              usage="Couleur principale interface chercheur"
              justification="Couleur signature du gradient - fin. Evoque l'energie, la recherche."
              status="keep"
              location="globals.css, tailwind.config"
            />
          </div>
        </div>

        {/* 2. COULEURS SECONDAIRES / ACCENTS */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-cyan-500"></span>
            2. Couleurs d'accent (hors roles)
          </h4>
          <p className="text-xs text-slate-500 mb-4">Couleurs utilisees pour les accents, liens, focus...</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ColorAuditCard
              hex="#22D3EE"
              name="Cyan / Turquoise"
              usage="Headers de settings, liens, accents secondaires"
              justification="Couleur froide qui contraste avec les teintes chaudes. Utilisee dans /settings pour les titres."
              status="review"
              location="settings/page.tsx, components"
            />
            <ColorAuditCard
              hex="#F472B6"
              name="Pink 400"
              usage="Gradients decoratifs, icones feminines"
              justification="Presente dans certains gradients decoratifs. Ne fait pas partie du gradient signature."
              status="review"
              location="landing, settings"
            />
            <ColorAuditCard
              hex="#EC4899"
              name="Pink 500"
              usage="Accents roses, certains badges"
              justification="Variante plus saturee du rose. Coherent avec direction artistique?"
              status="review"
              location="components/ui"
            />
            <ColorAuditCard
              hex="#FB7185"
              name="Rose 400"
              usage="Gradients secondaires"
              justification="Rose corail proche de l'orange. Transition dans certains degrades."
              status="review"
              location="onboarding"
            />
          </div>
        </div>

        {/* 3. COULEURS UI / INTERFACE */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-slate-500"></span>
            3. Couleurs d'interface (UI)
          </h4>
          <p className="text-xs text-slate-500 mb-4">Couleurs utilisees pour les fonds, bordures, textes...</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ColorAuditCard
              hex="#0F172A"
              name="Slate 900"
              usage="Fond principal sombre"
              justification="Fond de l'application en mode sombre. Standard et necessaire."
              status="keep"
              location="layout, globals.css"
            />
            <ColorAuditCard
              hex="#1E293B"
              name="Slate 800"
              usage="Cartes, conteneurs"
              justification="Fond des cartes et elements surreleves. Hierarchie visuelle."
              status="keep"
              location="components/ui/card"
            />
            <ColorAuditCard
              hex="#334155"
              name="Slate 700"
              usage="Bordures, separateurs"
              justification="Bordures subtiles, lignes de separation."
              status="keep"
              location="global"
            />
            <ColorAuditCard
              hex="#94A3B8"
              name="Slate 400"
              usage="Texte secondaire, icones inactives"
              justification="Texte de moindre importance, labels."
              status="keep"
              location="global"
            />
            <ColorAuditCard
              hex="#FFFFFF"
              name="White"
              usage="Texte principal, fond clair"
              justification="Texte sur fonds sombres, elements importants."
              status="keep"
              location="global"
            />
          </div>
        </div>

        {/* 4. COULEURS ADMIN SPECIFIQUES */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-purple-600"></span>
            4. Couleurs Admin specifiques
          </h4>
          <p className="text-xs text-slate-500 mb-4">Couleurs utilisees uniquement dans l'interface admin.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ColorAuditCard
              hex="#9333EA"
              name="Purple 600"
              usage="Accent principal admin, sidebar active"
              justification="Derive de la couleur Owner. Coherent car admin = 'proprietaire' de la plateforme."
              status="keep"
              location="admin/sidebar, admin/layout"
            />
            <ColorAuditCard
              hex="#7C3AED"
              name="Violet 600"
              usage="Boutons admin, CTA"
              justification="Similaire au mauve owner mais plus vif. Distinction admin/owner."
              status="keep"
              location="admin components"
            />
          </div>
        </div>

        {/* 5. COULEURS SEMANTIQUES ETENDUES */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-gradient-to-r from-green-500 via-blue-500 to-red-500"></span>
            5. Couleurs semantiques (fonctionnelles)
          </h4>
          <p className="text-xs text-slate-500 mb-4">Ces couleurs ont une signification universelle et sont necessaires.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ColorAuditCard
              hex="#10B981"
              name="Green 500 / Emerald"
              usage="Succes, validation, match, disponible"
              justification="Couleur universelle de succes. Boutons 'Matcher', badges 'Disponible'."
              status="semantic"
              location="global, matching"
            />
            <ColorAuditCard
              hex="#EF4444"
              name="Red 500"
              usage="Erreur, suppression, refus"
              justification="Couleur universelle d'erreur. Boutons 'Supprimer', alertes."
              status="semantic"
              location="global, forms"
            />
            <ColorAuditCard
              hex="#F59E0B"
              name="Amber 500"
              usage="Warning, attention, en attente"
              justification="Couleur universelle d'avertissement. Badges 'En attente'."
              status="semantic"
              location="global, status"
            />
            <ColorAuditCard
              hex="#3B82F6"
              name="Blue 500"
              usage="Info, liens, focus"
              justification="Couleur universelle d'information. Liens, focus ring."
              status="semantic"
              location="global, focus"
            />
          </div>
        </div>

        {/* 6. COULEURS PROBLEMATIQUES / A VERIFIER */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            6. Couleurs a verifier / potentiellement hors charte
          </h4>
          <p className="text-xs text-slate-500 mb-4">Ces couleurs existent dans le code mais leur presence merite discussion.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ColorAuditCard
              hex="#06B6D4"
              name="Cyan 500"
              usage="Settings: titres et icones de section"
              justification="Couleur froide qui detonne avec les teintes chaudes de la marque. Alternative: utiliser les couleurs du role actif?"
              status="review"
              location="settings/page.tsx"
            />
            <ColorAuditCard
              hex="#8B5CF6"
              name="Violet 500"
              usage="Divers: badges, accents"
              justification="Entre le mauve Owner et le bleu. Redondant avec Owner?"
              status="review"
              location="components/ui/badge"
            />
            <ColorAuditCard
              hex="#A855F7"
              name="Purple 500"
              usage="Boutons secondaires, hover states"
              justification="Variation du mauve. Trop de nuances de violet?"
              status="review"
              location="buttons, cards"
            />
            <ColorAuditCard
              hex="#818CF8"
              name="Indigo 400"
              usage="Liens, accents tertiaires"
              justification="Bleu-violet utilise pour les liens. Coherent?"
              status="review"
              location="components"
            />
            <ColorAuditCard
              hex="#14B8A6"
              name="Teal 500"
              usage="Accents specifiques matching"
              justification="Vert-bleu proche du cyan. Double emploi avec cyan?"
              status="remove"
              location="matching"
            />
          </div>
        </div>

        {/* 7. GRADIENTS SECONDAIRES */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-gradient-to-r from-cyan-400 to-pink-400"></span>
            7. Gradients secondaires
          </h4>
          <p className="text-xs text-slate-500 mb-4">Gradients utilises en dehors du gradient signature.</p>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-yellow-500/50 bg-yellow-500/10">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-24 h-10 rounded-lg" style={{ background: 'linear-gradient(to right, #22D3EE, #F472B6)' }} />
                <div>
                  <h5 className="text-white font-medium">Cyan → Pink</h5>
                  <p className="text-xs text-slate-400">Settings headers decoratifs</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">
                Justification: Gradient decoratif utilise dans les settings. Ne fait pas partie de l'identite principale.
                Peut-etre remplacer par un gradient base sur le role de l'utilisateur?
              </p>
            </div>
            <div className="p-4 rounded-xl border border-green-500/50 bg-green-500/10">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-24 h-10 rounded-lg" style={{ background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)' }} />
                <div>
                  <h5 className="text-white font-medium">Mauve → Orange → Jaune</h5>
                  <p className="text-xs text-slate-400">Gradient signature officiel</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">
                Justification: C'est LE gradient signature EasyCo. A utiliser pour les CTA principaux et elements de marque.
              </p>
            </div>
          </div>
        </div>

        {/* RESUME / ACTIONS */}
        <div className="p-4 bg-slate-700/30 rounded-xl">
          <h4 className="font-semibold text-white mb-3">Resume des decisions a prendre:</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Couleurs des roles (Mauve, Orange, Jaune)</strong> - A conserver, c'est le coeur de l'identite</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Couleurs semantiques (Vert, Rouge, Jaune, Bleu)</strong> - Necessaires pour l'UX</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Nuances de slate</strong> - Necessaires pour l'interface sombre</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">?</span>
              <span><strong>Cyan/Turquoise</strong> - Revoir si coherent avec la direction artistique chaude</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">?</span>
              <span><strong>Pink/Rose</strong> - Revoir l'utilite, peut-etre limiter son usage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">?</span>
              <span><strong>Trop de nuances de violet</strong> - Simplifier la palette (Purple, Violet, Indigo)</span>
            </li>
          </ul>
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
        <h3 className="text-lg font-bold text-white mb-4">Gradient Signature EasyCo</h3>
        <p className="text-sm text-slate-400 mb-4">
          Gradient extrait du logo original (globals.css). Les 3 boutons utilisent le MEME gradient avec backgroundPosition pour afficher chaque portion.
        </p>

        {/* Le gradient signature complet */}
        <div className="mb-6 p-4 bg-slate-700/30 rounded-xl">
          <p className="text-xs text-slate-400 mb-2">Gradient signature complet (9 couleurs du logo) :</p>
          <div
            className="h-12 rounded-xl shadow-lg"
            style={{
              background: 'linear-gradient(to right, #7B5FB8, #A67BB8, #C98B9E, #D97B6F, #E8865D, #FF8C4B, #FFA040, #FFB85C, #FFD080)',
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>Owner</span>
            <span>Resident</span>
            <span>Searcher</span>
          </div>
        </div>

        {/* Bouton S'inscrire avec gradient complet */}
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-3">Bouton unifie avec gradient complet :</p>
          <button
            className="px-10 py-4 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            style={{
              background: 'linear-gradient(to right, #7B5FB8, #A67BB8, #C98B9E, #D97B6F, #E8865D, #FF8C4B, #FFA040, #FFB85C, #FFD080)',
            }}
          >
            S'inscrire
          </button>
        </div>

        {/* 3 boutons alignes = gradient complet */}
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-3">3 boutons alignes = gradient complet reconstitue :</p>
          <div className="flex gap-0">
            <button
              className="flex-1 px-6 py-3 text-white rounded-l-full font-medium shadow-lg hover:brightness-110 transition-all"
              style={{
                background: 'linear-gradient(to right, #7B5FB8, #A67BB8, #C98B9E, #D97B6F, #E8865D, #FF8C4B, #FFA040, #FFB85C, #FFD080)',
                backgroundSize: '300% 100%',
                backgroundPosition: '0% 50%',
              }}
            >
              Owner
            </button>
            <button
              className="flex-1 px-6 py-3 text-white font-medium shadow-lg hover:brightness-110 transition-all"
              style={{
                background: 'linear-gradient(to right, #7B5FB8, #A67BB8, #C98B9E, #D97B6F, #E8865D, #FF8C4B, #FFA040, #FFB85C, #FFD080)',
                backgroundSize: '300% 100%',
                backgroundPosition: '50% 50%',
              }}
            >
              Resident
            </button>
            <button
              className="flex-1 px-6 py-3 text-white rounded-r-full font-medium shadow-lg hover:brightness-110 transition-all"
              style={{
                background: 'linear-gradient(to right, #7B5FB8, #A67BB8, #C98B9E, #D97B6F, #E8865D, #FF8C4B, #FFA040, #FFB85C, #FFD080)',
                backgroundSize: '300% 100%',
                backgroundPosition: '100% 50%',
              }}
            >
              Searcher
            </button>
          </div>
        </div>

        {/* Boutons separes */}
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-3">Boutons separes (meme gradient, portions differentes) :</p>
          <div className="flex flex-wrap gap-4">
            <button
              className="px-6 py-3 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              style={{
                background: 'linear-gradient(to right, #7B5FB8, #A67BB8, #C98B9E, #D97B6F, #E8865D, #FF8C4B, #FFA040, #FFB85C, #FFD080)',
                backgroundSize: '300% 100%',
                backgroundPosition: '0% 50%',
              }}
            >
              Owner Style
            </button>
            <button
              className="px-6 py-3 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              style={{
                background: 'linear-gradient(to right, #7B5FB8, #A67BB8, #C98B9E, #D97B6F, #E8865D, #FF8C4B, #FFA040, #FFB85C, #FFD080)',
                backgroundSize: '300% 100%',
                backgroundPosition: '50% 50%',
              }}
            >
              Resident Style
            </button>
            <button
              className="px-6 py-3 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              style={{
                background: 'linear-gradient(to right, #7B5FB8, #A67BB8, #C98B9E, #D97B6F, #E8865D, #FF8C4B, #FFA040, #FFB85C, #FFD080)',
                backgroundSize: '300% 100%',
                backgroundPosition: '100% 50%',
              }}
            >
              Searcher Style
            </button>
          </div>
        </div>

        {/* Mapping visuel des 3 portions du logo */}
        <div className="p-4 bg-slate-700/30 rounded-xl">
          <h4 className="font-medium text-white mb-3">Portions du gradient par role (extraites du logo)</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-full h-10 rounded-lg mb-2 shadow-md" style={{ background: 'linear-gradient(to right, #7B5FB8, #A67BB8, #C98B9E)' }} />
              <p className="text-purple-400 font-semibold">Owner</p>
              <p className="text-slate-500 text-xs font-mono">#7B5FB8 → #C98B9E</p>
              <p className="text-slate-400 text-xs">mauve → rose</p>
            </div>
            <div className="text-center">
              <div className="w-full h-10 rounded-lg mb-2 shadow-md" style={{ background: 'linear-gradient(to right, #D97B6F, #E8865D, #FF8C4B)' }} />
              <p className="text-orange-400 font-semibold">Resident</p>
              <p className="text-slate-500 text-xs font-mono">#D97B6F → #FF8C4B</p>
              <p className="text-slate-400 text-xs">coral → orange</p>
            </div>
            <div className="text-center">
              <div className="w-full h-10 rounded-lg mb-2 shadow-md" style={{ background: 'linear-gradient(to right, #FFA040, #FFB85C, #FFD080)' }} />
              <p className="text-yellow-400 font-semibold">Searcher</p>
              <p className="text-slate-500 text-xs font-mono">#FFA040 → #FFD080</p>
              <p className="text-slate-400 text-xs">orange → jaune dore</p>
            </div>
          </div>
        </div>

        {/* Decomposition complete du gradient - chaque couleur */}
        <div className="mt-6 p-4 bg-slate-700/30 rounded-xl">
          <h4 className="font-medium text-white mb-4">Decomposition du gradient (9 couleurs)</h4>
          <div className="grid grid-cols-9 gap-2 mb-4">
            {[
              { hex: '#7B5FB8', name: 'Mauve profond', role: 'Owner' },
              { hex: '#A67BB8', name: 'Mauve clair', role: 'Owner' },
              { hex: '#C98B9E', name: 'Rose mauve', role: 'Owner' },
              { hex: '#D97B6F', name: 'Coral rose', role: 'Resident' },
              { hex: '#E8865D', name: 'Coral orange', role: 'Resident' },
              { hex: '#FF8C4B', name: 'Orange vif', role: 'Resident' },
              { hex: '#FFA040', name: 'Orange dore', role: 'Searcher' },
              { hex: '#FFB85C', name: 'Orange jaune', role: 'Searcher' },
              { hex: '#FFD080', name: 'Jaune dore', role: 'Searcher' },
            ].map((color, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-full aspect-square rounded-lg shadow-md border border-slate-600 mb-2"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="text-[10px] text-white font-mono">{color.hex}</p>
                <p className="text-[9px] text-slate-400">{color.name}</p>
                <p className={`text-[9px] font-medium ${
                  color.role === 'Owner' ? 'text-purple-400' :
                  color.role === 'Resident' ? 'text-orange-400' : 'text-yellow-400'
                }`}>{color.role}</p>
              </div>
            ))}
          </div>

          {/* Barre de gradient avec indicateurs */}
          <div className="relative">
            <div
              className="h-8 rounded-lg shadow-lg"
              style={{
                background: 'linear-gradient(to right, #7B5FB8, #A67BB8, #C98B9E, #D97B6F, #E8865D, #FF8C4B, #FFA040, #FFB85C, #FFD080)',
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-purple-400">← Owner</span>
              <span className="text-[10px] text-orange-400">Resident</span>
              <span className="text-[10px] text-yellow-400">Searcher →</span>
            </div>
          </div>
        </div>

        {/* Palette etendue avec variations */}
        <div className="mt-6 p-4 bg-slate-700/30 rounded-xl">
          <h4 className="font-medium text-white mb-4">Palette etendue par role</h4>

          {/* Owner palette */}
          <div className="mb-4">
            <p className="text-sm text-purple-400 font-semibold mb-2">Owner - Palette mauve/rose</p>
            <div className="grid grid-cols-6 gap-2">
              {[
                { hex: '#5A4589', name: 'Mauve fonce' },
                { hex: '#7B5FB8', name: 'Mauve 1' },
                { hex: '#A67BB8', name: 'Mauve 2' },
                { hex: '#C98B9E', name: 'Rose mauve' },
                { hex: '#D9A5B0', name: 'Rose clair' },
                { hex: '#E8C5CC', name: 'Rose pale' },
              ].map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-full h-10 rounded-lg shadow-md border border-slate-600"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-[10px] text-white font-mono mt-1">{color.hex}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resident palette */}
          <div className="mb-4">
            <p className="text-sm text-orange-400 font-semibold mb-2">Resident - Palette coral/orange</p>
            <div className="grid grid-cols-6 gap-2">
              {[
                { hex: '#B85A4F', name: 'Coral fonce' },
                { hex: '#D97B6F', name: 'Coral 1' },
                { hex: '#E8865D', name: 'Coral 2' },
                { hex: '#FF8C4B', name: 'Orange vif' },
                { hex: '#FFA672', name: 'Orange clair' },
                { hex: '#FFC4A0', name: 'Peche' },
              ].map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-full h-10 rounded-lg shadow-md border border-slate-600"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-[10px] text-white font-mono mt-1">{color.hex}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Searcher palette */}
          <div>
            <p className="text-sm text-yellow-400 font-semibold mb-2">Searcher - Palette orange/jaune</p>
            <div className="grid grid-cols-6 gap-2">
              {[
                { hex: '#E08020', name: 'Orange fonce' },
                { hex: '#FFA040', name: 'Orange dore 1' },
                { hex: '#FFB85C', name: 'Orange dore 2' },
                { hex: '#FFD080', name: 'Jaune dore' },
                { hex: '#FFE0A0', name: 'Jaune clair' },
                { hex: '#FFF0D0', name: 'Creme' },
              ].map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-full h-10 rounded-lg shadow-md border border-slate-600"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-[10px] text-white font-mono mt-1">{color.hex}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code reference */}
        <div className="mt-4 p-3 bg-slate-900 rounded-lg">
          <p className="text-xs text-slate-400 mb-2">Gradient signature (a utiliser partout) :</p>
          <code className="text-xs text-green-400 font-mono break-all">
            linear-gradient(to right, #7B5FB8, #A67BB8, #C98B9E, #D97B6F, #E8865D, #FF8C4B, #FFA040, #FFB85C, #FFD080)
          </code>
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
   PROPERTY CARDS SECTION
   ============================================ */
function PropertyCardsSection() {
  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Property Cards</h3>
        <p className="text-sm text-slate-400 mb-6">
          Tous les types de cartes pour afficher les propriétés dans l'application.
        </p>

        {/* PropertyCard - Default */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-400" />
            PropertyCard - Version Default (Large)
          </h4>
          <p className="text-xs text-slate-500 mb-4">Carte principale utilisée dans les listes de propriétés.</p>
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="max-w-sm">
              <div className="relative rounded-2xl overflow-hidden bg-slate-800 shadow-xl">
                <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-600">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-orange-500 text-white text-xs font-medium rounded-full">Featured</span>
                  </div>
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
                    <span className="text-white font-bold">850€</span>
                    <span className="text-white/70 text-sm">/mois</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">Appartement Bastille</h3>
                  <p className="text-sm text-slate-400 flex items-center gap-1 mb-3">
                    <MapPin className="w-3 h-3" /> Paris 11ème
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> 2</span>
                    <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> 1</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 3 colocs</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-slate-800" />
                      <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-slate-800" />
                      <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-slate-800" />
                    </div>
                    <span className="text-xs text-slate-400">3 résidents</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">Voir</button>
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white text-sm rounded-lg font-medium">Réserver visite</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-400">
              <strong className="text-white">Fichier:</strong> components/PropertyCard.tsx<br />
              <strong className="text-white">Variantes:</strong> default (large), compact (petit)
            </p>
          </div>
        </div>

        {/* PropertyCard - Compact */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-400" />
            PropertyCard - Version Compact
          </h4>
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="max-w-md">
              <div className="flex gap-3 bg-slate-800 rounded-xl p-3 border border-slate-700">
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-slate-700 to-slate-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm truncate">Studio Marais</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> Paris 4ème</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> 1</span>
                    <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> 1</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-white">650€<span className="text-slate-400 font-normal">/mois</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PropertyMarkerCard */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-400" />
            PropertyMarkerCard - Carte Map
          </h4>
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="inline-block">
              <div className="relative bg-slate-800 rounded-lg overflow-hidden shadow-xl border border-slate-700">
                <div className="w-32 h-24 bg-gradient-to-br from-slate-700 to-slate-600" />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-bold text-slate-900">750€</div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-700" />
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-400"><strong className="text-white">Fichier:</strong> components/PropertyMarkerCard.tsx</p>
          </div>
        </div>

        {/* PropertyMatchCard */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            PropertyMatchCard - Carte Match
          </h4>
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="max-w-sm">
              <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
                <div className="relative h-40 bg-gradient-to-br from-slate-700 to-slate-600">
                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-green-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                    <span>92%</span><span>🎯</span>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 bg-blue-500/80 text-white text-xs rounded-full">Vu</span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-1">Coloc Montmartre</h4>
                  <p className="text-sm text-slate-400 mb-3">Paris 18ème • 780€/mois</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 w-20">Budget</span>
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 w-20">Localisation</span>
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium">Contacter</button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-400"><strong className="text-white">Fichier:</strong> components/matching/PropertyMatchCard.tsx</p>
          </div>
        </div>

        {/* PropertySwipeCard */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            PropertySwipeCard - Carte Swipe
          </h4>
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="max-w-xs mx-auto">
              <div className="relative bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
                <div className="relative h-64 bg-gradient-to-br from-orange-400/20 via-purple-500/20 to-yellow-400/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500 text-white font-bold rounded-full text-sm">87% 💚</div>
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-orange-500 text-white text-xs font-medium rounded-full">⭐ Featured</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">Loft Belleville</h3>
                    <p className="text-white/80 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> Paris 20ème</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-800/80 backdrop-blur-xl">
                  <div className="flex justify-around mb-4 text-center">
                    <div><p className="text-lg font-bold text-white">920€</p><p className="text-xs text-slate-400">par mois</p></div>
                    <div><p className="text-lg font-bold text-white">2</p><p className="text-xs text-slate-400">chambres</p></div>
                    <div><p className="text-lg font-bold text-white">3</p><p className="text-xs text-slate-400">colocs</p></div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">🛋️ Meublé</span>
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">📶 WiFi</span>
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">🐕 Animaux</span>
                  </div>
                  <div className="flex justify-center gap-8 pt-2">
                    <button className="w-14 h-14 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center"><X className="w-6 h-6 text-red-500" /></button>
                    <button className="w-14 h-14 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center"><Star className="w-6 h-6 text-yellow-500" /></button>
                    <button className="w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"><Heart className="w-6 h-6 text-green-500" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-400"><strong className="text-white">Fichier:</strong> components/matching/PropertySwipeCard.tsx</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   PROFILE CARDS SECTION
   ============================================ */
function ProfileCardsSection() {
  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Profile Cards</h3>
        <p className="text-sm text-slate-400 mb-6">Cartes pour afficher les profils des résidents.</p>

        {/* Compact */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            ResidentProfileCard - Compact
          </h4>
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="flex gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600" />
                  <span className="absolute -bottom-1 -right-1 px-1 bg-slate-700 text-[10px] text-white rounded">28</span>
                </div>
                <div><p className="text-sm font-medium text-white">Marie</p><p className="text-xs text-slate-400">Designer</p></div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600" />
                  <span className="absolute -bottom-1 -right-1 px-1 bg-slate-700 text-[10px] text-white rounded">32</span>
                </div>
                <div><p className="text-sm font-medium text-white">Thomas</p><p className="text-xs text-slate-400">Dev</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Full */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            ResidentProfileCard - Complet
          </h4>
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="max-w-sm">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="relative p-6 bg-gradient-to-br from-purple-500/20 to-orange-500/20">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-white text-xl font-bold">M</div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Marie Dupont</h4>
                      <p className="text-sm text-slate-300">28 ans • Designer UX</p>
                      <div className="flex gap-1 mt-1">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">🇫🇷 FR</span>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">🇬🇧 EN</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b border-slate-700">
                  <p className="text-sm text-slate-300">"Passionnée de design et de voyages. Je cherche une coloc calme."</p>
                </div>
                <div className="p-4 border-b border-slate-700">
                  <p className="text-xs text-slate-400 mb-2">Centres d'intérêt</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">🎨 Art</span>
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">✈️ Voyages</span>
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">🧘 Yoga</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-400 mb-3">Mode de vie</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">Propreté</span>
                      <span className="text-xs text-green-400">Ordonnée</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">Bruit</span>
                      <span className="text-xs text-blue-400">Calme</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-700">
                      <span className="text-xs text-slate-400">🚭 Non-fumeur</span>
                      <span className="text-xs text-slate-400">🐱 Chat</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-400"><strong className="text-white">Fichier:</strong> components/ResidentProfileCard.tsx</p>
          </div>
        </div>

        {/* Avatar stacking */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            Avatar Stacking
          </h4>
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="flex items-center gap-8">
              <div>
                <div className="flex -space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-slate-900" />
                  <div className="w-10 h-10 rounded-full bg-orange-500 border-2 border-slate-900" />
                  <div className="w-10 h-10 rounded-full bg-yellow-500 border-2 border-slate-900" />
                </div>
                <p className="text-xs text-slate-400">3 résidents</p>
              </div>
              <div>
                <div className="flex -space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-slate-900" />
                  <div className="w-10 h-10 rounded-full bg-orange-500 border-2 border-slate-900" />
                  <div className="w-10 h-10 rounded-full bg-yellow-500 border-2 border-slate-900" />
                  <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-300 font-medium">+2</div>
                </div>
                <p className="text-xs text-slate-400">5 résidents</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   DROPDOWNS SECTION
   ============================================ */
function DropdownsSection() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Dropdowns</h3>
        <p className="text-sm text-slate-400 mb-6">Menus déroulants de l'application.</p>

        {/* Profile Dropdown */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            Profile Dropdown
          </h4>
          <div className="bg-slate-900 rounded-xl p-6 min-h-[320px]">
            <div className="relative inline-block">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-full border border-slate-700 hover:border-slate-600">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              {profileOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden z-10">
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 via-orange-500/20 to-yellow-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-white font-bold">M</div>
                      <div><p className="font-semibold text-white">Marie Dupont</p><span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Searcher</span></div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-slate-700 space-y-2">
                    <p className="text-sm text-slate-400 flex items-center gap-2"><Mail className="w-4 h-4" /> marie@example.com</p>
                    <p className="text-sm text-slate-400 flex items-center gap-2"><Calendar className="w-4 h-4" /> 15 mars 1996</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 rounded-lg flex items-center gap-2"><Settings className="w-4 h-4" /> Paramètres</button>
                    <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2"><Lock className="w-4 h-4" /> Déconnexion</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-400"><strong className="text-white">Fichier:</strong> components/ProfileDropdown.tsx</p>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-400" />
            Notifications Dropdown
          </h4>
          <div className="bg-slate-900 rounded-xl p-6 min-h-[300px]">
            <div className="relative inline-block">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 bg-slate-800 rounded-full border border-slate-700 hover:border-slate-600">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">3</span>
              </button>
              {notifOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden z-10">
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-yellow-500/20 flex items-center justify-between">
                    <h4 className="font-semibold text-white">Notifications</h4>
                    <button className="text-xs text-slate-400 hover:text-white">Tout marquer lu</button>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <div className="p-3 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"><Heart className="w-4 h-4 text-green-400" /></div>
                        <div className="flex-1"><p className="text-sm text-white">Nouveau match!</p><p className="text-xs text-slate-400">Appartement Bastille 92%</p><p className="text-xs text-slate-500 mt-1">Il y a 5 min</p></div>
                      </div>
                    </div>
                    <div className="p-3 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><MessageCircle className="w-4 h-4 text-blue-400" /></div>
                        <div className="flex-1"><p className="text-sm text-white">Message de Thomas</p><p className="text-xs text-slate-400">Salut! La chambre est dispo...</p><p className="text-xs text-slate-500 mt-1">Il y a 1h</p></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-slate-700"><button className="w-full text-center text-sm text-purple-400 hover:text-purple-300">Voir tout</button></div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-400"><strong className="text-white">Fichier:</strong> components/NotificationsDropdown.tsx</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Language Selector
          </h4>
          <div className="bg-slate-900 rounded-xl p-6 min-h-[200px]">
            <div className="relative inline-block">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600">
                <span className="text-lg">🇫🇷</span><span className="text-sm text-slate-300">FR</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden z-10">
                  <button className="w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center gap-2 bg-purple-500/10">
                    <span className="text-lg">🇫🇷</span><span className="text-sm text-white">Français</span><Check className="w-4 h-4 text-purple-400 ml-auto" />
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center gap-2"><span className="text-lg">🇬🇧</span><span className="text-sm text-slate-300">English</span></button>
                  <button className="w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center gap-2"><span className="text-lg">🇳🇱</span><span className="text-sm text-slate-300">Nederlands</span></button>
                  <button className="w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center gap-2"><span className="text-lg">🇩🇪</span><span className="text-sm text-slate-300">Deutsch</span></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   GRADIENT USAGE SECTION
   ============================================ */
function GradientUsageSection() {
  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Utilisation du Gradient Signature</h3>
        <p className="text-sm text-slate-400 mb-6">Le gradient <code className="text-purple-400">#6E56CF → #FF6F3C → #FFD249</code> doit être utilisé avec parcimonie.</p>

        {/* Règle d'or */}
        <div className="mb-8 p-4 bg-gradient-to-r from-purple-500/10 via-orange-500/10 to-yellow-500/10 border border-purple-500/30 rounded-xl">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-400" />Règle d'or</h4>
          <p className="text-sm text-slate-300">Le gradient signature représente <strong>l'ensemble des rôles EasyCo</strong>. Utilisé uniquement pour les <strong>moments clés</strong> et <strong>CTA principaux</strong>.</p>
        </div>

        {/* Utilisations recommandées */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2"><Check className="w-5 h-5 text-green-400" />Utilisations recommandées</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-xl p-4 border border-green-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">Actuel</span>
                <span className="text-sm font-medium text-white">Landing Page</span>
              </div>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-[#6E56CF] via-[#FF6F3C] to-[#FFD249] text-white rounded-full font-semibold shadow-lg">S'inscrire</button>
              <p className="text-xs text-slate-500 mt-2">CTA principal unique</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Proposition</span>
                <span className="text-sm font-medium text-white">Onboarding - Fin d'étape</span>
              </div>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-[#6E56CF] via-[#FF6F3C] to-[#FFD249] text-white rounded-full font-semibold shadow-lg">Continuer →</button>
              <p className="text-xs text-slate-500 mt-2">Marque la progression</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Proposition</span>
                <span className="text-sm font-medium text-white">Matching - Super Like</span>
              </div>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-[#6E56CF] via-[#FF6F3C] to-[#FFD249] text-white rounded-full font-semibold shadow-lg flex items-center justify-center gap-2"><Star className="w-5 h-5" /> Super Like</button>
              <p className="text-xs text-slate-500 mt-2">Action premium</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Proposition</span>
                <span className="text-sm font-medium text-white">Badge Vérifié</span>
              </div>
              <span className="px-3 py-1.5 bg-gradient-to-r from-[#6E56CF] via-[#FF6F3C] to-[#FFD249] text-white text-sm rounded-full font-medium inline-flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Profil Vérifié</span>
              <p className="text-xs text-slate-500 mt-2">Statut premium</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Proposition</span>
                <span className="text-sm font-medium text-white">Empty State</span>
              </div>
              <div className="flex justify-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6E56CF] via-[#FF6F3C] to-[#FFD249] flex items-center justify-center"><Search className="w-8 h-8 text-white" /></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">Attire l'attention</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Proposition</span>
                <span className="text-sm font-medium text-white">Logo Mobile</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6E56CF] via-[#FF6F3C] to-[#FFD249] flex items-center justify-center"><span className="text-white font-bold text-lg">E</span></div>
                <span className="text-white font-semibold">EasyCo</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Rappel de marque</p>
            </div>
          </div>
        </div>

        {/* À éviter */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2"><X className="w-5 h-5 text-red-400" />À éviter</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-xl p-4 border border-red-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">Éviter</span>
                <span className="text-sm font-medium text-white">Navigation</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-gradient-to-r from-[#6E56CF] via-[#FF6F3C] to-[#FFD249] text-white rounded-lg text-xs">Accueil</button>
                <button className="px-3 py-1.5 bg-gradient-to-r from-[#6E56CF] via-[#FF6F3C] to-[#FFD249] text-white rounded-lg text-xs">Recherche</button>
              </div>
              <p className="text-xs text-red-400 mt-2">Perd son impact</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-red-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">Éviter</span>
                <span className="text-sm font-medium text-white">Éléments répétitifs</span>
              </div>
              <div className="space-y-1">
                <div className="p-2 bg-gradient-to-r from-[#6E56CF]/20 to-[#FFD249]/20 rounded border border-purple-500/30 text-xs text-slate-300">Item 1</div>
                <div className="p-2 bg-gradient-to-r from-[#6E56CF]/20 to-[#FFD249]/20 rounded border border-purple-500/30 text-xs text-slate-300">Item 2</div>
              </div>
              <p className="text-xs text-red-400 mt-2">Effet arc-en-ciel</p>
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div className="p-4 bg-slate-700/30 rounded-xl">
          <h4 className="font-semibold text-white mb-3">Résumé</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-green-400 font-medium mb-2">✓ Utiliser pour:</p>
              <ul className="text-slate-300 space-y-1">
                <li>• CTA principal (1 par page max)</li>
                <li>• Moments clés (inscription, match)</li>
                <li>• Récompenses (badges, vérifié)</li>
                <li>• Logo et identité</li>
              </ul>
            </div>
            <div>
              <p className="text-red-400 font-medium mb-2">✗ Ne pas utiliser:</p>
              <ul className="text-slate-300 space-y-1">
                <li>• Navigation quotidienne</li>
                <li>• Boutons secondaires</li>
                <li>• Éléments répétitifs</li>
                <li>• Plusieurs fois par page</li>
              </ul>
            </div>
          </div>
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

// Type for saved design choices from database
interface SavedChoice {
  id: string;
  session_id: string;
  choice_key: string;
  choice_title: string;
  selected_version: 'v1' | 'v2';
  v1_label: string;
  v2_label: string;
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

function ChoicesSection() {
  const [selectedChoices, setSelectedChoices] = useState<Record<string, 'v1' | 'v2'>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [sessionId, setSessionId] = useState<string>('');
  const [savedChoices, setSavedChoices] = useState<SavedChoice[]>([]);
  const [loadingChoices, setLoadingChoices] = useState(true);

  // Load saved choices from database
  const loadSavedChoices = useCallback(async () => {
    setLoadingChoices(true);
    try {
      const { data, error } = await supabase
        .from('design_choices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading choices:', error);
      } else {
        setSavedChoices(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoadingChoices(false);
    }
  }, []);

  useEffect(() => {
    setSessionId(getSessionId());
    loadSavedChoices();
  }, [loadSavedChoices]);

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
      // Refresh saved choices after saving
      loadSavedChoices();
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

  // Group choices by session for display
  const groupedBySession = savedChoices.reduce((acc, choice) => {
    if (!acc[choice.session_id]) {
      acc[choice.session_id] = [];
    }
    acc[choice.session_id].push(choice);
    return acc;
  }, {} as Record<string, SavedChoice[]>);

  return (
    <div className="space-y-6">
      {/* SECTION: Résultats enregistrés */}
      <div className="bg-gradient-to-r from-purple-500/10 via-orange-500/10 to-yellow-500/10 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Choix enregistrés
          </h3>
          <button
            onClick={loadSavedChoices}
            className="text-sm text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className={`w-4 h-4 ${loadingChoices ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {loadingChoices ? (
          <div className="text-center py-8 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Chargement des choix...
          </div>
        ) : savedChoices.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>Aucun choix enregistré pour le moment.</p>
            <p className="text-sm mt-1">Fais tes choix ci-dessous et clique sur "Sauvegarder".</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedBySession).map(([sessId, choices]) => (
              <div key={sessId} className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
                  <span className="text-xs text-slate-500 font-mono">Session: {sessId.substring(0, 20)}...</span>
                  <span className="text-xs text-slate-600">
                    {new Date(choices[0]?.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {choices.map((choice) => (
                    <div
                      key={choice.id}
                      className={`p-3 rounded-lg border ${
                        choice.selected_version === 'v1'
                          ? 'bg-blue-500/10 border-blue-500/30'
                          : 'bg-green-500/10 border-green-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white text-sm">{choice.choice_title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          choice.selected_version === 'v1'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {choice.selected_version === 'v1' ? choice.v1_label : choice.v2_label}
                        </span>
                      </div>
                      {choice.feedback && (
                        <div className="mt-2 pt-2 border-t border-slate-700">
                          <p className="text-xs text-slate-400 italic">"{choice.feedback}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
