'use client';

import { AlertCircle } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 fixed top-0 left-0 right-0 z-[100] shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm sm:text-base font-semibold">
        <AlertCircle className="w-5 h-5 animate-pulse" />
        <span className="text-center">
          DEMO VERSION - Test Environment - All data is fictional
        </span>
        <AlertCircle className="w-5 h-5 animate-pulse" />
      </div>
    </div>
  );
}
