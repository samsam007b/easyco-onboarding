'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import RoleSwitcher, { type Role } from '@/components/landing/RoleSwitcher';

interface ModernPublicHeaderProps {
  activePage?: 'explorer' | 'residents' | 'owners' | null;
  onNavigate?: (page: 'explorer' | 'residents' | 'owners' | null) => void;
  // New role-based props (will replace activePage)
  activeRole?: Role;
  onRoleChange?: (role: Role) => void;
}

// Role mapping: old page names to new role names
const pageToRole: Record<string, Role> = {
  'explorer': 'searcher',
  'residents': 'resident',
  'owners': 'owner',
};
const roleToPage: Record<Role, 'explorer' | 'residents' | 'owners'> = {
  'searcher': 'explorer',
  'resident': 'residents',
  'owner': 'owners',
};

export default function ModernPublicHeader({
  activePage = null,
  onNavigate,
  activeRole: externalActiveRole,
  onRoleChange,
}: ModernPublicHeaderProps) {
  const { language, setLanguage, getSection } = useLanguage();
  const { resolvedTheme } = useTheme();
  const nav = getSection('nav');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Internal role state (default to searcher)
  const [internalRole, setInternalRole] = useState<Role>('searcher');

  // Use external role if provided, otherwise use internal
  const activeRole = externalActiveRole ?? internalRole;

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'de', label: 'Deutsch' },
  ] as const;

  const handleRoleChange = (role: Role) => {
    setInternalRole(role);
    if (onRoleChange) {
      onRoleChange(role);
    }
    // Also update old activePage for backwards compatibility
    if (onNavigate) {
      onNavigate(roleToPage[role]);
    }
  };

  // Close dropdown when clicking outside
  const langDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langDropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism background with gradient overlay - Dark mode support */}
      <div
        className="absolute inset-0 backdrop-blur-3xl backdrop-saturate-150"
        style={{
          background: resolvedTheme === 'dark'
            ? 'linear-gradient(to bottom, rgba(15, 15, 18, 0.85), rgba(15, 15, 18, 0.75), rgba(15, 15, 18, 0.65))'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.7), rgba(255,255,255,0.6))',
          WebkitBackdropFilter: 'blur(40px) saturate(150%)',
          backdropFilter: 'blur(40px) saturate(150%)'
        }}
      />
      <div
        className="absolute inset-0 shadow-lg"
        style={{
          borderBottom: `1px solid ${resolvedTheme === 'dark' ? 'rgba(42, 42, 48, 0.5)' : 'rgba(255,255,255,0.3)'}`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo - Official Izzico Logo */}
          <Link
            href="/"
            className="flex items-center group"
            onClick={() => onNavigate?.(null)}
          >
            <img
              src="/logos/izzico-trademark-text-gradient.svg?v=5"
              alt="IzzIco"
              className="h-6 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation - Role Switcher centré */}
          <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
            <RoleSwitcher
              activeRole={activeRole}
              onRoleChange={handleRoleChange}
            />
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle variant="icon" />

            {/* Se connecter */}
            <Link href="/auth">
              <Button
                variant="ghost"
                className={cn(
                  "rounded-full font-medium",
                  resolvedTheme === 'dark'
                    ? "text-gray-200 hover:bg-white/10"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {nav.login}
              </Button>
            </Link>

            {/* S'inscrire - Dégradé du logo (généraliste pour tous) */}
            <Link href="/signup">
              <Button
                className="rounded-full text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                style={{
                  background: 'var(--gradient-brand)'
                }}
              >
                {nav.signup}
              </Button>
            </Link>

            {/* Language Switcher with Dropdown - Déplacé à droite */}
            <div ref={langDropdownRef} className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 superellipse-lg text-sm transition-all",
                  resolvedTheme === 'dark'
                    ? "text-gray-200 hover:bg-white/10"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{language.toUpperCase()}</span>
                <ChevronDown className={cn(
                  "w-3 h-3 transition-transform",
                  langDropdownOpen && "rotate-180"
                )} />
              </button>

              {/* Dropdown Menu - Premium Minimalist with Dark Mode */}
              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 right-0 superellipse-xl shadow-2xl overflow-hidden min-w-[200px] z-50"
                    style={{
                      background: resolvedTheme === 'dark'
                        ? 'rgba(26, 26, 31, 0.95)'
                        : 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${resolvedTheme === 'dark' ? '#2A2A30' : '#E5E7EB'}`,
                    }}
                  >
                    {languages.map((lang, index) => {
                      return (
                        <div key={lang.code}>
                          <button
                            onClick={() => {
                              setLanguage(lang.code);
                              setLangDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 px-6 py-4 text-base transition-all group",
                              language === lang.code
                                ? resolvedTheme === 'dark' ? "bg-white/5" : "bg-gray-50"
                                : resolvedTheme === 'dark' ? "hover:bg-white/5" : "hover:bg-gray-50"
                            )}
                          >
                            <span className={cn(
                              "font-medium transition-all flex-1 text-left",
                              language === lang.code
                                ? "bg-gradient-to-r from-owner-600 via-resident-500 to-searcher-500 bg-clip-text text-transparent font-semibold"
                                : resolvedTheme === 'dark'
                                  ? "text-gray-200 group-hover:bg-gradient-to-r group-hover:from-owner-400 group-hover:via-resident-400 group-hover:to-searcher-400 group-hover:bg-clip-text group-hover:text-transparent"
                                  : "text-gray-700 group-hover:bg-gradient-to-r group-hover:from-owner-600 group-hover:via-resident-500 group-hover:to-searcher-500 group-hover:bg-clip-text group-hover:text-transparent"
                            )}>
                              {lang.label}
                            </span>
                            {language === lang.code && (
                              <span className="text-owner-500 text-xs">✓</span>
                            )}
                          </button>
                          {index < languages.length - 1 && (
                            <div
                              className="h-px mx-3"
                              style={{
                                background: resolvedTheme === 'dark' ? '#2A2A30' : '#E5E7EB',
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "md:hidden p-2 superellipse-lg transition",
              resolvedTheme === 'dark'
                ? "text-gray-200 hover:bg-white/10"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
              style={{
                background: resolvedTheme === 'dark' ? '#0F0F12' : '#FFFFFF',
                borderTop: `1px solid ${resolvedTheme === 'dark' ? '#2A2A30' : '#E5E7EB'}`,
              }}
            >
              <nav className="py-4 flex flex-col gap-2">
                {/* Mobile Role Switcher */}
                <div className="px-4 pb-4">
                  <RoleSwitcher
                    activeRole={activeRole}
                    onRoleChange={(role) => {
                      handleRoleChange(role);
                      setMobileMenuOpen(false);
                    }}
                  />
                </div>

                {/* Theme toggle in mobile menu */}
                <div className="px-4 py-2">
                  <ThemeToggle variant="dropdown" className="w-full" />
                </div>

                <div
                  className="pt-4 mt-4 px-4 flex flex-col gap-3"
                  style={{
                    borderTop: `1px solid ${resolvedTheme === 'dark' ? '#2A2A30' : '#E5E7EB'}`,
                  }}
                >
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full rounded-full",
                        resolvedTheme === 'dark'
                          ? "border-owner-400 text-owner-300"
                          : "border-owner-600 text-owner-600"
                      )}
                    >
                      {nav.login}
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      className="w-full rounded-full text-white font-semibold"
                      style={{
                        background: 'var(--gradient-brand)'
                      }}
                    >
                      {nav.signup}
                    </Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
