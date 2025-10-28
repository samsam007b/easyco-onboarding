/**
 * Custom hook for form validation with Zod
 *
 * This hook provides a simple API for validating forms with Zod schemas
 * and managing validation errors in React components.
 */

import { useState, useCallback } from 'react';
import { z } from 'zod';
import { validateData, getFirstError } from './schemas';
import { toast } from 'sonner';

interface UseFormValidationOptions {
  /**
   * Show toast error on validation failure
   */
  showToastOnError?: boolean;

  /**
   * Custom error handler
   */
  onError?: (errors: Record<string, string>) => void;
}

export function useFormValidation<T>(
  schema: z.ZodSchema<T>,
  options: UseFormValidationOptions = {}
) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Validate data against the schema
   */
  const validate = useCallback(
    (data: unknown): data is T => {
      setIsValidating(true);
      const result = validateData(schema, data);
      setIsValidating(false);

      if (result.success) {
        setErrors({});
        return true;
      }

      setErrors(result.errors);

      // Show toast with first error if enabled
      if (options.showToastOnError) {
        const firstError = getFirstError(result.errors);
        if (firstError) {
          toast.error(firstError);
        }
      }

      // Call custom error handler
      if (options.onError) {
        options.onError(result.errors);
      }

      return false;
    },
    [schema, options]
  );

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (fieldName: string, value: unknown): boolean => {
      try {
        // Extract the field schema if possible
        const fieldSchema = (schema as any).shape?.[fieldName];
        if (!fieldSchema) {
          console.warn(`No schema found for field: ${fieldName}`);
          return true;
        }

        fieldSchema.parse(value);

        // Remove error for this field
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });

        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: error.errors[0].message,
          }));
        }
        return false;
      }
    },
    [schema]
  );

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Clear error for a specific field
   */
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Set a custom error for a field
   */
  const setFieldError = useCallback((fieldName: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: message,
    }));
  }, []);

  /**
   * Check if a specific field has an error
   */
  const hasError = useCallback(
    (fieldName: string): boolean => {
      return fieldName in errors;
    },
    [errors]
  );

  /**
   * Get error message for a specific field
   */
  const getError = useCallback(
    (fieldName: string): string | undefined => {
      return errors[fieldName];
    },
    [errors]
  );

  /**
   * Check if form has any errors
   */
  const hasErrors = Object.keys(errors).length > 0;

  return {
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    setFieldError,
    hasError,
    getError,
    errors,
    hasErrors,
    isValidating,
  };
}

/**
 * Example usage:
 *
 * ```tsx
 * const MyForm = () => {
 *   const [formData, setFormData] = useState({});
 *   const { validate, getError, hasError, clearFieldError } = useFormValidation(
 *     loginSchema,
 *     { showToastOnError: true }
 *   );
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     if (validate(formData)) {
 *       // Form is valid, submit data
 *       submitForm(formData);
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         type="email"
 *         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 *         onFocus={() => clearFieldError('email')}
 *       />
 *       {hasError('email') && <span>{getError('email')}</span>}
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * };
 * ```
 */
