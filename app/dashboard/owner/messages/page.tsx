'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingHouse from '@/components/ui/LoadingHouse';

/**
 * Owner Messages Redirect Page
 *
 * Redirects owners to the unified messaging system.
 * The unified system provides a Facebook Messenger-like experience
 * with role-based visual indicators for searchers and residents.
 */
export default function OwnerMessagesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified messaging
    router.replace('/messages/unified');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30 flex items-center justify-center">
      <div className="text-center">
        <LoadingHouse size={80} />
        <p className="text-gray-600 font-medium mt-4">Chargement des messages...</p>
      </div>
    </div>
  );
}
