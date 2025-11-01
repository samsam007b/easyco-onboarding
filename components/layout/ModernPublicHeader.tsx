'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Search, Users, Building2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernPublicHeaderProps {
  activePage?: 'explorer' | 'residents' | 'owners' | null;
  onNavigate?: (page: 'explorer' | 'residents' | 'owners' | null) => void;
}

export default function ModernPublicHeader({
  activePage = null,
  onNavigate
}: ModernPublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'explorer' as const,
      label: 'Explorer',
      icon: Search,
      color: 'yellow'
    },
    {
      id: 'residents' as const,
      label: 'Résidents',
      icon: Users,
      color: 'purple'
    },
    {
      id: 'owners' as const,
      label: 'Propriétaires',
      icon: Building2,
      color: 'purple'
    },
  ];

  const handleNavClick = (pageId: 'explorer' | 'residents' | 'owners') => {
    if (onNavigate) {
      // Toggle: si déjà actif, on ferme
      onNavigate(activePage === pageId ? null : pageId);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/80 border-b border-black/5" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={() => onNavigate?.(null)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EasyCo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              const Icon = item.icon;

              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all relative",
                      isActive
                        ? "text-gray-900 font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>

                  {/* Active indicator with connection visual */}
                  {isActive && (
                    <>
                      {/* Glow effect */}
                      <motion.div
                        layoutId="active-nav-indicator"
                        className={cn(
                          "absolute inset-0 rounded-xl",
                          item.color === 'yellow'
                            ? "bg-yellow-100"
                            : "bg-purple-100"
                        )}
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />

                      {/* Triangle pointer */}
                      <motion.div
                        className={cn(
                          "absolute -bottom-3 left-1/2 -translate-x-1/2",
                          "w-0 h-0 border-l-8 border-r-8 border-t-8",
                          "border-transparent",
                          item.color === 'yellow'
                            ? "border-t-yellow-500"
                            : "border-t-purple-500"
                        )}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                      />
                    </>
                  )}

                  {/* Button content above background */}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                </div>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-all">
              <Globe className="w-4 h-4" />
              <span className="font-medium">FR</span>
            </button>

            {/* Se connecter */}
            <Link href="/auth">
              <Button
                variant="ghost"
                className="rounded-full font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                Se connecter
              </Button>
            </Link>

            {/* S'inscrire */}
            <Link href="/signup">
              <Button className="rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all">
                S'inscrire
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
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
              className="md:hidden overflow-hidden border-t border-gray-200"
            >
              <nav className="py-4 flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleNavClick(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                        isActive
                          ? "bg-purple-100 text-purple-900 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-gray-200 flex flex-col gap-3">
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-purple-600 text-purple-600"
                    >
                      Se connecter
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                      S'inscrire
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
