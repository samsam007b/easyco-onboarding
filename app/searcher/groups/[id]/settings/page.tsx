'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  ArrowLeft,
  Users,
  Settings,
  Trash2,
  Save,
  MapPin,
  Euro,
  Calendar,
  Building2,
  AlertTriangle,
  Crown,
  UserMinus,
  Bell,
  Lock,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

// V3-FUN Theme
const DANGER_GRADIENT = 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }
};

export default function GroupSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_city: '',
    budget_min: '',
    budget_max: '',
    move_in_date: '',
    is_public: true,
  });

  useEffect(() => {
    const loadGroup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // For demo, use mock data
      setFormData({
        name: 'Les Colocs de Bruxelles',
        description: 'Groupe de recherche pour une colocation dans le centre de Bruxelles.',
        target_city: 'Bruxelles',
        budget_min: '400',
        budget_max: '600',
        move_in_date: '2024-03-01',
        is_public: true,
      });

      setLoading(false);
    };

    loadGroup();
  }, [groupId, supabase, router]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Parametres du groupe mis a jour');
    setSaving(false);
  };

  const handleDeleteGroup = async () => {
    if (!confirm('Etes-vous sur de vouloir supprimer ce groupe ? Cette action est irreversible.')) {
      return;
    }
    toast.success('Groupe supprime');
    router.push('/searcher/groups');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-amber-50">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-8">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-white to-red-50/30" />
        <div className="absolute top-20 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl" style={{ background: 'var(--gradient-searcher)' }} />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/searcher/groups/${groupId}`}>
                <Button variant="ghost" size="icon" className="superellipse-xl hover:bg-violet-50">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-violet-500" />
                  Parametres du groupe
                </h1>
                <p className="text-xs text-gray-500">{formData.name}</p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="superellipse-xl text-white"
              style={{ background: 'var(--gradient-searcher)' }}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Settings className="w-4 h-4" />
                  </motion.div>
                  Enregistrement...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6"
      >
        {/* General Info */}
        <motion.div variants={itemVariants}>
          <Card className="superellipse-2xl border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-500" />
                Informations generales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du groupe</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Les Colocs de Bruxelles"
                  className="superellipse-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Decrivez votre groupe et ce que vous recherchez..."
                  className="superellipse-xl min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Criteria */}
        <motion.div variants={itemVariants}>
          <Card className="superellipse-2xl border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-500" />
                Criteres de recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ville cible</label>
                <Input
                  value={formData.target_city}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_city: e.target.value }))}
                  placeholder="Ex: Bruxelles"
                  className="superellipse-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget min (E/pers)</label>
                  <Input
                    type="number"
                    value={formData.budget_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_min: e.target.value }))}
                    placeholder="400"
                    className="superellipse-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget max (E/pers)</label>
                  <Input
                    type="number"
                    value={formData.budget_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_max: e.target.value }))}
                    placeholder="600"
                    className="superellipse-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date d'emmenagement souhaitee</label>
                <Input
                  type="date"
                  value={formData.move_in_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, move_in_date: e.target.value }))}
                  className="superellipse-xl"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy */}
        <motion.div variants={itemVariants}>
          <Card className="superellipse-2xl border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-500" />
                Confidentialite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-gray-50 superellipse-xl">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Groupe public</p>
                    <p className="text-sm text-gray-500">Visible dans les recherches</p>
                  </div>
                </div>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, is_public: !prev.is_public }))}
                  className={`w-12 h-6 rounded-full transition-colors ${formData.is_public ? 'bg-violet-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${formData.is_public ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={itemVariants}>
          <Card className="superellipse-2xl border-0 shadow-sm border-red-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Zone de danger
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 superellipse-xl">
                <h4 className="font-medium text-red-900 mb-2">Supprimer le groupe</h4>
                <p className="text-sm text-red-600 mb-4">
                  Cette action est irreversible. Tous les membres seront retires et les donnees du groupe seront perdues.
                </p>
                <Button
                  onClick={handleDeleteGroup}
                  variant="outline"
                  className="superellipse-xl border-red-300 text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer le groupe
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
