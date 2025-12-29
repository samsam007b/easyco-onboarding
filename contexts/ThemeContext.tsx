'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'izzico-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Force light mode - dark mode disabled
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme - always force light mode
  useEffect(() => {
    setMounted(true);
    // Always force light mode, ignore localStorage
    setThemeState('light');
    // Clear any stored dark mode preference
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
  }, []);

  // Update resolved theme and apply to document - always light
  useEffect(() => {
    if (!mounted) return;

    // Always resolve to light mode
    setResolvedTheme('light');

    // Ensure dark class is never applied
    const root = document.documentElement;
    root.classList.remove('dark');

    // Update theme-color meta tag for PWA - always light
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#FFFFFF');
    }
  }, [mounted]);

  // Disabled - no longer listen for system theme changes
  // Dark mode is disabled

  const setTheme = useCallback((_newTheme: Theme) => {
    // Ignore theme changes - always stay in light mode
    setThemeState('light');
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    // Do nothing - dark mode is disabled
  }, []);

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'system', resolvedTheme: 'light', setTheme: () => {}, toggleTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
