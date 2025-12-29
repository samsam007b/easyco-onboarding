/**
 * Common Types and Interfaces for Izzico Platform
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
  success: boolean
  message?: string
}

/**
 * API error structure
 */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

/**
 * Generic status enum
 */
export type Status = 'active' | 'inactive' | 'pending' | 'archived' | 'deleted'

/**
 * Generic filter options
 */
export interface FilterOptions {
  search?: string
  status?: Status
  dateFrom?: string
  dateTo?: string
  [key: string]: any
}

/**
 * Sort options
 */
export interface SortOptions {
  field: string
  order: 'asc' | 'desc'
}

/**
 * File upload response
 */
export interface FileUpload {
  id: string
  filename: string
  originalFilename: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string
  uploadedAt: string
}

/**
 * Address interface
 */
export interface Address {
  street: string
  city: string
  postalCode: string
  country: string
  neighborhood?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

/**
 * Contact information
 */
export interface ContactInfo {
  email?: string
  phone?: string
  mobile?: string
  website?: string
}

/**
 * Notification interface
 */
export interface Notification {
  id: string
  userId: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: string
}

/**
 * Toast notification type
 */
export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean
  title?: string
  content?: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
}

/**
 * Form field error
 */
export interface FieldError {
  field: string
  message: string
}

/**
 * Form validation errors
 */
export type ValidationErrors = Record<string, string>

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean
  progress?: number
  message?: string
}

/**
 * Feature flag
 */
export interface FeatureFlag {
  name: string
  enabled: boolean
  description?: string
  rolloutPercentage?: number
}

/**
 * Metadata interface (for extensibility)
 */
export type Metadata = Record<string, any>

/**
 * Timestamp fields
 */
export interface Timestamps {
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

/**
 * Select option (for dropdowns, radio groups, etc.)
 */
export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  icon?: React.ReactNode
  description?: string
}

/**
 * Tab item (for tab navigation)
 */
export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  badge?: string | number
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

/**
 * Action button configuration
 */
export interface ActionButton {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

/**
 * Empty state configuration
 */
export interface EmptyState {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: ActionButton
}

/**
 * Data table column definition
 */
export interface TableColumn<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  width?: string
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp: string
  userId?: string
  sessionId?: string
}
