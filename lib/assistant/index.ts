/**
 * Assistant Action System
 *
 * Exports all action-related functionality
 */

export {
  type AssistantAction,
  type AssistantActionType,
  type NavigateAction,
  type SetFiltersAction,
  type OpenModalAction,
  type HighlightElementAction,
  type ScrollToSectionAction,
  type StartTourAction,
  type CopyToClipboardAction,
  type TogglePreferenceAction,
  type ActionResult,
  parseActionsFromResponse,
  NAVIGATION_PATHS,
  OPENABLE_MODALS,
  AVAILABLE_TOURS,
} from './actions';

export {
  AssistantActionProvider,
  useAssistantActions,
  useOptionalAssistantActions,
  useAssistantModal,
  useAssistantElement,
  useAssistantTour,
} from './ActionContext';
