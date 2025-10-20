'use client';

import { useEffect, useState } from 'react';
import Stepper from '@/components/Stepper';
import { safeLocalStorage } from '@/lib/browser';

export const dynamic = 'force-dynamic';

export default function LocationStep() {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue(safeLocalStorage.get('location', ''));
  }, []);

  useEffect(() => {
    safeLocalStorage.set('location', value);
  }, [value]);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Stepper />
      {/* ton interface ici */}
    </main>
  );
}
