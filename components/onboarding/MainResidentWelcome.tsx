'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  Copy,
  Check,
  Key,
  Shield,
  ArrowRight,
  Sparkles,
  Camera,
  DollarSign,
  FileText,
  UserPlus,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MainResidentWelcomeProps {
  propertyData: {
    id: string;
    title: string;
    invitation_code: string;
    owner_code: string;
  };
  onClose: () => void;
}

type Step = 'welcome' | 'codes' | 'next-steps';

export default function MainResidentWelcome({ propertyData, onClose }: MainResidentWelcomeProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const nextSteps = [
    {
      icon: UserPlus,
      title: 'Inviter des colocataires',
      description: 'Partagez le code d\'invitation avec vos futurs colocataires',
      color: 'from-resident-500 to-resident-600',
      action: () => {
        setCurrentStep('codes');
      }
    },
    {
      icon: Camera,
      title: 'Ajouter une photo',
      description: 'Personnalisez votre résidence avec une belle photo',
      color: 'from-green-500 to-emerald-600',
      action: () => {
        onClose();
        router.push('/settings/residence-profile');
      }
    },
    {
      icon: DollarSign,
      title: 'Gérer les finances',
      description: 'Configurez le système de partage des dépenses',
      color: 'from-resident-500 to-resident-600',
      action: () => {
        onClose();
        router.push('/hub/finances');
      }
    },
    {
      icon: FileText,
      title: 'Ajouter des documents',
      description: 'Importez le bail, règlement intérieur, etc.',
      color: 'from-owner-500 to-owner-600',
      action: () => {
        onClose();
        router.push('/hub/documents');
      }
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white superellipse-3xl max-w-2xl w-full shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 superellipse-3xl mx-auto mb-4 flex items-center justify-center"
                     style={{ background: 'hsl(var(--resident-500))' }}>
                  <Home className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Félicitations !
                </h1>
                <p className="text-lg text-gray-600">
                  Tu es maintenant le <span className="font-bold text-resident-600">Résident Principal</span> de
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {propertyData.title}
                </p>
              </div>

              <Card className="p-6 mb-6 border-2 border-resident-200 bg-gradient-to-br from-resident-50 to-resident-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 superellipse-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Shield className="w-6 h-6 text-resident-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Vos pouvoirs en tant que Résident Principal :
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Gérer les membres de la résidence</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Modifier les informations de la résidence</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Gérer les documents et finances</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Accès aux codes d'invitation et propriétaire</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Button
                onClick={() => setCurrentStep('codes')}
                className="w-full superellipse-xl text-white shadow-lg hover:shadow-xl transition-all text-lg py-6"
                style={{ background: 'hsl(var(--resident-500))' }}
              >
                Voir mes codes d'accès
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Codes */}
          {currentStep === 'codes' && (
            <motion.div
              key="codes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 superellipse-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-owner-500 to-owner-600">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Vos Codes d'Accès
                </h2>
                <p className="text-gray-600">
                  Gardez ces codes précieusement
                </p>
              </div>

              {/* Invitation Code */}
              <Card className="p-6 mb-4 border-2 border-resident-200 bg-gradient-to-br from-resident-50 to-resident-100">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-resident-600" />
                  <h3 className="font-bold text-gray-900">Code pour les Colocataires</h3>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-white superellipse-lg px-4 py-3 font-mono text-2xl font-bold text-resident-900 text-center">
                    {propertyData.invitation_code}
                  </div>
                  <button
                    onClick={() => copyToClipboard(propertyData.invitation_code, 'invitation')}
                    className="p-3 superellipse-lg text-white transition-all hover:scale-105 bg-gradient-to-r from-resident-500 to-resident-600"
                  >
                    {copiedCode === 'invitation' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-600">
                  Partage ce code avec tes futurs colocataires pour qu'ils puissent rejoindre la résidence
                </p>
              </Card>

              {/* Owner Code */}
              <Card className="p-6 mb-6 border-2 border-owner-200 bg-gradient-to-br from-owner-50 to-owner-100">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-owner-600" />
                  <h3 className="font-bold text-gray-900">Code Propriétaire</h3>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-white superellipse-lg px-4 py-3 font-mono text-xl font-bold text-owner-900 text-center">
                    {propertyData.owner_code}
                  </div>
                  <button
                    onClick={() => copyToClipboard(propertyData.owner_code, 'owner')}
                    className="p-3 superellipse-lg text-white transition-all hover:scale-105 bg-gradient-to-r from-owner-500 to-owner-600"
                  >
                    {copiedCode === 'owner' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-600">
                  <strong>Réservé au propriétaire légal</strong> - Donne ce code au propriétaire pour qu'il puisse revendiquer la résidence
                </p>
              </Card>

              <div className="flex gap-3">
                <Button
                  onClick={() => setCurrentStep('welcome')}
                  variant="outline"
                  className="flex-1 superellipse-xl"
                >
                  Retour
                </Button>
                <Button
                  onClick={() => setCurrentStep('next-steps')}
                  className="flex-1 superellipse-xl text-white shadow-lg"
                  style={{ background: 'hsl(var(--resident-500))' }}
                >
                  Prochaines étapes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Next Steps */}
          {currentStep === 'next-steps' && (
            <motion.div
              key="next-steps"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 superellipse-2xl mx-auto mb-4 flex items-center justify-center"
                     style={{ background: 'hsl(var(--resident-500))' }}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Prochaines Étapes
                </h2>
                <p className="text-gray-600">
                  Complétez votre résidence pour une expérience optimale
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {nextSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Card
                      key={index}
                      onClick={step.action}
                      className="p-4 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-resident-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 superellipse-lg flex items-center justify-center bg-gradient-to-br ${step.color} flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm mb-1">
                            {step.title}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setCurrentStep('codes')}
                  variant="outline"
                  className="flex-1 superellipse-xl"
                >
                  Retour
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 superellipse-xl text-white shadow-lg"
                  style={{ background: 'hsl(var(--resident-500))' }}
                >
                  Commencer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
