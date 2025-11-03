'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ComparisonContextType {
  selectedPropertyIds: string[];
  addToComparison: (propertyId: string) => void;
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;
  isSelected: (propertyId: string) => boolean;
  canAddMore: boolean;
  goToComparison: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);

  const addToComparison = useCallback((propertyId: string) => {
    setSelectedPropertyIds((prev) => {
      if (prev.includes(propertyId)) {
        return prev;
      }
      if (prev.length >= 3) {
        toast.error('Tu ne peux comparer que 3 propriétés maximum');
        return prev;
      }
      toast.success('Ajouté à la comparaison');
      return [...prev, propertyId];
    });
  }, []);

  const removeFromComparison = useCallback((propertyId: string) => {
    setSelectedPropertyIds((prev) => {
      const filtered = prev.filter((id) => id !== propertyId);
      toast.success('Retiré de la comparaison');
      return filtered;
    });
  }, []);

  const clearComparison = useCallback(() => {
    setSelectedPropertyIds([]);
    toast.success('Sélection effacée');
  }, []);

  const isSelected = useCallback(
    (propertyId: string) => {
      return selectedPropertyIds.includes(propertyId);
    },
    [selectedPropertyIds]
  );

  const goToComparison = useCallback(() => {
    if (selectedPropertyIds.length < 2) {
      toast.error('Sélectionne au moins 2 propriétés à comparer');
      return;
    }
    router.push(`/properties/compare?ids=${selectedPropertyIds.join(',')}`);
  }, [selectedPropertyIds, router]);

  const canAddMore = selectedPropertyIds.length < 3;

  return (
    <ComparisonContext.Provider
      value={{
        selectedPropertyIds,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isSelected,
        canAddMore,
        goToComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
