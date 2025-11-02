'use client';

import { motion, AnimatePresence } from 'framer-motion';
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

  return (
    <AnimatePresence mode="wait">
      {activePage && PageComponent && (
        <motion.div
          key={activePage}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 35,
            duration: 0.5,
          }}
          className="fixed top-16 left-0 right-0 bottom-0 z-40 overflow-y-auto rounded-t-3xl shadow-2xl bg-gradient-to-b from-gray-50 to-white"
          style={{
            scrollbarGutter: 'stable',
            border: '4px solid transparent',
            backgroundClip: 'padding-box',
            position: 'relative',
          }}
        >
          {/* Bordure avec dégradé */}
          <div
            className="absolute inset-0 rounded-t-3xl -z-10"
            style={{
              background: borderGradients[activePage],
              margin: '-4px',
            }}
          />
          <PageComponent />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
