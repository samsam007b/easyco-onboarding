'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import { languages, Language } from '@/lib/i18n/translations';
import FranceFlag from '@/components/icons/flags/FranceFlag';
import UKFlag from '@/components/icons/flags/UKFlag';
import NetherlandsFlag from '@/components/icons/flags/NetherlandsFlag';
import GermanyFlag from '@/components/icons/flags/GermanyFlag';

const flagComponents = {
  fr: FranceFlag,
  en: UKFlag,
  nl: NetherlandsFlag,
  de: GermanyFlag,
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

  const currentLang = languages[language];
  const CurrentFlag = flagComponents[language];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Change language"
      >
        <CurrentFlag className="w-7 h-7 rounded-sm shadow-sm" />
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
          {Object.values(languages).map((lang) => {
            const FlagComponent = flagComponents[lang.code as Language];
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as Language)}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                  language === lang.code ? 'bg-purple-50 border-l-4 border-[var(--easy-purple)]' : ''
                }`}
              >
                <FlagComponent className="w-7 h-7 rounded-sm shadow-sm" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{lang.name}</div>
                  <div className="text-xs text-gray-500">{lang.code.toUpperCase()}</div>
                </div>
                {language === lang.code && (
                  <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
