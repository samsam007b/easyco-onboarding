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
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Left: Profile Dropdown */}
          <ProfileDropdown profile={profile} avatarColor={avatarColor} role={role} />

          {/* Right: Settings Icon */}
          <button
            onClick={() => router.push('/profile')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>
      </header>
    </>
  );
}
