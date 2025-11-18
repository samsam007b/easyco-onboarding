'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EnhanceOwnerProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to first step of enhanced profile for owners
    router.replace('/profile/enhance-owner/experience');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingHouse size={48} />
    </div>
  );
}
