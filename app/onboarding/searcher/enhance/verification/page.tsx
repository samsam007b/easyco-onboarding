'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function OnboardingVerificationPage() {
  const router = useRouter();

  useEffect(() => {
    // For now, redirect back to enhance menu
    // TODO: Implement full verification page in future
    router.replace('/onboarding/searcher/enhance');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingHouse size={80} />
    </div>
  );
}
