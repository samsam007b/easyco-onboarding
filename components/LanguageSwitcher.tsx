'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/use-language';
import { languages, Language } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';

const languageLabels: Record<Language, string> = {
  fr: 'Français',
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
};

// Gradient constants
const RESIDENT_GRADIENT = 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLang, setHoveredLang] = useState<Language | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all"
        style={{ color: '#ff651e' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(217, 87, 79, 0.08) 0%, rgba(255, 128, 23, 0.08) 100%)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" style={{ color: '#ff651e' }} />
        <span className="font-medium">{language.toUpperCase()}</span>
        <ChevronDown className={cn(
          "w-3 h-3 transition-transform",
          isOpen && "rotate-180"
        )} style={{ color: '#ff651e' }} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-w-[160px] z-50"
          >
            {Object.entries(languageLabels).map(([code, label], index) => {
              const langCode = code as Language;
              const isActive = language === langCode;
              const isHovered = hoveredLang === langCode;
              const shouldShowGradient = isActive || isHovered;

              return (
                <div key={code}>
                  <button
                    onClick={() => handleLanguageChange(langCode)}
                    onMouseEnter={() => setHoveredLang(langCode)}
                    onMouseLeave={() => setHoveredLang(null)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm transition-all group relative overflow-hidden"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(217, 87, 79, 0.08) 0%, rgba(255, 128, 23, 0.08) 100%)'
                        : isHovered
                        ? 'linear-gradient(135deg, rgba(217, 87, 79, 0.05) 0%, rgba(255, 128, 23, 0.05) 100%)'
                        : 'transparent'
                    }}
                  >
                    <span
                      className="font-medium transition-all duration-200"
                      style={{
                        background: shouldShowGradient ? RESIDENT_GRADIENT : 'none',
                        WebkitBackgroundClip: shouldShowGradient ? 'text' : 'unset',
                        WebkitTextFillColor: shouldShowGradient ? 'transparent' : 'unset',
                        backgroundClip: shouldShowGradient ? 'text' : 'unset',
                        color: shouldShowGradient ? 'transparent' : '#6b7280',
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        display: 'inline-block',
                      }}
                    >
                      {label}
                    </span>
                    {isActive && (
                      <span style={{ color: '#ff651e' }} className="text-xs">✓</span>
                    )}
                  </button>
                  {index < Object.keys(languageLabels).length - 1 && (
                    <div className="h-px bg-gray-100 mx-3" />
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
