'use client';

import { LanguageProvider } from '@/lib/i18n/use-language';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
