'use client';

import { motion } from 'framer-motion';
import { X, Heart, Star, RotateCcw } from 'lucide-react';

interface SwipeActionsProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

export default function SwipeActions({
  onPass,
  onLike,
  onSuperLike,
  onUndo,
  canUndo = false,
}: SwipeActionsProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      {/* Undo Button */}
      {canUndo && onUndo && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUndo}
          className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shadow-lg transition"
          aria-label="Annuler"
        >
          <RotateCcw className="w-6 h-6 text-gray-600" />
        </motion.button>
      )}

      {/* Pass Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPass}
        className="w-16 h-16 rounded-full bg-white border-4 border-red-500 hover:bg-red-50 flex items-center justify-center shadow-xl transition"
        aria-label="Passer"
      >
        <X className="w-8 h-8 text-red-500" />
      </motion.button>

      {/* Super Like Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
        whileTap={{ scale: 0.95 }}
        onClick={onSuperLike}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center justify-center shadow-xl transition"
        aria-label="Super Like"
      >
        <Star className="w-7 h-7 text-white fill-white" />
      </motion.button>

      {/* Like Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLike}
        className="w-16 h-16 rounded-full bg-white border-4 border-green-500 hover:bg-green-50 flex items-center justify-center shadow-xl transition"
        aria-label="Like"
      >
        <Heart className="w-8 h-8 text-green-500 fill-green-500" />
      </motion.button>
    </div>
  );
}
