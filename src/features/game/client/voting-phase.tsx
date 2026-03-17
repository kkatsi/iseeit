import { WaitingScreen } from '@/components/waiting-screen';
import { useGameStore } from '@/stores/game-store';
import { usePeerStore } from '@/stores/peer-store';
import { useMemo, useState } from 'react';
import VoteCardGrid from './components/vote-card-grid';
import useVoteSubmit from './hooks/use-vote-submit';
import { ClueBanner } from './components/clue-banner';

const VotingPhase = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const storytellerId = useGameStore((state) => state.round.storytellerId);

  if (playerId === storytellerId)
    return <WaitingScreen>Waiting for players to vote...</WaitingScreen>;

  return <VotingScreen />;
};

const VotingScreen = () => {
  const { clue, tableCards, ownSubmittedCard } = useGameStore(
    (state) => state.round,
  );

  const playerId = useGameStore((state) => state.connectedPlayerId);
  const connection = usePeerStore((state) => state.connections).get(playerId);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { error, formAction, isPending } = useVoteSubmit(
    playerId,
    () => setSubmitted(true),
    connection,
  );

  const voteableCards = useMemo(
    () => tableCards?.filter((c) => c !== ownSubmittedCard) ?? [],
    [tableCards, ownSubmittedCard],
  );

  if (submitted)
    return <WaitingScreen>Waiting for others to vote...</WaitingScreen>;

  return (
    <form
      action={formAction}
      className="w-full h-dvh flex flex-col"
    >
      {/* Clue banner */}
      <ClueBanner clue={clue} />
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <VoteCardGrid
          cards={voteableCards}
          selectedCard={selectedCard}
          onSelect={setSelectedCard}
        />
      </div>

      {/* Submit button */}
      <div className="shrink-0 px-6 pb-8 pt-4">
        <button
          type="submit"
          disabled={isPending || !selectedCard}
          className="w-full px-6 py-3 rounded-lg font-serif text-lg bg-accent/20 text-foreground border border-accent/40 transition-opacity disabled:opacity-40"
        >
          {isPending ? 'Sending...' : 'Cast Your Vote'}
        </button>
        {error && (
          <p className="text-center text-sm text-destructive mt-2">{error}</p>
        )}
      </div>
    </form>
  );
};

export default VotingPhase;
