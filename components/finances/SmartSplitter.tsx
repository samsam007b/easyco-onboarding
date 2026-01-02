/**
 * SmartSplitter - Intelligent expense splitting UI
 * Modes: Equal, Custom, Percentage
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  Percent,
  Calculator,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';
import type { SplitMethod, SplitConfig, SplitAllocation } from '@/types/finances.types';

interface SmartSplitterProps {
  totalAmount: number;
  roommates: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  onComplete: (config: SplitConfig) => void;
  onBack: () => void;
}

export default function SmartSplitter({
  totalAmount,
  roommates,
  onComplete,
  onBack,
}: SmartSplitterProps) {
  const { getSection } = useLanguage();
  const splitter = getSection('smartSplitter');

  // Define split methods with translations
  const SPLIT_METHODS: Array<{
    value: SplitMethod;
    label: string;
    icon: any;
    description: string;
  }> = [
    {
      value: 'equal',
      label: splitter?.equal || 'Égal',
      icon: Users,
      description: splitter?.equalDescription || 'Diviser en parts égales',
    },
    {
      value: 'custom',
      label: splitter?.custom || 'Personnalisé',
      icon: Calculator,
      description: splitter?.customDescription || 'Montants spécifiques',
    },
    {
      value: 'percentage',
      label: splitter?.percentage || 'Pourcentage',
      icon: Percent,
      description: splitter?.percentageDescription || 'Répartition en %',
    },
  ];

  const [method, setMethod] = useState<SplitMethod>('equal');
  const [allocations, setAllocations] = useState<SplitAllocation[]>([]);
  const [isValid, setIsValid] = useState(false);

  // Initialize allocations
  useEffect(() => {
    const initialAllocations: SplitAllocation[] = roommates.map((r) => ({
      user_id: r.id,
      user_name: r.name,
      amount: method === 'equal' ? totalAmount / roommates.length : 0,
      percentage: method === 'percentage' ? 100 / roommates.length : 0,
    }));

    setAllocations(initialAllocations);
  }, [roommates, method]);

  // Validate allocations
  useEffect(() => {
    if (method === 'equal') {
      setIsValid(true);
      return;
    }

    if (method === 'custom') {
      const total = allocations.reduce((sum, a) => sum + (a.amount || 0), 0);
      setIsValid(Math.abs(total - totalAmount) < 0.01);
    }

    if (method === 'percentage') {
      const total = allocations.reduce((sum, a) => sum + (a.percentage || 0), 0);
      setIsValid(Math.abs(total - 100) < 0.1);
    }
  }, [allocations, method, totalAmount]);

  // Update amount for a user (custom mode)
  const updateAmount = (userId: string, amount: number) => {
    setAllocations((prev) =>
      prev.map((a) =>
        a.user_id === userId ? { ...a, amount } : a
      )
    );
  };

  // Update percentage for a user (percentage mode)
  const updatePercentage = (userId: string, percentage: number) => {
    setAllocations((prev) =>
      prev.map((a) =>
        a.user_id === userId
          ? { ...a, percentage, amount: (totalAmount * percentage) / 100 }
          : a
      )
    );
  };

  // Auto-distribute remaining amount (custom mode)
  const autoDistribute = () => {
    const currentTotal = allocations.reduce((sum, a) => sum + (a.amount || 0), 0);
    const remaining = totalAmount - currentTotal;

    if (Math.abs(remaining) < 0.01) return;

    // Find users with 0 amount
    const emptyUsers = allocations.filter((a) => (a.amount || 0) === 0);

    if (emptyUsers.length > 0) {
      const perUser = remaining / emptyUsers.length;
      setAllocations((prev) =>
        prev.map((a) =>
          emptyUsers.some((eu) => eu.user_id === a.user_id)
            ? { ...a, amount: perUser }
            : a
        )
      );
    }
  };

  const handleConfirm = () => {
    const config: SplitConfig = {
      method,
      splits: allocations,
    };

    onComplete(config);
  };

  const currentTotal = allocations.reduce((sum, a) => sum + (a.amount || 0), 0);
  const currentPercentage = allocations.reduce((sum, a) => sum + (a.percentage || 0), 0);
  const remaining = totalAmount - currentTotal;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {splitter?.title || 'Partager la dépense'}
        </h2>
        <p className="text-gray-600">
          {(splitter?.subtitle || '€{amount} à répartir entre {count} personnes')
            .replace('{amount}', totalAmount.toFixed(2))
            .replace('{count}', String(roommates.length))}
        </p>
      </div>

      {/* Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {SPLIT_METHODS.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.value}
              onClick={() => setMethod(m.value)}
              className={cn(
                'relative overflow-hidden rounded-2xl p-6 text-left transition-all border-2',
                method === m.value
                  ? 'border-resident-500 bg-gradient-to-br from-resident-50 to-resident-100 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              )}
            >
              <Icon
                className={cn(
                  'w-8 h-8 mb-3',
                  method === m.value ? 'text-resident-600' : 'text-gray-400'
                )}
              />
              <h3 className="font-bold text-gray-900 mb-1">{m.label}</h3>
              <p className="text-sm text-gray-600">{m.description}</p>
              {method === m.value && (
                <div className="absolute top-3 right-3">
                  <Check className="w-5 h-5 text-resident-600" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Allocations */}
      <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
        {allocations.map((allocation, index) => (
          <motion.div
            key={allocation.user_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm"
          >
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-resident-500 to-resident-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {allocation.user_name.charAt(0)}
              </div>
            </div>

            {/* User Name */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {allocation.user_name}
              </p>
              {method === 'equal' && (
                <p className="text-sm text-gray-500">
                  {splitter?.equalShare || 'Part égale'}
                </p>
              )}
            </div>

            {/* Input (Custom or Percentage mode) */}
            {method === 'custom' && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <Input
                  type="number"
                  step="0.01"
                  value={allocation.amount?.toFixed(2) || '0.00'}
                  onChange={(e) =>
                    updateAmount(allocation.user_id, parseFloat(e.target.value) || 0)
                  }
                  className="w-24 rounded-xl text-right font-semibold"
                />
              </div>
            )}

            {method === 'percentage' && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.1"
                  value={allocation.percentage?.toFixed(1) || '0.0'}
                  onChange={(e) =>
                    updatePercentage(allocation.user_id, parseFloat(e.target.value) || 0)
                  }
                  className="w-20 rounded-xl text-right font-semibold"
                />
                <Percent className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            )}

            {/* Amount Display (always show) */}
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold text-gray-900">
                €{(allocation.amount || 0).toFixed(2)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Validation Summary */}
      <div
        className={cn(
          'rounded-2xl p-6 border-2',
          isValid
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        )}
      >
        <div className="flex items-start gap-4">
          {isValid ? (
            <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          )}

          <div className="flex-1">
            <h3
              className={cn(
                'font-bold mb-2',
                isValid ? 'text-green-900' : 'text-yellow-900'
              )}
            >
              {isValid
                ? (splitter?.correctDistribution || 'Répartition correcte')
                : (splitter?.incompleteDistribution || 'Répartition incomplète')}
            </h3>

            <div className="space-y-2 text-sm">
              {method === 'custom' && (
                <>
                  <div className="flex justify-between">
                    <span className={isValid ? 'text-green-700' : 'text-yellow-700'}>
                      {splitter?.totalDistributed || 'Total réparti:'}
                    </span>
                    <span className="font-bold">€{currentTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isValid ? 'text-green-700' : 'text-yellow-700'}>
                      {splitter?.remaining || 'Restant:'}
                    </span>
                    <span className={cn(
                      'font-bold',
                      Math.abs(remaining) < 0.01 ? 'text-green-600' : 'text-yellow-600'
                    )}>
                      €{remaining.toFixed(2)}
                    </span>
                  </div>
                  {!isValid && Math.abs(remaining) > 0.01 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={autoDistribute}
                      className="w-full mt-2"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      {splitter?.autoDistribute || 'Distribuer automatiquement'}
                    </Button>
                  )}
                </>
              )}

              {method === 'percentage' && (
                <div className="flex justify-between">
                  <span className={isValid ? 'text-green-700' : 'text-yellow-700'}>
                    {splitter?.total || 'Total:'}
                  </span>
                  <span className={cn(
                    'font-bold',
                    Math.abs(currentPercentage - 100) < 0.1 ? 'text-green-600' : 'text-yellow-600'
                  )}>
                    {currentPercentage.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 rounded-full"
        >
          {splitter?.back || 'Back'}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!isValid}
          className="flex-1 rounded-full cta-resident"
        >
          <Check className="w-4 h-4 mr-2" />
          {splitter?.confirmSplit || 'Confirm split'}
        </Button>
      </div>
    </div>
  );
}
