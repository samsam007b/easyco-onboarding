'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, History, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyTimeline } from './PropertyTimeline';
import { ownerGradient } from '@/lib/constants/owner-theme';

export interface PropertyTimelineModalProps {
  open: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    address?: string;
  } | null;
}

export function PropertyTimelineModal({
  open,
  onClose,
  property,
}: PropertyTimelineModalProps) {
  if (!property) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative overflow-hidden bg-white superellipse-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
          >
            {/* Decorative top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: ownerGradient }}
            />

            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="relative w-14 h-14"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full opacity-30"
                      style={{ background: ownerGradient, filter: 'blur(12px)' }}
                      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                    <div
                      className="relative w-full h-full rounded-full flex items-center justify-center shadow-lg"
                      style={{ background: ownerGradient }}
                    >
                      <History className="w-7 h-7 text-white" />
                    </div>
                  </motion.div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Historique
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <Home className="w-4 h-4" />
                      {property.title}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Timeline Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <PropertyTimeline
                propertyId={property.id}
                maxEvents={100}
                showFilters={true}
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="superellipse-xl"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default PropertyTimelineModal;
