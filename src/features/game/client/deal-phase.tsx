import { CLIENT_CARD_DURATION, DECK_INTRO_DELAY } from '@/config/constants';
import { getCardFanTransform } from '@/lib/card-deal';
import { useGameStore } from '@/stores/game-store';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const FAN_BOTTOM = -20;

const DealPhase = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const cards = useGameStore((state) => state.cards).get(playerId);
  const newCards = useGameStore((state) => state.newCards);

  const newCardsSet = useMemo(
    () => new Set(newCards ?? cards ?? []),
    [newCards, cards],
  );

  if (!cards) return 'waiting for cards...';

  const totalCards = cards.length;

  return (
    <div className="w-full h-dvh bg-center bg-cover relative overflow-hidden flex flex-col">
      <div className="flex-1" />

      {/* Fan container — same as general-card-select-screen */}
      <div
        className="relative w-full"
        style={{ height: '160px' }}
      >
        {cards.map((card, index) => {
          const fan = getCardFanTransform(index, totalCards);
          const isNew = newCardsSet.has(card);

          return (
            <motion.div
              key={card}
              className="absolute h-40 rounded-lg overflow-hidden shadow-xl aspect-2/3"
              style={{
                left: '50%',
                bottom: 0,
                marginLeft: -48,
                zIndex: totalCards - (totalCards - index),
              }}
              initial={
                isNew
                  ? {
                      y: -(window.innerHeight + 160),
                      x: 0,
                      scale: 1,
                      rotate: 0,
                      opacity: 0,
                    }
                  : {
                      y: FAN_BOTTOM,
                      x: fan.x,
                      scale: 1,
                      rotate: fan.rotate,
                      opacity: 1,
                    }
              }
              animate={{
                y: isNew
                  ? [
                      -(window.innerHeight + 160), // off-screen top
                      -(window.innerHeight * 0.5), // showcase position
                      -(window.innerHeight * 0.5), // hold
                      FAN_BOTTOM,                   // fan resting position
                    ]
                  : FAN_BOTTOM,
                x: isNew ? [0, 0, 0, fan.x] : fan.x,
                scale: isNew ? [1, 2, 2, 1] : 1,
                rotate: isNew ? [0, 0, 0, fan.rotate] : fan.rotate,
                opacity: isNew ? [0, 1, 1, 1] : 1,
              }}
              transition={
                isNew
                  ? {
                      duration: CLIENT_CARD_DURATION,
                      times: [0, 0.5, 0.8, 1],
                      delay: DECK_INTRO_DELAY + (index - (totalCards - newCardsSet.size)) * CLIENT_CARD_DURATION,
                      ease: 'easeInOut',
                    }
                  : { duration: 0 }
              }
            >
              <img
                src={card}
                alt="Card"
                className="w-full h-full object-cover"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DealPhase;
