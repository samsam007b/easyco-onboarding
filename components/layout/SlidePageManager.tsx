'use client';

import { motion, AnimatePresence } from 'framer-motion';
import ExplorerPage from '@/components/pages/ExplorerPage';
import ResidentsPage from '@/components/pages/ResidentsPage';
import OwnersPage from '@/components/pages/OwnersPage';

interface SlidePageManagerProps {
  activePage: 'explorer' | 'residents' | 'owners' | null;
}

export default function SlidePageManager({ activePage }: SlidePageManagerProps) {
  const pageComponents = {
    explorer: ExplorerPage,
    residents: ResidentsPage,
    owners: OwnersPage,
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
            stiffness: 300,
            damping: 30,
            duration: 0.6,
          }}
          className="fixed top-16 left-0 right-0 bottom-0 z-40 overflow-y-auto"
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
