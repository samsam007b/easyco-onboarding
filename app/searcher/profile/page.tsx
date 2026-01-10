'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingHouse from '@/components/ui/LoadingHouse';

// Redirect to the main profile page with searcher context
export default function SearcherProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the profile enhance page for searchers
    router.replace('/profile/enhance');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-searcher-50">
      <div className="text-center">
        <LoadingHouse size={60} />
        <p className="mt-4 text-gray-600 font-medium">Redirection vers votre profil...</p>
      </div>
    </div>
  );
}
