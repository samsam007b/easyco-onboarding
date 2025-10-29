'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy success page - redirects to unified completion page
 * This ensures consistent post-onboarding experience for all roles
 */
export default function SearcherSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified completion page with user_type parameter
    router.replace('/onboarding/completion?user_type=searcher');
  }, [router]);

  // Show loading state during redirect
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A148C] mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirection...</p>
      </div>
    </div>
  );
}
