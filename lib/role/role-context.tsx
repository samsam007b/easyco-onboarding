'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'searcher' | 'owner' | 'resident';

interface RoleConfig {
  color: string;
  colorHex: string;
  gradient: {
    from: string;
    to: string;
  };
  icon: string;
  label: {
    fr: string;
    en: string;
    nl: string;
    de: string;
  };
  themeClass: string;
}

interface RoleContextType {
  activeRole: UserRole | null;
  setActiveRole: (role: UserRole | null) => void;
  roleConfig: RoleConfig | null;
  getRoleConfig: (role: UserRole) => RoleConfig;
}

const roleConfigs: Record<UserRole, RoleConfig> = {
  searcher: {
    color: 'var(--easy-yellow)',
    colorHex: '#FFD700',
    gradient: {
      from: '#FFD700',
      to: '#FFC700',
    },
    icon: '🔍',
    label: {
      fr: 'Chercheur',
      en: 'Searcher',
      nl: 'Zoeker',
      de: 'Suchender',
    },
    themeClass: 'theme-searcher',
  },
  owner: {
    color: 'var(--easy-purple)',
    colorHex: '#4A148C',
    gradient: {
      from: '#4A148C',
      to: '#6A1B9A',
    },
    icon: '🏠',
    label: {
      fr: 'Propriétaire',
      en: 'Owner',
      nl: 'Eigenaar',
      de: 'Eigentümer',
    },
    themeClass: 'theme-owner',
  },
  resident: {
    color: 'var(--easy-orange)',
    colorHex: '#FF5722',
    gradient: {
      from: '#FF5722',
      to: '#FF8C5C',
    },
    icon: '🔑',
    label: {
      fr: 'Résident',
      en: 'Resident',
      nl: 'Bewoner',
      de: 'Bewohner',
    },
    themeClass: 'theme-resident',
  },
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<UserRole | null>(null);

  // Load role from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('activeRole') as UserRole | null;
      if (savedRole && (savedRole === 'searcher' || savedRole === 'owner' || savedRole === 'resident')) {
        setActiveRoleState(savedRole);
      }
    }
  }, []);

  // Save role to localStorage when it changes
  const setActiveRole = (role: UserRole | null) => {
    setActiveRoleState(role);
    if (typeof window !== 'undefined') {
      if (role) {
        localStorage.setItem('activeRole', role);
      } else {
        localStorage.removeItem('activeRole');
      }
    }
  };

  const getRoleConfig = (role: UserRole): RoleConfig => {
    return roleConfigs[role];
  };

  const roleConfig = activeRole ? roleConfigs[activeRole] : null;

  // Apply theme class to body
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activeRole) {
        document.body.className = roleConfigs[activeRole].themeClass;
      } else {
        document.body.className = '';
      }
    }
  }, [activeRole]);

  return (
    <RoleContext.Provider value={{ activeRole, setActiveRole, roleConfig, getRoleConfig }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
