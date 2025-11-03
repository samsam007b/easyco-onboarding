'use client';

import { useComparison } from '@/contexts/ComparisonContext';
import { Button } from '@/components/ui/button';
import { X, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComparisonBar() {
  const { selectedPropertyIds, clearComparison, goToComparison } = useComparison();

  if (selectedPropertyIds.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-white rounded-full shadow-2xl border-2 border-yellow-500 px-6 py-4 flex items-center gap-4">
          {/* Icon */}
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>

          {/* Text */}
          <div>
            <p className="font-bold text-gray-900">
              {selectedPropertyIds.length} propriété{selectedPropertyIds.length > 1 ? 's' : ''}{' '}
              sélectionnée{selectedPropertyIds.length > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-gray-600">
              {selectedPropertyIds.length < 2
                ? 'Sélectionne au moins 2 propriétés'
                : 'Prêt à comparer !'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={goToComparison}
              disabled={selectedPropertyIds.length < 2}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              <Scale className="w-4 h-4 mr-2" />
              Comparer
            </Button>

            <Button variant="ghost" size="icon" onClick={clearComparison}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
