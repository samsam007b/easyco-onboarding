'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResidentMatchingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new matching system with resident context
    router.replace('/matching/swipe?context=resident_matching');
  }, [router]);

  return null;
}
