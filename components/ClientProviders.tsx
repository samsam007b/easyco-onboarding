'use client';

import { LanguageProvider } from '@/lib/i18n/use-language';
import { RoleProvider } from '@/lib/role/role-context';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { MessagesProvider } from '@/contexts/MessagesContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

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

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <APIProvider apiKey={googleMapsApiKey || ''}>
          <LanguageProvider>
            <RoleProvider>
              <NotificationProvider>
                <MessagesProvider>
                  <PaymentProvider>
                    <FavoritesProvider>
                      {children}
                    </FavoritesProvider>
                  </PaymentProvider>
                </MessagesProvider>
              </NotificationProvider>
            </RoleProvider>
          </LanguageProvider>
        </APIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
