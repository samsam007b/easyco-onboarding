'use client';

import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProfileDropdown from './ProfileDropdown';
import LanguageSwitcher from './LanguageSwitcher';

interface DashboardHeaderProps {
  profile: {
    full_name: string;
    email: string;
    profile_data?: any;
  };
  avatarColor?: string;
  role?: 'searcher' | 'owner' | 'resident';
}

export default function DashboardHeader({ profile, avatarColor, role }: DashboardHeaderProps) {
  const router = useRouter();

  return (
    <>
      {/* Top Bar: Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Profile Dropdown */}
          <ProfileDropdown profile={profile} avatarColor={avatarColor} role={role} />

          {/* Right: Settings Icon */}
          <button
            onClick={() => router.push('/profile')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>
    </>
  );
}
