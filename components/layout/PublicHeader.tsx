'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Search, Users, Building2 } from 'lucide-react';

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/properties/browse', label: 'Explorer', icon: Search },
    { href: '/about', label: 'À propos', icon: Users },
    { href: '/owners', label: 'Propriétaires', icon: Building2 },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold">
              <span className="text-[#4A148C]">Easy</span>
              <span className="text-[#FFD600]">Co</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center gap-2"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth">
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                Se connecter
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-[#4A148C] hover:bg-[#6A1B9A] text-white">
                S'inscrire gratuitement
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
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center gap-3 py-2"
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-purple-600 text-purple-600">
                    Se connecter
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#4A148C] hover:bg-[#6A1B9A] text-white">
                    S'inscrire gratuitement
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
