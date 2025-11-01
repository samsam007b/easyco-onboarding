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

  // Bordure colorée selon le rôle
  const borderColors = {
    explorer: 'border-yellow-500',
    residents: 'border-purple-600',
    owners: 'border-purple-600',
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
          className={cn(
            "fixed top-16 left-0 right-0 bottom-0 z-40 overflow-y-auto",
            "border-4 rounded-t-3xl shadow-2xl",
            "bg-gradient-to-b from-gray-50 to-white",
            borderColors[activePage]
          )}
          style={{
            scrollbarGutter: 'stable',
          }}
        >
          <PageComponent />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
