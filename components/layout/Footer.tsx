'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'À propos', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Carrières', href: '/careers' },
      { label: 'Presse', href: '/press' },
    ],
    searchers: [
      { label: 'Trouver une coloc', href: '/properties/browse' },
      { label: 'Comment ça marche', href: '/how-it-works' },
      { label: 'Créer un groupe', href: '/groups/new' },
      { label: 'FAQ Chercheurs', href: '/faq/searchers' },
    ],
    owners: [
      { label: 'Lister un bien', href: '/properties/new' },
      { label: 'Devenir propriétaire', href: '/owners' },
      { label: 'Tarifs', href: '/pricing' },
      { label: 'FAQ Propriétaires', href: '/faq/owners' },
    ],
    legal: [
      { label: 'Conditions d\'utilisation', href: '/legal/terms' },
      { label: 'Politique de confidentialité', href: '/legal/privacy' },
      { label: 'Mentions légales', href: '/legal/mentions' },
      { label: 'Cookies', href: '/legal/cookies' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/izzico', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/izzico', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/izzico', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/izzico', label: 'LinkedIn' },
  ];

  return (
    <footer
      className="border-t shadow-lg transition-colors duration-300"
      style={{
        background: resolvedTheme === 'dark' ? '#0F0F12' : '#FFFFFF',
        borderColor: resolvedTheme === 'dark' ? '#2A2A30' : '#E5E7EB',
      }}
    >
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <img
              src="/logos/izzico-lockup-dark.svg"
              alt="Izzico"
              className="h-14 w-auto mb-4"
            />
            <p className={`mb-4 leading-relaxed ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              La plateforme moderne pour trouver ta colocation idéale à Bruxelles.
              Matching intelligent, groupes de recherche et gestion simplifiée.
            </p>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <MapPin className={`w-4 h-4 ${resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`} />
                <span>Bruxelles, Belgique</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <Mail className={`w-4 h-4 ${resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`} />
                <a
                  href="mailto:contact@izzico.be"
                  className="transition"
                  style={{ color: resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#9c5698'}
                  onMouseLeave={(e) => e.currentTarget.style.color = resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563'}
                >
                  contact@izzico.be
                </a>
              </div>
              <div className={`flex items-center gap-2 text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <Phone className={`w-4 h-4 ${resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`} />
                <span>+32 2 123 45 67</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className={`font-semibold mb-4 ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition"
                    style={{
                      color: resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#9c5698'}
                    onMouseLeave={(e) => e.currentTarget.style.color = resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Searchers Links */}
          <div>
            <h3 className={`font-semibold mb-4 ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Chercheurs</h3>
            <ul className="space-y-2">
              {footerLinks.searchers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition"
                    style={{
                      color: resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#9c5698'}
                    onMouseLeave={(e) => e.currentTarget.style.color = resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Owners Links */}
          <div>
            <h3 className={`font-semibold mb-4 ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Propriétaires</h3>
            <ul className="space-y-2">
              {footerLinks.owners.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition"
                    style={{
                      color: resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#9c5698'}
                    onMouseLeave={(e) => e.currentTarget.style.color = resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className={`font-semibold mb-4 ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition"
                    style={{
                      color: resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#9c5698'}
                    onMouseLeave={(e) => e.currentTarget.style.color = resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div
          className="pt-8 mb-8"
          style={{ borderTop: `1px solid ${resolvedTheme === 'dark' ? '#2A2A30' : '#E5E7EB'}` }}
        >
          <div className="max-w-md">
            <h3 className={`font-semibold mb-2 ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Reste informé
            </h3>
            <p className={`text-sm mb-4 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Reçois nos dernières annonces et conseils directement par email
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="ton@email.com"
                className={`flex-1 px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 ${
                  resolvedTheme === 'dark'
                    ? 'bg-white/5 border border-white/10 text-gray-100 placeholder-gray-500'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
                style={{
                  borderColor: resolvedTheme === 'dark' ? 'rgba(156, 86, 152, 0.12)' : 'rgba(156, 86, 152, 0.18)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#9c5698';
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${resolvedTheme === 'dark' ? 'rgba(156, 86, 152, 0.12)' : 'rgba(156, 86, 152, 0.06)'}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = resolvedTheme === 'dark' ? 'rgba(156, 86, 152, 0.12)' : 'rgba(156, 86, 152, 0.18)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                className="px-6 py-2 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg hover:scale-105"
                style={{ background: '#9c5698' }}
              >
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${resolvedTheme === 'dark' ? '#2A2A30' : '#E5E7EB'}` }}
        >
          <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            © {currentYear} Izzico. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition"
                style={{
                  background: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F3F4F6',
                  color: resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = resolvedTheme === 'dark' ? 'rgba(156, 86, 152, 0.12)' : 'rgba(156, 86, 152, 0.08)';
                  e.currentTarget.style.color = '#9c5698';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F3F4F6';
                  e.currentTarget.style.color = resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563';
                }}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="py-4"
        style={{
          background: resolvedTheme === 'dark' ? '#0A0A0C' : '#F9FAFB',
          borderTop: `1px solid ${resolvedTheme === 'dark' ? '#2A2A30' : '#E5E7EB'}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            <div className="flex items-center gap-4">
              <span>Belgique</span>
              <span>•</span>
              <span>Français</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Fait avec soin à Bruxelles</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
