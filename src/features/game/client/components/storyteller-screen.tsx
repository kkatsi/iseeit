import { getCardFanTransform } from '@/lib/card-deal';
import { useGameStore } from '@/stores/game-store';
import { usePeerStore } from '@/stores/peer-store';
import { motion } from 'framer-motion';
import { useState } from 'react';
import useStorytellerClueSubmit from '../hooks/use-storyteller-clue-submit';

const StorytellerScreen = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const connection = usePeerStore((state) => state.connections).get(playerId);
  const cards = useGameStore((state) => state.cards).get(playerId);

  const { error, formAction, isPending } = useStorytellerClueSubmit(connection);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  if (!cards) return null;

  const totalCards = cards.length;

  // Fan lives at the bottom; showcase is the upper area.
  // Cards are always rendered in one place (the fan container) and animated
  // to the showcase position when selected
  const FAN_BOTTOM = -20;
  const SHOWCASE_Y = Math.max(-(0.75 * window.innerHeight - 72), -560);

  return (
    <form
      action={formAction}
      className="w-full h-dvh relative overflow-hidden flex flex-col"
    >
      {/* Clue UI + submit — anchored above the fan */}
      <div className="flex-1 flex flex-col items-center justify-end px-6 pb-12">
        <div className="w-full max-w-xs flex flex-col gap-3">
          <input
            type="text"
            name="clue"
            placeholder="Whisper your clue..."
            maxLength={200}
            className="w-full px-3 py-2 font-serif text-lg text-center bg-transparent outline-none"
            style={{
              color: 'rgba(92, 74, 61, 1)',
              borderBottom: '2px solid rgba(212, 162, 106, 0.6)',
            }}
          />
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 rounded-lg font-serif text-lg transition-opacity disabled:opacity-40"
            style={{
              backgroundColor: 'rgba(212, 162, 106, 0.3)',
              color: 'rgba(92, 74, 61, 1)',
              border: '1px solid rgba(212, 162, 106, 0.5)',
            }}
          >
            {isPending ? 'Sending...' : 'Tell the tale'}
          </button>
          {error && (
            <p
              className="text-center text-sm"
              style={{ color: 'rgba(180, 60, 60, 0.8)' }}
            >
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Card fan at bottom — radio buttons as labels with card images */}
      <div
        className="relative w-full"
        style={{ height: '160px' }}
      >
        {cards.map((card, index) => {
          const fan = getCardFanTransform(index, totalCards);

          const isSelected = selectedCard === card;

          return (
            <motion.label
              key={card}
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
                  ? { x: 0, y: SHOWCASE_Y, rotate: 0, scale: 2 }
                  : { x: fan.x, y: FAN_BOTTOM, rotate: fan.rotate, scale: 1 }
              }
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            >
              <input
                type="radio"
                name="card"
                value={card}
                checked={isSelected}
                onChange={() => setSelectedCard(card)}
                className="sr-only"
              />
              <img
                src={card}
                alt="Card"
                className="w-full h-full object-cover rounded-lg pointer-events-none"
              />
            </motion.label>
          );
        })}
      </div>
    </form>
  );
};

export default StorytellerScreen;
