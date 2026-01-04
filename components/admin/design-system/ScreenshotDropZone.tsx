'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedScreenshot {
  id: string;
  name: string;
  description: string;
  url: string;
  file?: File;
  status: 'uploading' | 'success' | 'error';
}

interface ScreenshotDropZoneProps {
  versionId: string;
  onUploadComplete: (screenshots: UploadedScreenshot[]) => void;
  existingScreenshots?: UploadedScreenshot[];
}

export function ScreenshotDropZone({
  versionId,
  onUploadComplete,
  existingScreenshots = [],
}: ScreenshotDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [screenshots, setScreenshots] = useState<UploadedScreenshot[]>(existingScreenshots);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast.error(`${file.name}: Format non supporté (utilisez JPG, PNG ou WebP)`);
      return false;
    }

    if (file.size > maxSize) {
      toast.error(`${file.name}: Fichier trop volumineux (max 10MB)`);
      return false;
    }

    return true;
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<UploadedScreenshot | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('versionId', versionId);

    try {
      const response = await fetch('/api/admin/design-screenshots/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      return {
        id: data.id,
        name: data.name,
        description: '',
        url: data.url,
        status: 'success' as const,
      };
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  }, [versionId]);

  const handleFiles = useCallback(async (files: FileList) => {
    const validFiles = Array.from(files).filter(validateFile);

    if (validFiles.length === 0) return;

    setIsUploading(true);

    // Create temporary entries for each file
    const tempScreenshots: UploadedScreenshot[] = validFiles.map((file) => ({
      id: `temp-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      description: '',
      url: URL.createObjectURL(file),
      file,
      status: 'uploading' as const,
    }));

    setScreenshots((prev) => [...prev, ...tempScreenshots]);

    // Upload each file
    const uploadedScreenshots: UploadedScreenshot[] = [];

    for (const tempScreenshot of tempScreenshots) {
      if (!tempScreenshot.file) continue;

      const result = await uploadFile(tempScreenshot.file);

      if (result) {
        uploadedScreenshots.push(result);
        setScreenshots((prev) =>
          prev.map((s) =>
            s.id === tempScreenshot.id
              ? { ...result, status: 'success' as const }
              : s
          )
        );
      } else {
        setScreenshots((prev) =>
          prev.map((s) =>
            s.id === tempScreenshot.id
              ? { ...s, status: 'error' as const }
              : s
          )
        );
        toast.error(`Échec de l'upload: ${tempScreenshot.name}`);
      }
    }

    setIsUploading(false);

    if (uploadedScreenshots.length > 0) {
      toast.success(`${uploadedScreenshots.length} screenshot(s) uploadé(s)`);
      onUploadComplete([...existingScreenshots, ...uploadedScreenshots]);
    }
  }, [validateFile, uploadFile, existingScreenshots, onUploadComplete]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);

  const removeScreenshot = useCallback((id: string) => {
    setScreenshots((prev) => prev.filter((s) => s.id !== id));
    const updated = screenshots.filter((s) => s.id !== id && s.status === 'success');
    onUploadComplete(updated);
  }, [screenshots, onUploadComplete]);

  const updateDescription = useCallback((id: string, description: string) => {
    setScreenshots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, description } : s))
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed superellipse-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 text-orange-400 animate-spin" />
              <p className="text-slate-300">Upload en cours...</p>
            </>
          ) : (
            <>
              <Upload className={`w-12 h-12 ${isDragging ? 'text-orange-400' : 'text-slate-500'}`} />
              <div>
                <p className="text-slate-300 font-medium">
                  Glissez-déposez vos screenshots ici
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  ou cliquez pour sélectionner des fichiers
                </p>
              </div>
              <p className="text-slate-600 text-xs">
                JPG, PNG ou WebP • Max 10MB par fichier
              </p>
            </>
          )}
        </div>

        {isDragging && (
          <div className="absolute inset-0 bg-orange-500/5 superellipse-xl pointer-events-none" />
        )}
      </div>

      {/* Uploaded Screenshots Grid */}
      {screenshots.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-400">
            Screenshots uploadés ({screenshots.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {screenshots.map((screenshot) => (
              <div
                key={screenshot.id}
                className="relative bg-slate-900 rounded-lg overflow-hidden border border-slate-700 group"
              >
                {/* Image Preview */}
                <div className="aspect-[9/16] relative">
                  {screenshot.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={screenshot.url}
                      alt={screenshot.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                    </div>
                  )}

                  {/* Status Overlay */}
                  {screenshot.status === 'uploading' && (
                    <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                    </div>
                  )}

                  {screenshot.status === 'error' && (
                    <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                  )}

                  {/* Success Badge */}
                  {screenshot.status === 'success' && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeScreenshot(screenshot.id);
                    }}
                    className="absolute top-2 left-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>

                {/* Screenshot Info */}
                <div className="p-3 space-y-2">
                  <input
                    type="text"
                    value={screenshot.name}
                    readOnly
                    className="w-full bg-transparent text-sm font-medium text-slate-300 border-none p-0 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={screenshot.description}
                    onChange={(e) => updateDescription(screenshot.id, e.target.value)}
                    placeholder="Ajouter une description..."
                    className="w-full bg-slate-800 text-xs text-slate-400 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
