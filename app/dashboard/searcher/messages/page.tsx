'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SkeletonDashboard } from '@/components/ui/skeleton';

/**
 * Searcher Messages Redirect Page
 *
 * Redirects searchers to the unified messaging system.
 * The unified system provides a Facebook Messenger-like experience
 * with role-based visual indicators for owners and residents.
 */
export default function SearcherMessagesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified messaging
    router.replace('/messages/unified');
  }, [router]);

  return <SkeletonDashboard />;
}
