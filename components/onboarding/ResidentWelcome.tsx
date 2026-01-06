'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Users,
  ArrowRight,
  DollarSign,
  MessageSquare,
  Vote,
  Info,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ResidentWelcomeProps {
  propertyData: {
    id: string;
    title: string;
    city?: string;
  };
  onClose: () => void;
}

export default function ResidentWelcome({ propertyData, onClose }: ResidentWelcomeProps) {
  const router = useRouter();

  const availableFeatures = [
    {
      icon: DollarSign,
      title: 'Gérer vos dépenses',
      description: 'Ajoutez et consultez les dépenses partagées'
    },
    {
      icon: MessageSquare,
      title: 'Messagerie',
      description: 'Communiquez avec vos colocataires'
    },
    {
      icon: Vote,
      title: 'Voter sur les règles',
      description: 'Participez aux décisions de la résidence'
    },
    {
      icon: Users,
      title: 'Inviter des colocataires',
      description: 'Partagez le code d\'invitation'
    }
  ];

  const limitations = [
    'Modification des informations de la résidence',
    'Suppression de la résidence',
    'Gestion complète des documents officiels'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white superellipse-3xl max-w-2xl w-full shadow-2xl my-8 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 superellipse-3xl mx-auto mb-4 flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)' }}>
            <Home className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👋 Bienvenue !
          </h1>
          <p className="text-lg text-gray-600">
            Vous avez rejoint avec succès
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {propertyData.title}
          </p>
          {propertyData.city && (
            <p className="text-sm text-gray-500 mt-1">
              📍 {propertyData.city}
            </p>
          )}
        </div>

        {/* Available Features */}
        <Card className="p-6 mb-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-900">Ce que vous pouvez faire :</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3 bg-white superellipse-lg p-3">
                  <div className="w-8 h-8 superellipse-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">
                      {feature.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Limitations Info */}
        <Card className="p-6 mb-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 superellipse-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Bon à savoir</h3>
              <p className="text-sm text-gray-700 mb-3">
                En tant que <strong>résident standard</strong>, certaines fonctionnalités de gestion sont réservées au <strong>Résident Principal</strong> (créateur de la résidence) :
              </p>
              <ul className="space-y-1">
                {limitations.map((limitation, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-600 mt-3">
                💡 Si vous êtes le propriétaire légal, demandez le <strong>code propriétaire</strong> au créateur pour obtenir tous les droits.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            onClick={() => {
              onClose();
              router.push('/hub/finances');
            }}
            variant="outline"
            className="superellipse-xl border-2 hover:border-orange-300"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Finances
          </Button>
          <Button
            onClick={() => {
              onClose();
              router.push('/hub/messages');
            }}
            variant="outline"
            className="superellipse-xl border-2 hover:border-orange-300"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </Button>
        </div>

        <Button
          onClick={onClose}
          className="w-full superellipse-xl text-white shadow-lg hover:shadow-xl transition-all text-lg py-6"
          style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)' }}
        >
          Découvrir ma résidence
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}
