'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingHouse from '@/components/ui/LoadingHouse';

// V3 Owner gradient for loading screen
const ownerGradientLight = 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)';

export default function AddPropertyPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to owner dashboard with modal trigger
    router.replace('/dashboard/owner?addProperty=true');
  }, [router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: ownerGradientLight }}
    >
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <LoadingHouse size={80} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Redirection...
        </h3>
        <p className="text-gray-600">Ouverture du formulaire d'ajout</p>
      </div>
    </div>
  );
}
