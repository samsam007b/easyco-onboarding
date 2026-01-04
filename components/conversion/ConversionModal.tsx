'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Home, Users, Sparkles, ArrowRight } from 'lucide-react';

export type ConversionModalType = 'favorite' | 'application' | 'exitIntent' | 'scroll';

interface ConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ConversionModalType;
  onSignup?: () => void;
}

const modalConfig = {
  favorite: {
    icon: Heart,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    title: 'Sauvegarde tes coups de cœur ❤️',
    description: 'Crée un compte gratuit pour sauvegarder tes propriétés préférées et les retrouver facilement.',
    benefits: [
      'Sauvegarde illimitée de propriétés',
      'Accès à tes favoris sur tous tes appareils',
      'Notifications quand les prix changent',
      'Reçois des alertes pour les propriétés similaires'
    ],
    ctaText: "M'inscrire gratuitement",
    ctaSecondary: 'Continuer sans compte'
  },
  application: {
    icon: Home,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
    title: 'Prêt à postuler ? 🏠',
    description: 'Crée ton compte en 2 minutes pour postuler et augmenter tes chances de trouver la coloc parfaite.',
    benefits: [
      'Postule en un clic avec ton profil',
      'Les propriétaires voient ta compatibilité',
      'Suis tes candidatures en temps réel',
      'Reçois des réponses 3x plus rapidement'
    ],
    ctaText: 'Créer mon profil',
    ctaSecondary: 'Explorer encore'
  },
  exitIntent: {
    icon: Sparkles,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50',
    title: 'Attends ! Ne pars pas sans ton bonus 🎁',
    description: 'Inscris-toi maintenant et reçois des recommandations personnalisées basées sur les propriétés que tu as consultées.',
    benefits: [
      '10 propriétés matchées à ton profil',
      'Alertes en temps réel pour tes critères',
      'Accès prioritaire aux nouveautés',
      'Zéro spam, promis !'
    ],
    ctaText: "J'en profite",
    ctaSecondary: 'Non merci'
  },
  scroll: {
    icon: Users,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    title: 'Tu cherches activement ? 👀',
    description: 'Tu as déjà vu plusieurs propriétés. Crée ton compte pour accéder à toutes nos fonctionnalités !',
    benefits: [
      'Swipe interface comme Tinder',
      'Algorithme de matching intelligent',
      'Chat direct avec les propriétaires',
      'Groupes pré-formés pour chercher ensemble'
    ],
    ctaText: "C'est parti !",
    ctaSecondary: 'Continuer à explorer'
  }
};

export function ConversionModal({ isOpen, onClose, type, onSignup }: ConversionModalProps) {
  const router = useRouter();
  const config = modalConfig[type];
  const Icon = config.icon;

  const handleSignup = () => {
    if (onSignup) {
      onSignup();
    } else {
      router.push('/signup');
    }
    onClose();
  };

  const handleSecondary = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] superellipse-3xl">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className={`p-4 superellipse-2xl ${config.iconBg}`}>
              <Icon className={`w-12 h-12 ${config.iconColor}`} />
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold text-center">
            {config.title}
          </DialogTitle>

          <DialogDescription className="text-center text-base text-gray-600">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-6">
          {config.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-700">{benefit}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-orange-600 hover:to-orange-500 text-white superellipse-2xl h-12 text-base font-semibold shadow-lg shadow-orange-500/30"
          >
            {config.ctaText}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <Button
            onClick={handleSecondary}
            variant="ghost"
            className="w-full superellipse-2xl h-11 text-gray-600 hover:bg-gray-100"
          >
            {config.ctaSecondary}
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          Inscription gratuite • Sans engagement • 100% sécurisé
        </p>
      </DialogContent>
    </Dialog>
  );
}
