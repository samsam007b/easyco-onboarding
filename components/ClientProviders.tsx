'use client';

import { LanguageProvider } from '@/lib/i18n/use-language';
import { RoleProvider } from '@/lib/role/role-context';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { MessagesProvider } from '@/contexts/MessagesContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // Create React Query client with optimized settings
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute - data stays fresh
        gcTime: 5 * 60 * 1000, // 5 minutes - cached data kept in memory
        retry: 1, // Retry failed requests once
        refetchOnWindowFocus: false, // Don't refetch on window focus for better UX
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RoleProvider>
          <NotificationProvider>
            <MessagesProvider>
              <PaymentProvider>
                {children}
              </PaymentProvider>
            </MessagesProvider>
          </NotificationProvider>
        </RoleProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
