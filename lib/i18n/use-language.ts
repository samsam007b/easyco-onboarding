'use client';

import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, t as translate, getSection } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getSection: (section: any) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('easyco_language') as Language;
      if (savedLang && ['fr', 'en', 'nl', 'de'].includes(savedLang)) {
        setLanguageState(savedLang);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('easyco_language', lang);
      document.cookie = `easyco_language=${lang}; path=/; max-age=31536000`;
    }
  };

  const t = (key: string) => translate(key, language);

  const getSectionTranslated = (section: any) => getSection(section, language);

  return React.createElement(
    LanguageContext.Provider,
    {
      value: {
        language,
        setLanguage,
        t,
        getSection: getSectionTranslated,
      },
    },
    children
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
