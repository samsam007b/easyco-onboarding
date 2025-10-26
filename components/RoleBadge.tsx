'use client';

import { useRole } from '@/lib/role/role-context';
import { useLanguage } from '@/lib/i18n/use-language';
import { Search, Home, Key } from 'lucide-react';

export default function RoleBadge() {
  const { activeRole, roleConfig } = useRole();
  const { language } = useLanguage();

  if (!activeRole || !roleConfig) {
    return null;
  }

  const icons = {
    searcher: Search,
    owner: Home,
    resident: Key,
  };

  const IconComponent = icons[activeRole];

  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border-2 bg-white transition-all hover:shadow-md"
      style={{
        borderColor: roleConfig.colorHex,
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
        style={{ backgroundColor: roleConfig.colorHex }}
      >
        <IconComponent className="w-4 h-4" />
      </div>
      <span className="font-medium text-gray-900 text-sm">
        {roleConfig.label[language]}
      </span>
    </div>
  );
}
