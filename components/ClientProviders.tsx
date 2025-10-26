'use client';

import { LanguageProvider } from '@/lib/i18n/use-language';
import { RoleProvider } from '@/lib/role/role-context';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <RoleProvider>
        {children}
      </RoleProvider>
    </LanguageProvider>
  );
}
