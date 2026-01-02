'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ownerGradient } from '@/lib/constants/owner-theme';
import {
  MAINTENANCE_CATEGORIES,
  MAINTENANCE_PRIORITIES,
  type MaintenanceCategory,
  type MaintenancePriority,
  type CreateMaintenanceForm,
} from '@/types/maintenance.types';

interface PropertyInfo {
  id: string;
  name: string;
}

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (propertyId: string, form: CreateMaintenanceForm) => Promise<void>;
  properties: PropertyInfo[];
  isSubmitting?: boolean;
}

export function CreateTicketModal({
  isOpen,
  onClose,
  onSubmit,
  properties,
  isSubmitting = false,
}: CreateTicketModalProps) {
  const [selectedProperty, setSelectedProperty] = useState<string>(
    properties.length === 1 ? properties[0].id : ''
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MaintenanceCategory>('other');
  const [priority, setPriority] = useState<MaintenancePriority>('medium');
  const [location, setLocation] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setCategory('other');
    setPriority('medium');
    setLocation('');
    setEstimatedCost('');
    setImages([]);
    setImagePreview([]);
    if (properties.length !== 1) {
      setSelectedProperty('');
    }
  }, [properties.length]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      return; // Max 5 images
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Generate previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreview((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreview[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProperty || !title.trim() || !description.trim()) {
      return;
    }

    const form: CreateMaintenanceForm = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      location: location.trim() || undefined,
      estimated_cost: estimatedCost || undefined,
      images: images.length > 0 ? images : undefined,
    };

    await onSubmit(selectedProperty, form);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: ownerGradient }}
            >
              <h2 className="text-lg font-bold text-white">
                Nouvelle demande de maintenance
              </h2>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Property Selection */}
              <div>
                <Label htmlFor="property" className="text-sm font-medium text-gray-700">
                  Propriete *
                </Label>
                <select
                  id="property"
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  required
                >
                  <option value="">Selectionnez une propriete</option>
                  {properties.map((prop) => (
                    <option key={prop.id} value={prop.id}>
                      {prop.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Titre *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Fuite d'eau sous l'evier"
                  className="mt-1 rounded-xl"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description *
                </Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Decrivez le probleme en detail..."
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Categorie *</Label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {MAINTENANCE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={cn(
                        'flex flex-col items-center p-2 rounded-xl border-2 transition-all',
                        category === cat.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="text-xs mt-1 text-gray-600 text-center leading-tight">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Priorite *</Label>
                <div className="mt-2 flex gap-2">
                  {MAINTENANCE_PRIORITIES.map((prio) => (
                    <button
                      key={prio.value}
                      type="button"
                      onClick={() => setPriority(prio.value)}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all',
                        priority === prio.value
                          ? `${prio.color} ${prio.borderColor}`
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      )}
                    >
                      {prio.label}
                    </button>
                  ))}
                </div>
                {priority === 'emergency' && (
                  <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-700">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Les urgences necessitent une intervention immediate (fuite importante, panne de chauffage en hiver, etc.)
                    </span>
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Emplacement
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Salle de bain, Cuisine"
                  className="mt-1 rounded-xl"
                />
              </div>

              {/* Estimated Cost */}
              <div>
                <Label htmlFor="cost" className="text-sm font-medium text-gray-700">
                  Cout estime
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="cost"
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    placeholder="0"
                    className="rounded-xl pr-8"
                    min="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    EUR
                  </span>
                </div>
              </div>

              {/* Images */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Photos ({images.length}/5)
                </Label>
                <div className="mt-2">
                  {imagePreview.length > 0 && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {imagePreview.map((url, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {images.length < 5 && (
                    <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Ajouter des photos
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 rounded-xl"
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedProperty || !title.trim() || !description.trim()}
                  className="flex-1 rounded-xl text-white"
                  style={{ background: ownerGradient }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creation...
                    </>
                  ) : (
                    'Creer la demande'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
