/**
 * QUERY PARAMETER VALIDATION SCHEMAS
 *
 * Reusable Zod schemas for common API query parameters
 * SECURITY: VULN-005 fix - Prevent DoS via malicious query params
 *
 * Usage:
 *   import { paginationSchema, dateRangeSchema } from '@/lib/validation/query-params';
 *
 *   const { limit, offset } = paginationSchema.parse({
 *     limit: searchParams.get('limit'),
 *     offset: searchParams.get('offset'),
 *   });
 */

import { z } from 'zod';

// ============================================================================
// PAGINATION
// ============================================================================

/**
 * Standard pagination parameters
 * limit: 1-100 (default 20)
 * offset: ≥0 (default 0)
 */
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

/**
 * Page-based pagination (alternative to offset)
 * page: ≥1 (default 1)
 * perPage: 1-100 (default 20)
 */
export const pageBasedPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type PageBasedPaginationParams = z.infer<typeof pageBasedPaginationSchema>;

// ============================================================================
// FILTERING
// ============================================================================

/**
 * Numeric range filter (price, score, etc.)
 * min: ≥0 (default 0)
 * max: ≥min (default null = no max)
 */
export const numericRangeSchema = z.object({
  min: z.coerce.number().min(0).default(0),
  max: z.coerce.number().min(0).optional(),
}).refine(data => !data.max || data.max >= data.min, {
  message: 'max must be greater than or equal to min',
});

export type NumericRangeParams = z.infer<typeof numericRangeSchema>;

/**
 * Date range filter
 * startDate: ISO string or null
 * endDate: ISO string or null (must be after startDate)
 */
export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}).refine(data => {
  if (!data.startDate || !data.endDate) return true;
  return new Date(data.endDate) >= new Date(data.startDate);
}, {
  message: 'endDate must be after startDate',
});

export type DateRangeParams = z.infer<typeof dateRangeSchema>;

// ============================================================================
// SORTING
// ============================================================================

/**
 * Sort parameters with field whitelist
 * Creates a schema that only allows specific fields
 *
 * Usage:
 *   const schema = createSortSchema(['name', 'createdAt', 'score']);
 *   const { sortBy, sortOrder } = schema.parse({ sortBy: 'score', sortOrder: 'desc' });
 */
export function createSortSchema(allowedFields: string[]) {
  return z.object({
    sortBy: z.enum(allowedFields as [string, ...string[]]).default(allowedFields[0]),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  });
}

// ============================================================================
// SEARCH
// ============================================================================

/**
 * Search/query parameter base (for merging with other schemas)
 * q: string with max length 200
 */
export const searchSchemaBase = z.object({
  q: z.string().min(1).max(200).optional(),
  query: z.string().min(1).max(200).optional(),
});

/**
 * Search schema with transform (returns string directly)
 */
export const searchSchema = searchSchemaBase.transform(data => data.q || data.query || '');

export type SearchParams = string; // Returns the query string

// ============================================================================
// MATCHING/SCORE FILTERS
// ============================================================================

/**
 * Matching score filter (specific to Izzico matching system)
 * minScore: 0-100 (default 60)
 */
export const matchingScoreSchema = z.object({
  minScore: z.coerce.number().int().min(0).max(100).default(60),
});

export type MatchingScoreParams = z.infer<typeof matchingScoreSchema>;

// ============================================================================
// COMBINED SCHEMAS
// ============================================================================

/**
 * Pagination + Search combined (common pattern)
 */
export const paginatedSearchSchema = paginationSchema.merge(searchSchemaBase);

/**
 * Pagination + Sorting combined
 * Requires: createSortSchema(['field1', 'field2'])
 */
export function createPaginatedSortSchema(allowedFields: string[]) {
  return paginationSchema.merge(createSortSchema(allowedFields));
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Parse query params with error handling
 * Returns validated params or throws with formatted error
 *
 * Usage:
 *   const params = validateQueryParams(searchParams, paginationSchema);
 */
export function validateQueryParams<T extends z.ZodType>(
  searchParams: URLSearchParams,
  schema: T
): z.infer<T> {
  try {
    const raw = Object.fromEntries(searchParams.entries());
    return schema.parse(raw);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formatted = error.errors.map(e =>
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');

      throw new Error(`Invalid query parameters: ${formatted}`);
    }
    throw error;
  }
}

// ============================================================================
// SECURITY NOTES
// ============================================================================

/**
 * WHY VALIDATION IS CRITICAL:
 *
 * 1. DoS Prevention:
 *    - limit=999999999 → massive database query
 *    - offset=-1 → SQL error
 *
 * 2. Business Logic:
 *    - sortBy='private_field' → data leak
 *    - page=0 → unexpected behavior
 *
 * 3. Data Integrity:
 *    - min > max → nonsensical results
 *    - Invalid dates → crashes
 *
 * 4. AI Code Pattern:
 *    70%+ of AI-generated routes lack input validation (Veracode 2025)
 *    This utility prevents that anti-pattern.
 */
