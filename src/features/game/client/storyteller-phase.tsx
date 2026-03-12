import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getCardFanTransform } from '@/lib/card-deal';
import { useGameStore } from '@/stores/game-store';
import { usePeerStore } from '@/stores/peer-store';
import type { StoryTellerClueEvent } from '@/schemas/events';

const StorytellerPhase = () => {
  // const playerId = useGameStore((state) => state.connectedPlayerId);
  // const storytellerId = useGameStore((state) => state.round.storytellerId);

  // if (playerId === storytellerId) return <StorytellerScreen />;

  return <StorytellerScreen />;

  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <p
        className="font-sans text-xl"
        style={{ color: 'rgba(92, 74, 61, 0.8)' }}
      >
        Waiting for storyteller's clue...
      </p>
    </div>
  );
};

export default StorytellerPhase;

const StorytellerScreen = () => {
  // const playerId = useGameStore((state) => state.connectedPlayerId);
  // const connection = usePeerStore((state) => state.connections).get(playerId);
  // const cards = useGameStore((state) => state.cards).get(playerId);

  const cards = [
    '/cards/card-1.png',
    '/cards/card-2.png',
    '/cards/card-3.png',
    '/cards/card-4.png',
    '/cards/card-5.png',
    '/cards/card-6.png',
  ];

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [clue, setClue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!cards) return null;

  const totalCards = cards.length;
  const focusedCard = focusedIndex !== null ? cards[focusedIndex] : null;

  const handleSubmit = () => {
    if (!focusedCard || !clue.trim()) return;

    // connection?.send({
    //   type: 'STORYTELLER_CLUE',
    //   card: focusedCard,
    //   clue: clue.trim(),
    // } satisfies StoryTellerClueEvent);

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-sans text-xl"
          style={{ color: 'rgba(92, 74, 61, 0.8)' }}
        >
          Waiting for others...
        </motion.p>
      </div>
    );
  }

  // Fan lives at the bottom; showcase is the upper area.
  // Cards are always rendered in one place (the fan container) and animated
  // to the showcase position when selected — no layoutId, no dual-element conflicts.
  const FAN_BOTTOM = 0; // bottom of container
  const SHOWCASE_Y = Math.max(-(0.75 * window.innerHeight - 72), -560);

  return (
    <div className="w-full h-dvh relative overflow-hidden flex flex-col">
      {/* Clue UI (sits in the middle zone, below the showcased card) */}
      <div className={`flex-1 flex flex-col items-center px-6 ${focusedCard ? 'justify-end pb-8' : 'justify-center'}`}>
        <AnimatePresence>
          {focusedCard ? (
            <motion.div
              key="clue-ui"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full max-w-xs flex flex-col gap-3"
            >
              <input
                type="text"
                value={clue}
                onChange={(e) => setClue(e.target.value)}
                placeholder="Whisper your clue..."
                maxLength={200}
                className="w-full px-3 py-2 font-serif text-lg text-center bg-transparent outline-none"
                style={{
                  color: 'rgba(92, 74, 61, 1)',
                  borderBottom: '2px solid rgba(212, 162, 106, 0.6)',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!clue.trim()}
                className="px-6 py-2 rounded-lg font-serif text-lg transition-opacity disabled:opacity-40"
                style={{
                  backgroundColor: 'rgba(212, 162, 106, 0.3)',
                  color: 'rgba(92, 74, 61, 1)',
                  border: '1px solid rgba(212, 162, 106, 0.5)',
                }}
              >
                Tell the tale
              </motion.button>
            </motion.div>
          ) : (
            <motion.p
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-serif text-lg text-center"
              style={{ color: 'rgba(92, 74, 61, 0.6)' }}
            >
              Choose a card to tell your story...
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Card fan at bottom — selected card animates up to showcase */}
      <div
        className="relative w-full"
        style={{ height: '160px' }}
      >
        {cards.map((card, index) => {
          const isSelected = index === focusedIndex;
          const fan = getCardFanTransform(index, totalCards);

          return (
            <motion.div
              key={card}
              onClick={() => setFocusedIndex(isSelected ? null : index)}
              className="absolute rounded-lg overflow-hidden shadow-xl cursor-pointer"
              style={{
                left: '50%',
                bottom: 0,
                width: 96,
                height: 144,
                marginLeft: -48,
                zIndex: isSelected ? totalCards + 1 : index,
              }}
              animate={
                isSelected
                  ? {
                      x: 0,
                      y: SHOWCASE_Y,
                      rotate: 0,
                      scale: 2,
                    }
                  : {
                      x: fan.x,
                      y: FAN_BOTTOM,
                      rotate: fan.rotate,
                      scale: 1,
                    }
              }
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            >
              <img
                src={card}
                alt="Card"
                className="w-full h-full object-cover pointer-events-none"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
