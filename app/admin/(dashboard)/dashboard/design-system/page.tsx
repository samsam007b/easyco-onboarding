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
  PawPrint,
  Plane,
  CigaretteOff,
  Languages,
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
  HelpCircle,
  Ban,
  ShieldCheck,
  ShieldAlert,
  Unlock,
  Moon as MoonIcon,
  Sun as SunIcon,
  Wrench,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import PropertyCard from '@/components/PropertyCard';

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

  // Couleurs dominantes selectionnees (index 1-5, 3 = centre par defaut)
  const [ownerDominant, setOwnerDominant] = useState<number>(3);
  const [residentDominant, setResidentDominant] = useState<number>(3);
  const [searcherDominant, setSearcherDominant] = useState<number>(3);

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

  // Helper pour obtenir la couleur dominante d'une palette
  const getDominantColor = (palette: ReturnType<typeof generateColorPalette>, index: number): string => {
    const colors = [palette.color1, palette.color2, palette.color3, palette.color4, palette.color5];
    return colors[index - 1] || palette.color3;
  };

  // Couleurs dominantes actuelles
  const ownerDominantColor = getDominantColor(ownerPalette, ownerDominant);
  const residentDominantColor = getDominantColor(residentPalette, residentDominant);
  const searcherDominantColor = getDominantColor(searcherPalette, searcherDominant);

  // Fonction de sauvegarde
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    const config = {
      owner: {
        pos: ownerPos,
        width: ownerWidth,
        palette: ownerPalette,
        dominantIndex: ownerDominant,
        dominantColor: ownerDominantColor
      },
      resident: {
        pos: residentPos,
        width: residentWidth,
        palette: residentPalette,
        dominantIndex: residentDominant,
        dominantColor: residentDominantColor
      },
      searcher: {
        pos: searcherPos,
        width: searcherWidth,
        palette: searcherPalette,
        dominantIndex: searcherDominant,
        dominantColor: searcherDominantColor
      },
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

  // Composant pour afficher les carres de couleurs REELLES du gradient (cliquables)
  const ColorSwatches = ({
    palette,
    selectedIndex,
    onSelect,
    role
  }: {
    palette: ReturnType<typeof generateColorPalette>;
    selectedIndex: number;
    onSelect: (index: number) => void;
    role: 'owner' | 'resident' | 'searcher';
  }) => {
    const colors = [palette.color1, palette.color2, palette.color3, palette.color4, palette.color5];
    const labels = ['0%', '25%', '50%', '75%', '100%'];

    return (
      <div className="flex gap-1 mt-2">
        {colors.map((color, i) => (
          <button
            key={i}
            onClick={() => onSelect(i + 1)}
            className={`group relative cursor-pointer transition-all duration-200 ${
              selectedIndex === i + 1
                ? 'scale-110 z-10'
                : 'hover:scale-105'
            }`}
          >
            <div
              className={`w-8 h-8 rounded transition-all ${
                selectedIndex === i + 1
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 shadow-lg'
                  : 'border border-slate-600 hover:border-slate-400'
              }`}
              style={{ background: color }}
            />
            {selectedIndex === i + 1 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow">
                <Check className="w-2 h-2 text-slate-800" />
              </div>
            )}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {labels[i]}
            </span>
          </button>
        ))}
      </div>
    );
  };

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
            <p className="text-xs text-slate-400 mb-2">Clique pour choisir la couleur dominante :</p>
            <div className="flex justify-center">
              <ColorSwatches
                palette={ownerPalette}
                selectedIndex={ownerDominant}
                onSelect={setOwnerDominant}
                role="owner"
              />
            </div>
            {/* Couleur dominante selectionnee */}
            <div className="mt-6 p-3 bg-slate-700/50 rounded-lg">
              <p className="text-[10px] text-slate-400 mb-2">Couleur dominante Owner :</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-lg shadow-lg border-2 border-white/20" style={{ background: ownerDominantColor }} />
                <code className="text-sm text-purple-400 font-mono">{ownerDominantColor}</code>
              </div>
            </div>
          </div>

          {/* Resident */}
          <div className="text-center">
            <button className="w-full px-8 py-3 text-white rounded-full font-semibold shadow-xl hover:scale-105 transition-transform mb-3"
              style={{ background: getRoleGradient(residentPos, residentWidth) }}>Interface Resident</button>
            <p className="text-xs text-slate-400 mb-2">Clique pour choisir la couleur dominante :</p>
            <div className="flex justify-center">
              <ColorSwatches
                palette={residentPalette}
                selectedIndex={residentDominant}
                onSelect={setResidentDominant}
                role="resident"
              />
            </div>
            {/* Couleur dominante selectionnee */}
            <div className="mt-6 p-3 bg-slate-700/50 rounded-lg">
              <p className="text-[10px] text-slate-400 mb-2">Couleur dominante Resident :</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-lg shadow-lg border-2 border-white/20" style={{ background: residentDominantColor }} />
                <code className="text-sm text-orange-400 font-mono">{residentDominantColor}</code>
              </div>
            </div>
          </div>

          {/* Searcher */}
          <div className="text-center">
            <button className="w-full px-8 py-3 text-white rounded-full font-semibold shadow-xl hover:scale-105 transition-transform mb-3"
              style={{ background: getRoleGradient(searcherPos, searcherWidth) }}>Interface Searcher</button>
            <p className="text-xs text-slate-400 mb-2">Clique pour choisir la couleur dominante :</p>
            <div className="flex justify-center">
              <ColorSwatches
                palette={searcherPalette}
                selectedIndex={searcherDominant}
                onSelect={setSearcherDominant}
                role="searcher"
              />
            </div>
            {/* Couleur dominante selectionnee */}
            <div className="mt-6 p-3 bg-slate-700/50 rounded-lg">
              <p className="text-[10px] text-slate-400 mb-2">Couleur dominante Searcher :</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-lg shadow-lg border-2 border-white/20" style={{ background: searcherDominantColor }} />
                <code className="text-sm text-yellow-400 font-mono">{searcherDominantColor}</code>
              </div>
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
            <div className="bg-purple-500/20 rounded px-1 py-0.5"><span className="text-white">--owner-primary:</span> <code className="text-green-400">{ownerDominantColor};</code> <span className="text-purple-300">/* DOMINANTE */</span></div>
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
            <div className="bg-orange-500/20 rounded px-1 py-0.5"><span className="text-white">--resident-primary:</span> <code className="text-green-400">{residentDominantColor};</code> <span className="text-orange-300">/* DOMINANTE */</span></div>
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
            <div className="bg-yellow-500/20 rounded px-1 py-0.5"><span className="text-white">--searcher-primary:</span> <code className="text-green-400">{searcherDominantColor};</code> <span className="text-yellow-300">/* DOMINANTE */</span></div>
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
            <p className="text-[10px] text-slate-600 mt-1 font-mono flex items-center gap-1"><Folder className="w-3 h-3" /> {location}</p>
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
              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span><strong>Couleurs des roles (Mauve, Orange, Jaune)</strong> - A conserver, c'est le coeur de l'identite</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span><strong>Couleurs semantiques (Vert, Rouge, Jaune, Bleu)</strong> - Necessaires pour l'UX</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span><strong>Nuances de slate</strong> - Necessaires pour l'interface sombre</span>
            </li>
            <li className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span><strong>Cyan/Turquoise</strong> - Revoir si coherent avec la direction artistique chaude</span>
            </li>
            <li className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span><strong>Pink/Rose</strong> - Revoir l'utilite, peut-etre limiter son usage</span>
            </li>
            <li className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
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

      {/* ============================================
          CTA BUTTONS LANDING - PROPOSITIONS
          ============================================ */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">CTA Landing Page - Propositions</h3>
        <p className="text-sm text-slate-400 mb-6">
          Alternatives aux boutons "Je loue mon bien" / "Je suis résident" pour éviter l'effet arc-en-ciel
        </p>

        {/* ACTUEL - Pour référence */}
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-sm font-semibold text-red-400 mb-4">❌ ACTUEL (à remplacer) - Effet arc-en-ciel</p>
          <div className="flex flex-wrap gap-4 items-center justify-center py-4" style={{ background: 'linear-gradient(135deg, rgba(110, 86, 207, 0.3) 0%, rgba(255, 111, 60, 0.3) 50%, rgba(255, 210, 73, 0.3) 100%)', borderRadius: '16px' }}>
            <button
              className="group relative overflow-hidden text-white font-bold px-8 py-5 rounded-full shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #6E56CF 0%, #B76386 100%)' }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-base">Je loue mon bien</span>
              </div>
            </button>
            <button
              className="group relative overflow-hidden text-white font-bold px-8 py-5 rounded-full shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)' }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-base">Je suis résident</span>
              </div>
            </button>
          </div>
        </div>

        {/* PROPOSITION A - Couleurs solides */}
        <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <p className="text-sm font-semibold text-green-400 mb-2">✨ Proposition A - Couleurs solides</p>
          <p className="text-xs text-slate-400 mb-4">Pas de dégradé du tout - couleurs primaires par rôle</p>
          <div className="flex flex-wrap gap-4 items-center justify-center py-4" style={{ background: 'linear-gradient(135deg, rgba(110, 86, 207, 0.3) 0%, rgba(255, 111, 60, 0.3) 50%, rgba(255, 210, 73, 0.3) 100%)', borderRadius: '16px' }}>
            <button
              className="group text-white font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              style={{ backgroundColor: '#6E56CF' }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-base">Je loue mon bien</span>
              </div>
            </button>
            <button
              className="group text-white font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              style={{ backgroundColor: '#FF6F3C' }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-base">Je suis résident</span>
              </div>
            </button>
          </div>
        </div>

        {/* PROPOSITION B - Dégradé subtil même famille */}
        <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <p className="text-sm font-semibold text-blue-400 mb-2">✨ Proposition B - Dégradé subtil (même famille)</p>
          <p className="text-xs text-slate-400 mb-4">Dégradé dans la même teinte (clair → foncé) - pas d'arc-en-ciel</p>
          <div className="flex flex-wrap gap-4 items-center justify-center py-4" style={{ background: 'linear-gradient(135deg, rgba(110, 86, 207, 0.3) 0%, rgba(255, 111, 60, 0.3) 50%, rgba(255, 210, 73, 0.3) 100%)', borderRadius: '16px' }}>
            <button
              className="group text-white font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #8B7AD0 0%, #5A45A0 100%)' }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-base">Je loue mon bien</span>
              </div>
            </button>
            <button
              className="group text-white font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #FF9060 0%, #E85A30 100%)' }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-base">Je suis résident</span>
              </div>
            </button>
          </div>
        </div>

        {/* PROPOSITION C - Outline avec couleur */}
        <div className="mb-8 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <p className="text-sm font-semibold text-purple-400 mb-2">✨ Proposition C - Style Outline</p>
          <p className="text-xs text-slate-400 mb-4">Bordure colorée + fond transparent/blanc - élégant et minimaliste</p>
          <div className="flex flex-wrap gap-4 items-center justify-center py-4" style={{ background: 'linear-gradient(135deg, rgba(110, 86, 207, 0.3) 0%, rgba(255, 111, 60, 0.3) 50%, rgba(255, 210, 73, 0.3) 100%)', borderRadius: '16px' }}>
            <button
              className="group font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-2 bg-white/90 backdrop-blur-sm hover:bg-white"
              style={{ borderColor: '#6E56CF', color: '#6E56CF' }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6E56CF20' }}>
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-base">Je loue mon bien</span>
              </div>
            </button>
            <button
              className="group font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-2 bg-white/90 backdrop-blur-sm hover:bg-white"
              style={{ borderColor: '#FF6F3C', color: '#FF6F3C' }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6F3C20' }}>
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-base">Je suis résident</span>
              </div>
            </button>
          </div>
        </div>

        {/* PROPOSITION D - Glassmorphism léger */}
        <div className="mb-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <p className="text-sm font-semibold text-cyan-400 mb-2">✨ Proposition D - Glassmorphism + teinte</p>
          <p className="text-xs text-slate-400 mb-4">Fond verre dépoli avec une légère teinte de la couleur du rôle</p>
          <div className="flex flex-wrap gap-4 items-center justify-center py-4" style={{ background: 'linear-gradient(135deg, rgba(110, 86, 207, 0.3) 0%, rgba(255, 111, 60, 0.3) 50%, rgba(255, 210, 73, 0.3) 100%)', borderRadius: '16px' }}>
            <button
              className="group text-white font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all backdrop-blur-xl border border-white/30"
              style={{ background: 'rgba(110, 86, 207, 0.6)' }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-base">Je loue mon bien</span>
              </div>
            </button>
            <button
              className="group text-white font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all backdrop-blur-xl border border-white/30"
              style={{ background: 'rgba(255, 111, 60, 0.6)' }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-base">Je suis résident</span>
              </div>
            </button>
          </div>
        </div>

        {/* PROPOSITION E - Blanc + icône colorée */}
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <p className="text-sm font-semibold text-yellow-400 mb-2">✨ Proposition E - Blanc + accent coloré</p>
          <p className="text-xs text-slate-400 mb-4">Bouton blanc avec icône/bordure gauche colorée - style épuré Apple</p>
          <div className="flex flex-wrap gap-4 items-center justify-center py-4" style={{ background: 'linear-gradient(135deg, rgba(110, 86, 207, 0.3) 0%, rgba(255, 111, 60, 0.3) 50%, rgba(255, 210, 73, 0.3) 100%)', borderRadius: '16px' }}>
            <button className="group font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-white text-gray-800 border-l-4" style={{ borderLeftColor: '#6E56CF' }}>
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6E56CF' }}>
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-base">Je loue mon bien</span>
              </div>
            </button>
            <button className="group font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-white text-gray-800 border-l-4" style={{ borderLeftColor: '#FF6F3C' }}>
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6F3C' }}>
                  <Home className="w-4 h-4 text-white" />
                </div>
                <span className="text-base">Je suis résident</span>
              </div>
            </button>
          </div>
        </div>

        {/* PROPOSITION F - Pills modernes avec ombre colorée */}
        <div className="mb-8 p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl">
          <p className="text-sm font-semibold text-pink-400 mb-2">✨ Proposition F - Ombre colorée diffuse</p>
          <p className="text-xs text-slate-400 mb-4">Fond solide + ombre diffuse de la couleur - effet moderne "glow"</p>
          <div className="flex flex-wrap gap-4 items-center justify-center py-4" style={{ background: 'linear-gradient(135deg, rgba(110, 86, 207, 0.3) 0%, rgba(255, 111, 60, 0.3) 50%, rgba(255, 210, 73, 0.3) 100%)', borderRadius: '16px' }}>
            <button
              className="group text-white font-bold px-8 py-5 rounded-full hover:scale-105 transition-all"
              style={{ backgroundColor: '#6E56CF', boxShadow: '0 10px 40px -10px rgba(110, 86, 207, 0.7)' }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-base">Je loue mon bien</span>
              </div>
            </button>
            <button
              className="group text-white font-bold px-8 py-5 rounded-full hover:scale-105 transition-all"
              style={{ backgroundColor: '#FF6F3C', boxShadow: '0 10px 40px -10px rgba(255, 111, 60, 0.7)' }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-base">Je suis résident</span>
              </div>
            </button>
          </div>
        </div>

        {/* PROPOSITION G - Noir/Blanc élégant */}
        <div className="mb-8 p-4 bg-slate-500/10 border border-slate-500/30 rounded-xl">
          <p className="text-sm font-semibold text-slate-300 mb-2">✨ Proposition G - Noir & Blanc premium</p>
          <p className="text-xs text-slate-400 mb-4">Boutons noir/blanc avec icône colorée uniquement - très élégant, luxe</p>
          <div className="flex flex-wrap gap-4 items-center justify-center py-4" style={{ background: 'linear-gradient(135deg, rgba(110, 86, 207, 0.3) 0%, rgba(255, 111, 60, 0.3) 50%, rgba(255, 210, 73, 0.3) 100%)', borderRadius: '16px' }}>
            <button className="group text-white font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-gray-900">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6E56CF' }}>
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-base">Je loue mon bien</span>
              </div>
            </button>
            <button className="group text-gray-900 font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-white">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6F3C' }}>
                  <Home className="w-4 h-4 text-white" />
                </div>
                <span className="text-base">Je suis résident</span>
              </div>
            </button>
          </div>
        </div>

        {/* Code pour chaque proposition */}
        <div className="p-4 bg-slate-900 rounded-xl">
          <p className="text-sm text-slate-300 mb-3 font-medium">Résumé des styles :</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-green-400 font-semibold">A - Solide</p>
              <code className="text-slate-400">background: #6E56CF</code>
            </div>
            <div>
              <p className="text-blue-400 font-semibold">B - Dégradé subtil</p>
              <code className="text-slate-400">linear-gradient(135deg, #8B7AD0 → #5A45A0)</code>
            </div>
            <div>
              <p className="text-purple-400 font-semibold">C - Outline</p>
              <code className="text-slate-400">border: 2px + bg-white</code>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold">D - Glass</p>
              <code className="text-slate-400">rgba(110,86,207,0.6) + backdrop-blur</code>
            </div>
            <div>
              <p className="text-yellow-400 font-semibold">E - Accent</p>
              <code className="text-slate-400">bg-white + border-left colored</code>
            </div>
            <div>
              <p className="text-pink-400 font-semibold">F - Glow</p>
              <code className="text-slate-400">solid + box-shadow colored</code>
            </div>
            <div>
              <p className="text-slate-300 font-semibold">G - B&W</p>
              <code className="text-slate-400">bg-gray-900/white + icon colored</code>
            </div>
          </div>
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
    <div className="space-y-8">
      {/* Card Component - Variantes */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Card Component</h3>
        <p className="text-sm text-slate-400 mb-4">Composant de base : <code className="bg-slate-700 px-2 py-0.5 rounded">components/ui/card.tsx</code></p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-sm font-medium text-purple-400 mb-3">variant="default"</p>
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Titre de carte</CardTitle>
                <CardDescription>Description courte</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Contenu de la carte.</p>
              </CardContent>
            </Card>
            <p className="text-xs text-slate-500 mt-2 font-mono">rounded-3xl, border-gray-100</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-sm font-medium text-purple-400 mb-3">variant="bordered"</p>
            <Card variant="bordered" className="bg-white">
              <CardHeader>
                <CardTitle>Titre de carte</CardTitle>
                <CardDescription>Description courte</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Contenu de la carte.</p>
              </CardContent>
            </Card>
            <p className="text-xs text-slate-500 mt-2 font-mono">border-2 border-gray-200</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-sm font-medium text-purple-400 mb-3">variant="elevated"</p>
            <Card variant="elevated" className="bg-white">
              <CardHeader>
                <CardTitle>Titre de carte</CardTitle>
                <CardDescription>Description courte</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Contenu de la carte.</p>
              </CardContent>
            </Card>
            <p className="text-xs text-slate-500 mt-2 font-mono">shadow-md</p>
          </div>
        </div>
      </div>

      {/* Card Interactive */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Card Interactive</h3>
        <p className="text-sm text-slate-400 mb-4">Prop <code className="bg-slate-700 px-2 py-0.5 rounded">interactive=true</code> pour hover effect</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card interactive className="bg-white cursor-pointer">
            <CardHeader>
              <CardTitle>Carte Interactive</CardTitle>
              <CardDescription>Passez la souris pour voir l'effet</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">hover:shadow-lg hover:border-owner-500/20</p>
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-700/30 rounded-xl">
            <p className="text-xs text-slate-400 font-mono mb-2">Usage:</p>
            <pre className="text-xs text-green-400 overflow-x-auto">{`<Card interactive>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
</Card>`}</pre>
          </div>
        </div>
      </div>

      {/* Messages Card - VRAI composant de l'app */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Messages Card (Version App)</h3>
        <p className="text-sm text-slate-400 mb-4">Telle qu'affichée dans /dashboard/owner/messages</p>

        <div className="bg-gray-100 rounded-xl p-6">
          {/* Reproduction exacte du screenshot */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
                <p className="text-gray-600">Gérez vos conversations avec les candidats et locataires</p>
              </div>
            </div>

            {/* Tabs comme dans le screenshot */}
            <div className="flex gap-2 mb-6">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium">
                <MessageCircle className="w-4 h-4" />
                Tous
                <span className="ml-1 px-2 py-0.5 bg-purple-200 rounded-full text-xs">0</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
                <Users className="w-4 h-4" />
                Candidats
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
                <Building2 className="w-4 h-4" />
                Locataires
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards par Role */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Cards par Role</h3>
        <p className="text-sm text-slate-400 mb-6">Chaque role a ses couleurs de gradient specifiques</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* OWNER */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gradient-owner)' }} />
              <span className="text-purple-400 font-semibold">OWNER</span>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-200/70 to-indigo-200/70 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ma Propriété</p>
                  <p className="text-sm text-gray-500">3 locataires</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Revenus</span>
                <span className="font-bold text-purple-900">€2,400</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-mono">from-purple-200/70 to-indigo-200/70</p>
          </div>

          {/* RESIDENT */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gradient-resident)' }} />
              <span className="text-orange-400 font-semibold">RESIDENT</span>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-200/70 to-red-200/70 flex items-center justify-center">
                  <Home className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mon Logement</p>
                  <p className="text-sm text-gray-500">Coliving Bruxelles</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Prochain paiement</span>
                <span className="font-bold text-orange-700">15 Dec</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-mono">from-orange-200/70 to-red-200/70</p>
          </div>

          {/* SEARCHER */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gradient-searcher)' }} />
              <span className="text-yellow-400 font-semibold">SEARCHER</span>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-200/70 to-yellow-200/70 flex items-center justify-center">
                  <Search className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Recherche Active</p>
                  <p className="text-sm text-gray-500">12 matchs</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Favoris</span>
                <span className="font-bold text-amber-700">5</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-mono">from-amber-200/70 to-yellow-200/70</p>
          </div>
        </div>
      </div>

      {/* Stats Cards - Quick Stats Header */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Quick Stats Cards (Header Owner)</h3>
        <p className="text-sm text-slate-400 mb-4">Comme affiché dans le header Owner</p>

        <div className="bg-gray-100 rounded-xl p-6">
          <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50/50 to-purple-100/30 border border-purple-200/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-200/70 to-indigo-200/70 flex items-center justify-center">
                <Euro className="w-4 h-4 text-gray-700" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Revenus</p>
                <p className="text-sm font-bold text-purple-900">€12,450</p>
              </div>
            </div>
            <div className="w-px h-8 bg-purple-200" />
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600 font-medium">ROI</p>
                <p className="text-sm font-bold text-purple-900">8.5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Menu Card */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Profile Card (Dans le dropdown)</h3>
        <p className="text-sm text-slate-400 mb-4">Header avec stats et progress ring</p>

        <div className="bg-gray-100 rounded-xl p-6">
          <div className="w-80 bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header Gradient */}
            <div className="relative px-6 py-5 bg-gradient-to-br from-purple-200/70 via-indigo-200/70 to-purple-200/70">
              <div className="flex items-center gap-4">
                {/* Avatar avec Progress Ring */}
                <div className="relative">
                  <svg className="absolute inset-0 -m-1.5" width="68" height="68">
                    <circle cx="34" cy="34" r="32" fill="none" stroke="rgba(100,100,100,0.2)" strokeWidth="2" />
                    <circle cx="34" cy="34" r="32" fill="none" stroke="rgba(110, 86, 207, 0.5)" strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * 0.25}`}
                      transform="rotate(-90 34 34)"
                    />
                  </svg>
                  <div className="w-16 h-16 rounded-full bg-white/50 border-2 border-gray-300 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-700" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-lg">sam jones</p>
                  <p className="text-gray-700 text-sm">sam7777jones@gmail.com</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <div className="h-1.5 flex-1 bg-gray-300 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: '75%' }} />
                    </div>
                    <span className="text-xs text-gray-700 font-medium">75%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="px-4 py-3 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 border-b border-purple-200/50">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">€0</div>
                  <div className="text-xs text-gray-600">Revenus</div>
                </div>
                <div className="border-x border-purple-200/50">
                  <div className="text-lg font-bold text-gray-900">0%</div>
                  <div className="text-xs text-gray-600">ROI</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">0%</div>
                  <div className="text-xs text-gray-600">Occupation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glassmorphism */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Glassmorphism (Headers)</h3>
        <p className="text-sm text-slate-400 mb-4">Utilisé dans tous les headers de l'app</p>

        <div className="relative h-48 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-purple-500 to-yellow-400" />
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-300/50 rounded-full blur-2xl" />
          <div className="absolute inset-8 bg-white/60 backdrop-blur-3xl rounded-2xl border border-white/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900 mb-1">Header Glassmorphism</p>
                <p className="text-sm text-gray-600">bg-white/60 backdrop-blur-3xl</p>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-gray-700" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
          <p className="text-xs text-slate-400 font-mono">
            bg-gradient-to-b from-white/80 via-white/70 to-white/60 backdrop-blur-3xl backdrop-saturate-150
          </p>
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
   PROPERTY CARDS SECTION - VRAIS COMPOSANTS
   ============================================ */

// Donnees de demo pour les PropertyCards
const demoProperties = {
  withResidents: {
    id: 'demo-1',
    title: 'Coliving Design District',
    description: 'Magnifique appartement lumineux dans le quartier tendance de Saint-Gilles. Proche des transports et commerces.',
    city: 'Bruxelles',
    neighborhood: 'Saint-Gilles',
    address: 'Rue de la Victoire 42',
    monthly_rent: 650,
    bedrooms: 3,
    property_type: 'Coliving',
    main_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    rating: 4.8,
    reviews_count: 24,
    available_from: '2024-02-01',
    owner_id: 'owner-1',
  },
  simple: {
    id: 'demo-2',
    title: 'Studio Moderne Ixelles',
    city: 'Bruxelles',
    neighborhood: 'Ixelles',
    monthly_rent: 520,
    bedrooms: 1,
    property_type: 'Studio',
    main_image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    rating: 4.5,
    reviews_count: 12,
    owner_id: 'owner-2',
  },
  withMatch: {
    id: 'demo-3',
    title: 'Appartement Flagey',
    description: 'Grand appartement avec terrasse, ideal pour colocation.',
    city: 'Bruxelles',
    neighborhood: 'Flagey',
    monthly_rent: 750,
    bedrooms: 4,
    property_type: 'Appartement',
    main_image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
    rating: 4.9,
    reviews_count: 31,
    owner_id: 'owner-3',
  },
};

const demoResidents = [
  { id: 'r1', first_name: 'Marie', profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 'r2', first_name: 'Thomas', profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 'r3', first_name: 'Sophie', profile_photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
];

function PropertyCardsSection() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Property Cards - Nouvelles Propositions</h3>
        <p className="text-sm text-slate-400 mb-4">
          3 propositions de redesign pour les PropertyCards. Plus modernes, plus sobres, sans animation qui clignote.
        </p>
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-400">
            <strong>A supprimer:</strong> Footer rose/glassmorphism anime, boutons gradient "Visite" et "Voir"
          </p>
        </div>
      </div>

      {/* ========== PROPOSITION V1 - CLEAN MINIMAL ========== */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-white flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">V1</span>
            Clean Minimal
          </h4>
          <span className="text-xs text-slate-500">Style Airbnb / epure</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">Footer blanc simple, un seul bouton discret, prix bien visible</p>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="max-w-sm">
            {/* V1 - PropertyCard Clean Minimal */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
              {/* Image */}
              <div className="relative h-52">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
                  alt="Coliving"
                  className="w-full h-full object-cover"
                />
                {/* Favorite */}
                <button className="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-md hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
                {/* Type badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                  Coliving
                </div>
                {/* Prix sur image */}
                <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white rounded-xl shadow-lg">
                  <span className="text-lg font-bold text-gray-900">650€</span>
                  <span className="text-sm text-gray-500">/mois</span>
                </div>
              </div>
              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Coliving Design District</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-4 h-4" /> Saint-Gilles, Bruxelles
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Home className="w-4 h-4" /> 3 ch.</span>
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.8</span>
                  </div>
                  {/* Residents avatars */}
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">+1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-xs text-blue-400">
            <strong>Points forts:</strong> Tres epure, focus sur l'image et le prix, pas de bouton intrusif, hover subtil
          </p>
        </div>
      </div>

      {/* ========== PROPOSITION V2 - MODERN PREMIUM ========== */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-white flex items-center gap-2">
            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded">V2</span>
            Modern Premium
          </h4>
          <span className="text-xs text-slate-500">Relief + ombre douce</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">Footer gris tres clair, bouton unique sobre, badge match discret</p>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="max-w-sm">
            {/* V2 - PropertyCard Modern Premium */}
            <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100 hover:-translate-y-1">
              {/* Image */}
              <div className="relative h-56">
                <img
                  src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop"
                  alt="Appartement"
                  className="w-full h-full object-cover"
                />
                {/* Favorite */}
                <button className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5 text-gray-500" />
                </button>
                {/* Match score - discret */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-sm font-semibold shadow-lg">
                  92% match
                </div>
                {/* Residents sur image */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="flex -space-x-3">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md" />
                  </div>
                  <span className="text-white text-sm font-medium drop-shadow-lg">2 colocs</span>
                </div>
              </div>
              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900">Appartement Flagey</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">4.9</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                  <MapPin className="w-4 h-4" /> Flagey, Bruxelles
                </p>
                {/* Footer sobre */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">750€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                  <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
                    Voir details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-xs text-purple-400">
            <strong>Points forts:</strong> Premium mais pas tape-a-l'oeil, bouton noir sobre, effet hover elegant, separation claire
          </p>
        </div>
      </div>

      {/* ========== V3 VARIANTES - TU AS CHOISI V3, VOICI LES DECLINAISONS ========== */}
      <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-xl border border-orange-500/30 p-6 mb-8">
        <h3 className="text-lg font-bold text-white mb-2">V3 Flat Modern - Variantes enrichies</h3>
        <p className="text-sm text-slate-300">
          Base V3 + badge match + plus d'infos + CTA colore. Choisis ta preferee !
        </p>
      </div>

      {/* ========== V3.A - CTA Orange Solid ========== */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-white flex items-center gap-2">
            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">V3.A</span>
            CTA Orange Solid
          </h4>
          <span className="text-xs text-slate-500">Searcher gradient</span>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="max-w-sm">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100">
              {/* Image */}
              <div className="relative h-52">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
                  alt="Coliving"
                  className="w-full h-full object-cover"
                />
                {/* Favorite */}
                <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
                {/* Match badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-md">
                  92% match
                </div>
                {/* Residents sur image */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow" />
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow" />
                  </div>
                  <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">3 colocs</span>
                </div>
                {/* Type badge */}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 rounded-lg shadow text-xs font-medium text-gray-700">
                  Coliving
                </div>
              </div>
              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Home className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Coliving Design District</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Saint-Gilles, Bruxelles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">4.8</span>
                  </div>
                </div>
                {/* Tags infos */}
                <div className="flex flex-wrap gap-2 my-3">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5" /> 3 chambres
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> 3 colocs
                  </span>
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Dispo 1 fev
                  </span>
                </div>
                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">650€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                  <button className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition-colors shadow-md hover:shadow-lg">
                    Voir details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <p className="text-xs text-orange-400">
            <strong>CTA:</strong> Orange solid (couleur Searcher) - visible mais pas agressif
          </p>
        </div>
      </div>

      {/* ========== V3.B - CTA Purple Solid ========== */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-white flex items-center gap-2">
            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded">V3.B</span>
            CTA Purple Solid
          </h4>
          <span className="text-xs text-slate-500">Owner color</span>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="max-w-sm">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100">
              {/* Image */}
              <div className="relative h-52">
                <img
                  src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop"
                  alt="Appartement"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-md">
                  87% match
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow" />
                  </div>
                  <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">2 colocs</span>
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 rounded-lg shadow text-xs font-medium text-gray-700">
                  Appartement
                </div>
              </div>
              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Appartement Flagey</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Flagey, Bruxelles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">4.9</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 my-3">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5" /> 4 chambres
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> 2 colocs
                  </span>
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Dispo now
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">750€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                  <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-full transition-colors shadow-md hover:shadow-lg">
                    Voir details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-xs text-purple-400">
            <strong>CTA:</strong> Purple solid (couleur Owner) - elegant et premium
          </p>
        </div>
      </div>

      {/* ========== V3.C - CTA Outline Colore ========== */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-white flex items-center gap-2">
            <span className="px-2 py-1 bg-teal-500 text-white text-xs font-bold rounded">V3.C</span>
            CTA Outline Colore
          </h4>
          <span className="text-xs text-slate-500">Plus subtil</span>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="max-w-sm">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100">
              <div className="relative h-52">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
                  alt="Studio"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                </button>
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-md">
                  78% match
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 rounded-lg shadow text-xs font-medium text-gray-700">
                  Studio
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <Home className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Studio Moderne Ixelles</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Ixelles, Bruxelles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">4.5</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 my-3">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5" /> 1 chambre
                  </span>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Dispo 15 mars
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">520€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                  <button className="px-5 py-2.5 border-2 border-teal-500 text-teal-600 text-sm font-semibold rounded-full hover:bg-teal-500 hover:text-white transition-colors">
                    Voir details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
          <p className="text-xs text-teal-400">
            <strong>CTA:</strong> Outline teal - subtil, devient solid au hover
          </p>
        </div>
      </div>

      {/* ========== V3.D - Gradient Signature (subtil) ========== */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-white flex items-center gap-2">
            <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-purple-500 text-white text-xs font-bold rounded">V3.D</span>
            Gradient Signature
          </h4>
          <span className="text-xs text-slate-500">EasyCo signature</span>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="max-w-sm">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100">
              <div className="relative h-52">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
                  alt="Coliving"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-md">
                  95% match
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow" />
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow" />
                  </div>
                  <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">3 colocs</span>
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 rounded-lg shadow text-xs font-medium text-gray-700">
                  Coliving
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                      <Home className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Coliving Design District</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Saint-Gilles, Bruxelles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">4.8</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 my-3">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5" /> 3 chambres
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> 3 colocs
                  </span>
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Dispo 1 fev
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">650€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                  <button
                    className="px-5 py-2.5 text-white text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #FFA040 0%, #9333EA 100%)' }}
                  >
                    Voir details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-xs text-purple-400">
            <strong>CTA:</strong> Gradient signature EasyCo (orange → purple) - identite forte
          </p>
        </div>
      </div>

      {/* ========== V3.E - Glassmorphism Complet ========== */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-white flex items-center gap-2">
            <span className="px-2 py-1 bg-white/20 backdrop-blur text-white text-xs font-bold rounded border border-white/30">V3.E</span>
            Glassmorphism Complet
          </h4>
          <span className="text-xs text-slate-500">Effet verre depoli</span>
        </div>

        <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-orange-900 rounded-xl p-8">
          <div className="max-w-sm mx-auto">
            {/* Card Glassmorphism */}
            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-xl bg-white/10">
              {/* Image */}
              <div className="relative h-52">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
                  alt="Coliving"
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Favorite - glass */}
                <button className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Heart className="w-5 h-5 text-white" />
                </button>
                {/* Match badge - glass */}
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-emerald-500/80 backdrop-blur-sm text-white rounded-xl text-sm font-bold border border-emerald-400/30">
                  92% match
                </div>
                {/* Residents sur image */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-9 h-9 rounded-full border-2 border-white/50 object-cover" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-9 h-9 rounded-full border-2 border-white/50 object-cover" />
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" className="w-9 h-9 rounded-full border-2 border-white/50 object-cover" />
                  </div>
                  <span className="text-white text-xs font-medium">3 colocs</span>
                </div>
                {/* Prix sur image - glass */}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
                  <span className="text-lg font-bold text-white">650€</span>
                  <span className="text-white/70 text-sm">/mois</span>
                </div>
              </div>
              {/* Content - glass effect */}
              <div className="p-4 bg-white/5 backdrop-blur-md border-t border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Coliving Design District</h3>
                      <p className="text-sm text-white/60 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Saint-Gilles, Bruxelles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg border border-white/20">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-white">4.8</span>
                  </div>
                </div>
                {/* Tags - glass */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-white/10 text-white/80 text-xs font-medium rounded-lg border border-white/20 flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5" /> 3 chambres
                  </span>
                  <span className="px-2.5 py-1 bg-white/10 text-white/80 text-xs font-medium rounded-lg border border-white/20 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> 3 colocs
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-lg border border-emerald-500/30 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Dispo 1 fev
                  </span>
                </div>
                {/* CTA - glass */}
                <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm font-semibold rounded-xl border border-white/30 transition-all hover:border-white/50">
                  Voir details
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white/5 border border-white/20 rounded-lg">
          <p className="text-xs text-slate-300">
            <strong>Style:</strong> Full glassmorphism - fond transparent, bordures subtiles, effet verre depoli. Ideal sur fond colore/image.
          </p>
        </div>
      </div>

      {/* ========== COMPARATIF V3 VARIANTES ========== */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h4 className="text-md font-semibold text-white mb-4">Comparatif des variantes V3</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
                <th className="text-left py-2 px-3">Variante</th>
                <th className="text-center py-2 px-3">CTA</th>
                <th className="text-center py-2 px-3">Couleur icone</th>
                <th className="text-center py-2 px-3">Vibe</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700/50">
                <td className="py-2 px-3 font-medium text-orange-400">V3.A</td>
                <td className="text-center py-2 px-3">Orange solid</td>
                <td className="text-center py-2 px-3">Orange</td>
                <td className="text-center py-2 px-3">Searcher / Chaleureux</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2 px-3 font-medium text-purple-400">V3.B</td>
                <td className="text-center py-2 px-3">Purple solid</td>
                <td className="text-center py-2 px-3">Purple</td>
                <td className="text-center py-2 px-3">Owner / Premium</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2 px-3 font-medium text-teal-400">V3.C</td>
                <td className="text-center py-2 px-3">Teal outline</td>
                <td className="text-center py-2 px-3">Teal</td>
                <td className="text-center py-2 px-3">Subtil / Moderne</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2 px-3 font-medium bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">V3.D</td>
                <td className="text-center py-2 px-3">Gradient signature</td>
                <td className="text-center py-2 px-3">Purple (fond gradient)</td>
                <td className="text-center py-2 px-3">Signature EasyCo</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-white/80">V3.E</td>
                <td className="text-center py-2 px-3">Glass blanc</td>
                <td className="text-center py-2 px-3">Blanc (glass)</td>
                <td className="text-center py-2 px-3">Futuriste / Dark mode</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Version actuelle pour reference */}
      <div className="bg-slate-800 rounded-xl border border-red-500/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-white flex items-center gap-2">
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">ACTUEL</span>
            Version a remplacer
          </h4>
          <span className="text-xs text-red-400">Footer anime + gradients</span>
        </div>

        <div className="bg-gray-100 rounded-xl p-6">
          <div className="max-w-sm">
            <PropertyCard
              property={demoProperties.withResidents}
              residents={demoResidents}
              isFavorite={false}
              variant="default"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-400">
            <strong>Problemes:</strong> Footer rose qui clignote, 2 boutons gradient, trop charge
          </p>
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
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center gap-1"><Languages className="w-3 h-3" /> FR</span>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1"><Languages className="w-3 h-3" /> EN</span>
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
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full flex items-center gap-1"><Palette className="w-3 h-3" /> Art</span>
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full flex items-center gap-1"><Plane className="w-3 h-3" /> Voyages</span>
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full flex items-center gap-1"><Heart className="w-3 h-3" /> Yoga</span>
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
                      <span className="text-xs text-slate-400 flex items-center gap-1"><CigaretteOff className="w-3 h-3" /> Non-fumeur</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Cat className="w-3 h-3" /> Chat</span>
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
  const [langLandingOpen, setLangLandingOpen] = useState(true);
  const [langOwnerOpen, setLangOwnerOpen] = useState(true);
  const [langResidentOpen, setLangResidentOpen] = useState(true);
  const [langSearcherOpen, setLangSearcherOpen] = useState(true);

  const languages = [
    { code: 'fr', label: 'Français', active: true },
    { code: 'en', label: 'English', active: false },
    { code: 'nl', label: 'Nederlands', active: false },
    { code: 'de', label: 'Deutsch', active: false },
  ];

  return (
    <div className="space-y-8">
      {/* ========== LANGUAGE SWITCHERS - 4 versions côte à côte ========== */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Language Switcher - 4 Versions</h3>
        <p className="text-sm text-slate-400 mb-6">Landing Page (gradient signature) + 3 rôles avec leurs couleurs respectives</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* LANDING PAGE - Gradient Signature */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 via-orange-500 to-yellow-500" />
              <span className="text-white font-semibold text-sm">LANDING PAGE</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-[160px]">
              {languages.map((lang, index) => (
                <div key={`landing-${lang.code}`}>
                  <button className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm transition-all group",
                    lang.active ? "bg-gray-50" : "hover:bg-gray-50"
                  )}>
                    <span className={cn(
                      "font-medium transition-all",
                      lang.active
                        ? "bg-gradient-to-r from-purple-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent font-semibold"
                        : "text-gray-700 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-orange-500 group-hover:to-yellow-500 group-hover:bg-clip-text group-hover:text-transparent"
                    )}>
                      {lang.label}
                    </span>
                    {lang.active && <Check className="w-3.5 h-3.5 text-purple-600" />}
                  </button>
                  {index < 3 && <div className="h-px bg-gray-100 mx-3" />}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-mono">from-purple-600 via-orange-500 to-yellow-500</p>
          </div>

          {/* OWNER - Purple */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gradient-owner)' }} />
              <span className="text-purple-400 font-semibold text-sm">OWNER</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-[160px]">
              {languages.map((lang, index) => (
                <div key={`owner-${lang.code}`}>
                  <button className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm transition-all",
                    lang.active ? "bg-purple-50/50" : "hover:bg-purple-50/30"
                  )}>
                    <span className={cn(
                      "font-medium transition-colors",
                      lang.active ? "text-purple-600 font-semibold" : "text-gray-700 hover:text-purple-600"
                    )}>
                      {lang.label}
                    </span>
                    {lang.active && <Check className="w-3.5 h-3.5 text-purple-600" />}
                  </button>
                  {index < 3 && <div className="h-px bg-gray-100 mx-3" />}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-mono">text-purple-600</p>
          </div>

          {/* RESIDENT - Orange */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gradient-resident)' }} />
              <span className="text-orange-400 font-semibold text-sm">RESIDENT</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-[160px]">
              {languages.map((lang, index) => (
                <div key={`resident-${lang.code}`}>
                  <button className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm transition-all",
                    lang.active ? "bg-orange-50/50" : "hover:bg-orange-50/30"
                  )}>
                    <span className={cn(
                      "font-medium transition-colors",
                      lang.active ? "text-[#FF6F3C] font-semibold" : "text-gray-700 hover:text-[#FF6F3C]"
                    )}>
                      {lang.label}
                    </span>
                    {lang.active && <Check className="w-3.5 h-3.5 text-[#FF6F3C]" />}
                  </button>
                  {index < 3 && <div className="h-px bg-gray-100 mx-3" />}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-mono">text-[#FF6F3C]</p>
          </div>

          {/* SEARCHER - Yellow/Orange */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gradient-searcher)' }} />
              <span className="text-yellow-400 font-semibold text-sm">SEARCHER</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-[160px]">
              {languages.map((lang, index) => (
                <div key={`searcher-${lang.code}`}>
                  <button className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm transition-all",
                    lang.active ? "bg-orange-50/50" : "hover:bg-orange-50/30"
                  )}>
                    <span className={cn(
                      "font-medium transition-colors",
                      lang.active ? "text-[#FFA040] font-semibold" : "text-gray-700 hover:text-[#FFA040]"
                    )}>
                      {lang.label}
                    </span>
                    {lang.active && <Check className="w-3.5 h-3.5 text-[#FFA040]" />}
                  </button>
                  {index < 3 && <div className="h-px bg-gray-100 mx-3" />}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-mono">text-[#FFA040]</p>
          </div>
        </div>

        <div className="mt-6 p-3 bg-slate-700/30 rounded-lg">
          <p className="text-xs text-slate-400">
            <strong className="text-white">Fichiers:</strong> ModernPublicHeader.tsx (landing), LanguageSwitcher.tsx (rôles)
          </p>
        </div>
      </div>

      {/* ========== PROFILE DROPDOWNS - 3 rôles côte à côte ========== */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Profile Dropdowns - 3 Rôles</h3>
        <p className="text-sm text-slate-400 mb-6">Owner, Resident et Searcher avec leurs gradients et stats respectifs</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* OWNER Profile Dropdown */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gradient-owner)' }} />
              <span className="text-purple-400 font-semibold">OWNER</span>
            </div>
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header Gradient - Couleurs OFFICIELLES du gradient Owner */}
              <div className="relative px-4 py-4" style={{ background: 'linear-gradient(135deg, #7B5FB8 0%, #A67BB8 50%, #C98B9E 100%)' }}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <svg className="absolute inset-0 -m-1" width="52" height="52">
                      <circle cx="26" cy="26" r="24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                      <circle cx="26" cy="26" r="24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        strokeDashoffset={`${2 * Math.PI * 24 * 0.25}`}
                        transform="rotate(-90 26 26)"
                      />
                    </svg>
                    <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white">sam jones</p>
                    <p className="text-white/90 text-xs truncate">sam@email.com</p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: '75%' }} />
                      </div>
                      <span className="text-[10px] text-white/90">75%</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div className="px-3 py-2 bg-gradient-to-br from-purple-100 to-purple-50 border-b border-purple-200">
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div><div className="text-sm font-bold text-[#6E56CF]">€0</div><div className="text-[10px] text-gray-600">Revenus</div></div>
                  <div className="border-x border-purple-200"><div className="text-sm font-bold text-[#6E56CF]">0%</div><div className="text-[10px] text-gray-600">ROI</div></div>
                  <div><div className="text-sm font-bold text-[#6E56CF]">0%</div><div className="text-[10px] text-gray-600">Occupation</div></div>
                </div>
              </div>
              {/* Menu - Style V1 Flat: fond pastel + icône colorée */}
              <div className="py-1">
                {[
                  { icon: User, label: 'Mon Profil', bgColor: 'bg-orange-100', iconColor: 'text-orange-500' },
                  { icon: Euro, label: 'Finance', bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
                  { icon: Settings, label: 'Paramètres', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 px-3 py-2 hover:bg-purple-50 cursor-pointer group">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${item.bgColor}`}>
                      <item.icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                    </div>
                    <span className="text-gray-900 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
              {/* Logout */}
              <div className="border-t border-gray-200/80 px-3 py-2">
                <div className="flex items-center gap-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg px-2 py-1">
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-sm">Déconnexion</span>
                </div>
              </div>
            </div>
          </div>

          {/* RESIDENT Profile Dropdown */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gradient-resident)' }} />
              <span className="text-orange-400 font-semibold">RESIDENT</span>
            </div>
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header Gradient - Couleurs OFFICIELLES du gradient Resident */}
              <div className="relative px-4 py-4" style={{ background: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)' }}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <svg className="absolute inset-0 -m-1" width="52" height="52">
                      <circle cx="26" cy="26" r="24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                      <circle cx="26" cy="26" r="24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        strokeDashoffset={`${2 * Math.PI * 24 * 0.25}`}
                        transform="rotate(-90 26 26)"
                      />
                    </svg>
                    <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center">
                      <Key className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white">Marie Dupont</p>
                    <p className="text-white/90 text-xs truncate">marie@email.com</p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: '75%' }} />
                      </div>
                      <span className="text-[10px] text-white/90">75%</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div className="px-3 py-2 bg-gradient-to-br from-orange-100 to-orange-50 border-b border-orange-200">
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div><div className="text-sm font-bold text-[#FF6F3C]">2</div><div className="text-[10px] text-gray-600">Tâches</div></div>
                  <div className="border-x border-orange-200"><div className="text-sm font-bold text-[#FF6F3C]">4</div><div className="text-[10px] text-gray-600">Membres</div></div>
                  <div><div className="text-sm font-bold text-[#FF6F3C]">3</div><div className="text-[10px] text-gray-600">Messages</div></div>
                </div>
              </div>
              {/* Menu - Style V1 Flat: fond pastel + icône colorée */}
              <div className="py-1">
                {[
                  { icon: User, label: 'Mon Profil', bgColor: 'bg-orange-100', iconColor: 'text-orange-500' },
                  { icon: Euro, label: 'Finances', bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
                  { icon: Settings, label: 'Paramètres', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 cursor-pointer group">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${item.bgColor}`}>
                      <item.icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                    </div>
                    <span className="text-gray-900 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
              {/* Logout */}
              <div className="border-t border-gray-200/80 px-3 py-2">
                <div className="flex items-center gap-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg px-2 py-1">
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-sm">Déconnexion</span>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCHER Profile Dropdown */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gradient-searcher)' }} />
              <span className="text-yellow-400 font-semibold">SEARCHER</span>
            </div>
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header Gradient - Amber/Yellow - texte BLANC */}
              <div className="relative px-4 py-4 bg-gradient-to-br from-[#FFA040] via-[#FFB85C] to-[#FFD080] text-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <svg className="absolute inset-0 -m-1" width="52" height="52">
                      <circle cx="26" cy="26" r="24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                      <circle cx="26" cy="26" r="24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        strokeDashoffset={`${2 * Math.PI * 24 * 0.25}`}
                        transform="rotate(-90 26 26)"
                      />
                    </svg>
                    <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white">Lucas Martin</p>
                    <p className="text-white/90 text-xs truncate">lucas@email.com</p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: '75%' }} />
                      </div>
                      <span className="text-[10px] text-white/90">75%</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Stats - avec gradient text */}
              <div className="px-3 py-2 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 border-b border-orange-100/50">
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div><div className="text-sm font-bold bg-gradient-to-r from-[#FFA040] to-[#FFB85C] bg-clip-text text-transparent">5</div><div className="text-[10px] text-gray-600">Favoris</div></div>
                  <div className="border-x border-orange-200/50"><div className="text-sm font-bold bg-gradient-to-r from-[#FFA040] to-[#FFB85C] bg-clip-text text-transparent">12</div><div className="text-[10px] text-gray-600">Matches</div></div>
                  <div><div className="text-sm font-bold bg-gradient-to-r from-[#FFA040] to-[#FFB85C] bg-clip-text text-transparent">3</div><div className="text-[10px] text-gray-600">Messages</div></div>
                </div>
              </div>
              {/* Menu - Style V1 Flat: fond pastel + icône colorée */}
              <div className="py-1">
                {[
                  { icon: User, label: 'Mon Profil', bgColor: 'bg-orange-100', iconColor: 'text-orange-500' },
                  { icon: Bookmark, label: 'Recherches', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
                  { icon: Settings, label: 'Paramètres', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 cursor-pointer group">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${item.bgColor}`}>
                      <item.icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                    </div>
                    <span className="text-gray-900 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
              {/* Logout */}
              <div className="border-t border-gray-200/80 px-3 py-2">
                <div className="flex items-center gap-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg px-2 py-1">
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-sm">Déconnexion</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-3 bg-slate-700/30 rounded-lg">
          <p className="text-xs text-slate-400">
            <strong className="text-white">Fichiers:</strong> ModernOwnerHeader.tsx, ModernResidentHeader.tsx, ModernSearcherHeader.tsx
          </p>
        </div>
      </div>

      {/* Quick Actions Dropdown - OWNER - Style V1 Flat */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Quick Actions Dropdown</h3>
        <p className="text-sm text-slate-400 mb-4">Utilisé dans le header Owner - <code className="bg-slate-700 px-2 py-0.5 rounded">ModernOwnerHeader.tsx</code></p>

        <div className="bg-gray-100 rounded-xl p-6">
          <div className="w-72 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200/50 py-2">
            <div className="px-4 py-3 border-b border-purple-200/50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#6E56CF]" />
                Actions Rapides
              </h3>
            </div>
            <div className="p-2">
              {[
                { icon: Building2, label: 'Ajouter une propriété', desc: 'Créer un nouveau bien', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
                { icon: Wrench, label: 'Ticket maintenance', desc: 'Signaler un problème', bgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
                { icon: CreditCard, label: 'Ajouter une dépense', desc: 'Enregistrer une dépense', bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
                { icon: BarChart3, label: 'Voir les analytics', desc: 'Performances détaillées', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
              ].map((action) => (
                <div
                  key={action.label}
                  className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-purple-50 transition cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${action.bgColor}`}>
                    <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-500">{action.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Icon Backgrounds par Role - Style V1 Flat */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-2">Icon Backgrounds par Role - Style V1 Flat</h3>
        <p className="text-sm text-slate-400 mb-6">Fond pastel léger + icône colorée (style préféré)</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* OWNER */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gradient-owner)' }} />
              <span className="text-purple-400 font-semibold">OWNER</span>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="flex flex-wrap gap-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-500" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Euro className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-mono">bg-[color]-100 + text-[color]-500/600</p>
          </div>

          {/* RESIDENT */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gradient-resident)' }} />
              <span className="text-orange-400 font-semibold">RESIDENT</span>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="flex flex-wrap gap-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-500" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Euro className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-mono">bg-[color]-100 + text-[color]-500/600</p>
          </div>

          {/* SEARCHER */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--gradient-searcher)' }} />
              <span className="text-yellow-400 font-semibold">SEARCHER</span>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="flex flex-wrap gap-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-500" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-blue-600" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-mono">bg-[color]-100 + text-[color]-500/600</p>
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
              <button className="w-full px-6 py-3 text-white rounded-full font-semibold shadow-lg" style={{ background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)' }}>S'inscrire</button>
              <p className="text-xs text-slate-500 mt-2">CTA principal unique</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Proposition</span>
                <span className="text-sm font-medium text-white">Onboarding - Fin d'étape</span>
              </div>
              <button className="w-full px-6 py-3 text-white rounded-full font-semibold shadow-lg" style={{ background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)' }}>Continuer →</button>
              <p className="text-xs text-slate-500 mt-2">Marque la progression</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Proposition</span>
                <span className="text-sm font-medium text-white">Matching - Super Like</span>
              </div>
              <button className="w-full px-6 py-3 text-white rounded-full font-semibold shadow-lg flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)' }}><Star className="w-5 h-5" /> Super Like</button>
              <p className="text-xs text-slate-500 mt-2">Action premium</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Proposition</span>
                <span className="text-sm font-medium text-white">Badge Vérifié</span>
              </div>
              <span className="px-3 py-1.5 text-white text-sm rounded-full font-medium inline-flex items-center gap-1" style={{ background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)' }}><ShieldCheck className="w-4 h-4" /> Profil Vérifié</span>
              <p className="text-xs text-slate-500 mt-2">Statut premium</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Proposition</span>
                <span className="text-sm font-medium text-white">Empty State</span>
              </div>
              <div className="flex justify-center py-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)' }}><Search className="w-8 h-8 text-white" /></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">Attire l'attention</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Proposition</span>
                <span className="text-sm font-medium text-white">Logo Mobile</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)' }}><span className="text-white font-bold text-lg">E</span></div>
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
                <button className="px-3 py-1.5 text-white rounded-lg text-xs" style={{ background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)' }}>Accueil</button>
                <button className="px-3 py-1.5 text-white rounded-lg text-xs" style={{ background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)' }}>Recherche</button>
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
              <p className="text-green-400 font-medium mb-2 flex items-center gap-2"><Check className="w-4 h-4" /> Utiliser pour:</p>
              <ul className="text-slate-300 space-y-1 ml-6">
                <li>CTA principal (1 par page max)</li>
                <li>Moments cles (inscription, match)</li>
                <li>Recompenses (badges, verifie)</li>
                <li>Logo et identite</li>
              </ul>
            </div>
            <div>
              <p className="text-red-400 font-medium mb-2 flex items-center gap-2"><X className="w-4 h-4" /> Ne pas utiliser:</p>
              <ul className="text-slate-300 space-y-1 ml-6">
                <li>Navigation quotidienne</li>
                <li>Boutons secondaires</li>
                <li>Elements repetitifs</li>
                <li>Plusieurs fois par page</li>
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
    shadows: { title: 'Intensité des ombres', v1Label: 'V1 - Légère', v2Label: 'V2 - Marquée' },
    badges: { title: 'Style de badges', v1Label: 'V1 - Discret', v2Label: 'V2 - Vibrant' },
    backgrounds: { title: 'Effets de fond', v1Label: 'V1 - Statique', v2Label: 'V2 - Dynamique' },
    icons: { title: 'Style d\'icônes', v1Label: 'V1 - Flat (pastel)', v2Label: 'V2 - Gradient' },
    headers: { title: 'Style de headers', v1Label: 'V1 - Clean', v2Label: 'V2 - Gradient' },
    inputs: { title: 'Champs de saisie', v1Label: 'V1 - Bordure', v2Label: 'V2 - Fond blanc' },
    tabs: { title: 'Onglets/Tabs', v1Label: 'V1 - Underline', v2Label: 'V2 - Pills' },
    progress: { title: 'Progression', v1Label: 'V1 - Barre', v2Label: 'V2 - Anneau' },
    notifications: { title: 'Notifications', v1Label: 'V1 - Toast simple', v2Label: 'V2 - Riche' },
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

      {/* Choice: Shadows */}
      <ChoiceCard
        id="shadows"
        title="Intensité des ombres"
        description="Légère et subtile vs Marquée et profonde"
        v1Content={
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Home className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Carte légère</p>
                  <p className="text-sm text-gray-500">Ombre subtile</p>
                </div>
              </div>
            </div>
          </div>
        }
        v2Content={
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Carte profonde</p>
                  <p className="text-sm text-gray-500">Ombre marquée</p>
                </div>
              </div>
            </div>
          </div>
        }
        selectedVersion={selectedChoices['shadows']}
        onSelect={(v) => toggleChoice('shadows', v)}
        feedback={feedbacks['shadows'] || ''}
        onFeedbackChange={(f) => updateFeedback('shadows', f)}
        onSave={() => saveChoice('shadows')}
        saving={saving['shadows']}
        saved={saved['shadows']}
      />

      {/* Choice: Backgrounds */}
      <ChoiceCard
        id="backgrounds"
        title="Effets de fond"
        description="Statique et uni vs Dynamique avec dégradés"
        v1Content={
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm">Fond uni #F9FAFB</p>
            </div>
          </div>
        }
        v2Content={
          <div className="p-4 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-orange-50 to-yellow-100">
              <div className="absolute top-2 left-1/4 w-16 h-16 bg-purple-300/40 rounded-full blur-2xl" />
              <div className="absolute bottom-2 right-1/4 w-20 h-20 bg-orange-300/40 rounded-full blur-2xl" />
            </div>
            <div className="relative h-24 flex items-center justify-center">
              <p className="text-gray-700 text-sm font-medium">Dégradé + Blobs</p>
            </div>
          </div>
        }
        selectedVersion={selectedChoices['backgrounds']}
        onSelect={(v) => toggleChoice('backgrounds', v)}
        feedback={feedbacks['backgrounds'] || ''}
        onFeedbackChange={(f) => updateFeedback('backgrounds', f)}
        onSave={() => saveChoice('backgrounds')}
        saving={saving['backgrounds']}
        saved={saved['backgrounds']}
      />

      {/* Choice: Headers */}
      <ChoiceCard
        id="headers"
        title="Style de headers"
        description="Clean et minimaliste vs Riche avec gradient"
        v1Content={
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <span className="font-medium text-gray-900">Jean Dupont</span>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        }
        v2Content={
          <div className="rounded-lg overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #7B5FB8 0%, #A67BB8 50%, #C98B9E 100%)' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30" />
                <span className="font-medium text-white">Jean Dupont</span>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        }
        selectedVersion={selectedChoices['headers']}
        onSelect={(v) => toggleChoice('headers', v)}
        feedback={feedbacks['headers'] || ''}
        onFeedbackChange={(f) => updateFeedback('headers', f)}
        onSave={() => saveChoice('headers')}
        saving={saving['headers']}
        saved={saved['headers']}
      />

      {/* Choice: Inputs */}
      <ChoiceCard
        id="inputs"
        title="Style des champs de saisie"
        description="Classique avec bordure vs Moderne avec fond"
        v1Content={
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              readOnly
            />
            <input
              type="text"
              placeholder="Mot de passe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              readOnly
            />
          </div>
        }
        v2Content={
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-3 bg-white border-0 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
              readOnly
            />
            <input
              type="text"
              placeholder="Mot de passe"
              className="w-full px-4 py-3 bg-white border-0 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
              readOnly
            />
          </div>
        }
        selectedVersion={selectedChoices['inputs']}
        onSelect={(v) => toggleChoice('inputs', v)}
        feedback={feedbacks['inputs'] || ''}
        onFeedbackChange={(f) => updateFeedback('inputs', f)}
        onSave={() => saveChoice('inputs')}
        saving={saving['inputs']}
        saved={saved['inputs']}
      />

      {/* Choice: Navigation Tabs */}
      <ChoiceCard
        id="tabs"
        title="Style des onglets/tabs"
        description="Underline classique vs Pills modernes"
        v1Content={
          <div className="p-4 bg-white rounded-lg">
            <div className="flex gap-6 border-b border-gray-200">
              <button className="pb-2 text-sm font-medium text-purple-600 border-b-2 border-purple-600">
                Propriétés
              </button>
              <button className="pb-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                Messages
              </button>
              <button className="pb-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                Finance
              </button>
            </div>
          </div>
        }
        v2Content={
          <div className="p-4 bg-white rounded-lg">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow">
                Propriétés
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg">
                Messages
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg">
                Finance
              </button>
            </div>
          </div>
        }
        selectedVersion={selectedChoices['tabs']}
        onSelect={(v) => toggleChoice('tabs', v)}
        feedback={feedbacks['tabs'] || ''}
        onFeedbackChange={(f) => updateFeedback('tabs', f)}
        onSave={() => saveChoice('tabs')}
        saving={saving['tabs']}
        saved={saved['tabs']}
      />

      {/* Choice: Progress Indicators */}
      <ChoiceCard
        id="progress"
        title="Indicateurs de progression"
        description="Barre simple vs Anneau avec pourcentage"
        v1Content={
          <div className="p-4 bg-white rounded-lg space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Profil complété</span>
                <span className="text-gray-900 font-medium">75%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        }
        v2Content={
          <div className="p-4 bg-white rounded-lg flex items-center justify-center">
            <div className="relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" fill="none" stroke="#E5E7EB" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="36" fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * 0.25}`}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">75%</span>
              </div>
            </div>
          </div>
        }
        selectedVersion={selectedChoices['progress']}
        onSelect={(v) => toggleChoice('progress', v)}
        feedback={feedbacks['progress'] || ''}
        onFeedbackChange={(f) => updateFeedback('progress', f)}
        onSave={() => saveChoice('progress')}
        saving={saving['progress']}
        saved={saved['progress']}
      />

      {/* Choice: Notifications */}
      <ChoiceCard
        id="notifications"
        title="Style des notifications"
        description="Toast simple vs Notification riche"
        v1Content={
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-gray-700">Propriété ajoutée avec succès</p>
            </div>
          </div>
        }
        v2Content={
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 shadow-lg flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Succès !</p>
                <p className="text-sm text-white/90">Propriété ajoutée avec succès</p>
              </div>
            </div>
          </div>
        }
        selectedVersion={selectedChoices['notifications']}
        onSelect={(v) => toggleChoice('notifications', v)}
        feedback={feedbacks['notifications'] || ''}
        onFeedbackChange={(f) => updateFeedback('notifications', f)}
        onSave={() => saveChoice('notifications')}
        saving={saving['notifications']}
        saved={saved['notifications']}
      />

      {/* Summary */}
      <div className="bg-gradient-to-br from-purple-900/50 to-slate-800 rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Resume de tes choix
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          {['cards', 'buttons', 'icons', 'badges', 'shadows', 'backgrounds', 'headers', 'inputs', 'tabs', 'progress', 'notifications'].map((key) => (
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
