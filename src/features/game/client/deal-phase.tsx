import { CLIENT_CARD_DURATION, DECK_INTRO_DELAY } from '@/config/constants';
import { getCardFanTransform } from '@/lib/card-deal';
import { useGameStore } from '@/stores/game-store';
import { motion } from 'framer-motion';

const DealPhase = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const cards = useGameStore((state) => state.cards).get(playerId);
  if (!cards) return 'waiting for cards...';

  const totalCards = cards.length;

  return (
    <div className="w-full h-dvh bg-center bg-cover relative overflow-hidden">
      {cards.map((card, index) => {
        const fan = getCardFanTransform(index, totalCards);

        return (
          <motion.div
            key={card}
            className="absolute w-24 h-36 rounded-lg overflow-hidden shadow-xl"
            style={{
              left: '50%',
              top: 0,
              marginLeft: -48,
              zIndex: totalCards - (totalCards - index),
            }}
            initial={{
              y: '-150%',
              x: 0,
              scale: 1,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              y: [
                '-150%', // off-screen top
                '30dvh', // showcase position
                '30dvh', // hold
                '80dvh', // fan resting position
              ],
              x: [0, 0, 0, fan.x],
              scale: [1, 2, 2, 1],
              rotate: [0, 0, 0, fan.rotate],
              opacity: [0, 1, 1, 1],
            }}
            transition={{
              duration: CLIENT_CARD_DURATION,
              // 0→0.5: enter (1s), 0.5→0.8: showcase (0.6s), 0.8→1: fan (0.4s)
              times: [0, 0.5, 0.8, 1],
              delay: DECK_INTRO_DELAY + index * CLIENT_CARD_DURATION,
              ease: 'easeInOut',
            }}
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
