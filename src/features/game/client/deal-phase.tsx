import { CLIENT_CARD_DURATION, DECK_INTRO_DELAY } from '@/config/constants';
import { getCardFanTransform } from '@/lib/card-deal';
import { useGameStore } from '@/stores/game-store';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

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
    <div className="w-full h-dvh bg-center bg-cover relative overflow-hidden">
      {cards.map((card, index) => {
        const fan = getCardFanTransform(index, totalCards);
        const isNew = newCardsSet.has(card);

        return (
          <motion.div
            key={card}
            className="absolute h-40 rounded-lg overflow-hidden shadow-xl aspect-2/3"
            style={{
              left: '50%',
              top: 0,
              marginLeft: -48,
              zIndex: totalCards - (totalCards - index),
            }}
            initial={
              isNew
                ? {
                    y: '-150%',
                    x: 0,
                    scale: 1,
                    rotate: 0,
                    opacity: 0,
                  }
                : {
                    y: '80dvh',
                    x: fan.x,
                    scale: 1,
                    rotate: fan.rotate,
                    opacity: 1,
                  }
            }
            animate={{
              y: isNew
                ? [
                    '-150%', // off-screen top
                    '30dvh', // showcase position
                    '30dvh', // hold
                    '80dvh', // fan resting position
                  ]
                : '80dvh',
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
  );
};

export default DealPhase;