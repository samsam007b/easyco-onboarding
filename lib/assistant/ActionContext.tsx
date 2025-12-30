'use client';

/**
 * ASSISTANT ACTION CONTEXT
 *
 * Global context for executing assistant actions throughout the app.
 * Components can register themselves to be controlled by the assistant.
 */

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  type AssistantAction,
  type ActionResult,
  NAVIGATION_PATHS,
  OPENABLE_MODALS,
} from './actions';

// =====================================================
// CONTEXT TYPES
// =====================================================

interface ModalRegistry {
  [modalId: string]: {
    open: (context?: Record<string, unknown>) => void;
    close: () => void;
  };
}

interface ElementRegistry {
  [selector: string]: HTMLElement;
}

interface TourRegistry {
  [tourId: string]: () => void;
}

interface AssistantActionContextValue {
  // Execute an action
  executeAction: (action: AssistantAction) => Promise<ActionResult>;

  // Execute multiple actions in sequence
  executeActions: (actions: AssistantAction[]) => Promise<ActionResult[]>;

  // Registry methods for components to register themselves
  registerModal: (modalId: string, handlers: ModalRegistry[string]) => void;
  unregisterModal: (modalId: string) => void;

  registerElement: (selector: string, element: HTMLElement) => void;
  unregisterElement: (selector: string) => void;

  registerTour: (tourId: string, startTour: () => void) => void;
  unregisterTour: (tourId: string) => void;

  // Current highlight state
  highlightedElement: string | null;
  highlightMessage: string | null;
  clearHighlight: () => void;

  // Action feedback
  lastActionResult: ActionResult | null;
  clearActionResult: () => void;

  // Search filters state (for cross-page filter setting)
  pendingFilters: Record<string, unknown> | null;
  clearPendingFilters: () => void;
}

// =====================================================
// CONTEXT
// =====================================================

const AssistantActionContext = createContext<AssistantActionContextValue | null>(null);

// =====================================================
// PROVIDER
// =====================================================

export function AssistantActionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Registries
  const modalRegistry = useRef<ModalRegistry>({});
  const elementRegistry = useRef<ElementRegistry>({});
  const tourRegistry = useRef<TourRegistry>({});

  // State
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [highlightMessage, setHighlightMessage] = useState<string | null>(null);
  const [lastActionResult, setLastActionResult] = useState<ActionResult | null>(null);
  const [pendingFilters, setPendingFilters] = useState<Record<string, unknown> | null>(null);

  // =====================================================
  // REGISTRY METHODS
  // =====================================================

  const registerModal = useCallback((modalId: string, handlers: ModalRegistry[string]) => {
    modalRegistry.current[modalId] = handlers;
  }, []);

  const unregisterModal = useCallback((modalId: string) => {
    delete modalRegistry.current[modalId];
  }, []);

  const registerElement = useCallback((selector: string, element: HTMLElement) => {
    elementRegistry.current[selector] = element;
  }, []);

  const unregisterElement = useCallback((selector: string) => {
    delete elementRegistry.current[selector];
  }, []);

  const registerTour = useCallback((tourId: string, startTour: () => void) => {
    tourRegistry.current[tourId] = startTour;
  }, []);

  const unregisterTour = useCallback((tourId: string) => {
    delete tourRegistry.current[tourId];
  }, []);

  // =====================================================
  // CLEAR METHODS
  // =====================================================

  const clearHighlight = useCallback(() => {
    setHighlightedElement(null);
    setHighlightMessage(null);
  }, []);

  const clearActionResult = useCallback(() => {
    setLastActionResult(null);
  }, []);

  const clearPendingFilters = useCallback(() => {
    setPendingFilters(null);
  }, []);

  // =====================================================
  // ACTION EXECUTORS
  // =====================================================

  const executeNavigate = useCallback(
    async (action: AssistantAction & { type: 'navigate' }): Promise<ActionResult> => {
      try {
        router.push(action.path);
        return {
          success: true,
          message: `Navigation vers ${action.description}`,
          navigatedTo: action.path,
        };
      } catch (error) {
        return {
          success: false,
          message: `Erreur de navigation: ${error}`,
        };
      }
    },
    [router]
  );

  const executeSetFilters = useCallback(
    async (action: AssistantAction & { type: 'setFilters' }): Promise<ActionResult> => {
      // Store filters to be applied on the search page
      setPendingFilters(action.filters);

      // Navigate to search page if not already there
      const targetPath = action.navigateTo || '/search';
      if (pathname !== targetPath) {
        router.push(targetPath);
      }

      const filterSummary = Object.entries(action.filters)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => {
          if (k === 'city') return `Ville: ${v}`;
          if (k === 'maxBudget') return `Budget max: ${v}€`;
          if (k === 'minBudget') return `Budget min: ${v}€`;
          if (k === 'roomType') return `Type: ${v}`;
          return `${k}: ${v}`;
        })
        .join(', ');

      return {
        success: true,
        message: `Filtres configurés: ${filterSummary}`,
        navigatedTo: targetPath,
      };
    },
    [pathname, router]
  );

  const executeOpenModal = useCallback(
    async (action: AssistantAction & { type: 'openModal' }): Promise<ActionResult> => {
      const modalConfig = OPENABLE_MODALS[action.modal as keyof typeof OPENABLE_MODALS];

      if (!modalConfig) {
        return {
          success: false,
          message: `Modal "${action.modal}" non reconnu`,
        };
      }

      // Navigate to required page if needed
      if (modalConfig.requiredPage && pathname !== modalConfig.requiredPage) {
        router.push(modalConfig.requiredPage);
        // Wait for navigation, then try to open modal
        setTimeout(() => {
          const modal = modalRegistry.current[action.modal];
          if (modal) {
            modal.open(action.context);
          }
        }, 500);

        return {
          success: true,
          message: `Navigation vers ${modalConfig.requiredPage} et ouverture de ${modalConfig.description}`,
          navigatedTo: modalConfig.requiredPage,
        };
      }

      // Open modal directly
      const modal = modalRegistry.current[action.modal];
      if (modal) {
        modal.open(action.context);
        return {
          success: true,
          message: `Ouverture de ${modalConfig.description}`,
        };
      }

      return {
        success: false,
        message: `Le formulaire "${action.modal}" n'est pas disponible sur cette page`,
      };
    },
    [pathname, router]
  );

  const executeHighlight = useCallback(
    async (action: AssistantAction & { type: 'highlightElement' }): Promise<ActionResult> => {
      // Try to find element by selector or data-assistant-id
      let element = elementRegistry.current[action.selector];

      if (!element) {
        element = document.querySelector(action.selector) as HTMLElement;
      }

      if (!element) {
        element = document.querySelector(
          `[data-assistant-id="${action.selector}"]`
        ) as HTMLElement;
      }

      if (element) {
        setHighlightedElement(action.selector);
        setHighlightMessage(action.message || null);

        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add highlight class
        element.classList.add('assistant-highlight');

        // Clear highlight after duration
        const duration = action.duration || 5000;
        setTimeout(() => {
          element?.classList.remove('assistant-highlight');
          clearHighlight();
        }, duration);

        return {
          success: true,
          message: action.message || `Élément "${action.selector}" mis en évidence`,
        };
      }

      return {
        success: false,
        message: `Élément "${action.selector}" non trouvé sur cette page`,
      };
    },
    [clearHighlight]
  );

  const executeScroll = useCallback(
    async (action: AssistantAction & { type: 'scrollToSection' }): Promise<ActionResult> => {
      // Try to find section
      let section = document.getElementById(action.section);

      if (!section) {
        section = document.querySelector(`[data-section="${action.section}"]`) as HTMLElement;
      }

      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Optionally highlight
        if (action.highlight) {
          section.classList.add('assistant-highlight');
          setTimeout(() => {
            section?.classList.remove('assistant-highlight');
          }, 3000);
        }

        return {
          success: true,
          message: `Défilement vers la section "${action.section}"`,
        };
      }

      return {
        success: false,
        message: `Section "${action.section}" non trouvée`,
      };
    },
    []
  );

  const executeStartTour = useCallback(
    async (action: AssistantAction & { type: 'startTour' }): Promise<ActionResult> => {
      const startTour = tourRegistry.current[action.tour];

      if (startTour) {
        startTour();
        return {
          success: true,
          message: `Tour "${action.tour}" démarré`,
        };
      }

      return {
        success: false,
        message: `Tour "${action.tour}" non disponible`,
      };
    },
    []
  );

  const executeCopy = useCallback(
    async (action: AssistantAction & { type: 'copyToClipboard' }): Promise<ActionResult> => {
      try {
        await navigator.clipboard.writeText(action.text);
        return {
          success: true,
          message: `${action.label} copié dans le presse-papier`,
        };
      } catch (error) {
        return {
          success: false,
          message: `Erreur lors de la copie: ${error}`,
        };
      }
    },
    []
  );

  const executeToggle = useCallback(
    async (action: AssistantAction & { type: 'togglePreference' }): Promise<ActionResult> => {
      // This would integrate with your settings system
      // For now, just acknowledge the action
      return {
        success: true,
        message: `Préférence "${action.preference}" modifiée`,
      };
    },
    []
  );

  // =====================================================
  // MAIN EXECUTE METHOD
  // =====================================================

  const executeAction = useCallback(
    async (action: AssistantAction): Promise<ActionResult> => {
      console.log('[AssistantAction] Executing:', action);

      let result: ActionResult;

      switch (action.type) {
        case 'navigate':
          result = await executeNavigate(action);
          break;
        case 'setFilters':
          result = await executeSetFilters(action);
          break;
        case 'openModal':
          result = await executeOpenModal(action);
          break;
        case 'highlightElement':
          result = await executeHighlight(action);
          break;
        case 'scrollToSection':
          result = await executeScroll(action);
          break;
        case 'startTour':
          result = await executeStartTour(action);
          break;
        case 'copyToClipboard':
          result = await executeCopy(action);
          break;
        case 'togglePreference':
          result = await executeToggle(action);
          break;
        default:
          result = {
            success: false,
            message: `Type d'action inconnu: ${(action as AssistantAction).type}`,
          };
      }

      setLastActionResult(result);
      return result;
    },
    [
      executeNavigate,
      executeSetFilters,
      executeOpenModal,
      executeHighlight,
      executeScroll,
      executeStartTour,
      executeCopy,
      executeToggle,
    ]
  );

  const executeActions = useCallback(
    async (actions: AssistantAction[]): Promise<ActionResult[]> => {
      const results: ActionResult[] = [];

      for (const action of actions) {
        const result = await executeAction(action);
        results.push(result);

        // Small delay between actions for UX
        if (actions.indexOf(action) < actions.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      return results;
    },
    [executeAction]
  );

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value: AssistantActionContextValue = {
    executeAction,
    executeActions,
    registerModal,
    unregisterModal,
    registerElement,
    unregisterElement,
    registerTour,
    unregisterTour,
    highlightedElement,
    highlightMessage,
    clearHighlight,
    lastActionResult,
    clearActionResult,
    pendingFilters,
    clearPendingFilters,
  };

  return (
    <AssistantActionContext.Provider value={value}>
      {children}
    </AssistantActionContext.Provider>
  );
}

// =====================================================
// HOOKS
// =====================================================

export function useAssistantActions() {
  const context = useContext(AssistantActionContext);
  if (!context) {
    throw new Error('useAssistantActions must be used within AssistantActionProvider');
  }
  return context;
}

/**
 * Optional hook that returns null if provider is not present
 * Useful during migration when provider may not be available everywhere
 */
export function useOptionalAssistantActions() {
  return useContext(AssistantActionContext);
}

/**
 * Hook for components to register themselves as controllable by the assistant
 */
export function useAssistantModal(
  modalId: string,
  handlers: { open: (context?: Record<string, unknown>) => void; close: () => void }
) {
  const { registerModal, unregisterModal } = useAssistantActions();

  React.useEffect(() => {
    registerModal(modalId, handlers);
    return () => unregisterModal(modalId);
  }, [modalId, handlers, registerModal, unregisterModal]);
}

/**
 * Hook for components to register highlightable elements
 */
export function useAssistantElement(selector: string, ref: React.RefObject<HTMLElement>) {
  const { registerElement, unregisterElement } = useAssistantActions();

  React.useEffect(() => {
    if (ref.current) {
      registerElement(selector, ref.current);
    }
    return () => unregisterElement(selector);
  }, [selector, ref, registerElement, unregisterElement]);
}

/**
 * Hook for components to register tours
 */
export function useAssistantTour(tourId: string, startTour: () => void) {
  const { registerTour, unregisterTour } = useAssistantActions();

  React.useEffect(() => {
    registerTour(tourId, startTour);
    return () => unregisterTour(tourId);
  }, [tourId, startTour, registerTour, unregisterTour]);
}
