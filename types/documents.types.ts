/**
 * Document Vault Types
 * For secure storage of property documents
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type DocumentCategory =
  | 'lease'
  | 'insurance'
  | 'inventory'
  | 'rules'
  | 'bills'
  | 'maintenance'
  | 'contracts'
  | 'receipts'
  | 'other';

export interface PropertyDocument {
  id: string;
  property_id: string;
  uploaded_by: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  file_url: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  is_private: boolean;
  requires_approval: boolean;
  expires_at?: string; // ISO date
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface DocumentShare {
  id: string;
  document_id: string;
  shared_with: string;
  can_download: boolean;
  can_delete: boolean;
  shared_by: string;
  shared_at: string;
}

// ============================================================================
// ENRICHED TYPES (with joined data)
// ============================================================================

export interface PropertyDocumentWithUploader extends PropertyDocument {
  uploader_name: string;
  uploader_avatar?: string;
  is_expired: boolean;
  is_expiring_soon: boolean; // Within 30 days
}

export interface DocumentShareWithUser extends DocumentShare {
  user_name: string;
  user_avatar?: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface UploadDocumentForm {
  title: string;
  description?: string;
  category: DocumentCategory;
  file: File;
  is_private?: boolean;
  expires_at?: string;
  tags?: string[];
}

export interface ShareDocumentForm {
  user_id: string;
  can_download: boolean;
  can_delete: boolean;
}

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

export interface DocumentStats {
  total_documents: number;
  total_size_bytes: number;
  by_category: Record<DocumentCategory, number>;
  expiring_soon: number;
  expired: number;
}

// ============================================================================
// UI HELPERS
// ============================================================================

export const DOCUMENT_CATEGORIES: Array<{
  value: DocumentCategory;
  label: string;
  emoji: string;
  color: string;
}> = [
  { value: 'lease', label: 'Bail', emoji: '📄', color: 'bg-blue-100 text-blue-700' },
  { value: 'insurance', label: 'Assurance', emoji: '🛡️', color: 'bg-green-100 text-green-700' },
  { value: 'inventory', label: 'État des lieux', emoji: '📋', color: 'bg-purple-100 text-purple-700' },
  { value: 'rules', label: 'Règlement', emoji: '📜', color: 'bg-orange-100 text-orange-700' },
  { value: 'bills', label: 'Factures', emoji: '🧾', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'maintenance', label: 'Maintenance', emoji: '🔧', color: 'bg-red-100 text-red-700' },
  { value: 'contracts', label: 'Contrats', emoji: '✍️', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'receipts', label: 'Reçus', emoji: '🧾', color: 'bg-pink-100 text-pink-700' },
  { value: 'other', label: 'Autre', emoji: '📎', color: 'bg-gray-100 text-gray-700' },
];

export const FILE_TYPE_ICONS: Record<string, string> = {
  'application/pdf': '📕',
  'image/jpeg': '🖼️',
  'image/png': '🖼️',
  'image/jpg': '🖼️',
  'application/msword': '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
  'application/vnd.ms-excel': '📊',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
  'text/plain': '📄',
  'application/zip': '🗜️',
  default: '📎',
};

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Taille inconnue';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const getCategoryInfo = (category: DocumentCategory) => {
  return DOCUMENT_CATEGORIES.find(cat => cat.value === category) || DOCUMENT_CATEGORIES[DOCUMENT_CATEGORIES.length - 1];
};

export const getFileIcon = (fileType?: string): string => {
  if (!fileType) return FILE_TYPE_ICONS.default;
  return FILE_TYPE_ICONS[fileType] || FILE_TYPE_ICONS.default;
};

export const isDocumentExpired = (expiresAt?: string): boolean => {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
};

export const isDocumentExpiringSoon = (expiresAt?: string): boolean => {
  if (!expiresAt) return false;
  const expiryDate = new Date(expiresAt);
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
};
