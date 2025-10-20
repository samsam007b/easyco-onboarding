'use client';

import { useEffect, useState } from 'react';
import Stepper from '@/components/Stepper';
import { safeLocalStorage } from '@/lib/browser';

export const dynamic = 'force-dynamic';

export default function BudgetStep() {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected(safeLocalStorage.get<string[]>('budget', []));
  }, []);

  useEffect(() => {
    safeLocalStorage.set('budget', selected);
  }, [selected]);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Stepper />
      {/* ton interface ici */}
    </main>
  );
}
