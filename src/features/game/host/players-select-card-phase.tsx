import { useGameStore } from '@/stores/game-store';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { ClueBanner } from './components/clue-banner';
import { PlayerSlots } from './components/player-slots';
import { ShufflingCardStack } from './components/shuffling-card-stack';
import { usePlayersSelectCardSequence } from './hooks/use-players-select-card-sequence';
import { ProgressText } from './components/progress-text';

type Props = {
  onComplete: () => void;
};

const PlayersSelectCardPhase = ({ onComplete }: Props) => {
  const { clue, storytellerId, submittedCards, tableCards } = useGameStore(
    (state) => state.round,
  );
  const playersData = useGameStore((state) => state.playersData);

  const totalCards = tableCards?.length ?? 0;

  const players = useMemo(
    () =>
      [...playersData.entries()]
        .map(([id, data]) => ({
          id,
          name: data.name,
          avatarId: data.avatarId,
          isStoryteller: id === storytellerId,
          hasSubmitted:
            id === storytellerId || (submittedCards?.has(id) ?? false),
        }))
        .sort((a, b) =>
          a.isStoryteller === b.isStoryteller ? 0 : a.isStoryteller ? -1 : 1,
        ),
    [playersData, submittedCards, storytellerId],
  );

  const {
    localPhase,
    collectedSet,
    revealedCount,
    progressText,
    showPlayerGrid,
    showCardGrid,
    showStack,
  } = usePlayersSelectCardSequence(
    players,
    submittedCards,
    onComplete,
    tableCards,
  );

  return (
    <div
      className="w-full bg-center relative bg-cover flex flex-col items-center justify-center gap-8 px-6"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/ui/players-select-card-bg.png')",
      }}
    >
      <ClueBanner clue={clue} />

      <ProgressText key={localPhase}>{progressText}</ProgressText>

      {showPlayerGrid && (
        <PlayerSlots>
          {players.map((player) => {
            const isCollected = collectedSet.has(player.id);
            const showCard = player.hasSubmitted && !isCollected;

            return (
              <PlayerSlots.Slot key={player.id}>
                <PlayerSlots.Label>
                  {player.isStoryteller ? 'Storyteller' : null}
                </PlayerSlots.Label>
                <PlayerSlots.Card variant={showCard ? 'filled' : 'empty'}>
                  <AnimatePresence>
                    {showCard ? (
                      <PlayerSlots.CardBack
                        id={player.id}
                        skipEntrance={
                          player.isStoryteller ||
                          localPhase === 'all-submitted' ||
                          localPhase === 'collecting'
                        }
                      />
                    ) : (
                      !player.hasSubmitted && <PlayerSlots.CardEmpty />
                    )}
                  </AnimatePresence>
                </PlayerSlots.Card>
                {player.avatarId && (
                  <PlayerSlots.Avatar
                    src={`/avatars/${player.avatarId}.png`}
                    alt={player.name}
                    name={player.name}
                    isStoryteller={player.isStoryteller}
                  />
                )}
              </PlayerSlots.Slot>
            );
          })}
        </PlayerSlots>
      )}

      {showCardGrid && tableCards && (
        <PlayerSlots>
          {tableCards.map((cardUrl, index) => {
            const isRevealed = index < revealedCount;
            return (
              <PlayerSlots.Slot key={cardUrl}>
                <PlayerSlots.Label>{null}</PlayerSlots.Label>
                <PlayerSlots.Card variant={isRevealed ? 'filled' : 'empty'}>
                  {isRevealed ? (
                    <PlayerSlots.CardFace
                      src={cardUrl}
                      alt={`Card ${index + 1}`}
                    />
                  ) : (
                    <PlayerSlots.CardEmpty />
                  )}
                </PlayerSlots.Card>
              </PlayerSlots.Slot>
            );
          })}
        </PlayerSlots>
      )}

      {/* Dim overlay — covers grid behind stack */}
      <AnimatePresence>
        {showStack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              zIndex: 10,
            }}
          />
        )}
      </AnimatePresence>

      {/* Stack — overlaid on grid */}
      <AnimatePresence>
        {showStack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: '5%',
              right: '5%',
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            <ShufflingCardStack
              isSuffling={localPhase === 'shuffling'}
              totalCards={
                localPhase === 'collecting' || localPhase === 'revealing'
                  ? collectedSet.size
                  : totalCards
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayersSelectCardPhase;
