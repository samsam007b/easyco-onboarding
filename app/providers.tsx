'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
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
      {children}
    </QueryClientProvider>
  );
}
