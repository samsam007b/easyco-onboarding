'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  CreditCard,
  Plus,
  Trash2,
  ArrowLeft,
  Check,
  AlertCircle,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  bankName?: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: methods } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id);

      if (methods) {
        setPaymentMethods(methods);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // In production, this would integrate with Stripe/Payment processor
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          type: 'card',
          last4: newCard.cardNumber.slice(-4),
          brand: 'Visa', // Would be detected from card number
          expiry_month: parseInt(newCard.expiryDate.split('/')[0]),
          expiry_year: parseInt('20' + newCard.expiryDate.split('/')[1]),
          is_default: paymentMethods.length === 0
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Carte ajoutée avec succès' });
      setShowAddCard(false);
      setNewCard({ cardNumber: '', expiryDate: '', cvv: '', name: '' });
      loadPaymentMethods();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de l\'ajout de la carte' });
    }
  };

  const handleDeleteMethod = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce moyen de paiement ?')) return;

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Moyen de paiement supprimé' });
      loadPaymentMethods();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la suppression' });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Reset all to non-default
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Set selected as default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Moyen de paiement par défaut mis à jour' });
      loadPaymentMethods();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la mise à jour' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.push('/settings')}
            variant="ghost"
            className="mb-4 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux paramètres
          </Button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-200/70 to-purple-200/70 flex items-center justify-center shadow-sm">
              <CreditCard className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Paiement</h1>
              <p className="text-gray-600">Gérer vos moyens de paiement</p>
            </div>
          </div>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-6 p-4 rounded-xl flex items-center gap-3",
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            )}
          >
            {message.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{message.text}</p>
          </motion.div>
        )}

        {/* Add New Card Button */}
        {!showAddCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Button
              onClick={() => setShowAddCard(true)}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-200/70 to-purple-200/70 text-gray-900 hover:from-indigo-300/70 hover:to-purple-300/70"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter un moyen de paiement
            </Button>
          </motion.div>
        )}

        {/* Add Card Form */}
        {showAddCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Ajouter une carte</h2>
              <Button
                onClick={() => setShowAddCard(false)}
                variant="ghost"
                size="sm"
              >
                Annuler
              </Button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de carte
                </label>
                <input
                  type="text"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/\s/g, '') })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'expiration
                  </label>
                  <input
                    type="text"
                    value={newCard.expiryDate}
                    onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                    placeholder="MM/AA"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                    placeholder="123"
                    maxLength={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom sur la carte
                </label>
                <input
                  type="text"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                  placeholder="JEAN DUPONT"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-indigo-200/70 to-purple-200/70 text-gray-900 hover:from-indigo-300/70 hover:to-purple-300/70"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Ajouter la carte
              </Button>
            </form>
          </motion.div>
        )}

        {/* Payment Methods List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {paymentMethods.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 text-center">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun moyen de paiement enregistré</p>
            </div>
          ) : (
            paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <CreditCard className="w-7 h-7 text-gray-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900">
                          {method.brand || 'Carte'} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-semibold">
                            <Star className="w-3 h-3 fill-current" />
                            Par défaut
                          </span>
                        )}
                      </div>
                      {method.expiryMonth && method.expiryYear && (
                        <p className="text-sm text-gray-600">
                          Expire {method.expiryMonth}/{method.expiryYear}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        onClick={() => handleSetDefault(method.id)}
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        Définir par défaut
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeleteMethod(method.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Paiement sécurisé</p>
              <p className="text-blue-700">
                Vos informations de paiement sont chiffrées et sécurisées. Nous ne stockons jamais vos données de carte complètes.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
