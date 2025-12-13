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

export default function DocumentsPage() {
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
      alert('Veuillez donner un titre au document');
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
        alert(result.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('[Documents] Upload error:', error);
      alert('Une erreur est survenue');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce document ?')) return;

    try {
      const result = await documentService.deleteDocument(documentId);

      if (result.success) {
        console.log('[Documents] ✅ Document deleted');
        setShowViewModal(false);
        await loadData();
      } else {
        alert(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('[Documents] Delete error:', error);
      alert('Une erreur est survenue');
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
          <p className="text-gray-600 font-medium mt-4">Chargement...</p>
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
            className="mb-4 rounded-full"
          >
            ← Retour au hub
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                📁 Coffre-fort documents
              </h1>
              <p className="text-gray-600">Stockez et partagez vos documents importants</p>
            </div>

            <Button
              onClick={() => setShowUploadModal(true)}
              className="rounded-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload document
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              className="bg-white rounded-2xl p-4 shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.total_documents || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-resident-100 to-resident-200 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-resident-700" />
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-2xl p-4 shadow-lg" whileHover={{ scale: 1.02 }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stockage utilisé</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {formatFileSize(stats?.total_size_bytes)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-2xl p-4 shadow-lg" whileHover={{ scale: 1.02 }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expirent bientôt</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.expiring_soon || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-2xl p-4 shadow-lg" whileHover={{ scale: 1.02 }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expirés</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.expired || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search & Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un document..."
                className="pl-10 rounded-full"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              <Button
                size="sm"
                variant={filterCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterCategory('all')}
                className={cn(
                  'rounded-full flex-shrink-0',
                  filterCategory === 'all' &&
                    'bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]'
                )}
              >
                Tous
              </Button>
              {DOCUMENT_CATEGORIES.slice(0, 5).map((cat) => (
                <Button
                  key={cat.value}
                  size="sm"
                  variant={filterCategory === cat.value ? 'default' : 'outline'}
                  onClick={() => setFilterCategory(cat.value)}
                  className={cn(
                    'rounded-full flex-shrink-0',
                    filterCategory === cat.value &&
                      'bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]'
                  )}
                >
                  {cat.emoji} {cat.label}
                </Button>
              ))}
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
            >
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun document</h3>
              <p className="text-gray-600 mb-6">Uploadez votre premier document</p>
              <Button
                onClick={() => setShowUploadModal(true)}
                className="rounded-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload document
              </Button>
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
                        {new Date(doc.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>

                    {/* Expiration Warning */}
                    {doc.is_expiring_soon && !doc.is_expired && (
                      <div className="flex items-center gap-1 text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full mb-2">
                        <AlertTriangle className="w-3 h-3" />
                        Expire le{' '}
                        {new Date(doc.expires_at!).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    )}

                    {doc.is_expired && (
                      <div className="flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2 py-1 rounded-full mb-2">
                        <Calendar className="w-3 h-3" />
                        Expiré
                      </div>
                    )}

                    {/* Private Badge */}
                    {doc.is_private && (
                      <Badge variant="outline" className="text-xs">
                        🔒 Privé
                      </Badge>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upload un document</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Upload Zone */}
              <div>
                <Label>Fichier *</Label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={cn(
                    'mt-2 border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
                    dragActive ? 'border-resident-500 bg-resident-50' : 'border-gray-300'
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
                        className="rounded-full"
                      >
                        Changer de fichier
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-1">
                        Glissez un fichier ici ou cliquez pour sélectionner
                      </p>
                      <p className="text-xs text-gray-500">PDF, Images, Documents (Max 50MB)</p>
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
                <Label>Titre *</Label>
                <Input
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="Ex: Contrat de bail 2024"
                  className="rounded-xl"
                />
              </div>

              {/* Description */}
              <div>
                <Label>Description (optionnel)</Label>
                <Textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Ajoutez des détails sur ce document..."
                  className="rounded-xl min-h-[80px]"
                />
              </div>

              {/* Category */}
              <div>
                <Label>Catégorie *</Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                  {DOCUMENT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setUploadForm({ ...uploadForm, category: cat.value })}
                      className={cn(
                        'p-3 rounded-xl border-2 text-center transition-all',
                        uploadForm.category === cat.value
                          ? 'border-resident-500 bg-resident-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="text-2xl mb-1">{cat.emoji}</div>
                      <div className="text-xs font-medium text-gray-700">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <Label>Date d'expiration (optionnel)</Label>
                <Input
                  type="date"
                  value={uploadForm.expires_at || ''}
                  onChange={(e) => setUploadForm({ ...uploadForm, expires_at: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              {/* Private Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_private"
                  checked={uploadForm.is_private}
                  onChange={(e) => setUploadForm({ ...uploadForm, is_private: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="is_private" className="cursor-pointer">
                  Document privé (visible uniquement par moi)
                </Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="flex-1 rounded-full"
                disabled={isUploading}
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile || !uploadForm.title}
                className="flex-1 rounded-full cta-resident"
              >
                {isUploading ? (
                  <>
                    <LoadingHouse size={20} className="mr-2" />
                    Upload...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Uploader
                  </>
                )}
              </Button>
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
              <h2 className="text-2xl font-bold text-gray-900">Détails du document</h2>
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
                  <Label>Description</Label>
                  <p className="text-sm text-gray-700 mt-1">{selectedDocument.description}</p>
                </div>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Uploadé par</Label>
                  <p className="text-gray-700 mt-1">{selectedDocument.uploader_name}</p>
                </div>
                <div>
                  <Label>Date d'upload</Label>
                  <p className="text-gray-700 mt-1">
                    {new Date(selectedDocument.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                {selectedDocument.expires_at && (
                  <div className="col-span-2">
                    <Label>Date d'expiration</Label>
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
                      {new Date(selectedDocument.expires_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      {selectedDocument.is_expired && ' (Expiré)'}
                      {selectedDocument.is_expiring_soon &&
                        !selectedDocument.is_expired &&
                        ' (Expire bientôt)'}
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
                Télécharger
              </Button>
              {selectedDocument.uploaded_by === userId && (
                <Button
                  onClick={() => handleDelete(selectedDocument.id)}
                  className="flex-1 rounded-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
