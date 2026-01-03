'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Bell,
  Search,
  Shield,
  LogOut,
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Activity,
  Settings,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';

interface AdminHeaderProps {
  userEmail: string;
  userRole: string;
}

const mobileNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Utilisateurs', href: '/admin/dashboard/users', icon: Users },
  { name: 'Propriétés', href: '/admin/dashboard/properties', icon: Building2 },
  { name: 'Applications', href: '/admin/dashboard/applications', icon: FileText },
  { name: 'Logs', href: '/admin/dashboard/audit-logs', icon: Activity },
  { name: 'Paramètres', href: '/admin/dashboard/settings', icon: Settings },
];

export default function AdminHeader({ userEmail, userRole }: AdminHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const ariaLabels = getSection('ariaLabels');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // Get page title from pathname
  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      users: 'Utilisateurs',
      properties: 'Propriétés',
      applications: 'Applications',
      messages: 'Messages',
      notifications: 'Notifications',
      'audit-logs': 'Logs d\'audit',
      database: 'Base de données',
      settings: 'Paramètres',
      admins: 'Administrateurs',
    };

    return titles[lastSegment] || 'Administration';
  };

  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-700 bg-slate-800/95 backdrop-blur px-4 sm:gap-x-6 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden -m-2.5 p-2.5 text-slate-400"
          onClick={() => setMobileMenuOpen(true)}
          aria-label={ariaLabels?.openMenu?.[language] || 'Ouvrir le menu'}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-slate-700 lg:hidden" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          {/* Page title */}
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
          </div>

          {/* Search (desktop) */}
          <div className="hidden lg:flex flex-1 items-center justify-center max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="w-full pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
            {/* Notifications */}
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-white transition-colors"
              aria-label={ariaLabels?.notifications?.[language] || 'Notifications'}
            >
              <Bell className="h-5 w-5" />
            </button>

            {/* User badge (desktop) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg border border-slate-600">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {userEmail[0]?.toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-slate-300">{userEmail}</span>
              <span className="text-xs text-purple-400 capitalize px-1.5 py-0.5 bg-purple-500/10 rounded">
                {userRole.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu panel */}
          <div className="fixed inset-y-0 left-0 w-72 bg-slate-800 shadow-xl">
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Admin</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white"
                aria-label={ariaLabels?.closeMenu?.[language] || 'Fermer le menu'}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-1">
                {mobileNav.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-purple-600/20 text-purple-400'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="border-t border-slate-700 mt-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  <LogOut className="h-5 w-5" />
                  Déconnexion
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
