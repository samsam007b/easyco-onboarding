/**
 * Izzico Icon Registry
 *
 * Registre centralisé de toutes les icônes utilisées dans l'application
 * Utilise Feather Icons comme base avec possibilité d'ajouter des custom icons
 *
 * Usage:
 * import { IzzicoIcons } from '@/lib/icons/izzico-icons';
 * <IzzicoIcons.Home size="md" role="owner" />
 */

import * as FeatherIcons from 'react-feather';

/**
 * Catégories d'icônes pour l'organisation
 */

// Navigation & Structure
export const NavigationIcons = {
  Home: FeatherIcons.Home,
  Menu: FeatherIcons.Menu,
  X: FeatherIcons.X,
  ChevronLeft: FeatherIcons.ChevronLeft,
  ChevronRight: FeatherIcons.ChevronRight,
  ChevronDown: FeatherIcons.ChevronDown,
  ChevronUp: FeatherIcons.ChevronUp,
  ArrowLeft: FeatherIcons.ArrowLeft,
  ArrowRight: FeatherIcons.ArrowRight,
  MoreHorizontal: FeatherIcons.MoreHorizontal,
  MoreVertical: FeatherIcons.MoreVertical,
} as const;

// Utilisateurs & Profil
export const UserIcons = {
  User: FeatherIcons.User,
  Users: FeatherIcons.Users,
  UserPlus: FeatherIcons.UserPlus,
  UserCheck: FeatherIcons.UserCheck,
  UserX: FeatherIcons.UserX,
} as const;

// Communication
export const CommunicationIcons = {
  Mail: FeatherIcons.Mail,
  MessageCircle: FeatherIcons.MessageCircle,
  MessageSquare: FeatherIcons.MessageSquare,
  Send: FeatherIcons.Send,
  Phone: FeatherIcons.Phone,
  Bell: FeatherIcons.Bell,
  BellOff: FeatherIcons.BellOff,
} as const;

// Actions
export const ActionIcons = {
  Plus: FeatherIcons.Plus,
  Minus: FeatherIcons.Minus,
  Edit: FeatherIcons.Edit,
  Edit2: FeatherIcons.Edit2,
  Trash: FeatherIcons.Trash,
  Trash2: FeatherIcons.Trash2,
  Copy: FeatherIcons.Copy,
  Check: FeatherIcons.Check,
  CheckCircle: FeatherIcons.CheckCircle,
  XCircle: FeatherIcons.XCircle,
  Save: FeatherIcons.Save,
  Download: FeatherIcons.Download,
  Upload: FeatherIcons.Upload,
  RefreshCw: FeatherIcons.RefreshCw,
  Search: FeatherIcons.Search,
  Filter: FeatherIcons.Filter,
  Eye: FeatherIcons.Eye,
  EyeOff: FeatherIcons.EyeOff,
} as const;

// Immobilier & Logement
export const PropertyIcons = {
  Building: FeatherIcons.Home, // Feather n'a pas "Building", on utilise Home
  Key: FeatherIcons.Key,
  Lock: FeatherIcons.Lock,
  Unlock: FeatherIcons.Unlock,
} as const;

// Localisation
export const LocationIcons = {
  MapPin: FeatherIcons.MapPin,
  Map: FeatherIcons.Map,
  Navigation: FeatherIcons.Navigation,
  Globe: FeatherIcons.Globe,
} as const;

// Temps & Calendrier
export const TimeIcons = {
  Calendar: FeatherIcons.Calendar,
  Clock: FeatherIcons.Clock,
} as const;

// Social & Feedback
export const SocialIcons = {
  Heart: FeatherIcons.Heart,
  Star: FeatherIcons.Star,
  ThumbsUp: FeatherIcons.ThumbsUp,
  ThumbsDown: FeatherIcons.ThumbsDown,
  Bookmark: FeatherIcons.Bookmark,
  Flag: FeatherIcons.Flag,
  Award: FeatherIcons.Award,
  Share: FeatherIcons.Share,
  Share2: FeatherIcons.Share2,
} as const;

// Finance
export const FinanceIcons = {
  DollarSign: FeatherIcons.DollarSign,
  CreditCard: FeatherIcons.CreditCard,
  TrendingUp: FeatherIcons.TrendingUp,
  TrendingDown: FeatherIcons.TrendingDown,
  BarChart: FeatherIcons.BarChart,
  BarChart2: FeatherIcons.BarChart2,
  PieChart: FeatherIcons.PieChart,
} as const;

// Sécurité & Paramètres
export const SettingsIcons = {
  Settings: FeatherIcons.Settings,
  Shield: FeatherIcons.Shield,
  ShieldOff: FeatherIcons.ShieldOff,
  LogOut: FeatherIcons.LogOut,
  LogIn: FeatherIcons.LogIn,
} as const;

// Alertes & Statuts
export const StatusIcons = {
  AlertCircle: FeatherIcons.AlertCircle,
  AlertTriangle: FeatherIcons.AlertTriangle,
  Info: FeatherIcons.Info,
  HelpCircle: FeatherIcons.HelpCircle,
  Loader: FeatherIcons.Loader,
} as const;

// Fichiers & Documents
export const FileIcons = {
  File: FeatherIcons.File,
  FileText: FeatherIcons.FileText,
  Folder: FeatherIcons.Folder,
  Image: FeatherIcons.Image,
  Paperclip: FeatherIcons.Paperclip,
} as const;

// Média
export const MediaIcons = {
  Camera: FeatherIcons.Camera,
  Video: FeatherIcons.Video,
} as const;

/**
 * Registre unifié de toutes les icônes Izzico
 */
export const IzzicoIcons = {
  // Navigation
  ...NavigationIcons,

  // Users
  ...UserIcons,

  // Communication
  ...CommunicationIcons,

  // Actions
  ...ActionIcons,

  // Property
  ...PropertyIcons,

  // Location
  ...LocationIcons,

  // Time
  ...TimeIcons,

  // Social
  ...SocialIcons,

  // Finance
  ...FinanceIcons,

  // Settings
  ...SettingsIcons,

  // Status
  ...StatusIcons,

  // Files
  ...FileIcons,

  // Media
  ...MediaIcons,
} as const;

/**
 * Type pour les noms d'icônes disponibles
 */
export type IzzicoIconName = keyof typeof IzzicoIcons;

/**
 * Helper: Récupère une icône par son nom
 */
export function getIcon(name: IzzicoIconName) {
  return IzzicoIcons[name];
}

/**
 * Liste des icônes par catégorie (pour documentation/showcase)
 */
export const iconCategories = {
  'Navigation & Structure': NavigationIcons,
  'Utilisateurs': UserIcons,
  'Communication': CommunicationIcons,
  'Actions': ActionIcons,
  'Immobilier & Logement': PropertyIcons,
  'Localisation': LocationIcons,
  'Temps & Calendrier': TimeIcons,
  'Social & Feedback': SocialIcons,
  'Finance': FinanceIcons,
  'Sécurité & Paramètres': SettingsIcons,
  'Alertes & Statuts': StatusIcons,
  'Fichiers & Documents': FileIcons,
  'Média': MediaIcons,
} as const;
