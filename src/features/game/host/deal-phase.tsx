import {
  CARD_DEAL_DURATION,
  CARD_DEAL_STAGGER,
  DEAL_PHASE_BUFFER_MS,
  DECK_INTRO_DELAY,
} from '@/config/constants';
import { useGameStore } from '@/stores/game-store';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDealSequence } from './hooks/use-deal-sequence';

type DealPhaseProps = {
  onComplete: () => void;
};

const DealPhase = ({ onComplete }: DealPhaseProps) => {
  const players = useGameStore((state) => state.playersData);
  const roundNumber = useGameStore((state) => state.round.number);

  const [dealFinished, setDealFinished] = useState(false);

  const { dealDurationMs, dealSequence } = useDealSequence(
    players,
    roundNumber,
  );

  useEffect(() => {
    const dealTimer = setTimeout(() => setDealFinished(true), dealDurationMs);
    const transitionTimer = setTimeout(
      onComplete,
      dealDurationMs + DEAL_PHASE_BUFFER_MS,
    );

    return () => {
      clearTimeout(dealTimer);
      clearTimeout(transitionTimer);
    };
  }, [dealDurationMs, onComplete]);

  return (
    <div
      className="w-full min-h-dvh bg-center bg-cover flex flex-col items-center justify-center relative overflow-hidden gap-8"
      style={{
        backgroundImage: "url('/ui/deal-phase-bg.png')",
      }}
    >
      {/* Deck */}
      <motion.div
        initial={{ scale: 0, rotate: 720 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        <div className="w-32 h-48 sm:w-48 sm:h-72 relative">
          {/* Stacked cards below to simulate a deck */}
          {[4, 3, 2, 1].map((offset) => (
            <div
              key={offset}
              className="absolute inset-0 rounded-xl overflow-hidden shadow-xl"
              style={{
                border: '1px solid rgba(0, 0, 0, 0.2)',
                transform: `translateX(${-offset * 3}px) translateY(${offset * 3}px)`,
                zIndex: -offset,
              }}
            >
              <img
                src="/cards/card-back.png"
                alt=""
                className="w-full h-full object-cover brightness-[0.80]"
              />
            </div>
          ))}

          {/* Top stationary card of the deck */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
          >
            <img
              src="/cards/card-back.png"
              alt="Deck"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Glow effect */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-xl blur-xl"
          style={{ backgroundColor: 'rgba(212, 162, 106, 0.2)' }}
        />

        {/* Flying cards — one element per deal action, staggered sequentially */}
        {dealSequence.map(({ id, playerIndex, dealIndex }) => {
          const angle = (playerIndex / players.size) * Math.PI * 2;
          const targetX = Math.cos(angle) * 300;
          const targetY = Math.sin(angle) * 300;

          return (
            <motion.div
              key={`${id}-${dealIndex}`}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: [0, targetX],
                y: [0, targetY],
                scale: [1, 0.5],
                opacity: [1, 1, 0],
              }}
              transition={{
                delay: DECK_INTRO_DELAY + dealIndex * CARD_DEAL_STAGGER,
                duration: CARD_DEAL_DURATION,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={'absolute inset-0 rounded-lg overflow-hidden'}
            >
              <img
                src="/cards/card-back.png"
                alt="Card"
                className="w-full h-full object-cover"
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Text */}
      <motion.p
        key={dealFinished ? 'story' : 'dealing'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="font-sans text-2xl text-[#5c4a3d]"
      >
        {dealFinished ? 'The story begins...' : 'Dealing cards...'}
      </motion.p>
    </div>
  );
};

export default DealPhase;
