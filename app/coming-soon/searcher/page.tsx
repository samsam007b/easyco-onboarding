'use client';

import { motion } from 'framer-motion';
import { Search, Calendar, Bell, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearcherComingSoon() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter sauvegarde dans Supabase (table waitlist)
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full"
      >
        {/* Header avec bouton retour */}
        <button
          onClick={() => router.push('/')}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Retour à l'accueil</span>
        </button>

        <div className="text-center">
          {/* Icon animé */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="mx-auto w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-8 shadow-2xl"
          >
            <Search className="w-16 h-16 text-white" />
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"
          >
            Bientôt Disponible ! 🚀
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-600 mb-12"
          >
            La fonction <span className="font-semibold text-yellow-600">Chercheur</span> arrive très prochainement.
          </motion.p>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
              Qu'est-ce qui arrive ?
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-xl transition-shadow">
                  <Search className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">Marketplace Complète</h3>
                <p className="text-sm text-gray-600">
                  Parcourez des centaines de propriétés disponibles avec recherche avancée
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-xl transition-shadow">
                  <Calendar className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">Matching Intelligent</h3>
                <p className="text-sm text-gray-600">
                  Trouvez votre colocation idéale grâce à notre algorithme de compatibilité
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-xl transition-shadow">
                  <Bell className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">Alertes Temps Réel</h3>
                <p className="text-sm text-gray-600">
                  Soyez notifié instantanément dès qu'une propriété correspond à vos critères
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Call to Action - Waitlist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 md:p-10 text-white shadow-2xl"
          >
            <h3 className="text-2xl md:text-3xl font-semibold mb-3">
              Inscrivez-vous à la liste d'attente
            </h3>
            <p className="mb-6 opacity-90 text-lg">
              Soyez parmi les premiers à accéder à la marketplace !
            </p>

            {!subscribed ? (
              <form onSubmit={handleWaitlist} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 transition-shadow text-lg"
                  />
                  <button
                    type="submit"
                    className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105 text-lg"
                  >
                    Rejoindre
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto"
              >
                <p className="text-xl font-semibold">✅ Merci ! Vous êtes sur la liste !</p>
                <p className="text-white/90 mt-2">
                  Nous vous contacterons dès l'ouverture de la marketplace.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Alternative - En attendant */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200"
          >
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-center gap-2">
              <Home className="w-5 h-5 text-gray-600" />
              En attendant, découvrez nos autres fonctionnalités
            </h4>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/welcome')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Gérer une Propriété (Owner)
              </button>
              <button
                onClick={() => router.push('/welcome')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Gérer ma Colocation (Resident)
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
