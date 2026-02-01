'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingHouse from '@/components/ui/LoadingHouse';

/**
 * Finances Hub Redirect
 *
 * Previously this was a separate "hub" page, but to avoid confusion
 * between /finance and /finances, we now redirect to the main analytics page.
 */
export default function FinancesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/owner/finance');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F0F7] to-white">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <LoadingHouse size={48} />
        </div>
        <p className="text-gray-500 text-sm">Redirection...</p>
      </div>
    </div>
  );
}
