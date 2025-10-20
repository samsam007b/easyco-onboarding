'use client';

import { useEffect, useState } from 'react';
import Stepper from '@/components/Stepper';
import { safeLocalStorage } from '@/lib/browser';

export const dynamic = 'force-dynamic';

type ReviewData = {
  budget?: string[];
  location?: string;
  lifestyle?: string[];
  groupBrief?: Record<string, unknown>;
};

export default function ReviewStep() {
  const [data, setData] = useState<ReviewData>({});

  useEffect(() => {
    setData({
      budget: safeLocalStorage.get('budget', [] as string[]),
      location: safeLocalStorage.get('location', ''),
      lifestyle: safeLocalStorage.get('lifestyle', [] as string[]),
      groupBrief: safeLocalStorage.get('group-brief', {} as Record<string, unknown>),
    });
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Stepper />
      {/* affichage de data ici */}
    </main>
  );
}
