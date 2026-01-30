'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

// Gradient signature Izzico
const SIGNATURE_GRADIENT = 'linear-gradient(135deg, #9c5698 0%, #e05747 50%, #ffa000 100%)';

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { label: 'Trouver un co-living', href: '/properties/browse' },
      { label: 'Comment ça marche', href: '/how-it-works' },
      { label: 'FAQ', href: '/faq' },
    ],
    owners: [
      { label: 'Lister mon bien', href: '/properties/new' },
      { label: 'Tarifs', href: '/pricing' },
      { label: 'Devenir partenaire', href: '/owners' },
    ],
    company: [
      { label: 'À propos', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: 'mailto:hello@izzico.be' },
    ],
    legal: [
      { label: 'Conditions', href: '/legal/terms' },
      { label: 'Confidentialité', href: '/legal/privacy' },
      { label: 'Cookies', href: '/legal/cookies' },
    ],
  };

  const socialLinks = [
    { icon: 'instagram', href: 'https://instagram.com/izzico.be', label: 'Instagram' },
    { icon: 'linkedin', href: 'https://linkedin.com/company/izzico', label: 'LinkedIn' },
    { icon: 'facebook', href: 'https://facebook.com/izzico.be', label: 'Facebook' },
  ];

  // Social icon SVG paths (inline pour éviter Lucide overhead)
  const socialIcons: Record<string, string> = {
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    linkedin: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
    facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z',
  };

  return (
    <footer className="relative">
      {/* Gradient signature bar */}
      <div className="h-1" style={{ background: SIGNATURE_GRADIENT }} />

      <div
        className="transition-colors duration-300"
        style={{
          background: isDark ? '#0F0F12' : '#FAFAFA',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <Image
                src={isDark ? '/logos/izzico-trademark-squircle-epais-blanc.svg' : '/logos/izzico-trademark-squircle-epais-noir.svg'}
                alt="Izzico"
                width={140}
                height={48}
                className="h-12 w-auto mb-4"
              />
              <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Le co-living réinventé.<br />
                Trouve, vis, connecte.
              </p>
              {/* Social links */}
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isDark
                        ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d={socialIcons[social.icon]} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Explorer */}
            <div>
              <h4 className={`font-semibold text-sm mb-3 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Explorer
              </h4>
              <ul className="space-y-2">
                {footerLinks.explore.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors duration-200 ${
                        isDark
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Propriétaires */}
            <div>
              <h4 className={`font-semibold text-sm mb-3 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Propriétaires
              </h4>
              <ul className="space-y-2">
                {footerLinks.owners.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors duration-200 ${
                        isDark
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Izzico */}
            <div>
              <h4 className={`font-semibold text-sm mb-3 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Izzico
              </h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith('mailto:') ? (
                      <a
                        href={link.href}
                        className={`text-sm transition-colors duration-200 ${
                          isDark
                            ? 'text-gray-400 hover:text-white'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={`text-sm transition-colors duration-200 ${
                          isDark
                            ? 'text-gray-400 hover:text-white'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className={`font-semibold text-sm mb-3 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Légal
              </h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors duration-200 ${
                        isDark
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}
          >
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              © {currentYear} Izzico. Fait avec soin à Bruxelles.
            </p>
            <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              <span>Belgique</span>
              <span className="w-1 h-1 rounded-full bg-current opacity-40" />
              <span>Français</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
