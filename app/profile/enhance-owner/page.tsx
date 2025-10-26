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
      <div className="w-12 h-12 border-4 border-[color:var(--easy-purple)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
