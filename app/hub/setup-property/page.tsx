'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Home,
  Users,
  Plus,
  LogIn,
  MapPin,
  Hash,
  ArrowRight,
  Building2,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SetupMode = 'choice' | 'create' | 'join';

export default function SetupPropertyPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<SetupMode>('choice');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Form state for creating a property
  const [createForm, setCreateForm] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    total_rooms: 2,
  });

  // Form state for joining a property
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    checkExistingMembership();
  }, []);

  const checkExistingMembership = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setCurrentUserId(user.id);

      // Check if user already has a property membership
      const { data: membership } = await supabase
        .from('property_members')
        .select('property_id, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (membership?.property_id) {
        // User already has a property, redirect to hub
        router.push('/hub');
        return;
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error checking membership:', error);
      setIsLoading(false);
    }
  };

  const createProperty = async () => {
    if (!currentUserId) return;
    if (!createForm.name || !createForm.address || !createForm.city) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          title: createForm.name,
          address: createForm.address,
          city: createForm.city,
          postal_code: createForm.postal_code,
          country: 'France',
          property_type: 'shared_apartment',
          bedrooms: createForm.total_rooms,
          bathrooms: 1,
          total_rooms: createForm.total_rooms,
          monthly_rent: 0, // To be filled later by residents
          available_from: new Date().toISOString().split('T')[0],
          is_available: false, // Private property for residents only
          status: 'draft', // Not published
          owner_id: currentUserId,
        })
        .select()
        .single();

      if (propertyError) {
        console.error('Error creating property:', propertyError);
        throw propertyError;
      }

      console.log('✅ Property created:', property);

      // Create property membership
      const { error: memberError } = await supabase
        .from('property_members')
        .insert({
          property_id: property.id,
          user_id: currentUserId,
          role: 'resident',
          status: 'active',
        });

      if (memberError) {
        console.error('Error creating membership:', memberError);
        throw memberError;
      }

      console.log('✅ Membership created');

      // Redirect to hub
      router.push('/hub');
    } catch (error: any) {
      console.error('❌ Error creating property:', error);
      alert(`Erreur: ${error.message || 'Erreur inconnue'}`);
      setIsSubmitting(false);
    }
  };

  const joinProperty = async () => {
    if (!currentUserId) return;
    if (!joinCode.trim()) {
      alert('Veuillez entrer un code d\'invitation');
      return;
    }

    setIsSubmitting(true);
    try {
      // Search for property by invite code
      // For now, we'll use property ID as invite code
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', joinCode.trim())
        .single();

      if (propertyError || !property) {
        alert('Code d\'invitation invalide');
        setIsSubmitting(false);
        return;
      }

      // Create property membership
      const { error: memberError } = await supabase
        .from('property_members')
        .insert({
          property_id: property.id,
          user_id: currentUserId,
          role: 'resident',
          status: 'active',
        });

      if (memberError) {
        console.error('Error creating membership:', memberError);
        throw memberError;
      }

      console.log('✅ Joined property successfully');

      // Redirect to hub
      router.push('/hub');
    } catch (error: any) {
      console.error('❌ Error joining property:', error);
      alert(`Erreur: ${error.message || 'Erreur inconnue'}`);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center"
               style={{
                 background: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)'
               }}>
            <Home className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Configuration de votre colocation
          </h1>
          <p className="text-gray-600">
            Pour commencer, créez ou rejoignez une colocation
          </p>
        </motion.div>

        {/* Choice Mode */}
        {mode === 'choice' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Create Property Card */}
            <Card
              onClick={() => setMode('create')}
              className="p-8 cursor-pointer hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-300 bg-white"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                     style={{
                       background: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)'
                     }}>
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Créer une colocation
                </h3>
                <p className="text-gray-600 mb-4">
                  Vous êtes le premier ? Créez une nouvelle colocation et invitez vos colocataires
                </p>
                <Button className="w-full rounded-xl bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]">
                  Créer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Join Property Card */}
            <Card
              onClick={() => setMode('join')}
              className="p-8 cursor-pointer hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-300 bg-white"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Rejoindre une colocation
                </h3>
                <p className="text-gray-600 mb-4">
                  Vos colocataires vous ont invité ? Utilisez le code d'invitation
                </p>
                <Button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600">
                  Rejoindre
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Create Mode */}
        {mode === 'create' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-8 bg-white">
              <Button
                variant="ghost"
                onClick={() => setMode('choice')}
                className="mb-6"
              >
                ← Retour
              </Button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Créer votre colocation
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom de la colocation *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Appart du centre-ville"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="rounded-xl mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Adresse *</Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="address"
                      placeholder="Ex: 123 Rue de la Paix"
                      value={createForm.address}
                      onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                      className="rounded-xl pl-10"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      placeholder="Ex: Paris"
                      value={createForm.city}
                      onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                      className="rounded-xl mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="postal_code">Code postal</Label>
                    <Input
                      id="postal_code"
                      placeholder="Ex: 75001"
                      value={createForm.postal_code}
                      onChange={(e) => setCreateForm({ ...createForm, postal_code: e.target.value })}
                      className="rounded-xl mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="total_rooms">Nombre de chambres</Label>
                  <div className="relative mt-2">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="total_rooms"
                      type="number"
                      min="1"
                      max="20"
                      value={createForm.total_rooms}
                      onChange={(e) => setCreateForm({ ...createForm, total_rooms: parseInt(e.target.value) || 2 })}
                      className="rounded-xl pl-10"
                    />
                  </div>
                </div>

                <Button
                  onClick={createProperty}
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] hover:shadow-lg transition-shadow mt-6"
                >
                  {isSubmitting ? 'Création...' : 'Créer la colocation'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Join Mode */}
        {mode === 'join' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-8 bg-white">
              <Button
                variant="ghost"
                onClick={() => setMode('choice')}
                className="mb-6"
              >
                ← Retour
              </Button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Rejoindre une colocation
                </h2>
                <p className="text-gray-600">
                  Entrez le code d'invitation fourni par votre colocataire
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="joinCode">Code d'invitation</Label>
                  <Input
                    id="joinCode"
                    placeholder="Entrez le code d'invitation"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="rounded-xl mt-2 text-center text-lg font-mono"
                  />
                </div>

                <Button
                  onClick={joinProperty}
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg transition-shadow"
                >
                  {isSubmitting ? 'Connexion...' : 'Rejoindre la colocation'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
