/**
 * Document Vault - Secure Document Storage & Sharing
 * Features: Upload documents, manage categories, share with roommates, expiration tracking
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  FileText,
  Plus,
  Upload,
  Download,
  Share2,
  Trash2,
  Eye,
  Calendar,
  AlertTriangle,
  X,
  Search,
  Filter,
  FolderOpen,
  Shield,
  ClipboardList,
  ScrollText,
  Receipt,
  Wrench,
  FileSignature,
  Paperclip,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { documentService } from '@/lib/services/document-service';
import type {
  PropertyDocumentWithUploader,
  UploadDocumentForm,
  DocumentStats,
  DocumentCategory,
} from '@/types/documents.types';
import {
  DOCUMENT_CATEGORIES,
  getCategoryInfo,
  formatFileSize,
  getFileIcon,
} from '@/types/documents.types';
import { useLanguage } from '@/lib/i18n/use-language';

// Map icon names to icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Shield,
  ClipboardList,
  ScrollText,
  Receipt,
  Wrench,
  FileSignature,
  Paperclip,
};

const getCategoryIcon = (iconName: string) => {
  return iconMap[iconName] || FileText;
};

export default function DocumentsPage() {
  const { getSection, language } = useLanguage();
  const t = getSection('hub')?.documents;
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [documents, setDocuments] = useState<PropertyDocumentWithUploader[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [filterCategory, setFilterCategory] = useState<DocumentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState<Omit<UploadDocumentForm, 'file'>>({
    title: '',
    description: '',
    category: 'other',
    is_private: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // View modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PropertyDocumentWithUploader | null>(
    null
  );

  useEffect(() => {
    loadData();
  }, [filterCategory]);

  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      // Get user's property_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('property_id')
        .eq('id', user.id)
        .single();

      if (!profile?.property_id) {
        setIsLoading(false);
        return;
      }

      setPropertyId(profile.property_id);

      // Fetch documents
      const filters = filterCategory === 'all' ? undefined : { category: filterCategory };
      const documentsData = await documentService.getDocuments(profile.property_id, filters);
      setDocuments(documentsData);

      // Fetch stats
      const statsData = await documentService.getStats(profile.property_id);
      setStats(statsData);

      setIsLoading(false);
    } catch (error) {
      console.error('[Documents] Error loading data:', error);
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (!uploadForm.title) {
      // Auto-fill title from filename
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setUploadForm({ ...uploadForm, title: nameWithoutExt });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!propertyId || !userId || !selectedFile) return;

    if (!uploadForm.title) {
      alert(t?.errors?.titleRequired?.[language] || 'Please give the document a title');
      return;
    }

    setIsUploading(true);

    try {
      const result = await documentService.uploadDocument(propertyId, userId, {
        ...uploadForm,
        file: selectedFile,
      });

      if (result.success) {
        console.log('[Documents] ✅ Document uploaded successfully');
        setShowUploadModal(false);
        resetUploadForm();
        await loadData();
      } else {
        alert(result.error || (t?.errors?.uploadError?.[language] || 'Error uploading'));
      }
    } catch (error) {
      console.error('[Documents] Upload error:', error);
      alert(t?.errors?.genericError?.[language] || 'An error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm(t?.deleteConfirm?.[language] || 'Are you sure you want to delete this document?')) return;

    try {
      const result = await documentService.deleteDocument(documentId);

      if (result.success) {
        console.log('[Documents] ✅ Document deleted');
        setShowViewModal(false);
        await loadData();
      } else {
        alert(result.error || (t?.errors?.deleteError?.[language] || 'Error deleting'));
      }
    } catch (error) {
      console.error('[Documents] Delete error:', error);
      alert(t?.errors?.genericError?.[language] || 'An error occurred');
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      title: '',
      description: '',
      category: 'other',
      is_private: false,
    });
    setSelectedFile(null);
  };

  const filteredDocuments = documents.filter((doc) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.description?.toLowerCase().includes(query) ||
      doc.file_name.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            variant="outline"
            onClick={() => router.push('/hub')}
            className="mb-4 rounded-full border-gray-200 hover:border-transparent"
            style={{ color: '#ff651e' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(217, 87, 79, 0.08) 0%, rgba(255, 128, 23, 0.08) 100%)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            ← {t?.backToHub?.[language] || 'Back to hub'}
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}>
                <FolderOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {t?.title?.[language] || 'Document vault'}
                </h1>
                <p className="text-gray-600">{t?.subtitle?.[language] || 'Store and share your important documents'}</p>
              </div>
            </div>

            <Button
              onClick={() => setShowUploadModal(true)}
              className="rounded-full text-white border-none shadow-lg hover:shadow-xl transition-all"
              style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t?.uploadDocument?.[language] || 'Upload document'}
            </Button>
          </div>

          {/* Stats Cards - V3 Option C Fun Design */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Documents - Orange Gradient */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative overflow-hidden rounded-2xl p-4 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #fff5f3 0%, #ffe8e0 100%)',
                boxShadow: '0 8px 24px rgba(255, 101, 30, 0.15)',
              }}
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
                style={{ background: 'linear-gradient(135deg, #e05747, #ff651e, #ff9014)' }}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-700">{t?.stats?.totalDocuments?.[language] || 'Total Documents'}</span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #e05747, #ff651e, #ff9014)' }}
                >
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_documents || 0}</p>
              <p className="text-xs text-orange-600 font-medium mt-2">{t?.stats?.documentsLabel?.[language] || 'documents'}</p>
            </motion.div>

            {/* Storage Used - Orange Gradient Variant */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative overflow-hidden rounded-2xl p-4 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #fff5f3 0%, #ffede5 100%)',
                boxShadow: '0 8px 24px rgba(255, 101, 30, 0.12)',
              }}
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-15"
                style={{ background: 'linear-gradient(135deg, #ff651e, #ff9014)' }}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-600">{t?.stats?.storageUsed?.[language] || 'Storage used'}</span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #ff651e 0%, #ff9014 100%)' }}
                >
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats?.total_size_bytes)}</p>
              <p className="text-xs text-orange-500 font-medium mt-2">{t?.stats?.usedLabel?.[language] || 'used'}</p>
            </motion.div>

            {/* Expiring Soon - Amber Pastel (Semantic Warning) */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative overflow-hidden rounded-2xl p-4 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                boxShadow: '0 8px 24px rgba(217, 119, 6, 0.12)',
              }}
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-15"
                style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-700">{t?.stats?.expiringSoon?.[language] || 'Expiring soon'}</span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' }}
                >
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.expiring_soon || 0}</p>
              <p className="text-xs text-amber-600 font-medium mt-2">{t?.stats?.attentionLabel?.[language] || 'to watch'}</p>
            </motion.div>

            {/* Expired - Red Pastel (Semantic Error) */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative overflow-hidden rounded-2xl p-4 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #FDF5F5 0%, #FAE8E8 100%)',
                boxShadow: '0 8px 24px rgba(208, 128, 128, 0.12)',
              }}
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-15"
                style={{ background: 'linear-gradient(135deg, #D08080, #E0A0A0)' }}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#B06060]">{t?.stats?.expired?.[language] || 'Expired'}</span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #D08080 0%, #E0A0A0 100%)' }}
                >
                  <Calendar className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.expired || 0}</p>
              <p className="text-xs text-[#C07070] font-medium mt-2">{t?.stats?.toRenewLabel?.[language] || 'to renew'}</p>
            </motion.div>
          </div>

          {/* Search & Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t?.searchPlaceholder?.[language] || 'Search for a document...'}
                className="pl-10 rounded-full"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              <Button
                size="sm"
                variant={filterCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterCategory('all')}
                className="rounded-full flex-shrink-0 text-white border-none"
                style={filterCategory === 'all' ? { background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' } : undefined}
              >
                {t?.filters?.all?.[language] || 'All'}
              </Button>
              {DOCUMENT_CATEGORIES.slice(0, 5).map((cat) => {
                const Icon = getCategoryIcon(cat.icon);
                return (
                  <Button
                    key={cat.value}
                    size="sm"
                    variant={filterCategory === cat.value ? 'default' : 'outline'}
                    onClick={() => setFilterCategory(cat.value)}
                    className="rounded-full flex-shrink-0 text-white border-none"
                    style={filterCategory === cat.value ? { background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' } : undefined}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {cat.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Documents Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full bg-white rounded-3xl shadow-lg p-12 text-center"
              style={{ boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)' }}
            >
              {/* V3 Fun Icon with Glow */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="relative w-24 h-24 mx-auto mb-6"
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-30"
                  style={{
                    background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
                    filter: 'blur(20px)',
                  }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                />
                {/* Main icon container */}
                <div
                  className="relative w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
                    boxShadow: '0 8px 24px rgba(255, 101, 30, 0.35)',
                  }}
                >
                  <FileText className="w-12 h-12 text-white" />
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-white/20"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  />
                </div>
                {/* Floating sparkle */}
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </motion.div>
              </motion.div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{t?.emptyState?.noDocuments?.[language] || 'No documents'}</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">{t?.emptyState?.uploadFirst?.[language] || 'Upload your first document'}</p>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="rounded-full text-white border-none shadow-lg hover:shadow-xl transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
                    boxShadow: '0 4px 14px rgba(255, 101, 30, 0.4)',
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t?.uploadDocument?.[language] || 'Upload document'}
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredDocuments.map((doc, index) => {
                const categoryInfo = getCategoryInfo(doc.category);
                const fileIcon = getFileIcon(doc.file_type);

                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedDocument(doc);
                      setShowViewModal(true);
                    }}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
                  >
                    {/* File Icon & Category */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl">{fileIcon}</div>
                      <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-gray-900 mb-2 truncate">{doc.title}</h3>

                    {/* Description */}
                    {doc.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.description}</p>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span>•</span>
                      <span>{doc.uploader_name}</span>
                      <span>•</span>
                      <span>
                        {new Date(doc.created_at).toLocaleDateString(
                          language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : language === 'nl' ? 'nl-NL' : 'de-DE',
                          { day: 'numeric', month: 'short' }
                        )}
                      </span>
                    </div>

                    {/* Expiration Warning */}
                    {doc.is_expiring_soon && !doc.is_expired && (
                      <div className="flex items-center gap-1 text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full mb-2">
                        <AlertTriangle className="w-3 h-3" />
                        {t?.expiresOn?.[language] || 'Expires on'}{' '}
                        {new Date(doc.expires_at!).toLocaleDateString(
                          language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : language === 'nl' ? 'nl-NL' : 'de-DE',
                          { day: 'numeric', month: 'short' }
                        )}
                      </div>
                    )}

                    {doc.is_expired && (
                      <div className="flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2 py-1 rounded-full mb-2">
                        <Calendar className="w-3 h-3" />
                        {t?.expiredLabel?.[language] || 'Expired'}
                      </div>
                    )}

                    {/* Private Badge */}
                    {doc.is_private && (
                      <Badge variant="secondary" className="text-xs">
                        🔒 {t?.privateLabel?.[language] || 'Private'}
                      </Badge>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Upload Modal - V3 Fun Design */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative border-2 border-orange-100"
            style={{ boxShadow: '0 25px 80px rgba(255, 101, 30, 0.2)' }}
          >
            {/* Decorative gradient circles */}
            <div className="absolute right-0 top-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute left-0 bottom-0 w-24 h-24 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #ff9014 0%, #ff651e 100%)', transform: 'translate(-30%, 30%)' }} />

            {/* Scrollable content wrapper */}
            <div className="max-h-[90vh] overflow-y-auto">
              {/* Header - V3 Fun gradient */}
              <div className="sticky top-0 border-b-2 border-orange-100 px-6 py-5 z-30" style={{ background: '#FFF5F0' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}
                    >
                      <Upload className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {t?.uploadModal?.title?.[language] || 'Upload a document'}
                      </h2>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" style={{ color: '#ff651e' }} />
                        {t?.uploadModal?.subtitle?.[language] || 'Add a new file'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      resetUploadForm();
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-orange-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-5">
                {/* File Upload Zone */}
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 101, 30, 0.15)' }}>
                      <FileText className="w-3.5 h-3.5" style={{ color: '#ff651e' }} />
                    </div>
                    {t?.uploadModal?.file?.[language] || 'File'} *
                  </Label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                      'border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer',
                      dragActive ? 'bg-orange-50 border-orange-300' : 'border-gray-200 hover:border-orange-200'
                    )}
                  >
                    {selectedFile ? (
                      <div className="space-y-2">
                        <div className="text-4xl">{getFileIcon(selectedFile.type)}</div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="rounded-full border-2 border-orange-200 hover:border-orange-400"
                        >
                          {t?.uploadModal?.changeFile?.[language] || 'Change file'}
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255, 101, 30, 0.1)' }}>
                          <Upload className="w-8 h-8" style={{ color: '#ff651e' }} />
                        </div>
                        <p className="text-gray-600 mb-1 font-medium">
                          {t?.uploadModal?.dragDropText?.[language] || 'Drag a file here or click to select'}
                        </p>
                        <p className="text-xs text-gray-500">{t?.uploadModal?.fileTypes?.[language] || 'PDF, Images, Documents (Max 50MB)'}</p>
                        <input
                          type="file"
                          onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 101, 30, 0.15)' }}>
                      <ScrollText className="w-3.5 h-3.5" style={{ color: '#ff651e' }} />
                    </div>
                    {t?.uploadModal?.docTitle?.[language] || 'Title'} *
                  </Label>
                  <Input
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder={t?.uploadModal?.titlePlaceholder?.[language] || 'E.g.: Lease agreement 2024'}
                    className="rounded-2xl border-2 border-gray-200 hover:border-orange-200 focus:border-orange-400 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 101, 30, 0.15)' }}>
                      <FileSignature className="w-3.5 h-3.5" style={{ color: '#ff651e' }} />
                    </div>
                    {t?.uploadModal?.description?.[language] || 'Description (optional)'}
                  </Label>
                  <Textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    placeholder={t?.uploadModal?.descriptionPlaceholder?.[language] || 'Add details about this document...'}
                    className="rounded-2xl border-2 border-gray-200 hover:border-orange-200 focus:border-orange-400 transition-colors min-h-[80px]"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 101, 30, 0.15)' }}>
                      <FolderOpen className="w-3.5 h-3.5" style={{ color: '#ff651e' }} />
                    </div>
                    {t?.uploadModal?.category?.[language] || 'Category'} *
                  </Label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {DOCUMENT_CATEGORIES.map((cat) => {
                      const Icon = getCategoryIcon(cat.icon);
                      return (
                        <button
                          key={cat.value}
                          onClick={() => setUploadForm({ ...uploadForm, category: cat.value })}
                          className={cn(
                            'p-3 rounded-2xl border-2 text-center transition-all',
                            uploadForm.category === cat.value
                              ? 'bg-orange-50 border-orange-400'
                              : 'border-gray-200 hover:border-orange-200'
                          )}
                        >
                          <div className="mb-1 flex items-center justify-center">
                            <Icon className={cn("w-6 h-6", uploadForm.category === cat.value ? "text-[#ff651e]" : "text-gray-500")} />
                          </div>
                          <div className="text-xs font-medium text-gray-700">{cat.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Expiration Date */}
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 101, 30, 0.15)' }}>
                      <Calendar className="w-3.5 h-3.5" style={{ color: '#ff651e' }} />
                    </div>
                    {t?.uploadModal?.expirationDate?.[language] || 'Expiration date (optional)'}
                  </Label>
                  <Input
                    type="date"
                    value={uploadForm.expires_at || ''}
                    onChange={(e) => setUploadForm({ ...uploadForm, expires_at: e.target.value })}
                    className="rounded-2xl border-2 border-gray-200 hover:border-orange-200 focus:border-orange-400 transition-colors"
                  />
                </div>

                {/* Private Toggle */}
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border-2 border-gray-100">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 101, 30, 0.15)' }}>
                    <Shield className="w-3.5 h-3.5" style={{ color: '#ff651e' }} />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="is_private" className="cursor-pointer font-semibold text-gray-700">
                      {t?.uploadModal?.privateLabel?.[language] || 'Private document'}
                    </Label>
                    <p className="text-xs text-gray-500">{t?.uploadModal?.privateDescription?.[language] || 'Visible only to me'}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="is_private"
                      checked={uploadForm.is_private}
                      onChange={(e) => setUploadForm({ ...uploadForm, is_private: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                      style={uploadForm.is_private ? { background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' } : undefined}
                    ></div>
                  </label>
                </div>
              </div>

              {/* Actions - Sticky Footer */}
              <div className="sticky bottom-0 border-t-2 border-orange-100 px-6 py-4 bg-white">
                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowUploadModal(false);
                        resetUploadForm();
                      }}
                      className="w-full rounded-2xl py-6 font-bold border-2 border-gray-200 hover:border-orange-200"
                      disabled={isUploading}
                    >
                      {t?.uploadModal?.cancel?.[language] || 'Cancel'}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading || !selectedFile || !uploadForm.title}
                      className="w-full rounded-2xl py-6 font-bold text-white border-none shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}
                    >
                      {isUploading ? (
                        <>
                          <LoadingHouse size={20} className="mr-2" />
                          {t?.uploadModal?.uploading?.[language] || 'Uploading...'}
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          {t?.uploadModal?.upload?.[language] || 'Upload'}
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Document Modal */}
      {showViewModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t?.viewModal?.title?.[language] || 'Document details'}</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedDocument(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center gap-4">
                <div className="text-5xl">{getFileIcon(selectedDocument.file_type)}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{selectedDocument.title}</h3>
                  <p className="text-sm text-gray-600">{selectedDocument.file_name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(selectedDocument.file_size)}
                  </p>
                </div>
                <Badge className={getCategoryInfo(selectedDocument.category).color}>
                  {getCategoryInfo(selectedDocument.category).label}
                </Badge>
              </div>

              {/* Description */}
              {selectedDocument.description && (
                <div>
                  <Label>{t?.viewModal?.description?.[language] || 'Description'}</Label>
                  <p className="text-sm text-gray-700 mt-1">{selectedDocument.description}</p>
                </div>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>{t?.viewModal?.uploadedBy?.[language] || 'Uploaded by'}</Label>
                  <p className="text-gray-700 mt-1">{selectedDocument.uploader_name}</p>
                </div>
                <div>
                  <Label>{t?.viewModal?.uploadDate?.[language] || 'Upload date'}</Label>
                  <p className="text-gray-700 mt-1">
                    {new Date(selectedDocument.created_at).toLocaleDateString(
                      language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : language === 'nl' ? 'nl-NL' : 'de-DE',
                      { day: 'numeric', month: 'long', year: 'numeric' }
                    )}
                  </p>
                </div>
                {selectedDocument.expires_at && (
                  <div className="col-span-2">
                    <Label>{t?.viewModal?.expirationDate?.[language] || 'Expiration date'}</Label>
                    <p
                      className={cn(
                        'mt-1',
                        selectedDocument.is_expired
                          ? 'text-red-700 font-medium'
                          : selectedDocument.is_expiring_soon
                          ? 'text-yellow-700 font-medium'
                          : 'text-gray-700'
                      )}
                    >
                      {new Date(selectedDocument.expires_at).toLocaleDateString(
                        language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : language === 'nl' ? 'nl-NL' : 'de-DE',
                        { day: 'numeric', month: 'long', year: 'numeric' }
                      )}
                      {selectedDocument.is_expired && ` (${t?.expiredLabel?.[language] || 'Expired'})`}
                      {selectedDocument.is_expiring_soon &&
                        !selectedDocument.is_expired &&
                        ` (${t?.expiresSoon?.[language] || 'Expires soon'})`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => window.open(selectedDocument.file_url, '_blank')}
                className="flex-1 rounded-full"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                {t?.viewModal?.download?.[language] || 'Download'}
              </Button>
              {selectedDocument.uploaded_by === userId && (
                <Button
                  onClick={() => handleDelete(selectedDocument.id)}
                  className="flex-1 rounded-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t?.viewModal?.delete?.[language] || 'Delete'}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
