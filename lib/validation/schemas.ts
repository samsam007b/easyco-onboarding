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
 * Property type validation
 */
export const propertyTypeSchema = z.enum([
  'apartment',
  'house',
  'studio',
  'coliving',
  'shared_room',
  'private_room',
  'entire_place',
], {
  errorMap: () => ({ message: 'Please select a valid property type' }),
});

/**
 * Property amenities validation
 */
export const propertyAmenitiesSchema = z.array(
  z.enum([
    'wifi',
    'parking',
    'elevator',
    'balcony',
    'garden',
    'gym',
    'laundry',
    'dishwasher',
    'washing_machine',
    'dryer',
    'air_conditioning',
    'heating',
    'kitchen',
    'furnished',
    'pets_allowed',
    'smoking_allowed',
    'wheelchair_accessible',
    'security',
    'concierge',
    'pool',
    'terrace',
  ])
).default([]);

/**
 * Property creation/update schema (comprehensive)
 */
export const propertySchema = z.object({
  // Basic Information
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(255, 'Title must not exceed 255 characters'),

  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must not exceed 5000 characters')
    .optional(),

  property_type: propertyTypeSchema,

  // Location
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required').max(100),
  neighborhood: z.string().max(100).optional(),
  postal_code: postalCodeSchema,
  country: z.string().min(2).max(100).default('France'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),

  // Property Details
  bedrooms: z
    .number()
    .int('Bedrooms must be a whole number')
    .min(0, 'Bedrooms cannot be negative')
    .max(20, 'Maximum 20 bedrooms allowed'),

  bathrooms: z
    .number()
    .int('Bathrooms must be a whole number')
    .min(0, 'Bathrooms cannot be negative')
    .max(10, 'Maximum 10 bathrooms allowed'),

  total_rooms: z
    .number()
    .int()
    .min(0)
    .max(50)
    .optional(),

  surface_area: z
    .number()
    .int('Surface area must be a whole number')
    .min(1, 'Surface area must be at least 1 m²')
    .max(10000, 'Surface area cannot exceed 10,000 m²')
    .optional(),

  floor_number: z
    .number()
    .int()
    .min(-5, 'Floor number must be between -5 and 200')
    .max(200)
    .optional(),

  total_floors: z
    .number()
    .int()
    .min(1)
    .max(200)
    .optional(),

  furnished: z.boolean().default(false),

  // Pricing
  monthly_rent: moneySchema,
  charges: moneySchema.default(0),
  deposit: moneySchema.optional(),

  // Availability
  available_from: z.string().optional(),
  available_until: z.string().optional(),
  minimum_stay_months: z
    .number()
    .int()
    .min(1, 'Minimum stay must be at least 1 month')
    .max(24, 'Minimum stay cannot exceed 24 months')
    .default(1),

  maximum_stay_months: z
    .number()
    .int()
    .min(1)
    .max(60)
    .optional(),

  // Amenities
  amenities: propertyAmenitiesSchema,

  // Rules & Preferences
  smoking_allowed: z.boolean().default(false),
  pets_allowed: z.boolean().default(false),
  couples_allowed: z.boolean().default(true),
  children_allowed: z.boolean().default(true),

  // Images
  images: z.array(z.string().url()).max(20, 'Maximum 20 images allowed').default([]),
  main_image: z.string().url().optional(),
});

/**
 * Property filter schema for search
 */
export const propertyFiltersSchema = z.object({
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  property_type: propertyTypeSchema.optional(),
  min_price: moneySchema.optional(),
  max_price: moneySchema.optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().int().min(0).max(10).optional(),
  amenities: propertyAmenitiesSchema.optional(),
  is_furnished: z.boolean().optional(),
  pets_allowed: z.boolean().optional(),
  smoking_allowed: z.boolean().optional(),
  available_from: z.string().optional(),
  minimum_stay_months: z.number().int().min(1).max(24).optional(),
  maximum_stay_months: z.number().int().min(1).max(60).optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;
export type PropertyFilters = z.infer<typeof propertyFiltersSchema>;

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

// (Group schemas will be added when needed)

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

