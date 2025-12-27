'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Settings,
  Shield,
  Activity,
  MessageSquare,
  Bell,
  Database,
  LogOut,
  Palette,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/auth/supabase-client';
import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
  userEmail: string;
  userRole: string;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Security Center', href: '/admin/dashboard/security', icon: ShieldAlert, highlight: true },
  { name: 'Utilisateurs', href: '/admin/dashboard/users', icon: Users },
  { name: 'Propriétés', href: '/admin/dashboard/properties', icon: Building2 },
  { name: 'Applications', href: '/admin/dashboard/applications', icon: FileText },
  { name: 'Messages', href: '/admin/dashboard/messages', icon: MessageSquare },
  { name: 'Notifications', href: '/admin/dashboard/notifications', icon: Bell },
  { name: 'Logs d\'audit', href: '/admin/dashboard/audit-logs', icon: Activity },
  { name: 'Base de données', href: '/admin/dashboard/database', icon: Database },
];

const settingsNav = [
  { name: 'Design System', href: '/admin/dashboard/design-system', icon: Palette },
  { name: 'Paramètres', href: '/admin/dashboard/settings', icon: Settings },
  { name: 'Admins', href: '/admin/dashboard/admins', icon: Shield, superAdminOnly: true },
];

export default function AdminSidebar({ userEmail, userRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-800 px-6 pb-4 border-r border-slate-700">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-700">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">EasyCo</span>
            <span className="text-xs text-purple-400 block">Administration</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <div className="text-xs font-semibold leading-6 text-slate-400 uppercase tracking-wider">
                Navigation
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex gap-x-3 rounded-lg p-2 text-sm leading-6 font-medium transition-colors relative',
                        pathname === item.href
                          ? 'bg-purple-600/20 text-purple-400'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50',
                        item.highlight && 'ring-2 ring-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent'
                      )}
                    >
                      <item.icon className={cn(
                        'h-5 w-5 shrink-0',
                        pathname === item.href ? 'text-purple-400' : item.highlight ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-slate-400 group-hover:text-white'
                      )} />
                      <span className={item.highlight ? 'text-emerald-400 font-semibold' : ''}>
                        {item.name}
                      </span>
                      {item.highlight && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <div className="text-xs font-semibold leading-6 text-slate-400 uppercase tracking-wider">
                Configuration
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {settingsNav
                  .filter(item => !item.superAdminOnly || userRole === 'super_admin')
                  .map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-lg p-2 text-sm leading-6 font-medium transition-colors',
                          pathname === item.href
                            ? 'bg-purple-600/20 text-purple-400'
                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                        )}
                      >
                        <item.icon className={cn(
                          'h-5 w-5 shrink-0',
                          pathname === item.href ? 'text-purple-400' : 'text-slate-400 group-hover:text-white'
                        )} />
                        {item.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>

            {/* User info + Logout */}
            <li className="mt-auto">
              <div className="border-t border-slate-700 pt-4">
                <div className="flex items-center gap-3 mb-3 px-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userEmail[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{userEmail}</p>
                    <p className="text-xs text-slate-400 capitalize">{userRole.replace('_', ' ')}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-x-3 rounded-lg p-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <LogOut className="h-5 w-5 text-slate-400" />
                  Déconnexion
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
