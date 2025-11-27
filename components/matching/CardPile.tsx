'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, RotateCcw } from 'lucide-react';
import { UserProfile } from '@/lib/services/user-matching-service';
import Image from 'next/image';

interface CardPileProps {
  type: 'like' | 'pass';
  cards: Array<UserProfile & { compatibility_score?: number }>;
  onUndo?: () => void;
  maxVisible?: number;
}

export const CardPile = memo(function CardPile({
  type,
  cards,
  onUndo,
  maxVisible = 5
}: CardPileProps) {
  const isLike = type === 'like';
  const visibleCards = cards.slice(-maxVisible).reverse();

  return (
    <div
      className={`relative h-full flex flex-col items-center justify-center ${
        isLike ? 'items-end pr-4' : 'items-start pl-4'
      }`}
    >
      {/* Pile header */}
      <div className={`mb-4 flex items-center gap-2 ${isLike ? 'flex-row-reverse' : ''}`}>
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center
          ${isLike ? 'bg-green-100' : 'bg-red-100'}
        `}>
          {isLike ? (
            <Heart className="w-5 h-5 text-green-600 fill-green-600" />
          ) : (
            <X className="w-5 h-5 text-red-600" strokeWidth={3} />
          )}
        </div>
        <div className={`text-center ${isLike ? 'text-right' : 'text-left'}`}>
          <p className={`text-sm font-bold ${isLike ? 'text-green-700' : 'text-red-700'}`}>
            {isLike ? 'LIKE' : 'NOPE'}
          </p>
          <p className="text-xs text-gray-500">{cards.length} profil{cards.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Card stack */}
      <div
        className={`
          relative w-[140px] h-[200px]
          ${isLike ? 'translate-x-8' : '-translate-x-8'}
        `}
      >
        <AnimatePresence mode="popLayout">
          {visibleCards.length === 0 ? (
            // Empty pile placeholder
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`
                absolute inset-0 rounded-xl border-2 border-dashed
                flex items-center justify-center
                ${isLike ? 'border-green-300 bg-green-50/50' : 'border-red-300 bg-red-50/50'}
              `}
            >
              <p className={`text-xs ${isLike ? 'text-green-400' : 'text-red-400'}`}>
                Vide
              </p>
            </motion.div>
          ) : (
            visibleCards.map((card, index) => {
              const offset = index * 4;
              const rotation = isLike
                ? 3 + index * 1.5
                : -3 - index * 1.5;

              return (
                <motion.div
                  key={card.user_id}
                  initial={{
                    x: isLike ? 300 : -300,
                    y: -100,
                    rotate: isLike ? 45 : -45,
                    opacity: 0,
                    scale: 0.5
                  }}
                  animate={{
                    x: offset,
                    y: offset,
                    rotate: rotation,
                    opacity: 1,
                    scale: 1
                  }}
                  exit={{
                    x: isLike ? 100 : -100,
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.2 }
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    delay: index * 0.02
                  }}
                  className={`
                    absolute inset-0 rounded-xl overflow-hidden shadow-lg
                    border-2 ${isLike ? 'border-green-400' : 'border-red-400'}
                    cursor-pointer hover:scale-105 transition-transform
                  `}
                  style={{
                    zIndex: maxVisible - index,
                  }}
                >
                  {/* Mini card content */}
                  <div className="relative w-full h-full">
                    {card.profile_photo_url ? (
                      <Image
                        src={card.profile_photo_url}
                        alt={`${card.first_name}`}
                        fill
                        sizes="140px"
                        className="object-cover"
                      />
                    ) : (
                      <div className={`
                        w-full h-full flex items-center justify-center
                        ${isLike
                          ? 'bg-gradient-to-br from-green-100 to-green-200'
                          : 'bg-gradient-to-br from-red-100 to-red-200'
                        }
                      `}>
                        <span className={`text-2xl font-bold ${isLike ? 'text-green-600' : 'text-red-600'}`}>
                          {card.first_name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Overlay with name */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs font-semibold truncate">
                        {card.first_name}
                      </p>
                      {card.compatibility_score && (
                        <p className={`text-xs ${isLike ? 'text-green-300' : 'text-red-300'}`}>
                          {card.compatibility_score}%
                        </p>
                      )}
                    </div>

                    {/* Type indicator overlay */}
                    <div className={`
                      absolute top-2 ${isLike ? 'right-2' : 'left-2'}
                      w-6 h-6 rounded-full flex items-center justify-center
                      ${isLike ? 'bg-green-500' : 'bg-red-500'}
                    `}>
                      {isLike ? (
                        <Heart className="w-3 h-3 text-white fill-white" />
                      ) : (
                        <X className="w-3 h-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Undo button - only show if there are cards and onUndo is provided */}
      {cards.length > 0 && onUndo && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onUndo}
          className={`
            mt-4 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium
            transition-colors
            ${isLike
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
            }
          `}
        >
          <RotateCcw className="w-3 h-3" />
          Annuler
        </motion.button>
      )}
    </div>
  );
});
