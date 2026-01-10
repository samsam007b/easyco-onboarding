'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Wrench,
  ArrowLeft,
  Plus,
  Phone,
  Mail,
  Star,
  Building2,
  Sparkles,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

interface Vendor {
  id: string;
  name: string;
  specialty: string;
  phone?: string;
  email?: string;
  rating?: number;
  jobsCompleted?: number;
}

export default function VendorsSettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const settings = getSection('settings');
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string>('');
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user is owner
      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (userData?.user_type !== 'owner') {
        router.push('/settings');
        return;
      }

      setUserType(userData.user_type);

      // TODO: Load vendors from database when table is created
      // For now, show empty state
      setVendors([]);
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/30 via-white to-purple-50/30">
        <LoadingHouse />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/settings')}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #D9A870 0%, #E0C090 100%)' }}
              >
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {settings?.sections?.vendorManagement?.title || 'Prestataires'}
                </h1>
                <p className="text-sm text-gray-500">
                  {settings?.sections?.vendorManagement?.description || 'Gérer vos artisans et prestataires'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {vendors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 superellipse-2xl bg-searcher-100 flex items-center justify-center">
              <Users className="w-10 h-10 text-searcher-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aucun prestataire enregistré
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Ajoutez vos artisans et prestataires de confiance pour faciliter la gestion de la maintenance de vos propriétés.
            </p>
            <Button
              className="bg-gradient-to-r from-searcher-500 to-resident-500 text-white superellipse-xl px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all"
              onClick={() => {
                // TODO: Open add vendor modal
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter un prestataire
            </Button>

            {/* Feature preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
            >
              {[
                { icon: Building2, title: 'Carnet d\'adresses', desc: 'Centralisez vos contacts' },
                { icon: Star, title: 'Notes & avis', desc: 'Évaluez vos prestataires' },
                { icon: Sparkles, title: 'Historique', desc: 'Suivez les interventions' },
              ].map((feature, i) => (
                <div key={i} className="p-4 superellipse-xl bg-white/60 border border-gray-200/50">
                  <feature.icon className="w-6 h-6 text-searcher-500 mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 superellipse-xl bg-white/80 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                    <p className="text-sm text-gray-500">{vendor.specialty}</p>
                  </div>
                  {vendor.rating && (
                    <div className="flex items-center gap-1 text-searcher-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{vendor.rating}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                  {vendor.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {vendor.phone}
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {vendor.email}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
