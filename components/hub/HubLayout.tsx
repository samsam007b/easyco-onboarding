'use client';

import { ReactNode } from 'react';
import ResidenceHeader from './ResidenceHeader';

interface HubLayoutProps {
  children: ReactNode;
}

export default function HubLayout({ children }: HubLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <ResidenceHeader />
        {children}
      </div>
    </div>
  );
}
