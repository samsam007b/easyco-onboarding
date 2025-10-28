/**
 * Centralized Zod Validation Schemas
 *
 * This file contains all validation schemas for forms and data structures.
 * Using Zod provides:
 * - Type-safe validation
 * - Runtime type checking
 * - Clear error messages
 * - Easy integration with forms
 */

import { z } from 'zod';

// ============================================================================
// COMMON VALIDATORS
// ============================================================================

/**
 * Email validation with clear error messages
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

/**
 * Password validation - minimum 8 characters with complexity
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Phone number validation (international format)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
  .optional();

/**
 * URL validation
 */
export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .optional();

/**
 * Postal code validation (flexible for international)
 */
export const postalCodeSchema = z
  .string()
  .min(3, 'Postal code must be at least 3 characters')
  .max(10, 'Postal code cannot exceed 10 characters');

/**
 * Money amount validation (positive numbers)
 */
export const moneySchema = z
  .number()
  .positive('Amount must be positive')
  .finite('Amount must be a valid number');

/**
 * Date validation (future dates only)
 */
export const futureDateSchema = z
  .string()
  .refine(
    (date) => new Date(date) > new Date(),
    'Date must be in the future'
  );

// ============================================================================
// USER & AUTHENTICATION SCHEMAS
// ============================================================================

/**
 * Login form validation
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Signup form validation
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  userType: z.enum(['searcher', 'owner', 'resident'], {
    errorMap: () => ({ message: 'Please select a user type' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * User profile update schema
 */
export const userProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone_number: phoneSchema,
  nationality: z.string().optional(),
  date_of_birth: z.string().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

// ============================================================================
// PROPERTY SCHEMAS
// ============================================================================

/**
 * Property creation/update schema
 */
export const propertySchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title cannot exceed 100 characters'),

  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),

  property_type: z.enum(['apartment', 'house', 'studio', 'coliving', 'shared_room', 'private_room', 'entire_place'], {
    errorMap: () => ({ message: 'Please select a valid property type' }),
  }),

  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  postal_code: postalCodeSchema,

  bedrooms: z
    .number()
    .int('Bedrooms must be a whole number')
    .min(0, 'Bedrooms cannot be negative')
    .max(20, 'Bedrooms cannot exceed 20'),

  bathrooms: z
    .number()
    .int('Bathrooms must be a whole number')
    .min(0, 'Bathrooms cannot be negative')
    .max(10, 'Bathrooms cannot exceed 10'),

  surface_area: z
    .number()
    .positive('Surface area must be positive')
    .max(10000, 'Surface area cannot exceed 10,000 m²')
    .optional(),

  monthly_rent: moneySchema,
  charges: moneySchema.optional(),
  deposit: moneySchema.optional(),

  furnished: z.boolean(),
  smoking_allowed: z.boolean(),
  pets_allowed: z.boolean(),
  couples_allowed: z.boolean(),

  available_from: z.string().optional(),
  minimum_stay_months: z
    .number()
    .int('Minimum stay must be a whole number')
    .min(1, 'Minimum stay must be at least 1 month')
    .max(24, 'Minimum stay cannot exceed 24 months')
    .optional(),

  amenities: z.array(z.string()).optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;

// ============================================================================
// APPLICATION SCHEMAS
// ============================================================================

/**
 * Property application schema
 */
export const applicationSchema = z.object({
  property_id: z.string().uuid('Invalid property ID'),

  applicant_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),

  applicant_email: emailSchema,
  applicant_phone: phoneSchema,

  desired_move_in_date: z.string().optional(),
  lease_duration_months: z
    .number()
    .int('Lease duration must be a whole number')
    .min(1, 'Lease duration must be at least 1 month')
    .max(60, 'Lease duration cannot exceed 60 months')
    .optional(),

  occupation: z
    .string()
    .min(2, 'Occupation must be at least 2 characters')
    .max(100, 'Occupation cannot exceed 100 characters')
    .optional(),

  monthly_income: moneySchema.optional(),
  employer_name: z.string().max(100, 'Employer name cannot exceed 100 characters').optional(),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters')
    .optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

// ============================================================================
// GROUP SCHEMAS
// ============================================================================

/**
 * Group creation schema
 */
export const groupSchema = z.object({
  name: z
    .string()
    .min(3, 'Group name must be at least 3 characters')
    .max(50, 'Group name cannot exceed 50 characters'),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),

  max_members: z
    .number()
    .int('Max members must be a whole number')
    .min(2, 'Group must allow at least 2 members')
    .max(10, 'Group cannot exceed 10 members'),

  is_private: z.boolean().default(false),
});

export type GroupInput = z.infer<typeof groupSchema>;

// ============================================================================
// PREFERENCES SCHEMAS
// ============================================================================

/**
 * Searcher preferences schema
 */
export const preferencesSchema = z.object({
  budget_min: moneySchema.optional(),
  budget_max: moneySchema,

  preferred_cities: z.array(z.string()).min(1, 'Select at least one city'),

  bedrooms_min: z.number().int().min(0).optional(),
  bathrooms_min: z.number().int().min(0).optional(),

  property_types: z.array(z.string()).min(1, 'Select at least one property type'),

  move_in_date: z.string().optional(),
  lease_duration_months: z.number().int().min(1).max(60).optional(),

  lifestyle_preferences: z.object({
    smoking: z.enum(['yes', 'no', 'no_preference']).optional(),
    pets: z.enum(['yes', 'no', 'no_preference']).optional(),
    noise_level: z.enum(['quiet', 'moderate', 'lively', 'no_preference']).optional(),
    cleanliness: z.enum(['very_clean', 'clean', 'moderate', 'no_preference']).optional(),
  }).optional(),

  required_amenities: z.array(z.string()).optional(),
}).refine(
  (data) => !data.budget_min || data.budget_min < data.budget_max,
  {
    message: 'Minimum budget must be less than maximum budget',
    path: ['budget_min'],
  }
);

export type PreferencesInput = z.infer<typeof preferencesSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate data against a schema and return formatted errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format Zod errors into a more user-friendly structure
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });

  return { success: false, errors };
}

/**
 * Get the first error message from validation result
 */
export function getFirstError(errors: Record<string, string>): string | null {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
}

/**
 * Transform Zod errors for form libraries (React Hook Form, etc.)
 */
export function formatZodErrors(error: z.ZodError) {
  return error.errors.reduce((acc, err) => {
    const path = err.path.join('.');
    acc[path] = err.message;
    return acc;
  }, {} as Record<string, string>);
}
