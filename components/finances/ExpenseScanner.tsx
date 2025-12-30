/**
 * ExpenseScanner - Fun & Colorful UI for scanning receipts with OCR
 * Flow: Upload Image → OCR Scan → Review → Split → Create
 * Matches the new colorful finances page design
 */

'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  Scan,
  Check,
  X,
  Loader2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Edit3,
  Users,
  DollarSign,
  ShoppingCart,
  Zap,
  Sparkles as SparklesIcon,
  Wifi,
  Wrench,
  Package,
  Plus,
  Receipt,
  ImagePlus,
  Bot,
  FileText,
  PenLine,
  PartyPopper,
  AlertTriangle,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { aiService, type OCRResult as AIServiceOCRResult } from '@/lib/services/ai';
import type { OCRData, ExpenseCategory } from '@/types/finances.types';

interface ExpenseScannerProps {
  onComplete: (data: ScanResult) => void;
  onCancel: () => void;
}

export interface ScanResult {
  title: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  receiptFile?: File;
  ocrData?: OCRData;
}

type ScanStep = 'upload' | 'scanning' | 'review' | 'category' | 'confirm';

const CATEGORY_OPTIONS: Array<{
  value: ExpenseCategory;
  label: string;
  icon: any;
  color: string;
  gradient: string;
  shadow: string;
}> = [
  {
    value: 'groceries',
    label: 'Courses',
    icon: ShoppingCart,
    color: 'from-green-500 to-emerald-600',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #059669 100%)',
    shadow: 'rgba(34, 197, 94, 0.4)',
  },
  {
    value: 'utilities',
    label: 'Factures',
    icon: Zap,
    color: 'from-yellow-500 to-orange-600',
    gradient: 'linear-gradient(135deg, #eab308 0%, #ea580c 100%)',
    shadow: 'rgba(234, 179, 8, 0.4)',
  },
  {
    value: 'cleaning',
    label: 'Ménage',
    icon: SparklesIcon,
    color: 'from-blue-500 to-cyan-600',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #0891b2 100%)',
    shadow: 'rgba(59, 130, 246, 0.4)',
  },
  {
    value: 'internet',
    label: 'Internet',
    icon: Wifi,
    color: 'from-purple-500 to-indigo-600',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #4f46e5 100%)',
    shadow: 'rgba(168, 85, 247, 0.4)',
  },
  {
    value: 'maintenance',
    label: 'Entretien',
    icon: Wrench,
    color: 'from-gray-500 to-slate-600',
    gradient: 'linear-gradient(135deg, #6b7280 0%, #475569 100%)',
    shadow: 'rgba(107, 114, 128, 0.4)',
  },
  {
    value: 'other',
    label: 'Autre',
    icon: Package,
    color: 'from-pink-500 to-rose-600',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #e11d48 100%)',
    shadow: 'rgba(236, 72, 153, 0.4)',
  },
];

// Animation variants for fun effects
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unit_price?: number;
  total_price: number;
}

export default function ExpenseScanner({ onComplete, onCancel }: ExpenseScannerProps) {
  const [currentStep, setCurrentStep] = useState<ScanStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<OCRData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [aiProvider, setAiProvider] = useState<string | null>(null);

  // Form data
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('groceries');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Line items (articles)
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1: Handle file selection
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setScanError(null);

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // Auto-start scanning
    setCurrentStep('scanning');
    await performOCRScan(file);
  };

  // Step 2: Perform OCR scan using AI service (with automatic fallback)
  const performOCRScan = async (file: File) => {
    setIsScanning(true);
    setScanError(null);
    setAiProvider(null);

    try {
      // Use the new AI service which tries Gemini → Together AI → Tesseract
      const result = await aiService.analyzeReceipt(file);

      // Track which provider was used
      setAiProvider(result.provider);
      console.log(`[Scanner] OCR completed using ${result.provider} in ${result.latencyMs}ms`);

      if (result.success && result.data) {
        // Convert AI service response to OCRData format
        const ocrDataFromAI: OCRData = {
          merchant: result.data.merchant,
          total: result.data.total,
          date: result.data.date,
          items: result.data.items,
          confidence: result.data.confidence,
          raw_text: result.data.raw_text ?? '',
          processed_at: new Date().toISOString(),
          language: 'fra',
        };
        setOcrData(ocrDataFromAI);

        // Auto-fill form with OCR data
        if (result.data.total) {
          setAmount(result.data.total.toString());
        }
        if (result.data.merchant) {
          setTitle(result.data.merchant);
          setDescription(result.data.merchant);
        }
        if (result.data.date) {
          setDate(result.data.date);
        }

        // Auto-set category if AI detected one
        if (result.data.category) {
          // Map AI category to our ExpenseCategory type
          const categoryMap: Record<string, ExpenseCategory> = {
            groceries: 'groceries',
            cleaning: 'cleaning',
            utilities: 'utilities',
            internet: 'utilities', // Map to utilities
            rent: 'utilities',
            entertainment: 'other',
            transport: 'other',
            health: 'other',
            other: 'other',
          };
          const mappedCategory = categoryMap[result.data.category] || 'other';
          setCategory(mappedCategory);
        }

        // Initialize line items from OCR
        if (result.data.items && result.data.items.length > 0) {
          const items: LineItem[] = result.data.items.map((item, index) => ({
            id: `ocr-${index}-${Date.now()}`,
            name: item.name,
            quantity: item.quantity || 1,
            unit_price: item.unit_price,
            total_price: item.total_price || 0,
          }));
          setLineItems(items);
        }

        setCurrentStep('review');
      } else {
        setScanError(result.error || 'Échec du scan');
        setCurrentStep('review'); // Still allow manual entry
      }
    } catch (error: any) {
      console.error('[Scanner] OCR error:', error);
      setScanError('Erreur lors du scan. Vous pouvez saisir manuellement.');
      setCurrentStep('review');
    } finally {
      setIsScanning(false);
    }
  };

  // Line items management
  const addLineItem = () => {
    const newItem: LineItem = {
      id: `manual-${Date.now()}`,
      name: '',
      quantity: 1,
      total_price: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  // Calculate total from line items
  const calculateTotalFromItems = () => {
    return lineItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
  };

  // Step 3: Proceed to category selection
  const handleReviewNext = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Veuillez saisir un montant valide');
      return;
    }
    if (!title.trim()) {
      alert('Veuillez saisir un titre');
      return;
    }
    setCurrentStep('category');
  };

  // Step 4: Confirm and submit
  const handleConfirm = () => {
    const scanResult: ScanResult = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      description: description.trim(),
      date,
      receiptFile: selectedFile || undefined,
      ocrData: ocrData || undefined,
    };

    onComplete(scanResult);
  };

  // Clean up preview URL on unmount
  const cleanup = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // Step configuration with icons
  const steps = [
    { icon: Scan, label: 'Scanner' },
    { icon: Edit3, label: 'Vérifier' },
    { icon: Package, label: 'Catégorie' },
    { icon: Users, label: 'Répartir' },
  ];

  const stepIndex = ['upload', 'scanning', 'review', 'category', 'confirm'].indexOf(currentStep);
  const progressIndex = currentStep === 'scanning' ? 0 : stepIndex === 2 ? 1 : stepIndex === 3 ? 2 : stepIndex === 4 ? 3 : stepIndex;

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Fun Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const isActive = index <= progressIndex;
            const isCurrent = index === progressIndex;
            const StepIcon = step.icon;
            return (
              <div key={index} className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                  transition={isCurrent ? { repeat: Infinity, duration: 2 } : {}}
                  className={cn(
                    'relative flex items-center justify-center w-12 h-12 rounded-2xl text-sm font-bold transition-all',
                    isActive
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                  )}
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                          boxShadow: isCurrent
                            ? '0 8px 20px rgba(238, 87, 54, 0.4)'
                            : '0 4px 12px rgba(238, 87, 54, 0.25)',
                        }
                      : undefined
                  }
                >
                  <StepIcon className="w-5 h-5" />
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      style={{ background: 'rgba(255,255,255,0.5)' }}
                    />
                  )}
                </motion.div>
                {index < 3 && (
                  <div className="relative w-10 md:w-16 h-1.5 mx-1.5 md:mx-2.5 rounded-full overflow-hidden bg-gray-200">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: isActive ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #d9574f 0%, #ff5b21 100%)' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Step label */}
        <motion.p
          key={progressIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm font-semibold text-gray-500"
        >
          Étape {progressIndex + 1}/4 • {steps[progressIndex]?.label}
        </motion.p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Upload */}
        {currentStep === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
            className="space-y-6"
          >
            {/* Fun Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4"
                style={{
                  background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                  boxShadow: '0 12px 30px rgba(238, 87, 54, 0.35)',
                }}
              >
                <Receipt className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                Scannez votre ticket
                <Camera className="w-5 h-5 inline-block ml-1" style={{ color: '#ee5736' }} />
              </h2>
              <p className="text-gray-600 flex items-center justify-center gap-1">
                L'IA analyse automatiquement vos reçus
                <Sparkles className="w-4 h-4" style={{ color: '#ee5736' }} />
              </p>
            </motion.div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
                // Reset input value to allow selecting the same file again
                e.target.value = '';
              }}
            />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Camera Button - Fun Animated Card */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="group relative overflow-hidden rounded-3xl p-8 text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                  boxShadow: '0 12px 30px rgba(238, 87, 54, 0.35)',
                }}
              >
                <div className="relative z-10">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  >
                    <Camera className="w-16 h-16 mb-4 mx-auto drop-shadow-lg" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-1 flex items-center justify-center gap-2">
                    <Camera className="w-5 h-5" />
                    Prendre une photo
                  </h3>
                  <p className="text-sm text-white/80">
                    Ouvrir la caméra
                  </p>
                </div>
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ background: 'radial-gradient(circle at center, white 0%, transparent 70%)' }}
                />
              </motion.button>

              {/* Upload Button - Fun Animated Card */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="group relative overflow-hidden rounded-3xl p-8 text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
                  boxShadow: '0 12px 30px rgba(124, 58, 237, 0.35)',
                }}
              >
                <div className="relative z-10">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.5 }}
                  >
                    <ImagePlus className="w-16 h-16 mb-4 mx-auto drop-shadow-lg" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-1 flex items-center justify-center gap-2">
                    <ImagePlus className="w-5 h-5" />
                    Choisir un fichier
                  </h3>
                  <p className="text-sm text-white/80">
                    Depuis la galerie
                  </p>
                </div>
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                  style={{ background: 'radial-gradient(circle at center, white 0%, transparent 70%)' }}
                />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                onClick={onCancel}
                className="w-full rounded-2xl border-2 border-gray-200 hover:border-orange-200 font-semibold py-6 transition-all"
                style={{ color: '#ee5736' }}
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 2: Scanning - Fun AI Animation */}
        {currentStep === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
            className="text-center py-12"
          >
            {/* Animated AI Icon with multiple layers */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              {/* Outer pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                style={{ background: 'linear-gradient(135deg, rgba(238, 87, 54, 0.3) 0%, rgba(255, 128, 23, 0.2) 100%)' }}
              />
              {/* Middle pulse ring */}
              <motion.div
                className="absolute inset-4 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
                style={{ background: 'linear-gradient(135deg, rgba(238, 87, 54, 0.4) 0%, rgba(255, 91, 33, 0.3) 100%)' }}
              />
              {/* Core animated icon */}
              <motion.div
                className="absolute inset-8 rounded-3xl flex items-center justify-center"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                  boxShadow: '0 12px 40px rgba(238, 87, 54, 0.5)',
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
              </motion.div>
            </div>

            <motion.h2
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-6 h-6" style={{ color: '#ee5736' }} />
              Analyse IA en cours...
            </motion.h2>
            <p className="text-gray-600 mb-6 flex items-center justify-center gap-1">
              Notre IA lit votre ticket comme un pro
              <Sparkles className="w-4 h-4" style={{ color: '#ee5736' }} />
            </p>

            {/* Progress bar animation */}
            <div className="max-w-xs mx-auto mb-6">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: ['0%', '70%', '90%', '100%'] }}
                  transition={{ duration: 4, times: [0, 0.5, 0.8, 1], ease: 'easeOut' }}
                  style={{ background: 'linear-gradient(90deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Loader2 className="w-5 h-5" style={{ color: '#ee5736' }} />
              </motion.div>
              <span className="text-sm text-gray-500">
                Extraction des données du ticket
              </span>
            </div>

            {/* AI Provider badges - animated */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {[
                { name: 'Google Gemini', icon: Bot, color: 'bg-blue-50 text-blue-600 border-blue-200' },
                { name: 'Llama Vision', icon: Sparkles, color: 'bg-purple-50 text-purple-600 border-purple-200' },
                { name: 'Tesseract', icon: FileText, color: 'bg-gray-50 text-gray-600 border-gray-200' },
              ].map((provider) => (
                <motion.span
                  key={provider.name}
                  variants={itemVariants}
                  className={cn('px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5', provider.color)}
                >
                  <provider.icon className="w-3.5 h-3.5" />
                  {provider.name}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* STEP 3: Review - Enhanced Form */}
        {currentStep === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                Vérifiez les informations
                <PenLine className="w-5 h-5" style={{ color: '#ee5736' }} />
              </h2>
              <div className="text-gray-600">
                {ocrData && ocrData.confidence > 0.5 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="flex items-center gap-2 text-green-600 font-medium">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      <span className="flex items-center gap-1">
                        Données extraites automatiquement
                        <PartyPopper className="w-4 h-4" />
                      </span>
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      {aiProvider && (
                        <Badge
                          className={cn(
                            "text-xs font-semibold border flex items-center gap-1",
                            aiProvider === 'gemini' && "bg-blue-50 text-blue-700 border-blue-200",
                            aiProvider === 'together' && "bg-purple-50 text-purple-700 border-purple-200",
                            aiProvider === 'tesseract' && "bg-gray-50 text-gray-700 border-gray-200"
                          )}
                        >
                          {aiProvider === 'gemini' && <><Bot className="w-3 h-3" /> Google Gemini</>}
                          {aiProvider === 'together' && <><Sparkles className="w-3 h-3" /> Llama Vision</>}
                          {aiProvider === 'tesseract' && <><FileText className="w-3 h-3" /> Tesseract</>}
                        </Badge>
                      )}
                      <Badge className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {Math.round((ocrData.confidence || 0) * 100)}% confiance
                      </Badge>
                    </div>
                  </motion.div>
                ) : (
                  <span>Saisissez les détails manuellement</span>
                )}
              </div>
            </motion.div>

            {scanError && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4 flex items-center gap-3"
              >
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <p className="text-sm text-yellow-800 font-medium">{scanError}</p>
              </motion.div>
            )}

            {/* Preview Image - Enhanced */}
            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-2xl overflow-hidden border-2 border-gray-200 shadow-md"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              >
                <div className="absolute top-3 left-3 z-10">
                  <Badge
                    className="text-xs font-bold text-white border-none flex items-center gap-1"
                    style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)' }}
                  >
                    <Camera className="w-3 h-3" />
                    Ticket scanné
                  </Badge>
                </div>
                <img
                  src={previewUrl}
                  alt="Receipt preview"
                  className="w-full max-h-64 object-contain bg-gradient-to-br from-gray-50 to-gray-100"
                />
              </motion.div>
            )}

            {/* Form Fields - Enhanced styling */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.div variants={itemVariants}>
                <Label htmlFor="title" className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                  <Tag className="w-4 h-4" style={{ color: '#ee5736' }} />
                  Titre *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Courses de la semaine"
                  className="rounded-xl border-2 border-gray-200 focus:border-orange-300 py-5 text-base"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="amount" className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                  <DollarSign className="w-4 h-4" style={{ color: '#ee5736' }} />
                  Montant (€) *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="rounded-xl border-2 border-gray-200 focus:border-orange-300 text-2xl font-bold py-6"
                  style={{ color: '#ee5736' }}
                />
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <Label htmlFor="date" className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                    <Edit3 className="w-4 h-4" style={{ color: '#ee5736' }} />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-xl border-2 border-gray-200 focus:border-orange-300 py-5"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="description" className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                    <FileText className="w-4 h-4" style={{ color: '#ee5736' }} />
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optionnel"
                    className="rounded-xl border-2 border-gray-200 focus:border-orange-300 py-5"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Editable Line Items - Enhanced */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-4 border-2"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
                borderColor: 'rgba(59, 130, 246, 0.2)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' }}
                  >
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </motion.div>
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4" />
                    Articles ({lineItems.length})
                  </h3>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={addLineItem}
                    size="sm"
                    className="rounded-full text-white font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                </motion.div>
              </div>

              {lineItems.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {lineItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl p-3 space-y-2 border border-gray-100 shadow-sm"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 space-y-2">
                          <Input
                            value={item.name}
                            onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                            placeholder="Nom de l'article"
                            className="text-sm rounded-lg border-gray-200"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                              placeholder="Qté"
                              min="1"
                              className="text-sm rounded-lg border-gray-200"
                            />
                            <Input
                              type="number"
                              step="0.01"
                              value={item.total_price}
                              onChange={(e) => updateLineItem(item.id, 'total_price', parseFloat(e.target.value) || 0)}
                              placeholder="Prix €"
                              className="text-sm rounded-lg border-gray-200 font-semibold"
                            />
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeLineItem(item.id)}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Package className="w-10 h-10 mx-auto mb-2 text-blue-400" />
                  <p className="text-sm text-blue-600 font-medium">
                    Aucun article détecté
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Cliquez sur "Ajouter" pour en ajouter manuellement
                  </p>
                </div>
              )}

              {lineItems.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200/50 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Total calculé:</span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: '#3b82f6' }}
                  >
                    {calculateTotalFromItems().toFixed(2)}€
                  </span>
                </div>
              )}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  variant="outline"
                  onClick={() => {
                    cleanup();
                    setCurrentStep('upload');
                  }}
                  className="w-full rounded-2xl border-2 border-gray-200 hover:border-orange-200 font-semibold py-6 transition-all"
                  style={{ color: '#ee5736' }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={handleReviewNext}
                  className="w-full rounded-2xl text-white border-none py-6 font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                    boxShadow: '0 8px 20px rgba(238, 87, 54, 0.35)',
                  }}
                >
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Category Selection - Fun Colorful Cards */}
        {currentStep === 'category' && (
          <motion.div
            key="category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                Choisissez une catégorie
                <Tag className="w-5 h-5" style={{ color: '#ee5736' }} />
              </h2>
              <p className="text-gray-600 flex items-center justify-center gap-1">
                Organisez vos dépenses par type
                <Sparkles className="w-4 h-4" style={{ color: '#ee5736' }} />
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {CATEGORY_OPTIONS.map((cat) => {
                const CategoryIcon = cat.icon;
                const isSelected = category === cat.value;
                return (
                  <motion.button
                    key={cat.value}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCategory(cat.value)}
                    className={cn(
                      'group relative overflow-hidden rounded-2xl p-6 text-center transition-all border-2',
                      isSelected
                        ? 'text-white border-transparent'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    )}
                    style={
                      isSelected
                        ? {
                            background: cat.gradient,
                            boxShadow: `0 12px 24px ${cat.shadow}`,
                          }
                        : {}
                    }
                  >
                    <motion.div
                      animate={isSelected ? { y: [0, -5, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="mb-2"
                    >
                      <CategoryIcon className={cn("w-10 h-10 mx-auto", isSelected ? "text-white" : "text-gray-600")} />
                    </motion.div>
                    <div className={cn(
                      "text-sm font-bold",
                      isSelected ? "text-white" : "text-gray-700"
                    )}>
                      {cat.label}
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/30 flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                    {/* Shine effect on selected */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0"
                        animate={{ opacity: [0, 0.2, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ background: 'linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)' }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('review')}
                  className="w-full rounded-2xl border-2 border-gray-200 hover:border-orange-200 font-semibold py-6 transition-all"
                  style={{ color: '#ee5736' }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={() => setCurrentStep('confirm')}
                  className="w-full rounded-2xl text-white border-none py-6 font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                    boxShadow: '0 8px 20px rgba(238, 87, 54, 0.35)',
                  }}
                >
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* STEP 5: Confirm - Celebratory Summary */}
        {currentStep === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="mb-3"
              >
                <PartyPopper className="w-12 h-12 mx-auto" style={{ color: '#ee5736' }} />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Récapitulatif
              </h2>
              <p className="text-gray-600 flex items-center justify-center gap-1">
                Tout est prêt ! Vérifiez et partagez
                <Users className="w-4 h-4" style={{ color: '#ee5736' }} />
              </p>
            </motion.div>

            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl p-6 space-y-5 border-2"
              style={{
                background: 'linear-gradient(135deg, rgba(238, 87, 54, 0.05) 0%, rgba(255, 128, 23, 0.05) 100%)',
                borderColor: 'rgba(238, 87, 54, 0.15)',
              }}
            >
              {/* Amount - Big and Bold */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-center py-4 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                  boxShadow: '0 8px 24px rgba(238, 87, 54, 0.35)',
                }}
              >
                <p className="text-sm text-white/80 font-medium mb-1 flex items-center justify-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Montant total
                </p>
                <motion.p
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-4xl font-bold text-white"
                >
                  €{parseFloat(amount).toFixed(2)}
                </motion.p>
              </motion.div>

              {/* Details Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Titre
                  </span>
                  <span className="text-base font-bold text-gray-900">{title}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Date
                  </span>
                  <span className="font-semibold text-gray-900">
                    {new Date(date).toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Catégorie
                  </span>
                  {(() => {
                    const selectedCat = CATEGORY_OPTIONS.find((c) => c.value === category);
                    if (!selectedCat) return null;
                    const SelectedCatIcon = selectedCat.icon;
                    return (
                      <Badge
                        className="text-white font-bold border-none px-3 py-1 flex items-center gap-1.5"
                        style={{
                          background: selectedCat.gradient,
                          boxShadow: `0 4px 12px ${selectedCat.shadow}`,
                        }}
                      >
                        <SelectedCatIcon className="w-4 h-4" />
                        {selectedCat.label}
                      </Badge>
                    );
                  })()}
                </div>
              </div>

              {description && (
                <div className="pt-4 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-500 block mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </span>
                  <p className="text-sm text-gray-700 bg-white rounded-xl p-3 border border-gray-100">
                    {description}
                  </p>
                </div>
              )}

              {/* Receipt indicator */}
              {selectedFile && (
                <div className="flex items-center gap-2 pt-2">
                  <Badge className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Ticket joint
                  </Badge>
                  {ocrData && (
                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      OCR analysé
                    </Badge>
                  )}
                </div>
              )}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('category')}
                  className="w-full rounded-2xl border-2 border-gray-200 hover:border-orange-200 font-semibold py-6 transition-all"
                  style={{ color: '#ee5736' }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={handleConfirm}
                  className="w-full rounded-2xl text-white border-none py-6 font-bold text-base transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
                  }}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Répartir entre colocs 🎯
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
