/**
 * ManualExpenseForm - Manual expense entry with V3-fun design
 * Alternative to scanning when user doesn't have a receipt
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PenLine,
  DollarSign,
  Calendar,
  FileText,
  Tag,
  ShoppingCart,
  Zap,
  Sparkles as SparklesIcon,
  Wifi,
  Wrench,
  Package,
  ArrowRight,
  X,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ExpenseCategory } from '@/types/finances.types';
import type { ScanResult } from './ExpenseScanner';

// V3 Option C - Official Resident Palette
const RESIDENT_GRADIENT = 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)';
const RESIDENT_PRIMARY = '#e05747';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #FFF5F0 0%, #FFEDE5 100%)';
const ACCENT_SHADOW = 'rgba(255, 101, 30, 0.25)';

interface ManualExpenseFormProps {
  onComplete: (data: ScanResult) => void;
  onCancel: () => void;
}

const CATEGORY_OPTIONS: Array<{
  value: ExpenseCategory;
  label: string;
  icon: any;
  gradient: string;
  shadow: string;
}> = [
  {
    value: 'groceries',
    label: 'Courses',
    icon: ShoppingCart,
    gradient: 'linear-gradient(135deg, #22c55e 0%, #059669 100%)',
    shadow: 'rgba(34, 197, 94, 0.4)',
  },
  {
    value: 'utilities',
    label: 'Factures',
    icon: Zap,
    gradient: 'linear-gradient(135deg, #eab308 0%, #ea580c 100%)',
    shadow: 'rgba(234, 179, 8, 0.4)',
  },
  {
    value: 'cleaning',
    label: 'Ménage',
    icon: SparklesIcon,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #0891b2 100%)',
    shadow: 'rgba(59, 130, 246, 0.4)',
  },
  {
    value: 'internet',
    label: 'Internet',
    icon: Wifi,
    gradient: 'linear-gradient(135deg, #a855f7 0%, #4f46e5 100%)',
    shadow: 'rgba(168, 85, 247, 0.4)',
  },
  {
    value: 'maintenance',
    label: 'Entretien',
    icon: Wrench,
    gradient: 'linear-gradient(135deg, #6b7280 0%, #475569 100%)',
    shadow: 'rgba(107, 114, 128, 0.4)',
  },
  {
    value: 'other',
    label: 'Autre',
    icon: Package,
    gradient: 'linear-gradient(135deg, #ec4899 0%, #e11d48 100%)',
    shadow: 'rgba(236, 72, 153, 0.4)',
  },
];

export default function ManualExpenseForm({ onComplete, onCancel }: ManualExpenseFormProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('groceries');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Montant invalide';
    }

    if (!date) {
      newErrors.date = 'La date est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const result: ScanResult = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      description: description.trim(),
      date,
    };

    onComplete(result);
  };

  const selectedCategory = CATEGORY_OPTIONS.find((c) => c.value === category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative"
    >
      {/* Decorative circles */}
      <div
        className="absolute -right-20 -top-20 w-56 h-56 rounded-full opacity-15 pointer-events-none"
        style={{ background: RESIDENT_GRADIENT }}
      />
      <div
        className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 100%)' }}
      />

      {/* Header */}
      <div className="relative z-10 text-center mb-8">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 superellipse-2xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: RESIDENT_GRADIENT,
            boxShadow: `0 12px 32px ${ACCENT_SHADOW}`,
          }}
        >
          <PenLine className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ajouter une dépense</h2>
        <p className="text-gray-500 text-sm">Renseigne les détails manuellement</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <div
              className="w-6 h-6 superellipse-lg flex items-center justify-center"
              style={{ background: `${RESIDENT_PRIMARY}15` }}
            >
              <FileText className="w-3.5 h-3.5" style={{ color: RESIDENT_PRIMARY }} />
            </div>
            Titre de la dépense *
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex: Courses Carrefour"
            className={`w-full px-4 py-3.5 superellipse-2xl border-2 transition-all ${
              errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-orange-200'
            } focus:outline-none focus:border-orange-400 focus:bg-orange-50/30`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.title}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <div
              className="w-6 h-6 superellipse-lg flex items-center justify-center"
              style={{ background: '#10b98115' }}
            >
              <DollarSign className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
            </div>
            Montant (€) *
          </label>
          <div className="relative">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={`w-full px-4 py-3.5 superellipse-2xl border-2 transition-all text-xl font-bold ${
                errors.amount ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-orange-200'
              } focus:outline-none focus:border-orange-400 focus:bg-orange-50/30`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <div
              className="w-6 h-6 superellipse-lg flex items-center justify-center"
              style={{ background: '#8b5cf615' }}
            >
              <Tag className="w-3.5 h-3.5" style={{ color: '#8b5cf6' }} />
            </div>
            Catégorie
          </label>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORY_OPTIONS.map((cat) => {
              const CategoryIcon = cat.icon;
              const isSelected = category === cat.value;
              return (
                <motion.button
                  key={cat.value}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCategory(cat.value)}
                  className={`relative p-4 superellipse-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-transparent shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  style={
                    isSelected
                      ? {
                          background: cat.gradient,
                          boxShadow: `0 8px 24px ${cat.shadow}`,
                        }
                      : {}
                  }
                >
                  <CategoryIcon
                    className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-gray-500'}`}
                  />
                  <p
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {cat.label}
                  </p>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center"
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                    >
                      <Check className="w-3 h-3" style={{ color: RESIDENT_PRIMARY }} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <div
              className="w-6 h-6 superellipse-lg flex items-center justify-center"
              style={{ background: '#3b82f615' }}
            >
              <Calendar className="w-3.5 h-3.5" style={{ color: '#3b82f6' }} />
            </div>
            Date *
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full px-4 py-3.5 superellipse-2xl border-2 transition-all ${
              errors.date ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-orange-200'
            } focus:outline-none focus:border-orange-400 focus:bg-orange-50/30`}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.date}</p>
          )}
        </div>

        {/* Description (optional) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <div
              className="w-6 h-6 superellipse-lg flex items-center justify-center"
              style={{ background: '#ec489915' }}
            >
              <FileText className="w-3.5 h-3.5" style={{ color: '#ec4899' }} />
            </div>
            Notes (optionnel)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détails supplémentaires..."
            rows={2}
            className="w-full px-4 py-3.5 superellipse-2xl border-2 border-gray-200 hover:border-orange-200 focus:outline-none focus:border-orange-400 focus:bg-orange-50/30 resize-none transition-all"
          />
        </div>

        {/* Summary Card */}
        {title && amount && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="superellipse-2xl p-4"
            style={{ background: CARD_BG_GRADIENT }}
          >
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Récapitulatif</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedCategory && (
                  <div
                    className="w-10 h-10 superellipse-xl flex items-center justify-center"
                    style={{ background: selectedCategory.gradient }}
                  >
                    <selectedCategory.icon className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{selectedCategory?.label} • {date}</p>
                </div>
              </div>
              <p
                className="text-xl font-bold"
                style={{ color: RESIDENT_PRIMARY }}
              >
                €{parseFloat(amount || '0').toFixed(2)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="w-full superellipse-2xl py-6 font-semibold border-2 transition-all"
              style={{
                borderColor: `${RESIDENT_PRIMARY}30`,
                color: RESIDENT_PRIMARY,
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button
              type="submit"
              className="w-full superellipse-2xl py-6 font-bold text-white border-none"
              style={{
                background: RESIDENT_GRADIENT,
                boxShadow: `0 12px 32px ${ACCENT_SHADOW}`,
              }}
            >
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
}
