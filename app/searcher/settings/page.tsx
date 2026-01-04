'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingHouse from '@/components/ui/LoadingHouse';

// Redirect to the main settings page
export default function SearcherSettingsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the general settings page
    router.replace('/settings');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="text-center">
        <LoadingHouse size={60} />
        <p className="mt-4 text-gray-600 font-medium">Redirection vers les parametres...</p>
      </div>
    </div>
  );
}
