/**
 * Centralized User Messages
 *
 * This file contains all user-facing messages for consistency and easy maintenance.
 * Messages are organized by feature and include both success and error states.
 */

import { toast } from 'sonner';

// ============================================================================
// MESSAGE CATEGORIES
// ============================================================================

export const messages = {
  // AUTHENTICATION
  auth: {
    loginSuccess: 'Welcome back! Redirecting to your dashboard...',
    loginError: 'Invalid email or password. Please try again.',
    signupSuccess: 'Account created successfully! Please check your email to verify.',
    signupError: 'Could not create account. Please try again.',
    logoutSuccess: 'You have been logged out successfully.',
    sessionExpired: 'Your session has expired. Please log in again.',
    emailVerificationSent: 'Verification email sent! Please check your inbox.',
    emailVerified: 'Email verified! You can now access all features.',
    passwordResetSent: 'Password reset link sent to your email.',
    passwordResetSuccess: 'Password updated successfully! You can now log in.',
    unauthorized: 'You need to be logged in to access this page.',
  },

  // PROPERTIES
  properties: {
    createSuccess: 'Property listed successfully! It is now visible to searchers.',
    createError: 'Could not create property. Please check all required fields.',
    updateSuccess: 'Property updated successfully.',
    updateError: 'Could not update property. Please try again.',
    deleteSuccess: 'Property deleted successfully.',
    deleteError: 'Could not delete property. It may have active applications.',
    deleteConfirm: 'Are you sure you want to delete this property? This action cannot be undone.',
    publishSuccess: 'Property published! It is now visible to searchers.',
    unpublishSuccess: 'Property unpublished. It is no longer visible to searchers.',
    notFound: 'Property not found. It may have been removed.',
    loadError: 'Could not load properties. Please refresh the page.',
  },

  // APPLICATIONS
  applications: {
    submitSuccess: 'Application submitted successfully! The property owner will review it soon.',
    submitError: 'Could not submit application. Please check all required fields.',
    alreadyApplied: 'You have already applied to this property.',
    withdrawSuccess: 'Application withdrawn successfully.',
    withdrawConfirm: 'Are you sure you want to withdraw your application?',
    approveSuccess: 'Application approved! The applicant has been notified.',
    approveConfirm: 'Are you sure you want to approve this application?',
    rejectSuccess: 'Application rejected. The applicant has been notified.',
    rejectConfirm: 'Are you sure you want to reject this application?',
    deleteSuccess: 'Application deleted successfully.',
    loadError: 'Could not load applications. Please refresh the page.',
    statusUpdateError: 'Could not update application status. Please try again.',
  },

  // GROUPS
  groups: {
    createSuccess: 'Group created successfully! You can now invite members.',
    createError: 'Could not create group. Please check all required fields.',
    updateSuccess: 'Group settings updated successfully.',
    joinSuccess: 'You have joined the group! You can now apply to properties together.',
    leaveSuccess: 'You have left the group.',
    leaveConfirm: 'Are you sure you want to leave this group?',
    deleteSuccess: 'Group deleted successfully.',
    deleteConfirm: 'Are you sure you want to delete this group? All members will be removed.',
    inviteSent: 'Invitation sent successfully.',
    memberAdded: 'Member added to the group.',
    memberRemoved: 'Member removed from the group.',
    maxMembersReached: 'This group has reached its maximum number of members.',
    notFound: 'Group not found. It may have been deleted.',
    loadError: 'Could not load groups. Please refresh the page.',
  },

  // PROFILE
  profile: {
    updateSuccess: 'Profile updated successfully!',
    updateError: 'Could not update profile. Please try again.',
    imageUploadSuccess: 'Profile image uploaded successfully!',
    imageUploadError: 'Could not upload image. Please try a smaller file (max 5MB).',
    imageTooLarge: 'Image is too large. Maximum size is 5MB.',
    invalidImageType: 'Invalid image type. Please upload JPG, PNG, or WebP.',
    onboardingComplete: 'Welcome to EasyCo! Your profile is complete.',
    onboardingIncomplete: 'Please complete your profile to access all features.',
    verificationPending: 'Your verification is pending review.',
    verificationComplete: 'Your profile has been verified!',
    loadError: 'Could not load profile. Please refresh the page.',
  },

  // FAVORITES
  favorites: {
    addSuccess: 'Added to favorites!',
    addError: 'Could not add to favorites. Please try again.',
    removeSuccess: 'Removed from favorites.',
    removeError: 'Could not remove from favorites. Please try again.',
    loadError: 'Could not load favorites. Please refresh the page.',
  },

  // NOTIFICATIONS
  notifications: {
    markReadSuccess: 'Notifications marked as read.',
    clearAllSuccess: 'All notifications cleared.',
    loadError: 'Could not load notifications. Please refresh the page.',
    permissionDenied: 'Please enable notifications to stay updated.',
  },

  // MESSAGES
  messaging: {
    sendSuccess: 'Message sent!',
    sendError: 'Could not send message. Please try again.',
    loadError: 'Could not load messages. Please refresh the page.',
    conversationStarted: 'Conversation started! You can now message each other.',
  },

  // GENERAL
  general: {
    saveSuccess: 'Changes saved successfully!',
    saveError: 'Could not save changes. Please try again.',
    deleteSuccess: 'Deleted successfully.',
    deleteError: 'Could not delete. Please try again.',
    copySuccess: 'Copied to clipboard!',
    networkError: 'Network error. Please check your connection and try again.',
    serverError: 'Server error. Please try again later or contact support.',
    validationError: 'Please check all required fields.',
    unauthorized: 'You do not have permission to perform this action.',
    notFound: 'The requested item was not found.',
    rateLimitExceeded: 'Too many requests. Please wait a moment and try again.',
    maintenanceMode: 'EasyCo is currently under maintenance. Please try again later.',
  },

  // FORM VALIDATION
  validation: {
    required: 'This field is required.',
    invalidEmail: 'Please enter a valid email address.',
    invalidPhone: 'Please enter a valid phone number.',
    passwordTooShort: 'Password must be at least 8 characters.',
    passwordsDoNotMatch: 'Passwords do not match.',
    invalidDate: 'Please enter a valid date.',
    invalidNumber: 'Please enter a valid number.',
    minLength: (min: number) => `Must be at least ${min} characters.`,
    maxLength: (max: number) => `Cannot exceed ${max} characters.`,
    minValue: (min: number) => `Must be at least ${min}.`,
    maxValue: (max: number) => `Cannot exceed ${max}.`,
  },
};

// ============================================================================
// TOAST HELPERS
// ============================================================================

/**
 * Show success message
 */
export function showSuccess(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 3000,
  });
}

/**
 * Show error message
 */
export function showError(message: string, description?: string) {
  toast.error(message, {
    description,
    duration: 5000,
  });
}

/**
 * Show info message
 */
export function showInfo(message: string, description?: string) {
  toast.info(message, {
    description,
    duration: 3000,
  });
}

/**
 * Show warning message
 */
export function showWarning(message: string, description?: string) {
  toast.warning(message, {
    description,
    duration: 4000,
  });
}

/**
 * Show loading message with promise handling
 */
export function showLoading<T>(
  promise: Promise<T>,
  loadingMessages: {
    loading: string;
    success: string;
    error: string;
  }
): Promise<T> {
  toast.promise(promise, {
    loading: loadingMessages.loading,
    success: loadingMessages.success,
    error: loadingMessages.error,
  });
  return promise;
}

/**
 * Show confirmation dialog
 * Note: This uses browser's confirm dialog for simplicity
 * Consider using a custom modal for better UX
 */
export function showConfirm(message: string): boolean {
  return window.confirm(message);
}

// ============================================================================
// ERROR HANDLERS
// ============================================================================

/**
 * Handle API errors consistently
 */
export function handleApiError(error: any, fallbackMessage?: string) {
  // Network error
  if (!navigator.onLine) {
    showError(messages.general.networkError);
    return;
  }

  // Rate limiting
  if (error?.status === 429) {
    showError(messages.general.rateLimitExceeded);
    return;
  }

  // Unauthorized
  if (error?.status === 401) {
    showError(messages.general.unauthorized);
    return;
  }

  // Not found
  if (error?.status === 404) {
    showError(fallbackMessage || messages.general.notFound);
    return;
  }

  // Server error
  if (error?.status >= 500) {
    showError(messages.general.serverError);
    return;
  }

  // Validation error
  if (error?.status === 400) {
    showError(fallbackMessage || messages.general.validationError);
    return;
  }

  // Generic error
  const errorMessage = error?.message || fallbackMessage || messages.general.saveError;
  showError(errorMessage);
}

/**
 * Handle Supabase errors consistently
 */
export function handleSupabaseError(error: any, context?: string) {
  // RLS policy violation
  if (error?.code === '42501') {
    showError(messages.general.unauthorized);
    return;
  }

  // Unique constraint violation
  if (error?.code === '23505') {
    showError('This item already exists.');
    return;
  }

  // Foreign key violation
  if (error?.code === '23503') {
    showError('Cannot delete: This item is being used elsewhere.');
    return;
  }

  // Network error
  if (error?.message?.includes('fetch')) {
    showError(messages.general.networkError);
    return;
  }

  // Generic Supabase error
  const message = context
    ? `Could not ${context}. Please try again.`
    : messages.general.saveError;

  showError(message, error?.message);
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/**
 * Example: Using messages in a component
 *
 * ```tsx
 * import { messages, showSuccess, handleApiError } from '@/lib/utils/messages';
 *
 * async function handleSubmit() {
 *   try {
 *     await createProperty(data);
 *     showSuccess(messages.properties.createSuccess);
 *     router.push('/dashboard');
 *   } catch (error) {
 *     handleApiError(error, messages.properties.createError);
 *   }
 * }
 * ```
 */
