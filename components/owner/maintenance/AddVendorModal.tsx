'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UserPlus,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Loader2,
  CheckCircle,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  vendorService,
  vendorCategoryLabels,
  type CreateVendorData,
  type VendorCategory,
} from '@/lib/services/vendor-service';
import { ownerGradient } from '@/lib/constants/owner-theme';
import { cn } from '@/lib/utils';

interface AddVendorModalProps {
  open: boolean;
  onClose: () => void;
  onVendorAdded?: () => void;
  preselectedCategory?: VendorCategory;
}

const categoryOptions: VendorCategory[] = [
  'plumbing',
  'electrical',
  'heating',
  'appliances',
  'structural',
  'cleaning',
  'pest_control',
  'locksmith',
  'painting',
  'gardening',
  'general',
  'other',
];

export function AddVendorModal({
  open,
  onClose,
  onVendorAdded,
  preselectedCategory,
}: AddVendorModalProps) {
  const [formData, setFormData] = useState<CreateVendorData>({
    name: '',
    companyName: '',
    category: preselectedCategory || 'general',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    siret: '',
    notes: '',
    isFavorite: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (formData.phone && !/^[\d\s+()-]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numero de telephone invalide';
    }

    if (formData.siret && !/^\d{14}$/.test(formData.siret.replace(/\s/g, ''))) {
      newErrors.siret = 'Le SIRET doit contenir 14 chiffres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await (await import('@/lib/auth/supabase-client')).createClient().auth.getUser();

      if (!user) {
        toast.error('Vous devez etre connecte');
        return;
      }

      const result = await vendorService.createVendor(user.id, formData);

      if (result) {
        setIsSubmitted(true);
        toast.success('Prestataire ajoute');
        setTimeout(() => {
          onVendorAdded?.();
          onClose();
          // Reset form
          setFormData({
            name: '',
            companyName: '',
            category: preselectedCategory || 'general',
            phone: '',
            email: '',
            address: '',
            city: '',
            postalCode: '',
            siret: '',
            notes: '',
            isFavorite: false,
          });
          setIsSubmitted(false);
        }, 1500);
      } else {
        toast.error('Erreur lors de l\'ajout');
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast.error('Erreur lors de l\'ajout');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const updateField = <K extends keyof CreateVendorData>(field: K, value: CreateVendorData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div
            className="px-6 py-4 text-white"
            style={{ background: ownerGradient }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Ajouter un prestataire</h2>
                  <p className="text-white/80 text-sm">Enregistrez un nouveau prestataire</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: ownerGradient }}
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Prestataire ajoute!
                </h3>
                <p className="text-gray-600">
                  {formData.name} a ete ajoute a votre annuaire.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du prestataire <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Ex: Jean Dupont"
                        className={cn(
                          'w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400',
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        )}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de l'entreprise
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.companyName || ''}
                        onChange={(e) => updateField('companyName', e.target.value)}
                        placeholder="Ex: Plomberie Express SARL"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialite <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => updateField('category', cat)}
                        className={cn(
                          'px-3 py-2 text-xs font-medium rounded-lg border transition-all',
                          formData.category === cat
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300 text-gray-600'
                        )}
                      >
                        {vendorCategoryLabels[cat]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telephone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="06 12 34 56 78"
                        className={cn(
                          'w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400',
                          errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        )}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="contact@example.com"
                        className={cn(
                          'w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400',
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        )}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="123 rue Example"
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Paris"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode || ''}
                      onChange={(e) => updateField('postalCode', e.target.value)}
                      placeholder="75001"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Business Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    N SIRET
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.siret || ''}
                      onChange={(e) => updateField('siret', e.target.value)}
                      placeholder="12345678901234"
                      className={cn(
                        'w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400',
                        errors.siret ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      )}
                    />
                  </div>
                  {errors.siret && <p className="text-red-500 text-xs mt-1">{errors.siret}</p>}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Notes personnelles sur ce prestataire..."
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 resize-none"
                  />
                </div>

                {/* Favorite */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFavorite"
                    checked={formData.isFavorite}
                    onChange={(e) => updateField('isFavorite', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isFavorite" className="text-sm text-gray-700">
                    Ajouter aux favoris
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!isSubmitted && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-full"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name.trim()}
                className="rounded-full text-white"
                style={{ background: ownerGradient }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ajout...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Ajouter
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
