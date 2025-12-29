'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed (standalone mode)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    setIsStandalone(isInStandaloneMode);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if user already dismissed the prompt
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // For non-iOS devices, listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after 30 seconds on the site
      setTimeout(() => {
        if (!isInStandaloneMode) {
          setShowPrompt(true);
        }
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS, show after 30 seconds if not standalone
    if (iOS && !isInStandaloneMode) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
  };

  // Don't show if already installed or prompt not available
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom-5">
      <Card className="bg-gradient-to-br from-purple-600 to-yellow-500 text-white shadow-2xl border-none">
        <div className="p-4 relative">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 pr-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">
                Installer Izzico
              </h3>
              <p className="text-sm text-white/90 mb-4">
                {isIOS
                  ? "Ajoute Izzico à ton écran d'accueil pour un accès rapide et une expérience optimale."
                  : "Installe l'application pour un accès rapide et des notifications en temps réel."}
              </p>

              {isIOS ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-xs space-y-2">
                  <p className="font-medium">Pour installer :</p>
                  <ol className="list-decimal list-inside space-y-1 text-white/80">
                    <li>Appuie sur le bouton Partager <span className="inline-block">⎋</span></li>
                    <li>Sélectionne "Sur l'écran d'accueil"</li>
                    <li>Appuie sur "Ajouter"</li>
                  </ol>
                </div>
              ) : (
                <Button
                  onClick={handleInstallClick}
                  className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold gap-2"
                >
                  <Download className="w-4 h-4" />
                  Installer maintenant
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
