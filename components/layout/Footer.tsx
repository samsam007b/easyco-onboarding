import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
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
    { icon: Facebook, href: 'https://facebook.com/easyco', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/easyco', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/easyco', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/easyco', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold">
                <span className="text-purple-400">Easy</span>
                <span className="text-yellow-400">Co</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              La plateforme moderne pour trouver ta colocation idéale à Bruxelles.
              Matching intelligent, groupes de recherche et gestion simplifiée.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>Bruxelles, Belgique</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-purple-400" />
                <a href="mailto:contact@easyco.be" className="hover:text-white transition">
                  contact@easyco.be
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>+32 2 123 45 67</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Searchers Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Chercheurs</h3>
            <ul className="space-y-2">
              {footerLinks.searchers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Owners Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Propriétaires</h3>
            <ul className="space-y-2">
              {footerLinks.owners.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="text-white font-semibold mb-2">
              Reste informé 📬
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Reçois nos dernières annonces et conseils directement par email
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="ton@email.com"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
              <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} EasyCo. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>🇧🇪 Belgique</span>
              <span>•</span>
              <span>Français</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Fait avec ❤️ à Bruxelles</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
