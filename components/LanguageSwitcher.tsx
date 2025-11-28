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

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
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
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-all"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">{language.toUpperCase()}</span>
        <ChevronDown className={cn(
          "w-3 h-3 transition-transform",
          isOpen && "rotate-180"
        )} />
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
            {Object.entries(languageLabels).map(([code, label], index) => (
              <div key={code}>
                <button
                  onClick={() => handleLanguageChange(code as Language)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm transition-all group",
                    language === code
                      ? "bg-orange-50/50"
                      : "hover:bg-orange-50/30"
                  )}
                >
                  <span className={cn(
                    "font-medium transition-colors",
                    language === code
                      ? "text-[#FFA040]"
                      : "text-gray-700 group-hover:text-[#FFA040]"
                  )}>
                    {label}
                  </span>
                  {language === code && (
                    <span className="text-[#FFA040] text-xs">✓</span>
                  )}
                </button>
                {index < Object.keys(languageLabels).length - 1 && (
                  <div className="h-px bg-gray-100 mx-3" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
