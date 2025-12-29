'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  isCompleted: boolean;
}

interface UseGettingStartedOptions {
  checklistId: string; // 'searcher-checklist' or 'resident-checklist'
  items: Omit<ChecklistItem, 'isCompleted'>[];
  onAllComplete?: () => void;
}

const STORAGE_KEY = 'easyco_getting_started';

export function useGettingStarted({ checklistId, items, onAllComplete }: UseGettingStartedOptions) {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const checklistData = parsed[checklistId];
      if (checklistData) {
        setCompletedItems(new Set(checklistData.completed || []));
        setIsDismissed(checklistData.dismissed || false);
      }
    }
    setIsLoaded(true);
  }, [checklistId]);

  // Save progress to localStorage
  const saveProgress = useCallback((completed: Set<string>, dismissed: boolean) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    parsed[checklistId] = {
      completed: Array.from(completed),
      dismissed,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }, [checklistId]);

  // Mark an item as complete
  const completeItem = useCallback((itemId: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      newSet.add(itemId);
      saveProgress(newSet, isDismissed);

      // Check if all items are now complete
      if (newSet.size === items.length && onAllComplete) {
        setTimeout(onAllComplete, 500); // Small delay for animation
      }

      return newSet;
    });
  }, [items.length, onAllComplete, saveProgress, isDismissed]);

  // Unmark an item (for testing/undo)
  const uncompleteItem = useCallback((itemId: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      saveProgress(newSet, isDismissed);
      return newSet;
    });
  }, [saveProgress, isDismissed]);

  // Dismiss the checklist
  const dismissChecklist = useCallback(() => {
    setIsDismissed(true);
    saveProgress(completedItems, true);
  }, [completedItems, saveProgress]);

  // Show the checklist again
  const showChecklist = useCallback(() => {
    setIsDismissed(false);
    saveProgress(completedItems, false);
  }, [completedItems, saveProgress]);

  // Reset checklist (for testing)
  const resetChecklist = useCallback(() => {
    setCompletedItems(new Set());
    setIsDismissed(false);
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    delete parsed[checklistId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }, [checklistId]);

  // Build the items with completion status
  const checklistItems: ChecklistItem[] = items.map(item => ({
    ...item,
    isCompleted: completedItems.has(item.id),
  }));

  const completedCount = completedItems.size;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isAllComplete = completedCount === totalCount;

  return {
    items: checklistItems,
    completedCount,
    totalCount,
    progress,
    isAllComplete,
    isDismissed,
    isLoaded,
    completeItem,
    uncompleteItem,
    dismissChecklist,
    showChecklist,
    resetChecklist,
  };
}

// Predefined checklist items for searchers
export const SEARCHER_CHECKLIST_ITEMS: Omit<ChecklistItem, 'isCompleted'>[] = [
  {
    id: 'complete-profile',
    title: 'Complète ton profil',
    description: 'Ajoute ta photo et tes infos pour te démarquer',
    icon: 'User',
    action: {
      label: 'Compléter',
      href: '/profile',
    },
  },
  {
    id: 'save-search',
    title: 'Sauvegarde une recherche',
    description: 'Reçois des alertes pour les nouvelles colocs',
    icon: 'Search',
  },
  {
    id: 'like-first-coloc',
    title: 'Like ta première coloc',
    description: 'Montre ton intérêt pour une colocation',
    icon: 'Heart',
  },
  {
    id: 'send-first-message',
    title: 'Envoie ton premier message',
    description: 'Présente-toi aux colocataires',
    icon: 'MessageCircle',
  },
];

// Predefined checklist items for residents
export const RESIDENT_CHECKLIST_ITEMS: Omit<ChecklistItem, 'isCompleted'>[] = [
  {
    id: 'complete-listing',
    title: 'Complète ton annonce',
    description: 'Ajoute des photos et une description attirante',
    icon: 'Home',
    action: {
      label: 'Compléter',
      href: '/my-listing',
    },
  },
  {
    id: 'add-roommates',
    title: 'Invite tes colocataires',
    description: 'Crée un profil de coloc complet',
    icon: 'Users',
  },
  {
    id: 'set-preferences',
    title: 'Définis tes critères',
    description: 'Précise le profil idéal recherché',
    icon: 'Sliders',
  },
  {
    id: 'review-first-candidate',
    title: 'Évalue une candidature',
    description: 'Découvre les profils intéressés',
    icon: 'UserCheck',
  },
];
