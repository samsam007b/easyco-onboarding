'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, RotateCcw } from 'lucide-react';
import { UserProfile } from '@/lib/services/user-matching-service';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/use-language';

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
  const { getSection } = useLanguage();
  const matching = getSection('matching');
  const isLike = type === 'like';
  const visibleCards = cards.slice(-maxVisible).reverse();

  return (
    <div
      className={`flex flex-col items-center w-[160px] ${
        isLike ? 'items-start' : 'items-end'
      }`}
    >
      {/* Pile header */}
      <div className={`mb-3 flex items-center gap-2 ${isLike ? '' : 'flex-row-reverse'}`}>
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center
          ${isLike ? 'bg-green-100' : 'bg-red-100'}
        `}>
          {isLike ? (
            <Heart className="w-4 h-4 text-green-600 fill-green-600" />
          ) : (
            <X className="w-4 h-4 text-red-600" strokeWidth={3} />
          )}
        </div>
        <div className={isLike ? 'text-left' : 'text-right'}>
          <p className={`text-xs font-bold ${isLike ? 'text-green-700' : 'text-red-700'}`}>
            {isLike ? (matching.cardPile?.like || 'LIKE') : (matching.cardPile?.nope || 'NOPE')}
          </p>
          <p className="text-[10px] text-gray-500">
            {cards.length} {cards.length > 1
              ? (matching.cardPile?.profiles || 'profils')
              : (matching.cardPile?.profile || 'profil')}
          </p>
        </div>
      </div>

      {/* Card stack */}
      <div
        className={`
          relative w-[100px] h-[140px]
        `}
      >
        <AnimatePresence mode="popLayout">
          {visibleCards.length === 0 ? (
            // Empty pile placeholder
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`
                absolute inset-0 superellipse-xl border-2 border-dashed
                flex items-center justify-center
                ${isLike ? 'border-green-300 bg-green-50/50' : 'border-red-300 bg-red-50/50'}
              `}
            >
              <p className={`text-xs ${isLike ? 'text-green-400' : 'text-red-400'}`}>
                {matching.cardPile?.empty || 'Vide'}
              </p>
            </motion.div>
          ) : (
            visibleCards.map((card, index) => {
              const offsetX = index * 3;
              const offsetY = index * 3;
              const rotation = isLike
                ? 2 + index * 1
                : -2 - index * 1;

              return (
                <motion.div
                  key={card.user_id}
                  initial={{
                    x: isLike ? 200 : -200,
                    y: -50,
                    rotate: isLike ? 30 : -30,
                    opacity: 0,
                    scale: 0.6
                  }}
                  animate={{
                    x: offsetX,
                    y: offsetY,
                    rotate: rotation,
                    opacity: 1 - index * 0.15,
                    scale: 1 - index * 0.05
                  }}
                  exit={{
                    x: isLike ? 50 : -50,
                    opacity: 0,
                    scale: 0.7,
                    transition: { duration: 0.15 }
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                    delay: index * 0.01
                  }}
                  className={`
                    absolute inset-0 superellipse-lg overflow-hidden shadow-md
                    border-2 ${isLike ? 'border-green-400' : 'border-red-400'}
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
                        sizes="100px"
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
                        <span className={`text-xl font-bold ${isLike ? 'text-green-600' : 'text-red-600'}`}>
                          {card.first_name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Overlay with name */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                      <p className="text-white text-[10px] font-semibold truncate">
                        {card.first_name}
                      </p>
                      {card.compatibility_score && (
                        <p className={`text-[9px] ${isLike ? 'text-green-300' : 'text-red-300'}`}>
                          {card.compatibility_score}%
                        </p>
                      )}
                    </div>

                    {/* Small type indicator */}
                    <div className={`
                      absolute top-1 ${isLike ? 'right-1' : 'left-1'}
                      w-4 h-4 rounded-full flex items-center justify-center
                      ${isLike ? 'bg-green-500' : 'bg-red-500'}
                    `}>
                      {isLike ? (
                        <Heart className="w-2 h-2 text-white fill-white" />
                      ) : (
                        <X className="w-2 h-2 text-white" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Undo button - compact */}
      {cards.length > 0 && onUndo && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUndo}
          className={`
            mt-2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium
            transition-colors
            ${isLike
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
            }
          `}
        >
          <RotateCcw className="w-2.5 h-2.5" />
          {matching.cardPile?.undo || 'Annuler'}
        </motion.button>
      )}
    </div>
  );
});
