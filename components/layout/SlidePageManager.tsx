'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import ExplorerPage from '@/components/pages/ExplorerPage';
import ResidentsPage from '@/components/pages/ResidentsPage';
import OwnersPage from '@/components/pages/OwnersPage';
import { cn } from '@/lib/utils';

interface SlidePageManagerProps {
  activePage: 'explorer' | 'residents' | 'owners' | null;
}

export default function SlidePageManager({ activePage }: SlidePageManagerProps) {
  const pageComponents = {
    explorer: ExplorerPage,
    residents: ResidentsPage,
    owners: OwnersPage,
  };

  // Dégradés extraits du logo original pour chaque rôle
  const borderGradients = {
    explorer: 'linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)',
    residents: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)',
    owners: 'linear-gradient(135deg, #7B5FB8 0%, #A67BB8 50%, #C98B9E 100%)',
  };

  const PageComponent = activePage ? pageComponents[activePage] : null;

  // Block body scroll when page is active
  useEffect(() => {
    if (activePage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activePage]);

  return (
    <AnimatePresence mode="wait">
      {activePage && PageComponent && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Slide page content */}
          <motion.div
            key={activePage}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              duration: 0.4,
              ease: [0.32, 0.72, 0, 1], // Custom easing for smooth premium feel
            }}
            className="fixed top-16 left-0 right-0 bottom-0 z-50 overflow-y-auto"
          >
            <div className="min-h-full bg-gradient-to-b from-gray-50 to-white rounded-t-3xl shadow-2xl relative"
              style={{
                border: '4px solid transparent',
                backgroundClip: 'padding-box',
              }}
            >
              {/* Bordure avec dégradé */}
              <div
                className="absolute inset-0 rounded-t-3xl -z-10 pointer-events-none"
                style={{
                  background: borderGradients[activePage],
                  margin: '-4px',
                }}
              />
              <PageComponent />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
