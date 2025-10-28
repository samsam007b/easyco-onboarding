import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing page loading states with async data fetching
 *
 * @example
 * ```tsx
 * const { isLoading, error, execute } = usePageLoading();
 *
 * useEffect(() => {
 *   execute(async () => {
 *     const data = await fetchData();
 *     setData(data);
 *   });
 * }, []);
 *
 * if (isLoading) return <ProfileEditFormSkeleton />;
 * if (error) return <ErrorMessage error={error} />;
 * ```
 */
export function usePageLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (asyncFn: () => Promise<void>) => {
    try {
      setIsLoading(true);
      setError(null);
      await asyncFn();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      console.error('Page loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    execute,
    reset,
    setIsLoading,
    setError,
  };
}

/**
 * Hook for form submission states
 *
 * @example
 * ```tsx
 * const { isSubmitting, error, submit } = useFormSubmit();
 *
 * const handleSubmit = () => {
 *   submit(async () => {
 *     await saveData(formData);
 *     router.push('/success');
 *   });
 * };
 * ```
 */
export function useFormSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(async (asyncFn: () => Promise<void>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await asyncFn();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Submission failed'));
      console.error('Form submission error:', err);
      throw err; // Re-throw so caller can handle
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setError(null);
  }, []);

  return {
    isSubmitting,
    error,
    submit,
    reset,
    setIsSubmitting,
    setError,
  };
}

/**
 * Combined hook for pages with both loading and submission states
 *
 * @example
 * ```tsx
 * const { isLoading, isSubmitting, loadData, submitForm } = usePage Loading AndSubmit();
 *
 * useEffect(() => {
 *   loadData(async () => {
 *     const data = await fetchData();
 *     setData(data);
 *   });
 * }, []);
 *
 * const handleSubmit = () => {
 *   submitForm(async () => {
 *     await saveData(formData);
 *   });
 * };
 * ```
 */
export function usePageLoadingAndSubmit() {
  const loading = usePageLoading();
  const submission = useFormSubmit();

  return {
    // Loading states
    isLoading: loading.isLoading,
    loadingError: loading.error,
    loadData: loading.execute,
    resetLoading: loading.reset,

    // Submission states
    isSubmitting: submission.isSubmitting,
    submissionError: submission.error,
    submitForm: submission.submit,
    resetSubmission: submission.reset,

    // Combined helpers
    hasError: loading.error !== null || submission.error !== null,
    isBusy: loading.isLoading || submission.isSubmitting,
  };
}
