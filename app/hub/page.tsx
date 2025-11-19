'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingHouse from '@/components/ui/LoadingHouse';

/**
 * Hub home page - redirects to finances
 */
export default function HubPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to finances page
    router.replace('/hub/finances');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingHouse size={64} />
        <p className="text-gray-600 font-medium mt-4">Redirection...</p>
      </div>
    </div>
  );
}
