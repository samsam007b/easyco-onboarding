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

// Role-based color themes
type LanguageSwitcherVariant = 'hub' | 'owner' | 'searcher';

const variantStyles = {
  hub: {
    gradient: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)',
    primary: '#e05747',
    hoverBg: 'linear-gradient(135deg, rgba(217, 87, 79, 0.08) 0%, rgba(255, 128, 23, 0.08) 100%)',
    activeBg: 'linear-gradient(135deg, rgba(217, 87, 79, 0.08) 0%, rgba(255, 128, 23, 0.08) 100%)',
    hoverBgLight: 'linear-gradient(135deg, rgba(217, 87, 79, 0.05) 0%, rgba(255, 128, 23, 0.05) 100%)',
  },
  owner: {
    gradient: 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)',
    primary: '#9c5698',
    hoverBg: 'linear-gradient(135deg, rgba(156, 86, 152, 0.08) 0%, rgba(194, 86, 107, 0.08) 100%)',
    activeBg: 'linear-gradient(135deg, rgba(156, 86, 152, 0.08) 0%, rgba(194, 86, 107, 0.08) 100%)',
    hoverBgLight: 'linear-gradient(135deg, rgba(156, 86, 152, 0.05) 0%, rgba(194, 86, 107, 0.05) 100%)',
  },
  searcher: {
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)',
    primary: '#f59e0b',
    hoverBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(234, 179, 8, 0.08) 100%)',
    activeBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(234, 179, 8, 0.08) 100%)',
    hoverBgLight: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(234, 179, 8, 0.05) 100%)',
  },
};

interface LanguageSwitcherProps {
  variant?: LanguageSwitcherVariant;
}

export default function LanguageSwitcher({ variant = 'hub' }: LanguageSwitcherProps) {
  const styles = variantStyles[variant];
  const { language, setLanguage, getSection } = useLanguage();
  const ariaLabels = getSection('ariaLabels');
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
        className="flex items-center gap-1.5 px-3 py-2 superellipse-xl text-sm transition-all"
        style={{ color: styles.primary }}
        onMouseEnter={(e) => e.currentTarget.style.background = styles.hoverBg}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        aria-label={ariaLabels?.changeLanguage?.[language] || 'Change language'}
      >
        <Globe className="w-4 h-4" style={{ color: styles.primary }} />
        <span className="font-medium">{language.toUpperCase()}</span>
        <ChevronDown className={cn(
          "w-3 h-3 transition-transform",
          isOpen && "rotate-180"
        )} style={{ color: styles.primary }} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 bg-white superellipse-xl shadow-lg border border-gray-200 overflow-hidden min-w-[160px] z-50"
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
                        ? styles.activeBg
                        : isHovered
                        ? styles.hoverBgLight
                        : 'transparent'
                    }}
                  >
                    <span
                      className="font-medium transition-all duration-200"
                      style={{
                        background: shouldShowGradient ? styles.gradient : 'none',
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
                      <span style={{ color: styles.primary }} className="text-xs">✓</span>
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
