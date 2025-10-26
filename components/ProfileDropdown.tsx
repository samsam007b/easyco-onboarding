'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, User, Mail, Calendar, LogOut, MapPin, Search, Home as HomeIcon, Key } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

interface ProfileDropdownProps {
  profile: {
    full_name: string;
    email: string;
    profile_data?: any;
  };
  avatarColor?: string;
  role?: 'searcher' | 'owner' | 'resident';
}

export default function ProfileDropdown({ profile, avatarColor = '#4A148C', role }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();
  const { getSection, language } = useLanguage();
  const dashboard = getSection('dashboard');
  const common = getSection('common');

  // Get role icon and label
  const getRoleIcon = () => {
    switch (role) {
      case 'searcher':
        return Search;
      case 'owner':
        return HomeIcon;
      case 'resident':
        return Key;
      default:
        return User;
    }
  };

  const getRoleLabel = () => {
    const labels = {
      searcher: { fr: 'Chercheur', en: 'Searcher', nl: 'Zoeker', de: 'Suchender' },
      owner: { fr: 'Propriétaire', en: 'Owner', nl: 'Eigenaar', de: 'Eigentümer' },
      resident: { fr: 'Résident', en: 'Resident', nl: 'Bewoner', de: 'Bewohner' },
    };
    return role ? labels[role][language] : '';
  };

  const RoleIcon = getRoleIcon();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success(common.logoutSuccess || 'Déconnexion réussie');
      router.push('/');
    } catch (error) {
      toast.error(common.logoutError || 'Erreur lors de la déconnexion');
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors"
      >
        {/* Avatar with Role Icon */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
          style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}dd)` }}
        >
          <RoleIcon className="w-5 h-5" />
        </div>

        {/* Name */}
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-900">{profile.full_name}</p>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          {/* Profile Header */}
          <div
            className="p-6 text-white"
            style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}dd)` }}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <RoleIcon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">{profile.full_name}</h3>
                <p className="text-sm text-white/80">{profile.email}</p>
              </div>
            </div>
            {/* Role Badge - Voyant */}
            {role && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <RoleIcon className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wide">{getRoleLabel()}</span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="p-4 space-y-3 border-b border-gray-100">
            {/* Email */}
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{profile.email}</span>
            </div>

            {/* Date of Birth */}
            {profile.profile_data?.date_of_birth && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">
                  {formatDate(profile.profile_data.date_of_birth)}
                </span>
              </div>
            )}

            {/* Nationality */}
            {profile.profile_data?.nationality && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 capitalize">{profile.profile_data.nationality}</span>
              </div>
            )}

            {/* Occupation */}
            {profile.profile_data?.occupation_status && (
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 capitalize">
                  {profile.profile_data.occupation_status}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{dashboard.searcher?.logout || 'Se déconnecter'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
