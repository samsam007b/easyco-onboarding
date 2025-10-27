import { z } from 'zod'

/**
 * Reusable Zod Validation Schemas for EasyCo Platform
 */

// ======================
// COMMON SCHEMAS
// ======================

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')

/**
 * Password validation schema
 * Requires: min 12 chars, uppercase, lowercase, number, special character
 * Blocks common weak passwords
 */
export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (!@#$%^&*)')
  .refine((pwd) => {
    // Block common weak passwords
    const commonPasswords = [
      'password123!',
      '123456789!',
      'qwerty123!',
      'admin123!',
      'welcome123!',
      'password1234',
      '12345678910',
    ];
    return !commonPasswords.includes(pwd.toLowerCase());
  }, 'Password is too common. Please choose a stronger password')

/**
 * Strong password schema (deprecated - passwordSchema now includes special characters)
 * @deprecated Use passwordSchema instead, which now requires special characters
 */
export const strongPasswordSchema = passwordSchema

/**
 * French phone number schema
 */
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(
    /^(0[1-9]\d{8}|(\+33|0033)[1-9]\d{8})$/,
    'Please enter a valid French phone number'
  )

/**
 * French postal code schema
 */
export const postalCodeSchema = z
  .string()
  .min(1, 'Postal code is required')
  .regex(/^\d{5}$/, 'Please enter a valid 5-digit postal code')

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .optional()
  .or(z.literal(''))

/**
 * Positive number schema
 */
export const positiveNumberSchema = z
  .number()
  .positive('Must be a positive number')

/**
 * Positive integer schema
 */
export const positiveIntegerSchema = z
  .number()
  .int('Must be an integer')
  .positive('Must be a positive number')

/**
 * Age schema (18-100)
 */
export const ageSchema = z
  .number()
  .int('Age must be a whole number')
  .min(18, 'Must be at least 18 years old')
  .max(100, 'Please enter a valid age')

/**
 * Date schema (future dates only)
 */
export const futureDateSchema = z
  .string()
  .refine((date) => new Date(date) > new Date(), {
    message: 'Date must be in the future',
  })

/**
 * Date schema (past dates only)
 */
export const pastDateSchema = z
  .string()
  .refine((date) => new Date(date) < new Date(), {
    message: 'Date must be in the past',
  })

// ======================
// USER SCHEMAS
// ======================

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

/**
 * Signup schema
 */
export const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  userType: z.enum(['searcher', 'owner', 'resident']),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ['confirmNewPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
})

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: phoneSchema.optional().or(z.literal('')),
  avatarUrl: urlSchema,
})

// ======================
// PROPERTY SCHEMAS
// ======================

/**
 * Property search schema
 */
export const propertySearchSchema = z.object({
  city: z.string().optional(),
  minPrice: positiveNumberSchema.optional(),
  maxPrice: positiveNumberSchema.optional(),
  bedrooms: positiveIntegerSchema.optional(),
  propertyType: z.enum(['apartment', 'house', 'studio', 'room']).optional(),
  furnished: z.boolean().optional(),
  petsAllowed: z.boolean().optional(),
})

/**
 * Add property schema
 */
export const addPropertySchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  propertyType: z.enum(['apartment', 'house', 'studio', 'room']),
  address: z.string().min(5, 'Please enter a valid address'),
  city: z.string().min(2, 'Please enter a city'),
  postalCode: postalCodeSchema,
  totalBedrooms: positiveIntegerSchema,
  availableBedrooms: positiveIntegerSchema,
  bathrooms: positiveNumberSchema,
  squareMeters: positiveNumberSchema.optional(),
  monthlyRent: positiveNumberSchema,
  deposit: positiveNumberSchema.optional(),
  utilitiesIncluded: z.boolean(),
  furnished: z.boolean(),
  parking: z.boolean(),
  wifi: z.boolean(),
  petsAllowed: z.boolean(),
  smokingAllowed: z.boolean(),
  availableFrom: futureDateSchema,
  minimumStayMonths: positiveIntegerSchema.optional(),
}).refine((data) => data.availableBedrooms <= data.totalBedrooms, {
  message: 'Available bedrooms cannot exceed total bedrooms',
  path: ['availableBedrooms'],
})

// ======================
// CONTACT SCHEMAS
// ======================

/**
 * Contact form schema
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

/**
 * Support ticket schema
 */
export const supportTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  category: z.enum(['technical', 'billing', 'account', 'other']),
  priority: z.enum(['low', 'medium', 'high']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  attachments: z.array(z.string()).optional(),
})

// ======================
// EXPORT TYPES
// ======================

// Infer TypeScript types from schemas
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type PropertySearchFormData = z.infer<typeof propertySearchSchema>
export type AddPropertyFormData = z.infer<typeof addPropertySchema>
export type ContactFormData = z.infer<typeof contactFormSchema>
export type SupportTicketFormData = z.infer<typeof supportTicketSchema>
