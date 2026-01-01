'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Home,
  MapPin,
  Users,
  Camera,
  Copy,
  Check,
  Edit2,
  Save,
  X,
  Lock,
  UserPlus,
  Sparkles,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

interface ResidenceData {
  id: string;
  title: string;
  address: string;
  city: string;
  postal_code?: string;
  country?: string;
  total_rooms?: number;
  invitation_code?: string;
  owner_code?: string;
  images?: string[];
  memberCount: number;
  isCreator: boolean;
}

export default function ResidenceProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('settings')?.residenceProfile;
  const [isLoading, setIsLoading] = useState(true);
  const [residence, setResidence] = useState<ResidenceData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
    total_rooms: 0,
  });

  useEffect(() => {
    loadResidenceData();
  }, []);

  const loadResidenceData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get user's property membership
      const { data: membershipData, error: memberError } = await supabase
        .rpc('get_user_property_membership', { p_user_id: user.id });

      if (memberError || !membershipData?.property_id) {
        console.error('No property membership found');
        router.push('/onboarding/resident/property-setup');
        return;
      }

      // Fetch property details
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', membershipData.property_id)
        .single();

      if (propertyError || !property) {
        console.error('Property not found');
        return;
      }

      // Count members
      const { data: memberCount } = await supabase
        .rpc('count_property_members', { p_property_id: property.id });

      const residenceData: ResidenceData = {
        id: property.id,
        title: property.title,
        address: property.address,
        city: property.city,
        postal_code: property.postal_code,
        country: property.country,
        total_rooms: property.total_rooms,
        invitation_code: property.invitation_code,
        owner_code: property.owner_code,
        images: property.images,
        memberCount: memberCount || 1,
        isCreator: membershipData.is_creator || false,
      };

      setResidence(residenceData);
      setEditForm({
        title: property.title || '',
        address: property.address || '',
        city: property.city || '',
        postal_code: property.postal_code || '',
        country: property.country || 'France',
        total_rooms: property.total_rooms || 0,
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading residence data:', error);
      setIsLoading(false);
    }
  };

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    toast.success(t?.messages?.codeCopied?.[language] || 'Code copié!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSave = async () => {
    if (!residence) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: editForm.title,
          address: editForm.address,
          city: editForm.city,
          postal_code: editForm.postal_code,
          country: editForm.country,
          total_rooms: editForm.total_rooms,
        })
        .eq('id', residence.id);

      if (error) throw error;

      // Update local state
      setResidence({
        ...residence,
        ...editForm,
      });

      setIsEditing(false);
      toast.success(t?.messages?.updated?.[language] || 'Résidence mise à jour!');
    } catch (error: any) {
      console.error('Error updating residence:', error);
      toast.error(t?.messages?.error?.[language] || 'Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (residence) {
      setEditForm({
        title: residence.title || '',
        address: residence.address || '',
        city: residence.city || '',
        postal_code: residence.postal_code || '',
        country: residence.country || 'France',
        total_rooms: residence.total_rooms || 0,
      });
    }
    setIsEditing(false);
  };

  if (isLoading || !residence) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← {t?.back?.[language] || 'Retour'}
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t?.title?.[language] || 'Profil de la Résidence'}
              </h1>
              <p className="text-gray-600">
                {t?.subtitle?.[language] || 'Gérez les informations de votre résidence'}
              </p>
            </div>

            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {t?.buttons?.edit?.[language] || 'Modifier'}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  {t?.buttons?.cancel?.[language] || 'Annuler'}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-green-500 to-emerald-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? (t?.buttons?.saving?.[language] || 'Enregistrement...') : (t?.buttons?.save?.[language] || 'Enregistrer')}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Info Card */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-orange-600" />
            {t?.sections?.mainInfo?.[language] || 'Informations principales'}
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">{t?.fields?.name?.[language] || 'Nom de la résidence'}</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="address">{t?.fields?.address?.[language] || 'Adresse'}</Label>
              <Input
                id="address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                disabled={!isEditing}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">{t?.fields?.city?.[language] || 'Ville'}</Label>
                <Input
                  id="city"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="postal_code">{t?.fields?.postalCode?.[language] || 'Code postal'}</Label>
                <Input
                  id="postal_code"
                  value={editForm.postal_code}
                  onChange={(e) => setEditForm({ ...editForm, postal_code: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">{t?.fields?.country?.[language] || 'Pays'}</Label>
                <Input
                  id="country"
                  value={editForm.country}
                  onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="total_rooms">{t?.fields?.rooms?.[language] || 'Nombre de chambres'}</Label>
                <Input
                  id="total_rooms"
                  type="number"
                  value={editForm.total_rooms}
                  onChange={(e) => setEditForm({ ...editForm, total_rooms: parseInt(e.target.value) || 0 })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Card */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            {t?.sections?.stats?.[language] || 'Statistiques'}
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{residence.memberCount}</div>
              <div className="text-sm text-gray-600">{t?.stats?.roommates?.[language] || 'Colocataires'}</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
              <Home className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{residence.total_rooms || 0}</div>
              <div className="text-sm text-gray-600">{t?.stats?.rooms?.[language] || 'Chambres'}</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <Camera className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{residence.images?.length || 0}</div>
              <div className="text-sm text-gray-600">{t?.stats?.photos?.[language] || 'Photos'}</div>
            </div>
          </div>
        </Card>

        {/* Documents Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              {t?.sections?.documents?.[language] || 'Documents officiels'}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center flex-shrink-0 shadow-sm">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {t?.documents?.title?.[language] || 'Accédez à vos documents'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t?.documents?.description?.[language] || 'Consultez et gérez tous les documents importants de votre résidence (baux, règlements, attestations, etc.)'}
                </p>
                <Button
                  onClick={() => router.push('/hub/documents')}
                  className="text-white shadow-md hover:shadow-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {t?.documents?.button?.[language] || 'Voir les documents'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Invitation Codes Card */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-600" />
            {t?.sections?.codes?.[language] || 'Codes d\'invitation'}
          </h2>

          {/* Invitation Code for Residents */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t?.codes?.resident?.label?.[language] || 'Code pour les colocataires'}
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono text-lg font-bold text-gray-900">
                {residence.invitation_code || 'N/A'}
              </div>
              <button
                onClick={() => residence.invitation_code && copyToClipboard(residence.invitation_code, 'invitation')}
                className="p-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
              >
                {copiedCode === 'invitation' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t?.codes?.resident?.hint?.[language] || 'Partagez ce code avec vos futurs colocataires'}
            </p>
          </div>

          {/* Owner Code (only for creators) */}
          {residence.isCreator && residence.owner_code && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t?.codes?.owner?.label?.[language] || 'Code propriétaire'}
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-purple-100 rounded-lg px-4 py-3 font-mono text-sm font-bold text-purple-900">
                  {residence.owner_code}
                </div>
                <button
                  onClick={() => copyToClipboard(residence.owner_code!, 'owner')}
                  className="p-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                >
                  {copiedCode === 'owner' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t?.codes?.owner?.hint?.[language] || 'Code réservé au propriétaire légal pour revendiquer la résidence'}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
