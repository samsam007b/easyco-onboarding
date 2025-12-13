/**
 * ExpenseScanner - Modern UI for scanning receipts with OCR
 * Flow: Upload Image → OCR Scan → Review → Split → Create
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ocrService } from '@/lib/services/ocr-service';
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
  emoji: string;
  color: string;
}> = [
  {
    value: 'groceries',
    label: 'Courses',
    emoji: '🛒',
    color: 'from-green-500 to-emerald-600',
  },
  {
    value: 'utilities',
    label: 'Factures',
    emoji: '⚡',
    color: 'from-yellow-500 to-orange-600',
  },
  {
    value: 'cleaning',
    label: 'Ménage',
    emoji: '🧹',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    value: 'internet',
    label: 'Internet',
    emoji: '📡',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    value: 'maintenance',
    label: 'Entretien',
    emoji: '🔧',
    color: 'from-gray-500 to-slate-600',
  },
  {
    value: 'other',
    label: 'Autre',
    emoji: '📦',
    color: 'from-pink-500 to-rose-600',
  },
];

export default function ExpenseScanner({ onComplete, onCancel }: ExpenseScannerProps) {
  const [currentStep, setCurrentStep] = useState<ScanStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<OCRData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  // Form data
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('groceries');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

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

  // Step 2: Perform OCR scan
  const performOCRScan = async (file: File) => {
    setIsScanning(true);
    setScanError(null);

    try {
      const result = await ocrService.scanReceipt(file);

      if (result.success && result.data) {
        setOcrData(result.data);

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

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {['📸 Scanner', '✏️ Vérifier', '📂 Catégorie', '✅ Confirmer'].map(
            (label, index) => {
              const stepIndex = ['upload', 'review', 'category', 'confirm'].indexOf(
                currentStep
              );
              const isActive = index <= stepIndex;
              return (
                <div key={index} className="flex items-center">
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-resident-600 to-resident-700 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-400'
                    )}
                  >
                    {label.split(' ')[0]}
                  </div>
                  {index < 3 && (
                    <div
                      className={cn(
                        'w-12 h-1 mx-2',
                        isActive ? 'bg-resident-500' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Upload */}
        {currentStep === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Scannez votre ticket
              </h2>
              <p className="text-gray-600">
                Prenez une photo ou uploadez un fichier
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Camera Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-resident-600 to-resident-700 p-8 text-white transition-all hover:shadow-2xl hover:scale-105"
              >
                <div className="relative z-10">
                  <Camera className="w-16 h-16 mb-4 mx-auto" />
                  <h3 className="text-lg font-bold mb-1">Prendre une photo</h3>
                  <p className="text-sm text-white/80">
                    Ouvrir la caméra
                  </p>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Upload Button */}
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleFileSelect(file);
                  };
                  input.click();
                }}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white transition-all hover:shadow-2xl hover:scale-105"
              >
                <div className="relative z-10">
                  <Upload className="w-16 h-16 mb-4 mx-auto" />
                  <h3 className="text-lg font-bold mb-1">Choisir un fichier</h3>
                  <p className="text-sm text-white/80">
                    Depuis la galerie
                  </p>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full rounded-full"
            >
              Annuler
            </Button>
          </motion.div>
        )}

        {/* STEP 2: Scanning */}
        {currentStep === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-16"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <Scan className="w-full h-full text-resident-600 animate-pulse" />
              <div className="absolute inset-0 bg-resident-500/20 rounded-full blur-2xl animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Scan en cours...
            </h2>
            <p className="text-gray-600 mb-4">
              Lecture du ticket avec OCR
            </p>
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-resident-600" />
              <span className="text-sm text-gray-500">
                Cela peut prendre quelques secondes
              </span>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Review */}
        {currentStep === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Vérifiez les informations
              </h2>
              <p className="text-gray-600">
                {ocrData && ocrData.confidence > 0.7 ? (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span>
                      Données extraites automatiquement (confiance:{' '}
                      {Math.round(ocrData.confidence * 100)}%)
                    </span>
                  </span>
                ) : (
                  'Saisissez les détails manuellement'
                )}
              </p>
            </div>

            {scanError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">{scanError}</p>
              </div>
            )}

            {/* Preview Image */}
            {previewUrl && (
              <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200">
                <img
                  src={previewUrl}
                  alt="Receipt preview"
                  className="w-full max-h-64 object-contain bg-gray-50"
                />
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-semibold mb-2 block">
                  Titre *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Courses de la semaine"
                  className="rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="amount" className="text-sm font-semibold mb-2 block">
                  Montant (€) *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="rounded-xl text-xl font-bold"
                />
              </div>

              <div>
                <Label htmlFor="date" className="text-sm font-semibold mb-2 block">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-semibold mb-2 block">
                  Description
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détails (optionnel)"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  cleanup();
                  setCurrentStep('upload');
                }}
                className="flex-1 rounded-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button
                onClick={handleReviewNext}
                className="flex-1 rounded-full cta-resident"
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Category Selection */}
        {currentStep === 'category' && (
          <motion.div
            key="category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choisissez une catégorie
              </h2>
              <p className="text-gray-600">
                Cela aide à organiser vos dépenses
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl p-6 text-center transition-all',
                    'border-2',
                    category === cat.value
                      ? 'border-resident-500 bg-gradient-to-br from-resident-50 to-resident-100 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  )}
                >
                  <div className="text-4xl mb-2">{cat.emoji}</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {cat.label}
                  </div>
                  {category === cat.value && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-5 h-5 text-resident-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('review')}
                className="flex-1 rounded-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button
                onClick={() => setCurrentStep('confirm')}
                className="flex-1 rounded-full cta-resident"
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 5: Confirm */}
        {currentStep === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Récapitulatif
              </h2>
              <p className="text-gray-600">
                Vérifiez avant de créer la dépense
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Titre</span>
                <span className="text-lg font-bold text-gray-900">{title}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Montant</span>
                <span className="text-3xl font-bold text-resident-600">
                  €{parseFloat(amount).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Catégorie</span>
                <Badge className="bg-resident-100 text-resident-700 border-resident-200">
                  {CATEGORY_OPTIONS.find((c) => c.value === category)?.emoji}{' '}
                  {CATEGORY_OPTIONS.find((c) => c.value === category)?.label}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(date).toLocaleDateString('fr-FR')}
                </span>
              </div>

              {description && (
                <div className="pt-4 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-600 block mb-2">
                    Description
                  </span>
                  <p className="text-sm text-gray-700">{description}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('category')}
                className="flex-1 rounded-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 rounded-full cta-resident"
              >
                <Check className="w-4 h-4 mr-2" />
                Créer la dépense
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
