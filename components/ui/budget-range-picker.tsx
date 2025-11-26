'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Euro } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BudgetRangePickerProps {
  onBudgetChange?: (min: number, max: number) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  minBudget?: number;
  maxBudget?: number;
}

export default function BudgetRangePicker({
  onBudgetChange,
  placeholder = '€800/mois',
  className = '',
  inputClassName = '',
  iconClassName = '',
  minBudget = 0,
  maxBudget = 2000
}: BudgetRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [minValue, setMinValue] = useState(minBudget);
  const [maxValue, setMaxValue] = useState(maxBudget);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate picker position and close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check if click is outside BOTH the container AND the picker popup
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        (!pickerRef.current || !pickerRef.current.contains(target))
      ) {
        setIsOpen(false);
      }
    };

    const updatePosition = () => {
      if (containerRef.current && isOpen) {
        const rect = containerRef.current.getBoundingClientRect();
        setPickerPosition({
          top: rect.bottom + 8,
          left: rect.left
        });
      }
    };

    if (isOpen) {
      updatePosition();
      // Delay adding the listener to avoid immediate close on open click
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - 50);
    setMinValue(value);
    if (onBudgetChange) {
      onBudgetChange(value, maxValue);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + 50);
    setMaxValue(value);
    if (onBudgetChange) {
      onBudgetChange(minValue, value);
    }
  };

  const handleApply = () => {
    if (onBudgetChange) {
      onBudgetChange(minValue, maxValue);
    }
    setIsOpen(false);
  };

  const formatBudget = () => {
    if (minValue === minBudget && maxValue === maxBudget) {
      return placeholder;
    }
    return `€${minValue} - €${maxValue}/mois`;
  };

  const getMinPosition = () => {
    return ((minValue - minBudget) / (maxBudget - minBudget)) * 100;
  };

  const getMaxPosition = () => {
    return ((maxValue - minBudget) / (maxBudget - minBudget)) * 100;
  };

  const popupContent = (
    <motion.div
      ref={pickerRef}
      key="budget-picker"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed z-[99999] bg-white rounded-xl shadow-2xl border border-gray-200 p-4 min-w-[300px]"
      style={{
        top: `${pickerPosition.top}px`,
        left: `${pickerPosition.left}px`
      }}
    >
      <div className="space-y-4">
        {/* Budget Display */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-0.5">Min</div>
            <div className="text-base font-bold text-purple-700">€{minValue}</div>
          </div>
          <div className="text-gray-400 text-sm">—</div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-0.5">Max</div>
            <div className="text-base font-bold text-purple-700">€{maxValue}</div>
          </div>
        </div>

        {/* Dual Range Slider */}
        <div className="relative pt-2 pb-4">
          {/* Track */}
          <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 bg-gray-200 rounded-full" />

          {/* Active Range */}
          <div
            className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full"
            style={{
              left: `${getMinPosition()}%`,
              right: `${100 - getMaxPosition()}%`,
              background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)'
            }}
          />

          {/* Min Slider */}
          <input
            type="range"
            min={minBudget}
            max={maxBudget}
            step="50"
            value={minValue}
            onChange={handleMinChange}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-purple-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:shadow-md"
            style={{ zIndex: minValue > (maxBudget - minBudget) / 2 ? 5 : 3 }}
          />

          {/* Max Slider */}
          <input
            type="range"
            min={minBudget}
            max={maxBudget}
            step="50"
            value={maxValue}
            onChange={handleMaxChange}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-purple-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:shadow-md"
            style={{ zIndex: maxValue <= (maxBudget - minBudget) / 2 ? 5 : 3 }}
          />
        </div>

        {/* Quick Budget Presets */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { min: 400, max: 600, label: '400-600' },
            { min: 600, max: 800, label: '600-800' },
            { min: 800, max: 1000, label: '800-1k' },
            { min: 1000, max: 1500, label: '1k-1.5k' }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setMinValue(preset.min);
                setMaxValue(preset.max);
                if (onBudgetChange) {
                  onBudgetChange(preset.min, preset.max);
                }
              }}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-full transition-all",
                minValue === preset.min && maxValue === preset.max
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              €{preset.label}
            </button>
          ))}
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          className="w-full py-2 px-4 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all text-sm"
          style={{
            background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)'
          }}
        >
          Appliquer
        </button>
      </div>
    </motion.div>
  );

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Euro className={iconClassName} />
        <input
          type="text"
          value={formatBudget()}
          readOnly
          placeholder={placeholder}
          className={cn("cursor-pointer", inputClassName)}
        />
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && popupContent}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
