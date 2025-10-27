import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

/**
 * Enhanced toast notifications with better UX
 */

export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 4000,
    icon: '✓',
  });
};

export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
    duration: 5000,
    icon: '✕',
  });
};

export const showWarningToast = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    duration: 4000,
    icon: '⚠',
  });
};

export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, {
    description,
    duration: 4000,
    icon: 'ℹ',
  });
};

export const showLoadingToast = (message: string, description?: string) => {
  return toast.loading(message, {
    description,
  });
};

export const showPromiseToast = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    duration: 4000,
  });
};

/**
 * Action toasts with buttons
 */
export const showActionToast = (
  message: string,
  action: {
    label: string;
    onClick: () => void;
  },
  description?: string
) => {
  toast(message, {
    description,
    duration: 6000,
    action: {
      label: action.label,
      onClick: action.onClick,
    },
  });
};

/**
 * Confirmation toasts
 */
export const showConfirmToast = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  toast(message, {
    duration: 10000,
    action: {
      label: 'Confirm',
      onClick: onConfirm,
    },
    cancel: onCancel ? {
      label: 'Cancel',
      onClick: onCancel,
    } : undefined,
  });
};

/**
 * Specific use-case toasts
 */

export const toasts = {
  // Property actions
  propertyCreated: () => showSuccessToast('Property created successfully!', 'Your property has been added to your listings.'),
  propertyUpdated: () => showSuccessToast('Property updated!', 'Your changes have been saved.'),
  propertyDeleted: () => showSuccessToast('Property deleted', 'The property has been removed from your listings.'),
  propertyPublished: () => showSuccessToast('Property published!', 'Your property is now visible to searchers.'),
  propertyArchived: () => showSuccessToast('Property archived', 'The property is no longer visible to searchers.'),

  // Favorites
  addedToFavorites: (propertyName?: string) =>
    showSuccessToast(
      'Added to favorites',
      propertyName ? `${propertyName} has been added to your favorites.` : 'Property added to your favorites.'
    ),
  removedFromFavorites: (propertyName?: string) =>
    showInfoToast(
      'Removed from favorites',
      propertyName ? `${propertyName} has been removed from your favorites.` : 'Property removed from your favorites.'
    ),

  // Applications
  applicationSubmitted: () =>
    showSuccessToast('Application submitted!', 'The property owner will review your application soon.'),
  applicationApproved: () =>
    showSuccessToast('Application approved!', 'Congratulations! Your application has been accepted.'),
  applicationRejected: () =>
    showErrorToast('Application not accepted', 'Unfortunately, your application was not accepted this time.'),
  applicationWithdrawn: () =>
    showInfoToast('Application withdrawn', 'Your application has been withdrawn.'),

  // Messages
  messageSent: () => showSuccessToast('Message sent'),
  messageReceived: (senderName: string) =>
    showInfoToast('New message', `${senderName} sent you a message.`),

  // Profile
  profileUpdated: () => showSuccessToast('Profile updated!', 'Your changes have been saved.'),
  avatarUpdated: () => showSuccessToast('Profile picture updated!'),
  passwordChanged: () => showSuccessToast('Password changed', 'Your password has been updated successfully.'),

  // Auth
  loginSuccess: (name?: string) =>
    showSuccessToast(`Welcome back${name ? ', ' + name : ''}!`),
  logoutSuccess: () => showInfoToast('Logged out', 'You have been logged out successfully.'),
  signupSuccess: () => showSuccessToast('Account created!', 'Welcome to EasyCo!'),

  // Errors
  networkError: () =>
    showErrorToast('Connection error', 'Please check your internet connection and try again.'),
  serverError: () =>
    showErrorToast('Server error', 'Something went wrong on our end. Please try again later.'),
  validationError: (field: string) =>
    showErrorToast('Validation error', 'Please check the ' + field + ' field.'),
  permissionDenied: () =>
    showErrorToast('Permission denied', 'You do not have permission to perform this action.'),
  notFound: (resource: string) =>
    showErrorToast('Not found', 'The ' + resource + ' you are looking for does not exist.'),

  // Generic
  saved: () => showSuccessToast('Saved'),
  deleted: () => showSuccessToast('Deleted'),
  copied: () => showSuccessToast('Copied to clipboard'),
  loading: (message: string = 'Loading...') => showLoadingToast(message),
};
